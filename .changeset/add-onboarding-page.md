---
"purpaw": Add Onboarding Page & Theme System
---

## Onboarding (`(login)/onboarding/`)
- add a multi-step onboarding wizard powered by OnboardJS (`@onboardjs/core` + `@onboardjs/react`): account → welcome → choose style → subscribe → done.
- step transitions & content reveal via GSAP — new `StepReveal` runs a `gsap.fromTo` (opacity + y, staggered) inside an isomorphic layout effect, with `clearProps` so the final state always settles to idle (fixes the last item getting stuck faded); honors `prefers-reduced-motion`.
- headings & descriptions animate through `TextAnimate` (word-stagger).
- Apple-style step indicator: dots, the active one widens and turns primary; content stays vertically centered (`flex-1`) while the dots pin to the bottom (not `absolute`, so they never overlap content).
- account step: name + username (regex, no leading `@`, animated username-availability error/hint slot), required-field markers.
- style step: Light/Dark picker — selection is shown as a ring on the preview image (no border/checklist), responsive divided layout.
- Lenis smooth scroll scoped to the route (cleaned up on unmount).
- persistence intentionally left as `TODO(wire)` for a database backend (`customOnDataLoad` / `customOnDataPersist`).

## Theming (light / auto / dark)
- add `src/components/theme/theme-provider.tsx` — custom, SSR-safe provider: persists `localStorage["theme"]`, toggles `.dark` + `color-scheme` on `<html>`, follows `prefers-color-scheme` while in auto mode.
- `__root.tsx`: `suppressHydrationWarning` on `<html>`, inline anti-flash script in `<head>` (applies the theme before first paint → no FOUC), app wrapped in `<ThemeProvider>`.
- onboarding style step & Sonner toaster now consume the custom `useTheme` (`resolvedTheme`).

## Token migration / dark-mode
- `cookie-consent.tsx`: hardcoded `neutral-*` / `black` / `white` swapped for `card` / `foreground` / `border` tokens so it adapts to the theme.
- manual dark-mode accent overrides (`dark:text-blue-500` family) on the landing paw, the 2FA recovery links, and the login inputs / resend control.

## Other
- deps: add `@onboardjs/core` and `@onboardjs/react` (1.0.0-rc).
- `next-themes` is now unused (still installed) after moving to the custom provider.
