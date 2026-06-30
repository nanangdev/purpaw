---
"purpaw": Add (Global) 404, Login & 2FA Pages
---

## 404 Page
- add `src/components/not-found.tsx` — interactive global 404 (popcat on hold/click + pop SFX via CDN, TextRoll on the "4"s, "Back to Home" button).
- wire `<NotFound />` as the global `notFoundComponent` in `src/routes/__root.tsx` (replaces inline 404).

## Login & 2FA
- add `(login)` route group: `route.tsx` layout (`<main>` + `<Outlet />`), `login/index.tsx`, `auth/2fa.tsx`.
- login page: Paw logo, Google sign-in button + "Terakhir digunakan" badge, floating-label email form, HLS (Mux) looping video on desktop — lazy `hls.js`, honors `prefers-reduced-motion`.
- 2FA page: 6-digit OTP auto-submit, reset button; status (`idle`/`verifying`/`success`/`error`) drives a Dynamic Island feedback pill. `DEMO_VALID_CODE = '123456'` is a stub — marked `TODO(wire)` to swap for real server verify.

## Components / motion
- add `src/components/motion/dynamic-island.tsx` — Apple-style morphing pill (Provider + reducer + size presets + scheduled animations, spring physics).
- add `src/components/layout/bg-pixel-blast.tsx` — Three.js + postprocessing pixel-particle background (shapes, ripples, optional liquid/noise, offscreen auto-pause).
- add `src/components/logos/google.tsx` — Google logo SVG.

## Other
- deps: add `three`, `postprocessing`, `@types/three`.
- `input-otp.tsx` slot styling — `border-foreground/30` + `bg-card`.
- `.gitignore` — ignore `.kilo`.
