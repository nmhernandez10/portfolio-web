import { useState } from "react";
import type { CSSProperties } from "react";
import { Icon } from "../core/Icon";

export interface ThemeToggleProps {
  /** Controlled value; omit to let the component own its state. */
  theme?: "light" | "dark";
  onChange?: (next: "light" | "dark") => void;
  /** Element to receive data-theme. Defaults to document.documentElement. */
  target?: HTMLElement | null;
  iconBase?: string;
  style?: CSSProperties;
}

export function ThemeToggle({
  theme,
  onChange,
  target,
  iconBase,
  style,
  ...rest
}: ThemeToggleProps) {
  const [internal, setInternal] = useState(theme || "light");
  const [hover, setHover] = useState(false);
  const current = theme || internal;

  const apply = (next: "light" | "dark") => {
    setInternal(next);
    const root =
      target ||
      (typeof document !== "undefined" ? document.documentElement : null);
    if (root) root.setAttribute("data-theme", next);
    if (onChange) onChange(next);
  };

  return (
    <button
      type="button"
      aria-label={
        current === "dark" ? "Switch to light theme" : "Switch to dark theme"
      }
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
      <Icon
        name={current === "dark" ? "sun" : "moon"}
        size={15}
        {...(iconBase ? { base: iconBase } : {})}
      />
      <span
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: "var(--text-2xs)",
          letterSpacing: "var(--tracking-label)",
          textTransform: "uppercase",
        }}
      >
        {current === "dark" ? "Light" : "Dark"}
      </span>
    </button>
  );
}
