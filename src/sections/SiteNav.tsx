import { useEffect, useState } from "react";
import { Button, NavBar } from "@/ui";
// Subpaths, not the "@/content" barrel: the barrel re-exports the whole of
// profile.ts, and an island is browser code. sections.ts imports nothing, which
// is what keeps the résumé structurally unreachable from the bundle — see the
// note in src/content/index.ts. Anything from profile arrives as a prop.
import { COPY, SECTIONS } from "@/content/sections";
import { SiteThemeToggle } from "./SiteThemeToggle";

/**
 * The page header. It is the kit's NavBar and nothing else: sticky positioning,
 * the blur and the scrolled hairline all belong to the component, so no
 * stylesheet clones them.
 *
 * The island owns exactly one behaviour — scroll-spy. Navigation is left to the
 * anchors NavBar already renders: global.css gives <html> a scroll-padding-top
 * of --nav-h, so every in-page link lands clear of the bar with or without JS,
 * and the URL keeps up with the section. Passing onNavigate would take that
 * over and break it for anyone who never gets the JS.
 */

/** The kit's own probe offset: how far below the bar counts as "in" a section. */
const SPY_OFFSET = 140;

const ITEMS = SECTIONS.map((section) => ({
  id: section.id,
  label: section.nav,
}));

interface Props {
  brand: string;
  resumeHref: string;
}

export function SiteNav({ brand, resumeHref }: Props) {
  // Must start on the first section to match the prerendered HTML — NavBar's
  // own `scrolled` starts false for the same reason. Together that is the whole
  // hydration-parity contract.
  const [active, setActive] = useState<string>(SECTIONS[0].id);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY + SPY_OFFSET;
      let current = ITEMS[0].id;
      for (const item of ITEMS) {
        const el = document.getElementById(item.id);
        if (el && el.offsetTop <= y) current = item.id;
      }
      setActive(current);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    // Once immediately: a reload at a restored scroll position would otherwise
    // sit on the parity default until the reader scrolls. Runs after the first
    // commit, so it cannot reintroduce a mismatch.
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <NavBar
      brand={brand}
      items={ITEMS}
      active={active}
      action={
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "var(--space-3)",
          }}
        >
          {/* Plain React, not an island: one cannot hydrate inside another. */}
          <SiteThemeToggle />
          {/* No target="_blank" — see Hero.astro: ButtonProps extends
              React.HTMLAttributes, which has no `target`, and the kit's API is
              frozen. /kit's NavBar specimen renders the same button. */}
          <Button size="sm" variant="secondary" href={resumeHref}>
            {COPY.nav.resume}
          </Button>
        </span>
      }
    />
  );
}
