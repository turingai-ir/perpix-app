import { expect, test } from "@playwright/test";
import { openAuthenticatedEditor } from "./image-editor-test-setup";
import {
  draggableTestImage,
  testImageBase64,
} from "./image-editor-test-image-fixtures";

test.describe("Image editor canvas", () => {
  test.beforeEach(async ({ baseURL, context, page }) => {
    await openAuthenticatedEditor(page, context, baseURL);
  });

  test("loads the image workspace after upload", async ({ page }) => {
    await expect(page.getByRole("heading")).toContainText(
      "ویرایشگر هوشمند تصویر",
    );
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

  test("reveals the checkerboard background after dragging", async ({
    page,
  }) => {
    await page
      .getByLabel("انتخاب عکس از گالری یا دوربین")
      .setInputFiles(draggableTestImage);
    const workspace = page.getByRole("application", { name: "ویرایش تصویر" });
    const canvasContainer = workspace.locator(".konvajs-content");
    await expect(canvasContainer).toBeVisible();

    const canvasBounds = await canvasContainer.boundingBox();
    expect(canvasBounds).not.toBeNull();
    expect(canvasBounds?.width).toBe(120);
    expect(canvasBounds?.height).toBe(80);

    await page.mouse.move(canvasBounds!.x + 60, canvasBounds!.y + 40);
    await page.mouse.down();
    await page.mouse.move(canvasBounds!.x + 110, canvasBounds!.y + 40);
    await page.mouse.up();

    const sceneCanvas = canvasContainer.locator("canvas").first();
    await expect
      .poll(() => readCheckerboardColors(sceneCanvas))
      .toEqual({
        hasDarkSquares: true,
        hasLightSquares: true,
      });
  });

  test("snaps to canvas edges and displays alignment guides", async ({
    page,
  }) => {
    await page
      .getByLabel("انتخاب عکس از گالری یا دوربین")
      .setInputFiles(draggableTestImage);
    const canvasContainer = page
      .getByRole("application", { name: "ویرایش تصویر" })
      .locator(".konvajs-content");
    await expect(canvasContainer).toBeVisible();

    const canvasBounds = await canvasContainer.boundingBox();
    expect(canvasBounds).not.toBeNull();

    await page.mouse.move(canvasBounds!.x + 60, canvasBounds!.y + 40);
    await page.mouse.down();
    await page.mouse.move(canvasBounds!.x + 110, canvasBounds!.y + 40);
    await page.mouse.up();

    await page.mouse.move(canvasBounds!.x + 80, canvasBounds!.y + 40);
    await page.mouse.down();
    await page.mouse.move(canvasBounds!.x + 34, canvasBounds!.y + 40);

    await expect
      .poll(() =>
        readAlignmentGuideVisibility(canvasContainer.locator("canvas").first()),
      )
      .toEqual({
        hasHorizontalCenterGuide: true,
        hasHorizontalGuide: true,
        hasVerticalCenterGuide: true,
        hasVerticalGuide: true,
      });
    await page.mouse.up();
    await expect
      .poll(() =>
        isImageVisibleAtLeftEdge(canvasContainer.locator("canvas").first()),
      )
      .toBe(true);
  });
});

async function readCheckerboardColors(
  canvas: import("@playwright/test").Locator,
): Promise<{ hasDarkSquares: boolean; hasLightSquares: boolean }> {
  return canvas.evaluate((element) => {
    const pixels = element.getContext("2d")?.getImageData(0, 40, 48, 1).data;
    const redValues = new Set<number>();
    for (let index = 0; index < 48; index += 1) {
      redValues.add(pixels?.[index * 4] ?? 0);
    }
    return {
      hasDarkSquares: redValues.has(212),
      hasLightSquares: redValues.has(245),
    };
  });
}

async function isImageVisibleAtLeftEdge(
  canvas: import("@playwright/test").Locator,
): Promise<boolean> {
  return canvas.evaluate((element) => {
    const color = element.getContext("2d")?.getImageData(2, 40, 1, 1).data;
    return color?.[0] === 255 && color[1] === 0 && color[2] === 0;
  });
}

async function readAlignmentGuideVisibility(
  canvas: import("@playwright/test").Locator,
): Promise<{
  hasHorizontalCenterGuide: boolean;
  hasHorizontalGuide: boolean;
  hasVerticalCenterGuide: boolean;
  hasVerticalGuide: boolean;
}> {
  return canvas.evaluate((element) => {
    const context = element.getContext("2d");
    const pixelScale = element.width / element.clientWidth;
    const getPixels = (x: number, y: number, width: number, height: number) =>
      context?.getImageData(
        Math.round(x * pixelScale),
        Math.round(y * pixelScale),
        Math.round(width * pixelScale),
        Math.round(height * pixelScale),
      ).data;
    const verticalGuide = getPixels(0, 40, 5, 1);
    const horizontalGuide = getPixels(60, 0, 1, 5);
    const verticalCenterGuide = getPixels(58, 20, 5, 1);
    const horizontalCenterGuide = getPixels(30, 38, 1, 5);
    const containsGuideColor = (colors: Uint8ClampedArray | undefined) => {
      if (!colors) return false;

      for (let index = 0; index < colors.length; index += 4) {
        if (
          colors[index] === 59 &&
          colors[index + 1] === 130 &&
          colors[index + 2] === 246
        ) {
          return true;
        }
      }
      return false;
    };
    return {
      hasHorizontalCenterGuide: containsGuideColor(horizontalCenterGuide),
      hasHorizontalGuide: containsGuideColor(horizontalGuide),
      hasVerticalCenterGuide: containsGuideColor(verticalCenterGuide),
      hasVerticalGuide: containsGuideColor(verticalGuide),
    };
  });
}
