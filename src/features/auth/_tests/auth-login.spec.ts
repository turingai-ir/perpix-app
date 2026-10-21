import { expect, test, type Page } from "@playwright/test";

import {
  accessResponse,
  mockAnonymousSession,
  sessionHeaders,
} from "../../../../__tests__/support/auth-session";

import { errorBody, mockAppShellApis } from "./support";

async function fillCredentials(page: Page, phone: string, password: string) {
  await page.getByLabel("شماره موبایل").fill(phone);
  await page.getByRole("button", { name: "ادامه دادن" }).click();
  await page.getByLabel("رمز عبور", { exact: true }).fill(password);
  await page.getByRole("button", { name: /^ورود/ }).click();
}

test.beforeEach(async ({ page }) => {
  await mockAnonymousSession(page);
  await page.route("**/api/v1/auth/start", (route) =>
    route.fulfill({ json: { next_step: "password" } }),
  );
});

test("signs in with a canonical E.164 phone converted from Persian digits", async ({
  page,
}) => {
  let body: unknown;
  await mockAppShellApis(page);
  await page.route("**/api/v1/auth/login", (route) => {
    body = route.request().postDataJSON();

    return route.fulfill({ headers: sessionHeaders, json: accessResponse });
  });

  await page.goto("/auth/login");
  await fillCredentials(page, "۰۹۱۲۳۴۵۶۷۸۹", "secret");

  await expect(page.locator("[data-auth-celebration]")).toBeVisible();
  await expect(page.locator("[data-auth-celebration]")).toContainText(
    "در باز شد",
  );
  await page.waitForTimeout(4000);
  await expect(page).toHaveURL(/\/auth\/login$/);
  await expect(page.locator("[data-auth-celebration]")).toBeVisible();
  await expect(
    page.getByRole("navigation", { name: "پیوندهای مالی" }),
  ).toBeVisible();
  expect(body).toEqual({ phone_number: "+989123456789", password: "secret" });
});

test("shows one generic message for any rejected credentials", async ({
  page,
}) => {
  await page.route("**/api/v1/auth/login", (route) =>
    route.fulfill({ status: 401, json: errorBody() }),
  );

  await page.goto("/auth/login");
  await fillCredentials(page, "09123456789", "wrong");

  await expect(page.locator("[data-auth-reaction='password']")).toBeVisible();
  await expect(page.getByRole("alert")).toHaveText(
    "شماره یا رمز عبور معتبر نیست.",
  );
  await expect(page).toHaveURL(/\/auth\/login$/);
});

test("locks submit for the retry_after window on 429", async ({ page }) => {
  await page.route("**/api/v1/auth/login", (route) =>
    route.fulfill({
      status: 429,
      json: { ...errorBody("Too many", 901), retry_after: 30 },
    }),
  );

  await page.goto("/auth/login");
  await fillCredentials(page, "09123456789", "secret");

  await expect(page.getByRole("alert")).toContainText("30 ثانیه");
  await expect(page.getByRole("button", { name: /^ورود/ })).toBeDisabled();
});

test("reports a connection problem when the request cannot be sent", async ({
  page,
}) => {
  await page.route("**/api/v1/auth/login", (route) => route.abort());

  await page.goto("/auth/login");
  await fillCredentials(page, "09123456789", "secret");

  await expect(page.getByRole("alert")).toContainText(
    "ارتباط با سرور برقرار نشد",
  );
});

test("validates the phone number before sending anything", async ({ page }) => {
  let loginRequests = 0;
  await page.route("**/api/v1/auth/login", (route) => {
    loginRequests += 1;

    return route.abort();
  });

  await page.goto("/auth/login");
  await page.getByLabel("شماره موبایل").fill("12345");
  await page.getByRole("button", { name: "ادامه دادن" }).click();

  await expect(
    page.getByText("شماره موبایل معتبر ایران وارد کنید."),
  ).toBeVisible();
  expect(loginRequests).toBe(0);
});
