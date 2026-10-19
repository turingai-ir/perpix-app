import { expect, test, type Page } from "@playwright/test";

import { sessionHeaders } from "../../../../__tests__/support/auth-session";

import { errorBody, mockAppShellApis } from "./support";

interface RefreshLog {
  refreshes: number;
  profileAuthorizations: (string | undefined)[];
}

/** Refresh issues token-1, then token-2, …; profile only accepts token-2+. */
async function mockRotatingSession(
  page: Page,
  options: { profileStatus?: number } = {},
) {
  const log: RefreshLog = { refreshes: 0, profileAuthorizations: [] };
  await mockAppShellApis(page);
  await page.route("**/api/v1/auth/csrf", (route) =>
    route.fulfill({ json: { csrf_token: "csrf-1" } }),
  );
  await page.route("**/api/v1/auth/refresh", (route) => {
    log.refreshes += 1;

    return route.fulfill({
      headers: sessionHeaders,
      json: {
        access_token: `token-${log.refreshes}`,
        token_type: "bearer",
        expires_in: 900,
      },
    });
  });
  await page.route("**/api/v1/user/get-info", (route) => {
    const authorization = route.request().headers().authorization;
    log.profileAuthorizations.push(authorization);
    if (options.profileStatus) {
      return route.fulfill({
        status: options.profileStatus,
        json: errorBody(),
      });
    }

    return authorization === "Bearer token-1"
      ? route.fulfill({ status: 401, json: errorBody() })
      : route.fulfill({
          json: {
            email: null,
            phone_number: "+989123456789",
            name: null,
            is_verified: true,
            scopes: [],
            default_wallet_uuid: null,
            is_active: true,
            created_at: "2026-10-18T00:00:00Z",
            updated_at: "2026-10-18T00:00:00Z",
          },
        });
  });

  return log;
}

test("a 401 from a protected API refreshes once and retries the request once", async ({
  page,
}) => {
  const log = await mockRotatingSession(page);

  await page.goto("/");

  await expect(
    page.getByRole("navigation", { name: "پیوندهای مالی" }),
  ).toBeVisible();
  await expect
    .poll(() => log.profileAuthorizations.includes("Bearer token-2"))
    .toBe(true);
  // bootstrap + exactly one coordinated recovery, shared by concurrent 401s
  expect(log.refreshes).toBe(2);
});

for (const status of [403, 426]) {
  test(`a ${status} never triggers a refresh`, async ({ page }) => {
    const log = await mockRotatingSession(page, { profileStatus: status });
    await page.goto("/");
    await expect
      .poll(() => log.profileAuthorizations.length)
      .toBeGreaterThan(0);
    expect(log.refreshes).toBe(1);
  });
}

test("concurrent protected requests share one refresh", async ({ page }) => {
  const log = await mockRotatingSession(page);
  await page.goto("/");
  await expect(
    page.getByRole("navigation", { name: "پیوندهای مالی" }),
  ).toBeVisible();
  expect(log.refreshes).toBe(2);
  await page.route("**/api/v1/wallet/wallet", (route) => {
    if (route.request().headers().authorization === "Bearer token-2") {
      return route.fulfill({ status: 401, json: errorBody() });
    }
    return route.fulfill({ json: { balance_usdmicro: 25 } });
  });
  const balances = await page.evaluate(async () => {
    const modulePath = "/src/services/api/client.ts";
    const { apiClient } = await import(modulePath);
    const results = await Promise.all(
      Array.from({ length: 4 }, () => apiClient.GET("/api/v1/wallet/wallet")),
    );
    return results.map((result) => result.data.balance_usdmicro);
  });
  expect(balances).toEqual([25, 25, 25, 25]);
  expect(log.refreshes).toBe(3);
});
