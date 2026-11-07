import { expect, test, type BrowserContext, type Page } from "@playwright/test";
import { mockAuthenticatedSession } from "../../../../__tests__/support/auth-session";
import type { SchemaPaymentDetailsResponse } from "../../../shared/api";

const paymentId = "c0202000-0000-4000-8000-000000000005";
const walletId = "d0202000-0000-4000-8000-000000000005";

async function authenticate(context: BrowserContext, baseURL?: string) {
  if (!baseURL) throw new Error("Playwright baseURL is required");
  await context.addCookies([
    { name: "access_token", value: "test-token", url: baseURL },
  ]);
  await mockAuthenticatedSession(context);
}

async function mockAccount(page: Page) {
  // A fulfilled finite SSE body reconnects and legitimately invalidates the
  // ledger. Keep this pagination fixture open until cancelled, like the server.
  await page.addInitScript(() => {
    const nativeFetch = window.fetch.bind(window);
    window.fetch = (input, init) => {
      const url = new URL(input instanceof Request ? input.url : String(input), location.href);
      if (url.pathname !== "/api/v1/payment-events") return nativeFetch(input, init);
      let signal = init?.signal;
      if (signal === undefined && input instanceof Request) signal = input.signal;
      let cleanup = () => {};
      const body = new ReadableStream<Uint8Array>({
        start(controller) {
          const abort = () => {
            cleanup();
            controller.error(signal?.reason);
          };
          cleanup = () => signal?.removeEventListener("abort", abort);
          if (signal?.aborted) { abort(); return; }
          controller.enqueue(new TextEncoder().encode(": fixture-heartbeat\n\n"));
          signal?.addEventListener("abort", abort, { once: true });
        },
        cancel() { cleanup(); },
      });
      return Promise.resolve(new Response(body, {
        headers: { "content-type": "text/event-stream" },
      }));
    };
  });
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

for (const kind of ["payments", "wallet-transactions"] as const) {
  test(`${kind} recovers an empty later page without clearing its filter`, async ({
    page,
    context,
    baseURL,
  }) => {
    await authenticate(context, baseURL);
    await mockAccount(page);
    await page.setViewportSize({ width: 375, height: 812 });
    const isPayments = kind === "payments";
    const filterKey = isPayments ? "status" : "type";
    const filterValue = isPayments ? "succeeded" : "WITHDRAW";
    const requests: number[] = [];
    await page.route(
      isPayments
        ? "**/api/v1/payment-intents?*"
        : "**/api/v1/wallet/transactions**",
      (route) => {
        const params = new URL(route.request().url()).searchParams;
        const offset = Number(params.get("offset"));
        requests.push(offset);
        if (isPayments) {
          return route.fulfill({
            json: { ...paymentHistory(), items: [], has_next: false },
          });
        }
        expect(params.get("type")).toBe(filterValue);
        return route.fulfill({
          json: {
            ...walletHistory(filterValue),
            transactions: [],
            has_next: false,
          },
        });
      },
    );

    await page.goto(`/profile/${kind}?offset=999&${filterKey}=${filterValue}`);
    const firstPage = page.getByRole("button", { name: "صفحهٔ اول" });
    await expect(firstPage).toBeVisible();
    expect(new URL(page.url()).searchParams.get("offset")).toBe("999");
    expect(requests).toEqual([999]);
    await firstPage.click();
    await expect(firstPage).toBeHidden();
    await expect(page).toHaveURL(/offset=0/);
    expect(new URL(page.url()).searchParams.get(filterKey)).toBe(filterValue);
    await expect.poll(() => requests).toEqual([999, 0]);
    await expect(
      page.getByRole("button", {
        name: isPayments ? "پرداخت و تحویل کامل" : "برداشت",
        exact: true,
      }),
    ).toHaveAttribute("aria-pressed", "true");
  });

  test(`${kind} resets a later offset when the filter changes`, async ({
    page,
    context,
    baseURL,
  }) => {
    await authenticate(context, baseURL);
    await mockAccount(page);
    const isPayments = kind === "payments";
    const requests: number[] = [];
    await page.route(
      isPayments
        ? "**/api/v1/payment-intents?*"
        : "**/api/v1/wallet/transactions**",
      (route) => {
        requests.push(
          Number(new URL(route.request().url()).searchParams.get("offset")),
        );
        return route.fulfill({
          json: isPayments
            ? { items: [], has_next: false }
            : { ...walletHistory(), transactions: [], has_next: false },
        });
      },
    );
    await page.goto(`/profile/${kind}?offset=100`);
    await expect(page.getByRole("button", { name: "صفحهٔ اول" })).toBeVisible();
    await page.getByRole("button", {
      name: isPayments ? "پرداخت و تحویل کامل" : "برداشت",
      exact: true,
    }).click();
    await expect(page).not.toHaveURL(/offset=/);
    await expect.poll(() => requests.at(-1)).toBe(0);
    await expect(page.getByRole("button", { name: "صفحهٔ اول" })).toBeHidden();
  });
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
  test(`payment archive keeps long records readable at ${viewport.width}`, async ({
    page,
    context,
    baseURL,
  }) => {
    await authenticate(context, baseURL);
    await mockAccount(page);
    await page.setViewportSize(viewport);
    await page.emulateMedia({ reducedMotion: "reduce" });
    const history = paymentHistory();
    history.items[0].payment.amount = "90071992547409930";
    history.items[0].payment.fulfillment_status = "PENDING";
    const details: SchemaPaymentDetailsResponse = {
      id: paymentId,
      currency: "IRR",
      base_amount_usdmicro: "1000000",
      tax_amount_usdmicro: "0",
      total_amount_usdmicro: "1000000",
      base_amount: "90071992547409930",
      tax_amount: "0",
      total_amount: "90071992547409930",
    };
    await page.route("**/api/v1/payment-intents?*", (route) =>
      route.fulfill({ json: history }),
    );
    await page.route(
      `**/api/v1/payment-intents/${paymentId}/details`,
      (route) =>
        route.fulfill({ json: details }),
    );
    await page.goto("/profile/payments");
    const archive = page.getByRole("region", { name: "آرشیو پرداخت‌ها" });
    const mobile = viewport.width < 1024;
    const records = mobile
      ? archive.getByRole("list")
      : archive.getByRole("table");
    await expect(records).toBeVisible();
    await expect(
      records.getByText("پرداخت شده؛ در حال اعمال", { exact: true }),
    ).toBeVisible();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth,
      ),
    ).toBe(true);
    await expect(archive).toHaveJSProperty(
      "scrollWidth",
      await archive.evaluate((el) => el.clientWidth),
    );
    if (mobile) {
      const record = records.getByRole("listitem");
      expect(
        await record.evaluate((el) => el.scrollWidth <= el.clientWidth),
      ).toBe(true);
      const id = record.locator("bdi").last();
      expect(await id.evaluate((el) => el.scrollWidth <= el.clientWidth)).toBe(
        true,
      );
      const button = record.getByRole("button", { name: "جزئیات رسید" });
      expect((await button.boundingBox())?.height).toBeGreaterThanOrEqual(44);
    }
    await archive.screenshot({
      path: `.impeccable/review/payment-archive-${viewport.width}.png`,
    });
    await records.getByRole("button").click();
    const receipt = page.getByRole("dialog");
    await expect(receipt).toBeVisible();
    const formattedAmount = `${9007199254740993n.toLocaleString("fa-IR")} تومان`;
    await expect(
      receipt.getByText(formattedAmount, { exact: true }),
    ).toHaveCount(2);
    expect(
      await receipt.evaluate(
        (element) => element.scrollWidth <= element.clientWidth,
      ),
    ).toBe(true);
    await page.keyboard.press("Escape");
    await expect(page.getByRole("dialog")).toBeHidden();
  });
}

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
