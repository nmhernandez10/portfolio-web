export interface AvatarProps {
  /** Omit to render the initials placeholder. */
  src?: string;
  alt?: string;
  initials?: string;
  size?: "sm" | "md" | "lg" | "xl" | number;
  shape?: "circle" | "rounded";
  /** Paper gap + gold hairline ring, for the hero portrait. */
  ring?: boolean;
  style?: React.CSSProperties;
}
export declare function Avatar(props: AvatarProps): JSX.Element;
