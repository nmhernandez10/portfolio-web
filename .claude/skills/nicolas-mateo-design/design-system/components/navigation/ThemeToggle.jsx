import React from "react";
import { Icon } from "../core/Icon.jsx";

/**
 * Light/dark switch. Sets data-theme on the given root (document.documentElement
 * by default) so the [data-theme="dark"] token scope takes over.
 */
export function ThemeToggle({ theme, onChange, target, iconBase, style, ...rest }) {
  const [internal, setInternal] = React.useState(theme || "light");
  const [hover, setHover] = React.useState(false);
  const current = theme || internal;

  const apply = (next) => {
    setInternal(next);
    const root = target || (typeof document !== "undefined" ? document.documentElement : null);
    if (root) root.setAttribute("data-theme", next);
    if (onChange) onChange(next);
  };

  return (
    <button
      type="button"
      aria-label={current === "dark" ? "Switch to light theme" : "Switch to dark theme"}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onClick={() => apply(current === "dark" ? "light" : "dark")}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        height: 36,
        padding: "0 12px 0 10px",
        background: hover ? "var(--surface-sunken)" : "transparent",
        border: "1px solid var(--border-subtle)",
        borderRadius: "var(--radius-pill)",
        color: "var(--text-secondary)",
        cursor: "pointer",
        transition: "var(--transition-control)",
        ...style,
      }}
      {...rest}
    >
      <Icon name={current === "dark" ? "sun" : "moon"} size={15} {...(iconBase ? { base: iconBase } : {})} />
      <span style={{ fontFamily: "var(--font-mono)", fontSize: "var(--text-2xs)", letterSpacing: "var(--tracking-label)", textTransform: "uppercase" }}>
        {current === "dark" ? "Light" : "Dark"}
      </span>
    </button>
  );
}
