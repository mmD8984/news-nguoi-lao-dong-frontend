import {Link} from "react-router-dom";
import type {Article} from "../types";
import {ViewMode} from "../types";

interface NewsCardProps {
    article: Article;
    mode: ViewMode;
    showCategory?: boolean;
}

function NewsCard({article, mode, showCategory = true,}: NewsCardProps) {
    const href = `/article/${article.id}`;
    const coverSrc = article.coverImage || article.thumbnail;
    const thumbSrc = article.thumbnail || article.coverImage;

    if (mode === ViewMode.HERO_TOP_TITLE) {
        return (
            <Link
                to={href}
                className="text-decoration-none text-dark d-block h-100 news-card"
            >
                <h2 className="news-card__hero-title fw-bold text-dark font-serif mb-3 hover-link">
                    {article.title}
                </h2>
                <div className="position-relative mb-3 rounded-1 overflow-hidden-card">
                    <img
                        src={coverSrc}
                        alt={article.title}
                        className="news-card-img article-img-lg"
                    />
                </div>
                <p className="news-card__desc text-dark mb-0">
                    (NLD) - {article.description}
                </p>
            </Link>
        );
    }

    if (mode === ViewMode.FOCUS_SUB) {
        return (
            <Link
                to={href}
                className="text-decoration-none text-dark d-block news-card"
            >
                <div className="overflow-hidden-card rounded-1 mb-2">
                    <img
                        src={thumbSrc}
                        className="w-100 news-card-img article-img-lg"
                        alt={article.title}
                    />
                </div>
                <h5 className="news-card__title-sm fw-bold text-dark font-serif hover-link">
                    {article.title}
                </h5>
            </Link>
        );
    }

    if (mode === ViewMode.FOCUS_BOTTOM) {
        return (
            <Link
                to={href}
                className="text-decoration-none text-dark d-block news-card h-100"
            >
                <h5 className="news-card__title-md fw-bold text-dark font-serif hover-link mb-2">
                    {article.title}
                </h5>
                <p className="text-secondary small mb-0">
                    (NLD) - {article.description}
                </p>
            </Link>
        );
    }

    if (mode === ViewMode.SIDEBAR_SMALL) {
        return (
            <Link
                to={href}
                className="d-flex gap-2 text-decoration-none news-card align-items-start border-bottom pb-2 border-light"
            >
                <div className="flex-shrink-0 news-thumb-sm">
                    <div className="overflow-hidden-card rounded-1 h-100">
                        <img
                            src={thumbSrc}
                            alt={article.title}
                            className="news-card-img article-img-sm"
                        />
                    </div>
                </div>
                <h6 className="news-card__title-xs fw-bold text-dark font-serif hover-link m-0">
                    {article.title}
                </h6>
            </Link>
        );
    }

    if (mode === ViewMode.CATEGORY_HERO) {
        return (
            <Link to={href} className="d-block text-decoration-none news-card">
                <div className="row g-3">
                    <div className="col-md-7">
                        <div className="overflow-hidden-card rounded-1 category-hero-thumb">
                            <img
                                src={coverSrc}
                                alt={article.title}
                                className="news-card-img w-100 h-100 object-fit-cover"
                            />
                        </div>
                    </div>
                    <div className="col-md-5 d-flex flex-column justify-content-center">
                        <h2 className="news-card__category-hero-title fw-bold text-dark font-serif hover-link mb-2">
                            {article.title}
                        </h2>
                        <p className="news-card__category-hero-desc text-secondary mb-2">
                            (NLD) - {article.description}
                        </p>
                    </div>
                </div>
            </Link>
        );
    }

    if (mode === ViewMode.CATEGORY_GRID) {
        return (
            <Link to={href} className="d-block text-decoration-none news-card h-100">
                <div className="overflow-hidden-card mb-2 rounded-1">
                    <img
                        src={thumbSrc}
                        alt={article.title}
                        className="news-card-img article-img-lg"
                    />
                </div>
                <h5 className="news-card__title-grid fw-bold text-dark font-serif hover-link">
                    {article.title}
                </h5>
            </Link>
        );
    }

    if (mode === ViewMode.DONT_MISS) {
        return (
            <Link to={href} className="d-block text-decoration-none news-card h-100">
                <div className="overflow-hidden-card mb-2 rounded-1">
                    <img
                        src={thumbSrc}
                        alt={article.title}
                        className="news-card-img article-img-md"
                    />
                </div>
                <h5 className="news-card__title-dont-miss fw-bold text-dark font-serif hover-link">
                    {article.title}
                </h5>
            </Link>
        );
    }

    if (mode === ViewMode.TEXT_ONLY) {
        return (
            <Link
                to={href}
                className="text-decoration-none d-block py-2 border-bottom news-card"
            >
                <h6 className="text-dark mb-0 hover-link font-serif fw-normal news-card__text-only-title">
                    {article.title}
                </h6>
            </Link>
        );
    }

    if (mode === ViewMode.LIST) {
        return (
            <Link
                to={href}
                className="d-flex flex-column flex-md-row gap-3 py-3 border-bottom text-decoration-none news-card"
            >
                <div className="position-relative overflow-hidden-card flex-shrink-0 rounded-1 news-thumb-list">
                    <img
                        src={thumbSrc}
                        alt={article.title}
                        className="news-card-img w-100 h-100"
                    />
                </div>
                <div className="d-flex flex-column">
                    <h4 className="news-card__list-title fw-bold text-dark hover-link font-serif mb-2">
                        {article.title}
                    </h4>
                    <p className="news-card__list-desc text-secondary mb-0 font-sans">
                        {article.description}
                    </p>
                </div>
            </Link>
        );
    }

    if (mode === ViewMode.SEARCH_RESULT) {
        return (
            <Link
                to={href}
                className="d-flex flex-column flex-md-row gap-3 py-3 border-bottom text-decoration-none news-card"
            >
                <div className="flex-shrink-0 news-thumb-search">
                    <img
                        src={thumbSrc}
                        className="w-100 h-100 rounded article-img-sm"
                        alt={article.title}
                    />
                </div>
                <div>
                    <h5 className="fw-bold text-dark font-serif hover-link">
                        {article.title}
                    </h5>
                    <p className="text-secondary small line-clamp-2">
                        {article.description}
                    </p>
                </div>
            </Link>
        );
    }

    return (
        <Link to={href} className="d-block text-decoration-none news-card h-100">
            <div className="overflow-hidden-card mb-2 rounded-1">
                <img
                    src={thumbSrc}
                    alt={article.title}
                    className="news-card-img article-img-md"
                />
            </div>
            <div className="d-flex flex-column">
                {showCategory && (
                    <span className="text-nld-blue fw-bold small text-uppercase mb-1">
            {article.categoryName}
          </span>
                )}
                <h6 className="fw-bold text-dark hover-link font-serif">
                    {article.title}
                </h6>
            </div>
        </Link>
    );
}

export default NewsCard;
