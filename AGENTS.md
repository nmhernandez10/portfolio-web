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
  content/{types,profile,sections,contact}.ts  data, page manifest, form contract; index.ts barrel
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
- `src/sections/` is `.astro`. A section file is `.tsx` only if it is, or becomes, a hydrated island — today that is `SiteThemeToggle.tsx` (phase 4, `client:load`) and `ContactForm.tsx` (phase 5, `client:visible`). This keeps every section free to host an island without restructuring, and makes shipping JS by accident impossible.
- The UI kit styles itself inline and is never forked. Section layout lives in `src/styles/sections.css` behind class hooks, so phase 6 can add media queries without `!important`.
- Breakpoints live in `src/styles/global.css`, below the `@import` block and in descending order — `< 960px` then `< 720px`. `< 960px` is narrow mode: the grids fold to one column **and** the header nav moves behind the menu button, because the desktop header measures 915px wide (wordmark 170 + nav 421 + actions 196 + gaps + gutters) and cannot survive to 720. One narrow-mode boundary, not two. That file is last in the cascade, so equal-specificity rules beat `sections.css`; the order between the two blocks is load-bearing, because several rules collide at equal specificity. Media queries group against base class hooks (`.skills-grid`, not both modifiers). Where the kit sets a property inline, a **token override** is the only lever — `--type-section-size`, `--gutter-lg`.
- A class hook always sits on a section-owned element, never on a kit component: Astro deletes `class` on framework components and the kit's frozen props have no `className`. Kit components take their own `style` prop instead (as the prototype does). This applies to **hiding** as much as to layout — the kit writes `display` inline, so a stylesheet `display: none` aimed at a kit component loses. Wrap it (`.site-header__resume` is the worked example).
- `BaseLayout` owns `<main id="main" tabindex="-1">` and pages fill the `header` / `footer` named slots. The skip link and its target live in one file on purpose: a page cannot ship without a main landmark, which is how `/kit` went three phases without one.

## Commands

- `pnpm dev` — dev server at `localhost:4321`
- `pnpm build` — production build to `dist/` (`dist/client` is the deployed asset directory)
- `pnpm preview` — serve the build
- `pnpm preview:worker` — build, then serve it from the real Worker runtime at `localhost:8787`
- `pnpm check` — `astro check && tsc --noEmit`
- `pnpm format` / `pnpm format:check` — Prettier write / verify
- `pnpm test:e2e` — build, then run the Playwright suite against it

## Testing

Two Playwright specs in `e2e/`, run against a real build on workerd via
`astro preview`. Keep them few and load-bearing: this suite guards the page's
static content, the two islands' behaviour, the contact endpoint and
accessibility — it is not chasing coverage.

- `e2e/smoke.spec.ts` — sections, theme toggle, résumés, endpoint, mobile menu.
- `e2e/a11y.spec.ts` — axe over `/` light, `/` dark and `/kit`, zero violations.
- Specs import from `src/content/` rather than restating ids, paths or topics,
  so a manifest change fails a test instead of drifting past a stale copy.
- axe scans run under `prefers-reduced-motion: reduce`. Without it `reveal.ts`
  leaves everything below the fold at `opacity: 0` and axe silently scans little
  more than the hero.
- **Tests never send real email.** Only the validation-failure and honeypot
  paths are exercised; both return before `send()`. CI writes a placeholder
  `RESEND_API_KEY` so the guarantee is environmental, not incidental.
- Browsers install explicitly (`pnpm exec playwright install chromium`) because
  pnpm's `allowBuilds` allowlist blocks Playwright's postinstall. Do not add
  `playwright` to that list.
- CI runs `pnpm exec playwright test` directly after its own `pnpm build`, so
  the build happens once; `pnpm test:e2e` builds first for local use.

## Git conventions

- Conventional Commits (`feat:`, `fix:`, `chore:`, `docs:`, `ci:`, `refactor:`); commit small.
- Work on `dev`; phases merge to `main` via PR with a **merge commit — never squash** (`dev` is long-lived; squashing causes phantom-diff conflicts).
- CI (`.github/workflows/ci.yml`, job id `ci`) is the quality gate: format check, `pnpm check`, build. It never deploys; Cloudflare Workers Builds deploys from git.
- Run `pnpm format` before every commit so new files pass the CI format gate.

## Deploy

GitHub Actions owns quality, Cloudflare owns delivery — Actions never deploys.

- Cloudflare **Workers Builds** deploys from git: `main` → production, every other branch and PR → a preview URL posted as a PR comment. Single Worker, `portfolio-web`.
- Build command `pnpm build`, deploy command `pnpm wrangler deploy`. Deploy reads the generated `dist/client/wrangler.json` (wrangler follows the redirect written to `.wrangler/deploy/config.json` at build time), so build before deploy.
- `wrangler.jsonc` holds `name`, `compatibility_date`, the contact `vars` and the `secrets.required` declaration — nothing else. `@astrojs/cloudflare` supplies `main`, the `ASSETS` binding and the asset directory — do not restate them.
- The adapter runs with `imageService: "compile"`, so `astro:assets` transforms run with sharp at build time and emit static files. Its default, `cloudflare-binding`, would defer every transform to a runtime Cloudflare Images binding and emit `/_image` URLs instead.
- Local loop: `pnpm preview:worker` (or `pnpm build && pnpm wrangler dev`) serves the built site from workerd at `localhost:8787`. `pnpm dev` also runs on workerd via the adapter's Vite plugin.
- After changing `wrangler.jsonc`, rerun `pnpm wrangler types` and commit `worker-configuration.d.ts`.

## Environment

Secrets are credentials, vars are configuration. Three keys, all consumed by `src/pages/api/contact.ts` — the only code in the repo that reads the environment.

| key              | deployed                                                  | local       |
| ---------------- | --------------------------------------------------------- | ----------- |
| `EMAIL_FROM`     | `vars` in `wrangler.jsonc`                                | `.dev.vars` |
| `EMAIL_TO`       | `vars` in `wrangler.jsonc`                                | `.dev.vars` |
| `RESEND_API_KEY` | Worker secret — `pnpm wrangler secret put RESEND_API_KEY` | `.dev.vars` |

- **Access is `import { env } from "cloudflare:workers"`.** `Astro.locals.runtime.env` was removed in `@astrojs/cloudflare` v14 and now throws at runtime; the type no longer carries it either, so `pnpm check` catches the mistake first.
- **Local setup**: create `.dev.vars` (gitignored) with all three keys. Quote `EMAIL_FROM` — the display-name form contains spaces and angle brackets. Both `pnpm dev` and `pnpm wrangler dev` read it, because dev runs on real workerd.
- `RESEND_API_KEY` is declared under `secrets.required` in `wrangler.jsonc` so `pnpm wrangler types` emits it without needing a `.dev.vars` present — CI has none. Rerun `wrangler types` after touching either block.
- `EMAIL_FROM` reaches Resend verbatim, so `user@domain` and `Name <user@domain>` are both valid. It must stay on the verified domain — Resend cannot send from the Gmail address.
- `EMAIL_TO` is the same inbox the contact rail advertises: it mirrors `profile.email` in `src/content/profile.ts`, and changing one without the other silently delivers to an inbox the page does not show. It stays a var (not an import) so environments can override the destination.
- **Never log message bodies or submitter emails.** Worker logs carry status codes and outcomes only.
- Preview versions share the production Worker's secrets, so the key stays a Resend test key until launch; rotation is a phase-7 task.

## Design laws (non-negotiable)

- Gold text is always `#A6762A` (`--gold-700`); `#E3B23C` is fill-only, never text. It measures 3.53–4.00 against the surfaces it lands on, under WCAG AA at the sizes it is used; the law wins, and `e2e/a11y.spec.ts` exempts exactly those nodes from axe's contrast rule and nothing else. Revisit in phase 7 with `docs/brand.md`.
- Three light-theme text roles were corrected to reach AA and are overridden in `global.css` under `:root:not([data-theme="dark"])`, not edited in `tokens/` (which stays byte-verbatim): `--text-muted` `#8B887C` → `#686559`, `--status-success` `#6F7A44` → `#5E6738`, `--status-danger` `#B0503A` → `#A54830`. Dark measures clean and is untouched. Scope any further override the same way — a bare `:root` in `global.css` out-orders `colors.css`'s `[data-theme="dark"]` block and silently breaks the dark theme.
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
