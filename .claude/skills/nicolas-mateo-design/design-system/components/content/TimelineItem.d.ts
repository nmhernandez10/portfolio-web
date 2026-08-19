export interface TimelineItemProps {
  company: string;
  role: string;
  /** e.g. "March 2024 — present". */
  period: string;
  location?: string;
  bullets?: string[];
  /** Fills the rail node gold with a soft halo. */
  current?: boolean;
  /** Hides the connecting rail on the final item. */
  last?: boolean;
  style?: React.CSSProperties;
}
export declare function TimelineItem(props: TimelineItemProps): JSX.Element;
