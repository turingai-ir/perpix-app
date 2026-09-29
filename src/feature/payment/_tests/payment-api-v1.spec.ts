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
