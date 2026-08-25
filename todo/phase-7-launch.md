# Phase 7 — Launch

> **Amended 2026-08-24 for the design-skill replacement.** The visual-correction
> phases (VC0–VC5) rebranded the site to the new skill layout (`tokens/`,
> `components/`, `guidelines/`, `ui_kits/portfolio/`) and completed on 2026-08-25;
> their docs were removed then, the way the phase 0–6.2 docs were, and their full
> record is in git history. Everything of theirs that was still open is carried into
> task 0 below. All design references here target the **new** skill; the old
> `design-system/` + `prototype/` paths no longer exist.

## Goal

SEO/meta complete, performance audited against budgets, hardening done, `nicolasmateo.dev` live, and the design skill deleted after a verified-parity migration. The site is finished.

## Tasks

### 0. Carried over from the removed phase docs (0–6.2, and VC0–VC5)

The implemented phase docs were removed on 2026-08-24, and the visual-correction docs
on 2026-08-25 (their full record lives in git history); these are the items that were
still open. Each carries a **when** tag — groups A–C must run **before** launch work
starts, because they are dashboard prerequisites nothing in the repo can supply.

**A. Git and GitHub — when: at VC0.** `main` is on GitHub at `64f539a` and `dev` is the
default branch (verified 2026-08-24 with `git ls-remote origin`; remote `HEAD` tracks
`dev`). No PR `dev → main` has ever existed, and what is actually missing is the default
branch and the protection rule:

- `HUMAN:` set GitHub's default branch to `main` (it currently defaults to `dev`). There is no `gh` CLI on the build machine, so this is dashboard-only.
- `HUMAN:` enable branch protection on `main`: require the CI check (job id `ci`)
  before merging.

**B. Cloudflare Pages project — when: before the VC2 PR**, the first preview anyone
reviews. VC0 has nothing to preview and VC1's endpoint validation runs locally on
`pnpm preview`, so neither blocks on this. (Confirmed still not created with the user on
2026-08-24; phase 6.1's dashboard walkthrough never ran.)

- `HUMAN:` pause/disconnect the old `portfolio-web` **Worker**'s git connection first,
  then create the **Pages** project `portfolio-web` connected to
  `github.com/nmhernandez10/portfolio-web`: production branch `main`, build command
  `pnpm build`, output `dist`, build system V2+ (confirm `.nvmrc` Node 24 + pnpm 11
  are honored; set `NODE_VERSION`/`PNPM_VERSION` only if not).
- `HUMAN:` Settings → Variables and Secrets, **once for Production and once for
  Preview**: `EMAIL_FROM` = `Nicolás Hernández <contact@nicolasmateo.dev>` and
  `EMAIL_TO` = `nm.hernandez1996@gmail.com` as plain variables, `RESEND_API_KEY`
  (test key) as a Secret. **This must precede the next push** — a preview deploy
  without the two addresses sends with undefined values.
- Preview validation: branch alias `dev.portfolio-web.pages.dev` + per-commit URLs
  live; previews carry `X-Robots-Tag: noindex`; the endpoint's safe matrix rows
  (missing-email `400`, honeypot `200`, `GET` `405`, no-Origin `403`) pass against a
  preview URL.
- The first `dev → main` merge to land after the project exists becomes the first
  production deploy — confirm `portfolio-web.pages.dev` serves it, then run the
  soak/matrix rows against production. (VC0 and VC1 merge before that point.)

**C. Resend — when: before VC1's endpoint validation, delivery proof at launch:**

- `HUMAN:` create/confirm the Resend account; add and verify the `nicolasmateo.dev`
  domain (DNS records); create a **test** API key for both Pages environments and
  `.dev.vars`. (The live-key rotation stays in task 7.)
- One real end-to-end send from a preview URL once B and C exist (was phase 5/6.1's
  outstanding delivery item); production's real send stays in task 7.

**D. Old Worker decommission — when: any time after B:**

- `HUMAN:` delete the Workers Builds connection and the `portfolio-web` **Worker**;
  check Storage & Databases for an auto-provisioned `SESSION` KV namespace and delete
  it if present; confirm no Worker-scoped secrets remain and nothing serves from
  `*.workers.dev`.

**E. Never-human-verified behavior smoke — when: fold into task 7's final smoke** (the
behaviors survive the rebrand): theme — no flash of wrong theme on hard reload, choice
survives restart, system-dark first visit lands dark; reveal — content never hidden
without JS, animations run once only, the fallback timer reveals everything if the
observer dies, print preview never blank, reduced motion instant.

**F. Carried over from the visual-correction phases — when: as tagged:**

- **Static kit components have no hover state — when: task 6's `/kit` parity pass.**
  The kit computes hover in `useState` and writes the result inline, which no
  stylesheet can override without `!important`, so on `/` only the three islands react
  — the hero CTAs, project cards, portrait desaturation and `TextLink` underline wipes
  are inert. This predates the rebrand and shipped as parity, not a regression; the
  reference PNGs are a rest-state comparison. Fixing it means the kit reading state
  through custom properties and shipping a `:hover` stylesheet, which contradicts
  `AGENTS.md`'s "the UI kit styles itself inline and is never forked" across seven
  components — hence a parity-pass decision, not a bug.
- **`/kit`'s drawer specimen carries `aria-modal="true"` while nothing about it is
  modal — when: task 6.** The specimen renders the panel open and static, and the role
  group is derived from `open`, so assistive tech honouring the attribute may confine
  its virtual cursor to the specimen. Removing it needs a new prop on a component whose
  whole point is that it needs none.
- **`/kit` still scrolls 7px sideways at 320 — when: task 6.** VC5 folded the page's
  own `.grid.two` / `.grid.stats`, which clears every width down to 360. What is left at
  320 is two kit specimens whose own inline values exceed the 272px content box: the hero
  status `Tag` (300px, `white-space: nowrap`) and `ExperienceItem`'s `minmax(150px, 200px)`
  rail, which reads no `--rail-cols` because a specimen shows the component's default and
  not the site's call site. `/` is clean at every width; the arithmetic is recorded above
  the fold in `kit.astro`.
- **`theme-color` is keyed to `prefers-color-scheme`, not `data-theme` — when: task 1.**
  `BaseLayout.astro` ships both metas against the two `--paper` values, which is
  correct as far as it goes; the open part is that a visitor who toggles against their
  system preference gets a mismatched chrome tint. Decide there whether the metas
  should follow the attribute instead.

### 1. SEO and meta

- Canonical `https://nicolasmateo.dev/`; full OG + Twitter card set (title, description in brand voice, `og:image`).
- `@astrojs/sitemap` active (installed in phase 0), **excluding `/kit`**; `public/robots.txt` allowing all + sitemap URL.
- Person JSON-LD: `name` (Nicolás Mateo Hernández Rojas), `alternateName` (Nicolás Mateo), `url`, `jobTitle` from `profile.role` (now "Senior Backend Engineer & Feature Architect"), `sameAs` (GitHub, LinkedIn from the content module), `address` Bogotá, Colombia. The rendered brand is **Nicolás Hernández**; `alternateName` keeps "Nicolás Mateo" because the domain carries it.
- `<meta name="robots" content="noindex">` on `/kit`.
- Meta descriptions finalized per the skill `readme.md` voice rules (numbers, not adjectives; banned-word list applies).

### 2. OG image

`public/og.png`, 1200×630: build a dev-only card page on the **new brand** per `guidelines/brand-wordmark.card.html` — `--paper` background, the name in Newsreader Light (serif lockup, tracking −0.022em; **there is no gold period — gold no longer exists**), the role line in Instrument Sans, `nicolasmateo.dev` in JetBrains Mono, clay used at most once (or not at all). Screenshot it with the already-installed Playwright, commit the PNG, delete the card page.

### 3. 404

`src/pages/404.astro` — minimal, brand voice ("Nothing at this address." + a TextLink home), composed from the new system (paper surface, serif statement, TextLink). No emoji, no exclamation marks.

### 4. Hardening

- Security headers: `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, a minimal `Permissions-Policy`. Mechanism: append to `public/_headers` (created in phase 6.1; Pages consumes it natively).
- `grep -ri resend dist/_astro/` and a scan for the API key pattern → nothing secret in client output.
- Confirm immutable caching on hashed `_astro/*` assets (hand-written in `public/_headers` since phase 6.1 — verify response headers on the deployed URL).

### 5. Performance audit

Lighthouse (headless Chromium via the Playwright install) against the **preview URL**, desktop and mobile-simulated. Pages preview deployments send `X-Robots-Tag: noindex`, which fails the Lighthouse SEO category — run Performance/Accessibility/Best Practices against the preview and SEO against production. Budgets — fix regressions before launch, record final numbers in the PR:

| Metric                               | Budget                                                                        |
| ------------------------------------ | ----------------------------------------------------------------------------- |
| Performance                          | ≥ 95                                                                          |
| Accessibility / SEO / Best Practices | 100                                                                           |
| LCP                                  | ≤ 2.0s desktop / ≤ 2.5s mobile                                                |
| CLS                                  | ≤ 0.05                                                                        |
| Total JS shipped                     | ≤ 90KB gzip (baseline re-recorded in VC4 — three islands supersede phase 4's) |

The rebrand changed the performance profile: three variable font families instead of
two (Newsreader adds `opsz`/italic axes — check what fontsource actually ships and
trim unused subsets/styles if the budget is tight), and the LCP element is now serif
display text — re-measure, don't assume phase-4 numbers.

### 6. Skill deletion (gated — run the checklist first)

Parity checklist; every box must pass before deleting anything:

- [ ] `/kit` renders all **14** components (plus the drawer), both themes, matching each component's `.prompt.md` rules.
- [ ] `diff -r src/styles/tokens .claude/skills/nicolas-mateo-design/tokens` → only `fonts.css` differs.
- [ ] No reference to `public/icons` or a mask-based `Icon` survives anywhere in `src/`, `public/` or `dist/` — the system ships no icons.
- [ ] Every string in `ui_kits/portfolio/data.js` exists in `src/content/` (scripted spot-check: grep a distinctive string from each top-level key — PROFILE, STATS, PROJECTS incl. one `detail[]` line, EXPERIENCE, SKILLS, EDUCATION).
- [ ] Portrait and **both 2026 résumés** migrated and served (full-stack is the primary; backend is the extra footer link); the skill's `assets/` and `uploads/` originals accounted for.
- [ ] **`docs/brand.md` written**: condensed from the skill `readme.md` + `guidelines/*.card.html` — voice rules (incl. banned words), visual laws (clay frequency, hairlines, radii ladder, surface alternation), the **no-icons iconography law**, the dark-theme mechanism (`[data-theme="dark"]`, semantic aliases), the token digest, and the interaction contracts (theme / reveal / scroll-spy / drawer). This is the post-skill design reference.
- [ ] `CLAUDE.md`/`AGENTS.md` design pointers updated to `docs/brand.md` (skill paths removed).

Then: `git rm -r .claude/skills/nicolas-mateo-design`. What remains of `todo/` (this doc and `README.md`) is kept; mark all statuses Done. The phase 0–6.2 docs were removed on 2026-08-24 and the VC0–VC5 docs on 2026-08-25 — their record, like everything deleted here, lives in git history.

### 7. Go live

- `HUMAN:` rotate `RESEND_API_KEY` to the live key in the Pages **Production** environment (dashboard); Preview keeps the test key — the per-environment split is the point of the 6.1 migration. Update `.dev.vars` only if local sends should go live.
- `HUMAN:` attach the `nicolasmateo.dev` custom domain to the Pages project in the dashboard; confirm DNS + TLS. (Requires the domain zoned in the Cloudflare account.)
- Final production smoke on `https://nicolasmateo.dev`: both themes, reveal, both resume downloads, one real contact send received, `/404`, sitemap + robots fetchable, OG card renders in a link-preview validator.

## Verification

The phase is its own verification; the DoD is the record.

## Gotchas

- Order matters: run the parity checklist and write `docs/brand.md` **before** `git rm` — the skill is the source you're diffing against.
- Domain attach changes canonical URLs nowhere (already `nicolasmateo.dev` since phase 0's `site` config) — but re-run one Lighthouse pass on the real domain after cutover.
- The `*.pages.dev` URL stays reachable after the domain attaches — the canonical tag covers it; nothing to disable.
- If the OG screenshot page ships by accident, the sitemap exclusion won't cover it — delete the page, don't just unlink it.

## Definition of Done

Inherited DoD, plus: budgets met with numbers recorded in the PR; skill directory gone with `docs/brand.md` in place; `https://nicolasmateo.dev` serving with TLS; one real contact email received from production; status table fully Done.

## Out of scope

Analytics (add later only if wanted — nothing third-party was designed in). Blog/case-study pages. Turnstile (phase-5 appendix, only if spam appears).
