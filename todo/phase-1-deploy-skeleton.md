# Phase 1 — Deploy skeleton

> **Superseded 2026-08-22 — delivery moved to Cloudflare Pages (phase 6.1).** The locked "Not Pages" decision below was reversed with the user: Pages' separate preview/production environments (vars and secrets both) won over a single Worker's shared ones, accepting that Pages is feature-frozen. Tasks 5–7 were never completed — the dashboard Worker exists but is broken and unused; phase 6.1's Pages project replaces them and phase 6.2 deletes the Worker. The adapter/wrangler skeleton from tasks 1–4 is dismantled in 6.1. The open question below is mooted: the adapter is gone, and 6.2 checks whether the KV namespace was ever provisioned. This doc stays as the historical record.

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

1. [x] Add the adapter: `pnpm astro add cloudflare`. ~~In `astro.config.mjs` enable the platform proxy: `adapter: cloudflare({ platformProxy: { enabled: true } })`.~~ **Deviation (gotcha 11):** `@astrojs/cloudflare` v14.2.3 has no `platformProxy` option and no successor — its `Options` type is `imageService` / `sessionKVBindingName` / `imagesBindingName` / `prerenderEnvironment` / `experimental` plus a few `@cloudflare/vite-plugin` passthroughs. The adapter now runs the real `workerd` runtime in `astro dev` through that Vite plugin, so the proxy option is obsolete. Config is plain `cloudflare()`.
2. [x] **`wrangler.jsonc`**: worker `name: "portfolio-web"`, a current `compatibility_date` (`2026-08-15`, matching the installed `workerd@1.20260815.1`). **Deviation (gotcha 11):** no main/assets wiring is written by hand — v14 supplies `main`, the `ASSETS` binding and the asset directory itself, and emits the real deploy config to `dist/client/wrangler.json`. Because the site is fully static, that generated config has no `main` at all: it deploys as an assets-only Worker.
3. [x] Run `wrangler types`; commit the generated env type file (`worker-configuration.d.ts`). Wire `App.Locals` runtime typing per the adapter (`src/env.d.ts`). **Deviation (gotcha 11):** the pre-v14 `Runtime<Env>` generic is gone — `Runtime` is now `{ cfContext: ExecutionContext }` and the package ships the `App.Locals` declaration itself, so `src/env.d.ts` is one line: `/// <reference types="@astrojs/cloudflare/types.d.ts" />`.
4. [x] Local verification loop: `pnpm build && pnpm wrangler dev` serves the built site from the Worker at `localhost:8787`. Added as the `preview:worker` script — it earns its keep as the one-command loop every later phase verifies with.
5. [ ] `HUMAN:` in the Cloudflare dashboard: create the Worker via **Workers Builds** connected to `github.com/nmhernandez10/portfolio-web`:
   - Production branch: `main`. Build command: `pnpm build`. Deploy command: `pnpm wrangler deploy` (verified by `--dry-run`: wrangler follows the build-time redirect in `.wrangler/deploy/config.json` to `dist/client/wrangler.json`, so no `-c` flag is needed — but the deploy must run after the build, in the same workspace).
   - Enable **non-production branch builds** (preview URLs) and **PR comments**.
   - Confirm the build image respects `packageManager` (pnpm) and the Node version.
   - Note: the deploy provisions a `SESSION` KV namespace and an `IMAGES` binding — adapter defaults, not chosen here. See "Open question" below.
6. [ ] Push `dev`, open a PR — confirm the preview URL appears as a PR comment and serves the placeholder. Merge — confirm the production `*.workers.dev` URL updates.
7. [ ] Record both URLs in the `todo/README.md` status table. ~~Amend `CLAUDE.md`~~ `AGENTS.md` amended: new **Deploy** section (Workers Builds branch mapping, build/deploy commands, the generated-config rule, GH Actions never deploys) plus `preview:worker` in Commands. URLs still to record.

## Verification

- `pnpm build && pnpm wrangler dev` then `curl -sI localhost:8787` → `200` with HTML content-type.
- `curl -sI <production-url>` → `200`; page shows the placeholder.
- Preview URL from the PR comment serves the `dev` build.
- CI still green (the adapter must not break `astro check`/build).

## Gotchas

- The `@astrojs/cloudflare` + wrangler surface moves fast — trust `pnpm wrangler dev` and current docs over any field name written here.
- Preview versions of a single Worker **share the production Worker's secrets and vars**. Acceptable now (there are none); becomes relevant in phase 5 — the plan is a test Resend key until launch.
- `.wrangler/` must already be gitignored (phase 0); verify before committing.
- If Workers Builds and local wrangler versions drift, pin `wrangler` as a devDependency so builds are reproducible. Done: `wrangler` is a devDependency (it is also a peer dependency of the adapter).
- `pnpm` wanted to add `@astrojs/cloudflare@14.2.3` and `@astrojs/internal-helpers@0.10.4` to `minimumReleaseAgeExclude` during the install. Removed — the lockfile passes the supply-chain policy without the exclusions, and `AGENTS.md` forbids disabling that policy.
- `workerd` needs its postinstall script; it is allowlisted in `pnpm-workspace.yaml` alongside `esbuild`. Without it the install exits non-zero and `astro add` aborts before patching `astro.config.mjs`.
- The build output moved: static assets are now under `dist/client/` (`dist/server/` is empty while the site is fully static).

## Open question (for the phase 5 author, or sooner)

The adapter defaults every Astro session to Cloudflare KV, so the generated deploy config always carries `kv_namespaces: [{ binding: "SESSION" }]` and `images: { binding: "IMAGES" }`. On first deploy Cloudflare auto-provisions both, even though this site is static and phase 5's contact endpoint is a stateless POST that needs neither. Suppressing them means `session: false` and an `imageService` choice in `astro.config.mjs` — deliberately not done here, because it is a content decision beyond this phase's scope. Decide before the custom domain attaches in phase 7.

## Definition of Done

Inherited DoD, plus: production and preview URLs live, recorded in the status table, and both serving the current placeholder.

## Out of scope

Secrets, vars, the contact endpoint (phase 5). Custom domain, headers, caching rules (phase 7). Any UI.
