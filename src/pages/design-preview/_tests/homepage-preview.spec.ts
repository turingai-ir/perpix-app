import { expect, test } from "@playwright/test";

test.describe("PerPix homepage design preview", () => {
  test("presents the brand hero and creation paths", async ({ page }) => {
    await page.goto("/design-preview");

    await expect(
      page.getByRole("heading", {
        level: 1,
        name: "ایده‌ات را به یک اثر ماندگار تبدیل کن",
      }),
    ).toBeVisible();
    await expect(page.getByAltText("نشان پرپیکس")).toBeVisible();
    await expect(
      page.getByRole("link", { name: "شروع ساخت تصویر" }),
    ).toBeVisible();
    await expect(
      page.getByRole("link", { name: "شروع ساخت ویدیو" }),
    ).toBeVisible();
  });

  test("keeps mobile actions usable without horizontal overflow", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto("/design-preview");

    const actionLinks = page.locator("[data-preview-action]");
    await expect(actionLinks).toHaveCount(2);

    for (const actionLink of await actionLinks.all()) {
      const box = await actionLink.boundingBox();
      expect(box?.height).toBeGreaterThanOrEqual(44);
    }

    const pageWidths = await page.evaluate(() => ({
      client: document.documentElement.clientWidth,
      scroll: document.documentElement.scrollWidth,
    }));
    expect(pageWidths.scroll).toBe(pageWidths.client);
  });
});
