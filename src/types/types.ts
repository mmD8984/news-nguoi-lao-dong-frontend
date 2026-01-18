export interface Article {
    id: string;
    title: string;
    slug: string;
    categorySlug: string;
    categoryName: string;
    description: string;
    content: string;
    thumbnail: string;
    coverImage: string;
    author: string;
    source: string;
    publishedAt: string;
    tags: string[];
    isFeatured: boolean;
    isHot: boolean;
    link?: string;
    isVip?: boolean;
}

// Thêm RSS Article type
export interface ArticleRSS {
    id: string;
    title: string;
    link: string;
    description: string;
    pubDate: string;
    image: string;
}

export interface NavItem {
    label: string;
    path: string;
    subItems?: NavItem[];
}

export const ViewMode = {
    LIST: 'LIST',
    SIDEBAR_SMALL: 'SIDEBAR_SMALL',
    TEXT_ONLY: 'TEXT_ONLY',
    SEARCH_RESULT: 'SEARCH_RESULT',
    CATEGORY_HERO: 'CATEGORY_HERO',
    CATEGORY_GRID: 'CATEGORY_GRID',
    HERO_TOP_TITLE: 'HERO_TOP_TITLE',
    FOCUS_SUB: 'FOCUS_SUB',
    FOCUS_BOTTOM: 'FOCUS_BOTTOM',
    DONT_MISS: 'DONT_MISS'
} as const;

export type ViewMode = (typeof ViewMode)[keyof typeof ViewMode];

export interface Package {
    id: number;
    name: string;
    price: number;
    originalPrice?: number;
    durationDays: number;
    discount?: number;
    note?: string;
}

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

export type CommentRecord = {
    authorId?: string;
    authorName?: string;
    authorAvatar?: string;
    text?: string;
    createdAt?: number | string | object;
    likedBy?: Record<string, true>;
    likes?: number;
    replies?: Comment["replies"] | Record<string, ReplyRecord>;
    repliesCount?: number;
};

export type ReplyRecord = {
    authorId?: string;
    authorName?: string;
    authorAvatar?: string;
    text?: string;
    createdAt?: number | string | object;
};

export type AddCommentPayload = {
    articleId: string;
    text: string;
    authorId: string;
    authorName: string;
    authorAvatar?: string;
};

export type AddReplyPayload = {
    articleId: string;
    parentCommentId: string;
    text: string;
    authorId: string;
    authorName: string;
    authorAvatar?: string;
};
