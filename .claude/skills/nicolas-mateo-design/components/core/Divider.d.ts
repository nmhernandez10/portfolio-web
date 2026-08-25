import * as React from 'react';

/** Hairline rule, optionally with a mono uppercase label on the left. */
export interface DividerProps extends React.HTMLAttributes<HTMLElement> {
  /** Mono uppercase label rendered before the rule. */
  label?: string;
  /** @default "hairline" */
  tone?: 'hairline' | 'strong';
  /** Vertical margin. @default "var(--space-6)" */
  space?: string;
}

export declare function Divider(props: DividerProps): JSX.Element;
