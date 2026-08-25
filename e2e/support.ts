import { expect } from "@playwright/test";
import type { Locator, Page } from "@playwright/test";

/**
 * Open the project drawer from its card, and wait for the island to be live
 * first. WorkGrid is client:visible: scrolling the card into view arms the
 * hydration observer, but nothing waits for React to attach the handler, and a
 * click that lands before it follows the card's href to hidden markup —
 * opening nothing, intermittently. aria-haspopup is the island's own signal
 * that there is a dialog to open, so it is the barrier both specs wait on.
 *
 * Returns the card, which is where focus must land again on close.
 */
export async function openDrawer(page: Page, title: string): Promise<Locator> {
  const card = page.getByRole("link", { name: title });
  // toHaveAttribute does not scroll, and a card below the fold never hydrates.
  await card.scrollIntoViewIfNeeded();
  await expect(card).toHaveAttribute("aria-haspopup", "dialog");
  await card.click();
  await expect(page.getByRole("dialog")).toHaveCount(1);
  return card;
}

/**
 * Open the narrow-mode nav disclosure, once its JS enhancement is attached.
 *
 * <details> opens on its own with no JS at all, so the barrier is not about the
 * panel appearing — it is about closing. SiteNavMenu adds exactly one thing on
 * mount, the close-on-navigate listener, and marks that with data-enhanced; a
 * click on a panel link landing before it navigates with the menu still open.
 * Both menu tests wait here so neither can forget it.
 *
 * Addressed by class because Playwright's role engine does not map <summary>.
 * The browser's own tree is correct — Chromium reports the toggle with the
 * visible label and an expanded state — so only the locator is affected.
 */
export async function openMenu(page: Page): Promise<Locator> {
  const menu = page.locator(".site-nav__menu");
  await expect(menu).toHaveAttribute("data-enhanced", "");
  await page.locator(".site-nav__summary").click();
  await expect(menu).toHaveAttribute("open", "");
  return menu;
}
