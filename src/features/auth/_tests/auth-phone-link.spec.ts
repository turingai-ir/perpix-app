import { expect, test } from "@playwright/test";

import { mockAnonymousSession } from "../../../../__tests__/support/auth-session";

import { challenge } from "./support";

test.beforeEach(async ({ page }) => {
  await mockAnonymousSession(page);
});

test("a phone link submits once, preserves returnTo and allows changing the number", async ({
  page,
}) => {
  const bodies: unknown[] = [];
  await page.route("**/api/v1/auth/start", (route) => {
    bodies.push(route.request().postDataJSON());
    return route.fulfill({ json: { next_step: "password" } });
  });
  await page.goto("/auth/login?phone=09038276860&returnTo=%2Fprofile");

  await expect(page.getByLabel("رمز عبور", { exact: true })).toBeVisible();
  await expect(page).toHaveURL(/\/auth\/login\?returnTo=%2Fprofile$/);
  await page.getByRole("button", { name: "تغییر شماره موبایل" }).click();
  await expect(page.getByLabel("شماره موبایل")).toHaveValue("+989038276860");
  await expect(page.getByRole("button", { name: "ادامه دادن" })).toBeEnabled();
  expect(bodies).toEqual([{ phone_number: "+989038276860" }]);
});

test("a new user's phone link follows the registration challenge", async ({
  page,
}) => {
  await page.route("**/api/v1/auth/start", (route) =>
    route.fulfill({ json: { next_step: "registration", ...challenge() } }),
  );
  await page.goto(`/auth/login?phone=${encodeURIComponent("۰۹۰۳۸۲۷۶۸۶۰")}`);
  await expect(page.getByLabel("کد تأیید")).toBeVisible();
  await expect(page).toHaveURL(/\/auth\/login$/);
});

for (const phone of ["", "123", "invalid"]) {
  test(`an invalid phone link (${phone || "empty"}) stays editable without a request`, async ({
    page,
  }) => {
    let starts = 0;
    await page.route("**/api/v1/auth/start", (route) => {
      starts += 1;
      return route.abort();
    });
    await page.goto(`/auth/login?phone=${phone}`);
    await expect(page.getByLabel("شماره موبایل")).toHaveValue(phone);
    await expect(
      page.getByRole("button", { name: "ادامه دادن" }),
    ).toBeEnabled();
    expect(starts).toBe(0);
  });
}

test("a failed automatic submission keeps the number and only retries manually", async ({
  page,
}) => {
  let starts = 0;
  await page.route("**/api/v1/auth/start", (route) => {
    starts += 1;
    return route.abort();
  });
  await page.goto("/auth/login?phone=09038276860");
  await expect(page.getByRole("alert")).toContainText(
    "ارتباط با سرور برقرار نشد",
  );
  await expect(page.getByLabel("شماره موبایل")).toHaveValue("09038276860");
  await expect(page.getByRole("button", { name: "ادامه دادن" })).toBeEnabled();
  expect(starts).toBe(1);
  await page.getByRole("button", { name: "ادامه دادن" }).click();
  await expect.poll(() => starts).toBe(2);
});
