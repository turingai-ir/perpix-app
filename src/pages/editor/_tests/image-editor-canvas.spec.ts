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
