import { useEffect, useId, useRef, useState } from "react";
import { Button } from "../core/Button";
import { Tag } from "../core/Tag";
import { metaText, monoLabel } from "../internal";

/**
 * Everything inside the panel that can hold focus: today the close button and
 * the scrolling body, which carries a tabindex to be reachable at all.
 */
const FOCUSABLE =
  'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * The subset of a project the drawer renders. Declared structurally rather
 * than imported: src/ui never reaches into src/content, so the two shapes are
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
 *
 * It is also the system's one modal, so the dialog behaviour the skill's
 * prototype lacks lives here rather than at the call site — the panel element
 * is this component's, and nothing outside can reach it.
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

  const titleId = useId();
  const panelRef = useRef<HTMLDivElement>(null);

  // Escape must call the current onClose, but re-running the effect below on
  // every parent render would re-capture the opener and steal focus back — so
  // the callback travels by ref and the effect keys on `open` alone.
  const closeRef = useRef(onClose);
  useEffect(() => {
    closeRef.current = onClose;
  });

  /* The modal contract, none of which the skill's prototype has: focus moves
     in and comes back, Tab cannot leave, Escape closes, the page behind cannot
     scroll. The rest of the document is deliberately not inerted — aria-modal
     is the signal, and reaching out of this component to mutate nodes it does
     not own would trade one gap for a larger one. */
  useEffect(() => {
    const panel = panelRef.current;
    if (!open || !panel) return;

    const opener = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    panel.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeRef.current();
        return;
      }
      if (event.key !== "Tab") return;
      const nodes = [...panel.querySelectorAll<HTMLElement>(FOCUSABLE)];
      if (nodes.length === 0) return;
      const at = nodes.indexOf(document.activeElement as HTMLElement);
      // -1 is the panel itself (or focus lost); walking from there lands on
      // either end, so a Shift+Tab out of the container wraps rather than
      // escaping to the page behind the scrim.
      const next = event.shiftKey
        ? nodes[(at <= 0 ? nodes.length : at) - 1]
        : nodes[(at + 1) % nodes.length];
      // nodes is non-empty and both branches index inside it, so this cannot
      // miss. Guarding rather than asserting keeps the failure mode honest: if
      // it ever did, Tab falls through to the browser instead of throwing
      // inside a keydown handler.
      if (next) {
        next.focus();
        event.preventDefault();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
      opener?.focus();
    };
  }, [open]);

  /* A dialog only while it is showing. The panel stays mounted so it can
     slide, and before the first open it renders no title — an always-on
     role="dialog" would be a nameless one on every page load, which is a
     violation an axe scan is right to report. */
  const dialog = open
    ? ({
        role: "dialog",
        "aria-modal": true,
        "aria-labelledby": titleId,
      } as const)
    : {};

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
      {/* A div, where the skill's prototype draws an <aside>: role="dialog" is
          not an allowed role for <aside> (axe aria-allowed-role), and a modal
          panel is no more a complementary landmark than it is a dialog while
          closed. Same styles, same rendered box.

          inert: the kit keeps the last project rendered so the panel does not
          blank mid-slide, which otherwise leaves the close button and the body
          tabbable off-screen once the drawer has been opened once. */}
      <div
        ref={panelRef}
        {...dialog}
        tabIndex={-1}
        inert={!open}
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
                <span style={metaText}>{p.kicker}</span>
                <h2
                  id={titleId}
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
              <span style={metaText}>{p.meta}</span>
            </div>
          </>
        ) : null}
      </div>
    </>
  );
}
