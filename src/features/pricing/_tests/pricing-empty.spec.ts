import { expect, test } from "../../../../__tests__/fixtures/image-settings";

const eligiblePlan = {
  uuid: "eligible-plan",
  name: "eligible",
  display_name: "Eligible plan",
  description: "Eligible plan description",
  is_default: false,
  scopes: ["ai_task:write"],
  allowed_models: ["required-model"],
  base_price_irr: 100000,
  discounted_price_irr: 100000,
  currency: "IRR",
  meta: { features: [] },
};

const excludedPlans = [
  { ...eligiblePlan, uuid: "current-plan", name: "current" },
  { ...eligiblePlan, uuid: "default-plan", name: "default", is_default: true },
  {
    ...eligiblePlan,
    uuid: "wrong-model",
    name: "model",
    allowed_models: ["other-model"],
  },
  { ...eligiblePlan, uuid: "wrong-scope", name: "scope", scopes: [] },
];

for (const scenario of ["no-plans", "filtered-plans", "eligible-plan"] as const) {
  test(`pricing handles ${scenario} without offering an ineligible purchase`, async ({
    page,
  }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    const items = scenario === "no-plans" ? [] : [...excludedPlans];
    if (scenario === "eligible-plan") items.push(eligiblePlan);
    await page.route("**/api/v1/user/subscription/plans", (route) =>
      route.fulfill({ json: { items } }),
    );
    await page.goto("/generation/image", { waitUntil: "domcontentloaded" });
    await expect(
      page.getByRole("combobox").filter({ hasText: "Nano Banana" }),
    ).toBeVisible();
    await page.route("**/api/v1/user/subscription/active", (route) =>
      route.fulfill({ json: { plan: { ...eligiblePlan, uuid: "current-plan" } } }),
    );
    await page.evaluate(async () => {
      const path = "/src/features/pricing/_tests/pricing-empty-harness.tsx";
      const harness = await import(/* @vite-ignore */ path);
      harness.mount();
    });
    const dialog = page.getByRole("dialog", { name: /بسته‌ها|ارتقای اشتراک/ });
    const emptyTitle = dialog.getByRole("heading", {
      name: "بسته‌ای برای این درخواست پیدا نشد",
    });
    const purchase = dialog.getByRole("button", { name: "خرید", exact: true });
    if (scenario === "eligible-plan") {
      await expect(purchase).toHaveCount(1);
      await expect(purchase).toBeEnabled();
      await expect(emptyTitle).toBeHidden();
      return;
    }
    await expect(emptyTitle).toBeVisible();
    await expect(dialog.getByRole("status")).toContainText(
      "در حال حاضر بستهٔ قابل خریدی",
    );
    await expect(purchase).toHaveCount(0);
    const close = dialog.getByRole("button", { name: "بستن", exact: true });
    await page.evaluate(() => document.fonts.ready.then(() => undefined));
    for (const viewport of [
      { width: 375, height: 812 },
      { width: 768, height: 1024 },
      { width: 1440, height: 900 },
      { width: 320, height: 812 },
      { width: 667, height: 375 },
    ]) {
      await page.setViewportSize(viewport);
      await expect(emptyTitle).toBeVisible();
      await close.scrollIntoViewIfNeeded();
      const bounds = await close.boundingBox();
      expect(bounds).not.toBeNull();
      if (!bounds) throw new Error("Pricing close action has no layout box");
      expect(bounds.x).toBeGreaterThanOrEqual(0);
      expect(bounds.y).toBeGreaterThanOrEqual(0);
      expect(bounds.x + bounds.width).toBeLessThanOrEqual(viewport.width);
      expect(bounds.y + bounds.height).toBeLessThanOrEqual(viewport.height);
    }
    await close.click();
    await expect(dialog).toBeHidden();
  });
}
