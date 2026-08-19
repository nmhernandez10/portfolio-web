export interface ButtonProps {
  children?: React.ReactNode;
  /** primary = honey gold, one per view. secondary = hairline. ghost = inline. inverse = on gold or photo. */
  variant?: "primary" | "secondary" | "ghost" | "inverse";
  size?: "sm" | "md" | "lg";
  /** Icon file name from assets/icons. */
  icon?: string;
  iconPosition?: "left" | "right";
  iconSet?: "ui" | "tech";
  iconBase?: string;
  fullWidth?: boolean;
  disabled?: boolean;
  /** Render as "a" for links that look like buttons. */
  as?: "button" | "a";
  href?: string;
  onClick?: (e: React.MouseEvent) => void;
  style?: React.CSSProperties;
}
export declare function Button(props: ButtonProps): JSX.Element;
