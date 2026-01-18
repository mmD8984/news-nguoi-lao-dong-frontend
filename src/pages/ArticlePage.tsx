import { useMemo, useEffect, useState } from "react";
import { Alert, Button, Container, Spinner, Modal } from "react-bootstrap";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";

import CommentSection from "@/components/CommentSection";
import { useResolvedArticle } from "@/hooks/useResolvedArticle";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { toggleSavedArticle } from "@/store/user/user.slice";
import type { Article } from "@/types/types.ts";
import { decodeArticleParam, normalizeUrl } from "@/utils/articleUrl";
import { sanitizeHtml } from "@/utils/sanitizeHtml";
import { getCategoryLabelFromSlug } from "@/utils/categoryLabel";
import { upsertSavedArticle, removeSavedArticle } from "@/services/save/savedArticles.rtdb.ts";


type LocationState = {
    article?: Article;
};

function isArticle(value: unknown): value is Article {
    const v = value as Article | null;
    return Boolean(
        v &&
        typeof v === "object" &&
        typeof v.id === "string" &&
        typeof v.title === "string" &&
        typeof v.content === "string"
    );
}

export default function ArticlePage() {
    const { id } = useParams<{ id: string }>();
    const location = useLocation();
    const navigate = useNavigate();

    const dispatch = useAppDispatch();
    const user = useAppSelector((state) => state.user.currentUser);

    const articleUrl = useMemo(() => decodeArticleParam(id), [id]);

    const stateArticleRaw = (location.state as LocationState | null)?.article;
    const stateArticle = useMemo(() => {
        if (!articleUrl) return null;
        if (!isArticle(stateArticleRaw)) return null;

        const target = normalizeUrl(articleUrl);
        const linkNorm = stateArticleRaw.link ? normalizeUrl(stateArticleRaw.link) : "";
        const idNorm = normalizeUrl(stateArticleRaw.id);

        return linkNorm === target || idNorm === target ? stateArticleRaw : null;
    }, [stateArticleRaw, articleUrl]);

    const isVipUser = !!(user?.isVip && user.vipExpirationDate && new Date(user.vipExpirationDate) > new Date());

    const { article, loading, error } = useResolvedArticle(articleUrl, stateArticle);

    const [showVipModal, setShowVipModal] = useState(false);

    // Kiểm tra quyền truy cập VIP
    useEffect(() => {
        const isVipContent = stateArticleRaw?.isVip === true;
        if (isVipContent && !isVipUser) {
            setShowVipModal(true);
        }
    }, [stateArticleRaw, isVipUser]);

    const openUrl = article?.link || articleUrl;
    const savedKey = normalizeUrl(openUrl);
    const isSaved = Boolean(user && savedKey && user.savedArticleIds.includes(savedKey));

    const displayTime = useMemo(() => {
        const raw = article?.publishedAt || "";
        const d = new Date(raw);
        return Number.isNaN(d.getTime()) ? raw : d.toLocaleString("vi-VN");
    }, [article?.publishedAt]);

    const safeHtml = useMemo(() => sanitizeHtml(article?.content || ""), [article?.content]);

    const categoryLabel = useMemo(() => {
        return article?.categorySlug ? getCategoryLabelFromSlug(article.categorySlug) : "";
    }, [article?.categorySlug]);

    if (!id) {
        return (
            <Container className="py-4">
                <Alert variant="danger">URL bài viết không hợp lệ.</Alert>
            </Container>
        );
    }

    return (
        <div className="bg-white font-sans">
            <Container className="py-3 py-lg-4">
                {/* Toolbar */}
                <div className="d-flex flex-wrap gap-2 justify-content-between align-items-center mb-3">
                    <div className="text-secondary small">
                        {article?.categorySlug ? (
                            <Link
                                to={`/${encodeURIComponent(article.categorySlug)}`}
                                className="badge rounded-pill bg-nld-blue text-white text-decoration-none"
                                style={{ fontSize: 12, padding: "6px 10px" }}
                            >
                                {categoryLabel}
                            </Link>
                        ) : null}
                    </div>

                    <div className="d-flex gap-2">
                        {openUrl ? (
                            <a
                                href={openUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn btn-outline-secondary btn-sm"
                            >
                                Mở bài gốc ↗
                            </a>
                        ) : null}

                        <Button
                            variant={isSaved ? "danger" : "outline-secondary"}
                            size="sm"
                            onClick={async () => {
                                if (!savedKey) return;

                                if (!user) {
                                    navigate("/login");
                                    return;
                                }

                                try {
                                    if (isSaved) {
                                        await removeSavedArticle(user.id, savedKey);
                                    } else {
                                        if (!article) return;
                                        await upsertSavedArticle(user.id, {
                                            ...article,
                                            link: savedKey,
                                        });
                                    }
                                    dispatch(toggleSavedArticle(savedKey));
                                } catch (e) {
                                    console.error("Lỗi lưu bài:", e);
                                }
                            }}

                        >
                            {isSaved ? "Đã lưu" : "Lưu"}
                        </Button>

                        <Button variant="outline-secondary" size="sm" onClick={() => navigate(-1)}>
                            ← Quay lại
                        </Button>
                    </div>
                </div>

                {loading && !article ? (
                    <div className="text-center py-5">
                        <Spinner animation="border" />
                    </div>
                ) : error && !article ? (
                    <Alert variant="warning">
                        <div className="fw-bold mb-2">⚠️ Không thể hiển thị bài viết</div>
                        <div className="mb-3">{error}</div>
                        {openUrl ? (
                            <a
                                href={openUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn btn-primary btn-sm"
                            >
                                Mở bài trên nld.com.vn
                            </a>
                        ) : null}
                    </Alert>
                ) : article ? (
                    <>
                        <h1 className="fs-1 fw-bold font-serif mb-3">{article.title}</h1>
                        <div className="d-flex flex-wrap gap-3 align-items-center text-secondary mb-3">
                            <span className="fw-bold">{article.author || "Người Lao Động"}</span>
                            {displayTime ? <span className="small">{displayTime}</span> : null}
                            <span className="small">Nguồn: {article.source || "nld.com.vn"}</span>
                        </div>

                        {article.coverImage ? (
                            <div className="mb-4">
                                <img
                                    src={article.coverImage}
                                    alt={article.title}
                                    className="w-100 rounded-2"
                                    style={{ maxHeight: 520, objectFit: "cover" }}
                                />
                            </div>
                        ) : null}

                        <div className="article-content" dangerouslySetInnerHTML={{ __html: safeHtml }} />

                        <div className="mt-5 pt-4 border-top">
                            <CommentSection articleId={savedKey || article.id} />
                        </div>
                    </>
                ) : null}

                <Modal 
                    show={showVipModal} 
                    onHide={() => navigate('/')} 
                    backdrop="static" 
                    keyboard={false}
                    centered
                >
                    <Modal.Header closeButton>
                        <Modal.Title className="text-warning fw-bold">
                             DÀNH CHO BẠN ĐỌC VIP
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <p>Nội dung này dành riêng cho thành viên VIP. Vui lòng đăng ký gói thành viên để tiếp tục xem bài viết này và nhiều nội dung hấp dẫn khác.</p>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => navigate('/')}>
                            Quay lại
                        </Button>
                        <Button variant="primary" style={{ backgroundColor: '#2d68c4' }} onClick={() => navigate('/dang-ky-goi-vip')}>
                            Đăng ký ngay
                        </Button>
                    </Modal.Footer>
                </Modal>
            </Container>
        </div>
    );
}
