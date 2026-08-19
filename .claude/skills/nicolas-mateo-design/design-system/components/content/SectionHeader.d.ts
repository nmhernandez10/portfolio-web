export interface SectionHeaderProps {
  /** Mono uppercase kicker, often numbered: "02 / Selected work". */
  eyebrow?: string;
  title: React.ReactNode;
  lede?: React.ReactNode;
  /** Right-aligned control on the eyebrow row. */
  action?: React.ReactNode;
  align?: "left" | "center";
  /** Hairline above the header. Default true. */
  rule?: boolean;
  style?: React.CSSProperties;
}
export declare function SectionHeader(props: SectionHeaderProps): JSX.Element;
