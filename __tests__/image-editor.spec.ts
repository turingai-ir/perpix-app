import { test, expect } from "@playwright/test";

const testImageBase64 =
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==";

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
      buffer: Buffer.from(testImageBase64, "base64"),
    });

    await expect(page.locator("text=تغییر عکس")).toBeVisible();
    await expect(page.locator("text=برش تصویر")).toBeVisible();
    await expect(page.locator(".konvajs-content")).toBeAttached();
  });

  test("should return to home when uploader has no previous route", async ({
    page,
  }) => {
    await page.getByRole("button", { name: "بازگشت" }).click();

    await expect(page).toHaveURL("/");
  });

  test("should return to previous route when uploader has route history", async ({
    page,
  }) => {
    await page.goto("/gallery");
    await page.getByRole("link", { name: /ویرایشگر تصویر/ }).click();

    await expect(page).toHaveURL("/editor");

    await page.getByRole("button", { name: "بازگشت" }).click();

    await expect(page).toHaveURL("/gallery");
  });

  test("should switch between edit panels and cancel back", async ({
    page,
  }) => {
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles({
      name: "test.png",
      mimeType: "image/png",
      buffer: Buffer.from(testImageBase64, "base64"),
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
      buffer: Buffer.from(testImageBase64, "base64"),
    });

    await page.click("text=فیلترها");
    await expect(page.locator("text=روشنایی")).toBeVisible();
    await page.click("text=رنگی و پایه");
    await page.click("text=سیاه و سفید");
    await page.locator("button:has(.lucide-check)").click();
    await expect(page.locator("text=فیلترها")).toBeVisible();
  });

  test("should load image workspace when accessed via router with fileUuid", async ({
    baseURL,
    page,
  }) => {
    await page.addInitScript(() => {
      window.localStorage.setItem("editorObjectUrlCalls", "0");
      const originalCreateObjectUrl = URL.createObjectURL.bind(URL);
      URL.createObjectURL = (object: Blob | MediaSource) => {
        const currentCalls = Number(
          window.localStorage.getItem("editorObjectUrlCalls") ?? "0",
        );
        window.localStorage.setItem(
          "editorObjectUrlCalls",
          String(currentCalls + 1),
        );
        return originalCreateObjectUrl(object);
      };
    });

    await page.route("**/file-manager/files/presigned-urls", async (route) => {
      await route.fulfill({
        contentType: "application/json",
        status: 200,
        body: JSON.stringify({
          files: [
            {
              file_uuid: "test-uuid",
              preview_url: `${baseURL}/preview-editor-image.png`,
              download_url: `${baseURL}/download-editor-image.png`,
            },
          ],
        }),
      });
    });

    await page.route("**/download-editor-image.png", async (route) => {
      await route.fulfill({
        contentType: "image/png",
        status: 200,
        body: Buffer.from(testImageBase64, "base64"),
      });
    });
    await page.route("**/preview-editor-image.png", async (route) => {
      await route.abort("failed");
    });

    await page.goto("/editor/test-uuid", { waitUntil: "domcontentloaded" });

    await expect(page.locator("text=تغییر عکس")).toBeVisible();
    await expect(page.locator("text=برش تصویر")).toBeVisible();
    await expect(page.locator(".konvajs-content")).toBeAttached();
    await expect
      .poll(() => page.evaluate(() => localStorage.editorObjectUrlCalls))
      .toBe("0");
  });

  test("should show loading while remote editor image downloads", async ({
    baseURL,
    page,
  }) => {
    await page.route("**/file-manager/files/presigned-urls", async (route) => {
      await route.fulfill({
        contentType: "application/json",
        status: 200,
        body: JSON.stringify({
          files: [
            {
              file_uuid: "test-uuid",
              preview_url: `${baseURL}/slow-editor-image.png`,
              download_url: `${baseURL}/slow-editor-image.png`,
            },
          ],
        }),
      });
    });

    await page.route("**/slow-editor-image.png", async (route) => {
      await new Promise((resolve) => setTimeout(resolve, 500));
      await route.fulfill({
        contentType: "image/png",
        status: 200,
        body: Buffer.from(testImageBase64, "base64"),
      });
    });

    await page.goto("/editor/test-uuid");

    await expect(page.getByText("در حال دریافت تصویر...")).toBeVisible();
    await expect(page.getByRole("heading")).toBeHidden();
    await expect(page.locator(".konvajs-content")).toBeAttached();
  });
});
