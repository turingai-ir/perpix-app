import { expect, test } from "@playwright/test";

const intentUuid = "c0202000-0000-4000-8000-000000000005";
const executionUuid = "c0202000-0000-4000-8000-000000000006";

function history(financialStatus: "PENDING" | "SUCCEEDED") {
  return {
    items: [
      {
        payment: {
          id: intentUuid,
          execution_uuid: executionUuid,
          status: financialStatus === "SUCCEEDED" ? "SUCCEEDED" : "PENDING",
          financial_status: financialStatus,
          fulfillment_status:
            financialStatus === "SUCCEEDED" ? "PENDING" : "NOT_READY",
          dispatch_status: "CONFIRMED",
          outcome: financialStatus === "SUCCEEDED" ? "succeeded" : "ready",
          currency: "IRR",
          amount: "9007199254740990",
          expires_at: null,
          payment_url: null,
        },
        target_type: "wallet_topup",
        created_at: "2026-09-30T00:00:00Z",
      },
    ],
    has_next: false,
  };
}

test("payment history separates settlement from wallet credit and refreshes on SSE", async ({
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
      json: { wallet_uuid: intentUuid, balance_usdmicro: 0, is_active: true },
    }),
  );
  await page.route("**/api/v1/user/subscription/active", (route) =>
    route.fulfill({ json: { plan: { uuid: "plan-1", is_default: false } } }),
  );
  let requestCount = 0;
  await page.route("**/api/v1/payment-intents?*", (route) => {
    requestCount += 1;
    return route.fulfill({
      json: history(requestCount === 1 ? "PENDING" : "SUCCEEDED"),
    });
  });
  await page.route("**/api/v1/payment-events", async (route) => {
    await new Promise((resolve) => setTimeout(resolve, 600));
    await route.fulfill({
      status: 200,
      contentType: "text/event-stream",
      body: `event: payment_changed\ndata: ${JSON.stringify({ intent_uuid: intentUuid, execution_uuid: executionUuid })}\n\n`,
    });
  });

  await page.goto("/profile/payments");
  await expect(page.getByText("پرداخت شده؛ در حال اعمال")).toBeVisible();
  await expect(page.getByText("در حال اعمال", { exact: true })).toBeVisible();
  const exactTomans = `${new Intl.NumberFormat("fa").format(900719925474099n)} تومان`;
  await expect(page.locator("table")).toContainText(exactTomans);
  expect(requestCount).toBeGreaterThan(1);
});
