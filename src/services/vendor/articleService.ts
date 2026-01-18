import type {Article} from "@/types/types.ts";

const API_BASE_URL = "http://localhost:3000/api";

/**
 * Fetches article content from the local API server.
 * @param url - The original URL of the article to fetch.
 * @returns Promise resolving to the Article object.
 */
export const fetchArticleContent = async (url: string): Promise<Article> => {
    try {
        const encodedUrl = encodeURIComponent(url);
        const response = await fetch(`${API_BASE_URL}/article?url=${encodedUrl}`);

        if (!response.ok) {
            throw new Error(`Failed to fetch article: ${response.statusText}`);
        }

        const data = await response.json();
        return data as Article;
    } catch (error) {
        console.error("Error fetching article content:", error);
        throw error;
    }
};
