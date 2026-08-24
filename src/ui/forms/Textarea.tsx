import { fieldBox, fieldNote, metaLabel, useFocus } from "../internal";

/** Multi-line field, matching Input's label and focus treatment. */
export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  hint?: string;
  error?: string;
  /** @default 5 */
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
  const [focus, focusHandlers] = useFocus();
  const fieldId =
    id || `ta-${(label || "field").replace(/\s+/g, "-").toLowerCase()}`;
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
        <label htmlFor={fieldId} style={metaLabel}>
          {label}
        </label>
      ) : null}
      <textarea
        id={fieldId}
        rows={rows}
        {...focusHandlers}
        style={{ ...fieldBox(focus, Boolean(error)), resize: "vertical" }}
        {...rest}
      />
      {error || hint ? (
        <span style={fieldNote(Boolean(error))}>{error || hint}</span>
      ) : null}
    </div>
  );
}
