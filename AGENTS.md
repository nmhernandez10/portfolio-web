# AGENTS.md — nicolasmateo.dev

Personal portfolio for Nicolás Hernández: a one-page, static-first Astro 7 + React 19 site deployed to Cloudflare Workers, with a lens toggle that tells the story as either backend (`be`) or full-stack (`fs`). This file is the canonical agent doc; `CLAUDE.md` only imports it.

## Workflow

Implementation runs phase by phase from `todo/`. Before any work: read `todo/README.md` and the current phase doc — decisions recorded there are locked and are not re-litigated. Each phase ends with a PR `dev` → `main` gated by the Definition of Done in `todo/README.md`. Steps marked `HUMAN:` need a dashboard or another human-only action: stop and ask, never guess.

## Stack

Astro 7 (latest, decided 2026-08-19, superseding the original "Astro 5" note), `@astrojs/react` (React 19), TypeScript strict, pnpm (via corepack), Node 24. No ESLint — `astro check` + `tsc --noEmit` + Prettier is the whole quality toolchain. Path alias `@/*` → `src/*`.

Note: pnpm's `minimumReleaseAge` supply-chain policy (24h) is active on this machine. If an install rejects fresh releases, resolve with `pnpm clean --lockfile && pnpm install` (age-aware resolution) — do not disable the policy.

## Project map

Target layout (later phases fill this in; see `todo/README.md` for the annotated version):

```
src/
  styles/tokens/*.css      7 token files
  styles/global.css        imports tokens in skill order + site utilities
  ui/{core,forms,navigation,content}/*.tsx   20 components; index.ts barrel
  content/{types.ts,profile.ts}              typed port of prototype/data.js
  sections/*.tsx           one component per page section + the three islands
  layouts/BaseLayout.astro head, fonts, theme script, reveal script
  pages/index.astro  kit.astro  404.astro  api/contact.ts
  scripts/reveal.ts        vanilla IntersectionObserver module
  assets/portrait.jpg      optimized via astro:assets
public/
  icons/{ui,tech}/*.svg    Icon uses CSS mask, so these must be plain public URLs
  resume-backend.pdf  resume-fullstack.pdf
  favicon.svg  robots.txt  og.png
docs/brand.md              phase 7: brand laws migrated from the skill
```

## Commands

- `pnpm dev` — dev server at `localhost:4321`
- `pnpm build` — production build to `dist/`
- `pnpm preview` — serve the build
- `pnpm check` — `astro check && tsc --noEmit`
- `pnpm format` / `pnpm format:check` — Prettier write / verify

## Git conventions

- Conventional Commits (`feat:`, `fix:`, `chore:`, `docs:`, `ci:`, `refactor:`); commit small.
- Work on `dev`; phases merge to `main` via PR with a **merge commit — never squash** (`dev` is long-lived; squashing causes phantom-diff conflicts).
- CI (`.github/workflows/ci.yml`, job id `ci`) is the quality gate: format check, `pnpm check`, build. It never deploys; Cloudflare Workers Builds deploys from git.
- Run `pnpm format` before every commit so new files pass the CI format gate.

## Design laws (non-negotiable)

- Gold text is always `#A6762A` (`--gold-700`); `#E3B23C` is fill-only, never text.
- No Google Fonts in production — fonts are self-hosted; verify `grep -r "fonts.googleapis" dist/` is empty.
- Copy: first person, sentence case, numbers not adjectives, no emoji, no exclamation marks, em dash with spaces, `·` separators, accents kept in _Bogotá_ / _Nicolás_. Applies to every string including form errors and the 404 page.
- Content never depends on JS: default lens `be` and all nine sections exist in static HTML.
- White surfaces only on cards; 8px radius only on inputs; no orange, no gradients, no Inter.

## Design source of truth (until phase 7 replaces it with docs/brand.md)

- `.claude/skills/nicolas-mateo-design/README.md` — master spec
- `.claude/skills/nicolas-mateo-design/prototype/site-b/PortraitScreens.jsx` — exact grids and inline styles (never run the prototype's `index.html`)
- `.claude/skills/nicolas-mateo-design/prototype/data.js` — every content string, keyed by lens
- `.claude/skills/nicolas-mateo-design/design-system/tokens/*.css` — token values
- `.claude/skills/nicolas-mateo-design/design-system/BRAND-GUIDE.md` — voice and visual law; read before writing any copy
