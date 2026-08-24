import * as React from 'react';

/**
 * Hairline container. Shadows only appear on hover for interactive cards —
 * at rest this system draws containers with 1px rules, not elevation.
 *
 * @startingPoint section="Core" subtitle="Hairline cards — raised, flat, sunk, inverse" viewport="700x220"
 */
export interface CardProps extends React.HTMLAttributes<HTMLElement> {
  children?: React.ReactNode;
  as?: keyof JSX.IntrinsicElements;
  /** @default "raised" */
  tone?: 'raised' | 'flat' | 'sunk' | 'inverse';
  /** Lift + shadow on hover. @default false */
  interactive?: boolean;
  /** Padding override. @default "var(--space-6)" */
  pad?: string;
  /** Renders an <a>. */
  href?: string;
}

export declare function Card(props: CardProps): JSX.Element;
