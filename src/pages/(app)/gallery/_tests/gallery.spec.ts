import { expect, test } from "@playwright/test";
import { join } from "node:path";

test.afterEach(async ({ page }, info) => {
  if (process.env.GALLERY_SCREENSHOTS) {
    await page.screenshot({
      path: join(
        process.env.TEMP || ".",
        `gallery-${info.title.slice(0, 9)}.png`,
      ),
      fullPage: true,
    });
  }
});

test.beforeEach(async ({ page }) => {
  await page.context().addCookies([
    {
      name: "access_token",
      value: "gallery-test",
      url: "http://localhost:5173",
    },
  ]);
  await page.route("**/*", (route) => {
    if (["fetch", "xhr"].includes(route.request().resourceType()))
      return route.abort();
    return route.continue();
  });
  await page.route("**/api/v1/user/get-info", (route) =>
    route.fulfill({
      json: {
        name: "Gallery tester",
        email: "test@example.com",
        is_verified: true,
        scopes: [],
        is_active: true,
      },
    }),
  );
  await page.route("**/api/v1/file-manager/user-files**", (route) =>
    route.fulfill({
      json: {
        files: ["Aurora.png", "Desert.png", "Ocean.png"].map(
          (file_name, index) => ({
            uuid: `file-${index}`,
            file_name,
            content_type: "image/png",
            file_size: 1024,
            is_public: false,
            created_at: "2026-09-09T10:00:00Z",
            updated_at: "2026-09-09T10:00:00Z",
            expire_at: null,
          }),
        ),
        has_next: false,
      },
    }),
  );
  await page.route("**/api/v1/file-manager/files/presigned-urls", (route) =>
    route.fulfill({
      json: {
        files: [0, 1, 2].map((index) => ({
          file_uuid: `file-${index}`,
          preview_url: `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600"><rect width="800" height="600" fill="${["#6867ac", "#c4966b", "#527d98"][index]}"/><circle cx="400" cy="280" r="150" fill="#ffffff" opacity=".25"/></svg>`)}`,
          download_url: "data:text/plain,test",
        })),
      },
    }),
  );
  await page.goto("/gallery");
});

test("shows the animated brand in the gallery header", async ({ page }) => {
  const header = page.locator("header").filter({
    has: page.locator("[data-brand-entrance]"),
  });
  const brand = header.locator("[data-brand-entrance]");
  await expect(brand).toBeVisible();
  await expect(brand.locator("img")).toBeVisible();
  await expect(brand).toHaveAttribute(
    "data-brand-entrance",
    /thunder|rift|forge/,
  );

  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(brand).toHaveCSS("animation-name", "none");
});

test("searches loaded artwork and clears an empty result", async ({ page }) => {
  const search = page.getByRole("searchbox", {
    name: "جست‌وجو در فایل‌های بارگذاری‌شده",
  });
  await search.fill("Aurora");
  await expect(
    page.getByRole("button", { name: "Aurora.png", exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Desert.png", exact: true }),
  ).toHaveCount(0);
  await search.fill("missing");
  await expect(page.getByText("اثری با این نام پیدا نشد")).toBeVisible();
  await page.getByRole("button", { name: "پاک کردن جست‌وجو" }).click();
  await expect(
    page.getByRole("button", { name: "Desert.png", exact: true }),
  ).toBeVisible();
});

test("navigates the viewer, zooms and restores focus", async ({ page }) => {
  const opener = page.getByRole("button", { name: "Aurora.png", exact: true });
  await opener.click();
  const viewer = page.getByRole("dialog");
  await expect(
    viewer.getByRole("heading", { name: "Aurora.png" }),
  ).toBeVisible();
  await viewer.getByRole("button", { name: "اثر بعدی" }).click();
  await expect(
    viewer.getByRole("heading", { name: "Desert.png" }),
  ).toBeVisible();
  await viewer.getByRole("button", { name: "بزرگ‌نمایی" }).click();
  await expect(
    viewer.getByRole("button", { name: "اندازه مناسب" }),
  ).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(viewer).toHaveCount(0);
  await expect(opener).toBeFocused();
});

test("has usable mobile controls and no horizontal overflow", async ({
  page,
}) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.reload();
  await page.getByRole("button", { name: "نمای فشرده" }).click();
  await expect(
    page.getByRole("button", { name: "نمای فشرده" }),
  ).toHaveAttribute("aria-pressed", "true");
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
});

test("supports RTL keyboard navigation and sorting", async ({ page }) => {
  await page.getByRole("combobox", { name: "مرتب‌سازی" }).click();
  await page.getByRole("option", { name: "نام فایل" }).click();
  await page.getByRole("button", { name: "Aurora.png", exact: true }).click();
  await page.keyboard.press("ArrowLeft");
  await expect(
    page.getByRole("dialog").getByRole("heading", { name: "Desert.png" }),
  ).toBeVisible();
  await page.keyboard.press("ArrowRight");
  await expect(
    page.getByRole("dialog").getByRole("heading", { name: "Aurora.png" }),
  ).toBeVisible();
});

test("supports direct RTL swipe navigation in the viewer", async ({ page }) => {
  await page.getByRole("button", { name: "Aurora.png", exact: true }).click();
  const media = page.locator("[data-gallery-viewer-media]");
  const box = await media.boundingBox();
  expect(box).not.toBeNull();
  if (!box) return;

  const centerX = box.x + box.width / 2;
  const centerY = box.y + box.height / 2;
  await media.dispatchEvent("pointerdown", {
    pointerId: 1,
    pointerType: "touch",
    isPrimary: true,
    buttons: 1,
    clientX: centerX,
    clientY: centerY,
  });
  await media.dispatchEvent("pointermove", {
    pointerId: 1,
    pointerType: "touch",
    isPrimary: true,
    buttons: 1,
    clientX: centerX + 120,
    clientY: centerY,
  });
  await media.dispatchEvent("pointerup", {
    pointerId: 1,
    pointerType: "touch",
    isPrimary: true,
    buttons: 0,
    clientX: centerX + 120,
    clientY: centerY,
  });

  await expect(
    page.getByRole("dialog").getByRole("heading", { name: "Desert.png" }),
  ).toBeVisible();
});

test("cancels deletion without making a delete request", async ({ page }) => {
  let deletes = 0;
  page.on("request", (request) => {
    if (request.method() === "DELETE") deletes += 1;
  });
  await page
    .getByRole("article")
    .first()
    .getByRole("button", { name: "حذف", exact: true })
    .click();
  await expect(
    page.getByRole("dialog").getByRole("heading", { name: "حذف فایل" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "انصراف", exact: true }).click();
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await expect(
    page.getByRole("button", { name: "Aurora.png", exact: true }),
  ).toBeVisible();
  expect(deletes).toBe(0);
});

test("keeps media requests out of the grid", async ({ page }) => {
  await page.route("**/api/v1/file-manager/user-files**", (route) =>
    route.fulfill({
      json: {
        files: [
          {
            uuid: "file-0",
            file_name: "Film.mp4",
            content_type: "video/mp4",
            file_size: 1024,
          },
        ],
        has_next: false,
      },
    }),
  );
  await page.reload();
  await expect(
    page.getByRole("button", { name: "Film.mp4", exact: true }),
  ).toBeVisible();
  await expect(page.locator("video,audio")).toHaveCount(0);
});
