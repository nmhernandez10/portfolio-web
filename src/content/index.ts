// The site's content layer. Import from "@/content" rather than reaching into
// the individual modules, mirroring the "@/ui" barrel.

export { profile } from "./profile";
export { SECTIONS, NAV, sectionMeta, twoDigit } from "./sections";
export type { SectionEntry, SectionId, SectionMeta } from "./sections";
export type * from "./types";
