import { expect, test } from "@playwright/test";
import { openAuthenticatedEditor } from "./image-editor-test-setup";
import { testImageBase64 } from "./image-editor-test-image-fixtures";

test.describe("Image editor zoom and pan", () => {
  test.beforeEach(async ({ baseURL, context, page }) => {
    await openAuthenticatedEditor(page, context, baseURL);
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

  test("renders zoom controls and performs zoom in/out/reset in the header", async ({
    page,
  }) => {
    const zoomTextButton = page.getByRole("button", { name: "بازنشانی زوم" });
    await expect(zoomTextButton).toBeVisible();
    await expect(zoomTextButton).toHaveText("100%");

    // Click zoom in
    const zoomInButton = page.getByRole("button", { name: "بزرگنمایی" });
    await zoomInButton.click();
    await expect(zoomTextButton).toHaveText("120%");

    // Click zoom out
    const zoomOutButton = page.getByRole("button", { name: "کوچک‌نمایی" });
    await zoomOutButton.click();
    await expect(zoomTextButton).toHaveText("100%");

    // Zoom out further
    await zoomOutButton.click();
    await expect(zoomTextButton).toHaveText("83%");

    // Reset zoom
    await zoomTextButton.click();
    await expect(zoomTextButton).toHaveText("100%");
  });
});
