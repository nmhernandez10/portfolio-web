# Phase VC2 — Kit

## Goal

The new design system lives in the app in parallel with the old one: new tokens under
`src/styles/redesign/`, the 14 components under `src/kit/`, the three typefaces
self-hosted, and `/kit` rewritten as the living documentation of the new system in both
themes. The live page (`/`) is untouched and stays on the old kit until VC3.

## Decisions (locked)

- **Parallel, then promote.** Ten component names collide between old and new kits with
  entirely different APIs, so the new kit is born in `src/kit/` and only takes over
  `src/ui/` in VC3 (`git mv`). Same for styles: `src/styles/redesign/` now,
  promoted in VC3. Never import `src/kit/` and `src/ui/` into the same module.
- **Tokens are copied byte-verbatim** (phase-7 parity diffs against the skill), with
  exactly one exception: `fonts.css` becomes the pointer comment — its Google Fonts
  `@import` must never ship. Every adaptation (font family names, future contrast
  overrides) lives in `src/styles/redesign/index.css`, **not** in `tokens/` — unlike
  phase 2, which renamed families inside `typography.css`; that made the parity diff
  noisier and is not repeated.
- **`/kit` gets a temporary `KitLayout.astro`.** Old and new token sets collide on
  dozens of `:root` names (`--ink-1..4`, `--line-1/2`, `--radius-*`, `--space-*`,
  `--focus-ring`, `--font-mono`, …) with different values and even different scales, so
  the two stylesheets can never load on the same page. `/kit` therefore leaves
  `BaseLayout` for a minimal `KitLayout` (head, inline theme script, redesign CSS +
  fontsource imports only). VC3 deletes `KitLayout` and returns `/kit` to `BaseLayout`
  once `BaseLayout` itself is on the new system.
- **API frozen, internals deduplicated**: fold each `.d.ts` into an exported `Props`
  interface — same names, unions, defaults. Where the skill's `.jsx` repeats itself
  (the identical tag-pill style objects in `ExperienceItem` and `ProjectCard`; the
  shared label style in `Input`/`Textarea`/`Divider`/`SkillGroup`), extract a shared
  internal helper (e.g. `src/kit/internal.ts`) with byte-identical rendered output.
- **The theme toggle is site chrome, not kit.** The new kit has no ThemeToggle and no
  icons. `src/sections/SiteThemeToggle.tsx` is re-implemented in place as a
  self-contained icon-free control (pill, hairline border, mono 12px uppercase label
  "Dark"/"Light", `aria-pressed` or equivalent), keeping its existing behavior: adopt
  `document.documentElement.dataset.theme` on mount, write attribute + `localStorage`
  on change. It must no longer import anything from the old kit. `/kit` mounts it
  (`client:load`) as its theme switch.

## Source

- `.claude/skills/nicolas-mateo-design/tokens/*.css` — 7 files; `styles.css` beside
  them defines the import order (fonts, colors, typography, spacing, shape, motion,
  base).
- `…/components/{core,forms,navigation,content}/` — per component: `.jsx`, `.d.ts`,
  `.prompt.md` (the usage laws; read all 14).
- Core: Button, Card, Divider, Portrait, Tag · Forms: Input, Textarea · Navigation:
  NavBar, TextLink · Content: SectionHeader, ExperienceItem, ProjectCard, SkillGroup,
  StatBlock.

## Tasks

1. **Fonts**: `pnpm add @fontsource-variable/newsreader
@fontsource-variable/instrument-sans` (JetBrains Mono is already present; Space
   Grotesk stays until VC3). Confirm the registered family names in each package's CSS
   (expect the `Variable` suffix; Newsreader also carries an `opsz` axis and an
   italic file — import what the design needs: normal + italic for Newsreader per the
   skill's Google import, normal only for the others).
2. **Tokens**: copy the 7 files to `src/styles/redesign/tokens/` byte-verbatim;
   rewrite `fonts.css` to the pointer comment. Create
   `src/styles/redesign/index.css`: imports in the skill's `styles.css` order, then a
   `:root` block overriding `--font-display` / `--font-sans` / `--font-mono` with the
   actual fontsource family names (keeping the skill's fallback stacks). Add
   `src/styles/redesign/tokens` to `.prettierignore`.
3. **Components**: port the 14 to `src/kit/<group>/<Name>.tsx` + an `index.ts` barrel.
   Checklist per component: fold `.d.ts` into `Props`; `JSX.Element` →
   `React.JSX.Element`/`ReactNode`; drop `import React` where only JSX is used; keep
   inline style objects verbatim (values only through CSS custom properties); keep
   default props identical; hover/focus state stays in component state as authored.
   Port order: core → forms → navigation → content. Notes:
   - `NavBar` consumes `--nav-bg`, `ProjectDrawer`'s scrim token `--scrim` — both exist
     in the copied `colors.css`; nothing hardcodes an alpha color.
   - `ProjectDrawer` is **not** in the skill's `components/` — it lives in
     `ui_kits/portfolio/ProjectDrawer.jsx`. Port it into `src/kit/content/` anyway (it
     is a reusable piece of the system the page needs in VC4), same conversion rules.
   - `Portrait`: default `grayscale`, arch radius math (`size/2` top corners), 1.22×
     height — keep exactly.
   - `Button as` anchor behavior: renders `<a>` when `href && !disabled` — hero CTAs
     and Résumé actions depend on it.
4. **SiteThemeToggle** re-implementation (see Decisions). Verify against both reference
   PNGs that it reads as system-native chrome (quiet, mono label, no icon).
5. **`/kit` rewrite** on `KitLayout`: all 14 components + the drawer, grouped by
   folder, every variant/size/tone/state from the Props unions (Button 4 variants × 3
   sizes ± disabled/full; Tag 6 tones ± dot ± mono; Card 4 tones ± interactive;
   Portrait 4 shapes; Input/Textarea default/hint/error; Divider ± label;
   ExperienceItem current/past; StatBlock with/without note; SkillGroup;
   SectionHeader with index/label/lead; ProjectCard; NavBar in a static frame;
   TextLink tones ± arrow ± external; ProjectDrawer shown open, statically), with the
   theme toggle at the top. `/kit` remains permanent living documentation, not a
   throwaway.
6. **a11y spec surgery** (`e2e/a11y.spec.ts`) — must land with the `/kit` rewrite:
   - Scope the gold exemption and its canary (`exempted > 0`) to the `/` scans only;
     `/kit` no longer contains gold.
   - Remove the disabled-`Switch` exclusion (no Switch exists on the new `/kit`).
   - Measure the new palette's small-text contrast **in both themes** on the actual
     `/kit` render: clay ordinals/`SectionHeader` index (12px mono), `--text-meta`
     (`--ink-3`) labels, moss-on-moss-soft tag, amber/rust tones, `--ink-4` notes.
     For each failure decide, in this order: (1) a scoped semantic override in
     `redesign/index.css` (light: `:root:not([data-theme="dark"])`, dark:
     `[data-theme="dark"]` — never a bare `:root`, which would out-order the dark
     block), keeping `tokens/` verbatim, or (2) a documented axe exemption where a
     design law forces the value (the gold-law precedent). Record measured ratios in
     comments beside each decision.
   - The dark-theme `/kit` scan now exercises the skill's `[data-theme="dark"]`
     palette.

## Verification

- `pnpm check` and `pnpm build` clean; `pnpm test:e2e` green (including the `/` specs,
  which must be untouched by this phase).
- `diff -r src/styles/redesign/tokens .claude/skills/nicolas-mateo-design/tokens` →
  only `fonts.css` differs.
- `grep -r "fonts.googleapis" dist/` → empty; built CSS `@font-face` rules name only
  the three self-hosted families; Newsreader woff2 files present in `dist/_astro/`.
- `grep -rn "from \"@/ui\|from '@/ui" src/kit src/pages/kit.astro` → nothing (no
  cross-kit imports); `grep -rn "src/kit" src/sections src/pages/index.astro` →
  nothing (live page untouched).
- Browser pass on `/kit` at `localhost:8788`: all 14 render in both themes; no glyph
  is an image or SVG; Button/Tag pills fully round; cards flat at rest, shadow only on
  hover; focus ring is the clay `--shadow-focus`.

## Gotchas

- The `.prompt.md` rules are law — e.g. Button `accent` at most once per screen; Tag
  rows sorted by relevance, non-mono only for human-language labels; StatBlock "never
  invent metrics"; NavBar "four links maximum". `/kit` captions should quote them.
- Old `global.css` must not leak into `/kit` (and redesign CSS must not leak into
  `/`): check both pages' built `<link>`/`<style>` output, not just the imports.
- React 19: the skill `.d.ts` files use `JSX.Element`; the automatic runtime makes
  `import React` unnecessary in most files — but `ProjectDrawer` uses
  `React.useState`/`useEffect`, convert to named imports.
- `KitLayout`'s inline theme script must be `is:inline` and byte-equivalent in
  behavior to `BaseLayout`'s (same `localStorage` key), or `/kit` and `/` disagree on
  theme.
- Do not import from `.claude/skills/` in app code — copy, then reference only `src/`.

## Definition of Done

Inherited DoD, plus: token diff clean; 14 components + drawer on `/kit` in both
themes; no Google Fonts in `dist/`; a11y suite green with the contrast decisions
recorded; live page bit-identical to VC1's.

## Out of scope

Any change to `/` (sections, BaseLayout, old kit, old styles). Deleting the old kit or
Space Grotesk (VC3). Drawer interactivity on the page (VC4).
