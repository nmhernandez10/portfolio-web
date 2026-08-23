# Phase 6.2 — Workers decommission

## Goal

Nothing Workers-shaped remains — in the Cloudflare account or in the repo's living docs. Pages is the only delivery path and every doc says so.

## Decisions (locked)

- **Delete, don't pause.** After 6.1 the repo can no longer build a Worker, so the broken `portfolio-web` Worker is not a rollback path — only an orphan serving nothing. _Rejected alternative — keeping it as a fallback_: a fallback you cannot redeploy is a liability, not a net. Do not revisit.
- **Cleanup is grep-driven, judged hit-by-hit.** `wrangler` (devDependency, the `preview` script) and `workerd` (`allowBuilds`) legitimately survive; `todo/` history gets dated amendments, never rewrites.

## Tasks

1. [ ] **Soak check**: production `portfolio-web.pages.dev` green since the 6.1 merge; re-run the safe matrix rows (missing-email `400`, honeypot `200`, `GET` `405`, no-Origin `403`) against production.
2. [ ] `HUMAN:` in the Cloudflare dashboard:
   - Delete the Workers Builds connection and the Worker `portfolio-web`.
   - Check **Storage & Databases** for an auto-provisioned `SESSION` KV namespace — it outlives the Worker; delete it if present. Either way this closes phase 1's open question.
   - Confirm no Worker-scoped secrets remain.
3. [ ] **Repo sweep**: `git grep -in "worker\|wrangler deploy\|8787\|dist/client\|workers.dev"` — fix every living-doc hit (`AGENTS.md`, `README.md`, code comments, the `pnpm-workspace.yaml` workerd comment → "used by wrangler pages dev"); record the sanctioned-survivors list in this doc; add dated amendments to any misleading phase-doc statement found.
4. [ ] **Local state**: `rm -rf .wrangler/` once (stale Workers dev/deploy cache; `pages dev` recreates its own). `.gitignore`'s `.wrangler/` and `.dev.vars` entries stay — both still earned.
5. [ ] Amend `CLAUDE.md` (= `AGENTS.md`) if the sweep changed a convention; status table → this phase Done.

## Verification

- The grep matrix returns only the sanctioned list recorded in task 3.
- The Cloudflare account shows exactly one delivery artifact: the Pages project.
- `pnpm check`, `pnpm build`, `pnpm test:e2e` still green — proof nothing load-bearing was swept.

## Gotchas

- The `SESSION` KV namespace, if it was ever provisioned, lives under **Storage & Databases** — deleting the Worker does not remove it. (`IMAGES` is a binding, not a resource; nothing to delete.)
- The account's `*.workers.dev` subdomain is account-level — leave it.
- The sweep must never "correct" `todo/` history — dated amendments only.

## Definition of Done

Inherited DoD, plus: account clean, or N/A recorded per item; sanctioned-hits list recorded in this doc; every living doc describes Pages only.

## Out of scope

Anything phase 7 (domain, headers, rotation, Lighthouse). Renaming the Pages project. Turnstile.
