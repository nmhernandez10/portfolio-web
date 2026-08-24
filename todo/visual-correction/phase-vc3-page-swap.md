# Phase VC3 — Page swap

## Goal

`/` is the new design: five blocks (hero + stats, 01 Work, 02 Experience, 03 About,
04 Contact) composed from the new kit and the new content model, in both themes, with
the old kit, old tokens, old content model, icons and Space Grotesk fully deleted. One
PR, because the takeover is atomic.

## Decisions (locked)

- **Promotions are `git mv`, deletions come first**: delete old `src/ui/*`, then
  `git mv src/kit src/ui`; delete old `src/content/{types,profile,sections}.ts` +
  `index.ts`, then `git mv src/content/next/* src/content/`; delete old
  `src/styles/tokens`, then `git mv src/styles/redesign/tokens src/styles/tokens`
  and fold `redesign/index.css` into the rewritten `global.css`. Update
  `.prettierignore` back to `src/styles/tokens`. Delete `KitLayout.astro`; `/kit`
  returns to `BaseLayout`.
- **The header is one island.** `src/sections/SiteNav.tsx` (`client:load`) renders the
  kit `NavBar` with `brand`, the four nav items, `active` state, and `action` = the
  `SiteThemeToggle` control (plain React inside this island — an island cannot hydrate
  inside another) + a `Button size="sm" variant="secondary"` Résumé anchor
  (full-stack PDF). Scroll-spy and smooth scroll are ported from `PortfolioSite.jsx`
  (probe `scrollY + 140`; scroll to `offsetTop − 60`; brand → top), respecting
  `prefers-reduced-motion` (jump, don't smooth). NavBar server-renders real `#work`…
  anchors, so navigation works before/without JS. `sections.css` styles **no** nav
  visuals — NavBar owns sticky/blur/scrolled-hairline itself.
- **Sections render data.** Every `.astro` file reads `src/content` — no prose in
  markup. Kit components are static React (server-rendered, zero hydration) except the
  two islands (`SiteNav`, `ContactForm`; `WorkGrid` arrives in VC4).
- **Reveal survives** as the one site-level motion: its CSS contract
  (`.reveal`/`.reveal-ready`/`.is-in` + reduced-motion + print) moves into
  `global.css` (the new `tokens/base.css` doesn't define it and stays verbatim),
  retimed to `--dur-reveal` (700ms) and `--ease-out`. `reveal.ts` logic is unchanged.
- **Surface alternation is law**: hero + work on `--paper` (page background),
  experience + contact + footer on `--surface-sunk`, about on `--paper`. No third
  background.
- **e2e ships in the same PR**, including the temporary narrowing of the responsive
  guard (see task 8) — production is still the unlaunched `*.pages.dev`, which is the
  only reason this is acceptable.

## Source

- `ui_kits/portfolio/PortfolioSite.jsx` + section JSX — exact structure, grids and
  spacing (digest below); `portfolio-reference.png` / `portfolio-dark-reference.png`
  for the visual pass.
- `src/content/` (post-promotion) for every string.

### Layout digest (from the kit JSX — the numbers `sections.css` implements)

| Block      | Container                       | Grid / notes                                                                                                                            |
| ---------- | ------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| all        | inner `max-width: 1080px` auto  | side padding `--gutter` (32px); section vertical `--space-9` (96px), hero `--space-9` top `--space-8` bottom, contact likewise          |
| hero       | `#top`, `--paper`               | `minmax(0,1fr) auto`, gap `--space-8`, `align-items: end`; copy column gap `--space-5`; CTA row gap `--space-3`; Portrait size 240 arch |
| stats      | inside hero                     | `repeat(4, 1fr)`, gap `--space-6`, `margin-top: --space-9`, `padding-top: --space-6`, hairline top                                      |
| work       | `#work`, `--paper`              | `repeat(2, minmax(0,1fr))`, gap `--space-4`; SectionHeader index `01`                                                                   |
| experience | `#experience`, `--surface-sunk` | plain stack; each `ExperienceItem` is its own `minmax(150px,200px) 1fr` grid with hairline top                                          |
| about      | `#about`, `--paper`             | `minmax(0,0.85fr) minmax(0,1.15fr)`, gap `--space-8`; SectionHeader margin override `--space-5`; Divider label "Education"              |
| contact    | `#contact`, `--surface-sunk`    | `minmax(0,1fr) minmax(0,1fr)`, gap `--space-8`; left details stack, right form `Card`                                                   |
| footer     | `--surface-sunk`, hairline top  | inner 1080px flex space-between wrap, gap `--space-5`, padding `--space-6 --gutter`                                                     |

## Tasks

1. [x] **The swap** (Decisions bullet 1), then fix every import site until `pnpm check` is
       clean. `BaseLayout.astro`: fontsource imports become newsreader + instrument-sans +
       jetbrains-mono (remove space-grotesk and `pnpm remove` it), `global.css` is now the
       new system; the theme script stays; `theme-color` metas move to the new surfaces
       (compute srgb hex equivalents of `--paper` light `oklch(0.985 0.004 85)` and dark
       `oklch(0.205 0.008 70)`; note them in a comment); title/description rebuilt from the
       new `profile` (name, role) in the design voice.
2. [x] **`global.css` rewrite**: token imports in the skill's order → `sections.css` →
       site utilities kept (`.skip-link` restyled to the new tokens, `.visually-hidden`,
       `main` focus suppression) → the `--font-*` family overrides → the reveal contract →
       theme-scoped contrast overrides carried over from VC2. Delete every old-brand rule.
3. [x] **`sections.css` rewrite** to the digest above — one class block per block, hooks
       only on section-owned elements (the kit still takes no `className`). No nav rules.
4. [x] **Sections**: rewrite `Hero.astro` (status Tags, clamped serif `<h1>`, role ≤20ch,
       lead, CTAs — accent "Get in touch" → `#contact`, secondary "Résumé, PDF" →
       full-stack PDF —, `Portrait` fed by a `getImage()`-processed URL from
       `src/assets/portrait.jpg`, stats row of `StatBlock`s), `Work.astro` (SectionHeader +
       static `ProjectCard` grid; cards carry no meaningful `href` yet — VC4 makes them
       drawer triggers), `Experience.astro` (SectionHeader + `ExperienceItem` stack),
       `About.astro` (prose from content, `Divider`, education list, `SkillGroup` column),
       `Contact.astro` (details column with `TextLink`s — email, LinkedIn + GitHub under
       "Elsewhere", "Based in" line — and `<ContactForm client:visible />`),
       `Footer.astro` (© line + TextLinks: Email · GitHub · LinkedIn · Résumé ·
       Backend résumé). Delete `Stats.astro`, `SkillSection.astro`, `AICard.astro`,
       `Header.astro`, `SiteNav.astro`, `NavLinks.astro`, `Wordmark.astro`,
       `Section.astro` if nothing uses it (the new sections are few and each owns its
       header — re-derive a shared `Section.astro` only if it removes real repetition).
5. [x] **`SiteNav.tsx` island** per Decisions; `index.astro` slots it as the header,
       sections in order, `Footer` in the footer slot.
6. [x] **`ContactForm.tsx` restyle**: kit `Card` as the container, kit `Input` ×2 +
       `Textarea`, `Button variant="accent" type="submit" trailing="→"`, moss success
       line, form-level error line for transport failures. Wire behavior byte-compatible
       with VC1 (JSON POST, 303 fallback, honeypot, `?sent=1` adoption).
7. [ ] **Teardown checks**: `public/icons/` deleted; no file imports `Icon`; grep sweep
       for `--gold`, `#A6762A`, `#E3B23C`, `space-grotesk`, `/icons/`, `data-lens`,
       `content/next` → all empty (source and `dist/`).
8. [x] **e2e rewrite** (same PR): section loop follows the new manifest (work /
       experience / about / contact + `#top`); static-content asserts per section from
       `src/content`; résumé test = both PDFs fetch 200 **and** the header action + hero
       CTA + footer "Résumé" point at `/resume-fullstack.pdf`, footer "Backend résumé" at
       `/resume-backend.pdf`; theme-toggle test targets the new control by accessible
       name; drop the gold canary and rewire the `/` exemptions to the VC2 contrast
       decisions; dark scans stay (new palette); **shrink the viewport sweep to ≥1280 and
       remove the mobile-menu tests, each with a `TODO(VC5): restore` marker** — VC5's DoD
       restores them.

## Deviations from this doc (and why)

1. **The page layer got two primitives, not one `Section.astro` question.** Task 4 asks
   whether a shared `Section.astro` removes real repetition, and the gotcha predicts
   "work/experience/about/contact all open with `SectionHeader`". They do — but not in
   the same place: Work and Experience open theirs at the top of the container, About and
   Contact nest theirs inside the left grid column with the `--space-5` margin override.
   A header-owning shell therefore fits half the call sites. Split instead:
   `Section.astro` owns the shell (anchor, surface, the 1080px column, the `.reveal`
   hook, five call sites) and `SectionIntro.astro` owns `sectionMeta → SectionHeader`
   (four call sites, `compact` for the two nested ones). `Section` renders the intro
   itself when passed `intro`, so Work and Experience never repeat their own id.

2. **In-page scrolling is CSS, not the ported JS.** Decisions bullet 2 ports
   `PortfolioSite.jsx`'s `scrollTo(offsetTop − 60)` into the island. But the hero CTA,
   the footer links and every pre-hydration or no-JS click land _under_ the sticky bar
   unless `<html>` carries a `scroll-padding-top`, so that rule is required regardless —
   and once it exists the JS is redundant. `global.css` sets
   `scroll-padding-top: var(--nav-h)` and `scroll-behavior: smooth`, with a
   `prefers-reduced-motion` override to `auto`; `SiteNav` passes no `onNavigate`, so
   `NavBar` renders plain anchors that navigate natively. One mechanism, correct offset
   for every in-page link with or without JS, and the URL hash follows the section.
   Measured: a nav click, the brand link and the hero CTA all land the target section at
   exactly 63px.

3. **`--nav-h` is 63px, and `--section-y` is retargeted.** The kit's `− 60` is 3px short
   of the bar it clears: `NavBar` is `--space-4` padding twice (32) + a 30px sm-control
   row + a 1px `border-bottom` that is painted transparent when unscrolled but still
   occupies a pixel. Separately, `tokens/spacing.css` defines `--section-y` as
   `--space-10` (128px) while every section of the composed page is `--space-9` (96px);
   `global.css` retargets the token rather than hardcoding 96px in `sections.css`, so
   VC5's `--section-y-mobile` swap keeps the lever its own doc promises.

4. **`SkillGroup` renders an `h3`.** The gotcha's two options were "drop the component to
   `h3`" or "give the skills column its own heading". Dropped to `h3`: it renders
   identically (the font is inline), leaves the props untouched, seats a skills category
   beside `ExperienceItem`'s and `ProjectCard`'s own `h3`s, and keeps `/kit` legal
   because its specimens sit at `h3` and h3 → h3 is not a skip. The alternative invents a
   heading the design does not show. `Specimen.astro`'s comment, which reasoned from the
   `h4`, was corrected. This retires VC2's "Known residue" bullet.

5. **The résumé buttons carry no `target="_blank"`.** The design's JSX sets it, but
   `ButtonProps extends React.HTMLAttributes<HTMLElement>`, which has no `target` —
   that lives in `AnchorHTMLAttributes` — and the kit's API is frozen. Both the old
   header's résumé button and VC2's `/kit` NavBar specimen already open in place, so
   this matches the repo rather than widening a frozen contract. Same root cause as the
   contact form's container: `<Card as="form">` typechecks, but `action` and `method` do
   not, so the `<form>` sits inside the `Card` rather than replacing it.

6. **One content key added**: `COPY.nav.resume` ("Résumé"). The header action's label had
   no home — `COPY.hero.cta.resume` is "Résumé, PDF" and `COPY.footer.links.resume`
   belongs to the footer — and copy keeps a single source.

7. **Islands import only import-free content leaves.** `SiteNav` and `ContactForm` import
   `@/content/sections` and `@/content/contact`, never the `@/content` barrel or
   `profile`; `brand` and `resumeHref` arrive as props from `index.astro`. This is what
   `src/content/index.ts` already promised structurally, and task 8 now proves it: a
   smoke test walks the page's transitive `/_astro/*.js` module graph and asserts a
   profile-only canary appears in none of it. Negative-controlled — pointing `SiteNav` at
   the barrel makes it fail.

8. **e2e: the résumé locators are scoped.** `getByRole`'s `name` is substring-matched and
   case-insensitive, so a bare `{ name: "Résumé" }` matches four links (header action,
   hero "Résumé, PDF", and the footer's two). Each is scoped to its container with
   `exact: true`, or Playwright reports an ambiguity instead of a readable failure.

## Known residue

- **Static kit components have no hover state.** The kit computes hover in `useState` and
  writes the result inline, which no stylesheet can override without `!important`. Only
  `SiteNav` and `ContactForm` hydrate, so the hero CTAs, project cards, portrait
  desaturation and the `TextLink` underline wipes are inert on `/`. This predates VC3 —
  the old `src/ui` used the identical pattern and the old `/` hydrated only the toggle
  and the form — so the swap ships parity, not a regression, and the reference PNGs are a
  rest-state comparison. Fixing it means the kit reading state through custom properties
  and shipping a `:hover` stylesheet, contradicting `AGENTS.md`'s "the UI kit styles
  itself inline and is never forked" across seven components. **Raised for VC5**, beside
  the contrast and motion passes.
- **Project cards render the kit's default `href="#"`** until VC4 makes them drawer
  triggers: four focusable elements that jump to the top of the document.
- `COPY.contact.locationLine` still mirrors `profile.location` (VC1 deviation 4). About
  and Contact are section files now, so deriving it is finally possible — VC4 or VC5.

## Open — blocks this phase's Definition of Done

**Task 7's gold sweep is not empty, and two phase docs disagree about who fixes it.**
`public/favicon.svg` is the old brand's mark — "the gold period from the wordmark" — and
carries `#E3B23C`; it ships to `dist/favicon.svg`. Everything else in task 7 passes
(`public/icons/` gone, no `Icon`, and `--gold` / `#A6762A` / `space-grotesk` / `/icons/`
/ `data-lens` / `content/next` all empty across `src/`, `e2e/`, `functions/` and
`dist/`).

The conflict: task 7 here requires the gold hexes gone now, while
`phase-vc5-responsive-and-quality.md` task 5 owns the redraw ("redraw
`public/favicon.svg` for the new brand … a serif \"N\" is acceptable, record the
choice") **and** re-runs the same gold sweep, which only makes sense if gold is expected
to survive until VC5.

Not resolved here, because the two available fixes are both decisions rather than
mechanics: recolouring the dot to clay asserts a mark whose stated rationale (the
wordmark's period) no longer exists, and redrawing it is explicitly VC5's recorded
choice. Needs a call: pull the favicon into VC3, or amend task 7 to exempt it and leave
it to VC5.

## Verification

- `pnpm check`, `pnpm build`, `pnpm test:e2e` green; `pnpm format` run.
- Visual pass at `localhost:8788` against **both** reference PNGs, light and dark:
  block order, alternating surfaces, serif display faces, clay appearing at most
  twice per viewport, arch portrait desaturated at rest.
- No-JS pass (disable JS): all five blocks and every string render; nav anchors work;
  the form submits via the 303 fallback.
- `grep -r "fonts.googleapis" dist/` empty; teardown greps from task 7 empty.
- Lighthouse quick pass (local): no console errors, CLS sanity with the new fonts.

## Gotchas

- **Order between `sections.css` and `global.css` blocks is load-bearing** where
  specificities tie — keep the import order fixed and comment it.
- The kit deletes `class` on framework components (Astro) — hooks go on section-owned
  wrappers, token overrides are the only lever into kit inline styles.
- `astro:assets` is unavailable to React: the portrait must be processed in
  `Hero.astro` frontmatter (`getImage()`) and passed to `Portrait` as a URL string.
  `sharp` stays a direct dependency.
- The `SiteNav` island must render identical HTML server- and client-side on first
  paint (initial `active` state constant, scrolled=false) or hydration warns.
- Preview URL checks: `wrangler pages dev` still resolves `functions/` — the endpoint
  is untouched here, but run one form submit anyway.
- **`SkillGroup` renders an `h4`** (VC2 residue). About opens with a `SectionHeader`
  `h2`, so stacking SkillGroups straight under it skips a heading level and fails
  axe's `heading-order`. `/kit` avoids it by sitting each specimen at `h3`; here,
  either drop the component to `h3` or give the skills column its own heading.
- The old `Section.astro`/`sectionMeta` numbering pattern is a good abstraction —
  re-derive it for the new manifest only if ≥3 sections share the exact header shape
  (they do: work/experience/about/contact all open with `SectionHeader`); don't force
  hero/footer into it.

## Definition of Done

Inherited DoD, plus: `/` matches both reference PNGs at 1280; old kit/tokens/content/
icons/Space Grotesk gone; e2e rewritten with the two `TODO(VC5)` markers in place;
`/kit` on `BaseLayout`; status table updated.

## Out of scope

Drawer behavior and card click targets (VC4). Narrow-mode layout and the mobile menu
(VC5). Contrast finalization beyond carrying VC2's decisions (VC5).
