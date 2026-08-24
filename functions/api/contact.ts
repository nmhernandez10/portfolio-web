import {
  CONTACT_ERRORS,
  CONTACT_MESSAGE_MAX,
  CONTACT_SENT_PARAM,
  CONTACT_SENT_VALUE,
} from "../../src/content/contact";
import type { ContactErrors } from "../../src/content/contact";

/**
 * The one dynamic route on an otherwise static site: it takes the contact form,
 * validates it and hands it to Resend. A Pages Function rather than an Astro
 * route — the site builds adapter-less, so functions/ is the only place a
 * request handler can live.
 *
 * functions/ is the delivery layer outside src/: it may import src/content
 * contract modules (data only) by relative path — the Pages bundler resolves no
 * aliases — and nothing else from src/.
 *
 * Nothing here ever logs a message body or a submitter address. Status codes
 * and outcomes only.
 */
interface Env {
  EMAIL_FROM: string;
  EMAIL_TO: string;
  RESEND_API_KEY: string;
}

/**
 * The handler's context, written out rather than imported. functions/ shares the
 * repo's one TypeScript program, so Request and Response come from the DOM lib
 * here as they do in src/; @cloudflare/workers-types would redefine them
 * globally for every file in that program.
 */
interface RequestContext {
  request: Request;
  env: Env;
}

const RESEND_ENDPOINT = "https://api.resend.com/emails";
const RESEND_TIMEOUT_MS = 10_000;

/** Pragmatic, not RFC 5322: reject the obviously unreachable, accept the rest. */
const EMAIL_SHAPE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * The types a browser can post cross-site without a preflight, so the ones a
 * CSRF gate has to cover. Astro's origin check guarded these until it left with
 * the adapter.
 */
const FORM_CONTENT_TYPES = [
  "application/x-www-form-urlencoded",
  "multipart/form-data",
  "text/plain",
];

interface Submission {
  name: string;
  email: string;
  message: string;
  company: string;
}

const json = (status: number, body: unknown) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json" },
  });

/** Errors are JSON on both paths; only success knows about the dual path. */
const fail = (status: number, errors: ContactErrors) =>
  json(status, { ok: false, errors });

const sent = (wantsJson: boolean) =>
  wantsJson
    ? json(200, { ok: true })
    : new Response(null, {
        status: 303,
        headers: {
          Location: `/?${CONTACT_SENT_PARAM}=${CONTACT_SENT_VALUE}#contact`,
        },
      });

/**
 * The whole wire boundary. Both formats collapse to one trimmed, typed object,
 * so nothing downstream branches on how the body arrived. Returns null for
 * anything unreadable — that is a 400, never a 500.
 */
async function readSubmission(
  request: Request,
  isJson: boolean,
): Promise<Submission | null> {
  let body: unknown;
  try {
    body = isJson ? await request.json() : await request.formData();
  } catch {
    // Malformed JSON, an empty body, or a content type formData() rejects.
    return null;
  }

  // request.json() resolves on literal null, and Object.entries(null) throws.
  const entries =
    body instanceof FormData
      ? [...body.entries()]
      : body && typeof body === "object" && !Array.isArray(body)
        ? Object.entries(body)
        : null;
  if (!entries) return null;

  const fields: Record<string, string> = {};
  for (const [key, value] of entries) {
    if (typeof value === "string") fields[key] = value.trim();
  }

  const { name = "", email = "", message = "", company = "" } = fields;
  return { name, email, message, company };
}

function validate({ name, email, message }: Submission): ContactErrors {
  const errors: ContactErrors = {};
  if (!name) errors.name = CONTACT_ERRORS.name;
  // An empty string fails the shape check too, so this covers missing as well.
  if (!EMAIL_SHAPE.test(email)) errors.email = CONTACT_ERRORS.email;
  if (message.length > CONTACT_MESSAGE_MAX)
    errors.message = CONTACT_ERRORS.message;
  return errors;
}

/** Total by construction: true means delivered, anything else is false. */
async function send(
  { name, email, message }: Submission,
  env: Env,
): Promise<boolean> {
  // All three arrive from the environment, so a misconfigured dashboard is the
  // failure mode this catches. Without it a missing binding reaches Resend and
  // comes back as an opaque rejection. Names no value, per the logging law.
  if (!env.RESEND_API_KEY || !env.EMAIL_FROM || !env.EMAIL_TO) {
    console.error("Contact endpoint is missing one of its three bindings");
    return false;
  }

  try {
    const response = await fetch(RESEND_ENDPOINT, {
      method: "POST",
      headers: {
        authorization: `Bearer ${env.RESEND_API_KEY}`,
        "content-type": "application/json",
      },
      // EMAIL_FROM goes through untouched, so "Name <user@domain>" works too.
      body: JSON.stringify({
        from: env.EMAIL_FROM,
        to: env.EMAIL_TO,
        reply_to: email,
        subject: `Portfolio contact — ${name}`,
        text: `Name: ${name}\nEmail: ${email}\n\n${message}`,
      }),
      // Without this a hung upstream holds the Function until the platform's
      // own limit.
      signal: AbortSignal.timeout(RESEND_TIMEOUT_MS),
    });
    if (!response.ok)
      console.error(`Resend rejected the send: ${response.status}`);
    return response.ok;
  } catch {
    console.error("Resend request failed before a response arrived");
    return false;
  }
}

export const onRequest = async ({
  request,
  env,
}: RequestContext): Promise<Response> => {
  // Gates answer with a status and no body — nothing on the page can reach
  // them, so there is nothing to render. The pipeline below answers with
  // fail()'s JSON, which the island does render.
  //
  // Pages routes every method to this file, so 405 is explicit. A module
  // exporting only onRequestPost would fall through to the asset handler
  // instead, giving a 404 whose shape depends on what else is deployed.
  if (request.method !== "POST")
    return new Response(null, { status: 405, headers: { Allow: "POST" } });

  // Media types are case-insensitive (RFC 9110), hence the lowercasing: one
  // parsed value decides both the gate below and how the body is read, so they
  // cannot disagree about what arrived.
  const contentType = request.headers.get("content-type") ?? "";
  const mediaType = contentType.split(";")[0].trim().toLowerCase();

  // CSRF gate, hand-held. A browser can post the form content types cross-site
  // without a preflight, so they must carry a same-origin Origin. Browsers send
  // one on same-origin form posts, so the no-JS path is unaffected; a bare curl
  // form post is a 403. application/json is exempt: a plain form cannot forge
  // it.
  if (
    (mediaType === "" || FORM_CONTENT_TYPES.includes(mediaType)) &&
    request.headers.get("origin") !== new URL(request.url).origin
  )
    return new Response(null, { status: 403 });

  // One decision drives both how the body is parsed and what a success is.
  const wantsJson = mediaType === "application/json";

  const submission = await readSubmission(request, wantsJson);
  if (!submission) return fail(400, { form: CONTACT_ERRORS.unreadable });

  // A filled honeypot is a bot: answer exactly like a success, send nothing.
  if (submission.company) return sent(wantsJson);

  const errors = validate(submission);
  if (Object.keys(errors).length > 0) return fail(400, errors);

  return (await send(submission, env))
    ? sent(wantsJson)
    : fail(502, { form: CONTACT_ERRORS.failed });
};
