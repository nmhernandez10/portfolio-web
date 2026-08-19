# todo/ — implementation phases for nicolasmateo.dev

This directory is the implementation plan for the portfolio. Each phase is one markdown doc, executed in one focused session, in order. A session should read this file, its phase doc, and `AGENTS.md` (the canonical agent doc; `CLAUDE.md` just imports it) — that is everything needed; no phase re-litigates a decision recorded here. Where a phase doc says "amend `CLAUDE.md`", that means `AGENTS.md`.

## Status

| Phase | Title                                                   | PR  | Status      | Preview URL |
| ----- | ------------------------------------------------------- | --- | ----------- | ----------- |
| 0     | [Foundations](phase-0-foundations.md)                   | —   | In progress | —           |
| 1     | [Deploy skeleton](phase-1-deploy-skeleton.md)           | —   | In progress | —           |
| 2     | [UI kit](phase-2-ui-kit.md)                             | —   | Not started | —           |
| 3     | [Content and page](phase-3-content-and-page.md)         | —   | Not started | —           |
| 4     | [Interactivity](phase-4-interactivity.md)               | —   | Not started | —           |
| 5     | [Contact endpoint](phase-5-contact-endpoint.md)         | —   | Not started | —           |
| 6     | [Responsive and quality](phase-6-responsive-quality.md) | —   | Not started | —           |
| 7     | [Launch](phase-7-launch.md)                             | —   | Not started | —           |

Dependencies are linear (each phase builds on the previous), with one exception: phases 4 and 5 are independent of each other and may run in either order.

## How to execute a phase

1. Read this README, the phase doc, and `CLAUDE.md`.
2. Work on the `dev` branch. Commit small, using Conventional Commits (`feat:`, `fix:`, `chore:`, `docs:`, `ci:`, `refactor:`).
3. Steps marked `HUMAN:` need the Cloudflare / Resend / GitHub dashboard or another human-only action. Stop and ask the user; never guess or skip.
4. Run every item in the phase's Verification section. Fix before proceeding.
5. Open a PR `dev → main` titled `Phase N: <name>`. The Definition of Done gates the merge.
6. In the phase's final commit: update the Status table above (PR link, status, preview URL) and amend `CLAUDE.md` if the phase added commands or conventions.
7. Merge with a **merge commit — never squash**. `dev` is long-lived; squash-merging it causes phantom-diff conflicts on every later PR.

## Definition of Done (inherited by every phase)

- `pnpm build` succeeds and `pnpm check` (`astro check` + `tsc --noEmit`) is clean.
- CI is green on the PR.
- No new console errors or warnings in `pnpm dev`.
- Status table updated; `CLAUDE.md` amended if needed.
- Nothing listed under the phase's "Out of scope" leaked in.

Phases add their own items on top of this.

## Stack and architecture (locked — do not revisit)

- **Astro 7 (latest; supersedes the original "Astro 5" — decided with the user 2026-08-19) + React 19 islands, TypeScript strict, pnpm.** Keep every dependency on its latest compatible release; where phase docs assumed Astro 5 semantics, current official docs win. Static-first: React components without a `client:` directive render to HTML and ship zero JS. Exactly three islands hydrate: `ThemeToggle` (`client:load`), `LensToggle` (`client:load`), `ContactForm` (`client:visible`).
- **Cloudflare Workers + static assets** via `@astrojs/cloudflare`. Deploys by **Workers Builds** (git-connected): `main` → production, every other branch/PR → preview URL. GitHub Actions is the quality gate only (it never deploys). Custom domain `nicolasmateo.dev` attaches in phase 7.
- **UI kit is an in-app module**: `src/styles/tokens/` + `src/ui/`, ported from the design skill and fully independent of it. The skill is deleted in phase 7 after a parity check.
- **Layout**:
  ```
  src/
    styles/tokens/*.css      7 token files (fonts.css rewritten to a pointer comment)
    styles/global.css        imports tokens in skill order + site utilities (lens visibility, responsive)
    ui/{core,forms,navigation,content}/*.tsx   20 components; index.ts barrel
    content/{types.ts,profile.ts}              typed port of prototype/data.js
    sections/*.tsx           one component per page section + the three islands
    layouts/BaseLayout.astro head, fonts, theme script, reveal script
    pages/index.astro  kit.astro  404.astro  api/contact.ts
    scripts/reveal.ts        vanilla IntersectionObserver module
    assets/portrait.jpg      optimized via astro:assets
  public/
    icons/{ui,tech}/*.svg    30 + 14 (Icon uses CSS mask → must be plain public URLs)
    resume-backend.pdf  resume-fullstack.pdf   URL-safe renames
    favicon.svg  robots.txt  og.png
  docs/brand.md              phase 7: brand laws migrated from the skill
  ```
- **.astro/.tsx split**: `.astro` only for pages, the layout, and the header/footer shells (an island cannot hydrate inside a non-hydrated React tree). Everything visual is React `.tsx` rendered statically.
- **Lens toggle** (`be`/`fs`): dual render, not a store. Both variants of every swap point are in the static HTML; `data-lens="be"` on `<html>` + CSS (`[data-lens="be"] [data-lens-panel="fs"] { display: none }`) picks one. The island only sets `document.documentElement.dataset.lens`. No persistence — `be` is the canonical first story.
- **Theme**: inline `is:inline` head script before paint (localStorage → `prefers-color-scheme` → light) sets `data-theme` on `<html>`; the ThemeToggle island syncs from the attribute and writes attribute + localStorage.
- **Reveal**: vanilla `src/scripts/reveal.ts` binding the `.reveal` / `.reveal-ready` / `.is-in` contract that already exists in `tokens/base.css`. Observer `rootMargin: "-40px"`, 900ms reveal-everything fallback, reduced-motion bail.
- **Fonts**: `@fontsource-variable/space-grotesk` + `@fontsource-variable/jetbrains-mono`, self-hosted via the bundler. The Google Fonts `@import` must never reach production.
- **Contact**: one on-demand route `POST /api/contact` (`prerender = false`) in the same Worker. Resend via plain `fetch` (no SDK). Config via environment: `EMAIL_FROM` / `EMAIL_TO` as `vars` in `wrangler.jsonc`, `RESEND_API_KEY` as a Worker secret, all three in gitignored `.dev.vars` locally. Honeypot only; Turnstile is a documented follow-up if spam appears.

## Design source of truth

Until the skill is deleted (phase 7), all visual/behavioral numbers come from:

- `.claude/skills/nicolas-mateo-design/README.md` — master spec: 9 page blocks, interactions, tokens digest, suggested build order.
- `.claude/skills/nicolas-mateo-design/prototype/site-b/PortraitScreens.jsx` — exact grids, gaps, and inline styles per section.
- `.claude/skills/nicolas-mateo-design/prototype/data.js` — every content string, keyed by lens.
- `.claude/skills/nicolas-mateo-design/design-system/tokens/*.css` — the token values (ported verbatim in phase 2).
- `.claude/skills/nicolas-mateo-design/design-system/BRAND-GUIDE.md` — copy voice and visual law. Read before writing any copy.

## Global gotchas

1. **Never run or trust `prototype/site-b/index.html`** — its script wiring references a `_ds_bundle.js` that only exists in the design tool. `PortraitScreens.jsx` + the skill README are the reference; the prototype is never executed.
2. **React 19**: the DS `.d.ts` files use `JSX.Element` — convert to `React.JSX.Element`/`ReactNode`. Drop `import React from "react"` where only JSX is used (automatic runtime).
3. **Islands can't nest in static React trees** — anything hydrated must be slotted from a `.astro` file, hence the `.astro` header/footer shells.
4. **Google Fonts must not ship**: verify `grep -r "fonts.googleapis" dist/` is empty in every phase that builds.
5. **Gold contrast law**: gold _text_ is always `--gold-700` `#A6762A`; `#E3B23C` is fill-only. Stated twice in the spec; non-negotiable.
6. **Content never depends on JS**: default lens `be` and all nine sections must exist in static HTML; `reveal-ready` is added only after the observer exists; the 900ms fallback is mandatory.
7. **Icon needs public URLs**: the Icon component paints SVGs via CSS `mask`; bundler-hashed `src/assets` paths break it. Icons live in `public/icons/`.
8. **Resume filenames**: the source PDFs have spaces and `í`. Only the URL-safe copies in `public/` are served; the originals are removed once migrated.
9. **Copy is law**: BRAND-GUIDE voice rules (first person, numbers not adjectives, sentence case, no emoji, no exclamation marks, em dash with spaces, `·` separators, accents in _Bogotá_/_Nicolás_) apply to every string, including form errors and the 404 page.
10. **Workers preview versions share the production Worker's secrets** — use a test Resend key until launch; rotate in phase 7.
11. **Adapter/wrangler config drifts**: where a phase doc names `@astrojs/cloudflare` or `wrangler.jsonc` fields, the current official docs win. Verify with `wrangler dev`, don't trust the doc.
