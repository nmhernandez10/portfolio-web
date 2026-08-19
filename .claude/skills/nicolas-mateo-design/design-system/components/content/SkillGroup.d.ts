export interface SkillGroupProps {
  /** Mono uppercase cluster name: "Backend", "Data", "Cloud & DevOps". */
  title: string;
  items?: string[];
  /** Optional leading mark, e.g. "postgresql" from the tech set. */
  icon?: string;
  iconSet?: "ui" | "tech";
  iconBase?: string;
  style?: React.CSSProperties;
}
export declare function SkillGroup(props: SkillGroupProps): JSX.Element;
