export interface StatBlockProps {
  /** Short, already formatted: "200k+", "6+", "85k+". */
  value: React.ReactNode;
  /** Mono uppercase caption under the number. */
  label: string;
  note?: string;
  align?: "left" | "center";
  size?: "sm" | "md" | "lg";
  style?: React.CSSProperties;
}
export declare function StatBlock(props: StatBlockProps): JSX.Element;
