import {useEffect, useMemo, useState, type ChangeEvent} from 'react';
import {useNavigate, useSearchParams} from 'react-router-dom';
import {Alert, Button, Card, Col, Container, Form, ListGroup, Row} from 'react-bootstrap';
import {BsBookmark, BsBoxArrowRight, BsPerson, BsPersonCircle} from 'react-icons/bs';
import NewsCard from '@/components/NewsCard';
import {RSS_FEEDS, type RssKey} from '@/data/rss';
import {fetchCategoryRSS} from '@/services/rss/fetchCategoryRSS';
import {useAppDispatch, useAppSelector} from '@/store/hooks';
import {updateProfile} from '@/store/user/user.slice.ts';
import {logoutUser} from '@/store/user/user.actions.ts';
import type {Article} from '@/types/types.ts';
import {ViewMode} from '@/types/types.ts';

type Panel = 'account' | 'saved';
type Notice = { variant: 'success' | 'secondary'; message: string };

function normalizeUrl(input: string) {
    const raw = (input || '').trim();
    if (!raw) return '';
    try {
        const u = new URL(raw);
        u.hash = '';
        return u.toString().replace(/\/$/, '');
    } catch {
        return raw.replace(/\/$/, '');
    }
}

function buildFeedKeysFromSavedLinks(savedLinks: string[]): RssKey[] {
    const set = new Set<RssKey>();
    set.add('home');

    for (const link of savedLinks) {
        try {
            const u = new URL(link);
            const parts = u.pathname.split('/').filter(Boolean);
            const first = parts[0];
            const second = parts[1];

            if (first && (first as keyof typeof RSS_FEEDS) in RSS_FEEDS) set.add(first as RssKey);
            if (second && (second as keyof typeof RSS_FEEDS) in RSS_FEEDS) set.add(second as RssKey);
        } catch {
            // ignore
        }
    }

    return Array.from(set);
}

function buildPlaceholderArticle(link: string): Article {
    const url = normalizeUrl(link);
    return {
        id: url || link,
        title: url || link,
        slug: '',
        categorySlug: 'saved',
        categoryName: 'Bài đã lưu',
        description: url,
        content: '',
        thumbnail: 'https://via.placeholder.com/300x200?text=NLĐ',
        coverImage: 'https://via.placeholder.com/1200x630?text=NLĐ',
        author: 'Người Lao Động',
        source: 'nld.com.vn',
        publishedAt: '',
        tags: [],
        isFeatured: false,
        isHot: false,
        link: url
    };
}

function ProfilePage() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const dispatch = useAppDispatch();
    const user = useAppSelector((state) => state.user.currentUser);

    // Tab mặc định
    const initialPanel = (searchParams.get('saved') ? 'saved' : 'account') as Panel;
    const [active, setActive] = useState<Panel>(initialPanel);

    // Saved articles
    const [savedArticles, setSavedArticles] = useState<Article[]>([]);
    const [loadingSaved, setLoadingSaved] = useState(false);

    // Popup message
    const [notice, setNotice] = useState<Notice | null>(null);

    // Nếu chưa login thì về /login
    useEffect(() => {
        if (!user) navigate('/login');
    }, [user, navigate]);

    // Lấy danh sách bài đã lưu (đồng nhất: resolve từ RSS, không dùng mock data)
    useEffect(() => {
        if (!user) return;

        const savedLinks = (user.savedArticleIds ?? [])
            .map(normalizeUrl)
            .filter(Boolean);

        if (savedLinks.length === 0) {
            setSavedArticles([]);
            return;
        }

        let cancelled = false;
        setLoadingSaved(true);

        (async () => {
            const feedKeys = buildFeedKeysFromSavedLinks(savedLinks);
            const lists = await Promise.all(feedKeys.map((k) => fetchCategoryRSS(k)));
            const pool = lists.flat();

            const byLink = new Map<string, Article>();
            for (const a of pool) {
                const link = normalizeUrl(a.link || '');
                if (link) byLink.set(link, a);
            }

            const resolved = savedLinks.map((link) => byLink.get(link) ?? buildPlaceholderArticle(link));
            if (!cancelled) setSavedArticles(resolved);
        })()
            .catch(() => {
                // Nếu RSS lỗi, vẫn render được danh sách link đã lưu
                if (!cancelled) setSavedArticles(savedLinks.map(buildPlaceholderArticle));
            })
            .finally(() => {
                if (!cancelled) setLoadingSaved(false);
            });

        return () => {
            cancelled = true;
        };
    }, [user?.id, user?.savedArticleIds?.join('|')]);

    // Tự động ẩn popup message
    useEffect(() => {
        if (!notice) return;
        const t = window.setTimeout(() => setNotice(null), 1000);
        return () => window.clearTimeout(t);
    }, [notice]);

    const genderLabel = useMemo(() => {
        if (!user?.gender) return 'Chưa chọn';
        if (user.gender === 'male') return 'Nam';
        if (user.gender === 'female') return 'Nữ';
        return 'Khác';
    }, [user?.gender]);

    if (!user) return null;

    return (
        <div className="profile-page bg-light font-sans py-4 py-lg-5 min-vh-100">
            {/* Popup message */}
            {notice && (
                <div className="article-notice">
                    <Alert
                        variant={notice.variant}
                        className="m-0 py-2 px-3 shadow-sm"
                        dismissible
                        onClose={() => setNotice(null)}
                    >
                        {notice.message}
                    </Alert>
                </div>
            )}

            <Container>
                <Row className="g-4">
                    {/* Sidebar profile */}
                    <Col lg={3}>
                        <Card className="border-0 shadow-sm profile-sidebar">
                            <div className="p-3 border-bottom">
                                <div className="d-flex align-items-center gap-3">
                                    <div className="profile-avatar profile-avatar--sm">
                                        {user.avatar ? (
                                            <img src={user.avatar} alt="avatar"
                                                 className="w-100 h-100 object-fit-cover"/>
                                        ) : (
                                            <BsPersonCircle size={34} className="text-secondary"/>
                                        )}
                                    </div>
                                    <div className="flex-grow-1">
                                        <div className="fw-bold text-dark text-truncate">{user.displayName}</div>
                                        <div className="text-secondary small text-truncate">{user.emailOrPhone}</div>
                                    </div>
                                </div>
                            </div>

                            <ListGroup variant="flush" className="profile-nav">
                                <ListGroup.Item
                                    action
                                    className={`profile-nav__item ${active === 'account' ? 'active' : ''}`}
                                    onClick={() => setActive('account')}
                                >
                                    <BsPerson size={18}/> Thông tin tài khoản
                                </ListGroup.Item>
                                <ListGroup.Item
                                    action
                                    className={`profile-nav__item ${active === 'saved' ? 'active' : ''}`}
                                    onClick={() => setActive('saved')}
                                >
                                    <BsBookmark size={18}/> Bài đã lưu
                                </ListGroup.Item>
                                <ListGroup.Item
                                    action
                                    className="profile-nav__item text-danger"
                                    onClick={() => {
                                        dispatch(logoutUser());
                                        navigate('/');
                                    }}
                                >
                                    <BsBoxArrowRight size={18}/> Đăng xuất
                                </ListGroup.Item>
                            </ListGroup>
                        </Card>
                    </Col>

                    {/* Main content */}
                    <Col lg={9}>
                        {/* Panel: Account */}
                        {active === 'account' && (
                            <Card className="border-0 shadow-sm p-4">
                                <h4 className="profile-section-title mb-4">
                                    <span className="profile-section-title__bar"/>
                                    Thông tin tài khoản
                                </h4>

                                <Row className="g-4 align-items-start">
                                    {/* Avatar */}
                                    <Col md={4} className="text-center">
                                        <div className="text-secondary small text-start mb-2">Ảnh đại diện</div>
                                        <div className="profile-avatar profile-avatar--lg mx-auto">
                                            {user.avatar ? (
                                                <img src={user.avatar} alt="avatar"
                                                     className="w-100 h-100 object-fit-cover"/>
                                            ) : (
                                                <BsPersonCircle size={60} className="text-secondary"/>
                                            )}
                                        </div>

                                        <div className="mt-3">
                                            <Form.Label className="btn btn-outline-secondary btn-sm mb-0">
                                                Thay đổi
                                                <Form.Control
                                                    type="file"
                                                    accept="image/*"
                                                    className="d-none"
                                                    onChange={(e: ChangeEvent<HTMLInputElement>) => {
                                                        const file = e.target.files?.[0];
                                                        if (!file) return;
                                                        const url = URL.createObjectURL(file);
                                                        dispatch(updateProfile({avatar: url}));
                                                    }}
                                                />
                                            </Form.Label>
                                        </div>
                                    </Col>

                                    {/* Form */}
                                    <Col md={8}>
                                        <Form>
                                            <Row className="mb-3 align-items-center">
                                                <Col sm={4} className="text-secondary">
                                                    ID tài khoản
                                                </Col>
                                                <Col sm={8}
                                                     className="d-flex align-items-center justify-content-between">
                                                    <span className="text-dark text-break">{user.id}</span>
                                                    <Button
                                                        variant="link"
                                                        className="p-0 small text-decoration-none"
                                                        onClick={async () => {
                                                            try {
                                                                await navigator.clipboard.writeText(user.id);
                                                            } catch {
                                                                // ignore
                                                            }
                                                        }}
                                                    >
                                                        Sao chép
                                                    </Button>
                                                </Col>
                                            </Row>

                                            <Row className="mb-3 align-items-center">
                                                <Col sm={4} className="text-secondary">
                                                    Tên hiển thị
                                                </Col>
                                                <Col sm={8}>
                                                    <Form.Control
                                                        value={user.displayName}
                                                        onChange={(e) => dispatch(updateProfile({displayName: e.target.value}))}
                                                    />
                                                </Col>
                                            </Row>

                                            <Row className="mb-3 align-items-center">
                                                <Col sm={4} className="text-secondary">
                                                    Giới tính
                                                </Col>
                                                <Col sm={8}>
                                                    <Form.Select
                                                        value={user.gender ?? ''}
                                                        onChange={(e) => dispatch(updateProfile({gender: (e.target.value as any) || null}))}
                                                    >
                                                        <option value="">{genderLabel}</option>
                                                        <option value="male">Nam</option>
                                                        <option value="female">Nữ</option>
                                                        <option value="other">Khác</option>
                                                    </Form.Select>
                                                </Col>
                                            </Row>

                                            <Row className="mb-4 align-items-center">
                                                <Col sm={4} className="text-secondary">
                                                    Email / SĐT
                                                </Col>
                                                <Col sm={8}>
                                                    <Form.Control value={user.emailOrPhone} disabled
                                                                  className="bg-light"/>
                                                </Col>
                                            </Row>

                                            {/* Action: Lưu thay đổi (demo) */}
                                            <div className="d-flex justify-content-end">
                                                <Button
                                                    className="bg-nld-auth border-0 px-4 fw-bold"
                                                    onClick={() => {
                                                        setNotice({variant: 'success', message: 'Đã lưu thay đổi'});
                                                    }}
                                                >
                                                    Lưu thay đổi
                                                </Button>
                                            </div>
                                        </Form>
                                    </Col>
                                </Row>
                            </Card>
                        )}

                        {/* Panel: Saved */}
                        {active === 'saved' && (
                            <Card className="border-0 shadow-sm p-4">
                                <h4 className="profile-section-title mb-4">
                                    <span className="profile-section-title__bar"/>
                                    Bài đã lưu
                                </h4>

                                {loadingSaved ? (
                                    <p className="text-secondary mb-0">Loading...</p>
                                ) : savedArticles.length === 0 ? (
                                    <p className="text-muted mb-0">Bạn chưa lưu bài viết nào.</p>
                                ) : (
                                    <div className="d-flex flex-column gap-2">
                                        {savedArticles.map((a) => (
                                            <NewsCard key={a.id} article={a} mode={ViewMode.SEARCH_RESULT}/>
                                        ))}
                                    </div>
                                )}
                            </Card>
                        )}
                    </Col>
                </Row>
            </Container>
        </div>
    );
}

export default ProfilePage;
