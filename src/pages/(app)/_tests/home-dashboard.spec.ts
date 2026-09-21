import { expect, test, type Page } from "@playwright/test";

const mockDashboardApi = async (page: Page) => {
  await page.route("**/*", (route) => {
    const url = new URL(route.request().url());
    if (
      url.origin === "http://localhost:5173" &&
      route.request().method() === "GET" &&
      !["fetch", "xhr"].includes(route.request().resourceType()) &&
      !url.pathname.startsWith("/api/")
    ) {
      return route.continue();
    }
    return route.abort();
  });
  await page.context().addCookies([
    {
      name: "access_token",
      value: "dashboard-test-token",
      url: "http://localhost:5173",
    },
  ]);
  await page.route("**/api/v1/user/get-info", (route) =>
    route.fulfill({
      json: {
        email: "user@example.com",
        phone_number: "09120000000",
        name: "امیر",
        is_verified: true,
        scopes: [],
        default_wallet_uuid: "wallet-1",
        is_active: true,
        created_at: "2026-01-01T00:00:00Z",
        updated_at: "2026-01-01T00:00:00Z",
      },
    }),
  );
  await page.route("**/api/v1/wallet/wallet", (route) =>
    route.fulfill({
      json: {
        wallet_uuid: "wallet-1",
        owner_user_uuid: "user-1",
        name: "کیف پول اصلی",
        balance_usdmicro: 248000,
        is_active: true,
        created_at: "2026-01-01T00:00:00Z",
        updated_at: "2026-01-01T00:00:00Z",
      },
    }),
  );
  await page.route("**/api/v1/user/subscription/active", (route) =>
    route.fulfill({
      json: {
        uuid: "subscription-1",
        started_at: "2026-08-01T00:00:00Z",
        expires_at: "2026-10-01T00:00:00Z",
        plan: {
          uuid: "plan-1",
          name: "pro",
          display_name: "حرفه‌ای",
          description: "پلن حرفه‌ای",
          scopes: [],
          allowed_models: ["flux-pro"],
          base_price_usdmicro: 0,
          discounted_price_usdmicro: 0,
          duration_days: 30,
          balance_gift_amount_usdmicro: 0,
          meta: null,
          is_active: true,
          is_recommended: true,
          is_default: false,
          created_at: "2026-01-01T00:00:00Z",
          updated_at: "2026-01-01T00:00:00Z",
        },
      },
    }),
  );
  await page.route("**/api/v1/wallet/transactions**", (route) =>
    route.fulfill({
      json: {
        wallet_uuid: "wallet-1",
        owner_user_uuid: "user-1",
        transactions: [],
        has_next: false,
        created_at: "2026-01-01T00:00:00Z",
        updated_at: "2026-01-01T00:00:00Z",
      },
    }),
  );
  await page.route("**/api/v1/ai-task/list**", (route) =>
    route.fulfill({
      json: {
        items: [
          {
            uuid: "task-1",
            task_type: "IMAGE",
            created_at: "2026-09-09T10:00:00Z",
            updated_at: "2026-09-09T10:01:00Z",
            messages: [
              {
                uuid: "message-1",
                ai_model_uuid: "model-1",
                ai_model_config: {},
                task_status: "SUCCESS",
                message: null,
                role: "ASSISTANT",
              },
            ],
          },
        ],
        has_next: false,
      },
    }),
  );
  await page.route("**/api/v1/ai-registry/models**", (route) => {
    const model = {
      uuid: "model-1",
      model_owner: "BLACK_FOREST_LABS",
      name: "flux-pro",
      display_name: "FLUX Pro",
      description: "مدل حرفه‌ای تصویر",
      icon_url: null,
      tags: ["image"],
      supported_inputs: ["TEXT"],
      supported_outputs: ["IMAGE", "VIDEO"],
      min_cost: 12000,
      max_cost: 28000,
    };
    if (new URL(route.request().url()).pathname.endsWith("/model-1")) {
      return route.fulfill({
        json: {
          ...model,
          modes: {
            default: {
              value: "default",
              config_schema: {
                $id: "dashboard-draft-test",
                type: "object",
                additionalProperties: false,
                required: ["prompt"],
                properties: {
                  prompt: { type: "string", minLength: 3 },
                },
              },
            },
          },
          canonical_ui_schema: {
            selectors: [],
            elements: [{ type: "Control", scope: "#/properties/prompt" }],
          },
        },
      });
    }
    return route.fulfill({ json: [model] });
  });
  await page.route("**/api/v1/file-manager/user-files**", (route) =>
    route.fulfill({
      json: {
        files: [
          {
            file_name: "campaign.png",
            file_size: 1024,
            content_type: "image/png",
            is_public: false,
            created_at: "2026-09-09T10:00:00Z",
            updated_at: "2026-09-09T10:00:00Z",
            expire_at: null,
            uuid: "file-1",
          },
        ],
        has_next: false,
      },
    }),
  );
  await page.route("**/api/v1/file-manager/files/presigned-urls", (route) =>
    route.fulfill({
      json: {
        files: [
          {
            file_uuid: "file-1",
            preview_url:
              "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg'/%3E",
            download_url: "#",
          },
        ],
      },
    }),
  );
  await page.route("**/api/v1/ai-task/events", (route) =>
    route.fulfill({ status: 200, contentType: "text/event-stream", body: "" }),
  );
};

const brandEntrances = [
  { name: "thunder", keyframe: "thunderImpact", minimumAnimations: 7 },
  { name: "rift", keyframe: "riftArrival", minimumAnimations: 6 },
  { name: "forge", keyframe: "forgeFace", minimumAnimations: 10 },
] as const;

for (const [index, entrance] of brandEntrances.entries()) {
  for (const reducedMotion of ["no-preference", "reduce"] as const) {
    test(`logo entrance ${entrance.name} with ${reducedMotion}`, async ({
      page,
    }) => {
      await page.emulateMedia({ reducedMotion });
      if (reducedMotion === "reduce") {
        await page.setViewportSize({ width: 375, height: 812 });
      }
      await mockDashboardApi(page);
      await page.addInitScript(
        (value) => {
          Math.random = () => value;
        },
        (index + 0.5) / 3,
      );
      await page.goto("http://localhost:5173/");
      const brand = page.locator("[data-brand-entrance]");
      await expect(brand).toHaveAttribute("data-brand-entrance", entrance.name);
      await expect(brand).toHaveAttribute("aria-hidden", "true");
      await expect(brand.locator("img")).toHaveAttribute(
        "src",
        "/android-chrome-512x512.png",
      );
      await expect(brand.locator("svg path")).toHaveCount(3);
      await expect(brand.locator("div > i")).toHaveCount(11);
      const visibleParts = [
        brand,
        brand.locator("img"),
        brand.locator('[class*="brandFace"]'),
        brand.locator('[class*="brandPlinth"]'),
      ];
      if (reducedMotion === "no-preference") {
        const animations = await brand.evaluate((element) => {
          // Computed styles still describe entrances that have already finished.
          const names = [element, ...element.querySelectorAll("*")]
            .map((part) => {
              const style = getComputedStyle(part);
              return {
                name: style.animationName,
                iterations: Number(style.animationIterationCount),
              };
            })
            .filter(({ name }) => name !== "none");
          element
            .getAnimations({ subtree: true })
            .forEach((animation) => animation.finish());
          return names;
        });
        expect(animations.length).toBeGreaterThanOrEqual(
          entrance.minimumAnimations,
        );
        expect(animations.every(({ iterations }) => iterations === 1)).toBe(
          true,
        );
        expect(animations.map(({ name }) => name).join(" ")).toContain(
          entrance.keyframe,
        );
      }
      for (const part of visibleParts) {
        for (const element of await part.all()) {
          await expect(element).toHaveCSS("opacity", "1");
          await expect(element).toHaveCSS("transform", "none");
          if (reducedMotion === "reduce") {
            await expect(element).toHaveCSS("animation-name", "none");
            await expect(element).toHaveCSS("animation-delay", "0s");
          }
        }
      }
      await expect(brand.locator("img")).toBeVisible();
      const actions = page.locator("[data-dashboard-primary-action]");
      await expect(actions).toHaveCount(2);
      await actions.last().click({ trial: true });

      if (reducedMotion === "no-preference") {
        // A language change rerenders the actual component through its i18n hook.
        await page.evaluate(
          async (value) => {
            Math.random = () => value;
            const modulePath = "/src/services/i18/i18.ts";
            const { default: i18n } = (await import(modulePath)) as {
              default: {
                changeLanguage: (language: string) => Promise<unknown>;
              };
            };
            await i18n.changeLanguage("en");
          },
          (((index + 1) % 3) + 0.5) / 3,
        );
        await expect(page.locator("#creation-choice-title")).not.toHaveText(
          "چی می‌خوای بسازی؟",
        );
        await expect(brand).toHaveAttribute("data-brand-entrance", variant);
        expect(
          await brand.evaluate(
            (element) => element.getAnimations({ subtree: true }).length,
          ),
        ).toBe(0);
        await actions.first().click();
        await expect(page).toHaveURL(/\/generation\/image$/);
        await page.goBack();
        await expect(brand).toHaveAttribute(
          "data-brand-entrance",
          brandEntrances[(index + 1) % brandEntrances.length].name,
        );
      }
    });
  }
}

test("shows a personal studio dashboard backed by current APIs", async ({
  page,
}) => {
  await mockDashboardApi(page);
  await page.goto("/");

  await expect(
    page.getByRole("heading", {
      level: 1,
      name: "چی می‌خوای بسازی؟",
    }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: /یک عکس بسازم/ }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: /یک ویدیو بسازم/ }),
  ).toBeVisible();
  await expect(page.locator("#dashboard-creative-prompt")).toHaveCount(0);
  await expect(page.getByText("۲۴۸", { exact: true })).toBeVisible();
  await expect(
    page.getByLabel("حساب شما").getByText("حرفه‌ای", { exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "کارهای اخیر" }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "خروجی‌های اخیر" }),
  ).toBeVisible();
  const scrollCompanion = page.locator("[data-dashboard-scroll-companion]");
  const scrollViewport = page.locator('[data-slot="scroll-area-viewport"]');
  await expect(scrollCompanion).toHaveAttribute("data-scrollable", "true");
  await expect(scrollCompanion).toBeVisible();
  await scrollViewport.evaluate((element) => {
    element.scrollTop = element.scrollHeight;
  });
  await expect
    .poll(() =>
      scrollCompanion.evaluate((element) =>
        Number.parseFloat(element.style.getPropertyValue("--scroll-progress")),
      ),
    )
    .toBeGreaterThan(90);
  await scrollViewport.evaluate((element) => {
    element.scrollTop = 0;
  });
  await page.screenshot({
    path: test.info().outputPath("desktop.png"),
    animations: "disabled",
  });
});

test("keeps primary dashboard actions usable on mobile", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await mockDashboardApi(page);
  await page.goto("/");

  await expect(
    page.getByRole("heading", {
      level: 1,
      name: "چی می‌خوای بسازی؟",
    }),
  ).toBeVisible();
  const actions = page.locator("[data-dashboard-primary-action]");
  await expect(actions).toHaveCount(2);
  for (const action of await actions.all()) {
    expect((await action.boundingBox())?.height).toBeGreaterThanOrEqual(44);
  }
  const widths = await page.evaluate(() => ({
    client: document.documentElement.clientWidth,
    scroll: document.documentElement.scrollWidth,
  }));
  expect(widths.scroll).toBe(widths.client);
  await expect(page.locator("[data-dashboard-scroll-companion]")).toBeHidden();
  await page.screenshot({
    path: test.info().outputPath("mobile.png"),
    animations: "disabled",
  });
});

test("explains both creation choices without asking for a prompt", async ({
  page,
}) => {
  await mockDashboardApi(page);
  await page.goto("/");

  await expect(page.getByText("عکس محصول", { exact: true })).toBeVisible();
  await expect(page.getByText("کلیپ تبلیغاتی", { exact: true })).toBeVisible();
  await expect(page.locator("#dashboard-creative-prompt")).toHaveCount(0);
  await expect(
    page
      .getByText("با ورود به ابزار، چیزی ساخته نمی‌شود و اعتباری مصرف نمی‌شود")
      .first(),
  ).toBeVisible();
});

for (const [mode, label] of [
  ["image", "عکس"],
  ["video", "ویدیو"],
]) {
  test(`opens ${mode} with an empty optional prompt without generation`, async ({
    page,
  }) => {
    await mockDashboardApi(page);
    const mutations: string[] = [];
    page.on("request", (request) => {
      if (request.url().includes("/ai-task/") && request.method() === "POST") {
        mutations.push(request.url());
      }
    });
    await page.goto("/");
    const entry = page.getByRole("button", {
      name: new RegExp(`یک ${label} بسازم`),
    });
    await expect(entry).toBeEnabled();
    await entry.click();
    await expect(page).toHaveURL(new RegExp(`/generation/${mode}$`));
    await expect(page.locator("textarea").first()).toHaveValue("");
    await expect(
      page.getByText("FLUX Pro", { exact: true }).first(),
    ).toBeVisible();
    expect(mutations).toEqual([]);
  });
}

test("keeps desk accessible with reduced motion and keyboard navigation", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.setViewportSize({ width: 375, height: 812 });
  await mockDashboardApi(page);
  await page.goto("/");
  const image = page.getByRole("button", { name: /یک عکس بسازم/ });
  await expect(image).toHaveCSS("animation-name", "none");
  await image.focus();
  await page.keyboard.press("Tab");
  const video = page.getByRole("button", { name: /یک ویدیو بسازم/ });
  await expect(video).toBeFocused();
  expect((await video.boundingBox())?.height).toBeGreaterThanOrEqual(44);
});

test("keeps the image creation turn and composer in view", async ({ page }) => {
  await mockDashboardApi(page);
  await page.route("**/api/v1/user/subscription/active", (route) =>
    route.fulfill({
      json: {
        uuid: "generation-subscription",
        started_at: "2026-09-01T00:00:00Z",
        expires_at: "2026-10-01T00:00:00Z",
        plan: {
          uuid: "generation-plan",
          name: "pro",
          display_name: "حرفه‌ای",
          scopes: ["ai_task:write"],
          allowed_models: ["flux-pro"],
          is_active: true,
        },
      },
    }),
  );
  await page.route("**/api/v1/ai-task/generate", async (route) => {
    const request = route.request().postDataJSON() as {
      ai_model_config: Record<string, unknown>;
    };
    await route.fulfill({
      json: {
        uuid: "generation-task",
        task_type: "IMAGE",
        created_at: "2026-09-15T20:00:00Z",
        updated_at: "2026-09-15T20:00:00Z",
        messages: [
          {
            uuid: "generation-user-message",
            role: "USER",
            message: request.ai_model_config.prompt,
            ai_model_uuid: "model-1",
            ai_model_config: request.ai_model_config,
          },
          {
            uuid: "generation-assistant-message",
            role: "ASSISTANT",
            message: null,
            task_status: "IN_PROGRESS",
            ai_model_uuid: "model-1",
            ai_model_config: request.ai_model_config,
          },
        ],
      },
    });
  });
  await page.goto("http://localhost:5173/generation/image");
  await expect(
    page.getByRole("heading", { name: "ساخته‌های اخیر" }),
  ).toBeVisible();
  await expect(page.locator("[data-sidebar-history-item]")).toHaveCount(1);

  const prompt = page.getByRole("textbox", { name: "توصیف تصویر" });
  await prompt.fill("یک شهر آینده‌نگر در شب با نورهای نئونی و جزئیات فراوان");
  await page.getByRole("button", { name: "بزرگ‌کردن و ویرایش پرامپت" }).click();
  const expandedPrompt = page.getByRole("dialog").getByRole("textbox");
  await expect(expandedPrompt).toHaveValue(/شهر آینده‌نگر/);
  await expandedPrompt.fill(
    "یک شهر آینده‌نگر در شب، سبک سینمایی و باران نئونی",
  );
  await page.getByRole("button", { name: "اعمال تغییرات پرامپت" }).click();

  await page.getByRole("button", { name: "ساخت تصویر" }).click();
  const userMessage = page.locator('[data-message-role="user"]');
  const assistantMessage = page.locator('[data-message-role="assistant"]');
  await expect(userMessage).toBeVisible();
  await expect(assistantMessage).toBeVisible();
  const [userBox, assistantBox] = await Promise.all([
    userMessage.boundingBox(),
    assistantMessage.boundingBox(),
  ]);
  expect(userBox?.x).toBeGreaterThan(assistantBox?.x ?? 0);
  const unbornMuseum = page.getByLabel("موزه تصاویر متولدنشده");
  await expect(unbornMuseum).toBeInViewport();
  await expect(unbornMuseum.getByText("شهر", { exact: true })).toBeVisible();

  const composer = page.locator("[data-generation-composer]");
  await expect(composer).toBeInViewport();
  await page.screenshot({
    path: test.info().outputPath("unborn-museum-desktop.png"),
    animations: "disabled",
  });

  await page.setViewportSize({ width: 390, height: 844 });
  await composer.evaluate((element) =>
    element.scrollIntoView({ block: "end", behavior: "auto" }),
  );
  await expect(unbornMuseum).toBeInViewport();
  await expect(composer).toBeInViewport();
  const pageWidth = await page.evaluate(() => ({
    client: document.documentElement.clientWidth,
    scroll: document.documentElement.scrollWidth,
  }));
  expect(pageWidth.scroll).toBe(pageWidth.client);
});

test("turns video generation into an immersive persistent workspace", async ({
  page,
}) => {
  await mockDashboardApi(page);
  await page.route("**/api/v1/user/subscription/active", (route) =>
    route.fulfill({
      json: {
        uuid: "video-subscription",
        plan: {
          uuid: "video-plan",
          name: "pro",
          display_name: "حرفه‌ای",
          scopes: ["ai_task:write"],
          allowed_models: ["flux-pro"],
          is_active: true,
        },
      },
    }),
  );
  let submittedConfig: Record<string, unknown> = {
    prompt: "حرکت آرام دوربین به سمت یک شهر در مه",
  };
  const videoTask = () => ({
    uuid: "video-generation-task",
    task_type: "VIDEO",
    created_at: "2026-09-15T20:00:00Z",
    updated_at: "2026-09-15T20:01:00Z",
    messages: [
      {
        uuid: "video-user-message",
        role: "USER",
        message: submittedConfig.prompt,
        ai_model_uuid: "model-1",
        ai_model_config: submittedConfig,
      },
      {
        uuid: "video-assistant-message",
        role: "ASSISTANT",
        task_status: "IN_PROGRESS",
        ai_model_uuid: "model-1",
        ai_model_config: submittedConfig,
      },
    ],
  });
  await page.route("**/api/v1/ai-task/video-generation-task", (route) =>
    route.fulfill({ json: videoTask() }),
  );
  await page.route(
    "**/api/v1/ai-task/result/video-assistant-message",
    (route) => route.fulfill({ json: videoTask().messages[1] }),
  );
  await page.route("**/api/v1/ai-task/generate", async (route) => {
    const request = route.request().postDataJSON() as {
      ai_model_config: Record<string, unknown>;
    };
    submittedConfig = request.ai_model_config;
    await route.fulfill({ json: videoTask() });
  });

  await page.goto("http://localhost:5173/generation/video");
  await expect(page.locator("[data-video-director-stage]")).toBeVisible();
  const composer = page.locator("[data-generation-composer]");
  await expect(composer).toBeInViewport();

  await page.locator("textarea").fill("حرکت آرام دوربین به سمت یک شهر در مه");
  await page.getByRole("button", { name: "ساخت ویدیو" }).click();
  await expect(page.locator('[data-message-role="user"]')).toBeVisible();
  await expect(page.locator("[data-video-generation-portal]")).toBeVisible();
  await expect(composer).toBeInViewport();

  await page.setViewportSize({ width: 390, height: 844 });
  await expect(page.locator("[data-video-generation-portal]")).toBeInViewport();
  const pageWidth = await page.evaluate(() => ({
    client: document.documentElement.clientWidth,
    scroll: document.documentElement.scrollWidth,
  }));
  expect(pageWidth.scroll).toBe(pageWidth.client);
});
