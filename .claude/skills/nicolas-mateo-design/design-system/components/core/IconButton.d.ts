export interface IconButtonProps {
  icon: string;
  /** Required: becomes aria-label and title. */
  label: string;
  set?: "ui" | "tech";
  size?: "sm" | "md" | "lg";
  variant?: "outline" | "quiet" | "filled";
  iconBase?: string;
  as?: "button" | "a";
  href?: string;
  onClick?: (e: React.MouseEvent) => void;
  style?: React.CSSProperties;
}
export declare function IconButton(props: IconButtonProps): JSX.Element;
