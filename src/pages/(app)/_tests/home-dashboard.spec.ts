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

for (const [index, variant] of ["lift", "turn", "material"].entries()) {
  for (const reducedMotion of ["no-preference", "reduce"] as const) {
    test(`logo entrance ${variant} with ${reducedMotion}`, async ({ page }) => {
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
      await expect(brand).toHaveAttribute("data-brand-entrance", variant);
      await expect(brand).toHaveAttribute("aria-hidden", "true");
      await expect(brand.locator("img")).toHaveAttribute(
        "src",
        "/android-chrome-512x512.png",
      );
      const parts = [brand, brand.locator("div"), brand.locator("img")];
      if (reducedMotion === "no-preference") {
        const animations = await brand.evaluate((element) => {
          // Computed styles still describe entrances that have already finished.
          const names = [element, ...element.querySelectorAll("div, img")]
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
        expect(animations).toHaveLength(variant === "material" ? 3 : 1);
        expect(animations.every(({ iterations }) => iterations === 1)).toBe(
          true,
        );
        expect(animations.map(({ name }) => name).join(" ")).toContain(
          variant === "turn" ? "brandTurn" : "brandLift",
        );
      }
      for (const part of parts) {
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
          ["lift", "turn", "material"][(index + 1) % 3],
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
