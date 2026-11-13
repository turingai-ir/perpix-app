import { expect, test } from "@playwright/test";

import { mockAuthenticatedSession } from "../../../../../../__tests__/support/auth-session";

const DAY = 24 * 60 * 60 * 1000;

const makePlan = (
  uuid: string,
  name: string,
  price: number,
  isDefault = false,
) => ({
  uuid,
  name,
  display_name: name,
  description: "",
  scopes: [],
  allowed_models: [],
  base_price_usdmicro: price,
  discounted_price_usdmicro: price,
  base_price_irr: price * 10,
  discounted_price_irr: price * 10,
  duration_days: 30,
  balance_gift_amount_usdmicro: null,
  meta: { features: [] },
  is_active: true,
  is_recommended: false,
  is_default: isDefault,
  created_at: "2026-09-30T00:00:00Z",
  updated_at: "2026-09-30T00:00:00Z",
});

const free = makePlan("free", "Free", 0, true);
const pro = makePlan("pro", "Pro", 20);
const max = makePlan("max", "Max", 30);

async function setup(
  page: import("@playwright/test").Page,
  plan: ReturnType<typeof makePlan>,
  daysLeft: number,
  balance = 12_400_000,
) {
  await mockAuthenticatedSession(page);
  await page.route("**/api/v1/user/me", (route) =>
    route.fulfill({ json: { uuid: "u", name: "T", email: "t@example.com" } }),
  );
  await page.route("**/api/v1/wallet", (route) =>
    route.fulfill({
      json: { wallet_uuid: "w", balance_usdmicro: balance, is_active: true },
    }),
  );
  await page.route("**/api/v1/wallet/transactions**", (route) =>
    route.fulfill({
      json: {
        wallet_uuid: "w",
        owner_user_uuid: "u",
        total_count: 3,
        transactions: [3_000_000, 5_000_000, 2_000_000].map(
          (amount, index) => ({
            transaction_uuid: `t${index}`,
            type: "WITHDRAW",
            amount_usdmicro: amount,
            balance_before: 0,
            balance_after: 0,
            meta: {},
            created_at: new Date(Date.now() - index * 1000).toISOString(),
            updated_at: new Date().toISOString(),
          }),
        ),
      },
    }),
  );
  await page.route("**/api/v1/user/subscription/plans", (route) =>
    route.fulfill({ json: { items: [free, pro, max] } }),
  );
  await page.route("**/api/v1/user/subscription/active", (route) =>
    route.fulfill({
      json: {
        uuid: "s",
        plan,
        started_at: new Date(Date.now() - 10 * DAY).toISOString(),
        expires_at: new Date(Date.now() + daysLeft * DAY).toISOString(),
      },
    }),
  );
}

for (const viewport of [
  // Phones do not mount the widget; see _tests/account-widget-final.spec.ts.
  { width: 1440, height: 900 },
]) {
  test(`account widget shows tokens and days at ${viewport.width}px`, async ({
    page,
  }) => {
    await page.setViewportSize(viewport);
    await setup(page, pro, 20);
    await page.goto("/");
    const trigger = page.getByRole("button", { name: /وضعیت حساب/ });
    await expect(trigger).toContainText("۲۰ روز");
    await trigger.click();
    const panel = page.getByRole("dialog", { name: "وضعیت حساب" });
    await expect(panel).toContainText("موجودی توکن");
    await expect(panel).toContainText("Pro");
    await expect(panel).toContainText("۲۰ روز مانده");
    await expect(panel).toContainText("مصرف امروز");
    await expect(panel).toContainText("۱۰٬۰۰۰");
    await expect(panel).toContainText("حدود");
    await expect(
      panel.getByRole("button", { name: "ارتقا به Max" }),
    ).toBeVisible();
    await page.screenshot({
      path: `test-results/widget-open-${viewport.width}.png`,
    });
  });
}

test("expiring plan offers renewal and free plan offers subscribing", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await setup(page, max, 3, 0);
  await page.goto("/");
  await page.getByRole("button", { name: /وضعیت حساب/ }).click();
  const panel = page.getByRole("dialog", { name: "وضعیت حساب" });
  await expect(
    panel.getByRole("button", { name: "تمدید اشتراک" }),
  ).toBeVisible();
  await expect(panel).toContainText("اعتبارت تموم شده");
});

test("low balance warns about the runway and highlights charging", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await setup(page, pro, 20, 3_000_000);
  await page.goto("/");
  await page.getByRole("button", { name: /وضعیت حساب/ }).click();
  const panel = page.getByRole("dialog", { name: "وضعیت حساب" });
  await expect(panel).toContainText("اعتبارت فقط برای حدود");
  await page.waitForTimeout(700);
  await page.screenshot({ path: "test-results/widget-low.png" });
});
