import {CATEGORIES} from '../data/menu';
import type { NavItem} from '../types/types.ts';

// Lấy categories để render menu Header
export async function getCategories(): Promise<NavItem[]> {
    return CATEGORIES;
}

