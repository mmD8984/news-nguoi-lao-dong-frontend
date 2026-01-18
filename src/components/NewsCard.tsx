import { Link } from "react-router-dom";
import type { Article, ArticleRSS, ViewMode } from "../types/types.ts";

type NewsArticle = Article | ArticleRSS;

interface NewsCardProps {
    article: NewsArticle;
    mode: ViewMode;
    showCategory?: boolean;
}

function NewsCard({ article, mode, showCategory = true }: NewsCardProps) {
    const originalUrl =
        "link" in article && article.link
            ? article.link
            : ("id" in article ? String(article.id) : "");

    const href = originalUrl
        ? `/article/${encodeURIComponent(originalUrl)}`
        : "/";

    const coverSrc =
        "image" in article
            ? article.image
            : article.coverImage || article.thumbnail;

    const thumbSrc =
        "image" in article
            ? article.image
            : article.thumbnail || article.coverImage;

    const title = article.title;
    const description = article.description;

    if (mode === "HERO_TOP_TITLE") {
        return (
            <Link to={href} state={{ article }} className="text-decoration-none text-dark d-block h-100 news-card">
                <h2 className="fs-3 lh-sm fw-bold font-serif mb-3 hover-link">
                    {title}
                </h2>
                <div className="position-relative mb-3 rounded-1 overflow-hidden-card">
                    <img src={coverSrc} alt={title} className="news-card-img article-img-lg" />
                </div>
                <p className="fs-6 lh-base text-dark mb-0">
                    (NLD) - {description}
                </p>
            </Link>
        );
    }

    if (mode === "FOCUS_SUB") {
        return (
            <Link to={href} state={{ article }} className="text-decoration-none text-dark d-block news-card">
                <div className="overflow-hidden-card rounded-1 mb-2">
                    <img src={thumbSrc} className="w-100 news-card-img article-img-lg" alt={title} />
                </div>
                <h5 className="fs-6 lh-sm fw-bold font-serif hover-link">
                    {title}
                </h5>
            </Link>
        );
    }

    if (mode === "FOCUS_BOTTOM") {
        return (
            <Link to={href} state={{ article }} className="text-decoration-none text-dark d-block news-card h-100">
                <h5 className="fs-5 lh-sm fw-bold font-serif hover-link mb-2">
                    {title}
                </h5>
                <p className="text-secondary small mb-0">
                    (NLD) - {description}
                </p>
            </Link>
        );
    }

    if (mode === "SIDEBAR_SMALL") {
        return (
            <Link
                to={href}
                state={{ article }}
                className="d-flex gap-2 text-decoration-none news-card align-items-start border-bottom pb-2 border-light"
            >
                <div className="flex-shrink-0 news-thumb-sm">
                    <div className="overflow-hidden-card rounded-1 h-100">
                        <img src={thumbSrc} alt={title} className="news-card-img article-img-sm" />
                    </div>
                </div>
                <h6 className="small lh-sm fw-bold font-serif hover-link m-0">
                    {title}
                </h6>
            </Link>
        );
    }

    if (mode === "LIST") {
        return (
            <Link
                to={href}
                state={{ article }}
                className="d-flex flex-column flex-md-row gap-3 py-3 border-bottom text-decoration-none news-card"
            >
                <div className="position-relative overflow-hidden-card flex-shrink-0 rounded-1 news-thumb-list">
                    <img src={thumbSrc} alt={title} className="news-card-img w-100 h-100" />
                </div>
                <div className="d-flex flex-column">
                    <h4 className="fs-5 lh-sm fw-bold font-serif hover-link mb-2">
                        {title}
                    </h4>
                    <p className="small lh-base text-secondary mb-0 font-sans">
                        {description}
                    </p>
                </div>
            </Link>
        );
    }

    return (
        <Link to={href} state={{ article }} className="d-block text-decoration-none news-card h-100">
            <div className="overflow-hidden-card mb-2 rounded-1">
                <img src={thumbSrc} alt={title} className="news-card-img article-img-md" />
            </div>
            <div className="d-flex flex-column">
                {showCategory && (
                    <span className="text-nld-blue fw-bold small text-uppercase mb-1">
                        Xã hội
                    </span>
                )}
                <h6 className="fw-bold font-serif hover-link">{title}</h6>
            </div>
        </Link>
    );
}

export default NewsCard;
