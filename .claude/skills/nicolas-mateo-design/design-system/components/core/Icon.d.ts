export interface IconProps {
  /** File name in assets/icons/<set> without extension, e.g. "arrow-up-right". */
  name: string;
  /** "ui" = Lucide UI glyphs, "tech" = Simple Icons brand marks. */
  set?: "ui" | "tech";
  /** Pixel box. 14-18 inline with text, 20-24 standalone. */
  size?: number;
  /** Nudges the glyph onto the text baseline when inline. */
  strokeAlign?: boolean;
  /** Path to the assets/icons directory, relative to the host page. */
  base?: string;
  style?: React.CSSProperties;
}
export declare function Icon(props: IconProps): JSX.Element;
