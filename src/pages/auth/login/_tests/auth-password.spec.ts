import { expect, test } from "@playwright/test";

for (const password of ["+98Abcd1234", " Abcd1234 "]) {
  test(`login preserves the entered password: ${JSON.stringify(password)}`, async ({ page }) => {
    await page.route("**/api/v1/**", (route) => route.fulfill({ json: { items: [], has_next: false } }));
    await page.route("**/api/v1/user/start", (route) => route.fulfill({
      json: { token: "temporary-token", is_verified: true, is_registering: false, next_otp_at: null },
    }));
    let submittedPassword: unknown;
    await page.route("**/api/v1/user/login", async (route) => {
      submittedPassword = (route.request().postDataJSON() as Record<string, unknown>).password;
      await route.fulfill({ status: 422, json: { detail: "Test login response" } });
    });

    await page.goto("/auth/login");
    await page.getByLabel("شماره تلفن", { exact: true }).fill("09123456789");
    await page.getByRole("button", { name: "ادامه دادن", exact: true }).click();
    await page.getByLabel("رمز عبور", { exact: true }).filter({ visible: true }).fill(password);
    await page.getByRole("button", { name: "ورود", exact: true }).click();
    await expect.poll(() => submittedPassword).toBe(password);
  });

  test(`registration accepts a matching password unchanged: ${JSON.stringify(password)}`, async ({ page }) => {
    await page.route("**/api/v1/**", (route) => route.fulfill({ json: { items: [], has_next: false } }));
    await page.route("**/api/v1/user/start", (route) => route.fulfill({
      json: { token: "temporary-token", is_verified: false, is_registering: true, next_otp_at: null },
    }));
    let submittedBody: Record<string, unknown> | undefined;
    await page.route("**/api/v1/user/set-password", async (route) => {
      submittedBody = route.request().postDataJSON() as Record<string, unknown>;
      await route.fulfill({ status: 422, json: { detail: "Test OTP response" } });
    });

    await page.goto("/auth/login");
    await page.getByLabel("شماره تلفن", { exact: true }).fill("09123456789");
    await page.getByRole("button", { name: "ادامه دادن", exact: true }).click();
    await page.getByLabel("رمز عبور", { exact: true }).filter({ visible: true }).fill(password);
    await page.getByLabel("تکرار رمز عبور", { exact: true }).fill(password);
    await page.getByLabel("کد فعال سازی", { exact: true }).fill("123456");
    await expect.poll(() => submittedBody).toEqual({ password, otp_code: "123456" });
  });
}
