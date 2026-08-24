# nicolasmateo.dev

Personal portfolio for Nicolás Hernández — a one-page, static-first site built
with Astro 7 and React 19, deployed to Cloudflare Pages.

Everything ships as static HTML except one route, `POST /api/contact` — a Pages
Function that hands the contact form to Resend. Two React islands hydrate: the
theme toggle and the contact form. Nothing else needs JavaScript to work.

## Prerequisites

- **Node 24** — the version is pinned in `.nvmrc`.
- **pnpm** — enable it with `corepack enable`; the version is pinned in
  `package.json`.

## First run

```sh
pnpm install
```

If you plan to run the end-to-end suite, also fetch the browser once. pnpm 11
blocks Playwright's postinstall, so the download is explicit:

```sh
pnpm exec playwright install chromium
```

### `.dev.vars`

The one manual step. The contact endpoint is the only code that reads the
environment, and it needs three keys. Create a `.dev.vars` in the repo root —
it is gitignored, so it never leaves your machine:

```sh
EMAIL_FROM="Nicolás Hernández <contact@nicolasmateo.dev>"
EMAIL_TO="you@example.com"
RESEND_API_KEY=re_your_test_key
```

- Quote `EMAIL_FROM` — the display-name form contains spaces and angle
  brackets. It reaches Resend verbatim and must stay on the verified domain.
- `EMAIL_FROM` and `EMAIL_TO` are also committed as `vars` in `wrangler.jsonc`;
  `.dev.vars` is what your local runs read.
- Use a Resend **test** key until launch. Deployed, the key is a Pages secret set
  separately for Production and Preview in the Cloudflare dashboard.
- `pnpm preview` reads this file, because it runs the real Pages runtime.
  `pnpm dev` does not — `astro dev` serves static output only, so submitting the
  form there 404s. Use `pnpm build && pnpm preview` to exercise the endpoint.

## Commands

| Command             | What it does and when you want it                                                                               |
| ------------------- | --------------------------------------------------------------------------------------------------------------- |
| `pnpm dev`          | Dev server on `localhost:4321`. The everyday loop — static only, no `/api/contact`.                             |
| `pnpm build`        | Production build to `dist/`, a plain static directory.                                                          |
| `pnpm preview`      | Serves the last build plus `functions/` on `localhost:8788`, on the real Pages runtime. Build first.            |
| `pnpm check`        | `astro check` + `tsc --noEmit` + `tsc -p functions`. There is no ESLint — this and Prettier are the whole gate. |
| `pnpm format`       | Prettier write. Run it before committing; CI checks formatting.                                                 |
| `pnpm format:check` | Prettier verify, the way CI runs it.                                                                            |
| `pnpm test:e2e`     | Builds, then runs the Playwright suite against the build.                                                       |

## Tests

Two specs in `e2e/`, deliberately few:

- `smoke.spec.ts` — the static page, the theme toggle, the résumés, the contact
  endpoint's safe paths and its method and origin gates, and the mobile menu.
- `a11y.spec.ts` — axe over `/` in both themes and over `/kit`.

**Tests never send real email.** Every endpoint case exercised returns before the
code that talks to Resend: the method and origin gates reject before the body is
read, and a validation failure and a filled honeypot both stop short of it. CI
additionally writes a placeholder `RESEND_API_KEY`, so a mistake cannot reach a
real inbox.

## Layout

```
src/
  content/    data only — profile, section manifest, form contract
  ui/         the design-system kit: 20 components, self-styled, frozen API
  sections/   one component per page section, plus the two islands
  layouts/    BaseLayout — head, fonts, theme script, main landmark
  pages/      index.astro · kit.astro
  styles/     tokens/, sections.css (page layout), global.css (entry + breakpoints)
  scripts/    reveal.ts, the scroll-reveal observer
functions/    api/contact.ts — the contact endpoint, as a Pages Function
public/       icons, résumés, favicon, _headers
```

Dependencies run one way: `pages → layouts → sections → {ui, content} → styles`.
`src/ui/` never imports `src/content/`. `functions/` sits outside `src/` and may
import `src/content` contract modules by relative path — nothing else, and never
the reverse.

Visit **`/kit`** in dev for the live component inventory — every component in
every variant its props allow, in both themes.

## Deploy

GitHub Actions owns quality, Cloudflare owns delivery.

- Actions (`.github/workflows/ci.yml`) runs format, typecheck, build and the e2e
  suite. It never deploys.
- Cloudflare **Pages** deploys from git: `main` → production, every other branch
  and PR → its own preview URL. Production and preview carry separate vars and
  secrets, which is why the site is on Pages.

## Further reading

- **`AGENTS.md`** — conventions, design laws, environment and deploy detail.
  It is the canonical contributor doc; this README is the short path to running.
- **`todo/`** — the phase-by-phase implementation plan.
