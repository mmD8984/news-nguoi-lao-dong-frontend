import { Link } from 'react-router-dom';
import { BsShare, BsBookmark, BsBookmarkFill } from 'react-icons/bs';
import type { Article } from '@/types/types';
import { getTimeAgo } from '@/data/utils/dateHelpers';

interface ProfileArticleItemProps {
    article: Article;
    isSaved?: boolean;
    onToggleBookmark?: (id: string) => void;
    showImage?: boolean;
    className?: string;
    isLast?: boolean;
}

function ProfileArticleItem({
    article,
    isSaved = false,
    onToggleBookmark,
    showImage = true,
    className = '',
    isLast = false
}: ProfileArticleItemProps) {
    
    // Tạo link bài viết
    const originalUrl = article.link || article.id;
    const articleLink = originalUrl ? `/article/${encodeURIComponent(originalUrl)}` : '#';
    
    // Fallback cho ảnh: ưu tiên thumbnail -> coverImage -> placeholder
    const imageSrc = (article as any).image || article.thumbnail || article.coverImage || 'https://placehold.co/600x400?text=No+Image';

    // LAYOUT 1: Có hình ảnh (Dùng cho Bài đã xem / Bài đã lưu)
    if (showImage) {
        return (
            <div className={`d-flex gap-4 py-3 ${!isLast ? 'border-bottom' : ''} ${className}`}>
                {/* Cột trái: Ảnh thumbnail */}
                <div className="position-relative flex-shrink-0" style={{ width: '260px' }}>
                    <Link to={articleLink} state={{ article }} className="d-block overflow-hidden rounded">
                        <img 
                            src={imageSrc} 
                            alt={article.title} 
                            className="w-100 object-fit-cover"
                            style={{ height: '165px' }}
                        />
                    </Link>
                    {/* Overlay thời gian trên ảnh */}
                    <span 
                        className="position-absolute bottom-0 start-0 text-white px-2 py-1 small"
                        style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)', textShadow: '0 1px 2px rgba(0,0,0,0.8)', width: '100%' }}
                    >
                        {getTimeAgo(article.publishedAt)}
                    </span>
                </div>

                {/* Cột phải: Nội dung */}
                <div className="d-flex flex-column flex-grow-1">
                    {/* Hàng 1: Category + Buttons */}
                    <div className="d-flex justify-content-between align-items-center mb-1">
                         <span className="text-nld-blue small fw-semibold text-uppercase">{article.categoryName}</span>
                         <div className="d-flex gap-2">
                            <button className="btn btn-link p-0 text-secondary" aria-label="Chia sẻ">
                                <BsShare size={16} />
                            </button>
                            <button 
                                className={`btn btn-link p-0 ${isSaved ? 'text-nld-blue' : 'text-secondary'}`}
                                aria-label="Lưu bài viết"
                                onClick={() => onToggleBookmark && onToggleBookmark(article.id)}
                            >
                                {isSaved ? <BsBookmarkFill size={16} /> : <BsBookmark size={16} />}
                            </button>
                        </div>
                    </div>

                    {/* Hàng 2: Title */}
                    <h5 className="mb-1 fw-bold font-sans">
                        <Link to={articleLink} state={{ article }} className="text-dark text-decoration-none hover-link">
                            {article.title}
                        </Link>
                    </h5>

                    {/* Hàng 3: Description */}
                    <p className="text-secondary small mb-0 line-clamp-3">
                        (NLĐO) - {article.description}
                    </p>
                </div>
            </div>
        );
    }

    // LAYOUT 2: Không có hình ảnh (Dùng cho Overview Panel)
    return (
        <div className={`py-2 ${!isLast ? 'border-bottom' : ''} ${className}`}>
             {/* Hàng 1: Title */}
             <h6 className="mb-2 fw-normal">
                <Link to={articleLink} state={{ article }} className="text-dark text-decoration-none hover-link">
                    {article.title}
                </Link>
            </h6>

            {/* Hàng 2: Info + Buttons */}
            <div className="d-flex justify-content-between align-items-center">
                <div className="d-flex align-items-center gap-2">
                    <span className="text-nld-blue small">{article.categoryName}</span>
                    <span className="text-secondary small text-muted">{getTimeAgo(article.publishedAt)}</span>
                </div>
                
                <div className="d-flex gap-2">
                    <button className="btn btn-link p-0 text-secondary" aria-label="Chia sẻ">
                        <BsShare size={16} />
                    </button>
                    <button 
                        className={`btn btn-link p-0 ${isSaved ? 'text-nld-blue' : 'text-secondary'}`}
                        aria-label="Lưu bài viết"
                        onClick={() => onToggleBookmark && onToggleBookmark(article.id)}
                    >
                        {isSaved ? <BsBookmarkFill size={16} /> : <BsBookmark size={16} />}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ProfileArticleItem;
