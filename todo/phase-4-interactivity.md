# Phase 4 — Interactivity

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

## Tasks

1. Implement both pieces above; replace the phase-3 inert header `ThemeToggle` with the island.
2. Add `reveal` to the `.section-body` wrapper of every section below the hero — the hook already exists in `Section.astro`, so this is a prop, not new markup. The hero and header are visible immediately — no reveal.
3. Nav link hover/active states (transparent 1px bottom border → `1.5px solid #E3B23C`, text → `#26251F`), CSS only, 140ms.
4. Record the shipped-JS baseline: list `dist/client/_astro/*.js` sizes (expect the React runtime + one small island and nothing else) in the PR description — phase 7 budgets against it.

## Verification (manual matrix — phase 6 automates it)

- **Theme**: set dark, hard-reload — no flash of light theme; choice survives restart; system-dark with no stored choice → dark on first visit.
- **No-JS**: with JS disabled, everything is visible immediately (`reveal-ready` never applied). Also block only `reveal.ts` in devtools — the 900ms fallback path can't help there, so confirm content was never hidden (no `reveal-ready` without the script).
- **Reduced motion**: emulate `prefers-reduced-motion: reduce` → no animation, all content visible instantly.
- **Reveal correctness**: elements animate once on first entry (scroll down, up, down — no re-animation); with the observer artificially broken (e.g. comment it out in devtools), the 900ms fallback reveals everything.
- Bundle check: only the ThemeToggle island + runtime in `dist/client/_astro/`; no JS attributed to static sections.
- All of the above re-checked on the `dev` preview URL.

## Gotchas

- The theme script must be `is:inline` (not bundled/deferred) and precede any painted content — Astro hoists processed scripts; inline it explicitly.
- Order of operations in `reveal.ts` is the whole point: observer first, `reveal-ready` second. Reversed, a failed observer hides the page — the exact failure the spec's 900ms fallback and this ordering exist to prevent.
- `.is-in` must win over `.reveal-ready .reveal` by source order in the token CSS — don't reorder `global.css` imports.

## Definition of Done

Inherited DoD, plus: the full manual matrix passes locally and on the preview URL; JS baseline recorded in the PR.

## Out of scope

Form submission and sent states (phase 5). Playwright automation of this matrix (phase 6). Any additional animation — the spec allows exactly this set.
