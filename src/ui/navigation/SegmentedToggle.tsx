import type { CSSProperties } from "react";

export interface SegmentedToggleProps {
  options?: Array<string | { value: string; label: string }>;
  value?: string;
  onChange?: (value: string) => void;
  size?: "sm" | "md";
  style?: CSSProperties;
}

export function SegmentedToggle({
  options = [],
  value,
  onChange,
  size = "md",
  style,
  ...rest
}: SegmentedToggleProps) {
  const items = options.map((o) =>
    typeof o === "string" ? { value: o, label: o } : o,
  );
  const active = value ?? items[0]?.value;
  const height = size === "sm" ? 32 : 40;
  return (
    <div
      role="tablist"
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 2,
        padding: 3,
        background: "var(--surface-sunken)",
        border: "1px solid var(--border-subtle)",
        borderRadius: "var(--radius-pill)",
        ...style,
      }}
      {...rest}
    >
      {items.map((item) => {
        const on = item.value === active;
        return (
          <button
            key={item.value}
            role="tab"
            aria-selected={on}
            onClick={() => onChange && onChange(item.value)}
            style={{
              height: height - 6,
              padding: size === "sm" ? "0 12px" : "0 16px",
              border: "none",
              borderRadius: "var(--radius-pill)",
              background: on ? "var(--surface-raised)" : "transparent",
              boxShadow: on ? "var(--shadow-1)" : "none",
              color: on ? "var(--text-body)" : "var(--text-muted)",
              fontFamily: "var(--font-mono)",
              fontSize: size === "sm" ? "var(--text-2xs)" : "var(--text-xs)",
              letterSpacing: "var(--tracking-label)",
              textTransform: "uppercase",
              cursor: "pointer",
              whiteSpace: "nowrap",
              transition: "var(--transition-control)",
            }}
          >
            {item.label}
          </button>
        );
      })}
    </div>
  );
}
