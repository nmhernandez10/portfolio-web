import { useEffect, useState } from "react";
import { Button } from "../core/Button";
import { Tag } from "../core/Tag";
import { monoLabel } from "../internal";

/**
 * The subset of a project the drawer renders. Declared structurally rather
 * than imported: src/kit never reaches into src/content, so the two shapes are
 * proven compatible at the call site instead.
 */
export interface DrawerProject {
  /** Mono ordinal, e.g. "01". */
  index?: string;
  title: string;
  kicker?: string;
  description?: string;
  /** Drawer-only detail lines, numbered 01, 02, 03 as they render. */
  detail?: string[];
  tags?: string[];
  meta?: string;
}

/**
 * Right-hand panel carrying a project's detail copy. The only component in the
 * system the skill ships without a .d.ts, so this contract is the repo's:
 * `closeLabel` is required and has no default, which is what keeps the one
 * string it renders in src/content rather than here.
 */
export interface ProjectDrawerProps {
  /** The open project, or null when the drawer is closed. */
  project: DrawerProject | null;
  onClose: () => void;
  /** e.g. "Close ✕". */
  closeLabel: string;
}

export function ProjectDrawer({
  project,
  onClose,
  closeLabel,
}: ProjectDrawerProps) {
  const open = !!project;
  // Holds the last project so the panel keeps its content while it slides out.
  const [shown, setShown] = useState<DrawerProject | null>(null);
  useEffect(() => {
    if (project) setShown(project);
  }, [project]);
  const p = project || shown;

  return (
    <>
      <div
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          background: "var(--scrim)",
          opacity: open ? 1 : 0,
          pointerEvents: open ? "auto" : "none",
          transition: "opacity var(--dur-base) var(--ease-standard)",
          zIndex: 40,
        }}
      />
      <aside
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          bottom: 0,
          width: "min(560px, 92vw)",
          background: "var(--surface-card)",
          borderLeft: "1px solid var(--border-hairline)",
          boxShadow: "var(--shadow-lg)",
          zIndex: 41,
          transform: open ? "translateX(0)" : "translateX(100%)",
          transition: "transform var(--dur-slow) var(--ease-out)",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {p ? (
          <>
            <header
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "var(--space-5) var(--space-6)",
                borderBottom: "1px solid var(--border-hairline)",
              }}
            >
              <span style={{ ...monoLabel, color: "var(--clay)" }}>
                {p.index}
              </span>
              <Button variant="ghost" size="sm" onClick={onClose}>
                {closeLabel}
              </Button>
            </header>
            {/* The panel body scrolls and holds no focusable child of its
                own, so without tabindex a keyboard user cannot reach the
                detail copy at all (axe scrollable-region-focusable). */}
            <div
              tabIndex={0}
              style={{
                padding: "var(--space-6)",
                overflowY: "auto",
                display: "flex",
                flexDirection: "column",
                gap: "var(--space-5)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "var(--space-2)",
                }}
              >
                <span
                  style={{
                    font: "var(--type-meta)",
                    color: "var(--text-meta)",
                  }}
                >
                  {p.kicker}
                </span>
                <h2
                  style={{
                    font: "var(--type-statement)",
                    letterSpacing: "var(--tracking-display)",
                  }}
                >
                  {p.title}
                </h2>
              </div>
              <p
                style={{ font: "var(--type-lead)", color: "var(--text-body)" }}
              >
                {p.description}
              </p>
              <ul
                style={{
                  margin: 0,
                  padding: 0,
                  listStyle: "none",
                  display: "flex",
                  flexDirection: "column",
                  gap: "var(--space-4)",
                }}
              >
                {(p.detail || []).map((d, i) => (
                  <li
                    key={i}
                    style={{
                      display: "grid",
                      gridTemplateColumns: "28px 1fr",
                      gap: "var(--space-3)",
                    }}
                  >
                    {/* Digits, so --text-meta rather than the skill's --ink-4. */}
                    <span
                      style={{
                        font: "var(--type-label)",
                        color: "var(--text-meta)",
                        paddingTop: 4,
                      }}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span
                      style={{
                        font: "var(--type-body)",
                        color: "var(--text-body)",
                      }}
                    >
                      {d}
                    </span>
                  </li>
                ))}
              </ul>
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "var(--space-2)",
                  paddingTop: "var(--space-2)",
                  borderTop: "1px solid var(--border-hairline)",
                }}
              >
                {(p.tags || []).map((t) => (
                  <Tag key={t}>{t}</Tag>
                ))}
              </div>
              {/* Words, so --text-meta rather than the skill's --ink-4 (2.06). */}
              <span
                style={{ font: "var(--type-meta)", color: "var(--text-meta)" }}
              >
                {p.meta}
              </span>
            </div>
          </>
        ) : null}
      </aside>
    </>
  );
}
