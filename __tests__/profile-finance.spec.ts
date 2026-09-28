import { expect, test } from "@playwright/test";

const created_at = "2026-09-20T10:30:00Z";
const payments = ["PAID", "PENDING", "FAILED"].map((status, index) => ({
  payment_uuid: `payment-${index + 1}`,
  status,
  created_at,
  updated_at: created_at,
  amount_irr_without_tax: 100000,
  tax_percent: 10,
  tax_amount_irr: 10000,
  total_amount_irr: 110000,
  target_type: "wallet",
  target_uuid: "wallet-1",
  payment_url: null,
}));
const transactions = ["DEPOSIT", "WITHDRAW", "REFUND"].map((type, index) => ({
  transaction_uuid: `transaction-${index + 1}`,
  type,
  amount_usdmicro: 1250,
  balance_before: 10000,
  balance_after: type === "WITHDRAW" ? 8750 : 11250,
  meta: {},
  created_at,
  updated_at: created_at,
}));

test.beforeEach(async ({ page, context }) => {
  await context.addCookies([
    { name: "access_token", value: "test-token", url: "http://localhost:5173" },
  ]);
  await page.route("**/api/v1/user/get-info", (route) =>
    route.fulfill({
      json: {
        user_uuid: "user-1",
        name: "همراه پرپیکس",
        phone_number: "09123456789",
        email: "user@example.com",
        is_verified: true,
        scopes: [],
        default_wallet_uuid: "wallet-1",
        is_active: true,
        created_at,
        updated_at: created_at,
      },
    }),
  );
  await page.route("**/api/v1/wallet/wallet", (route) =>
    route.fulfill({
      json: {
        wallet_uuid: "wallet-1",
        owner_user_uuid: "user-1",
        name: "Main",
        balance_usdmicro: 12500,
        is_active: true,
        created_at,
        updated_at: created_at,
      },
    }),
  );
  await page.route("**/api/v1/user/subscription/active", (route) =>
    route.fulfill({
      json: {
        uuid: "subscription-1",
        plan: {
          uuid: "plan-1",
          name: "pro",
          display_name: "حرفه‌ای",
          is_default: false,
          scopes: [],
          allowed_models: [],
          base_price_usdmicro: 0,
          discounted_price_usdmicro: 0,
        },
        started_at: created_at,
        expires_at: "2027-01-01T00:00:00Z",
      },
    }),
  );
  await page.route("**/api/v1/payment/list?*", (route) => {
    const offset = Number(
      new URL(route.request().url()).searchParams.get("offset"),
    );
    return route.fulfill({
      json: {
        items: offset ? payments.slice(0, 1) : payments,
        has_next: offset === 0,
      },
    });
  });
  await page.route("**/api/v1/wallet/transactions?*", (route) =>
    route.fulfill({
      json: {
        wallet_uuid: "wallet-1",
        owner_user_uuid: "user-1",
        transactions,
        has_next: false,
        created_at,
        updated_at: created_at,
      },
    }),
  );
});

test("payments filter, receipt and truthful pagination", async ({ page }) => {
  await page.goto("/profile/payments");
  await expect(
    page.getByRole("heading", { name: "پرداخت‌ها، روشن و دقیق." }),
  ).toBeVisible();
  await expect(page.locator(".finance-record")).toHaveCount(3);
  await page.getByRole("button", { name: "در انتظار", exact: true }).click();
  await expect(page.locator(".finance-record")).toHaveCount(1);
  await page.locator(".finance-record summary").click();
  await expect(page.getByText("payment-2", { exact: true })).toBeVisible();
  await expect(page.getByText("مبلغ پیش از مالیات")).toBeVisible();
  await page.getByRole("button", { name: "همه", exact: true }).click();
  await page.getByLabel("جست‌وجوی شناسه در این صفحه").fill("missing");
  await expect(
    page.getByText("نتیجه‌ای با این فیلترها پیدا نشد."),
  ).toBeVisible();
  await page.getByRole("button", { name: "پاک کردن فیلترها" }).click();
  await expect(page.locator(".finance-record")).toHaveCount(3);
  await expect(page.getByTestId("finance-pagination")).toContainText("۱ تا ۳");
  await page.getByRole("button", { name: "بعدی", exact: true }).click();
  await expect(page).toHaveURL(/offset=20/);
  await expect(page.getByTestId("finance-pagination")).toContainText(
    "۲۱ تا ۲۱",
  );
});

test("wallet keeps fractional tokens, filters and accessible motion on mobile", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/profile/wallet-transactions");
  await expect(
    page.getByRole("heading", { name: "اعتبار شما، جریان خلاقیت." }),
  ).toBeVisible();
  await expect(page.getByTestId("wallet-balance")).toContainText("۱۲٫۵");
  await page.getByRole("button", { name: "برداشت", exact: true }).click();
  await expect(page.locator(".finance-record")).toHaveCount(1);
  await page.locator(".finance-record summary").click();
  await expect(page.getByText("transaction-2", { exact: true })).toBeVisible();
  await expect(page.locator(".finance-record")).toContainText("۱٫۲۵");
  await expect(page.getByText("مانده پیش از تراکنش")).toBeVisible();
  await page.getByRole("button", { name: "توقف حرکت" }).click();
  await expect(page.locator(".finance-art")).toHaveAttribute(
    "data-paused",
    "true",
  );
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(page.locator(".finance-emblem")).toHaveCSS(
    "animation-name",
    "none",
  );
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBeTruthy();
});

test("empty payments never display a phantom range", async ({ page }) => {
  await page.route("**/api/v1/payment/list?*", (route) =>
    route.fulfill({ json: { items: [], has_next: false } }),
  );
  await page.goto("/profile/payments");
  await expect(page.getByText("هنوز پرداختی ثبت نشده است.")).toBeVisible();
  await expect(page.getByTestId("finance-pagination")).toContainText("۰ رکورد");
});

test("payment errors recover and failed refresh retains existing receipts", async ({
  page,
}) => {
  let fail = true;
  await page.route("**/api/v1/payment/list?*", (route) =>
    fail
      ? route.fulfill({ status: 503, json: { detail: "Unavailable" } })
      : route.fulfill({ json: { items: payments, has_next: false } }),
  );
  await page.goto("/profile/payments");
  await expect(page.getByRole("alert")).toContainText("دریافت سوابق انجام نشد");
  fail = false;
  await page.getByRole("button", { name: "تلاش دوباره", exact: true }).click();
  await expect(page.locator(".finance-record")).toHaveCount(3);
  fail = true;
  await page.getByRole("button", { name: "به‌روزرسانی سوابق" }).click();
  await expect(page.getByRole("alert")).toContainText(
    "اطلاعات موجود ممکن است قدیمی باشد",
  );
  await expect(page.locator(".finance-record")).toHaveCount(3);
});

test("inactive wallet cannot start a charge", async ({ page }) => {
  await page.route("**/api/v1/wallet/wallet", (route) =>
    route.fulfill({
      json: {
        wallet_uuid: "wallet-1",
        owner_user_uuid: "user-1",
        name: "Main",
        balance_usdmicro: 12500,
        is_active: false,
        created_at,
        updated_at: created_at,
      },
    }),
  );
  await page.goto("/profile/wallet-transactions");
  await expect(
    page.getByText("کیف پول غیرفعال", { exact: true }),
  ).toBeVisible();
  await expect(page.locator(".finance-charge")).toHaveCount(0);
});

test("art animates on arrival, pauses completely and receipts support keyboard", async ({
  page,
}) => {
  await page.goto("/profile/payments");
  const emblem = page.locator(".finance-emblem");
  await expect(emblem).toHaveCSS("animation-play-state", "running");
  const firstTransform = await emblem.evaluate(
    (element) => getComputedStyle(element).transform,
  );
  await expect
    .poll(() =>
      emblem.evaluate((element) => getComputedStyle(element).transform),
    )
    .not.toBe(firstTransform);
  await page.getByRole("button", { name: "توقف حرکت" }).click();
  await expect(emblem).toHaveCSS("animation-play-state", "paused");
  expect(
    await page
      .locator(".finance-glass-pass")
      .evaluate(
        (element) => getComputedStyle(element, "::after").animationPlayState,
      ),
  ).toBe("paused");
  await page.getByRole("button", { name: "پخش حرکت" }).click();
  await expect(emblem).toHaveCSS("animation-play-state", "running");
  await page.locator(".finance-record summary").first().focus();
  await page.keyboard.press("Enter");
  await expect(page.getByText("payment-1", { exact: true })).toBeVisible();
});

test("finance layouts fit desktop and narrow mobile in both themes", async ({
  page,
}, testInfo) => {
  for (const route of ["payments", "wallet-transactions"]) {
    await page.setViewportSize({ width: 1440, height: 1080 });
    await page.goto(`/profile/${route}`);
    await expect(page.locator(".finance-record")).toHaveCount(3);
    await page.screenshot({
      path: testInfo.outputPath(`${route}-desktop.png`),
      fullPage: true,
      animations: "disabled",
    });
    await page.setViewportSize({ width: 375, height: 812 });
    await page.keyboard.press("Escape");
    for (const dark of [true, false]) {
      await page.evaluate(
        (value) => document.documentElement.classList.toggle("dark", value),
        dark,
      );
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= window.innerWidth,
        ),
      ).toBeTruthy();
      await page.screenshot({
        path: testInfo.outputPath(
          `${route}-mobile-${dark ? "dark" : "light"}.png`,
        ),
        fullPage: true,
        animations: "disabled",
      });
    }
  }
});

test("wallet page opens the existing checkout and reviews only the server amount", async ({
  page,
}) => {
  await page.route("**/api/v1/wallet/charge", (route) =>
    route.fulfill({
      json: {
        payment_uuid: "charge-1",
        payment_url: "http://localhost:5173/mock-gateway",
        amount_usdmicro: 500000,
        amount_irr_without_tax: 1176750,
        tax_percent: 10,
        tax_amount_irr: 117675,
        total_amount_irr: 1294425,
        wallet_uuid: "wallet-1",
      },
    }),
  );
  await page.goto("/profile/wallet-transactions");
  await page.locator(".finance-charge button").click();
  await page.getByRole("button", { name: "۵۰۰ توکن", exact: true }).click();
  const request = page.waitForRequest(
    (request) =>
      request.url().endsWith("/api/v1/wallet/charge") &&
      request.method() === "POST",
  );
  await page.getByRole("button", { name: "مشاهده مبلغ نهایی" }).click();
  expect((await request).postDataJSON()).toEqual({ amount_usdmicro: 500000 });
  await expect(page.getByRole("heading", { name: "تأیید خرید" })).toBeVisible();
  await expect(page.getByText("۱٬۲۹۴٬۴۲۵ ریال", { exact: true })).toBeVisible();
  await expect(page).toHaveURL(/profile\/wallet-transactions$/);
});

test("default-plan wallet preserves the subscription prerequisite", async ({
  page,
}) => {
  await page.route("**/api/v1/user/subscription/active", (route) =>
    route.fulfill({
      json: {
        uuid: "subscription-1",
        plan: {
          uuid: "plan-1",
          name: "free",
          display_name: "رایگان",
          is_default: true,
          scopes: [],
          allowed_models: [],
          base_price_usdmicro: 0,
          discounted_price_usdmicro: 0,
        },
        started_at: created_at,
        expires_at: "2027-01-01T00:00:00Z",
      },
    }),
  );
  await page.goto("/profile/wallet-transactions");
  await page.locator(".finance-charge button").click();
  await expect(
    page.getByText("برای ادامه، ابتدا اشتراک را خریداری کنید", { exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "مشاهده مبلغ نهایی" }),
  ).toHaveCount(0);
});
