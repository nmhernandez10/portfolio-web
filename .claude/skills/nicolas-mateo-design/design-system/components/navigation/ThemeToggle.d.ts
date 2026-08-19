export interface ThemeToggleProps {
  /** Controlled value; omit to let the component own its state. */
  theme?: "light" | "dark";
  onChange?: (next: "light" | "dark") => void;
  /** Element to receive data-theme. Defaults to document.documentElement. */
  target?: HTMLElement | null;
  iconBase?: string;
  style?: React.CSSProperties;
}
export declare function ThemeToggle(props: ThemeToggleProps): JSX.Element;
