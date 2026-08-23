import { env } from "cloudflare:workers";
import type { APIRoute } from "astro";
import {
  CONTACT_ERRORS,
  CONTACT_MESSAGE_MAX,
  CONTACT_SENT_PARAM,
  CONTACT_SENT_VALUE,
  CONTACT_TOPICS,
} from "@/content";

/**
 * The one on-demand route on an otherwise static site: it takes the contact
 * form, validates it and hands it to Resend. Reads env from
 * "cloudflare:workers" — Astro.locals.runtime.env was removed in
 * @astrojs/cloudflare v14 and now throws.
 *
 * Nothing here ever logs a message body or a submitter address. Status codes
 * and outcomes only.
 */
export const prerender = false;

const RESEND_ENDPOINT = "https://api.resend.com/emails";
const RESEND_TIMEOUT_MS = 10_000;

/** Pragmatic, not RFC 5322: reject the obviously unreachable, accept the rest. */
const EMAIL_SHAPE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface Submission {
  name: string;
  email: string;
  topic: string;
  message: string;
  company: string;
}

type Errors = Record<string, string>;

const json = (status: number, body: unknown) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json" },
  });

/** Errors are JSON on both paths; only success knows about the dual path. */
const fail = (status: number, errors: Errors) =>
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

  const {
    name = "",
    email = "",
    topic = "",
    message = "",
    company = "",
  } = fields;
  return { name, email, topic, message, company };
}

function validate({ name, email, topic, message }: Submission): Errors {
  const errors: Errors = {};
  if (!name) errors.name = CONTACT_ERRORS.name;
  // An empty string fails the shape check too, so this covers missing as well.
  if (!EMAIL_SHAPE.test(email)) errors.email = CONTACT_ERRORS.email;
  if (!CONTACT_TOPICS.some((allowed) => allowed === topic)) {
    errors.topic = CONTACT_ERRORS.topic;
  }
  if (message.length > CONTACT_MESSAGE_MAX)
    errors.message = CONTACT_ERRORS.message;
  return errors;
}

/** Total by construction: true means delivered, anything else is false. */
async function send({
  name,
  email,
  topic,
  message,
}: Submission): Promise<boolean> {
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
        subject: `Portfolio contact — ${topic}`,
        text: `Name: ${name}\nEmail: ${email}\nTopic: ${topic}\n\n${message}`,
      }),
      // Without this a hung upstream holds the Worker until its own limit.
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

export const POST: APIRoute = async ({ request }) => {
  // One decision drives both how the body is parsed and what a success is.
  const wantsJson = (request.headers.get("content-type") ?? "").includes(
    "application/json",
  );

  const submission = await readSubmission(request, wantsJson);
  if (!submission) return fail(400, { form: CONTACT_ERRORS.unreadable });

  // A filled honeypot is a bot: answer exactly like a success, send nothing.
  if (submission.company) return sent(wantsJson);

  const errors = validate(submission);
  if (Object.keys(errors).length > 0) return fail(400, errors);

  return (await send(submission))
    ? sent(wantsJson)
    : fail(502, { form: CONTACT_ERRORS.failed });
};

/**
 * Astro dispatches mod[method] ?? mod.ALL, so without this a GET is a 404 plus
 * a router warning rather than the 405 it should be.
 */
export const ALL: APIRoute = () =>
  new Response(null, { status: 405, headers: { Allow: "POST" } });
