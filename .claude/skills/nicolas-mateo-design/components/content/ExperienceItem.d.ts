import * as React from 'react';

/**
 * One role in the experience list: period rail on the left, content on the right,
 * separated from its neighbours by a hairline.
 *
 * @startingPoint section="Content" subtitle="Two-column role entry with period rail" viewport="700x300"
 */
export interface ExperienceItemProps extends React.HTMLAttributes<HTMLElement> {
  role: string;
  company: string;
  location?: string;
  /** e.g. "Mar 2024 — Present" */
  period: string;
  summary?: string;
  /** Short achievement lines, 2–4 of them. */
  points?: string[];
  /** Stack tags. */
  tags?: string[];
  /** Renders the period in clay. @default false */
  current?: boolean;
}

export declare function ExperienceItem(props: ExperienceItemProps): JSX.Element;
