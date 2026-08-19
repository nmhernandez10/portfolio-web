import React from "react";
import { Tag } from "../core/Tag.jsx";
import { Icon } from "../core/Icon.jsx";

/** A labelled cluster of stack tags, optionally led by a tech mark. */
export function SkillGroup({ title, items = [], icon, iconSet = "tech", iconBase, style, ...rest }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)", ...style }} {...rest}>
      <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)", color: "var(--text-muted)" }}>
        {icon ? <Icon name={icon} set={iconSet} size={15} {...(iconBase ? { base: iconBase } : {})} /> : null}
        <span style={{ fontFamily: "var(--font-mono)", fontSize: "var(--text-2xs)", fontWeight: "var(--weight-medium)", letterSpacing: "var(--tracking-label)", textTransform: "uppercase" }}>
          {title}
        </span>
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-2)" }}>
        {items.map((i) => <Tag key={i} size="sm">{i}</Tag>)}
      </div>
    </div>
  );
}
