# Brand — nicolasmateo.dev

The design reference for Nicolás Hernández's portfolio, condensed in phase 7 from the
`nicolas-mateo-design` skill that produced it. The skill was deleted once this file existed and
a parity check passed; its full text is in git history.

It is a **personal brand** system, not a product system: one voice, one site, one résumé. There
is **no logo** — the name set in type is the mark.

## What this file owns, and what it does not

`docs/brand.md` owns the **values, the reasoning and the inventory**: what the tokens are, why
each law exists, which components exist and how the site behaves.

`AGENTS.md` § Design laws owns the **enforceable rules** an agent must not break, stated
tersely so they stay in context without opening this file. Where a rule here and a rule there
describe the same thing, AGENTS.md states the law and this file carries the number behind it.

The machine-readable source is `src/styles/tokens/*.css`. Those files are the vocabulary, not a
draft of it: reference colour, type, spacing and motion **only** through `var(--token)`. A
value that is not a token is a signal the design is drifting — add a token or reuse one rather
than hardcoding a literal. Corrections belong in `src/styles/global.css`'s site layer, never
inside `tokens/`.

---

## Position

Quiet, warm, editorial. A backend engineer's portfolio should read like a well-set page, not a
SaaS landing page. The whole system is a warm off-white sheet with warm-grey ink, hairline
rules, and exactly one accent.

**Wordmark.** The name in Newsreader Light at `--tracking-display` on `--paper` in `--ink-1` is
the mark; the sans lockup (medium, `-0.01em`) is its nav/UI form. There is no symbol to place
beside it and none should be drawn.

---

## Voice

First person, past-and-present tense, plain. He writes the way a senior engineer talks in a
design review: what the constraint was, what he built, what it did.

- **"I"**, never "we" for personal work, and never third person ("Nicolás is a…").
- Sentence case everywhere. The only uppercase is the 12px mono eyebrow labels.
- Every claim carries a number or a named system. "Delivered 200k+ sessions to 85k+ clients",
  not "delivered at scale".
- No adjectives without evidence. **Banned words: _passionate_, _results-driven_,
  _world-class_, _cutting-edge_, _ninja_, _rockstar_, _seamless_.**
- Section titles are short statements ending with a period: "Six years of production backends."
- Project copy is two sentences: the constraint, then the outcome.
- Contractions are fine ("I'll reply within a couple of days"). Exclamation marks are not.
- **No emoji, anywhere** — not in copy, not in tags, not as icons.
- Numbers: "+" marks floors (200k+), en dashes mark ranges (4–8, 2019 — 2020).
- Spanish accents are always preserved: _Nicolás Hernández_, _Bogotá_.
- Em dash with spaces; `·` as a separator.

✅ "I own PostgreSQL modeling for session, reporting and analytics workloads."
✅ "Recording, transcription and post-session analysis moved off the request path."
❌ "Passionate engineer building world-class scalable solutions 🚀"

This governs **every** string, including form errors and the 404 page. Copy has a single source:
it lives in `src/content/`, and section files render data rather than carrying prose.

---

## Colour

Two families and nothing else. Never introduce a new hue; never use a gradient.

**Paper** — the ground.

| Token             | Light                   | Role                                                             |
| ----------------- | ----------------------- | ---------------------------------------------------------------- |
| `--paper`         | `oklch(0.985 0.004 85)` | the page                                                         |
| `--paper-sunk`    | `oklch(0.964 0.005 85)` | the only alternate background — alternating sections, the footer |
| `--paper-raised`  | `oklch(1 0 0)`          | pure white, cards sitting on paper                               |
| `--paper-inverse` | `oklch(0.245 0.010 70)` | rationed to at most one block per page                           |

**Ink** — four warm greys, mapped heading / body / meta / disabled: `--ink-1`
`oklch(0.245 0.010 70)`, `--ink-2` `oklch(0.435 0.010 70)`, `--ink-3` `oklch(0.610 0.008 80)`,
`--ink-4` `oklch(0.760 0.006 80)`.

**Lines** — `--line-1` `oklch(0.905 0.005 80)` for rules between content, `--line-2`
`oklch(0.855 0.006 80)` for control borders.

**Clay is the only accent.** `--clay` `oklch(0.620 0.145 45)`, with `--clay-strong` for
hover/press, `--clay-soft` as a tint fill and `--clay-line` for accented borders. It appears on
section ordinals, the active nav underline, **one** call-to-action per screen, and hover
arrows. **If clay appears three times in a viewport, remove one.**

**Status** — moss / amber / rust share clay's lightness and chroma with the hue rotated
(`145` / `85` / `28`), so a status pill never out-shouts the accent.

**Semantic aliases** are what components read — `--text-heading`, `--text-body`, `--text-meta`,
`--text-accent`, `--surface-page`, `--surface-card`, `--surface-sunk`, `--border-hairline`,
`--border-control`. A component never reads a raw colour token, which is what makes the dark
theme free.

**Backgrounds are flat colour only**: no imagery behind text, no patterns, no textures. The
single photographic element is the portrait.

### Known contrast exception

`--clay` measures **3.69:1** against `--paper` both ways — as text (section ordinals, the
current role's period) and as the accent button's fill behind a `--paper` label. It is left
uncorrected because it is the accent's defined value; `e2e/a11y.spec.ts` carries it as a
narrow, documented axe exemption rather than silencing the rule. Everything else that measured
below AA was corrected in `global.css`'s theme-scoped blocks, each with its before → after
ratio in a comment: `--ink-3`, `--moss`, `--rust`, `--clay-strong`.

**This is why Lighthouse reports Accessibility 96, not 100** — one `color-contrast` audit, on
the hero's accent call-to-action. Decided 2026-08-25: the accent stays and the budget reads
"100 net of this exemption". Two alternatives were costed and rejected — restyling the CTA to
`--clay-strong` would sit the primary button at its own hover colour at rest, and changing
`--clay` would repaint the accent everywhere and edit `tokens/`. **A score below 96 is a real
regression**: the exemption covers exactly one colour pair, not the category.

---

## Type

Three faces, one job each. No Inter, no Space Grotesk, no fourth face.

- **Newsreader** (Light 300, serif) — the name, section statements, stat figures. Always light,
  always `--tracking-display` (`-0.022em`). The only decorative move in the system.
- **Instrument Sans** (400/500/600) — every headline, paragraph, label and control.
- **JetBrains Mono** — ordinals ("01"), 12px uppercase eyebrow labels at `0.13em`, metadata,
  tags, code. Mono is how the system signals _engineer_ — not icons, not colour.

Scale (1rem = 16px): `--size-display-xl` 88 · `-l` 64 · `-m` 44 · `--size-h1` 34 · `h2` 24 ·
`h3` 19 · `--size-body-l` 19 · `--size-body` 17 · `-s` 15 · `--size-meta` 13 · `--size-label` 12. Line heights `--lh-tight` 1.02 → `--lh-relaxed` 1.62.

Role shorthands (`--type-statement`, `--type-lead`, `--type-body`, `--type-label`, …) are what
call sites use. Prose is capped at `--measure-prose` (62ch); headings `text-wrap: balance`,
body `pretty`.

`--type-hero` (88px) is defined and deliberately unspent: the hero name needs a fluid
`clamp(3rem, 7vw, var(--size-display-xl))` that a static token cannot express, so `.hero__name`
in `sections.css` composes it. The token stays as vocabulary.

**Fonts are self-hosted** through `@fontsource-variable/*`, imported in `BaseLayout.astro`.
Nothing is ever fetched from a third-party origin — `grep -r "fonts.googleapis" dist/` stays
empty. Fontsource registers each family with a `Variable` suffix, so `global.css` re-declares
the three stacks with the skill's fallbacks intact.

---

## Spacing and layout

4px base, eleven steps: `--space-1` 4 → `--space-11` 160. Content column `--width-content`
1080px, long-form `--width-narrow` 680px, gutter `--space-6` 32px. Section rhythm is
`--section-y` top and bottom.

Generous vertical space is load-bearing: when a section looks empty, the fix is stronger copy,
never a filler card.

**One breakpoint, `width < 900px`**, declared in `global.css` with its arithmetic. It is set by
readability, not by the header: measured, the bar fits on one line down to 691px, while 900 is
where the hero copy column falls under ~41ch and a project card under 392px. Below 691 the
brand wraps to two lines and the bar still measures `--nav-h` (63px), which is what keeps
`scroll-padding-top` honest.

---

## Shape and elevation

**Separation is 1px hairlines, not shadows.** A card at rest has a border and no shadow.

**Radii ladder, and nothing else**: containers 14px (`--radius-lg`), inputs 8px
(`--radius-md`), small chips 4px (`--radius-sm`), controls and tags fully round
(`--radius-pill`). **Buttons are never square.**

**Three sanctioned shadows**, all near-invisible: `--shadow-md` on interactive-card hover,
`--shadow-lg` behind the project drawer, `--shadow-focus` as the focus ring. `--shadow-sm` and
`--shadow-hair` exist in the scale and are unspent.

**Transparency and blur have exactly one use**: the sticky nav, `--nav-bg`
(`oklch(0.985 0.004 85 / 0.82)`) with a 12px backdrop blur. Nowhere else.

---

## Motion

Short and eased-out; nothing bounces, nothing overshoots.

- `--dur-fast` 140ms for colour and border changes on controls (`--ease-standard`).
- `--dur-base` 220ms for card lift and underline wipes (`--ease-out`).
- `--dur-slow` 420ms for portrait desaturation and the project drawer.
- `--dur-reveal` 700ms for the scroll reveal.
- Card hover: `translateY(-2px)` + `--shadow-md`. Link hover: underline wipes in from the left.
  Arrow hover: `translateX(3px)`. Press is a colour darkening, **never** a scale-down.
- `prefers-reduced-motion` collapses every transition to ~0, handled in `tokens/base.css`.

---

## Iconography — there is no icon set, by design

The system substitutes typography for icons. **No icon font, no SVG sprite, no emoji** is
shipped or permitted.

| Affordance     | The mark                                                                       |
| -------------- | ------------------------------------------------------------------------------ |
| Direction      | the mono arrow `→` (U+2192) — text, inherits colour, nudges 3px right on hover |
| Steps, bullets | JetBrains Mono ordinals, "01", "02"                                            |
| Status         | a 5px round `<span>` dot inside a `Tag`, coloured by tone                      |
| List marker    | an em dash in mono                                                             |
| Close          | `✕` (U+2715) beside the word "Close"                                           |

If a future surface genuinely needs a glyph set, use Lucide at 1.5px stroke and record the
decision here — the portfolio itself does not.

---

## Imagery

One photograph, the headshot. Cropped into an arch (fully round top, 14px bottom), desaturated
at rest, returning to colour on hover over 420ms. Warm, natural light, no filters beyond the
grayscale. Further imagery, if ever added, follows the same rule.

---

## Both themes ship

`data-theme="dark"` on `<html>`. Only the palette flips: every component reads the semantic
aliases, so **no component changes per theme**. In dark, paper and ink swap roles and clay is
lifted to `oklch(0.720 0.130 45)` so it still reads as an accent rather than a stain.
`--nav-bg` and `--scrim` carry their own alpha and so are defined in both themes.

Contrast corrections are theme-scoped overrides in `global.css` —
`:root:not([data-theme="dark"])` for light, `[data-theme="dark"]` for dark — never a bare
`:root`, which would out-order `colors.css`'s dark block and silently break the dark theme.

---

## Component inventory — 15, nothing speculative

No source defined a component list, so the set was authored from what the portfolio actually
needs. There is no Dialog, Toast, Tooltip, Tabs or Switch; add one only when a surface needs it.

| Group        | Components                                                                                   |
| ------------ | -------------------------------------------------------------------------------------------- |
| `core`       | `Button`, `Tag`, `Card`, `Divider`, `Portrait`                                               |
| `content`    | `SectionHeader`, `ExperienceItem`, `StatBlock`, `SkillGroup`, `ProjectCard`, `ProjectDrawer` |
| `forms`      | `Input`, `Textarea`                                                                          |
| `navigation` | `NavBar`, `TextLink`                                                                         |

`Portrait` is a component because the headshot treatment is a brand element, not a bare `<img>`.
The five content shapes mirror the résumé's own structures, so the site can be rebuilt from data
without re-inventing layout.

**Kit APIs are frozen; kit internals are not.** Props, defaults and behaviour follow the
contracts exactly; where the source repeats itself the port may extract a shared internal helper
with byte-identical rendered output (`src/ui/internal.ts`, deliberately not re-exported). The
kit styles itself inline and is never forked: the lever at a call site is a **custom property**,
never `!important` and never an edit inside `tokens/`.

`/kit` is the live inventory — every component in every variant its props allow, both themes.

---

## Interaction contracts

**Theme.** `src/scripts/theme.ts` owns the storage key, the two chrome tints and `setTheme()`.
An `is:inline` script in `BaseLayout` resolves the theme before first paint —
localStorage → `prefers-color-scheme` → light — and receives those values through
`define:vars`, since an inline script cannot import. It never persists: writing storage on a
first visit would freeze a system preference into a choice the visitor never made. The toggle
island adopts the attribute once React is live and hands every later change to `setTheme()`,
which writes attribute, `<meta name="theme-color">` and storage together.

**Reveal.** `src/scripts/reveal.ts`, a vanilla IntersectionObserver on the
`.reveal` / `.reveal-ready` / `.is-in` contract in `tokens/base.css`. `rootMargin: "-40px"`, a
900ms reveal-everything fallback, and a reduced-motion bail. `.reveal` only hides once `<html>`
carries `.reveal-ready`, so a constructor that throws leaves the page visible rather than blank.
**Content never depends on JS**: every section exists in static HTML.

**In-page navigation is CSS.** `scroll-padding-top: var(--nav-h)` (63px) plus
`scroll-behavior: smooth`, with a `prefers-reduced-motion` override to `auto`. `NavBar` renders
plain anchors, so every in-page link lands correctly with or without JS; the nav island owns
scroll-spy and nothing else.

**Drawer.** A viewport-level layer, so `WorkGrid` portals it to `document.body` — `.reveal`
puts a `transform` on `.section__inner`, which would otherwise become the containing block for
the drawer's fixed scrim. It ships with the accessibility the prototype lacked: Escape, focus
trap and restore, `role="dialog"`, scroll lock. `<html>` carries `scrollbar-gutter: stable` so
the page does not shift behind the scrim.

---

## Site decisions

Where the site deliberately differs from the system as delivered. These were departures while
the skill existed; with it gone they are simply how the site is built.

1. **Both themes ship**, on the system's own `[data-theme="dark"]` mechanism, with an icon-free
   site-owned toggle — the kit defines no `ThemeToggle`.
2. **The project drawer ships as an island**, with the accessibility listed above.
3. **The contact contract is name / email / message** (+ a honeypot); the design's topic select
   is dropped.
4. **Three omitted things are kept**: the scroll-reveal animation, the GitHub links, and **both
   résumés — the full-stack PDF is the primary one** (nav action, hero CTA, footer link), with
   the backend PDF as a single extra footer link. The contact section lists no résumés, per the
   design.

Three `/kit`-only records, decided rather than fixed:

- **Static kit components have no hover state.** The kit computes hover in `useState` and writes
  the result inline, which no stylesheet can override without `!important`. On `/` only the
  three islands react; the hero CTAs, project cards, portrait desaturation and `TextLink`
  underline wipes are inert at rest. Fixing it means the kit reading state through custom
  properties and shipping a `:hover` stylesheet, which forks seven components.
- **`/kit`'s drawer specimen carries `aria-modal="true"` while nothing about it is modal.** The
  specimen renders the panel open and static, and the role group derives from `open`.
  `ProjectDrawerProps` extends no `HTMLAttributes` and spreads no rest props, so the attribute
  cannot be overridden without adding a prop to a component whose whole point is that it needs
  none.
- **`/kit` scrolls 7px sideways at 320px.** Two specimens exceed the 272px content box on their
  own inline values: the hero status `Tag` (300px, `white-space: nowrap`) and `ExperienceItem`'s
  `minmax(150px, 200px)` rail, which reads no `--rail-cols` because a specimen shows the
  component's default rather than the site's call site. `/` is clean at every width; the
  arithmetic is recorded in `kit.astro`.
