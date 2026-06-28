---
"purpaw": Fix (Chore) Lint & Accessibility
---

## Accessibility (per audit report `.internal-note/a11y/landing-page.md`)
- header menu jadi dialog ARIA: `aria-expanded/haspopup/controls` di toggle, `role="dialog" aria-modal` + `id` di panel, `inert` saat tertutup, **focus trap + Escape + restore focus**.
- add skip-to-content (valley) di top-center, muncul saat keyboard focus; `<main id tabIndex={-1}>`.
- `<html lang="id">` + `<title>` deskriptif.
- FAQ: accordion `aria-expanded/controls` + `role="region"`; tabs jadi pola penuh (`tablist/tab/tabpanel`, `aria-selected`, roving tabindex, ←/→/Home/End).
- hero `<video>` `aria-hidden` + tidak autoplay saat `prefers-reduced-motion`.
- footer: `aria-hidden` pada teks besar "Purpaw"; focus-visible pada social links.
- feature image `alt` pakai judul fitur aktif.
- focus-visible di link-hover-bg variants & link menu.
- `SpinningText` hormati `prefers-reduced-motion`.
- "Start Now" → link `/login`.

## Lint / Type fixes
- `spinning-text.tsx`: pecah inline `type` specifier ke top-level `import type`, `React.CSSProperties` → `CSSProperties`, hapus optional chain berlebih (runtime-safe via cast `| undefined`).
- install `ogl` (fix `Cannot find module 'ogl'` di `bg-light-fall.tsx`).

## Other
- add `.agents/skills/a11y-audit` skill.
- add `<noscript>` banner global (bg destructive, fixed bottom) saat JavaScript dimatikan.
- add komponen `CookieConsent` (preview, belum disistemkan): kartu frosted ala Apple, ikon Phosphor, shadcn `Switch`/`Button`, panel "Sesuaikan" (toggle per kategori, Wajib dikunci), tombol full split-2 di mobile / content-width di desktop, `role="region"` + kontras teks gelap.
