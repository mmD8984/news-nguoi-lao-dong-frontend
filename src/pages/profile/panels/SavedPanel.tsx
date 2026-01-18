import {Card} from 'react-bootstrap';
import {useAppSelector} from '@/store/hooks';
import {getCurrentUser} from '@/store/user/user.selectors';
import {useSavedArticlesRTDB} from '@/hooks/useSavedArticlesRTDB';
import {removeSavedArticle} from '@/services/save/savedArticles.rtdb';
import ProfileArticleItem from '../components/ProfileArticleItem';
import type {Article} from '@/types/types';

function SavedPanel() {
    const user = useAppSelector(getCurrentUser);
    const {items, loading} = useSavedArticlesRTDB(user?.id);

    const handleToggleBookmark = async (id: string) => {
        if (!user) return;
        const article = items.find(a => a.id === id);

        // Nếu tìm thấy bài viết (đang có trong list saved), thì xóa nó
        if (article) {
            await removeSavedArticle(user.id, article.url);
        }
    };

    return (
        <Card className="border-0 shadow-sm p-4">
            <h4 className="profile-section-title mb-4">
                <span className="profile-section-title__bar"/>
                Bài đã lưu
            </h4>

            {loading ? (
                <p className="text-secondary mb-0">Đang tải...</p>
            ) : items.length === 0 ? (
                <p className="text-muted mb-0">Bạn chưa lưu bài viết nào.</p>
            ) : (
                <div className="d-flex flex-column">
                    {items.map((savedItem, index) => (
                        <ProfileArticleItem
                            key={savedItem.id || index}
                            article={savedItem as unknown as Article}
                            isSaved={true}
                            onToggleBookmark={handleToggleBookmark}
                            showImage={true}
                            isLast={index === items.length - 1}
                        />
                    ))}
                </div>
            )}
        </Card>
    );
}

export default SavedPanel;
