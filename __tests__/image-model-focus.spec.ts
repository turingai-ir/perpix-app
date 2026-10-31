import { expect, test } from "./fixtures/image-settings";

const touchViewports = [
  { name: "phone portrait", width: 375, height: 812 },
  { name: "phone landscape", width: 812, height: 375 },
  { name: "tablet", width: 768, height: 1024 },
];

test.beforeEach(async ({ page }) => {
  await page.goto("/generation/image", { waitUntil: "domcontentloaded" });
  await expect(
    page.getByRole("combobox").filter({ hasText: "Nano Banana" }),
  ).toBeVisible();
});

for (const { name, width, height } of touchViewports) {
  test.describe(name, () => {
    test.use({ hasTouch: true, viewport: { width, height } });

    test("touch opens models without focusing search; intentional search still works", async ({
      page,
    }, testInfo) => {
      const trigger = page
        .getByRole("combobox")
        .filter({ hasText: "Nano Banana" });
      await trigger.tap();
      const popup = page.locator('[data-slot="popover-content"]');
      const search = popup.locator('[data-slot="command-input"]');
      await expect(search).toBeVisible();
      await expect(search).not.toBeFocused();
      await expect(popup).toBeFocused();
      const bounds = await popup.boundingBox();
      expect(bounds).not.toBeNull();
      expect(bounds!.x).toBeGreaterThanOrEqual(0);
      expect(bounds!.y).toBeGreaterThanOrEqual(0);
      expect(bounds!.x + bounds!.width).toBeLessThanOrEqual(width + 1);
      expect(bounds!.y + bounds!.height).toBeLessThanOrEqual(height + 1);
      await popup.screenshot({
        path: testInfo.outputPath("model-picker.png"),
        animations: "disabled",
      });

      await page.keyboard.press("Escape");
      await expect(popup).toBeHidden();
      await expect(trigger).toBeFocused();
      await trigger.tap();
      await expect(search).not.toBeFocused();

      await search.tap();
      await expect(search).toBeFocused();
      await search.fill("Limited");
      await popup.getByRole("option", { name: /Limited image fixture/ }).tap();
      await expect(popup).toBeHidden();
      await expect(
        page.getByRole("combobox").filter({ hasText: "Limited image fixture" }),
      ).toBeVisible();
    });
  });
}

test.describe("desktop", () => {
  test.use({ viewport: { width: 1440, height: 900 } });

  test("keyboard opening preserves automatic search focus and selection", async ({
    page,
  }) => {
    const trigger = page
      .getByRole("combobox")
      .filter({ hasText: "Nano Banana" });
    await trigger.focus();
    await trigger.press("Enter");
    const search = page.locator('[data-slot="command-input"]');
    await expect(search).toBeFocused();
    await search.press("Escape");
    await expect(search).toBeHidden();
    await expect(trigger).toBeFocused();
    await trigger.press("Enter");
    await expect(search).toBeFocused();
    await search.fill("Limited");
    await search.press("ArrowDown");
    await search.press("Enter");
    await expect(search).toBeHidden();
    await expect(
      page.getByRole("combobox").filter({ hasText: "Limited image fixture" }),
    ).toBeVisible();
  });

  test("mouse opening preserves automatic search focus", async ({ page }) => {
    await page.getByRole("combobox").filter({ hasText: "Nano Banana" }).click();
    await expect(page.locator('[data-slot="command-input"]')).toBeFocused();
  });
});
