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
    const imageX = canvasBounds!.width / 2 - 60;
    const imageY = canvasBounds!.height / 2 - 40;

    await page.mouse.move(
      canvasBounds!.x + imageX + 60,
      canvasBounds!.y + imageY + 40,
    );
    await page.mouse.down();
    await page.mouse.move(
      canvasBounds!.x + imageX + 110,
      canvasBounds!.y + imageY + 40,
    );
    await page.mouse.up();

    const sceneCanvas = canvasContainer.locator("canvas").first();
    await expect
      .poll(() => readCheckerboardColors(sceneCanvas, imageX, imageY + 40))
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
    const centerX = canvasBounds!.width / 2;
    const centerY = canvasBounds!.height / 2;

    await page.mouse.move(canvasBounds!.x + centerX, canvasBounds!.y + centerY);
    await page.mouse.down();
    await page.mouse.move(
      canvasBounds!.x + centerX + 80,
      canvasBounds!.y + centerY,
    );
    await page.mouse.move(canvasBounds!.x + centerX, canvasBounds!.y + centerY);

    await expect
      .poll(() =>
        readCenterGuideVisibility(
          canvasContainer.locator("canvas").first(),
          centerX,
          centerY,
        ),
      )
      .toEqual({
        hasHorizontalGuide: true,
        hasVerticalGuide: true,
      });
    await page.mouse.up();
  });
});

async function readCheckerboardColors(
  canvas: import("@playwright/test").Locator,
  x: number,
  y: number,
): Promise<{ hasDarkSquares: boolean; hasLightSquares: boolean }> {
  return canvas.evaluate(
    (element, position) => {
      const pixelScale = element.width / element.clientWidth;
      const pixels = element
        .getContext("2d")
        ?.getImageData(
          Math.round(position.x * pixelScale),
          Math.round(position.y * pixelScale),
          Math.round(48 * pixelScale),
          Math.max(1, Math.round(pixelScale)),
        ).data;
      const redValues = new Set<number>();
      for (let index = 0; index < (pixels?.length ?? 0); index += 4) {
        redValues.add(pixels?.[index] ?? 0);
      }
      return {
        hasDarkSquares: redValues.has(212),
        hasLightSquares: redValues.has(245),
      };
    },
    { x, y },
  );
}

async function readCenterGuideVisibility(
  canvas: import("@playwright/test").Locator,
  centerX: number,
  centerY: number,
): Promise<{ hasHorizontalGuide: boolean; hasVerticalGuide: boolean }> {
  return canvas.evaluate(
    (element, center) => {
      const context = element.getContext("2d");
      const pixelScale = element.width / element.clientWidth;
      const getPixels = (x: number, y: number, width: number, height: number) =>
        context?.getImageData(
          Math.round(x * pixelScale),
          Math.round(y * pixelScale),
          Math.round(width * pixelScale),
          Math.round(height * pixelScale),
        ).data;
      const verticalGuide = getPixels(center.x - 2, 20, 5, 1);
      const horizontalGuide = getPixels(20, center.y - 2, 1, 5);
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
        hasHorizontalGuide: containsGuideColor(horizontalGuide),
        hasVerticalGuide: containsGuideColor(verticalGuide),
      };
    },
    { x: centerX, y: centerY },
  );
}
