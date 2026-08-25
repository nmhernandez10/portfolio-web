/**
 * Shapes for the site's content. Data only — no JSX, no styling, no imports from
 * the UI kit. This layer is what changes when the résumé changes.
 *
 * Field names mirror the design kit's frozen prop contracts exactly
 * (StatBlockProps, ProjectCardProps, ExperienceItemProps, SkillGroupProps), so a
 * section spreads content straight into a component with no mapping layer.
 * Layering forbids importing those types from src/ui, so the mirroring is
 * deliberate rather than shared.
 *
 * Arrays are mutable for the same reason: the kit declares `tags?: string[]`,
 * and a readonly array is not assignable to a mutable one.
 */

export interface Stat {
  /** Already formatted: "200k+", "4–8". */
  value: string;
  label: string;
  /** Smaller qualifier under the figure. Absent on half the row by design. */
  note?: string;
}

export interface Project {
  title: string;
  /** Company and years, e.g. "Keel Mind · 2024–2025". */
  kicker: string;
  /** The constraint that shaped the work, in one sentence. */
  description: string;
  /** Drawer-only copy: three lines, numbered from their position. */
  detail: string[];
  tags: string[];
  /** Closing line on the card, e.g. "Shipped". */
  meta: string;
}

export interface ExperienceEntry {
  /** Renders the period in clay — the role held now. */
  current?: boolean;
  /** e.g. "Mar 2024 — Present". */
  period: string;
  location: string;
  role: string;
  company: string;
  summary: string;
  points: string[];
  tags: string[];
}

export interface SkillGroupContent {
  /** Mono uppercase category, e.g. "Backend". */
  title: string;
  items: string[];
}

export interface EducationEntry {
  school: string;
  degree: string;
  period: string;
}

export interface Profile {
  /** The rendered name — the brand mark is this, set in type. */
  name: string;
  /** Legal name. Rendered nowhere; the Person JSON-LD carries it. */
  fullName: string;
  /** Rendered nowhere either; the JSON-LD carries it because the domain does. */
  alternateName: string;
  /** Positioning label for the hero and <title> — not a timeline job title. */
  role: string;
  /** "City, Country" — the contact rail renders it, the JSON-LD splits it. */
  location: string;
  email: string;
  github: string;
  linkedin: string;
  /** The hero paragraph under the role. */
  lead: string;
  /** The <meta name="description"> line, which `lead` is far too long to be. */
  metaDescription: string;
  /** URL-safe copies in public/. The full-stack one is the primary link. */
  resumes: { fullStack: string; backend: string };
  stats: Stat[];
  projects: Project[];
  experience: ExperienceEntry[];
  skills: SkillGroupContent[];
  education: EducationEntry[];
}
