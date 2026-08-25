import { useHover } from "../internal";

/**
 * Framed photograph. Desaturated at rest, colour on hover — the one
 * photographic flourish in the system.
 */
export interface PortraitProps extends React.HTMLAttributes<HTMLDivElement> {
  src: string;
  alt?: string;
  /** Width in px; arch/soft/square shapes are 1.22× taller. @default 220 */
  size?: number;
  /** @default "arch" */
  shape?: "arch" | "round" | "soft" | "square";
  /** @default true */
  grayscale?: boolean;
}

export function Portrait({
  src,
  alt = "Portrait",
  size = 220,
  shape = "arch",
  grayscale = true,
  style,
  ...rest
}: PortraitProps) {
  const [hover, hoverHandlers] = useHover();
  const radii = {
    arch: `${size / 2}px ${size / 2}px var(--radius-lg) var(--radius-lg)`,
    round: "50%",
    soft: "var(--radius-lg)",
    square: "var(--radius-none)",
  };
  return (
    <div
      {...hoverHandlers}
      style={{
        width: size,
        height: shape === "round" ? size : Math.round(size * 1.22),
        borderRadius: radii[shape],
        overflow: "hidden",
        background: "var(--paper-sunk)",
        border: "1px solid var(--border-hairline)",
        flex: "0 0 auto",
        ...style,
      }}
      {...rest}
    >
      <img
        src={src}
        alt={alt}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          display: "block",
          filter:
            grayscale && !hover
              ? "grayscale(1) contrast(1.02)"
              : "grayscale(0)",
          transform: hover ? "scale(1.03)" : "scale(1)",
          transition:
            "filter var(--dur-slow) var(--ease-out), transform var(--dur-slow) var(--ease-out)",
        }}
      />
    </div>
  );
}
