# todo/visual-correction/ — rebrand to the replaced design skill

The design skill at `.claude/skills/nicolas-mateo-design/` was **replaced wholesale** on
2026-08-24: the old `design-system/` + `prototype/` layout (gold accent, Space Grotesk,
20 components, 44 masked SVG icons, a 10-section page) is gone, and the new layout
(`tokens/`, `components/`, `guidelines/`, `ui_kits/portfolio/`) describes a different
brand — warm paper/ink in oklch with a single **clay** accent, Newsreader serif +
Instrument Sans + JetBrains Mono, **no icons at all**, 14 components, a light + dark
palette behind `[data-theme="dark"]`, and a composed 5-block page with a sticky
scroll-spy nav and a project drawer. Phases 0–6.2 were built against the old skill, so
the shipped site no longer matches the design source of truth.

These phases correct that. They follow every rule in `../README.md` (one phase = one
focused session = one PR `dev` → `main` with a merge commit; the inherited Definition of
Done applies; CI — format, `pnpm check`, build **and the Playwright suite** — must be
green on every PR). Phase 7 (launch) runs after VC5 and has already been amended for the
rebrand.

## Status

| Phase | Title                                                         | PR  | Status      | Preview URL     |
| ----- | ------------------------------------------------------------- | --- | ----------- | --------------- |
| VC0   | [Skill swap and docs](phase-vc0-skill-swap-and-docs.md)       | —   | Implemented | n/a — docs only |
| VC1   | [Content and contract](phase-vc1-content-and-contract.md)     | —   | Implemented | —               |
| VC2   | [Kit](phase-vc2-kit.md)                                       | —   | Not started | —               |
| VC3   | [Page swap](phase-vc3-page-swap.md)                           | —   | Not started | —               |
| VC4   | [Interactivity](phase-vc4-interactivity.md)                   | —   | Not started | —               |
| VC5   | [Responsive and quality](phase-vc5-responsive-and-quality.md) | —   | Not started | —               |

Dependencies are strictly linear: VC0 → VC1 → VC2 → VC3 → VC4 → VC5 → phase 7.

## Locked decisions (agreed with the user 2026-08-24 — do not re-litigate)

1. **Dark theme stays.** The new skill defines it as a `[data-theme="dark"]` override in
   `tokens/colors.css` — the exact mechanism the site already uses. The pre-paint theme
   script, the `localStorage["theme"]` key and the `SiteThemeToggle` island all survive;
   the toggle is re-implemented icon-free (the new kit has no ThemeToggle component and
   no icons — it becomes a site-owned pill control with a mono text label). Accessibility
   scans keep covering light **and** dark, on the new palette.
2. **The project drawer ships, as an island.** One `WorkGrid` island (`client:visible`)
   owns the project cards and the `ProjectDrawer`, so each project's `detail[]` copy
   server-renders into static HTML. The island adds the accessibility the kit prototype
   lacks: Escape to close, focus trap and restore, `role="dialog"`/`aria-modal`, body
   scroll lock.
3. **The contact topic select is dropped.** The contract shrinks to name / email /
   message (+ honeypot), matching the design's three-field form. The change is atomic —
   `src/content/contact.ts`, `functions/api/contact.ts`, the form and the smoke tests
   move in one PR (VC1) — because all of them share one TypeScript program.
4. **Three things the design omits are kept anyway:** the scroll-reveal animation
   (`reveal.ts`, retimed to the new motion tokens; its CSS contract moves site-side),
   GitHub links (footer and the contact "Elsewhere" block), and **both résumés — with
   the full-stack PDF as the default**. The nav Résumé action, the hero "Résumé, PDF"
   CTA and the footer "Résumé" link all point to the full-stack 2026 PDF; the backend
   PDF appears only as one extra footer link. The contact section lists no résumés, per
   the design.

## Engineering bar (applies to every phase)

The user asked for the best-of-the-best implementation: cohesive layers, zero unused
code, abstractions that remove repetition, best practices throughout.

- **Layering is unchanged and non-negotiable**: `pages → layouts → sections →
{ui, content} → styles`; `functions/` stays outside `src/`, importing
  `content/contact` by relative subpath only.
- **No unused code.** The new kit is exactly the skill's 14 components — its own
  philosophy is "nothing speculative" — and every one is used by the page (`NavBar` via
  the header island, `Card` as the contact-form container, `Divider` in About, `Tag` in
  the hero and drawer). Everything the new kit does not define (`Icon`, `IconButton`,
  `Avatar`, `Select`, `Switch`, `SegmentedToggle`, `ThemeToggle`, `ProjectBrief`,
  `WorkRow`, `TimelineItem`) is deleted, and phase verifications grep for orphans.
- **One owner per behavior.** The page header _is_ the kit `NavBar`, rendered by one
  `SiteNav` island that also owns scroll-spy and smooth scroll and hosts the theme
  toggle + Résumé button through NavBar's `action` prop — `sections.css` never clones
  nav visuals and there is no separate nav script. Drawer behavior lives in `WorkGrid`;
  reveal stays in `reveal.ts`. Islands server-render real anchors and content, so
  nothing depends on JS to exist.
- **Copy has a single source.** Every string — including the ones the kit hardcodes in
  its JSX (About prose, labels, placeholders, footer strings) — lives in `src/content`.
  Section files render data; they do not carry prose.
- **Kit APIs are frozen, kit internals are not.** Props, defaults and behavior follow
  the `.d.ts` contracts exactly, but where the kit source repeats itself (the identical
  tag-pill style objects in `ExperienceItem` and `ProjectCard`, for example) the port
  extracts a shared internal helper with byte-identical rendered output.

## Risk register (read before starting any phase)

0. **The PR-and-preview infrastructure is incomplete.** `main` is on GitHub at
   `64f539a`, but `dev` is still the default branch and `main` carries no protection
   rule; the Cloudflare Pages project was never created (both checked during VC0 on
   2026-08-24). Phase 7 task 0 carries the setup with timing tags. Group A (git/GitHub)
   is `HUMAN:` dashboard work — there is no `gh` CLI — and was raised with the user at
   VC0. Group B (Pages project + environment variables, `HUMAN:`) was raised at VC0 too
   and **remains outstanding**: VC0 has nothing to preview and VC1 validates the
   endpoint locally, so **VC2 is the phase that blocks on it**.
1. **The e2e viewport sweep and mobile-menu tests are shrunk in VC3 and restored in
   VC5.** The pre-design has zero media queries, so the swapped page cannot pass a
   320px sweep until VC5 designs narrow mode. This is tolerable only while production
   is the unlaunched `*.pages.dev` URL. If launch is ever reordered ahead of VC5, VC3
   and VC5 must merge into one phase.
2. **One TypeScript program.** `tsconfig.json` includes `src/`, `e2e/` and
   `functions/`, so removing any export breaks `pnpm check` until every consumer moves
   with it. Export removals ship atomically with all their consumers.
3. **Ten component names collide between the old and new kits, and every API differs.**
   The new kit is born in `src/kit/` (VC2) and takes over `src/ui/` only in VC3 via
   `git mv`. Never let both kits share a barrel. The same pattern applies to content:
   the new model is born in `src/content/next/` (VC1) and promoted in VC3.
4. **Fontsource registers `"… Variable"` family names** (phase 2 hit this with Space
   Grotesk). This time the token files stay byte-verbatim: the `--font-*` overrides
   live in site CSS, not in `tokens/typography.css`. And the new `tokens/fonts.css`
   carries a Google Fonts `@import` that must never ship — the
   `grep -r "fonts.googleapis" dist/` gate applies to every phase that builds.
5. **Accessibility-spec surgery cannot wait for the quality phase.** The a11y suite's
   gold canary, its disabled-Switch exclusion, and the new palette's own small-text
   contrast questions (clay ordinals, moss tag, `--ink-3` meta text — in both themes)
   all bite the moment `/kit` is rewritten, so they are VC2 work. Whole-page decisions
   are finalized in VC5.
