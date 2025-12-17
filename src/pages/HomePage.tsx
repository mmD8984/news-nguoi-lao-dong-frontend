import {useEffect, useState} from 'react';
import {Col, Container, Row} from 'react-bootstrap';
import {Link} from 'react-router-dom';
import NewsCard from '../components/NewsCard';
import TrendingBar from '../components/TrendingBar';
import {getArticles, getHomepageData} from '../services/api';
import type {Article} from '../types';
import {ViewMode} from '../types';

function HomePage() {
    const [allArticles, setAllArticles] = useState<Article[]>([]);
    const [hero, setHero] = useState<Article[]>([]);
    const [hot, setHot] = useState<Article[]>([]);
    const [sidebarHot, setSidebarHot] = useState<Article[]>([]);
    const [loading, setLoading] = useState(true);

    // Lấy data cho trang Home
    useEffect(function () {
        setLoading(true);

        async function load() {
            const homepage = await getHomepageData();
            const all = await getArticles();
            setHero(homepage.hero);
            setHot(homepage.hot);
            setSidebarHot(homepage.sidebarHot);
            setAllArticles(all);
        }

        load().finally(function () {
            setLoading(false);
        });
    }, []);

    // Chuẩn bị data để chia block
    const focusMain: Article | undefined = hero[0] ?? allArticles[0];

    const focusSub: Article[] = [];
    if (hero[1])
        focusSub.push(hero[1]);
    if (hot[0])
        focusSub.push(hot[0]);

    const focusBottom: Article[] = hot.slice(1, 4);

    // Gom các bài đã có ở phần trên, để phần list dưới không bị trùng.
    const usedIds = new Set<string>();
    if (focusMain?.id)
        usedIds.add(focusMain.id);
    for (const a of focusSub)
        usedIds.add(a.id);
    for (const a of focusBottom)
        usedIds.add(a.id);

    const streamArticles: Article[] = [];
    for (const a of allArticles) {
        if (usedIds.has(a.id))
            continue;

        streamArticles.push(a);

        if (streamArticles.length >= 3)
            break;
    }

    const mostViewed = sidebarHot;

    if (loading && allArticles.length === 0) {
        return (
            <div className="font-sans bg-white">
                <Container className="py-4">
                    <div className="text-secondary">Loading...</div>
                </Container>
            </div>
        );
    }

    return (
        <div className="font-sans bg-white">
            <Container className="py-4">
                <Row className="g-4 mb-4">
                    <Col lg={9}>
                        <Row className="g-4">
                            {/* Bài chính */}
                            <Col lg={8}>
                                {focusMain &&
                                    <NewsCard article={focusMain} mode={ViewMode.HERO_TOP_TITLE} showCategory={false}/>}
                            </Col>

                            {/* Bài phụ bên phải */}
                            <Col lg={4}>
                                <div className="d-flex flex-column gap-4">
                                    {focusSub.map(function (sub) {
                                        return <NewsCard key={sub.id} article={sub} mode={ViewMode.FOCUS_SUB}
                                                         showCategory={false}/>;
                                    })}
                                </div>
                            </Col>
                        </Row>

                        {/* 3 bài nhỏ phía dưới */}
                        <div className="border-top mt-4 pt-4">
                            <Row className="g-4">
                                {focusBottom.map(function (article, idx) {
                                    return (
                                        <Col md={4} key={article.id} className={idx !== 2 ? 'border-end' : ''}>
                                            <NewsCard article={article} mode={ViewMode.FOCUS_BOTTOM}
                                                      showCategory={false}/>
                                        </Col>
                                    );
                                })}
                            </Row>
                        </div>
                    </Col>

                    {/* Sidebar: Tin nóng */}
                    <Col lg={3} className="border-start ps-lg-3">
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <h3 className="fw-bold h5 text-dark text-uppercase font-serif m-0">TIN NÓNG</h3>
                        </div>

                        <div className="overflow-auto pe-1 custom-scrollbar home-hot-scroll">
                            {hot.map(function (t, idx) {
                                const itemClass = `py-2 ${idx !== hot.length - 1 ? 'border-bottom' : ''} border-light`;
                                return (
                                    <div key={t.id} className={itemClass}>
                                        <NewsCard article={t} mode={ViewMode.TEXT_ONLY} showCategory={false}/>
                                    </div>
                                );
                            })}
                        </div>
                    </Col>
                </Row>

                {/* Trending */}
                <TrendingBar/>

                {/* Danh sách bài (list) + sidebar Tin đọc nhiều */}
                <Row className="g-4">
                    <Col lg={8} className="border-end-lg-custom pe-lg-4">
                        {streamArticles.map(function (article) {
                            return (
                                <div key={article.id} className="mb-4 pb-4 border-bottom border-light">
                                    <NewsCard article={article} mode={ViewMode.LIST}/>
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

                    {/* Sidebar: Tin đọc nhiều */}
                    <Col lg={4} className="ps-lg-4">
                        <div className="mb-5 sidebar-box">
                            <h5 className="sidebar-header-custom">
                                <Link to="#" className="text-decoration-none">
                                    Tin đọc nhiều
                                </Link>
                            </h5>
                            <div className="d-flex flex-column gap-3">
                                {mostViewed.map(function (art) {
                                    return <NewsCard key={art.id} article={art} mode={ViewMode.SIDEBAR_SMALL}
                                                     showCategory={false}/>;
                                })}
                            </div>
                        </div>
                    </Col>
                </Row>
            </Container>
        </div>
    );
}

export default HomePage;