import { ref, set, remove, onValue } from "firebase/database";
import { db } from "@/services/firebase";
import type { Article } from "@/types/types";
import { normalizeUrl } from "@/utils/articleUrl";

/** Hash FNV-1a 32-bit*/
function fnv1aHash(input: string) {
    let h = 0x811c9dc5;
    for (let i = 0; i < input.length; i++) {
        h ^= input.charCodeAt(i);
        h = (h * 0x01000193) >>> 0;
    }
    return h.toString(16);
}

export function favoriteKeyFromUrl(url: string) {
    const n = normalizeUrl(url);
    return `f_${fnv1aHash(n)}`;
}

export type FavoriteArticle = Pick<
    Article,
    "title" | "description" | "thumbnail" | "coverImage" | "publishedAt" | "source" | "link"
> & {
    id: string;
    categoryName: string;
    url: string;
    favoritedAt: number;
};

export async function upsertFavoriteArticle(uid: string, article: Article) {
    const url = normalizeUrl(article.link || "");
    if (!uid || !url) throw new Error("Thiếu uid hoặc url");

    const key = favoriteKeyFromUrl(url);

    const payload: FavoriteArticle = {
        url,
        link: url,
        title: article.title,
        description: article.description || "",
        thumbnail: article.thumbnail || "",
        coverImage: article.coverImage || "",
        publishedAt: article.publishedAt || "",
        source: article.source || "nld.com.vn",
        favoritedAt: Date.now(),
        id: article.id || "",
        categoryName: article.categoryName || "Tin tức",
    };

    await set(ref(db, `users/${uid}/favorites/${key}`), payload);
}

export async function removeFavoriteArticle(uid: string, url: string) {
    const nurl = normalizeUrl(url);
    if (!uid || !nurl) return;
    const key = favoriteKeyFromUrl(nurl);
    await remove(ref(db, `users/${uid}/favorites/${key}`));
}

/** Subscribe realtime danh sách bài yêu thích */
export function subscribeFavoriteArticles(
    uid: string,
    cb: (items: FavoriteArticle[]) => void,
    onError?: (err: any) => void
) {
    const r = ref(db, `users/${uid}/favorites`);

    const unsubscribe = onValue(
        r,
        (snap) => {
            const val = snap.val() || {};
            const list: FavoriteArticle[] = Object.values(val);
            list.sort((a, b) => (b.favoritedAt || 0) - (a.favoritedAt || 0));
            cb(list);
        },
        (err) => onError?.(err)
    );

    return unsubscribe;
}
