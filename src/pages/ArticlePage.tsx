import {type ReactNode, useEffect, useMemo, useState} from 'react';
import {Link, useNavigate, useParams} from 'react-router-dom';
import {Alert, Col, Container, Row} from 'react-bootstrap';
import {
    BsBookmark,
    BsBookmarkFill,
    BsChatSquareText,
    BsChevronDown,
    BsChevronUp,
    BsLink45Deg,
    BsPrinter
} from 'react-icons/bs';
import NewsCard from '../components/NewsCard';
import CommentSection from '../components/CommentSection';
import {getArticleById, getArticlesByCategory, getCategories} from '../services/api';
import type {Article, NavItem} from '../types';
import {ViewMode} from '../types';
import {useAppDispatch, useAppSelector} from '../store/hooks';
import {toggleSavedArticle} from '../store/user/user.slice.ts';

type Notice = { variant: 'success' | 'secondary'; message: string };
type BreadcrumbItem = { label: string; to: string };

function titleFromSlugPart(part: string) {
    return part.replaceAll('-', ' ');
}

function joinPath(parts: string[]) {
    return `/${parts.join('/')}`;
}

function findCategoryLabel(categories: NavItem[], to: string) {
    for (const c of categories) {
        if (c.path === to) return c.label;
        const subs = c.subItems ?? [];
        for (const s of subs) {
            if (s.path === to) return s.label;
        }
    }
    return '';
}

function buildBreadcrumb(categories: NavItem[], categorySlug: string, fallbackLeafName: string): BreadcrumbItem[] {
    const slug = categorySlug.trim();
    if (!slug) return [];

    const parts = slug.split('/').filter(Boolean);
    const out: BreadcrumbItem[] = [];

    for (let i = 0; i < parts.length; i += 1) {
        const to = joinPath(parts.slice(0, i + 1));
        const labelFromMenu = findCategoryLabel(categories, to);
        const label = labelFromMenu || (i === parts.length - 1 ? fallbackLeafName : titleFromSlugPart(parts[i]));
        out.push({label, to});
    }

    return out;
}

// Toolbar
function ToolbarBtn(props: { icon: ReactNode; onClick?: () => void; active?: boolean; label: string }) {
    const className = `article-toolbar-btn btn rounded-circle mb-3${props.active ? ' article-toolbar-btn--active' : ''}`;
    return (
        <button type="button" onClick={props.onClick} aria-label={props.label} className={className}>
            {props.icon}
        </button>
    );
}

export default function ArticlePage() {
    const {id} = useParams<{ id: string }>();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const user = useAppSelector((state) => state.user.currentUser);

    const [article, setArticle] = useState<Article | null>(null);
    const [loading, setLoading] = useState(true);

    const [fontSize, setFontSize] = useState(18);
    const [notice, setNotice] = useState<Notice | null>(null);

    const [mostReadArticles, setMostReadArticles] = useState<Article[]>([]);
    const [readMoreArticles, setReadMoreArticles] = useState<Article[]>([]);

    // Categories để build breadcrumb
    const [categories, setCategories] = useState<NavItem[]>([]);

    const isSaved = Boolean(user?.savedArticleIds?.includes(article?.id ?? ''));

    // Load categories
    useEffect(() => {
        getCategories().then(setCategories);
    }, []);

    // Khi user đổi route `/article/:id` thì load lại data bài viết.
    useEffect(() => {
        setLoading(false);

        if (!id) {
            setTimeout(() => {
                setArticle(null);
                setLoading(false);
            }, 1000);
            return;
        }

        getArticleById(id)
            .then(setArticle)
            .finally(() => setLoading(false));
    }, [id]);

    // Chuẩn bị data cho sidebar "Tin đọc nhiều" + block "Đọc thêm"
    useEffect(() => {
        if (!article)
            return;

        getArticlesByCategory(article.categorySlug).then((sameCategory) => {
            const list = sameCategory.filter((a) => a.id !== article.id);
            setMostReadArticles(list.slice(0, 4));
            setReadMoreArticles(list.slice(4, 10));
        });
    }, [article, article?.id]);

    // Tự động ẩn message
    useEffect(() => {
        if (!notice) return;
        const t = window.setTimeout(() => setNotice(null), 1000);
        return () => window.clearTimeout(t);
    }, [notice]);

    const breadcrumb = useMemo(
        function () {
            if (!article) return [] as BreadcrumbItem[];
            return buildBreadcrumb(categories, article.categorySlug, article.categoryName);
        },
        [article, categories]
    );

    // Tăng/giảm cỡ chữ
    function handleFontSizeChange(delta: number) {
        setFontSize((prev) => Math.min(26, Math.max(14, prev + delta)));
    }

    // Cuộn xuống phần bình luận
    function scrollToComments() {
        document.getElementById('comment-section')?.scrollIntoView({behavior: 'smooth'});
    }

    // Copy link bài viết
    async function copyLink() {
        try {
            await navigator.clipboard.writeText(window.location.href);
            setNotice({variant: 'success', message: 'Đã copy link.'});
        } catch {
            setNotice({variant: 'secondary', message: 'Không thể copy link (trình duyệt chặn).'});
        }
    }

    // Demo print
    function print() {
        setNotice({variant: 'secondary', message: 'Tính năng in sẽ bổ sung sau.'});
    }

    // Lưu / bỏ lưu bài
    function toggleSave() {
        if (!article) return;
        if (!user) {
            navigate('/login');
            return;
        }
        dispatch(toggleSavedArticle(article.id));
    }

    if (loading) {
        return (
            <div className="bg-white font-sans">
                <Container className="py-4">
                    <div className="text-secondary">Loading...</div>
                </Container>
            </div>
        );
    }

    if (!article) {
        return (
            <div className="bg-white font-sans">
                <Container className="py-4">
                    <div className="text-muted">Không tìm thấy bài viết.</div>
                    <div className="mt-3">
                        <Link to="/" className="text-decoration-none">
                            Quay về trang chủ
                        </Link>
                    </div>
                </Container>
            </div>
        );
    }

    return (
        <div className="bg-white font-sans">
            {/* Popup thông báo nhỏ (copy link, print, ...) */}
            {notice && (
                <div className="article-notice">
                    <Alert variant={notice.variant} className="m-0 py-2 px-3 shadow-sm" dismissible
                           onClose={() => setNotice(null)}>
                        {notice.message}
                    </Alert>
                </div>
            )}

            <Container className="py-4">
                <Row className="g-0">
                    {/* Toolbar bên trái */}
                    <Col md={1} className="d-none d-md-block pe-3 article-page__toolbar-col">
                        <div className="d-flex flex-column align-items-center pt-5 sticky-top article-page__toolbar">
                            <ToolbarBtn icon={<BsLink45Deg size={26}/>} onClick={copyLink} label="Copy link"/>
                            <ToolbarBtn icon={<BsChatSquareText size={22}/>} onClick={scrollToComments}
                                        label="Comment"/>
                            <ToolbarBtn icon={<BsPrinter size={22}/>} onClick={print} label="Print"/>
                            <ToolbarBtn
                                icon={isSaved ? <BsBookmarkFill size={22}/> : <BsBookmark size={22}/>}
                                onClick={toggleSave}
                                active={isSaved}
                                label="Save"
                            />

                            <div className="my-2 border-top w-50"/>

                            {/* Tool tăng/giảm cỡ chữ */}
                            <div className="article-toolbar-pill mb-2">
                                <button type="button" onClick={() => handleFontSizeChange(1)}
                                        className="article-toolbar-pill-btn">
                                    <BsChevronUp size={14}/>
                                </button>
                                <span className="fw-bold text-secondary font-serif article-page__aa">Aa</span>
                                <button type="button" onClick={() => handleFontSizeChange(-1)}
                                        className="article-toolbar-pill-btn">
                                    <BsChevronDown size={14}/>
                                </button>
                            </div>
                        </div>
                    </Col>

                    {/* Nội dung bài viết */}
                    <Col md={11} lg={8} className="px-lg-4">
                        {/* Breadcrumb */}
                        <div
                            className="d-flex align-items-center flex-wrap gap-2 mb-3 text-secondary article-page__breadcrumb">
                            {breadcrumb.map((bc, idx) => (
                                <span key={bc.to} className="d-inline-flex align-items-center gap-2">
                                    <Link to={bc.to} className="fw-bold text-uppercase hover-link"> {bc.label} </Link>
                                    {idx < breadcrumb.length - 1 && <span>›</span>}
                                </span>
                            ))}
                        </div>

                        {/* Title */}
                        <h1 className="fw-bold text-dark mb-3 font-serif article-page__title">{article.title}</h1>

                        {/* Meta: author + date */}
                        <div className="d-flex justify-content-between align-items-center mb-3 border-bottom pb-3">
                            <span className="fw-bold text-dark article-page__author">{article.author}</span>
                            <span className="text-secondary article-page__date">
                                {new Date(article.publishedAt).toLocaleString('vi-VN')}
                            </span>
                        </div>

                        {/* Nội dung HTML */}
                        <div className="article-content" style={{['--article-font-size' as any]: `${fontSize}px`}}>
                            <p className="fw-bold text-dark mb-4 font-serif article-page__lead">
                                (NLD) - {article.description}</p>
                            <div className="text-dark font-serif" dangerouslySetInnerHTML={{__html: article.content}}/>
                        </div>

                        {/* Danh sách tags */}
                        {article.tags.length > 0 && (
                            <div className="d-flex align-items-center flex-wrap gap-2 mb-4 border-top pt-3">
                                {article.tags.map((tag) => (
                                    <Link key={tag} to={`/search?q=${encodeURIComponent(tag)}`}
                                          className="article-tag cursor-pointer">
                                        {tag}
                                    </Link>
                                ))}
                            </div>
                        )}

                        {/* Bình luận */}
                        <div className="mb-5 mt-5">
                            <CommentSection articleId={article.id}/>
                        </div>

                        {/* Đọc thêm */}
                        <div className="mb-5">
                            <h4 className="dont-miss-header">ĐỌC THÊM</h4>
                            <Row className="g-4">
                                {readMoreArticles.map((art) => (
                                    <Col md={4} key={art.id}>
                                        <NewsCard article={art} mode={ViewMode.DONT_MISS} showCategory={false}/>
                                    </Col>
                                ))}
                            </Row>
                        </div>
                    </Col>

                    {/* Sidebar phải */}
                    <Col lg={3} className="d-none d-lg-block border-start ps-4">
                        <h5 className="sidebar-header-custom">Tin đọc nhiều</h5>
                        <div className="d-flex flex-column gap-3">
                            {mostReadArticles.map((art) => (
                                <NewsCard key={art.id} article={art} mode={ViewMode.SIDEBAR_SMALL} showCategory={false}/>
                            ))}
                        </div>
                    </Col>
                </Row>
            </Container>
        </div>
    );
}
