# Nicolás Mateo — Design System

The design system behind **nicolasmateo.dev**, the personal portfolio of **Nicolás Mateo Hernández Rojas** — a senior backend / full-stack engineer and Feature Architect based in Bogotá, Colombia. It is a one-person brand: no company, no product suite. The single surface is a portfolio website whose job is to convince an engineering leader, in under a minute, that this person designs and owns production systems.

Direction, chosen by Nicolás in the intake form: **light theme, warm minimalism, honey-gold accent (explicitly not orange), geometric display type with mono captions, photo beside the type in the hero, subtle motion, a light/dark toggle, and a Backend ↔ Full stack switch** so one site tells two targeted stories.

## Sources

| Source | What it gave us |
| --- | --- |
| `uploads/Resume 2026 - Nicolás Hernández - BE.pdf` | Backend/architect positioning, experience, metrics, skill clusters |
| `uploads/Resume 2026 - Nicolás Hernández - FS.pdf` | Full-stack positioning and frontend/design-system skills |
| `references/inspiration-dark-portfolio.webp` | Uploaded visual reference (a dark, orange-accented freelance portfolio template). Used only for *structure* cues — hero with portrait, service cards, skill bars. Its dark shell and orange accent were explicitly rejected. |
| https://github.com/nmhernandez10/portfolio-web | Attached repo. **It is empty — no commits on `main`** — so nothing was imported. See `github.md`. |
| https://github.com/lucide-icons/lucide | UI icon set, copied into `assets/icons/ui/` |
| https://github.com/simple-icons/simple-icons | Technology brand marks, copied into `assets/icons/tech/` |

Readers with access should explore the two icon repositories directly for glyphs not yet copied in, and `nmhernandez10/portfolio-web` once it holds real code — the real repo always wins over anything invented here.

**No logo was supplied.** Nothing was drawn or invented: the brand mark is the name set in Space Grotesk (see the Wordmark card). A portrait **was** supplied later (`assets/portrait-nicolas.jpg`) and is used in the two one-page sites; product screenshots still do not exist, which is why `ProjectBrief` and `WorkRow` show work without imagery.

---

## CONTENT FUNDAMENTALS

The voice comes straight from the résumés: first person, plain, specific, and quietly senior. It never sells.

**Person and stance.** First person singular — "I lead technical design and delivery", "I own features from schema to shipped UI". "You" appears only when addressing the reader in a call to action ("Tell me what you are building"). Never "we" for a one-person site.

**Sentence shape.** Declarative and load-bearing. Every sentence names a system, a decision, or an outcome. Compare:

- Yes: "Event-driven processing on AWS with Lambda, SQS and S3 keeps recording, transcription and post-session analysis off the request path."
- No: "Passionate engineer leveraging cutting-edge cloud technologies to deliver world-class solutions."

**Numbers instead of adjectives.** 200k+ sessions, 85k+ clients, 4–8 engineers led, 50–200 partner stores a month, 200+ restaurants, 6+ years. Real figures from the résumé, never rounded up for effect. If a number isn't known, the sentence is cut rather than padded.

**Casing.** Sentence case everywhere in prose and headings ("Systems I own end to end"). UPPERCASE is reserved for mono labels — eyebrows, meta rows, stat captions, form labels, nav (`02 / SELECTED WORK`, `FEATURE ARCHITECT`, `BOGOTÁ, COLOMBIA`). Job titles keep their conventional capitals (Feature Architect, Senior Software Engineer). Technologies are written the way engineers write them: Node.js, NestJS, PostgreSQL, Next.js, AWS Lambda — never NodeJS or Postgre.

**Tense and dates.** Present tense for current work, past for shipped history. Dates read `March 2024 — present` in body copy and `2022 — now` in compact card meta. Em dash with spaces, never a hyphen.

**Section eyebrows are numbered** — `01 / Selected work`, `02 / Experience`, `03 / Stack`, `04 / AI engineering`, `05 / About`, `06 / Contact`. This is the site's main wayfinding device and it doubles as a rhythm cue.

**Copy lengths.** Hero heading: 2 lines, ≤ 5 words each. Lede: 1 sentence, ≤ 40 words. Project summary: 1 sentence naming the system and the ownership. Timeline bullets: one idea each, em-dash led, 12–24 words. Button labels: 2–4 words, verb first, sentence case ("See selected work", "Send it", "Download resume").

**Tone dial.** Relaxed but professional — the warmth comes from directness and from admitting scope honestly ("Screenshot pending", "A sentence or two is plenty"), not from jokes. **No emoji, anywhere.** No exclamation marks. No "Hello! I'm …" hero, no "Let's build something amazing", no "passionate about". Placeholder and empty states speak plainly in mono: `PORTRAIT PENDING — 4:5 CROP`.

**Bilingual note.** The site is in English; Spanish is named as a native language. Place names keep their accents (Bogotá, Nicolás).

---

## VISUAL FOUNDATIONS

**Concept.** Warm paper, warm ink, one honey-gold accent, hairlines instead of boxes. Structure is drawn with 1px rules and generous space; colour is a punctuation mark, never a surface treatment.

**Colour.** Canvas is `--paper-0 #FBFAF7` (never pure white — white is reserved for cards, so cards read as slightly raised without shadow). Ink is warm, not blue-grey: `#1B1A16` display, `#26251F` body, `#55534A` secondary, `#8B887C` meta. The accent ramp runs `--gold-50 → --gold-700`, with `--accent #E3B23C` for fills, `--gold-400` hover, `--gold-600` press, and `--gold-700` for any gold *text* (contrast on paper). Status colours — olive `#6F7A44`, clay `#B0503A`, slate `#46586B` — are the only non-gold hues and appear only on tags and validation. Roughly 92% of any screen is paper + ink; gold covers a few hundred pixels at most.

**Dark theme.** `[data-theme="dark"]` swaps to a warm near-black (`#141310` canvas, `#1C1B16` cards) and lifts gold to `#E9C05A`. Light is canonical; dark is a courtesy. Never a neutral or blue-black.

**Type.** Space Grotesk (400/500/600) for everything typographic, JetBrains Mono (400/500) for labels, meta and code. Scale is a 1.25 modular ramp from 16px: 16 / 20 / 25 / 31 / 39 / 49 / 61 / 76 / 96. Hero at 76–96px, `-0.03em` tracking, `0.96–0.98` line-height; the biggest hero variant sets the name in caps. Body 16/1.6 at a 64ch measure, ledes 20/1.6 at 44ch. The mono label — 12px, `0.14em`, uppercase, `--text-muted` — is the single most repeated device in the system. Weight 700 exists but is reserved; headings are 600.

**Spacing & layout.** 4px base ramp (4 8 12 16 20 24 32 40 48 64 80 96 128). 1120px container, 40px gutters (20px on small screens), 12 columns / 24px gap. Sections are separated by 96–128px and always open with a hairline + numbered mono eyebrow. Asymmetric splits are preferred over halves: 7/5 for hero and about, 7/4 for experience + rail. Prose is capped at 720px.

**Corners.** Controls are full pills (`--radius-pill`). Cards are 14px. Media is 12px. Fields are 8px — deliberately the only 8px corner, so inputs read as inputs. Nothing is sharp except full-bleed photo crops.

**Cards.** White surface, 1px `--line-1` border, 14px radius, 24px padding (32px for feature cards), **no shadow at rest**. Interactive cards lift `translateY(-2px)` with `--shadow-2` and darken their border on hover. Media bands sit at `--paper-2` with a hairline beneath. Card meta rows are mono uppercase; card titles are 20–25px display.

**Depth & shadows.** Three warm-tinted shadows, all built from `rgba(27,26,22,…)` — never black, never blue. `--shadow-1` for switch knobs and selected segments, `--shadow-2` for card hover, `--shadow-3` for floating overlays. Focus is a 2px gold border plus a 3px `--gold-200` halo; browser default rings are always replaced.

**Borders.** `--line-1 #E4E0D6` for card and section rules, `--line-2 #D6D1C4` for fields and hover borders, and a 1–1.5px gold rule for link underlines and active nav. A link is ink text on a gold rule; gold-filled text never happens.

**Motion.** Short and unshowy. 140ms for hover/press/toggles, 200ms for surfaces and colour, 520ms for the one scroll effect: fade in + 14px rise, `cubic-bezier(.16,.84,.34,1)`, triggered once per element. The hidden state lives behind `.reveal-ready` on the root, so a page that never runs the observer still shows all its content. Hover = lighter gold or paper tint; press = `scale(.985)`; no bounce, no spring, no parallax, no marquee. `prefers-reduced-motion` cuts everything to near-zero and reveals stay visible.

**Transparency & blur.** Exactly one use: the sticky header sits on `color-mix(in oklab, var(--surface-canvas) 86%, transparent)` with a 10px backdrop blur. No glassmorphism panels, no translucent cards, no protection gradients (there is no full-bleed photography to protect against — captions sit outside imagery, on paper).

**Imagery.** Warm, natural-light, lightly desaturated; the portrait crops are 4:5 (hero) and 3:4 (about), at 12px radius, on `--paper-2`. No duotones, no gold overlays, no grain textures, no gradient meshes, no hand-drawn illustration, no repeating patterns. Backgrounds are flat paper — full stop. Until real photography arrives, placeholders state their intended crop in mono.

**Fixed elements.** Only the header is sticky (plus the case-study fact panel, which sticks at `top: 96px`). No sticky CTAs, cookie bars or floating chat bubbles.

**Anti-patterns.** No orange. No purple/blue gradients. No emoji. No dark hero. No skill percentage bars (the reference had them; they say nothing). No cards with a coloured left border. No shadowed everything. No Inter.

---

## ICONOGRAPHY

Two sets, both copied into the project as real SVG files — nothing is hand-drawn here, and nothing is loaded from a CDN.

- **`assets/icons/ui/` — Lucide** (30 glyphs, MIT). 24×24 grid, 2px stroke, round caps. Rendered at 14–18px inline with text and 20–24px standalone. Used for navigation, actions, meta rows and list markers: `arrow-up-right` (the signature "open" glyph, it nudges up-right on hover), `arrow-right`, `arrow-down`, `download`, `file-text`, `mail`, `phone`, `map-pin`, `external-link`, `terminal`, `database`, `server`, `cloud`, `git-branch`, `layers`, `cpu`, `sparkles`, `moon`, `sun`, `check`, `chevron-right`, `chevron-down`, `calendar`, `briefcase`, `graduation-cap`, `activity`, `zap`, `copy`, `menu`, `x`.
- **`assets/icons/tech/` — Simple Icons** (14 marks, CC0). Solid, single-path brand marks used *only* as leading marks on skill clusters and in the stack list: TypeScript, Node.js, NestJS, PostgreSQL, Redis, GraphQL, React, Next.js, Flutter, Python, Docker, Elasticsearch, Claude, GitHub. They are always rendered in `--text-muted` or `currentColor` — **never in the vendor's brand colour**, which would break the one-accent rule.

**How icons are drawn.** The `Icon` component masks the SVG file (`-webkit-mask` / `mask`) and paints it with `background: currentColor`, so a glyph inherits the colour of its context and dark mode needs no second asset set. Pass `base` when the host page is not at the project root (e.g. `base="../../assets/icons"`).

**Substitutions to flag.** No icon set was supplied, so Lucide is a substitution chosen for its 2px stroke and quiet geometry (closest match to the reference's line icons). AWS and LinkedIn marks are **not available** in Simple Icons for licensing reasons — those are set in type instead ("AWS", "LinkedIn ↗"). Emoji are never used. Unicode characters are used sparingly and only typographically: the em dash `—` as a bullet marker, `·` as a meta separator, `↗` in text-only external links.

**Fonts to flag.** No font binaries were supplied. Space Grotesk and JetBrains Mono are loaded from Google Fonts in `tokens/fonts.css` — swap that `@import` for local `@font-face` rules if licensed files arrive. This is the one dependency the system fetches from the network.

---

## INDEX

**Root**
- `styles.css` — the single entry point consumers link; `@import` lines only.
- `readme.md` — this guide. `SKILL.md` — Agent Skills wrapper. `github.md` — source-repo association and sync record.
- `thumbnail.html` — homepage tile. `references/` — the uploaded inspiration screenshot.

**Tokens** (`tokens/`) — `fonts.css`, `colors.css`, `typography.css`, `spacing.css`, `shape.css`, `motion.css`, `base.css` (element resets, link colours, `.label-mono`, `.reveal`).

**Components** (`components/`) — 18 React primitives, each with a `.d.ts` props contract and a `.prompt.md` usage note:
- `core/` — **Icon**, **Button**, **IconButton**, **Tag**, **Card**, **Avatar**, **StatBlock**
- `forms/` — **Input**, **Textarea**, **Select**, **Switch**
- `navigation/` — **TextLink**, **SegmentedToggle**, **ThemeToggle**
- `content/` — **SectionHeader**, **ProjectCard**, **ProjectBrief**, **WorkRow**, **TimelineItem**, **SkillGroup**

*Intentional additions:* `Icon` (a wrapper the copied glyph sets need), `StatBlock` / `SegmentedToggle` (the résumé metrics and the Backend↔Full-stack lens both required a home), and `ProjectBrief` / `WorkRow` (screenshot-free work treatments — there is no product imagery, so the system needs work layouts that do not ask for any). No source defined a component inventory, so this is a from-scratch set sized to one portfolio site — no Toast, Tooltip, Dialog or Tabs until a screen needs them.

**Foundations** (`guidelines/`) — 23 specimen cards feeding the Design System tab, grouped **Colors** (surfaces, ink, accent ramp, status, hairlines, dark theme), **Type** (display scale, body, mono label, mono in prose, weights), **Layout** (spacing ramp, container/grid, section rhythm), **Shape** (radii, shadow/focus, card anatomy), **Motion** (timing, interaction states), **Brand** (wordmark, UI icons, tech marks, portrait treatments).

**UI kits** (`ui_kits/`) — three click-through recreations, all fed by one content file:
- `portfolio-site/` — the full kit with routing: `index.html` (router + hero-variant and screen switcher), `Chrome.jsx`, `HomeScreen.jsx`, `CaseStudyScreen.jsx`, `AboutScreen.jsx`, `data.js` (all résumé content, per lens), `README.md`.
- `portfolio-editorial/` — **Site A**, one page: type-first hero, real portrait lower in the page, work as `WorkRow` list.
- `portfolio-portrait/` — **Site B**, one page: portrait beside the type in the hero, work as screenshot-free `ProjectBrief` cards, contact form.

Sites A and B share `portfolio-site/data.js`, so a content edit updates all three.

**Photography** — `assets/portrait-nicolas.jpg`, the supplied portrait. Crops: 4:5 at `objectPosition: 50% 20%` for heroes, 3:4 at `50% 22%` for about blocks, circle at 36px in headers.

**Templates** (`templates/`) — starting folders a consuming project can copy: `portfolio-page/`.

**Assets** (`assets/`) — `portrait-nicolas.jpg` plus 44 SVG icons in `icons/{ui,tech}/`. No logo.
