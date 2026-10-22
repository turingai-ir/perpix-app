import { expect, test, type BrowserContext, type Page } from "@playwright/test";

async function mockProfileData(page: Page, context: BrowserContext) {
  await context.addCookies([
    { name: "access_token", value: "test-token", url: "http://localhost:5173" },
  ]);
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
}

test("shows account data and saves editable profile fields", async ({
  page,
  context,
}) => {
  await mockProfileData(page, context);
  let savedBody: unknown;
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
    page.getByRole("heading", { name: "اینجا حساب خودته" }),
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
  await page.getByRole("button", { name: "ذخیرهٔ تغییرات" }).click();
  await expect
    .poll(() => savedBody)
    .toEqual({ name: "نام جدید", email: "user@example.com" });
  await expect(
    page.getByText("اطلاعات حسابت به‌روز شد."),
  ).toBeVisible();
  await page.setViewportSize({ width: 390, height: 844 });
  await page.reload();
  await expect(
    page.getByRole("heading", { name: "اینجا حساب خودته" }),
  ).toBeVisible();
  await expect
    .poll(() =>
      page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth,
      ),
    )
    .toBe(true);
});

test.describe("identity card on touch viewports", () => {
  test.use({ hasTouch: true, reducedMotion: "no-preference" });

  for (const width of [320, 375]) {
    test(`keeps the back content contained at ${width}px`, async ({
      page,
      context,
    }) => {
      await page.setViewportSize({ width, height: 812 });
      await mockProfileData(page, context);
      await page.goto("/profile/settings");

      const identityCard = page.getByTestId("identity-card");
      await expect(identityCard).toHaveAttribute("data-side", "front");
      await expect(identityCard).toHaveAttribute("aria-pressed", "false");
      await identityCard.tap();
      await expect(identityCard).toHaveAttribute("data-side", "back");
      await expect(identityCard).toHaveAttribute("aria-pressed", "true");

      const backDetails = identityCard.locator(".settings-card-back-details");
      await expect(backDetails).toBeVisible();
      await expect(identityCard.locator(".settings-card-rotor")).toHaveCSS(
        "transform",
        "none",
      );
      await expect(identityCard.locator(".settings-card-back")).toHaveCSS(
        "backface-visibility",
        "visible",
      );
      expect(
        await identityCard.evaluate((card) => {
          const details = card.querySelector<HTMLElement>(
            ".settings-card-back-details",
          );
          const center = card.querySelector<HTMLElement>(
            ".settings-card-back-center",
          );
          if (!details || !center) return null;

          const cardBox = card.getBoundingClientRect();
          const detailsBox = details.getBoundingClientRect();
          const centerBox = center.getBoundingClientRect();
          const isContained = (child: DOMRect, parent: DOMRect) =>
            child.left >= parent.left - 0.5 &&
            child.right <= parent.right + 0.5 &&
            child.top >= parent.top - 0.5 &&
            child.bottom <= parent.bottom + 0.5;
          const detailItems = Array.from(details.children, (item) =>
            item.getBoundingClientRect(),
          );

          return {
            centerInCard: isContained(centerBox, cardBox),
            detailsInCard: isContained(detailsBox, cardBox),
            itemsInDetails: detailItems.every((item) =>
              isContained(item, detailsBox),
            ),
            sectionsSeparated: centerBox.bottom <= detailsBox.top + 0.5,
            noDetailsOverflow: details.scrollWidth <= details.clientWidth,
          };
        }),
      ).toEqual({
        centerInCard: true,
        detailsInCard: true,
        itemsInDetails: true,
        sectionsSeparated: true,
        noDetailsOverflow: true,
      });
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= window.innerWidth,
        ),
      ).toBe(true);
    });
  }
});
