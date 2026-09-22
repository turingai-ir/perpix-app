import { expect, test } from "@playwright/test";

test("shows account data and saves editable profile fields", async ({
  page,
  context,
}) => {
  await context.addCookies([
    { name: "access_token", value: "test-token", url: "http://localhost:5173" },
  ]);
  let savedBody: unknown;
  await page.route("**/api/v1/user/get-info", async (route) => {
    await route.fulfill({
      json: {
        user_uuid: "user-1",
        phone_number: "09123456789",
        name: "کاربر تست",
        email: "user@example.com",
        is_verified: true,
        scopes: [],
        default_wallet_uuid: "wallet-1",
        is_active: true,
        created_at: "2026-01-01T00:00:00Z",
        updated_at: "2026-01-01T00:00:00Z",
      },
    });
  });
  await page.route("**/api/v1/wallet/wallet", async (route) => {
    await route.fulfill({
      json: {
        wallet_uuid: "wallet-1",
        owner_user_uuid: "user-1",
        name: "Main",
        balance_usdmicro: 12000,
        is_active: true,
        created_at: "2026-01-01T00:00:00Z",
        updated_at: "2026-01-01T00:00:00Z",
      },
    });
  });
  await page.route("**/api/v1/user/subscription/active", async (route) => {
    await route.fulfill({
      json: {
        uuid: "subscription-1",
        plan: {
          uuid: "plan-1",
          name: "pro",
          display_name: "حرفه‌ای",
          description: null,
          scopes: [],
          allowed_models: [],
          base_price_usdmicro: 0,
          discounted_price_usdmicro: 0,
        },
        started_at: "2026-01-01T00:00:00Z",
        expires_at: "2027-01-01T00:00:00Z",
      },
    });
  });
  await page.route("**/api/v1/user/edit-info", async (route) => {
    savedBody = route.request().postDataJSON();
    await route.fulfill({
      json: {
        name: "نام جدید",
        email: "user@example.com",
        phone_number: "09123456789",
      },
    });
  });

  await page.goto("/profile/settings");
  await expect(
    page.getByRole("heading", { name: "حساب شما، به سبک شما." }),
  ).toBeVisible();
  const identityCard = page.getByTestId("identity-card");
  await expect(identityCard).toHaveAttribute("data-side", "front");
  await expect(identityCard.locator("img")).toHaveAttribute(
    "src",
    "/android-chrome-512x512.png",
  );
  await expect(page.locator(".settings-card-emblem")).not.toHaveCSS(
    "animation-name",
    "none",
  );
  await identityCard.click();
  await expect(identityCard).toHaveAttribute("data-side", "back");
  await expect(identityCard).toHaveAttribute("aria-pressed", "true");
  await expect(identityCard).toContainText("6789");
  await identityCard.focus();
  await page.keyboard.press("Enter");
  await expect(identityCard).toHaveAttribute("data-side", "front");
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(page.locator(".settings-card-emblem")).toHaveCSS(
    "animation-name",
    "none",
  );
  await identityCard.click();
  await expect(identityCard).toHaveAttribute("data-side", "back");
  await expect(
    page.getByLabel("وضعیت حساب").getByText("حرفه‌ای"),
  ).toBeVisible();
  await expect(
    page.getByLabel("وضعیت حساب").getByText("۱۲ توکن"),
  ).toBeVisible();
  await expect(page.getByLabel("شماره تلفن همراه")).toBeDisabled();

  await page.getByLabel("نام کامل").fill("نام جدید");
  await page.getByRole("button", { name: "ویرایش اطلاعات" }).click();
  await expect
    .poll(() => savedBody)
    .toEqual({ name: "نام جدید", email: "user@example.com" });
  await expect(
    page.getByText("اطلاعات کاربری با موفقیت بروزرسانی گردید"),
  ).toBeVisible();
  await page.setViewportSize({ width: 390, height: 844 });
  await page.reload();
  await expect(
    page.getByRole("heading", { name: "حساب شما، به سبک شما." }),
  ).toBeVisible();
  await expect
    .poll(() =>
      page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth,
      ),
    )
    .toBe(true);
});
