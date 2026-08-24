# Nicolás Hernández — Portfolio Design System

A personal design system for the portfolio of **Nicolás Hernández**, Senior Backend
Engineer and Feature Architect (Bogotá, Colombia). It is a *personal brand* system,
not a product system: one voice, one site, one résumé.

## Sources

Everything here derives from material the owner supplied:

| Source | Used for |
| --- | --- |
| `assets/resume-2026-nicolas-hernandez.pdf` (Résumé 2026) | All copy: roles, dates, metrics, skills, education. Nothing is invented. |
| `assets/portrait.jpg` (supplied headshot) | The portrait treatment and the `Portrait` component. |
| A dark-theme portfolio screenshot supplied as a *mood* reference | Structure only — hero + stats + work + about + contact. The palette was deliberately inverted to light, per the owner's request; none of the reference's layout, type or colour was copied. |

No codebase, Figma file, or existing brand assets were provided. There is **no logo**:
the name set in type is the mark (see `guidelines/brand-wordmark.card.html`).

---

## Visual foundations

**Position.** Quiet, warm, editorial. A backend engineer's portfolio should read like a
well-set page, not a SaaS landing page. The whole system is a warm off-white sheet with
warm-grey ink, hairline rules, and exactly one accent.

**Colour.** Two families and nothing else.
- *Paper* — `--paper` oklch(.985 .004 85) is the page. `--paper-sunk` is the only alternate
  background (alternating sections, code blocks, the footer). `--paper-raised` (pure white)
  is for cards sitting on paper. `--paper-inverse` exists but is rationed to at most one block
  per page.
- *Ink* — four warm greys, `--ink-1` → `--ink-4`, mapped to heading / body / meta / disabled.
- *Clay* — `--clay` oklch(.62 .145 45), the single accent. It appears on section ordinals,
  the active nav underline, one call-to-action per screen, and hover arrows. If clay appears
  three times in a viewport, remove one.
- *Status* — moss / amber / rust share clay's lightness and chroma with the hue rotated, so a
  status pill never out-shouts the accent.
- Never introduce a new hue. Never use a gradient.

**Type.** Three faces, each with one job.
- **Newsreader** (Light 300, serif) — the name, section statements, stat figures. Always light
  weight, always tight tracking (`-0.022em`). This is the only decorative move in the system.
- **Instrument Sans** — every headline, paragraph, label and control. 400/500/600 only.
- **JetBrains Mono** — ordinals ("01"), uppercase eyebrow labels at 12px / 0.13em tracking,
  metadata, tags, code. Mono is how the system signals *engineer* — not icons, not colour.
- Prose is capped at `--measure-prose` (62ch). Headings use `text-wrap: balance`, body `pretty`.

**Spacing & layout.** 4px base, eleven steps. Content column 1080px, long-form 680px, gutter 32px.
Section rhythm is `--space-10` (128px) top and bottom on desktop, `--space-8` on mobile.
Generous vertical space is load-bearing here — when a section looks empty, the fix is stronger
copy, never a filler card.

**Dark theme.** The system is light-first; a dark palette ships as an override in
`tokens/colors.css` under `[data-theme="dark"]`. Set `data-theme="dark"` on `<html>` and every
component follows, because they all read semantic aliases rather than raw colour tokens. In dark,
paper and ink swap roles and clay is lifted in lightness (`oklch(.72 .13 45)`) so it still reads as
an accent rather than a stain. `ui_kits/portfolio/index-dark.html` is the same site on that palette.
Two colour values need their own alpha and so exist as tokens in both themes: `--nav-bg` (the
translucent sticky nav) and `--scrim` (behind the project drawer).

**Backgrounds.** Flat colour only. No imagery behind text, no patterns, no textures, no gradients.
The single photographic element is the portrait.

**Borders & elevation.** This system separates with **1px hairlines**, not shadows.
`--line-1` for rules between content, `--line-2` for control borders. Shadows exist
(`--shadow-sm/md/lg`) but are near-invisible and appear **only** on hover of interactive cards
and behind the project drawer. A card at rest has a border and no shadow.

**Corner radii.** Containers 14px (`--radius-lg`), inputs 8px, small chips 4px, controls and tags
fully round (`--radius-pill`). Nothing else. Buttons are never square.

**Transparency & blur.** One use: the sticky nav is `oklch(.985 .004 85 / .82)` with a 12px
backdrop blur. Nowhere else.

**Motion.** Short and eased-out; nothing bounces, nothing overshoots.
- 140ms for colour and border changes on controls (`--ease-standard`).
- 220ms for card lift and underline wipes (`--ease-out`).
- 420ms for the portrait desaturation and the project drawer.
- Hover on a card: `translateY(-2px)` + `--shadow-md`. Hover on a link: underline wipes in from
  the left. Hover on an arrow: `translateX(3px)`.
- Press state is a colour darkening, never a scale-down.
- `prefers-reduced-motion` collapses every transition to ~0 (handled in `tokens/base.css`).

**Imagery.** One photograph — the headshot. It is cropped into an arch (fully round top,
14px bottom), desaturated at rest, and returns to colour on hover over 420ms. Warm, natural light,
no filters beyond the grayscale. If further imagery is ever added, it follows the same rule:
warm, uncropped-looking, desaturated by default.

---

## Content fundamentals

**Voice.** First person, past-and-present tense, plain. He writes the way a senior engineer talks
in a design review: what the constraint was, what he built, what it did.

**Rules.**
- **I**, never "we" for personal work and never third person ("Nicolás is a…").
- Sentence case everywhere. The only uppercase is the 12px mono eyebrow labels.
- Every claim carries a number or a named system. "Delivered 200k+ sessions to 85k+ clients", not
  "delivered at scale".
- No adjectives without evidence — banned words: *passionate*, *results-driven*, *world-class*,
  *cutting-edge*, *ninja*, *rockstar*, *seamless*.
- Section titles are short statements that end with a period: "Six years of production backends."
- Project copy is two sentences: the constraint, then the outcome.
- Contractions are fine ("I'll reply within a couple of days"). Exclamation marks are not.
- **No emoji, anywhere.** Not in copy, not in tags, not as icons.
- Numbers use "+" for floors (200k+), en dashes for ranges (4–8, 2019 — 2020).
- Spanish name accents are always preserved: *Nicolás Hernández*.

**Examples.**
- ✅ "I own PostgreSQL modeling for session, reporting and analytics workloads."
- ✅ "Recording, transcription and post-session analysis moved off the request path."
- ❌ "Passionate engineer building world-class scalable solutions 🚀"

---

## Iconography

**There is no icon set, by design.** The system deliberately substitutes typography for icons:

- Directional affordance is the mono arrow character `→` (U+2192) on buttons, links and project
  cards. It is text, inherits colour, and nudges 3px right on hover.
- Ordinals ("01", "02") in JetBrains Mono replace bullet and step icons.
- Status is a 5px round `<span>` dot inside a `Tag`, coloured by tone — not a glyph.
- List markers are an em dash in mono, not a bullet or a check icon.
- Close affordance is `✕` (U+2715) beside the word "Close".

No icon font, no SVG sprite, and no emoji are shipped or permitted. If a future surface genuinely
needs a glyph set (a dashboard, say), use **Lucide** at 1.5px stroke from CDN and record the
decision here — but the portfolio itself should not need one.

---

## Index

| Path | What it holds |
| --- | --- |
| `styles.css` | The entry point. Imports every token file. Link this one file. |
| `tokens/fonts.css` | Google Fonts import for Newsreader, Instrument Sans, JetBrains Mono. |
| `tokens/colors.css` | Paper, ink, clay, status, lines + semantic aliases. |
| `tokens/typography.css` | Families, size scale, tracking, weights, `--type-*` role shorthands. |
| `tokens/spacing.css` | 4px scale + layout widths. |
| `tokens/shape.css` | Radii, border widths, shadows. |
| `tokens/motion.css` | Durations, easings, the shared control transition. |
| `tokens/base.css` | Resets, body defaults, link and focus styling, reduced-motion. |
| `assets/` | `portrait.jpg`, `resume-2026-nicolas-hernandez.pdf`. |
| `guidelines/*.card.html` | 18 foundation specimen cards (Colors, Type, Spacing, Shape, Motion, Brand). |
| `components/core/` | Button, Tag, Card, Divider, Portrait. |
| `components/content/` | SectionHeader, ExperienceItem, StatBlock, SkillGroup, ProjectCard. |
| `components/forms/` | Input, Textarea. |
| `components/navigation/` | NavBar, TextLink. |
| `ui_kits/portfolio/` | The full single-page portfolio site (see its own README). |
| `SKILL.md` | Agent Skills wrapper so this folder works inside Claude Code. |

### Component inventory

No source defined a component list (no codebase, no Figma), so the set was authored from what the
portfolio actually needs — 14 components, nothing speculative. There is no Dialog, Toast, Tooltip,
Tabs or Switch, because the site has no use for them; add them only when a surface needs one.

**Intentional additions** (beyond a generic starter set):
- `Portrait` — the headshot treatment is a brand element, so it is a component, not a bare `<img>`.
- `SectionHeader`, `ExperienceItem`, `SkillGroup`, `StatBlock`, `ProjectCard` — the résumé's own
  content shapes, so the site can be rebuilt from data without re-inventing layout.

---

## Using it

```html
<link rel="stylesheet" href="styles.css">
```

Then compose from the components; reference colour, type, spacing and motion **only** through the
CSS custom properties. If a value you need isn't a token, that's a signal the design is drifting —
add a token or reuse an existing one rather than hard-coding a hex.
