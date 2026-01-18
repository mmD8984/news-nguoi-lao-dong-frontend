import { useEffect, useState } from "react";
import { Container, Row, Col, Alert, Spinner } from "react-bootstrap";
import NewsCard from "@/components/NewsCard";
import VipSection from "@/components/VipSection";
import TrendingBar from "@/components/TrendingBar";
import { ViewMode } from "@/types/types.ts";
import type { Article } from "@/types/types.ts";
import { fetchHomeRSS } from "@/services/rss/fetchHomeRSS";

function HomePage() {
    const [articles, setArticles] = useState<Article[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [lastUpdated, setLastUpdated] = useState("");

    useEffect(() => {
        const load = async () => {
            try {
                setLoading(true);
                setError(null);

                const data = await fetchHomeRSS();
                setArticles(data);
                setLastUpdated(new Date().toLocaleString("vi-VN"));
            } catch {
                setError("Không thể tải dữ liệu trang chủ");
            } finally {
                setLoading(false);
            }
        };

        load();
    }, []);

    /* ===== UI trạng thái ===== */
    if (loading) {
        return (
            <Container className="py-5 text-center">
                <Spinner animation="border" />
            </Container>
        );
    }

    if (error) {
        return (
            <Container className="py-4">
                <Alert variant="warning">{error}</Alert>
            </Container>
        );
    }

    /* ===== CHỈ chia dữ liệu để render ===== */
    const heroMain = articles[0];
    const heroSide = articles.slice(1, 3);
    const heroBottom = articles.slice(3, 6);
    const hotNews = articles.slice(0, 10);
    const listNews = articles.slice(6, 16);
    const mostViewed = articles.slice(0, 5);

    return (
        <div className="bg-white">
            <Container className="py-3">
                {/* ===== HERO ===== */}
                <Row className="g-4 mb-4">
                    <Col lg={9}>
                        <Row className="g-4">
                            <Col lg={8}>
                                {heroMain && (
                                    <NewsCard
                                        article={heroMain}
                                        mode={ViewMode.HERO_TOP_TITLE}
                                        showCategory={false}
                                    />
                                )}
                            </Col>

                            <Col lg={4}>
                                <div className="d-flex flex-column gap-4">
                                    {heroSide.map(item => (
                                        <NewsCard
                                            key={item.id}
                                            article={item}
                                            mode={ViewMode.FOCUS_SUB}
                                            showCategory={false}
                                        />
                                    ))}
                                </div>
                            </Col>
                        </Row>

                        <Row className="g-4 mt-2 border-top pt-3">
                            {heroBottom.map(item => (
                                <Col md={4} key={item.id}>
                                    <NewsCard
                                        article={item}
                                        mode={ViewMode.FOCUS_BOTTOM}
                                        showCategory={false}
                                    />
                                </Col>
                            ))}
                        </Row>
                    </Col>

                    {/* ===== TIN NÓNG ===== */}
                    <Col lg={3} className="border-start ps-lg-3">
                        <h3 className="fw-bold font-serif text-uppercase text-nld-blue border-bottom border-2 pb-2 mb-3 d-inline-block border-primary">Tin nóng</h3>
                        <div className="home-hot-scroll overflow-auto">
                            {hotNews.map(item => (
                                <div
                                    key={item.id}
                                    className="py-2 border-bottom"
                                >
                                    <NewsCard
                                        article={item}
                                        mode={ViewMode.TEXT_ONLY}
                                        showCategory={false}
                                    />
                                </div>
                            ))}
                        </div>
                    </Col>
                </Row>
            </Container>

            {/* Phần nội dung dành cho hội viên */}
            <VipSection />

            <Container className="py-3">
                <TrendingBar />

                <Row className="g-4">
                    <Col lg={8} className="pe-lg-4">
                        {listNews.map(item => (
                            <div
                                key={item.id}
                                className="mb-4 pb-4 border-bottom"
                            >
                                <NewsCard
                                    article={item}
                                    mode={ViewMode.LIST}
                                />
                            </div>
                        ))}
                    </Col>

                    <Col lg={4} className="ps-lg-4">
                        <h5 className="fw-bold font-serif text-uppercase text-nld-blue border-bottom border-2 pb-2 mb-3 d-inline-block border-primary">
                            Tin đọc nhiều
                        </h5>
                        <div className="d-flex flex-column gap-3">
                            {mostViewed.map(item => (
                                <NewsCard
                                    key={item.id}
                                    article={item}
                                    mode={ViewMode.SIDEBAR_SMALL}
                                    showCategory={false}
                                />
                            ))}
                        </div>
                    </Col>
                </Row>

                <div className="text-muted small mt-4">
                    Cập nhật: {lastUpdated}
                </div>
            </Container>
        </div>
    );
};

export default HomePage;
