# Decisions — nicolasmateo.dev

The dated record. Rules live in [`AGENTS.md`](../AGENTS.md) and values in
[`brand.md`](brand.md); this file is the only place that says _what it replaced_, so no rule
elsewhere has to carry its own history.

This is also the one file where phase and VC labels legitimately survive. The site was built
in phases 0–7 plus a six-part visual correction (VC0–VC5); those docs were removed as each
landed and their full record is in git history. `98f9717` is the launch commit.

## The log

| Date       | Decision                                                 | Supersedes                                        | Rule now lives in                               |
| ---------- | -------------------------------------------------------- | ------------------------------------------------- | ----------------------------------------------- |
| 2026-08-19 | Astro 7 + React 19, TypeScript strict                    | the original "Astro 5" note                       | `AGENTS.md` § Stack                             |
| 2026-08-22 | Cloudflare **Pages**, adapter-less                       | phase 1's Workers decision                        | [operations](operations.md)                     |
| 2026-08-23 | `functions/` shares the root TypeScript program          | phase 6.1's split TS project                      | `AGENTS.md` § Invariants                        |
| 2026-08-23 | Contact addresses become per-environment Pages variables | `vars` in `wrangler.jsonc`                        | [operations](operations.md#environment)         |
| 2026-08-24 | One story, one page, four numbered sections              | a multi-page portfolio                            | [architecture](architecture.md#the-page)        |
| 2026-08-24 | Contact contract is name / email / message + honeypot    | the design's topic select                         | `src/content/contact.ts`                        |
| 2026-08-25 | npm, not pnpm                                            | phase 0's package-manager choice                  | `AGENTS.md` § Stack                             |
| 2026-08-25 | No wrangler config file at all                           | phase 6.2's `wrangler.jsonc`                      | [operations](operations.md#pages-configuration) |
| 2026-08-25 | Design skill deleted; `docs/brand.md` replaces it        | the `nicolas-mateo-design` skill                  | [brand](brand.md)                               |
| 2026-08-25 | Accessibility budget reads "100 net of one exemption"    | a flat 100                                        | [operations](operations.md#performance-budgets) |
| 2026-08-25 | Both themes ship; both résumés ship                      | the design's single-theme, single-résumé delivery | [brand](brand.md#site-decisions)                |
| 2026-08-25 | `astro/tsconfigs/strictest`, minus one member            | `astro/tsconfigs/strict`                          | `tsconfig.json`                                 |

## The ones with a real trade-off

### npm over pnpm — 2026-08-25

Every other Node repo on this machine is npm, and pnpm 11 reads its settings only from
`pnpm-workspace.yaml`, so staying would mean carrying a second root config file forever.

The cost is real and was accepted knowingly: pnpm's 24h `minimumReleaseAge` cooldown, its
per-package install-script allowlist and its phantom-dependency-proof isolated layout all left
with it, and npm has no equivalent for any of the three. One concrete consequence: pnpm's
isolated layout used to fail the build outright if `sharp` were not a direct dependency. Under
npm's flat layout it is hoisted either way, so that guard is gone — check `npm ls sharp`.

### Adapter-less Pages — 2026-08-22

`@astrojs/cloudflare` dropped Pages support in v13, and Astro 7 requires v14, so **no adapter
can target Pages**. `astro build` emits a plain static `dist/` and the contact endpoint is a
hand-written Pages Function. What left with the adapter has to be hand-held: Astro's `ALL`
dispatch supplied the `405` and its origin-check middleware the `403`, so both are written out
in `functions/api/contact.ts` and guarded by `e2e/smoke.spec.ts`.

### No wrangler config file — 2026-08-25

A deployed config carrying `pages_build_output_dir` makes the file the project's source of
truth and locks the dashboard **project-wide** — not per-field, as the earlier record assumed:
even with zero `vars` in the file, the Variables UI refuses edits. The lock and its release
travel with deployments; an environment unlocks only once a deployment without the file lands
in it. All Pages configuration is dashboard-managed, per environment, and what the file carried
now rides the `preview` script as flags.

### The clay contrast exemption — 2026-08-25

`--clay` measures 3.69:1 against `--paper` where AA wants 4.5, on the hero's single accent CTA.
Two alternatives were costed and rejected: restyling the CTA to `--clay-strong` would sit the
primary button at its own hover colour at rest, and changing `--clay` would repaint the accent
everywhere and edit `tokens/`. **A budget written before the measurement is the thing that
moves; the design law is not.** The number and the mechanism are in
[brand](brand.md#known-contrast-exception).

### `strictest` minus `exactOptionalPropertyTypes` — 2026-08-25

Eight of the nine members are adopted, seven of them free. `noUncheckedIndexedAccess` cost 26
diagnostics, each an invariant the code relied on but could not state. Every one was resolved
by stating it, never by a `!` assertion: a throwing guard where the invariant is real but
unprovable (`sectionMeta`, `/kit`'s fixtures, the drawer's focus trap), the `SECTIONS` tuple
where the array proves its own first entry, and one `?? ""` in the content-type parser, where
`split()` guarantees the element and the default is only for the type. `e2e/` got a throwing
`requiredAt()`, because a default there does not fail — it changes what is asserted.

`exactOptionalPropertyTypes` is the one refused. The kit's optional props are declared
`?: string`, and the islands that forward them (`ContactForm`, `WorkGrid`) pass
`string | undefined`. Callers _can_ spread conditionally rather than widen the frozen kit
contracts, so this is not an API blocker — it is churn at every forwarding call site for no
runtime guarantee.

## Considered and rejected

Recorded so they are not re-proposed. Each was evaluated against the current source.

| Change                                                   | Why not                                                                                                                                                                                                                                    |
| -------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| CSS `@layer` for the four-layer cascade                  | Formalizes an order that already works and does not remove the hazard the comments warn about — the site layer is _meant_ to win. Unlayered styles out-rank layered ones, so `/kit`'s scoped `<style>` blocks would newly beat site rules. |
| Moving the narrow-mode block into `sections.css`         | `global.css` loading last is load-bearing and documented; the move buys proximity and risks a silent cascade change on a live layout.                                                                                                      |
| One shared `"Close ✕"` for `COPY.nav` and `COPY.drawer`  | Two independent surfaces that agree today; both already live in the single copy source.                                                                                                                                                    |
| Deleting `Stat` / `SkillGroupContent` / `EducationEntry` | Not dead — they are the named shapes `Profile` composes.                                                                                                                                                                                   |
| Spending the unreferenced `tokens/*` custom properties   | Sealed vocabulary, deliberately unspent. `tokens/` is not edited.                                                                                                                                                                          |

## Known and accepted

Three `/kit`-only records, decided rather than fixed — the full statement of each is in
[brand](brand.md#site-decisions): static kit components have no hover state; the drawer
specimen carries `aria-modal="true"` while nothing about it is modal; `/kit` scrolls 7px
sideways at 320px, where `/` is clean at every width.
