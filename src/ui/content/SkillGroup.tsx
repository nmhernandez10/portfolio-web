import type { CSSProperties } from "react";
import { Tag } from "../core/Tag";
import { Icon } from "../core/Icon";

export interface SkillGroupProps {
  title: string;
  items?: string[];
  icon?: string;
  iconSet?: "ui" | "tech";
  iconBase?: string;
  style?: CSSProperties;
}

export function SkillGroup({
  title,
  items = [],
  icon,
  iconSet = "tech",
  iconBase,
  style,
  ...rest
}: SkillGroupProps) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "var(--space-4)",
        ...style,
      }}
      {...rest}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "var(--space-2)",
          color: "var(--text-muted)",
        }}
      >
        {icon ? (
          <Icon
            name={icon}
            set={iconSet}
            size={15}
            {...(iconBase ? { base: iconBase } : {})}
          />
        ) : null}
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "var(--text-2xs)",
            fontWeight: "var(--weight-medium)",
            letterSpacing: "var(--tracking-label)",
            textTransform: "uppercase",
          }}
        >
          {title}
        </span>
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-2)" }}>
        {items.map((i) => (
          <Tag key={i} size="sm">
            {i}
          </Tag>
        ))}
      </div>
    </div>
  );
}
