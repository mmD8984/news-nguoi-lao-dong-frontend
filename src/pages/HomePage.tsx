import React, { useEffect, useState, useCallback, useRef } from "react";
import { Container, Row, Col, Alert, Button, Spinner } from "react-bootstrap";
import NewsCard from "../components/NewsCard";
import TrendingBar from "../components/TrendingBar";
import { RSS_FEEDS } from "../data/rss";

interface ArticleRSS {
    id: string;
    title: string;
    link: string;
    description: string;
    pubDate: string;
    image: string;
}
const RSS_URL = RSS_FEEDS.home;
const RSS2JSON_URL = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(RSS_URL)}`;

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
            ? text.slice(0, maxLength).trimEnd() + "..."
            : text;
    };

    /* ===== Fetch RSS ===== */
    const fetchRSS = useCallback(async () => {
        if (retryTimer.current) {
            clearTimeout(retryTimer.current); // Clear retry trước đó nếu còn
            retryTimer.current = null;
        }

        try {
            setLoading(true);
            setError(null);

            const res = await fetch(RSS2JSON_URL, { cache: "no-store" });
            if (!res.ok) throw new Error(`HTTP ${res.status}`);

            const data = await res.json();
            const items: ArticleRSS[] = (data.items || [])
                .slice(0, 20)
                .map((item: any, idx: number) => ({
                    id: item.guid || item.link || `rss-${idx}`,
                    title: item.title || "Không có tiêu đề",
                    link: item.link || "#",
                    description: cleanText(item.content || item.description || ""),
                    pubDate: item.pubDate || new Date().toISOString(),
                    image:
                        item.thumbnail ||
                        item.enclosure?.link ||
                        "https://via.placeholder.com/300x200?text=NLĐ",
                }));

            setArticles(items);
            setLastUpdated(new Date().toLocaleString("vi-VN"));
        } catch (err: any) {
            setError(`Lỗi tải tin: ${err.message}`);
            // Retry 30s sau khi fetch lỗi
            retryTimer.current = setTimeout(fetchRSS, 30000);
        } finally {
            setLoading(false);
        }
    }, []);

    /* ===== Lifecycle ===== */
    useEffect(() => {
        fetchRSS();

        const interval = setInterval(fetchRSS, 5 * 60 * 1000);
        return () => {
            clearInterval(interval);
            if (retryTimer.current) clearTimeout(retryTimer.current);
        };
    }, [fetchRSS]);

    /* ===== Loading ===== */
    if (loading) {
        return (
            <Container className="py-4 text-center">
                <Spinner animation="border" className="mb-3" />
                <h4>Đang cập nhật tin mới nhất</h4>
                <small className="text-muted">NLĐ - Xã hội</small>
            </Container>
        );
    }

    /* ===== Error ===== */
    if (error && articles.length === 0) {
        return (
            <Container className="py-4">
                <Alert variant="warning">
                    <h5>⚠️ Không thể tải dữ liệu</h5>
                    <p>{error}</p>
                    <Button variant="outline-primary" onClick={fetchRSS}>
                        Thử lại
                    </Button>
                </Alert>
            </Container>
        );
    }

    /* ===== Layout Data ===== */
    const mainArticle = articles[0];
    const subArticles = articles.slice(1, 3);
    const bottomArticles = articles.slice(3, 6);
    const streamArticles = articles.slice(6, 12);
    const sidebarHot = articles.slice(0, 5);

    return (
        <div className="bg-white">
            <Container className="py-4">
                {/* Header */}
                <div className="d-flex justify-content-between align-items-center mb-4 pb-3 border-bottom">
                    <h2 className="fw-bold text-primary mb-0">
                        Tin Xã Hội <small className="text-muted">(NLĐ)</small>
                    </h2>
                    <div className="small text-muted">
                        Cập nhật: {lastUpdated}
                        <Button
                            size="sm"
                            variant="link"
                            className="ms-2 p-0"
                            onClick={fetchRSS}
                        >
                            🔄 Mới nhất
                        </Button>
                    </div>
                </div>

                {/* Hero + Sub */}
                <Row className="g-4 mb-4">
                    <Col lg={8}>
                        {mainArticle && (
                            <NewsCard
                                article={mainArticle}
                                mode="HERO_TOP_TITLE"
                                showCategory={false}
                            />
                        )}
                    </Col>
                    <Col lg={4}>
                        <div className="d-flex flex-column gap-4">
                            {subArticles.map((art) => (
                                <NewsCard
                                    key={art.id}
                                    article={art}
                                    mode="FOCUS_SUB"
                                    showCategory={false}
                                />
                            ))}
                        </div>
                    </Col>
                </Row>

                {/* Bottom 3 */}
                <Row className="g-4 mb-4">
                    {bottomArticles.map((art) => (
                        <Col md={4} key={art.id}>
                            <NewsCard
                                article={art}
                                mode="FOCUS_BOTTOM"
                                showCategory={false}
                            />
                        </Col>
                    ))}
                </Row>

                <TrendingBar />

                {/* Stream + Sidebar */}
                <Row className="g-4 mt-4">
                    <Col lg={8}>
                        {streamArticles.map((art) => (
                            <div
                                key={art.id}
                                className="mb-4 pb-4 border-bottom border-light"
                            >
                                <NewsCard
                                    article={art}
                                    mode="LIST"
                                    showCategory={false}
                                />
                            </div>
                        ))}
                        <div className="text-center my-5">
                            <button className="btn btn-light border fw-bold text-secondary px-5 rounded-pill">
                                Xem thêm
                            </button>
                        </div>
                    </Col>

                    <Col lg={4}>
                        <h5 className="sidebar-header-custom mb-3">
                            Tin nóng
                        </h5>
                        <div className="d-flex flex-column gap-3">
                            {sidebarHot.map((art) => (
                                <NewsCard
                                    key={art.id}
                                    article={art}
                                    mode="SIDEBAR_SMALL"
                                    showCategory={false}
                                />
                            ))}
                        </div>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default HomePage;
