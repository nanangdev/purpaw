---
"purpaw": Add (Landing page) FAQ Section & Footer
---

- add footer:
    * sticky footer reveal — content card covers big "Purpaw" text, revealed on scroll.
    * auto year on copyright.
    * gradient (black -> white) on the big "Purpaw" text.
    * reusable Link000 hover component on nav links.
- add FAQ section.
- wired `<LandingFooter />` in route (replaced empty `<footer>`).
- wired anchor "FAQ" to scroll FAQ section.
- replaced empty `<section className="h-svh">` with `<LandingFaq />`.

---

## Other
- add `src/components/motion/text-roll.tsx`; used on header menu items (Feature / Preview / AI / FAQ).
- add `src/components/glymph/link-hover-bg.tsx` reusable link hover variants (from Skiper UI); removed `next/link` dependency (project uses TanStack Router).
- a11y: mark PawCursor decorative elements (`canvas`, `motion.div`, `svg`) with `aria-hidden="true"` to fix "Content not in landmarks".
- header: menu links use TextRoll + drop `hover:text-zinc-500`; border-transparent -> border-transparent!.
- preview.tsx: `lg` -> `xl` breakpoints for bezel & word size; copy & spacing tweaks.
- ai-powered.tsx: TextAnimate (slideUp by word) on header; `lg` -> `xl` layout breakpoints; pixel-font label; copy & spacing tweaks.
- index.tsx: SpinningText outline styling; separator `pt-6`.
