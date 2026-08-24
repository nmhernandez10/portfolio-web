import { defineConfig, devices } from "@playwright/test";

const BASE_URL = "http://localhost:8788";

/**
 * Chromium only — this suite guards behaviour and accessibility, not rendering
 * across engines.
 *
 * The server is `wrangler pages dev` (the `preview` script), the same runtime
 * Cloudflare Pages deploys to, so functions/api/contact.ts is exercised for
 * real rather than stubbed. It serves the built dist/, so the `test:e2e` script
 * owns that build and a stale dist/ can never go green. CI already builds, so
 * it calls `playwright test` directly.
 */
export default defineConfig({
  testDir: "e2e",
  reporter: "list",
  use: {
    baseURL: BASE_URL,
    // Pinned: the pre-paint script in BaseLayout resolves the theme from
    // prefers-color-scheme, so an unpinned default makes the theme tests
    // depend on the machine running them.
    colorScheme: "light",
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: {
    command: "pnpm preview",
    url: BASE_URL,
    reuseExistingServer: false,
    timeout: 120_000,
  },
});
