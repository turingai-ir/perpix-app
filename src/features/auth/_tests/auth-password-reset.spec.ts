import { expect, test } from "@playwright/test";

import { mockAnonymousSession } from "../../../../__tests__/support/auth-session";

import { challenge, CHALLENGE_ID } from "./support";

test("password reset returns to the login page without signing in", async ({
  page,
}) => {
  let resetBody: unknown;
  let refreshRequests = 0;
  await mockAnonymousSession(page);
  await page.route("**/api/v1/auth/refresh", (route) => {
    refreshRequests += 1;

    return route.abort();
  });
  await page.route("**/api/v1/auth/password-reset-challenges", (route) =>
    route.fulfill({ status: 201, json: challenge() }),
  );
  await page.route("**/api/v1/auth/password-resets", (route) => {
    resetBody = route.request().postDataJSON();

    return route.fulfill({ status: 204 });
  });

  await page.goto("/auth/login");
  await page.getByRole("button", { name: "فراموشی رمز عبور" }).click();
  await page.getByLabel("شماره موبایل").fill("09123456789");
  await page.getByRole("button", { name: "دریافت کد تأیید" }).click();
  await page.getByLabel("کد تأیید").fill("012345");
  await page.getByLabel("رمز عبور جدید").fill("NewStrongPass1");
  await page.getByLabel("تکرار رمز عبور").fill("NewStrongPass1");
  await page.getByRole("button", { name: "تغییر رمز عبور" }).click();

  await expect(page.getByRole("heading", { name: "ورود" })).toBeVisible();
  await expect(page).toHaveURL(/\/auth\/login$/);
  expect(resetBody).toEqual({
    challenge_id: CHALLENGE_ID,
    otp_code: "012345",
    new_password: "NewStrongPass1",
  });
  expect(refreshRequests).toBe(0);
});
