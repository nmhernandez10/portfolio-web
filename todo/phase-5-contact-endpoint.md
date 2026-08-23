# Phase 5 — Contact endpoint

> **Amended 2026-08-22 — the endpoint relocates in phase 6.1 (Pages migration).** The logic is unchanged but lives in `functions/api/contact.ts` as a Pages Function reading `context.env` — `cloudflare:workers` is Workers-only and goes with the adapter. Deviation 5's Astro origin check disappears with the adapter too and is hand-implemented in the Function with identical semantics. The outstanding DoD items retarget `pnpm preview` on 8788 and the Pages preview URL; remaining item 3 (`wrangler secret put`) is superseded by 6.1's per-environment dashboard secrets.

## Goal

The contact form sends real email via Resend from the same Worker, with validation and spam protection — and still works with JavaScript disabled. May run before or after phase 4.

## Decisions (locked)

- One on-demand route: `src/pages/api/contact.ts` with `export const prerender = false` — the rest of the site stays fully static. Same Worker, no extra service.
- **Resend via plain `fetch`** to `https://api.resend.com/emails` — no SDK; it's ~15 lines and zero dependencies.
- **Email config is environment-driven, never hardcoded**:
  - `EMAIL_FROM` and `EMAIL_TO` are non-secret **`vars` in `wrangler.jsonc`** (versioned, reviewable, per-environment overridable). Initial values: `contact@nicolasmateo.dev` → `nm.hernandez1996@gmail.com`.
  - `RESEND_API_KEY` is a **Worker secret** (`wrangler secret put`). Rule: secrets = credentials, vars = configuration.
  - Locally all three live in the gitignored `.dev.vars`.
- **Validation: hand-rolled** (zod is overkill for 4 fields): trim all; `name` and `email` required; email shape check (pragmatic regex); `topic` must be in the Select's allowlist; `message` ≤ 5000 chars. Error response: `400` with `{ ok: false, errors: { field: "message" } }`. Error copy follows brand voice (sentence case, no exclamation marks).
- **Spam: honeypot only at launch.** The hidden `company` field (added in phase 3): if non-empty, return the success response **without sending**. Turnstile is deliberately not included — it adds a third-party script to a near-zero-JS page; see Appendix.
- **Dual response path**: JSON requests get `{ ok: true }`; native form posts (no JS) get `303` redirect to `/?sent=1#contact`.

## Tasks

1. [ ] `HUMAN:` Resend setup — create/confirm the account; add and verify the `nicolasmateo.dev` domain (DNS records — verifiable even before the site moves to the domain in phase 7); create an API key. **Use a test/sandbox key until launch** (previews share production secrets — global gotcha 10). Provide: the key, and confirmation of the from address.
2. [x] **Config**: add `EMAIL_FROM`/`EMAIL_TO` under `vars` in `wrangler.jsonc`; `wrangler secret put RESEND_API_KEY`; create `.dev.vars` with all three (confirm it's gitignored **before** writing the key into it); re-run `wrangler types` so `env` is typed.
3. [x] **Endpoint** `src/pages/api/contact.ts`:
   - `POST` only — anything else `405`.
   - Parse `FormData` or JSON by content-type; never throw on garbage input (bad content-type, empty body → `400`, not `500`).
   - Honeypot short-circuit → success path, no send.
   - Validate per the rules above.
   - Send via Resend fetch: `from: EMAIL_FROM`, `to: EMAIL_TO`, `reply_to`: submitter's email, subject like `Portfolio contact — <topic>`, plain-text body (name, email, topic, message). Access env via `import { env } from "cloudflare:workers"` — **not** `context.locals.runtime.env`, see deviation 1.
   - Resend non-2xx → `502` with a generic `{ ok: false }` message; log the status code only.
   - Respond per the dual path above.
4. [x] **ContactForm island** (`src/sections/ContactForm.tsx`, `client:visible`), replacing the static form markup while keeping identical fields/action:
   - Progressive enhancement: intercepts submit, posts JSON via fetch; on `400` maps `errors` onto the kit `Input`/`Textarea` `error` props (clay `#B0503A` styling comes from the kit); `Select` has none, see deviation 2.
   - Success: button label → "Sent, thank you", success `Tag` "I reply within a couple of days" (exact spec strings).
   - On mount, if `location.search` has `sent=1`, render the success state. This covers a submit that beats `client:visible` hydration, **not** a JS-disabled visitor — see deviation 4.
5. [x] Amend `CLAUDE.md`: env var contract, `.dev.vars` setup, "never log message bodies or submitter emails".

## Deviations found during implementation

Recorded here so they are not rediscovered. 1–3 and 6 were agreed before implementing; 4 follows from the static-first decision; 5 surfaced during verification; 7 is a duplication left standing on purpose.

1. **`context.locals.runtime.env` no longer exists.** `@astrojs/cloudflare@14.2.3` defines it as a getter that throws ("removed in Astro v6"), and the type dropped it, so `pnpm check` fails first. The endpoint uses `import { env } from "cloudflare:workers"`. Covered by global gotcha 11 — current docs win over the phase doc.
2. **The kit `Select` has no `error` prop** and the kit is never forked (deliberate, see `src/pages/kit.astro:333`). Inline errors are Input/Textarea only. `topic` errors — unreachable from the real form, since the native `<select>` can only emit the three allowed values — fall to the form-level line beside the button, along with transport failures.
3. **Error responses are JSON on both paths** (agreed with the user). Only success differs: `{ok:true}` for JSON, `303` for form-encoded. With JS off the browser's own `required` and `type="email"` block the realistic cases.
4. **With JS fully disabled there is no confirmation UI, and there cannot be one.** `index.astro` is prerendered, so the island's server-rendered HTML is the idle form baked at build time; the `sent=1` mount read only runs when React hydrates. The message _is_ sent and the `303` _does_ land on `/?sent=1#contact` — the visitor just sees the empty form again. **This is expected, not a failure.** Closing it for real needs either an on-demand `/` (breaks static-first) or a `:target`-revealed static element with a different redirect target (changes a locked decision). Raise in phase 6.
5. **Astro's built-in origin check sits in front of this route.** `astro/dist/core/app/origin-check.js` returns `403` for any non-GET/HEAD/OPTIONS request to an on-demand route when the `Origin` header is absent or foreign **and** the content type is form-like (`x-www-form-urlencoded`, `multipart/form-data`, `text/plain`) or missing entirely. `application/json` is exempt. Real browsers send `Origin` on same-origin form posts, so the no-JS path is unaffected — but **a bare `curl` form post gets `403`, not `303`**. Every form-encoded and `text/plain` row in the matrix below therefore needs `-H "Origin: http://localhost:8787"`. Free CSRF protection; nothing to fix.
6. **`EMAIL_FROM` ships as the display-name form** `Nicolás Hernández <contact@nicolasmateo.dev>`, not the bare address this doc lists as the initial value above. Settled with the user at plan time; the endpoint passes the var to Resend verbatim, so both forms work with no code change. Do not "correct" it back.
7. **`EMAIL_TO` duplicates `profile.email`.** It stays a `var` per the locked decision (per-environment overridable) rather than importing `@/content`, so the two values must be changed together — noted in `wrangler.jsonc` and `AGENTS.md` because a drift here delivers mail to an inbox the contact rail does not advertise, with nothing failing. Revisit at the phase-7 domain migration.

## Verification

Run against the built Worker: `pnpm build && pnpm wrangler dev` (`astro dev` was confirmed too — v14 runs dev on real workerd via the Vite plugin, so there is no `platformProxy` to configure). Form-encoded and `text/plain` rows need `-H "Origin: <base>"` per deviation 5.

- [x] `pnpm format`, `pnpm check` (**0 errors / 0 warnings / 0 hints** across 48 files) and `pnpm build` all clean.
- [ ] Valid JSON POST → `200 {"ok":true}` and **one real email arrives** (reply-to is the submitter). **Blocked on task 1** — `RESEND_API_KEY` is empty locally, so this returns `502` and logs `Resend rejected the send: 401`. The whole path up to and including the Resend HTTP call is exercised; only delivery is unproven.
- [x] Missing email → `400` `errors.email`; missing name → `400` `errors.name`; malformed email → `400`; bad topic → `400` `errors.topic`; 6000-char message → `400` `errors.message`. A 5000-char message passes validation (boundary is inclusive), and whitespace-only values trim to empty and fail.
- [x] Honeypot filled → success response and **no** send: `200 {"ok":true}` on JSON, `303` on form-encoded. A whitespace-only honeypot trims to empty and is _not_ treated as a bot.
- [x] `GET /api/contact` → `405` with `Allow: POST`.
- [x] Form-encoded POST → `303` with `Location: /?sent=1#contact`.
- [x] Fuzz, all clean `400`s and never a `500`: empty body, `text/plain` garbage, malformed JSON, JSON `null`, `[]`, `"hello"`, `7`, and an object whose values are objects/arrays/null.
- [x] Same matrix re-run against `astro dev` on 4321 — identical results, so `.dev.vars` reaches `cloudflare:workers` on both paths. Both servers list `env.EMAIL_FROM`, `env.EMAIL_TO`, `env.RESEND_API_KEY` as bound.
- [x] Worker logs carry the status code only (`Resend rejected the send: 401`); grepping the logs for the test addresses and names returns nothing.
- [ ] Browser: full submit flow with JS (inline errors, sent state). **Needs a human — no browser in this session.**
- [x] JS-disabled behaviour, as far as static output can prove it: the built `index.html` still carries the whole form (`<form class="contact-form" action="/api/contact" method="post">`, all five fields, all three options, the idle note, no sent-state copy). Per deviation 4, the redirect lands on that idle form — that is the expected result.
- [ ] Deploy to preview; one end-to-end send from the preview URL. **Not done — this session does not push.**
- [x] `grep -ril "resend\|re_" dist/client/` empty; `grep -r "fonts.googleapis" dist/` empty; no `profile.ts` data in any client chunk.
- [x] Exactly two islands on the page (`client="load"` + `client="visible"`), one `<h1>`, 7 `.reveal` bodies — unchanged from phase 4.

Shipped-JS delta (phase 4 baseline was 193,781 raw / 61,285 gzip):

| chunk                                   |         raw |       gzip |
| --------------------------------------- | ----------: | ---------: |
| `client.*.js`                           |     184,092 |     57,181 |
| `ui.*.js` (new, shared by both islands) |       9,026 |      2,580 |
| `react.*.js`                            |       7,607 |      2,936 |
| `ContactForm.*.js` (new)                |       2,390 |      1,261 |
| `SiteThemeToggle.*.js`                  |         404 |        322 |
| **total**                               | **203,519** | **64,280** |

Net **+9,738 raw / +2,995 gzip** for the second island. `SiteThemeToggle` shrank from 2,082 to 404 because the kit code it shares with `ContactForm` moved into the new `ui` chunk.

## Gotchas

- `.dev.vars` in `.gitignore` **before** the key exists anywhere on disk.
- Resend can only send from the verified domain — `EMAIL_FROM` must be `@nicolasmateo.dev`, not the Gmail address.
- Never log message bodies or submitter emails in Worker logs — status codes and outcomes only.
- Preview and production share the same secret until launch; the test key limits blast radius. Rotation is a phase-7 task.
- Keep the endpoint's error messages in brand voice; they render in the UI.

## Appendix — Turnstile (not executed now)

Add only if real spam materializes post-launch: Cloudflare Turnstile invisible widget on the form island, token verified server-side in `contact.ts` via the siteverify endpoint (`TURNSTILE_SECRET` as a Worker secret, site key as a var). Slots in after the honeypot check. Cost: one third-party script — why it's excluded at launch.

## Definition of Done

Inherited DoD, plus: full curl matrix green, one verified real delivery from local and one from preview, no secrets in client output.

**Not met yet.** The curl matrix is green and no secrets reach the client, but both real deliveries are outstanding and no PR has been opened. Status is _Implemented_, not _Done_. Remaining, all needing a human:

1. `HUMAN:` task 1 — Resend account, verified `nicolasmateo.dev` domain, test API key.
2. Paste that key into `.dev.vars` (the file exists with the two vars and an empty `RESEND_API_KEY=` line), then re-run the valid-POST row and confirm the email lands with the submitter as reply-to.
3. `pnpm wrangler secret put RESEND_API_KEY` for the deployed Worker.
4. The browser pass with JS, then the preview deploy and one end-to-end send from the preview URL.

## Out of scope

Turnstile. Rate limiting (revisit only if abuse appears). Auto-reply emails to the submitter.
