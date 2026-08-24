# Phase VC4 — Interactivity

## Goal

The project drawer works: clicking a work card slides in the right-hand detail panel,
accessibly, with every word of the drawer copy already present in the static HTML. The
nav behaviors that shipped inside `SiteNav` in VC3 (scrolled hairline, scroll-spy,
smooth scroll) get their e2e coverage. After this phase the page has all of the
design's behavior.

## Decisions (locked)

- **One island owns the work grid**: `src/sections/WorkGrid.tsx` (`client:visible`)
  replaces the static card grid inside `Work.astro`. It composes the kit `ProjectCard`
  (cards become buttons-in-anchor per the kit: `href="#"` intercepted) and the kit
  `ProjectDrawer`, and owns the `project` open/close state — exactly the kit's
  `PortfolioSite.jsx` wiring, hardened.
- **Drawer copy is static content, not a hydration artifact.** The kit drawer renders
  nothing while closed, so the island also server-renders each project's full detail
  (kicker, title, the three numbered detail lines, tags, meta) in hidden,
  crawlable markup (`<div hidden>` per project, ids like `project-01`). e2e asserts
  the strings exist in the **built HTML**, before any JS runs. This satisfies
  "content never depends on JS" — the drawer is presentation of content that already
  exists.
- **Accessibility hardening beyond the kit** (the kit prototype has none of this):
  panel is `role="dialog"` `aria-modal="true"` labelled by the project title; Escape
  closes; focus moves into the panel on open and **restores to the triggering card**
  on close; focus is trapped while open; body scroll is locked while open; scrim
  click and the "Close ✕" button close. Timings stay the kit's: panel 420ms
  `--dur-slow`/`--ease-out`, scrim 220ms, `--scrim` token; `prefers-reduced-motion`
  collapses both (the token base CSS already clamps transitions).
- **No other new islands.** Scroll-spy/smooth-scroll live in `SiteNav` (VC3); reveal
  stays vanilla. Total hydrated islands: `SiteNav`, `ContactForm`, `WorkGrid`.

## Source

- `ui_kits/portfolio/PortfolioSite.jsx` — drawer state wiring, `Work.jsx` — card
  `onOpen` interception, `ProjectDrawer.jsx` — structure, exit-content retention
  (`shown` state so the panel doesn't blank mid-slide), scrim/panel styles.
- `src/content` `projects[].detail` — the drawer-only copy.

## Tasks

1. **`WorkGrid.tsx`**: port the kit wiring; add the hidden static detail markup; add
   the a11y hardening (Escape listener scoped to open state; a small focus trap —
   hand-rolled, no dependency; `overflow: hidden` on `<body>` while open, restored on
   close/unmount; focus restore via a ref to the triggering card). Keep the kit's
   exit-content retention so the closing panel keeps its text.
2. **`Work.astro`**: swap the static grid for `<WorkGrid client:visible />`, passing
   `projects` from content. The section header stays static in the `.astro`.
3. **Reduced-motion and no-JS checks**: without JS the cards render (as non-triggers)
   and the hidden detail markup exists; with reduced motion the drawer appears/
   disappears without sliding.
4. **e2e additions** (`smoke.spec.ts` or a focused `drawer.spec.ts` if cleaner):
   - built-HTML assertion: a distinctive `detail` string per project exists in the
     response body of `/` (no JS).
   - drawer opens on card click, shows that project's title + detail; closes on
     Escape, on scrim click and on "Close ✕"; focus returns to the card.
   - scroll-spy: after scrolling to `#about`, the About nav link is the active one
     (clay underline — assert via `aria-current` or the computed style hook chosen in
     VC3); the nav hairline appears after scrolling past 8px.
   - form paths on the restyled card: success flips to the moss line; a missing-field
     error renders inline (these existed pre-VC3 — re-add/confirm coverage here if
     VC3's rewrite thinned them).
5. **a11y**: axe scan of `/` with the drawer **open** (light theme is enough for the
   open-state scan) — zero violations; drawer dialog naming verified.

## Verification

- `pnpm check`, `pnpm build`, `pnpm test:e2e` green.
- Manual pass at `localhost:8788`: open/close via mouse, keyboard (Tab to card,
  Enter, Tab within panel, Escape), and with `prefers-reduced-motion: reduce`;
  scroll-lock verified (page behind the scrim doesn't scroll); both themes (scrim and
  panel read from `--scrim`/`--surface-card`).
- JS budget note recorded in the PR: total gzip JS after the third island (phase 7
  re-baselines against this number).

## Gotchas

- `client:visible` means the island may hydrate late — the hidden detail markup is
  what guarantees content exists regardless; never move it inside the
  hydration-dependent render path.
- Astro strips `class` on framework components; any styling hook for the grid wrapper
  belongs on the `.astro`-owned element around the island.
- The focus trap must not fight the theme toggle or nav (both stay usable — trap
  only while the dialog is open, and the dialog is the last-opened layer).
- Body scroll-lock must account for scrollbar width or the page shifts 15px behind
  the scrim (set `scrollbar-gutter` or compensate padding — pick one, comment it).
- Keep the island's server render deterministic: drawer closed, no project selected.

## Definition of Done

Inherited DoD, plus: drawer fully functional and accessible in both themes; detail
copy in static HTML with an e2e assertion proving it; nav behavior covered by e2e;
three islands total; status table updated.

## Out of scope

Narrow-mode drawer sizing (`min(560px, 92vw)` already handles small widths — VC5 only
verifies it). Any nav or form behavior change.
