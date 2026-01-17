export function decodeArticleParam(id?: string): string {
    if (!id) return "";
    try {
        return decodeURIComponent(id);
    } catch {
        return id;
    }
}

export function normalizeUrl(input: string): string {
    const raw = (input || "").trim();
    if (!raw) return "";

    try {
        const u = new URL(raw);
        u.hash = "";
        return u.toString().replace(/\/$/, "");
    } catch {
        return raw.replace(/\/$/, "");
    }
}

export function isSameUrl(a: string, b: string): boolean {
    return normalizeUrl(a) === normalizeUrl(b);
}
