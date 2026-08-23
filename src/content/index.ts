// The site's content layer. Import from "@/content" rather than reaching into
// the individual modules, mirroring the "@/ui" barrel.
//
// One sanctioned exception: ContactForm.tsx imports "@/content/contact"
// directly. It is the only client-hydrated consumer, and this barrel also
// re-exports the whole of profile.ts — a subpath import makes it structurally
// impossible for the résumé to reach the browser bundle.

export { profile } from "./profile";
export { SECTIONS, NAV, sectionMeta, twoDigit } from "./sections";
export type { SectionEntry, SectionId, SectionMeta } from "./sections";
export type * from "./types";

export {
  CONTACT_ERRORS,
  CONTACT_MESSAGE_MAX,
  CONTACT_SENT_PARAM,
  CONTACT_SENT_VALUE,
  CONTACT_TOPICS,
} from "./contact";
