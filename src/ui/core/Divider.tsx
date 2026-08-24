import type { CSSProperties } from "react";
import { metaLabel } from "../internal";

/** Hairline rule, optionally with a mono uppercase label on the left. */
export interface DividerProps extends React.HTMLAttributes<HTMLElement> {
  /** Mono uppercase label rendered before the rule. */
  label?: string;
  /** @default "hairline" */
  tone?: "hairline" | "strong";
  /** Vertical margin. @default "var(--space-6)" */
  space?: string;
}

export function Divider({
  label,
  tone = "hairline",
  space = "var(--space-6)",
  style,
  ...rest
}: DividerProps) {
  const color = tone === "strong" ? "var(--line-2)" : "var(--line-1)";
  if (!label) {
    return (
      <hr
        style={{
          border: 0,
          borderTop: `1px solid ${color}`,
          margin: `${space} 0`,
          ...style,
        }}
        {...rest}
      />
    );
  }
  const labelStyle: CSSProperties = { ...metaLabel, whiteSpace: "nowrap" };
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "var(--space-4)",
        margin: `${space} 0`,
        ...style,
      }}
      {...rest}
    >
      <span style={labelStyle}>{label}</span>
      <span style={{ flex: 1, height: 1, background: color }} />
    </div>
  );
}
