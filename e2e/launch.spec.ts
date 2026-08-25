import { expect, test } from "@playwright/test";
import { COPY } from "../src/content/sections";
import { profile } from "../src/content/profile";
import { personSchema } from "../src/content/schema";

/**
 * The launch surface: what makes the site findable, and what hardens it.
 * smoke.spec.ts guards behaviour and a11y.spec.ts guards accessibility; these
 * are the things no visitor sees and nothing else would notice going missing —
 * a canonical, the card, the sitemap's shape, the response headers, and a 404
 * that is actually a 404.
 *
 * Assertions derive from src/content and from the page's own canonical rather
 * than restating strings or the origin, the way the other two specs do.
 */

test("robots.txt allows everything and names the sitemap", async ({
  request,
}) => {
  const response = await request.get("/robots.txt");

  expect(response.status()).toBe(200);
  expect(response.headers()["content-type"]).toContain("text/plain");

  const body = await response.text();
  expect(body).toContain("User-agent: *");
  expect(body).toContain("Allow: /");
  expect(body).toMatch(/^Sitemap: https:\/\/\S+\/sitemap-index\.xml$/m);
});

test("the sitemap carries the page and not the kit", async ({ request }) => {
  const index = await request.get("/sitemap-index.xml");
  expect(index.status()).toBe(200);
  expect(await index.text()).toContain("sitemap-0.xml");

  const body = await (await request.get("/sitemap-0.xml")).text();
  const locations = [...body.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);

  expect(locations).toHaveLength(1);
  expect(locations[0]).toMatch(/\/$/);
  // /kit is noindex in the page and filtered here; the two must agree.
  expect(body).not.toContain("/kit");
});

test("every response carries the security headers, and hashed assets are immutable", async ({
  page,
  request,
}) => {
  const document = await request.get("/");
  const headers = document.headers();

  expect(headers["x-content-type-options"]).toBe("nosniff");
  expect(headers["referrer-policy"]).toBe("strict-origin-when-cross-origin");
  expect(headers["permissions-policy"]).toContain("camera=()");

  // Read a hashed asset the page actually links, rather than guessing a name.
  await page.goto("/");
  const asset = await page
    .locator('link[rel="stylesheet"][href^="/_astro/"]')
    .first()
    .getAttribute("href");
  expect(asset).toBeTruthy();

  const cached = await request.get(asset!);
  expect(cached.headers()["cache-control"]).toContain("immutable");
});

test("the page is indexable and unfurls, and the kit is not", async ({
  page,
}) => {
  await page.goto("/");

  const canonical = await page
    .locator('link[rel="canonical"]')
    .getAttribute("href");
  expect(canonical).toBeTruthy();
  await expect(page.locator('meta[name="robots"]')).toHaveCount(0);

  const card = new URL("/og.png", canonical!).href;
  await expect(page.locator('meta[property="og:image"]')).toHaveAttribute(
    "content",
    card,
  );
  await expect(page.locator('meta[property="og:url"]')).toHaveAttribute(
    "content",
    canonical!,
  );
  // The whole set, not a sample: an unfurler that finds og:image and no title
  // renders a blank card, and nothing else in the suite would notice a tag
  // going missing. Title mirrors the page's own <title>, site_name the host in
  // the canonical, description the profile line written to be short enough for
  // one — so no value here is restated, each is compared with its source.
  await expect(page.locator('meta[property="og:title"]')).toHaveAttribute(
    "content",
    await page.title(),
  );
  await expect(page.locator('meta[property="og:description"]')).toHaveAttribute(
    "content",
    profile.metaDescription,
  );
  await expect(page.locator('meta[property="og:type"]')).toHaveAttribute(
    "content",
    "website",
  );
  await expect(page.locator('meta[property="og:site_name"]')).toHaveAttribute(
    "content",
    new URL(canonical!).host,
  );
  await expect(page.locator('meta[property="og:locale"]')).toHaveAttribute(
    "content",
    "en_US",
  );
  // The card is a fixed 1200x630 artifact; a wrong pair crops the unfurl.
  await expect(page.locator('meta[property="og:image:width"]')).toHaveAttribute(
    "content",
    "1200",
  );
  await expect(
    page.locator('meta[property="og:image:height"]'),
  ).toHaveAttribute("content", "630");
  await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute(
    "content",
    "summary_large_image",
  );

  // The card itself has to exist: an og:image pointing at a 404 unfurls blank.
  expect((await page.request.get(card)).status()).toBe(200);

  // The origin comes from the page, so nothing here hardcodes a host and the
  // whole block can be compared against the module that produced it.
  const rendered = await page
    .locator('script[type="application/ld+json"]')
    .textContent();
  expect(JSON.parse(rendered!)).toEqual(personSchema(new URL(canonical!)));

  await page.goto("/kit");
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
    "content",
    "noindex",
  );
});

test("an unknown path answers 404 and offers the way back", async ({
  page,
}) => {
  const response = await page.goto("/this-page-does-not-exist");

  // Without dist/404.html, Pages serves index.html at 200 for every unmatched
  // path — the homepage published at an unbounded set of addresses.
  expect(response?.status()).toBe(404);
  await expect(
    page.getByRole("heading", { level: 1, name: COPY.notFound.statement }),
  ).toBeVisible();

  await page.getByRole("link", { name: COPY.notFound.home }).click();
  await expect(page).toHaveURL("/");
});
