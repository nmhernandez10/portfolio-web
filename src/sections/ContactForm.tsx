import { useEffect, useState } from "react";
import type { SubmitEvent } from "react";
import { Button, Card, Input, Textarea } from "@/ui";
// Subpaths, not the "@/content" barrel: this is hydrated code and the barrel
// re-exports the whole résumé. Both modules imported here are import-free
// leaves — see the note in src/content/index.ts.
import { COPY } from "@/content/sections";
import {
  CONTACT_ERRORS,
  CONTACT_SENT_PARAM,
  CONTACT_SENT_VALUE,
} from "@/content/contact";
import type { ContactErrors, ContactField } from "@/content/contact";

/**
 * The contact form's client behaviour around the kit's frozen form components.
 * The markup below is also what the static build ships, so the form works with
 * no JS at all: it posts natively to the same endpoint, which answers a 303.
 *
 * Hydration is client:visible, so a fast submitter can beat it — that native
 * POST is not a bug. The redirect carries a sent flag, and the mount effect
 * below picks it up once React is live.
 *
 * The Card is the container the design draws around the fields; the <form> sits
 * inside it rather than replacing it because CardProps extends
 * React.HTMLAttributes, which has no `action` or `method`.
 */

type Status = "idle" | "sending" | "sent";

export function ContactForm() {
  // Must start idle to match the prerendered HTML, or hydration mismatches.
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<ContactErrors>({});

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
      const body = (await response.json()) as { errors?: ContactErrors };
      setErrors(body.errors ?? { form: CONTACT_ERRORS.failed });
    } catch {
      setErrors({ form: CONTACT_ERRORS.failed });
    }
    setStatus("idle");
  }

  /** Error props for the fields that can show one, written once. */
  const fieldProps = (field: ContactField) => ({
    error: errors[field],
    "aria-invalid": errors[field] ? (true as const) : undefined,
  });

  // Everything the kit cannot show inline — an unreadable body, a failed send —
  // arrives under one key and renders on the line beside the button.
  const formError = errors.form;

  return (
    <Card>
      <form
        className="contact-form"
        action="/api/contact"
        method="post"
        onSubmit={handleSubmit}
      >
        <Input
          label={COPY.form.name.label}
          name="name"
          placeholder={COPY.form.name.placeholder}
          required
          {...fieldProps("name")}
        />
        <Input
          label={COPY.form.email.label}
          name="email"
          type="email"
          placeholder={COPY.form.email.placeholder}
          required
          {...fieldProps("email")}
        />
        <Textarea
          label={COPY.form.message.label}
          name="message"
          rows={4}
          placeholder={COPY.form.message.placeholder}
          required
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
          <Button
            variant="accent"
            type="submit"
            trailing="→"
            disabled={status !== "idle"}
          >
            {COPY.form.submit}
          </Button>
          <span role="status">
            {status === "sent" ? (
              <span className="contact-form__success">{COPY.form.success}</span>
            ) : formError ? (
              <span className="contact-form__error">{formError}</span>
            ) : null}
          </span>
        </div>
      </form>
    </Card>
  );
}
