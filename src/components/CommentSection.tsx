import {useMemo, useState} from 'react';
import {Button, Form, Modal, Nav} from 'react-bootstrap';
import {useNavigate} from 'react-router-dom';
import {BsHandThumbsUp} from 'react-icons/bs';
import {useAppDispatch, useAppSelector} from '../store/hooks';
import {addComment, addReply, toggleLike} from '../store/commentsSlice';
import {formatCommentTime} from '../data/utils/dateHelpers';

type CommentTab = 'new' | 'top';

interface CommentSectionProps {
    articleId: string;
}

// Tính điểm để sort "Quan tâm nhất" (like + reply)
function scoreComment(
    comment: {
        likes: number;
        repliesCount?: number
    }
) {
    return comment.likes * 2 + (comment.repliesCount ?? 0);
}

function compareByCreatedAtDesc(
    a: { createdAt: string },
    b: { createdAt: string }
) {
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
}

function compareByScoreDesc(
    a: { likes: number; repliesCount?: number },
    b: { likes: number; repliesCount?: number }
) {
    return scoreComment(b) - scoreComment(a);
}

function buildAvatarUrl(seed: string) {
    // Avatar demo
    return `https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(seed)}`;
}

function pickAvatarUrl(opts: {
    authorId?: string;
    authorName: string;
    authorAvatar?: string;
    currentUserId?: string;
    currentUserAvatar?: string;
}) {
    if (opts.authorId
        && opts.currentUserId
        && opts.authorId === opts.currentUserId
        && opts.currentUserAvatar
    ) {
        return opts.currentUserAvatar;
    }

    if (opts.authorAvatar)
        return opts.authorAvatar;

    const seed = opts.authorId || opts.authorName;

    return buildAvatarUrl(seed);
}

export default function CommentSection({articleId}: CommentSectionProps) {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const user = useAppSelector((state) => state.user.currentUser);
    const commentsByArticleId = useAppSelector((state) => state.comments.byArticleId);

    // Data comment theo bài viết
    const comments = commentsByArticleId[articleId] ?? [];

    const [tab, setTab] = useState<CommentTab>('top');
    const [text, setText] = useState('');
    const [showLoginModal, setShowLoginModal] = useState(false);

    const [replyingTo, setReplyingTo] = useState<string | null>(null);
    const [replyText, setReplyText] = useState('');

    // Sort list comment theo tab
    const sorted = useMemo(
        function () {
            const list = [...comments];
            if (tab === 'new') return list.sort(compareByCreatedAtDesc);
            return list.sort(compareByScoreDesc);
        },
        [comments, tab]
    );

    // Chặn thao tác nếu chưa login
    function requireLogin() {
        if (!user) {
            setShowLoginModal(true);
            return true;
        }
        return false;
    }

    // Gửi comment
    function submitComment() {
        if (requireLogin()) return;
        if (!user) return;

        dispatch(
            addComment({
                articleId: articleId,
                text: text,
                authorId: user.id,
                authorName: user.displayName,
                authorAvatar: user.avatar || ''
            })
        );
        setText('');
    }

    // Gửi reply cho 1 comment
    function submitReply(parentCommentId: string) {
        if (requireLogin()) return;
        if (!user) return;

        dispatch(
            addReply({
                articleId: articleId,
                parentCommentId: parentCommentId,
                text: replyText,
                authorId: user.id,
                authorName: user.displayName,
                authorAvatar: user.avatar || ''
            })
        );
        setReplyText('');
        setReplyingTo(null);
    }

    return (
        <section className="article-comments" id="comment-section">
            {/* Header + số lượng comment */}
            <div className="d-flex align-items-center justify-content-between mb-3">
                <h5 className="fw-bold text-dark m-0 font-serif">Bình luận</h5>
                <span className="text-secondary small">{comments.length} bình luận</span>
            </div>

            {/* Ô nhập comment */}
            <div className="article-comments__composer mb-4">
                <Form onSubmit={(e) => e.preventDefault()}>
                    <Form.Control
                        as="textarea"
                        rows={3}
                        placeholder="Viết bình luận..."
                        className="article-comments__input w-100"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        onMouseDown={(e) => {
                            if (requireLogin()) e.preventDefault();
                        }}
                        onKeyDown={(e) => {
                            if (requireLogin()) e.preventDefault();
                        }}
                    />
                    <div className="d-flex justify-content-end mt-2">
                        <Button className="article-comments__submit bg-nld-auth border-0 fw-bold"
                                onClick={submitComment}>
                            Gửi bình luận
                        </Button>
                    </div>
                </Form>
            </div>

            {/* Tabs: Quan tâm nhất / Mới nhất */}
            <Nav
                variant="underline"
                activeKey={tab}
                onSelect={(k) => setTab((k as CommentTab) || 'top')}
                className="comment-tabs mb-3"
            >
                <Nav.Item>
                    <Nav.Link eventKey="top" className="comment-tab">
                        Quan tâm nhất
                    </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link eventKey="new" className="comment-tab">
                        Mới nhất
                    </Nav.Link>
                </Nav.Item>
            </Nav>

            {/* Danh sách comment */}
            {sorted.length === 0 ? (
                <p className="text-muted mb-0">Chưa có bình luận.</p>
            ) : (
                <div className="d-flex flex-column gap-4">
                    {sorted.map(function (c) {
                        const displayName = c.authorId && user && c.authorId === user.id ? user.displayName : c.authorName;
                        const avatarUrl = pickAvatarUrl({
                            authorId: c.authorId,
                            authorName: c.authorName,
                            authorAvatar: c.authorAvatar,
                            currentUserId: user?.id,
                            currentUserAvatar: user?.avatar
                        });

                        return (
                            <div key={c.id} className="comment-item">
                                {/* Avatar */}
                                <div className="comment-item__avatar">
                                    <img src={avatarUrl} alt="avatar" className="comment-item__avatar-img"/>
                                </div>

                                {/* Nội dung comment */}
                                <div className="comment-item__body flex-grow-1">
                                    <div className="comment-item__author">{displayName}</div>
                                    <div className="comment-item__text">{c.text}</div>

                                    {/* Meta actions: like / reply / time */}
                                    <div className="comment-item__meta">
                                        <button
                                            type="button"
                                            className="comment-item__meta-btn"
                                            onClick={() => {
                                                if (requireLogin()) return;
                                                if (!user) return;
                                                dispatch(toggleLike({
                                                    articleId: articleId,
                                                    commentId: c.id,
                                                    userId: user.id
                                                }));
                                            }}
                                        >
                                            <BsHandThumbsUp/>
                                            <span>{c.likes}</span>
                                        </button>
                                        <span className="comment-item__meta-sep">·</span>
                                        <button
                                            type="button"
                                            className="comment-item__meta-btn"
                                            onClick={() => {
                                                if (replyingTo === c.id) {
                                                    setReplyingTo(null);
                                                    setReplyText('');
                                                    return;
                                                }
                                                setReplyingTo(c.id);
                                                setReplyText('');
                                            }}
                                        >
                                            Trả lời {c.repliesCount ?? 0}
                                        </button>
                                        <span className="comment-item__meta-sep">·</span>
                                        <span
                                            className="comment-item__meta-time">{formatCommentTime(c.createdAt, new Date())}</span>
                                    </div>

                                    {/* Danh sách replies */}
                                    {c.replies?.length > 0 && (
                                        <div className="mt-3 d-flex flex-column gap-3">
                                            {c.replies.map(function (r) {
                                                const replyAvatarUrl = pickAvatarUrl({
                                                    authorId: r.authorId,
                                                    authorName: r.authorName,
                                                    authorAvatar: r.authorAvatar,
                                                    currentUserId: user?.id,
                                                    currentUserAvatar: user?.avatar
                                                });

                                                return (
                                                    <div key={r.id} className="d-flex gap-3 ms-4">
                                                        <div className="comment-item__avatar comment-item__avatar--sm">
                                                            <img src={replyAvatarUrl} alt="avatar"
                                                                 className="comment-item__avatar-img"/>
                                                        </div>
                                                        <div className="flex-grow-1">
                                                            <div className="comment-item__author">{r.authorName}</div>
                                                            <div className="comment-item__text">{r.text}</div>
                                                            <div className="comment-item__meta">
                                                                <span className="comment-item__meta-time">
                                                                  {formatCommentTime(r.createdAt, new Date())}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}

                                    {/* Ô nhập reply */}
                                    {replyingTo === c.id && (
                                        <div className="mt-3 mr-4 w-100">
                                            <Form onSubmit={(e) => e.preventDefault()}>
                                                <Form.Control
                                                    as="textarea"
                                                    rows={2}
                                                    placeholder="Viết trả lời..."
                                                    className="article-comments__input w-100"
                                                    value={replyText}
                                                    onChange={(e) => setReplyText(e.target.value)}
                                                    onMouseDown={(e) => {
                                                        if (requireLogin()) e.preventDefault();
                                                    }}
                                                    onKeyDown={(e) => {
                                                        if (requireLogin()) e.preventDefault();
                                                    }}
                                                />
                                                <div className="d-flex justify-content-end gap-2 mt-2">
                                                    <Button
                                                        variant="outline-secondary"
                                                        onClick={() => {
                                                            setReplyingTo(null);
                                                            setReplyText('');
                                                        }}
                                                    >
                                                        Huỷ
                                                    </Button>
                                                    <Button className="bg-nld-auth border-0 fw-bold"
                                                            onClick={() => submitReply(c.id)}>
                                                        Gửi
                                                    </Button>
                                                </div>
                                            </Form>
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Modal: nhắc đăng nhập để comment/like/reply */}
            <Modal show={showLoginModal} onHide={() => setShowLoginModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Đăng nhập để bình luận</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p className="mb-0 text-secondary">Bạn cần đăng nhập để viết bình luận, like và trả lời.</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="outline-secondary" onClick={() => setShowLoginModal(false)}>
                        Để sau
                    </Button>
                    <Button
                        className="bg-nld-auth border-0 fw-bold"
                        onClick={() => {
                            setShowLoginModal(false);
                            navigate('/login');
                        }}
                    >
                        Đi tới đăng nhập
                    </Button>
                </Modal.Footer>
            </Modal>
        </section>
    );
}
