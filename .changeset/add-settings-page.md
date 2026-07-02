---
"purpaw": Add App Shell & Settings Pages
---

## App shell (`(app)/`)
- new `route.tsx` → `AppLayout`: `SidebarProvider` (inset variant) wrapping `AppSidebar` + `SiteHeader` + `<Outlet>`, with `--sidebar-width` / `--header-height` tokens.
- `layout/primary/`: `app-sidebar` (logo + collapsible nav + user footer), `site-header`, `nav-main`, `nav-user` — user dropdown with Settings link, a **Language** submenu and a **Learn more** submenu (about / legal / tour / privacy), and a destructive logout.

## Settings (`(app)/settings/`)
- responsive shell: sticky left nav on `xl+`, horizontal tabs on `md–lg`, section list + back button on mobile; active link tracked via `use-active-path`.
- pages: `general` (theme toggle + language select + restart tour), `profile`, `account`, `privacy`, `about`; `index` shows mobile nav or desktop `GeneralSection`.
- **profile**: avatar upload, username (`@` prefix, 3–20 `[a-z0-9_]`, non-matching chars stripped, `aria-invalid`), full/nickname, dirty-detected save button that animates open via a `grid-rows` transition.
- **account**: logout (this/all), delete-account `AlertDialog`, 2FA `Switch`, active-sessions `Table` (date-fns + `id` locale, "saat ini" badge).
- **privacy**: collapsible disclosures, analytics/marketing cookie switches, export-data, report.
- **about**: support / bug / license rows + app version.
- **avatar-uploader**: hover & mobile overlays, dialog with preview → `react-easy-crop` round cropper (zoom slider) → cropped output via `crop-image.ts`; upload/change/remove with `ActivityIndicator` states.
- demo data / API calls left as `TODO(wire)`; language list static (`languages.ts`) — ready for Intlayer.

## UI fixes
- logical props: `end-*` → `inset-e-*` (avatar, select, dropdown-menu indicators); `cursor-default` → `cursor-pointer` on dropdown items (+ `disabled:cursor-default`).
- `table.tsx`: `tabIndex={0}` on the scroll container for keyboard access.
- `sidebar.tsx`: inner `<div>` → `<aside aria-label="Sidebar">`, `SidebarIcon` → `SidebarSimpleIcon` (light), trigger `icon-sm` → `icon-lg`, `px-1` floating padding, collapsed-inset margin fix.

## Routing
- replace `<a href="/login">` with TanStack `<Link to="/login">` in the landing hero/header/menu and `2fa.tsx` (client-side navigation).

## Other
- deps: add `react-easy-crop`.
