import { fieldBox, fieldNote, metaLabel, useFocus } from "../internal";

/** Single-line text field with a mono uppercase label. */
export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  /** Mono uppercase label above the field. */
  label?: string;
  /** Helper text below the field. */
  hint?: string;
  /** Error message; replaces the hint and turns the border rust. */
  error?: string;
}

export function Input({ label, hint, error, id, style, ...rest }: InputProps) {
  const [focus, focusHandlers] = useFocus();
  const inputId =
    id || `in-${(label || "field").replace(/\s+/g, "-").toLowerCase()}`;
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "var(--space-2)",
        ...style,
      }}
    >
      {label ? (
        <label htmlFor={inputId} style={metaLabel}>
          {label}
        </label>
      ) : null}
      <input
        id={inputId}
        {...focusHandlers}
        style={fieldBox(focus, Boolean(error))}
        {...rest}
      />
      {error || hint ? (
        <span style={fieldNote(Boolean(error))}>{error || hint}</span>
      ) : null}
    </div>
  );
}
