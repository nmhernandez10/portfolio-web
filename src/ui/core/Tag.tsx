import type { ReactNode } from "react";

const TONES = {
  neutral: { bg: "var(--paper-sunk)", fg: "var(--ink-2)", bd: "var(--line-1)" },
  clay: {
    bg: "var(--clay-soft)",
    fg: "var(--clay-strong)",
    bd: "var(--clay-line)",
  },
  moss: { bg: "var(--moss-soft)", fg: "var(--moss)", bd: "transparent" },
  /* The skill hardcoded this foreground; --tag-amber-ink is that literal in
     the light theme and the palette's --amber in the dark one, where the
     literal measured 2.11. */
  amber: {
    bg: "var(--amber-soft)",
    fg: "var(--tag-amber-ink)",
    bd: "transparent",
  },
  rust: { bg: "var(--rust-soft)", fg: "var(--rust)", bd: "transparent" },
  outline: { bg: "transparent", fg: "var(--ink-2)", bd: "var(--line-2)" },
};

/**
 * Small pill for a technology, status, or category. Mono by default — tags are
 * the system's main place for technical texture.
 */
export interface TagProps extends React.HTMLAttributes<HTMLSpanElement> {
  children?: ReactNode;
  /** @default "neutral" */
  tone?: "neutral" | "clay" | "moss" | "amber" | "rust" | "outline";
  /** Use the mono face. @default true */
  mono?: boolean;
  /** Leading status dot. @default false */
  dot?: boolean;
}

export function Tag({
  children,
  tone = "neutral",
  mono = true,
  dot = false,
  style,
  ...rest
}: TagProps) {
  const t = TONES[tone];
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "var(--space-2)",
        height: 26,
        padding: "0 var(--space-3)",
        background: t.bg,
        color: t.fg,
        border: `1px solid ${t.bd}`,
        borderRadius: "var(--radius-pill)",
        font: mono
          ? "var(--weight-book) var(--size-label)/1 var(--font-mono)"
          : "var(--weight-medium) var(--size-meta)/1 var(--font-sans)",
        letterSpacing: mono ? "0.02em" : "0",
        whiteSpace: "nowrap",
        ...style,
      }}
      {...rest}
    >
      {dot ? (
        <span
          style={{
            width: 5,
            height: 5,
            borderRadius: "50%",
            background: "currentColor",
          }}
        />
      ) : null}
      {children}
    </span>
  );
}
