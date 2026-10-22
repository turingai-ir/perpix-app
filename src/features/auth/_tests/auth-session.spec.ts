import { expect, test } from "@playwright/test";

import {
  accessResponse,
  mockAnonymousSession,
  sessionHeaders,
  TEST_ACCESS_TOKEN,
} from "../../../../__tests__/support/auth-session";

import { errorBody, mockAppShellApis } from "./support";

test("reload restores the session with csrf then refresh and keeps tokens out of storage", async ({
  page,
}) => {
  const calls: string[] = [];
  let profileAuthorization: string | undefined;
  await mockAppShellApis(page);
  await page.route("**/api/v1/user/get-info", (route) => {
    profileAuthorization = route.request().headers().authorization;

    return route.fulfill({
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
  await page.route("**/api/v1/auth/csrf", (route) => {
    calls.push("csrf");

    return route.fulfill({ json: { csrf_token: "csrf-1" } });
  });
  await page.route("**/api/v1/auth/refresh", (route) => {
    calls.push(`refresh:${route.request().headers()["x-csrf-token"]}`);

    return route.fulfill({ headers: sessionHeaders, json: accessResponse });
  });

  await page.goto("/");

  await expect(
    page.getByRole("navigation", { name: "پیوندهای مالی" }),
  ).toBeVisible();
  expect(calls).toEqual(["csrf", "refresh:csrf-1"]);
  await expect
    .poll(() => profileAuthorization)
    .toBe(`Bearer ${TEST_ACCESS_TOKEN}`);

  const persisted = await page.evaluate(
    () =>
      JSON.stringify({ ...localStorage, ...sessionStorage }) + document.cookie,
  );
  expect(persisted).not.toContain(TEST_ACCESS_TOKEN);
});

test("local refresh cookie survives a page reload", async ({ page }) => {
  const csrfRequests: { origin: string; cookie: string | null }[] = [];
  const refreshRequests: { origin: string; cookie: string | null }[] = [];
  await mockAppShellApis(page);
  await page.context().addCookies([
    {
      name: "refresh-session",
      value: "test-cookie",
      url: "http://localhost:5173/api/v1/auth/csrf",
      httpOnly: true,
      secure: true,
      sameSite: "Lax",
    },
  ]);
  await page.route("**/api/v1/auth/csrf", async (route) => {
    csrfRequests.push({
      origin: new URL(route.request().url()).origin,
      cookie: await route.request().headerValue("cookie"),
    });
    return route.fulfill({ json: { csrf_token: "csrf-1" } });
  });
  await page.route("**/api/v1/auth/refresh", async (route) => {
    refreshRequests.push({
      origin: new URL(route.request().url()).origin,
      cookie: await route.request().headerValue("cookie"),
    });
    return route.fulfill({ headers: sessionHeaders, json: accessResponse });
  });

  await page.goto("/");
  await expect.poll(() => refreshRequests.length).toBe(1);
  await page.reload();
  await expect.poll(() => refreshRequests.length).toBe(2);

  expect(csrfRequests).toEqual([
    { origin: "http://localhost:5173", cookie: "refresh-session=test-cookie" },
    { origin: "http://localhost:5173", cookie: "refresh-session=test-cookie" },
  ]);
  expect(refreshRequests).toEqual(csrfRequests);
  await expect(page).not.toHaveURL(/\/auth\/login/);
});

test("an anonymous visitor is redirected to the login page", async ({
  page,
}) => {
  await mockAnonymousSession(page);

  await page.goto("/");

  await expect(page).toHaveURL(/\/auth\/login$/);
  await expect(
    page.getByRole("heading", { name: "از همین‌جا شروع کن" }),
  ).toBeVisible();
});

test("a failed session check offers a retry instead of showing the login form", async ({
  page,
}) => {
  let csrfRequests = 0;
  await mockAppShellApis(page);
  await page.route("**/api/v1/auth/csrf", (route) => {
    csrfRequests += 1;

    return csrfRequests === 1
      ? route.fulfill({ status: 503, json: errorBody("Unavailable", 900) })
      : route.fulfill({ json: { csrf_token: "csrf-1" } });
  });
  await page.route("**/api/v1/auth/refresh", (route) =>
    route.fulfill({ headers: sessionHeaders, json: accessResponse }),
  );

  await page.goto("/");

  await expect(page.getByRole("alert")).toContainText("اتصال برقرار نشد");
  await expect(
    page.getByRole("heading", { name: "از همین‌جا شروع کن" }),
  ).toBeHidden();

  await page.getByRole("button", { name: "دوباره امتحان کن" }).click();

  await expect(
    page.getByRole("navigation", { name: "پیوندهای مالی" }),
  ).toBeVisible();
});

test("an expired refresh session ends in the login page", async ({ page }) => {
  await page.route("**/api/v1/auth/csrf", (route) =>
    route.fulfill({ json: { csrf_token: "csrf-1" } }),
  );
  await page.route("**/api/v1/auth/refresh", (route) =>
    route.fulfill({ status: 401, json: errorBody() }),
  );

  await page.goto("/");

  await expect(page).toHaveURL(/\/auth\/login$/);
});

test("an authenticated visitor skips the login page", async ({ page }) => {
  await mockAppShellApis(page);
  await page.route("**/api/v1/auth/csrf", (route) =>
    route.fulfill({ json: { csrf_token: "csrf-1" } }),
  );
  await page.route("**/api/v1/auth/refresh", (route) =>
    route.fulfill({ headers: sessionHeaders, json: accessResponse }),
  );

  await page.goto("/auth/login");

  await expect(page).not.toHaveURL(/\/auth\/login$/);
  await expect(
    page.getByRole("navigation", { name: "پیوندهای مالی" }),
  ).toBeVisible();
});
