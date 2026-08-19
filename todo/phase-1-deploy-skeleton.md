# Phase 1 — Deploy skeleton

## Goal

The placeholder site is live on a `*.workers.dev` URL, deployed automatically: pushes to `main` deploy production, pushes to `dev` (and PRs) produce preview URLs. The delivery pipeline exists **before** any real UI does, so every later phase is verified on the real Workers runtime.

This is safe pre-launch: the production URL is an obscure `*.workers.dev` address until the custom domain attaches in phase 7 — "production" during the build is effectively staging.

## Decisions (locked)

- **Cloudflare Workers + static assets**, single Worker named `portfolio-web`. Not Pages.
- **Workers Builds does the deploys** (git-connected in the dashboard), not GitHub Actions.
  - _Rejected alternative — GH Actions `wrangler deploy`_: would let deploys hard-block on tests in one pipeline, but requires creating/storing/rotating a `CLOUDFLARE_API_TOKEN` in GitHub and hand-rolling preview URLs + PR comments that Workers Builds provides for free. Branch protection on `main` (CI must be green to merge) already prevents production deploying untested code. Split of responsibilities: **GitHub Actions owns quality, Cloudflare owns delivery.** Do not revisit.
- Astro stays `output: 'static'` (default); the `@astrojs/cloudflare` adapter is added now so the build already produces a Worker — phase 5 just flips one route to on-demand.
- Custom domain deferred to phase 7.

## Tasks

1. Add the adapter: `pnpm astro add cloudflare`. In `astro.config.mjs` enable the platform proxy: `adapter: cloudflare({ platformProxy: { enabled: true } })`.
2. **`wrangler.jsonc`**: worker `name: "portfolio-web"`, a current `compatibility_date`, and the main/assets wiring for an Astro-on-Workers static build. **Follow the current `@astrojs/cloudflare` README's Workers recipe exactly — do not improvise field names**; the adapter docs are the source of truth if they disagree with this doc (global gotcha 11).
3. Run `wrangler types`; commit the generated env type file. Wire `App.Locals` runtime typing per the adapter docs (`src/env.d.ts`).
4. Local verification loop: `pnpm build && pnpm wrangler dev` serves the built site from the Worker at `localhost:8787`. Add a `preview:worker` script for this if it earns its keep.
5. `HUMAN:` in the Cloudflare dashboard: create the Worker via **Workers Builds** connected to `github.com/nmhernandez10/portfolio-web`:
   - Production branch: `main`. Build command: `pnpm build`. Deploy command: per the Workers Builds Astro guide (usually `pnpm wrangler deploy`).
   - Enable **non-production branch builds** (preview URLs) and **PR comments**.
   - Confirm the build image respects `packageManager` (pnpm) and the Node version.
6. Push `dev`, open a PR — confirm the preview URL appears as a PR comment and serves the placeholder. Merge — confirm the production `*.workers.dev` URL updates.
7. Record both URLs in the `todo/README.md` status table. Amend `CLAUDE.md`: deploy model (Workers Builds, branch mapping), `wrangler dev` local loop, and that GH Actions never deploys.

## Verification

- `pnpm build && pnpm wrangler dev` then `curl -sI localhost:8787` → `200` with HTML content-type.
- `curl -sI <production-url>` → `200`; page shows the placeholder.
- Preview URL from the PR comment serves the `dev` build.
- CI still green (the adapter must not break `astro check`/build).

## Gotchas

- The `@astrojs/cloudflare` + wrangler surface moves fast — trust `pnpm wrangler dev` and current docs over any field name written here.
- Preview versions of a single Worker **share the production Worker's secrets and vars**. Acceptable now (there are none); becomes relevant in phase 5 — the plan is a test Resend key until launch.
- `.wrangler/` must already be gitignored (phase 0); verify before committing.
- If Workers Builds and local wrangler versions drift, pin `wrangler` as a devDependency so builds are reproducible.

## Definition of Done

Inherited DoD, plus: production and preview URLs live, recorded in the status table, and both serving the current placeholder.

## Out of scope

Secrets, vars, the contact endpoint (phase 5). Custom domain, headers, caching rules (phase 7). Any UI.
