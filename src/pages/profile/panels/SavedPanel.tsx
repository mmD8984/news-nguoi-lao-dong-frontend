import {Card} from 'react-bootstrap';
import type {Article} from '@/types';
import ProfileArticleItem from '../components/ProfileArticleItem';

interface SavedPanelProps {
    articles: Article[];
    loading: boolean;
}

function SavedPanel({articles, loading}: SavedPanelProps) {

    const handleToggleBookmark = (id: string) => {
        console.log('Toggle bookmark cho', id);
    };

    return (
        <Card className="border-0 shadow-sm p-4">
            <h4 className="profile-section-title mb-4">
                <span className="profile-section-title__bar"/>
                Bài đã lưu
            </h4>

            {loading ? (
                <p className="text-secondary mb-0">Loading...</p>
            ) : articles.length === 0 ? (
                <p className="text-muted mb-0">Bạn chưa lưu bài viết nào.</p>
            ) : (
                <div className="d-flex flex-column">
                    {articles.slice(0, 6).map((a, index, arr) => (
                        <ProfileArticleItem 
                            key={a.id} 
                            article={a} 
                            isSaved={true}
                            onToggleBookmark={handleToggleBookmark}
                            showImage={true}
                            isLast={index === arr.length - 1}
                        />
                    ))}
                </div>
            )}
        </Card>
    );
}

export default SavedPanel;
