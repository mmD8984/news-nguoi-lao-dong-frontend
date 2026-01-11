import {Card} from 'react-bootstrap';
import { useState } from 'react';
import { ARTICLES } from '@/data/mock/articles';
import ProfileArticleItem from '../components/ProfileArticleItem';

function ViewedPanel() {
    // Dữ liệu giả cho bài đã xem (sử dụng cùng mẫu data để demo)
    const viewedArticles = ARTICLES.slice(0, 5);
    
    // Quản lý trạng thái đã lưu cục bộ cho demo, hoặc lấy từ store
    const [savedIds, setSavedIds] = useState<Set<string>>(new Set());

    const toggleBookmark = (id: string) => {
        setSavedIds(prev => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });
    };

    return (
        <Card className="border-0 shadow-sm p-4">
            <h4 className="profile-section-title mb-4">
                <span className="profile-section-title__bar"/>
                Bài đã xem
            </h4>
            
            <div className="d-flex flex-column">
                {viewedArticles.slice(0, 6).map((article, index, arr) => (
                    <ProfileArticleItem 
                        key={article.id}
                        article={article}
                        isSaved={savedIds.has(article.id)}
                        onToggleBookmark={toggleBookmark}
                        showImage={true}
                        isLast={index === arr.length - 1}
                    />
                ))}
            </div>
        </Card>
    );
}

export default ViewedPanel;
