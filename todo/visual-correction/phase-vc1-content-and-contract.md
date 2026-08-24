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

1. **`src/content/next/types.ts` + `profile.ts`** — the new model, typed strict:
   profile (name, fullName, role, location, email, site, github, linkedin, lead),
   `resumes { fullStack, backend }`, `stats` (value/label/note?), `projects` (index,
   title, kicker, description, detail[], tags[], meta), `experience` (current?, period,
   location, role, company, summary, points[], tags[]), `skills` (title, items[] — the
   slash-run groups), `education` (school, degree, period). Transcribe every string
   from `data.js` verbatim.
2. **`src/content/next/sections.ts`** — the new manifest and UI strings. Four entries
   in page order (ordinals are derived, `01`–`04`): `work` ("Selected work" /
   "Systems I designed, shipped and still own." / lead "Four pieces of production
   work, each with the constraint that shaped it."), `experience` ("Experience" / "Six
   years of production backends."), `about` ("About" / "How I work."), `contact`
   ("Contact" / "Tell me what you're building."). Plus the JSX-hardcoded copy, so no
   later phase invents strings:
   - hero: status tag "Open to senior / staff backend roles", CTAs "Get in touch" /
     "Résumé, PDF"
   - about: the two prose paragraphs from `About.jsx`, the "Education" divider label
   - contact: labels "Email" / "Elsewhere" / "Based in", the line
     "Bogotá, Colombia · UTC−5 · remote-first"
   - form: labels Name / Email / Message; placeholders "your name" /
     "you@company.com" / "what you're building, and where I'd fit"; button
     "Send message"; success "Thanks — I'll reply within a couple of days."
   - drawer: close label "Close ✕"
   - footer: "© 2026" + link labels Email · GitHub · LinkedIn · Résumé ·
     Backend résumé
   - nav: Work / Experience / About / Contact
3. **`src/content/next/index.ts`** — the barrel, mirroring today's discipline:
   everything except the contact contract. `contact.ts` stays a shared, subpath-only
   module (it is edited in place in task 5, not duplicated into `next/`).
4. **Résumé PDFs**: copy the two 2026 PDFs from the skill's `uploads/` over
   `public/resume-fullstack.pdf` and `public/resume-backend.pdf`. The old page keeps
   linking both paths, so nothing else changes.
5. **Drop the topic field, atomically**:
   - `src/content/contact.ts`: remove `CONTACT_TOPICS` and the topic error string.
   - `functions/api/contact.ts`: remove topic from validation, the email subject/body
     and the field list. Behavior contract otherwise untouched (gates, honeypot, 303,
     error shape).
   - `src/sections/ContactForm.tsx` (the **old** form): remove the `Select` and its
     grid placement; the form-level error line stays for transport failures.
   - `e2e/smoke.spec.ts`: the endpoint posts drop `topic`; remove the
     `CONTACT_TOPICS` import.
6. Confirm the old page renders byte-identically except for the missing topic select,
   and that no `next/` module is imported anywhere yet (`grep -rn "content/next"
src/ functions/ e2e/` → only the `next/` files themselves).

## Verification

- `pnpm check`, `pnpm build`, `pnpm test:e2e` all green.
- `pnpm preview` → `POST /api/contact` accepts a topicless submission and still
  rejects a missing name/email/message with the shared error strings; the honeypot
  path still returns success without sending.
- Distinctive-string spot check: grep 6+ strings from `data.js` (one per top-level
  key) in `src/content/next/` — all present, byte-identical.
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
