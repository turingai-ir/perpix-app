import { chromium, expect, test, type Page } from "@playwright/test";
import { join } from "node:path";
import { mockAuthenticatedSession } from "../../../../__tests__/support/auth-session";

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
  await page.route("**/api/v1/user/me", (route) =>
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
  await mockAuthenticatedSession(page);
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

test("keeps the gallery brand inside its slot around the mobile breakpoint", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  const header = page.locator("header").filter({
    has: page.locator("[data-brand-entrance]"),
  });
  const brand = header.locator("[data-brand-entrance]");

  for (const { width, visible } of [
    { width: 430, visible: false },
    { width: 431, visible: true },
    { width: 480, visible: true },
  ]) {
    await page.setViewportSize({ width, height: 812 });

    if (!visible) {
      await expect(brand).toBeHidden();
      continue;
    }

    await expect(brand).toBeVisible();
    const slot = brand.locator("..");
    const slotBox = await slot.boundingBox();
    const brandBox = await brand.boundingBox();
    expect(slotBox).not.toBeNull();
    expect(brandBox).not.toBeNull();
    expect(brandBox!.x).toBeGreaterThanOrEqual(slotBox!.x - 0.5);
    expect(brandBox!.y).toBeGreaterThanOrEqual(slotBox!.y - 0.5);
    expect(brandBox!.x + brandBox!.width).toBeLessThanOrEqual(
      slotBox!.x + slotBox!.width + 0.5,
    );
    expect(brandBox!.y + brandBox!.height).toBeLessThanOrEqual(
      slotBox!.y + slotBox!.height + 0.5,
    );
  }
});

for (const viewport of [
  { width: 375, height: 812 },
  { width: 812, height: 375 },
  { width: 768, height: 1024 },
  { width: 1440, height: 900 },
]) {
  test.describe(`media filters at ${viewport.width}x${viewport.height}`, () => {
    test.use({ viewport, reducedMotion: "reduce" });
    test("are equally sized and remain interactive", async ({ page }) => {
      await page.evaluate(() => document.fonts.ready);
      const filters = ["همه", "عکس", "ویدیو", "صدا"].map((name) =>
        page.getByRole("button", { name, exact: true }),
      );
      await expect(filters[0]).toBeVisible();
      const boxes = await Promise.all(
        filters.map((filter) => filter.boundingBox()),
      );
      for (const box of boxes) {
        expect(box).not.toBeNull();
        expect(box!.height).toBeGreaterThanOrEqual(44);
        expect(box!.width).toBeGreaterThanOrEqual(44);
        expect(Math.abs(box!.width - boxes[0]!.width)).toBeLessThan(1);
        expect(Math.abs(box!.y - boxes[0]!.y)).toBeLessThan(1);
      }
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBe(true);
      await filters[2].click();
      await expect(filters[2]).toHaveAttribute("aria-pressed", "true");
      await filters[1].click();
      await expect(filters[1]).toHaveAttribute("aria-pressed", "true");
      await expect(
        page.getByRole("button", { name: "Aurora.png", exact: true }),
      ).toBeVisible();
      await page.screenshot({
        path: test.info().outputPath("gallery-layout.png"),
        fullPage: true,
      });
    });
  });
}

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
  await expect(page.getByText("چیزی با این اسم پیدا نشد")).toBeVisible();
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

test("rejects a script URL returned for a gallery download", async ({
  page,
}) => {
  await mockAuthenticatedSession(page);
  await page.addInitScript(() => {
    HTMLAnchorElement.prototype.click = function () {
      Reflect.set(window, "__downloadLink", this.href);
    };
  });
  await page.route("**/api/v1/file-manager/files/presigned-urls", (route) =>
    route.fulfill({
      json: {
        files: [0, 1, 2].map((index) => ({
          file_uuid: `file-${index}`,
          preview_url: "data:image/png;base64,iVBORw0KGgo=",
          download_url: "java" + "script:window.__downloadProbe=true",
        })),
      },
    }),
  );
  await page.reload();
  await page.getByRole("button", { name: "Aurora.png", exact: true }).click();
  await page
    .getByRole("dialog")
    .getByRole("button", { name: "دانلود" })
    .click();
  expect(
    await page.evaluate(() => Reflect.get(window, "__downloadLink")),
  ).toBeUndefined();
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

async function mockVideoGallery(page: Page, previewUrl: string) {
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
  await page.route("**/api/v1/file-manager/files/presigned-urls", (route) =>
    route.fulfill({
      json: {
        files: [
          {
            file_uuid: "file-0",
            preview_url: previewUrl,
            download_url: previewUrl,
          },
        ],
      },
    }),
  );
  await page.reload();
}

test.describe("video thumbnails", () => {
  const previewUrl = "http://localhost:5173/gallery-thumbnail.webm";
  let videoBytes: Buffer;

  test.beforeAll(async () => {
    // Record in Chromium because Windows WebKit cannot capture a canvas.
    const browser = await chromium.launch();
    try {
      const recorderPage = await browser.newPage();
      const bytes = await recorderPage.evaluate(async () => {
        const canvas = document.createElement("canvas");
        canvas.width = 160;
        canvas.height = 90;
        const context = canvas.getContext("2d")!;
        const stream = canvas.captureStream(10);
        const recorder = new MediaRecorder(stream, {
          mimeType: "video/webm;codecs=vp8",
        });
        const chunks: Blob[] = [];
        const recording = new Promise<Blob>((resolve) => {
          recorder.ondataavailable = (event) => chunks.push(event.data);
          recorder.onstop = () => resolve(new Blob(chunks));
        });
        recorder.start();
        const timer = setInterval(() => {
          context.fillStyle = "#2a7896";
          context.fillRect(0, 0, 160, 90);
        }, 50);
        await new Promise((resolve) => setTimeout(resolve, 600));
        clearInterval(timer);
        recorder.stop();
        const blob = await recording;
        stream.getTracks().forEach((track) => track.stop());
        return Array.from(new Uint8Array(await blob.arrayBuffer()));
      });
      videoBytes = Buffer.from(bytes);
    } finally {
      await browser.close();
    }
  });

  test.beforeEach(async ({ page }) => {
    await page.route(previewUrl, (route) => {
      const range = route
        .request()
        .headers()
        .range?.match(/bytes=(\d+)-(\d*)/);
      const start = range ? Number(range[1]) : 0;
      const end = range?.[2]
        ? Math.min(Number(range[2]), videoBytes.length - 1)
        : videoBytes.length - 1;
      return route.fulfill({
        status: range ? 206 : 200,
        contentType: "video/webm",
        headers: {
          "Accept-Ranges": "bytes",
          ...(range
            ? { "Content-Range": `bytes ${start}-${end}/${videoBytes.length}` }
            : {}),
        },
        body: videoBytes.subarray(start, end + 1),
      });
    });
  });

  for (const viewport of [
    { width: 375, height: 812 },
    { width: 768, height: 1024 },
    { width: 1440, height: 900 },
  ]) {
    test(`shows an opening frame or unsupported-media fallback at ${viewport.width}`, async ({
      page,
      browserName,
    }, testInfo) => {
      await page.setViewportSize(viewport);
      await page.emulateMedia({ reducedMotion: "reduce" });
      await mockVideoGallery(page, previewUrl);
      const opener = page.getByRole("button", {
        name: "Film.mp4",
        exact: true,
      });
      if (browserName === "webkit" && process.platform === "win32") {
        testInfo.annotations.push({
          type: "media-limitation",
          description:
            "Windows WebKit cannot decode the synthetic MediaRecorder fixture; verifies fallback instead of decoded frames.",
        });
        await expect(opener.locator(".lucide-file-video")).toBeVisible();
        await expect(opener.locator("video")).toHaveCount(0);
        expect(
          await page.evaluate(
            () => document.documentElement.scrollWidth <= innerWidth,
          ),
        ).toBe(true);
        await page.screenshot({
          path: testInfo.outputPath("video-fallback.png"),
          fullPage: true,
        });
        return;
      }
      const video = opener.locator("video");
      await expect(video).toBeVisible();
      await expect(video).toHaveCSS("opacity", "1");
      await expect
        .poll(() =>
          video.evaluate((media: HTMLVideoElement) => ({
            ready: media.readyState >= 2,
            paused: media.paused,
            muted: media.muted,
            controls: media.controls,
            autoplay: media.autoplay,
            openingFrame: media.currentTime > 0 && media.currentTime <= 0.15,
          })),
        )
        .toEqual({
          ready: true,
          paused: true,
          muted: true,
          controls: false,
          autoplay: false,
          openingFrame: true,
        });
      const pixel = await video.evaluate((media: HTMLVideoElement) => {
        const canvas = document.createElement("canvas");
        canvas.width = 1;
        canvas.height = 1;
        const context = canvas.getContext("2d")!;
        context.drawImage(media, 0, 0, 1, 1);
        return Array.from(context.getImageData(0, 0, 1, 1).data);
      });
      expect(pixel[1]).toBeGreaterThan(100);
      expect(pixel[2]).toBeGreaterThan(130);
      expect(pixel[3]).toBe(255);
      await expect(opener.locator(".lucide-play")).toBeVisible();
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBe(true);
      await page.screenshot({
        path: test.info().outputPath("video-thumbnail.png"),
        fullPage: true,
      });
      await page.getByRole("button", { name: "نمای فشرده" }).click();
      await expect(video).toHaveCSS("object-fit", "cover");
      const article = opener.locator("..");
      await article.evaluate((element: HTMLElement) => {
        element.style.marginTop = "2000px";
      });
      await expect(video).toHaveCount(0);
      await article.evaluate((element: HTMLElement) => {
        element.style.marginTop = "";
      });
      await expect(video).toHaveCSS("opacity", "1");
      await opener.click();
      await expect(page.getByRole("dialog").locator("video")).toHaveJSProperty(
        "controls",
        true,
      );
      await page.keyboard.press("Escape");
      await expect(opener).toBeFocused();
      await expect(video).toHaveJSProperty("paused", true);
    });
  }

  test("falls back when video decoding fails", async ({ page }) => {
    await page.route(previewUrl, (route) => route.fulfill({ status: 404 }));
    await mockVideoGallery(page, previewUrl);
    const opener = page.getByRole("button", { name: "Film.mp4", exact: true });
    await expect(opener).toBeVisible();
    await expect(opener.locator("video")).toHaveCount(0);
    await expect(opener.locator(".lucide-file-video")).toBeVisible();
    await opener.click();
    await expect(page.getByRole("dialog")).toBeVisible();
  });
});
