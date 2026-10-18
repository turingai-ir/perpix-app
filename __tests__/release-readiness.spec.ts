import { type Page } from "@playwright/test";
import { readFileSync } from "node:fs";
import { expect, test } from "./fixtures/image-settings";

const videoConfig = JSON.parse(
  readFileSync(
    new URL("./fixtures/seedance-video-config.json", import.meta.url),
    "utf8",
  ),
) as { canonical_ui_schema: unknown; modes: Record<string, unknown> };

const paymentId = "c0202000-0000-4000-8000-000000000001";
const videoModel = {
  uuid: "2d1fcf14-a655-47c5-af08-3fa450dc99cc",
  name: "BYTEDANCE_SEEDANCE_2_POINT_5",
  display_name: "Seedance release fixture",
  model_owner: "BYTEDANCE",
  supported_inputs: ["TEXT", "IMAGE"],
  supported_outputs: ["VIDEO"],
  min_cost: 10000,
  max_cost: 100000,
  description: "Mocked release smoke",
  icon_url: null,
  tags: [],
  ...videoConfig,
};

async function mockReadOnlyRoutes(page: Page) {
  await page.route("**/api/v1/user/get-info", (route) =>
    route.fulfill({
      json: {
        uuid: "user-1",
        name: "کاربر آزمایشی",
        email: "qa@example.com",
        phone_number: "09120000000",
        is_verified: true,
        is_active: true,
        scopes: [],
        default_wallet_uuid: "wallet-1",
        created_at: "2026-01-01T00:00:00Z",
        updated_at: "2026-01-01T00:00:00Z",
      },
    }),
  );
  await page.route("**/api/v1/wallet/transactions**", (route) =>
    route.fulfill({ json: { transactions: [], has_next: false } }),
  );
  await page.route("**/api/v1/payment-intents?**", (route) =>
    route.fulfill({ json: { items: [], has_next: false } }),
  );
  await page.route("**/api/v1/file-manager/user-files**", (route) =>
    route.fulfill({ json: { files: [], has_next: false } }),
  );
  await page.route("**/api/v1/payment-events", (route) =>
    route.fulfill({
      contentType: "text/event-stream",
      body: "retry: 600000\n\n",
    }),
  );
  await page.route("**/api/v1/ai-task/events", (route) =>
    route.fulfill({
      contentType: "text/event-stream",
      body: "retry: 600000\n\n",
    }),
  );
  await page.route("**/api/v1/payment-executions/*", (route) =>
    route.fulfill({
      json: {
        id: paymentId,
        execution_uuid: paymentId,
        status: "PENDING",
        financial_status: "PENDING",
        fulfillment_status: "NOT_READY",
        requires_review: false,
        currency: "IRR",
        amount: "250000",
        payment_url: null,
      },
    }),
  );
}

for (const viewport of [
  { width: 375, height: 812 },
  { width: 768, height: 1024 },
  { width: 1440, height: 900 },
]) {
  test(`reachable routes remain usable in RTL at ${viewport.width}x${viewport.height}`, async ({
    page,
    context,
  }) => {
    test.setTimeout(90000);
    await page.setViewportSize(viewport);
    await page.emulateMedia({ reducedMotion: "reduce" });
    await mockReadOnlyRoutes(page);
    const pageErrors: string[] = [];
    page.on("pageerror", (error) => pageErrors.push(error.message));
    const routes = [
      { path: "/", ready: "[data-dashboard-primary-action]" },
      { path: "/gallery", ready: "h1" },
      { path: "/generation/image", ready: "[data-generation-intro]" },
      { path: "/generation/video", ready: "[data-video-cinema]" },
      { path: "/profile/settings", ready: "[data-testid=identity-card]" },
      { path: "/profile/payments", ready: "[data-slot=card-title]" },
      { path: "/profile/wallet-transactions", ready: "[data-slot=card-title]" },
      { path: "/editor", ready: "input[type=file]" },
      { path: `/payment/verify/${paymentId}`, ready: "h1" },
      { path: "/design-preview", ready: "h1" },
    ];
    for (const route of routes) {
      if (route.path === "/generation/video") {
        await page.route(
          (url) => url.pathname.endsWith("/ai-registry/models"),
          (request) => request.fulfill({ json: [videoModel] }),
        );
        await page.route(
          `**/api/v1/ai-registry/models/${videoModel.uuid}`,
          (request) => request.fulfill({ json: videoModel }),
        );
      }
      await page.goto(route.path);
      await expect(page).toHaveURL(
        new RegExp(`${route.path.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`),
      );
      await expect(page.locator(route.ready).first()).toBeAttached();
      if (route.path === "/generation/video") {
        await expect(
          page.getByText(videoModel.display_name, { exact: true }).first(),
        ).toBeVisible();
      }
      await page.evaluate(() => document.fonts.ready);
      expect(
        await page.evaluate(() => getComputedStyle(document.body).direction),
        route.path,
      ).toBe("rtl");
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
        route.path,
      ).toBe(true);
      expect(pageErrors, route.path).toEqual([]);
      await page.screenshot({
        path: test
          .info()
          .outputPath(`${route.path.replace(/\//g, "-") || "home"}.png`),
        fullPage: true,
      });
    }
    await context.clearCookies();
    await page.goto("/generation/image");
    await expect(page).toHaveURL(/\/auth\/login$/);
    await expect(
      page.getByRole("spinbutton", { name: "شماره تلفن" }),
    ).toBeVisible();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    await page.screenshot({
      path: test.info().outputPath("login-redirect.png"),
      fullPage: true,
    });
  });
}

test("gallery read failure remains visible and refresh recovers to empty state", async ({
  page,
}) => {
  await mockReadOnlyRoutes(page);
  let fail = true;
  await page.route("**/api/v1/file-manager/user-files**", (route) =>
    route.fulfill(
      fail
        ? { status: 503, json: { detail: "Temporary mock outage" } }
        : { json: { files: [], has_next: false } },
    ),
  );
  await page.goto("/gallery");
  const error = page
    .getByRole("alert")
    .filter({ hasText: "دریافت فایل‌ها با خطا مواجه شد" });
  await expect(error).toBeVisible();
  fail = false;
  await error.getByRole("button").click();
  await expect(
    page.getByText("هنوز فایلی ندارید", { exact: true }),
  ).toBeVisible();
  await expect(error).toBeHidden();
});
