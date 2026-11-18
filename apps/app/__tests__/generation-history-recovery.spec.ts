import type { Page } from "@playwright/test";

import {
  compatibleModelUuid,
  conversationMessages,
  expect,
  taskUuid,
  test,
} from "./fixtures/image-conversation";

type Media = "image" | "video";
const scenarios = [
  { status: 403, title: "به این گفتگو دسترسی نداری" },
  { status: 404, title: "این گفتگو پیدا نشد" },
  { status: 500, title: "گفتگو بارگذاری نشد" },
  { status: 0, title: "گفتگو بارگذاری نشد" },
];

const emptyTask = (media: Media, uuid = taskUuid) => ({
  uuid,
  task_type: media === "video" ? "VIDEO" : "IMAGE",
  expire_date: "2026-11-08T00:00:00Z",
  created_at: "2026-11-01T00:00:00Z",
  updated_at: "2026-11-01T00:00:00Z",
  messages: [],
});

async function mockVideoModel(page: Page) {
  const model = {
    uuid: compatibleModelUuid,
    // Keep the existing fixture's subscription allowlist, with a video contract.
    name: "CONVERSATION_IMAGE",
    display_name: "History video fixture",
    model_owner: "K_LING_AI",
    description: "Synthetic history-recovery model",
    icon_url: null,
    tags: ["video"],
    supported_inputs: ["TEXT"],
    supported_outputs: ["VIDEO"],
    min_cost: 1,
    max_cost: 2,
    modes: {
      text_to_video: {
        value: "text_to_video",
        provider_uuid: "33333333-3333-4333-8333-333333333333",
        config_schema: {
          type: "object",
          required: ["prompt"],
          properties: { prompt: { type: "string", minLength: 3 } },
        },
      },
    },
  };
  await page.route("**/api/v1/ai-registry/models**", (route) => {
    const path = new URL(route.request().url()).pathname;
    if (path === "/api/v1/ai-registry/models") {
      return route.fulfill({ json: [model] });
    }
    if (path === `/api/v1/ai-registry/models/${model.uuid}`) {
      return route.fulfill({ json: model });
    }
    return route.fallback();
  });
}

for (const media of ["image", "video"] as const) {
  for (const viewport of [
    { width: 375, height: 812 },
    { width: 768, height: 1024 },
    { width: 1440, height: 900 },
    { width: 320, height: 812 },
    { width: 667, height: 375 },
  ]) {
    for (const { status, title } of scenarios) {
      test(`${media} history ${status || "network"} has recovery at ${viewport.width}px`, async ({
        page,
        imageConversationApi,
      }) => {
        await page.setViewportSize(viewport);
        if (media === "video") await mockVideoModel(page);
        let failed = true;
        await page.route(`**/api/v1/ai-task/${taskUuid}`, (route) => {
          if (!failed) return route.fulfill({ json: emptyTask(media) });
          if (status === 0) return route.abort("connectionrefused");
          return route.fulfill({
            status,
            json: { detail: "Synthetic failure" },
          });
        });
        await page.goto(`/generation/${media}/${taskUuid}`);
        const alert = page.getByRole("alert", { name: title });
        await expect(alert).toBeVisible();
        await expect(page.locator("[data-generation-composer]")).toBeHidden();
        const newConversation = alert.getByRole("link", {
          name: "شروع گفتگوی جدید",
        });
        await expect(newConversation).toHaveAttribute(
          "href",
          `/generation/${media}`,
        );
        if (status === 403 || status === 404) {
          await expect(alert.getByRole("button")).toHaveCount(0);
          await newConversation.click();
          await expect(page).toHaveURL(new RegExp(`/generation/${media}$`));
        } else {
          failed = false;
          await alert.getByRole("button", { name: "بارگذاری دوباره" }).click();
          await expect(alert).toHaveCount(0);
          await expect(
            page.locator("[data-generation-composer]"),
          ).toBeVisible();
        }
        expect(imageConversationApi.generateRequests).toEqual([]);
      });
    }
  }

  test(`${media} history retry preserves the draft after a cached-history failure`, async ({
    page,
    imageConversationApi,
  }) => {
    if (media === "video") await mockVideoModel(page);
    let failed = false;
    await page.route(`**/api/v1/ai-task/${taskUuid}`, (route) =>
      route.fulfill({
        status: failed ? 500 : 200,
        json: failed ? { detail: "Synthetic failure" } : emptyTask(media),
      }),
    );
    await page.goto(`/generation/${media}/${taskUuid}`);
    const prompt = page.locator("[data-generation-composer] textarea");
    await expect(prompt).toBeEditable();
    await prompt.fill("متن پیش‌نویس نباید با تلاش مجدد پاک بشه");
    failed = true;
    await page.evaluate(async () => {
      const path = "/src/shared/lib/react-query.ts";
      const { queryClient }: typeof import("../src/shared/lib/react-query") =
        await import(path);
      await queryClient.invalidateQueries({
        queryKey: ["get", "/api/v1/ai-task/{task_uuid}"],
      });
    });
    const alert = page.getByRole("alert", { name: "گفتگو بارگذاری نشد" });
    await expect(alert).toBeVisible();
    await expect(prompt).toBeHidden();
    failed = false;
    await alert.getByRole("button", { name: "بارگذاری دوباره" }).click();
    await expect(alert).toHaveCount(0);
    await expect(prompt).toBeVisible();
    await expect(prompt).toHaveValue("متن پیش‌نویس نباید با تلاش مجدد پاک بشه");
    await expect(prompt).toBeEditable();
    expect(imageConversationApi.generateRequests).toEqual([]);
  });
}

test("a history response for a different task never opens an editable conversation", async ({
  page,
  imageConversationApi,
}) => {
  await page.route(`**/api/v1/ai-task/${taskUuid}`, (route) =>
    route.fulfill({
      json: emptyTask("image", "11111111-1111-4111-8111-111111111112"),
    }),
  );
  await page.goto(`/generation/image/${taskUuid}`);
  await expect(
    page.getByRole("alert", { name: "گفتگو بارگذاری نشد" }),
  ).toBeVisible();
  await expect(page.locator("[data-generation-composer]")).toBeHidden();
  expect(imageConversationApi.generateRequests).toEqual([]);
});

test("a delayed regeneration cannot submit after history becomes unavailable", async ({
  page,
  imageConversationApi,
}) => {
  imageConversationApi.setTaskMessages(
    conversationMessages({
      prompt: "A synthetic failed request",
      status: "FAILED",
    }),
  );
  let failed = false;
  await page.route(`**/api/v1/ai-task/${taskUuid}`, (route) =>
    failed
      ? route.fulfill({ status: 500, json: { detail: "Synthetic failure" } })
      : route.fallback(),
  );
  await page.goto(`/generation/image/${taskUuid}`);
  await expect(
    page.locator("[data-generation-composer] textarea"),
  ).toBeEditable();
  let release = () => {};
  const gate = new Promise<void>((resolve) => {
    release = resolve;
  });
  let pending = false;
  await page.route(
    `**/api/v1/ai-registry/models/${compatibleModelUuid}`,
    async (route) => {
      pending = true;
      await gate;
      await route.fallback();
    },
  );
  await page.evaluate(async () => {
    const path = "/src/shared/lib/react-query.ts";
    const { queryClient }: typeof import("../src/shared/lib/react-query") =
      await import(path);
    await queryClient.invalidateQueries({
      queryKey: ["get", "/api/v1/ai-registry/models/{ai_model_uuid}"],
      refetchType: "none",
    });
  });
  try {
    await page
      .getByRole("button", { name: "دوباره امتحان کن", exact: true })
      .click();
    await expect.poll(() => pending).toBe(true);
    failed = true;
    await page.evaluate(async () => {
      const path = "/src/shared/lib/react-query.ts";
      const { queryClient }: typeof import("../src/shared/lib/react-query") =
        await import(path);
      await queryClient.invalidateQueries({
        queryKey: ["get", "/api/v1/ai-task/{task_uuid}"],
      });
    });
    await expect(
      page.getByRole("alert", { name: "گفتگو بارگذاری نشد" }),
    ).toBeVisible();
    release();
    await expect
      .poll(() =>
        page.evaluate(async () => {
          const path = "/src/shared/lib/react-query.ts";
          const {
            queryClient,
          }: typeof import("../src/shared/lib/react-query") = await import(
            path
          );
          return queryClient.getQueryState([
            "get",
            "/api/v1/ai-registry/models/{ai_model_uuid}",
            {
              params: {
                path: { ai_model_uuid: "a509b349-d43f-4065-9cf2-de444bf4aa2c" },
              },
            },
          ])?.fetchStatus;
        }),
      )
      .toBe("idle");
    expect(imageConversationApi.generateRequests).toEqual([]);
  } finally {
    release();
  }
});

test("history recovery with a newer completed result does not erase an unsent prompt", async ({
  page,
  imageConversationApi,
}) => {
  let failed = false;
  let completed = false;
  await page.route(`**/api/v1/ai-task/${taskUuid}`, (route) =>
    route.fulfill({
      status: failed ? 500 : 200,
      json: failed
        ? { detail: "Synthetic failure" }
        : {
            ...emptyTask("image"),
            messages: completed
              ? conversationMessages({
                  prompt: "A different completed request",
                })
              : [],
          },
    }),
  );
  await page.goto(`/generation/image/${taskUuid}`);
  const prompt = page.locator("[data-generation-composer] textarea");
  await expect(prompt).toBeEditable();
  await prompt.fill("پیش‌نویس تازه هنوز ارسال نشده");
  failed = true;
  await page.evaluate(async () => {
    const path = "/src/shared/lib/react-query.ts";
    const { queryClient }: typeof import("../src/shared/lib/react-query") =
      await import(path);
    await queryClient.invalidateQueries({
      queryKey: ["get", "/api/v1/ai-task/{task_uuid}"],
    });
  });
  const alert = page.getByRole("alert", { name: "گفتگو بارگذاری نشد" });
  await expect(alert).toBeVisible();
  failed = false;
  completed = true;
  await alert.getByRole("button", { name: "بارگذاری دوباره" }).click();
  await expect(alert).toHaveCount(0);
  await expect(prompt).toBeVisible();
  await expect(prompt).toBeEditable();
  await expect(prompt).toHaveValue("پیش‌نویس تازه هنوز ارسال نشده");
  expect(imageConversationApi.generateRequests).toEqual([]);
});
