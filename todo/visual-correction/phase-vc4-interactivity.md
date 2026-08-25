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

1. [x] **`WorkGrid.tsx`**: port the kit wiring; add the hidden static detail markup; add
       the a11y hardening (Escape listener scoped to open state; a small focus trap —
       hand-rolled, no dependency; `overflow: hidden` on `<body>` while open, restored on
       close/unmount; focus restore via a ref to the triggering card). Keep the kit's
       exit-content retention so the closing panel keeps its text.
2. [x] **`Work.astro`**: swap the static grid for `<WorkGrid client:visible />`, passing
       `projects` from content. The section header stays static in the `.astro`.
3. [x] **Reduced-motion and no-JS checks**: without JS the cards render (as non-triggers)
       and the hidden detail markup exists; with reduced motion the drawer appears/
       disappears without sliding.
4. [x] **e2e additions** (`smoke.spec.ts` or a focused `drawer.spec.ts` if cleaner):
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
5. [x] **a11y**: axe scan of `/` with the drawer **open** (light theme is enough for the
       open-state scan) — zero violations; drawer dialog naming verified.

## Deviations from this doc (and why)

1. **The modal behaviour lives in `ProjectDrawer`, not `WorkGrid`** (task 1). The panel
   element is inside the component and reachable from nowhere else — `ProjectDrawerProps`
   has no rest spread and no `ref`. Doing it from the island would have meant a new
   `panelRef` prop **plus** the same ARIA edit, so the kit is touched either way, with more
   plumbing. This is also the one component the skill ships without a `.d.ts`, so the
   contract is already the repo's, and `/kit`'s specimen law had promised exactly this
   ("VC4 gives **it** Escape, a focus trap and a scroll lock"). `WorkGrid` keeps the state,
   the cards, the static copy and the layer.

2. **The panel is a `<div>`, not an `<aside>`, and only a dialog while it is open.** Two
   corrections the axe scans forced, both of them right on their own terms:
   `role="dialog"` is not an allowed role for `<aside>` (axe `aria-allowed-role`, which
   failed all four existing `/` and `/kit` scans), and a modal panel is not a complementary
   landmark. And because the kit keeps the panel mounted so it can slide, an always-on
   `role="dialog"` is a **nameless** dialog on page load — before the first open there is no
   `<h2>` for `aria-labelledby` to point at. The role, `aria-modal` and `aria-labelledby`
   are therefore applied as a group derived from `open`. The rendered box is unchanged.
   The known cost is on `/kit`, whose specimen renders the panel open and static: it
   carries `aria-modal="true"` while nothing about it is modal, so AT that honours the
   attribute may confine its virtual cursor to the specimen. Removing it there would mean
   a new prop on a component whose whole point this phase is that it needs none — left as
   a recorded gap for phase 7, which owns `/kit`'s parity pass.

3. **The background is not inerted.** `aria-modal="true"` is the signal, with the Tab trap,
   the scrim and the scroll lock covering keyboard and pointer. Inerting the rest of the
   page would mean a kit component walking `document.body.children` and restoring their
   prior state — a containment violation that would fight any future layer. The known cost:
   AT that ignores `aria-modal` can still reach the page behind the scrim.

4. **The focus trap walks an index rather than guarding the two edges.** The panel container
   is focused on open and is deliberately not in the focusables list, so an edge guard lets
   Shift+Tab out of it fall through to the last tabbable _before_ the portal — the footer,
   behind the scrim. `indexOf() === -1` walks to either end instead, which also recovers if
   focus is lost entirely.

5. **`aria-current="true"` on `NavBar`'s active link** (task 4). The doc offers
   "`aria-current` or the computed style hook chosen in VC3"; VC3 chose neither, so the
   active state was colour alone — nothing for assistive tech and nothing stable to assert.
   Derived from the existing `active` prop, so no prop is added.

6. **The hidden static markup carries the `detail` lines only** — one `<ol hidden
id="project-01">` per project, not the full kicker/title/tags/meta block the Decisions
   section describes. The card already ships all of those in static HTML, so this puts every
   word of drawer copy in the page with nothing duplicated, and adds no hidden heading to
   skew `smoke.spec.ts`'s h3 census.

7. **The drawer is portaled to `document.body`.** Its scrim and panel are `position: fixed`,
   and `Section.astro` puts `.reveal` on `.section__inner`, which carries a
   `transform: translateY(14px)` until the block has revealed — a containing block, so a
   click during the 700ms reveal would pin a 560px panel inside the 1080px column. The
   portal lives at the call site, not in the component, which is what keeps `/kit`'s framed
   specimen working (verified: the panel still measures inside `.drawer-frame`).
   `react-dom/server` cannot render portals, hence the island's `hydrated` flag.

8. **Cards link to their detail block, not `#`.** `href="#project-01"` instead of the kit's
   `href="#"`, so the intercepted click has a meaningful target and a no-JS click stops
   jumping to the top of the document — VC3's recorded residue.

9. **`scrollbar-gutter: stable` on `<html>`** is the gotcha's "pick one", and it is a
   site-wide rule for a drawer-scoped problem. Cheap, though: every page here already
   scrolls, so the gutter is occupied at rest either way. Measured at 1280 — the `<html>`
   box is 1265px both before and after opening, and the page does not shift.

10. **e2e gained a third file, `e2e/support.ts`** — not a spec, one helper. `WorkGrid` is
    `client:visible`, and a click landing before hydration follows the card's `href` to
    hidden markup and opens nothing; `openDrawer()` waits on `aria-haspopup`, which the
    island sets only once it is live. Both specs open the drawer and neither should be able
    to forget the barrier. `AGENTS.md` records it.

11. **The two form tests are new, not restored.** Task 4 says success/error UI coverage
    "existed pre-VC3"; git shows contact has only ever been covered at the HTTP layer, and
    VC3 removed nothing. They also had to stay two separate tests: once the form adopts the
    sent flag its submit button is disabled, so one page cannot show both outcomes.

12. **The static-copy assertion reads the DOM with JS disabled, not the response body.**
    Astro serializes the island's props into `<astro-island props="…">`, so every detail
    line is in the raw HTML even with the `<ol hidden>` blocks deleted — a body match would
    have proven nothing. A `javaScriptEnabled: false` context checks the markup itself and
    the no-JS claim in one pass.

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

**Met.** `pnpm check`, `pnpm build` and `pnpm test:e2e` (22 tests) are green; the drawer
opens, traps focus, restores it, locks scroll and closes three ways in both themes with
zero axe violations; the twelve detail lines are in the static page with JS off; scroll-spy
and the scrolled hairline are covered; `SiteNav`, `ContactForm` and `WorkGrid` are the three
islands. JS budget after the third island: **68.1 kB gzipped** across `dist/_astro/*.js`,
of which `WorkGrid` itself is 589 B — phase 7 re-baselines against this number.

## Out of scope

Narrow-mode drawer sizing (`min(560px, 92vw)` already handles small widths — VC5 only
verifies it). Any nav or form behavior change.
