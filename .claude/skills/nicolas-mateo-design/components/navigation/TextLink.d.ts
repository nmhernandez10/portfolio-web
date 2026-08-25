import * as React from 'react';

/**
 * Inline link with an underline that wipes in from the left on hover.
 * The system's default link treatment outside of prose.
 */
export interface TextLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  children?: React.ReactNode;
  href?: string;
  /** Trailing arrow that nudges right on hover. @default false */
  arrow?: boolean;
  /** @default "ink" */
  tone?: 'ink' | 'accent';
  /** Opens in a new tab. @default false */
  external?: boolean;
}

export declare function TextLink(props: TextLinkProps): JSX.Element;
