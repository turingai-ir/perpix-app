import { expect, test } from "@playwright/test";
import { openAuthenticatedEditor } from "./image-editor-test-setup";
import { draggableTestImage } from "./image-editor-test-image-fixtures";

test.describe("Image editor fullscreen layer", () => {
  test.beforeEach(async ({ baseURL, context, page }) => {
    await openAuthenticatedEditor(page, context, baseURL);
    await page
      .getByLabel("انتخاب عکس از گالری یا دوربین")
      .setInputFiles(draggableTestImage);
  });

  test("renders a fullscreen layer with an image-sized checkerboard card", async ({
    page,
  }) => {
    const workspace = page.getByRole("application", { name: "ویرایش تصویر" });
    const layer = workspace.locator(".konvajs-content");
    await expect(layer).toBeVisible();

    const workspaceBounds = await workspace.boundingBox();
    const layerBounds = await layer.boundingBox();
    expect(layerBounds?.width).toBe(workspaceBounds?.width);
    expect(layerBounds?.height).toBe(workspaceBounds?.height);

    const card = page.getByTestId("image-card");
    await expect(card).toHaveAttribute("data-width", "120");
    await expect(card).toHaveAttribute("data-height", "80");
  });

  test("keeps a moved image in place when crop starts", async ({ page }) => {
    const layer = page
      .getByRole("application", { name: "ویرایش تصویر" })
      .locator(".konvajs-content");
    const layerBounds = await layer.boundingBox();
    expect(layerBounds).not.toBeNull();
    const initialX = layerBounds!.width / 2 - 60;
    const initialY = layerBounds!.height / 2 - 40;

    await page.mouse.move(
      layerBounds!.x + initialX + 60,
      layerBounds!.y + initialY + 40,
    );
    await page.mouse.down();
    await page.mouse.move(
      layerBounds!.x + initialX + 100,
      layerBounds!.y + initialY + 40,
    );
    await page.mouse.up();
    await layer.click({ position: { x: initialX + 100, y: initialY + 40 } });
    await page.getByRole("button", { name: "برش تصویر" }).click();

    await expect(page.getByTestId("crop-frame")).toHaveAttribute(
      "data-x",
      String(initialX + 40),
    );
  });

  test("prevents the image from leaving the fullscreen layer", async ({
    page,
  }) => {
    const layer = page
      .getByRole("application", { name: "ویرایش تصویر" })
      .locator(".konvajs-content");
    const bounds = await layer.boundingBox();
    expect(bounds).not.toBeNull();

    await page.mouse.move(
      bounds!.x + bounds!.width / 2,
      bounds!.y + bounds!.height / 2,
    );
    await page.mouse.down();
    await page.mouse.move(bounds!.x + 10, bounds!.y + bounds!.height / 2);
    await page.mouse.up();
    await layer.click({ position: { x: 60, y: bounds!.height / 2 } });
    await page.getByRole("button", { name: "برش تصویر" }).click();

    await expect(page.getByTestId("crop-frame")).toHaveAttribute("data-x", "0");
  });

  test("clips overflow until the hidden part of the image is selected", async ({
    page,
  }) => {
    const layer = page
      .getByRole("application", { name: "ویرایش تصویر" })
      .locator(".konvajs-content");
    const bounds = await layer.boundingBox();
    expect(bounds).not.toBeNull();
    const centerX = bounds!.width / 2;
    const centerY = bounds!.height / 2;
    const cardRight = centerX + 60;

    await page.mouse.move(bounds!.x + centerX, bounds!.y + centerY);
    await page.mouse.down();
    await page.mouse.move(bounds!.x + centerX + 50, bounds!.y + centerY);
    await page.mouse.up();
    await layer.click({ position: { x: 10, y: 10 } });

    const sceneCanvas = layer.locator("canvas").first();
    await expect
      .poll(() => readPixelRed(sceneCanvas, cardRight + 25, centerY))
      .not.toBe(255);
    await expect(
      page.getByRole("toolbar", { name: "ابزارهای تصویر" }),
    ).toBeHidden();

    await layer.click({ position: { x: cardRight + 25, y: centerY } });
    await expect
      .poll(() => readPixelRed(sceneCanvas, cardRight + 25, centerY))
      .toBe(255);
    await expect(
      page.getByRole("toolbar", { name: "ابزارهای تصویر" }),
    ).toBeVisible();
  });

  test("preserves the image position relative to the card after viewport resize", async ({
    page,
  }) => {
    const layer = page
      .getByRole("application", { name: "ویرایش تصویر" })
      .locator(".konvajs-content");
    const bounds = await layer.boundingBox();
    expect(bounds).not.toBeNull();

    await page.mouse.move(
      bounds!.x + bounds!.width / 2,
      bounds!.y + bounds!.height / 2,
    );
    await page.mouse.down();
    await page.mouse.move(
      bounds!.x + bounds!.width / 2 + 40,
      bounds!.y + bounds!.height / 2,
    );
    await page.mouse.up();

    await page.setViewportSize({ width: 640, height: 480 });
    await page.getByRole("button", { name: "برش تصویر" }).click();

    await expect(page.getByTestId("crop-frame")).toHaveAttribute(
      "data-x",
      "300",
    );
  });
});

async function readPixelRed(
  canvas: import("@playwright/test").Locator,
  x: number,
  y: number,
): Promise<number> {
  return canvas.evaluate(
    (element, point) => {
      const scale = element.width / element.clientWidth;
      return (
        element
          .getContext("2d")
          ?.getImageData(point.x * scale, point.y * scale, 1, 1).data[0] ?? 0
      );
    },
    { x, y },
  );
}
