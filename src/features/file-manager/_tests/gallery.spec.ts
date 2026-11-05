import { expect, test } from "@playwright/test";
import { mockAuthenticatedSession } from "../../../../__tests__/support/auth-session";
import { mockAppShellApis } from "../../auth/_tests/support";

test("gallery keeps its files after a failed mobile refresh", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 900 });
  await mockAuthenticatedSession(page);
  await mockAppShellApis(page);
  const types = ["image/webp", "video/quicktime", "video/webm", "audio/mp4"];
  await page.route("**/file-manager/user-files*", (route) => {
    const accepted = new URL(route.request().url()).searchParams.getAll(
      "content_types",
    );
    expect(accepted).toEqual(expect.arrayContaining(types));
    return route.fulfill({
      json: {
        files: types.map((type, index) => ({
          uuid: `file-${index}`,
          file_name: ["تصویر.webp", "ویدیو.mov", "فیلم.webm", "صدا.m4a"][index],
          file_size: 1024,
          content_type: type,
          is_public: false,
          expire_at: new Date(Date.now() + 86400_000).toISOString(),
          media_metadata:
            index === 0
              ? {
                  kind: "image",
                  width: 1920,
                  height: 1080,
                  duration_seconds: null,
                }
              : index === 1
                ? {
                    kind: "video",
                    width: 1280,
                    height: 720,
                    duration_seconds: 12.5,
                  }
                : null,
        })),
        has_next: false,
      },
    });
  });
  await page.route("**/file-manager/files/presigned-urls", (route) =>
    route.fulfill({
      json: {
        files: route
          .request()
          .postDataJSON()
          .file_uuids.map((id: string) => ({
            file_uuid: id,
            preview_url: `http://127.0.0.1:5179/media/${id}`,
            download_url: `http://127.0.0.1:5179/media/${id}`,
            expire_at: new Date(Date.now() + 600_000).toISOString(),
          })),
      },
    }),
  );
  await page.route("**/media/*", (route) =>
    route.fulfill({ status: 404, body: "" }),
  );
  await page.goto("/gallery");
  await expect(page.getByText("تصویر.webp", { exact: true })).toBeVisible();
  await expect(page.getByText("صدا.m4a", { exact: true })).toBeVisible();
  await expect(page.getByText(/پیکسل/)).toHaveCount(2);
  await expect(page.getByText(/ثانیه/)).toBeVisible();
  await expect(page.getByText(/انقضا:/)).toHaveCount(4);
  await expect(page.getByText("اطلاعات رسانه نامشخص است")).toHaveCount(2);
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
  await page.route("**/file-manager/user-files*", (route) =>
    route.fulfill({ status: 503, json: {} }),
  );
  await page.getByRole("button", { name: "تازه‌سازی", exact: true }).click();
  await expect(page.getByRole("alert")).toContainText("فایل‌ها بارگذاری نشدن");
  await expect(page.getByText("تصویر.webp", { exact: true })).toBeVisible();
});
