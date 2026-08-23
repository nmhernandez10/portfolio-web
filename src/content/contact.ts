/**
 * The contact submission contract: everything the form island and the
 * /api/contact endpoint must agree on. Data only — validating a submission is
 * the endpoint's job, rendering one is the island's.
 *
 * Field labels and placeholders deliberately stay in ContactForm.tsx: only the
 * island renders them, so they are presentation, not contract.
 */

/** The Select's options and the endpoint's allowlist — one list, or silent 400s. */
export const CONTACT_TOPICS = [
  "A role",
  "Contract work",
  "Something else",
] as const;

export const CONTACT_MESSAGE_MAX = 5000;

/** The endpoint sets this on the no-JS redirect; the island reads it back on mount. */
export const CONTACT_SENT_PARAM = "sent";
export const CONTACT_SENT_VALUE = "1";

/** Brand voice — sentence case, first person, no exclamation marks. */
export const CONTACT_ERRORS = {
  name: "Tell me who is writing.",
  email: "Enter an email I can reply to.",
  topic: "Pick one of the listed topics.",
  message: `Keep the message under ${CONTACT_MESSAGE_MAX} characters.`,
  unreadable: "That submission did not come through. Try again.",
  failed: "The message did not send. Email me directly instead.",
} as const;
