import {Card, Row, Col} from 'react-bootstrap';
import {Link} from 'react-router-dom';
import {useState} from 'react';
import {useAppSelector} from '@/store/hooks';
import {getCurrentUser} from '@/store/user/user.selectors';
import type {Article} from '@/types';
import { ARTICLES } from '@/data/mock/articles';
import ProfileArticleItem from '../components/ProfileArticleItem';

// Dữ liệu mẫu
const SAMPLE_ARTICLE: Article = ARTICLES[0];
const SAVED_ARTICLES: Article[] = [
    SAMPLE_ARTICLE
];

const VIEWED_ARTICLES: Article[] = [
    SAMPLE_ARTICLE
];

function OverviewPanel() {
    const user = useAppSelector(getCurrentUser);
    const [savedArticleIds, setSavedArticleIds] = useState<Set<string>>(
        new Set(user?.savedArticleIds || [])
    );

    if (!user) return null;

    const savedCount = user.savedArticleIds?.length || 1;
    const viewedCount = 6;
    const commentsCount = 0;

    const STATS_CARDS = [
        {label: 'Bài đã lưu', value: savedCount},
        {label: 'Bài đã xem', value: viewedCount},
        {label: 'Bài đã bình luận', value: commentsCount}
    ];

    // Hàm toggle bookmark
    const toggleBookmark = (articleId: string) => {
        setSavedArticleIds(prev => {
            const newSet = new Set(prev);
            if (newSet.has(articleId)) {
                newSet.delete(articleId);
            } else {
                newSet.add(articleId);
            }
            return newSet;
        });
    };



    return (
        <div className="d-flex flex-column gap-4">
            {/* Thống kê chung */}
            <Card className="border-0 shadow-sm p-4">
                <h5 className="font-sans fw-semibold mb-3">Thống kê chung</h5>
                <Row className="g-3">
                    {STATS_CARDS.map((stat, index) => (
                        <Col xs={4} key={index}>
                            <div className="bg-light rounded p-3 text-center profile-stat-card">
                                <p className="text-secondary mb-2 small">{stat.label}</p>
                                <p className="fs-4 text-nld-blue mb-0 fw-semibold">{stat.value}</p>
                            </div>
                        </Col>
                    ))}
                </Row>
            </Card>

            {/* VIP Prompt */}
            <Card className="border-0 shadow-sm p-4">
                <h6 className="font-sans fw-bold mb-2">Tài khoản của bạn chưa đăng ký gói bạn đọc VIP</h6>
                <p className="text-secondary mb-0 small">
                    Mời bạn <a href="#" className="text-nld-blue text-decoration-none fw-semibold">đăng ký gói bạn đọc VIP</a> để trải nghiệm các sản phẩm "đặc biệt" (special), chất lượng, chuyên sâu cả trong nước lẫn quốc tế và có hội nhận được nhiều phần quà hấp dẫn từ báo Người Lao Động
                </p>
            </Card>

            {/* Thông tin tài khoản */}
            <Card className="border-0 shadow-sm p-4">
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <h5 className="font-sans fw-bold mb-0">Thông tin tài khoản</h5>
                    <Link to="/thong-tin-ca-nhan/tai-khoan" className="text-nld-blue text-decoration-none small">
                        Chỉnh sửa thông tin
                    </Link>
                </div>
                <Row className="g-3">
                    <Col md={6}>
                        <div>
                            <p className="text-secondary small mb-1">Tên hiển thị:</p>
                            <p className="mb-0">{user.displayName}</p>
                        </div>
                    </Col>
                    <Col md={6}>
                        <div>
                            <p className="text-secondary small mb-1">Email/Số điện thoại:</p>
                            <p className="mb-0">{user.emailOrPhone}</p>
                        </div>
                    </Col>
                    <Col md={12}>
                        <div>
                            <p className="text-secondary small mb-1">ID tài khoản:</p>
                            <p className="mb-0 font-monospace small text-break">{user.id}</p>
                        </div>
                    </Col>
                </Row>
            </Card>


            {/* Bài mới lưu và xem gần đây - 2 columns */}
            <Row className="g-4">
                {/* Bài mới lưu gần đây */}
                <Col md={6}>
                    <Card className="border-0 shadow-sm p-4 h-100">
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <h5 className="font-sans fw-semibold mb-0">Bài mới lưu gần đây</h5>
                            <Link to="/thong-tin-ca-nhan/bai-da-luu" className="text-nld-blue text-decoration-none small">
                                Xem tất cả
                            </Link>
                        </div>
                        <div className="d-flex flex-column">
                            {SAVED_ARTICLES.slice(0, 3).map((article, index, arr) => 
                                <ProfileArticleItem 
                                    key={article.id} 
                                    article={article}
                                    isSaved={savedArticleIds.has(article.id)}
                                    onToggleBookmark={toggleBookmark}
                                    showImage={false}
                                    isLast={index === arr.length - 1}
                                />
                            )}
                        </div>
                    </Card>
                </Col>

                {/* Bài mới xem gần đây */}
                <Col md={6}>
                    <Card className="border-0 shadow-sm p-4 h-100">
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <h5 className="font-sans fw-semibold mb-0">Bài mới xem gần đây</h5>
                            <Link to="/thong-tin-ca-nhan/bai-da-xem" className="text-nld-blue text-decoration-none small">
                                Xem tất cả
                            </Link>
                        </div>
                        <div className="d-flex flex-column">
                            {VIEWED_ARTICLES.slice(0, 3).map((article, index, arr) => 
                                <ProfileArticleItem 
                                    key={article.id} 
                                    article={article}
                                    isSaved={savedArticleIds.has(article.id)}
                                    onToggleBookmark={toggleBookmark}
                                    showImage={false}
                                    isLast={index === arr.length - 1}
                                />
                            )}
                        </div>
                    </Card>
                </Col>
            </Row>

            {/* Bài mới bình luận gần đây */}
            <Card className="border-0 shadow-sm p-4">
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <h5 className="font-sans fw-semibold mb-0">Bài mới bình luận gần đây</h5>
                    <Link to="/thong-tin-ca-nhan/binh-luan" className="text-nld-blue text-decoration-none small">
                        Xem tất cả
                    </Link>
                </div>
                <p className="text-secondary mb-0">Bạn chưa có bình luận nào</p>
            </Card>
        </div>
    );
}

export default OverviewPanel;