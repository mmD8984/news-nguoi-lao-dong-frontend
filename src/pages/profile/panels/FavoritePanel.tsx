import { Card } from "react-bootstrap";
import { useAppSelector } from "@/store/hooks";
import { getCurrentUser } from "@/store/user/user.selectors";
import { useFavoriteArticlesRTDB } from "@/hooks/useFavoriteArticlesRTDB";
import { removeFavoriteArticle } from "@/services/favorite/favoriteArticles.rtdb";
import ProfileArticleItem from "../components/ProfileArticleItem";
import type { Article } from "@/types/types";

function FavoritePanel() {
    const user = useAppSelector(getCurrentUser);
    const { items, loading } = useFavoriteArticlesRTDB(user?.id);

    const handleToggleFavorite = async (id: string) => {
        if (!user) return;
        const article = items.find(a => a.id === id || a.id === id);

        // Nếu tìm thấy bài trong list favorite thì xóa
        if (article) {
            await removeFavoriteArticle(user.id, article.url);
        }
    };

    return (
        <Card className="border-0 shadow-sm p-4">
            <h4 className="profile-section-title mb-4">
                <span className="profile-section-title__bar" />
                Bài yêu thích
            </h4>

            {loading ? (
                <p className="text-secondary mb-0">Đang tải...</p>
            ) : items.length === 0 ? (
                <p className="text-muted mb-0">Bạn chưa yêu thích bài viết nào.</p>
            ) : (
                <div className="d-flex flex-column">
                    {items.map((favItem, index: number) => (
                        <ProfileArticleItem
                            key={favItem.url || favItem.id || index}
                            article={favItem as unknown as Article}
                            isSaved={true}
                            onToggleBookmark={handleToggleFavorite}
                            showImage={true}
                            isLast={index === items.length - 1}
                        />
                    ))}
                </div>
            )}
        </Card>
    );
}

export default FavoritePanel;
