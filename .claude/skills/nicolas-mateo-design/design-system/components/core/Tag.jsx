import React from "react";

const tagTones = {
  neutral: { background: "var(--surface-sunken)", color: "var(--text-secondary)", border: "1px solid var(--border-subtle)" },
  accent: { background: "var(--accent-quiet)", color: "var(--gold-700)", border: "1px solid transparent" },
  outline: { background: "transparent", color: "var(--text-secondary)", border: "1px solid var(--border-strong)" },
  success: { background: "var(--status-success-bg)", color: "var(--status-success)", border: "1px solid transparent" },
  info: { background: "var(--status-info-bg)", color: "var(--status-info)", border: "1px solid transparent" },
  danger: { background: "var(--status-danger-bg)", color: "var(--status-danger)", border: "1px solid transparent" },
};

/** Small mono label for stack items, statuses and metadata. */
export function Tag({ children, tone = "neutral", size = "md", dot = false, mono = true, style, ...rest }) {
  const small = size === "sm";
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        height: small ? 22 : 26,
        padding: small ? "0 8px" : "0 10px",
        borderRadius: "var(--radius-pill)",
        fontFamily: mono ? "var(--font-mono)" : "var(--font-body)",
        fontSize: small ? "var(--text-2xs)" : "var(--text-xs)",
        fontWeight: "var(--weight-medium)",
        letterSpacing: mono ? "var(--tracking-mono)" : "0",
        lineHeight: 1,
        whiteSpace: "nowrap",
        ...tagTones[tone],
        ...style,
      }}
      {...rest}
    >
      {dot ? <span style={{ width: 5, height: 5, borderRadius: "var(--radius-pill)", background: "currentColor" }}></span> : null}
      {children}
    </span>
  );
}
