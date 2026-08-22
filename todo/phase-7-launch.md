# Phase 7 — Launch

## Goal

SEO/meta complete, performance audited against budgets, hardening done, `nicolasmateo.dev` live, and the design skill deleted after a verified-parity migration. The site is finished.

## Tasks

### 1. SEO and meta

- Canonical `https://nicolasmateo.dev/`; full OG + Twitter card set (title, description in brand voice, `og:image`).
- `@astrojs/sitemap` active (installed in phase 0), **excluding `/kit`**; `public/robots.txt` allowing all + sitemap URL.
- Person JSON-LD: `name` (Nicolás Mateo Hernández Rojas), `alternateName` (Nicolás Mateo), `url`, `jobTitle` from `profile.role`, `sameAs` (GitHub, LinkedIn from the content module), `address` Bogotá, Colombia.
- `<meta name="robots" content="noindex">` on `/kit`.
- Meta descriptions finalized per BRAND-GUIDE voice (numbers, not adjectives).

### 2. OG image

`public/og.png`, 1200×630: build a dev-only card page (paper-0 background, name with the gold period, role line, `nicolasmateo.dev` in mono), screenshot it with the already-installed Playwright, commit the PNG, delete the card page.

### 3. 404

`src/pages/404.astro` — minimal, brand voice ("Nothing at this address." + a TextLink home). No emoji, no exclamation marks.

### 4. Hardening

- Security headers: `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, a minimal `Permissions-Policy`. Mechanism: whatever current Workers-static-assets docs support (`_headers` file or middleware) — verify against current docs, don't assume.
- `grep -ri resend dist/_astro/` and a scan for the API key pattern → nothing secret in client output.
- Confirm immutable caching on hashed `_astro/*` assets (adapter/platform default — verify response headers).

### 5. Performance audit

Lighthouse (headless Chromium via the Playwright install) against the **preview URL**, desktop and mobile-simulated. Budgets — fix regressions before launch, record final numbers in the PR:

| Metric                               | Budget                                     |
| ------------------------------------ | ------------------------------------------ |
| Performance                          | ≥ 95                                       |
| Accessibility / SEO / Best Practices | 100                                        |
| LCP                                  | ≤ 2.0s desktop / ≤ 2.5s mobile             |
| CLS                                  | ≤ 0.05                                     |
| Total JS shipped                     | ≤ 90KB gzip (baseline recorded in phase 4) |

### 6. Skill deletion (gated — run the checklist first)

Parity checklist; every box must pass before deleting anything:

- [ ] `/kit` renders all 20 components, both themes, matching the component `.prompt.md` rules.
- [ ] `diff -r src/styles/tokens .claude/skills/nicolas-mateo-design/design-system/tokens` → only `fonts.css` differs.
- [ ] `public/icons`: 30 ui + 14 tech.
- [ ] Every string in `prototype/data.js` exists in `src/content/profile.ts` (scripted spot-check: grep a sample of distinctive strings from each top-level key).
- [ ] Portrait and both resumes migrated and served.
- [ ] **`docs/brand.md` written**: condensed from BRAND-GUIDE.md + the skill README — voice rules, visual laws, anti-patterns, iconography rules, the token digest, and the interaction contracts (theme/reveal — the lens toggle was removed in phase 3). This is the post-skill design reference.
- [ ] `CLAUDE.md` design pointers updated to `docs/brand.md` (skill paths removed).

Then: `git rm -r .claude/skills/nicolas-mateo-design` (and `assets/` if any originals remain — phase 3 should have removed them). `todo/` is **kept** as the historical record; mark all statuses Done.

### 7. Go live

- `HUMAN:` rotate `RESEND_API_KEY` to the production key (`wrangler secret put`); update `.dev.vars` locally.
- `HUMAN:` attach the `nicolasmateo.dev` custom domain to the Worker in the dashboard; confirm DNS + TLS. (Requires the domain zoned in the Cloudflare account.)
- Final production smoke on `https://nicolasmateo.dev`: both themes, reveal, both resume downloads, one real contact send received, `/404`, sitemap + robots fetchable, OG card renders in a link-preview validator.

## Verification

The phase is its own verification; the DoD is the record.

## Gotchas

- Order matters: run the parity checklist and write `docs/brand.md` **before** `git rm` — the skill is the source you're diffing against.
- Domain attach changes canonical URLs nowhere (already `nicolasmateo.dev` since phase 0's `site` config) — but re-run one Lighthouse pass on the real domain after cutover.
- If the OG screenshot page ships by accident, the sitemap exclusion won't cover it — delete the page, don't just unlink it.

## Definition of Done

Inherited DoD, plus: budgets met with numbers recorded in the PR; skill directory gone with `docs/brand.md` in place; `https://nicolasmateo.dev` serving with TLS; one real contact email received from production; status table fully Done.

## Out of scope

Analytics (add later only if wanted — nothing third-party was designed in). Blog/case-study pages. Turnstile (phase-5 appendix, only if spam appears).
