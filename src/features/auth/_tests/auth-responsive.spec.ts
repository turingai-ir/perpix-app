import { expect, test } from "@playwright/test";
import { mockAnonymousSession } from "../../../../__tests__/support/auth-session";
import { challenge, errorBody } from "./support";

for (const [width, height] of [
  [375, 812],
  [768, 1024],
  [1440, 900],
]) {
  test(`registration and its error remain usable at ${width}`, async ({
    page,
  }, testInfo) => {
    await page.setViewportSize({ width, height });
    await mockAnonymousSession(page);
    await page.route("**/api/v1/auth/start", (route) =>
      route.fulfill({ json: { next_step: "registration", ...challenge() } }),
    );
    await page.route("**/api/v1/auth/registrations", (route) =>
      route.fulfill({ status: 400, json: errorBody() }),
    );
    await page.goto("/auth/login");
    await page.getByLabel("شماره موبایل").fill("09123456789");
    await page.getByRole("button", { name: "ادامه دادن" }).click();
    await page.getByLabel("کد تأیید").fill("012345");
    await page.getByLabel("رمز عبور", { exact: true }).fill("StrongPass1");
    await page.getByLabel("تکرار رمز عبور").fill("StrongPass1");
    await page.getByRole("button", { name: "ثبت‌نام", exact: true }).click();
    await expect(page.getByRole("alert")).toContainText(
      "کد تأیید درست نیست یا مهلتش تموم شده",
    );
    await expect(page.locator("[data-auth-reaction='code']")).toHaveCSS(
      "opacity",
      "0",
    );
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    const back = page.getByRole("button", { name: "تغییر شماره" });
    await back.scrollIntoViewIfNeeded();
    await page.screenshot({
      path: testInfo.outputPath("registration-error.png"),
      fullPage: true,
      animations: "disabled",
    });
    await back.click();
    await expect(page.getByLabel("شماره موبایل")).toHaveValue("+989123456789");
  });
}
