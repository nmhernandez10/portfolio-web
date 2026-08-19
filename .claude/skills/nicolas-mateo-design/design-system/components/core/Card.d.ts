export interface CardProps {
  children?: React.ReactNode;
  padding?: "none" | "sm" | "md" | "lg";
  tone?: "raised" | "sunken" | "accent" | "inverse" | "bare";
  /** Adds hover lift + shadow and a pointer cursor. Use for links only. */
  interactive?: boolean;
  as?: "div" | "a" | "article" | "section" | "li";
  href?: string;
  style?: React.CSSProperties;
}
export declare function Card(props: CardProps): JSX.Element;
