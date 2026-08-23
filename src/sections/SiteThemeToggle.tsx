import { useEffect, useState } from "react";
import { ThemeToggle } from "@/ui";

/**
 * The app's theme policy around the kit's ThemeToggle. The inline script in
 * BaseLayout.astro owns the first paint and writes data-theme; this adopts that
 * attribute once React is live and persists every toggle after it. The kit
 * component writes the attribute itself, so this owns only state + storage.
 *
 * The storage key is duplicated in BaseLayout.astro on purpose: that script is
 * is:inline and cannot import.
 */
export function SiteThemeToggle() {
  // Must start "light" to match the prerendered HTML, or hydration mismatches.
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    if (document.documentElement.dataset.theme === "dark") setTheme("dark");
  }, []);

  return (
    <ThemeToggle
      theme={theme}
      onChange={(next) => {
        setTheme(next);
        try {
          localStorage.setItem("theme", next);
        } catch {
          // Site data blocked — the theme still applies for this session.
        }
      }}
    />
  );
}
