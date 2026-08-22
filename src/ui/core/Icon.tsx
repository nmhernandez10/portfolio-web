import type { CSSProperties } from "react";

// CSS mask needs a plain public URL — a bundler-hashed src/assets import won't resolve inside mask.
const ICON_BASE = "/icons";

export interface IconProps {
  name: string;
  /** "ui" = Lucide glyphs, "tech" = Simple Icons brand marks. */
  set?: "ui" | "tech";
  size?: number;
  /** Nudges the glyph onto the text baseline when inline. */
  strokeAlign?: boolean;
  base?: string;
  style?: CSSProperties;
}

export function Icon({
  name,
  set = "ui",
  size = 18,
  strokeAlign = false,
  base = ICON_BASE,
  style,
  ...rest
}: IconProps) {
  const url = `${base}/${set}/${name}.svg`;
  const mask = `url("${url}") center / contain no-repeat`;
  return (
    <span
      aria-hidden="true"
      data-icon={name}
      style={{
        display: "inline-block",
        flex: "0 0 auto",
        width: size,
        height: size,
        background: "currentColor",
        WebkitMask: mask,
        mask: mask,
        verticalAlign: strokeAlign ? "-0.18em" : "middle",
        ...style,
      }}
      {...rest}
    ></span>
  );
}
