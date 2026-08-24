import type { CSSProperties, ElementType, ReactNode } from "react";
import { useHover } from "../internal";

/* borderColor is a field rather than something parsed back out of the border
   shorthand, which is what the skill's source did. Both declarations are still
   emitted, in the order the skill emitted them. */
const TONES: Record<
  NonNullable<CardProps["tone"]>,
  { background: string; borderColor: string; color?: string }
> = {
  raised: {
    background: "var(--surface-card)",
    borderColor: "var(--border-hairline)",
  },
  flat: { background: "transparent", borderColor: "var(--border-hairline)" },
  sunk: { background: "var(--surface-sunk)", borderColor: "transparent" },
  inverse: {
    background: "var(--surface-inverse)",
    borderColor: "var(--line-inverse)",
    color: "var(--text-inverse)",
  },
};

/**
 * Hairline container. Shadows only appear on hover for interactive cards —
 * at rest this system draws containers with 1px rules, not elevation.
 */
export interface CardProps extends React.HTMLAttributes<HTMLElement> {
  children?: ReactNode;
  as?: keyof React.JSX.IntrinsicElements;
  /** @default "raised" */
  tone?: "raised" | "flat" | "sunk" | "inverse";
  /** Lift + shadow on hover. @default false */
  interactive?: boolean;
  /** Padding override. @default "var(--space-6)" */
  pad?: string;
  /** Renders an <a>. */
  href?: string;
}

export function Card({
  children,
  as: Tag = "div",
  tone = "raised",
  interactive = false,
  pad = "var(--space-6)",
  href,
  style,
  ...rest
}: CardProps) {
  const [hover, hoverHandlers] = useHover();
  const { background, borderColor, color } = TONES[tone];
  // `as` is any intrinsic tag, which no single JSX signature can accept.
  const El = (href ? "a" : Tag) as ElementType;
  const box: CSSProperties = {
    display: "block",
    padding: pad,
    borderRadius: "var(--radius-lg)",
    background,
    border: `1px solid ${borderColor}`,
    ...(color ? { color } : null),
    boxShadow: interactive && hover ? "var(--shadow-md)" : "var(--shadow-none)",
    borderColor: interactive && hover ? "var(--line-2)" : borderColor,
    transform: interactive && hover ? "translateY(-2px)" : "translateY(0)",
    transition:
      "transform var(--dur-base) var(--ease-out), box-shadow var(--dur-base) var(--ease-out), border-color var(--dur-base) var(--ease-standard)",
    textDecoration: "none",
    ...style,
  };
  return (
    <El href={href} {...hoverHandlers} style={box} {...rest}>
      {children}
    </El>
  );
}
