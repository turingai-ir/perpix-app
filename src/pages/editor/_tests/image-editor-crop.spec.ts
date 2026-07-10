import { expect, test } from "@playwright/test";
import { openAuthenticatedEditor } from "./image-editor-test-setup";
import { draggableTestImage } from "./image-editor-test-image-fixtures";

test.describe("Image editor crop", () => {
  test.beforeEach(async ({ baseURL, context, page }) => {
    await openAuthenticatedEditor(page, context, baseURL);
    await page
      .getByLabel("انتخاب عکس از گالری یا دوربین")
      .setInputFiles(draggableTestImage);
  });

  test("opens the bottom image menu after selecting the image", async ({
    page,
  }) => {
    const canvas = page
      .getByRole("application", { name: "ویرایش تصویر" })
      .locator(".konvajs-content");
    await expect(canvas).toBeVisible();
    const canvasBounds = await canvas.boundingBox();
    expect(canvasBounds).not.toBeNull();
    await canvas.click({
      position: { x: canvasBounds!.width / 2, y: canvasBounds!.height / 2 },
    });

    await expect(
      page.getByRole("toolbar", { name: "ابزارهای تصویر" }),
    ).toBeVisible();
    await expect(page.getByRole("button", { name: "برش تصویر" })).toBeVisible();
  });

  test("keeps the full image visible while choosing and applying crop ratios", async ({
    page,
  }) => {
    const canvas = page
      .getByRole("application", { name: "ویرایش تصویر" })
      .locator(".konvajs-content");
    await expect(canvas).toBeVisible();
    const canvasBounds = await canvas.boundingBox();
    expect(canvasBounds).not.toBeNull();
    const imageCenterX = canvasBounds!.x + canvasBounds!.width / 2;
    const imageCenterY = canvasBounds!.y + canvasBounds!.height / 2;
    await page.mouse.move(imageCenterX, imageCenterY);
    await page.mouse.down();
    await page.mouse.move(imageCenterX + 30, imageCenterY);
    await page.mouse.up();
    await canvas.click({
      position: {
        x: canvasBounds!.width / 2 + 30,
        y: canvasBounds!.height / 2,
      },
    });
    await page.getByRole("button", { name: "برش تصویر" }).click();

    const cropToolbar = page.getByRole("toolbar", { name: "نسبت برش" });
    await expect(cropToolbar).toBeVisible();
    for (const ratio of ["FreeSize", "1:1", "3:4", "16:9", "4:3", "9:16"]) {
      await expect(
        cropToolbar.getByRole("button", { name: ratio }),
      ).toBeVisible();
    }

    await cropToolbar.getByRole("button", { name: "1:1" }).click();
    await expect(
      cropToolbar.getByRole("button", { name: "1:1" }),
    ).toHaveAttribute("aria-pressed", "true");
    await expect(page.getByTestId("crop-frame")).toHaveAttribute(
      "data-aspect-ratio",
      "1",
    );

    const imageCard = page.getByTestId("image-card");
    await expect(imageCard).toHaveAttribute("data-width", "120");
    await expect(imageCard).toHaveAttribute("data-height", "80");

    await page.getByRole("button", { name: "اعمال برش" }).click();
    await expect
      .poll(async () => {
        const width = Number(await imageCard.getAttribute("data-width"));
        const height = Number(await imageCard.getAttribute("data-height"));
        return Math.round(width / height);
      })
      .toBe(1);
  });

  test("allows dragging the crop handles to resize the crop area", async ({
    page,
  }) => {
    const canvas = page
      .getByRole("application", { name: "ویرایش تصویر" })
      .locator(".konvajs-content");
    await expect(canvas).toBeVisible();
    const canvasBounds = await canvas.boundingBox();
    expect(canvasBounds).not.toBeNull();

    await canvas.click({
      position: { x: canvasBounds!.width / 2, y: canvasBounds!.height / 2 },
    });
    await page.getByRole("button", { name: "برش تصویر" }).click();

    const imageCenterX = canvasBounds!.x + canvasBounds!.width / 2;
    const imageCenterY = canvasBounds!.y + canvasBounds!.height / 2;

    const handleX = imageCenterX + 60;
    const handleY = imageCenterY + 40;

    await page.mouse.move(handleX, handleY);
    await page.mouse.down();
    await page.mouse.move(imageCenterX + 30, imageCenterY + 20, { steps: 5 });
    await page.mouse.up();

    await page.getByRole("button", { name: "اعمال برش" }).click();

    const imageCard = page.getByTestId("image-card");
    const width = Number(await imageCard.getAttribute("data-width"));
    const height = Number(await imageCard.getAttribute("data-height"));
    expect(width).toBeLessThan(120);
    expect(height).toBeLessThan(80);
  });

  test("downloads the cropped image when clicking the save button", async ({
    page,
  }) => {
    const canvas = page
      .getByRole("application", { name: "ویرایش تصویر" })
      .locator(".konvajs-content");
    await expect(canvas).toBeVisible();
    const canvasBounds = await canvas.boundingBox();
    expect(canvasBounds).not.toBeNull();
    await canvas.click({
      position: { x: canvasBounds!.width / 2, y: canvasBounds!.height / 2 },
    });

    const header = page.getByRole("banner", { name: "منوی بالایی" });
    await expect(header).toBeVisible();

    const saveButton = header.getByRole("button", {
      name: "دانلود",
    });
    await expect(saveButton).toBeVisible();

    const downloadPromise = page.waitForEvent("download");
    await saveButton.click();
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toBe("cropped-image.png");
  });
});
