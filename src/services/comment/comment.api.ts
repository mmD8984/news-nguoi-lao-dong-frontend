import {get, push, ref, runTransaction, serverTimestamp, set} from "firebase/database";

import {db} from "@/services/firebase";
import type {
    AddCommentPayload,
    AddReplyPayload,
    Comment,
    CommentRecord,
    Reply,
    ReplyRecord,
} from "@/types/types";

function normalizeCreatedAt(value: unknown): string {
    if (typeof value === "number") return new Date(value).toISOString();
    if (typeof value === "string") return new Date(value).toISOString();
    return new Date().toISOString();
}

function normalizeLikedBy(value: unknown): string[] {
    if (value && typeof value === "object") {
        return Object.keys(value as Record<string, true>);
    }
    return [];
}

function normalizeReplies(value: unknown): Comment["replies"] {
    if (Array.isArray(value)) return value as Comment["replies"];
    if (value && typeof value === "object") {
        return Object.entries(value as Record<string, ReplyRecord>).map(
            ([id, reply]): Reply => ({
                id,
                authorId: reply.authorId,
                authorName: reply.authorName || "Bạn đọc",
                authorAvatar: reply.authorAvatar || "",
                text: reply.text || "",
                createdAt: normalizeCreatedAt(reply.createdAt),
            })
        );
    }
    return [];
}

function toDbKey(value: string): string {
    return encodeURIComponent(value).replace(/\./g, "%2E");
}

function mapComment(id: string, raw: CommentRecord): Comment {
    const likedByUserIds = normalizeLikedBy(raw.likedBy);
    const replies = normalizeReplies(raw.replies).sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    const repliesCount = typeof raw.repliesCount === "number" ? raw.repliesCount : replies.length;
    const likes = typeof raw.likes === "number" ? raw.likes : likedByUserIds.length;

    return {
        id,
        authorId: raw.authorId,
        authorName: raw.authorName || "Bạn đọc",
        authorAvatar: raw.authorAvatar || "",
        text: raw.text || "",
        createdAt: normalizeCreatedAt(raw.createdAt),
        likedByUserIds,
        likes,
        replies,
        repliesCount,
    };
}

/**
 * Tạo comment mới cho 1 bài viết
 */
export async function addComment(payload: AddCommentPayload): Promise<string> {
    const {articleId, text, authorId, authorName, authorAvatar} = payload;
    const trimmed = text.trim();
    if (!articleId || !trimmed) throw new Error("Thiếu articleId hoặc nội dung comment");

    const listRef = ref(db, `comments/${toDbKey(articleId)}`);
    const newRef = push(listRef);

    await set(newRef, {
        text: trimmed,
        authorId,
        authorName,
        authorAvatar: authorAvatar ?? "",
        createdAt: serverTimestamp(),
        likedBy: {},
        likes: 0,
        replies: [],
        repliesCount: 0,
    });

    return newRef.key ?? "";
}

/**
 * Lấy danh sách comment của 1 bài viết (one-time)
 */
export async function fetchCommentsByArticle(articleId: string): Promise<Comment[]> {
    if (!articleId) return [];
    const snapshot = await get(ref(db, `comments/${toDbKey(articleId)}`));
    if (!snapshot.exists()) return [];

    const data = snapshot.val() as Record<string, CommentRecord>;
    return Object.keys(data).map((id) => mapComment(id, data[id]));
}

/**
 * Tạo reply cho 1 comment
 */
export async function addReply(payload: AddReplyPayload): Promise<string> {
    const {articleId, parentCommentId, text, authorId, authorName, authorAvatar} = payload;
    const trimmed = text.trim();
    if (!articleId || !parentCommentId || !trimmed) {
        throw new Error("Thiếu articleId hoặc parentCommentId hoặc nội dung reply");
    }

    const repliesRef = ref(db, `comments/${toDbKey(articleId)}/${parentCommentId}/replies`);
    const newRef = push(repliesRef);

    await set(newRef, {
        text: trimmed,
        authorId,
        authorName,
        authorAvatar: authorAvatar ?? "",
        createdAt: serverTimestamp(),
    });

    const countRef = ref(db, `comments/${toDbKey(articleId)}/${parentCommentId}/repliesCount`);
    await runTransaction(countRef, (current) => {
        if (typeof current === "number") return current + 1;
        return 1;
    });

    return newRef.key ?? "";
}

/**
 * Like / Unlike comment (toggle)
 */
export async function toggleCommentLike(
    articleId: string,
    commentId: string,
    userId: string
): Promise<void> {
    if (!articleId || !commentId || !userId) return;

    const commentRef = ref(db, `comments/${toDbKey(articleId)}/${commentId}`);
    await runTransaction(commentRef, (current) => {
        if (!current) return current;
        const data = current as CommentRecord;
        const likedBy = {...(data.likedBy ?? {})};

        if (likedBy[userId]) delete likedBy[userId];
        else likedBy[userId] = true;

        return {
            ...data,
            likedBy,
            likes: Object.keys(likedBy).length,
        };
    });
}
