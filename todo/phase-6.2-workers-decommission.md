# Phase 6.2 — Workers decommission

## Goal

Nothing Workers-shaped remains — in the Cloudflare account or in the repo's living docs. Pages is the only delivery path and every doc says so.

## Decisions (locked)

- **Delete, don't pause.** After 6.1 the repo can no longer build a Worker, so the broken `portfolio-web` Worker is not a rollback path — only an orphan serving nothing. _Rejected alternative — keeping it as a fallback_: a fallback you cannot redeploy is a liability, not a net. Do not revisit.
- **Cleanup is grep-driven, judged hit-by-hit.** `wrangler` (devDependency, the `preview` script) and `workerd` (`allowBuilds`) legitimately survive; `todo/` history gets dated amendments, never rewrites.
- **The production cutover is deferred** — decided with the user 2026-08-23. `main` stays at `64f539a` until design and content are approved; `dev`/preview is the working target until then. This is why task 1 could not run and why 6.1 tasks 9–10 remain open. It also defers 6.1's DoD, not just this phase's.
- **The split TypeScript project is collapsed** — decided with the user 2026-08-23, reversing phase 6.1's decision 15 / task 4. Prompted by comparing this repo against `../landing-webpage`, a working deployed Pages project that types its Function against the DOM lib and keeps one tsconfig. `PagesFunction<Env>` was the single workerd-specific type in `functions/api/contact.ts`; everything else it uses (`Request`, `Response`, `FormData`, `URL`, `fetch`, `AbortSignal.timeout`, `console`) is DOM/ES. So `@cloudflare/workers-types`, `functions/tsconfig.json` and the `tsc -p functions` checker are gone, the root `tsconfig.json` no longer excludes `functions/`, and the handler's context is a written-out `RequestContext` interface. _Rejected — keeping the second project for the alias guard_: see the accepted trade below; one file does not earn a whole TypeScript project.
- **`EMAIL_FROM` / `EMAIL_TO` move to the dashboard** — decided with the user 2026-08-23, reversing phase 6.1's decision 16 / task 3 and phase 5's "versioned, reviewable" framing. Naming a var in `wrangler.jsonc` locks the dashboard's copy of it, which is per-field ("you can not edit **the same fields** in the dashboard"), so the `vars` block is removed and both addresses become per-environment Pages variables. `wrangler.jsonc` keeps `name`, `pages_build_output_dir` and `compatibility_date`, so `pnpm preview` still needs no directory argument. _Rejected — dropping `wrangler.jsonc` entirely_ (as `../landing-webpage` does): `compatibility_date` stops being pinned in git and `preview` grows an argument.

## Tasks

1. [ ] **Soak check**: production `portfolio-web.pages.dev` green since the 6.1 merge; re-run the safe matrix rows (missing-email `400`, honeypot `200`, `GET` `405`, no-Origin `403`) against production.
   - **Gated, not skipped (2026-08-23).** There has been no 6.1 merge: `origin/main` is at `64f539a`, `origin/dev` at `86411a2`, and the cutover is deferred by the decision above. There is no production build of this site to soak. Re-run this against production when 6.1 task 10 finally lands — and against the project's _real_ URL, per the gotcha below. The local equivalent ran green (see Verification).
2. [ ] `HUMAN:` in the Cloudflare dashboard:
   - Delete the Workers Builds connection and the Worker `portfolio-web`.
   - Check **Storage & Databases** for an auto-provisioned `SESSION` KV namespace — it outlives the Worker; delete it if present. Either way this closes phase 1's open question.
   - Confirm no Worker-scoped secrets remain.
   - **Not run — human-only.** `wrangler whoami` reports no local authentication, so this cannot be done from an implementation session. Phase 1's open question stays open until the KV outcome is reported; its closing amendment is written then.
   - **Also needed before the next push** (from the vars decision): add `EMAIL_FROM` and `EMAIL_TO` as plain variables under **Settings → Variables and Secrets**, once for **Production** and once for **Preview**. Values are the ones this phase removed from `wrangler.jsonc`: `Nicolás Hernández <contact@nicolasmateo.dev>` and `nm.hernandez1996@gmail.com`. Pushing first means the next preview deploy sends with undefined addresses.
3. [x] **Repo sweep**: `git grep -in "worker\|wrangler deploy\|8787\|dist/client\|workers.dev"` — fix every living-doc hit, record the sanctioned-survivors list in this doc, add dated amendments to any misleading phase-doc statement found.
   - **The sweep required no living-doc corrections.** Every hit outside `todo/` was already accurate — 6.1 task 11 had done that work. `pnpm-workspace.yaml`'s workerd comment already read "used by wrangler pages dev". Recording that is the finding; the survivors list below is the deliverable. The living-doc edits this phase _did_ make come from the two decisions above, not from the sweep.
   - Dated amendments written to `phase-3` (build paths), `phase-4` (JS baseline), `phase-5` (three inline: the vars decision, its task 2, the Turnstile appendix) and `phase-6.1` (both reversals, enumerated by line).
4. [x] **Local state**: `rm -rf .wrangler/` once. It held only miniflare cache and observability state; the adapter's `deploy/config.json` was already gone. `wrangler pages dev` recreated its own on the next `pnpm preview`. `.gitignore`'s `.wrangler/` and `.dev.vars` entries stay — both still earned.
5. [x] Amend `CLAUDE.md` (= `AGENTS.md`); status table → this phase Implemented.
   - `AGENTS.md`: Stack and Commands (`check` is two checkers now), the typing bullet, the layering bullet (the alias rule is convention now — see the trade below), Deploy (`wrangler.jsonc` carries no `vars`), Environment (table, the per-environment bullet, the missing-binding guard, the `EMAIL_TO` drift warning). `README.md` mirrors the `check` row and the `.dev.vars` section. `todo/README.md`: the locked Contact line and the status row.
   - **Implemented, not Done** — task 2 is human-only and unrun, and task 1 is gated. This follows phase 5's precedent ("Status is _Implemented_, not _Done_").

## Sanctioned survivors

The grep matrix after this phase. Every hit below is correct as written; nothing here is residue.

| Where                                                | Hit                                                                            | Why it survives                                                                                  |
| ---------------------------------------------------- | ------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------ |
| `pnpm-workspace.yaml:4`                              | `workerd: true # Cloudflare Workers runtime, used by wrangler pages dev`       | workerd **is** the Workers runtime, and `wrangler pages dev` runs it. Already retargeted in 6.1. |
| `wrangler.jsonc:4`                                   | "Pages, not Workers"                                                           | A deliberate negative: it explains what `pages_build_output_dir` means.                          |
| `wrangler.jsonc:8`                                   | "Matches the installed workerd (1.20260815.1)"                                 | What `compatibility_date` is pinned against.                                                     |
| `AGENTS.md:64`                                       | "a real build on workerd via `wrangler pages dev`"                             | Accurate — the e2e suite's runtime.                                                              |
| `AGENTS.md:101`                                      | "no adapter and no `wrangler deploy`"                                          | A deliberate negative; states what the repo does _not_ do.                                       |
| `AGENTS.md:107`                                      | "serves … from workerd at `localhost:8788`"                                    | Accurate — the preview loop.                                                                     |
| `AGENTS.md:121`                                      | "the Function needs nothing workerd-specific … no `@cloudflare/workers-types`" | A deliberate negative, rewritten by this phase.                                                  |
| `functions/api/contact.ts:31`                        | "`@cloudflare/workers-types` would redefine them globally"                     | A deliberate negative: why `RequestContext` is written out rather than imported.                 |
| `todo/README.md` (2)                                 | the 6.2 row title; "superseding phase 1's Workers decision"                    | A phase name and a historical reference.                                                         |
| `todo/phase-*.md` (66 across five docs)              | history                                                                        | Never rewritten — dated amendments only.                                                         |
| `todo/phase-6.2-workers-decommission.md` (this file) | the record itself                                                              | It cannot record a Workers decommission without naming Workers.                                  |
| `pnpm-lock.yaml` (31)                                | `workerd`, package names, resolutions                                          | Generated. Down from 32 — `@cloudflare/workers-types` left with the typing decision.             |

Gone since the pre-sweep matrix: `package.json` (`@cloudflare/workers-types`), all of `functions/tsconfig.json` (deleted), `tsconfig.json:4` (rewritten). Those three were sanctioned survivors under 6.1's design and stopped existing under this phase's.

## Accepted trades

Two things got worse. Both were weighed and taken; neither is a bug to rediscover.

- **The `@/content` layering rule is no longer compiler-enforced.** `functions/tsconfig.json` defined no `paths`, so an `@/content` import in `functions/` used to be a type error. The root `tsconfig.json` _does_ define `@/*` → `./src/*`, so now it typechecks and fails only at runtime — the Pages Functions bundler resolves no aliases. The rule itself is unchanged and stated in `AGENTS.md`'s layering bullet and in `contact.ts`'s header; `pnpm test:e2e` is what catches a violation. Reintroducing a second TypeScript project to recover a lint-level guard over one file is not worth it.
- **`EMAIL_TO` drift is now invisible to the repo.** It mirrors `profile.email` (`src/content/profile.ts:17`), and the value no longer appears anywhere in version control, so editing `profile.email` produces no signal that both Pages environments need the same edit. The new missing-binding guard catches an _absent_ key, never a _wrong_ one. Do **not** "fix" this by having the Function import `profile.ts` — that is precisely the door `AGENTS.md`'s subpath-not-barrel rule keeps shut to stop the résumé reaching the browser bundle.

## Verification

- The grep matrix returns only the sanctioned list above. ✅
- `git grep -n "tsc -p functions"` → no hits outside `todo/` history. ✅ (The matrix pattern cannot catch these — `functions` is not in it — so this is a separate check.)
- The Cloudflare account shows exactly one delivery artifact: the Pages project. ⛔ **Not verified — task 2 is unrun.**
- `pnpm check`, `pnpm build`, `pnpm test:e2e` still green — proof nothing load-bearing was swept. ✅ See the implementation record.
- Local curl matrix on `localhost:8788`, every row returning before `send()`: missing-email `400`, honeypot `200`, `GET` `405`, form-post with Origin and a filled honeypot `303`, form-post without Origin `403`. ✅

## Gotchas

- **`portfolio-web.pages.dev` is not this project.** Both it and `dev.portfolio-web.pages.dev` return `200` with `<title>Rithik Jain</title>`, and `GET /api/contact` there returns `200` where this Function returns `405` — a different Cloudflare account's site on a globally-unique `.pages.dev` subdomain. Every doc naming that host as "the production URL" is wrong, including this phase's task 1 as originally written. Get the project's real URL from the dashboard before any production verification; phase 7's Lighthouse-against-production step and the domain attach both depend on it.
- The `SESSION` KV namespace, if it was ever provisioned, lives under **Storage & Databases** — deleting the Worker does not remove it. (`IMAGES` is a binding, not a resource; nothing to delete.)
- The account's `*.workers.dev` subdomain is account-level — leave it.
- The sweep must never "correct" `todo/` history — dated amendments only.
- **Set the two dashboard variables before pushing**, per task 2. The `vars` block is already out of `wrangler.jsonc` in the working tree, so the first deploy after this lands has no addresses unless the dashboard has them.

## Definition of Done

Inherited DoD, plus: account clean, or N/A recorded per item; sanctioned-hits list recorded in this doc; every living doc describes Pages only.

**Not met.** The repo half is complete and the survivors list is recorded, but the account half (task 2) is human-only and unrun, and task 1 is gated on a production cutover the user has deferred. Status is _Implemented_, not _Done_.

## Out of scope

Anything phase 7 (domain, headers, rotation, Lighthouse). Renaming the Pages project. Turnstile.
