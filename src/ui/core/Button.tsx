import type { CSSProperties, ReactNode } from "react";
import { useHover } from "../internal";

const SIZES = {
  sm: {
    font: "var(--size-meta)",
    pad: "0 var(--space-3)",
    h: 30,
    gap: "var(--space-2)",
  },
  md: {
    font: "var(--size-body-s)",
    pad: "0 var(--space-4)",
    h: 38,
    gap: "var(--space-2)",
  },
  lg: {
    font: "var(--size-body)",
    pad: "0 var(--space-5)",
    h: 46,
    gap: "var(--space-3)",
  },
};

/* `hover` is declared last in every entry so that pulling it off with a rest
   destructure leaves the remaining declaration order untouched. */
const VARIANTS: Record<
  NonNullable<ButtonProps["variant"]>,
  CSSProperties & { hover: CSSProperties }
> = {
  primary: {
    background: "var(--ink-1)",
    color: "var(--text-inverse)",
    border: "1px solid var(--ink-1)",
    hover: {
      background: "var(--btn-primary-hover)",
      borderColor: "var(--btn-primary-hover)",
    },
  },
  accent: {
    background: "var(--clay)",
    color: "var(--paper)",
    border: "1px solid var(--clay)",
    hover: {
      background: "var(--clay-strong)",
      borderColor: "var(--clay-strong)",
    },
  },
  secondary: {
    background: "transparent",
    color: "var(--ink-1)",
    border: "1px solid var(--border-control)",
    hover: { background: "var(--paper-sunk)", borderColor: "var(--ink-3)" },
  },
  ghost: {
    background: "transparent",
    color: "var(--ink-2)",
    border: "1px solid transparent",
    hover: { background: "var(--paper-sunk)", color: "var(--ink-1)" },
  },
};

/**
 * Pill button in four weights. Primary (ink) is the page's single strongest
 * action; accent (clay) is reserved for one call-to-action per screen.
 */
export interface ButtonProps extends React.HTMLAttributes<HTMLElement> {
  children?: ReactNode;
  /** Visual weight. @default "primary" */
  variant?: "primary" | "accent" | "secondary" | "ghost";
  /** @default "md" */
  size?: "sm" | "md" | "lg";
  /** Renders an <a> instead of a <button>. */
  href?: string;
  /** Glyph placed after the label (e.g. an arrow). */
  trailing?: ReactNode;
  /** Glyph placed before the label. */
  leading?: ReactNode;
  disabled?: boolean;
  /** Stretch to the container width. @default false */
  full?: boolean;
  type?: "button" | "submit" | "reset";
}

export function Button({
  children,
  variant = "primary",
  size = "md",
  href,
  trailing,
  leading,
  disabled = false,
  full = false,
  type = "button",
  onClick,
  style,
  ...rest
}: ButtonProps) {
  const [hover, hoverHandlers] = useHover();
  const s = SIZES[size];
  const { hover: hoverStyle, ...v } = VARIANTS[variant];

  const base: CSSProperties = {
    display: full ? "flex" : "inline-flex",
    width: full ? "100%" : undefined,
    alignItems: "center",
    justifyContent: "center",
    gap: s.gap,
    height: s.h,
    padding: s.pad,
    font: `var(--weight-medium) ${s.font}/1 var(--font-sans)`,
    letterSpacing: "-0.005em",
    borderRadius: "var(--radius-pill)",
    cursor: disabled ? "not-allowed" : "pointer",
    opacity: disabled ? 0.4 : 1,
    textDecoration: "none",
    whiteSpace: "nowrap",
    transition:
      "var(--transition-control), transform var(--dur-instant) var(--ease-standard)",
    ...v,
    ...(hover && !disabled ? hoverStyle : null),
    ...style,
  };

  const content = (
    <>
      {leading ? (
        <span style={{ display: "flex", opacity: 0.85 }}>{leading}</span>
      ) : null}
      {children}
      {trailing ? (
        <span style={{ display: "flex", opacity: 0.85 }}>{trailing}</span>
      ) : null}
    </>
  );

  const handlers = {
    ...hoverHandlers,
    onClick: disabled ? undefined : onClick,
  };

  if (href && !disabled) {
    return (
      <a href={href} style={base} {...handlers} {...rest}>
        {content}
      </a>
    );
  }
  return (
    <button
      type={type}
      disabled={disabled}
      style={base}
      {...handlers}
      {...rest}
    >
      {content}
    </button>
  );
}
