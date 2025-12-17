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
}

export interface CategoryRegistry {
    slug: string;
    name: string;
    rssPath: string;
    articleIds: string[];
    heroIds: string[];
    hotIds: string[];
}

export interface HomepageRegistry {
    heroIds: string[];
    topHotIds: string[];
    sidebarHotIds: string[];
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
