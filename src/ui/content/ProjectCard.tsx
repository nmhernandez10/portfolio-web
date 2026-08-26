import type { CSSProperties } from "react";
import { metaText, monoLabel, tagPill, useHover } from "../internal";

/**
 * A piece of work in the projects grid: index, title, one-paragraph
 * description, stack tags. The whole card is the link.
 */
export interface ProjectCardProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  /** Mono ordinal, e.g. "01". */
  index?: string;
  title: string;
  /** Short context line above the title, e.g. "Keel Mind · 2025". */
  kicker?: string;
  description?: string;
  tags?: string[];
  /** Small closing line, e.g. "Private repo". */
  meta?: string;
  href?: string;
}

const cardTagPill: CSSProperties = { ...tagPill, background: "var(--paper)" };

export function ProjectCard({
  index,
  title,
  kicker,
  description,
  tags = [],
  meta,
  href,
  style,
  ...rest
}: ProjectCardProps) {
  const [hover, hoverHandlers] = useHover();
  return (
    <a
      href={href || "#"}
      {...hoverHandlers}
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "var(--space-4)",
        padding: "var(--space-6)",
        background: hover ? "var(--surface-card)" : "transparent",
        border: `1px solid ${hover ? "var(--line-2)" : "var(--border-hairline)"}`,
        borderRadius: "var(--radius-lg)",
        boxShadow: hover ? "var(--shadow-md)" : "none",
        transform: hover ? "translateY(-2px)" : "none",
        transition:
          "transform var(--dur-base) var(--ease-out), box-shadow var(--dur-base) var(--ease-out), background-color var(--dur-base) var(--ease-standard), border-color var(--dur-base) var(--ease-standard)",
        textDecoration: "none",
        height: "100%",
        ...style,
      }}
      {...rest}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "baseline",
          gap: "var(--space-4)",
        }}
      >
        <span style={{ ...monoLabel, color: "var(--text-meta)" }}>{index}</span>
        {/* The resting arrow is a non-word mark, so it keeps --ink-4. */}
        <span
          style={{
            font: "var(--type-label)",
            color: hover ? "var(--clay)" : "var(--ink-4)",
            transform: hover ? "translateX(3px)" : "none",
            transition:
              "transform var(--dur-base) var(--ease-out), color var(--dur-fast) var(--ease-standard)",
          }}
        >
          →
        </span>
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "var(--space-2)",
        }}
      >
        {kicker ? <span style={metaText}>{kicker}</span> : null}
        <h3
          style={{
            font: "var(--type-h2)",
            letterSpacing: "var(--tracking-heading)",
          }}
        >
          {title}
        </h3>
      </div>

      {description ? (
        <p
          style={{
            font: "var(--type-small)",
            color: "var(--text-body)",
            flex: 1,
          }}
        >
          {description}
        </p>
      ) : null}

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "var(--space-2)",
          alignItems: "center",
        }}
      >
        {tags.map((t) => (
          <span key={t} style={cardTagPill}>
            {t}
          </span>
        ))}
      </div>

      {meta ? (
        /* Words, so --text-meta rather than the skill's --ink-4 (2.06). */
        <span style={metaText}>{meta}</span>
      ) : null}
    </a>
  );
}
