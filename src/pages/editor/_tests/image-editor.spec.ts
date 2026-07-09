import { test, expect } from "@playwright/test";

test.describe("Image Editor E2E Tests", () => {
  test.beforeEach(async ({ baseURL, context, page }) => {
    await page.route("**/user/get-info", async (route) => {
      await route.fulfill({
        contentType: "application/json",
        status: 200,
        body: JSON.stringify({
          uuid: "123",
          email: "test@example.com",
          wallet_balance: 100000,
        }),
      });
    });

    await page.route("**/ai-task/list", async (route) => {
      await route.fulfill({
        contentType: "application/json",
        status: 200,
        body: JSON.stringify({ items: [] }),
      });
    });

    await page.route("**/ai-task/events-stream", async (route) => {
      await route.fulfill({
        contentType: "text/event-stream",
        status: 200,
        body: "",
      });
    });

    await context.addCookies([
      { name: "access_token", value: "test-token", url: baseURL },
    ]);
    await page.goto("/editor");
  });

  test("should display uploader and load image workspace on upload", async ({
    page,
  }) => {
    await expect(page.locator("h1")).toContainText("ویرایشگر هوشمند تصویر");
    const fileInput = page.locator('input[type="file"]');
    await expect(fileInput).toBeAttached();

    await fileInput.setInputFiles({
      name: "test.png",
      mimeType: "image/png",
      buffer: Buffer.from(
        "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
        "base64",
      ),
    });

    await expect(page.locator("text=تغییر عکس")).toBeVisible();
    await expect(page.locator("text=برش تصویر")).toBeVisible();
    await expect(page.locator(".konvajs-content")).toBeAttached();
  });

  test("should switch between edit panels and cancel back", async ({
    page,
  }) => {
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles({
      name: "test.png",
      mimeType: "image/png",
      buffer: Buffer.from(
        "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
        "base64",
      ),
    });

    // Crop Panel
    await page.click("text=برش تصویر");
    await expect(page.locator("text=برش تصویر").first()).toBeVisible();
    await page.locator("button:has(.lucide-x)").click();

    // Resize Panel
    await page.click("text=تغییر اندازه");
    await expect(page.locator("text=عرض (پیکسل)")).toBeVisible();
    await page.locator("button:has(.lucide-x)").click();

    // Filters Panel
    await page.click("text=فیلترها");
    await expect(page.locator("text=روشنایی")).toBeVisible();
    await page.locator("button:has(.lucide-x)").click();
    await expect(page.locator("text=فیلترها")).toBeVisible();
  });

  test("should allow applying filter presets", async ({ page }) => {
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles({
      name: "test.png",
      mimeType: "image/png",
      buffer: Buffer.from(
        "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
        "base64",
      ),
    });

    await page.click("text=فیلترها");
    await expect(page.locator("text=روشنایی")).toBeVisible();
    await page.click("text=رنگی و پایه");
    await page.click("text=سیاه و سفید");
    await page.locator("button:has(.lucide-check)").click();
    await expect(page.locator("text=فیلترها")).toBeVisible();
  });
});
