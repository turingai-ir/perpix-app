import { expect } from "@playwright/test";
import { test } from "./fixtures/image-settings";

test("recovers from an unreadable remote editor image", async ({ page, baseURL }) => {
  await page.route("**/file-manager/files/presigned-urls", (route) =>
    route.fulfill({
      json: {
        files: [{
          file_uuid: "broken-image",
          preview_url: `${baseURL}/broken-editor-image.png`,
          download_url: `${baseURL}/broken-editor-image.png`,
        }],
      },
    }),
  );
  await page.route("**/broken-editor-image.png", (route) =>
    route.fulfill({ status: 404, contentType: "text/html", body: "Image expired" }),
  );

  await page.goto("/editor/broken-image");
  await expect(page.getByRole("button", { name: "بازگشت", exact: true })).toBeVisible();
  await page.getByRole("button", { name: "بازگشت", exact: true }).click();
  await expect(page).toHaveURL(/\/editor$/);
  await expect(page.locator('input[type="file"]')).toBeAttached();
});

test("recovers from an unreadable local editor image", async ({ page }) => {
  await page.goto("/editor");
  await page.locator('input[type="file"]').setInputFiles({
    name: "broken.png",
    mimeType: "image/png",
    buffer: Buffer.from("Invalid PNG contents"),
  });
  await expect(page.getByRole("button", { name: "بازگشت", exact: true })).toBeVisible();
  await page.getByRole("button", { name: "بازگشت", exact: true }).click();
  await expect(page.locator('input[type="file"]')).toBeAttached();
});
