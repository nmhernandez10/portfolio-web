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

1. **Commit the skill swap — the first commit on `dev`.** The old skill's 124 file
   deletions are sitting unstaged and the whole new skill is untracked; any other PR
   would swallow them. `git add .claude/skills/ && git commit` (`chore:` type). If the
   planning session's `todo/` work (the `visual-correction/` docs, the phase-7
   amendments, the removal of the phase 0–6.2 docs) is still uncommitted, commit it
   separately (`docs:`).
2. **Run phase 7, task 0.A now** — push `main`, reset GitHub's default branch to
   `main`, `HUMAN:` branch protection requiring the `ci` check. This phase ends with a
   PR `dev → main`, which cannot exist until `main` is on GitHub. Check task 0.B's
   Pages-project creation with the user too: the first VC PR expects preview deploys.
3. **Rewrite the `AGENTS.md` "Design laws (non-negotiable)" section** from the new
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
4. **Rewrite the `AGENTS.md` "Design source of truth" section** (and the sentence under
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
5. **Update the `AGENTS.md` project map and layering notes** where they describe the
   old design: the target `src/ui` component count (14), `public/icons/` (dies in VC3 —
   mark it accordingly), the two-island note (three islands after VC4: `SiteNav`,
   `ContactForm`, `WorkGrid`, plus the theme toggle inside `SiteNav`), and the
   breakpoint paragraph (numbers will be re-derived in VC5 — point it at that phase
   rather than asserting 960/720 as final).
6. **Repoint `todo/README.md`**: the "Design source of truth" section gets the same new
   paths; gotchas 1 (prototype harness), 5 (gold law → clay law), 7 (Icon public URLs —
   now obsolete, replaced by the no-icons law) and 9 (BRAND-GUIDE → `readme.md` voice
   rules) are rewritten. (The Status section already points here — done during
   planning, when the phase 0–6.2 docs were removed.)
7. **Surface, don't fix:** `SKILL.md` frontmatter names the skill
   `nicolas-hernandez-design` while the folder is `nicolas-mateo-design`. Ask the user
   whether to align them; do not rename silently.

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
