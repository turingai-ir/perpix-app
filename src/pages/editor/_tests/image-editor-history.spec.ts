import { expect, test } from "@playwright/test";
import { openAuthenticatedEditor } from "./image-editor-test-setup";
import { draggableTestImage } from "./image-editor-test-image-fixtures";

test.describe("Image editor history", () => {
  test("restores an applied crop with undo and reapplies it with redo", async ({
    baseURL,
    context,
    page,
  }) => {
    await openAuthenticatedEditor(page, context, baseURL);
    await page
      .getByLabel("انتخاب عکس از گالری یا دوربین")
      .setInputFiles(draggableTestImage);

    const canvas = page.locator(".konvajs-content");
    await canvas.click({ position: { x: 640, y: 360 } });
    await page.getByRole("button", { name: "برش تصویر" }).click();
    await page
      .getByRole("toolbar", { name: "نسبت برش" })
      .getByRole("button", { name: "1:1" })
      .click();
    await page.getByRole("button", { name: "اعمال برش" }).click();

    const imageCard = page.getByTestId("image-card");
    await expect(imageCard).toHaveAttribute("data-width", "80");
    await page.getByRole("button", { name: "بازگردانی" }).click();
    await expect(imageCard).toHaveAttribute("data-width", "120");
    await page.getByRole("button", { name: "انجام دوباره" }).click();
    await expect(imageCard).toHaveAttribute("data-width", "80");
  });
});
