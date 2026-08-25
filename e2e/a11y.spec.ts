import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import type { Page } from "@playwright/test";
import { profile } from "../src/content/profile";
import { openDrawer } from "./support";

type AxeResults = Awaited<ReturnType<AxeBuilder["analyze"]>>;
type AxeNode = AxeResults["violations"][number]["nodes"][number];

/**
 * A colour pair a design law forces below AA, dropped from the contrast rule.
 * A node matches only when every field stated here matches, so an exemption is
 * as narrow as the law that justifies it; `why` is required, so none can ship
 * undocumented. axe serialises colours lowercase, hence the normalisation.
 *
 * Each page passes its own list. Nothing is exempt by default.
 */
interface Exemption {
  /** axe's computed foreground, e.g. "#cb6532". */
  fg?: string;
  /** axe's computed background. */
  bg?: string;
  why: string;
}

/**
 * The brand, light theme. --clay oklch(0.620 0.145 45) is design law and
 * computes to #cb6532, which measures 3.69 both ways: as text on --paper (the
 * section ordinal, the current role's period) and as the accent button's fill
 * behind a --paper label, which is why that one is matched on the background.
 *
 * Nothing else fails on either page. --ink-3, --moss, --rust and --clay-strong
 * were corrected in src/styles/global.css, and --ink-4's word-and-digit
 * uses were moved to --text-meta in src/ui. The three non-word marks that
 * keep --ink-4 (2.06) are not listed here because axe does not report them:
 * the em dash bullet and the skills slash carry no word characters, and the
 * project card's resting arrow comes back "incomplete" rather than failing.
 * They are decorative either way — the adjacent text carries the meaning —
 * but a dead exemption would blunt the canary below, so they get a comment
 * instead of an entry.
 */
const BRAND_LIGHT: Exemption[] = [
  { fg: "#cb6532", why: "clay as text, fixed by design law" },
  {
    bg: "#cb6532",
    why: "clay as the accent button's fill, fixed by design law",
  },
];

/**
 * The brand, dark theme, needs no exemption at all: clay lifts to #e7885d and
 * passes at 6.91, and every other pair measures clean. An empty list is the
 * strongest state a page can be in, so this one carries no canary.
 */
const BRAND_DARK: Exemption[] = [];

interface ContrastData {
  fgColor?: string;
  bgColor?: string;
  contrastRatio?: number;
  expectedContrastRatio?: string;
}

function contrastData(node: AxeNode) {
  return node.any.find((check) => check.id === "color-contrast")?.data as
    ContrastData | undefined;
}

function isExempt(node: AxeNode, exemptions: Exemption[]) {
  const data = contrastData(node);
  if (!data) return false;
  const fg = String(data.fgColor ?? "").toLowerCase();
  const bg = String(data.bgColor ?? "").toLowerCase();
  return exemptions.some(
    (e) => (!e.fg || e.fg === fg) && (!e.bg || e.bg === bg),
  );
}

/** Violations with the sanctioned nodes removed, and how many went. */
function gate(results: AxeResults, exemptions: Exemption[]) {
  let exempted = 0;
  const violations = results.violations
    .map((violation) => {
      if (violation.id !== "color-contrast") return violation;
      const nodes = violation.nodes.filter(
        (node) => !isExempt(node, exemptions),
      );
      exempted += violation.nodes.length - nodes.length;
      return { ...violation, nodes };
    })
    .filter((violation) => violation.nodes.length > 0);
  return { violations, exempted };
}

/**
 * Reduced motion is set before every scan on purpose: reveal.ts leaves each
 * section of / below the fold at opacity 0, and axe skips what it cannot see,
 * so an unprepared scan silently covers little more than the hero. Under
 * reduce, reveal.ts bails and global.css pins .reveal visible — the whole
 * page, with no scrolling and no timing to race. /kit has no reveal; the
 * setting is harmless there.
 */
async function visit(page: Page, path: string) {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto(path);
}

async function scan(page: Page, exemptions: Exemption[]) {
  const { violations, exempted } = gate(
    await new AxeBuilder({ page }).analyze(),
    exemptions,
  );
  // Contrast failures carry their measured numbers, so a red run says which
  // pair missed and by how much rather than only where.
  return {
    exempted,
    violations: violations.map((violation) => ({
      id: violation.id,
      nodes: violation.nodes.map((node) => {
        const data = contrastData(node);
        return data
          ? `${node.target.join(" ")} — ${data.fgColor} on ${data.bgColor} at ${data.contrastRatio} (needs ${data.expectedContrastRatio})`
          : node.target.join(" ");
      }),
    })),
  };
}

/**
 * A page that claims exemptions carries a canary with them: zero exempted
 * nodes means an exemption has gone stale or stopped matching — both want a
 * human, not a silent pass. A page that claims none has nothing to go stale.
 */
async function expectClean(page: Page, exemptions: Exemption[]) {
  const { violations, exempted } = await scan(page, exemptions);
  expect(violations).toEqual([]);
  if (exemptions.length > 0) expect(exempted).toBeGreaterThan(0);
}

test("the page is clean in the light theme", async ({ page }) => {
  await visit(page, "/");
  await expectClean(page, BRAND_LIGHT);
});

test("the page is clean in the dark theme", async ({ page }) => {
  // Set before goto so the pre-paint script resolves dark itself, rather than
  // scanning a light page mid-toggle.
  await page.emulateMedia({ colorScheme: "dark" });
  await visit(page, "/");
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await expectClean(page, BRAND_DARK);
});

/**
 * The drawer is the one part of / no other scan can reach: it renders nothing
 * until a card is clicked. Both themes, because it brings its own surface —
 * --surface-card behind --scrim — rather than the page's.
 */
test("the open drawer is clean in the light theme", async ({ page }) => {
  await visit(page, "/");
  await openDrawer(page, profile.projects[0].title);
  await expectClean(page, BRAND_LIGHT);
});

test("the open drawer is clean in the dark theme", async ({ page }) => {
  await page.emulateMedia({ colorScheme: "dark" });
  await visit(page, "/");
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await openDrawer(page, profile.projects[0].title);
  await expectClean(page, BRAND_DARK);
});

test("the kit page is clean in the light theme", async ({ page }) => {
  await visit(page, "/kit");
  await expectClean(page, BRAND_LIGHT);
});

test("the kit page is clean in the dark theme", async ({ page }) => {
  await page.emulateMedia({ colorScheme: "dark" });
  await visit(page, "/kit");
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await expectClean(page, BRAND_DARK);
});
