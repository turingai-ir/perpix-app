import { expect, test } from "@playwright/test";
import { mockAuthenticatedSession } from "../../../../__tests__/support/auth-session";

const intentUuid = "c0202000-0000-4000-8000-000000000015";
const executionUuid = "c0202000-0000-4000-8000-000000000016";

function details(discount: number | null) {
  return {
    id: intentUuid,
    currency: "IRR",
    base_amount: "212000",
    tax_amount: "0",
    total_amount: "212000",
    base_amount_usdmicro: "10600",
    tax_amount_usdmicro: "0",
    total_amount_usdmicro: "10600",
    wallet_credit_usdmicro: discount === null ? null : "10000",
    wallet_topup_discount_percent: discount,
  };
}

for (const discount of [4, 0, null]) {
  test(`payment details ${discount === null ? "hide" : "show"} wallet top-up discount ${discount}`, async ({
    page,
  }) => {
    await mockAuthenticatedSession(page);
    await page.route("**/api/v1/user/me", (route) =>
      route.fulfill({
        json: { uuid: "user-1", name: "Test", email: "test@example.com" },
      }),
    );
    await page.route("**/api/v1/wallet", (route) =>
      route.fulfill({
        json: { wallet_uuid: intentUuid, balance_usdmicro: 0, is_active: true },
      }),
    );
    await page.route("**/api/v1/user/subscription/active", (route) =>
      route.fulfill({ json: { plan: { uuid: "plan-1", is_default: false } } }),
    );
    await page.route(
      `**/api/v1/payment-intents/${intentUuid}/details`,
      (route) => route.fulfill({ json: details(discount) }),
    );
    await page.route("**/api/v1/payment-intents?*", (route) =>
      route.fulfill({
        json: {
          items: [
            {
              payment: {
                id: intentUuid,
                execution_uuid: executionUuid,
                status: "SUCCEEDED",
                financial_status: "SUCCEEDED",
                fulfillment_status: "SUCCEEDED",
                requires_review: false,
                currency: "IRR",
                amount: "212000",
                payment_url: null,
              },
              target_type: "wallet_topup",
              created_at: "2026-09-30T00:00:00Z",
            },
          ],
          has_next: false,
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

    await page.goto("/profile/payments");
    await page.getByRole("button", { name: "جزئیات مبلغ" }).click();
    const dialog = page.getByRole("dialog");
    await expect(dialog.getByText("مبلغ نهایی")).toBeVisible();
    if (discount === null) {
      await expect(dialog.getByText("اعتبار کیف پول")).toHaveCount(0);
      await expect(dialog.getByText("تخفیف اشتراک روی شارژ")).toHaveCount(0);
      return;
    }
    await expect(dialog.getByText("اعتبار کیف پول")).toBeVisible();
    await expect(dialog).toContainText("۱۰ توکن");
    if (discount === 0) {
      await expect(dialog.getByText("تخفیف اشتراک روی شارژ")).toHaveCount(0);
      return;
    }
    await expect(dialog.getByText("تخفیف اشتراک روی شارژ")).toBeVisible();
    await expect(dialog).toContainText("۴٪");
  });
}
