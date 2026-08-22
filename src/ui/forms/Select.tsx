import { useState } from "react";
import type { SelectHTMLAttributes } from "react";
import { Icon } from "../core/Icon";

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  hint?: string;
  options?: Array<string | { value: string; label: string }>;
  iconBase?: string;
}

export function Select({
  label,
  hint,
  options = [],
  id,
  iconBase,
  style,
  ...rest
}: SelectProps) {
  const [focus, setFocus] = useState(false);
  const fieldId = id || rest.name || undefined;
  return (
    <label
      htmlFor={fieldId}
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "var(--space-2)",
        ...style,
      }}
    >
      {label ? (
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
      ) : null}
      <span
        style={{
          position: "relative",
          display: "flex",
          alignItems: "center",
          height: "var(--control-height)",
          background: "var(--surface-raised)",
          border: `1px solid ${focus ? "var(--accent-press)" : "var(--border-strong)"}`,
          borderRadius: "var(--radius-input)",
          boxShadow: focus ? "var(--ring-focus)" : "none",
          transition: "var(--transition-control)",
          color: "var(--text-muted)",
        }}
      >
        <select
          id={fieldId}
          onFocus={() => setFocus(true)}
          onBlur={() => setFocus(false)}
          style={{
            appearance: "none",
            WebkitAppearance: "none",
            flex: 1,
            height: "100%",
            padding: "0 38px 0 14px",
            border: "none",
            outline: "none",
            background: "transparent",
            fontFamily: "var(--font-body)",
            fontSize: "var(--text-base)",
            color: "var(--text-body)",
            cursor: "pointer",
          }}
          {...rest}
        >
          {options.map((o) => {
            const value = typeof o === "string" ? o : o.value;
            const text = typeof o === "string" ? o : o.label;
            return (
              <option key={value} value={value}>
                {text}
              </option>
            );
          })}
        </select>
        <Icon
          name="chevron-down"
          size={16}
          {...(iconBase ? { base: iconBase } : {})}
          style={{ position: "absolute", right: 14, pointerEvents: "none" }}
        />
      </span>
      {hint ? (
        <span
          style={{ fontSize: "var(--text-sm)", color: "var(--text-muted)" }}
        >
          {hint}
        </span>
      ) : null}
    </label>
  );
}
