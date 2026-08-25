// The site's content layer. Import from "@/content" rather than reaching into
// the individual modules, mirroring the "@/ui" barrel.
//
// Three modules are deliberately not re-exported here; each is reached by its
// own subpath. ./schema is one (only / renders the JSON-LD) and ./site another
// (the origin's narrowing, which no island has any reason to see). The contact
// contract is the third, and the load-bearing one. Its consumers are
// ContactForm.tsx, functions/api/contact.ts and the e2e specs, all reaching
// "content/contact" directly — and since this barrel also re-exports the whole
// of profile.ts, keeping the only door a subpath is what makes it structurally
// impossible for the résumé to reach the browser bundle. "content/sections" is
// a subpath door for the same reason: it imports nothing, so an island can take
// its copy from there safely.

export { profile } from "./profile";
export { SECTIONS, COPY, sectionMeta, twoDigit } from "./sections";
export type { SectionEntry, SectionId, SectionMeta } from "./sections";
export type * from "./types";
