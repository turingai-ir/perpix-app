import { expect, test } from "./fixtures/image-settings";

const viewports = [
  { width: 375, height: 812 },
  { width: 812, height: 375 },
  { width: 768, height: 1024 },
  { width: 1440, height: 900 },
];

for (const viewport of viewports) {
  test(`image controls and hero stay balanced at ${viewport.width}x${viewport.height}`, async ({
    page,
  }) => {
    await page.setViewportSize(viewport);
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/generation/image");
    await expect(
      page.getByRole("combobox").filter({ hasText: "Nano Banana" }),
    ).toBeVisible();
    await page.evaluate(() => document.fonts.ready);
    const intro = page.locator("[data-generation-intro]");
    const stage = page.getByTestId("studio-logo");
    const logo = await stage.locator("img").boundingBox();
    const badge = await intro.locator(":scope > span").boundingBox();
    expect(logo).not.toBeNull();
    expect(badge).not.toBeNull();
    expect(logo!.y + logo!.height).toBeLessThanOrEqual(badge!.y);
    expect(
      await stage.evaluate((element) => {
        const pageElement = element.parentElement?.parentElement;
        const pageBounds = pageElement?.getBoundingClientRect();
        const stageBounds = element.getBoundingClientRect();
        return (
          pageBounds !== undefined &&
          Math.abs(stageBounds.left - pageBounds.left) < 1 &&
          Math.abs(stageBounds.top - pageBounds.top) < 1 &&
          Math.abs(stageBounds.width - pageBounds.width) < 1 &&
          Math.abs(stageBounds.height - pageBounds.height) < 1
        );
      }),
    ).toBe(true);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);

    if (viewport.width < 900) {
      const ratio = await page
        .getByRole("combobox", { name: "قاب تصویر" })
        .boundingBox();
      const resolution = await page
        .getByRole("combobox", { name: "وضوح تصویر" })
        .boundingBox();
      expect(ratio).not.toBeNull();
      expect(resolution).not.toBeNull();
      expect(Math.abs(ratio!.y - resolution!.y)).toBeLessThan(1);
      expect(Math.abs(ratio!.width - resolution!.width)).toBeLessThan(1);
      const fieldWidth = await page
        .getByRole("combobox", { name: "قاب تصویر" })
        .evaluate(
          (button) => button.parentElement!.getBoundingClientRect().width,
        );
      expect(Math.abs(ratio!.width - fieldWidth)).toBeLessThan(1);
      expect(ratio!.height).toBeGreaterThanOrEqual(44);
      const settings = await page
        .getByRole("button", { name: /^تنظیمات تصویر/ })
        .boundingBox();
      expect(settings!.y).toBeGreaterThanOrEqual(ratio!.y + ratio!.height);
      expect(settings!.width).toBeGreaterThan(ratio!.width);
    }
    await page.screenshot({
      path: test.info().outputPath("image-layout.png"),
      fullPage: true,
    });
  });
}
