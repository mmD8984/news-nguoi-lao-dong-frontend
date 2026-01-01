import type { Article } from "../../types";

/* ===== Helpers ===== */
function cleanText(html: string, maxLength = 150) {
    const text = html.replace(/<[^>]+>/g, "").trim();
    return text.length > maxLength
        ? text.slice(0, maxLength) + "..."
        : text;
}

function extractImage(html: string): string | null {
    const match = html.match(/<img[^>]+src="([^">]+)"/i);
    return match ? match[1] : null;
}

/* ===== Mapper ===== */
export function mapRSSToArticle(
    item: any,
    categorySlug: string,
    index: number
): Article {
    const html = item.content || item.description || "";

    const image =
        item.thumbnail ||
        item.enclosure?.link ||
        extractImage(html) ||
        "https://via.placeholder.com/300x200?text=NLĐ";

    return {
        id: item.guid || item.link || `${categorySlug}-${index}`,
        title: item.title,
        slug: item.link?.split("/").pop() || "",
        categorySlug,
        categoryName: categorySlug.replace(/-/g, " "),
        description: cleanText(html),
        content: html,
        thumbnail: image,
        coverImage: image,
        author: item.author || "Người Lao Động",
        source: "nld.com.vn",
        publishedAt: item.pubDate,
        tags: [],
        isFeatured: index === 0,
        isHot: index < 3,
        link: item.link,
    };
}
