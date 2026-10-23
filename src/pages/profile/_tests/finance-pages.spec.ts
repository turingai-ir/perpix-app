import { expect, test, type BrowserContext, type Page } from "@playwright/test";

const paymentId = "c0202000-0000-4000-8000-000000000005";
const walletId = "d0202000-0000-4000-8000-000000000005";

async function authenticate(context: BrowserContext, baseURL?: string) {
  if (!baseURL) throw new Error("Playwright baseURL is required");
  await context.addCookies([
    { name: "access_token", value: "test-token", url: baseURL },
  ]);
}

async function mockAccount(page: Page) {
  await page.route("**/api/v1/user/get-info", (route) =>
    route.fulfill({
      json: {
        uuid: "user-1",
        name: "کاربر آزمایشی",
        email: "qa@example.com",
        phone_number: "09120000000",
      },
    }),
  );
  await page.route("**/api/v1/wallet/wallet", (route) =>
    route.fulfill({
      json: {
        wallet_uuid: walletId,
        owner_user_uuid: "user-1",
        name: "کیف پول اصلی",
        balance_usdmicro: 245000,
        is_active: true,
        created_at: "2026-01-01T00:00:00Z",
        updated_at: "2026-10-18T12:00:00Z",
      },
    }),
  );
  await page.route("**/api/v1/user/subscription/active", (route) =>
    route.fulfill({ json: { plan: { is_default: false } } }),
  );
  await page.route("**/api/v1/payment-events", (route) =>
    route.fulfill({
      contentType: "text/event-stream",
      body: "retry: 600000\n\n",
    }),
  );
}

function paymentHistory() {
  return {
    items: [
      {
        payment: {
          id: paymentId,
          execution_uuid: "execution-1",
          status: "SUCCEEDED",
          financial_status: "SUCCEEDED",
          fulfillment_status: "SUCCEEDED",
          requires_review: false,
          currency: "IRR",
          amount: "2500000",
          payment_url: null,
        },
        target_type: "wallet_topup",
        created_at: "2026-10-18T10:00:00Z",
      },
    ],
    has_next: false,
  };
}

function walletHistory(type = "DEPOSIT") {
  return {
    wallet_uuid: walletId,
    owner_user_uuid: "user-1",
    transactions: [
      {
        transaction_uuid: `transaction-${type.toLowerCase()}`,
        type,
        amount_usdmicro: 12000,
        balance_before: 245000,
        balance_after: 233000,
        meta: {},
        created_at: "2026-10-18T11:00:00Z",
        updated_at: "2026-10-18T11:00:00Z",
      },
    ],
    has_next: false,
    created_at: "2026-01-01T00:00:00Z",
    updated_at: "2026-10-18T11:00:00Z",
  };
}

test("payments prioritize status and remain usable on mobile", async ({
  page,
  context,
  baseURL,
}) => {
  await authenticate(context, baseURL);
  await mockAccount(page);
  await page.setViewportSize({ width: 375, height: 812 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.route("**/api/v1/payment-intents?*", (route) =>
    route.fulfill({ json: paymentHistory() }),
  );

  await page.goto("/profile/payments");
  await expect(
    page.getByRole("heading", { name: "همهٔ پرداخت‌هات یه‌جا" }),
  ).toBeVisible();
  await expect(page.getByText("مجموع پرداخت موفق")).toBeVisible();
  await expect(
    page.getByRole("list", { name: "آرشیو پرداخت‌ها" }),
  ).toBeVisible();
  await page
    .getByRole("searchbox", { name: "جست‌وجوی شناسه در این صفحه" })
    .fill("missing");
  await expect(
    page.getByText("چیزی با این فیلترها پیدا نشد. فیلترها رو پاک کن."),
  ).toBeVisible();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
});

test("wallet type filter is sent to the backend", async ({
  page,
  context,
  baseURL,
}) => {
  await authenticate(context, baseURL);
  await mockAccount(page);
  const requestedTypes: Array<string | null> = [];
  await page.route("**/api/v1/wallet/transactions**", (route) => {
    const type = new URL(route.request().url()).searchParams.get("type");
    requestedTypes.push(type);
    return route.fulfill({ json: walletHistory(type ?? "DEPOSIT") });
  });

  await page.goto("/profile/wallet-transactions");
  await expect(
    page.getByRole("heading", { name: "حواست به اعتبارت باشه" }),
  ).toBeVisible();
  await expect(
    page.getByLabel("حواست به اعتبارت باشه").getByText("۲۴۵ توکن"),
  ).toBeVisible();
  await page.getByRole("button", { name: "برداشت" }).click();
  await expect.poll(() => requestedTypes.at(-1)).toBe("WITHDRAW");
  await expect(page).toHaveURL(/type=WITHDRAW/);
});

test("wallet transactions paginate ten at a time through the backend", async ({
  page,
  context,
  baseURL,
}) => {
  await authenticate(context, baseURL);
  await mockAccount(page);
  await page.setViewportSize({ width: 375, height: 812 });
  const history = walletHistory();
  const transactions = Array.from({ length: 23 }, (_, index) => ({
    ...history.transactions[0],
    transaction_uuid: `transaction-${index + 1}`,
  }));
  const requests: Array<{ offset: number; limit: number }> = [];
  await page.route("**/api/v1/wallet/transactions**", (route) => {
    const params = new URL(route.request().url()).searchParams;
    const offset = Number(params.get("offset"));
    const limit = Number(params.get("limit"));
    requests.push({ offset, limit });
    return route.fulfill({
      json: {
        ...history,
        transactions: transactions.slice(offset, offset + limit),
        has_next: offset + limit < transactions.length,
      },
    });
  });

  await page.goto("/profile/wallet-transactions");
  const records = page.locator(".finance-mobile-list li");
  const pagination = page.locator(".finance-archive nav");
  await expect(records).toHaveCount(10);
  expect(requests.at(-1)).toEqual({ offset: 0, limit: 10 });

  await pagination.getByRole("button").nth(1).click();
  await expect(page).toHaveURL(/offset=10/);
  await expect(records).toHaveCount(10);
  await expect(records.first()).toContainText("transaction-11");
  expect(requests.at(-1)).toEqual({ offset: 10, limit: 10 });

  await pagination.getByRole("button").nth(1).click();
  await expect(page).toHaveURL(/offset=20/);
  await expect(records).toHaveCount(3);
  await expect(pagination.getByRole("button").nth(1)).toBeDisabled();
  expect(requests.at(-1)).toEqual({ offset: 20, limit: 10 });
});

for (const viewport of [
  { width: 375, height: 812 },
  { width: 768, height: 1024 },
  { width: 1440, height: 900 },
]) {
  test(`finance pages adapt at ${viewport.width}x${viewport.height}`, async ({
    page,
    context,
    baseURL,
  }) => {
    await authenticate(context, baseURL);
    await mockAccount(page);
    await page.setViewportSize(viewport);
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.route("**/api/v1/payment-intents?*", (route) =>
      route.fulfill({ json: paymentHistory() }),
    );
    await page.route("**/api/v1/wallet/transactions**", (route) =>
      route.fulfill({ json: walletHistory() }),
    );

    for (const financeRoute of [
      { path: "/profile/payments", name: "payments" },
      { path: "/profile/wallet-transactions", name: "wallet" },
    ]) {
      await page.goto(financeRoute.path);
      await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
      if (viewport.width >= 1024) {
        await expect(page.getByRole("table")).toBeVisible();
      } else {
        await expect(page.getByRole("list")).toBeVisible();
      }
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBe(true);
      await page.screenshot({
        path: `.impeccable/review/${financeRoute.name}-${viewport.width}.png`,
        fullPage: true,
      });
    }
  });
}
