import React from "react";
import { Icon } from "./Icon.jsx";

const iconButtonSizes = { sm: 32, md: 40, lg: 44 };

/** Square-ish icon-only control: theme toggle, social links, dismiss. */
export function IconButton({
  icon,
  label,
  set = "ui",
  size = "md",
  variant = "outline",
  iconBase,
  as = "button",
  style,
  ...rest
}) {
  const [hover, setHover] = React.useState(false);
  const box = iconButtonSizes[size] || iconButtonSizes.md;
  const Tag = as;
  const base = {
    outline: { background: "transparent", border: "1px solid var(--border-strong)", color: "var(--text-body)" },
    quiet: { background: "transparent", border: "1px solid transparent", color: "var(--text-secondary)" },
    filled: { background: "var(--accent-quiet)", border: "1px solid transparent", color: "var(--gold-700)" },
  }[variant];
  const hovered = {
    outline: { background: "var(--surface-sunken)", borderColor: "var(--ink-3)" },
    quiet: { background: "var(--surface-sunken)", color: "var(--text-body)" },
    filled: { background: "var(--gold-200)" },
  }[variant];
  return (
    <Tag
      aria-label={label}
      title={label}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: box,
        height: box,
        borderRadius: "var(--radius-pill)",
        cursor: "pointer",
        textDecoration: "none",
        transition: "var(--transition-control)",
        ...base,
        ...(hover ? hovered : null),
        ...style,
      }}
      {...rest}
    >
      <Icon name={icon} set={set} size={size === "sm" ? 15 : 17} {...(iconBase ? { base: iconBase } : {})} />
    </Tag>
  );
}
