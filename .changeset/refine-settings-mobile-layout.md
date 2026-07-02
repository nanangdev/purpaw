---
"purpaw": Refine Settings Mobile Layout & Dynamic Header Title
---

## App shell (`(app)/route.tsx`)
- now a client component using `useRouterState`.
- settings sub-pages (`/settings/*`) hide the `SiteHeader` on mobile (`max-md:hidden`) and run full-screen.
- `NavMobile` bottom bar and its bottom padding are skipped entirely inside `/settings`.

## Site header (`site-header.tsx`)
- client component; dynamic title from route `loaderData.title`, falling back to the matching `navMain` entry, then `"Untuk Anda"`.
- on mobile the title is centered (absolute) and non-interactive; accepts a `className`.

## Settings nav (`settings-nav.tsx`)
- `SettingsNavMobile` regrouped into `mobileNavGroups` (general / profile+account / privacy / about), each rendered as its own rounded card.
- removed per-item active state; icons now use a uniform `bg-accent` tile.

## Settings sections & routes
- section `<h2>` titles changed from `md:sr-only` → `sr-only` (hidden visually at all breakpoints): about, account, general, privacy, profile.
- `about-section.tsx`: links split across two `SettingsCard` groups.
- all settings sub-routes dropped the `showBack` prop from `<SettingsShell>`.

## Misc
- `settings-shell.tsx`: reduced vertical padding (`py-6 md:py-8` → `py-4 md:py-6`).
