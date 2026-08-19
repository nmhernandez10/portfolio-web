import React from "react";

const avatarSizes = { sm: 36, md: 56, lg: 96, xl: 160 };

/**
 * Portrait holder. With no `src` it renders the initials on warm paper — the
 * documented placeholder state while real photography is missing.
 */
export function Avatar({ src, alt = "", initials = "NH", size = "md", shape = "circle", ring = false, style, ...rest }) {
  const box = typeof size === "number" ? size : avatarSizes[size] || avatarSizes.md;
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: box,
        height: box,
        flex: "0 0 auto",
        overflow: "hidden",
        background: "var(--paper-2)",
        color: "var(--text-muted)",
        borderRadius: shape === "circle" ? "var(--radius-pill)" : "var(--radius-media)",
        boxShadow: ring ? "0 0 0 1px var(--border-strong), 0 0 0 5px var(--surface-canvas), 0 0 0 6px var(--accent-line)" : "inset 0 0 0 1px var(--border-subtle)",
        fontFamily: "var(--font-mono)",
        fontSize: Math.max(10, Math.round(box * 0.26)),
        letterSpacing: "var(--tracking-mono)",
        ...style,
      }}
      {...rest}
    >
      {src ? <img src={src} alt={alt} style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : initials}
    </span>
  );
}
