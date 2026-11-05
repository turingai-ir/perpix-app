import {
  mockAuthenticatedSession,
  mockAnonymousSession,
  accessResponse,
  sessionHeaders,
} from "../../../../../__tests__/support/auth-session";
import { expect, test } from "@playwright/test";

for (const storageUnavailable of [false, true]) {
  test(
    storageUnavailable
      ? "an expired session still redirects when browser storage is unavailable"
      : "an expired session clears cached account data before another login",
    async ({ page }) => {
      await page.route("**/api/v1/**", (route) =>
        route.fulfill({ json: { items: [], has_next: false } }),
      );
      await page.route("**/api/v1/wallet/wallet", (route) =>
        route.fulfill({
          json: {
            wallet_uuid: "wallet-a",
            balance_usdmicro: 1000,
            is_active: true,
          },
        }),
      );
      await page.route("**/api/v1/user/subscription/active", (route) =>
        route.fulfill({
          json: {
            plan: {
              name: "starter",
              display_name: "Starter",
              is_default: false,
            },
          },
        }),
      );
      const accountA = {
        name: "Account A",
        email: "account-a@example.com",
        phone_number: "09123456789",
        is_verified: true,
        scopes: [],
        default_wallet_uuid: "wallet-a",
        is_active: true,
        created_at: "2026-01-01T00:00:00Z",
        updated_at: "2026-01-01T00:00:00Z",
      };
      let accountBLoggedIn = false;
      let accountBRequested = false;
      let releaseAccountB: () => void = () => {};
      const accountBReady = new Promise<void>((resolve) => {
        releaseAccountB = resolve;
      });
      await mockAuthenticatedSession(page);
      await page.route("**/api/v1/user/get-info", async (route) => {
        if (accountBLoggedIn) {
          accountBRequested = true;
          await accountBReady;
        }
        await route.fulfill({
          json: accountBLoggedIn
            ? {
                ...accountA,
                name: "Account B",
                email: "account-b@example.com",
                phone_number: "09123456788",
                default_wallet_uuid: "wallet-b",
              }
            : accountA,
        });
      });
      const persistedAccountA = () =>
        page.evaluate(async () => {
          const path = "/src/features/app-runtime/_tests/browser-store.ts";
          return (await import(/* @vite-ignore */ path))
            .readOldCache()
            .then((value: string) => value.includes("Account A"));
        });
      const cachedAccountA = () =>
        page.evaluate(async () => {
          const modulePath = "/src/lib/react-query.ts";
          const { queryClient } = await import(modulePath);
          return queryClient
            .getQueryCache()
            .getAll()
            .some((query: { state: { data: unknown } }) =>
              JSON.stringify(query.state.data)?.includes("Account A"),
            );
        });

      try {
        await page.goto("/profile/settings");
        await expect(
          page.getByRole("textbox", { name: "نام کامل", exact: true }),
        ).toHaveValue("Account A", { timeout: 15000 });
        await expect.poll(persistedAccountA).toBe(false);
        if (storageUnavailable) {
          await page.evaluate(() => {
            indexedDB.open = () => {
              throw new DOMException("Storage unavailable", "UnknownError");
            };
          });
        }
        await mockAnonymousSession(page);
        await page.route("**/api/v1/wallet/wallet", (route) =>
          route.fulfill({
            status: 401,
            json: { detail: "Session expired" },
          }),
        );
        await page.evaluate(async () => {
          const modulePath = "/src/services/api/client.ts";
          const { apiClient } = await import(modulePath);
          try {
            await apiClient.GET("/api/v1/wallet/wallet");
          } catch {
            /* Expected 401. */
          }
        });
        await expect(page).toHaveURL(
          /\/auth\/login\?returnTo=%2Fprofile%2Fsettings$/,
        );
        await expect.soft.poll(cachedAccountA).toBe(false);
        if (!storageUnavailable)
          await expect.soft.poll(persistedAccountA).toBe(false);

        await page.route("**/api/v1/wallet/wallet", (route) =>
          route.fulfill({
            json: {
              wallet_uuid: "wallet-b",
              balance_usdmicro: 2000,
              is_active: true,
            },
          }),
        );

        await page.route("**/api/v1/auth/start", (route) =>
          route.fulfill({
            json: { next_step: "password" },
          }),
        );
        await page.route("**/api/v1/auth/login", (route) => {
          accountBLoggedIn = true;
          return route.fulfill({
            headers: sessionHeaders,
            json: { ...accessResponse, access_token: "account-b" },
          });
        });
        await page
          .getByLabel("شماره موبایل", { exact: true })
          .fill("09123456788");
        await page
          .getByRole("button", { name: "ادامه دادن", exact: true })
          .press("Enter");
        await page
          .getByLabel("رمز عبور", { exact: true })
          .filter({ visible: true })
          .fill("Abcd1234");
        await page
          .getByRole("button", { name: "ورود", exact: true })
          .press("Enter");
        await expect
          .poll(() => accountBRequested, { timeout: 15000 })
          .toBe(true);
        await expect(page.getByText("Account A", { exact: true })).toHaveCount(
          0,
        );
        releaseAccountB();
        await expect(page).toHaveURL(/\/profile\/settings$/);
        await expect(
          page.getByRole("textbox", { name: "نام کامل", exact: true }),
        ).toHaveValue("Account B");
      } finally {
        releaseAccountB();
      }
    },
  );
}
