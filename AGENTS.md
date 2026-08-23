# AGENTS.md — nicolasmateo.dev

Personal portfolio for Nicolás Hernández: a one-page, static-first Astro 7 + React 19 site deployed to Cloudflare Workers, telling one story — Senior Software Engineer — with backend and full-stack work given their own sections. This file is the canonical agent doc; `CLAUDE.md` only imports it.

> The design skill still describes a Backend ↔ Full stack **lens toggle** that swapped the copy behind a switch. It was dropped on 2026-08-22 in favour of the two sections; the skill's visual numbers still govern, its lens behaviour does not.

## Workflow

Implementation runs phase by phase from `todo/`. Before any work: read `todo/README.md` and the current phase doc — decisions recorded there are locked and are not re-litigated. Each phase ends with a PR `dev` → `main` gated by the Definition of Done in `todo/README.md`. Steps marked `HUMAN:` need a dashboard or another human-only action: stop and ask, never guess.

## Stack

Astro 7 (latest, decided 2026-08-19, superseding the original "Astro 5" note), `@astrojs/react` (React 19), TypeScript strict, pnpm (via corepack), Node 24. No ESLint — `astro check` + `tsc --noEmit` + Prettier is the whole quality toolchain. Path alias `@/*` → `src/*`.

Note: pnpm's `minimumReleaseAge` supply-chain policy (24h) is active on this machine. If an install rejects fresh releases, resolve with `pnpm clean --lockfile && pnpm install` (age-aware resolution) — do not disable the policy.

That rebuild can add `minimumReleaseAgeExclude` entries to `pnpm-workspace.yaml`: when a package.json range only matches a release younger than the cutoff, pnpm grandfathers that exact version rather than downgrading it. Those entries are pnpm's own doing, not a policy override, and they stop being needed once the release ages past 24h — drop them on the next lockfile touch instead of letting them accumulate.

## Project map

Target layout (later phases fill this in; see `todo/README.md` for the annotated version):

```
src/
  styles/tokens/*.css      7 token files
  styles/sections.css      page layout, one class block per page section
  styles/global.css        imports tokens in skill order, then sections + site utilities
  ui/{core,forms,navigation,content}/*.tsx   20 components; index.ts barrel
  content/{types,profile,sections}.ts        data + page manifest; index.ts barrel
  sections/*.astro         one component per page section (+ the .tsx islands)
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

### Layering rules

- Dependencies run one way: `pages → layouts → sections → {ui, content} → styles`. `src/ui/` never imports `src/content/`; `src/content/` holds data only — no React, no styling, no imports from `src/ui/`.
- `src/sections/` is `.astro`. A section file is `.tsx` only if it is, or becomes, a hydrated island — today that is `SiteThemeToggle.tsx` (phase 4, `client:load`) and `ContactForm.tsx` (phase 5 gives it `client:visible`). This keeps every section free to host an island without restructuring, and makes shipping JS by accident impossible.
- The UI kit styles itself inline and is never forked. Section layout lives in `src/styles/sections.css` behind class hooks, so phase 6 can add media queries without `!important`.
- A class hook always sits on a section-owned element, never on a kit component: Astro deletes `class` on framework components and the kit's frozen props have no `className`. Kit components take their own `style` prop instead (as the prototype does).

## Commands

- `pnpm dev` — dev server at `localhost:4321`
- `pnpm build` — production build to `dist/` (`dist/client` is the deployed asset directory)
- `pnpm preview` — serve the build
- `pnpm preview:worker` — build, then serve it from the real Worker runtime at `localhost:8787`
- `pnpm check` — `astro check && tsc --noEmit`
- `pnpm format` / `pnpm format:check` — Prettier write / verify

## Git conventions

- Conventional Commits (`feat:`, `fix:`, `chore:`, `docs:`, `ci:`, `refactor:`); commit small.
- Work on `dev`; phases merge to `main` via PR with a **merge commit — never squash** (`dev` is long-lived; squashing causes phantom-diff conflicts).
- CI (`.github/workflows/ci.yml`, job id `ci`) is the quality gate: format check, `pnpm check`, build. It never deploys; Cloudflare Workers Builds deploys from git.
- Run `pnpm format` before every commit so new files pass the CI format gate.

## Deploy

GitHub Actions owns quality, Cloudflare owns delivery — Actions never deploys.

- Cloudflare **Workers Builds** deploys from git: `main` → production, every other branch and PR → a preview URL posted as a PR comment. Single Worker, `portfolio-web`.
- Build command `pnpm build`, deploy command `pnpm wrangler deploy`. Deploy reads the generated `dist/client/wrangler.json` (wrangler follows the redirect written to `.wrangler/deploy/config.json` at build time), so build before deploy.
- `wrangler.jsonc` holds only `name` and `compatibility_date`. `@astrojs/cloudflare` supplies `main`, the `ASSETS` binding and the asset directory — do not restate them.
- The adapter runs with `imageService: "compile"`, so `astro:assets` transforms run with sharp at build time and emit static files. Its default, `cloudflare-binding`, would defer every transform to a runtime Cloudflare Images binding and emit `/_image` URLs instead.
- Local loop: `pnpm preview:worker` (or `pnpm build && pnpm wrangler dev`) serves the built site from workerd at `localhost:8787`. `pnpm dev` also runs on workerd via the adapter's Vite plugin.
- After changing `wrangler.jsonc`, rerun `pnpm wrangler types` and commit `worker-configuration.d.ts`.

## Design laws (non-negotiable)

- Gold text is always `#A6762A` (`--gold-700`); `#E3B23C` is fill-only, never text.
- No Google Fonts in production — fonts are self-hosted; verify `grep -r "fonts.googleapis" dist/` is empty.
- Copy: first person, sentence case, numbers not adjectives, no emoji, no exclamation marks, em dash with spaces, `·` separators, accents kept in _Bogotá_ / _Nicolás_. Applies to every string including form errors and the 404 page.
- Content never depends on JS: all ten sections exist in static HTML.
- White surfaces only on cards; 8px radius only on inputs — with one sanctioned exception, the hero portrait's `BOGOTÁ · REMOTE` tab, whose top-right corner is `--radius-sm` per the prototype (`PortraitScreens.jsx`, skill README §2); no orange, no gradients, no Inter.

## Design source of truth (until phase 7 replaces it with docs/brand.md)

- `.claude/skills/nicolas-mateo-design/README.md` — master spec
- `.claude/skills/nicolas-mateo-design/prototype/site-b/PortraitScreens.jsx` — exact grids and inline styles (never run the prototype's `index.html`)
- `.claude/skills/nicolas-mateo-design/prototype/data.js` — every content string, keyed by lens
- `.claude/skills/nicolas-mateo-design/design-system/tokens/*.css` — token values
- `.claude/skills/nicolas-mateo-design/design-system/BRAND-GUIDE.md` — voice and visual law; read before writing any copy
