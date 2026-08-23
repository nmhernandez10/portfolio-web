# Phase 6 — Responsive and quality

## Goal

Close the prototype's one known gap — it is designed at 1280px and not responsive — then lock quality in: an accessibility pass and the permanent automated test harness (Playwright smoke + axe in CI).

## Decisions (locked)

- Responsive rules live as media queries in `global.css` targeting section-level class hooks. **Component files are not forked** — the kit components use inline styles and stay as-is; layout is the sections' concern. Where a section's inline grid style can't be overridden cleanly, move that one declaration to a class in `global.css` (preferred over `!important`).
- Breakpoints per the spec:
  - **< 960px**: every `7fr/5fr`, `7fr/4fr`, `.skills-grid--3`, `.skills-grid--2` and `.work-grid` collapses to one column; portrait first, full width, still 4:5. Stats: 2×2 (judgment call — recorded here) until 720, then single column.
  - **< 720px**: hero heading 76 → 49px (override `--type-hero-size`; the hero `<h1>` takes its size from `tokens/base.css`, not a section class), section headings 39 → 31px, gutters 40 → 20px.
  - **Nav moves at 960, not 720** (corrected during implementation, with the user). The skill's 720 figure was prose, never measured: the desktop header needs 915px, so every width from 720 to 769 scrolled sideways — 768px, iPad portrait, included. Moving the nav with the grids at 960 leaves 45px of slack and gives the page a single narrow-mode boundary instead of two. `e2e/smoke.spec.ts` sweeps thirteen widths and asserts both no horizontal scroll and an un-truncated wordmark, so this cannot regress quietly.
- **Mobile nav: a styled `<details>/<summary>` panel — zero JS**, honoring the site's ethos and working without hydration. `summary` shows the menu glyph (swap to `x` via `details[open]` CSS); the open panel lists the five anchor links; a small inline enhancement may close it on link tap, but it must be fully usable without it. Not a third React island.
- **Test harness**: Playwright + `@axe-core/playwright`. Two specs: `e2e/smoke.spec.ts`, `e2e/a11y.spec.ts`. Runs in CI after build against `astro preview` (since phase 6.1: `wrangler pages dev` on 8788 — amended 2026-08-22). Contact-endpoint tests only exercise validation-error and honeypot paths — **CI must never send real email**.

## Tasks

1. [x] **Responsive CSS** per the breakpoints above. Also verify at ~390px (modern phone): no horizontal scroll, the portrait crop keeps the face (`50% 20%` still sane), the ProjectBrief metrics rows wrap, form fields go full width.
2. [x] **Mobile nav** as decided; keep the ThemeToggle visible outside the collapsed menu.
3. [x] **Accessibility pass** (checklist — fix everything found):
   - [x] Landmarks: `header` / `nav` / `main` / `footer`; skip link (from phase 3) actually focuses `main`. `BaseLayout` now owns `<main id="main" tabindex="-1">`; `/kit` had no main landmark at all.
   - [x] Exactly one `<h1>` in the accessibility tree, logical heading order below it — already true, asserted in `smoke.spec.ts`.
   - [x] ThemeToggle exposes an accessible name, role and state (follow the kit markup as authored) — verified as authored, unchanged.
   - [x] Form: every field labelled; errors tied via `aria-describedby` (added internally to `Input`/`Textarea`, frozen prop API untouched); honeypot `aria-hidden` and out of tab order — already correct.
   - [x] Focus: visible DS ring on every interactive element — `summary:focus-visible` added, since `base.css`'s frozen selector list predates `<details>`. Keyboard traversal in order; the panel does not trap focus.
   - [x] Contrast: measured, not spot-checked. Light `--text-muted`, `--status-success` and `--status-danger` all missed AA and are corrected by light-scoped overrides in `global.css`. Gold stays `#A6762A` by law and is the one documented exemption in the axe gate. Dark measures clean.
   - [x] Reduced-motion honored — re-verified: `reveal-ready` is never added and content sits at opacity 1.
4. [x] **Playwright**: `pnpm create playwright` (Chromium is enough) →
   - `smoke.spec.ts`: page renders with all five anchor sections; theme toggle flips `data-theme` and persists across reload; both resume links return 200; `POST /api/contact` with missing email → 400, with honeypot → ok:true (no send assertion is implicit — sandbox key anyway).
   - `a11y.spec.ts`: axe scans of `/` in light **and** dark, and `/kit`; zero violations.
   - `pnpm test:e2e` script; CI job: build → run preview server → test (use Playwright's `webServer` config), with browser caching in the workflow.
5. [x] Amend `CLAUDE.md`: `pnpm test:e2e`, the no-real-email rule for tests, responsive class-hook convention.

## Verification

- Viewport sweep at 1280 / 960 / 720 / 390: no horizontal scroll, no overlap, hierarchy intact, mobile nav opens/closes and navigates — with and without JS.
- Full keyboard-only traversal of the page.
- `pnpm test:e2e` green locally and in CI; axe zero violations in both themes.
- Preview URL checked at phone width (`HUMAN:` optionally on a real device).

## Gotchas

- The reveal transform is `translateY` only — confirm it causes no CLS on mobile (it shouldn't; transforms don't reflow).
- Don't collapse the sticky header's blur/border styling at small sizes — only the nav moves into the menu.
- axe on the dark theme requires setting `data-theme` before the scan (or clicking the toggle in the test).
- Keep e2e tests few and load-bearing: this suite exists to guard the three behaviors + endpoint + a11y, not to chase coverage.

## Definition of Done

Inherited DoD, plus: e2e wired into CI and green, viewport sweep clean, axe clean both themes, keyboard traversal verified.

## Out of scope

Lighthouse budgets and OG/meta (phase 7). New visual design at small sizes beyond the spec's breakpoint rules — collapse, don't redesign.
