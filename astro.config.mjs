// @ts-check
import { defineConfig } from "astro/config";

import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";

// https://astro.build/config
export default defineConfig({
  // The one owner of the site's origin. Canonical, OG, JSON-LD, the sitemap and
  // robots.txt all derive from this — nothing restates the host.
  site: "https://nicolasmateo.dev",
  integrations: [
    react(),
    // /kit is the component inventory, not a destination: it also carries
    // <meta name="robots" content="noindex"> via BaseLayout's prop, and the two
    // must agree. The integration drops 404/500 itself, and endpoints
    // (robots.txt.ts) never enter the sitemap at all.
    sitemap({ filter: (page) => !page.endsWith("/kit/") }),
  ],
});
