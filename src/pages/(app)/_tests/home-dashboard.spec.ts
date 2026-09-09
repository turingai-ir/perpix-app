import { expect, test, type Page } from "@playwright/test";

const mockDashboardApi = async (page: Page) => {
  await page.context().addCookies([
    {
      name: "access_token",
      value: "dashboard-test-token",
      url: "http://127.0.0.1:5179",
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
  await page.route("**/api/v1/ai-registry/models**", (route) =>
    route.fulfill({
      json: [
        {
          uuid: "model-1",
          model_owner: "BLACK_FOREST_LABS",
          name: "flux-pro",
          display_name: "FLUX Pro",
          description: "مدل حرفه‌ای تصویر",
          icon_url: null,
          tags: ["image"],
          supported_inputs: ["TEXT"],
          supported_outputs: ["IMAGE"],
          min_cost: 12000,
          max_cost: 28000,
        },
      ],
    }),
  );
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

test("shows a personal studio dashboard backed by current APIs", async ({
  page,
}) => {
  await mockDashboardApi(page);
  await page.goto("/");

  await expect(
    page.getByRole("heading", {
      level: 1,
      name: "سلام امیر، آماده‌ای چیزی بسازی؟",
    }),
  ).toBeVisible();
  await expect(page.getByRole("link", { name: "ساخت تصویر" })).toBeVisible();
  await expect(page.getByRole("link", { name: "ساخت ویدیو" })).toBeVisible();
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
});

test("keeps primary dashboard actions usable on mobile", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await mockDashboardApi(page);
  await page.goto("/");

  await expect(
    page.getByRole("heading", {
      level: 1,
      name: "سلام امیر، آماده‌ای چیزی بسازی؟",
    }),
  ).toBeVisible();
  const actionLinks = page.locator("[data-dashboard-primary-action]");
  await expect(actionLinks).toHaveCount(2);
  for (const link of await actionLinks.all()) {
    expect((await link.boundingBox())?.height).toBeGreaterThanOrEqual(44);
  }
  const widths = await page.evaluate(() => ({
    client: document.documentElement.clientWidth,
    scroll: document.documentElement.scrollWidth,
  }));
  expect(widths.scroll).toBe(widths.client);
});
