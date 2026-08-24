# Phase 4 — Interactivity

> **Amended 2026-08-23 — the JS baseline needs re-measuring.** Task 4's chunk table and the bundle-check bullet were measured against `dist/client/_astro/` under the `@astrojs/cloudflare` adapter, which phase 6.1 removed; the path is now `dist/_astro/`. Phase 7's "Total JS shipped ≤ 90KB gzip (baseline recorded in phase 4)" budget must re-measure there rather than carry these numbers forward — they are a record of what the adapter build emitted, not of what ships today. `wrangler dev` in Verification is now `pnpm preview` on 8788.

## Goal

The two behaviors the site still defines — theme toggle and scroll reveal — implemented exactly, and nothing more. "Nothing else moves." May run before or after phase 5.

> The spec's third behavior, the Backend ↔ Full stack lens toggle, was removed in phase 3 (see `README.md`). Backend and full stack are their own sections now; there is no `data-lens`, no `LensToggle`, and no dual-rendered markup.

## Decisions (locked)

- **Theme**: two parts.
  - An `is:inline` script in the BaseLayout `<head>`, before any stylesheet paint: read `localStorage.theme`; else `matchMedia("(prefers-color-scheme: dark)")`; else `light`; set `data-theme` on `<html>`. This kills FOUC.
  - The kit `ThemeToggle` as an island in `Header.astro` (`client:load`, replacing the inert phase-3 render): on mount, sync state from `document.documentElement.dataset.theme`; on toggle, write the attribute and `localStorage.theme`.
- **Reveal**: vanilla `src/scripts/reveal.ts` loaded from BaseLayout — no React. The CSS contract already lives in `tokens/base.css` (`.reveal-ready .reveal` hidden → `.reveal.is-in` visible, 520ms `--ease-entrance`, offset 14px, reduced-motion override). The script must:
  1. Bail entirely — never add `reveal-ready` — if `matchMedia("(prefers-reduced-motion: reduce)")` matches (the CSS media query is defense in depth, not the mechanism).
  2. Construct the `IntersectionObserver` (`rootMargin: "-40px"`) **first**, then add `reveal-ready` to `<html>` — content must never be hidden without an armed observer.
  3. Add `is-in` on first intersection, then `unobserve` that element.
  4. Run a 900ms `setTimeout` fallback that adds `is-in` to every `.reveal` regardless.

> Two amendments agreed with the user during implementation. **(a)** The 900ms fallback is guarded on whether the observer ever reported, not unconditional: taken literally, "regardless" would reveal every section 900ms after load and the scroll reveal would never fire below the fold. The guarded form is what the prototype, the skill README ("if the observer never fires") and this doc's own verification bullet all describe. **(b)** Before adding `reveal-ready`, the script synchronously reveals any `.reveal` already at or above the fold line and does not observe it. The observer's first batch is asynchronous, and `.reveal-ready .reveal` carries the 520ms transition, so adding `reveal-ready` starts a _fade-out_ that the first batch has to interrupt — on a main thread busy hydrating the toggle that is a visible dip-and-recover. This keeps decision 2's ordering and makes "content is never hidden without an armed observer" literally true rather than true-modulo-one-async-hop; it is a deviation from decision 3's letter, since in-view elements get `is-in` without an intersection event.

## Tasks

1. [x] Implement both pieces above; replace the phase-3 inert header `ThemeToggle` with the island. **Done:** the kit component is untouched — persistence lives in a `src/sections/SiteThemeToggle.tsx` wrapper, which is both what the design system's own `ThemeToggle.prompt.md` prescribes and structurally required (Astro cannot pass `onChange` across an island boundary). `/kit` got the same island: once the head script lands, its bare uncontrolled toggle would start "light" on a dark page and take two clicks to leave dark.
2. [x] Add `reveal` to the `.section-body` wrapper of every section below the hero — the hook already exists in `Section.astro`, so this is a prop, not new markup. The hero and header are visible immediately — no reveal. **Done as an unconditional class, not a prop** (agreed with the user): every `<Section>` is below the hero by construction, so a prop would be passed at all 6 call sites, omitted at none, and need a pass-through in `SkillSection.astro` purely to forward it. 7 rendered instances carry it.
3. [x] Nav link hover/active states (transparent 1px bottom border → `1.5px solid #E3B23C`, text → `#26251F`), CSS only, 140ms. **Done** as `.site-nav__link:hover, :focus-visible` using `var(--text-body)` / `var(--accent-line)` rather than the literal hexes, which would pin the nav to light-theme colours inside `[data-theme="dark"]`. 0,2,0 is the specificity needed to beat the global `a:hover` (0,1,1) in `tokens/base.css`.
4. [ ] Record the shipped-JS baseline: list `dist/client/_astro/*.js` sizes (expect the React runtime + one small island and nothing else) in the PR description — phase 7 budgets against it. **Measured, not yet in a PR** (no PR opened this phase):

   | chunk                         |     raw |   gzip |
   | ----------------------------- | ------: | -----: |
   | `client.C1qLyNJj.js`          | 184,092 | 57,181 |
   | `react.Q2GtEPr4.js`           |   7,607 |  2,936 |
   | `SiteThemeToggle.zKSZalap.js` |   2,082 |  1,168 |
   | **total**                     | 193,781 | 61,285 |

   `reveal.ts` emits no chunk — Astro inlines it into each page as a deferred `<script type="module">`. Net change against the phase-3 build is **−24,346 B raw**: the old island entry was the `@/ui` barrel itself, so Rollup could not tree-shake it (26,428 B); entering through `SiteThemeToggle.tsx` prunes the unused 19 components.

## Verification (manual matrix — phase 6 automates it)

Static checks, all passing: `pnpm format:check`, `pnpm check` (0 errors / 0 warnings / 0 hints across 46 files), `pnpm build`, `grep -r "fonts.googleapis" dist/` empty, and the same page served from workerd via `wrangler dev` (200, invariants intact).

Built-HTML checks, all passing: the `is:inline` theme script sits in `<head>` after the viewport meta and before `<title>` and the stylesheet link; `class="section-body reveal"` appears exactly 7 times; `reveal-ready` appears nowhere in shipped markup; one `client="load"` island per page; `.reveal.is-in`, the reduced-motion override and the print reset all follow `.reveal-ready .reveal{opacity:0}` in the bundled CSS, so the cascade resolves by source order as designed.

The browser matrix below **still needs a human — no browser in the implementation session** (same limitation as phases 2 and 3):

- [ ] **Theme**: set dark, hard-reload — no flash of light theme; choice survives restart; system-dark with no stored choice → dark on first visit.
- [ ] **No-JS**: with JS disabled, everything is visible immediately (`reveal-ready` never applied). Also block only `reveal.ts` in devtools — the 900ms fallback path can't help there, so confirm content was never hidden (no `reveal-ready` without the script).
- [ ] **Reduced motion**: emulate `prefers-reduced-motion: reduce` → no animation, all content visible instantly.
- [ ] **Reveal correctness**: elements animate once on first entry (scroll down, up, down — no re-animation); with the observer artificially broken (e.g. comment it out in devtools), the 900ms fallback reveals everything.
- [ ] **Slow-load reveal**: throttle to Slow 3G and scroll to Work before the module lands — no dip-out-and-back (the synchronous pre-pass case, see Decisions).
- [ ] **Print**: print-preview the page with several sections unrevealed — nothing prints blank.
- [ ] **Nav**: hover and keyboard-focus both swap the border to 1.5px gold and the text to ink, in both themes.
- [x] Bundle check: only the ThemeToggle island + runtime in `dist/client/_astro/`; no JS attributed to static sections. (`reveal.ts` is inlined into the HTML rather than emitted as a chunk.)
- [ ] All of the above re-checked on the `dev` preview URL.

## Gotchas

- The theme script must be `is:inline` (not bundled/deferred) and precede any painted content — Astro hoists processed scripts; inline it explicitly.
- Order of operations in `reveal.ts` is the whole point: observer first, `reveal-ready` second. Reversed, a failed observer hides the page — the exact failure the spec's 900ms fallback and this ordering exist to prevent.
- `.is-in` must win over `.reveal-ready .reveal` by source order in the token CSS — don't reorder `global.css` imports.

## Definition of Done

Inherited DoD, plus: the full manual matrix passes locally and on the preview URL; JS baseline recorded in the PR.

**Not met yet** — the browser matrix and the preview-URL pass are outstanding, and no PR has been opened. Status is _Implemented_, not _Done_.

## Out of scope

Form submission and sent states (phase 5). Playwright automation of this matrix (phase 6). Any additional animation — the spec allows exactly this set.
