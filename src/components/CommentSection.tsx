import {useMemo, useState} from 'react';
import {Button, Form, Modal, Nav, Image} from 'react-bootstrap';
import {useNavigate} from 'react-router-dom';
import {BsHandThumbsUp} from 'react-icons/bs';

import {useAuth} from '@/hooks/useAuth';
import {useAppDispatch, useAppSelector} from '@/store/hooks';
import {addComment, addReply, toggleLike} from '@/store/commentsSlice';
import {formatCommentTime} from '@/data/utils/dateHelpers';
import {getUserAvatarUrl} from '@/data/utils/userHelpers';

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

export default function CommentSection({articleId}: CommentSectionProps) {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const {user, isAuthenticated} = useAuth();
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
        if (!isAuthenticated) {
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
            <div className="mb-3">
                <h5 className="fw-bold text-dark m-0 font-serif">Bình luận ({comments.length})</h5>
            </div>

            {/* Ô nhập comment */}
            <div className="article-comments__composer mb-4">
                <Form onSubmit={(e) => e.preventDefault()}>
                    <Form.Control
                        as="textarea"
                        rows={3}
                        placeholder="Chia sẻ ý kiến của bạn"
                        className="article-comments__input w-100 bg-white"
                        style={{
                            resize: 'none',
                            borderLeft: '3px solid #2854a1',
                            borderRadius: '4px'
                        }}
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
                        <Button className="article-comments__submit bg-nld-auth border-0 fw-bold px-4 py-2"
                                disabled={!text.trim()}
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
                className="comment-tabs mb-4 border-bottom"
            >
                <Nav.Item>
                    <Nav.Link eventKey="top" className="comment-tab text-dark fw-semibold">
                        Quan tâm nhất
                    </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link eventKey="new" className="comment-tab text-dark fw-semibold">
                        Mới nhất
                    </Nav.Link>
                </Nav.Item>
            </Nav>

            {/* Danh sách comment */}
            {sorted.length === 0 ? (
                <div className="text-center py-5 text-muted">
                    <p className="mb-0">Chưa có bình luận nào. Hãy là người đầu tiên bình luận!</p>
                </div>
            ) : (
                <div className="d-flex flex-column gap-4">
                    {sorted.map(function (c) {
                        const isCurrentUser = c.authorId && user && c.authorId === user.id;
                        const displayName = isCurrentUser ? user.displayName : c.authorName;
                        const avatarUrl = getUserAvatarUrl(displayName, isCurrentUser ? user.avatar : c.authorAvatar);

                        return (
                            <div key={c.id} className="comment-item d-flex gap-3">
                                {/* Avatar */}
                                <div className="comment-item__avatar flex-shrink-0">
                                    <Image 
                                        src={avatarUrl} 
                                        alt={displayName} 
                                        roundedCircle 
                                        width={48} 
                                        height={48} 
                                        style={{objectFit: 'cover'}}
                                    />
                                </div>

                                {/* Nội dung comment */}
                                <div className="comment-item__body flex-grow-1">
                                    <div className="bg-light p-3 rounded-3 mb-2">
                                        <div className="fw-bold text-dark mb-1">{displayName}</div>
                                        <div className="text-secondary" style={{whiteSpace: 'pre-wrap'}}>{c.text}</div>
                                    </div>

                                    {/* Like / reply / time */}
                                    <div className="d-flex align-items-center gap-3 ms-2">
                                        <button
                                            type="button"
                                            className="btn btn-link p-0 text-decoration-none text-secondary d-flex align-items-center gap-1"
                                            style={{fontSize: '0.9rem'}}
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
                                            <BsHandThumbsUp className={c.likes > 0 ? "text-primary" : ""} />
                                            <span>{c.likes > 0 ? c.likes : 'Thích'}</span>
                                        </button>
                                        
                                        <button
                                            type="button"
                                            className="btn btn-link p-0 text-decoration-none text-secondary"
                                            style={{fontSize: '0.9rem'}}
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
                                            Trả lời
                                        </button>
                                        
                                        <span className="text-muted small" style={{fontSize: '0.85rem'}}>
                                            {formatCommentTime(c.createdAt, new Date())}
                                        </span>
                                    </div>

                                    {/* Danh sách replies */}
                                    {c.replies?.length > 0 && (
                                        <div className="mt-3 d-flex flex-column gap-3 ps-3 border-start border-3">
                                            {c.replies.map(function (r) {
                                                const isReplyCurrentUser = r.authorId && user && r.authorId === user.id;
                                                const replyDisplayName = isReplyCurrentUser ? user.displayName : r.authorName;
                                                const replyAvatarUrl = getUserAvatarUrl(replyDisplayName, isReplyCurrentUser ? user.avatar : r.authorAvatar);

                                                return (
                                                    <div key={r.id} className="d-flex gap-3">
                                                        <div className="flex-shrink-0">
                                                            <Image 
                                                                src={replyAvatarUrl} 
                                                                alt={replyDisplayName} 
                                                                roundedCircle 
                                                                width={32} 
                                                                height={32}
                                                                style={{objectFit: 'cover'}} 
                                                            />
                                                        </div>
                                                        <div className="flex-grow-1">
                                                            <div className="bg-light p-2 rounded-3 mb-1">
                                                                <div className="fw-bold text-dark small">{replyDisplayName}</div>
                                                                <div className="text-secondary small">{r.text}</div>
                                                            </div>
                                                            <div className="text-muted small ms-1">
                                                                {formatCommentTime(r.createdAt, new Date())}
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}

                                    {/* Ô nhập reply */}
                                    {replyingTo === c.id && (
                                        <div className="mt-3">
                                           <div className="d-flex gap-2">
                                                 <Image 
                                                    src={isAuthenticated && user ? getUserAvatarUrl(user.displayName, user.avatar) : getUserAvatarUrl('Guest')} 
                                                    roundedCircle 
                                                    width={32} 
                                                    height={32}
                                                    style={{objectFit: 'cover'}}
                                                />
                                                <div className="flex-grow-1">
                                                    <Form onSubmit={(e) => e.preventDefault()}>
                                                        <Form.Control
                                                            as="textarea"
                                                            rows={2}
                                                            placeholder="Viết trả lời..."
                                                            className="w-100 mb-2"
                                                            value={replyText}
                                                            onChange={(e) => setReplyText(e.target.value)}
                                                            onMouseDown={(e) => {
                                                                if (requireLogin()) e.preventDefault();
                                                            }}
                                                            onKeyDown={(e) => {
                                                                if (requireLogin()) e.preventDefault();
                                                            }}
                                                        />
                                                        <div className="d-flex justify-content-end gap-2">
                                                            <Button
                                                                variant="outline-secondary"
                                                                size="sm"
                                                                onClick={() => {
                                                                    setReplyingTo(null);
                                                                    setReplyText('');
                                                                }}
                                                            >
                                                                Huỷ
                                                            </Button>
                                                            <Button className="bg-nld-auth border-0 fw-bold"
                                                                    size="sm"
                                                                    disabled={!replyText.trim()}
                                                                    onClick={() => submitReply(c.id)}>
                                                                Gửi
                                                            </Button>
                                                        </div>
                                                    </Form>
                                                </div>
                                           </div>
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
