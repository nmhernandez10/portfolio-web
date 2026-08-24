# Phase VC5 — Responsive and quality

## Goal

The desktop-only pre-design becomes a responsive site within the system's laws; the
narrowed e2e guard from VC3 is fully restored; contrast is finalized in both themes;
the favicon and remaining brand leftovers are corrected. After this phase the rebrand
is complete and phase 7 (launch) can run.

## Decisions (locked)

- **The kit defines desktop only (1280 viewport, zero media queries), so narrow mode
  is designed here, not copied.** The system provides the levers: `--section-y-mobile`
  (64px) and `--gutter-mobile` (24px) exist in `spacing.css` unused by the kit — they
  become the narrow-mode rhythm. Fold specs (task 1) follow the system's own rules:
  hairlines keep separating, vertical space stays generous, nothing gains a new hue or
  shadow.
- **The mobile menu lives inside `SiteNav`** — one owner for all nav rendering. It is
  a `<details>` disclosure rendered by the island (platform toggle, so it opens
  without JS; React enhances close-on-navigate), replacing the inline nav links below
  the narrow breakpoint. Affordances are typographic: the word "Menu", `✕` beside
  "Close" when open. No icon files return.
- **The narrow breakpoint is re-measured, not inherited.** The old 960px boundary was
  derived from the old header's 915px content; the new header (serif-less brand at
  15px, four 12px mono links, toggle + Résumé pill) measures differently with the new
  faces. Measure the real header at the fonts' loaded widths, pick the boundary with
  headroom, and document the arithmetic in `sections.css` (or the island) the way the
  old file did. One narrow boundary; a second, smaller step only for type/gutter
  scaling if measurement demands it.
- **Token files stay byte-verbatim.** Responsive and contrast adjustments are
  token _overrides_ in `global.css` (media queries redefining `--size-display-xl`,
  `--section-y`, `--gutter` …), mirroring the old `--type-hero-size` pattern — never
  edits in `tokens/`.
- **Contrast decisions finalize here, in both themes**, extending VC2's `/kit` work to
  the real page: scoped overrides preferred, axe exemptions only where a design law
  fixes the value, every choice carrying its measured ratio in a comment. Light-scope
  is `:root:not([data-theme="dark"])`, dark-scope `[data-theme="dark"]` — a bare
  `:root` override silently breaks the dark theme.

## Source

- `tokens/spacing.css` (`--section-y-mobile`, `--gutter-mobile`), `readme.md` spacing
  law ("section rhythm … `--space-8` on mobile").
- Both reference PNGs for what must survive folding (hierarchy, alternation,
  ordinals).

## Tasks

1. **Narrow-mode folds** in `sections.css` under the measured breakpoint (plus the
   small-step block if used, in descending order, below the imports — order is
   load-bearing at equal specificity):
   - hero: single column; portrait placement decided visually against the brand (lead
     with the text block; portrait sized down, e.g. 180) — record the choice; stats
     `repeat(2, minmax(0,1fr))`, then single column at the small step if cramped.
   - work: single-column cards.
   - experience: `ExperienceItem`'s internal grid is kit-inline — the fold lever is a
     wrapper hook + token override if needed, or accept the two-column rail down to
     the boundary where `minmax(150px,200px)` still fits; measure before adding
     mechanism.
   - about + contact: single column (form after the details).
   - section rhythm: `--section-y` → `--section-y-mobile`, `--gutter` →
     `--gutter-mobile` via `:root` overrides in the media query; hero display size
     already clamps (`clamp(3rem, 7vw, 5.5rem)`) — verify, add a floor override only
     if 320px breaks.
2. **Mobile nav** in `SiteNav` per Decisions: `<details>` with mono "Menu" summary,
   panel listing the four links + Résumé; theme toggle stays visible in the bar;
   ≥24px touch targets; the desktop link row and the disclosure never both in the
   accessibility tree (CSS `display:none` per side of the boundary).
3. **Restore the e2e guard** — delete both `TODO(VC5)` markers: full viewport sweep
   (down to 320px, no horizontal scroll, no clipped header) and mobile-menu tests
   (opens, navigates, closes, résumé link present) rewritten for the new disclosure.
4. **Contrast audit, both themes, whole page**: axe on `/` light + dark + `/kit`
   light + dark stays zero-violation; sweep the small-text uses (clay ordinals, meta
   labels, moss tag, `--ink-4` notes, form hints, footer links) and finalize
   overrides/exemptions per the Decisions rule. Update the exemption list and its
   comment block in `e2e/a11y.spec.ts` to name exactly the surviving design-law
   nodes.
5. **Brand leftovers**: redraw `public/favicon.svg` for the new brand (typographic
   mark on `--paper`/ink per the wordmark card — no logo exists, the name in type is
   the mark; a serif "N" is acceptable, record the choice); verify `theme-color`
   metas against final surfaces; final sweep greps (gold hexes, `space-grotesk`,
   `/icons/`, `Inter`) across `src/`, `public/`, `dist/`.
6. **Docs sync**: `AGENTS.md` breakpoint paragraph rewritten with the new measured
   numbers and levers; project map matches reality (14 components, three islands, no
   icons dir); `todo/visual-correction/README.md` status table completed.

## Verification

- `pnpm check`, `pnpm build`, `pnpm test:e2e` green — with the full restored suite.
- Manual passes at 320 / 375 / 768 / boundary±1 / 1280 / 1440, both themes: no
  horizontal scroll, menu usable, drawer usable at `92vw`, form usable, reveal not
  hiding content.
- `prefers-reduced-motion` pass: page fully readable, drawer and menu instant.
- Axe: 4 scans (two pages × two themes) zero violations.

## Gotchas

- Media queries group against base class hooks; where the kit sets a property inline,
  a token override is the only lever — never `!important`.
- The `<details>` disclosure inside a React island: let React render it but let the
  platform own the open state (no `open` prop fights); close-on-navigate enhances via
  a click listener, mirroring the old `SiteNav.astro` script.
- Restoring the sweep will surface real overflow bugs (long mono strings in skill
  slash-runs, the 20ch role line at 320px) — fix content-side or with `min-width: 0`
  hooks, not by shrinking the sweep again.
- The drawer's `min(560px, 92vw)` and the scrim must be re-verified with scroll-lock
  active and with mobile keyboards up (a focused Textarea under the drawer
  breakpoint).

## Definition of Done

Inherited DoD, plus: full e2e guard restored (no `TODO(VC5)` remains anywhere);
zero-violation axe in all four scans; breakpoints documented with arithmetic; favicon
on-brand; status table fully Implemented; phase 7 unblocked.

## Out of scope

Launch tasks (SEO, OG image, security headers, Lighthouse budgets, domain — phase 7).
New behaviors or sections. Editing token files.
