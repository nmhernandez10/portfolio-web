# Handoff: Portfolio site — Site B (portrait hero)

## Overview

The personal portfolio of **Nicolás Mateo Hernández Rojas** (nicolasmateo.dev) — a single-page marketing site whose job is to convince an engineering leader, in under a minute, that this person designs and owns production systems. One page, seven sections, one interactive twist: a **Backend ↔ Full stack lens** that retargets the copy, and a light/dark theme toggle.

Design direction: warm-paper light theme, one honey-gold accent (`#E3B23C`), Space Grotesk display type with JetBrains Mono labels, hairlines instead of boxes, subtle motion. No orange, no gradients, no emoji.

## About the design files

> **Note on this copy:** the bundled `design-system/` and `prototype/` folders were removed from the live design-system project after packaging, because duplicate component files confuse its compiler. The zip you downloaded still contains them; if you need a fresh bundle, ask for the handoff to be regenerated. This README alone is a sufficient spec.

The files in `prototype/` are **design references written in HTML + React-via-Babel** — prototypes that show intended look and behaviour. They are **not production code to copy**. The task is to **recreate these designs in your target codebase** using its own patterns (Next.js + CSS Modules / Tailwind / styled-components — whatever you standardise on). If you have no codebase yet, Next.js (App Router) with plain CSS custom properties is the closest fit: the design system is already expressed as CSS variables, so it drops in with no translation layer.

`design-system/` is different — those files **are** reusable:
- `design-system/styles.css` + `design-system/tokens/*.css` can be copied into a real app as-is. `styles.css` is nothing but `@import` lines; `tokens/base.css` carries element resets, link colours and two utility classes (`.label-mono`, `.reveal`).
- `design-system/components/**` are dependency-free React components (React import only, styling via CSS variables, no npm packages). Each has a `.d.ts` props contract and a `.prompt.md` usage note. They are JSX authored for a bundler-less preview — expect to add your own file extensions/imports conventions, but the markup and values are production-shaped.
- `design-system/assets/icons/**` are real SVG files (Lucide UI glyphs, Simple Icons tech marks) — ship them.

## Fidelity

**High-fidelity.** Every colour, size, radius, duration and string in the prototype is final and token-backed. Recreate it pixel-for-pixel; where a value looks unusual (44px controls, 14px card radius, 8px inputs), it is deliberate. Content is real, taken from the 2026 résumés — keep it.

## Screens / Views

One route (`/`), scroll-anchored sections. Container: `max-width: 1120px`, `padding: 0 40px`, centred. Section spacing: `margin-top: 96px`. Every section after the hero opens with a 1px top hairline, a numbered mono eyebrow, then a display heading.

### 1. Sticky header
- **Purpose:** identity + wayfinding + resume grab.
- **Layout:** sticky top, `z-index: 20`, `padding: 14px 40px`, three-part flex row (`space-between`), bottom border `1px solid #E4E0D6`. Background `color-mix(in oklab, #FBFAF7 86%, transparent)` with `backdrop-filter: blur(10px)` — the only blur in the design.
- **Left:** 36px circular photo (`Avatar size="sm"`) + wordmark “Nicolás Mateo” in Space Grotesk 600, 18px, `-0.02em`, followed by a period in `#C9963A`.
- **Centre:** four anchor links — WORK, EXPERIENCE, STACK, CONTACT — JetBrains Mono 500, 11px, `letter-spacing: 0.14em`, uppercase, colour `#8B887C`, 24px gaps, `padding-bottom: 2px` with a transparent 1px bottom border (active/hover swaps it to `1.5px solid #E3B23C` and text to `#26251F`).
- **Right:** `ThemeToggle` (36px pill, 1px `#E4E0D6` border, moon/sun glyph + “DARK”/“LIGHT” mono label) and a small secondary `Button` with a leading download glyph, label “Resume”.

### 2. Hero
- **Purpose:** state who he is and let the visitor pick the lens.
- **Layout:** `padding: 80px 40px 0`; CSS grid `minmax(0,7fr) minmax(0,5fr)`, `gap: 64px`, `align-items: center`.
- **Left column** (`gap: 24px`, column flex):
  - Row: `SegmentedToggle` (pill track, `background #F5F3ED`, 1px `#E4E0D6`, 3px padding; selected pill white with `0 1px 2px rgba(27,26,22,.05)`; labels mono 12px/0.14em uppercase, `#26251F` selected, `#8B887C` idle) + `Tag tone="success" dot` reading “Open to work” (olive `#6F7A44` on `#EDF0E1`, 5px dot).
  - `h1`, 76px / line-height 0.98 / `-0.03em`, colour `#1B1A16`, two lines with an explicit `<br>`: *“Backend systems, / owned end to end.”* (Full-stack lens: *“Schema to shipped UI, / one pair of hands.”*)
  - Lede `<p>`: 20px / 1.6, `#55534A`, `max-width: 48ch`.
  - Buttons row (`gap: 12px`): primary “See selected work” (gold `#E3B23C`, ink `#26251F` text, 44px tall, pill, trailing arrow-down 16px) + secondary “Get in touch” (white, 1px `#D6D1C4`, leading mail glyph).
  - Meta row: two mono uppercase items — “Bogotá, Colombia” and the current lens’s role string.
- **Right column:** portrait `img`, `aspect-ratio: 4/5`, `object-fit: cover`, `object-position: 50% 20%`, `border-radius: 12px`, 1px `#E4E0D6`. A mono tab (“BOGOTÁ · REMOTE”) is absolutely positioned at `left: -1px; bottom: -1px`, `padding: 8px 12px`, canvas background, top + right hairlines, `border-top-right-radius: 8px`.

### 3. Stats row
Four `StatBlock`s in `repeat(4, minmax(0,1fr))`, `gap: 32px`, above a 1px top hairline with `padding-top: 32px`. Value: Space Grotesk 600, 31px, `-0.03em`, line-height 1. Caption: mono 11px/0.14em uppercase `#8B887C`. Content: `200k+ / Sessions delivered`, `85k+ / Clients reached`, `6+ / Years in production`, `4–8 / Engineers led`.

### 4. Selected work (`#work`)
- Eyebrow `01 / SELECTED WORK`; heading “Systems I own end to end” (39px / 1.06 / `-0.015em`); lede “No screenshots here on purpose — each card states the system and the part I owned.”
- Grid `repeat(2, minmax(0,1fr))`, `gap: 24px`, `margin-top: 40px`, four `ProjectBrief` cards.
- **ProjectBrief** (the screenshot-free card): white surface, 1px `#E4E0D6`, radius 14px, `padding: 32px`, column flex `gap: 20px`, whole card is an `<a>`. Contents: meta row (`01 / FEATURE ARCHITECT` mono uppercase left, period mono right), `h3` 31px 600 with a 20px `arrow-up-right` in `#C9963A`, summary 16px/1.6 `#55534A` at `46ch`, metrics row (mono 12px, above a 1px hairline, `padding-top: 16px`), stack `Tag`s (mono 11px pills, `#F5F3ED` on 1px `#E4E0D6`).
- **Hover:** `translateY(-2px)`, shadow `0 4px 16px -6px rgba(27,26,22,.12)`, border → `#D6D1C4`, index label → `#A6762A`, arrow shifts `translate(2px,-2px)`. All 140ms.

### 5. Experience (`#experience`)
Eyebrow `02 / EXPERIENCE`, heading “Six years of production work”. Grid `minmax(0,7fr) minmax(0,4fr)`, `gap: 64px`.
- **Left:** `<ol>` of four `TimelineItem`s. Each is an `<li>` with `padding-left: 32px`, `border-left: 1px solid #E4E0D6` (the last item’s rail is transparent), `padding-bottom: 40px`. A 9px node sits at `left: -5px; top: 6px`; the current role is gold with a `0 0 0 4px #FBF0D4` halo, past roles are canvas-filled with a 1.5px `#D6D1C4` inset ring. Role 20px 600 + company 16px `#55534A` on one baseline row; mono meta row for period and location; bullets are em-dash led with the dash in `#C9963A`, 16px/1.6, `max-width: 64ch`.
- **Right:** “EDUCATION” mono label, then two blocks, each with a top hairline and `padding-top: 16px`: degree 16px, school 14px `#55534A`, period mono 11px.

### 6. Stack (`#stack`)
Eyebrow `03 / STACK`, heading “What I reach for”. Grid `repeat(3, minmax(0,1fr))`, `gap: 40px 32px`, six `SkillGroup`s. Each: a mono uppercase title preceded by a 15px tech mark in `#8B887C`, then wrapped `Tag`s at `gap: 8px`. Clusters mirror the résumé and swap with the lens (Backend / Data / Cloud & DevOps / Observability / AI engineering / Practices, or Frontend-led for full stack).

### 7. AI engineering
A single `Card tone="accent"`: `#FBF0D4` background, 1px `#F6E3AE`, radius 14px, `padding: 32px`, grid `minmax(0,5fr) minmax(0,7fr)`, `gap: 48px`. Left: mono eyebrow `04 / AI ENGINEERING` with a 14px sparkles glyph in `#A6762A`, then a 31px heading. Right: four check-led bullets, 16px/1.6, checks 16px `#A6762A` with `margin-top: 5px`.

### 8. Contact (`#contact`)
Eyebrow `05 / CONTACT`, heading “Tell me what you are building”, lede “I read everything…”. Grid `minmax(0,7fr) minmax(0,5fr)`, `gap: 64px`.
- **Form** (two-column grid, `gap: 20px`): `Input` Name, `Input` Email (type email), full-width `Select` (“A role / Contract work / Something else”), full-width `Textarea` (5 rows). Fields: white, 1px `#D6D1C4`, radius 8px, 44px tall (textarea `12px 14px`), label above in mono 11px/0.14em uppercase `#8B887C`. **Focus:** border `#C9963A` + `box-shadow: 0 0 0 3px #F6E3AE`. **Error:** border and message in `#B0503A`.
- Submit row: primary Button “Send it” → on submit, label becomes “Sent, thank you” and a success `Tag` appears (“I reply within a couple of days”); before submit, muted 14px text “Or just email me directly.”
- **Right rail:** four rows, each with a top hairline, `padding-top: 16px`, a 16px glyph in `#8B887C`, a mono label and a value (`TextLink` where it is clickable): Email → `nm.hernandez1996@gmail.com`, Based in → Bogotá, Colombia, Code → github.com/nmhernandez10, Resume → “Backend and full-stack versions”.

### 9. Footer
Top hairline, `padding: 40px 40px 64px`. Left: 36px avatar + wordmark 20px. Right: `TextLink`s GitHub / LinkedIn (each with a trailing 13px arrow-up-right) and a mono “BUILT IN BOGOTÁ”.

## Interactions & behavior

- **Lens toggle** (`be` / `fs`): swaps hero heading (2 lines), lede, role string, work-section heading, each project’s summary sentence, and the six skill clusters. Nothing else moves. Content lives in `prototype/data.js` under `lenses.be` / `lenses.fs` and `work[].be` / `work[].fs`.
- **Theme toggle:** sets `data-theme="light"|"dark"` on `<html>`; all colour comes from the `[data-theme="dark"]` variable scope, so no component knows about theming. Persist the choice in `localStorage` in production (the prototype does not).
- **Links:** ink text on a 1px gold underline; hover thickens the underline to 1.5px and shifts text to `#A6762A`. 140ms.
- **Buttons:** hover lightens gold to `#EAC468` (secondary → `#F5F3ED` fill, `#8B887C` border); press applies `scale(.985)`; disabled is `opacity: .4`. No shadows.
- **Cards:** no shadow at rest; interactive cards lift 2px with `0 4px 16px -6px rgba(27,26,22,.12)`.
- **Focus:** every focusable element gets `box-shadow: 0 0 0 2px #C9963A, 0 0 0 3px #F6E3AE` and `outline: none` — never the browser default ring.
- **Scroll reveal:** the one page-level animation. Elements with `.reveal` start at `opacity: 0; translateY(14px)` and transition to visible over **520ms** `cubic-bezier(.16,.84,.34,1)` when an `IntersectionObserver` (`rootMargin: -40px`) first sees them; the class is only armed once the root has `.reveal-ready`, and a 900ms fallback reveals everything if the observer never fires. Reproduce that safety in production too — content must never depend on JS to be visible.
- **Reduced motion:** `@media (prefers-reduced-motion: reduce)` drops all durations to `0.01ms` and shows every `.reveal` immediately.
- **Form validation:** name + email required, native `type="email"` check; error state is the field’s `error` prop (clay border + message). Submission is faked — wire it to your own endpoint or a service like Formspree.
- **Responsive:** the prototype is designed at 1280px and is not yet responsive. Recommended breakpoints when you build it: below 960px collapse every `7fr/5fr` and `3-col` grid to one column, portrait first at `aspect-ratio: 4/5` full width; below 720px drop the hero to 49px, section headings to 31px, switch gutters to 20px, and move the header nav behind a menu button (`assets/icons/ui/menu.svg`).

## State management

Four pieces of local UI state, no data fetching:

| State | Type | Default | Trigger |
| --- | --- | --- | --- |
| `lens` | `"be" \| "fs"` | `"be"` | `SegmentedToggle` in the hero |
| `theme` | `"light" \| "dark"` | `"light"` | `ThemeToggle` in the header; writes `data-theme` on `<html>` |
| `sent` | `boolean` | `false` | contact form submit |
| reveal flags | DOM classes | — | `IntersectionObserver` + 900ms fallback |

All content is static and belongs in a typed content module (the prototype’s `data.js` is the shape to copy: `lenses`, `stats`, `work`, `timeline`, `education`).

## Design tokens

Full source: `design-system/tokens/`. The values you will actually type:

**Colour — light**
`--paper-0 #FBFAF7` (canvas) · `--paper-1 #F5F3ED` (sunken) · `--paper-2 #EFEDE6` (media) · `--paper-3 #E9E6DC` · cards `#FFFFFF`
`--ink-0 #1B1A16` (display) · `--ink-1 #26251F` (body) · `--ink-2 #55534A` (secondary) · `--ink-3 #8B887C` (meta) · `--ink-4 #B4B1A5` (disabled)
`--line-1 #E4E0D6` · `--line-2 #D6D1C4`
Gold: `50 #FDF8EA` · `100 #FBF0D4` · `200 #F6E3AE` · `300 #F0D68F` · `400 #EAC468` (hover) · `500 #E3B23C` (**accent**) · `600 #C9963A` (press) · `700 #A6762A` (gold text)
Status: olive `#6F7A44` on `#EDF0E1` · clay `#B0503A` on `#F7E7E1` · slate `#46586B` on `#E7EBEF`

**Colour — dark** (`[data-theme="dark"]`): canvas `#141310`, card `#1C1B16`, sunken `#100F0C`, `#24231D`, `#2C2B24`; ink `#F8F6F0 / #EDEAE1 / #B7B3A6 / #8A8779`; lines `#2E2C25 / #3B382F`; accent `#E9C05A`, hover `#F0D68F`, press `#C9963A`; text-on-accent `#1B1A16`.

**Type** — Space Grotesk 400/500/600 (display + body), JetBrains Mono 400/500 (labels, meta, code). Scale: 11 · 12 · 14 · 16 · 20 · 25 · 31 · 39 · 49 · 61 · 76 · 96. Line heights: 0.98 hero, 1.06 display, 1.25 snug, 1.6 body. Tracking: `-0.03em` display, `-0.015em` headings, `0.14em` mono labels. Measures: 64ch prose, 44ch lede.

**Spacing** — 4 · 8 · 12 · 16 · 20 · 24 · 32 · 40 · 48 · 64 · 80 · 96 · 128. Container 1120px, narrow 720px, gutters 40/20px, 12 columns with 24px gaps. Section gap 96px (128px for the widest breaks). Card padding 24px (32px feature). Control padding `11px 20px`.

**Radius** — pill `999px` (all buttons, tags, toggles), `14px` cards, `12px` media, `8px` inputs, `4px` inline code, `0` never except full-bleed crops.

**Shadow** — `--shadow-1 0 1px 2px rgba(27,26,22,.05)` · `--shadow-2 0 4px 16px -6px rgba(27,26,22,.12)` · `--shadow-3 0 18px 40px -18px rgba(27,26,22,.22)` · focus `0 0 0 2px #C9963A, 0 0 0 3px #F6E3AE`. Warm-tinted only — never black or blue shadows.

**Motion** — 80ms instant · 140ms controls · 200ms surfaces · 320ms slow · 520ms reveal. Easing `cubic-bezier(.22,.7,.28,1)` (out), `cubic-bezier(.16,.84,.34,1)` (entrance). Press `scale(.985)`, reveal offset 14px.

**Control heights** — 32 / 44 / 52px.

## Assets

- `design-system/assets/icons/ui/*.svg` — 30 **Lucide** glyphs (MIT), 24×24, 2px stroke. Rendered via CSS `mask` + `background: currentColor` so one file serves both themes (see `components/core/Icon.jsx`). Used at 14–18px inline, 20–24px standalone.
- `design-system/assets/icons/tech/*.svg` — 14 **Simple Icons** brand marks (CC0), always painted `#8B887C` or `currentColor`, never vendor colours. **AWS and LinkedIn marks are not in Simple Icons** (licensing) — set those in type.
- `design-system/assets/portrait-nicolas.jpg` — the supplied portrait (956×1274). Hero uses a 4:5 crop at `object-position: 50% 20%`; header/footer avatars use a circular 36px crop. For a cleaner hero, reshoot or retouch against a plain light wall with the head filling the frame.
- **Fonts:** none bundled. `tokens/fonts.css` pulls Space Grotesk + JetBrains Mono from Google Fonts; in production self-host the woff2 files and replace that `@import` with local `@font-face` rules.
- **No logo exists.** The mark is the name in Space Grotesk 600 plus a gold period; the compact form is `NM.`.

## Files

In this bundle:
- `prototype/site-b/index.html` — the runnable prototype (open it in a browser; it loads React + Babel from unpkg).
- `prototype/site-b/PortraitScreens.jsx` — every section of Site B, in order.
- `prototype/site-b/README.md` — what to click.
- `prototype/data.js` — all content, keyed by lens.
- `design-system/styles.css`, `design-system/tokens/*` — copy-ready CSS.
- `design-system/components/{core,forms,navigation,content}/*` — 20 components, each with `.d.ts` + `.prompt.md`.
- `design-system/assets/**` — icons + portrait.
- `design-system/readme.md` — the full brand guide: content voice, visual foundations, iconography rules. **Read this before writing copy or adding a screen.**
- `design-system/SKILL.md` — drop the `design-system/` folder into `.claude/skills/nicolas-mateo-design/` and Claude Code can design new screens on-brand.

Note: `prototype/site-b/index.html` expects a compiled `_ds_bundle.js` two directories up, which only exists inside the design tool. To run it standalone, either open the site in the tool, or replace the bundle `<script>` with direct `<script type="text/babel" src>` tags pointing at the component files in `design-system/components/`.

## Suggested build order

1. Scaffold the app; copy `styles.css` + `tokens/` in, link them once, self-host the two fonts.
2. Port `core/` (Icon, Button, Tag, Card, Avatar, StatBlock), then `forms/`, `navigation/`, `content/` — the props contracts in the `.d.ts` files are the API to keep.
3. Move `data.js` into a typed content module.
4. Build the page section by section in the order above.
5. Add the theme toggle + `localStorage`, then the reveal observer with its fallback.
6. Make it responsive at 960px and 720px, then run an accessibility pass (contrast on gold: use `#A6762A` for gold text, never `#E3B23C`).
