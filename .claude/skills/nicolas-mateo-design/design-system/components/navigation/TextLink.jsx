import React from "react";
import { Icon } from "../core/Icon.jsx";

/** Inline link: ink text on a gold underline that thickens on hover. */
export function TextLink({ children, href = "#", external = false, tone = "default", iconBase, style, ...rest }) {
  const [hover, setHover] = React.useState(false);
  return (
    <a
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noreferrer" : undefined}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 5,
        color: hover ? "var(--text-link-hover)" : tone === "muted" ? "var(--text-secondary)" : "var(--text-link)",
        textDecoration: "none",
        borderBottom: `${hover ? "1.5px" : "1px"} solid ${hover ? "var(--accent-press)" : "var(--accent-line)"}`,
        paddingBottom: 1,
        transition: "var(--transition-control)",
        ...style,
      }}
      {...rest}
    >
      {children}
      {external ? <Icon name="arrow-up-right" size={13} {...(iconBase ? { base: iconBase } : {})} /> : null}
    </a>
  );
}
