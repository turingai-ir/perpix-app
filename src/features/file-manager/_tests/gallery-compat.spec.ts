import { expect, test } from "@playwright/test";
import { mockAuthenticatedSession } from "../../../../__tests__/support/auth-session";
import { mockAppShellApis } from "../../auth/_tests/support";

for (const viewport of [
  { width: 375, height: 812 },
  { width: 768, height: 1024 },
  { width: 1440, height: 900 },
]) {
  test.describe(`media facts at ${viewport.width}`, () => {
    test.use({ viewport, reducedMotion: "reduce" });
    test("preserves the native gallery while showing new formats and media facts", async ({
      page,
    }, info) => {
      await mockAppShellApis(page);
      await mockAuthenticatedSession(page);
      const types = [
        "image/webp",
        "video/quicktime",
        "video/webm",
        "audio/mp4",
      ];
      const names = ["تصویر.webp", "ویدیو.mov", "فیلم.webm", "صدا.m4a"];
      let releaseFiles: () => void = () => {};
      const filesReady = new Promise<void>((resolve) => {
        releaseFiles = resolve;
      });
      const facts = [
        { kind: "image", width: 1200, height: 800, duration_seconds: null },
        { kind: "video", width: 1920, height: 1080, duration_seconds: 12.5 },
        null,
        null,
      ];
      await page.route("**/file-manager/user-files*", async (route) => {
        await filesReady;
        const accepted = new URL(route.request().url()).searchParams.getAll(
          "content_types",
        );
        expect(accepted).toEqual(expect.arrayContaining(types));
        return route.fulfill({
          json: {
            files: names.map((file_name, index) => ({
              file_name,
              uuid: `media-${index}`,
              content_type: types[index],
              file_size: 1024,
              is_public: false,
              media_metadata: facts[index],
              expire_at: new Date(Date.now() + 86400_000).toISOString(),
            })),
            has_next: false,
          },
        });
      });
      await page.route("**/files/presigned-urls", (route) =>
        route.fulfill({
          json: {
            files: route
              .request()
              .postDataJSON()
              .file_uuids.map((id: string) => ({
                file_uuid: id,
                preview_url: `https://storage.test/${id}`,
                download_url: `https://storage.test/${id}`,
                expire_at: new Date(Date.now() + 600_000).toISOString(),
              })),
          },
        }),
      );
      await page.route("https://storage.test/**", (route) =>
        route.fulfill({
          contentType: "image/svg+xml",
          body: '<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="800"><rect width="1200" height="800" fill="#6867ac"/></svg>',
        }),
      );
      await page.goto("/gallery");
      const placeholders = page.locator('[data-slot="gallery-skeleton-card"]');
      await expect(
        page.getByRole("status", { name: "در حال دریافت فایل‌ها" }),
      ).toHaveAttribute("aria-busy", "true");
      await expect(placeholders).toHaveCount(12);
      await expect(
        placeholders.first().locator('[data-slot="skeleton"]'),
      ).toHaveCount(4);
      releaseFiles();
      await expect(
        page.getByRole("searchbox", {
          name: "جست‌وجو در فایل‌های بارگذاری‌شده",
        }),
      ).toBeVisible();
      await expect(page.getByText("تصویر.webp", { exact: true })).toBeVisible();
      await expect(page.getByText(/پیکسل/)).toHaveCount(2);
      await expect(page.getByText(/ثانیه/)).toBeVisible();
      await expect(page.getByText(/انقضا:/)).toHaveCount(4);
      await expect(page.getByText("اطلاعات رسانه نامشخص است")).toHaveCount(2);
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBe(true);
      await page.evaluate(() => document.fonts.ready);
      await page.screenshot({
        path: info.outputPath("media-compat.png"),
        fullPage: true,
      });
    });
  });
}
