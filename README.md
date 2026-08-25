# nicolasmateo.dev

Personal portfolio for Nicolás Hernández — a one-page, static-first site built with Astro 7 and
React 19, deployed to Cloudflare Pages at **[nicolasmateo.dev](https://nicolasmateo.dev)**.

Everything ships as static HTML except one route, `POST /api/contact` — a Pages Function that
hands the contact form to Resend. Three React islands hydrate: the header nav, the contact form
and the project grid. Nothing else needs JavaScript to work.

## Quickstart

**Node 24**, pinned in `.nvmrc`.

```sh
npm install
npx playwright install chromium   # only if you will run the e2e suite
```

Playwright ships no install script, so `npm install` fetches no browser and the runner does not
self-heal — it fails with "Executable doesn't exist" until you run that second line.

### `.dev.vars`

The one manual step. The contact endpoint is the only code that reads the environment, and it
needs three keys. Create `.dev.vars` in the repo root — it is gitignored, so it never leaves your
machine:

```sh
EMAIL_FROM="Nicolás Hernández <contact@nicolasmateo.dev>"
EMAIL_TO="you@example.com"
RESEND_API_KEY=re_your_test_key
```

Quote `EMAIL_FROM` — the display-name form contains spaces and angle brackets. Use a Resend
**test** key locally. `npm run preview` reads this file; `npm run dev` does not, because
`astro dev` serves static output only and the form 404s there. Deployed values live in the
Cloudflare dashboard, per environment — see [operations](docs/operations.md#environment).

## Commands

| Command                | What it does                                                                                        |
| ---------------------- | --------------------------------------------------------------------------------------------------- |
| `npm run dev`          | dev server on `localhost:4321`. The everyday loop — static only, no `/api/contact`                  |
| `npm run build`        | production build to `dist/`, a plain static directory                                               |
| `npm run preview`      | serves the last build plus `functions/` on `localhost:8788`, on the real Pages runtime. Build first |
| `npm run check`        | `astro check` + `tsc --noEmit`. There is no ESLint — this and Prettier are the whole gate           |
| `npm run format`       | Prettier write. Run it before committing; CI checks formatting                                      |
| `npm run format:check` | Prettier verify, the way CI runs it                                                                 |
| `npm run test:e2e`     | builds, then runs the Playwright suite against that build                                           |

To exercise the endpoint locally: `npm run build && npm run preview`.

## Where things live

```
src/
  content/    data and contracts — profile, section manifest, form contract, JSON-LD
  ui/         the design-system kit: 15 components, self-styled, frozen API
  sections/   one component per page section, plus the three islands
  layouts/    BaseLayout — head, fonts, theme script, main landmark
  pages/      index.astro · kit.astro · 404.astro · robots.txt.ts
  styles/     tokens/, sections.css (page layout), global.css (entry + breakpoint)
  scripts/    reveal.ts and theme.ts — import-free browser behaviour
functions/    api/contact.ts — the contact endpoint, as a Pages Function
public/       résumés, favicon, og.png, _headers
```

Visit **`/kit`** in dev for the live component inventory — every component in every variant its
props allow, in both themes.

## Documentation

| Doc                                            | Owns                                                 |
| ---------------------------------------------- | ---------------------------------------------------- |
| [`AGENTS.md`](AGENTS.md)                       | the rules: layering, design laws, the quality gate   |
| [`docs/architecture.md`](docs/architecture.md) | layers, islands, the request flow, the stylesheet    |
| [`docs/brand.md`](docs/brand.md)               | the design reference: tokens, voice, the visual laws |
| [`docs/operations.md`](docs/operations.md)     | environment, deploy, budgets, the release runbook    |
| [`docs/testing.md`](docs/testing.md)           | the e2e suite and the traps in it                    |
| [`docs/decisions.md`](docs/decisions.md)       | the dated record of what replaced what               |
