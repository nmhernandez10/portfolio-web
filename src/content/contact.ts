/**
 * The contact submission contract: everything the form island and the
 * /api/contact endpoint must agree on. Data only — validating a submission is
 * the endpoint's job, rendering one is the island's.
 *
 * Field labels and placeholders are not part of it: they are presentation, and
 * live with the rest of the page's copy.
 */

export const CONTACT_MESSAGE_MAX = 5000;

/** The endpoint sets this on the no-JS redirect; the island reads it back on mount. */
export const CONTACT_SENT_PARAM = "sent";
export const CONTACT_SENT_VALUE = "1";

/** Brand voice — sentence case, first person, no exclamation marks. */
export const CONTACT_ERRORS = {
  name: "Tell me who is writing.",
  email: "Enter an email I can reply to.",
  message: `Keep the message under ${CONTACT_MESSAGE_MAX} characters.`,
  unreadable: "That submission did not come through. Try again.",
  failed: "The message did not send. Email me directly instead.",
} as const;

/** The three fields the kit can render an error on. */
export type ContactField = "name" | "email" | "message";

/**
 * The shape errors travel in — declared here so both sides of the wire share
 * one definition, and so a key neither side handles is a compile error.
 * "form" carries what the kit cannot show inline: an unreadable body, a failed
 * send.
 */
export type ContactErrors = Partial<Record<ContactField | "form", string>>;
