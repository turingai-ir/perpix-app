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
