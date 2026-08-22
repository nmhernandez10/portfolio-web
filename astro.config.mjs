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
  //
  // imageService "compile" pre-optimizes images with sharp at build time. The
  // adapter's default, "cloudflare-binding", would instead defer every transform
  // to a runtime Cloudflare Images binding and emit /_image URLs — a dashboard
  // step, and not the static avif/webp/jpg the hero portrait needs.
  adapter: cloudflare({ imageService: "compile" }),
  integrations: [react(), sitemap()],
});
