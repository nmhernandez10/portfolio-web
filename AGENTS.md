# AGENTS.md — nicolasmateo.dev

Personal portfolio for Nicolás Hernández: a one-page, static-first Astro 7 + React 19 site deployed to Cloudflare Pages, telling one story — Senior Backend Engineer & Feature Architect — across four numbered sections. This file is the canonical agent doc; `CLAUDE.md` only imports it.

## Workflow

Implementation runs phase by phase from `todo/`. Before any work: read `todo/README.md` and the current phase doc — decisions recorded there are locked and are not re-litigated. Each phase ends with a PR `dev` → `main` gated by the Definition of Done in `todo/README.md`. Steps marked `HUMAN:` need a dashboard or another human-only action: stop and ask, never guess.

## Stack

Astro 7 (latest, decided 2026-08-19, superseding the original "Astro 5" note), `@astrojs/react` (React 19), TypeScript strict, pnpm (via corepack), Node 24. No ESLint — `astro check` + `tsc --noEmit` + Prettier is the whole quality toolchain. Path alias `@/*` → `src/*`.

Note: pnpm's `minimumReleaseAge` supply-chain policy (24h) is active on this machine. If an install rejects fresh releases, resolve with `pnpm clean --lockfile && pnpm install` (age-aware resolution) — do not disable the policy.

That rebuild can add `minimumReleaseAgeExclude` entries to `pnpm-workspace.yaml`: when a package.json range only matches a release younger than the cutoff, pnpm grandfathers that exact version rather than downgrading it. Those entries are pnpm's own doing, not a policy override, and they stop being needed once the release ages past 24h — drop them on the next lockfile touch instead of letting them accumulate.

## Project map

Target layout — each line tagged with the phase that lands or removes it where that is still pending:

```
src/
  styles/tokens/*.css      7 token files
  styles/sections.css      page layout, one class block per page section
  styles/global.css        imports tokens in skill order, then sections + site utilities
  ui/{core,forms,navigation,content}/*.tsx   14 components (VC3); index.ts barrel
  content/{types,profile,sections,contact}.ts  data, page manifest, form contract; index.ts barrel
  sections/*.astro         one component per page section (+ the .tsx islands)
                           islands: SiteNav (VC3), ContactForm, WorkGrid (VC4)
  layouts/BaseLayout.astro head, fonts, theme script, reveal script
  pages/index.astro  kit.astro  404.astro (phase 7)
  scripts/reveal.ts        vanilla IntersectionObserver module
  assets/portrait.jpg      optimized via astro:assets
functions/api/contact.ts   the contact endpoint, as a Pages Function
public/
  icons/                   deleted in VC3 — the system ships no icons
  resume-backend.pdf  resume-fullstack.pdf
  favicon.svg  _headers    robots.txt + og.png land in phase 7
docs/brand.md              phase 7: brand laws migrated from the skill
```

### Layering rules

- Dependencies run one way: `pages → layouts → sections → {ui, content} → styles`. `src/ui/` never imports `src/content/`; `src/content/` holds data only — no React, no styling, no imports from `src/ui/`.
- `functions/` is the delivery layer outside `src/`. It may import `src/content` contract modules (data only) by **relative** path — the Pages Functions bundler follows relative imports repo-wide but resolves no aliases, so `@/content` cannot appear there — and never `src/ui`, `src/sections` or styles. Since 2026-08-23 `functions/` shares the root TypeScript program, which **does** define the `@/*` path, so an alias import there now typechecks and fails only at runtime: this rule is convention, not compiler-enforced. `pnpm test:e2e` is what catches it. Nothing in `src/` ever imports from `functions/`. Import the `content/contact` subpath, not the `@/content` barrel: the barrel re-exports the whole of `profile.ts`, and keeping the contract's only door a subpath is what makes it structurally impossible for the résumé to reach the browser bundle.
- `src/sections/` is `.astro`. A section file is `.tsx` only if it is, or becomes, a hydrated island — three of them: `SiteNav.tsx` (VC3, `client:load`) renders the kit `NavBar` and hosts both the theme toggle (plain React, since an island cannot hydrate inside another) and the résumé action through `NavBar`'s `action` prop; `ContactForm.tsx` (`client:visible`); `WorkGrid.tsx` (VC4, `client:visible`) owns the project cards and the drawer. This keeps every section free to host an island without restructuring, and makes shipping JS by accident impossible.
- The UI kit styles itself inline and is never forked. Section layout lives in `src/styles/sections.css` behind class hooks, so VC5 can add media queries without `!important`.
- Breakpoints live in `src/styles/global.css`, below the `@import` block and in descending order. **VC5 measures and documents them**: the kit defines desktop only (1280, zero media queries), and the new header — 15px brand, four 12px mono links, the theme pill and the résumé button — measures differently from the old one, so the boundary is re-derived there with its arithmetic recorded, not inherited. One narrow-mode boundary; a second, smaller step only if measurement demands it. What is fixed regardless: `global.css` is last in the cascade, so equal-specificity rules beat `sections.css` and the order between the two blocks is load-bearing; media queries group against base class hooks, not both modifiers; and where the kit sets a property inline, a **token override** is the only lever — `--section-y`, `--gutter`, never `!important` and never an edit inside `tokens/`.
- A class hook always sits on a section-owned element, never on a kit component: Astro deletes `class` on framework components and the kit's frozen props have no `className`. Kit components take their own `style` prop instead (as the skill's component JSX does). This applies to **hiding** as much as to layout — the kit writes `display` inline, so a stylesheet `display: none` aimed at a kit component loses. Wrap it — VC5's narrow mode, which hides one of the two nav presentations per side of the breakpoint, is where this bites.
- `BaseLayout` owns `<main id="main" tabindex="-1">` and pages fill the `header` / `footer` named slots. The skip link and its target live in one file on purpose: a page cannot ship without a main landmark, which is how `/kit` went three phases without one.

## Commands

- `pnpm dev` — dev server at `localhost:4321`. Static only: it does **not** serve `/api/contact`, so submitting the form in dev 404s. UI work is unaffected; the endpoint loop is `pnpm build && pnpm preview`.
- `pnpm build` — production build to `dist/`, a plain static directory
- `pnpm preview` — serve the last build from the real Pages runtime at `localhost:8788` (`wrangler pages dev`, which also runs `functions/`). Build first.
- `pnpm check` — `astro check && tsc --noEmit`
- `pnpm format` / `pnpm format:check` — Prettier write / verify
- `pnpm test:e2e` — build, then run the Playwright suite against it

## Testing

Two Playwright specs in `e2e/`, run against a real build on workerd via
`wrangler pages dev` — the same runtime Pages deploys to, so the Function is
exercised for real. Keep them few and load-bearing: this suite guards the page's
static content, the two islands' behaviour, the contact endpoint and
accessibility — it is not chasing coverage.

- `e2e/smoke.spec.ts` — sections, theme toggle, résumés, endpoint, mobile menu.
  The endpoint's method and origin gates are covered because phase 6.1
  hand-wrote them: Astro's `ALL` dispatch supplied the `405` and its origin-check
  middleware the `403`, and both left with the adapter.
- `e2e/a11y.spec.ts` — axe over `/` light, `/` dark and `/kit`, zero violations.
- Specs import from `src/content/` rather than restating ids, paths or topics,
  so a manifest change fails a test instead of drifting past a stale copy.
- axe scans run under `prefers-reduced-motion: reduce`. Without it `reveal.ts`
  leaves everything below the fold at `opacity: 0` and axe silently scans little
  more than the hero.
- **Tests never send real email.** Every endpoint case returns before `send()`:
  the two gates reject before the body is read, and the validation-failure and
  honeypot paths both stop short of it. CI writes a placeholder
  `RESEND_API_KEY` so the guarantee is environmental, not incidental.
- Browsers install explicitly (`pnpm exec playwright install chromium`) because
  pnpm's `allowBuilds` allowlist blocks Playwright's postinstall. Do not add
  `playwright` to that list.
- CI runs `pnpm exec playwright test` directly after its own `pnpm build`, so
  the build happens once; `pnpm test:e2e` builds first for local use.

## Git conventions

- Conventional Commits (`feat:`, `fix:`, `chore:`, `docs:`, `ci:`, `refactor:`); commit small.
- Work on `dev`; phases merge to `main` via PR with a **merge commit — never squash** (`dev` is long-lived; squashing causes phantom-diff conflicts).
- CI (`.github/workflows/ci.yml`, job id `ci`) is the quality gate: format check, `pnpm check`, build. It never deploys; Cloudflare Pages deploys from git.
- Run `pnpm format` before every commit so new files pass the CI format gate.

## Deploy

GitHub Actions owns quality, Cloudflare owns delivery — Actions never deploys.

- Cloudflare **Pages** deploys from git: `main` → production, every other branch and PR → a preview deployment with its own URL. Project `portfolio-web`. There is no adapter and no `wrangler deploy` — Pages builds and publishes from the repo.
- Build command `pnpm build`, output directory `dist`. The build is plain static; `functions/api/contact.ts` is picked up by Pages' file-based routing and invoked on `/api/contact` only.
- `wrangler.jsonc` is the Pages config and the source of truth for `name`, `pages_build_output_dir` and `compatibility_date`. `pages_build_output_dir` is what locks the dashboard's copies of those fields. It needs build system V2 or later.
- **It carries no `vars`.** The lock above is per-field, so any var named there stops being editable in the dashboard; all three environment keys therefore live in the dashboard instead (see Environment). No `env.production` / `env.preview` blocks either — `vars` is non-inheritable in Pages config, so an env block would have to restate every key.
- `public/_headers` owns response headers; it ships to `dist/_headers`. Today it carries the `/_astro/*` immutable-cache rule; phase 7 appends security headers to the same file.
- `sharp` is a direct dependency, not just astro's optional one. The static image service emits a chunk under `dist/` that does a bare `import("sharp")`, which under pnpm's strict layout resolves from the project root — where an optional transitive dep is not linked. Without it every `astro:assets` transform fails the build.
- Local loop: `pnpm preview` (`wrangler pages dev`) serves the built `dist/` plus `functions/` from workerd at `localhost:8788`. It watches `functions/` and its relative imports, so Function edits hot-reload; only static HTML changes need a rebuild.
- Do not leave a stale `.wrangler/deploy/config.json` around. `wrangler pages dev` resolves config through that redirect and **throws** if its target is missing rather than falling back — the adapter used to write one pointing into `dist/server/`.

## Environment

Secrets are credentials, vars are configuration. Three keys, all consumed by `functions/api/contact.ts` — the only code in the repo that reads the environment.

| key              | deployed                                             | local       |
| ---------------- | ---------------------------------------------------- | ----------- |
| `EMAIL_FROM`     | Pages variable, set per environment in the dashboard | `.dev.vars` |
| `EMAIL_TO`       | Pages variable, set per environment in the dashboard | `.dev.vars` |
| `RESEND_API_KEY` | Pages secret, set per environment in the dashboard   | `.dev.vars` |

- **Access is `context.env`**, the Pages Function's first argument — typed by a three-key `interface Env` colocated in the Function and passed to `send()`. Nothing imports the environment from a module; there is no ambient `env` on the Pages path.
- **Typing is hand-written, not generated.** A three-key `interface Env` and the handler's `RequestContext` are both written out in the Function. `functions/` shares the repo's one TypeScript program, so `Request` and `Response` come from the DOM lib there as they do in `src/`; the Function needs nothing workerd-specific. There is no `@cloudflare/workers-types` dependency, no `functions/tsconfig.json`, no `wrangler types` step and no `worker-configuration.d.ts` to commit — dropped 2026-08-23 in phase 6.2, superseding phase 6.1's split-project decision.
- **Local setup**: create `.dev.vars` (gitignored) with all three keys. Quote `EMAIL_FROM` — the display-name form contains spaces and angle brackets. `pnpm preview` reads it; `pnpm dev` does not, because `astro dev` no longer serves the endpoint at all.
- Every key is set twice in the dashboard — once for **Production**, once for **Preview** (Settings → Variables and Secrets). `RESEND_API_KEY` is type Secret; the two addresses are plain variables. Per-environment values are the reason this project moved to Pages.
- **A missing binding is caught, a wrong one is not.** `send()` returns early if any of the three is absent, logging that fact and nothing else, so the endpoint answers `502` with the brand-voice failure copy rather than an opaque Resend rejection. It cannot tell a typo'd address from a correct one.
- `EMAIL_FROM` reaches Resend verbatim, so `user@domain` and `Name <user@domain>` are both valid. It must stay on the verified domain — Resend cannot send from the Gmail address.
- `EMAIL_TO` is the same inbox the contact rail advertises: it mirrors `profile.email` in `src/content/profile.ts`, and changing one without the other silently delivers to an inbox the page does not show. Since 2026-08-23 the value lives only in the dashboard, so **nothing in the repo can flag that drift** — editing `profile.email` means editing both Pages environments too. It stays environment-driven (not an import) so environments can override the destination.
- **Never log message bodies or submitter emails.** Function logs carry status codes and outcomes only.
- Both environments keep a Resend test key until launch; production rotates to the live key in phase 7.

## Design laws (non-negotiable)

- **Clay is the only accent.** `--clay` `oklch(0.620 0.145 45)`, used on section ordinals, the active nav underline, one call-to-action per screen, and hover arrows. If clay appears three times in a viewport, remove one. Never introduce a new hue; never use a gradient.
- **Separation is 1px hairlines, not shadows.** `--line-1` for rules between content, `--line-2` for control borders. There are exactly three sanctioned shadows: `--shadow-md` on interactive-card hover, `--shadow-lg` behind the project drawer, and `--shadow-focus` as the focus ring. A card at rest has a border and no shadow.
- **Radii ladder**: containers 14px (`--radius-lg`), inputs 8px (`--radius-md`), small chips 4px (`--radius-sm`), controls and tags fully round (`--radius-pill`). Nothing else, and no exceptions. Buttons are never square.
- **No icons of any kind.** Typography carries every affordance: `→` for direction, JetBrains Mono ordinals for steps, an em dash for list markers, a 5px `currentColor` dot for status, `✕` beside the word "Close". No icon font, no SVG sprite, no emoji.
- **Three typefaces, one job each.** Newsreader Light 300 at `-0.022em` tracking — the name, section statements, stat figures; always light. Instrument Sans 400/500/600 — everything readable. JetBrains Mono — 12px/0.13em uppercase eyebrow labels, ordinals, tags, metadata. No Inter, no Space Grotesk. Fonts are self-hosted: the skill's `tokens/fonts.css` Google Fonts `@import` must never ship, so `grep -r "fonts.googleapis" dist/` stays empty in every phase that builds.
- **Surfaces alternate `--paper` and `--paper-sunk`** — no third background. Pure white (`--paper-raised`) only on cards and form fields; `--paper-inverse` at most once per page. Flat colour only: no imagery behind text, no patterns, no textures.
- **Both themes ship.** `data-theme="dark"` on `<html>`; every component reads the semantic aliases, so no component changes per theme. Contrast corrections are theme-scoped overrides in `global.css` — `:root:not([data-theme="dark"])` for light, `[data-theme="dark"]` for dark, each carrying its measured ratio in a comment. Never a bare `:root`, which out-orders `colors.css`'s dark block and silently breaks the dark theme, and never an edit inside `tokens/`, which stays byte-verbatim for the phase-7 parity diff.
- **Copy**: first person, sentence case, numbers not adjectives, no emoji, no exclamation marks, em dash with spaces, `·` separators, accents kept in _Bogotá_ / _Nicolás_. Banned words — _passionate_, _results-driven_, _world-class_, _cutting-edge_, _ninja_, _rockstar_, _seamless_. Section titles are short statements ending with a period; project copy is two sentences, the constraint then the outcome; "+" marks floors (200k+) and en dashes mark ranges (4–8). Applies to every string including form errors and the 404 page.
- **Content never depends on JS**: every section exists in static HTML.

## Design source of truth (until phase 7 replaces it with docs/brand.md)

The skill governs every visual and behavioural number. Where the repo deliberately departs from it, the departure is recorded in `todo/visual-correction/README.md` § Locked decisions — nowhere else.

- `.claude/skills/nicolas-mateo-design/readme.md` — master spec: foundations, voice, iconography, component inventory
- `.claude/skills/nicolas-mateo-design/tokens/*.css` — token values; light `:root` plus the `[data-theme="dark"]` override
- `.claude/skills/nicolas-mateo-design/components/{core,forms,navigation,content}/` — the 14 components, each as `.jsx` + a frozen `.d.ts` + a `.prompt.md` carrying its usage laws
- `.claude/skills/nicolas-mateo-design/guidelines/*.card.html` — 18 specimen cards
- `.claude/skills/nicolas-mateo-design/ui_kits/portfolio/` — the composed page: section JSX, `data.js` (every content string), and `portfolio-reference.png` + `portfolio-dark-reference.png`. Never run the `index*.html` harnesses — they load React from unpkg.
