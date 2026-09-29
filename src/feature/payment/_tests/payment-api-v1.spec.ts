import { expect, test } from "@playwright/test";

test.beforeEach(async ({ baseURL, context, page }) => {
  await context.addCookies([
    { name: "access_token", value: "test-token", url: baseURL },
  ]);
  await page.route("**/api/v1/user/get-info", async (route) => {
    await route.fulfill({
      contentType: "application/json",
      body: JSON.stringify({ uuid: "user-1", mobile: "09120000000" }),
    });
  });
});

test("payment history loads from Core v1", async ({ page }) => {
  const request = page.waitForRequest((request) =>
    request.url().includes("/api/v1/payment-intents?"),
  );
  await page.route("**/api/v1/payment-intents?**", async (route) => {
    await route.fulfill({
      contentType: "application/json",
      body: JSON.stringify({ items: [], has_next: false }),
    });
  });

  await page.goto("/profile/payments");

  await request;
  await expect(page.getByText("پرداختی برای نمایش وجود ندارد")).toBeVisible();
});

test("payment result requests execution status from Core v1", async ({
  page,
}) => {
  const executionUuid = "11111111-1111-4111-8111-111111111111";
  const request = page.waitForRequest((request) =>
    request.url().includes(`/api/v1/payment-executions/${executionUuid}`),
  );
  await page.route("**/api/v1/payment-executions/**", async (route) => {
    await route.fulfill({
      contentType: "application/json",
      body: JSON.stringify({ status: "PENDING", amount: 100000 }),
    });
  });

  await page.goto(`/payment/verify/${executionUuid}`);

  await request;
});

test("pending payment is not shown as failed and refreshes to success", async ({
  page,
}) => {
  const executionUuid = "22222222-2222-4222-8222-222222222222";
  let requests = 0;
  let releaseSuccess: () => void = () => {};
  const allowSuccess = new Promise<void>((resolve) => {
    releaseSuccess = resolve;
  });
  await page.route("**/api/v1/payment-executions/**", async (route) => {
    requests += 1;
    if (requests > 1) {
      await allowSuccess;
    }
    await route.fulfill({
      contentType: "application/json",
      body: JSON.stringify({
        outcome: requests === 1 ? "pending" : "succeeded",
        status: requests === 1 ? "PENDING" : "SUCCEEDED",
        amount: "100000",
      }),
    });
  });

  await page.goto(`/payment/verify/${executionUuid}`);

  await expect(
    page.getByRole("heading", { name: "در انتظار تایید پرداخت" }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "پرداخت ناموفق" }),
  ).toBeHidden();
  releaseSuccess();
  await expect(
    page.getByRole("heading", { name: "پرداخت موفق" }),
  ).toBeVisible();
  expect(requests).toBeGreaterThanOrEqual(2);
});

test("a successful execution awaiting review is not shown as fulfilled", async ({
  page,
}) => {
  const executionUuid = "33333333-3333-4333-8333-333333333333";
  await page.route("**/api/v1/payment-executions/**", async (route) => {
    await route.fulfill({
      contentType: "application/json",
      body: JSON.stringify({
        outcome: "review",
        status: "SUCCEEDED",
        amount: "100000",
      }),
    });
  });

  await page.goto(`/payment/verify/${executionUuid}`);

  await expect(
    page.getByRole("heading", { name: "نیاز به بررسی پرداخت" }),
  ).toBeVisible();
  await expect(page.getByRole("heading", { name: "پرداخت موفق" })).toBeHidden();
});
