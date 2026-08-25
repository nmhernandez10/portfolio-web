import { useEffect, useRef } from "react";
import type { NavItem } from "@/ui";

/**
 * The narrow-mode nav: a <details> disclosure that replaces the bar's inline
 * link row below the breakpoint. Site chrome rather than kit inventory, and a
 * sibling of SiteThemeToggle for the same reason — SiteNav renders both as
 * plain React inside its own island, since an island cannot hydrate in another.
 *
 * The platform owns the open state. React is never given an `open` prop, and
 * that is load-bearing rather than stylistic: SiteNav re-renders on every
 * scroll tick to move scroll-spy, and a controlled `open` would slam the menu
 * shut mid-scroll. Not passing it means React never diffs the attribute at all,
 * so the disclosure keeps working exactly as it does with JS switched off.
 *
 * For the same reason there is no author-written aria-expanded: <summary> maps
 * to a button whose expanded state the browser supplies, and a hand-written one
 * would be pinned at its first value forever.
 *
 * JS adds exactly one thing — closing on navigate — plus the data-enhanced flag
 * that says so, set on the element rather than through state so the enhancement
 * costs no render. e2e/support.ts waits on that flag.
 */
export function SiteNavMenu({
  items,
  active,
  resumeHref,
  resumeLabel,
  menuLabel,
  closeLabel,
}: {
  items: NavItem[];
  active: string;
  resumeHref: string;
  resumeLabel: string;
  menuLabel: string;
  closeLabel: string;
}) {
  const ref = useRef<HTMLDetailsElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const close = (e: MouseEvent) => {
      if ((e.target as HTMLElement).closest("a")) el.open = false;
    };
    el.addEventListener("click", close);
    el.dataset.enhanced = "";
    return () => el.removeEventListener("click", close);
  }, []);

  return (
    <details ref={ref} className="site-nav__menu">
      <summary className="site-nav__control site-nav__summary">
        <span className="site-nav__summary-closed">{menuLabel}</span>
        <span className="site-nav__summary-open">{closeLabel}</span>
      </summary>
      {/* A plain list, never a <nav>: the bar is already the navigation
          landmark, and a second one would nest landmarks and make every
          `nav` locator in the suite ambiguous. */}
      <ul className="site-nav__panel">
        {items.map((item) => {
          const id = item.id || item.label;
          return (
            <li key={id}>
              <a
                href={item.href || `#${id}`}
                aria-current={active === id ? "true" : undefined}
              >
                {item.label}
              </a>
            </li>
          );
        })}
        <li>
          <a href={resumeHref}>{resumeLabel}</a>
        </li>
      </ul>
    </details>
  );
}
