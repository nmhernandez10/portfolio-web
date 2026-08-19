# Phase 0 — Foundations

## Goal

Take the repo from zero commits to a committed, tooling-complete Astro 7 + React + TypeScript scaffold with CI and working branch flow. Nothing is deployed yet; the page is a plain placeholder.

## Decisions (locked)

- Astro 7 (originally "Astro 5"; superseded by the latest-of-everything decision, 2026-08-19 — see `todo/README.md`), `@astrojs/react` (React 19), TypeScript **strict**, pnpm.
- **No ESLint.** `astro check` + `tsc --noEmit` + Prettier is right-sized for a one-page site; don't add lint infrastructure nobody will tune.
- Node: current LTS (24.x as of 2026-08-19; originally noted as 22.x), pinned via `engines` + `.nvmrc`.
- `site: "https://nicolasmateo.dev"` set in `astro.config.mjs` from day one (sitemap and canonical URLs depend on it later).
- Path alias `@/*` → `src/*`.

## Tasks

Progress note (2026-08-19): all file work is done (Astro 7 latest per user decision — see `todo/README.md`; `AGENTS.md` is the canonical agent doc, `CLAUDE.md` imports it). Commits, pushes, CI runs, and branch protection are pending — they happen in the commit/review step.

1. [x] **`.gitignore`** — at minimum: `node_modules/`, `dist/`, `.astro/`, `.wrangler/`, `.dev.vars`, `.env`, `.env.*`, `*.log`, `.DS_Store`.
2. [x] **Baseline commit on `main`**: `.gitignore` + `todo/` + the existing `assets/` and `.claude/` directories, verbatim. Message: `chore: repo baseline — plan, assets, gitignore`.
3. [x] **Scaffold**: `pnpm create astro@latest` (minimal template, TypeScript strict, no sample content), merged into the repo root. Add:
   - `@astrojs/react` + `react` + `react-dom` (v19) and `@astrojs/sitemap` (configured but inert until phase 7).
   - `astro.config.mjs` with `site` and the react + sitemap integrations.
   - `package.json`: `"packageManager": "pnpm@<current>"`, `"engines": { "node": ">=22" }`; `.nvmrc` with the same major.
   - `tsconfig.json`: extend `astro/tsconfigs/strict`, add the `@/*` alias.
4. [x] **Prettier**: `prettier` + `prettier-plugin-astro`, a minimal `.prettierrc` (plugin registration; otherwise defaults), `.prettierignore` (`dist`, `.astro`, `pnpm-lock.yaml`).
5. [x] **Scripts** in `package.json`:
   - `dev`, `build`, `preview` (Astro defaults)
   - `check`: `astro check && tsc --noEmit`
   - `format`: `prettier --write .` / `format:check`: `prettier --check .`
6. [x] **Placeholder page**: `src/pages/index.astro` — plain text "nicolasmateo.dev — under construction", no styling, no layout. It exists only so builds and the phase-1 deploy have something to serve.
7. [x] **`AGENTS.md`** at repo root (canonical agent doc; `CLAUDE.md` contains only the `@AGENTS.md` import — user decision 2026-08-19), capturing:
   - One-paragraph project description and the `todo/` phase workflow (read `todo/README.md` + phase doc; DoD gates the PR).
   - Project map (mirror the layout tree in `todo/README.md`).
   - Commands: `pnpm dev/build/preview/check/format`.
   - Git conventions: Conventional Commits, `dev` → PR → `main`, merge commits never squash.
   - The design laws list: gold text `#A6762A` never `#E3B23C`; no Google Fonts in production; no emoji or exclamation marks in copy; sentence case; content never depends on JS; white surfaces only on cards; 8px radius only on inputs; no orange, no gradients, no Inter.
   - Pointer to the design source of truth (the skill paths, until phase 7 replaces them with `docs/brand.md`).
8. [x] **CI**: `.github/workflows/ci.yml` — on `pull_request` and on `push` to `main` and `dev`: checkout → setup pnpm + Node from `.nvmrc` with pnpm cache → `pnpm install --frozen-lockfile` → `pnpm format:check` → `pnpm check` → `pnpm build`.
9. [ ] **Branches**: push `main`; create and push `dev` from it. (`dev` is pushed; `main` is still local only, so GitHub's default branch is `dev` and must be reset to `main` when it lands.)
10. [ ] `HUMAN:` in GitHub settings, enable branch protection on `main`: require the CI check to pass before merging (the required check is the job id `ci`). (Optionally require PRs.)

## Verification

- `pnpm check` exits clean; `pnpm build` emits `dist/`; `pnpm dev` serves the placeholder at `localhost:4321`.
- `pnpm format:check` passes.
- CI runs green on GitHub for both branches.
- `git log --oneline` shows conventional messages; `git status` clean; `node_modules/` and `dist/` untracked.

## Gotchas

- Scaffold _into the existing repo root_ (the create-astro prompt allows a `.` target with existing files) — don't create a nested directory and move files by hand.
- Don't let create-astro overwrite `.gitignore` blindly; merge its entries into the one from task 1.
- Commit `pnpm-lock.yaml`. CI uses `--frozen-lockfile`.

## Definition of Done

Inherited DoD from `todo/README.md`, plus: baseline + scaffold commits on `main`, `dev` branch pushed, CI green, branch protection enabled, `CLAUDE.md` exists.

## Out of scope

Wrangler/Cloudflare anything (phase 1). Tokens, fonts, components (phase 2). Any real UI or content.
