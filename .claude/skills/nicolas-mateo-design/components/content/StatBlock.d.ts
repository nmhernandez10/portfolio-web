import * as React from 'react';

/** A single figure with a mono caption. Use in rows of three or four. */
export interface StatBlockProps extends React.HTMLAttributes<HTMLDivElement> {
  /** e.g. "200k+" */
  value: string;
  /** Mono uppercase caption. */
  label: string;
  /** Optional smaller qualifier. */
  note?: string;
  /** @default "left" */
  align?: 'left' | 'center';
}

export declare function StatBlock(props: StatBlockProps): JSX.Element;
