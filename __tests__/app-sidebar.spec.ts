import { type Page } from "@playwright/test";
import { loadEnv } from "vite";
import { expect, test } from "./fixtures/image-settings";
import { mockAuthenticatedSession } from "./support/auth-session";

const telegramSupportUrl = loadEnv(
  process.env.PERPIX_TEST_MODE ?? "development",
  process.cwd(),
  "VITE_APP_TELEGRAM_SUPPORT",
).VITE_APP_TELEGRAM_SUPPORT;

test.describe("App sidebar", () => {
  test.beforeEach(async ({ page }) => {
    await mockApi(page);
    await mockAuthenticatedSession(page);
  });

  test("loads the pricing sheet when it is first opened", async ({ page }) => {
    const pricingRequests: string[] = [];
    page.on("request", (request) => {
      if (request.url().includes("/feature/pricing/pricing.tsx")) {
        pricingRequests.push(request.url());
      }
    });

    await page.goto("/");
    const upgradeButton = page.getByRole("button", { name: "خرید اشتراک" });
    await expect(upgradeButton).toBeVisible();
    expect(pricingRequests).toHaveLength(0);

    await upgradeButton.click();
    await expect(page.getByRole("dialog", { name: "بسته‌ها" })).toBeVisible();
    expect(pricingRequests).toHaveLength(1);

    await page.getByRole("button", { name: "Close" }).click();
    await expect(page.getByRole("dialog", { name: "بسته‌ها" })).toBeHidden();
    await upgradeButton.click();
    await expect(page.getByRole("dialog", { name: "بسته‌ها" })).toBeVisible();
    expect(pricingRequests).toHaveLength(1);
  });

  test("shows the experimental editor link under gallery", async ({ page }) => {
    await page.goto("/");

    const galleryLink = page.getByRole("link", { name: "گالری" });
    const editorLink = page.getByRole("link", {
      name: /ویرایشگر تصویر\s+آزمایشی/,
    });

    await expect(galleryLink).toBeVisible();
    await expect(editorLink).toBeVisible();
    await expect(editorLink).toHaveAttribute("href", "/editor");
    await expect(editorLink.getByText("آزمایشی")).toBeVisible();

    const galleryBox = await galleryLink.boundingBox();
    const editorBox = await editorLink.boundingBox();

    expect(galleryBox).not.toBeNull();
    expect(editorBox).not.toBeNull();
    expect(editorBox!.y).toBeGreaterThan(galleryBox!.y);
  });

  test("provides the configured Telegram support option", async ({ page }) => {
    await page.goto("/");

    await expect(
      page.getByRole("button", { name: "پشتیبانی چت" }),
    ).toBeHidden();

    const telegramSupportLink = page.getByRole("link", {
      name: "پشتیبانی تلگرام",
    });
    await expect(telegramSupportLink).toBeVisible();
    await expect(telegramSupportLink).toHaveAttribute(
      "href",
      telegramSupportUrl,
    );
    await expect(telegramSupportLink).toHaveAttribute("target", "_blank");
  });

  test("blocks wallet charging until a subscription is purchased", async ({
    page,
  }) => {
    await page.goto("/");

    await page.getByRole("button", { name: "شارژ کیف پول" }).click();

    await expect(
      page.getByText("اول اشتراکت رو بخر"),
    ).toBeVisible();
    await expect(
      page.getByText(
        "برای شارژ کیف پول، اول باید اشتراک بخری.",
      ),
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: "خرید اشتراک" }),
    ).toBeVisible();
    await expect(page.getByRole("button", { name: "پرداخت" })).toBeHidden();
  });

  test("visually separates the sidebar from the app content", async ({
    page,
  }) => {
    await page.goto("/");

    const sidebar = page.locator("aside").filter({
      has: page.getByRole("link", { name: "گالری", exact: true }),
    });
    const header = page.locator("header");

    await expect(sidebar).toBeVisible();
    await expect(header).toBeVisible();

    const [sidebarBackground, headerBackground, sidebarShadow] =
      await Promise.all([
        sidebar.evaluate(
          (element) => getComputedStyle(element).backgroundColor,
        ),
        header.evaluate((element) => getComputedStyle(element).backgroundColor),
        sidebar.evaluate((element) => getComputedStyle(element).boxShadow),
      ]);

    expect(sidebarBackground).not.toBe(headerBackground);
    expect(sidebarShadow).not.toBe("none");
  });

  test("makes the home creation controls keyboard-accessible", async ({
    page,
  }) => {
    await page.goto("/");

    const homeShortcuts = page.locator("[data-dashboard-primary-action]");
    await expect(homeShortcuts).toHaveCount(2);
    await homeShortcuts.first().focus();
    await expect(homeShortcuts.first()).toBeFocused();
    await page.keyboard.press("Tab");
    await expect(homeShortcuts.last()).toBeFocused();
    await expect(page.locator('a[href="/profile/settings"]')).toBeVisible();
    await page.keyboard.press("Enter");
    await expect(page).toHaveURL(/\/generation\/video$/);
    await page.goBack();
    await homeShortcuts.first().focus();
    await page.keyboard.press("Enter");
    await expect(page).toHaveURL(/\/generation\/image$/);
  });

  test("identifies the active destination and labels the sidebar control", async ({
    page,
  }) => {
    await page.goto("/generation/image");

    await expect(
      page.locator("aside").getByRole("link", { name: "ساخت عکس" }),
    ).toHaveAttribute("aria-current", "page");
    await expect(
      page.getByRole("button", { name: "بستن نوار کناری" }),
    ).toHaveAttribute("aria-expanded", "true");
  });

  test("renders the mobile sidebar above its overlay inside the iPhone viewport", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 440, height: 956 });
    await page.goto("/");

    const sidebarSheet = page.locator('[data-slot="sheet-content"]');
    await expect(sidebarSheet).toBeVisible();
    await page.keyboard.press("Escape");
    await page.getByRole("button", { name: "باز کردن نوار کناری" }).click();

    const sidebarOverlay = page.locator('[data-slot="sheet-overlay"]');
    await expect(sidebarSheet).toBeVisible();
    await expect(sidebarSheet).toHaveCSS("transform", "none");

    const dimensions = await sidebarSheet.evaluate((element) => ({
      position: getComputedStyle(element).position,
      left: element.getBoundingClientRect().left,
      right: element.getBoundingClientRect().right,
      top: element.getBoundingClientRect().top,
      clientWidth: element.clientWidth,
      overflowX: getComputedStyle(element).overflowX,
      scrollWidth: element.scrollWidth,
      viewportWidth: window.innerWidth,
    }));
    const layers = await Promise.all([
      sidebarSheet.evaluate((element) =>
        Number(getComputedStyle(element).zIndex),
      ),
      sidebarOverlay.evaluate((element) =>
        Number(getComputedStyle(element).zIndex),
      ),
    ]);

    expect(dimensions.position).toBe("fixed");
    expect(layers[0]).toBeGreaterThan(layers[1]);
    expect(dimensions.top).toBe(0);
    expect(dimensions.left).toBeGreaterThanOrEqual(0);
    expect(dimensions.right).toBeLessThanOrEqual(dimensions.viewportWidth);
    expect(dimensions.clientWidth).toBeLessThanOrEqual(
      dimensions.viewportWidth,
    );
    expect(dimensions.scrollWidth).toBe(dimensions.clientWidth);
    expect(dimensions.overflowX).toBe("hidden");
  });

  for (const viewport of [
    { width: 375, height: 812 },
    { width: 768, height: 1024 },
    { width: 1440, height: 900 },
  ]) {
    test(`opens the profile from the sidebar at ${viewport.width}px`, async ({
      page,
    }) => {
      await page.setViewportSize(viewport);
      await page.goto("/");

      if (viewport.width < 1024) {
        await page.getByRole("button", { name: "باز کردن نوار کناری" }).click();
      }

      const sidebar =
        viewport.width < 1024
          ? page.locator('[data-slot="sheet-content"]')
          : page.locator("aside");
      await sidebar.locator('[data-slot="dropdown-menu-trigger"]').click();
      await page.getByRole("menuitem", { name: "مدیریت حساب" }).click();

      await expect(page).toHaveURL(/\/profile\/settings$/);
      const profileNav = page.getByRole("navigation", {
        name: "بخش‌های پروفایل",
      });
      await expect(
        profileNav.getByRole("link", { name: "کیف پول" }),
      ).toBeVisible();
      await expect(profileNav.locator('[aria-current="page"]')).toHaveText(
        "تنظیمات حساب",
      );
      expect(
        await profileNav.evaluate((nav) => nav.scrollWidth <= nav.clientWidth),
      ).toBe(true);
    });
  }

  test.describe("touch profile menu", () => {
    test.use({
      hasTouch: true,
      isMobile: true,
      viewport: { width: 375, height: 812 },
    });

    test("opens the profile with taps", async ({ page }) => {
      await page.goto("/");
      await page.getByRole("button", { name: "باز کردن نوار کناری" }).tap();

      const profileButton = page.locator(
        '[data-slot="sheet-content"] [data-slot="dropdown-menu-trigger"]',
      );
      await profileButton.tap();
      const profileMenu = page.locator('[data-slot="dropdown-menu-content"]');
      const sheet = page.locator('[data-slot="sheet-content"]');
      const [menuLayer, sheetLayer] = await Promise.all([
        profileMenu.evaluate((element) =>
          Number(getComputedStyle(element).zIndex),
        ),
        sheet.evaluate((element) => Number(getComputedStyle(element).zIndex)),
      ]);
      expect(menuLayer).toBeGreaterThan(sheetLayer);
      await page.getByRole("menuitem", { name: "مدیریت حساب" }).tap();

      await expect(page).toHaveURL(/\/profile\/settings$/);
    });
  });
});

async function mockApi(page: Page) {
  await page.route("https://widget.ila.chat/**", async (route) => {
    await route.fulfill({
      contentType: "application/javascript",
      body: "",
    });
  });

  await page.route("**/*", async (route) => {
    const request = route.request();
    const url = new URL(request.url());

    if (
      request.method() === "GET" &&
      url.pathname.startsWith("/api/v1/ai-registry/models")
    ) {
      await route.fallback();
      return;
    }

    if (
      request.method() === "GET" &&
      url.pathname === "/api/v1/user/get-info"
    ) {
      await route.fulfill({
        contentType: "application/json",
        body: JSON.stringify({ uuid: "user-1", mobile: "09120000000" }),
      });
      return;
    }

    if (
      request.method() === "GET" &&
      url.pathname === "/api/v1/wallet/wallet"
    ) {
      await route.fulfill({
        contentType: "application/json",
        body: JSON.stringify({
          wallet_uuid: "wallet-1",
          balance_usdmicro: 1_000_000,
        }),
      });
      return;
    }

    if (
      request.method() === "GET" &&
      url.pathname === "/api/v1/user/subscription/active"
    ) {
      await route.fulfill({
        contentType: "application/json",
        body: JSON.stringify({
          uuid: "subscription-1",
          plan: {
            uuid: "plan-1",
            name: "free",
            display_name: "Free",
            description: null,
            scopes: [],
            allowed_models: [],
            price_usdmicro: 0,
            duration_days: 0,
            balance_gift_amount_usdmicro: null,
            is_default: true,
            meta: {},
          },
        }),
      });
      return;
    }

    if (request.method() === "GET" && url.pathname === "/api/v1/ai-task/list") {
      await route.fulfill({
        contentType: "application/json",
        body: JSON.stringify({ items: [], has_next: false }),
      });
      return;
    }

    if (
      request.method() === "GET" &&
      url.pathname === "/api/v1/ai-task/events"
    ) {
      await route.fulfill({
        status: 200,
        contentType: "text/event-stream",
        body: "",
      });
      return;
    }

    if (url.pathname.startsWith("/api/")) {
      await route.fulfill({
        contentType: "application/json",
        body: JSON.stringify({ items: [], has_next: false }),
      });
      return;
    }

    await route.fallback();
  });
}
