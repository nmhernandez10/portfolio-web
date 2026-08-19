import React from "react";

const ICON_BASE = "assets/icons";

/** Renders an SVG from assets/icons via CSS mask so it inherits currentColor. */
export function Icon({ name, set = "ui", size = 18, strokeAlign = false, base = ICON_BASE, style, ...rest }) {
  const url = `${base}/${set}/${name}.svg`;
  const mask = `url("${url}") center / contain no-repeat`;
  return (
    <span
      aria-hidden="true"
      data-icon={name}
      style={{
        display: "inline-block",
        flex: "0 0 auto",
        width: size,
        height: size,
        background: "currentColor",
        WebkitMask: mask,
        mask: mask,
        verticalAlign: strokeAlign ? "-0.18em" : "middle",
        ...style,
      }}
      {...rest}
    ></span>
  );
}
