# AGENTS.md — nicolasmateo.dev

Personal portfolio for Nicolás Hernández: a one-page, static-first Astro 7 + React 19 site deployed to Cloudflare Pages, telling one story — Senior Backend Engineer & Feature Architect — across four numbered sections. This file is the canonical agent doc; `CLAUDE.md` only imports it.

## Workflow

Implementation runs phase by phase from `todo/`. Before any work: read `todo/README.md` and the current phase doc — decisions recorded there are locked and are not re-litigated. Each phase ends with a PR `dev` → `main` gated by the Definition of Done in `todo/README.md`. Steps marked `HUMAN:` need a dashboard or another human-only action: stop and ask, never guess.

## Stack

Astro 7 (latest, decided 2026-08-19, superseding the original "Astro 5" note), `@astrojs/react` (React 19), TypeScript strict, pnpm (via corepack), Node 24. Fonts are self-hosted through fontsource — `@fontsource-variable/newsreader`, `@fontsource-variable/instrument-sans` and `@fontsource-variable/jetbrains-mono` — which registers every family with a `Variable` suffix: `Newsreader Variable` (normal + `wght-italic.css`), `Instrument Sans Variable`, `JetBrains Mono Variable`. Space Grotesk left with the old system in VC3. No ESLint — `astro check` + `tsc --noEmit` + Prettier is the whole quality toolchain. Path alias `@/*` → `src/*`.

Note: pnpm's `minimumReleaseAge` supply-chain policy (24h) is active on this machine. If an install rejects fresh releases, resolve with `pnpm clean --lockfile && pnpm install` (age-aware resolution) — do not disable the policy.

That rebuild can add `minimumReleaseAgeExclude` entries to `pnpm-workspace.yaml`: when a package.json range only matches a release younger than the cutoff, pnpm grandfathers that exact version rather than downgrading it. Those entries are pnpm's own doing, not a policy override, and they stop being needed once the release ages past 24h — drop them on the next lockfile touch instead of letting them accumulate.

## Project map

Target layout — each line tagged with the phase that lands or removes it where that is still pending:

```
src/
  ui/{core,forms,navigation,content}/*.tsx   the 15 components; internal.ts + index.ts
  styles/tokens/*.css      7 token files, byte-verbatim from the skill
  styles/sections.css      page layout, one class block per page block
  styles/global.css        tokens in skill order, then sections.css, then the site layer
  content/{types,profile,sections,contact}.ts  data, page manifest, form contract; index.ts barrel
  sections/Section.astro   the block shell: anchor, surface, 1080px column, reveal hook
  sections/SectionIntro.astro  sectionMeta -> SectionHeader; the one owner of an ordinal
  sections/*.astro         one component per page block (+ the .tsx islands)
                           islands: SiteNav, ContactForm, WorkGrid (VC4)
  sections/SiteThemeToggle.tsx  the icon-free toggle; site chrome, not kit inventory
  sections/SiteNavMenu.tsx      the narrow-mode <details> nav; site chrome as well
  layouts/BaseLayout.astro head, fonts, theme script, reveal script
  layouts/ThemeScript.astro  the shared pre-paint theme script
  pages/index.astro  kit.astro  404.astro (phase 7)
  pages/_kit/              /kit's own Specimen.astro + NavBarSpecimen.tsx (not routed)
  scripts/reveal.ts        vanilla IntersectionObserver module
  assets/portrait.jpg      optimized via astro:assets
functions/api/contact.ts   the contact endpoint, as a Pages Function
public/
  resume-backend.pdf  resume-fullstack.pdf
  favicon.svg  _headers    robots.txt + og.png land in phase 7
docs/brand.md              phase 7: brand laws migrated from the skill
```

### Layering rules

- Dependencies run one way: `pages → layouts → sections → {ui, content} → styles`. `src/ui/` never imports `src/content/`; `src/content/` holds data only — no React, no styling, no imports from `src/ui/`.
- `functions/` is the delivery layer outside `src/`. It may import `src/content` contract modules (data only) by **relative** path — the Pages Functions bundler follows relative imports repo-wide but resolves no aliases, so `@/content` cannot appear there — and never `src/ui`, `src/sections` or styles. Since 2026-08-23 `functions/` shares the root TypeScript program, which **does** define the `@/*` path, so an alias import there now typechecks and fails only at runtime: this rule is convention, not compiler-enforced. `pnpm test:e2e` is what catches it. Nothing in `src/` ever imports from `functions/`. Import the `content/contact` subpath, not the `@/content` barrel: the barrel re-exports the whole of `profile.ts`, and keeping the contract's only door a subpath is what makes it structurally impossible for the résumé to reach the browser bundle.
- `src/sections/` is `.astro`. A section file is `.tsx` only if it is, or becomes, a hydrated island — three of them: `SiteNav.tsx` (`client:load`) renders the kit `NavBar` and hosts the theme toggle, the résumé action and the narrow-mode `SiteNavMenu` disclosure through `NavBar`'s `action` prop — all three plain React, since an island cannot hydrate inside another; `ContactForm.tsx` (`client:visible`); `WorkGrid.tsx` (VC4, `client:visible`) owns the project cards and the drawer. This keeps every section free to host an island without restructuring, and makes shipping JS by accident impossible.
- The UI kit styles itself inline and is never forked. Section layout lives in `src/styles/sections.css` behind class hooks, which is what lets the narrow-mode media query fold the page without one `!important`.
- **The drawer is a viewport-level layer, so `WorkGrid` portals it to `document.body`** rather than rendering it in place: `.reveal` puts a `transform` on `.section__inner` until a block has revealed, which would otherwise make the section the containing block for the drawer's `position: fixed` scrim and panel. The portal is the call site's decision, which is what lets `/kit` frame the same component inside `.drawer-frame`; `react-dom/server` cannot render portals, hence the island's mount flag. `<html>` carries `scrollbar-gutter: stable` for the same feature — the drawer locks body scroll, and without a reserved gutter the page shifts sideways behind the scrim.
- Breakpoints live in `src/styles/global.css`, below the `@import` block and in descending order. **There is exactly one: `width < 900px`**, measured against a real build and documented there with its arithmetic. The header is not what sets it — measured, the bar needs 691px on one line and hard-overflows at 616, so it is only a floor; 900 is where the hero copy column falls under ~41ch and a project card under 392px. Below 691 the brand wraps to two lines and the bar stays 63px, because two 15px lines measure the same as its 30px control row — which is what keeps `--nav-h` and `scroll-padding-top` honest. No second, smaller step: the stats survive 2-up to 320 (86px min-content against 120px available). Fixed regardless: `global.css` is last in the cascade, so equal-specificity rules beat `sections.css` and the order between the two blocks is load-bearing; media queries group against base class hooks, not both modifiers; and where the kit sets a property inline, the lever is a **custom property**, never `!important` and never an edit inside `tokens/` — either one the kit already reads (`--section-y`, `--gutter`), or, where it wrote a literal, one the call site injects through the component's own `style` prop with the kit's own value as the fallback (`--rail-cols` / `--rail-gap`, which fold `ExperienceItem` and `SkillGroup` from one `:root` declaration). That fallback is mandatory: an undefined `var()` is invalid at computed-value time and would collapse the grid.
- A class hook always sits on a section-owned element, never on a kit component: Astro deletes `class` on framework components and the kit's frozen props have no `className`. Kit components take their own `style` prop instead (as the skill's component JSX does). This applies to **hiding** as much as to layout — where a kit component writes `display` inline, a stylesheet `display: none` aimed at it loses, so it has to be wrapped. Narrow mode hides one of the two nav presentations per side of the breakpoint and needs both routes: `NavBar`'s item anchors set no inline `display`, so `.site-nav > div > a` reaches them directly, while `Button` does set one, so the résumé action is hidden through a `.site-nav__resume` wrapper. The couplings that selector depends on are recorded above it in `global.css`.
- **One design system, and the kit stays sealed.** `src/ui/` reaches it only through `var(--token)`: it imports nothing from `src/content`, `src/sections` or `src/styles`, and `src/ui/internal.ts` (its shared hooks and style constants) is not re-exported from the barrel. `grep -rn "oklch(" src/ui` stays empty — colour is referenced through custom properties or not at all. Both pages load `global.css`; the parallel `src/kit/` + `src/styles/redesign/` era ended in VC3.
- **A hydrated island may import only import-free content leaves** — `@/content/sections` and `@/content/contact`, both of which import nothing. Never the `@/content` barrel and never `@/content/profile`: the barrel re-exports the whole résumé, and `src/content/index.ts` records that keeping it out of the browser bundle is structural, not a matter of tree-shaking. Anything an island needs from `profile` crosses as a serialized prop from the `.astro` layer (`SiteNav` takes `brand` and `resumeHref` this way). A smoke test walks the page's transitive `/_astro/*.js` graph and fails if a profile-only string appears in it.
- **In-page navigation is CSS.** `global.css` gives `<html>` `scroll-padding-top: var(--nav-h)` (63px — `NavBar`'s `--space-4` padding twice, its 30px sm-control row, and its 1px hairline) and `scroll-behavior: smooth`, with a `prefers-reduced-motion` override to `auto`. `NavBar` is therefore left to render plain anchors — no `onNavigate` — so every in-page link lands correctly with or without JS and the URL hash follows the section. `SiteNav` owns scroll-spy and nothing else.
- The pre-paint theme script lives in `src/layouts/ThemeScript.astro`, rendered by `BaseLayout` — the one layout — so no page can drift on the `localStorage["theme"]` contract. It is `is:inline`, so it still cannot import — the key is repeated in `SiteThemeToggle` on purpose.
- `BaseLayout` owns `<main id="main" tabindex="-1">` and pages fill the `header` / `footer` named slots. The skip link and its target live in one file on purpose: a page cannot ship without a main landmark, which is how `/kit` went three phases without one.

## Commands

- `pnpm dev` — dev server at `localhost:4321`. Static only: it does **not** serve `/api/contact`, so submitting the form in dev 404s. UI work is unaffected; the endpoint loop is `pnpm build && pnpm preview`.
- `pnpm build` — production build to `dist/`, a plain static directory
- `pnpm preview` — serve the last build from the real Pages runtime at `localhost:8788` (`wrangler pages dev`, which also runs `functions/`). Build first.
- `pnpm check` — `astro check && tsc --noEmit`
- `pnpm format` / `pnpm format:check` — Prettier write / verify
- `pnpm test:e2e` — build, then run the Playwright suite against it

## Testing

Two Playwright specs in `e2e/`, plus `e2e/support.ts`, run against a real build
on workerd via `wrangler pages dev` — the same runtime Pages deploys to, so the
Function is exercised for real. Keep them few and load-bearing: this suite guards
the page's static content, the three islands' behaviour, the contact endpoint and
accessibility — it is not chasing coverage.

- `e2e/smoke.spec.ts` — sections, per-block content, theme toggle, résumé links,
  the endpoint, and the bundle canary that proves no island imports `profile`.
  Since VC4 it also covers the project drawer (its copy in the static page with
  JS off, opening, the three ways of closing, focus restored to the card), the
  nav behaviours VC3 shipped (`aria-current` scroll-spy, the scrolled hairline)
  and the contact form's two visible outcomes.
  The viewport sweep runs the full ladder — 1440 down to 320, both sides of the
  900px boundary — and asserts three things a step: no page overflow, no header
  overflow, and the bar still measuring `--nav-h`. The third is the real guard:
  the brand is meant to wrap to two lines at the narrow end, and a third line
  would move every in-page anchor by silently breaking `scroll-padding-top`.
  Two more cover the narrow nav: the disclosure carries every destination the
  bar drops, neither presentation is reachable beside the other, and it closes
  behind a navigation.
  The endpoint's method and origin gates are covered because phase 6.1
  hand-wrote them: Astro's `ALL` dispatch supplied the `405` and its origin-check
  middleware the `403`, and both left with the adapter.
- `e2e/a11y.spec.ts` — axe over `/` light, `/` dark, `/` with the drawer open in
  both themes, `/` narrow with the mobile menu open, and `/kit`; zero
  violations. The narrow scan exists because every other one runs at the 1280
  project default, where the mobile nav is `display: none` and so is never
  really scanned.
- `e2e/support.ts` — not a spec, two helpers. `openDrawer()` waits for
  `aria-haspopup` before it clicks a card, because `WorkGrid` is
  `client:visible` and a click landing before hydration follows the card's
  `href` to hidden markup instead. `openMenu()` waits for `data-enhanced` for
  the mirror-image reason: the disclosure opens with no JS at all, but the
  close-on-navigate listener is the island's, so a click landing before it
  navigates with the menu still open. Both specs use both, and neither should be
  able to forget a barrier.
- Specs import from `src/content/` rather than restating ids, paths or topics,
  so a manifest change fails a test instead of drifting past a stale copy.
- axe scans run under `prefers-reduced-motion: reduce`. Without it `reveal.ts`
  leaves everything below the fold at `opacity: 0` and axe silently scans little
  more than the hero.
- A closed drawer is off-screen by `transform`, not hidden, so Playwright calls
  it visible. Assert `getByRole("dialog")` counts instead: the panel carries the
  role only while it is open.
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

The skill governs every visual and behavioural number. Where the repo deliberately departs from it, the departure is recorded here — this file is the only record; the `todo/visual-correction/` phase docs that carried it were removed once the rebrand finished, and their full history is in git.

Four departures stand, all agreed with the user:

1. **Both themes ship**, on the skill's own `[data-theme="dark"]` mechanism, with an icon-free site-owned toggle — the new kit defines no `ThemeToggle`.
2. **The project drawer ships as an island**, with the accessibility the kit prototype lacks (Escape, focus trap and restore, `role="dialog"`, scroll lock).
3. **The contact contract is name / email / message** (+ honeypot); the design's topic select is dropped.
4. **Three things the design omits are kept**: the scroll-reveal animation, the GitHub links, and **both résumés — the full-stack PDF is the primary one** (nav action, hero CTA, footer link), with the backend PDF as a single extra footer link. The contact section lists no résumés, per the design.

Two working rules come with them: **copy has a single source** — every string, including the ones the kit hardcodes in its own JSX, lives in `src/content`, and section files render data rather than carrying prose — and **kit APIs are frozen, kit internals are not**: props, defaults and behaviour follow the `.d.ts` contracts exactly, but where the kit source repeats itself the port may extract a shared internal helper with byte-identical rendered output.

- `.claude/skills/nicolas-mateo-design/readme.md` — master spec: foundations, voice, iconography, component inventory
- `.claude/skills/nicolas-mateo-design/tokens/*.css` — token values; light `:root` plus the `[data-theme="dark"]` override
- `.claude/skills/nicolas-mateo-design/components/{core,forms,navigation,content}/` — the 14 components, each as `.jsx` + a frozen `.d.ts` + a `.prompt.md` carrying its usage laws
- `.claude/skills/nicolas-mateo-design/guidelines/*.card.html` — 18 specimen cards
- `.claude/skills/nicolas-mateo-design/ui_kits/portfolio/` — the composed page: section JSX, `data.js` (every content string), and `portfolio-reference.png` + `portfolio-dark-reference.png`. Never run the `index*.html` harnesses — they load React from unpkg.
