import { ref, set, remove, onValue, get } from "firebase/database";
import { db } from "@/services/firebase";
import type { Article } from "@/types/types";
import { normalizeUrl } from "@/utils/articleUrl";

/** Hash FNV-1a 32-bit (đủ dùng cho key RTDB) */
function fnv1aHash(input: string) {
    let h = 0x811c9dc5;
    for (let i = 0; i < input.length; i++) {
        h ^= input.charCodeAt(i);
        h = (h * 0x01000193) >>> 0;
    }
    return h.toString(16);
}

export function savedKeyFromUrl(url: string) {
    const n = normalizeUrl(url);
    return `u_${fnv1aHash(n)}`;
}

export type SavedArticle = Pick<
    Article,
    "title" | "description" | "thumbnail" | "coverImage" | "publishedAt" | "source" | "link"
> & {
    url: string;
    savedAt: number;
};

export async function upsertSavedArticle(uid: string, article: Article) {
    const url = normalizeUrl(article.link || "");
    if (!uid || !url) throw new Error("Missing uid or url");

    const key = savedKeyFromUrl(url);

    const payload: SavedArticle = {
        url,
        link: url,
        title: article.title,
        description: article.description || "",
        thumbnail: article.thumbnail || "",
        coverImage: article.coverImage || "",
        publishedAt: article.publishedAt || "",
        source: article.source || "nld.com.vn",
        savedAt: Date.now(),
    };

    await set(ref(db, `users/${uid}/saved/${key}`), payload);
}

export async function removeSavedArticle(uid: string, url: string) {
    const nurl = normalizeUrl(url);
    if (!uid || !nurl) return;
    const key = savedKeyFromUrl(nurl);
    await remove(ref(db, `users/${uid}/saved/${key}`));
}

export async function isArticleSaved(uid: string, url: string): Promise<boolean> {
    const nurl = normalizeUrl(url);
    if (!uid || !nurl) return false;
    const key = savedKeyFromUrl(nurl);
    const snap = await get(ref(db, `users/${uid}/saved/${key}`));
    return snap.exists();
}

export function subscribeSavedArticles(
    uid: string,
    cb: (items: SavedArticle[]) => void,
    onError?: (err: any) => void
) {
    const r = ref(db, `users/${uid}/saved`);

    // onValue trả về unsubscribe function
    const unsubscribe = onValue(
        r,
        (snap) => {
            const val = snap.val() || {};
            const list: SavedArticle[] = Object.values(val);
            list.sort((a, b) => (b.savedAt || 0) - (a.savedAt || 0));
            cb(list);
        },
        (err) => {
            onError?.(err);
        }
    );

    return unsubscribe;
}
