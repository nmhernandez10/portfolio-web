import { expect, test } from "@playwright/test";
import { COPY, SECTIONS, twoDigit } from "../src/content/sections";
import { profile } from "../src/content/profile";
import {
  CONTACT_ERRORS,
  CONTACT_SENT_PARAM,
  CONTACT_SENT_VALUE,
} from "../src/content/contact";
import { openDrawer } from "./support";

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
  await expect(page.getByText(COPY.contact.locationLine)).toBeVisible();
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
  await expect(html).toHaveAttribute("data-theme", "light");

  await page.getByRole("button", { name: "Switch to dark theme" }).click();
  await expect(html).toHaveAttribute("data-theme", "dark");

  await page.reload();
  await expect(html).toHaveAttribute("data-theme", "dark");
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
 * TODO(VC5): restore. The design the page now runs on defines desktop only —
 * the kit carries zero media queries and was drawn at 1280 — so sweeping below
 * that measures a layout nobody has designed yet. VC5 designs narrow mode and
 * its Definition of Done restores the full ladder (1280 down to 320, both sides
 * of every breakpoint) together with the header-fit assertion that left here
 * with the wordmark. Tolerable only while production is the unlaunched
 * *.pages.dev URL; if launch is ever reordered ahead of VC5, this comes back
 * first.
 */
const SWEEP = [1440, 1280];

test("no viewport scrolls sideways", async ({ page }) => {
  await page.goto("/");
  for (const width of SWEEP) {
    await page.setViewportSize({ width, height: 900 });
    // The variable fonts shift metrics after load, and the header's fit is
    // exactly what moves — measuring before they settle measures nothing.
    await page.evaluate(() => document.fonts.ready);
    const overflow = await page.evaluate(() => {
      const doc = document.documentElement;
      return doc.scrollWidth - doc.clientWidth;
    });
    expect(overflow, `horizontal overflow at ${width}px`).toBeLessThanOrEqual(
      0,
    );
  }
});

/**
 * TODO(VC5): restore. The mobile menu left with the old header — the new one is
 * the kit's NavBar, which has no narrow presentation yet. VC5 builds the
 * <details> disclosure inside SiteNav and re-adds what this deletes: the menu
 * opens, it lists the four nav links plus the résumé action, it navigates, it
 * closes, and the desktop link row is never reachable alongside it.
 */
