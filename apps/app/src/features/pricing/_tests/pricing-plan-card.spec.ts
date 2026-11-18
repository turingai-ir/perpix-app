import { expect, test } from "../../../../__tests__/fixtures/image-settings";

const plan = {
  uuid: "card-plan",
  name: "card",
  display_name: "Card plan",
  description: "Plan description shown on the card",
  is_default: false,
  is_active: true,
  scopes: ["ai_task:write"],
  allowed_models: ["required-model", "second-model"],
  base_price_usdmicro: 2000000,
  discounted_price_usdmicro: 1500000,
  base_price_irr: 200000,
  discounted_price_irr: 150000,
  currency: "IRR",
  duration_days: 30,
  balance_gift_amount_usdmicro: 500000,
  meta: { features: ["Feature line that must stay hidden"] },
};

test("plan card shows description, prices and gift credit only", async ({
  page,
}) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.route("**/api/v1/user/subscription/plans", (route) =>
    route.fulfill({ json: { items: [plan] } }),
  );
  await page.route("**/api/v1/user/subscription/active", (route) =>
    route.fulfill({ status: 404, json: {} }),
  );
  await page.goto("/generation/image", { waitUntil: "domcontentloaded" });
  await expect(
    page.getByRole("combobox").filter({ hasText: "Nano Banana" }),
  ).toBeVisible();
  await page.evaluate(async () => {
    const path = "/src/features/pricing/_tests/pricing-empty-harness.tsx";
    const harness = await import(/* @vite-ignore */ path);
    harness.mount();
  });
  const dialog = page.getByRole("dialog", { name: /بسته‌ها|ارتقای اشتراک/ });
  const card = dialog.getByRole("article");
  await expect(card).toContainText("Card plan");
  await expect(card).toContainText("قیمت قبل از تخفیف");
  await expect(card).toContainText("قیمت با تخفیف");
  await expect(card).toContainText("توکن هدیهٔ کیف پول");
  await expect(card).not.toContainText("شارژ کیف پول،");
  await expect(card).toContainText("Plan description shown on the card");
  await expect(card).not.toContainText("Feature line that must stay hidden");
  await expect(card).not.toContainText("مدل");
});
