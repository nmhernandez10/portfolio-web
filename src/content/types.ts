/**
 * Shapes for the site's content. Data only — no JSX, no styling, no imports
 * from the UI kit. This layer is what changes when the résumé changes.
 */

export interface SkillGroupContent {
  title: string;
  /** File name under public/icons/<iconSet>/, without the extension. */
  icon: string;
  iconSet?: "ui" | "tech";
  items: string[];
}

export interface Stat {
  /** Already formatted: "200k+", "4–8". */
  value: string;
  label: string;
}

export interface WorkItem {
  id: string;
  title: string;
  role: string;
  period: string;
  /** One sentence naming the system and the part I owned. */
  summary: string;
  metrics: string[];
  stack: string[];
}

export interface TimelineEntry {
  company: string;
  role: string;
  period: string;
  location: string;
  bullets: string[];
  /** Gold rail node with a halo — the role held now. */
  current?: boolean;
  /** Hides the connecting rail on the final entry. */
  last?: boolean;
}

export interface EducationEntry {
  school: string;
  degree: string;
  period: string;
}

export interface Profile {
  name: string;
  fullName: string;
  /** Positioning label for the hero meta row and <title> — not a timeline job title. */
  role: string;
  location: string;
  email: string;
  site: string;
  github: string;
  linkedin: string;
  /** URL-safe copies in public/. The header and menu advertise the full-stack one. */
  resumes: { backend: string; fullStack: string };
  /** The two hero lines, rendered with an explicit <br> between them. */
  hero: [string, string];
  lede: string;
  stats: Stat[];
  work: WorkItem[];
  timeline: TimelineEntry[];
  education: EducationEntry[];
  skills: {
    backend: SkillGroupContent[];
    fullStack: SkillGroupContent[];
  };
  aiBullets: string[];
}
