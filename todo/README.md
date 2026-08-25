# todo/ — implementation phases for nicolasmateo.dev

This directory is the implementation plan for the portfolio. Each phase is one markdown doc, executed in one focused session, in order. A session should read this file, its phase doc, and `AGENTS.md` (the canonical agent doc; `CLAUDE.md` just imports it) — that is everything needed; no phase re-litigates a decision recorded here. Where a phase doc says "amend `CLAUDE.md`", that means `AGENTS.md`.

## Status

Phases 0–6.2 are implemented and their docs were removed on 2026-08-24 for cohesion —
the full record lives in git history, and every item still open from them was carried
into [phase 7, task 0](phase-7-launch.md) with per-item timing tags (several must run
at VC0/VC1 time, not at launch). What remains:

| Phase   | Title                                                                                   | PR  | Status          | Preview URL |
| ------- | --------------------------------------------------------------------------------------- | --- | --------------- | ----------- |
| VC0–VC5 | [Visual correction](visual-correction/README.md) — rebrand to the replaced design skill | —   | VC4 implemented | —           |
| 7       | [Launch](phase-7-launch.md)                                                             | —   | Not started     | —           |

Dependencies are linear: the six visual-correction phases run in order (their own
README carries the per-phase table), then phase 7.

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

- **Astro 7 (latest; supersedes the original "Astro 5" — decided with the user 2026-08-19) + React 19 islands, TypeScript strict, pnpm.** Keep every dependency on its latest compatible release; where phase docs assumed Astro 5 semantics, current official docs win. Static-first: sections are `.astro` and ship zero JS; only islands hydrate, and `AGENTS.md` § Layering rules enumerates them.
- **Cloudflare Pages, adapter-less** (decided with the user 2026-08-22, superseding the original phase-1 Workers decision; `@astrojs/cloudflare` dropped Pages support in v13 and Astro 7 requires v14, so no adapter can target Pages). `astro build` emits a plain static `dist/`; the contact endpoint is a hand-written Pages Function, `functions/api/contact.ts`. Pages git integration deploys: `main` → production, every other branch/PR → preview, with separate vars and secrets per environment. GitHub Actions is the quality gate only (it never deploys). Custom domain `nicolasmateo.dev` attaches in phase 7.
- **UI kit is an in-app module**: `src/styles/tokens/` + `src/ui/`, ported from the design skill and fully independent of it. The skill is deleted in phase 7 after a parity check.
- **Layout**: the target tree lives in `AGENTS.md` § Project map — one owner, so the two docs cannot drift.
- **.astro/.tsx split**: `src/sections/` is `.astro`; a section is `.tsx` only if it is, or becomes, a hydrated island (an island cannot hydrate inside a non-hydrated React tree, and `astro:assets` is unavailable to React). React is reserved for the kit and for islands.
- **One story — decided 2026-08-24.** The page says everything at once, under the positioning label **Senior Backend Engineer & Feature Architect**: a hero, four numbered sections (`01` Work, `02` Experience, `03` About, `04` Contact) and a footer. Both résumés ship, with the full-stack PDF as the primary link and the backend PDF as one extra footer link.
- **Theme**: inline `is:inline` head script before paint (localStorage → `prefers-color-scheme` → light) sets `data-theme` on `<html>`; the `SiteThemeToggle` island syncs from the attribute and writes attribute + localStorage.
- **Reveal**: vanilla `src/scripts/reveal.ts` binding the `.reveal` / `.reveal-ready` / `.is-in` contract that already exists in `tokens/base.css`. Observer `rootMargin: "-40px"`, 900ms reveal-everything fallback, reduced-motion bail.
- **Fonts**: the three faces are self-hosted via fontsource — the packages are named in `visual-correction/phase-vc2-kit.md`, the law in `AGENTS.md` § Design laws, and the per-phase check in gotcha 4 below.
- **Contact**: one route, `POST /api/contact` — since phase 6.1 a hand-written Pages Function (`functions/api/contact.ts`) reading `context.env`; the rest of the site is fully static. Resend via plain `fetch` (no SDK). Config via environment: all three keys are set per environment in the Pages dashboard — `EMAIL_FROM` / `EMAIL_TO` as plain variables, `RESEND_API_KEY` as a secret — and live in the gitignored `.dev.vars` locally. (**Revised 2026-08-23 in phase 6.2**: the two addresses were `vars` in `wrangler.jsonc` until naming them there proved to lock the dashboard's copies.) Honeypot only; Turnstile is a documented follow-up if spam appears.

## Design source of truth

`AGENTS.md` § Design source of truth lists the skill paths, and its § Design laws states the
brand laws. Both are owned there and are not restated here.

## Global gotchas

1. **Never run the kit harnesses** — `ui_kits/portfolio/index.html` and `index-dark.html` load React from unpkg and are recreations, not sources. The section JSX, the skill `readme.md` and the two reference PNGs are the reference.
2. **React 19**: the skill `.d.ts` files use `JSX.Element` — convert to `React.JSX.Element`/`ReactNode`. Drop `import React from "react"` where only JSX is used (automatic runtime).
3. **Islands can't nest in static React trees** — anything hydrated must be slotted from a `.astro` file, hence the `.astro` header/footer shells.
4. **Google Fonts must not ship**: verify `grep -r "fonts.googleapis" dist/` is empty in every phase that builds.
5. **The brand laws live in `AGENTS.md` § Design laws** — one accent, zero icon files, three typefaces, hairlines not shadows, and the voice rules that govern every string including form errors and the 404 page. They are law, not preference: a phase reaching for an SVG, a second accent or a fourth face has misread the design. Read them before writing any copy or CSS.
6. **Content never depends on JS**: every section must exist in static HTML; `reveal-ready` is added only after the observer exists; the 900ms fallback is mandatory.
7. **Resume filenames**: the skill's `uploads/` 2026 PDFs have spaces and accents. Only the URL-safe copies in `public/` are served.
8. **Pages preview and production carry separate vars and secrets** (since phase 6.1) — keep a test Resend key in both environments until launch; production rotates to the live key in phase 7.
9. **Pages/wrangler config drifts**: where a phase doc names `wrangler` Pages fields or flags, the current official docs win. Verify with `wrangler pages dev`, don't trust the doc.
