/**
 * The theme contract, owned in one place: the storage key, the two chrome
 * tints, and what happens when the visitor picks a theme.
 *
 * Two consumers with different reach. ThemeScript.astro runs before first paint
 * and is `is:inline`, so it cannot import — it receives the values below
 * through Astro's `define:vars`, which serializes them into the script as
 * constants. SiteThemeToggle.tsx is an island and imports setTheme directly.
 * That split is why the DOM writes appear twice while no *value* does.
 *
 * The pre-paint script deliberately does not call setTheme even in spirit: it
 * must never persist, because writing storage on a first visit would freeze the
 * visitor's system preference into an explicit choice they never made.
 */
export type Theme = "light" | "dark";

export const THEME_STORAGE_KEY = "theme";

/**
 * The two --paper values, converted oklch -> sRGB: light oklch(0.985 0.004 85)
 * and dark oklch(0.205 0.008 70). <meta name="theme-color"> cannot read a
 * custom property, so this is the one place in the repo they are restated —
 * change tokens/colors.css and these move with it.
 */
export const THEME_COLOR: Record<Theme, string> = {
  light: "#FBFAF7",
  dark: "#1A1713",
};

/**
 * The visitor picked a theme: attribute, chrome tint and storage, together.
 * Called only from the toggle — the pre-paint script owns the first paint.
 */
export function setTheme(theme: Theme): void {
  document.documentElement.dataset.theme = theme;
  document
    .querySelector('meta[name="theme-color"]')
    ?.setAttribute("content", THEME_COLOR[theme]);

  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    // Site data blocked — the theme still applies for this session.
  }
}
