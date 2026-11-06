import type { Page } from "@playwright/test";

import { mockAuthenticatedSession } from "../../../../../__tests__/support/auth-session";

export const DAY = 24 * 60 * 60 * 1000;

export const makePlan = (
  uuid: string,
  name: string,
  price: number,
  isDefault = false,
) => ({
  uuid,
  name,
  display_name: name,
  description: `${name} description`,
  scopes: [],
  allowed_models: ["model-a"],
  base_price_usdmicro: price,
  discounted_price_usdmicro: price,
  base_price_irr: price * 10,
  discounted_price_irr: price * 10,
  duration_days: 30,
  balance_gift_amount_usdmicro: null,
  meta: { features: [`${name} feature`] },
  is_active: true,
  is_recommended: false,
  is_default: isDefault,
  created_at: "2026-09-30T00:00:00Z",
  updated_at: "2026-09-30T00:00:00Z",
});

export const FREE = makePlan("free", "Free", 0, true);
export const BASIC = makePlan("basic", "Basic", 10);
export const PRO = makePlan("pro", "Pro", 20);
export const MAX = makePlan("max", "Max", 30);

type MockOptions = {
  plan?: ReturnType<typeof makePlan>;
  daysLeft?: number;
  balance?: number | "error";
  transactions?: "default" | "error" | "empty";
};

const withdrawals = [3_000_000, 5_000_000, 2_000_000].map((amount, index) => ({
  transaction_uuid: `t${index}`,
  type: "WITHDRAW",
  amount_usdmicro: amount,
  balance_before: 0,
  balance_after: 0,
  meta: {},
  created_at: new Date(Date.now() - index * 1000).toISOString(),
  updated_at: new Date().toISOString(),
}));

/** Mocks every endpoint the app shell reads, so tests never hit a backend. */
export async function mockShell(page: Page, options: MockOptions = {}) {
  const {
    plan = PRO,
    daysLeft = 20,
    balance = 12_400_000,
    transactions = "default",
  } = options;

  await mockAuthenticatedSession(page);
  await page.route("**/api/v1/user/get-info", (route) =>
    route.fulfill({
      json: { uuid: "u", name: "Test", email: "t@example.com" },
    }),
  );
  await page.route("**/api/v1/wallet/wallet", (route) =>
    balance === "error"
      ? route.fulfill({ status: 503, json: { detail: "unavailable" } })
      : route.fulfill({
          json: {
            wallet_uuid: "w",
            balance_usdmicro: balance,
            is_active: true,
          },
        }),
  );
  await page.route("**/api/v1/wallet/transactions**", (route) => {
    if (transactions === "error") {
      return route.fulfill({ status: 500, json: { detail: "boom" } });
    }
    return route.fulfill({
      json: {
        wallet_uuid: "w",
        owner_user_uuid: "u",
        total_count: 3,
        transactions: transactions === "empty" ? [] : withdrawals,
      },
    });
  });
  await page.route("**/api/v1/user/subscription/plans", (route) =>
    route.fulfill({ json: { items: [FREE, BASIC, PRO, MAX] } }),
  );
  await page.route("**/api/v1/user/subscription/active", (route) =>
    route.fulfill({
      json: {
        uuid: "s",
        plan,
        started_at: new Date(Date.now() - 10 * DAY).toISOString(),
        expires_at: new Date(Date.now() + daysLeft * DAY).toISOString(),
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
}

/** Collects uncaught errors and console errors that are not network noise. */
export function trackErrors(page: Page) {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => {
    if (message.type() !== "error") return;
    const text = message.text();
    if (/Failed to load resource|net::ERR/.test(text)) return;
    errors.push(text);
  });
  return errors;
}
