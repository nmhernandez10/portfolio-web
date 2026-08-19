import React from "react";
import { Card } from "../core/Card.jsx";
import { Tag } from "../core/Tag.jsx";
import { Icon } from "../core/Icon.jsx";

/**
 * Screenshot-free variant of ProjectCard: a numbered typographic brief.
 * Use when there is no product imagery — nothing is faked, the index number
 * and the metrics row carry the visual weight instead.
 */
export function ProjectBrief({
  index,
  title,
  role,
  period,
  summary,
  stack = [],
  metrics = [],
  href = "#",
  iconBase,
  style,
  ...rest
}) {
  const [hover, setHover] = React.useState(false);
  return (
    <Card
      as="a"
      href={href}
      interactive
      padding="lg"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{ display: "flex", flexDirection: "column", gap: "var(--space-5)", ...style }}
      {...rest}
    >
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: "var(--space-4)" }}>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: "var(--text-2xs)", letterSpacing: "var(--tracking-label)", textTransform: "uppercase", color: hover ? "var(--gold-700)" : "var(--text-muted)", transition: "color var(--duration-fast) var(--ease-out)" }}>
          {index ? index + " / " : ""}{role}
        </span>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: "var(--text-2xs)", color: "var(--text-muted)" }}>{period}</span>
      </div>
      <h3 style={{ margin: 0, display: "flex", alignItems: "center", gap: "var(--space-2)", fontFamily: "var(--font-display)", fontSize: "var(--text-2xl)", fontWeight: "var(--weight-semibold)", letterSpacing: "var(--tracking-heading)", lineHeight: "var(--leading-snug)", color: "var(--text-display)" }}>
        {title}
        <Icon
          name="arrow-up-right"
          size={20}
          {...(iconBase ? { base: iconBase } : {})}
          style={{ color: "var(--accent-press)", transform: hover ? "translate(2px,-2px)" : "none", transition: "transform var(--duration-fast) var(--ease-out)" }}
        />
      </h3>
      <p style={{ margin: 0, maxWidth: "46ch", fontSize: "var(--text-base)", lineHeight: "var(--leading-body)", color: "var(--text-secondary)" }}>{summary}</p>
      {metrics.length ? (
        <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-6)", borderTop: "1px solid var(--border-subtle)", paddingTop: "var(--space-4)" }}>
          {metrics.map((m) => (
            <span key={m} style={{ fontFamily: "var(--font-mono)", fontSize: "var(--text-xs)", color: "var(--text-body)" }}>{m}</span>
          ))}
        </div>
      ) : null}
      {stack.length ? (
        <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-2)" }}>
          {stack.map((s) => <Tag key={s} size="sm">{s}</Tag>)}
        </div>
      ) : null}
    </Card>
  );
}
