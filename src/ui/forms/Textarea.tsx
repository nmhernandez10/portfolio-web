import { useState } from "react";
import type { TextareaHTMLAttributes } from "react";

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  hint?: string;
  error?: string;
  rows?: number;
}

export function Textarea({
  label,
  hint,
  error,
  id,
  rows = 5,
  style,
  ...rest
}: TextareaProps) {
  const [focus, setFocus] = useState(false);
  const fieldId = id || rest.name || undefined;
  // Only one of hint/error renders at a time, so one id covers both. Written
  // before {...rest} on the control so a caller-supplied value still wins.
  const describedBy =
    fieldId && (error || hint)
      ? `${fieldId}-${error ? "error" : "hint"}`
      : undefined;
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
      <textarea
        id={fieldId}
        aria-describedby={describedBy}
        rows={rows}
        onFocus={() => setFocus(true)}
        onBlur={() => setFocus(false)}
        style={{
          width: "100%",
          padding: "12px 14px",
          background: "var(--surface-raised)",
          border: `1px solid ${error ? "var(--status-danger)" : focus ? "var(--accent-press)" : "var(--border-strong)"}`,
          borderRadius: "var(--radius-input)",
          boxShadow: focus ? "var(--ring-focus)" : "none",
          outline: "none",
          resize: "vertical",
          fontFamily: "var(--font-body)",
          fontSize: "var(--text-base)",
          lineHeight: "var(--leading-body)",
          color: "var(--text-body)",
          transition: "var(--transition-control)",
        }}
        {...rest}
      ></textarea>
      {hint && !error ? (
        <span
          id={fieldId ? `${fieldId}-hint` : undefined}
          style={{ fontSize: "var(--text-sm)", color: "var(--text-muted)" }}
        >
          {hint}
        </span>
      ) : null}
      {error ? (
        <span
          id={fieldId ? `${fieldId}-error` : undefined}
          style={{ fontSize: "var(--text-sm)", color: "var(--status-danger)" }}
        >
          {error}
        </span>
      ) : null}
    </label>
  );
}
