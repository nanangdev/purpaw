---
"purpaw": Add OTP/Magic-link Login Flow & Fix DeepScan Issues
---

## Login — email verification flow (`(login)/login/index.tsx`)
- rewrite into a multi-step state machine (`email` ↔ `verify`) with `AnimatePresence` step transitions; split into `Login`, `EmailStep`, `VerifyStep`, `VerifyIsland`. Respects `prefers-reduced-motion`.
- **email step**: controlled, regex-validated email form (submit gated), Google button, and the "Terakhir digunakan" badge now reflects the *actually* last-used method (`oauth` | `manual`) — persisted to `localStorage` (`purpaw:last-used-method`), read on mount.
- **verify step** (Linear-style — both a code and a magic link are sent to the inbox):
  - default **link** mode: "Enter code manually" (secondary) + "Back to login".
  - **code** mode (revealed after "Enter code manually"): a single `Input` replaces the 6-slot `InputOTP` to support variable-length codes; value is uppercased via JS (so the placeholder stays untouched), `autoComplete="one-time-code"`, submit only via the "Continue with login code" button (no auto-submit), resend with a **60s** cooldown that turns `primary` when active.
- **Dynamic Island** feedback wired for both flows — verify (`verifying`/`success`/`error`) and resend (`sending`/`sent`), reusing the same morphing pill as `auth/2fa.tsx`.
- demo stubs (`DEMO_VALID_CODE`, send/verify/result durations) with `TODO(wire)` markers for the real backend calls.

## Fixes (DeepScan)
- `bg-pixel-blast.tsx` — dead `let intensity = 1` (always overwritten by the if/else) collapsed into a `const` ternary. Resolves [#1](https://github.com/nanangdev/purpaw/issues/1) (`UNUSED_VAR_ASSIGN`).
- `chart.tsx` — `item?.value !== undefined` → `item.value !== undefined` (`item` is a non-null `payload.filter().map()` element), making the access consistent with the rest of the block. Resolves [#2](https://github.com/nanangdev/purpaw/issues/2) (`INSUFFICIENT_NULL_CHECK`).

## Other
- login no longer imports `input-otp` (`InputOTP`/`REGEXP_ONLY_DIGITS`); uses the `Input` UI component instead.
