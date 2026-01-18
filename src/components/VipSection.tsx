import React, { useEffect, useState } from 'react';
import { Container, Button } from 'react-bootstrap';
import { FaMedal } from 'react-icons/fa';
import { useSubscription } from '@/hooks/useSubscription';
import { fetchCategoryRSS } from '@/services/rss/fetchCategoryRSS';
import { ViewMode } from '@/types/types';
import type { Article } from '@/types/types';
import NewsCard from './NewsCard';

function VipSection() {
    const { isVip } = useSubscription();
    const [articles, setArticles] = useState<Article[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            try {
                // Giả sử 'van-hoa-van-nghe' là chuyên mục VIP
                const data = await fetchCategoryRSS('van-hoa-van-nghe');

                // Gán cờ isVip = true cho bài viết trong section này
                const vipArticles = data.slice(0, 10).map(item => ({
                    ...item,
                    isVip: true
                }));
                setArticles(vipArticles);
            } catch (error) {
                console.error("Failed to load VIP news", error);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, []);

    // Hiển thị loading nếu cần, hoặc null
    if (loading) return null;

    return (
        <div className="vip-section py-4 my-4">
            <Container>
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <div className="d-flex align-items-center gap-3">
                        <div className="vip-icon-wrapper text-warning">
                            <FaMedal size={24} color="#f7c945" /> 
                        </div>
                        <div>
                            <h5 className="vip-header-title mb-0 fw-bold text-primary">DÀNH CHO BẠN ĐỌC VIP</h5>
                            <small className="text-secondary">Chuyên mục báo chí đặc biệt, có thu phí</small>
                        </div>
                    </div>
                    <div>
                        {!isVip && (
                            <Button 
                                variant="primary" 
                                className="fw-semibold px-4 btn-vip-register" 
                                size="sm" 
                                href="/dang-ky-goi-vip"
                            >
                                Đăng ký bạn đọc VIP
                            </Button>
                        )}
                    </div>
                </div>

                <div className="vip-articles-scroll custom-scrollbar d-flex gap-3 overflow-x-auto pb-3">
                    {articles.map((item) => (
                        <div key={item.id} className="vip-article-item flex-shrink-0" style={{ minWidth: '260px', width: '260px' }}>
                            <NewsCard 
                                article={item} 
                                mode={ViewMode.CATEGORY_GRID} 
                                showCategory={false} 
                            />
                        </div>
                    ))}
                </div>
            </Container>
        </div>
    );
};

export default VipSection;