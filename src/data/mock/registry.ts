import type { CategoryRegistry, HomepageRegistry } from '../../types';

export const CATEGORY_REGISTRY: CategoryRegistry[] = [
  {
    slug: 'quoc-te',
    name: 'Quốc tế',
    rssPath: '/rss/quoc-te',
    heroIds: ['a-001'],
    hotIds: ['a-001', 'a-002', 'a-003'],
    articleIds: ['a-001', 'a-002', 'a-003', 'a-004', 'a-005', 'a-006', 'a-007', 'a-008', 'a-009', 'a-010', 'a-011', 'a-012']
  },
  {
    slug: 'quoc-te/nguoi-viet-do-day',
    name: 'Người Việt đó đây',
    rssPath: '/rss/quoc-te/nguoi-viet-do-day',
    heroIds: ['a-013'],
    hotIds: ['a-013', 'a-015'],
    articleIds: ['a-013', 'a-014', 'a-015', 'a-016']
  }
];

export const HOMEPAGE_REGISTRY: HomepageRegistry = {
  heroIds: ['a-001', 'a-002'],
  topHotIds: ['a-003', 'a-004', 'a-007', 'a-005', 'a-012'],
  sidebarHotIds: ['a-009', 'a-010', 'a-011', 'a-012', 'a-007']
};

