import {CATEGORIES} from '../data/menu';
import {ARTICLES} from '../data/mock/articles';
import {CATEGORY_REGISTRY, HOMEPAGE_REGISTRY} from '../data/mock/registry';
import {store} from '../store/store';
import type {Article, NavItem} from '../types';

// Loại bỏ trùng id
function uniqueById(list: Article[]): Article[] {
    const seen = new Set<string>();
    const out: Article[] = [];
    for (const item of list) {
        if (seen.has(item.id)) continue;
        seen.add(item.id);
        out.push(item);
    }
    return out;
}

// lấy article theo list id
function resolveByIds(ids: string[]): Article[] {
    const map = new Map(ARTICLES.map((a) => [a.id, a] as const));
    const out: Article[] = [];
    for (const id of ids) {
        const found = map.get(id);
        if (found) out.push(found);
    }
    return out;
}

// Lấy categories để render menu Header
export async function getCategories(): Promise<NavItem[]> {
    return CATEGORIES;
}

// Lấy tất cả bài (mock)
export async function getArticles(): Promise<Article[]> {
    return [...ARTICLES];
}

// Lấy 1 bài theo id
export async function getArticleById(id: string): Promise<Article | null> {
    const found = ARTICLES.find((a) => a.id === id) ?? null;
    return found;
}

// Lấy list bài theo category slug
export async function getArticlesByCategory(slug: string): Promise<Article[]> {
    const registry = CATEGORY_REGISTRY.find((c) => c.slug === slug);
    if (registry) {
        const hero = resolveByIds(registry.heroIds);
        const hot = resolveByIds(registry.hotIds);
        const rest = resolveByIds(registry.articleIds);
        return uniqueById([...hero, ...hot, ...rest]);
    }

    const normalized = slug.trim();
    const direct = ARTICLES.filter((a) => a.categorySlug === normalized);
    if (direct.length > 0) return direct;

    const prefix = `${normalized}/`;
    return ARTICLES.filter((a) => a.categorySlug === normalized || a.categorySlug.startsWith(prefix));
}

export async function getHomepageData(): Promise<{
    hero: Article[];
    hot: Article[];
    sidebarHot: Article[];
}> {
    const hero = resolveByIds(HOMEPAGE_REGISTRY.heroIds);
    const hot = resolveByIds(HOMEPAGE_REGISTRY.topHotIds);
    const sidebarHot = resolveByIds(HOMEPAGE_REGISTRY.sidebarHotIds);
    return {hero, hot, sidebarHot};
}

// Search đơn giản: tìm trong title/desc/category/author/source/tags
export async function searchArticles(keyword: string): Promise<Article[]> {
    const q = keyword.trim().toLowerCase();
    if (!q) return [];

    return ARTICLES.filter((a) => {
        const haystack = [a.title, a.description, a.categoryName, a.author, a.source, a.tags.join(' ')].join(' ').toLowerCase();
        return haystack.includes(q);
    });
}

// Lấy danh sách bài đã lưu của user
export async function getUserSavedArticles(userId: string): Promise<Article[]> {
    const state = store.getState();
    const user = state.user.currentUser;

    if (!user || user.id !== userId) return [];
    return resolveByIds(user.savedArticleIds);
}
