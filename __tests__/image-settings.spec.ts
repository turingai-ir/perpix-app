import type { Page } from "@playwright/test";

import { expect, test } from "./fixtures/image-settings";

const title = "تنظیمات تصویر";
const professional = /کنترل‌های حرفه‌ای/;
const guidanceLabel = "میزان پایبندی به توضیحات";
const stepsLabel = "میزان پردازش جزئیات";
const negativeLabel = "چه چیزهایی در تصویر نباشد؟";
const promptText = "A quiet mountain lake at sunrise";

async function openSettings(page: Page) {
  const trigger = page.getByRole("button", { name: new RegExp(`^${title}`) });
  await expect(trigger).toBeVisible();
  await trigger.click();
  const dialog = page.getByRole("dialog", { name: title, exact: true });
  await expect(dialog).toBeVisible();
  return dialog;
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

test("safe harness loads the mocked image composer without generation", async ({
  page,
}) => {
  await expect(page.getByRole("textbox").first()).toBeVisible();
  await expect(page.getByRole("button", { name: /ساخت تصویر/ })).toBeDisabled();
});

test("model switch keeps the composer stable and preserves the prompt", async ({
  page,
}) => {
  const prompt = page.getByRole("textbox").first();
  await prompt.fill(promptText);
  await page.getByRole("combobox").filter({ hasText: "Nano Banana" }).click();
  await page.getByText("Limited image fixture", { exact: true }).click();
  await expect(prompt).toBeVisible();
  await expect(prompt).toHaveValue(promptText);
  await expect(
    page.getByRole("combobox").filter({ hasText: "Limited image fixture" }),
  ).toBeVisible();
  await expect(prompt).toHaveValue(promptText);
});

test("reference image switches workflow and removal restores text mode", async ({
  page,
}) => {
  const workflow = page.locator("[data-generation-mode]");
  await expect(workflow).toHaveAttribute(
    "data-generation-mode",
    "text_to_image",
  );
  await page.getByRole("button", { name: "افزودن عکس", exact: true }).click();
  const picker = page.getByRole("dialog", { name: "افزودن عکس" });
  await picker.getByRole("button", { name: /reference-test\.png/ }).click();
  await picker.getByRole("button", { name: "بستن", exact: true }).click();
  await expect(workflow).toHaveAttribute(
    "data-generation-mode",
    "image_to_image",
  );
  await page.getByRole("button", { name: "حذف فایل", exact: true }).click();
  await expect(workflow).toHaveAttribute(
    "data-generation-mode",
    "text_to_image",
  );
});

test("model, ratio and resolution menus expose concise complete choices", async ({
  page,
}) => {
  const modelPicker = page
    .getByRole("combobox")
    .filter({ hasText: "Nano Banana" });
  await modelPicker.click();
  await expect(
    page.getByText("تولید سریع و اقتصادی برای استفاده روزمره", {
      exact: true,
    }),
  ).toBeVisible();
  await page.keyboard.press("Escape");

  await page.getByRole("combobox", { name: "قاب تصویر" }).click();
  for (const ratio of ["1:1", "16:9", "9:16"]) {
    await expect(
      page.getByRole("button", { name: ratio, exact: true }),
    ).toBeVisible();
  }
  await page.keyboard.press("Escape");

  await page.getByRole("combobox", { name: "وضوح تصویر" }).click();
  await expect(
    page.getByRole("button", { name: /1K.*سریع و بهینه/ }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: /2K.*تعادل مناسب/ }),
  ).toBeVisible();
});

test("image settings starts with professional controls collapsed", async ({
  page,
}) => {
  await expect(
    page.getByRole("button", { name: title, exact: true }),
  ).toBeVisible();
  const dialog = await openSettings(page);
  await expect(
    dialog.getByRole("button", { name: professional }),
  ).toHaveAttribute("aria-expanded", "false");
  await expect(
    dialog.getByRole("spinbutton", { name: guidanceLabel }),
  ).toBeHidden();
  await expect(
    dialog.getByRole("spinbutton", { name: stepsLabel }),
  ).toBeHidden();
  await expect(
    dialog.getByRole("button", { name: "بازنشانی", exact: true }),
  ).toBeVisible();
  await expect(
    dialog.getByRole("button", { name: "تأیید و بستن", exact: true }),
  ).toBeVisible();
});

test("professional controls show simple guidance on hover and click", async ({
  page,
}) => {
  const dialog = await openSettings(page);
  await dialog.getByRole("button", { name: professional }).click();
  await expect(
    dialog.getByRole("button", { name: professional }),
  ).toHaveAttribute("aria-expanded", "true");
  await expect(
    dialog.getByRole("spinbutton", { name: guidanceLabel }),
  ).toHaveValue("7");
  await expect(
    dialog.getByRole("textbox", { name: negativeLabel }),
  ).toBeVisible();
  const guidanceHelp = dialog.getByRole("button", {
    name: `راهنمای ${guidanceLabel}`,
  });
  await guidanceHelp.hover();
  await expect(page.getByText(/رنگ لباس درست نیست/)).toBeVisible();
  await page.keyboard.press("Escape");
  const stepsHelp = dialog.getByRole("button", {
    name: `راهنمای ${stepsLabel}`,
  });
  await stepsHelp.click();
  await expect(page.getByText(/مقدار پیش‌فرض شروع کن/)).toBeVisible();
});

test("reset restores only advanced defaults and preserves prompt and main settings", async ({
  page,
}) => {
  const prompt = page.getByRole("textbox").first();
  await prompt.fill(promptText);
  const aspectRatio = page.getByRole("combobox", {
    name: "قاب تصویر",
    exact: true,
  });
  const resolution = page.getByRole("combobox", {
    name: "وضوح تصویر",
    exact: true,
  });
  await aspectRatio.click();
  await page.getByRole("button", { name: "16:9", exact: true }).click();
  await resolution.click();
  await page.getByRole("button", { name: /2K.*تعادل مناسب/ }).click();
  const dialog = await openSettings(page);
  await dialog.getByRole("button", { name: professional }).click();
  await dialog.getByRole("spinbutton", { name: guidanceLabel }).fill("12");
  await dialog.getByRole("textbox", { name: negativeLabel }).fill("watermark");
  await dialog.getByRole("spinbutton", { name: stepsLabel }).fill("30");
  await dialog.getByRole("button", { name: "بازنشانی", exact: true }).click();
  const section = dialog.getByRole("button", { name: professional });
  if ((await section.getAttribute("aria-expanded")) === "false")
    await section.click();
  await expect(
    dialog.getByRole("spinbutton", { name: guidanceLabel }),
  ).toHaveValue("7");
  await expect(
    dialog.getByRole("textbox", { name: negativeLabel }),
  ).toHaveValue("");
  await expect(
    dialog.getByRole("spinbutton", { name: stepsLabel }),
  ).toHaveValue("20");
  await dialog
    .getByRole("button", { name: "تأیید و بستن", exact: true })
    .click();
  await expect(dialog).toBeHidden();
  await expect(prompt).toHaveValue(promptText);
  await expect(aspectRatio).toHaveText("16:9");
  await expect(resolution).toHaveText("2K");
  await expect(
    page.getByRole("combobox").filter({ hasText: "Nano Banana" }),
  ).toBeVisible();
});

test("advanced changes are live and survive Escape without confirming a draft", async ({
  page,
}) => {
  const dialog = await openSettings(page);
  await dialog.getByRole("button", { name: professional }).click();
  await dialog.getByRole("spinbutton", { name: guidanceLabel }).fill("12");
  await dialog.getByRole("textbox", { name: negativeLabel }).fill("watermark");
  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
  await expect(
    page.getByRole("button", { name: new RegExp(`^${title}`) }),
  ).toBeFocused();
  await openSettings(page);
  const section = dialog.getByRole("button", { name: professional });
  if ((await section.getAttribute("aria-expanded")) === "false")
    await section.click();
  await expect(
    dialog.getByRole("spinbutton", { name: guidanceLabel }),
  ).toHaveValue("12");
  await expect(
    dialog.getByRole("textbox", { name: negativeLabel }),
  ).toHaveValue("watermark");
});

test("confirm validates hidden advanced errors and opens their section before closing", async ({
  page,
}) => {
  const dialog = await openSettings(page);
  const section = dialog.getByRole("button", { name: professional });
  await section.click();
  const guidance = dialog.getByRole("spinbutton", { name: guidanceLabel });
  await guidance.fill("0");
  await section.click();
  await dialog
    .getByRole("button", { name: "تأیید و بستن", exact: true })
    .click();
  await expect(dialog).toBeVisible();
  await expect(section).toHaveAttribute("aria-expanded", "true");
  await expect(guidance).toBeVisible();
  await expect(guidance).toHaveAttribute("aria-invalid", "true");
  await guidance.fill("12");
  // Prompt is deliberately empty: this action validates advanced fields only.
  await dialog
    .getByRole("button", { name: "تأیید و بستن", exact: true })
    .click();
  await expect(dialog).toBeHidden();
  await expect(
    page.getByRole("button", { name: new RegExp(`^${title}`) }),
  ).toBeFocused();
});

test("settings is a bottom sheet on mobile and an inset dialog on desktop", async ({
  page,
  isMobile,
}) => {
  const dialog = await openSettings(page);
  const viewport = page.viewportSize()!;
  await expect
    .poll(async () => {
      const box = await dialog.boundingBox();
      if (!box) return false;
      const bottomGap = viewport.height - box.y - box.height;
      const insideViewport =
        box.x >= -1 &&
        box.y >= -1 &&
        box.x + box.width <= viewport.width + 1 &&
        bottomGap >= -1;
      if (isMobile)
        return (
          insideViewport &&
          Math.abs(bottomGap) <= 2 &&
          box.width >= viewport.width - 32
        );
      return insideViewport && box.x > 16 && box.y > 16 && bottomGap > 16;
    })
    .toBe(true);
  await expect(
    dialog.getByRole("button", { name: "تأیید و بستن", exact: true }),
  ).toBeInViewport();
  await dialog
    .getByRole("button", { name: "تأیید و بستن", exact: true })
    .click();
  await expect(dialog).toBeHidden();
  await expect(
    page.getByRole("button", { name: new RegExp(`^${title}`) }),
  ).toBeFocused();
});

test("switching schemas renders only supported advanced fields", async ({
  page,
}) => {
  await page.getByRole("combobox").filter({ hasText: "Nano Banana" }).click();
  await page.getByRole("option", { name: /Limited image fixture/ }).click();
  const dialog = await openSettings(page);
  await dialog.getByRole("button", { name: professional }).click();
  await expect(
    dialog.getByRole("spinbutton", { name: guidanceLabel }),
  ).toHaveValue("7");
  await expect(
    dialog.getByRole("textbox", { name: negativeLabel }),
  ).toHaveCount(0);
  await expect(
    dialog.getByRole("spinbutton", { name: stepsLabel }),
  ).toHaveCount(0);
  await expect(dialog.getByText(/(?:مثلاً|مثال).*نوشته/)).toHaveCount(0);
});

test("settings changed count tracks distinct non-default fields and reset", async ({
  page,
}) => {
  const dialog = await openSettings(page);
  const section = dialog.getByRole("button", { name: professional });
  await section.click();
  // The trigger is behind the modal, but its badge reflects the live form.
  const trigger = page.getByRole("button", {
    name: new RegExp(`^${title}`),
    includeHidden: true,
  });
  const initialLabel = await trigger.innerText();
  await dialog.getByRole("spinbutton", { name: guidanceLabel }).fill("12");
  await expect(trigger).toContainText(/[1۱]/);
  await dialog.getByRole("spinbutton", { name: guidanceLabel }).fill("13");
  await expect(trigger).toContainText(/[1۱]/);
  await dialog.getByRole("textbox", { name: negativeLabel }).fill("watermark");
  await expect(trigger).toContainText(/[2۲]/);
  await dialog.getByRole("spinbutton", { name: guidanceLabel }).fill("7");
  await expect(trigger).toContainText(/[1۱]/);
  await dialog.getByRole("button", { name: "بازنشانی", exact: true }).click();
  await expect(trigger).toHaveText(initialLabel);
});
