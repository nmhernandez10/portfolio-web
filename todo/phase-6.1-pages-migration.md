# Phase 6.1 — Pages migration

## Goal

The site serves from Cloudflare Pages: a plain static `dist/` plus one hand-written Pages Function, deployed by Pages git integration — `main` → production, every other branch → preview, each environment with its own vars and secrets. The `@astrojs/cloudflare` adapter is removed; `astro build` emits a plain static site and nothing Workers-shaped remains in the build.

## Decisions (locked)

- **Cloudflare Pages via git integration, adapter-less** — decided with the user 2026-08-22, reversing phase 1's "Not Pages" (supersession note under that doc's H1). The motivation is Pages' separate preview/production environments, vars and secrets both; the feature freeze (Cloudflare recommends Workers for new projects) is accepted knowingly. Adapter-less is not a preference but the only Pages path: `@astrojs/cloudflare` dropped Pages support in v13 and Astro 7 requires v14.
  - _Rejected alternative — stay on Workers and split environments with wrangler `env` blocks_: keeps the platform Cloudflare invests in, but doubles Worker config, hand-rolls the preview story, and keeps the complexity that motivated the change.
  - _Rejected alternative — downgrade to Astro 5 for `@astrojs/cloudflare` v12, the last Pages-capable line_: an unmaintained adapter two Astro majors back; contradicts the locked latest-of-everything decision. Do not revisit.
- **The endpoint is `functions/api/contact.ts`** — a hand-written Pages Function; `src/pages/api/contact.ts` is deleted. One `export const onRequest: PagesFunction<Env>` that gates method (`405` + `Allow: POST` — deterministic, unlike Pages' asset fall-through for files exporting only `onRequestPost`), then origin, then the existing parse → honeypot → validate → send pipeline, ported verbatim. `send()` takes `env` as a parameter; env access is `context.env`, never `cloudflare:workers` (a Workers-only module). Never log message bodies or submitter emails.
- **The form contract stays in `src/content/contact.ts`**, imported relatively (`../../src/content/contact`) — the Pages Functions bundler follows relative imports repo-wide but supports no aliasing, so `@/content` cannot appear in `functions/`. Subpath import, not the barrel (the barrel pulls in `profile.ts`). New layering rule (task 11): `functions/` is the delivery layer outside `src/` — it may import `src/content` contract modules (data only), never `src/ui`, `src/sections`, or styles. _Rejected — duplicating the constants into `functions/`_: topic-allowlist drift between the Select and the validator is exactly the silent failure the shared module prevents.
- **The origin check is hand-implemented.** Astro's `security.checkOrigin` applied only to adapter-served on-demand routes and disappears with the adapter. The Function replicates its semantics (phase 5, deviation 5): when content-type is form-like (`application/x-www-form-urlencoded`, `multipart/form-data`, `text/plain`) or missing, `Origin` must equal the request origin, else `403`. `application/json` stays exempt — the e2e JSON contract is unchanged by construction. Do not "harden" the JSON path.
- **Typing is hand-written, not generated**: a three-key `interface Env` colocated in the Function, `@cloudflare/workers-types` as a devDependency, and a dedicated `functions/tsconfig.json` (`strict`, `noEmit`, `moduleResolution: "Bundler"`, `lib: ["ESNext"]`, `types: ["@cloudflare/workers-types"]`). Root `tsconfig.json` excludes `functions/` — workers globals conflict with the DOM lib the site needs. `check` becomes `astro check && tsc --noEmit && tsc -p functions`. _Rejected — committing `wrangler types` output_: 15k generated lines for three keys, and its CI determinism relied on `secrets.required`, a Workers-only config field that dies in this phase. Do not revisit.
- **`wrangler.jsonc` becomes the Pages config and the source of truth** (`pages_build_output_dir` locks the dashboard's copies of these fields): `name`, `pages_build_output_dir: "./dist"`, `compatibility_date`, top-level `vars` for `EMAIL_FROM`/`EMAIL_TO` (applies to both environments). No `env.production`/`env.preview` blocks until values actually diverge. `secrets.required` is Workers-only and goes; `RESEND_API_KEY` becomes a Pages secret set per environment in the dashboard, `.dev.vars` locally.
- **`public/_headers` owns response headers**, starting with the rule the adapter used to inject (`/_astro/*` → immutable caching). Phase 7 appends security headers to this same file.
- **`wrangler pages dev` on 8788 replaces both `astro preview` and `preview:worker`** as the `preview` script (bare — the output directory comes from the config). `astro preview` cannot serve the Function, so it verifies nothing `astro dev` doesn't.

## Tasks

1. [x] **Function**: create `functions/api/contact.ts` — port `src/pages/api/contact.ts` (helpers and pipeline verbatim; drop `prerender`, `APIRoute` and the `ALL` export; add the method gate, the origin gate, the colocated `Env` and `onRequest`); import `CONTACT_TOPICS` / `CONTACT_MESSAGE_MAX` / `CONTACT_ERRORS` from `../../src/content/contact`. Delete `src/pages/api/contact.ts`.
2. [x] **Adapter removal**: `pnpm remove @astrojs/cloudflare`; in `astro.config.mjs` drop the import, the `adapter` key and its comment block (`imageService: "compile"` becomes moot — sharp at build time is plain Astro's static default); delete `src/env.d.ts` and `worker-configuration.d.ts`; drop the `worker-configuration.d.ts` block from `.prettierignore`.
3. [x] **`wrangler.jsonc` rewrite** per the locked shape. Keep the `EMAIL_FROM`/`EMAIL_TO` comments (verbatim-to-Resend, mirrors `profile.email`); the secrets comment now points at per-environment dashboard secrets plus `.dev.vars`.
4. [x] **Typing**: `pnpm add -D @cloudflare/workers-types`; create `functions/tsconfig.json`; add `"functions"` to root `tsconfig.json` `exclude`; `check` script → `astro check && tsc --noEmit && tsc -p functions`.
5. [x] **`public/_headers`**: `/_astro/*` → `Cache-Control: public, max-age=31536000, immutable`.
6. [x] **Scripts and harness**: `preview` → `wrangler pages dev`; delete `preview:worker` (`dev`, `build`, `test:e2e` unchanged). `playwright.config.ts`: `BASE_URL` → `http://localhost:8788`; drop the `ASTRO_PREVIEW_BACKGROUND` env (it was `astro preview`-specific); rewrite the server comments. `.github/workflows/ci.yml`: mechanism unchanged (build → placeholder `.dev.vars` → Playwright); update the placeholder-step comment that cites `secrets.required` — the guarantee now rests on `wrangler pages dev` reading `.dev.vars` and both exercised paths returning before `send()`. Job id `ci` is a required check — never rename it.
7. [x] **Local verification loop**: `pnpm check`; `pnpm build` and inspect `dist/`; `pnpm preview`; run the curl matrix from Verification; `pnpm test:e2e`.
8. [ ] `HUMAN:` in the Cloudflare dashboard (walkthrough per the 2026-08 docs; exact labels drift — gotcha 11 applies):
   1. **Pause the broken Worker first**: **Workers & Pages** → the `portfolio-web` Worker → its settings → disconnect (or pause) the Workers Builds git connection, so nothing races the Pages builds. Deletion is phase 6.2. If step 3 refuses the project name because the Worker holds it, stop and ask.
   2. **Start the project**: **Workers & Pages** → **Create application** → the **Pages** tab → **Connect to Git**. The dashboard steers new projects toward Workers — picking Pages here is deliberate, not a wrong turn.
   3. **Connect GitHub**: sign in, **Install & Authorize** the Cloudflare Pages GitHub App for this repository (this authorization is also what surfaces preview URLs on PRs), select the repo, **Begin setup**.
   4. **Set up builds and deployments**: project name `portfolio-web` (becomes `portfolio-web.pages.dev`), production branch `main`. Framework preset: Astro, or None — the preset only prefills the next two fields and has no runtime effect; what matters is their final values: build command `pnpm build`, build output directory `dist`, root directory blank. Skip the setup page's "Environment variables (optional)" section: vars are versioned in `wrangler.jsonc`, and the secret is set per environment in step 6.
   5. **Save and Deploy**, then read the first build log: confirm it honors `.nvmrc` (Node 24) and `packageManager` (pnpm 11) — set `NODE_VERSION`/`PNPM_VERSION` env vars only if it doesn't — and that the build system is V2 or later, which the `wrangler.jsonc` Pages config requires.
   6. **Secret, both environments**: project → **Settings** → **Variables and Secrets** → add `RESEND_API_KEY` (test key) as type **Secret** (encrypted), once for **Production** and once for **Preview**.
   7. **Branch control**: **Settings** → **Builds** → confirm production branch `main` and preview builds enabled for all non-production branches.
   8. Expect that first production build (step 5) to fail or deploy the wrong shape until the PR merges — `main` still carries the adapter and emits `dist/client`. The `dev` preview build must go green.
9. [ ] **Preview validation**: push `dev`; confirm the branch alias `dev.portfolio-web.pages.dev` and the per-commit URL; re-run the safe matrix rows plus **one real send** against the preview URL (closes phase 5's outstanding preview-delivery item); confirm previews carry `X-Robots-Tag: noindex`.
10. [ ] **Cutover**: PR `dev → main` titled `Phase 6.1: Pages migration`; merge (merge commit); confirm `portfolio-web.pages.dev` serves production; record both URLs in the status table.
11. [x] **Amend `CLAUDE.md`** (= `AGENTS.md`) **and `README.md`**: Stack (adapter gone); Project map (`functions/api/contact.ts` and `public/_headers` in, `api/contact.ts` out of `pages/`); Layering rules (the `functions/` rule from the decisions); Commands (`preview` = `wrangler pages dev` at 8788, `preview:worker` gone, `dev` no longer serves `/api/contact`); Testing (server wording); Deploy rewritten for Pages git integration — this also kills the stale `dist/client/wrangler.json` claim; Environment (access is `context.env`, `RESEND_API_KEY` = per-environment Pages secret, the `cloudflare:workers` and `wrangler types` rules dropped). README mirrors: command table, `.dev.vars` section, Deploy.

## Verification

- `pnpm check` → clean across all three checkers (the root project must not see `functions/`).
- `pnpm build` → `dist/index.html` exists; no `dist/client` or `dist/server`; `dist/_headers` carries the immutable rule; portrait avif/webp/jpg still emitted; `grep -r "fonts.googleapis" dist/` empty; `grep -ril "resend" dist/` empty.
- `pnpm preview`, then against `localhost:8788` (form rows need `-H "Origin: http://localhost:8788"`):
  - JSON, missing email → `400` with `errors.email`.
  - JSON, honeypot filled → `200` `{"ok":true}`, nothing sent.
  - `GET /api/contact` → `405` with `Allow: POST`.
  - form-encoded with Origin → `303` to `/?sent=1#contact`.
  - form-encoded without Origin → `403` — the hand-written CSRF gate works.
- `pnpm test:e2e` green against the Pages runtime.
- `git grep -l "cloudflare:workers\|@astrojs/cloudflare"` → hits only in `todo/`.
- Preview URL: safe rows plus one real delivery received. Production URL `200` after the merge.

## Gotchas

- **`vars` is non-inheritable in Pages config**: an `env.production`/`env.preview` block must restate every var — a partial override silently drops keys. Hence no env blocks until values diverge.
- **Per-environment secrets via CLI are unverified**: `wrangler pages secret put` documents only `--project-name`. Use the dashboard for the Preview secret; verify against current docs, don't assume.
- **`.dev.vars` vs config-`vars` merge semantics under `wrangler pages dev` are unverified.** CI writes only `RESEND_API_KEY`; harmless either way — the two e2e paths return before `send()` and never read `EMAIL_*`.
- **`astro dev` no longer serves `/api/contact`** — submitting the form in dev 404s; UI work is unaffected. The endpoint loop is `pnpm build && pnpm preview`; `wrangler pages dev` watches `functions/` and its relative imports, so Function edits hot-reload — only static HTML changes need a rebuild. The old `pages dev` proxy mode is deprecated; do not reach for it.
- **sharp**: ~~the adapter's `imageService: "compile"` already ran sharp, so nothing new installs~~ — **wrong, corrected 2026-08-23**. Adapter-less, Astro's static image service emits `dist/.prerender/chunks/sharp_*.mjs` containing a bare `import("sharp")`, resolved from `dist/` — i.e. from the project root, where pnpm's strict layout does not link astro's _optional_ transitive sharp. Every `astro:assets` transform failed the build with `MissingSharp`. Fix, and the one Astro's own error prescribes: `sharp` is now a direct `dependency`. No postinstall allowlist was needed (0.35 ships prebuilt `@img/*` binaries). Verify the portrait output in the first CI and Pages builds.
- **Delete `.wrangler/` when the adapter goes.** The adapter wrote `.wrangler/deploy/config.json` redirecting wrangler to `dist/server/wrangler.json`, which the adapter-less build no longer emits. `wrangler pages dev` resolves config through that redirect (`useRedirectIfAvailable: true`) and **throws** when the target is missing rather than falling back, so the first `pnpm preview` dies before binding 8788, naming a file nobody edited. Nothing regenerates it once the adapter is gone, so deleting it once is permanent. CI never sees this — fresh checkout, no `.wrangler`. Clearing `.astro/` at the same time avoids a stale reference to the uninstalled adapter's types.
- **Function invocation scope**: file-based routing should invoke the Function only on `/api/contact`. Check the deployment detail's routes; add a `_routes.json` limiting `include` to `/api/*` only if it shows a catch-all — verify first, don't preempt.
- **Pages PR comments are unconfirmed** — the GitHub check annotation carrying the preview URL is the contract.
- Previews send `X-Robots-Tag: noindex` — correct pre-launch; the phase 7 Lighthouse note covers the SEO implication.
- `wrangler` stays a devDependency (`pages dev`, `pages secret`) and `workerd` stays in `allowBuilds` (`pages dev` runs it) — update the `pnpm-workspace.yaml` comment.

## Definition of Done

Inherited DoD, plus: production and preview both serving from Pages with URLs in the status table; one real delivery from the preview URL; curl matrix green on 8788 including the `403` row; no `@astrojs/cloudflare` or `cloudflare:workers` reference outside `todo/` history.

## Out of scope

Deleting the Worker and account teardown (phase 6.2). Custom domain, security headers, key rotation, Lighthouse (phase 7). Turnstile. Any UI change.
