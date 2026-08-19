export interface ProjectBriefProps {
  /** Two-digit index shown before the role, e.g. "01". */
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
export declare function ProjectBrief(props: ProjectBriefProps): JSX.Element;
