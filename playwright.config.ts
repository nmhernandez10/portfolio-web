import { defineConfig, devices } from "@playwright/test";

const BASE_URL = "http://localhost:4321";

/**
 * Chromium only — this suite guards behaviour and accessibility, not rendering
 * across engines.
 *
 * The server is `astro preview`, which the Cloudflare adapter runs on real
 * workerd through @cloudflare/vite-plugin, so /api/contact is exercised on the
 * runtime it deploys to. It needs a build first and exits with a clear message
 * if there is none; the `test:e2e` script owns that build so a stale dist/ can
 * never go green. CI already builds, so it calls `playwright test` directly.
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
    // Astro 7 daemonizes `astro preview` when am-i-vibing reports an agentic
    // environment, which Playwright sees as the server exiting early. The env
    // var is that detection's opt-out, not a request to background it (see
    // astro/dist/cli/preview/index.js: `!process.env.ASTRO_PREVIEW_BACKGROUND
    // && isRunByAgent()`). A human terminal and CI never trip the detection;
    // this only matters when an agent runs the suite, which in this repo is
    // most of the time.
    env: { ASTRO_PREVIEW_BACKGROUND: "1" },
    reuseExistingServer: false,
    timeout: 120_000,
  },
});
