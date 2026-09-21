import { expect, type Page, test } from "@playwright/test";

const payment = {
  payment_uuid: "payment-1",
  payment_url: "http://localhost:5173/mock-gateway",
  amount_usdmicro: 500_000,
  amount_irr_without_tax: 1_176_750,
  tax_percent: 10,
  tax_amount_irr: 117_675,
  total_amount_irr: 1_294_425,
  wallet_uuid: "wallet-1",
};

test.describe("Wallet checkout", () => {
  test.beforeEach(async ({ baseURL, context, page }) => {
    await mockAppApi(page);
    await context.addCookies([
      { name: "access_token", value: "test-token", url: baseURL },
    ]);
  });

  test("reviews the exact server price before navigating to the gateway", async ({
    page,
  }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "افزایش موجودی کیف پول" }).click();
    await page.getByRole("button", { name: "۵۰۰ توکن" }).click();

    const chargeRequest = page.waitForRequest(
      (request) =>
        request.method() === "POST" &&
        new URL(request.url()).pathname === "/api/v1/wallet/charge",
    );
    await page.getByRole("button", { name: "مشاهده مبلغ نهایی" }).click();

    expect((await chargeRequest).postDataJSON()).toEqual({
      amount_usdmicro: 500_000,
    });
    await expect(
      page.getByRole("heading", { name: "تأیید خرید" }),
    ).toBeVisible();
    await expect(
      page.getByText("۵۰۰ توکن به کیف پول شما اضافه می‌شود"),
    ).toBeVisible();
    await expect(
      page.getByText("۱٬۲۹۴٬۴۲۵ ریال", { exact: true }),
    ).toBeVisible();
    await expect(page.getByText(/انتقال خودکار/)).toHaveCount(0);

    await page
      .getByRole("button", { name: "ویرایش تعداد توکن" })
      .click({ force: true });
    await expect(page.getByLabel("تعداد توکن")).toHaveValue("500");
    await page.waitForTimeout(250);

    await page
      .getByRole("button", { name: "مشاهده مبلغ نهایی" })
      .click({ force: true });
    await page
      .getByRole("button", { name: "پرداخت ۱٬۲۹۴٬۴۲۵ ریال" })
      .click({ force: true });
    await expect(page).toHaveURL(/\/mock-gateway$/);
  });

  test("opens a live mocked checkout preview", async ({ page }) => {
    test.skip(
      !process.env.PLAYWRIGHT_LIVE_PREVIEW,
      "Run only when a visual preview is requested.",
    );
    test.setTimeout(100_000);

    await page.goto("/");
    await page.getByRole("button", { name: "افزایش موجودی کیف پول" }).click();
    await page.getByRole("button", { name: "۵۰۰ توکن" }).click();
    await page.getByRole("button", { name: "مشاهده مبلغ نهایی" }).click();
    await expect(
      page.getByRole("heading", { name: "تأیید خرید" }),
    ).toBeVisible();

    // Keeps the real component visible in a headed browser for review.
    await page.waitForTimeout(90_000);
  });

  test("shows a recoverable error when creating the payment fails", async ({
    page,
  }) => {
    await page.route("**/api/v1/wallet/charge", async (route) => {
      await route.fulfill({
        status: 500,
        json: { detail: "gateway unavailable" },
      });
    });
    await page.goto("/");
    await page.getByRole("button", { name: "افزایش موجودی کیف پول" }).click();
    await page.getByLabel("تعداد توکن").fill("100");
    await page.getByRole("button", { name: "مشاهده مبلغ نهایی" }).click();

    await expect(page.getByRole("alert")).toContainText(
      "مبلغ نهایی دریافت نشد",
    );
    await expect(page.getByRole("button", { name: "تلاش مجدد" })).toBeVisible();
  });

  test("uses a touch-friendly bottom sheet on mobile", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/");
    await page.getByRole("button", { name: "باز کردن نوار کناری" }).click();
    await page.getByRole("button", { name: "افزایش موجودی کیف پول" }).click();

    const drawer = page.locator('[data-slot="drawer-content"]');
    await expect(drawer).toBeVisible();
    await expect(page.getByLabel("تعداد توکن")).toBeVisible();
    await expect
      .poll(async () => {
        const box = await drawer.boundingBox();
        return box ? box.y + box.height : 1_000;
      })
      .toBeLessThanOrEqual(845);
    const bounds = await drawer.boundingBox();
    expect(bounds).not.toBeNull();
    expect(bounds!.width).toBeLessThanOrEqual(390);
    expect(bounds!.y + bounds!.height).toBeLessThanOrEqual(845);
    await expect(page.getByLabel("تعداد توکن")).toHaveCSS("font-size", "16px");
  });
});

test.describe("Payment result", () => {
  test("keeps pending payments out of the failure state and refreshes them", async ({
    page,
  }) => {
    let paymentCompleted = false;
    await page.route("**/api/v1/payment/payment-1", async (route) => {
      await route.fulfill({
        json: {
          payment_uuid: "payment-1",
          status: paymentCompleted ? "PAID" : "PENDING",
        },
      });
    });
    await page.route("**/api/v1/payment/list**", async (route) => {
      await route.fulfill({
        json: { items: [paymentListItem("PENDING")], has_next: false },
      });
    });

    await page.goto("/payment/verify/payment-1");
    await expect(
      page.getByRole("heading", { name: "در حال بررسی پرداخت" }),
    ).toBeVisible();
    await expect(page.getByText("پرداخت ناموفق")).toHaveCount(0);
    paymentCompleted = true;
    await page.getByRole("button", { name: "بررسی مجدد" }).click();
    await expect(
      page.getByRole("heading", { name: "پرداخت موفق" }),
    ).toBeVisible();
  });

  test("shows a clear recovery action for a failed payment", async ({
    page,
  }) => {
    await page.route("**/api/v1/payment/payment-1", async (route) => {
      await route.fulfill({
        json: { payment_uuid: "payment-1", status: "FAILED" },
      });
    });
    await page.route("**/api/v1/payment/list**", async (route) => {
      await route.fulfill({
        json: { items: [paymentListItem("FAILED")], has_next: false },
      });
    });

    await page.goto("/payment/verify/payment-1");
    await expect(
      page.getByRole("heading", { name: "پرداخت ناموفق" }),
    ).toBeVisible();
    await expect(page.getByRole("link", { name: "تلاش مجدد" })).toHaveAttribute(
      "href",
      "/",
    );
  });
});

function paymentListItem(status: "PENDING" | "PAID" | "FAILED") {
  return {
    ...payment,
    status,
    target_type: "wallet",
    target_uuid: "wallet-1",
    created_at: "2026-09-20T12:00:00Z",
    updated_at: "2026-09-20T12:00:00Z",
  };
}

async function mockAppApi(page: Page) {
  await page.route("https://widget.ila.chat/**", (route) =>
    route.fulfill({ contentType: "application/javascript", body: "" }),
  );
  await page.route("**/api/v1/wallet/charge", (route) =>
    route.fulfill({ status: 201, json: payment }),
  );
  await page.route("**/*", async (route) => {
    const request = route.request();
    const path = new URL(request.url()).pathname;
    if (request.method() !== "GET") return route.fallback();
    if (path === "/api/v1/user/get-info") {
      return route.fulfill({ json: { uuid: "user-1", mobile: "09120000000" } });
    }
    if (path === "/api/v1/wallet/wallet") {
      return route.fulfill({
        json: { wallet_uuid: "wallet-1", balance_usdmicro: 1_000_000 },
      });
    }
    if (path === "/api/v1/user/subscription/active") {
      return route.fulfill({ json: activeSubscription() });
    }
    if (path === "/api/v1/ai-task/list") {
      return route.fulfill({ json: { items: [], has_next: false } });
    }
    if (path === "/api/v1/ai-task/events") {
      return route.fulfill({
        status: 200,
        contentType: "text/event-stream",
        body: "",
      });
    }
    if (path.startsWith("/api/")) {
      return route.fulfill({ json: { items: [], has_next: false } });
    }
    return route.fallback();
  });
}

function activeSubscription() {
  return {
    uuid: "subscription-1",
    plan: {
      uuid: "plan-1",
      name: "pro",
      display_name: "Pro",
      description: null,
      scopes: [],
      allowed_models: [],
      price_usdmicro: 0,
      duration_days: 30,
      balance_gift_amount_usdmicro: null,
      is_default: false,
      meta: {},
    },
  };
}
