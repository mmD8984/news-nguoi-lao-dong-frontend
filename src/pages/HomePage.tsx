import React, { useEffect, useState, useCallback, useRef } from "react";
import { Container, Row, Col, Alert, Button, Spinner } from "react-bootstrap";
import NewsCard from "../components/NewsCard";
import TrendingBar from "../components/TrendingBar";
import { RSS_FEEDS } from "../data/rss";
import { ViewMode } from "../types";

interface ArticleRSS {
    id: string;
    title: string;
    link: string;
    description: string;
    pubDate: string;
    image: string;
}

const RSS_URL = RSS_FEEDS.home;
const RSS2JSON_URL = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(
    RSS_URL
)}`;

const HomePage: React.FC = () => {
    const [articles, setArticles] = useState<ArticleRSS[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [lastUpdated, setLastUpdated] = useState("");

    const retryTimer = useRef<any>(null);

    /* ===== Helpers ===== */
    const cleanText = (html: string, maxLength = 150) => {
        const text = html.replace(/<[^>]+>/g, "").trim();
        return text.length > maxLength
            ? text.slice(0, maxLength) + "..."
            : text;
    };

    const extractImage = (html: string) => {
        const match = html.match(/<img[^>]+src="([^">]+)"/i);
        return match ? match[1] : null;
    };

    /* ===== Fetch RSS ===== */
    const fetchRSS = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            const res = await fetch(RSS2JSON_URL);
            if (!res.ok) throw new Error(`HTTP ${res.status}`);

            const data = await res.json();

            const items: ArticleRSS[] = (data.items || []).map(
                (item: any, idx: number) => {
                    const html = item.content || item.description || "";
                    return {
                        id: item.guid || item.link || `rss-${idx}`,
                        title: item.title,
                        link: item.link,
                        description: cleanText(html),
                        pubDate: item.pubDate,
                        image:
                            item.thumbnail ||
                            item.enclosure?.link ||
                            extractImage(html) ||
                            "https://via.placeholder.com/300x200?text=NLĐ",
                    };
                }
            );

            setArticles(items);
            setLastUpdated(new Date().toLocaleString("vi-VN"));
        } catch (err: any) {
            setError(`Lỗi tải tin: ${err.message}`);
            retryTimer.current = setTimeout(fetchRSS, 30000);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchRSS();
        const interval = setInterval(fetchRSS, 5 * 60 * 1000);
        return () => clearInterval(interval);
    }, [fetchRSS]);

    if (loading && articles.length === 0) {
        return (
            <Container className="py-5 text-center">
                <Spinner animation="border" />
            </Container>
        );
    }

    if (error && articles.length === 0) {
        return (
            <Container className="py-4">
                <Alert variant="warning">
                    <h5>⚠️ Không thể tải dữ liệu</h5>
                    <p>{error}</p>
                    <Button onClick={fetchRSS}>Thử lại</Button>
                </Alert>
            </Container>
        );
    }

    /* ===== Layout NLĐ ===== */
    const heroMain = articles[0];
    const heroSide = articles.slice(1, 3);
    const heroBottom = articles.slice(3, 6);
    const hotNews = articles.slice(0, 10);
    const listNews = articles.slice(6, 15);
    const mostViewed = articles.slice(0, 5);

    return (
        <div className="font-sans bg-white">
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
                                    {heroSide.map(a => (
                                        <NewsCard
                                            key={a.id}
                                            article={a}
                                            mode={ViewMode.FOCUS_SUB}
                                            showCategory={false}
                                        />
                                    ))}
                                </div>
                            </Col>
                        </Row>

                        <Row className="g-4 mt-2 border-top pt-3">
                            {heroBottom.map(a => (
                                <Col md={4} key={a.id}>
                                    <NewsCard
                                        article={a}
                                        mode={ViewMode.FOCUS_BOTTOM}
                                        showCategory={false}
                                    />
                                </Col>
                            ))}
                        </Row>
                    </Col>

                    {/* ===== TIN NÓNG ===== */}
                    <Col lg={3} className="border-start ps-lg-3">
                        <h3 className="sidebar-header-custom">Tin nóng</h3>
                        <div className="home-hot-scroll custom-scrollbar overflow-auto">
                            {hotNews.map(a => (
                                <div key={a.id} className="py-2 border-bottom">
                                    <NewsCard
                                        article={a}
                                        mode={ViewMode.TEXT_ONLY}
                                        showCategory={false}
                                    />
                                </div>
                            ))}
                        </div>
                    </Col>
                </Row>

                {/* ===== TRENDING ===== */}
                <TrendingBar />

                {/* ===== LIST + SIDEBAR ===== */}
                <Row className="g-4">
                    <Col lg={8} className="border-end-lg-custom pe-lg-4">
                        {listNews.map(a => (
                            <div key={a.id} className="mb-4 pb-4 border-bottom">
                                <NewsCard article={a} mode={ViewMode.LIST} />
                            </div>
                        ))}
                    </Col>

                    <Col lg={4} className="ps-lg-4">
                        <div className="sidebar-box">
                            <h5 className="sidebar-header-custom">
                                Tin đọc nhiều
                            </h5>
                            <div className="d-flex flex-column gap-3">
                                {mostViewed.map(a => (
                                    <NewsCard
                                        key={a.id}
                                        article={a}
                                        mode={ViewMode.SIDEBAR_SMALL}
                                        showCategory={false}
                                    />
                                ))}
                            </div>
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
