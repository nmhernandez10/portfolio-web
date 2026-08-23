import { expect, test } from "@playwright/test";
import { NAV } from "../src/content/sections";
import { profile } from "../src/content/profile";
import { CONTACT_TOPICS } from "../src/content/contact";

/**
 * Few and load-bearing, per the phase brief: the static page, the two phase-4
 * behaviours, the endpoint's two safe paths, and the phase-6 mobile nav.
 *
 * Data comes from src/content so a manifest change fails a test instead of
 * drifting past a hardcoded copy of it.
 *
 * The endpoint cases are deliberately the only two that never reach Resend:
 * a validation failure and a filled honeypot both return before send().
 */

test("every anchored section is in the static page under one h1", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.locator("h1")).toHaveCount(1);
  for (const entry of NAV) {
    await expect(page.locator(`#${entry.id}`)).toBeVisible();
  }
});

test("the theme toggle flips data-theme and survives a reload", async ({
  page,
}) => {
  await page.goto("/");
  const html = page.locator("html");
  await expect(html).toHaveAttribute("data-theme", "light");

  await page.getByRole("button", { name: "Switch to dark theme" }).click();
  await expect(html).toHaveAttribute("data-theme", "dark");

  await page.reload();
  await expect(html).toHaveAttribute("data-theme", "dark");
});

test("both resumes are served", async ({ request }) => {
  for (const href of Object.values(profile.resumes)) {
    expect((await request.get(href)).status()).toBe(200);
  }
});

test("the contact endpoint rejects a missing email", async ({ request }) => {
  const response = await request.post("/api/contact", {
    data: { name: "Test", topic: CONTACT_TOPICS[0], message: "Hello" },
  });
  expect(response.status()).toBe(400);
  expect((await response.json()).errors.email).toBeTruthy();
});

test("a filled honeypot answers like a success and sends nothing", async ({
  request,
}) => {
  const response = await request.post("/api/contact", {
    data: {
      name: "Bot",
      email: "bot@example.com",
      topic: CONTACT_TOPICS[0],
      message: "Hello",
      company: "spam",
    },
  });
  expect(response.status()).toBe(200);
  expect(await response.json()).toEqual({ ok: true });
});

/**
 * 960 and 720 are the two breakpoints; each is checked on both sides. 768 is
 * iPad portrait, and it is here for a reason: the nav used to move at 720, and
 * everything from 720 to 769 scrolled sideways because the desktop header needs
 * 915px. 320 is the narrowest phone worth supporting — the wordmark ellipsises
 * there rather than pushing the page wide.
 */
const SWEEP = [
  1280, 1120, 961, 960, 959, 800, 768, 720, 719, 430, 390, 360, 320,
];

test("no viewport scrolls sideways", async ({ page }) => {
  await page.goto("/");
  for (const width of SWEEP) {
    await page.setViewportSize({ width, height: 900 });
    // The variable fonts shift metrics after load, and the header's fit is
    // exactly what moves — measuring before they settle measures nothing.
    await page.evaluate(() => document.fonts.ready);
    const m = await page.evaluate(() => {
      const doc = document.documentElement;
      const name = document.querySelector(".wordmark__name") as HTMLElement;
      return {
        overflow: doc.scrollWidth - doc.clientWidth,
        // The wordmark is the header's only elastic child, so it ellipsises
        // before the page can widen. That makes the overflow check alone too
        // forgiving — a header that stops fitting degrades quietly here instead
        // of failing. Assert both, or a breakpoint regression just eats the
        // name. Below 350px there is genuinely no room, and truncating beats
        // scrolling.
        clipped: name.scrollWidth > name.clientWidth + 1,
      };
    });
    expect(m.overflow, `horizontal overflow at ${width}px`).toBeLessThanOrEqual(
      0,
    );
    if (width >= 360) {
      expect(m.clipped, `wordmark truncated at ${width}px`).toBe(false);
    }
  }
});

test("the mobile menu opens and closes", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");

  // Addressed by class because Playwright's role engine does not map <summary>.
  // The browser's own tree is correct — Chromium reports the toggle as
  // DisclosureTriangle, name "Menu", expanded false/true — so the disclosure
  // semantics this phase relies on are real; only the test locator is affected.
  const menu = page.locator(".site-menu");
  const panel = page.locator(".site-menu__panel");

  await expect(panel).toBeHidden();
  await page.locator(".site-menu__toggle").click();
  await expect(menu).toHaveAttribute("open", "");
  await expect(panel).toBeVisible();
  await expect(panel.getByRole("link", { name: "Contact" })).toBeVisible();
  // The desktop copy must not be reachable alongside it.
  await expect(page.locator(".site-nav__bar")).toBeHidden();

  await page.locator(".site-menu__toggle").click();
  await expect(menu).not.toHaveAttribute("open", "");
  await expect(panel).toBeHidden();
});
