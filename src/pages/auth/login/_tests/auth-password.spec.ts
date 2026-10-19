import { mockAnonymousSession } from "../../../../../__tests__/support/auth-session";
import { challenge } from "../../../../features/auth/_tests/support";
import { expect, test } from "@playwright/test";

for (const password of ["+98Abcd1234", " Abcd1234 "]) {
  test(`login preserves the entered password: ${JSON.stringify(password)}`, async ({
    page,
  }) => {
    await page.route("**/api/v1/**", (route) =>
      route.fulfill({ json: { items: [], has_next: false } }),
    );
    await page.route("**/api/v1/auth/start", (route) =>
      route.fulfill({
        json: { next_step: "password" },
      }),
    );
    let submittedPassword: unknown;
    await page.route("**/api/v1/auth/login", async (route) => {
      submittedPassword = (
        route.request().postDataJSON() as Record<string, unknown>
      ).password;
      await route.fulfill({
        status: 422,
        json: { detail: "Test login response" },
      });
    });

    await mockAnonymousSession(page);
    await page.goto("/auth/login");
    await page.getByLabel("شماره موبایل", { exact: true }).fill("09123456789");
    await page.getByRole("button", { name: "ادامه دادن", exact: true }).click();
    await page
      .getByLabel("رمز عبور", { exact: true })
      .filter({ visible: true })
      .fill(password);
    await page.getByRole("button", { name: "ورود", exact: true }).click();
    await expect.poll(() => submittedPassword).toBe(password);
  });

  test(`registration accepts a matching password unchanged: ${JSON.stringify(password)}`, async ({
    page,
  }) => {
    await page.route("**/api/v1/**", (route) =>
      route.fulfill({ json: { items: [], has_next: false } }),
    );
    await page.route("**/api/v1/auth/start", (route) =>
      route.fulfill({
        json: { next_step: "registration", ...challenge() },
      }),
    );
    let submittedBody: Record<string, unknown> | undefined;
    await page.route("**/api/v1/auth/registrations", async (route) => {
      submittedBody = route.request().postDataJSON() as Record<string, unknown>;
      await route.fulfill({
        status: 422,
        json: { detail: "Test OTP response" },
      });
    });

    await mockAnonymousSession(page);
    await page.goto("/auth/login");
    await page.getByLabel("شماره موبایل", { exact: true }).fill("09123456789");
    await page.getByRole("button", { name: "ادامه دادن", exact: true }).click();
    await page
      .getByLabel("رمز عبور", { exact: true })
      .filter({ visible: true })
      .fill(password);
    await page.getByLabel("تکرار رمز عبور", { exact: true }).fill(password);
    await page.getByLabel("کد تأیید", { exact: true }).fill("123456");
    await page.getByRole("button", { name: "ثبت‌نام", exact: true }).click();
    await expect
      .poll(() => submittedBody)
      .toEqual({
        challenge_id: challenge().challenge_id,
        password,
        otp_code: "123456",
      });
  });
}
