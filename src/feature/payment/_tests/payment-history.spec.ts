import { expect, test } from "@playwright/test";

const intentUuid = "c0202000-0000-4000-8000-000000000005";
const executionUuid = "c0202000-0000-4000-8000-000000000006";

function history(financialStatus: "PENDING" | "SUCCEEDED", taxAmount: string) {
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
          requires_review: false,
          currency: "IRR",
          amount: "90071992547409930",
          payment_url: null,
        },
        target_type: taxAmount === "0" ? "custom_service" : "wallet_topup",
        created_at: "2026-09-30T00:00:00Z",
      },
    ],
    has_next: false,
  };
}

for (const taxAmount of ["2010", "0"]) {
  test(`payment history shows base, tax ${taxAmount} and total and refreshes on SSE`, async ({
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
    let walletRequests = 0;
    await page.route("**/api/v1/wallet/wallet", (route) => {
      walletRequests += 1;
      return route.fulfill({
        json: { wallet_uuid: intentUuid, balance_usdmicro: 0, is_active: true },
      });
    });
    await page.route("**/api/v1/user/subscription/active", (route) =>
      route.fulfill({ json: { plan: { uuid: "plan-1", is_default: false } } }),
    );
    let detailsCount = 0;
    await page.route(
      `**/api/v1/payment-intents/${intentUuid}/details`,
      (route) => {
        detailsCount += 1;
        return route.fulfill({
          json: {
            id: intentUuid,
            currency: "IRR",
            base_amount: (90071992547409930n - BigInt(taxAmount)).toString(),
            tax_amount: taxAmount,
            total_amount: "90071992547409930",
            base_amount_usdmicro: "10000",
            tax_amount_usdmicro: taxAmount === "0" ? "0" : "1000",
            total_amount_usdmicro: taxAmount === "0" ? "10000" : "11000",
          },
        });
      },
    );
    let requestCount = 0;
    await page.route("**/api/v1/payment-intents?*", (route) => {
      requestCount += 1;
      return route.fulfill({
        json: history(requestCount === 1 ? "PENDING" : "SUCCEEDED", taxAmount),
      });
    });
    let streamRequests = 0;
    await page.route("**/api/v1/payment-events", async (route) => {
      streamRequests += 1;
      await new Promise((resolve) => setTimeout(resolve, 600));
      await route.fulfill({
        status: 200,
        contentType: "text/event-stream",
        body:
          streamRequests === 1
            ? `event: payment_changed\ndata: ${JSON.stringify({ intent_uuid: intentUuid, execution_uuid: executionUuid })}\n\n`
            : ": connected\n\n",
      });
    });

    await page.goto("/profile/payments");
    await expect(page.getByText("پرداخت شده؛ در حال اعمال")).toBeVisible();
    await expect(page.getByText("در حال اعمال", { exact: true })).toBeVisible();
    const beforeReconnect = walletRequests;
    const table = page.getByRole("table");
    const cells = table
      .getByRole("row")
      .filter({ hasText: intentUuid })
      .getByRole("cell");
    const formatter = new Intl.NumberFormat("fa");
    const baseTomans =
      taxAmount === "0" ? 9007199254740993n : 9007199254740792n;
    await expect(cells.nth(3)).toHaveText(
      `${formatter.format(9007199254740993n)} تومان`,
    );
    await expect(cells.nth(4)).toHaveText(
      taxAmount === "0" ? "سایر" : "شارژ کیف پول",
    );
    expect(detailsCount).toBe(0);
    await page.getByRole("button", { name: "جزئیات مبلغ" }).click();
    const dialog = page.getByRole("dialog");
    await expect(
      dialog
        .getByText(`${formatter.format(baseTomans)} تومان`, {
          exact: true,
        })
        .first(),
    ).toBeVisible();
    await expect(
      dialog.getByText(
        `${formatter.format(taxAmount === "0" ? 0n : 201n)} تومان`,
        { exact: true },
      ),
    ).toBeVisible();
    expect(detailsCount).toBeGreaterThan(0);
    expect(requestCount).toBeGreaterThan(1);
    await expect.poll(() => streamRequests).toBeGreaterThan(1);
    await expect.poll(() => walletRequests).toBeGreaterThan(beforeReconnect);
  });
}
