export interface ProjectCardProps {
  title: string;
  /** Mono uppercase role line. */
  role: string;
  period: string;
  summary: string;
  stack?: string[];
  /** Short mono facts, e.g. "200k+ sessions". */
  metrics?: string[];
  href?: string;
  /** Image URL for the media band; omit to show the pending-screenshot state. */
  media?: string;
  mediaLabel?: string;
  iconBase?: string;
  style?: React.CSSProperties;
}
export declare function ProjectCard(props: ProjectCardProps): JSX.Element;
