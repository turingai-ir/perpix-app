import { expect, test } from "@playwright/test";

const walletUuid = "c0202000-0000-4000-8000-000000000002";
const executionUuid = "c0202000-0000-4000-8000-000000000003";

test("wallet checkout starts in the wallet service", async ({
  page,
  context,
  baseURL,
}) => {
  if (!baseURL) throw new Error("Playwright baseURL is required");
  await context.addCookies([
    { name: "access_token", value: "test-token", url: baseURL },
  ]);
  await page.route("**/api/v1/user/get-info", (route) =>
    route.fulfill({
      json: { uuid: "user-1", name: "Test", email: "test@example.com" },
    }),
  );
  await page.route("**/api/v1/wallet/wallet", (route) =>
    route.fulfill({
      json: {
        wallet_uuid: walletUuid,
        balance_usdmicro: 1000,
        is_active: true,
      },
    }),
  );
  await page.route("**/api/v1/user/subscription/active", (route) =>
    route.fulfill({ json: { plan: { uuid: "plan-1", is_default: false } } }),
  );
  await page.route("**/api/v1/payment-events", (route) =>
    route.fulfill({
      status: 200,
      contentType: "text/event-stream",
      body: ": connected\n\n",
    }),
  );
  let checkoutBody: Record<string, unknown> | undefined;
  await page.route("**/api/v1/wallet/charge", async (route) => {
    if (route.request().method() !== "POST")
      return route.fulfill({ json: { items: [], has_next: false } });
    checkoutBody = route.request().postDataJSON() as Record<string, unknown>;
    await route.fulfill({
      json: {
        id: checkoutBody.intent_uuid,
        execution_uuid: executionUuid,
        status: "PENDING",
        financial_status: "PENDING",
        fulfillment_status: "NOT_READY",
        dispatch_status: "CONFIRMED",
        outcome: "ready",
        currency: "IRR",
        amount: "20000",
        expires_at: null,
        payment_url: "https://pay.example/checkout",
      },
      status: 201,
    });
  });

  await page.goto("/");
  await expect(page.getByText("۱", { exact: true })).toBeVisible();
  await expect(page.getByText("توکن", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: "افزایش موجودی کیف پول" }).click();
  await page.getByRole("textbox", { name: "توکن" }).fill("10.0001");
  await page.getByRole("button", { name: "پرداخت", exact: true }).click();
  expect(checkoutBody).toBeUndefined();
  await page.getByRole("textbox", { name: "توکن" }).fill("10.001");
  await page.getByRole("button", { name: "پرداخت", exact: true }).click();
  expect(checkoutBody).toBeUndefined();
  await page.getByRole("textbox", { name: "توکن" }).fill("10");
  await page.getByRole("button", { name: "پرداخت", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "تایید مبلغ پرداخت" }),
  ).toBeVisible();
  expect(checkoutBody).toMatchObject({ amount_usdmicro: 10000 });
  expect(checkoutBody).not.toHaveProperty("target_type");
  expect(checkoutBody).not.toHaveProperty("target_uuid");
  expect(checkoutBody?.intent_uuid).toEqual(expect.any(String));
});

test("subscription checkout starts in the subscription service", async ({
  page,
  context,
  baseURL,
}) => {
  if (!baseURL) throw new Error("Playwright baseURL is required");
  const planUuid = "c0202000-0000-4000-8000-000000000004";
  await context.addCookies([
    { name: "access_token", value: "test-token", url: baseURL },
  ]);
  await page.route("**/api/v1/user/get-info", (route) =>
    route.fulfill({
      json: { uuid: "user-1", name: "Test", email: "test@example.com" },
    }),
  );
  await page.route("**/api/v1/wallet/wallet", (route) =>
    route.fulfill({ status: 503, json: { detail: "unavailable" } }),
  );
  await page.route("**/api/v1/user/subscription/active", (route) =>
    route.fulfill({
      json: { plan: { uuid: "default-plan", is_default: true } },
    }),
  );
  await page.route("**/api/v1/user/subscription/plans", (route) =>
    route.fulfill({
      json: {
        items: [
          {
            uuid: planUuid,
            name: "starter",
            display_name: "Starter",
            description: "Plan",
            scopes: [],
            allowed_models: [],
            base_price_usdmicro: 10000,
            discounted_price_usdmicro: 10000,
            base_price_irr: 20000,
            discounted_price_irr: 20000,
            duration_days: 30,
            balance_gift_amount_usdmicro: null,
            meta: { features: [] },
            is_active: true,
            is_recommended: false,
            is_default: false,
            created_at: "2026-09-30T00:00:00Z",
            updated_at: "2026-09-30T00:00:00Z",
          },
          {
            uuid: "c0202000-0000-4000-8000-000000000005",
            name: "unavailable",
            display_name: "Unavailable",
            description: "Plan",
            scopes: [],
            allowed_models: [],
            base_price_usdmicro: 1000,
            discounted_price_usdmicro: 1000,
            base_price_irr: null,
            discounted_price_irr: null,
            duration_days: 30,
            balance_gift_amount_usdmicro: null,
            meta: { features: [] },
            is_active: true,
            is_recommended: false,
            is_default: false,
            created_at: "2026-09-30T00:00:00Z",
            updated_at: "2026-09-30T00:00:00Z",
          },
        ],
        total_count: 2,
      },
    }),
  );
  await page.route("**/api/v1/payment-events", (route) =>
    route.fulfill({
      status: 200,
      contentType: "text/event-stream",
      body: ": connected\n\n",
    }),
  );
  let checkoutBody: Record<string, unknown> | undefined;
  await page.route("**/api/v1/user/subscription/purchase", async (route) => {
    checkoutBody = route.request().postDataJSON() as Record<string, unknown>;
    await route.fulfill({
      json: {
        id: checkoutBody.intent_uuid,
        execution_uuid: executionUuid,
        status: "PENDING",
        financial_status: "PENDING",
        fulfillment_status: "NOT_READY",
        dispatch_status: "CONFIRMED",
        outcome: "ready",
        currency: "IRR",
        amount: "20000",
        expires_at: null,
        payment_url: "https://pay.example/checkout",
      },
      status: 201,
    });
  });

  await page.goto("/");
  await page.getByRole("button", { name: "افزایش موجودی کیف پول" }).click();
  await page.getByRole("button", { name: "خرید اشتراک" }).click();
  const unavailablePlan = page
    .getByRole("heading", { name: "Unavailable" })
    .locator("..");
  await expect(unavailablePlan.getByText("قیمت در دسترس نیست")).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Starter" }).locator(".."),
  ).toContainText("۲٬۰۰۰ تومان");
  await expect(
    unavailablePlan.getByRole("button", { name: "خرید", exact: true }),
  ).toBeDisabled();
  await page
    .getByRole("heading", { name: "Starter" })
    .locator("..")
    .getByRole("button", { name: "خرید", exact: true })
    .click();
  await expect(
    page.getByRole("heading", { name: "تایید مبلغ پرداخت" }),
  ).toBeVisible();
  expect(checkoutBody).toMatchObject({ plan_uuid: planUuid });
  expect(checkoutBody).not.toHaveProperty("target_type");
  expect(checkoutBody).not.toHaveProperty("amount_usdmicro");
});
