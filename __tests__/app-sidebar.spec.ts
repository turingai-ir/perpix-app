import { expect, type Page, test } from "@playwright/test";

test.describe("App sidebar", () => {
  test.beforeEach(async ({ baseURL, context, page }) => {
    await mockApi(page);
    await context.addCookies([
      { name: "access_token", value: "test-token", url: baseURL },
    ]);
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

  test("provides chat and Telegram support options", async ({ page }) => {
    await page.goto("/");

    await expect(
      page.getByRole("button", { name: "پشتیبانی چت" }),
    ).toBeVisible();

    const telegramSupportLink = page.getByRole("link", {
      name: "پشتیبانی تلگرام",
    });
    await expect(telegramSupportLink).toBeVisible();
    await expect(telegramSupportLink).toHaveAttribute(
      "href",
      "https://t.me/perpix_support_test",
    );
    await expect(telegramSupportLink).toHaveAttribute("target", "_blank");
  });

  test("visually separates the sidebar from the app content", async ({
    page,
  }) => {
    await page.goto("/");

    const sidebar = page.locator("aside");
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

  test("makes the home shortcuts keyboard-accessible links", async ({
    page,
  }) => {
    await page.goto("/");

    const homeShortcuts = page.locator(".card-spotlight");

    await expect(homeShortcuts).toHaveCount(3);
    await expect(homeShortcuts.nth(0).getByRole("link")).toHaveAttribute(
      "href",
      "/generation/image",
    );
    await expect(homeShortcuts.nth(1).getByRole("link")).toHaveAttribute(
      "href",
      "/generation/video",
    );
    await expect(homeShortcuts.nth(2).getByRole("link")).toHaveAttribute(
      "href",
      "/profile",
    );
  });

  test("identifies the active destination and labels the sidebar control", async ({
    page,
  }) => {
    await page.goto("/generation/image");

    await expect(
      page.locator("aside").getByRole("link", { name: "تولید عکس" }),
    ).toHaveAttribute("aria-current", "page");
    await expect(
      page.getByRole("button", { name: "بستن نوار کناری" }),
    ).toHaveAttribute("aria-expanded", "true");
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

    if (request.method() === "GET" && url.pathname === "/user/get-info") {
      await route.fulfill({
        contentType: "application/json",
        body: JSON.stringify({ uuid: "user-1", mobile: "09120000000" }),
      });
      return;
    }

    if (request.method() === "GET" && url.pathname === "/wallet/wallet") {
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
      url.pathname === "/user/subscription/active"
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

    if (request.method() === "GET" && url.pathname === "/ai-task/list") {
      await route.fulfill({
        contentType: "application/json",
        body: JSON.stringify({ items: [], has_next: false }),
      });
      return;
    }

    await route.fallback();
  });
}
