import { expect, test } from "@playwright/test";

for (const sameSession of [true, false]) {
  test(
    sameSession
      ? "reload restores cached account data for the same session"
      : "reload never restores another session's cached account data",
    async ({ page, context, baseURL }) => {
      if (!baseURL) throw new Error("Playwright baseURL is required");
      await context.addCookies([
        { name: "access_token", value: "account-a", url: baseURL },
      ]);
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
      let reloading = false;
      let requested = false;
      let release: () => void = () => {};
      const responseReady = new Promise<void>((resolve) => {
        release = resolve;
      });
      await page.route("**/api/v1/user/get-info", async (route) => {
        if (reloading) {
          requested = true;
          await responseReady;
        }
        await route.fulfill({
          json: {
            name: reloading && !sameSession ? "Account B" : "Account A",
            email: "account@example.com",
            phone_number: "09123456789",
            is_verified: true,
            scopes: [],
            default_wallet_uuid: "wallet-a",
            is_active: true,
            created_at: "2026-01-01T00:00:00Z",
            updated_at: "2026-01-01T00:00:00Z",
          },
        });
      });
      try {
        await page.goto("/profile/settings");
        const name = page.getByRole("textbox", {
          name: "نام کامل",
          exact: true,
        });
        await expect(name).toHaveValue("Account A");
        await expect
          .poll(() =>
            page.evaluate(async () => {
              const modulePath = "/src/lib/react-query.ts";
              const { indexedDBPersister } = await import(modulePath);
              return (
                JSON.stringify(
                  await indexedDBPersister.restoreClient(),
                )?.includes("Account A") ?? false
              );
            }),
          )
          .toBe(true);
        if (!sameSession) {
          await context.addCookies([
            { name: "access_token", value: "account-b", url: baseURL },
          ]);
        }
        reloading = true;
        await page.reload();
        await expect.poll(() => requested).toBe(true);
        if (sameSession) {
          await expect(name).toHaveValue("Account A");
        } else {
          expect(
            await page.evaluate(async () => {
              const modulePath = "/src/lib/react-query.ts";
              const { queryClient } = await import(modulePath);
              return queryClient
                .getQueryCache()
                .getAll()
                .some((query: { state: { data: unknown } }) =>
                  JSON.stringify(query.state.data)?.includes("Account A"),
                );
            }),
          ).toBe(false);
          await expect(
            page.getByText("Account A", { exact: true }),
          ).toHaveCount(0);
        }
        release();
        await expect(name).toHaveValue(sameSession ? "Account A" : "Account B");
      } finally {
        release();
      }
    },
  );
}
