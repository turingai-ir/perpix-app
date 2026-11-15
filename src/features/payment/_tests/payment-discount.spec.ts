import { expect, test } from "@playwright/test";
import { mockAuthenticatedSession } from "../../../../__tests__/support/auth-session";

const intentUuid = "c0202000-0000-4000-8000-000000000015";
const executionUuid = "c0202000-0000-4000-8000-000000000016";

function details(discountAmount: string) {
  return {
    id: intentUuid,
    currency: "IRR",
    base_amount: "212000",
    tax_amount: "0",
    total_amount: "212000",
    base_amount_usdmicro: "10600",
    tax_amount_usdmicro: "0",
    total_amount_usdmicro: "10600",
    discount_amount_usdmicro: discountAmount === "0" ? "0" : "400",
    discount_amount: discountAmount,
  };
}

for (const scenario of [
  { targetType: "wallet_topup", discountAmount: "8000" },
  { targetType: "subscription", discountAmount: "8000" },
  { targetType: "wallet_topup", discountAmount: "0" },
]) {
  const { targetType, discountAmount } = scenario;
  test(`payment details for ${targetType} with discount ${discountAmount}`, async ({
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
      (route) => route.fulfill({ json: details(discountAmount) }),
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
              target_type: targetType,
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
    const row = dialog.getByText("تخفیف", { exact: true });
    if (discountAmount === "0") {
      await expect(row).toHaveCount(0);
      return;
    }
    await expect(row).toBeVisible();
    await expect(dialog).toContainText("۸۰۰ تومان");
    await expect(dialog.getByText("قیمت عادی")).toBeVisible();
    await expect(dialog).toContainText("۲۲٬۰۰۰ تومان");
    await expect(dialog.getByText("مبلغ بعد از تخفیف")).toBeVisible();
    await expect(dialog.getByText("مبلغ پایه")).toHaveCount(0);
  });
}
