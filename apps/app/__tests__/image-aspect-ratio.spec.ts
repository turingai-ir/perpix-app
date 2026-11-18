import { expect, test } from "./fixtures/image-settings";

test.use({
  aspectRatios: [
    "1:1",
    "21:9",
    "9:21",
    "16:9",
    "9:16",
    "4:3",
    "3:4",
    "3:2",
    "2:3",
  ],
});

for (const viewport of [
  { width: 375, height: 812 },
  { width: 360, height: 640 },
  { width: 812, height: 375 },
  { width: 768, height: 1024 },
  { width: 1440, height: 900 },
]) {
  test(`aspect ratio menu stays reachable at ${viewport.width}x${viewport.height}`, async ({
    page,
  }) => {
    await page.setViewportSize(viewport);
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/generation/image");
    const trigger = page.getByRole("combobox", { name: "قاب تصویر" });
    await expect(trigger).toBeVisible();
    await page.evaluate(() => document.fonts.ready);
    await trigger.scrollIntoViewIfNeeded();
    await trigger.evaluate((element) => {
      window.scrollBy(0, element.getBoundingClientRect().top - innerHeight / 2);
    });
    await trigger.click();

    const popup = page.locator('[data-slot="popover-content"]');
    await expect(popup).toBeVisible();
    await expect
      .poll(async () => {
        const box = await popup.boundingBox();
        return (
          !!box &&
          box.x >= 8 &&
          box.y >= 8 &&
          box.x + box.width <= viewport.width - 8 &&
          box.y + box.height <= viewport.height - 8
        );
      })
      .toBe(true);
    await expect(popup.getByText("قاب تصویر", { exact: true })).toBeInViewport({
      ratio: 1,
    });
    const first = popup.getByRole("button", { name: "1:1", exact: true });
    await expect(first).toBeInViewport({ ratio: 1 });
    expect((await first.boundingBox())!.height).toBeGreaterThanOrEqual(44);
    await page.screenshot({ path: test.info().outputPath("ratio-menu.png") });

    const last = popup.getByRole("button", { name: "2:3", exact: true });
    await last.scrollIntoViewIfNeeded();
    await expect(last).toBeInViewport({ ratio: 1 });
    await last.click();
    await expect(popup).toBeHidden();
    await expect(trigger).toContainText("2:3");
    await trigger.click();
    await expect(
      popup.getByRole("button", { name: "2:3", exact: true }),
    ).toHaveAttribute("aria-pressed", "true");
    await page.keyboard.press("Escape");
    await expect(popup).toBeHidden();
    await expect(trigger).toBeFocused();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
  });
}
