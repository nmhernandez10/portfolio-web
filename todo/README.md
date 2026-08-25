# todo/ — implementation phases for nicolasmateo.dev

This directory is the implementation plan for the portfolio. Each phase is one markdown doc, executed in one focused session, in order. A session should read this file, its phase doc, and `AGENTS.md` (the canonical agent doc; `CLAUDE.md` just imports it) — that is everything needed; no phase re-litigates a decision recorded here. Where a phase doc says "amend `CLAUDE.md`", that means `AGENTS.md`.

## Status

Phases 0–6.2 are implemented and their docs were removed on 2026-08-24 for cohesion;
the six visual-correction phases (VC0–VC5), which rebranded the site to the replaced
design skill, completed on 2026-08-25 and their docs were removed the same way. In both
cases the full record lives in git history, and every item still open was carried into
[phase 7, task 0](phase-7-launch.md) with per-item timing tags. What remains:

| Phase | Title                       | PR  | Status      | Preview URL |
| ----- | --------------------------- | --- | ----------- | ----------- |
| 7     | [Launch](phase-7-launch.md) | —   | In progress | —           |

Phase 7 is the last one.

## How to execute a phase

1. Read this README, the phase doc, and `CLAUDE.md`.
2. Work on the `dev` branch. Commit small, using Conventional Commits (`feat:`, `fix:`, `chore:`, `docs:`, `ci:`, `refactor:`).
3. Steps marked `HUMAN:` need the Cloudflare / Resend / GitHub dashboard or another human-only action. Stop and ask the user; never guess or skip.
4. Run every item in the phase's Verification section. Fix before proceeding.
5. Open a PR `dev → main` titled `Phase N: <name>`. The Definition of Done gates the merge.
6. In the phase's final commit: update the Status table above (PR link, status, preview URL) and amend `CLAUDE.md` if the phase added commands or conventions.
7. Merge with a **merge commit — never squash**. `dev` is long-lived; squash-merging it causes phantom-diff conflicts on every later PR.

## Definition of Done (inherited by every phase)

- `npm run build` succeeds and `npm run check` (`astro check` + `tsc --noEmit`) is clean.
- CI is green on the PR.
- No new console errors or warnings in `npm run dev`.
- Status table updated; `CLAUDE.md` amended if needed.
- Nothing listed under the phase's "Out of scope" leaked in.

Phases add their own items on top of this.

## Stack and architecture (locked — do not revisit)

- **Astro 7 (latest; supersedes the original "Astro 5" — decided with the user 2026-08-19) + React 19 islands, TypeScript strict, npm (moved off pnpm 2026-08-25; see `AGENTS.md` § Stack).** Keep every dependency on its latest compatible release; where phase docs assumed Astro 5 semantics, current official docs win. Static-first: sections are `.astro` and ship zero JS; only islands hydrate, and `AGENTS.md` § Layering rules enumerates them.
- **Cloudflare Pages, adapter-less** (decided with the user 2026-08-22, superseding the original phase-1 Workers decision; `@astrojs/cloudflare` dropped Pages support in v13 and Astro 7 requires v14, so no adapter can target Pages). `astro build` emits a plain static `dist/`; the contact endpoint is a hand-written Pages Function, `functions/api/contact.ts`. Pages git integration deploys: `main` → production, every other branch/PR → preview, with separate vars and secrets per environment. GitHub Actions is the quality gate only (it never deploys). Custom domain `nicolasmateo.dev` attaches in phase 7.
- **UI kit is an in-app module**: `src/styles/tokens/` + `src/ui/`, ported from the design skill and fully independent of it. The skill was deleted in phase 7 (2026-08-25) after a parity check; `docs/brand.md` replaced it.
- **Layout**: the target tree lives in `AGENTS.md` § Project map — one owner, so the two docs cannot drift.
- **.astro/.tsx split**: `src/sections/` is `.astro`; a section is `.tsx` only if it is, or becomes, a hydrated island (an island cannot hydrate inside a non-hydrated React tree, and `astro:assets` is unavailable to React). React is reserved for the kit and for islands.
- **One story — decided 2026-08-24.** The page says everything at once, under the positioning label **Senior Backend Engineer & Feature Architect**: a hero, four numbered sections (`01` Work, `02` Experience, `03` About, `04` Contact) and a footer. Both résumés ship, with the full-stack PDF as the primary link and the backend PDF as one extra footer link.
- **Theme**: inline `is:inline` head script before paint (localStorage → `prefers-color-scheme` → light) sets `data-theme` on `<html>`; the `SiteThemeToggle` island syncs from the attribute and writes attribute + localStorage.
- **Reveal**: vanilla `src/scripts/reveal.ts` binding the `.reveal` / `.reveal-ready` / `.is-in` contract that already exists in `tokens/base.css`. Observer `rootMargin: "-40px"`, 900ms reveal-everything fallback, reduced-motion bail.
- **Fonts**: the three faces are self-hosted via fontsource — the packages are named in `AGENTS.md` § Stack, the law in its § Design laws, and the per-phase check in gotcha 4 below.
- **Contact**: one route, `POST /api/contact` — since phase 6.1 a hand-written Pages Function (`functions/api/contact.ts`) reading `context.env`; the rest of the site is fully static. Resend via plain `fetch` (no SDK). Config via environment: all three keys are set per environment in the Pages dashboard — `EMAIL_FROM` / `EMAIL_TO` as plain variables, `RESEND_API_KEY` as a secret — and live in the gitignored `.dev.vars` locally. (**Revised 2026-08-23 in phase 6.2**: the two addresses were `vars` in `wrangler.jsonc` until naming them there proved to lock the dashboard's copies. **Revised again 2026-08-25**: the file is gone entirely — any deployed `pages_build_output_dir` locks the whole dashboard, not just named fields — all Pages config is dashboard-managed, and `npm run preview` passes `dist`, the port and the compatibility date as flags.) Honeypot only; Turnstile is a documented follow-up if spam appears.

## Design source of truth

`docs/brand.md` — the design reference, written in phase 7 when the `nicolas-mateo-design`
skill was deleted. `AGENTS.md` § Design source of truth points at it and its § Design laws
states the enforceable rules. All of it is owned there and is not restated here.

## Global gotchas

1. **The skill is gone** (phase 7, 2026-08-25) and with it the kit harnesses, the reference PNGs and every `.prompt.md`. `docs/brand.md` is the reference now, `src/styles/tokens/*.css` the machine-readable source and `/kit` the live inventory; anything the skill carried that this repo does not is in git history.
2. **React 19**: the ported kit types return `React.JSX.Element`/`ReactNode`, never the bare `JSX.Element` the skill's `.d.ts` files used, and carry no `import React from "react"` where only JSX is present (automatic runtime).
3. **Islands can't nest in static React trees** — anything hydrated must be slotted from a `.astro` file, hence the `.astro` header/footer shells.
4. **Google Fonts must not ship**: verify `grep -r "fonts.googleapis" dist/` is empty in every phase that builds.
5. **The brand laws live in `AGENTS.md` § Design laws** — one accent, zero icon files, three typefaces, hairlines not shadows, and the voice rules that govern every string including form errors and the 404 page. They are law, not preference: a phase reaching for an SVG, a second accent or a fourth face has misread the design. Read them before writing any copy or CSS.
6. **Content never depends on JS**: every section must exist in static HTML; `reveal-ready` is added only after the observer exists; the 900ms fallback is mandatory.
7. **Resume filenames**: the 2026 PDFs came out of the skill's `uploads/` with spaces and accents in their names. Only the URL-safe copies in `public/` exist now, and only those are ever served.
8. **Pages preview and production carry separate vars and secrets** (since phase 6.1) — keep a test Resend key in both environments until launch; production rotates to the live key in phase 7.
9. **Pages/wrangler config drifts**: where a phase doc names `wrangler` Pages fields or flags, the current official docs win. Verify with `wrangler pages dev`, don't trust the doc.
