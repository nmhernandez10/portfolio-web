import type { CSSProperties } from "react";

export interface TimelineItemProps {
  company: string;
  role: string;
  period: string;
  location?: string;
  bullets?: string[];
  /** Fills the rail node gold with a soft halo. */
  current?: boolean;
  /** Hides the connecting rail on the final item. */
  last?: boolean;
  style?: CSSProperties;
}

export function TimelineItem({
  company,
  role,
  period,
  location,
  bullets = [],
  current = false,
  last = false,
  style,
  ...rest
}: TimelineItemProps) {
  return (
    <li
      style={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        gap: "var(--space-3)",
        paddingLeft: "var(--space-8)",
        paddingBottom: last ? 0 : "var(--space-10)",
        borderLeft: last
          ? "1px solid transparent"
          : "1px solid var(--border-subtle)",
        listStyle: "none",
        ...style,
      }}
      {...rest}
    >
      <span
        style={{
          position: "absolute",
          left: -5,
          top: 6,
          width: 9,
          height: 9,
          borderRadius: "var(--radius-pill)",
          background: current ? "var(--accent)" : "var(--surface-canvas)",
          boxShadow: current
            ? "0 0 0 4px var(--accent-quiet)"
            : "inset 0 0 0 1.5px var(--border-strong)",
        }}
      ></span>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "baseline",
          gap: "var(--space-3)",
        }}
      >
        <h3
          style={{
            margin: 0,
            fontFamily: "var(--font-display)",
            fontSize: "var(--text-lg)",
            fontWeight: "var(--weight-semibold)",
            letterSpacing: "var(--tracking-heading)",
            color: "var(--text-display)",
          }}
        >
          {role}
        </h3>
        <span
          style={{
            fontSize: "var(--text-base)",
            color: "var(--text-secondary)",
          }}
        >
          {company}
        </span>
      </div>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "var(--space-4)",
          fontFamily: "var(--font-mono)",
          fontSize: "var(--text-2xs)",
          letterSpacing: "var(--tracking-label)",
          textTransform: "uppercase",
          color: "var(--text-muted)",
        }}
      >
        <span>{period}</span>
        {location ? <span>{location}</span> : null}
      </div>
      {bullets.length ? (
        <ul
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "var(--space-2)",
            margin: 0,
            padding: 0,
            listStyle: "none",
            maxWidth: "var(--measure-prose)",
          }}
        >
          {bullets.map((b, i) => (
            <li
              key={i}
              style={{
                display: "flex",
                gap: "var(--space-3)",
                fontSize: "var(--text-base)",
                lineHeight: "var(--leading-body)",
                color: "var(--text-secondary)",
              }}
            >
              <span style={{ color: "var(--accent-press)", flex: "0 0 auto" }}>
                —
              </span>
              <span>{b}</span>
            </li>
          ))}
        </ul>
      ) : null}
    </li>
  );
}
