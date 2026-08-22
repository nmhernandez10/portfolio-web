import type { CSSProperties, ReactNode } from "react";

export interface StatBlockProps {
  /** Already formatted: "200k+", "6+", "85k+". */
  value: ReactNode;
  label: string;
  note?: string;
  align?: "left" | "center";
  size?: "sm" | "md" | "lg";
  style?: CSSProperties;
}

export function StatBlock({
  value,
  label,
  note,
  align = "left",
  size = "md",
  style,
  ...rest
}: StatBlockProps) {
  const valueSize =
    size === "lg"
      ? "var(--text-4xl)"
      : size === "sm"
        ? "var(--text-xl)"
        : "var(--text-2xl)";
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "var(--space-2)",
        textAlign: align,
        ...style,
      }}
      {...rest}
    >
      <span
        style={{
          fontFamily: "var(--font-display)",
          fontSize: valueSize,
          fontWeight: "var(--weight-semibold)",
          letterSpacing: "var(--tracking-display)",
          lineHeight: 1,
          color: "var(--text-display)",
        }}
      >
        {value}
      </span>
      <span
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: "var(--text-2xs)",
          letterSpacing: "var(--tracking-label)",
          textTransform: "uppercase",
          color: "var(--text-muted)",
        }}
      >
        {label}
      </span>
      {note ? (
        <span
          style={{
            fontSize: "var(--text-sm)",
            color: "var(--text-secondary)",
            lineHeight: "var(--leading-snug)",
          }}
        >
          {note}
        </span>
      ) : null}
    </div>
  );
}
