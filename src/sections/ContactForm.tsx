import { useEffect, useState } from "react";
import type { SubmitEvent } from "react";
import { Button, Input, Select, Tag, Textarea } from "@/ui";
// Subpath, not the "@/content" barrel: this is the one client-hydrated
// consumer, and the barrel also re-exports the whole résumé. See the note in
// src/content/index.ts.
import {
  CONTACT_ERRORS,
  CONTACT_SENT_PARAM,
  CONTACT_SENT_VALUE,
  CONTACT_TOPICS,
} from "@/content/contact";

/**
 * The contact form's client behaviour around the kit's frozen form components.
 * The markup below is also what the static build ships, so the form works with
 * no JS at all: it posts natively to the same endpoint, which answers a 303.
 *
 * Hydration is client:visible, so a fast submitter can beat it — that native
 * POST is not a bug. The redirect carries a sent flag, and the mount effect
 * below picks it up once React is live.
 *
 * The full-width fields use the kit's own `style` prop rather than a class:
 * Astro strips `class` from framework components, and the kit spreads the rest
 * of its props onto the inner control, not the label.
 */

type Status = "idle" | "sending" | "sent";
type Errors = Record<string, string>;

/** Fields the kit can render an error on. Everything else goes to the form line. */
const INLINE_ERRORS = ["name", "email", "message"];

export function ContactForm() {
  // Must start idle to match the prerendered HTML, or hydration mismatches.
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<Errors>({});

  useEffect(() => {
    const flag = new URLSearchParams(location.search).get(CONTACT_SENT_PARAM);
    if (flag === CONTACT_SENT_VALUE) setStatus("sent");
  }, []);

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    // Read the form before the first await: currentTarget is nulled after the
    // handler returns.
    const payload = Object.fromEntries(new FormData(event.currentTarget));

    setStatus("sending");
    setErrors({});
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (response.ok) {
        setStatus("sent");
        return;
      }
      // Inside the try on purpose: a platform error page is not JSON, and
      // parsing it must land on the same fallback rather than hang the button.
      const body = (await response.json()) as { errors?: Errors };
      setErrors(body.errors ?? { form: CONTACT_ERRORS.failed });
    } catch {
      setErrors({ form: CONTACT_ERRORS.failed });
    }
    setStatus("idle");
  }

  /** Error props for the fields that can show one, written once. */
  const fieldProps = (field: string) => ({
    error: errors[field],
    "aria-invalid": errors[field] ? (true as const) : undefined,
  });

  // Anything the kit cannot show inline — topic, transport failures — collapses
  // into the one line beside the button.
  const formError = Object.entries(errors)
    .filter(([field]) => !INLINE_ERRORS.includes(field))
    .map(([, message]) => message)
    .join(" ");

  return (
    <form
      className="contact-form"
      action="/api/contact"
      method="post"
      onSubmit={handleSubmit}
    >
      <Input
        label="Name"
        name="name"
        placeholder="Who is writing?"
        required
        {...fieldProps("name")}
      />
      <Input
        label="Email"
        name="email"
        type="email"
        placeholder="you@company.com"
        required
        {...fieldProps("email")}
      />
      <Select
        label="What is this about?"
        name="topic"
        options={[...CONTACT_TOPICS]}
        style={{ gridColumn: "1 / -1" }}
      />
      <Textarea
        label="What are you building?"
        name="message"
        rows={5}
        placeholder="A sentence or two is plenty."
        style={{ gridColumn: "1 / -1" }}
        {...fieldProps("message")}
      />
      {/* Honeypot: never seen, never focusable. A filled value means a bot. */}
      <input
        className="visually-hidden"
        type="text"
        name="company"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
      />
      <div className="contact-form__actions">
        <Button icon="arrow-right" disabled={status !== "idle"}>
          {status === "sent" ? "Sent, thank you" : "Send it"}
        </Button>
        <span className="contact-form__status" role="status">
          {status === "sent" ? (
            <Tag tone="success" dot>
              I reply within a couple of days
            </Tag>
          ) : formError ? (
            <span className="contact-form__error">{formError}</span>
          ) : (
            <span className="contact-form__note">
              Or just email me directly.
            </span>
          )}
        </span>
      </div>
    </form>
  );
}
