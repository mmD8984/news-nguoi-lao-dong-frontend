import { RSS_FEEDS, type RssKey } from "@/data/rss";
import type { Article } from "@/types/types.ts";
import { normalizeUrl } from "@/utils/articleUrl";
import { fetchCategoryRSS } from "./fetchCategoryRSS";

export function buildCandidateFeedKeys(articleUrl: string): RssKey[] {
    const set = new Set<RssKey>();
    set.add("home");

    try {
        const u = new URL(articleUrl);
        const parts = u.pathname.split("/").filter(Boolean);
        const first = parts[0];
        const second = parts[1];

        if (first && (first as keyof typeof RSS_FEEDS) in RSS_FEEDS) {
            set.add(first as RssKey);
        }
        if (second && (second as keyof typeof RSS_FEEDS) in RSS_FEEDS) {
            set.add(second as RssKey);
        }
    } catch {
        //
    }

    const defaults: RssKey[] = [
        "thoi-su",
        "quoc-te",
        "lao-dong",
        "ban-doc",
        "net-zero",
        "kinh-te",
        "suc-khoe",
        "giao-duc-khoa-hoc",
        "phap-luat",
        "van-hoa-van-nghe",
        "giai-tri",
        "the-thao",
        "ai-365",
        "gia-dinh",
    ];

    for (const k of defaults) set.add(k);
    return Array.from(set);
}

export async function resolveArticleFromRSS(articleUrl: string): Promise<Article | null> {
    const target = normalizeUrl(articleUrl);
    if (!target) return null;

    const candidates = buildCandidateFeedKeys(articleUrl);

    for (const key of candidates) {
        const list = await fetchCategoryRSS(key);
        const found = list.find((a) => {
            const link = a.link ? normalizeUrl(a.link) : "";
            const aid = normalizeUrl(a.id);
            return link === target || aid === target;
        });

        if (found) return found;
    }

    return null;
}
