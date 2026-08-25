# Testing — nicolasmateo.dev

Three Playwright specs and the helpers they share. Deliberately few and load-bearing: the
suite guards the page's static content, the three islands' behaviour, the contact endpoint,
accessibility and the launch surface. It is not chasing coverage — one spec per concern, so a
file's scope stays legible.

## How it runs

Against a **real build on workerd**, via `wrangler pages dev` — the same runtime Pages deploys
to, so `functions/api/contact.ts` is exercised for real rather than stubbed.

| Command               | What it does                                                          |
| --------------------- | --------------------------------------------------------------------- |
| `npm run test:e2e`    | builds, then runs the suite — the local entry point                   |
| `npx playwright test` | runs against the existing `dist/`; what CI calls, after its own build |

Chromium only: this suite guards behaviour and accessibility, not cross-engine rendering.
`colorScheme` is pinned to light in `playwright.config.ts`, or the theme tests would depend on
the machine running them.

**Browsers install explicitly**: `npx playwright install chromium`. Playwright ships no install
script, so `npm install` fetches nothing and the runner does not self-heal — it fails with
"Executable doesn't exist". CI runs the same command with `--with-deps`, which adds the OS libs.

## Coverage — 31 tests

| Spec             | Tests | Guards                                                                                                                                                                                                                                                                                                                                                                                                              |
| ---------------- | ----- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `smoke.spec.ts`  | 18    | every anchored section under one `h1`; per-block content; the theme toggle across a reload; both résumé links; the endpoint's safe matrix and its method/origin gates; the bundle canary; the project drawer (static copy with JS off, opening, three ways of closing, focus restored); nav scroll-spy and the scrolled hairline; the contact form's two visible outcomes; the viewport sweep; the narrow-mode menu |
| `a11y.spec.ts`   | 8     | axe over `/` light and dark, `/` with the drawer open in both themes, `/` narrow with the mobile menu open, `/kit` in both themes, and the 404 — zero violations                                                                                                                                                                                                                                                    |
| `launch.spec.ts` | 5     | `robots.txt`; the sitemap's shape (`/` in, `/kit` out); security headers and the immutable `_astro` cache on real responses; the canonical/OG/`twitter:card` set with the card fetched to prove it is not a 404; the Person JSON-LD compared against `content/schema.ts` itself; `/kit`'s `noindex`; a real 404 on an unknown path                                                                                  |

`support.ts` is not a spec: `requiredAt()` and the two hydration barriers, all below.

The viewport sweep runs the full ladder — 1440 down to 320, both sides of the 900px boundary —
and asserts three things per step: no page overflow, no header overflow, and the bar still
measuring `--nav-h`. **The third is the real guard**: the brand is meant to wrap to two lines at
the narrow end, and a third line would move every in-page anchor by silently breaking
`scroll-padding-top`.

The 404 passes an empty exemption list on purpose: it renders no clay, and `expectClean`'s
canary — which catches an exemption that has gone stale — only fires on a non-empty list.

## Rules that keep it honest

- **Tests never send real email.** Every endpoint case returns before `send()`: the two gates
  reject before the body is read, and the validation-failure and honeypot paths both stop short
  of it. CI additionally writes a placeholder `RESEND_API_KEY`, so the guarantee is
  environmental rather than a property of which code paths the tests happen to take.
- **Specs import from `src/content`** rather than restating ids, paths or topics, so a manifest
  change fails a test instead of drifting past a stale copy.
- **No index access in a spec takes a default.** `requiredAt()` in `support.ts` throws instead,
  naming the array and the index. A default does not fail — it quietly changes what is being
  asserted, and the helper's own comment carries the case that shows it.
- **axe scans run under `prefers-reduced-motion: reduce`.** Without it, `reveal.ts` leaves
  everything below the fold at `opacity: 0` and axe silently scans little more than the hero.
- **Assert the drawer by role, never by visibility.** A closed drawer is off-screen by
  `transform`, not hidden, so Playwright calls it visible. `getByRole("dialog")` counts work
  because the panel carries the role only while it is open.
- **Both hydration barriers are mandatory**, and both specs use both so neither can forget one:

| Helper         | Waits for       | Because                                                                                                                                                  |
| -------------- | --------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `openDrawer()` | `aria-haspopup` | `WorkGrid` is `client:visible`; a click landing before hydration follows the card's `href` to hidden markup and opens nothing, intermittently            |
| `openMenu()`   | `data-enhanced` | the disclosure opens with no JS at all, but the close-on-navigate listener is the island's; a click landing before it navigates with the menu still open |

`openMenu()` addresses the `<summary>` element by class because Playwright's role engine does
not map it. The browser's own tree is correct — only the locator is affected.

## CI

`.github/workflows/ci.yml`, job id `ci`, is the quality gate: `format:check`, `check`, `build`,
then the placeholder secret, then `playwright install --with-deps chromium`, then
`npx playwright test` directly — so the build happens once. It never deploys.
