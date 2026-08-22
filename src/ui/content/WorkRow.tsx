import { useState } from "react";
import type { CSSProperties } from "react";
import { Tag } from "../core/Tag";
import { Icon } from "../core/Icon";

export interface WorkRowProps {
  /** Two-digit index in the left column, e.g. "02". */
  index?: string;
  title: string;
  role: string;
  period: string;
  summary: string;
  stack?: string[];
  metrics?: string[];
  href?: string;
  iconBase?: string;
  style?: CSSProperties;
}

// Denser than ProjectBrief: a hairline-separated row, for listing several items with no imagery.
export function WorkRow({
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
}: WorkRowProps) {
  const [hover, setHover] = useState(false);
  return (
    <a
      href={href}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: "grid",
        gridTemplateColumns: "auto minmax(0,4fr) minmax(0,5fr) auto",
        gap: "var(--space-8)",
        alignItems: "start",
        padding: "var(--space-8) 0",
        borderTop: "1px solid var(--border-subtle)",
        borderBottom: "none",
        textDecoration: "none",
        color: "inherit",
        background: hover ? "var(--surface-sunken)" : "transparent",
        boxShadow: hover ? "inset 3px 0 0 var(--accent)" : "none",
        paddingLeft: hover ? "var(--space-5)" : 0,
        transition:
          "background-color var(--duration-fast) var(--ease-out), padding-left var(--duration-fast) var(--ease-out), box-shadow var(--duration-fast) var(--ease-out)",
        ...style,
      }}
      {...rest}
    >
      <span
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: "var(--text-xs)",
          letterSpacing: "var(--tracking-label)",
          color: hover ? "var(--gold-700)" : "var(--text-muted)",
          paddingTop: 6,
        }}
      >
        {index}
      </span>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "var(--space-2)",
        }}
      >
        <h3
          style={{
            margin: 0,
            display: "flex",
            alignItems: "center",
            gap: "var(--space-2)",
            fontFamily: "var(--font-display)",
            fontSize: "var(--text-xl)",
            fontWeight: "var(--weight-semibold)",
            letterSpacing: "var(--tracking-heading)",
            color: "var(--text-display)",
          }}
        >
          {title}
        </h3>
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "var(--text-2xs)",
            letterSpacing: "var(--tracking-label)",
            textTransform: "uppercase",
            color: "var(--text-muted)",
          }}
        >
          {role} · {period}
        </span>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "var(--space-4)",
        }}
      >
        <p
          style={{
            margin: 0,
            fontSize: "var(--text-base)",
            lineHeight: "var(--leading-body)",
            color: "var(--text-secondary)",
          }}
        >
          {summary}
        </p>
        <div
          style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-2)" }}
        >
          {stack.map((s) => (
            <Tag key={s} size="sm">
              {s}
            </Tag>
          ))}
        </div>
        {metrics.length ? (
          <div
            style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-6)" }}
          >
            {metrics.map((m) => (
              <span
                key={m}
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "var(--text-xs)",
                  color: "var(--text-body)",
                }}
              >
                {m}
              </span>
            ))}
          </div>
        ) : null}
      </div>
      <Icon
        name="arrow-up-right"
        size={20}
        {...(iconBase ? { base: iconBase } : {})}
        style={{
          color: hover ? "var(--accent-press)" : "var(--text-muted)",
          marginTop: 6,
          transform: hover ? "translate(2px,-2px)" : "none",
          transition:
            "transform var(--duration-fast) var(--ease-out), color var(--duration-fast) var(--ease-out)",
        }}
      />
    </a>
  );
}
