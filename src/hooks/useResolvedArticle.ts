import { useEffect, useState } from "react";

import type { Article } from "@/types/types.ts";
import { resolveArticleFromRSS } from "@/services/rss/resolveArticleFromRSS";

type UseResolvedArticleResult = {
    article: Article | null;
    loading: boolean;
    error: string | null;
};

export function useResolvedArticle(
    articleUrl: string,
    initialArticle: Article | null
): UseResolvedArticleResult {
    const [article, setArticle] = useState<Article | null>(initialArticle);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let cancelled = false;

        async function load() {
            if (!articleUrl) {
                setArticle(null);
                setError("URL bài viết không hợp lệ.");
                setLoading(false);
                return;
            }

            // If we already have the article (from router state), use it.
            if (initialArticle) {
                setArticle(initialArticle);
                setError(null);
                setLoading(false);
                return;
            }

            setArticle(null);
            setLoading(true);
            setError(null);

            try {
                const found = await resolveArticleFromRSS(articleUrl);
                if (!found) {
                    throw new Error(
                        "Không tìm thấy bài viết trong RSS (có thể bài đã quá cũ hoặc RSS không chứa đầy đủ nội dung)."
                    );
                }

                if (!cancelled) {
                    setArticle(found);
                    setError(null);
                }
            } catch (e: any) {
                if (!cancelled) {
                    setArticle(null);
                    setError(`Lỗi tải bài viết: ${e?.message ?? "Không xác định"}`);
                }
            } finally {
                if (!cancelled) setLoading(false);
            }
        }

        load();

        return () => {
            cancelled = true;
        };
    }, [articleUrl, initialArticle]);

    return { article, loading, error };
}
