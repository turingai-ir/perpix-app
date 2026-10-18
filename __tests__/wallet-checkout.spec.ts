import { expect, type Page, test } from "@playwright/test";

const payment = {
  id: "c0202000-0000-4000-8000-000000000001",
  execution_uuid: "c0202000-0000-4000-8000-000000000002",
  payment_url: "http://localhost:5173/mock-gateway",
  currency: "IRR",
  amount: "1294425",
  status: "PENDING",
  financial_status: "PENDING",
  fulfillment_status: "NOT_READY",
  requires_review: false,
};

test.describe("Wallet checkout", () => {
  test.beforeEach(async ({ baseURL, context, page }) => {
    await mockAppApi(page);
    await context.addCookies([
      { name: "access_token", value: "test-token", url: baseURL },
    ]);
  });

  test("reviews the exact server price before navigating to the gateway", async ({
    browserName,
    page,
  }) => {
    test.slow(
      browserName === "webkit",
      "WebKit needs longer to stabilize clicks",
    );
    await page.setViewportSize({ width: 1440, height: 900 });
    let gatewayVisits = 0;
    await page.route("**/mock-gateway", (route) => {
      gatewayVisits += 1;
      return route.fulfill({ contentType: "text/html", body: "Mock gateway" });
    });
    await page.goto("/");
    const desktopSidebar = page.locator("aside").filter({
      has: page.locator('a[href="/gallery"]'),
    });
    await page.getByRole("button", { name: "افزایش موجودی کیف پول" }).click();
    await expect(desktopSidebar).toBeVisible();
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
      page.getByRole("heading", { name: "تایید مبلغ پرداخت" }),
    ).toBeVisible();
    await expect(
      page.getByText("۱۱۷٬۶۷۵ تومان", { exact: true }),
    ).toBeVisible();
    await expect(
      page.getByText("۱۱٬۷۶۷٫۵ تومان", { exact: true }),
    ).toBeVisible();
    await expect(
      page.getByText("۱۲۹٬۴۴۲٫۵ تومان", { exact: true }),
    ).toBeVisible();
    expect(gatewayVisits).toBe(0);

    await page.keyboard.press("Escape");
    await page.getByRole("button", { name: "افزایش موجودی کیف پول" }).click();
    await expect(page.getByLabel("تعداد توکن")).toHaveValue("500");

    await page.getByRole("button", { name: "مشاهده مبلغ نهایی" }).click();
    await page.getByRole("button", { name: "ادامه پرداخت" }).click();
    await expect(page).toHaveURL(/\/mock-gateway$/);
    expect(gatewayVisits).toBe(1);
  });

  test("submits typed formatted amounts as raw micro-units", async ({
    browserName,
    page,
  }) => {
    test.slow(
      browserName === "webkit",
      "WebKit needs longer to stabilize clicks",
    );
    await page.goto("/");
    await page.getByRole("button", { name: "افزایش موجودی کیف پول" }).click();

    const amountInput = page.getByLabel("تعداد توکن");
    for (const [typedAmount, formattedAmount, amountUsdmicro] of [
      ["1001", "1,001", 1_001_000],
      ["5000", "5,000", 5_000_000],
    ] as const) {
      await amountInput.fill(typedAmount);
      await expect(amountInput).toHaveValue(formattedAmount);

      const chargeRequest = page.waitForRequest(
        (request) =>
          request.method() === "POST" &&
          new URL(request.url()).pathname === "/api/v1/wallet/charge",
      );
      await page.getByRole("button", { name: "مشاهده مبلغ نهایی" }).click();
      expect((await chargeRequest).postDataJSON()).toEqual({
        amount_usdmicro: amountUsdmicro,
      });

      await expect(
        page.getByRole("heading", { name: "تایید مبلغ پرداخت" }),
      ).toBeVisible();
      await page.keyboard.press("Escape");
      await page.getByRole("button", { name: "افزایش موجودی کیف پول" }).click();
    }
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
      page.getByRole("heading", { name: "تایید مبلغ پرداخت" }),
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
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto("/");
    await page.getByRole("button", { name: "باز کردن نوار کناری" }).click();
    const sidebarSheet = page.locator('[data-slot="sheet-content"]');
    await expect(sidebarSheet).toBeVisible();
    await page.getByRole("button", { name: "افزایش موجودی کیف پول" }).click();

    const drawer = page.locator('[data-slot="drawer-content"]');
    await expect(sidebarSheet).toBeHidden();
    await expect(drawer).toBeVisible();
    await expect(page.getByLabel("تعداد توکن")).toBeVisible();
    await expect
      .poll(async () => {
        const box = await drawer.boundingBox();
        return box ? box.y + box.height : 1_000;
      })
      .toBeLessThanOrEqual(813);
    const bounds = await drawer.boundingBox();
    expect(bounds).not.toBeNull();
    expect(bounds!.width).toBeLessThanOrEqual(375);
    expect(bounds!.y + bounds!.height).toBeLessThanOrEqual(813);
    await expect(page.getByLabel("تعداد توکن")).toHaveCSS("font-size", "16px");
    await page.getByRole("button", { name: "۱۰۰ توکن" }).click();
    await expect(page.getByLabel("تعداد توکن")).toHaveValue("100");
  });

  test("closes the navigation before opening the wallet dialog on tablet", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto("/");
    await page.getByRole("button", { name: "باز کردن نوار کناری" }).click();
    const sidebarSheet = page.locator('[data-slot="sheet-content"]');
    await expect(sidebarSheet).toBeVisible();

    await page.getByRole("button", { name: "افزایش موجودی کیف پول" }).click();

    await expect(sidebarSheet).toBeHidden();
    await expect(page.locator('[data-slot="dialog-content"]')).toBeVisible();
    await page.getByRole("button", { name: "۵۰۰ توکن" }).click();
    await expect(page.getByLabel("تعداد توکن")).toHaveValue("500");
  });
});

test.describe("Payment result", () => {
  test("keeps pending payments out of the failure state and polls them", async ({
    page,
  }) => {
    await page.clock.install();
    let paymentCompleted = false;
    await page.route(
      `**/api/v1/payment-executions/${payment.execution_uuid}`,
      async (route) => {
        await route.fulfill({
          json: {
            ...payment,
            status: paymentCompleted ? "SUCCEEDED" : "PENDING",
            financial_status: paymentCompleted ? "SUCCEEDED" : "PENDING",
            fulfillment_status: paymentCompleted ? "SUCCEEDED" : "NOT_READY",
          },
        });
      },
    );

    await page.goto(`/payment/verify/${payment.execution_uuid}`);
    await expect(
      page.getByRole("heading", { name: "در انتظار نتیجه پرداخت" }),
    ).toBeVisible();
    await expect(page.getByText("پرداخت ناموفق")).toHaveCount(0);
    paymentCompleted = true;
    await page.clock.fastForward(3_000);
    await expect(
      page.getByRole("heading", { name: "پرداخت تکمیل شد" }),
    ).toBeVisible();
  });

  test("shows a clear recovery action for a failed payment", async ({
    page,
  }) => {
    await page.route(
      `**/api/v1/payment-executions/${payment.execution_uuid}`,
      async (route) => {
        await route.fulfill({
          json: { ...payment, status: "FAILED" },
        });
      },
    );
    await page.route(
      `**/api/v1/payment-intents/${payment.id}/executions`,
      async (route) => {
        await route.fulfill({
          status: 201,
          json: payment,
        });
      },
    );
    await page.route("**/mock-gateway", (route) =>
      route.fulfill({ contentType: "text/html", body: "Mock gateway" }),
    );

    await page.goto(`/payment/verify/${payment.execution_uuid}`);
    await expect(
      page.getByRole("heading", { name: "پرداخت ناموفق" }),
    ).toBeVisible();
    const retryRequest = page.waitForRequest(
      (request) =>
        request.method() === "POST" &&
        new URL(request.url()).pathname ===
          `/api/v1/payment-intents/${payment.id}/executions`,
    );
    await page.getByRole("button", { name: "تلاش دوباره برای پرداخت" }).click();
    expect((await retryRequest).headers()["idempotency-key"]).toBeUndefined();
    await expect(page).toHaveURL(/\/mock-gateway$/);
  });
});

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
    if (path === `/api/v1/payment-intents/${payment.id}/details`) {
      return route.fulfill({
        json: {
          id: payment.id,
          currency: payment.currency,
          base_amount: "1176750",
          tax_amount: "117675",
          total_amount: payment.amount,
          base_amount_usdmicro: "500000",
          tax_amount_usdmicro: "50000",
          total_amount_usdmicro: "550000",
        },
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
