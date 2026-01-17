import { RSS_FEEDS } from "@/data/rss";
import type { Article } from "@/types/types.ts";

const RSS2JSON = "https://api.rss2json.com/v1/api.json?rss_url=";

/* ===== Helper ===== */
function stripHtml(html: string, maxLength = 160) {
    return html
        .replace(/<[^>]+>/g, "")
        .replace(/\s+/g, " ")
        .trim()
        .slice(0, maxLength);
}

function extractImage(html: string): string | undefined {
    const match = html.match(/<img[^>]+src="([^">]+)"/i);
    return match?.[1];
}

/* ===== HOME RSS SERVICE ===== */
export async function fetchHomeRSS(): Promise<Article[]> {
    const rssUrl = RSS_FEEDS.home;
    if (!rssUrl) return [];

    const res = await fetch(RSS2JSON + encodeURIComponent(rssUrl));
    if (!res.ok) {
        throw new Error(`RSS home HTTP ${res.status}`);
    }

    const data = await res.json();

    return (data.items ?? []).map((item: any, index: number) => {
        const html = item.description || "";

        const image =
            item.thumbnail ||
            item.enclosure?.link ||
            extractImage(html) ||
            "https://via.placeholder.com/300x200?text=NLĐ";

        const link = item.link;

        return {
            id: item.guid || link || `home-${index}`,
            title: item.title,
            slug: "",
            categorySlug: "home",
            categoryName: "Trang chủ",
            description: stripHtml(html),
            content: html,
            thumbnail: image,
            coverImage: image,
            author: "Người Lao Động",
            source: "nld.com.vn",
            publishedAt: item.pubDate || "",
            tags: [],
            isFeatured: index === 0,
            isHot: index < 5,
            link,
        };
    });
}
