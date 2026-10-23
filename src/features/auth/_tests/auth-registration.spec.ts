import { expect, test, type Page } from "@playwright/test";

import {
  accessResponse,
  mockAnonymousSession,
  sessionHeaders,
} from "../../../../__tests__/support/auth-session";

import { challenge, CHALLENGE_ID, mockAppShellApis } from "./support";

async function startRegistration(page: Page) {
  await page.goto("/auth/login");
  await page.getByLabel("شماره موبایل").fill("09123456789");
  await page.getByRole("button", { name: "ادامه دادن" }).click();
}

async function completeForm(page: Page, otp: string, password = "StrongPass1") {
  await page.getByLabel("کد تأیید").fill(otp);
  await page.getByLabel("رمز عبور", { exact: true }).fill(password);
  await page.getByLabel("تکرار رمز عبور").fill(password);
}

test.beforeEach(async ({ page }) => {
  await mockAnonymousSession(page);
});

test("registers with an OTP that keeps its leading zero and Persian digits", async ({
  page,
}) => {
  let startBody: unknown;
  let completeBody: unknown;
  await mockAppShellApis(page);
  await page.route("**/api/v1/auth/start", (route) => {
    startBody = route.request().postDataJSON();

    return route.fulfill({
      status: 200,
      json: { next_step: "registration", ...challenge() },
    });
  });
  await page.route("**/api/v1/auth/registrations", (route) => {
    completeBody = route.request().postDataJSON();

    return route.fulfill({
      status: 201,
      headers: sessionHeaders,
      json: accessResponse,
    });
  });

  await startRegistration(page);
  await expect(
    page.getByRole("link", { name: "شرایط استفاده" }),
  ).toHaveAttribute("href", "https://perpixai.ir/terms/");
  await expect(
    page.getByRole("link", { name: "سیاست حریم خصوصی" }),
  ).toHaveAttribute("href", "https://perpixai.ir/privacy/");
  await completeForm(page, "۰۱۲۳۴۵");
  await page.getByRole("button", { name: "ثبت‌نام" }).click();

  await expect(page.locator("[data-auth-celebration]")).toBeVisible();
  await expect(
    page.getByRole("navigation", { name: "پیوندهای مالی" }),
  ).toBeVisible();
  expect(startBody).toEqual({ phone_number: "+989123456789" });
  expect(completeBody).toEqual({
    challenge_id: CHALLENGE_ID,
    otp_code: "012345",
    password: "StrongPass1",
  });
});

test("a wrong or expired code keeps the form and explains how to continue", async ({
  page,
}) => {
  await page.route("**/api/v1/auth/start", (route) =>
    route.fulfill({
      status: 200,
      json: { next_step: "registration", ...challenge() },
    }),
  );
  await page.route("**/api/v1/auth/registrations", (route) =>
    route.fulfill({
      status: 400,
      json: { detail: "Bad request", status_code: 999, request_id: null },
    }),
  );

  await startRegistration(page);
  await completeForm(page, "000000");
  await page.getByRole("button", { name: "ثبت‌نام" }).click();

  await expect(page.locator("[data-auth-reaction='code']")).toBeVisible();
  await expect(page.getByRole("alert")).toContainText(
    "کد تأیید درست نیست یا مهلتش تموم شده",
  );
  await expect(page.getByLabel("تکرار رمز عبور")).toHaveValue("StrongPass1");
});

test("rejects mismatching passwords locally", async ({ page }) => {
  let registrations = 0;
  await page.route("**/api/v1/auth/start", (route) =>
    route.fulfill({
      status: 200,
      json: { next_step: "registration", ...challenge() },
    }),
  );
  await page.route("**/api/v1/auth/registrations", (route) => {
    registrations += 1;

    return route.abort();
  });

  await startRegistration(page);
  await page.getByLabel("کد تأیید").fill("123456");
  await page.getByLabel("رمز عبور", { exact: true }).fill("StrongPass1");
  await page.getByLabel("تکرار رمز عبور").fill("Different1");
  await page.getByRole("button", { name: "ثبت‌نام" }).click();

  await expect(
    page.getByText("رمز عبور با تکرار آن برابر نیست."),
  ).toBeVisible();
  expect(registrations).toBe(0);
});

test("resend replaces the challenge once the cooldown has passed", async ({
  page,
}) => {
  const resendId = "22222222-2222-4222-8222-222222222222";
  let resendPath = "";
  await page.route("**/api/v1/auth/start", (route) =>
    route.fulfill({
      status: 200,
      json: { next_step: "registration", ...challenge({ resendInMs: -1000 }) },
    }),
  );
  await page.route("**/api/v1/auth/challenges/*/resend", (route) => {
    resendPath = new URL(route.request().url()).pathname;

    return route.fulfill({ json: challenge({ id: resendId }) });
  });

  await startRegistration(page);
  await page.getByRole("button", { name: "ارسال مجدد کد" }).click();

  await expect(page.getByText(/ارسال مجدد کد تا \d+ ثانیه دیگر/)).toBeVisible();
  expect(resendPath).toBe(`/api/v1/auth/challenges/${CHALLENGE_ID}/resend`);
});

test("an expired challenge asks for a fresh code instead of resending", async ({
  page,
}) => {
  let starts = 0;
  await page.route("**/api/v1/auth/start", (route) => {
    starts += 1;

    return route.fulfill({
      status: 201,
      json: {
        next_step: "registration",
        ...(starts === 1 ? challenge({ expiresInMs: -1000 }) : challenge()),
      },
    });
  });

  await startRegistration(page);
  await page.getByRole("button", { name: "درخواست کد تازه" }).click();

  await expect(
    page.getByRole("button", { name: "ارسال مجدد کد" }),
  ).toBeHidden();
  await expect.poll(() => starts).toBe(2);
  await expect(page.getByText(/ارسال مجدد کد تا \d+ ثانیه دیگر/)).toBeVisible();
});

test("a rate-limited challenge request shows the server wait time", async ({
  page,
}) => {
  await page.route("**/api/v1/auth/start", (route) =>
    route.fulfill({
      status: 429,
      json: {
        detail: "Too many",
        status_code: 901,
        request_id: null,
        retry_after: 120,
      },
    }),
  );

  await startRegistration(page);

  await expect(page.getByRole("alert")).toContainText("120 ثانیه");
});

test("resend respects the server rate-limit window", async ({ page }) => {
  await page.route("**/api/v1/auth/start", (route) =>
    route.fulfill({
      json: { next_step: "registration", ...challenge({ resendInMs: -1 }) },
    }),
  );
  await page.route("**/api/v1/auth/challenges/*/resend", (route) =>
    route.fulfill({
      status: 429,
      json: { detail: "Too many", status_code: 901, retry_after: 30 },
    }),
  );
  await startRegistration(page);
  const resend = page.getByRole("button", {
    name: "ارسال مجدد کد",
    exact: true,
  });
  await resend.click();
  await expect(page.getByRole("alert")).toContainText("30 ثانیه");
  await expect(resend).toBeDisabled();
});

test("restarting registration returns to the phone form when a password is now required", async ({
  page,
}) => {
  let starts = 0;
  await page.route("**/api/v1/auth/start", (route) => {
    starts += 1;
    const result =
      starts === 1
        ? { next_step: "registration", ...challenge({ expiresInMs: -1000 }) }
        : { next_step: "password" };
    return route.fulfill({ json: result });
  });
  await startRegistration(page);
  await page.getByRole("button", { name: "درخواست کد تازه" }).click();
  await expect(page.getByLabel("شماره موبایل")).toHaveValue("+989123456789");
  await expect(page.getByLabel("کد تأیید")).toBeHidden();
  expect(starts).toBe(2);
});
