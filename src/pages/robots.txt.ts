import type { APIRoute } from "astro";

/**
 * robots.txt as a static endpoint rather than a file in public/, so the sitemap
 * URL derives from astro.config.mjs's `site` instead of hardcoding the origin a
 * third time. It emits dist/robots.txt exactly as a static file would.
 *
 * Endpoints take an APIContext argument — there is no `Astro` global in a .ts
 * route — and they are not pages, so this never appears in the sitemap.
 */
export const GET: APIRoute = ({ site }) => {
  if (!site) {
    throw new Error("astro.config.mjs must set `site`: robots.txt names it.");
  }

  const body = [
    "User-agent: *",
    "Allow: /",
    "",
    `Sitemap: ${new URL("sitemap-index.xml", site)}`,
    "",
  ].join("\n");

  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
};
