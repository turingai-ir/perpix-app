import { expect, type Page, type Route, test } from "@playwright/test";
import { readFileSync } from "node:fs";

import type {
  JsonConfigMeta,
  JsonConfigSchema,
} from "../src/hooks/use-dynamic-config-form";

const MODEL_UUID = "2d1fcf14-a655-47c5-af08-3fa450dc99cc";
const NANO_MODEL_UUID = "a509b349-d43f-4065-9cf2-de444bf4aa2c";
const RUNWARE_PROVIDER_UUID = "638239ab-dcac-49cf-a198-f593cfd45e77";

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

test.beforeEach(async ({ baseURL, context, page }) => {
  await context.addCookies([
    {
      name: "access_token",
      value: "test-token",
      url: baseURL,
    },
  ]);

  await page.addInitScript(() => {
    window.localStorage.clear();
    window.indexedDB.deleteDatabase("REACT_QUERY_OFFLINE_CACHE");
  });

  await mockApi(page);
});

test("updates visible video prompt fields when the generation mode changes", async ({
  page,
}) => {
  await openVideoGenerationPage(page);

  await expect(page.getByPlaceholder("شروع به تایپ کنید")).toBeVisible();
  await expect(
    page.getByRole("button", { name: "متن به ویدیو" }),
  ).toBeVisible();
  await expect(page.getByRole("combobox", { name: "رزولوشن" })).toHaveText(
    "720p",
  );
  await expect(page.getByRole("combobox", { name: "نسبت تصویر" })).toHaveText(
    "16:9",
  );
  await expect(page.getByRole("combobox", { name: "مدت زمان" })).toBeVisible();
  await expect(page.getByText("تولید صدا")).toBeHidden();
  await expect(page.getByText("تصاویر فریم")).toBeHidden();

  await page.getByRole("button", { name: "تنظیمات پیشرفته" }).click();
  await expect(page.getByRole("dialog").getByText("تولید صدا")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toBeHidden();

  await page.getByRole("button", { name: "عکس به ویدیو" }).click();

  await expect(page.getByText("تصاویر فریم")).toBeVisible();
  await expect(page.getByRole("combobox", { name: "رزولوشن" })).toBeHidden();
  await expect(page.getByRole("combobox", { name: "نسبت تصویر" })).toBeHidden();
  await expect(page.getByText("ویدیوی مرجع", { exact: true })).toBeHidden();

  await page.getByRole("button", { name: "کنترل حرکت" }).click();

  await expect(page.getByText("ویدیوی مرجع", { exact: true })).toBeVisible();
  await expect(page.getByText("تصاویر مرجع")).toBeVisible();
  await expect(page.getByText("تصاویر فریم")).toBeHidden();
  await expect(page.getByText("تولید صدا")).toBeHidden();
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
    (url) => url.pathname === `/ai-registry/models/${MODEL_UUID}`,
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

  await expect(page.getByPlaceholder("شروع به تایپ کنید")).toBeVisible();
  await expect(page.getByRole("combobox", { name: "حالت تولید" })).toHaveText(
    "متن به ویدیو",
  );
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
  const promptInput = page.getByPlaceholder("شروع به تایپ کنید");
  const submitButton = page.locator('button[type="submit"]');

  await expect(submitButton).toBeDisabled();
  await promptInput.fill("No");
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

test("switches Nano Banana image modes using the canonical selector", async ({
  page,
}) => {
  await mockNanoBananaApi(page);
  const generateRequest = waitForGenerateRequest(page);

  await page.goto("/generation/image");
  const modeSelector = page.getByRole("combobox", { name: "حالت تولید" });
  await expect(modeSelector).toHaveText("تبدیل متن به تصویر");
  await expect(page.getByText("تصاویر مرجع")).toBeHidden();

  await modeSelector.click();
  await page.getByRole("option", { name: "تبدیل تصویر به تصویر" }).click();
  await expect(page.getByText("تصاویر مرجع")).toBeVisible();

  await modeSelector.click();
  await page.getByRole("option", { name: "تبدیل متن به تصویر" }).click();
  await page
    .getByPlaceholder("شروع به تایپ کنید")
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
      url.pathname === `/ai-registry/models/${MODEL_UUID}`
    ) {
      modelDetailRequestCount += 1;
      await route.fallback();
      return;
    }
    if (request.method() !== "POST" || url.pathname !== "/ai-task/generate") {
      await route.fallback();
      return;
    }
    await fulfillApplicationError(route, 422, "provider target leaked");
  });

  await openVideoGenerationPage(page);
  await page.getByPlaceholder("شروع به تایپ کنید").fill("A valid prompt");
  await page.locator('button[type="submit"]').click();

  await expect.poll(() => modelDetailRequestCount).toBeGreaterThan(1);
  await expect(page.getByText("provider target leaked")).toBeHidden();
});

test("does not lock the form for an unmapped application error", async ({
  page,
}) => {
  await mockGenerateApplicationError(page, 503, "raw provider error");
  await openVideoGenerationPage(page);
  const prompt = page.getByPlaceholder("شروع به تایپ کنید");
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
  await page.getByPlaceholder("شروع به تایپ کنید").fill("A valid prompt");
  await page.locator('button[type="submit"]').click();

  await expect(page.getByText("مقدار این فیلد معتبر نیست")).toBeVisible();
  await expect(page.getByText(/providerPayload\.promptText/)).toBeHidden();
});

test("supports multi-prompt mode without requiring the main prompt field", async ({
  page,
}) => {
  const generateRequest = waitForGenerateRequest(page);

  await openVideoGenerationPage(page);
  await page.getByRole("button", { name: "تنظیمات پیشرفته" }).click();
  await page.getByRole("button", { name: /پرامپت چندبخشی/ }).click();

  await expect(page.getByPlaceholder("شروع به تایپ کنید")).toBeHidden();

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

  await expect(page.getByText("تولید ویدیو ناموفق بود")).toBeVisible();
  await expect(page.getByText("PROVIDER_RATE_LIMITED")).toBeVisible();
  await expect(page.getByPlaceholder("شروع به تایپ کنید")).toHaveValue(
    "Retry this video",
  );
  await page
    .getByRole("alert")
    .getByRole("button", { name: "تلاش مجدد" })
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
      ai_model_config: { mode: "text_to_video", prompt: "Still rendering" },
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

  await expect(page.getByPlaceholder("شروع به تایپ کنید")).toHaveValue(
    "Still rendering",
  );
  await expect(
    page.getByRole("combobox").filter({ hasText: "Kling 3.0 Standard" }),
  ).toBeVisible();
  await expect(page.locator('button[type="submit"]')).toBeDisabled();
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

  await expect(page.getByPlaceholder("شروع به تایپ کنید")).toHaveValue("");
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

  await expect(page.getByPlaceholder("شروع به تایپ کنید")).toHaveValue(
    "Assistant prompt",
  );
});

async function openVideoGenerationPage(page: Page) {
  await page.goto("/generation/video");
  await expect(page.getByPlaceholder("شروع به تایپ کنید")).toBeVisible();
  await expect(
    page.getByRole("combobox").filter({ hasText: "Kling 3.0 Standard" }),
  ).toBeVisible();
}

function waitForGenerateRequest(page: Page) {
  return page
    .waitForRequest(
      (request) =>
        request.method() === "POST" &&
        new URL(request.url()).pathname === "/ai-task/generate",
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

    if (request.method() === "GET" && url.pathname === "/user/get-info") {
      await route.fulfill({
        contentType: "application/json",
        body: JSON.stringify({ uuid: "user-1", mobile: "09120000000" }),
      });
      return;
    }

    if (
      request.method() === "GET" &&
      url.pathname === "/user/subscription/active"
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
      url.pathname === "/user/subscription/plans"
    ) {
      await route.fulfill({
        contentType: "application/json",
        body: JSON.stringify([]),
      });
      return;
    }

    if (request.method() === "GET" && url.pathname === "/wallet/wallet") {
      await route.fulfill({
        contentType: "application/json",
        body: JSON.stringify({
          wallet_uuid: "wallet-1",
          balance_usdmicro: 1_000_000,
        }),
      });
      return;
    }

    if (request.method() === "GET" && url.pathname === "/ai-task/list") {
      await route.fulfill({
        contentType: "application/json",
        body: JSON.stringify({ items: [], has_next: false }),
      });
      return;
    }

    if (request.method() === "POST" && url.pathname === "/ai-task/generate") {
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

    if (request.method() === "GET" && url.pathname === "/ai-task/task-1") {
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

    if (request.method() === "GET" && url.pathname === "/ai-registry/models") {
      await route.fulfill({
        contentType: "application/json",
        body: JSON.stringify([getModelSummary()]),
      });
      return;
    }

    if (
      request.method() === "GET" &&
      url.pathname === `/ai-registry/models/${MODEL_UUID}`
    ) {
      await route.fulfill({
        contentType: "application/json",
        body: JSON.stringify({
          ...getModelDetail(),
        }),
      });
      return;
    }

    await route.continue();
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
  const elements =
    "elements" in (klingVideoConfigMeta.uischema ?? {})
      ? klingVideoConfigMeta.uischema.elements
      : [];

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
    (url) => url.pathname === "/ai-registry/models",
    async (route) => {
      await route.fulfill({
        contentType: "application/json",
        body: JSON.stringify([model]),
      });
    },
  );
  await page.route(
    (url) => url.pathname === `/ai-registry/models/${NANO_MODEL_UUID}`,
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
