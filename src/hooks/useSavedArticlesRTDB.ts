import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/services/firebase"; // hoặc "@/firebase" tuỳ bạn export auth ở đâu
import type { SavedArticle } from "@/services/save/savedArticles.rtdb";
import { subscribeSavedArticles } from "@/services/save/savedArticles.rtdb";

export function useSavedArticlesRTDB(uidFromStore?: string) {
    const [items, setItems] = useState<SavedArticle[]>([]);
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

            unsubscribeDB = subscribeSavedArticles(
                uid,
                (list) => {
                    setItems(list);
                    setLoading(false);
                },
                (err) => {
                    console.error("RTDB subscribe error:", err);
                    setError(err?.message || "Không thể tải bài đã lưu");
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
