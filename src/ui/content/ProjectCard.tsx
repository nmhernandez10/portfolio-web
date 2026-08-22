import { useState } from "react";
import type { CSSProperties } from "react";
import { Card } from "../core/Card";
import { Tag } from "../core/Tag";
import { Icon } from "../core/Icon";

export interface ProjectCardProps {
  title: string;
  role: string;
  period: string;
  summary: string;
  stack?: string[];
  metrics?: string[];
  href?: string;
  /** Image URL for the media band; omit to show the pending-screenshot state. */
  media?: string;
  mediaLabel?: string;
  iconBase?: string;
  style?: CSSProperties;
}

export function ProjectCard({
  title,
  role,
  period,
  summary,
  stack = [],
  metrics = [],
  href = "#",
  media,
  mediaLabel = "Screenshot pending",
  iconBase,
  style,
  ...rest
}: ProjectCardProps) {
  const [hover, setHover] = useState(false);
  return (
    <Card
      as="a"
      href={href}
      interactive
      padding="none"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        ...style,
      }}
      {...rest}
    >
      <div
        style={{
          height: 168,
          background: media
            ? `var(--paper-2) url(${media}) center / cover no-repeat`
            : "var(--paper-2)",
          borderBottom: "1px solid var(--border-subtle)",
          display: "flex",
          alignItems: "flex-end",
          padding: "var(--space-4)",
        }}
      >
        {media ? null : (
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "var(--text-2xs)",
              letterSpacing: "var(--tracking-label)",
              textTransform: "uppercase",
              color: "var(--text-muted)",
            }}
          >
            {mediaLabel}
          </span>
        )}
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "var(--space-4)",
          padding: "var(--pad-card)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            justifyContent: "space-between",
            gap: "var(--space-4)",
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "var(--text-2xs)",
              letterSpacing: "var(--tracking-label)",
              textTransform: "uppercase",
              color: "var(--text-muted)",
            }}
          >
            {role}
          </span>
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "var(--text-2xs)",
              color: "var(--text-muted)",
            }}
          >
            {period}
          </span>
        </div>
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
          <Icon
            name="arrow-up-right"
            size={18}
            {...(iconBase ? { base: iconBase } : {})}
            style={{
              transform: hover ? "translate(2px,-2px)" : "none",
              transition: "transform var(--duration-fast) var(--ease-out)",
              color: "var(--accent-press)",
            }}
          />
        </h3>
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
        {metrics.length ? (
          <div
            style={{
              display: "flex",
              gap: "var(--space-6)",
              paddingTop: "var(--space-1)",
            }}
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
        {stack.length ? (
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "var(--space-2)",
              paddingTop: "var(--space-1)",
            }}
          >
            {stack.map((s) => (
              <Tag key={s} size="sm">
                {s}
              </Tag>
            ))}
          </div>
        ) : null}
      </div>
    </Card>
  );
}
