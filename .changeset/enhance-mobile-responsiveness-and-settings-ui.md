---
"purpaw": Enhance Mobile Responsiveness & Settings UI
---

## Mobile navigation
- new `nav-data.ts` — shared `navMain` + `NavItem` type with visibility flags (`isShowSidebar`, `isShowSidebarMobile`, `isShowNavMobile`); `app-sidebar.tsx` now sources items from it.
- new `NavMobile` (`nav-mobile.tsx`) — floating bottom pill bar (`md:hidden`), active indicator via Motion `layoutId` spring, active icon `fill` weight; honors `prefers-reduced-motion`.
- `(app)/route.tsx` — mounts `<NavMobile />`, adds `--bottom-nav-height` token and bottom padding on `<main>` (with `safe-area-inset`).
- `nav-main.tsx` — filters items by `isMobile`, active state via `useRouterState`, active icon `fill` + `isActive`/`aria-label`.
- `sidebar.tsx` — `SidebarTrigger` shows `EqualsIcon` (hamburger) on mobile, `SidebarSimpleIcon` on `md+`.
- `site-header.tsx` — removed `border-b` change to `md:border-b`.

## Settings UI
- `general-section.tsx` — theme `ToggleGroup` (Sun/Moon/CircleHalf) replaced with a 3-column `ThemeCard` image-preview picker (ring + check badge on active); `placehold.co` dummy previews.
- `settings-card.tsx` — `SettingsRow` gains `fullWidthControl` + `controlClassName` (control wrapper `w-full` on mobile, `md:w-auto`); `SettingsDescription` `<p>` → `<div>`.
- `privacy-section.tsx` — description prefixed with a `ShieldStarIcon` badge box.
- `profile-section.tsx` — rows use `fullWidthControl`.
- `nav-items.ts` — Privacy icon `ShieldIcon` → `ShieldChevronIcon`.
