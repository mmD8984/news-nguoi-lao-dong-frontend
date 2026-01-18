/**
 * Lấy URL avatar cho user
 * Ưu tiên:
 * 1. Avatar thật của user (nếu có)
 * 2. Avatar generated theo tên (ui-avatars.com)
 */
export function getUserAvatarUrl(name: string, avatar?: string | null): string {
    if (avatar) return avatar;
    
    // Fallback: Generate avatar from initials
    const seed = encodeURIComponent(name || 'User');
    return `https://ui-avatars.com/api/?name=${seed}&background=random&color=fff&size=128`;
}
