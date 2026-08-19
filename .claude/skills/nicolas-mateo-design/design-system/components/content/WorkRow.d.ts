export interface WorkRowProps {
  /** Two-digit index in the left column, e.g. "02". */
  index?: string;
  title: string;
  role: string;
  period: string;
  summary: string;
  stack?: string[];
  metrics?: string[];
  href?: string;
  iconBase?: string;
  style?: React.CSSProperties;
}
export declare function WorkRow(props: WorkRowProps): JSX.Element;
