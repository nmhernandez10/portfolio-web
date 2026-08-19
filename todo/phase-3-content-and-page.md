# Phase 3 — Content and page

## Goal

The full nine-block page, statically rendered with the kit: real content, real assets, default lens `be`, light theme. No interactivity yet — toggles render inert, the form posts nowhere useful, nothing animates. **The signature check: the whole page reads perfectly with JavaScript disabled.**

## Source (the spec for every number here)

- `.claude/skills/nicolas-mateo-design/README.md` — sections "Screens / Views" 1–9 and the tokens digest.
- `.claude/skills/nicolas-mateo-design/prototype/site-b/PortraitScreens.jsx` — the exact grids/gaps/inline styles per section (`PoHeader` … `PoFooter`).
- `.claude/skills/nicolas-mateo-design/prototype/data.js` — every string.
- `.claude/skills/nicolas-mateo-design/design-system/BRAND-GUIDE.md` — before writing or editing any copy.

Never open `prototype/site-b/index.html` expecting it to run (global gotcha 1).

## Decisions (locked)

- Sections are React `.tsx` in `src/sections/`, one per prototype `Po*` component, statically rendered (no `client:` directives this phase). Header and footer are `.astro` shells (`src/sections/Header.astro`, `Footer.astro`) so phase 4 can slot islands into them.
- **Dual-lens markup**: both lens variants of every swap point render in the HTML, wrapped with `data-lens-panel="be"` / `data-lens-panel="fs"`; `<html data-lens="be">` is set statically in BaseLayout. CSS in `global.css`:
  ```css
  [data-lens="be"] [data-lens-panel="fs"] {
    display: none;
  }
  [data-lens="fs"] [data-lens-panel="be"] {
    display: none;
  }
  ```
  Swap points (exhaustive, per spec — "nothing else moves"): hero h1 (two `<h1>`s, one hidden — intentional), hero lede, hero meta role string, work-section heading, each ProjectBrief summary paragraph, the entire skills grid (two full 6-group grids), and the Resume link hrefs (backend vs full-stack PDF).
- Content module: `src/content/types.ts` + `src/content/profile.ts` — a verbatim typed port of `data.js` (shape: `name, fullName, location, email, site, github, linkedin, lenses.{be,fs}, stats[4], work[4], timeline[4], education[2]`), **plus** the AI-card bullets currently hardcoded in `PoAI` — move them into the module.
- Portrait via `astro:assets` `<Picture>`: avif/webp/jpg, widths ~480/720/956, `loading="eager"` + `fetchpriority="high"` (it is the LCP candidate), `object-position: 50% 20%` preserved. Header/footer avatars as small `<Image>` crops.

## Tasks

1. **Content module** (`types.ts` + `profile.ts`): port `data.js` string-for-string. Completeness checklist: identity fields; `lenses.be`/`lenses.fs` each with `label, role, hero[2], lede, workTitle, skills[6]`; `stats[4]`; `work[4]` each with `be`/`fs` summaries, `metrics[]`, `stack[]`; `timeline[4]` (Keel Mind ×2, Compras Compartidas, Meniu; first `current`, last `last`); `education[2]`; AI-card bullets.
2. **Assets**: copy `assets/photos/IMG_2835.jpg` → `src/assets/portrait.jpg`; copy resumes → `public/resume-backend.pdf` and `public/resume-fullstack.pdf`; `git rm -r assets/` in the same commit (the URL-unsafe originals must not linger). Hand-author `public/favicon.svg`: paper-0 rounded square, centered gold-500 circle (the gold period is the brand mark; no font dependency).
3. **BaseLayout.astro**: `<html lang="en" data-lens="be">`, title/description props, favicon link, `theme-color` meta (per-theme via media attr), skip-to-content link, fonts + `global.css`. (Theme and reveal scripts are phase 4.)
4. **Sections**, built in page order against the spec — key numbers to honor (full detail in the skill README):
   - Shared: container `max-width 1120px`, `padding 0 40px`; each section after the hero: `margin-top 96px`, 1px top hairline, numbered mono eyebrow (`01 / SELECTED WORK` … `05 / CONTACT`), display heading 39px.
   - `Header.astro`: sticky, `padding 14px 40px`, bg `color-mix(in oklab, var(--paper-0) 86%, transparent)` + `backdrop-filter: blur(10px)` (the only blur allowed); 36px Avatar + wordmark with gold period; nav WORK/EXPERIENCE/STACK/CONTACT mono 11px/0.14em; right: inert ThemeToggle placeholder + secondary Resume button (download glyph, lens-swapped href).
   - `Hero.tsx`: `padding 80px 40px 0`, grid `minmax(0,7fr) minmax(0,5fr)` gap 64; SegmentedToggle (inert) + `Tag tone="success" dot` "Open to work"; h1 76px/0.98/-0.03em, two lines with explicit `<br>`; lede 20px/1.6 max 48ch; primary "See selected work" + secondary "Get in touch"; meta row. Portrait 4:5, radius 12px, "BOGOTÁ · REMOTE" tab notched at `left:-1px; bottom:-1px`.
   - `Stats.tsx`: 4 StatBlocks, `repeat(4, minmax(0,1fr))` gap 32, top hairline.
   - `Work.tsx` (`#work`): 2-col grid gap 24, four ProjectBrief cards (hover lift is CSS in the component already).
   - `Experience.tsx` (`#experience`): grid `7fr/4fr` gap 64; `<ol>` of TimelineItems; EDUCATION rail right.
   - `Stack.tsx` (`#stack`): `repeat(3, minmax(0,1fr))` gap `40px 32px`, six SkillGroups — the whole grid is a lens panel, rendered twice.
   - `AICard.tsx`: `Card tone="accent"`, grid `5fr/7fr` gap 48, eyebrow `04 / AI ENGINEERING` + sparkles glyph in `#A6762A`, four check-led bullets.
   - `Contact.tsx` (`#contact`): grid `7fr/5fr` gap 64; two-col form (Name, Email, full-width Select "A role / Contract work / Something else", full-width Textarea rows 5) with `action="/api/contact" method="post"`, plus the **honeypot** field now: `<input name="company">` visually hidden, `tabindex="-1"`, `autocomplete="off"`; right rail: Email / Based in / Code / Resume rows.
   - `Footer.astro`: top hairline, avatar + wordmark, TextLinks GitHub/LinkedIn (external arrows), mono "BUILT IN BOGOTÁ".
5. **index.astro**: compose Header + all sections + Footer inside BaseLayout, with anchor ids `#work` `#experience` `#stack` `#contact`.
6. Minimal meta only: title, description (brand voice), favicon. Full SEO is phase 7.

## Verification

- Inherited build/check pass.
- **JS-disabled pass** (browser devtools, JS off): all nine blocks visible, `be` content shown, `fs` content absent, anchors scroll, resume links download. This is the phase's defining check.
- `grep -c 'data-lens-panel' dist/index.html` — sanity: matches the expected swap-point count ×2.
- `curl -sI localhost:4321/resume-backend.pdf` and `-fullstack.pdf` → `200`, `application/pdf`; old URL-unsafe names gone from the repo.
- **Visual parity**: `pnpm dev` at a 1280px viewport, section by section against the skill README specs (grids, sizes, spacing, colors). Fidelity is "pixel-for-pixel" — unusual values (44px controls, 14px cards, 8px inputs) are deliberate.
- Preview URL check after pushing `dev`.

## Gotchas

- Copy strings **exactly**: em dashes with spaces, `·` separators, `–` in "4–8", accents (Bogotá, Nicolás). No paraphrasing.
- Two `<h1>`s exist by design (one per lens, one always `display:none`). Note it for the phase-6 a11y pass: the hidden one is out of the accessibility tree.
- AWS and LinkedIn have no tech icons (licensing) — set them in type, per the brand guide.
- White (`#FFFFFF`) only on cards/fields; the canvas is `--paper-0`. Don't "fix" it.
- Gold text anywhere (index labels on hover, sparkles, check glyphs) is `#A6762A`, never `#E3B23C`.

## Definition of Done

Inherited DoD, plus: JS-disabled pass clean, visual parity reviewed, resumes served URL-safe, preview URL shows the complete page.

## Out of scope

Any hydration: lens/theme toggles working, reveal animation (phase 4). Form submission (phase 5). Responsive below 1280px (phase 6). Full SEO (phase 7).
