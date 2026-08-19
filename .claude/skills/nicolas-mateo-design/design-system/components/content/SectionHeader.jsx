import React from "react";

/** Mono eyebrow + display heading + optional lede and right-aligned action. */
export function SectionHeader({ eyebrow, title, lede, action, align = "left", rule = true, style, ...rest }) {
  return (
    <header
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "var(--space-4)",
        paddingTop: rule ? "var(--space-6)" : 0,
        borderTop: rule ? "1px solid var(--border-subtle)" : "none",
        textAlign: align,
        ...style,
      }}
      {...rest}
    >
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: align === "center" ? "center" : "space-between", gap: "var(--space-6)", flexWrap: "wrap" }}>
        {eyebrow ? (
          <span style={{ fontFamily: "var(--font-mono)", fontSize: "var(--text-2xs)", fontWeight: "var(--weight-medium)", letterSpacing: "var(--tracking-label)", textTransform: "uppercase", color: "var(--text-muted)" }}>
            {eyebrow}
          </span>
        ) : null}
        {action}
      </div>
      <h2
        style={{
          margin: 0,
          fontFamily: "var(--font-display)",
          fontSize: "var(--type-section-size)",
          fontWeight: "var(--weight-semibold)",
          letterSpacing: "var(--tracking-heading)",
          lineHeight: "var(--leading-display)",
          color: "var(--text-display)",
          maxWidth: "22ch",
          marginInline: align === "center" ? "auto" : undefined,
        }}
      >
        {title}
      </h2>
      {lede ? (
        <p style={{ margin: 0, maxWidth: "var(--measure-lede)", marginInline: align === "center" ? "auto" : undefined, fontSize: "var(--text-lg)", lineHeight: "var(--leading-body)", color: "var(--text-secondary)" }}>
          {lede}
        </p>
      ) : null}
    </header>
  );
}
