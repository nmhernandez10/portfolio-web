import * as React from 'react';

/**
 * Sticky top bar: name on the left, mono uppercase links on the right. The bottom
 * hairline only appears once the page is scrolled.
 *
 * @startingPoint section="Navigation" subtitle="Sticky portfolio nav with mono links" viewport="700x90"
 */
export interface NavItem { id?: string; label: string; href?: string; }

export interface NavBarProps extends React.HTMLAttributes<HTMLElement> {
  /** @default "Nicolás Hernández" */
  brand?: string;
  items?: NavItem[];
  /** id of the current section. */
  active?: string;
  /** Called with an item id; prevents default anchor navigation when provided. */
  onNavigate?: (id: string) => void;
  /** Trailing node, usually a small Button. */
  action?: React.ReactNode;
}

export declare function NavBar(props: NavBarProps): JSX.Element;
