import { useState } from "react";
import type { InputHTMLAttributes, ReactNode } from "react";

/**
 * `prefix` is omitted from the inherited attributes: HTMLAttributes types it as
 * a string (the RDFa attribute), while this field takes a node.
 */
export interface InputProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "prefix"
> {
  label?: string;
  hint?: string;
  /** Replaces hint and turns the border clay. */
  error?: string;
  prefix?: ReactNode;
  suffix?: ReactNode;
}

export function Input({
  label,
  hint,
  error,
  id,
  prefix,
  suffix,
  style,
  ...rest
}: InputProps) {
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
          display: "flex",
          alignItems: "center",
          gap: "var(--space-2)",
          height: "var(--control-height)",
          padding: "0 14px",
          background: "var(--surface-raised)",
          border: `1px solid ${error ? "var(--status-danger)" : focus ? "var(--accent-press)" : "var(--border-strong)"}`,
          borderRadius: "var(--radius-input)",
          boxShadow: focus ? "var(--ring-focus)" : "none",
          transition: "var(--transition-control)",
          color: "var(--text-muted)",
        }}
      >
        {prefix}
        <input
          id={fieldId}
          onFocus={() => setFocus(true)}
          onBlur={() => setFocus(false)}
          style={{
            flex: 1,
            minWidth: 0,
            border: "none",
            outline: "none",
            background: "transparent",
            font: "inherit",
            fontFamily: "var(--font-body)",
            fontSize: "var(--text-base)",
            color: "var(--text-body)",
          }}
          {...rest}
        />
        {suffix}
      </span>
      {hint && !error ? (
        <span
          style={{ fontSize: "var(--text-sm)", color: "var(--text-muted)" }}
        >
          {hint}
        </span>
      ) : null}
      {error ? (
        <span
          style={{ fontSize: "var(--text-sm)", color: "var(--status-danger)" }}
        >
          {error}
        </span>
      ) : null}
    </label>
  );
}
