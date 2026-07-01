import { expect, type Page, test } from "@playwright/test";

const MODEL_UUID = "2d1fcf14-a655-47c5-af08-3fa450dc99cc";

test.describe.configure({ mode: "serial" });

const klingVideoConfigSchema = {
  $id: "KLINGAI_VIDEO_3_0_STANDARD",
  type: "object",
  required: ["mode"],
  additionalProperties: false,
  "x-ui": {
    order: [
      "mode",
      "prompt",
      "negative_prompt",
      "multi_prompt",
      "frame_images",
      "reference_videos",
      "reference_images",
      "size",
      "duration",
      "generate_audio",
      "character_orientation",
      "keep_original_sound",
    ],
    widgets: {
      mode: "select",
      prompt: "textarea",
      negative_prompt: "textarea",
      size: "select",
      duration: "number",
      generate_audio: "checkbox",
      character_orientation: "select",
      frame_images: "file-list",
      reference_images: "file-list",
      reference_videos: "file-list",
    },
    placement: {
      promptBox: ["mode", "size", "generate_audio"],
      advancedSettings: [
        "negative_prompt",
        "multi_prompt",
        "duration",
        "character_orientation",
        "keep_original_sound",
      ],
    },
    enumLabels: {
      mode: {
        text_to_video: "Text to Video",
        image_to_video: "Image to Video",
        motion_control: "Motion Control",
      },
      size: {
        "1280x720": "720p landscape 16:9",
        "960x960": "720p square 1:1",
      },
      character_orientation: {
        image: "Match reference image",
        video: "Match reference video",
      },
    },
    visibility: [
      {
        effect: "SHOW",
        fields: [
          "prompt",
          "negative_prompt",
          "multi_prompt",
          "size",
          "duration",
          "generate_audio",
        ],
        condition: {
          field: "mode",
          operator: "equals",
          value: "text_to_video",
        },
      },
      {
        effect: "HIDE",
        fields: [
          "frame_images",
          "reference_videos",
          "reference_images",
          "character_orientation",
          "keep_original_sound",
        ],
        condition: {
          field: "mode",
          operator: "equals",
          value: "text_to_video",
        },
      },
      {
        effect: "SHOW",
        fields: [
          "prompt",
          "negative_prompt",
          "multi_prompt",
          "frame_images",
          "duration",
          "generate_audio",
        ],
        condition: {
          field: "mode",
          operator: "equals",
          value: "image_to_video",
        },
      },
      {
        effect: "HIDE",
        fields: [
          "size",
          "reference_videos",
          "reference_images",
          "character_orientation",
          "keep_original_sound",
        ],
        condition: {
          field: "mode",
          operator: "equals",
          value: "image_to_video",
        },
      },
      {
        effect: "SHOW",
        fields: [
          "prompt",
          "negative_prompt",
          "reference_videos",
          "reference_images",
          "character_orientation",
          "keep_original_sound",
        ],
        condition: {
          field: "mode",
          operator: "equals",
          value: "motion_control",
        },
      },
      {
        effect: "HIDE",
        fields: [
          "multi_prompt",
          "size",
          "duration",
          "frame_images",
          "generate_audio",
        ],
        condition: {
          field: "mode",
          operator: "equals",
          value: "motion_control",
        },
      },
      {
        effect: "HIDE",
        fields: ["prompt"],
        condition: { field: "multi_prompt", operator: "not_empty" },
      },
      {
        effect: "HIDE",
        fields: ["multi_prompt"],
        condition: { field: "prompt", operator: "not_empty" },
      },
    ],
  },
  allOf: [
    {
      if: {
        required: ["mode"],
        properties: { mode: { const: "text_to_video" } },
      },
      then: {
        oneOf: [
          {
            not: { required: ["multi_prompt"] },
            required: ["prompt"],
            properties: { prompt: { type: "string", minLength: 3 } },
          },
          {
            not: { required: ["prompt"] },
            required: ["multi_prompt"],
            properties: { multi_prompt: { type: "array", minItems: 1 } },
          },
        ],
        required: ["size", "duration"],
      },
    },
    {
      if: {
        required: ["multi_prompt"],
        properties: { multi_prompt: { type: "array", minItems: 1 } },
      },
      then: {
        not: { required: ["prompt"] },
        required: ["duration"],
      },
    },
  ],
  properties: {
    mode: {
      type: "string",
      title: "Generation mode",
      enum: ["text_to_video", "image_to_video", "motion_control"],
      default: "text_to_video",
    },
    prompt: {
      type: ["string", "null"],
      title: "Prompt",
      minLength: 3,
      maxLength: 2500,
      default: null,
    },
    negative_prompt: {
      type: ["string", "null"],
      title: "Negative prompt",
      minLength: 3,
      maxLength: 2500,
      default: null,
    },
    multi_prompt: {
      type: ["array", "null"],
      title: "Multi prompt",
      minItems: 1,
      maxItems: 6,
      default: null,
      items: {
        type: "object",
        required: ["prompt", "duration"],
        additionalProperties: false,
        properties: {
          prompt: {
            type: "string",
            title: "Segment prompt",
            minLength: 3,
            maxLength: 2500,
          },
          duration: {
            type: "integer",
            title: "Segment duration",
            minimum: 1,
          },
        },
      },
    },
    size: {
      type: ["string", "null"],
      title: "Size",
      enum: ["1280x720", "960x960", null],
      default: "1280x720",
    },
    duration: {
      type: ["integer", "null"],
      title: "Duration",
      minimum: 3,
      maximum: 15,
      default: 5,
    },
    generate_audio: {
      type: ["boolean", "null"],
      title: "Generate audio",
      default: true,
    },
    frame_images: {
      type: ["array", "null"],
      title: "Frame images",
      minItems: 1,
      maxItems: 2,
      default: null,
      items: { type: "string" },
      "x-file": { type: "list", accept: ["image/*"] },
    },
    reference_images: {
      type: ["array", "null"],
      title: "Reference images",
      minItems: 1,
      maxItems: 1,
      default: null,
      items: { type: "string" },
      "x-file": { type: "list", accept: ["image/*"] },
    },
    reference_videos: {
      type: ["array", "null"],
      title: "Reference videos",
      minItems: 1,
      maxItems: 1,
      default: null,
      items: { type: "string" },
      "x-file": { type: "list", accept: ["video/*"] },
    },
    character_orientation: {
      type: ["string", "null"],
      title: "Character orientation",
      enum: ["image", "video", null],
      default: null,
    },
    keep_original_sound: {
      type: ["boolean", "null"],
      title: "Keep original sound",
      default: null,
    },
  },
};

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
  await expect(page.getByRole("combobox", { name: "حالت تولید" })).toHaveText(
    "Text to Video",
  );
  await expect(page.getByRole("combobox", { name: "اندازه" })).toHaveText(
    "720p landscape 16:9",
  );
  await expect(page.getByRole("spinbutton", { name: "مدت زمان" })).toBeVisible();
  await expect(page.getByText("تولید صدا")).toBeHidden();
  await expect(page.getByText("تصاویر فریم")).toBeHidden();

  await page.getByRole("button", { name: "تنظیمات پیشرفته" }).click();
  await expect(page.getByRole("dialog").getByText("تولید صدا")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toBeHidden();

  await selectOption(page, "حالت تولید", "Image to Video");

  await expect(page.getByText("تصاویر فریم")).toBeVisible();
  await expect(page.getByRole("combobox", { name: "اندازه" })).toBeHidden();
  await expect(page.getByText("ویدیوی مرجع")).toBeHidden();

  await selectOption(page, "حالت تولید", "Motion Control");

  await expect(page.getByText("ویدیوی مرجع")).toBeVisible();
  await expect(page.getByText("تصاویر مرجع")).toBeVisible();
  await expect(page.getByText("تصاویر فریم")).toBeHidden();
  await expect(page.getByText("تولید صدا")).toBeHidden();
});

test("submits text-to-video prompt values with the selected model", async ({
  page,
}) => {
  const generateRequest = waitForGenerateRequest(page);

  await openVideoGenerationPage(page);
  await page
    .getByPlaceholder("شروع به تایپ کنید")
    .fill("A cinematic city shot");
  await page.locator('button[type="submit"]').click();

  const body = await generateRequest;

  expect(body.ai_model_uuid).toBe(MODEL_UUID);
  expect(body.task_type).toBe("VIDEO");
  expect(body.ai_model_config).toMatchObject({
    duration: 5,
    generate_audio: true,
    mode: "text_to_video",
    prompt: "A cinematic city shot",
    size: "1280x720",
  });
});

test("supports multi-prompt mode without requiring the main prompt field", async ({
  page,
}) => {
  const generateRequest = waitForGenerateRequest(page);

  await openVideoGenerationPage(page);
  await page.getByRole("button", { name: "تنظیمات پیشرفته" }).click();
  await page.getByRole("button", { name: /پرامپت چندبخشی/ }).click();

  await expect(page.getByPlaceholder("شروع به تایپ کنید")).toBeHidden();

  await page.getByPlaceholder("Segment prompt").fill("Opening shot");
  await page.getByPlaceholder("Segment duration").fill("3");
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toBeHidden();
  await page.locator('button[type="submit"]').click();

  const body = await generateRequest;

  expect(body.ai_model_config.prompt).toBeUndefined();
  expect(body.ai_model_config).toMatchObject({
    duration: 5,
    mode: "text_to_video",
    multi_prompt: [{ prompt: "Opening shot", duration: 3 }],
  });
});

async function openVideoGenerationPage(page: Page) {
  await page.goto("/generation/video");
  await expect(page.getByPlaceholder("شروع به تایپ کنید")).toBeVisible();
  await expect(
    page.getByRole("combobox").filter({ hasText: "Kling 3.0 Standard" }),
  ).toBeVisible();
}

async function selectOption(page: Page, fieldLabel: string, option: string) {
  await page.getByRole("combobox", { name: fieldLabel }).click();
  await page.getByRole("option", { name: option }).click();
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

async function mockApi(page: Page) {
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
          messages: [],
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
          ...getModelSummary(),
          config_schema: klingVideoConfigSchema,
          meta: {},
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
    pricing_tiers: [],
  };
}
