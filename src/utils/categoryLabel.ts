import { CATEGORIES } from "@/data/menu/categories";

function normalizePathToSlug(path: string) {
    return path.split("/").filter(Boolean).pop() || "";
}

export function getCategoryLabelFromSlug(slug: string): string {
    const s = (slug || "").trim().replace(/^\/+|\/+$/g, "");
    if (!s) return "";

    for (const c of CATEGORIES) {
        if (normalizePathToSlug(c.path) === s) return c.label;

        for (const sub of c.subItems || []) {
            if (normalizePathToSlug(sub.path) === s) return sub.label;
        }
    }

    return s.replace(/-/g, " ");
}
