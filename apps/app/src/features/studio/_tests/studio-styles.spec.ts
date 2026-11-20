import { expect, test, type Page } from "@playwright/test";
import { openEditor, seekTo } from "./editor-mocks";

const systemPreset = {
  uuid: "studio-system",
  name: "قالب سیستم",
  config: { version: 2, base: { font: { size: 96 } } },
  schema_version: 2,
  is_active: true,
  sort_order: 0,
};

const personalPreset = {
  ...systemPreset,
  uuid: "studio-mine",
  name: "قالب شخصی",
};

const openAppearance = async (page: Page) => {
  await page.getByRole("button", { name: "ظاهر کپشن" }).click();
  return page.getByRole("dialog", { name: "ظاهر کپشن" });
};

const captionVerticalPosition = (page: Page) =>
  page.getByTestId("stage-video").evaluate((video) => {
    const canvas = video.parentElement?.querySelector("canvas");
    const context = canvas?.getContext("2d");
    if (!canvas || !context || !canvas.width || !canvas.height) return -1;
    const { width, height } = canvas;
    const pixels = context.getImageData(0, 0, width, height).data;
    for (let alpha = 3; alpha < pixels.length; alpha += 4) {
      if (pixels[alpha] > 0) return Math.floor(alpha / 4 / width) / height;
    }
    return -1;
  });

test("a project keeps its selected and adjusted look after the system preset changes", async ({
  page,
}) => {
  const { saves } = await openEditor(page, "COMPLETED", async () => {
    await page.route("**/api/v1/studio/caption-presets", (route) =>
      route.fulfill({
        json: { system: [systemPreset], mine: [personalPreset], mine_limit: 2 },
      }),
    );
  });
  await seekTo(page, 500);
  await expect.poll(() => captionVerticalPosition(page)).toBeGreaterThan(0.5);
  const sheet = await openAppearance(page);
  await expect(
    sheet.getByRole("button", { name: personalPreset.name, exact: true }),
  ).toBeVisible();
  await sheet
    .getByRole("button", { name: systemPreset.name, exact: true })
    .click();
  await expect(sheet.getByRole("slider", { name: "اندازهٔ متن" })).toHaveValue(
    "96",
  );
  await sheet.getByRole("slider", { name: "اندازهٔ متن" }).press("ArrowUp");
  await sheet.getByRole("button", { name: "بالا", exact: true }).click();
  await sheet.getByLabel("رنگ پایهٔ متن").fill("#44cc88");
  await sheet.getByRole("button", { name: "اعمال ظاهر" }).click();
  await expect(sheet).toBeHidden();
  await expect
    .poll(async () => {
      const position = await captionVerticalPosition(page);
      return position > 0 && position < 0.5;
    })
    .toBe(true);
  await expect
    .poll(() => saves.at(-1)?.document.caption_style)
    .toMatchObject({
      preset_uuid: systemPreset.uuid,
      config: {
        base: { font: { size: 97 }, fill: { color: "#44cc88" } },
        layout: { anchor: "top" },
      },
    });

  await page.route("**/api/v1/studio/caption-presets", (route) =>
    route.fulfill({
      json: { system: [], mine: [personalPreset], mine_limit: 2 },
    }),
  );
  await page.reload();
  await openAppearance(page);
  await expect(sheet.getByRole("slider", { name: "اندازهٔ متن" })).toHaveValue(
    "97",
  );
  await expect(
    sheet.getByRole("button", { name: "بالا", exact: true }),
  ).toHaveAttribute("aria-pressed", "true");
  await expect(sheet.getByLabel("رنگ پایهٔ متن")).toHaveValue("#44cc88");
});

test("saves a personal preset and shows it and the plan limit in the gallery", async ({
  page,
}) => {
  const mine: Array<typeof personalPreset> = [];
  await openEditor(page, "COMPLETED", async () => {
    await page.route("**/api/v1/studio/caption-presets", (route) =>
      route.fulfill({ json: { system: [systemPreset], mine, mine_limit: 1 } }),
    );
    await page.route("**/api/v1/studio/caption-presets/mine", (route) => {
      const body = route.request().postDataJSON();
      mine.push({ ...personalPreset, ...body });
      return route.fulfill({ json: mine[0] });
    });
  });
  const sheet = await openAppearance(page);
  await sheet
    .getByRole("button", { name: systemPreset.name, exact: true })
    .click();
  await sheet.getByRole("textbox", { name: "نام قالب شخصی" }).fill("قالب سبز");
  await sheet.getByRole("button", { name: "ذخیره به‌عنوان قالب شخصی" }).click();
  await expect(
    sheet.getByRole("button", { name: "قالب سبز", exact: true }),
  ).toBeVisible();
  await expect(sheet.getByText("سقف قالب‌های شخصی پر شده است.")).toBeVisible();
  expect(mine[0]).toMatchObject({
    name: "قالب سبز",
    schema_version: 2,
    config: { version: 2 },
  });

  await page.goto("/studio/styles");
  await expect(
    page.getByRole("button", { name: "قالب سبز", exact: true }),
  ).toBeVisible();
});

test("a server-side quota conflict refreshes the limit and keeps the preset name", async ({
  page,
}) => {
  let atLimit = false;
  await openEditor(page, "COMPLETED", async () => {
    await page.route("**/api/v1/studio/caption-presets", (route) =>
      route.fulfill({
        json: {
          system: [systemPreset],
          mine: atLimit ? [personalPreset] : [],
          mine_limit: 1,
        },
      }),
    );
    await page.route("**/api/v1/studio/caption-presets/mine", (route) => {
      atLimit = true;
      return route.fulfill({
        status: 409,
        json: { status_code: 1901, detail: "Preset limit" },
      });
    });
  });
  const sheet = await openAppearance(page);
  const name = sheet.getByRole("textbox", { name: "نام قالب شخصی" });
  await name.fill("نسخهٔ من");
  await sheet.getByRole("button", { name: "ذخیره به‌عنوان قالب شخصی" }).click();
  await expect(sheet.getByRole("alert")).toHaveText(
    "سقف قالب‌های شخصی پر شده است.",
  );
  await expect(name).toHaveValue("نسخهٔ من");
  await expect(
    sheet.getByRole("button", { name: personalPreset.name, exact: true }),
  ).toBeVisible();
});

test("a temporary save error keeps the personal preset ready to retry", async ({
  page,
}) => {
  const mine: Array<typeof personalPreset> = [];
  let attempts = 0;
  await openEditor(page, "COMPLETED", async () => {
    await page.route("**/api/v1/studio/caption-presets", (route) =>
      route.fulfill({ json: { system: [], mine, mine_limit: 2 } }),
    );
    await page.route("**/api/v1/studio/caption-presets/mine", (route) => {
      if (++attempts === 1)
        return route.fulfill({ status: 503, json: { detail: "Unavailable" } });
      mine.push({ ...personalPreset, ...route.request().postDataJSON() });
      return route.fulfill({ json: mine[0] });
    });
  });
  const sheet = await openAppearance(page);
  const name = sheet.getByRole("textbox", { name: "نام قالب شخصی" });
  const save = sheet.getByRole("button", { name: "ذخیره به‌عنوان قالب شخصی" });
  await name.fill("قالب جدید");
  await save.click();
  await expect(sheet.getByRole("alert")).toHaveText(
    "قالب ذخیره نشد. دوباره امتحان کن.",
  );
  await expect(name).toHaveValue("قالب جدید");
  expect(attempts).toBe(1);
  await save.click();
  await expect(
    sheet.getByRole("button", { name: "قالب جدید", exact: true }),
  ).toBeVisible();
  expect(attempts).toBe(2);
});

test.describe("mobile", () => {
  test.use({ viewport: { width: 390, height: 844 }, hasTouch: true });

  test("chooses a preset from the mobile appearance drawer", async ({
    page,
  }) => {
    const { saves } = await openEditor(page, "COMPLETED", async () => {
      await page.route("**/api/v1/studio/caption-presets", (route) =>
        route.fulfill({
          json: { system: [systemPreset], mine: [], mine_limit: 1 },
        }),
      );
    });
    const sheet = await openAppearance(page);
    await sheet
      .getByRole("button", { name: systemPreset.name, exact: true })
      .tap();
    await expect(
      sheet.getByRole("img", { name: "نمونهٔ پیش‌نمایش کپشن فارسی" }),
    ).toBeVisible();
    await sheet.getByRole("button", { name: "اعمال ظاهر" }).tap();
    await expect(sheet).toBeHidden();
    await expect
      .poll(() => saves.at(-1)?.document.caption_style)
      .toMatchObject({ preset_uuid: systemPreset.uuid });
  });
});
