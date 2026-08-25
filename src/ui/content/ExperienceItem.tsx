import { metaText, monoLabel, tagPill } from "../internal";

/**
 * One role in the experience list: period rail on the left, content on the
 * right, separated from its neighbours by a hairline.
 */
export interface ExperienceItemProps extends React.HTMLAttributes<HTMLElement> {
  role: string;
  company: string;
  location?: string;
  /** e.g. "Mar 2024 — Present" */
  period: string;
  summary?: string;
  /** Short achievement lines, 2–4 of them. */
  points?: string[];
  /** Stack tags. */
  tags?: string[];
  /** Renders the period in clay. @default false */
  current?: boolean;
}

export function ExperienceItem({
  role,
  company,
  location,
  period,
  summary,
  points = [],
  tags = [],
  current = false,
  style,
  ...rest
}: ExperienceItemProps) {
  return (
    <article
      style={{
        display: "grid",
        gridTemplateColumns: "minmax(150px, 200px) 1fr",
        gap: "var(--space-6)",
        padding: "var(--space-6) 0",
        borderTop: "1px solid var(--border-hairline)",
        ...style,
      }}
      {...rest}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "var(--space-2)",
        }}
      >
        <span
          style={{
            ...monoLabel,
            color: current ? "var(--clay)" : "var(--text-meta)",
          }}
        >
          {period}
        </span>
        {location ? <span style={metaText}>{location}</span> : null}
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "var(--space-3)",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "var(--space-1)",
          }}
        >
          <h3
            style={{
              font: "var(--type-h2)",
              letterSpacing: "var(--tracking-heading)",
            }}
          >
            {role}
          </h3>
          <span
            style={{ font: "var(--type-small)", color: "var(--text-meta)" }}
          >
            {company}
          </span>
        </div>

        {summary ? (
          <p
            style={{
              font: "var(--type-body)",
              color: "var(--text-body)",
              maxWidth: "var(--measure-prose)",
            }}
          >
            {summary}
          </p>
        ) : null}

        {points.length ? (
          <ul
            style={{
              margin: 0,
              padding: 0,
              listStyle: "none",
              display: "flex",
              flexDirection: "column",
              gap: "var(--space-2)",
              maxWidth: "var(--measure-prose)",
            }}
          >
            {points.map((p, i) => (
              <li
                key={i}
                style={{
                  display: "grid",
                  gridTemplateColumns: "14px 1fr",
                  gap: "var(--space-3)",
                  font: "var(--type-small)",
                  color: "var(--text-body)",
                }}
              >
                {/* A bullet glyph, not a word, so it keeps --ink-4. */}
                <span
                  style={{ color: "var(--ink-4)", font: "var(--type-code)" }}
                >
                  —
                </span>
                <span>{p}</span>
              </li>
            ))}
          </ul>
        ) : null}

        {tags.length ? (
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "var(--space-2)",
              marginTop: "var(--space-2)",
            }}
          >
            {tags.map((t) => (
              <span key={t} style={tagPill}>
                {t}
              </span>
            ))}
          </div>
        ) : null}
      </div>
    </article>
  );
}
