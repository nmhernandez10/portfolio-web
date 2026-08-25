import * as React from 'react';

/**
 * Small pill for a technology, status, or category. Mono by default — tags are
 * the system's main place for technical texture.
 */
export interface TagProps extends React.HTMLAttributes<HTMLSpanElement> {
  children?: React.ReactNode;
  /** @default "neutral" */
  tone?: 'neutral' | 'clay' | 'moss' | 'amber' | 'rust' | 'outline';
  /** Use the mono face. @default true */
  mono?: boolean;
  /** Leading status dot. @default false */
  dot?: boolean;
}

export declare function Tag(props: TagProps): JSX.Element;
