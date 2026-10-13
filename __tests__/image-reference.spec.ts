import type { Page } from "@playwright/test";

import { expect, test } from "./fixtures/image-settings";

const promptText = "A quiet mountain lake at sunrise";
const viewports = [
  { width: 375, height: 812 },
  { width: 812, height: 375 },
  { width: 768, height: 1024 },
  { width: 1440, height: 900 },
];

async function openReferences(page: Page) {
  await page.getByRole("button", { name: "افزودن عکس", exact: true }).click();
  const picker = page.getByRole("dialog", { name: "افزودن عکس", exact: true });
  await expect(picker).toBeVisible();
  return picker;
}

test.beforeEach(async ({ page }) => {
  await page.goto("/generation/image", {
    waitUntil: "domcontentloaded",
    timeout: 60_000,
  });
  await expect(
    page.getByRole("combobox").filter({ hasText: "Nano Banana" }),
  ).toBeVisible({ timeout: 10_000 });
});

for (const viewport of viewports) {
  test.describe(`reference image at ${viewport.width}x${viewport.height}`, () => {
    test.use({ viewport });

    test("confirmation commits the reference and removal restores text mode", async ({
      page,
    }, testInfo) => {
      const workflow = page.locator("[data-generation-mode]");
      const prompt = page.getByRole("textbox").first();
      const references = page.getByRole("list", { name: "تصاویر مرجع" });
      await prompt.fill(promptText);
      const picker = await openReferences(page);
      await picker.getByRole("button", { name: /reference-test\.png/ }).click();
      await expect(workflow).toHaveAttribute(
        "data-generation-mode",
        "text_to_image",
      );
      const confirm = picker.getByRole("button", {
        name: "افزودن 1 عکس",
        exact: true,
      });
      await expect(confirm).toBeEnabled();
      await expect(confirm).toBeInViewport({ ratio: 1 });
      await page.screenshot({
        path: testInfo.outputPath("reference-picker.png"),
      });
      await confirm.click();
      await expect(picker).not.toBeVisible();
      await expect(workflow).toHaveAttribute(
        "data-generation-mode",
        "image_to_image",
      );
      await expect(references.getByRole("listitem")).toHaveCount(1);
      await expect(prompt).toHaveValue(promptText);
      await expect(
        page.getByRole("button", { name: /ساخت تصویر/ }),
      ).toBeEnabled();
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBe(true);
      await page
        .getByRole("button", { name: "حذف تصویر مرجع 1", exact: true })
        .click();
      await expect(workflow).toHaveAttribute(
        "data-generation-mode",
        "text_to_image",
      );
      await expect(references).not.toBeVisible();
      await expect(prompt).toHaveValue(promptText);
      await expect(
        page.getByRole("button", { name: /ساخت تصویر/ }),
      ).toBeEnabled();
    });
  });
}

test.describe("reference image cancellation", () => {
  test.use({ viewport: { width: 375, height: 812 } });

  for (const action of ["close", "escape"] as const) {
    test(`${action} discards draft selection without changing the workflow`, async ({
      page,
    }) => {
      const workflow = page.locator("[data-generation-mode]");
      const prompt = page.getByRole("textbox").first();
      await prompt.fill(promptText);
      let picker = await openReferences(page);
      await picker.getByRole("button", { name: /reference-test\.png/ }).click();
      await expect(
        picker.getByRole("button", { name: "افزودن 1 عکس", exact: true }),
      ).toBeEnabled();
      if (action === "escape") {
        await page.keyboard.press("Escape");
      } else {
        await picker.getByRole("button", { name: "بستن", exact: true }).click();
      }
      await expect(picker).not.toBeVisible();
      await expect(workflow).toHaveAttribute(
        "data-generation-mode",
        "text_to_image",
      );
      await expect(
        page.getByRole("list", { name: "تصاویر مرجع" }),
      ).not.toBeVisible();
      await expect(prompt).toHaveValue(promptText);
      picker = await openReferences(page);
      await expect(
        picker.getByRole("button", { name: "افزودن 0 عکس", exact: true }),
      ).toBeDisabled();
      await picker.getByRole("button", { name: /reference-test\.png/ }).click();
      await picker
        .getByRole("button", { name: "افزودن 1 عکس", exact: true })
        .click();
      await expect(workflow).toHaveAttribute(
        "data-generation-mode",
        "image_to_image",
      );
    });
  }
});

test("reference image mode remains active until the last confirmed image is removed", async ({
  page,
}) => {
  const workflow = page.locator("[data-generation-mode]");
  const references = page.getByRole("list", { name: "تصاویر مرجع" });
  const picker = await openReferences(page);
  await picker.getByRole("button", { name: /reference-test\.png/ }).click();
  await picker.getByRole("button", { name: /reference-second\.png/ }).click();
  await picker
    .getByRole("button", { name: "افزودن 2 عکس", exact: true })
    .click();
  await expect(references.getByRole("listitem")).toHaveCount(2);
  await expect(workflow).toHaveAttribute(
    "data-generation-mode",
    "image_to_image",
  );
  await page
    .getByRole("button", { name: "حذف تصویر مرجع 1", exact: true })
    .first()
    .click();
  await expect(references.getByRole("listitem")).toHaveCount(1);
  await expect(workflow).toHaveAttribute(
    "data-generation-mode",
    "image_to_image",
  );
  await page
    .getByRole("button", { name: "حذف تصویر مرجع 1", exact: true })
    .click();
  await expect(workflow).toHaveAttribute(
    "data-generation-mode",
    "text_to_image",
  );
});
