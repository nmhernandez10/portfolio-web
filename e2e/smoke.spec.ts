import { expect, test } from "@playwright/test";
import { COPY, SECTIONS, twoDigit } from "../src/content/sections";
import { profile } from "../src/content/profile";
import {
  CONTACT_ERRORS,
  CONTACT_SENT_PARAM,
  CONTACT_SENT_VALUE,
} from "../src/content/contact";
import { THEME_COLOR } from "../src/scripts/theme";
import { openDrawer, openMenu } from "./support";

/**
 * Few and load-bearing, per the phase brief: the static page, the islands'
 * behaviour, the endpoint's safe paths and gates, and the structural guarantee
 * that the résumé never reaches the browser.
 *
 * Data comes from src/content so a manifest change fails a test instead of
 * drifting past a hardcoded copy of it.
 *
 * Every endpoint case here returns before send(), so none can reach Resend: the
 * two gates reject before the body is read, and a validation failure and a
 * filled honeypot both return short of it.
 */

test("every anchored section is in the static page under one h1", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.locator("h1")).toHaveCount(1);
  // "top" is the hero's anchor — the nav brand targets it, and it is
  // deliberately not a manifest entry.
  for (const id of ["top", ...SECTIONS.map((section) => section.id)]) {
    await expect(page.locator(`#${id}`)).toBeVisible();
  }
});

test("each block renders its own content", async ({ page }) => {
  await page.goto("/");

  await expect(
    page.getByRole("heading", { level: 1, name: profile.name }),
  ).toBeVisible();
  await expect(page.getByText(profile.lead)).toBeVisible();

  for (const section of SECTIONS) {
    await expect(
      page.getByRole("heading", { level: 2, name: section.title }),
    ).toBeVisible();
  }

  await expect(
    page.getByText(profile.projects[0].title, { exact: true }),
  ).toBeVisible();
  await expect(
    page.getByText(profile.experience[0].role, { exact: true }),
  ).toBeVisible();
  await expect(
    page.getByText(profile.education[0].degree, { exact: true }),
  ).toBeVisible();
  // Composed in Contact.astro from two sources: sections.ts cannot import the
  // city, so the assertion joins them the same way the section does.
  await expect(
    page.getByText(`${profile.location} · ${COPY.contact.locationSuffix}`),
  ).toBeVisible();
  // Exact, because the failure this guards is a missing space: Astro drops the
  // whitespace between two expressions a newline separates.
  await expect(
    page
      .locator("footer")
      .getByText(`${COPY.footer.copyright} ${profile.name}`, { exact: true }),
  ).toBeVisible();

  // Project cards, experience entries and skills groups are the page's only h3
  // emitters. Counting them together also pins SkillGroup at h3: at the kit's
  // own h4 this count drops by six and axe's heading-order fails in About.
  await expect(page.getByRole("heading", { level: 3 })).toHaveCount(
    profile.projects.length + profile.experience.length + profile.skills.length,
  );
});

test("the theme toggle flips data-theme and survives a reload", async ({
  page,
}) => {
  await page.goto("/");
  const html = page.locator("html");
  const chrome = page.locator('meta[name="theme-color"]');
  await expect(html).toHaveAttribute("data-theme", "light");
  // The browser chrome follows the chosen theme, not the system preference.
  // One meta, written pre-paint by ThemeScript and on every toggle by
  // setTheme(); both read their values from src/scripts/theme.ts.
  await expect(chrome).toHaveAttribute("content", THEME_COLOR.light);

  await page.getByRole("button", { name: "Switch to dark theme" }).click();
  await expect(html).toHaveAttribute("data-theme", "dark");
  await expect(chrome).toHaveAttribute("content", THEME_COLOR.dark);

  await page.reload();
  await expect(html).toHaveAttribute("data-theme", "dark");
  await expect(chrome).toHaveAttribute("content", THEME_COLOR.dark);
});

test("both resumes are served, and every link points at the right one", async ({
  page,
  request,
}) => {
  for (const href of Object.values(profile.resumes)) {
    expect((await request.get(href)).status()).toBe(200);
  }

  await page.goto("/");
  // getByRole matches accessible names by substring, and four links share the
  // word "Résumé" — the header action, the hero CTA ("Résumé, PDF") and the
  // footer's two. Scope and pin exactness, or Playwright reports an ambiguity
  // rather than a failure anyone can read.
  const header = page.locator("nav");
  const footer = page.locator("footer");

  for (const link of [
    header.getByRole("link", { name: COPY.nav.resume, exact: true }),
    page.getByRole("link", { name: COPY.hero.cta.resume, exact: true }),
    footer.getByRole("link", { name: COPY.footer.links.resume, exact: true }),
  ]) {
    await expect(link).toHaveAttribute("href", profile.resumes.fullStack);
  }

  await expect(
    footer.getByRole("link", {
      name: COPY.footer.links.backendResume,
      exact: true,
    }),
  ).toHaveAttribute("href", profile.resumes.backend);
});

/**
 * src/content/index.ts states that the résumé must be unreachable from the
 * browser bundle structurally, not by tree-shaking: islands import only the
 * import-free leaves (content/sections, content/contact) and take anything from
 * profile.ts as a serialized prop. Nothing else checks that, and a single
 * convenience import of "@/content" inside an island would undo it silently.
 * The canary is a string profile.ts alone carries.
 *
 * Astro hydrates islands from an inline <script type="module">, so there is no
 * <script src> to enumerate — and the chunk that would carry profile.ts sits an
 * import deeper than the island itself. Hence the transitive walk: this is the
 * module graph a browser on / can actually pull.
 */
const CHUNK = /\/_astro\/[A-Za-z0-9._-]+\.js/g;

test("profile data never reaches a client bundle", async ({ request }) => {
  const canary = profile.education[0].school;
  const html = await (await request.get("/")).text();

  const queue = [...new Set(html.match(CHUNK) ?? [])];
  expect(queue.length, "no client bundles to check").toBeGreaterThan(0);

  const seen = new Set<string>();
  while (queue.length > 0) {
    const url = queue.pop()!;
    if (seen.has(url)) continue;
    seen.add(url);

    const body = await (await request.get(url)).text();
    expect(body, `${url} carries profile.ts`).not.toContain(canary);
    for (const next of body.match(CHUNK) ?? []) {
      if (!seen.has(next)) queue.push(next);
    }
  }
});

test("the contact endpoint rejects a missing email", async ({ request }) => {
  const response = await request.post("/api/contact", {
    data: { name: "Test", message: "Hello" },
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
      message: "Hello",
      company: "spam",
    },
  });
  expect(response.status()).toBe(200);
  expect(await response.json()).toEqual({ ok: true });
});

/**
 * The two gates are hand-written here since phase 6.1 — Astro's ALL dispatch
 * supplied the 405 and its origin-check middleware the 403, and both left with
 * the adapter. A refactor of the content-type handling could open the CSRF gate
 * silently, so it is guarded rather than trusted.
 */
test("the contact endpoint gates method and origin", async ({ request }) => {
  const wrongMethod = await request.get("/api/contact");
  expect(wrongMethod.status()).toBe(405);
  expect(wrongMethod.headers().allow).toBe("POST");

  // No Origin header — the request context is not a browser, which is exactly
  // the cross-site shape the gate exists to reject.
  const noOrigin = await request.post("/api/contact", {
    form: {
      name: "Test",
      email: "test@example.com",
      message: "Hello",
    },
  });
  expect(noOrigin.status()).toBe(403);
});

test("a form-encoded post redirects instead of answering JSON", async ({
  request,
  baseURL,
}) => {
  const response = await request.post("/api/contact", {
    headers: { origin: baseURL! },
    // Honeypot filled: the only way to prove the no-JS redirect without
    // reaching Resend.
    form: {
      name: "Bot",
      email: "bot@example.com",
      message: "Hello",
      company: "spam",
    },
    maxRedirects: 0,
  });
  expect(response.status()).toBe(303);
  expect(response.headers().location).toBe(
    `/?${CONTACT_SENT_PARAM}=${CONTACT_SENT_VALUE}#contact`,
  );
});

/**
 * The drawer's copy has to be in the page without JS, and asserting it in the
 * response body would prove nothing: Astro serializes the island's props into
 * the HTML, so every detail line is there even with the static markup deleted.
 * A context with JS off reads the markup itself, and proves in the same pass
 * that nothing about it waits on hydration.
 */
test("every project's drawer copy is in the page before any JS runs", async ({
  browser,
  baseURL,
}) => {
  // A hand-made context inherits nothing from the config's `use`.
  const context = await browser.newContext({
    javaScriptEnabled: false,
    baseURL,
  });
  const page = await context.newPage();
  await page.goto("/");

  for (const [i, project] of profile.projects.entries()) {
    const block = page.locator(`#project-${twoDigit(i + 1)}`);
    await expect(block.locator("li")).toHaveCount(project.detail.length);
    for (const line of project.detail) {
      await expect(block).toContainText(line);
    }
  }

  await context.close();
});

test("a project card opens the drawer on its own detail", async ({ page }) => {
  await page.goto("/");
  // The second card, not the first: opening the first would pass just as well
  // against a grid wired to a hardcoded project.
  const project = profile.projects[1];
  const card = await openDrawer(page, project.title);

  // It is a real link at its own detail block, which is what a click landing
  // before hydration — or without JS at all — falls back to.
  await expect(card).toHaveAttribute("href", `#project-${twoDigit(2)}`);

  const drawer = page.getByRole("dialog");
  await expect(drawer).toContainText(project.title);
  await expect(drawer).toContainText(project.detail[0]);
});

test("the drawer closes three ways and hands focus back each time", async ({
  page,
}) => {
  await page.goto("/");
  const title = profile.projects[1].title;
  const drawer = page.getByRole("dialog");

  const shutters = [
    () => page.keyboard.press("Escape"),
    // Top-left: the scrim covers the viewport (above the sticky bar), and the
    // panel only its right-hand edge.
    () => page.mouse.click(20, 20),
    () => page.getByRole("button", { name: COPY.drawer.close }).click(),
  ];

  for (const shut of shutters) {
    const card = await openDrawer(page, title);
    await shut();
    // Not toBeHidden: a closed panel is off-screen by transform, not hidden.
    // It stops being a dialog at all, which is the assertion worth making.
    await expect(drawer).toHaveCount(0);
    await expect(card).toBeFocused();
  }
});

test("the nav marks the section in view and grows a hairline once scrolled", async ({
  page,
}) => {
  await page.goto("/");
  const nav = page.locator("nav");
  const link = (id: string) => {
    const section = SECTIONS.find((entry) => entry.id === id)!;
    return nav.getByRole("link", { name: section.nav, exact: true });
  };

  // Scroll-spy starts on the first section to match the prerendered HTML, so
  // the top of the page is where both states are visible at once.
  await expect(link(SECTIONS[0].id)).toHaveAttribute("aria-current", "true");
  await expect(link("about")).not.toHaveAttribute("aria-current", "true");
  // The bar draws its hairline itself, painting it transparent until scrolled.
  await expect(nav).toHaveCSS("border-bottom-color", "rgba(0, 0, 0, 0)");

  await page.locator("#about").scrollIntoViewIfNeeded();
  await expect(link("about")).toHaveAttribute("aria-current", "true");
  await expect(nav).not.toHaveCSS("border-bottom-color", "rgba(0, 0, 0, 0)");
});

test("the contact form adopts the flag the no-JS redirect lands on", async ({
  page,
}) => {
  await page.goto(`/?${CONTACT_SENT_PARAM}=${CONTACT_SENT_VALUE}#contact`);
  await expect(page.getByText(COPY.form.success)).toBeVisible();
});

/**
 * The one submit the suite drives through the browser. "nobody@example" passes
 * the browser's own type="email" check and fails the endpoint's shape test, so
 * the request returns 400 well short of send() — this suite still cannot reach
 * Resend. It has to be a separate page from the test above: once the form has
 * adopted the sent flag its submit button stays disabled.
 */
test("the contact form renders a field error inline", async ({ page }) => {
  await page.goto("/#contact");
  const email = page.getByLabel(COPY.form.email.label);

  // ContactForm is client:visible, and a click landing before it hydrates
  // posts the form natively instead of through fetch. The kit draws its focus
  // ring from React state, so a ring is the island announcing itself — and a
  // focus event arriving before hydration is simply lost, hence the retry.
  await expect(async () => {
    await email.blur();
    await email.focus();
    await expect(email).not.toHaveCSS("box-shadow", "none", { timeout: 250 });
  }).toPass();

  await page.getByLabel(COPY.form.name.label).fill("Test");
  await email.fill("nobody@example");
  await page.getByLabel(COPY.form.message.label).fill("Hello");
  await page.getByRole("button", { name: COPY.form.submit }).click();

  await expect(page.getByText(CONTACT_ERRORS.email)).toBeVisible();
  await expect(email).toHaveAttribute("aria-invalid", "true");
});

/**
 * Both sides of the one narrow boundary, then down to the narrowest phone worth
 * supporting. 900 is measured and documented in src/styles/global.css; 901/900/
 * 899 straddle it, 768 is iPad portrait, and 320 is the floor.
 *
 * Three assertions per step, because the page and the header fail differently.
 * The header is the part that overflowed historically, and it now absorbs the
 * squeeze by wrapping the brand to two lines — so its height is the real guard:
 * two 15px lines still measure the 30px control row that --nav-h is derived
 * from, and a third line would silently move every in-page anchor by breaking
 * scroll-padding-top. Read from the token rather than restated, and compared
 * with a pixel of slack because the wrapped brand lands on 63.2.
 */
const SWEEP = [1440, 1280, 901, 900, 899, 768, 480, 430, 390, 375, 360, 320];

test("no viewport scrolls sideways", async ({ page }) => {
  await page.goto("/");

  for (const width of SWEEP) {
    await page.setViewportSize({ width, height: 900 });
    // The variable fonts shift metrics after load, and the header's fit is
    // exactly what moves — measuring before they settle measures nothing. The
    // callback returns a boolean because the FontFaceSet itself does not
    // serialize back across the bridge.
    await page.evaluate(async () => {
      await document.fonts.ready;
      return true;
    });
    const m = await page.evaluate(() => {
      const doc = document.documentElement;
      const nav = document.querySelector("nav")!;
      return {
        overflow: doc.scrollWidth - doc.clientWidth,
        navOverflow: nav.scrollWidth - nav.clientWidth,
        navHeight: nav.getBoundingClientRect().height,
        navToken: parseFloat(getComputedStyle(doc).getPropertyValue("--nav-h")),
      };
    });

    expect(m.overflow, `horizontal overflow at ${width}px`).toBeLessThanOrEqual(
      0,
    );
    expect(
      m.navOverflow,
      `the header does not fit at ${width}px`,
    ).toBeLessThanOrEqual(0);
    expect(
      Math.abs(m.navHeight - m.navToken),
      `the bar is ${m.navHeight}px at ${width}px but --nav-h says ${m.navToken}px`,
    ).toBeLessThanOrEqual(1);
  }
});

/** The width every narrow-mode test runs at: a common phone, well below 900. */
const NARROW = { width: 390, height: 844 };

test("the mobile menu carries every destination the bar drops", async ({
  page,
}) => {
  await page.setViewportSize(NARROW);
  await page.goto("/");

  const panel = page.locator(".site-nav__panel");
  await expect(panel).toBeHidden();

  const menu = await openMenu(page);
  await expect(panel).toBeVisible();

  // Everything the bar hides has to reappear here: the four sections and the
  // résumé action, which leaves the bar so the header fits at 320.
  await expect(panel.getByRole("link")).toHaveText([
    ...SECTIONS.map((section) => section.nav),
    COPY.nav.resume,
  ]);
  await expect(
    panel.getByRole("link", { name: COPY.nav.resume, exact: true }),
  ).toHaveAttribute("href", profile.resumes.fullStack);

  // The two presentations must never be reachable at once. getByRole ignores
  // display:none, so a count of one per label is the assertion.
  for (const section of SECTIONS) {
    await expect(
      page.locator("nav").getByRole("link", { name: section.nav, exact: true }),
    ).toHaveCount(1);
  }

  await page.locator(".site-nav__summary").click();
  await expect(menu).not.toHaveAttribute("open", "");
  await expect(panel).toBeHidden();

  // Above the boundary the disclosure is gone and the bar's own row is back.
  await page.setViewportSize({ width: 1280, height: 900 });
  await expect(menu).toBeHidden();
  await expect(
    page
      .locator("nav")
      .getByRole("link", { name: SECTIONS[0].nav, exact: true }),
  ).toBeVisible();
});

test("the mobile menu navigates and closes behind itself", async ({ page }) => {
  await page.setViewportSize(NARROW);
  await page.goto("/");

  const menu = await openMenu(page);
  const target = SECTIONS[SECTIONS.length - 1];
  await menu.getByRole("link", { name: target.nav, exact: true }).click();

  await expect(page).toHaveURL(new RegExp(`#${target.id}$`));
  // Closing is the island's one enhancement; the anchor itself works without it.
  await expect(menu).not.toHaveAttribute("open", "");
  await expect(page.locator(`#${target.id}`)).toBeInViewport();
});
