import * as React from 'react';

/**
 * A labelled run of skills, slash-separated. Rows stack into a hairline table.
 */
export interface SkillGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Mono uppercase category, e.g. "Backend". */
  title: string;
  items?: string[];
}

export declare function SkillGroup(props: SkillGroupProps): JSX.Element;
