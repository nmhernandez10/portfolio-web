import * as React from 'react';

/**
 * Framed photograph. Desaturated at rest, colour on hover — the one photographic
 * flourish in the system.
 */
export interface PortraitProps extends React.HTMLAttributes<HTMLDivElement> {
  src: string;
  alt?: string;
  /** Width in px; arch/soft/square shapes are 1.22× taller. @default 220 */
  size?: number;
  /** @default "arch" */
  shape?: 'arch' | 'round' | 'soft' | 'square';
  /** @default true */
  grayscale?: boolean;
}

export declare function Portrait(props: PortraitProps): JSX.Element;
