# Style Guide

## Stack and entry points
- React 19 + Vite
- React-Bootstrap components with Bootstrap 5 CSS loaded via CDN in `index.html`
- SCSS compiled from `src/styles/app.scss`, imported in `src/main.tsx`

## SCSS structure
- `src/styles/base/variables.scss`: design tokens (CSS variables)
- `src/styles/base/base.scss`: global resets and Bootstrap overrides
- `src/styles/utilities/utilities.scss`: small utility helpers
- `src/styles/utilities/responsive.scss`: responsive helpers
- `src/styles/components/*.scss`: component styles
- `src/styles/layout/*.scss`: layout styles (header, footer, sidebar)
- `src/styles/pages/*.scss`: page-specific styles

## Design tokens (CSS variables)
- Colors: `--nld-red`, `--nld-blue`, `--nld-dark`, `--nld-auth`, `--nld-text`, `--nld-gray`, `--nld-nav-bg`, `--nld-nav-hover`, `--nld-border`, `--nld-border-light`
- Fonts: `--font-primary` ("Inter"), `--font-secondary` ("Merriweather")
- Font sizes: `--fs-xs`..`--fs-5xl`
- Line heights: `--lh-tight`, `--lh-normal`, `--lh-relaxed`
- Spacing scale: `--spacing-1`..`--spacing-16`
- Radius: `--radius-sm`, `--radius-md`, `--radius-lg`, `--radius-full`
- Shadows: `--shadow-sm`, `--shadow-md`, `--shadow-lg`
- Transitions: `--transition-fast`, `--transition-base`
- Header heights: `--header-top-height`, `--header-nav-height`, `--header-total-height`

## Typography
- Body uses `--font-primary` (Inter); headings use `--font-secondary` (Merriweather)
- Utilities: `font-inter`, `font-sans`, `font-serif`
- Common sizes: news card titles and article headings are defined in `src/styles/components/news-card.scss` and `src/styles/pages/article.scss`

## Layout and grid
- Use `Container`, `Row`, `Col` from React-Bootstrap for layout
- Rely on Bootstrap utilities for spacing, flex, borders, text, etc. (`d-flex`, `gap-*`, `text-*`, `border-*`)
- Header uses `header__*` classes with a sticky nav and mega menu

## Component and page patterns
- News cards: `news-card` and related classes in `src/styles/components/news-card.scss`
- Article page: `article-page__*`, `article-toolbar-*`, `comment-*` in `src/styles/pages/article.scss`
- Auth page: `auth-page__*` in `src/styles/pages/auth.scss`
- Profile page: `profile-*` in `src/styles/pages/profile.scss`
- Sidebar: `sidebar-*` in `src/styles/layout/sidebar.scss`
- Footer: `footer__*` in `src/styles/layout/footer.scss`

## Utilities and helpers
- Colors: `text-nld-red`, `text-nld-blue`, `bg-nld-red`, `bg-nld-blue`, `bg-nld-auth`
- Hover helpers: `hover-link`, `hover-shadow`, `hover-bg-gray`
- Misc: `cursor-pointer`, `no-scrollbar`, `border-end-lg-custom`

## Image sizing helpers
- `article-img-lg`, `article-img-md`, `article-img-sm` for aspect ratio and `object-fit: cover`
- `news-thumb-sm`, `news-thumb-search`, `news-thumb-list`, `category-hero-thumb`
- `news-card-img` handles hover zoom in `news-card`

## Conventions for new work (AI)
- Use React-Bootstrap components first, then layer custom classes
- Prefer Bootstrap utility classes for spacing/alignment before adding new CSS
- Add new CSS in the appropriate SCSS file by scope:
  - Component: `src/styles/components/`
  - Page: `src/styles/pages/`
  - Layout: `src/styles/layout/`
  - Utility: `src/styles/utilities/`
- Follow BEM-like naming: `block__element` and `block__element--modifier`
- Use CSS variables for colors, sizes, spacing, and transitions
- Keep typography consistent: serif for headlines, sans for body
- Avoid non-ASCII characters in CSS `content` values; use escaped Unicode (e.g. `\2022`) if you need bullets
