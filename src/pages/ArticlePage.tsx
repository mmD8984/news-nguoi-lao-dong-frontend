import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Alert, Spinner } from 'react-bootstrap';
import { fetchCategoryRSS } from '../services/rss/fetchCategoryRSS';
import type { Article } from '../types';
import { RSS_FEEDS, type RssKey } from '../data/rss';

export default function ArticlePage() {
    const { id } = useParams<{ id: string }>();
    const [article, setArticle] = useState<Article | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!id) return;

        // Tìm bài trong tất cả category RSS
        const loadArticle = async () => {
            setLoading(true);
            setError('');

            try {
                let found: Article | null = null;

                const keys = Object.keys(RSS_FEEDS) as RssKey[];
                for (const key of keys) {
                    const articles = await fetchCategoryRSS(key);
                    const match = articles.find(a => a.slug === id);
                    if (match) {
                        found = match;
                        break;
                    }
                }

                if (found) {
                    setArticle(found);
                    // Redirect sang trang gốc sau 1.2s
                    setTimeout(() => {
                        window.location.href = found.link!;
                    }, 1200);
                } else {
                    setError('Không tìm thấy bài viết.');
                }
            } catch (err) {
                console.error(err);
                setError('Đã xảy ra lỗi khi tải bài viết.');
            } finally {
                setLoading(false);
            }
        };

        loadArticle();
    }, [id]);

    return (
        <div className="bg-white font-sans">
            <Container className="py-4">
                {loading && (
                    <div className="text-center py-5">
                        <Spinner animation="border" role="status" />
                        <div className="text-secondary mt-2">Đang chuyển hướng đến bài gốc...</div>
                    </div>
                )}

                {!loading && error && (
                    <Alert variant="danger">{error}</Alert>
                )}

                {!loading && article && (
                    <Alert variant="info">
                        Bạn sẽ được chuyển hướng đến bài gốc trên <strong>{article.source}</strong> trong giây lát...
                    </Alert>
                )}
            </Container>
        </div>
    );
}
