import type { CSSProperties } from "react";

export interface SwitchProps {
  checked?: boolean;
  onChange?: (next: boolean) => void;
  /** Accessible name; also rendered beside the track when provided. */
  label?: string;
  description?: string;
  disabled?: boolean;
  style?: CSSProperties;
}

export function Switch({
  checked = false,
  onChange,
  label,
  description,
  disabled = false,
  style,
  ...rest
}: SwitchProps) {
  const on = !!checked;
  return (
    <label
      style={{
        display: "inline-flex",
        alignItems: description ? "flex-start" : "center",
        gap: "var(--space-3)",
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.45 : 1,
        ...style,
      }}
    >
      <button
        type="button"
        role="switch"
        aria-checked={on}
        aria-label={label}
        disabled={disabled}
        onClick={() => !disabled && onChange && onChange(!on)}
        style={{
          position: "relative",
          width: 42,
          height: 24,
          flex: "0 0 auto",
          padding: 0,
          border: `1px solid ${on ? "transparent" : "var(--border-strong)"}`,
          borderRadius: "var(--radius-pill)",
          background: on ? "var(--accent)" : "var(--surface-sunken)",
          cursor: "inherit",
          transition: "var(--transition-control)",
        }}
        {...rest}
      >
        <span
          style={{
            position: "absolute",
            top: 2,
            left: on ? 20 : 2,
            width: 18,
            height: 18,
            borderRadius: "var(--radius-pill)",
            background: on ? "var(--ink-1)" : "var(--surface-raised)",
            boxShadow: "var(--shadow-1)",
            transition:
              "left var(--duration-fast) var(--ease-out), background-color var(--duration-fast) var(--ease-out)",
          }}
        ></span>
      </button>
      {label || description ? (
        <span style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {label ? (
            <span
              style={{ fontSize: "var(--text-sm)", color: "var(--text-body)" }}
            >
              {label}
            </span>
          ) : null}
          {description ? (
            <span
              style={{ fontSize: "var(--text-sm)", color: "var(--text-muted)" }}
            >
              {description}
            </span>
          ) : null}
        </span>
      ) : null}
    </label>
  );
}
