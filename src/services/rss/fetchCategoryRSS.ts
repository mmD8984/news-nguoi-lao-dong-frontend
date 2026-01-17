import { RSS_FEEDS, type RssKey } from "@/data/rss";
import type { Article } from "@/types/types.ts";
import { mapRSSToArticle } from "./rssMapper";

const RSS2JSON = "https://api.rss2json.com/v1/api.json?api_key=9jmfqcnavewhnaxehmqwju6uwtm87rb2szx9jij5&rss_url=";

export async function fetchCategoryRSS(
    slug: RssKey
): Promise<Article[]> {

    const rssUrl = RSS_FEEDS[slug];
    if (!rssUrl) return [];

    const res = await fetch(RSS2JSON + encodeURIComponent(rssUrl));
    const data = await res.json();

    return (data.items ?? []).map((item: any, index: number) =>
        mapRSSToArticle(item, slug, index)
    );
}
