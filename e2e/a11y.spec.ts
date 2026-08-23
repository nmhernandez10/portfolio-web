import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import type { Page } from "@playwright/test";

type AxeResults = Awaited<ReturnType<AxeBuilder["analyze"]>>;
type AxeNode = AxeResults["violations"][number]["nodes"][number];

/**
 * Gold text is #A6762A by design law (AGENTS.md); it measures 3.53-4.00 on the
 * surfaces it lands on, below AA at the sizes it is used. The law wins, so
 * those nodes — and only those — are dropped from the contrast rule. Every
 * other pair was corrected in global.css and is gated here.
 *
 * axe serializes colours lowercase, hence the normalisation. Revisit in phase 7
 * with docs/brand.md.
 */
const GOLD_TEXT = "#a6762a";

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

function isGoldText(node: AxeNode) {
  return String(contrastData(node)?.fgColor ?? "").toLowerCase() === GOLD_TEXT;
}

/** Violations with the sanctioned gold-text nodes removed, and how many went. */
function gate(results: AxeResults) {
  let exempted = 0;
  const violations = results.violations
    .map((violation) => {
      if (violation.id !== "color-contrast") return violation;
      const nodes = violation.nodes.filter((node) => !isGoldText(node));
      exempted += violation.nodes.length - nodes.length;
      return { ...violation, nodes };
    })
    .filter((violation) => violation.nodes.length > 0);
  return { violations, exempted };
}

/**
 * Reduced motion is set before every scan on purpose: reveal.ts leaves each
 * section below the fold at opacity 0, and axe skips what it cannot see, so an
 * unprepared scan silently covers little more than the hero. Under reduce,
 * reveal.ts bails and base.css pins .reveal visible — the whole page, with no
 * scrolling and no timing to race.
 */
async function visit(page: Page, path: string) {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto(path);
}

/**
 * The kit's disabled Switch dims its whole <label> to 0.45 opacity, so the
 * label text computes to ~2.69 against paper. WCAG 1.4.3 exempts text that is
 * part of an inactive component, and axe's usual skip does not reach it because
 * the opacity sits on an ancestor rather than on the text's own control. Named
 * by relationship rather than position so it cannot drift with the kit page.
 */
const INACTIVE_CONTROL = 'label:has(button[role="switch"][disabled])';

async function scan(page: Page) {
  const { violations, exempted } = gate(
    await new AxeBuilder({ page }).exclude(INACTIVE_CONTROL).analyze(),
  );
  // Canary: every scanned page carries gold text. Zero means the exemption has
  // gone stale or stopped matching — both want a human, not a silent pass.
  expect(exempted).toBeGreaterThan(0);
  // Contrast failures carry their measured numbers, so a red run says which
  // pair missed and by how much rather than only where.
  return violations.map((violation) => ({
    id: violation.id,
    nodes: violation.nodes.map((node) => {
      const data = contrastData(node);
      return data
        ? `${node.target.join(" ")} — ${data.fgColor} on ${data.bgColor} at ${data.contrastRatio} (needs ${data.expectedContrastRatio})`
        : node.target.join(" ");
    }),
  }));
}

test("the page is clean in the light theme", async ({ page }) => {
  await visit(page, "/");
  expect(await scan(page)).toEqual([]);
});

test("the page is clean in the dark theme", async ({ page }) => {
  // Set before goto so the pre-paint script resolves dark itself, rather than
  // scanning a light page mid-toggle.
  await page.emulateMedia({ colorScheme: "dark" });
  await visit(page, "/");
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  expect(await scan(page)).toEqual([]);
});

test("the kit page is clean", async ({ page }) => {
  await visit(page, "/kit");
  expect(await scan(page)).toEqual([]);
});
