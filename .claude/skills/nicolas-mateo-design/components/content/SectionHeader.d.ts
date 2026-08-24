import * as React from 'react';

/**
 * Section opener: mono index + label, serif statement, optional lead paragraph.
 * Every major section on the site starts with one.
 *
 * @startingPoint section="Content" subtitle="Numbered section opener with serif statement" viewport="700x260"
 */
export interface SectionHeaderProps extends React.HTMLAttributes<HTMLElement> {
  /** Mono ordinal, e.g. "01". Rendered in clay. */
  index?: string;
  /** Mono uppercase category, e.g. "Selected work". */
  label?: string;
  /** The serif statement. Keep under ~10 words. */
  title: string;
  /** Optional supporting paragraph. */
  lead?: string;
  /** @default "left" */
  align?: 'left' | 'center';
}

export declare function SectionHeader(props: SectionHeaderProps): JSX.Element;
