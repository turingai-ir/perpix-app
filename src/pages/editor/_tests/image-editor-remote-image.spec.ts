import { expect, test } from "@playwright/test";
import { openAuthenticatedEditor } from "./image-editor-test-setup";
import { testImageBase64 } from "./image-editor-test-image-fixtures";

test.describe("Image editor remote source", () => {
  test.beforeEach(async ({ baseURL, context, page }) => {
    await openAuthenticatedEditor(page, context, baseURL);
  });

  test("loads the workspace from a file UUID without an object URL", async ({
    baseURL,
    page,
  }) => {
    await page.addInitScript(() => {
      window.localStorage.setItem("editorObjectUrlCalls", "0");
      const originalCreateObjectUrl = URL.createObjectURL.bind(URL);
      URL.createObjectURL = (object: Blob | MediaSource) => {
        const currentCalls = Number(localStorage.editorObjectUrlCalls ?? "0");
        localStorage.editorObjectUrlCalls = String(currentCalls + 1);
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
    await page.route("**/preview-editor-image.png", (route) =>
      route.abort("failed"),
    );

    await page.goto("/editor/test-uuid", { waitUntil: "domcontentloaded" });
    await expect(
      page.getByRole("application", { name: "ویرایش تصویر" }),
    ).toBeVisible();
    await expect
      .poll(() => page.evaluate(() => localStorage.editorObjectUrlCalls))
      .toBe("0");
  });

  test("shows loading while the remote image downloads", async ({
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
    await expect(
      page.getByRole("application", { name: "ویرایش تصویر" }),
    ).toBeVisible();
  });
});
