import { useState } from "react";
import type { CSSProperties, MouseEventHandler, ReactNode } from "react";

export interface CardProps {
  children?: ReactNode;
  padding?: "none" | "sm" | "md" | "lg";
  tone?: "raised" | "sunken" | "accent" | "inverse" | "bare";
  /** Adds hover lift + shadow and a pointer cursor. */
  interactive?: boolean;
  as?: "div" | "a" | "article" | "section" | "li";
  href?: string;
  style?: CSSProperties;
}

/**
 * The exported contract is CardProps. The implementation also accepts the two
 * hover handlers because ProjectCard and ProjectBrief drive their own hover
 * state through Card — in the original JSX those arrived via ...rest.
 */
type CardImplProps = CardProps & {
  onMouseEnter?: MouseEventHandler;
  onMouseLeave?: MouseEventHandler;
};

export function Card({
  children,
  padding = "md",
  tone = "raised",
  interactive = false,
  as = "div",
  style,
  ...rest
}: CardImplProps) {
  const [hover, setHover] = useState(false);
  const Tag = as;
  const pad = {
    none: 0,
    sm: "var(--space-5)",
    md: "var(--pad-card)",
    lg: "var(--pad-card-lg)",
  }[padding];
  const tones = {
    raised: {
      background: "var(--surface-card)",
      border: "1px solid var(--border-subtle)",
    },
    sunken: {
      background: "var(--surface-sunken)",
      border: "1px solid transparent",
    },
    accent: {
      background: "var(--surface-accent-soft)",
      border: "1px solid var(--gold-200)",
    },
    inverse: {
      background: "var(--ink-1)",
      border: "1px solid var(--border-inverse)",
      color: "var(--paper-0)",
    },
    bare: { background: "transparent", border: "1px solid transparent" },
  }[tone];
  return (
    <Tag
      onMouseEnter={interactive ? () => setHover(true) : undefined}
      onMouseLeave={interactive ? () => setHover(false) : undefined}
      style={{
        borderRadius: "var(--radius-card)",
        padding: pad,
        transition: "var(--transition-control)",
        boxShadow:
          interactive && hover ? "var(--shadow-2)" : "var(--shadow-none)",
        transform: interactive && hover ? "translateY(-2px)" : "none",
        cursor: interactive ? "pointer" : undefined,
        textDecoration: "none",
        color: "inherit",
        ...tones,
        ...(interactive && hover
          ? { borderColor: "var(--border-strong)" }
          : null),
        ...style,
      }}
      {...rest}
    >
      {children}
    </Tag>
  );
}
