import { expect, type Page, test } from "@playwright/test";
import { readFileSync } from "node:fs";

import type {
  JsonConfigMeta,
  JsonConfigSchema,
} from "../src/hooks/use-dynamic-config-form";

const MODEL_UUID = "2d1fcf14-a655-47c5-af08-3fa450dc99cc";

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
    resolution: "720p",
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
          ...getModelSummary(),
          config_schema: klingVideoConfigSchema,
          meta: klingVideoConfigMeta,
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
