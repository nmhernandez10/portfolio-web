import type { CSSProperties } from "react";
import { metaLabel } from "../internal";

/** A labelled run of skills, slash-separated. Rows stack into a hairline table. */
export interface SkillGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Mono uppercase category, e.g. "Backend". */
  title: string;
  items?: string[];
}

const titleStyle: CSSProperties = { ...metaLabel, paddingTop: 4 };

export function SkillGroup({
  title,
  items = [],
  style,
  ...rest
}: SkillGroupProps) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "minmax(130px, 170px) 1fr",
        gap: "var(--space-5)",
        padding: "var(--space-5) 0",
        borderTop: "1px solid var(--border-hairline)",
        alignItems: "start",
        ...style,
      }}
      {...rest}
    >
      {/* h4 is the skill's own level; it only sits correctly under an h3. */}
      <h4 style={titleStyle}>{title}</h4>
      <p
        style={{
          font: "var(--type-body)",
          color: "var(--ink-1)",
          display: "flex",
          flexWrap: "wrap",
          gap: "0 var(--space-3)",
        }}
      >
        {items.map((it, i) => (
          <span
            key={it}
            style={{ display: "inline-flex", gap: "var(--space-3)" }}
          >
            {it}
            {/* A separator glyph, so it keeps --ink-4. */}
            {i < items.length - 1 ? (
              <span style={{ color: "var(--ink-4)" }}>/</span>
            ) : null}
          </span>
        ))}
      </p>
    </div>
  );
}
