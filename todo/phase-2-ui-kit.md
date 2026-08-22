# Phase 2 — UI kit

## Goal

The design system lives in-app — tokens in `src/styles/tokens/`, 20 components in `src/ui/`, icons in `public/icons/` — proven by a `/kit` page rendering every component in every variant, in both themes. After this phase the app never reads from the skill again (the skill itself is deleted in phase 7, not now).

## Decisions (locked)

- Tokens ported **verbatim** — they are production-ready CSS custom properties. The only edited file is `fonts.css` (see Fonts below).
- Components become `.tsx` with each skill `.d.ts` folded in as an exported `Props` interface. **The API is frozen**: same prop names, unions, and defaults as the `.d.ts` contracts. Do not "improve" them.
- Fonts: `@fontsource-variable/space-grotesk` + `@fontsource-variable/jetbrains-mono` (variable woff2, self-hosted, hashed by the bundler, `font-display: swap`). Chosen over manual `@font-face` (no woff2 sourcing/subsetting work) and Astro's experimental fonts API (unstable).
- Icons go to `public/icons/{ui,tech}/` because `Icon` paints via CSS `mask` — it needs stable public URLs, not bundler-hashed imports.
- `/kit` is permanent living documentation of the kit (it gets `noindex` in phase 7), not a throwaway page.

## Source (read before porting)

- `.claude/skills/nicolas-mateo-design/design-system/tokens/*.css` — 7 files: `fonts`, `colors`, `typography`, `spacing`, `shape`, `motion`, `base`. `styles.css` beside them defines the import order.
- `.claude/skills/nicolas-mateo-design/design-system/components/{core,forms,navigation,content}/` — per component: `.jsx` (implementation), `.d.ts` (frozen API), `.prompt.md` (usage rules — read each one; they carry laws like Button "No shadows, ever").
- `.claude/skills/nicolas-mateo-design/design-system/assets/icons/` — `ui/` 30 Lucide SVGs, `tech/` 14 Simple Icons SVGs.

## Tasks

1. [x] **Tokens**: copy the 7 files to `src/styles/tokens/`. Rewrite `fonts.css` to a comment-only pointer ("fonts are self-hosted via @fontsource imports in BaseLayout.astro") — the Google Fonts `@import` must not survive. Create `src/styles/global.css` importing the tokens in the skill's `styles.css` order (fonts, colors, typography, spacing, shape, motion, base).
2. [x] **Fonts**: `pnpm add @fontsource-variable/space-grotesk @fontsource-variable/jetbrains-mono`. Create a minimal `src/layouts/BaseLayout.astro` (head, `global.css`, the two font imports, `<slot/>`). Confirm the font-family names emitted by fontsource match the token stacks (`"Space Grotesk"`, `"JetBrains Mono"`); if fontsource registers `"Space Grotesk Variable"`, update the `--font-*` token values accordingly and note it in the commit. **Done:** fontsource registers both families with the `Variable` suffix, so all three `--font-*` declarations (two families) in `typography.css` were renamed.
3. [x] **Icons**: copy `icons/ui/` (30 files) and `icons/tech/` (14 files) to `public/icons/ui/` and `public/icons/tech/`.
4. [x] **Components** — port in dependency order to `src/ui/<group>/<Name>.tsx`:
   1. `core/Icon` first — change its default `base` from `"assets/icons"` to `"/icons"`; after this, callers never pass `iconBase`.
   2. Rest of `core/`: Button, IconButton, Tag, Card, Avatar, StatBlock.
   3. `forms/`: Input, Textarea, Select, Switch.
   4. `navigation/`: TextLink, SegmentedToggle, ThemeToggle.
   5. `content/`: SectionHeader, ProjectCard, ProjectBrief, WorkRow, TimelineItem, SkillGroup.

   Conversion checklist per component: fold the `.d.ts` into an exported `Props` interface; `JSX.Element` → `React.JSX.Element`/`ReactNode`; drop `import React` if only JSX is used; keep inline style objects referencing CSS variables exactly as authored (no CSS modules, no Tailwind); keep default prop values identical.

5. [x] **Barrel**: `src/ui/index.ts` re-exporting all 20.
6. [x] **`/kit` page**: `src/pages/kit.astro` using BaseLayout — every component, grouped by folder, showing every variant/size/tone/state enumerated in its `Props` unions (Button variants × sizes, Tag tones ± dot, Card tones, form fields in default/hint/error/disabled, TimelineItem current/past/last, etc.), plus a working `<ThemeToggle client:load>` at the top. This page is also the project's first hydration test.

## Verification

- [x] `pnpm check` and `pnpm build` clean.
- [x] `diff -r src/styles/tokens .claude/skills/nicolas-mateo-design/design-system/tokens` → only `fonts.css` differs, plus the three sanctioned `--font-*` family renames in `typography.css` (task 2). `src/styles/tokens/` is Prettier-ignored so the copy stays byte-verbatim.
- [x] `ls public/icons/ui | wc -l` = 30; `ls public/icons/tech | wc -l` = 14.
- [x] `grep -r "fonts.googleapis" dist/` → empty; 8 woff2 files emitted into `dist/` and the built `@font-face` rules name only the two self-hosted families.
- [ ] Browser pass on `/kit`: all 20 components render; icons paint via mask (visible in both themes — flip the ThemeToggle live); focus rings match the DS (`0 0 0 2px #C9963A, 0 0 0 3px #F6E3AE`); compare against each component's `.prompt.md` rules. **Not done — no browser available in the implementation session.** Verified instead from the served HTML: all 20 sections render, every icon URL resolves under `/icons`, the ThemeToggle island carries `client="load"`, no `#E3B23C` is used as a text colour, no Button carries a shadow, and no hard-coded hex survives in component inline styles. The visual/both-themes pass still needs a human.
- [ ] Push `dev` → check `/kit` on the preview URL. **Not done — this session does not commit or push.**

## Gotchas

- The `.prompt.md` rules are law: Button never has shadows; tech icons render only in `--text-muted`/`currentColor`, never vendor brand colors; `Tag` mono pills for stacks.
- `Button as="a"` must render a real anchor — the hero CTAs and the Resume button depend on it.
- Do not import anything from `.claude/skills/` in app code — copy, then reference only `src/` and `public/`.
- `Switch` exists in the kit but the page never uses it; port it anyway (kit completeness) and show it on `/kit`.
- Keep components presentational — no Astro imports, no data fetching, so they stay portable.

## Definition of Done

Inherited DoD, plus: token diff clean, icon counts exact, no Google Fonts in `dist/`, `/kit` renders all 20 components correctly in both themes locally and on the preview URL.

## Out of scope

Page sections, content module, portrait/resume assets (phase 3). Reveal/lens/theme page wiring (phase 4) — `/kit`'s ThemeToggle island is the only hydration here.
