import { Button, Input, Select, Textarea } from "@/ui";

/**
 * Static markup for now. Phase 5 hydrates this file (client:visible) and adds
 * the fetch, error mapping and sent state; the fields and their names are
 * already the ones the endpoint validates, so nothing here moves.
 *
 * The full-width fields use the kit's own `style` prop rather than a class:
 * Astro strips `class` from framework components.
 */
export function ContactForm() {
  return (
    <form className="contact-form" action="/api/contact" method="post">
      <Input label="Name" name="name" placeholder="Who is writing?" required />
      <Input
        label="Email"
        name="email"
        type="email"
        placeholder="you@company.com"
        required
      />
      <Select
        label="What is this about?"
        name="topic"
        options={["A role", "Contract work", "Something else"]}
        style={{ gridColumn: "1 / -1" }}
      />
      <Textarea
        label="What are you building?"
        name="message"
        rows={5}
        placeholder="A sentence or two is plenty."
        style={{ gridColumn: "1 / -1" }}
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
        <Button icon="arrow-right">Send it</Button>
        <span className="contact-form__note">Or just email me directly.</span>
      </div>
    </form>
  );
}
