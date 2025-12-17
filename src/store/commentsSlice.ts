import {createSlice, nanoid, type PayloadAction} from '@reduxjs/toolkit';

export interface Reply {
    id: string;
    authorId?: string;
    authorName: string;
    authorAvatar?: string;
    text: string;
    createdAt: string;
}

export interface Comment {
    id: string;
    authorId?: string;
    authorName: string;
    authorAvatar?: string;
    text: string;
    createdAt: string;
    likedByUserIds: string[];
    likes: number;
    replies: Reply[];
    repliesCount: number;
}

export interface CommentsState {
    byArticleId: Record<string, Comment[]>;
}

type AddCommentPayload = {
    articleId: string;
    text: string;
    authorId: string;
    authorName: string;
    authorAvatar?: string;
};

type ToggleLikePayload = {
    articleId: string;
    commentId: string;
    userId: string;
};

type AddReplyPayload = {
    articleId: string;
    parentCommentId: string;
    text: string;
    authorId: string;
    authorName: string;
    authorAvatar?: string;
};

const initialState: CommentsState = {
    byArticleId: {
        'a-001': [
            {
                id: 'seed-comment-1',
                authorId: 'u-002',
                authorName: 'NamChau..',
                authorAvatar: '',
                text: 'Chuyện này còn nhiều góc nhìn, cần thêm thông tin kiểm chứng.',
                createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
                likedByUserIds: ['u-001', 'u-003'],
                likes: 2,
                replies: [],
                repliesCount: 0
            },
            {
                id: 'seed-comment-2',
                authorName: 'longb**@gmail.com',
                authorAvatar: '',
                text: 'Mình thấy vấn đề môi trường và an toàn thực phẩm vẫn rất đáng lo.',
                createdAt: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
                likedByUserIds: ['u-004'],
                likes: 1,
                replies: [
                    {
                        id: 'seed-reply-1',
                        authorName: 'Bạn đọc',
                        authorAvatar: '',
                        text: 'Chuẩn luôn, cần kiểm soát tốt hơn.',
                        createdAt: new Date(Date.now() - 20 * 60 * 1000).toISOString()
                    }
                ],
                repliesCount: 1
            }
        ]
    }
};

const commentsSlice = createSlice({
    name: 'comments',
    initialState,
    reducers: {
        // Thêm comment mới cho 1 bài
        addComment: (state, action: PayloadAction<AddCommentPayload>) => {
            const {articleId, text, authorId, authorName, authorAvatar} = action.payload;
            const trimmed = text.trim();
            if (!trimmed) return;

            const list = state.byArticleId[articleId] ?? [];
            list.unshift({
                id: nanoid(),
                authorId,
                authorName,
                authorAvatar: authorAvatar ?? '',
                text: trimmed,
                createdAt: new Date().toISOString(),
                likedByUserIds: [],
                likes: 0,
                replies: [],
                repliesCount: 0
            });
            state.byArticleId[articleId] = list;
        },

        // Like / Unlike comment (toggle)
        toggleLike: (state, action: PayloadAction<ToggleLikePayload>) => {
            const {articleId, commentId, userId} = action.payload;
            const list = state.byArticleId[articleId];
            if (!list) return;

            // Tìm comment trong list
            let comment: Comment | undefined;
            for (const c of list) {
                if (c.id === commentId) {
                    comment = c;
                    break;
                }
            }
            if (!comment) return;

            // Guard để không bị lỗi khi load state cũ từ redux-persist
            if (!Array.isArray(comment.likedByUserIds)) comment.likedByUserIds = [];

            // Toggle userId trong likedByUserIds
            const idx = comment.likedByUserIds.indexOf(userId);
            if (idx >= 0) comment.likedByUserIds.splice(idx, 1);
            else comment.likedByUserIds.push(userId);

            // Sync lại số like để UI hiển thị đúng
            comment.likes = comment.likedByUserIds.length;

        },

        // Thêm reply vào comment cha
        addReply: (state, action: PayloadAction<AddReplyPayload>) => {
            const {articleId, parentCommentId, text, authorId, authorName, authorAvatar} = action.payload;
            const trimmed = text.trim();
            if (!trimmed) return;

            const list = state.byArticleId[articleId];
            if (!list)
                return;

            const parent = list.find((c) => c.id === parentCommentId);
            if (!parent)
                return;

            if (!Array.isArray(parent.replies)) parent.replies = [];
            parent.replies.unshift({
                id: nanoid(),
                authorId,
                authorName,
                authorAvatar: authorAvatar ?? '',
                text: trimmed,
                createdAt: new Date().toISOString()
            });
            parent.repliesCount = parent.replies.length;
        }
    }
});

export const {addComment, toggleLike, addReply} = commentsSlice.actions;
export default commentsSlice.reducer;
