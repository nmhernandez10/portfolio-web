import { useEffect, useState } from "react";

const STORAGE_KEY = "theme";

/**
 * The site's theme control, icon-free: the new design system defines no
 * ThemeToggle and no icons, so this is site chrome rather than kit inventory.
 *
 * The inline script in the layout owns the first paint and writes data-theme;
 * this adopts that attribute once React is live, then owns the attribute and
 * storage on every toggle after it. The storage key is duplicated in
 * ThemeScript.astro on purpose: that script is is:inline and cannot import.
 *
 * Rendered by SiteNav on / (plain React — an island cannot hydrate inside
 * another) and mounted directly as an island by /kit.
 */
export function SiteThemeToggle() {
  // Must start "light" to match the prerendered HTML, or hydration mismatches.
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    if (document.documentElement.dataset.theme === "dark") setTheme("dark");
  }, []);

  const dark = theme === "dark";
  const next = dark ? "light" : "dark";

  return (
    <button
      type="button"
      aria-pressed={dark}
      aria-label={`Switch to ${next} theme`}
      onClick={() => {
        setTheme(next);
        document.documentElement.dataset.theme = next;
        try {
          localStorage.setItem(STORAGE_KEY, next);
        } catch {
          // Site data blocked — the theme still applies for this session.
        }
      }}
      /* The bar's small control is defined once in global.css and shared with
         the narrow-mode menu summary, so the two pills cannot drift. Legal
         where the kit's own components are not: this is site chrome. */
      className="site-nav__control"
    >
      {dark ? "Light" : "Dark"}
    </button>
  );
}
