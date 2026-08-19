// @ts-check
import { defineConfig } from "astro/config";

import cloudflare from "@astrojs/cloudflare";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";

// https://astro.build/config
export default defineConfig({
  site: "https://nicolasmateo.dev",
  // Output stays static — the adapter just builds a Worker so phase 5 can flip
  // one route to on-demand without changing the delivery pipeline.
  adapter: cloudflare(),
  integrations: [react(), sitemap()],
});
