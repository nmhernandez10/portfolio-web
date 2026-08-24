import { metaLabel } from "../internal";

/** A single figure with a mono caption. Use in rows of three or four. */
export interface StatBlockProps extends React.HTMLAttributes<HTMLDivElement> {
  /** e.g. "200k+" */
  value: string;
  /** Mono uppercase caption. */
  label: string;
  /** Optional smaller qualifier. */
  note?: string;
  /** @default "left" */
  align?: "left" | "center";
}

export function StatBlock({
  value,
  label,
  note,
  align = "left",
  style,
  ...rest
}: StatBlockProps) {
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
          font: "var(--weight-light) var(--size-display-m)/1 var(--font-display)",
          letterSpacing: "var(--tracking-display)",
          color: "var(--text-heading)",
        }}
      >
        {value}
      </span>
      <span style={metaLabel}>{label}</span>
      {note ? (
        /* Words, so --text-meta rather than the skill's --ink-4 (2.06). */
        <span style={{ font: "var(--type-meta)", color: "var(--text-meta)" }}>
          {note}
        </span>
      ) : null}
    </div>
  );
}
