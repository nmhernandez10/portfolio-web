# Phase VC1 — Content and contract

## Goal

The new content model exists in final form under `src/content/next/`, carrying every
string of the new design, while the old model keeps the current page and tests green.
The contact contract loses its topic field end to end. No visual change anywhere.

## Decisions (locked)

- **The new model is born in `src/content/next/` and promoted by `git mv` in VC3** —
  the same parallel-directory strategy the kit uses (`src/kit/`), because the old and
  new models collide on names (`profile`, `SECTIONS`, `NAV`) with different shapes. The
  files inside `next/` are written under their **final** names (`types.ts`,
  `profile.ts`, `sections.ts`, `index.ts`) so VC3 is a pure move.
- **`ui_kits/portfolio/data.js` is the copy source and is law**, including punctuation:
  em dashes in periods ("Mar 2024 — Present"), the en dash in "4–8", the U+2212 minus
  in "UTC−5", "Résumé, PDF" with the comma, British "standardises" in project 02's
  detail. Strings the kit hardcodes in JSX (listed in task 2) move into the content
  model — copy lives in one place only.
- **Identity follows the design**: `name: "Nicolás Hernández"`, `role: "Senior Backend
Engineer & Feature Architect"`. `fullName` stays "Nicolás Mateo Hernández Rojas" for
  phase 7's JSON-LD. The `phone` field in `data.js` is **deliberately omitted** — the
  kit never renders it, and this repo carries no unused data.
- **Résumés**: both PDFs ship, re-sourced from the skill's 2026 uploads, keeping the
  URL-safe public names. `resumes.fullStack` (`/resume-fullstack.pdf`) is the primary —
  nav action, hero CTA, footer "Résumé". `resumes.backend` (`/resume-backend.pdf`)
  surfaces only as the extra footer link. The contact section lists no résumés.
- **Kept extras carried by the model**: `github: "github.com/nmhernandez10"` (footer +
  contact "Elsewhere"), alongside `linkedin` and `email` from `data.js`.
- **Topic select dies here**, not in a visual phase: it is a contract change shared by
  the Function, the form and the smoke tests, and the one TS program forces atomicity.

## Source

- `.claude/skills/nicolas-mateo-design/ui_kits/portfolio/data.js` — PROFILE, STATS (4),
  PROJECTS (4, each with `detail[3]`, `tags`, `meta`), EXPERIENCE (4), SKILLS (6),
  EDUCATION (2).
- The kit JSX for strings `data.js` lacks (full inventory in task 2).
- `.claude/skills/nicolas-mateo-design/uploads/` — the two 2026 résumé PDFs (filenames
  contain spaces and accents; quote them).

## Tasks

1. [x] **`src/content/next/types.ts` + `profile.ts`** — written. Six interfaces (`Stat`,
       `Project`, `ExperienceEntry`, `SkillGroupContent`, `EducationEntry`, `Profile`),
       field names mirroring the kit's frozen prop contracts so VC3 spreads content into
       components with no mapping layer. Arrays stay mutable: the kit declares
       `tags?: string[]`, and a readonly array is not assignable to one. `profile.ts`
       transcribes every string from `data.js`; `phone` omitted, `fullName` / `site` /
       `github` / `resumes` added, project `index` derived (deviation 2).
2. [x] **`src/content/next/sections.ts`** — the manifest (`SECTIONS`, four entries,
       `as const satisfies`), `SectionId`, `twoDigit`, the widened `ENTRIES` alias,
       `SectionMeta` and `sectionMeta(id)` deriving `01`–`04` from position, plus `COPY`
       carrying every string the kit hardcodes in its section JSX. The module imports
       nothing — see deviation 4.
3. [x] **`src/content/next/index.ts`** — the barrel: `profile`, `SECTIONS`, `COPY`,
       `sectionMeta`, `twoDigit` and the three section types, with `contact.ts`
       deliberately excluded and the reason restated. No `NAV` (deviation 1).
4. [x] **Résumé PDFs** — both re-sourced from the skill's `uploads/`.
       `resume-fullstack.pdf` was already byte-identical (md5 `582c638c…`), so only
       `resume-backend.pdf` changed: `7a1231d6…` (34,588 B) → `f353a710…` (34,814 B),
       matching the 2026 upload and the PDF the kit itself links.
5. [x] **Drop the topic field, atomically** — `CONTACT_TOPICS` and `CONTACT_ERRORS.topic`
       gone from the contract; `topic` gone from the endpoint's `Submission`,
       `readSubmission`, `validate`, `send`, subject and body; the `Select` and its grid
       placement gone from the old form; `topic` gone from all four e2e POST bodies.
       `grep -rni topic src/ functions/ e2e/` and `grep -ril topic dist/` are both empty.
6. [x] **Confirmed.** `grep -rn "content/next" src/ functions/ e2e/` returns nothing — no
       module imports the new model, and `tsc` still typechecks it (verified by injecting
       a type error into `next/profile.ts` and watching `tsc --noEmit` catch it).
       `git diff --stat` shows no change under `src/ui/`, `src/styles/` or `src/pages/`.
       The 12-test Playwright suite passes; the only page change is the missing select.

## Deviations from this doc (agreed with the user, and why)

1. **`NAV` was not ported** (tasks 2–3). Today's `NAV` exists to _filter_: the old
   manifest carried an `ai` entry with no nav link, so `NAV` was
   `ENTRIES.filter(entry => entry.nav !== undefined)` behind a type predicate. All four
   new sections are in the nav, so `NAV` would degenerate to a rename of `SECTIONS` with
   one consumer. VC3's `SiteNav` maps `SECTIONS` directly; the `#id` anchor convention
   stays in the renderer, where `Header.astro` keeps it today.
2. **Projects carry no `index`** (task 1). `data.js` stores `'01'`…`'04'`, which is
   exactly the array position — duplicated derivable state, in the same file whose
   section ordinals are derived to prevent that drift. `twoDigit` is now the one owner of
   the brand's two-digit ordinal (sections and cards in VC3, drawer detail lines in VC4),
   which is what the kit does itself (`ProjectDrawer.jsx` derives `padStart(2, '0')`).
   The fidelity script asserts `twoDigit(i + 1) === PROJECTS[i].index` for all four, so
   the derivation is proven to reproduce the source.
3. **The error shape moved into the contract** (task 5). `type Errors =
Record<string, string>` was declared twice, once on each side of the wire. Removing
   topic closes the key set, so `contact.ts` now owns `ContactField` and
   `ContactErrors = Partial<Record<ContactField | "form", string>>`. One definition,
   `errors.form` typed rather than index-signature `string`, and a resurrected
   `errors.topic` is a compile error on both sides. No behaviour change.
4. **`sections.ts` imports nothing, so `COPY.contact.locationLine` repeats the city**
   (task 2). VC3's islands need nav labels and form copy, and `src/content/index.ts`
   records why the résumé must not be reachable from the browser bundle — structurally,
   not by tree-shaking. An import-free leaf keeps that guarantee, at the cost of
   `"Bogotá, Colombia · UTC−5 · remote-first"` mirroring `profile.location`. The mirror
   carries a JSDoc, and the fidelity script asserts the line still opens with
   `profile.location`.
5. **The Resend subject became `Portfolio contact — ${name}`** (task 5). Topic was the
   subject's only discriminator; without it every message would arrive titled
   identically. The body already carries `Name:`, so nothing new is exposed, and the
   logging law is untouched — logs still carry status codes and outcomes only.
6. **`INLINE_ERRORS` and its filter/join collapsed to `errors.form`** (task 5). They
   existed only because topic had no inline slot. `validate()` emits `name` / `email` /
   `message`, and both failure paths key `form`, so the two forms are equivalent by
   construction.

## Known residue

- **The endpoint has never required a message body.** `validate()` bounds message
  _length_ (`> CONTACT_MESSAGE_MAX`) and nothing else, so an empty `message` is accepted
  and only the browser's `required` attribute stops one. This predates the phase and is
  identical on both sides of the diff (`git show HEAD:functions/api/contact.ts`), so
  tightening it would be a behaviour change this phase's brief excludes. Worth settling
  in VC3, which rewrites the form. `name` is unbounded for the same reason, and this
  phase widened where that shows: it now reaches the Resend subject as well as the body,
  so an absurd name turns a send into a 502 rather than a rejected field. Same call —
  record it, settle it in VC3.
- **`COPY.contact.locationLine` mirrors `profile.location` with no compile-time guard.**
  Deviation 4 buys the import-free leaf with a duplicated city, and the fidelity script
  that asserts the mirror is throwaway — after this phase the JSDoc is the only guard.
  VC3 renders that line from a section file, where the leaf constraint no longer applies,
  so deriving it from `profile.location` there would retire the mirror for free.
- **No real delivery was proven.** Every endpoint case was exercised against
  `wrangler pages dev` with `RESEND_API_KEY` blanked via `--env-file`, so a valid
  topicless submission returns `502` at the missing-binding guard — which proves
  validation accepted it without an outward-facing send. Real delivery stays where
  `phase-7-launch.md` task 0.C already puts it.

## Verification

- `pnpm check`, `pnpm build`, `pnpm test:e2e` all green.
- `pnpm preview` → `POST /api/contact` accepts a topicless submission and still
  rejects a missing name/email/message with the shared error strings; the honeypot
  path still returns success without sending.
- Fidelity is proven mechanically, not spot-checked. A throwaway Node script (Node 24
  strips the types natively) imports `data.js` and the new modules together and deep-
  compares stats / experience / skills / education, projects minus `index`, and every
  `PROFILE` key except `phone`; then normalizes whitespace over the kit JSX and asserts
  every leaf string of `SECTIONS` and `COPY` appears verbatim in the file that owns it.
  Two documented exemptions (`footer.links.github`, `footer.links.backendResume`) are
  repo additions the kit has no equivalent for. 64 assertions; negative-controlled by
  swapping U+2212 for a hyphen and an en dash for a hyphen, both of which fail it.
- `git diff --stat` shows no changes under `src/ui/`, `src/styles/`, `src/pages/`.

## Gotchas

- `pnpm dev` does not serve the Function — the endpoint loop is
  `pnpm build && pnpm preview`.
- The old `profile.ts` and `sections.ts` are **not edited** — parallel model, zero
  risk to the live page. Resist "small harmonizations"; they widen the diff for VC3.
- Typographic characters are data, not style: `—` (em dash, spaced), `–` (en dash in
  "4–8"), `−` (U+2212 in "UTC−5"), `·` separators, `→` and `✕` glyphs. Verify with a
  hexdump spot check if the editor is suspect.
- Tests never send real email — every endpoint case must keep returning before
  `send()`; CI's placeholder `RESEND_API_KEY` guards this environmentally.

## Definition of Done

Inherited DoD, plus: `next/` model complete and verbatim against `data.js`; both 2026
PDFs served; topic field gone end to end with e2e updated; old page visually unchanged
(minus the select); status table updated.

## Out of scope

Any consumer of the new model (VC3). Styling changes. The résumé link _targets_
(nav/hero/footer wiring changes in VC3 — today's page keeps its current links).
