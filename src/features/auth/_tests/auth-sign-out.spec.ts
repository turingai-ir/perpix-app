import { expect, test, type Page } from "@playwright/test";

import {
  accessResponse,
  sessionHeaders,
} from "../../../../__tests__/support/auth-session";

import { errorBody, mockAppShellApis } from "./support";

const userMenu = (page: Page) => page.getByRole("button", { name: /Free/ });

/** Signed in until the first successful logout call flips the cookie state. */
async function mockSessionThatEndsOnLogout(page: Page) {
  const state = { signedIn: true, logoutCsrf: undefined as string | undefined };
  await mockAppShellApis(page);
  await page.route("**/api/v1/auth/csrf", (route) =>
    state.signedIn
      ? route.fulfill({ json: { csrf_token: "csrf-1" } })
      : route.fulfill({ status: 401, json: errorBody() }),
  );
  await page.route("**/api/v1/auth/refresh", (route) =>
    route.fulfill({ headers: sessionHeaders, json: accessResponse }),
  );
  await page.route("**/api/v1/auth/logout", (route) => {
    state.logoutCsrf = route.request().headers()["x-csrf-token"];
    state.signedIn = false;

    return route.fulfill({ status: 204 });
  });

  return state;
}

test("signing out sends the CSRF header, clears the session and survives reload", async ({
  page,
}) => {
  const state = await mockSessionThatEndsOnLogout(page);
  await page.goto("/");

  await userMenu(page).click();
  await page.getByRole("menuitem", { name: "خروج", exact: true }).click();

  await expect(page).toHaveURL(/\/auth\/login$/);
  expect(state.logoutCsrf).toBe("csrf-1");

  await page.goto("/");
  await expect(page).toHaveURL(/\/auth\/login$/);
});

test("a sign-out the server could not confirm is reported with a retry", async ({
  page,
}) => {
  await mockAppShellApis(page);
  await page.route("**/api/v1/auth/csrf", (route) =>
    route.fulfill({ json: { csrf_token: "csrf-1" } }),
  );
  await page.route("**/api/v1/auth/refresh", (route) =>
    route.fulfill({ headers: sessionHeaders, json: accessResponse }),
  );
  await page.route("**/api/v1/auth/logout", (route) => route.abort());
  await page.goto("/");

  await userMenu(page).click();
  await page.getByRole("menuitem", { name: "خروج", exact: true }).click();

  await expect(page).toHaveURL(/\/auth\/login$/);
  await expect(
    page.getByText("خروج از حساب روی سرور تأیید نشد."),
  ).toBeVisible();
  await expect(page.getByRole("button", { name: "تلاش مجدد" })).toBeVisible();
});

test("the user menu only offers signing out of the current device", async ({
  page,
}) => {
  await mockSessionThatEndsOnLogout(page);
  await page.goto("/");

  await userMenu(page).click();
  await expect(
    page.getByRole("menuitem", { name: "خروج", exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole("menuitem", { name: "خروج از همهٔ دستگاه‌ها" }),
  ).toHaveCount(0);
});

test("signing out in one tab signs the other tab out too", async ({
  context,
  page,
}) => {
  const state = { signedIn: true };
  await context.route("**/api/v1/auth/csrf", (route) =>
    state.signedIn
      ? route.fulfill({ json: { csrf_token: "csrf-1" } })
      : route.fulfill({ status: 401, json: errorBody() }),
  );
  await context.route("**/api/v1/auth/refresh", (route) =>
    route.fulfill({ headers: sessionHeaders, json: accessResponse }),
  );
  await context.route("**/api/v1/auth/logout", (route) => {
    state.signedIn = false;

    return route.fulfill({ status: 204 });
  });
  const otherTab = await context.newPage();
  await mockAppShellApis(page);
  await mockAppShellApis(otherTab);
  await page.goto("/");
  await otherTab.goto("/");
  await expect(
    otherTab.getByRole("navigation", { name: "پیوندهای مالی" }),
  ).toBeVisible();

  await userMenu(page).click();
  await page.getByRole("menuitem", { name: "خروج", exact: true }).click();

  await expect(otherTab).toHaveURL(/\/auth\/login$/);
});

test("changing the password reports a wrong current password without retrying", async ({
  page,
}) => {
  let changes = 0;
  let refreshes = 0;
  await mockAppShellApis(page);
  await page.route("**/api/v1/auth/csrf", (route) =>
    route.fulfill({ json: { csrf_token: "csrf-1" } }),
  );
  await page.route("**/api/v1/auth/refresh", (route) => {
    refreshes += 1;

    return route.fulfill({ headers: sessionHeaders, json: accessResponse });
  });
  await page.route("**/api/v1/auth/password-changes", (route) => {
    changes += 1;

    return route.fulfill({ status: 401, json: errorBody() });
  });
  await page.goto("/");

  await userMenu(page).click();
  await page.getByRole("menuitem", { name: "تغییر رمز عبور" }).click();
  const dialog = page.getByRole("dialog");
  await dialog.getByLabel("رمز عبور فعلی").fill("wrong-current");
  await dialog
    .getByLabel("رمز عبور جدید", { exact: true })
    .fill("NewStrongPass1");
  await dialog.getByLabel("تکرار رمز عبور جدید").fill("NewStrongPass1");
  await dialog.getByRole("button", { name: "تغییر رمز عبور" }).click();

  await expect(dialog.getByRole("alert")).toHaveText(
    "رمز عبور فعلی صحیح نیست.",
  );
  expect(changes).toBe(1);
  expect(refreshes).toBe(1);
  await expect(dialog).toBeVisible();
  await expect(page).not.toHaveURL(/\/auth\/login$/);
});

test("a successful password change ends the session and asks to sign in again", async ({
  page,
}) => {
  const state = { changed: false };
  await mockAppShellApis(page);
  await page.route("**/api/v1/auth/csrf", (route) =>
    state.changed
      ? route.fulfill({ status: 401, json: errorBody() })
      : route.fulfill({ json: { csrf_token: "csrf-1" } }),
  );
  await page.route("**/api/v1/auth/refresh", (route) =>
    route.fulfill({ headers: sessionHeaders, json: accessResponse }),
  );
  await page.route("**/api/v1/auth/password-changes", (route) => {
    state.changed = true;

    return route.fulfill({ status: 204 });
  });
  await page.goto("/");

  await userMenu(page).click();
  await page.getByRole("menuitem", { name: "تغییر رمز عبور" }).click();
  const dialog = page.getByRole("dialog");
  await dialog.getByLabel("رمز عبور فعلی").fill("current-pass");
  await dialog
    .getByLabel("رمز عبور جدید", { exact: true })
    .fill("NewStrongPass1");
  await dialog.getByLabel("تکرار رمز عبور جدید").fill("NewStrongPass1");
  await dialog.getByRole("button", { name: "تغییر رمز عبور" }).click();

  await expect(page).toHaveURL(/\/auth\/login$/);
  await expect(
    page.getByText("رمز عبور تغییر کرد. دوباره وارد شوید."),
  ).toBeVisible();
});
