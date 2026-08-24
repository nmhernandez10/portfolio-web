import { useState } from "react";
import type { CSSProperties } from "react";

/* The kit's private seam: the four things the design skill's source repeats.
   Not exported from index.ts — nothing outside src/kit/ may import it.

   Every style constant below is ordered so that each consumer, spreading it
   and appending its own overrides, renders the exact declaration order the
   skill's JSX rendered. */

/* --- Interaction state -------------------------------------------------
   Five components track hover and two track focus, each hand-rolling the same
   useState plus handler pair. Keeping the pair together is what stops a
   component wiring the enter half and forgetting the leave half. */

/** Hover flag plus the two handlers that drive it. */
export function useHover() {
  const [hover, setHover] = useState(false);
  return [
    hover,
    {
      onMouseEnter: () => setHover(true),
      onMouseLeave: () => setHover(false),
    },
  ] as const;
}

/** Focus flag plus the two handlers that drive it. */
export function useFocus() {
  const [focus, setFocus] = useState(false);
  return [
    focus,
    { onFocus: () => setFocus(true), onBlur: () => setFocus(false) },
  ] as const;
}

/* --- Shared styles ----------------------------------------------------- */

/** 12px mono at 0.13em: ordinals and periods, which supply their own colour. */
export const monoLabel: CSSProperties = {
  font: "var(--type-label)",
  letterSpacing: "var(--tracking-label)",
};

/** monoLabel's uppercase meta variant: field labels, captions, rule labels. */
export const metaLabel: CSSProperties = {
  ...monoLabel,
  textTransform: "uppercase",
  color: "var(--text-meta)",
};

/**
 * The outline pill ExperienceItem and ProjectCard draw for themselves rather
 * than reaching for Tag. ProjectCard appends its own `background`.
 */
export const tagPill: CSSProperties = {
  font: "var(--type-label)",
  color: "var(--text-meta)",
  border: "1px solid var(--border-hairline)",
  borderRadius: "var(--radius-pill)",
  padding: "5px var(--space-3)",
};

/**
 * The box shared by Input and Textarea. Error outranks focus in the border,
 * which is how Textarea already wrote it; Input used to set the shorthand and
 * then override `border-color`, re-parsing its own string to recover the
 * colour. Two declarations become one and the computed style is unchanged.
 */
export function fieldBox(focus: boolean, error: boolean): CSSProperties {
  return {
    width: "100%",
    background: "var(--surface-card)",
    color: "var(--ink-1)",
    font: "var(--type-body)",
    border: `1px solid ${
      error ? "var(--rust)" : focus ? "var(--ink-3)" : "var(--border-control)"
    }`,
    borderRadius: "var(--radius-md)",
    padding: "var(--space-3) var(--space-4)",
    outline: "none",
    boxShadow: focus ? "var(--shadow-focus)" : "none",
    transition:
      "var(--transition-control), box-shadow var(--dur-fast) var(--ease-standard)",
  };
}

/** The message under a field: the error in rust, otherwise the hint in meta. */
export const fieldNote = (error: boolean): CSSProperties => ({
  font: "var(--type-meta)",
  color: error ? "var(--rust)" : "var(--text-meta)",
});
