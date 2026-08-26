# AGENTS.md — nicolasmateo.dev

Personal portfolio for Nicolás Hernández: a one-page, static-first Astro 7 + React 19 site on
Cloudflare Pages, telling one story — Senior Backend Engineer & Feature Architect — across four
numbered sections. This is the canonical agent doc; `CLAUDE.md` only imports it.

**This file is the rules.** It states what must not be broken, one line at a time. The reasoning
behind any single rule is either in the comment above the code that enforces it, or in the doc
that owns it. Nothing here is repeated anywhere else, and nothing here repeats them.

| Doc                                            | Owns                                                       | Open it when                           |
| ---------------------------------------------- | ---------------------------------------------------------- | -------------------------------------- |
| [`README.md`](README.md)                       | what the site is · quickstart · the command table          | you need to run something              |
| **`AGENTS.md`**                                | the rules, the map, the quality gate                       | always                                 |
| [`docs/architecture.md`](docs/architecture.md) | layers · islands · request flow · the stylesheet           | you are changing structure             |
| [`docs/brand.md`](docs/brand.md)               | tokens · voice · the numbers behind the design laws        | you are writing copy or CSS            |
| [`docs/operations.md`](docs/operations.md)     | environment · Pages config · budgets · the release runbook | you are shipping or touching env       |
| [`docs/testing.md`](docs/testing.md)           | the suite, per spec, and the traps in it                   | you are touching `e2e/`                |
| [`docs/decisions.md`](docs/decisions.md)       | the dated record of what replaced what                     | you are about to re-litigate something |

## Workflow

The site is launched. Work is ordinary change on a live site — there is no phase model.

1. Branch off `dev`, which is long-lived. Commit small, Conventional Commits (`feat:`, `fix:`,
   `chore:`, `docs:`, `ci:`, `refactor:`).
2. Run `npm run format` before every commit — CI gates formatting.
3. PR `dev → main`, merged with a **merge commit — never squash**. Squashing `dev` causes
   phantom-diff conflicts on every later PR.
4. CI (`.github/workflows/ci.yml`, job id `ci`) is the required check. It never deploys;
   Cloudflare Pages deploys from git.
5. Steps that need a dashboard or another human-only action are marked `HUMAN:` — stop and ask,
   never guess.

**Definition of done**, for any change:

- `npm run check` and `npm run build` are clean.
- `npm run test:e2e` is green, the whole suite.
- CI is green on the PR.
- No new console errors or warnings in `npm run dev`.

## Stack

| Layer         | Choice                                                                                                         |
| ------------- | -------------------------------------------------------------------------------------------------------------- |
| Framework     | Astro 7, `@astrojs/react` (React 19), TypeScript strict                                                        |
| Runtime       | Node 24 (`.nvmrc`), npm — [not pnpm](docs/decisions.md)                                                        |
| Hosting       | Cloudflare Pages, [adapter-less](docs/decisions.md)                                                            |
| Fonts         | self-hosted `@fontsource-variable/{newsreader,instrument-sans,jetbrains-mono}`, which register as `… Variable` |
| Type checking | `astro/tsconfigs/strictest` minus `exactOptionalPropertyTypes`                                                 |
| Toolchain     | `astro check` + `tsc --noEmit` + Prettier. **No ESLint** — that is the whole gate                              |
| Path alias    | `@/*` → `src/*` (unavailable in `functions/`)                                                                  |

## Project map

```
src/
  ui/{core,forms,navigation,content}/*.tsx   the 15 kit components; internal.ts + index.ts
  styles/tokens/*.css      6 token files — the design vocabulary; never edited
  styles/sections.css      page layout, one class block per page block
  styles/global.css        tokens, then sections.css, then the site layer, then theme fixes
  content/{types,profile,sections,contact,schema,site}.ts   data + contracts; index.ts barrel
  sections/Section.astro   the block shell: anchor, surface, 1080px column, reveal hook
  sections/SectionIntro.astro  sectionMeta -> SectionHeader; the one owner of an ordinal
  sections/*.astro         one component per page block
  sections/{SiteNav,ContactForm,WorkGrid}.tsx        the three islands
  sections/{SiteThemeToggle,SiteNavMenu}.tsx         site chrome, not kit inventory
  layouts/BaseLayout.astro head, fonts, theme script, main landmark, reveal script
  layouts/ThemeScript.astro  the shared pre-paint theme script
  pages/index.astro  kit.astro  404.astro  robots.txt.ts
  pages/_kit/              /kit's own Specimen.astro + NavBarSpecimen.tsx (not routed)
  scripts/{reveal,theme}.ts   import-free browser behaviour
  assets/portrait.jpg      optimized via astro:assets
functions/api/contact.ts   the contact endpoint, as a Pages Function
public/                    resumes, favicon.svg, og.png, _headers  (robots.txt is generated)
docs/                      architecture · brand · operations · testing · decisions
```

## Invariants

Structure — the reasoning for each is in [architecture](docs/architecture.md):

1. **Dependencies run one way**: `pages → layouts → sections → {ui, content, scripts} → styles`.
2. **`src/ui/` never imports `src/content/`**, and `internal.ts` is never re-exported from the barrel.
3. **`src/content/` is data and contracts only** — no React, no styling, no imports from `src/ui`.
4. **`src/scripts/` is a leaf**: import-free browser behaviour, imported by `BaseLayout` and the
   theme toggle, never the reverse.
5. **`functions/` may import `src/content` contract modules by _relative_ path and nothing else
   from `src/`.** The Pages bundler resolves no aliases, so `@/content` fails at runtime while
   still typechecking — convention, not compiler-enforced. `npm run test:e2e` is what catches it.
   Nothing in `src/` ever imports from `functions/`.
6. **A section file is `.tsx` only if it is, or becomes, a hydrated island.** There are three, and
   an island cannot hydrate inside another.
7. **An island may import only import-free content leaves** — `@/content/sections`,
   `@/content/contact`. Never the barrel, never `@/content/profile`; anything else crosses as a
   serialized prop. A smoke test walks the `/_astro/*.js` graph and fails on a profile-only string.
8. **`astro.config.mjs`'s `site` is the one owner of the origin.** All four consumers narrow it
   through `requireSite()` in `src/content/site.ts`.
9. **`BaseLayout` owns the head and `<main>`**: typed props for the shared contract, a `head` slot
   for one-off content, and the skip link with its target in the same file. A `noindex` page and
   the sitemap `filter` must agree — `/kit` sets both.
10. **`src/scripts/theme.ts` owns the theme contract** — storage key, chrome tints, `setTheme()`.
    The pre-paint script takes them through `define:vars` and never persists.
11. **The drawer portals to `document.body`**, because `.reveal` puts a `transform` on
    `.section__inner` that would otherwise become its containing block.
12. **Content never depends on JS**: every section exists in static HTML.
13. **Copy has a single source** — every string lives in `src/content`, and section files render
    data rather than carrying prose.

Styling — the numbers are in [architecture](docs/architecture.md#stylesheet) and [brand](docs/brand.md):

14. **The kit styles itself inline and is never forked.** Kit APIs are frozen; kit internals are
    not — a shared helper in `src/ui/internal.ts` is fine if the rendered output is byte-identical.
    It reaches the design system only through `var(--token)`: `grep -rn "oklch(" src/ui` stays empty.
15. **The lever at a call site is a custom property** — never `!important`, never an edit inside
    `tokens/`. Where the kit wrote a literal, inject the property with the kit's own value as the
    fallback; an undefined `var()` is invalid at computed-value time and collapses the grid.
16. **A class hook sits on a section-owned element, never on a kit component** — Astro deletes
    `class` on framework components and the kit's frozen props have no `className`.
17. **Hiding needs a wrapper.** A stylesheet `display:none` aimed at a kit component loses wherever
    that component writes `display` inline — `Button` does, `NavBar`'s item anchors do not. The
    couplings the narrow-mode selector depends on are recorded above it in `global.css`.
18. **There is exactly one breakpoint, `width < 900px`**, declared in `global.css` with its
    arithmetic. No second, smaller step.
19. **Theme corrections are theme-scoped**, never a bare `:root`, which out-orders `colors.css`'s
    dark block and silently breaks the dark theme.
20. **In-page navigation is CSS** — `scroll-padding-top: var(--nav-h)` plus `scroll-behavior`.
    `NavBar` renders plain anchors; the nav island owns scroll-spy and nothing else.

## Design source of truth

**[`docs/brand.md`](docs/brand.md)** is the design reference: the token digest, the voice rules and
their banned words, the colour / type / spacing / shape / motion laws with their numbers, the
no-icons law, the dark-theme mechanism, the 15-component inventory and the interaction contracts.

The split: **this file states the law, `brand.md` carries the number behind it.** The
machine-readable source is `src/styles/tokens/*.css`, and `/kit` is the live inventory.

## Design laws

Non-negotiable. Each links to the section of `brand.md` that carries its values.

- **Clay is the only accent** — section ordinals, the active nav underline, one call-to-action per
  screen, hover arrows. If clay appears three times in a viewport, remove one. Never a new hue,
  never a gradient. → [colour](docs/brand.md#colour)
- **Separation is 1px hairlines, not shadows.** Exactly three shadows are sanctioned; a card at
  rest has a border and none of them. → [shape](docs/brand.md#shape-and-elevation)
- **The radii ladder has four rungs and no exceptions.** Buttons are never square. → [shape](docs/brand.md#shape-and-elevation)
- **No icons of any kind** — no icon font, no SVG sprite, no emoji. Typography carries every
  affordance. → [iconography](docs/brand.md#iconography--there-is-no-icon-set-by-design)
- **Three typefaces, one job each** — Newsreader Light, Instrument Sans, JetBrains Mono. No Inter,
  no Space Grotesk, no fourth face. Nothing is ever fetched from a third-party origin, so
  `grep -r "fonts.googleapis" dist/` stays empty. → [type](docs/brand.md#type)
- **Surfaces alternate `--paper` and `--paper-sunk`** — no third background, flat colour only, no
  imagery behind text. → [colour](docs/brand.md#colour)
- **Both themes ship.** Every component reads the semantic aliases, so no component changes per
  theme. → [themes](docs/brand.md#both-themes-ship)
- **Copy is first person, sentence case, numbers not adjectives**, no emoji, no exclamation marks,
  accents kept in _Bogotá_ / _Nicolás_. The banned-word list applies to every string, including
  form errors and the 404 page. → [voice](docs/brand.md#voice)

## Quality gate

What must pass before a commit. (How to _run_ the site is [README](README.md#commands).)

| Command            | Gates                                                             |
| ------------------ | ----------------------------------------------------------------- |
| `npm run format`   | formatting — CI fails on unformatted files                        |
| `npm run check`    | `astro check` + `tsc --noEmit`, `src/` and `functions/` alike     |
| `npm run build`    | the production build                                              |
| `npm run test:e2e` | the [Playwright suite](docs/testing.md) on the real Pages runtime |
