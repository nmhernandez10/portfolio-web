import { useEffect, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import { metaLabel } from "../internal";

export interface NavItem {
  id?: string;
  label: string;
  href?: string;
}

/**
 * Sticky top bar: name on the left, mono uppercase links on the right. The
 * bottom hairline only appears once the page is scrolled.
 */
export interface NavBarProps extends React.HTMLAttributes<HTMLElement> {
  /** @default "Nicolás Hernández" */
  brand?: string;
  items?: NavItem[];
  /** id of the current section. */
  active?: string;
  /** Called with an item id; prevents default anchor navigation when provided. */
  onNavigate?: (id: string) => void;
  /** Trailing node, usually a small Button. */
  action?: ReactNode;
}

export function NavBar({
  brand = "Nicolás Hernández",
  items = [],
  active,
  onNavigate,
  action,
  style,
  ...rest
}: NavBarProps) {
  // Server-rendered without hydration this never runs, so the bar prints in
  // its unscrolled state — which is also the state it hydrates into.
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const el = document.scrollingElement || document.documentElement;
    const onScroll = () => setScrolled(el.scrollTop > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      style={{
        position: "sticky",
        top: 0,
        zIndex: 20,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "var(--space-6)",
        padding: "var(--space-4) var(--gutter)",
        background: "var(--nav-bg)",
        backdropFilter: "saturate(1.4) blur(12px)",
        WebkitBackdropFilter: "saturate(1.4) blur(12px)",
        borderBottom: `1px solid ${scrolled ? "var(--border-hairline)" : "transparent"}`,
        transition: "border-color var(--dur-base) var(--ease-standard)",
        ...style,
      }}
      {...rest}
    >
      <a
        href="#top"
        onClick={(e) => {
          if (onNavigate) {
            e.preventDefault();
            onNavigate("top");
          }
        }}
        style={{
          font: "var(--weight-medium) var(--size-body-s)/1 var(--font-sans)",
          letterSpacing: "-0.01em",
          color: "var(--ink-1)",
          textDecoration: "none",
        }}
      >
        {brand}
      </a>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "var(--space-5)",
        }}
      >
        {items.map((it) => {
          const id = it.id || it.label;
          const on = active === id;
          const link: CSSProperties = {
            ...metaLabel,
            color: on ? "var(--ink-1)" : "var(--text-meta)",
            textDecoration: "none",
            paddingBottom: 3,
            borderBottom: `1px solid ${on ? "var(--clay)" : "transparent"}`,
            transition: "var(--transition-control)",
          };
          return (
            <a
              key={id}
              href={it.href || `#${id}`}
              /* The active state is otherwise colour alone: assistive tech is
                 told nothing, and nothing outside the component can read it.
                 Derived from the `active` prop, so the contract is unchanged. */
              aria-current={on ? "true" : undefined}
              onClick={(e) => {
                if (onNavigate) {
                  e.preventDefault();
                  onNavigate(id);
                }
              }}
              style={link}
            >
              {it.label}
            </a>
          );
        })}
        {action}
      </div>
    </nav>
  );
}
