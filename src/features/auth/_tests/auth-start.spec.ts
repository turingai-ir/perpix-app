import { expect, test } from "@playwright/test";

import { mockAnonymousSession } from "../../../../__tests__/support/auth-session";

test.beforeEach(async ({ page }) => {
  await mockAnonymousSession(page);
});

for (const [width, height] of [
  [375, 812],
  [768, 1024],
  [1440, 900],
]) {
  test(`phone first and change number at width ${width}`, async ({
    page,
  }, testInfo) => {
    await page.setViewportSize({ width, height });
    const phones: unknown[] = [];
    await page.route("**/api/v1/auth/start", (route) => {
      phones.push(route.request().postDataJSON());
      return route.fulfill({ json: { next_step: "password" } });
    });
    await page.goto("/auth/login");
    await expect(page.getByLabel("شماره موبایل")).toBeVisible();
    await expect(page.getByLabel("رمز عبور", { exact: true })).toBeHidden();
    await expect(page.locator("html")).toHaveAttribute("dir", "rtl");
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    await page.screenshot({
      path: testInfo.outputPath("phone.png"),
      fullPage: true,
    });
    await page.getByLabel("شماره موبایل").fill("09123456789");
    await page.getByRole("button", { name: "ادامه دادن" }).click();
    await expect(page.getByLabel("رمز عبور", { exact: true })).toBeFocused();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    await page.screenshot({
      path: testInfo.outputPath("password.png"),
      fullPage: true,
    });
    await page.getByLabel("رمز عبور", { exact: true }).fill("secret");
    await page.getByRole("button", { name: "تغییر شماره موبایل" }).click();
    await expect(page.getByLabel("شماره موبایل")).toHaveValue("+989123456789");
    await page.getByLabel("شماره موبایل").fill("09123456780");
    await page.getByRole("button", { name: "ادامه دادن" }).click();
    await expect(page.getByLabel("رمز عبور", { exact: true })).toHaveValue("");
    expect(phones).toEqual([
      { phone_number: "+989123456789" },
      { phone_number: "+989123456780" },
    ]);
  });
}

test("a connection failure keeps the phone form and never retries automatically", async ({
  page,
}) => {
  let starts = 0;
  await page.route("**/api/v1/auth/start", (route) => {
    starts += 1;
    return route.abort();
  });
  await page.goto("/auth/login");
  await page.getByLabel("شماره موبایل").fill("09123456789");
  await page.getByRole("button", { name: "ادامه دادن" }).click();
  await expect(page.getByRole("alert")).toContainText("اتصال برقرار نشد");
  await expect(page.getByLabel("شماره موبایل")).toHaveValue("09123456789");
  expect(starts).toBe(1);
});

test("an incomplete registration response does not open the code form", async ({
  page,
}) => {
  await page.route("**/api/v1/auth/start", (route) =>
    route.fulfill({ json: { next_step: "registration" } }),
  );
  await page.goto("/auth/login");
  await page.getByLabel("شماره موبایل").fill("09123456789");
  await page.getByRole("button", { name: "ادامه دادن" }).click();
  await expect(page.getByRole("alert")).toHaveText(
    "پاسخ سرور درست نبود. کمی بعد دوباره امتحان کن.",
  );
  await expect(page.getByLabel("کد تأیید")).toBeHidden();
});
