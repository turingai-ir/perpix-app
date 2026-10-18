import {
  devices,
  expect,
  type Locator,
  type Page,
  type Route,
  test,
} from "@playwright/test";
import { readFileSync } from "node:fs";

import type {
  JsonConfigMeta,
  JsonConfigSchema,
} from "../src/hooks/use-dynamic-config-form";
import { mockAuthenticatedSession } from "./support/auth-session";

const MODEL_UUID = "2d1fcf14-a655-47c5-af08-3fa450dc99cc";
const NANO_MODEL_UUID = "a509b349-d43f-4065-9cf2-de444bf4aa2c";
const RUNWARE_PROVIDER_UUID = "638239ab-dcac-49cf-a198-f593cfd45e77";
const VIDEO_PROMPT_PLACEHOLDER = "صحنه، حرکت سوژه و دوربین و نور رو تعریف کن…";

test.describe.configure({ mode: "serial" });

const klingVideoConfig = JSON.parse(
  readFileSync(
    new URL("./fixtures/kling-video-config-schema.json", import.meta.url),
    "utf8",
  ),
) as [
  { meta: JsonConfigMeta },
  { RUNWARE: { config_schema: JsonConfigSchema } },
];
const klingVideoConfigMeta = klingVideoConfig[0].meta;
const klingVideoConfigSchema = klingVideoConfig[1].RUNWARE.config_schema;
const seedanceVideoConfig = JSON.parse(
  readFileSync(
    new URL("./fixtures/seedance-video-config.json", import.meta.url),
    "utf8",
  ),
) as {
  canonical_ui_schema: JsonConfigMeta;
  modes: Record<string, unknown>;
};

test.beforeEach(async ({ page }) => {
  await mockAuthenticatedSession(page);

  await page.addInitScript(() => {
    window.localStorage.clear();
    window.indexedDB.deleteDatabase("REACT_QUERY_OFFLINE_CACHE");
  });

  await mockApi(page);
});

test("video studio opens without generating and keeps the model controls ready", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  let generations = 0;
  page.on("request", (request) => {
    if (request.url().includes("/ai-task/generate")) generations += 1;
  });
  await openVideoGenerationPage(page);
  await expect(
    page.getByRole("heading", { name: "توی ذهنت پخش می‌شه؟ بسازش." }),
  ).toBeVisible();
  await expect(page.getByPlaceholder(VIDEO_PROMPT_PLACEHOLDER)).toHaveValue("");
  await expect(page.getByRole("slider", { name: "مدت زمان" })).toHaveAttribute(
    "aria-valuetext",
    "5 ثانیه",
  );
  await expect(page.locator("[data-generation-intro]")).toBeVisible();
  await expect(page.locator("[data-generation-composer]")).toBeVisible();
  expect(generations).toBe(0);
  await page.screenshot({
    path: ".artifacts/video-studio-desktop.png",
    fullPage: true,
  });
});

test("idle cinema is a static composition preview without generating a video", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await openVideoGenerationPage(page);
  const cinema = page.locator('[data-video-cinema="idle"]');
  await expect(cinema).toBeVisible();
  await expect(cinema.getByText("قاب ویدیوی تو")).toBeVisible();
  await expect(cinema.getByRole("button")).toHaveCount(0);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(cinema.locator("[data-video-preview-frame]")).toHaveCSS(
    "animation-name",
    "none",
  );
  await expect(page.getByPlaceholder(VIDEO_PROMPT_PLACEHOLDER)).toHaveValue("");
});

test("long video prompts collapse without hiding the failure or losing line breaks", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  const prompt = `VIDEO EDIT / CHARACTER REPLACEMENT\n${"Keep the source composition and original timing.\n".repeat(65)}`;
  const config = { mode: "text_to_video", prompt };
  await mockApi(page, [
    {
      ai_model_config: config,
      ai_model_uuid: MODEL_UUID,
      role: "USER",
      message: prompt,
      uuid: "long-prompt",
      task_status: "SUCCESS",
    },
    {
      ai_model_config: config,
      ai_model_uuid: MODEL_UUID,
      role: "ASSISTANT",
      message: null,
      uuid: "failed-long-prompt",
      task_status: "FAILED",
    },
  ]);
  await page.goto("/generation/video/task-1");
  const summary = page.locator("[data-video-request-summary]").first();
  const expand = summary.getByRole("button", { name: "نمایش متن کامل" });
  await expect(expand).toHaveAttribute("aria-expanded", "false");
  await expect(page.getByRole("alert")).toBeInViewport();
  await expand.click();
  await expect(
    summary.getByRole("button", { name: "نمایش کمتر" }),
  ).toHaveAttribute("aria-expanded", "true");
  await expect(summary.locator("p")).toHaveCSS("white-space", "pre-wrap");
  await expect(summary.locator("p")).toHaveAttribute("dir", "auto");
  await summary.getByRole("button", { name: "نمایش کمتر" }).click();
  await expect(page.getByRole("alert")).toBeInViewport();
});

test("mobile request summaries preserve reference framing and clamp long prompts", async ({
  page,
}) => {
  await page.setViewportSize({ width: 375, height: 812 });
  const prompt = `VIDEO EDIT / CHARACTER REPLACEMENT\n${"Keep the source composition and original timing.\n".repeat(65)}`;
  await mockApi(page, [
    {
      ai_model_config: {
        frame_images: ["reference-1"],
        mode: "image_to_video",
        prompt,
      },
      ai_model_uuid: MODEL_UUID,
      role: "USER",
      message: prompt,
      uuid: "mobile-reference-message",
      task_status: "SUCCESS",
    },
  ]);
  await page.route("**/file-manager/files/presigned-urls", (route) =>
    route.fulfill({
      json: {
        files: [
          {
            file_uuid: "reference-1",
            preview_url: "http://localhost:5173/android-chrome-512x512.png",
            download_url: "http://localhost:5173/android-chrome-512x512.png",
            expire_at: new Date(Date.now() + 3_600_000).toISOString(),
          },
        ],
      },
    }),
  );

  await page.goto("/generation/video/task-1");
  const summary = page.locator("[data-video-request-summary]").first();
  await expect(summary.locator("img")).toHaveCSS("object-fit", "contain");
  await expect(
    summary.getByRole("button", { name: "نمایش متن کامل" }),
  ).toHaveAttribute("aria-expanded", "false");
  expect(
    (await summary.locator("p").boundingBox())!.height,
  ).toBeLessThanOrEqual(112);
  expect(
    await page.evaluate(() => document.documentElement.scrollWidth),
  ).toBeLessThanOrEqual(375);
});

test("a create-only video model has no redundant group button and keeps reference controls readable", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  const detail = getModelDetail();
  await page.route(`**/ai-registry/models/${MODEL_UUID}`, (route) =>
    route.fulfill({
      json: {
        ...detail,
        modes: Object.fromEntries(
          Object.entries(detail.modes)
            .filter(([mode]) => mode !== "motion_control")
            .map(([mode, entry]) => [
              mode,
              {
                ...entry,
                config_schema: {
                  ...entry.config_schema,
                  properties: {
                    ...entry.config_schema.properties,
                    mode: {
                      type: "string",
                      enum: ["text_to_video", "image_to_video"],
                      default: "text_to_video",
                    },
                  },
                },
              },
            ]),
        ),
        canonical_ui_schema: {
          ...detail.canonical_ui_schema,
          selectors: detail.canonical_ui_schema.selectors.map((selector) => ({
            ...selector,
            options: selector.options.filter(
              (option) => option.value !== "motion_control",
            ),
          })),
        },
      },
    }),
  );
  await openVideoGenerationPage(page);
  const composer = page.locator("[data-generation-composer-card]");
  await expect(composer.getByRole("group", { name: "روش ساخت" })).toBeHidden();
  const imageMode = composer.getByRole("radio", { name: "عکس به ویدیو" });
  await imageMode.click();
  await expect(imageMode).toHaveAttribute("aria-checked", "true");
  await imageMode.press("ArrowRight");
  await expect(
    composer.getByRole("radio", { name: "متن به ویدیو" }),
  ).toBeFocused();
  await imageMode.click();
  await expect(
    composer.getByRole("heading", { name: "تصاویر فریم" }),
  ).toBeVisible();
  const upload = composer.getByRole("button", {
    name: "افزودن عکس",
    exact: true,
  });
  await expect(upload).toBeVisible();
  expect((await upload.boundingBox())!.height).toBeGreaterThanOrEqual(44);
  await page.screenshot({
    path: ".artifacts/video-composer-references-desktop.png",
  });
  await page.setViewportSize({ width: 375, height: 812 });
  await page.getByRole("button", { name: "Close", exact: true }).click();
  await composer.scrollIntoViewIfNeeded();
  await expect(upload).toBeVisible();
  expect(
    await page.evaluate(() => document.documentElement.scrollWidth),
  ).toBeLessThanOrEqual(375);
  await page.screenshot({
    path: ".artifacts/video-composer-references-mobile.png",
    fullPage: true,
  });
});

test("populated video references retain large previews and a labeled add control", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  const prompt = "A cinematic portrait in natural light";
  await mockApi(page, [
    {
      ai_model_config: {
        mode: "image_to_video",
        prompt,
        frame_images: ["reference-1"],
      },
      ai_model_uuid: MODEL_UUID,
      role: "USER",
      message: prompt,
      uuid: "reference-message",
      task_status: "SUCCESS",
    },
  ]);
  await page.route("**/file-manager/files/presigned-urls", (route) =>
    route.fulfill({
      json: {
        files: [
          {
            file_uuid: "reference-1",
            preview_url: "http://localhost:5173/android-chrome-512x512.png",
            download_url: "http://localhost:5173/android-chrome-512x512.png",
            expire_at: new Date(Date.now() + 3_600_000).toISOString(),
          },
        ],
      },
    }),
  );
  await page.goto("/generation/video/task-1");
  const composer = page.locator("[data-generation-composer-card]");
  const preview = composer.getByRole("button", { name: "دیدن عکس مرجع 1" });
  await expect(preview).toBeVisible();
  expect((await preview.boundingBox())!.width).toBeGreaterThanOrEqual(76);
  const add = composer.getByRole("button", { name: "افزودن عکس", exact: true });
  await expect(add).toBeVisible();
  await expect(add).toHaveText("افزودن عکس");
  await preview.click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.keyboard.press("Escape");
  await composer.getByRole("button", { name: "حذف عکس مرجع 1" }).click();
  await expect(preview).toHaveCount(0);
  await expect(add).toBeVisible();
});

test("video media dock gives audio references type-aware controls", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.route(
    (url) => url.pathname.endsWith(`/ai-registry/models/${MODEL_UUID}`),
    (route) =>
      route.fulfill({
        json: { ...getModelSummary(), ...seedanceVideoConfig },
      }),
  );
  await openVideoGenerationPage(page);
  const composer = page.locator("[data-generation-composer-card]");
  await composer.getByRole("radio", { name: "ویدیوی صوت‌محور" }).click();
  const audioDock = composer.locator(
    '[data-media-upload-presentation="video-dock"][data-media-type="audio"]',
  );
  await expect(audioDock).toBeVisible();
  const addAudio = audioDock.getByRole("button", {
    name: "افزودن صدا",
    exact: true,
  });
  await expect(addAudio).toBeVisible();
  expect((await addAudio.boundingBox())!.height).toBeGreaterThanOrEqual(44);
  const addImage = composer
    .locator('[data-media-type="image"]')
    .getByRole("button", { name: "افزودن عکس", exact: true })
    .first();
  await expect(addImage).toBeVisible();
  await expect(addImage).not.toHaveAttribute("data-media-type", "audio");
  await page.screenshot({ path: ".artifacts/video-media-dock-audio.png" });
});

test("keeps the video composer in a compact side rail beside the timeline", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/generation/video", { waitUntil: "domcontentloaded" });
  await expect(page.getByPlaceholder(VIDEO_PROMPT_PLACEHOLDER)).toBeVisible();

  const composer = page.locator("[data-generation-composer]");
  const workspace = page.getByRole("region", {
    name: "خط زمانی ساخت ویدیو",
  });
  const composerBounds = await composer.boundingBox();
  const workspaceBounds = await workspace.boundingBox();

  expect(composerBounds).not.toBeNull();
  expect(workspaceBounds).not.toBeNull();
  expect(composerBounds!.x).toBeGreaterThan(
    workspaceBounds!.x + workspaceBounds!.width,
  );
  expect(composerBounds!.y).toBeLessThanOrEqual(workspaceBounds!.y + 20);
  expect(composerBounds!.width).toBeLessThan(workspaceBounds!.width * 0.7);
});

test("video model library is searchable without starting a generation", async ({
  page,
}) => {
  let generations = 0;
  await page.route(
    (url) => url.pathname.endsWith("/ai-registry/models"),
    (route) =>
      route.fulfill({
        json: [
          getModelSummary(),
          {
            ...getModelSummary(),
            uuid: "wan-model",
            name: "WAN_VIDEO_3_0",
            display_name: "Wan 3.0",
            model_owner: "ALIBABA",
            min_cost: 410_000,
            max_cost: 3_000_000,
          },
          {
            ...getModelSummary(),
            uuid: "grok-model",
            name: "GROK_IMAGINE_VIDEO",
            display_name: "Grok Imagine Video",
            model_owner: "X_AI",
          },
          {
            ...getModelSummary(),
            uuid: "seedance-model",
            name: "SEEDANCE_2_5",
            display_name: "Seedance 2.5",
            model_owner: "BYTE_DANCE",
          },
          {
            ...getModelSummary(),
            uuid: "aleph-model",
            name: "ALEPH_2_0",
            display_name: "Aleph 2.0",
            model_owner: "RUNWAY",
          },
        ],
      }),
  );
  await page.route("**/ai-task/generate", (route) => {
    generations += 1;
    return route.abort();
  });
  await page.goto("/generation/video");
  await page.getByRole("button", { name: /انتخاب مدل.*Kling/ }).click();
  const dialog = page.getByRole("dialog");
  await expect(
    dialog.getByText("رفرنس زیاد؟ ویدیوی بلند؟ این یکی کم نمیاره."),
  ).toBeVisible();
  await expect(dialog.locator('[data-model-mark="W"]')).toBeVisible();
  await expect(dialog.locator('[data-model-mark="x"]')).toBeVisible();
  await expect(dialog.locator('[data-model-mark="S"]')).toBeVisible();
  await expect(dialog.locator('[data-model-mark="A"]')).toBeVisible();
  await page.screenshot({ path: ".artifacts/video-model-picker-desktop.png" });
  const search = page.getByRole("searchbox", { name: "اسم مدل رو بزن…" });
  await search.fill("not-a-model");
  await expect(page.getByText("چیزی با این اسم پیدا نکردیم.")).toBeVisible();
  await search.fill("kling");
  await expect(
    page
      .getByRole("dialog")
      .getByRole("button", { name: /Kling 3.0 Standard/ }),
  ).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toBeHidden();
  expect(generations).toBe(0);
});

test("video studio stays usable on mobile with reduced motion", async ({
  page,
}) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.route(
    (url) => url.pathname.endsWith("/ai-registry/models"),
    (route) =>
      route.fulfill({
        json: [
          getModelSummary(),
          ...[
            "WAN_VIDEO_3_0",
            "GROK_IMAGINE_VIDEO",
            "SEEDANCE_2_5",
            "ALEPH_2_0",
          ].map((name, index) => ({
            ...getModelSummary(),
            uuid: `mobile-model-${index}`,
            name,
            display_name: name,
          })),
        ],
      }),
  );
  await page.emulateMedia({ reducedMotion: "reduce" });
  await openVideoGenerationPage(page);
  await expect(page.locator('[data-video-cinema="idle"]')).toBeInViewport();
  await page.screenshot({ path: ".artifacts/video-studio-mobile-intro.png" });
  const submitButton = page.locator("footer").getByRole("button", {
    name: "بسازش",
    exact: true,
  });
  await submitButton.scrollIntoViewIfNeeded();
  await expect(submitButton).toBeVisible();
  // Kling allows prompt OR multi-prompt. The schema validates the chosen alternative on submit.
  await expect(page.locator("[data-generation-intro]")).toHaveCSS(
    "animation-name",
    "none",
  );
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
  await page.evaluate(() => {
    document.querySelectorAll<HTMLElement>("*").forEach((element) => {
      if (element.scrollTop) element.scrollTop = 0;
    });
  });
  await page.screenshot({
    path: ".artifacts/video-studio-mobile.png",
    fullPage: true,
  });
  await page.getByRole("button", { name: /انتخاب مدل.*Kling/ }).click();
  await expect(
    page.getByRole("searchbox", { name: "اسم مدل رو بزن…" }),
  ).toBeVisible();
  const bounds = await page.getByRole("dialog").boundingBox();
  expect(bounds).not.toBeNull();
  expect(bounds!.x).toBeGreaterThanOrEqual(0);
  expect(bounds!.x + bounds!.width).toBeLessThanOrEqual(376);
  expect(bounds!.y + bounds!.height).toBeLessThanOrEqual(813);
  await expect(page.getByRole("dialog")).toHaveCSS("left", "0px");
  await expect(page.getByRole("dialog")).toHaveCSS("transform", "none");
  await page.screenshot({ path: ".artifacts/video-studio-mobile-models.png" });
  await page.setViewportSize({ width: 320, height: 568 });
  const dialog = page.getByRole("dialog");
  const listLayout = await dialog.evaluate((element) => {
    const list = element.lastElementChild;
    if (!list) return null;
    const dialogBounds = element.getBoundingClientRect();
    const listBounds = list.getBoundingClientRect();
    return {
      fits: listBounds.bottom <= dialogBounds.bottom - 18,
      scrolls: list.scrollHeight > list.clientHeight,
    };
  });
  expect(listLayout).toEqual({ fits: true, scrolls: true });
  const lastModel = dialog.getByRole("button", { name: "ALEPH_2_0" });
  await lastModel.scrollIntoViewIfNeeded();
  expect(
    await lastModel.evaluate((element) => {
      const listBounds = element.parentElement!.getBoundingClientRect();
      const modelBounds = element.getBoundingClientRect();
      return (
        modelBounds.top >= listBounds.top &&
        modelBounds.bottom <= listBounds.bottom
      );
    }),
  ).toBe(true);
  await page.screenshot({
    path: ".artifacts/video-model-picker-mobile-small.png",
  });
  for (const viewport of [
    { width: 667, height: 375 },
    { width: 768, height: 1024 },
    { width: 1440, height: 900 },
  ]) {
    await page.setViewportSize(viewport);
    expect(
      await dialog.evaluate((element) => {
        const list = element.lastElementChild;
        if (!list) return false;
        return (
          list.getBoundingClientRect().bottom <=
          element.getBoundingClientRect().bottom - 18
        );
      }),
    ).toBe(true);
    if (viewport.width === 768) {
      await page.screenshot({
        path: ".artifacts/video-model-picker-tablet.png",
      });
    }
  }
});

test.describe("video model picker on iPhone", () => {
  test.use({
    viewport: devices["iPhone 13"].viewport,
    deviceScaleFactor: devices["iPhone 13"].deviceScaleFactor,
    isMobile: true,
    hasTouch: true,
    userAgent: devices["iPhone 13"].userAgent,
  });

  test("opens entirely within the mobile viewport", async ({ page }) => {
    await openVideoGenerationPage(page);
    await page.getByRole("button", { name: /Kling/ }).click();
    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible();
    const bounds = await dialog.boundingBox();
    expect(bounds).not.toBeNull();
    expect(bounds!.x).toBeGreaterThanOrEqual(-1);
    expect(bounds!.x + bounds!.width).toBeLessThanOrEqual(391);
    await page.screenshot({ path: ".artifacts/video-model-picker-iphone.png" });
  });
});

test("updates visible video prompt fields when the generation mode changes", async ({
  page,
}) => {
  await openVideoGenerationPage(page);

  await expect(page.getByPlaceholder(VIDEO_PROMPT_PLACEHOLDER)).toBeVisible();
  const textMode = page.getByRole("radio", { name: "متن به ویدیو" });
  await expect(textMode).toBeVisible();
  await expect(page.getByRole("button", { name: /^رزولوشن:/ })).toHaveText(
    "720p",
  );
  await expect(page.getByRole("button", { name: /^نسبت تصویر:/ })).toHaveText(
    "16:9",
  );
  await expect(page.getByRole("slider", { name: "مدت زمان" })).toBeVisible();
  await page.getByText("ریزکاری‌های بیشتر", { exact: true }).click();
  await expect(page.getByText("تولید صدا", { exact: true })).toBeVisible();
  await expect(page.getByText("تصاویر فریم")).toBeHidden();

  await expect(page.getByRole("dialog")).toBeHidden();

  await textMode.focus();
  await page.keyboard.press("ArrowLeft");
  await page.screenshot({ path: ".artifacts/video-studio-references.png" });
  await expect(
    page.getByRole("radio", { name: "عکس به ویدیو" }),
  ).toHaveAttribute("aria-checked", "true");

  await expect(
    page.getByRole("heading", { name: "تصاویر فریم" }),
  ).toBeVisible();
  await expect(page.getByRole("combobox", { name: "وضوح تصویر" })).toBeHidden();
  await expect(page.getByRole("combobox", { name: "قاب تصویر" })).toBeHidden();
  await expect(page.getByText("ویدیوی مرجع", { exact: true })).toBeHidden();

  await page.getByRole("button", { name: "کنترل حرکت" }).click();

  await expect(
    page.getByRole("heading", { name: "ویدیوی مرجع" }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "تصاویر مرجع" }),
  ).toBeVisible();
  await expect(page.getByRole("heading", { name: "تصاویر فریم" })).toBeHidden();
  await expect(
    page.getByPlaceholder("بگو کاراکتر چطور حرکت ویدیوی مرجع رو دنبال کنه…"),
  ).toBeVisible();
});

test("shows the generation rules from the prompt box help button", async ({
  page,
}) => {
  await openVideoGenerationPage(page);

  await page.getByRole("button", { name: "راهنمای قوانین تولید" }).click();

  const dialog = page.getByRole("dialog", { name: "قوانین مهم تولید" });
  await expect(dialog).toBeVisible();
  await expect(dialog.getByText("محتوای ممنوعه")).toBeVisible();
  await expect(dialog.getByText("وضعیت توکن و زمان پردازش")).toBeVisible();
  await expect(
    dialog.getByRole("link", { name: "مشاهده قوانین کامل" }),
  ).toHaveAttribute("href", "https://perpixai.ir/terms/");
});

test("loads mode config from the model detail without the removed generation-config endpoint", async ({
  page,
}) => {
  let legacyGenerationConfigRequestCount = 0;
  page.on("request", (request) => {
    if (new URL(request.url()).pathname.endsWith("/generation-config")) {
      legacyGenerationConfigRequestCount += 1;
    }
  });
  await page.route(
    (url) => url.pathname === `/api/v1/ai-registry/models/${MODEL_UUID}`,
    async (route) => {
      await route.fulfill({
        contentType: "application/json",
        body: JSON.stringify({
          ...getModelSummary(),
          modes: {
            text_to_video: {
              value: "text_to_video",
              provider_uuid: RUNWARE_PROVIDER_UUID,
              config_schema: {
                type: "object",
                required: ["prompt", "duration"],
                properties: {
                  prompt: { type: "string", minLength: 3 },
                  duration: { type: "integer", default: 5 },
                },
              },
            },
            image_to_video: {
              value: "image_to_video",
              provider_uuid: RUNWARE_PROVIDER_UUID,
              config_schema: {
                type: "object",
                required: ["prompt", "frame_images"],
                properties: {
                  prompt: { type: "string", minLength: 3 },
                  frame_images: {
                    type: "array",
                    items: { type: "string" },
                    "x-file": { type: "list", accept: ["image/png"] },
                  },
                },
              },
            },
          },
          canonical_ui_schema: {
            elements: [
              {
                type: "Control",
                label: "پرامپت",
                scope: "#/properties/prompt",
                options: { widget: "textarea" },
              },
              {
                type: "Control",
                label: "تصاویر فریم",
                scope: "#/properties/frame_images",
                options: {
                  widget: "file-list",
                  file: { type: "list", accept: ["image/png"] },
                },
              },
            ],
            selectors: [
              {
                field: "mod",
                label: "حالت تولید",
                widget: "select",
                required: true,
                options: [
                  {
                    label: "تبدیل متن به ویدیو",
                    order: 1,
                    value: "text_to_video",
                  },
                  {
                    label: "تبدیل تصویر به ویدیو",
                    order: 2,
                    value: "image_to_video",
                  },
                ],
              },
            ],
          },
        }),
      });
    },
  );

  await openVideoGenerationPage(page);

  await expect(page.getByPlaceholder(VIDEO_PROMPT_PLACEHOLDER)).toBeVisible();
  await expect(page.getByRole("radio", { name: "متن به ویدیو" })).toBeVisible();
  expect(legacyGenerationConfigRequestCount).toBe(0);
});

test("submits text-to-video prompt values with the selected model", async ({
  page,
}) => {
  const generateRequest = waitForGenerateRequest(page);

  await openVideoGenerationPage(page);
  await expect(
    page.getByRole("combobox", { name: "ارائه‌دهنده هوش مصنوعی" }),
  ).toHaveCount(0);
  const promptInput = page.getByPlaceholder(VIDEO_PROMPT_PLACEHOLDER);
  const submitButton = page.locator('button[type="submit"]');

  await expect(submitButton).toBeDisabled();
  await promptInput.fill("N");
  await expect(submitButton).toBeDisabled();
  await promptInput.fill("A cinematic city shot");
  await expect(submitButton).toBeEnabled();
  await submitButton.click();

  const body = await generateRequest;

  expect(body.ai_model_uuid).toBe(MODEL_UUID);
  expect(body.task_type).toBe("VIDEO");
  expect(body).not.toHaveProperty("ai_provider_uuid");
  expect(body.ai_model_config).toMatchObject({
    duration: 5,
    generate_audio: true,
    mode: "text_to_video",
    prompt: "A cinematic city shot",
    resolution: "720p",
  });
});

test("accepts a selected video duration and submits it as a number", async ({
  page,
}) => {
  const generateRequest = waitForGenerateRequest(page);
  await openVideoGenerationPage(page);

  const duration = page.getByRole("slider", { name: "مدت زمان" });
  await selectDurationIndex(duration, 7);
  await expect(duration).toHaveAttribute("aria-valuetext", "10 ثانیه");
  await page
    .getByPlaceholder(VIDEO_PROMPT_PLACEHOLDER)
    .fill("A cinematic city shot");

  await expect(page.getByText("مقدار انتخاب شده معتبر نیست")).toHaveCount(0);
  await page.locator('button[type="submit"]').click();
  expect((await generateRequest).ai_model_config.duration).toBe(10);
});

test("image studio fits a viewport with long sidebar history without generating", async ({
  page,
}) => {
  await mockNanoBananaApi(page);
  await page.route("**/ai-task/generate", (route) => route.abort());
  await page.setViewportSize({ width: 1920, height: 900 });
  await page.goto("/generation/image");
  await expect(page.getByTestId("studio-logo")).toBeVisible();
  await page.locator("aside nav").evaluate((nav) => {
    const history = document.createElement("div");
    history.style.minHeight = "1800px";
    history.textContent = "Long task history regression fixture";
    nav.append(history);
  });
  for (const size of [
    { width: 1920, height: 900 },
    { width: 1366, height: 660 },
    { width: 1280, height: 720 },
  ]) {
    await page.setViewportSize(size);
    const area = await page
      .locator('main > [data-slot="scroll-area"]')
      .boundingBox();
    expect(area!.height).toBeLessThanOrEqual(size.height);
    const submit = await page
      .getByRole("button", { name: /ساخت تصویر/ })
      .boundingBox();
    expect(submit!.y + submit!.height).toBeLessThanOrEqual(size.height);
  }
  await page.setViewportSize({ width: 1920, height: 900 });
  await page.screenshot({
    path: ".artifacts/release-readiness/image-studio-long-history.png",
  });
  const sidebarScrolls = await page.locator("aside > div").evaluate((el) => {
    el.scrollTop = 100;
    return el.scrollTop > 0;
  });
  expect(sidebarScrolls).toBe(true);
});

test("image studio neural preview animates and respects reduced motion without generating", async ({
  page,
}) => {
  await mockNanoBananaApi(page);
  let generateRequests = 0;
  await page.route("**/ai-task/generate", (route) => {
    generateRequests += 1;
    return route.abort();
  });
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/generation/image");
  const logo = page.getByTestId("studio-logo");
  await expect(logo).toBeVisible();
  await expect(logo.locator("svg line")).toHaveCount(15);
  await expect
    .poll(() =>
      logo.evaluate(
        (el) =>
          el
            .getAnimations({ subtree: true })
            .filter((animation) => animation.playState === "running").length,
      ),
    )
    .toBeGreaterThan(0);
  await expect(logo.locator("img")).toBeVisible();
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect
    .poll(() =>
      logo.evaluate((el) => el.getAnimations({ subtree: true }).length),
    )
    .toBe(0);
  await expect(logo.locator("img")).toBeVisible();
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await expect
    .poll(() =>
      logo.evaluate(
        (el) =>
          el
            .getAnimations({ subtree: true })
            .filter((animation) => animation.playState === "running").length,
      ),
    )
    .toBeGreaterThan(0);
  expect(generateRequests).toBe(0);
});

test("image studio searches models without generating", async ({ page }) => {
  await mockNanoBananaApi(page);
  let generateRequests = 0;
  await page.route("**/ai-task/generate", async (route) => {
    generateRequests += 1;
    await route.abort();
  });

  await page.goto("/generation/image");
  const model = page.getByRole("combobox").filter({ hasText: /Nano Banana/ });
  await page.screenshot({
    path: ".artifacts/release-readiness/image-studio-loading.png",
    fullPage: true,
  });
  await expect(model).toBeVisible();
  const logo = page.getByTestId("studio-logo");
  await expect(logo).toBeVisible();
  await expect(logo.locator("img")).toBeVisible();
  for (const size of [
    { width: 1920, height: 900 },
    { width: 1366, height: 660 },
    { width: 1280, height: 720 },
  ]) {
    await page.setViewportSize(size);
    const box = await page
      .getByRole("button", { name: /ساخت تصویر/ })
      .boundingBox();
    expect(box).not.toBeNull();
    expect(box!.y + box!.height).toBeLessThanOrEqual(size.height);
  }
  await model.click();
  const search = page.getByPlaceholder("جست‌وجوی مدل…");
  await search.fill("missing-model");
  await expect(page.getByRole("option", { name: /Nano Banana/ })).toBeHidden();
  await search.fill("Nano");
  await page.getByRole("option", { name: /Nano Banana/ }).click();
  await page
    .getByRole("textbox", { name: "توصیف تصویر", exact: true })
    .fill("A cinematic portrait");
  await expect(page.getByRole("button", { name: /ساخت تصویر/ })).toBeEnabled();
  await page.screenshot({
    path: ".artifacts/release-readiness/image-studio-desktop.png",
    fullPage: true,
  });
  await page.setViewportSize({ width: 390, height: 844 });
  const sidebar = page.locator('[data-slot="sheet-content"]');
  await expect(sidebar).toBeVisible();
  await sidebar.getByRole("button", { name: "Close", exact: true }).click();
  await expect(sidebar).toBeHidden();
  await expect(model).toBeVisible();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
  await page.screenshot({
    path: ".artifacts/release-readiness/image-studio-mobile.png",
    fullPage: true,
  });
  expect(generateRequests).toBe(0);
});

test("image studio switches schema-specific simple settings without generating", async ({
  page,
}) => {
  await mockNanoBananaApi(page);
  const original = getNanoBananaModelDetail();
  const alternate = {
    ...original,
    uuid: MODEL_UUID,
    name: "OPEN_AI_TEST_IMAGE",
    display_name: "Schema test model",
    modes: {
      text_to_image: {
        ...original.modes.text_to_image,
        config_schema: {
          type: "object",
          required: ["prompt"],
          additionalProperties: false,
          properties: {
            prompt: { type: "string" },
            quality: {
              type: "string",
              enum: ["standard", "high"],
              default: "standard",
            },
            seed: { type: "integer", minimum: 0, default: 7 },
          },
        },
      },
    },
    canonical_ui_schema: {
      elements: [
        ...original.canonical_ui_schema.elements.slice(0, 1),
        { type: "Control", scope: "#/properties/quality", label: "Quality" },
        { type: "Control", scope: "#/properties/seed", label: "Seed" },
      ],
    },
  };
  await page.route(
    (url) => url.pathname.endsWith("/ai-registry/models"),
    (route) => route.fulfill({ json: [original, alternate] }),
  );
  await page.route(
    (url) => url.pathname.endsWith(`/ai-registry/models/${MODEL_UUID}`),
    (route) => route.fulfill({ json: alternate }),
  );
  let requests = 0;
  await page.route("**/ai-task/generate", (route) => {
    requests += 1;
    return route.abort();
  });
  await page.goto("/generation/image");
  await page
    .getByRole("combobox")
    .filter({ hasText: /Nano Banana/ })
    .click();
  await page.getByRole("option", { name: /Schema test model/ }).click();
  await expect(page.getByText("قاب تصویر", { exact: true })).toBeHidden();
  await page.getByRole("button", { name: /تنظیمات/ }).click();
  await expect(page.getByText("کیفیت تصویر", { exact: true })).toBeVisible();
  await expect(page.getByText("کد تکرار نتیجه", { exact: true })).toBeHidden();
  expect(requests).toBe(0);
});

test("switches Nano Banana image modes when references are added and removed", async ({
  page,
}) => {
  await mockNanoBananaApi(page);
  await page.route("**/file-manager/user-files**", (route) =>
    route.fulfill({
      json: {
        files: [
          {
            uuid: "reference-1",
            file_name: "reference.png",
            file_size: 1024,
            content_type: "image/png",
            is_public: false,
          },
        ],
        has_next: false,
      },
    }),
  );
  await page.route("**/file-manager/files/presigned-urls", (route) =>
    route.fulfill({
      json: {
        files: [
          {
            file_uuid: "reference-1",
            preview_url: "http://localhost:5173/android-chrome-512x512.png",
            download_url: "http://localhost:5173/android-chrome-512x512.png",
            expire_at: new Date(Date.now() + 3_600_000).toISOString(),
          },
        ],
      },
    }),
  );
  const generateRequest = waitForGenerateRequest(page);

  await page.goto("/generation/image");
  const references = page.locator("[data-generation-mode]");
  await expect(references).toHaveAttribute("data-generation-mode", "text_to_image");
  await references.getByRole("button", { name: "افزودن عکس", exact: true }).click();
  const picker = page.getByRole("dialog", { name: "افزودن عکس" });
  await picker.getByRole("button", { name: /reference\.png/ }).click();
  await picker.getByRole("button", { name: /افزودن 1 عکس/ }).click();
  await expect(references).toHaveAttribute("data-generation-mode", "image_to_image");
  await references.getByRole("button", { name: "حذف تصویر مرجع 1" }).click();
  await expect(references).toHaveAttribute("data-generation-mode", "text_to_image");
  await page
    .getByRole("textbox", { name: "توصیف تصویر", exact: true })
    .fill("A quiet mountain lake");
  await page.locator('button[type="submit"]').click();

  await expect(generateRequest).resolves.toMatchObject({
    ai_model_uuid: NANO_MODEL_UUID,
    task_type: "IMAGE",
    ai_model_config: {
      aspect_ratio: "auto",
      mode: "text_to_image",
      prompt: "A quiet mountain lake",
    },
  });
});

test("refetches model metadata after an unclassified application failure", async ({
  page,
}) => {
  let modelDetailRequestCount = 0;
  await page.route("**/*", async (route) => {
    const request = route.request();
    const url = new URL(request.url());
    if (
      request.method() === "GET" &&
      url.pathname === `/api/v1/ai-registry/models/${MODEL_UUID}`
    ) {
      modelDetailRequestCount += 1;
      await route.fallback();
      return;
    }
    if (
      request.method() !== "POST" ||
      url.pathname !== "/api/v1/ai-task/generate"
    ) {
      await route.fallback();
      return;
    }
    await fulfillApplicationError(route, 422, "provider target leaked");
  });

  await openVideoGenerationPage(page);
  await page.getByPlaceholder(VIDEO_PROMPT_PLACEHOLDER).fill("A valid prompt");
  await page.locator('button[type="submit"]').click();

  await expect.poll(() => modelDetailRequestCount).toBeGreaterThan(1);
  await expect(page.getByText("provider target leaked")).toBeHidden();
});

test("does not lock the form for an unmapped application error", async ({
  page,
}) => {
  await mockGenerateApplicationError(page, 503, "raw provider error");
  await openVideoGenerationPage(page);
  const prompt = page.getByPlaceholder(VIDEO_PROMPT_PLACEHOLDER);
  await prompt.fill("A valid prompt");
  await page.locator('button[type="submit"]').click();

  await expect(prompt).toBeEnabled();
  await expect(page.locator('button[type="submit"]')).toBeEnabled();
  await expect(page.getByText("raw provider error")).toBeHidden();
});

test("connects canonical validation paths to form fields without leaking provider targets", async ({
  page,
}) => {
  await mockGenerateApplicationError(page, 422, [
    { loc: "prompt", msg: "providerPayload.promptText is invalid" },
  ]);
  await openVideoGenerationPage(page);
  await page.getByPlaceholder(VIDEO_PROMPT_PLACEHOLDER).fill("A valid prompt");
  await page.locator('button[type="submit"]').click();

  await expect(page.getByText("مقدار این فیلد معتبر نیست")).toBeVisible();
  await expect(page.getByText(/providerPayload\.promptText/)).toBeHidden();
});

test("supports multi-prompt mode without requiring the main prompt field", async ({
  page,
}) => {
  const generateRequest = waitForGenerateRequest(page);

  await openVideoGenerationPage(page);
  await page.getByText("ریزکاری‌های بیشتر", { exact: true }).click();
  await page.getByRole("button", { name: /پرامپت چندبخشی/ }).click();

  await expect(page.getByPlaceholder(VIDEO_PROMPT_PLACEHOLDER)).toBeHidden();

  await page.getByRole("textbox", { name: "پرامپت بخش" }).fill("Opening shot");
  await page.getByRole("spinbutton", { name: "مدت بخش" }).fill("5");
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toBeHidden();
  await page.locator('button[type="submit"]').click();

  const body = await generateRequest;

  expect(body.ai_model_config.prompt).toBeUndefined();
  expect(body.ai_model_config).toMatchObject({
    duration: 5,
    mode: "text_to_video",
    multi_prompt: [{ prompt: "Opening shot", duration: 5 }],
  });
});

test("shows the generation failure reason and retries it in the same chat", async ({
  page,
}) => {
  const failedMessage = {
    ai_model_config: { mode: "text_to_video", prompt: "Retry this video" },
    ai_model_uuid: MODEL_UUID,
    ai_provider_uuid: "provider-1",
    ai_generation_request_uuid: "request-1",
    ai_external_provider_task_id: "external-task-1",
    task_status: "FAILED",
    cost_usdmicro: null,
    message: "PROVIDER_RATE_LIMITED",
    role: "ASSISTANT",
    uuid: "failed-message-1",
  };
  const retryRequest = waitForGenerateRequest(page);

  await mockApi(page, [failedMessage]);
  await page.goto("/generation/video/task-1");

  await expect(
    page.getByText("این ویدیو ساخته نشد", { exact: true }),
  ).toBeVisible();
  await expect(page.getByText("PROVIDER_RATE_LIMITED")).toBeVisible();
  await expect(page.getByPlaceholder(VIDEO_PROMPT_PLACEHOLDER)).toHaveValue(
    "Retry this video",
  );
  await page
    .getByRole("alert")
    .getByRole("button", { name: "دوباره امتحان کن" })
    .click();

  await expect(retryRequest).resolves.toMatchObject({
    task_uuid: "task-1",
    task_type: "VIDEO",
    ai_model_uuid: MODEL_UUID,
    ai_model_config: failedMessage.ai_model_config,
  });
});

test("prevents another generation while the chat has a pending request", async ({
  page,
}) => {
  await mockApi(page, [
    {
      ai_model_config: {
        mode: "text_to_video",
        prompt: "Still rendering",
        aspect_ratio: "9:16",
      },
      ai_model_uuid: MODEL_UUID,
      ai_provider_uuid: "provider-1",
      ai_generation_request_uuid: "request-1",
      ai_external_provider_task_id: "external-task-1",
      task_status: "IN_PROGRESS",
      cost_usdmicro: null,
      message: null,
      role: "ASSISTANT",
      uuid: "pending-message-1",
    },
  ]);

  await page.goto("/generation/video/task-1");

  await expect(page.getByPlaceholder(VIDEO_PROMPT_PLACEHOLDER)).toHaveValue(
    "Still rendering",
  );
  await expect(
    page.getByRole("button", { name: /انتخاب مدل.*Kling 3\.0 Standard/ }),
  ).toBeVisible();
  await expect(page.locator('button[type="submit"]')).toBeDisabled();
  await expect(page.locator('button[type="submit"]')).toBeInViewport();
  await expect(
    page.getByText("ایده‌ات رفته پشت دوربین", { exact: true }),
  ).toBeVisible();
  const portal = page.locator("[data-video-generation-portal]");
  const portalBounds = await portal.boundingBox();
  const titleBounds = await portal
    .getByText("این برداشت، توی راهه.")
    .boundingBox();
  const frameBounds = await portal
    .locator("[data-video-preview-frame]")
    .boundingBox();
  expect(portalBounds).not.toBeNull();
  expect(titleBounds).not.toBeNull();
  expect(frameBounds).not.toBeNull();
  expect(portalBounds!.width).toBeGreaterThan(400);
  expect(frameBounds!.height).toBeGreaterThan(frameBounds!.width);
  expect(titleBounds!.x).toBeGreaterThanOrEqual(portalBounds!.x);
  expect(titleBounds!.x + titleBounds!.width).toBeLessThanOrEqual(
    portalBounds!.x + portalBounds!.width,
  );
  const cinema = portal.locator('[data-video-cinema="rendering"]');
  await cinema.scrollIntoViewIfNeeded();
  await cinema.getByRole("button", { name: "توقف انیمیشن" }).click();
  await expect(cinema).toHaveAttribute("data-paused", "true");
  await cinema.getByRole("button", { name: "ادامه انیمیشن" }).click();
  await expect(cinema).toHaveAttribute("data-paused", "false");
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(cinema.getByRole("button")).toBeHidden();
  await expect(portal.locator("[data-video-preview-frame]")).toHaveCSS(
    "animation-name",
    "none",
  );
  await portal.screenshot({ path: ".artifacts/video-studio-rendering.png" });
  await page.evaluate(() => {
    document.querySelectorAll<HTMLElement>("*").forEach((element) => {
      if (element.scrollTop) element.scrollTop = 0;
    });
  });
  await page.screenshot({
    path: ".impeccable/review/video-pending-desktop.png",
    fullPage: true,
  });
  await page.setViewportSize({ width: 375, height: 812 });
  await page.getByRole("button", { name: "Close", exact: true }).click();
  await expect(portal).toBeVisible();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await portal.screenshot({
    path: ".artifacts/video-studio-rendering-mobile.png",
  });
  await page.evaluate(() => {
    document.querySelectorAll<HTMLElement>("*").forEach((element) => {
      if (element.scrollTop) element.scrollTop = 0;
    });
  });
  await page.screenshot({
    path: ".impeccable/review/video-pending-mobile.png",
    fullPage: true,
  });
});

test("does not restore the prompt after a successful generation", async ({
  page,
}) => {
  await mockApi(page, [
    {
      ai_model_config: { mode: "text_to_video", prompt: "Completed video" },
      ai_model_uuid: MODEL_UUID,
      ai_provider_uuid: "provider-1",
      ai_generation_request_uuid: "request-1",
      ai_external_provider_task_id: "external-task-1",
      task_status: "SUCCESS",
      cost_usdmicro: null,
      message: null,
      role: "ASSISTANT",
      uuid: "successful-message-1",
    },
  ]);

  await page.goto("/generation/video/task-1");

  await expect(page.getByPlaceholder(VIDEO_PROMPT_PLACEHOLDER)).toHaveValue("");
});

test("uses the last assistant message when a user message follows it", async ({
  page,
}) => {
  await mockApi(page, [
    {
      ai_model_config: { mode: "text_to_video", prompt: "Assistant prompt" },
      ai_model_uuid: MODEL_UUID,
      ai_provider_uuid: "provider-1",
      ai_generation_request_uuid: "request-1",
      ai_external_provider_task_id: "external-task-1",
      task_status: "IN_PROGRESS",
      cost_usdmicro: null,
      message: null,
      role: "ASSISTANT",
      uuid: "assistant-message-1",
    },
    {
      ai_model_config: { mode: "text_to_video", prompt: "User prompt" },
      ai_model_uuid: MODEL_UUID,
      ai_provider_uuid: "provider-1",
      ai_generation_request_uuid: null,
      ai_external_provider_task_id: null,
      task_status: "SUCCESS",
      cost_usdmicro: 0,
      message: "User prompt",
      role: "USER",
      uuid: "user-message-1",
    },
  ]);

  await page.goto("/generation/video/task-1");

  await expect(page.getByPlaceholder(VIDEO_PROMPT_PLACEHOLDER)).toHaveValue(
    "Assistant prompt",
  );
});

async function openVideoGenerationPage(page: Page) {
  await page.goto("/generation/video", { waitUntil: "domcontentloaded" });
  await expect(page.getByPlaceholder(VIDEO_PROMPT_PLACEHOLDER)).toBeVisible({
    timeout: 20_000,
  });
  await expect(
    page.getByRole("button", { name: /انتخاب مدل.*Kling 3.0 Standard/ }),
  ).toBeVisible();
}

async function selectDurationIndex(duration: Locator, index: number) {
  await duration.focus();
  await duration.press("Home");
  await duration.press("ArrowRight");
  const incrementKey =
    (await duration.inputValue()) === "1" ? "ArrowRight" : "ArrowLeft";
  await duration.press("Home");
  for (let step = 0; step < index; step += 1) {
    await duration.press(incrementKey);
  }
}

function waitForGenerateRequest(page: Page) {
  return page
    .waitForRequest(
      (request) =>
        request.method() === "POST" &&
        new URL(request.url()).pathname === "/api/v1/ai-task/generate",
    )
    .then((request) => request.postDataJSON());
}

async function mockGenerateApplicationError(
  page: Page,
  httpStatus: number,
  detail: unknown,
) {
  await page.route("**/ai-task/generate", async (route) => {
    await fulfillApplicationError(route, httpStatus, detail);
  });
}

async function fulfillApplicationError(
  route: Route,
  httpStatus: number,
  detail: unknown,
) {
  await route.fulfill({
    status: httpStatus,
    contentType: "application/json",
    body: JSON.stringify({ detail }),
  });
}

async function mockApi(page: Page, taskMessages: unknown[] = []) {
  await page.route("https://widget.ila.chat/**", async (route) => {
    await route.fulfill({
      contentType: "application/javascript",
      body: "",
    });
  });

  await page.route("**/*", async (route) => {
    const request = route.request();
    const url = new URL(request.url());

    if (
      request.method() === "GET" &&
      url.pathname === "/api/v1/user/get-info"
    ) {
      await route.fulfill({
        contentType: "application/json",
        body: JSON.stringify({ uuid: "user-1", mobile: "09120000000" }),
      });
      return;
    }

    if (
      request.method() === "GET" &&
      url.pathname === "/api/v1/user/subscription/active"
    ) {
      await route.fulfill({
        contentType: "application/json",
        body: JSON.stringify({
          uuid: "subscription-1",
          plan: {
            uuid: "plan-1",
            name: "pro",
            display_name: "Pro",
            description: null,
            scopes: ["ai_task:write"],
            allowed_models: ["KLINGAI_VIDEO_3_0_STANDARD"],
            price_usdmicro: 0,
            duration_days: 30,
            balance_gift_amount_usdmicro: null,
            meta: {},
          },
        }),
      });
      return;
    }

    if (
      request.method() === "GET" &&
      url.pathname === "/api/v1/user/subscription/plans"
    ) {
      await route.fulfill({
        contentType: "application/json",
        body: JSON.stringify([]),
      });
      return;
    }

    if (
      request.method() === "GET" &&
      url.pathname === "/api/v1/wallet/wallet"
    ) {
      await route.fulfill({
        contentType: "application/json",
        body: JSON.stringify({
          wallet_uuid: "wallet-1",
          balance_usdmicro: 1_000_000,
        }),
      });
      return;
    }

    if (request.method() === "GET" && url.pathname === "/api/v1/ai-task/list") {
      await route.fulfill({
        contentType: "application/json",
        body: JSON.stringify({ items: [], has_next: false }),
      });
      return;
    }

    if (
      request.method() === "POST" &&
      url.pathname === "/api/v1/ai-task/generate"
    ) {
      await route.fulfill({
        contentType: "application/json",
        body: JSON.stringify({
          uuid: "task-1",
          task_type: "VIDEO",
          expire_date: new Date().toISOString(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          messages: [],
        }),
      });
      return;
    }

    if (
      request.method() === "GET" &&
      url.pathname === "/api/v1/ai-task/task-1"
    ) {
      await route.fulfill({
        contentType: "application/json",
        body: JSON.stringify({
          uuid: "task-1",
          task_type: "VIDEO",
          expire_date: new Date().toISOString(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          messages: taskMessages,
        }),
      });
      return;
    }

    if (
      request.method() === "GET" &&
      url.pathname === "/api/v1/ai-registry/models"
    ) {
      await route.fulfill({
        contentType: "application/json",
        body: JSON.stringify([getModelSummary()]),
      });
      return;
    }

    if (
      request.method() === "GET" &&
      url.pathname === `/api/v1/ai-registry/models/${MODEL_UUID}`
    ) {
      await route.fulfill({
        contentType: "application/json",
        body: JSON.stringify({
          ...getModelDetail(),
        }),
      });
      return;
    }

    // Fail closed: only local static development assets may reach the network.
    if (
      url.origin === "http://localhost:5173" &&
      request.method() === "GET" &&
      !["fetch", "xhr"].includes(request.resourceType()) &&
      !url.pathname.startsWith("/api/")
    ) {
      await route.continue();
      return;
    }
    await route.abort("blockedbyclient");
  });
}

function getModelSummary() {
  return {
    uuid: MODEL_UUID,
    model_owner: "K_LING_AI",
    name: "KLINGAI_VIDEO_3_0_STANDARD",
    display_name: "Kling 3.0 Standard",
    description: "Kling video model",
    icon_url: null,
    tags: ["video"],
    supported_inputs: ["TEXT", "IMAGE", "VIDEO", "AUDIO"],
    supported_outputs: ["VIDEO"],
    min_cost: 252_000,
    max_cost: 1_890_000,
  };
}

function getModelDetail() {
  const modeValues = [
    "text_to_video",
    "image_to_video",
    "motion_control",
  ] as const;
  const modeLabels = {
    text_to_video: "متن به ویدیو",
    image_to_video: "عکس به ویدیو",
    motion_control: "کنترل حرکت",
  };
  const uiSchema = klingVideoConfigMeta.uischema;
  const elements = uiSchema && "elements" in uiSchema ? uiSchema.elements : [];

  return {
    ...getModelSummary(),
    modes: Object.fromEntries(
      modeValues.map((mode) => [
        mode,
        {
          value: mode,
          provider_uuid: RUNWARE_PROVIDER_UUID,
          config_schema: klingVideoConfigSchema,
        },
      ]),
    ),
    canonical_ui_schema: {
      elements,
      selectors: [
        {
          field: "mod",
          label: "حالت تولید",
          widget: "switch",
          required: true,
          options: modeValues.map((mode, index) => ({
            label: modeLabels[mode],
            order: index + 1,
            value: mode,
          })),
        },
      ],
    },
  };
}

async function mockNanoBananaApi(page: Page) {
  const model = getNanoBananaModelDetail();

  await page.route("**/user/subscription/active", async (route) => {
    await route.fulfill({
      contentType: "application/json",
      body: JSON.stringify({
        uuid: "subscription-1",
        plan: {
          uuid: "plan-1",
          name: "pro",
          display_name: "Pro",
          scopes: ["ai_task:write"],
          allowed_models: [model.name],
          meta: {},
        },
      }),
    });
  });
  await page.route(
    (url) => url.pathname === "/api/v1/ai-registry/models",
    async (route) => {
      await route.fulfill({
        contentType: "application/json",
        body: JSON.stringify([model]),
      });
    },
  );
  await page.route(
    (url) => url.pathname === `/api/v1/ai-registry/models/${NANO_MODEL_UUID}`,
    async (route) => {
      await route.fulfill({
        contentType: "application/json",
        body: JSON.stringify(model),
      });
    },
  );
}

function getNanoBananaModelDetail() {
  const prompt = { type: "string", minLength: 3, maxLength: 3000 };
  const aspectRatio = {
    type: "string",
    enum: ["1:1", "16:9", "9:16", "auto"],
    default: "auto",
  };

  return {
    uuid: NANO_MODEL_UUID,
    model_owner: "GOOGLE",
    name: "GOOGLE_NANO_BANANA_2_LITE",
    display_name: "Nano Banana 2 Lite",
    description: "Google image generation model",
    icon_url: null,
    tags: [],
    supported_inputs: ["TEXT", "IMAGE"],
    supported_outputs: ["IMAGE"],
    min_cost: 20_000,
    max_cost: 33_603,
    modes: {
      text_to_image: {
        value: "text_to_image",
        provider_uuid: "9a6d5ea1-5276-4d7c-b445-d2e4dc2b4ee5",
        config_schema: {
          type: "object",
          required: ["aspect_ratio", "prompt"],
          properties: { prompt, aspect_ratio: aspectRatio },
          additionalProperties: false,
        },
      },
      image_to_image: {
        value: "image_to_image",
        provider_uuid: "9a6d5ea1-5276-4d7c-b445-d2e4dc2b4ee5",
        config_schema: {
          type: "object",
          required: ["aspect_ratio", "prompt", "reference_images"],
          properties: {
            prompt,
            aspect_ratio: aspectRatio,
            reference_images: {
              type: "array",
              minItems: 1,
              maxItems: 10,
              items: { type: "string" },
            },
          },
          additionalProperties: false,
        },
      },
    },
    canonical_ui_schema: {
      elements: [
        {
          type: "Control",
          label: "پرامپت",
          scope: "#/properties/prompt",
          options: { widget: "textarea" },
        },
        {
          type: "Control",
          label: "تصاویر مرجع",
          scope: "#/properties/reference_images",
          options: {
            widget: "file-list",
            file: {
              type: "list",
              accept: ["image/png", "image/jpeg", "image/webp"],
            },
          },
        },
        {
          type: "Control",
          label: "نسبت تصویر",
          scope: "#/properties/aspect_ratio",
          options: { widget: "select" },
        },
      ],
      selectors: [
        {
          field: "mod",
          label: "نوع عملیات",
          widget: "select",
          required: true,
          options: [
            {
              label: "تبدیل متن به تصویر",
              order: 1,
              value: "text_to_image",
            },
            {
              label: "تبدیل تصویر به تصویر",
              order: 2,
              value: "image_to_image",
            },
          ],
        },
      ],
    },
  };
}

test("Seedance duration is selectable except in automatic video editing", async ({
  page,
}) => {
  const config = JSON.parse(
    readFileSync(
      new URL("./fixtures/seedance-video-config.json", import.meta.url),
      "utf8",
    ),
  );
  await page.route(`**/ai-registry/models/${MODEL_UUID}`, async (route) => {
    await route.fulfill({ json: { ...getModelDetail(), ...config } });
  });
  await openVideoGenerationPage(page);
  const duration = page.getByRole("slider", { name: "مدت زمان" });
  await expect(duration).toBeVisible();
  await selectDurationIndex(duration, 2);
  await expect(duration).toHaveAttribute("aria-valuetext", "6 ثانیه");
  await page.getByRole("button", { name: "ویرایش ویدیو", exact: true }).click();
  await expect(duration).toHaveCount(0);
  await page.getByRole("radio", { name: "ادامه ویدیو" }).click();
  await expect(duration).toBeVisible();
});

test("uses model-specific duration bounds and compact format choices", async ({
  page,
}) => {
  const config = JSON.parse(
    readFileSync(
      new URL("./fixtures/seedance-video-config.json", import.meta.url),
      "utf8",
    ),
  );
  config.modes.text_to_video.config_schema.properties.duration = {
    default: 5,
    minimum: 3,
    maximum: 12,
    type: "integer",
  };
  await page.route(`**/ai-registry/models/${MODEL_UUID}`, async (route) => {
    await route.fulfill({ json: { ...getModelDetail(), ...config } });
  });
  const generateRequest = waitForGenerateRequest(page);
  await openVideoGenerationPage(page);

  const duration = page.getByRole("slider", { name: "مدت زمان" });
  await expect(duration).toHaveAttribute("min", "3");
  await expect(duration).toHaveAttribute("max", "12");
  await duration.focus();
  await duration.press("End");
  await expect(duration).toHaveAttribute("aria-valuetext", "12 ثانیه");

  await page.getByTestId("video-aspect_ratio-control").click();
  await page.getByRole("button", { name: "9:16", exact: true }).click();
  await page.getByTestId("video-resolution-control").click();
  await page.getByRole("button", { name: "1080p", exact: true }).click();
  await page
    .getByPlaceholder(VIDEO_PROMPT_PLACEHOLDER)
    .fill("A cinematic city shot");
  await page.locator('button[type="submit"]').click();

  expect((await generateRequest).ai_model_config).toMatchObject({
    duration: 12,
    aspect_ratio: "9:16",
    resolution: "1080p",
  });
});

for (const durationSchema of [
  { type: ["string", "integer"], enum: ["auto", 3, 7, 12], default: "auto" },
  {
    anyOf: [
      { type: "string", const: "auto" },
      { type: "integer", minimum: 3, maximum: 12 },
    ],
    default: "auto",
  },
]) {
  for (const automatic of [true, false]) {
    test(`duration supports ${"enum" in durationSchema ? "mixed enum" : "bounded union"} and submits ${automatic ? "auto" : "numeric maximum"}`, async ({
      page,
    }) => {
      await mockDurationSchema(page, durationSchema);
      await openVideoGenerationPage(page);
      const duration = page.getByRole("slider", { name: "مدت زمان" });
      await expect(duration).toBeVisible();
      await expect(duration).toHaveAttribute("aria-valuetext", "خودکار");
      await duration.focus();
      await duration.press("End");
      await expect(duration).toHaveAttribute("aria-valuetext", "12 ثانیه");
      if (automatic) {
        await duration.press("Home");
        await expect(duration).toHaveAttribute("aria-valuetext", "خودکار");
      }
      await page
        .getByPlaceholder(VIDEO_PROMPT_PLACEHOLDER)
        .fill("A cinematic city shot");
      const request = waitForGenerateRequest(page);
      await page.locator('button[type="submit"]').click();
      expect((await request).ai_model_config.duration).toBe(
        automatic ? "auto" : 12,
      );
    });
  }
}

test("duration resynchronizes an out-of-range value when the video mode changes", async ({
  page,
}) => {
  await mockDurationSchema(page, {
    type: "integer",
    minimum: 3,
    maximum: 12,
    default: 5,
  });
  await openVideoGenerationPage(page);
  const duration = page.getByRole("slider", { name: "مدت زمان" });
  await duration.focus();
  await duration.press("End");
  await page.getByRole("radio", { name: "عکس به ویدیو" }).click();
  await expect(duration).toHaveAttribute("aria-valuetext", "4 ثانیه");
  await page.getByRole("textbox").fill("A cinematic city shot");
  const request = waitForGenerateRequest(page);
  await page.locator('button[type="submit"]').click();
  expect((await request).ai_model_config.duration).toBe(4);
});

async function mockDurationSchema(
  page: Page,
  duration: Record<string, unknown>,
) {
  const schema = (property: Record<string, unknown>) => ({
    type: "object",
    required: ["prompt", "duration"],
    properties: {
      prompt: { type: "string", minLength: 3 },
      duration: property,
    },
  });
  await page.route(`**/ai-registry/models/${MODEL_UUID}`, (route) =>
    route.fulfill({
      json: {
        ...getModelDetail(),
        modes: {
          text_to_video: {
            value: "text_to_video",
            config_schema: schema(duration),
          },
          image_to_video: {
            value: "image_to_video",
            config_schema: schema({
              type: "integer",
              minimum: 3,
              maximum: 6,
              default: 4,
            }),
          },
        },
        canonical_ui_schema: {
          selectors: [
            {
              options: [
                { value: "text_to_video", order: 0 },
                { value: "image_to_video", order: 1 },
              ],
            },
          ],
          elements: [],
        },
      },
    }),
  );
}
