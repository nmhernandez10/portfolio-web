/**
 * The page manifest: which sections exist, in what order, and what they are
 * called. Everything derived from it — the two-digit eyebrow numbers, the header
 * nav, and the SectionId union used to type anchors — comes from this one list,
 * so reordering or inserting a section can never leave a stale number or a nav
 * link pointing at an id that does not exist.
 */

export interface SectionEntry {
  readonly id: string;
  /** Present when the section appears in the header nav. */
  readonly nav?: string;
  /** Sentence case; the mono label styling uppercases it. */
  readonly eyebrow: string;
  /** Absent when the heading lives inside the section rather than above it. */
  readonly title?: string;
  readonly lede?: string;
}

export const SECTIONS = [
  {
    id: "work",
    nav: "Work",
    eyebrow: "Selected work",
    title: "Systems I own end to end",
    lede: "No screenshots here on purpose — each card states the system and the part I owned.",
  },
  {
    id: "experience",
    nav: "Experience",
    eyebrow: "Experience",
    title: "Six years of production work",
  },
  {
    id: "backend",
    nav: "Backend",
    eyebrow: "Backend",
    title: "What I build on the server",
  },
  {
    id: "full-stack",
    nav: "Full stack",
    eyebrow: "Full stack",
    title: "Where I meet the interface",
  },
  // No title: the AI section's heading sits inside the accent card.
  { id: "ai", eyebrow: "AI engineering" },
  {
    id: "contact",
    nav: "Contact",
    eyebrow: "Contact",
    title: "Tell me what you are building",
    lede: "I read everything. A sentence or two about the team and the problem is plenty to start.",
  },
] as const satisfies readonly SectionEntry[];

export type SectionId = (typeof SECTIONS)[number]["id"];

/** The brand's two-digit index: section eyebrows and project card numbers. */
export const twoDigit = (n: number) => String(n).padStart(2, "0");

/**
 * Widened once. SECTIONS is `as const` so the ids stay literal, but its members
 * are heterogeneous — reading `.title` or `.nav` off that union is an error.
 */
const ENTRIES: readonly SectionEntry[] = SECTIONS;

export const NAV = ENTRIES.filter(
  (entry): entry is SectionEntry & { nav: string } => entry.nav !== undefined,
);

export interface SectionMeta extends SectionEntry {
  /** Numbered from the manifest position, e.g. "03 / Backend". */
  eyebrow: string;
}

export function sectionMeta(id: SectionId): SectionMeta {
  const index = ENTRIES.findIndex((entry) => entry.id === id);
  const entry = ENTRIES[index];
  return { ...entry, eyebrow: `${twoDigit(index + 1)} / ${entry.eyebrow}` };
}
