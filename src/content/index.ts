// The site's content layer. Import from "@/content" rather than reaching into
// the individual modules, mirroring the "@/ui" barrel.
//
// The contact contract is the one module this barrel deliberately does not
// re-export. Its consumers are ContactForm.tsx, functions/api/contact.ts and
// the e2e specs, all reaching "content/contact" directly — and since this
// barrel also re-exports the whole of profile.ts, keeping the only door a
// subpath is what makes it structurally impossible for the résumé to reach the
// browser bundle.

export { profile } from "./profile";
export { SECTIONS, NAV, sectionMeta, twoDigit } from "./sections";
export type { SectionEntry, SectionId, SectionMeta } from "./sections";
export type * from "./types";
