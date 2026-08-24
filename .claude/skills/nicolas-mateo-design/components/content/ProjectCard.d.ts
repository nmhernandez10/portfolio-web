import * as React from 'react';

/**
 * A piece of work in the projects grid: index, title, one-paragraph description,
 * stack tags. The whole card is the link.
 *
 * @startingPoint section="Content" subtitle="Project tile with index, tags and arrow" viewport="700x300"
 */
export interface ProjectCardProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  /** Mono ordinal, e.g. "01". */
  index?: string;
  title: string;
  /** Short context line above the title, e.g. "Keel Mind · 2025". */
  kicker?: string;
  description?: string;
  tags?: string[];
  /** Small closing line, e.g. "Private repo". */
  meta?: string;
  href?: string;
}

export declare function ProjectCard(props: ProjectCardProps): JSX.Element;
