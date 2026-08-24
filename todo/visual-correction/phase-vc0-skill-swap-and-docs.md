# Phase VC0 — Skill swap and docs

## Goal

The replaced design skill is committed, and every governing document (`AGENTS.md`,
`todo/README.md`) points at the new skill instead of the deleted one. After this phase a
fresh session reading the docs learns the **new** laws — clay, three typefaces, no
icons, light + dark — and can find every source file it needs. No site code changes.

## Decisions (locked)

- The skill swap is committed **as-is, byte-verbatim** — the skill is the source of
  truth and is never edited to fit the repo. Where a skill value cannot ship (the Google
  Fonts `@import`), the adaptation happens on the `src/` side in later phases and is
  documented there.
- `AGENTS.md` remains the single canonical agent doc; `CLAUDE.md` keeps importing it.
- The old design laws are **rewritten, not annotated** — a reader should never have to
  know gold existed. The historical record lives in git and in `todo/` phase docs.

## Tasks

1. [x] **Commit the skill swap.** Already done before this phase ran: the swap and the
       planning session's `todo/` work landed together in `f30aef2`. Verified — `git status`
       clean, 95 files tracked under `.claude/skills/`, nothing ignored. No commit to make.
2. [x] **Run phase 7, task 0.A now.** The premise was stale. `git ls-remote origin`
       (2026-08-24) shows `refs/heads/main` already on GitHub at `64f539a` — the same SHA as
       local `main` — with remote `HEAD` on `dev`. So no push was needed and nothing blocked
       the PR. What is genuinely missing is `HUMAN:` work with no CLI path here (`gh` is not
       installed): the default-branch switch to `main` and branch protection requiring the
       `ci` check. `phase-7-launch.md` task 0.A and `visual-correction/README.md` risk 0 were
       corrected to say this instead of "`main` was never pushed".
       Task 0.B checked with the user: the Pages project is **not** created. VC0 is docs-only
       and VC1 validates the endpoint locally, so 0.B was retagged **when: before the VC2 PR**
       in all three docs that referenced it.
3. [x] **Rewrite the `AGENTS.md` "Design laws (non-negotiable)" section** from the new
       skill's `readme.md` and `guidelines/*.card.html`:
   - Gold is gone. The single accent is **clay** — `--clay` `oklch(0.620 0.145 45)` —
     used on section ordinals, the active nav underline, one CTA per screen and hover
     arrows; "if clay appears three times in a viewport, remove one". Never a new hue,
     never a gradient.
   - Separation is **1px hairlines, never shadows**; shadows appear only on
     interactive-card hover and behind the project drawer; a card at rest has a border
     and no shadow.
   - Radii ladder: containers 14px, inputs 8px, small chips 4px, controls and tags full
     pill. Buttons are never square.
   - **No icons of any kind** — `→` for direction, mono ordinals for steps, an em dash
     for list markers, a 5px dot for status, `✕` beside the word "Close". No icon font,
     no SVG sprite, no emoji.
   - Type: Newsreader Light 300 (name, section statements, stat figures — always light,
     tracking −0.022em), Instrument Sans 400/500/600 (everything readable), JetBrains
     Mono (12px/0.13em uppercase eyebrows, ordinals, tags, metadata). No Inter, no
     Space Grotesk. Fonts self-hosted — the skill's Google Fonts import never ships.
   - Surfaces: sections alternate `--paper` and `--paper-sunk`, no third background;
     pure white (`--paper-raised`) only on cards and form fields; `--paper-inverse` at
     most once per page. Flat color only — no imagery behind text, no patterns.
   - Both themes: dark is `[data-theme="dark"]` on `<html>`; components read semantic
     aliases only, so no component changes per theme.
   - Voice additions: banned words (_passionate, results-driven, world-class,
     cutting-edge, ninja, rockstar, seamless_), section titles are short statements
     ending with a period, project copy is two sentences (constraint, then outcome),
     "+" floors and en-dash ranges, contractions fine, exclamation marks not.
   - Keep the existing meta-rules that still hold: content never depends on JS; copy is
     first person, sentence case, no emoji, accents preserved.
4. [x] **Rewrite the `AGENTS.md` "Design source of truth" section** (and the sentence under
       the H1 about the lens toggle) to the new paths:
   - `.claude/skills/nicolas-mateo-design/readme.md` — master spec (foundations, voice,
     iconography, component inventory)
   - `…/tokens/*.css` — token values, light `:root` + `[data-theme="dark"]`
   - `…/components/{core,forms,navigation,content}/` — 14 components: `.jsx` + frozen
     `.d.ts` + `.prompt.md` usage laws
   - `…/guidelines/*.card.html` — 18 specimen cards
   - `…/ui_kits/portfolio/` — the composed page: section JSX, `data.js` (all copy),
     `portfolio-reference.png` + `portfolio-dark-reference.png` (never run the
     `index*.html` harnesses — they load React from unpkg)
   - Replace the lens-toggle note: the design now tells **one story** — "Senior Backend
     Engineer & Feature Architect" — with four numbered sections; there is no lens, no
     separate Backend/Full-stack sections, no AI card section.
5. [x] **Update the `AGENTS.md` project map and layering notes** where they describe the
       old design: the target `src/ui` component count (14), `public/icons/` (dies in VC3 —
       mark it accordingly), the two-island note (three islands after VC4: `SiteNav`,
       `ContactForm`, `WorkGrid`, plus the theme toggle inside `SiteNav`), and the
       breakpoint paragraph (numbers will be re-derived in VC5 — point it at that phase
       rather than asserting 960/720 as final).
6. [x] **Repoint `todo/README.md`.** Done by removing duplication rather than
       re-typing it (see Deviations): the "Design source of truth" section became a pointer to
       `AGENTS.md`, and the gotcha list went 11 → 9. Of the four gotchas this task named by
       their old numbers, 1 (prototype harness) became "never run the kit harnesses" and 5
       (gold), 7 (Icon public URLs) and 9 (BRAND-GUIDE voice) collapsed into a single new
       gotcha 5 pointing at `AGENTS.md` § Design laws. Old 4 (Google Fonts), 6 (no-JS), 8
       (résumé filenames), 10 and 11 survive, renumbered. **The old numbers no longer resolve
       — cite gotchas by title from here on.**
7. [x] **Surface, don't fix:** `SKILL.md` frontmatter named the skill
       `nicolas-hernandez-design` while the folder is `nicolas-mateo-design`. Raised with the
       user; they chose to **align the frontmatter** to `nicolas-mateo-design`, which is the
       name Claude Code actually registers (it resolves skills by directory, so the frontmatter
       `name` was inert). That one line is the sole sanctioned departure from "the skill ships
       byte-verbatim"; nothing else references the frontmatter name.
       **A second mismatch was surfaced and deliberately left alone**: `SKILL.md` line 7 says
       "Read the README.md file within this skill", but the file on disk is `readme.md`, so on
       a case-sensitive filesystem that instruction does not resolve. The user's decision
       covered the name only, so this stays open — resolve it here or when the skill is
       deleted in phase 7.

## Deviations from this doc (agreed, and why)

1. **The lens blockquote was deleted, not rewritten** (task 4). Task 4 asked for a note
   saying there is no lens, no separate Backend/Full-stack sections and no AI card
   section. That annotates — it teaches a reader about three things that do not exist,
   which this phase's own locked decision forbids ("rewritten, not annotated; a reader
   should never have to know gold existed"). The same rule applies to the lens. The H1
   sentence now states the new shape positively, and § Design source of truth opens with
   the one line the blockquote had earned: the skill governs, and the deliberate
   departures from it are recorded in `visual-correction/README.md` § Locked decisions.
2. **`todo/README.md`'s "Design source of truth" became a pointer, not a second copy**
   (task 6). Task 6 said it "gets the same new paths"; five paths maintained in two files
   is exactly the drift this phase exists to end. `AGENTS.md` owns them.
3. **Gotchas 5, 7 and 9 collapsed into one** (task 6) instead of being rewritten
   individually — all three only restated laws that `AGENTS.md` § Design laws now owns.
   The list went 11 → 9 and old numbers no longer resolve.
4. **Scope extended to `todo/README.md`'s "Stack and architecture (locked)" block**
   (agreed with the user). Task 6 did not name it, but it still asserted 20 components,
   an icons directory, "exactly two islands", the lens toggle and Space Grotesk — and the
   Definition of Done requires both docs to teach only the new brand. Only those five
   design-facing lines changed; the stack, Pages, layering, theme, reveal and contact
   decisions are untouched, being repo decisions rather than brand ones.

These four all follow one rule adopted for this phase: **one owner per fact.** `AGENTS.md`
owns current law and current shape; `todo/README.md` owns the plan, the dated decisions and
the traps; a phase doc owns its own tasks. Where a fact lived in both docs, the second copy
became a pointer.

## Known residue

- `todo/README.md`'s **Theme** bullet still names `SiteThemeToggle` as the island that
  syncs the attribute. That stays true until VC3 folds the control into `SiteNav`; the
  bullet records the theme _mechanism_, which this phase left untouched by design.
  VC5's docs-sync (its task 6) is where it lands.
- `AGENTS.md` § Testing still describes today's suite (two islands, a mobile menu). It is
  accurate now; VC3 and VC4 rewrite the specs and VC5 syncs the prose.

## Verification

- `git status` shows no unstaged changes under `.claude/skills/`.
- `grep -rn "design-system\|prototype\|PortraitScreens\|BRAND-GUIDE\|Space Grotesk\|gold\|#A6762A\|#E3B23C" AGENTS.md todo/README.md todo/phase-7-launch.md` → no live
  references ("gold" may legitimately appear in phase 7 only inside the "gold no
  longer exists" amendment notes).
- `pnpm format:check` passes (docs are inside Prettier's scope).
- A cold read of `AGENTS.md` alone teaches the new brand: clay, three faces, no icons,
  hairlines, both themes.

## Gotchas

- `.claude/` is in `.prettierignore` — the skill stays byte-verbatim through the format
  gate. Do not "fix" skill formatting.
- The phase 0–6.2 docs no longer exist (removed 2026-08-24; record in git history,
  open items in phase 7 task 0). If a doc or comment still links to one, repoint it to
  git history or phase 7 rather than resurrecting the file. (`phase-7-launch.md` was
  already amended during planning.)
- `AGENTS.md` gotcha rewrites must not delete rules that are about the _repo_, not the
  brand (pnpm release-age policy, Pages config lock, one-TS-program, `_headers`).

## Definition of Done

Inherited DoD, plus: skill swap committed; `AGENTS.md` + `todo/README.md` teach only
the new brand; the SKILL.md name question answered by the user; status table updated.

## Out of scope

Any change under `src/`, `public/`, `functions/`, `e2e/` or to dependencies. Writing
`docs/brand.md` (phase 7).
