import { chromium, expect, test, type Page } from "@playwright/test";

const previewName = /پیش‌نمایش ویدیو|pages\.generation\.video\.output\.preview/;
const retryName = /تلاش دوباره|pages\.generation\.video\.output\.retry/;

let portraitVideo: { contentType: string; bytes: number[] };

test.beforeAll(async () => {
  // Windows WebKit cannot capture a canvas; record the shared fixture in Chromium.
  const recorderBrowser = await chromium.launch();
  const recorderPage = await recorderBrowser.newPage();
  portraitVideo = await recorderPage.evaluate(async () => {
    const canvas = document.createElement("canvas");
    canvas.width = 360;
    canvas.height = 640;
    const stream = canvas.captureStream(10);
    const recorder = new MediaRecorder(stream, {
      mimeType: "video/webm;codecs=vp8",
    });
    const chunks: Blob[] = [];
    const recording = new Promise<Blob>((resolve) => {
      recorder.ondataavailable = (event) => chunks.push(event.data);
      recorder.onstop = () =>
        resolve(new Blob(chunks, { type: recorder.mimeType }));
    });
    recorder.start();
    const context = canvas.getContext("2d")!;
    const gradient = context.createLinearGradient(0, 0, 360, 640);
    gradient.addColorStop(0, "#ecd3a7");
    gradient.addColorStop(1, "#273b43");
    context.fillStyle = gradient;
    context.fillRect(0, 0, 360, 640);
    context.fillStyle = "#bd8555";
    context.beginPath();
    context.arc(270, 160, 72, 0, Math.PI * 2);
    context.fill();
    context.fillStyle = "#173a39";
    context.beginPath();
    context.moveTo(0, 450);
    context.lineTo(190, 230);
    context.lineTo(360, 480);
    context.lineTo(360, 640);
    context.lineTo(0, 640);
    context.fill();
    context.fillStyle = "#eef1e9";
    context.font = "18px sans-serif";
    context.fillText("TEST FOOTAGE", 24, 590);
    let frame = 0;
    const frameTimer = setInterval(() => {
      context.fillStyle = frame++ % 2 === 0 ? "#173a39" : "#183b3a";
      context.fillRect(0, 630, 360, 10);
    }, 100);
    await new Promise((resolve) => setTimeout(resolve, 1200));
    clearInterval(frameTimer);
    recorder.stop();
    const blob = await recording;
    stream.getTracks().forEach((track) => track.stop());
    return {
      contentType: blob.type,
      bytes: Array.from(new Uint8Array(await blob.arrayBuffer())),
    };
  });
  await recorderBrowser.close();
});

async function openResult(
  page: Page,
  expired = false,
  unavailable = false,
  mediaUnavailable = () => false,
) {
  await page.context().addCookies([
    {
      name: "access_token",
      value: "test-token",
      url: "http://localhost:5173",
    },
  ]);
  await page.addInitScript(() => {
    localStorage.clear();
    indexedDB.deleteDatabase("REACT_QUERY_OFFLINE_CACHE");
  });
  await page.route("**/*", async (route) => {
    const request = route.request();
    const url = new URL(request.url());
    const path = url.pathname.replace(/^\/api\/v1/, "");
    let body: unknown;
    if (path === "/user/get-info")
      body = { uuid: "user-1", mobile: "09120000000" };
    if (path === "/user/subscription/active") body = null;
    if (path === "/user/subscription/plans" || path === "/ai-registry/models")
      body = [];
    if (path === "/wallet/wallet")
      body = { wallet_uuid: "wallet-1", balance_usdmicro: 1_000_000 };
    if (path === "/ai-task/list") body = { items: [], has_next: false };
    if (path === "/ai-task/video-output-test") {
      body = {
        uuid: "video-output-test",
        task_type: "VIDEO",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        messages: [
          {
            uuid: "video-result",
            role: "ASSISTANT",
            task_status: "SUCCESS",
            message: null,
            ai_model_config: { videos_generated: ["video-file"] },
          },
        ],
      };
    }
    if (path === "/file-manager/files/presigned-urls") {
      if (unavailable)
        return route.fulfill({ status: 503, json: { detail: "Unavailable" } });
      body = {
        files: [
          {
            file_uuid: "video-file",
            preview_url: "http://localhost:5173/test-preview.webm",
            download_url: "http://localhost:5173/test-download.webm",
            expire_at: new Date(
              Date.now() + (expired ? -60_000 : 3_600_000),
            ).toISOString(),
          },
        ],
      };
    }
    if (body !== undefined) return route.fulfill({ json: body });
    if (path === "/test-download.webm") {
      return route.fulfill({
        body: "video-test",
        contentType: "video/webm",
        headers: {
          "Content-Disposition": 'attachment; filename="generated-video.webm"',
        },
      });
    }
    if (
      path === "/test-preview.webm" ||
      path === "/test-preview-refreshed.webm"
    ) {
      if (mediaUnavailable())
        return route.fulfill({ status: 404, body: "Missing video" });
      const bytes = Buffer.from(portraitVideo.bytes);
      const range = request.headers().range?.match(/bytes=(\d+)-(\d*)/);
      if (range) {
        const start = Number(range[1]);
        const end = range[2]
          ? Math.min(Number(range[2]), bytes.length - 1)
          : bytes.length - 1;
        return route.fulfill({
          status: 206,
          contentType: portraitVideo.contentType,
          headers: {
            "Accept-Ranges": "bytes",
            "Content-Range": `bytes ${start}-${end}/${bytes.length}`,
          },
          body: bytes.subarray(start, end + 1),
        });
      }
      return route.fulfill({
        contentType: portraitVideo.contentType,
        headers: { "Accept-Ranges": "bytes" },
        body: bytes,
      });
    }
    if (
      url.origin === "http://localhost:5173" &&
      request.method() === "GET" &&
      !["fetch", "xhr"].includes(request.resourceType()) &&
      !url.pathname.startsWith("/api/")
    ) {
      return route.continue();
    }
    return route.abort("blockedbyclient");
  });
  await page.goto("/generation/video/video-output-test");
}

for (const viewport of [
  { width: 1440, height: 900 },
  { width: 375, height: 812 },
]) {
  test(`video actions sit below a fitted player at ${viewport.width}px`, async ({
    page,
    browserName,
  }, testInfo) => {
    await page.setViewportSize(viewport);
    await openResult(page);
    const output = page.getByRole("group", { name: "ویدیو 1", exact: true });
    const preview = output.getByRole("button", { name: previewName });
    const download = output.getByRole("button", {
      name: "دانلود",
      exact: true,
    });
    await expect(preview).toBeEnabled({ timeout: 15_000 });
    await expect(download).toBeEnabled();
    const video = output.locator("video");
    const unsupportedFixture =
      browserName === "webkit" && process.platform === "win32";
    if (unsupportedFixture) {
      testInfo.annotations.push({
        type: "media-limitation",
        description:
          "Windows WebKit cannot decode this synthetic MediaRecorder fixture. Native portrait metadata is verified in Chromium; WebKit verifies the unsupported-media recovery UI.",
      });
      await expect(output.getByRole("status")).toBeVisible();
      await expect(
        output.getByRole("button", { name: retryName }),
      ).toBeEnabled();
    } else {
      await expect(video).toHaveAttribute("controls", "");
      await expect(video).not.toHaveAttribute("autoplay", "");
      expect(
        await video.evaluate((element: HTMLVideoElement) => element.paused),
      ).toBe(true);
      await expect(video).toHaveCSS("object-fit", "contain");
      await expect
        .poll(() =>
          video.evaluate((element: HTMLVideoElement) => element.videoHeight),
        )
        .toBe(640);
      await video.evaluate((element: HTMLVideoElement) => {
        element.currentTime = 0.1;
      });
      await expect
        .poll(() =>
          video.evaluate((element: HTMLVideoElement) => element.readyState),
        )
        .toBeGreaterThanOrEqual(2);
      await expect
        .poll(() =>
          video.evaluate((element: HTMLVideoElement) => element.seeking),
        )
        .toBe(false);
      await video.evaluate(async (element: HTMLVideoElement) => {
        await element.play();
        await new Promise((resolve) => setTimeout(resolve, 250));
        element.pause();
      });
    }
    const videoBounds = await (
      unsupportedFixture ? output.getByRole("status") : video
    ).boundingBox();
    const actionBounds = await preview.boundingBox();
    expect(videoBounds!.height).toBeLessThanOrEqual(viewport.height * 0.55 + 1);
    expect(actionBounds!.y).toBeGreaterThanOrEqual(
      videoBounds!.y + videoBounds!.height,
    );
    expect(actionBounds!.height).toBeGreaterThanOrEqual(44);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);

    await output.screenshot({
      path: `.artifacts/video-output-${viewport.width}.png`,
    });
    await page.evaluate(() => {
      document.querySelectorAll<HTMLElement>("*").forEach((element) => {
        if (element.scrollTop) element.scrollTop = 0;
      });
      window.scrollTo(0, 0);
    });
    await page.screenshot({
      path: `.impeccable/review/video-ready-${viewport.width}.png`,
      fullPage: true,
    });
    await preview.focus();
    await page.keyboard.press("Enter");
    const dialog = page.getByRole("dialog", { name: "ویدیو 1", exact: true });
    await expect(dialog).toBeVisible();
    if (unsupportedFixture) {
      await expect(dialog.getByRole("status")).toBeVisible();
      await expect(
        dialog.getByRole("button", { name: retryName }),
      ).toBeEnabled();
    } else {
      await expect(dialog.locator("video")).toHaveAttribute("controls", "");
      await expect(dialog.locator("video")).not.toHaveAttribute("autoplay", "");
      await dialog.locator("video").evaluate((element: HTMLVideoElement) => {
        element.currentTime = 0.1;
      });
      await expect
        .poll(() =>
          dialog
            .locator("video")
            .evaluate((element: HTMLVideoElement) => element.readyState),
        )
        .toBeGreaterThanOrEqual(2);
      await expect
        .poll(() =>
          dialog
            .locator("video")
            .evaluate((element: HTMLVideoElement) => element.seeking),
        )
        .toBe(false);
      await dialog
        .locator("video")
        .evaluate(async (element: HTMLVideoElement) => {
          await element.play();
          await new Promise((resolve) => setTimeout(resolve, 250));
          element.pause();
        });
    }
    await dialog.screenshot({
      path: `.artifacts/video-output-dialog-${viewport.width}.png`,
    });
    await page.screenshot({
      path: `.impeccable/review/video-dialog-${viewport.width}.png`,
    });
    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();
    await expect(preview).toBeFocused();

    const downloadRequest = page.waitForRequest("**/test-download.webm");
    const downloadEvent =
      browserName === "chromium" ? page.waitForEvent("download") : undefined;
    await download.click();
    expect((await downloadRequest).method()).toBe("GET");
    if (downloadEvent)
      expect((await downloadEvent).suggestedFilename()).toBe(
        "generated-video.webm",
      );
    await page.context().setOffline(true);
    await expect(preview).toBeEnabled();
    await expect(download).toBeEnabled();
  });
}

test("expired video URLs disable actions and retry only the preview request", async ({
  page,
}) => {
  await openResult(page, true);
  const output = page.getByRole("group", { name: "ویدیو 1", exact: true });
  await expect(
    output.getByRole("button", { name: previewName }),
  ).toBeDisabled();
  await expect(
    output.getByRole("button", { name: "دانلود", exact: true }),
  ).toBeDisabled();
  let generated = false;
  page.on("request", (request) => {
    if (request.url().includes("/ai-task/generate")) generated = true;
  });
  await page.route("**/file-manager/files/presigned-urls", (route) =>
    route.fulfill({
      json: {
        files: [
          {
            file_uuid: "video-file",
            preview_url: "http://localhost:5173/test-preview.webm",
            download_url: "http://localhost:5173/test-download.webm",
            expire_at: new Date(Date.now() + 3_600_000).toISOString(),
          },
        ],
      },
    }),
  );
  await output.getByRole("button", { name: retryName }).click();
  await expect(output.getByRole("button", { name: previewName })).toBeEnabled();
  await expect(
    output.getByRole("button", { name: "دانلود", exact: true }),
  ).toBeEnabled();
  expect(generated).toBe(false);
});

for (const refreshedUrl of [
  "test-preview.webm",
  "test-preview-refreshed.webm",
]) {
  test(`failed media retries the file URL and reloads ${refreshedUrl} without generating`, async ({
    page,
    browserName,
  }) => {
    let failMedia = true;
    let mediaRequests = 0;
    let generations = 0;
    page.on("request", (request) => {
      if (request.url().includes("/test-preview")) mediaRequests += 1;
      if (request.url().includes("/ai-task/generate")) generations += 1;
    });
    await openResult(page, false, false, () => failMedia);
    const output = page.getByRole("group", { name: "ویدیو 1", exact: true });
    const retry = output.getByRole("button", { name: retryName });
    await expect(output.getByRole("status")).toBeVisible();
    await expect(retry).toBeEnabled();
    await expect(
      output.getByRole("button", { name: "دانلود", exact: true }),
    ).toBeEnabled();
    const failedRequests = mediaRequests;
    let finishRefresh = () => {};
    const pendingRefresh = new Promise<void>((resolve) => {
      finishRefresh = resolve;
    });
    let refreshed = 0;
    await page.route("**/file-manager/files/presigned-urls", async (route) => {
      refreshed += 1;
      await pendingRefresh;
      await route.fulfill({
        json: {
          files: [
            {
              file_uuid: "video-file",
              preview_url: `http://localhost:5173/${refreshedUrl}`,
              download_url: "http://localhost:5173/test-download.webm",
              expire_at: new Date(Date.now() + 3_600_000).toISOString(),
            },
          ],
        },
      });
    });
    await retry.click();
    await expect(retry).toBeDisabled();
    failMedia = false;
    finishRefresh();
    await expect.poll(() => mediaRequests).toBeGreaterThan(failedRequests);
    expect(refreshed).toBe(1);
    if (browserName !== "webkit" || process.platform !== "win32") {
      await expect
        .poll(() =>
          output
            .locator("video")
            .evaluate((video: HTMLVideoElement) => video.videoHeight),
        )
        .toBe(640);
      await expect(output.getByRole("status")).toBeHidden();
      await expect(retry).toBeHidden();
    } else {
      await expect(retry).toBeEnabled();
    }
    await expect(
      output.getByRole("button", { name: "دانلود", exact: true }),
    ).toBeEnabled();
    expect(generations).toBe(0);
  });
}

test("dialog media failure keeps download available and retries playback", async ({
  page,
  browserName,
}) => {
  test.skip(
    browserName === "webkit" && process.platform === "win32",
    "Windows WebKit cannot decode the synthetic fixture needed for the initial successful inline player.",
  );
  let failMedia = false;
  await openResult(page, false, false, () => failMedia);
  const output = page.getByRole("group", { name: "ویدیو 1", exact: true });
  await expect
    .poll(() =>
      output
        .locator("video")
        .evaluate((video: HTMLVideoElement) => video.videoHeight),
    )
    .toBe(640);
  failMedia = true;
  await output.getByRole("button", { name: previewName }).click();
  const dialog = page.getByRole("dialog", { name: "ویدیو 1", exact: true });
  await expect(dialog.getByRole("status")).toBeVisible();
  await expect(
    dialog.getByRole("button", { name: "دانلود", exact: true }),
  ).toBeEnabled();
  failMedia = false;
  const refetch = page.waitForRequest("**/file-manager/files/presigned-urls");
  await dialog.getByRole("button", { name: retryName }).click();
  await refetch;
  await expect
    .poll(() =>
      dialog
        .locator("video")
        .evaluate((video: HTMLVideoElement) => video.videoHeight),
    )
    .toBe(640);
  await expect(dialog.getByRole("status")).toBeHidden();
  await page.keyboard.press("Escape");
  await expect(output.getByRole("status")).toBeHidden();
});

test("file preview failures leave disabled controls and an explicit recovery action", async ({
  page,
}) => {
  await openResult(page, false, true);
  const output = page.getByRole("group", { name: "ویدیو 1", exact: true });
  await expect(
    output.getByRole("button", { name: previewName }),
  ).toBeDisabled();
  await expect(
    output.getByRole("button", { name: "دانلود", exact: true }),
  ).toBeDisabled();
  await expect(output.getByRole("button", { name: retryName })).toBeVisible({
    timeout: 20_000,
  });
  await expect(output.getByRole("status")).toBeVisible();
});
