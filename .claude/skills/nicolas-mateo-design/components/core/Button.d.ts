import * as React from 'react';

/**
 * Pill button in four weights. Primary (ink) is the page's single strongest
 * action; accent (clay) is reserved for one call-to-action per screen.
 *
 * @startingPoint section="Core" subtitle="Pill buttons — primary, accent, secondary, ghost" viewport="700x180"
 */
export interface ButtonProps extends React.HTMLAttributes<HTMLElement> {
  children?: React.ReactNode;
  /** Visual weight. @default "primary" */
  variant?: 'primary' | 'accent' | 'secondary' | 'ghost';
  /** @default "md" */
  size?: 'sm' | 'md' | 'lg';
  /** Renders an <a> instead of a <button>. */
  href?: string;
  /** Glyph placed after the label (e.g. an arrow). */
  trailing?: React.ReactNode;
  /** Glyph placed before the label. */
  leading?: React.ReactNode;
  disabled?: boolean;
  /** Stretch to the container width. @default false */
  full?: boolean;
  type?: 'button' | 'submit' | 'reset';
}

export declare function Button(props: ButtonProps): JSX.Element;
