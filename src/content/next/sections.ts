/**
 * The page manifest and the page's own words — everything the site says that is
 * not résumé data. Two exports carry it: SECTIONS (the four numbered sections)
 * and COPY (every string the design kit hardcodes in its section JSX).
 *
 * Ordinals are derived from manifest position, so reordering or inserting a
 * section can never leave a stale number, and the header nav can never point at
 * an id that does not exist.
 *
 * This module deliberately imports nothing — not even ./profile. src/content is
 * reachable from hydrated islands (the nav needs its labels, the contact form
 * needs its own), and src/content/index.ts records why the résumé must not be
 * reachable from the browser bundle: the guarantee is structural, not a matter
 * of tree-shaking. An import-free leaf keeps it that way.
 */

export interface SectionEntry {
  readonly id: string;
  /** Header nav label — shorter than the mono section label. */
  readonly nav: string;
  /** Mono uppercase category above the statement, e.g. "Selected work". */
  readonly label: string;
  /** The serif statement. Short, and ends with a period. */
  readonly title: string;
  /** Supporting paragraph under the statement. Only Work carries one. */
  readonly lead?: string;
}

export const SECTIONS = [
  {
    id: "work",
    nav: "Work",
    label: "Selected work",
    title: "Systems I designed, shipped and still own.",
    lead: "Four pieces of production work, each with the constraint that shaped it.",
  },
  {
    id: "experience",
    nav: "Experience",
    label: "Experience",
    title: "Six years of production backends.",
  },
  {
    id: "about",
    nav: "About",
    label: "About",
    title: "How I work.",
  },
  {
    id: "contact",
    nav: "Contact",
    label: "Contact",
    title: "Tell me what you're building.",
  },
] as const satisfies readonly SectionEntry[];

export type SectionId = (typeof SECTIONS)[number]["id"];

/**
 * The brand's two-digit index. Section ordinals derive from manifest position
 * here; project cards and the drawer's detail lines derive theirs from array
 * position at their call sites — one rule, one owner.
 */
export const twoDigit = (n: number) => String(n).padStart(2, "0");

/**
 * Widened once. SECTIONS is `as const` so the ids stay literal, but its members
 * are heterogeneous — reading `.lead` off that union is an error.
 */
const ENTRIES: readonly SectionEntry[] = SECTIONS;

export interface SectionMeta extends SectionEntry {
  /** Derived from manifest position: "01" through "04". */
  readonly index: string;
}

export function sectionMeta(id: SectionId): SectionMeta {
  const position = ENTRIES.findIndex((entry) => entry.id === id);
  const entry = ENTRIES[position];
  return { ...entry, index: twoDigit(position + 1) };
}

/**
 * The strings the design kit holds in its section JSX rather than in data.js.
 * They live here so a section file renders data and never carries prose.
 */
export const COPY = {
  hero: {
    status: "Open to senior / staff backend roles",
    cta: {
      contact: "Get in touch",
      resume: "Résumé, PDF",
    },
  },
  about: {
    paragraphs: [
      "I lead technical design and delivery for a regulated mental health platform, working across teams of four to eight engineers and partnering directly with Product on scope and sequencing.",
      "Mentoring engineers and raising the team's review and architecture standards is a core part of how I work. I also build the tooling and automated workflows my team uses to work alongside AI coding agents.",
    ],
    educationLabel: "Education",
  },
  contact: {
    emailLabel: "Email",
    elsewhereLabel: "Elsewhere",
    locationLabel: "Based in",
    /**
     * Mirrors profile.location, which nothing here can import. Edit both, or the
     * contact block advertises a city the rest of the page does not. The "−" is
     * U+2212, not a hyphen.
     */
    locationLine: "Bogotá, Colombia · UTC−5 · remote-first",
  },
  form: {
    name: { label: "Name", placeholder: "your name" },
    email: { label: "Email", placeholder: "you@company.com" },
    message: {
      label: "Message",
      placeholder: "what you're building, and where I'd fit",
    },
    submit: "Send message",
    success: "Thanks — I'll reply within a couple of days.",
  },
  drawer: {
    close: "Close ✕",
  },
  footer: {
    /** Rendered before profile.name. */
    copyright: "© 2026",
    links: {
      email: "Email",
      github: "GitHub",
      linkedin: "LinkedIn",
      resume: "Résumé",
      backendResume: "Backend résumé",
    },
  },
} as const;
