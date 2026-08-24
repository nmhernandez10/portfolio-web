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

1. [x] **Fonts**: `pnpm add @fontsource-variable/newsreader
@fontsource-variable/instrument-sans` (JetBrains Mono is already present; Space
       Grotesk stays until VC3). Confirm the registered family names in each package's CSS
       (expect the `Variable` suffix; Newsreader also carries an `opsz` axis and an
       italic file — import what the design needs: normal + italic for Newsreader per the
       skill's Google import, normal only for the others).
2. [x] **Tokens**: copy the 7 files to `src/styles/redesign/tokens/` byte-verbatim;
       rewrite `fonts.css` to the pointer comment. Create
       `src/styles/redesign/index.css`: imports in the skill's `styles.css` order, then a
       `:root` block overriding `--font-display` / `--font-sans` / `--font-mono` with the
       actual fontsource family names (keeping the skill's fallback stacks). Add
       `src/styles/redesign/tokens` to `.prettierignore`.
3. [x] **Components**: port the 14 to `src/kit/<group>/<Name>.tsx` + an `index.ts` barrel.
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
4. [x] **SiteThemeToggle** re-implementation (see Decisions). Verify against both reference
       PNGs that it reads as system-native chrome (quiet, mono label, no icon).
5. [x] **`/kit` rewrite** on `KitLayout`: all 14 components + the drawer, grouped by
       folder, every variant/size/tone/state from the Props unions (Button 4 variants × 3
       sizes ± disabled/full; Tag 6 tones ± dot ± mono; Card 4 tones ± interactive;
       Portrait 4 shapes; Input/Textarea default/hint/error; Divider ± label;
       ExperienceItem current/past; StatBlock with/without note; SkillGroup;
       SectionHeader with index/label/lead; ProjectCard; NavBar in a static frame;
       TextLink tones ± arrow ± external; ProjectDrawer shown open, statically), with the
       theme toggle at the top. `/kit` remains permanent living documentation, not a
       throwaway.
6. [x] **a11y spec surgery** (`e2e/a11y.spec.ts`) — must land with the `/kit` rewrite:
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

## Deviations from this doc (agreed with the user, and why)

1. **The new theme toggle is a parallel file, not a rewrite in place**
   (Decisions bullet 5). `Header.astro` mounts `src/sections/SiteThemeToggle.tsx`
   on `/`, so re-implementing it in place would have changed the live page and the
   smoke spec's `Switch to dark theme` locator — contradicting this phase's own
   "Out of scope" and its "live page bit-identical" DoD. It is
   `src/sections/next/SiteThemeToggle.tsx` instead, consumed only by `/kit`, and
   VC3 deletes the old one and `git mv`s this into its place. Same pattern as
   `src/content/next/` and `src/kit/`.

2. **The two raw oklch literals in the skill's JSX became theme-scoped tokens**
   (task 3). Both are theme-blind: `Button`'s primary hover `oklch(0.16 0.010 70)`
   turned the dark-theme primary button near-black behind near-black text, and
   `Tag`'s amber ink `oklch(0.48 0.11 85)` measures 2.11 on dark `--amber-soft`.
   They are now `--btn-primary-hover` and `--tag-amber-ink`, defined per theme in
   `redesign/index.css`. Light renders byte-identically. The skill's own closing
   law — reference colour only through the custom properties — is the argument,
   and `grep -rn "oklch(" src/kit` is now empty as a standing gate.
   `--btn-primary-hover` follows one rule in both themes: the hover fill moves
   further from the page surface, so contrast against the button's own
   `--text-inverse` label strictly increases from rest.

3. **`--ink-4`'s word-and-digit uses moved to `--text-meta`** (task 6). AA on
   near-white pins any readable ink at L ≈ 0.540 — the value `--ink-3` already
   needs — so correcting `--ink-4` would have collapsed the fourth step of the ink
   ramp into the third. Four sites moved instead: `StatBlock` note, `ProjectCard`
   meta, `ProjectDrawer` meta and the drawer's detail ordinals. The rule, stated
   in the components: `--ink-4` stays only on non-word marks.

4. **`ProjectDrawer` takes a required `closeLabel`.** It is the one component the
   skill ships without a `.d.ts`, so its contract is this repo's. Making the label
   a required prop with no default is what keeps "Close ✕" in
   `COPY.drawer.close` rather than in the kit.

5. **`/kit` renders the real content model.** The brand's voice rules govern every
   string and copy has one source, so the five content components and the drawer
   take `profile.projects` / `.experience` / `.skills` / `.stats`, `SECTIONS` and
   `COPY.form.*` from `src/content/next` rather than invented prose. VC3's `git mv`
   turns the one `@/content/next` specifier into `@/content`. `profile.education`
   is not used: no component in the 14 accepts an `EducationEntry`, and VC3's About
   renders it as plain markup beside a `Divider`.

6. **`src/layouts/ThemeScript.astro` is shared by both layouts.** The gotcha below
   requires `KitLayout`'s pre-paint script to stay byte-equivalent to
   `BaseLayout`'s; extracting it makes divergence structurally impossible instead
   of merely documented. `is:inline` is emitted verbatim, so `/`'s DOM is
   unchanged. This is the phase's one edit to `BaseLayout.astro`.

7. **`/kit` is grouped by folder under four `h2`s, with each specimen at `h3`.**
   Forced, not stylistic: the new `SkillGroup` renders an `h4` (the old `src/ui`
   one rendered a `div`, which is why `/kit` passed before), so specimens at `h2`
   would jump h2 → h4 and fail axe's `heading-order`. At `h3` every component's own
   heading — `SectionHeader`'s h2, `ExperienceItem`/`ProjectCard`'s h3,
   `SkillGroup`'s h4, the drawer's h2 — is a legal one-step increase or a decrease.

8. **The `--ink-4` marks needed no axe exemption after all.** The plan expected to
   exempt the em dash bullet, the skills slash and the project card's resting
   arrow. Measured on the real render, axe reports none of them: the first two
   carry no word characters and the third comes back `incomplete`. Listing them
   would have been a dead exemption that blunts the canary, so they are recorded
   in a comment instead. Light `/kit` exempts clay only (both directions); dark
   `/kit` exempts nothing and therefore carries no canary.

9. **`ProjectDrawer`'s scrolling body gained `tabIndex={0}`.** Not in the plan: axe
   reported `scrollable-region-focusable` on it, because the panel body scrolls and
   holds no focusable child of its own, so a keyboard user could not reach the
   detail copy. One attribute, the textbook remedy, and independent of the modal
   semantics VC4 adds.

10. **`redesign/index.css` also sets `::placeholder` and `color-scheme`.** The old
    `tokens/base.css` carried `::placeholder{color:var(--text-muted)}`; the new
    skill's `base.css` carries neither that nor any `color-scheme`, so without them
    the UA paints placeholders, scrollbars and the textarea resize grip in light
    chrome under `data-theme="dark"`.

11. **`src/pages/_kit/NavBarSpecimen.tsx` is a file the doc does not name.**
    `NavBar`'s `action` prop takes a React element and an `.astro` template can
    only produce Astro renderables — passing the résumé button inline crashes the
    build with _"Objects are not valid as a React child"_. The one composition on
    the page that nests a component inside a prop is assembled in React instead.
    VC3's `SiteNav` island fills the same slot, so this is the pattern it needs
    anyway.

12. **Repeated field specimens pass an explicit `id`.** `Input` and `Textarea`
    derive their id from the label, so the two Email inputs and the two Message
    textareas would each emit one duplicated id and both `<label for>`s would
    resolve to the first field, leaving the error variant unlabelled. The suite
    does not catch it: axe-core 4.13 ships `duplicate-id` disabled, and
    `duplicate-id-aria` — which does match a `label[for]` target — is
    `reviewOnFail`, so it lands in `incomplete` rather than `violations`, which
    is all the spec asserts on. The ids are set at the call site instead; the
    ported components are untouched.

13. **The skill's `styles.css` sits at the skill root**, not "beside" the token
    files as the Source section says. Import order is otherwise exactly as stated.

## Known residue

- **`SkillGroup` renders an `h4`.** It only sits correctly under an `h3`, which
  `/kit` guarantees. VC3's About section opens with a `SectionHeader` `h2`, so the
  same component will skip a heading level there — settle it in VC3, either by
  dropping the level in the component or by giving About an intermediate heading.
- **`/kit`'s fields show no focus ring.** `Input`/`Textarea` write
  `box-shadow: none` inline when unfocused, and the specimens are server-rendered
  without hydration, so the stylesheet's `:focus-visible` ring cannot reach them.
  It works on every button and link on the page. Faithful to the skill's source;
  the page's own caption says so.
- **The built `/` picked up a different CSS chunk split.** `/kit` no longer imports
  `global.css`, so Vite stops sharing one stylesheet between the two pages: `/` now
  links two hashed files instead of one, and three island bundle hashes changed.
  The CSS rules served to `/` are identical — verified rule-by-rule against a clean
  `HEAD` worktree build — and its DOM is unchanged.

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
