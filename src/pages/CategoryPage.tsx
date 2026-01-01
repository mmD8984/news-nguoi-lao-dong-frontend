import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Col, Container, Row } from "react-bootstrap";

import NewsCard from "../components/NewsCard";
import TrendingBar from "../components/TrendingBar";

import type { Article, NavItem } from "../types";
import { ViewMode } from "../types";

import { getCategories } from "../services/api";
import { fetchCategoryRSS } from "../services/rss/fetchCategoryRSS.ts";
import type { RssKey } from "../data/rss";

function CategoryPage() {
    const { category, subCategory } = useParams<{
        category?: string;
        subCategory?: string;
    }>();

    const [categories, setCategories] = useState<NavItem[]>([]);
    const [articles, setArticles] = useState<Article[]>([]);
    const [allArticles, setAllArticles] = useState<Article[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);

        async function load() {
            const nav = await getCategories();
            setCategories(nav);

            const key = (subCategory || category) as RssKey;
            if (!key) {
                setArticles([]);
                setAllArticles([]);
                return;
            }

            const rssArticles = await fetchCategoryRSS(key);

            setArticles(rssArticles);
            setAllArticles(rssArticles);
        }

        load().finally(() => setLoading(false));
    }, [category, subCategory]);


    const currentCategoryPath = category ? `/${category}` : "";
    const currentCategory = categories.find(
        (c) => c.path === currentCategoryPath
    );

    const displayTitle =
        currentCategory?.label ||
        category?.replaceAll("-", " ") ||
        "Tin tức";

    const subNavItems = currentCategory?.subItems ?? [];

    // ===== Layout chia bài =====
    const heroArticle = articles[0];
    const subHeroArticles = articles.slice(1, 4);
    const mainStreamArticles = articles.slice(4, 9);

    const shownIds = useMemo(() => {
        const set = new Set<string>();
        articles.slice(0, 9).forEach((a) => set.add(a.id));
        return set;
    }, [articles]);

    // Bài liên quan
    const relatedArticles = useMemo(() => {
        const out: Article[] = [];
        for (const a of allArticles) {
            if (shownIds.has(a.id)) continue;
            out.push(a);
            if (out.length >= 4) break;
        }
        return out;
    }, [allArticles, shownIds]);

    // Sidebar boxes
    const sidebarBoxes = useMemo(() => {
        const list = [
            { title: subNavItems[0]?.label, data: articles.slice(2, 5) },
            { title: subNavItems[1]?.label, data: articles.slice(5, 8) },
            { title: subNavItems[2]?.label, data: articles.slice(0, 3) },
        ];

        return list.filter(
            (box) => Boolean(box.title) && box.data.length > 0
        );
    }, [articles, subNavItems]);

    return (
        <div className="font-sans bg-white">
            {/* ===== Header ===== */}
            <div className="border-bottom mb-4">
                <Container>
                    <div className="py-3 d-flex align-items-center">
                        <div className="flex-shrink-0 me-4">
                            <Link
                                to={currentCategoryPath || "/"}
                                className="text-decoration-none"
                            >
                                <h1 className="h2 fw-bold text-nld-red m-0 font-serif">
                                    {displayTitle}
                                </h1>
                            </Link>
                        </div>

                        <div className="flex-grow-1 border-start ps-4">
                            <div className="d-flex flex-wrap gap-3">
                                {subNavItems.map((item) => (
                                    <Link
                                        key={item.path}
                                        to={item.path}
                                        className="text-secondary fw-bold text-decoration-none hover-link"
                                    >
                                        {item.label}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>
                </Container>
            </div>

            {/* ===== Content ===== */}
            <Container>
                {loading ? (
                    <p className="text-secondary mb-4">Loading...</p>
                ) : articles.length === 0 ? (
                    <p className="text-muted mb-4">
                        Chưa có dữ liệu RSS cho chuyên mục này.
                    </p>
                ) : (
                    <>
                        {/* ===== Focus ===== */}
                        <div className="mb-4 pb-4 border-bottom">
                            {heroArticle && (
                                <div className="mb-4">
                                    <Row className="g-4 align-items-stretch">
                                        {/* ===== Image (70%) ===== */}
                                        <Col lg={8} md={7}>
                                            <Link
                                                to={`/article/${heroArticle.id}`}
                                                className="d-block h-100 overflow-hidden rounded-2"
                                            >
                                                <img
                                                    src={heroArticle.coverImage || heroArticle.thumbnail}
                                                    alt={heroArticle.title}
                                                    className="w-100 h-100 object-fit-cover"
                                                    style={{ minHeight: 320 }}
                                                />
                                            </Link>
                                        </Col>

                                        {/* ===== Content (30%) ===== */}
                                        <Col lg={4} md={5}>
                                            <div className="d-flex flex-column h-100">
                                                <Link
                                                    to={`/article/${heroArticle.id}`}
                                                    className="text-decoration-none"
                                                >
                                                    <h2 className="fw-bold text-dark hover-link mb-3">
                                                        {heroArticle.title}
                                                    </h2>
                                                </Link>

                                                {heroArticle.description && (
                                                    <p className="text-secondary fs-6">
                                                        {heroArticle.description}
                                                    </p>
                                                )}

                                                <div className="mt-auto">
                                                    <Link
                                                        to={`/article/${heroArticle.id}`}
                                                        className="fw-bold text-nld-red text-decoration-none"
                                                    >
                                                        Đọc tiếp →
                                                    </Link>
                                                </div>
                                            </div>
                                        </Col>
                                    </Row>
                                </div>
                            )}


                            <Row className="g-4">
                                {subHeroArticles.map((art, idx) => (
                                    <Col
                                        md={4}
                                        key={art.id}
                                        className={idx < 2 ? "border-end border-light" : ""}
                                    >
                                        <NewsCard
                                            article={art}
                                            mode={ViewMode.CATEGORY_GRID}
                                            showCategory={false}
                                        />
                                    </Col>
                                ))}
                            </Row>
                        </div>

                        <TrendingBar />

                        <Row className="g-4">
                            {/* ===== Main ===== */}
                            <Col lg={8} className="pe-lg-4">
                                {mainStreamArticles.map((a) => (
                                    <div
                                        key={a.id}
                                        className="mb-4 pb-4 border-bottom border-light"
                                    >
                                        <NewsCard article={a} mode={ViewMode.LIST} />
                                    </div>
                                ))}
                            </Col>

                            {/* ===== Sidebar ===== */}
                            <Col lg={4}>
                                {sidebarBoxes.map((box) => (
                                    <div key={box.title} className="mb-5">
                                        <h5 className="sidebar-header-custom">
                                            {box.title}
                                        </h5>
                                        <div className="d-flex flex-column gap-3">
                                            {box.data.map((art) => (
                                                <NewsCard
                                                    key={art.id}
                                                    article={art}
                                                    mode={ViewMode.SIDEBAR_SMALL}
                                                    showCategory={false}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </Col>
                        </Row>

                        {/* ===== Related ===== */}
                        {relatedArticles.length > 0 && (
                            <div className="mt-5 pt-4 border-top">
                                <h5 className="sidebar-header-custom mb-3">
                                    Bài liên quan
                                </h5>
                                <Row className="g-3">
                                    {relatedArticles.map((a) => (
                                        <Col md={6} key={a.id}>
                                            <Link
                                                to={`/article/${a.id}`}
                                                className="text-decoration-none d-flex gap-3"
                                            >
                                                <div className="overflow-hidden rounded-1 flex-shrink-0">
                                                    <img
                                                        src={a.thumbnail}
                                                        alt={a.title}
                                                        className="article-img-sm w-100 h-100 object-fit-cover"
                                                    />
                                                </div>
                                                <div className="d-flex align-items-center">
                                                    <h6 className="m-0 fw-bold text-dark hover-link">
                                                        {a.title}
                                                    </h6>
                                                </div>
                                            </Link>
                                        </Col>
                                    ))}
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
