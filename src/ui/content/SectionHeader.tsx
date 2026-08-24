import { metaLabel, monoLabel } from "../internal";

/**
 * Section opener: mono index + label, serif statement, optional lead
 * paragraph. Every major section on the site starts with one.
 */
export interface SectionHeaderProps extends React.HTMLAttributes<HTMLElement> {
  /** Mono ordinal, e.g. "01". Rendered in clay. */
  index?: string;
  /** Mono uppercase category, e.g. "Selected work". */
  label?: string;
  /** The serif statement. Keep under ~10 words. */
  title: string;
  /** Optional supporting paragraph. */
  lead?: string;
  /** @default "left" */
  align?: "left" | "center";
}

export function SectionHeader({
  index,
  label,
  title,
  lead,
  align = "left",
  style,
  ...rest
}: SectionHeaderProps) {
  return (
    <header
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "var(--space-4)",
        alignItems: align === "center" ? "center" : "flex-start",
        textAlign: align,
        marginBottom: "var(--space-7)",
        ...style,
      }}
      {...rest}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "var(--space-3)",
        }}
      >
        {index ? (
          <span style={{ ...monoLabel, color: "var(--clay)" }}>{index}</span>
        ) : null}
        {label ? <span style={metaLabel}>{label}</span> : null}
      </div>
      <h2
        style={{
          font: "var(--type-statement)",
          letterSpacing: "var(--tracking-display)",
          color: "var(--text-heading)",
          maxWidth: "18ch",
        }}
      >
        {title}
      </h2>
      {lead ? (
        <p
          style={{
            font: "var(--type-lead)",
            color: "var(--text-body)",
            maxWidth: "var(--measure-prose)",
          }}
        >
          {lead}
        </p>
      ) : null}
    </header>
  );
}
