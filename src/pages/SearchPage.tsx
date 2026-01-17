import { useEffect, useState } from "react";
import { Col, Container, Row, Spinner } from "react-bootstrap";
import { useSearchParams } from "react-router-dom";

import NewsCard from "../components/NewsCard";
import { RSS_FEEDS } from "../data/rss";
import type { Article } from "../types/types.ts";
import { ViewMode } from "../types/types.ts";

const RSS2JSON = "https://api.rss2json.com/v1/api.json";

function extractImageAndCleanDescription(desc?: string): {
    image: string | null;
    cleanDescription: string;
} {
    if (!desc) {
        return { image: null, cleanDescription: "" };
    }

    const imgMatch = desc.match(/<img[^>]+src="([^">]+)"/i);
    const image = imgMatch ? imgMatch[1] : null;

    const cleanDescription = desc
        .replace(/<a[^>]*>\s*<img[^>]*>\s*<\/a>/gi, "")
        .replace(/<img[^>]*>/gi, "")
        .trim();

    return { image, cleanDescription };
}

function SearchPage() {
    const [searchParams] = useSearchParams();
    const query = (searchParams.get("q") || "").trim().toLowerCase();

    const [results, setResults] = useState<Article[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!query) {
            setResults([]);
            return;
        }

        async function fetchAndSearch() {
            try {
                setLoading(true);

                const res = await fetch(
                    `${RSS2JSON}?rss_url=${encodeURIComponent(RSS_FEEDS.home)}`
                );
                const data = await res.json();

                const articles: Article[] = (data.items || []).map(
                    (item: any, idx: number): Article => {
                        const { image, cleanDescription } =
                            extractImageAndCleanDescription(item.description);

                        return {
                            id: item.guid || item.link || `search-${idx}`,
                            title: item.title,
                            slug: "",

                            categorySlug: "tim-kiem",
                            categoryName: "Tìm kiếm",

                            description: cleanDescription,
                            content: item.content || cleanDescription,

                            thumbnail:
                                image ||
                                item.thumbnail ||
                                item.enclosure?.link ||
                                "https://via.placeholder.com/300x200?text=NLĐ",

                            coverImage:
                                image ||
                                item.thumbnail ||
                                item.enclosure?.link ||
                                "https://via.placeholder.com/600x400?text=NLĐ",

                            author: item.author || "Báo Người Lao Động",
                            source: "nld.com.vn",
                            publishedAt: item.pubDate,

                            tags: [],
                            isFeatured: false,
                            isHot: false,
                            link: item.link,
                        };
                    }
                );

                const filtered = articles.filter(
                    (a) =>
                        a.title.toLowerCase().includes(query) ||
                        a.description.toLowerCase().includes(query)
                );

                setResults(filtered);
            } catch (error) {
                console.error("Search RSS error:", error);
                setResults([]);
            } finally {
                setLoading(false);
            }
        }

        fetchAndSearch();
    }, [query]);

    return (
        <Container className="py-4 font-sans">
            {/* ===== Header ===== */}
            <div className="d-flex align-items-center gap-2 mb-2 border-start border-4 border-primary ps-3">
                <h4 className="fw-bold text-nld-blue m-0">
                    Kết quả tìm kiếm:
                </h4>
                <span className="h4 fw-bold text-dark m-0">{query}</span>
            </div>
            <hr className="text-primary opacity-100 mb-4" />

            {/* ===== Content ===== */}
            <Row className="g-4">
                <Col lg={8}>
                    {loading ? (
                        <Spinner animation="border" />
                    ) : results.length > 0 ? (
                        results.map((article) => (
                            <NewsCard
                                key={article.id}
                                article={article}
                                mode={ViewMode.SEARCH_RESULT}
                            />
                        ))
                    ) : (
                        <p className="text-muted">
                            Không tìm thấy kết quả nào cho “{query}”.
                        </p>
                    )}
                </Col>

                <Col lg={4} />
            </Row>
        </Container>
    );
}

export default SearchPage;
