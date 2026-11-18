import { expect, test } from "@playwright/test";
import { openAuthenticatedEditor } from "./image-editor-test-setup";

test.describe("Image editor navigation", () => {
  test.beforeEach(async ({ page }) => {
    await openAuthenticatedEditor(page);
  });

  test("returns home when the editor has no previous route", async ({
    page,
  }) => {
    await page.getByRole("button", { name: "بازگشت" }).click();
    await expect(page).toHaveURL("/");
  });

  test("returns to the previous route when route history exists", async ({
    page,
  }) => {
    await page.goto("/gallery");
    await page.getByRole("link", { name: /ویرایشگر تصویر/ }).click();
    await expect(page).toHaveURL("/editor");

    await page.getByRole("button", { name: "بازگشت" }).click();
    await expect(page).toHaveURL("/gallery");
  });
});
