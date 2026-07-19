import { expect, test } from "@playwright/test";
import { openAuthenticatedEditor } from "./image-editor-test-setup";
import { testImageBase64 } from "./image-editor-test-image-fixtures";

test.describe("Image editor ruler and grid settings", () => {
  test.beforeEach(async ({ baseURL, context, page }) => {
    await openAuthenticatedEditor(page, context, baseURL);
    // Upload a test image first to reveal the header and canvas workspace
    const fileInput = page.getByLabel("انتخاب عکس از گالری یا دوربین");
    await expect(fileInput).toBeAttached();
    await fileInput.setInputFiles({
      name: "test.png",
      mimeType: "image/png",
      buffer: Buffer.from(testImageBase64, "base64"),
    });
    await expect(
      page.getByRole("application", { name: "ویرایش تصویر" }),
    ).toBeVisible();
  });

  test("renders ruler and grid toggle buttons in the header with default active states", async ({
    page,
  }) => {
    const rulerBtn = page.getByRole("button", { name: "نمایش خط‌کش" });
    const gridBtn = page.getByRole("button", { name: "نمایش شبکه" });

    await expect(rulerBtn).toBeVisible();
    await expect(gridBtn).toBeVisible();

    await expect(rulerBtn).toHaveAttribute("aria-pressed", "true");
    await expect(gridBtn).toHaveAttribute("aria-pressed", "true");
  });

  test("toggles ruler and grid visibility and persists state in localStorage", async ({
    page,
  }) => {
    const rulerBtn = page.getByRole("button", { name: "نمایش خط‌کش" });
    const gridBtn = page.getByRole("button", { name: "نمایش شبکه" });

    // Toggle off Ruler
    await rulerBtn.click();
    await expect(rulerBtn).toHaveAttribute("aria-pressed", "false");
    let settings = await page.evaluate(() => {
      const item = localStorage.getItem("editor-settings");
      return item ? JSON.parse(item) : null;
    });
    expect(settings?.showRuler).toBe(false);

    // Toggle off Grid
    await gridBtn.click();
    await expect(gridBtn).toHaveAttribute("aria-pressed", "false");
    settings = await page.evaluate(() => {
      const item = localStorage.getItem("editor-settings");
      return item ? JSON.parse(item) : null;
    });
    expect(settings?.showGrid).toBe(false);

    // Toggle back on Ruler
    await rulerBtn.click();
    await expect(rulerBtn).toHaveAttribute("aria-pressed", "true");
    settings = await page.evaluate(() => {
      const item = localStorage.getItem("editor-settings");
      return item ? JSON.parse(item) : null;
    });
    expect(settings?.showRuler).toBe(true);
  });
});
