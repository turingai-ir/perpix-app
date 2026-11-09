import { expect, test } from "@playwright/test";

const user = {
  name: "Test User",
  email: "test@example.com",
  phone_number: "09123456789",
  is_verified: true,
  scopes: [],
  default_wallet_uuid: "wallet-1",
  is_active: true,
  created_at: "2026-01-01T00:00:00Z",
  updated_at: "2026-01-01T00:00:00Z",
};

for (const viewport of [
  { name: "mobile", width: 375, height: 812 },
  { name: "tablet", width: 768, height: 1024 },
  { name: "desktop", width: 1440, height: 900 },
]) {
  test(`password settings are accessible on ${viewport.name}`, async ({
    page,
    context,
    baseURL,
  }) => {
    if (!baseURL) throw new Error("Playwright baseURL is required");
    await page.setViewportSize(viewport);
    await context.addCookies([
      { name: "access_token", value: "test-token", url: baseURL },
    ]);
    await page.route("**/api/v1/**", (route) =>
      route.fulfill({ json: { items: [], has_next: false } }),
    );
    await page.route("**/api/v1/auth/csrf", (route) =>
      route.fulfill({ json: { csrf_token: "test-csrf" } }),
    );
    await page.route("**/api/v1/auth/refresh", (route) =>
      route.fulfill({
        headers: { "X-CSRF-TOKEN": "test-csrf" },
        json: {
          access_token: "test-token",
          token_type: "Bearer",
          expires_in: 3600,
        },
      }),
    );
    await page.route("**/api/v1/user/get-info", (route) =>
      route.fulfill({ json: user }),
    );
    await page.route("**/api/v1/wallet/wallet", (route) =>
      route.fulfill({
        json: {
          wallet_uuid: "wallet-1",
          balance_usdmicro: 1000,
          is_active: true,
        },
      }),
    );
    await page.route("**/api/v1/user/subscription/active", (route) =>
      route.fulfill({
        json: {
          plan: { name: "starter", display_name: "Starter", is_default: false },
        },
      }),
    );

    await page.goto("/profile/settings");
    const security = page.getByRole("region", { name: "تغییر رمز عبور" });
    await expect(security).toBeVisible({ timeout: 15000 });
    await expect(security.getByLabel("رمز عبور فعلی")).toBeVisible();
    await expect(
      security.getByLabel("رمز عبور جدید", { exact: true }),
    ).toBeVisible();
    await expect(
      security.getByRole("button", { name: "تغییر رمز عبور" }),
    ).toBeVisible();
    await expect
      .poll(() =>
        page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
      )
      .toBe(true);
  });
}
