# Phase 5 — Contact endpoint

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

1. `HUMAN:` Resend setup — create/confirm the account; add and verify the `nicolasmateo.dev` domain (DNS records — verifiable even before the site moves to the domain in phase 7); create an API key. **Use a test/sandbox key until launch** (previews share production secrets — global gotcha 10). Provide: the key, and confirmation of the from address.
2. **Config**: add `EMAIL_FROM`/`EMAIL_TO` under `vars` in `wrangler.jsonc`; `wrangler secret put RESEND_API_KEY`; create `.dev.vars` with all three (confirm it's gitignored **before** writing the key into it); re-run `wrangler types` so `env` is typed.
3. **Endpoint** `src/pages/api/contact.ts`:
   - `POST` only — anything else `405`.
   - Parse `FormData` or JSON by content-type; never throw on garbage input (bad content-type, empty body → `400`, not `500`).
   - Honeypot short-circuit → success path, no send.
   - Validate per the rules above.
   - Send via Resend fetch: `from: EMAIL_FROM`, `to: EMAIL_TO`, `reply_to`: submitter's email, subject like `Portfolio contact — <topic>`, plain-text body (name, email, topic, message). Access env via the adapter's runtime locals (`context.locals.runtime.env`).
   - Resend non-2xx → `502` with a generic `{ ok: false }` message; log the status code only.
   - Respond per the dual path above.
4. **ContactForm island** (`src/sections/ContactForm.tsx`, `client:visible`), replacing the static form markup while keeping identical fields/action:
   - Progressive enhancement: intercepts submit, posts JSON via fetch; on `400` maps `errors` onto the kit `Input`/`Textarea`/`Select` `error` props (clay `#B0503A` styling comes from the kit).
   - Success: button label → "Sent, thank you", success `Tag` "I reply within a couple of days" (exact spec strings).
   - On mount, if `location.search` has `sent=1`, render the success state (completes the no-JS round trip).
5. Amend `CLAUDE.md`: env var contract, `.dev.vars` setup, "never log message bodies or submitter emails".

## Verification

Run against the built Worker: `pnpm build && pnpm wrangler dev` (and confirm `astro dev` also works via `platformProxy`).

- Valid JSON POST → `200 {"ok":true}` and **one real email arrives** (manually confirmed in the inbox; reply-to is the submitter).
- Missing email → `400` with a field error; bad topic → `400`; 6000-char message → `400`.
- Honeypot filled → success response and **no** email received.
- `GET /api/contact` → `405`.
- Form-encoded POST (curl, no JS) → `303` with `Location: /?sent=1#contact`.
- Fuzz: empty body, `Content-Type: text/plain` garbage, malformed JSON → clean `400`s, never `500`.
- Browser: full submit flow with JS (inline errors, sent state) and with JS disabled (redirect lands on the success state).
- Deploy to preview; one end-to-end send from the preview URL.
- `grep -ri "RESEND" dist/_astro/` → the key/API never appears in client bundles.

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

## Out of scope

Turnstile. Rate limiting (revisit only if abuse appears). Auto-reply emails to the submitter.
