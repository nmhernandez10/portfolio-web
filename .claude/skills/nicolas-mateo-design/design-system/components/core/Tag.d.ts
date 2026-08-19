export interface TagProps {
  children?: React.ReactNode;
  tone?: "neutral" | "accent" | "outline" | "success" | "info" | "danger";
  size?: "sm" | "md";
  /** Leading 5px dot, for availability and status. */
  dot?: boolean;
  /** Mono is the default; set false for prose-like tags. */
  mono?: boolean;
  style?: React.CSSProperties;
}
export declare function Tag(props: TagProps): JSX.Element;
