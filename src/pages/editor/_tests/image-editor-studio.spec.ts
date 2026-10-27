import { expect, test } from "@playwright/test";
import { readFile } from "node:fs/promises";
import { openAuthenticatedEditor } from "./image-editor-test-setup";
import { draggableTestImage } from "./image-editor-test-image-fixtures";

test("adjusts, rotates, undoes, and exports an edited image", async ({
  page,
}) => {
  await openAuthenticatedEditor(page);
  await page
    .getByLabel("انتخاب عکس از گالری یا دوربین")
    .setInputFiles(draggableTestImage);
  await expect(
    page.getByRole("application", { name: "ویرایش تصویر" }),
  ).toBeVisible();

  await page.getByRole("button", { name: "نور و رنگ" }).click();
  const brightness = page.getByRole("slider", { name: "روشنایی" });
  await brightness.fill("140");
  await brightness.blur();
  await expect(brightness).toHaveValue("140");
  await page.getByRole("button", { name: "بازگردانی" }).click();
  await expect(brightness).toHaveValue("100");
  await page.getByRole("button", { name: "انجام دوباره" }).click();
  await expect(brightness).toHaveValue("140");

  await page.getByRole("button", { name: "چرخش", exact: true }).click();
  await page.getByRole("button", { name: "چرخش به راست" }).click();
  await page.getByRole("button", { name: "خروجی", exact: true }).click();
  await expect(page.getByText("80 × 120 px").first()).toBeVisible();
  await page.getByRole("button", { name: "JPEG" }).click();
  const downloadPromise = page.waitForEvent("download");
  await page
    .getByRole("button", { name: "دانلود", exact: true })
    .first()
    .click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toBe("cropped-image.jpg");
});

test("crops for a post, adds text and watermark, compares, and resizes the download", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await openAuthenticatedEditor(page);
  await page
    .getByLabel("انتخاب عکس از گالری یا دوربین")
    .setInputFiles(draggableTestImage);

  await page.getByRole("button", { name: /پست عمودی/ }).click();
  await expect(page.getByRole("button", { name: "4:5", exact: true })).toHaveAttribute(
    "aria-pressed",
    "true",
  );
  await page.getByRole("button", { name: "اعمال برش" }).click();

  await page.getByRole("button", { name: "متن", exact: true }).click();
  await page.getByRole("textbox", { name: "متن", exact: true }).fill("سلام پرپیکس");
  await page.getByRole("textbox", { name: "متن", exact: true }).blur();
  await page.getByRole("button", { name: "واترمارک" }).click();
  await page.getByRole("textbox", { name: "متن", exact: true }).fill("PERPIX");
  await page.getByRole("textbox", { name: "متن", exact: true }).blur();
  await page.getByRole("button", { name: "مقایسه" }).click();
  await expect(
    page.getByRole("slider", { name: "مرز مقایسه قبل و بعد" }),
  ).toBeVisible();
  await page.getByRole("slider", { name: "مرز مقایسه قبل و بعد" }).fill("70");
  await page.getByRole("button", { name: "مقایسه" }).click();

  await page.getByRole("button", { name: "خروجی", exact: true }).click();
  await page.getByRole("spinbutton", { name: "عرض (پیکسل)" }).fill("240");
  await page.getByRole("spinbutton", { name: "عرض (پیکسل)" }).blur();
  await expect(page.getByText("240 × 300 px").first()).toBeVisible();
  const downloadPromise = page.waitForEvent("download");
  await page
    .getByRole("button", { name: "دانلود", exact: true })
    .first()
    .click();
  const download = await downloadPromise;
  const png = await readFile(await download.path());
  expect(png.readUInt32BE(16)).toBe(240);
  expect(png.readUInt32BE(20)).toBe(300);
});

for (const viewport of [
  { width: 375, height: 812 },
  { width: 768, height: 1024 },
  { width: 1440, height: 900 },
]) {
  test(`stays usable at ${viewport.width}px`, async ({ page }) => {
    await page.setViewportSize(viewport);
    await openAuthenticatedEditor(page);
    await expect(
      page.getByLabel("انتخاب عکس از گالری یا دوربین"),
    ).toBeAttached();
    await expect
      .poll(() => page.evaluate(() => document.documentElement.scrollWidth))
      .toBeLessThanOrEqual(viewport.width);

    await page
      .getByLabel("انتخاب عکس از گالری یا دوربین")
      .setInputFiles(draggableTestImage);
    await expect(
      page.getByRole("application", { name: "ویرایش تصویر" }),
    ).toBeVisible();
    await page.getByRole("button", { name: "متن", exact: true }).click();
    await page.getByRole("textbox", { name: "متن", exact: true }).fill("نمونه");
    await page.getByRole("textbox", { name: "متن", exact: true }).blur();
    await page.getByRole("button", { name: "مقایسه" }).click();
    await expect(
      page.getByRole("slider", { name: "مرز مقایسه قبل و بعد" }),
    ).toBeVisible();
    await page.getByRole("button", { name: "مقایسه" }).click();
    await page.getByRole("button", { name: "خروجی", exact: true }).click();
    await expect(page.getByRole("button", { name: "JPEG" })).toBeVisible();
    await expect(
      page.getByRole("spinbutton", { name: "عرض (پیکسل)" }),
    ).toBeVisible();
    await expect
      .poll(() => page.evaluate(() => document.documentElement.scrollWidth))
      .toBeLessThanOrEqual(viewport.width);
  });
}
