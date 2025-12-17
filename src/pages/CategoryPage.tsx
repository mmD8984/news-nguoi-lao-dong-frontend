import {useEffect, useMemo, useState} from 'react';
import {Link, useParams} from 'react-router-dom';
import {Col, Container, Row} from 'react-bootstrap';
import NewsCard from '../components/NewsCard';
import TrendingBar from '../components/TrendingBar';
import {ViewMode, type Article, type NavItem} from '../types';
import {getArticles, getArticlesByCategory, getCategories} from '../services/api';

function buildCurrentSlug(category?: string, subCategory?: string) {
    const parts: string[] = [];
    if (category) parts.push(category);
    if (subCategory) parts.push(subCategory);
    return parts.join('/');
}

function CategoryPage() {
    const {category, subCategory} = useParams<{ category?: string; subCategory?: string }>();

    const [categories, setCategories] = useState<NavItem[]>([]);
    const [articles, setArticles] = useState<Article[]>([]);
    const [allArticles, setAllArticles] = useState<Article[]>([]);
    const [loading, setLoading] = useState(true);

    // Slug dạng: "quoc-te" hoặc "quoc-te/nguoi-viet-do-day"
    const currentSlug = useMemo(
        function () {
            return buildCurrentSlug(category, subCategory);
        },
        [category, subCategory]
    );

    useEffect(
        () => {
            setLoading(true);

            async function load() {
                const nav = await getCategories();
                const list = currentSlug
                    ? await getArticlesByCategory(currentSlug)
                    : await getArticles();
                const all = await getArticles();

                setCategories(nav);
                setArticles(list);
                setAllArticles(all);
            }

            load().finally(function () {
                setLoading(false);
            });
        },
        [currentSlug]
    );

    const currentCategoryPath = category ? `/${category}` : '';
    const currentCategory = categories.find((c) => c.path === currentCategoryPath);

    const displayTitle = currentCategory?.label
        || category?.replaceAll('-', ' ')
        || 'Tin tức';
    const subNavItems = currentCategory?.subItems ?? [];

    // Chia layout trên trang Category
    const heroArticle = articles[0];
    const subHeroArticles = articles.slice(1, 4);
    const mainStreamArticles = articles.slice(4, 9);

    const shownIds = useMemo(
        function () {
            const set = new Set<string>();
            const list = articles.slice(0, 9);
            for (const a of list)
                set.add(a.id);
            return set;
        },
        [articles]
    );

    // Bank bài liên quan: cùng category hoặc cùng prefix (quoc-te/*)
    const relatedBank = useMemo(
        function () {
            if (!category)
                return [];

            const out: Article[] = [];

            if (subCategory) {
                for (const a of allArticles) {
                    if (a.categorySlug === currentSlug)
                        out.push(a);
                }
                return out;
            }

            const prefix = `${category}/`;
            for (const a of allArticles) {
                if (a.categorySlug === category)
                    out.push(a);
                else if (a.categorySlug.startsWith(prefix))
                    out.push(a);
            }
            return out;
        },
        [allArticles, category, currentSlug, subCategory]
    );

    const relatedArticles = useMemo(
        function () {
            const out: Article[] = [];
            for (const a of relatedBank) {
                if (shownIds.has(a.id)) continue;
                out.push(a);
                if (out.length >= 4) break;
            }
            return out;
        },
        [relatedBank, shownIds]
    );

    // Sidebar box: chỉ show khi có title + có data
    const sidebarBoxes = useMemo(
        function () {
            const list = [
                {title: subNavItems[0]?.label, data: articles.slice(2, 5)},
                {title: subNavItems[1]?.label, data: articles.slice(5, 8)},
                {title: subNavItems[2]?.label, data: articles.slice(0, 3)}
            ];

            return list.filter(function (box) {
                return Boolean(box.title) && box.data.length > 0;
            });
        },
        [articles, subNavItems]
    );

    return (
        <div className="font-sans bg-white">
            <div className="border-bottom mb-4">
                <Container>
                    <div className="py-3 d-flex align-items-center">
                        <div className="flex-shrink-0 me-4">
                            <Link to={currentCategoryPath || '/'} className="text-decoration-none">
                                <h1 className="h2 fw-bold text-nld-red m-0 font-serif category-page__title">{displayTitle}</h1>
                            </Link>
                        </div>

                        <div className="flex-grow-1 border-start ps-4">
                            <div className="d-flex flex-wrap gap-3 category-sub-nav">
                                {subNavItems.map(function (item) {
                                    return (
                                        <Link
                                            key={`${item.label}-${item.path}`}
                                            to={item.path}
                                            className="category-nav-link text-secondary fw-bold text-decoration-none hover-link"
                                        >
                                            {item.label}
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </Container>
            </div>

            <Container>
                {loading ? (
                    <p className="text-secondary mb-4">Loading...</p>
                ) : articles.length === 0 ? (
                    <p className="text-muted mb-4">Chưa có dữ liệu mock cho chuyên mục này.</p>
                ) : (
                    <>
                        {/* Khối focus đầu trang (hero + 3 bài grid) */}
                        <div className="mx-auto mb-4 pb-4 border-bottom category-page__focus">
                            <div className="mb-4">
                                {heroArticle && <NewsCard article={heroArticle} mode={ViewMode.CATEGORY_HERO}
                                                          showCategory={false}/>}
                            </div>

                            <Row className="g-4">
                                {subHeroArticles.map(function (art, idx) {
                                    return (
                                        <Col md={4} key={art.id} className={idx < 2 ? 'border-end border-light' : ''}>
                                            <NewsCard article={art} mode={ViewMode.CATEGORY_GRID} showCategory={false}/>
                                        </Col>
                                    );
                                })}
                            </Row>
                        </div>

                        {/* Trending */}
                        <TrendingBar/>

                        <Row className="g-4">
                            {/* Main list */}
                            <Col lg={8} className="border-end-lg-custom pe-lg-4">
                                {mainStreamArticles.map(function (a) {
                                    return (
                                        <div key={a.id} className="mb-4 pb-4 border-bottom border-light">
                                            <NewsCard article={a} mode={ViewMode.LIST}/>
                                        </div>
                                    );
                                })}
                                <div className="text-center mt-5 mb-5">
                                    <button
                                        className="btn btn-light border fw-bold text-secondary px-5 rounded-pill hover-shadow">Xem
                                        thêm
                                    </button>
                                </div>
                            </Col>

                            {/* Sidebar boxes */}
                            <Col lg={4} className="ps-lg-4">
                                {sidebarBoxes.map(function (box) {
                                    return (
                                        <div key={box.title} className="mb-5 sidebar-box">
                                            <h5 className="sidebar-header-custom">
                                                <Link to="#" className="text-decoration-none">
                                                    {box.title}
                                                </Link>
                                            </h5>
                                            <div className="d-flex flex-column gap-3">
                                                {box.data.map(function (art) {
                                                    return (
                                                        <NewsCard key={art.id} article={art}
                                                                  mode={ViewMode.SIDEBAR_SMALL} showCategory={false}/>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    );
                                })}
                            </Col>
                        </Row>

                        {/* Bài liên quan */}
                        {relatedArticles.length > 0 && (
                            <div className="mt-5 pt-4 border-top category-related">
                                <h5 className="sidebar-header-custom mb-3">
                                    <span className="text-decoration-none">Bài liên quan</span>
                                </h5>
                                <Row className="g-3">
                                    {relatedArticles.map(function (a) {
                                        return (
                                            <Col md={6} key={a.id}>
                                                <Link to={`/article/${a.id}`}
                                                      className="category-related__item text-decoration-none d-flex gap-3">
                                                    <div
                                                        className="category-related__thumb overflow-hidden rounded-1 flex-shrink-0">
                                                        <img src={a.thumbnail} alt={a.title}
                                                             className="article-img-sm w-100 h-100 object-fit-cover"/>
                                                    </div>
                                                    <div className="d-flex align-items-center">
                                                        <h6 className="m-0 fw-bold text-dark font-serif hover-link category-related__title">{a.title}</h6>
                                                    </div>
                                                </Link>
                                            </Col>
                                        );
                                    })}
                                </Row>
                            </div>
                        )}
                    </>
                )}
            </Container>
        </div>
    );
}

export default CategoryPage;
