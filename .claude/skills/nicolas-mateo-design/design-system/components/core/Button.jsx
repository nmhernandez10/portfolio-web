import React from "react";
import { Icon } from "./Icon.jsx";

const buttonSizes = {
  sm: { height: "var(--control-height-sm)", padding: "0 14px", fontSize: "var(--text-sm)", gap: 6, icon: 14 },
  md: { height: "var(--control-height)", padding: "0 var(--pad-control-x)", fontSize: "var(--text-base)", gap: 8, icon: 16 },
  lg: { height: "var(--control-height-lg)", padding: "0 28px", fontSize: "var(--text-lg)", gap: 10, icon: 18 },
};

const buttonVariants = {
  primary: { background: "var(--accent)", color: "var(--text-on-accent)", border: "1px solid transparent" },
  secondary: { background: "var(--surface-raised)", color: "var(--text-body)", border: "1px solid var(--border-strong)" },
  ghost: { background: "transparent", color: "var(--text-body)", border: "1px solid transparent" },
  inverse: { background: "var(--ink-1)", color: "var(--paper-0)", border: "1px solid transparent" },
};

const buttonHovers = {
  primary: { background: "var(--accent-hover)" },
  secondary: { background: "var(--surface-sunken)", borderColor: "var(--ink-3)" },
  ghost: { background: "var(--surface-sunken)" },
  inverse: { background: "var(--ink-0)" },
};

/** Pill-shaped action. Primary = honey gold, one per view. */
export function Button({
  children,
  variant = "primary",
  size = "md",
  icon,
  iconPosition = "right",
  iconSet = "ui",
  iconBase,
  fullWidth = false,
  disabled = false,
  as = "button",
  style,
  ...rest
}) {
  const [hover, setHover] = React.useState(false);
  const [press, setPress] = React.useState(false);
  const s = buttonSizes[size] || buttonSizes.md;
  const v = buttonVariants[variant] || buttonVariants.primary;
  const Tag = as;
  const glyph = icon ? <Icon name={icon} set={iconSet} size={s.icon} {...(iconBase ? { base: iconBase } : {})} /> : null;
  return (
    <Tag
      disabled={Tag === "button" ? disabled : undefined}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => { setHover(false); setPress(false); }}
      onMouseDown={() => setPress(true)}
      onMouseUp={() => setPress(false)}
      style={{
        display: fullWidth ? "flex" : "inline-flex",
        width: fullWidth ? "100%" : undefined,
        alignItems: "center",
        justifyContent: "center",
        gap: s.gap,
        height: s.height,
        padding: s.padding,
        fontFamily: "var(--font-body)",
        fontSize: s.fontSize,
        fontWeight: "var(--weight-medium)",
        letterSpacing: "-0.005em",
        lineHeight: 1,
        borderRadius: "var(--radius-control)",
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.4 : 1,
        textDecoration: "none",
        whiteSpace: "nowrap",
        transition: "var(--transition-control)",
        transform: press && !disabled ? "scale(var(--press-scale))" : "none",
        ...v,
        ...(hover && !disabled ? buttonHovers[variant] : null),
        ...style,
      }}
      {...rest}
    >
      {icon && iconPosition === "left" ? glyph : null}
      <span>{children}</span>
      {icon && iconPosition === "right" ? glyph : null}
    </Tag>
  );
}
