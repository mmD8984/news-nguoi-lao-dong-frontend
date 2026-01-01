import type { Article, ArticleRSS, ViewMode } from "../types";

type NewsArticle = Article | ArticleRSS;

interface NewsCardProps {
    article: NewsArticle;
    mode: ViewMode;
    showCategory?: boolean;
}

function NewsCard({ article, mode, showCategory = true }: NewsCardProps) {
    // ✅ Adapter: lấy link bài gốc
    const href = "link" in article ? article.link : article.id; // RSS thì article.link có URL
    const coverSrc = "image" in article ? article.image : (article.coverImage || article.thumbnail);
    const thumbSrc = "image" in article ? article.image : (article.thumbnail || article.coverImage);
    const title = article.title;
    const description = article.description;

    const aProps = {
        href,
        target: "_blank",   // mở tab mới
        rel: "noopener noreferrer",
        className: "text-decoration-none text-dark d-block h-100 news-card"
    };

    if (mode === "HERO_TOP_TITLE") {
        return (
            <a {...aProps}>
                <h2 className="news-card__hero-title fw-bold text-dark font-serif mb-3 hover-link">
                    {title}
                </h2>
                <div className="position-relative mb-3 rounded-1 overflow-hidden-card">
                    <img src={coverSrc} alt={title} className="news-card-img article-img-lg" />
                </div>
                <p className="news-card__desc text-dark mb-0">
                    (NLD) - {description}
                </p>
            </a>
        );
    }

    if (mode === "FOCUS_SUB") {
        return (
            <a {...aProps} className="text-decoration-none text-dark d-block news-card">
                <div className="overflow-hidden-card rounded-1 mb-2">
                    <img src={thumbSrc} className="w-100 news-card-img article-img-lg" alt={title} />
                </div>
                <h5 className="news-card__title-sm fw-bold text-dark font-serif hover-link">
                    {title}
                </h5>
            </a>
        );
    }

    if (mode === "FOCUS_BOTTOM") {
        return (
            <a {...aProps} className="text-decoration-none text-dark d-block news-card h-100">
                <h5 className="news-card__title-md fw-bold text-dark font-serif hover-link mb-2">
                    {title}
                </h5>
                <p className="text-secondary small mb-0">
                    (NLD) - {description}
                </p>
            </a>
        );
    }

    if (mode === "SIDEBAR_SMALL") {
        return (
            <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="d-flex gap-2 text-decoration-none news-card align-items-start border-bottom pb-2 border-light"
            >
                <div className="flex-shrink-0 news-thumb-sm">
                    <div className="overflow-hidden-card rounded-1 h-100">
                        <img src={thumbSrc} alt={title} className="news-card-img article-img-sm" />
                    </div>
                </div>
                <h6 className="news-card__title-xs fw-bold text-dark font-serif hover-link m-0">
                    {title}
                </h6>
            </a>
        );
    }

    if (mode === "LIST") {
        return (
            <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="d-flex flex-column flex-md-row gap-3 py-3 border-bottom text-decoration-none news-card"
            >
                <div className="position-relative overflow-hidden-card flex-shrink-0 rounded-1 news-thumb-list">
                    <img src={thumbSrc} alt={title} className="news-card-img w-100 h-100" />
                </div>
                <div className="d-flex flex-column">
                    <h4 className="news-card__list-title fw-bold text-dark hover-link font-serif mb-2">
                        {title}
                    </h4>
                    <p className="news-card__list-desc text-secondary mb-0 font-sans">
                        {description}
                    </p>
                </div>
            </a>
        );
    }

    // Default fallback
    return (
        <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="d-block text-decoration-none news-card h-100"
        >
            <div className="overflow-hidden-card mb-2 rounded-1">
                <img src={thumbSrc} alt={title} className="news-card-img article-img-md" />
            </div>
            <div className="d-flex flex-column">
                {showCategory && (
                    <span className="text-nld-blue fw-bold small text-uppercase mb-1">
                        Xã hội
                    </span>
                )}
                <h6 className="fw-bold text-dark hover-link font-serif">{title}</h6>
            </div>
        </a>
    );
}

export default NewsCard;
