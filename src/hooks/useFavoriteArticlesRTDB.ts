import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/services/firebase";
import type { FavoriteArticle } from "@/services/favorite/favoriteArticles.rtdb";
import { subscribeFavoriteArticles } from "@/services/favorite/favoriteArticles.rtdb";

export function useFavoriteArticlesRTDB(uidFromStore?: string) {
    const [items, setItems] = useState<FavoriteArticle[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let unsubscribeDB: (() => void) | null = null;
        let unsubscribeAuth: (() => void) | null = null;

        setTimeout(() => setLoading(true));
        setTimeout(() => setError(null));

        // Chờ Firebase Auth sẵn sàng
        unsubscribeAuth = onAuthStateChanged(auth, (fbUser) => {
            const uid = uidFromStore || fbUser?.uid;

            if (!uid) {
                setItems([]);
                setLoading(false);
                return;
            }

            if (unsubscribeDB) unsubscribeDB();

            unsubscribeDB = subscribeFavoriteArticles(
                uid,
                (list) => {
                    setItems(list);
                    setLoading(false);
                },
                (err) => {
                    console.error("RTDB favorite subscribe error:", err);
                    setError(err?.message || "Không thể tải bài yêu thích");
                    setLoading(false);
                }
            );
        });

        return () => {
            if (unsubscribeDB) unsubscribeDB();
            if (unsubscribeAuth) unsubscribeAuth();
        };
    }, [uidFromStore]);

    return { items, loading, error };
}
