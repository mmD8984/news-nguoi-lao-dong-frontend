import {useEffect, useState} from 'react';
import {Col, Container, Row} from 'react-bootstrap';
import {useSearchParams} from 'react-router-dom';
import NewsCard from '../components/NewsCard';
import {searchArticles} from '../services/api';
import type {Article} from '../types';
import {ViewMode} from '../types';

function SearchPage() {
    const [searchParams] = useSearchParams();
    const query = searchParams.get('q') || '';

    const [results, setResults] = useState<Article[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);

        searchArticles(query)
            .then(setResults)
            .finally(() => setLoading(false));
    }, [query]);

    return (
        <Container className="py-4 font-sans">
            <div className="d-flex align-items-center gap-2 mb-2 border-start border-4 border-primary ps-3">
                <h4 className="fw-bold text-nld-blue m-0">Kết quả tìm kiếm:</h4>
                <span className="h4 fw-bold text-dark m-0">{query}</span>
            </div>
            <hr className="text-primary opacity-100 mb-4"/>

            <Row className="g-4">
                {/* List kết quả */}
                <Col lg={8}>
                    {loading ? (
                        <p className="text-secondary mb-0">Loading...</p>
                    ) : results.length > 0 ? (
                        results.map((article) => <NewsCard key={article.id} article={article}
                                                           mode={ViewMode.SEARCH_RESULT}/>)
                    ) : (
                        <p className="text-muted">Không tìm thấy kết quả nào cho “{query}”.</p>
                    )}
                </Col>

                {/* Sidebar */}
                <Col lg={4}></Col>
            </Row>
        </Container>
    );
}

export default SearchPage;

