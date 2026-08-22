# Phase 3 — Content and page

## Goal

The full page, statically rendered with the kit: real content, real assets, light theme. No interactivity yet — the theme toggle renders inert, the form posts nowhere useful, nothing animates. **The signature check: the whole page reads perfectly with JavaScript disabled.**

## Source (the spec for every number here)

- `.claude/skills/nicolas-mateo-design/README.md` — sections "Screens / Views" 1–9 and the tokens digest.
- `.claude/skills/nicolas-mateo-design/prototype/site-b/PortraitScreens.jsx` — the exact grids/gaps/inline styles per section (`PoHeader` … `PoFooter`).
- `.claude/skills/nicolas-mateo-design/prototype/data.js` — every string.
- `.claude/skills/nicolas-mateo-design/design-system/BRAND-GUIDE.md` — before writing or editing any copy.

Never open `prototype/site-b/index.html` expecting it to run (global gotcha 1).

## Decisions (locked)

- **The lens toggle is removed** (decided with the user, 2026-08-22, superseding this phase's original dual-render decision). The site tells one story — **Senior Software Engineer** — and says everything at once: the single `03 / STACK` section splits into `03 / BACKEND` (Backend, Data, Cloud & DevOps, Observability — an even 2×2) and `04 / FULL STACK` (Frontend, AI engineering, Practices — an even 1×3). AI card renumbers to `05`, contact to `06`, matching the eyebrow sequence the brand guide already lists. Ten blocks; five nav links. No `data-lens`, no `data-lens-panel`, no `LensToggle`.
- Hero headline merges both résumés — line 1 from the full-stack CV, line 2 from the backend CV: _"Schema to shipped UI, / owned end to end."_ "Senior Software Engineer" is the **positioning label only** (hero meta row and `<title>`); the timeline and project cards keep their factual CV job titles.
- Résumés: the header button downloads `/resume-fullstack.pdf`; the contact rail carries both, `Backend · Full stack`.
- **Sections are `.astro`.** A section file is `.tsx` only if it is, or becomes, a hydrated island — `ContactForm.tsx` alone (phase 5 gives it `client:visible`). React is reserved for the frozen kit and for islands. This supersedes the original "sections are `.tsx`" decision, which could not host `astro:assets` in the hero or the phase-5 form island without slot workarounds.
- **Section layout lives in CSS class hooks** (`src/styles/sections.css`), not inline style objects, so phase 6 can add media queries without the `!important` its own decision forbids. The kit keeps its inline styles and is never forked. A class hook always sits on a section-owned element — Astro deletes `class` on framework components and the kit's frozen props have no `className`; kit components take their own `style` prop instead.
- **Content module**: `src/content/{types,profile,sections}.ts` + an `index.ts` barrel. `profile.ts` is a port of `data.js` — everything lens-neutral verbatim, the lens-keyed fields merged from both résumés using their own clauses. `sections.ts` is the ordered page manifest: eyebrow numbers, nav labels and the `SectionId` union all derive from it.
- **`imageService: "compile"`** on the Cloudflare adapter. Its default, `cloudflare-binding`, defers transforms to a runtime Cloudflare Images binding and emits `/_image` URLs; `compile` pre-optimizes with sharp at build time, which is what the portrait's avif/webp/jpg × 480/720/956 requires.
- Portrait via `astro:assets` `<Picture>`: avif/webp/jpg at 480/720/956, `loading="eager"` + `fetchpriority="high"` (it is the LCP candidate), `object-position: 50% 20%` preserved. Header/footer avatars are a single 72px `getImage` crop in `Wordmark.astro`.

## Tasks

1. [x] **Content module** (`types.ts`, `profile.ts`, `sections.ts`, `index.ts`): identity fields; hero lines and lede; `stats[4]`; `work[4]` each with one merged summary, `metrics[]`, `stack[]`; `timeline[4]` (Keel Mind ×2, Compras Compartidas, Meniu; first `current`, last `last`); `education[2]`; `skills.backend[4]` + `skills.fullStack[3]`; AI-card bullets.
2. [x] **Assets**: `assets/photos/IMG_2835.jpg` → `src/assets/portrait.jpg`; résumés → `public/resume-backend.pdf` and `public/resume-fullstack.pdf`; `git rm -r assets/` and `git rm public/favicon.ico` (the URL-unsafe originals and the Astro starter icon must not linger). Hand-authored `public/favicon.svg`: paper-0 rounded square, centred gold-500 circle, no font dependency.
3. [x] **BaseLayout.astro**: `<html lang="en">`, required title/description props, favicon link, per-theme `theme-color` metas, skip-to-content link, fonts + `global.css`. (Theme and reveal scripts are phase 4.)
4. [x] **Sections**, built in page order against the spec:
   - [x] Shared: `Section.astro` — container `max-width 1120px`, `padding 0 40px`, `margin-top 96px`; `SectionHeader` derived from the manifest; `.section-body` carries the 40px offset and self-cancels via `:first-child` when there is no header.
   - [x] `Header.astro`: sticky, `padding 14px 40px`, bg `color-mix(in oklab, var(--paper-0) 86%, transparent)` + `backdrop-filter: blur(10px)` (the only blur); 36px Avatar + wordmark with gold period; nav from `NAV` mono 11px/0.14em; right: inert ThemeToggle + secondary Resume button (download glyph → full-stack PDF).
   - [x] `Hero.astro`: `padding 80px 40px 0`, grid `minmax(0,7fr) minmax(0,5fr)` gap 64; `Tag tone="success" dot` "Open to work"; one h1 76px/0.98/-0.03em with an explicit `<br>`; lede 20px/1.6 max 48ch; primary "See selected work" + secondary "Get in touch"; meta row. Portrait 4:5, radius 12px, "BOGOTÁ · REMOTE" tab notched at `left:-1px; bottom:-1px`.
   - [x] `Stats.astro`: 4 StatBlocks, `repeat(4, minmax(0,1fr))` gap 32, top hairline.
   - [x] `Work.astro` (`#work`): 2-col grid gap 24, four ProjectBrief cards.
   - [x] `Experience.astro` (`#experience`): grid `7fr/4fr` gap 64; `<ol>` of TimelineItems; EDUCATION rail right.
   - [x] `SkillSection.astro`: one component, rendered twice — `#backend` (4 groups, `repeat(2,…)`) and `#full-stack` (3 groups, `repeat(3,…)`), gap `40px 32px`.
   - [x] `AICard.astro`: `Card tone="accent"`, grid `5fr/7fr` gap 48, eyebrow `05 / AI ENGINEERING` + sparkles glyph in `#A6762A`, four check-led bullets.
   - [x] `Contact.astro` (`#contact`): grid `7fr/5fr` gap 64; `ContactForm.tsx` (Name, Email, full-width Select, full-width Textarea rows 5) with `action="/api/contact" method="post"` and the **honeypot** `<input name="company">` visually hidden, `tabindex="-1"`, `autocomplete="off"`; right rail Email / Based in / Code / Resume rows.
   - [x] `Footer.astro`: top hairline, avatar + wordmark, TextLinks GitHub/LinkedIn (external arrows), mono "BUILT IN BOGOTÁ".
5. [x] **index.astro**: composes Header + all sections + Footer inside BaseLayout, anchors `#work` `#experience` `#backend` `#full-stack` `#contact`.
6. [x] Minimal meta only: title, description (brand voice), favicon. Full SEO is phase 7.

## Verification

- [x] `pnpm format:check`, `pnpm check` (`astro check` + `tsc --noEmit`) and `pnpm build` clean.
- [x] Layering holds: `grep -rn "from \"@/content\"" src/ui` empty; `src/content/` imports nothing but its own modules.
- [x] `grep -rni lens src/content src/sections src/layouts src/pages/index.astro src/styles` empty, and no `lens` in `dist/client/index.html`. Scoped deliberately — `src/pages/kit.astro` keeps two legitimate hits, both on the `Select` demo that shows object options with a separate value and label (`label="Lens"`, `name="kit-lens"`); it says nothing false about the page.
- [x] `grep -c '<h1' dist/client/index.html` → 1. `grep -c 'client=' dist/client/index.html` → 0; zero `<script>` in the built page.
- [x] Every icon URL in the built page resolves under `public/icons/` (19 of them; the `Icon` mask fails silently, so nothing else catches a typo).
- [x] `grep -r "fonts.googleapis" dist/` empty.
- [x] Nine portrait variants emitted (avif/webp/jpg × 480/720/956) plus the 72px avatar; no `/_image?` URL in `dist/client/index.html`.
- [x] `curl -sI localhost:4321/resume-backend.pdf` and `-fullstack.pdf` → `200`, `application/pdf`; `git ls-files assets` empty; `/favicon.ico` → 404.
- [x] Portrait renders in `pnpm dev` too: the `/_image` transform endpoint returns real avif/jpg/webp (dev routes through workerd, a different path from the build).
- [x] `pnpm preview:worker` — all six anchored sections, one h1, zero scripts, both PDFs `application/pdf`, pre-optimized avif served, `/kit` still 200.
- [ ] **JS-disabled pass** in a browser: all ten blocks visible, the five anchors scroll, both résumé links resolve, the skip link focuses `#main`. **Not done — no browser in the implementation session.** The static-HTML half is verified above (zero JS shipped, all sections in the markup). A no-JS form submit lands on a bare 404: `/api/contact` does not exist until phase 5 and the styled 404 page is phase 7 — expected, recorded here so it is not rediscovered as a bug.
- [ ] **Visual parity** at 1280px, section by section against the skill README. **Not done — needs a human.** Open question for that pass: **the hero headline wraps to four lines at 76px.** Measured from the shipped `space-grotesk-latin-wght-normal.woff2` (1000 upm, advance widths summed, `-0.03em` applied per character) against the 569px hero copy column — `(1120 − 80 gutters − 64 gap) × 7/12`:
  - _"Schema to shipped UI,"_ 770px, 35% over — breaks to _"Schema to"_ / _"shipped UI,"_.
  - _"owned end to end."_ 652px, 14% over — breaks to _"owned end to"_ / _"end."_.
  - The prototype's own longest line, _"Backend systems,"_, is 635px and also overruns, so the two-line 76px hero never fit this column — a pre-existing property of the design, not a regression the merge introduced.
  - Size steps: **61px does not fit** (618px, still 9% over); 56px is the largest that fits; 49px — phase 6's own breakpoint value — fits with room (497px).
  - The fix is the user's call — shorter copy, or overriding `--type-hero-size` — not a silent change.
- [ ] Preview URL check after pushing `dev`. **Not done — this session does not commit or push.**

## Gotchas

- Copy strings **exactly**: em dashes with spaces, `·` separators, `–` in "4–8", accents (Bogotá, Nicolás). No paraphrasing. Merged sentences reuse the résumés' own clauses — nothing invented.
- AWS and LinkedIn have no tech icons (licensing) — set them in type, per the brand guide.
- White (`#FFFFFF`) only on cards/fields; the canvas is `--paper-0`. Don't "fix" it.
- Gold text anywhere (index labels on hover, sparkles, check glyphs) is `#A6762A`, never `#E3B23C`. The hero tab's 8px top-right corner is the one sanctioned exception to "8px radius only on inputs" — recorded in `AGENTS.md`.
- The built page lives at `dist/client/index.html`, not `dist/index.html` — `dist/client` is the deployed asset directory.
- `base.css` already styles `<h1>` to the exact hero spec (76 / 0.98 / -0.03em / ink-0), so the hero heading carries no section class. Phase 6's 76 → 49px step should override `--type-hero-size`.

## Definition of Done

Inherited DoD, plus: JS-disabled pass clean, visual parity reviewed, résumés served URL-safe, preview URL shows the complete page.

## Out of scope

Any hydration: theme toggle working, reveal animation (phase 4). Form submission (phase 5). Responsive below 1280px (phase 6). Full SEO (phase 7).
