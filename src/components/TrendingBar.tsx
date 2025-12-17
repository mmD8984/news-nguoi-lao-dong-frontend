import {useRef} from 'react';
import {Link} from 'react-router-dom';
import {BsChevronLeft, BsChevronRight, BsGraphUp} from 'react-icons/bs';

const TAGS = [
    'Israel - Iran',
    'Thái Lan - Campuchia căng thẳng',
    'Biểu tình ở Los Angeles',
    'Mỹ áp thuế đối ứng',
    'Giá vàng hôm nay',
    'Thời tiết TP.HCM',
    'Bóng đá SEA Games',
    'Tuyển Việt Nam',
    'Công nghệ AI',
    'Bất động sản 2025'
];

export default function TrendingBar() {
    const trendingRef = useRef<HTMLDivElement>(null);

    // Scroll ngang list tag
    const scrollTrending = (direction: 'left' | 'right') => {
        const el = trendingRef.current;
        if (!el) return;

        el.scrollBy({
            left: direction === 'left' ? -300 : 300,
            behavior: 'smooth'
        });
    };

    return (
        <div className="mb-4 py-3 border-top border-bottom">
            <div className="d-flex align-items-center">
                {/* Label Trending */}
                <div className="d-flex align-items-center gap-2 me-4 flex-shrink-0">
                    <div
                        className="bg-nld-red text-white rounded-2 d-flex align-items-center justify-content-center trending-bar__icon">
                        <BsGraphUp size={18}/>
                    </div>
                    <span className="text-nld-red fw-bold text-uppercase trending-bar__label">TRENDING</span>
                </div>

                {/* Danh sách tag */}
                <div
                    className="flex-grow-1 overflow-hidden d-flex gap-3 align-items-center no-scrollbar mask-gradient-right trending-bar__tags"
                    ref={trendingRef}
                >
                    {TAGS.map((tag) => (
                        <Link
                            key={tag}
                            to={`/search?q=${encodeURIComponent(tag)}`}
                            className="text-dark hover-link d-inline-block px-3 py-2 rounded-1 border-0 trending-bar__tag"
                        >
                            {tag}
                        </Link>
                    ))}
                </div>

                {/* Nút kéo trái/phải */}
                <div className="d-flex gap-2 ms-3 flex-shrink-0">
                    <button
                        type="button"
                        onClick={() => scrollTrending('left')}
                        className="btn btn-white border border-secondary border-opacity-25 rounded-1 p-0 d-flex align-items-center justify-content-center hover-shadow trending-bar__nav-btn"
                        aria-label="Scroll trending left"
                    >
                        <BsChevronLeft size={14} className="text-secondary"/>
                    </button>
                    <button
                        type="button"
                        onClick={() => scrollTrending('right')}
                        className="btn btn-white border border-secondary border-opacity-25 rounded-1 p-0 d-flex align-items-center justify-content-center hover-shadow trending-bar__nav-btn"
                        aria-label="Scroll trending right"
                    >
                        <BsChevronRight size={14} className="text-secondary"/>
                    </button>
                </div>
            </div>
        </div>
    );
}

