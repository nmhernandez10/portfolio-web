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
      style={{
        display: "inline-flex",
        alignItems: "center",
        height: 30,
        padding: "0 var(--space-3)",
        background: "transparent",
        color: "var(--text-meta)",
        border: "1px solid var(--border-control)",
        borderRadius: "var(--radius-pill)",
        font: "var(--type-label)",
        letterSpacing: "var(--tracking-label)",
        textTransform: "uppercase",
        cursor: "pointer",
        whiteSpace: "nowrap",
        transition: "var(--transition-control)",
      }}
    >
      {dark ? "Light" : "Dark"}
    </button>
  );
}
