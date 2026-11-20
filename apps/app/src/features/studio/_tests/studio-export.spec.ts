import { execFileSync } from "node:child_process";
import { mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { expect, test, webkit, type BrowserContext } from "@playwright/test";
import {
  EXPORT_PROFILES,
  estimatedBytes,
  profileRestriction,
  storageBytes,
} from "../export/model/video-export";
import { openEditor, seekTo } from "./editor-mocks";

test("lists the supported options and downloads a captioned video with sound", async ({
  page: defaultPage,
  browserName,
  baseURL,
}) => {
  test.setTimeout(65_000);
  const directory = mkdtempSync(join(tmpdir(), "studio-export-"));
  let context: BrowserContext | undefined;
  try {
    if (browserName === "webkit") {
      context = await webkit.launchPersistentContext(
        join(directory, "profile"),
        { baseURL },
      );
    }
    const page = context?.pages()[0] ?? defaultPage;
    const source = join(directory, "source.webm");
    execFileSync("ffmpeg", [
      "-v",
      "error",
      "-f",
      "lavfi",
      "-i",
      "color=black:s=160x90:r=24",
      "-f",
      "lavfi",
      "-i",
      "sine=frequency=440:sample_rate=44100",
      "-t",
      "2",
      "-c:v",
      "libvpx",
      "-c:a",
      "libopus",
      source,
    ]);
    const media = readFileSync(source);
    let ranges = 0;
    await openEditor(page, "COMPLETED", async () => {
      await page.route("**/__media/f1.webm", (route) => {
        const range = route
          .request()
          .headers()
          .range?.match(/^bytes=(\d+)-(\d*)$/);
        if (!range)
          return route.fulfill({ contentType: "video/webm", body: media });
        ranges++;
        const from = Number(range[1]);
        const until = range[2]
          ? Math.min(Number(range[2]), media.length - 1)
          : media.length - 1;
        if (from > until) return route.fulfill({ status: 416 });
        return route.fulfill({
          status: 206,
          contentType: "video/webm",
          headers: {
            "Content-Range": `bytes ${from}-${until}/${media.length}`,
            "Accept-Ranges": "bytes",
          },
          body: media.subarray(from, until + 1),
        });
      });
    });
    await seekTo(page, 1000);
    await page.getByRole("button", { name: "جدا کردن" }).click();
    await expect(page.getByTestId("timeline-clip")).toHaveCount(2);
    await page.getByRole("button", { name: "خروجی ویدیو" }).click();
    await page.getByRole("radio", { name: /۴۸۰/ }).check();
    await page.getByRole("button", { name: "ساخت خروجی" }).click();
    const downloadLink = page.getByRole("link", { name: "دانلود ویدیو" });
    await expect(downloadLink).toBeVisible({ timeout: 40_000 });
    const [download] = await Promise.all([
      page.waitForEvent("download"),
      downloadLink.click(),
    ]);
    const exported = join(directory, download.suggestedFilename());
    await download.saveAs(exported);

    const probe = JSON.parse(
      execFileSync(
        "ffprobe",
        [
          "-v",
          "error",
          "-show_streams",
          "-show_format",
          "-of",
          "json",
          exported,
        ],
        { encoding: "utf8" },
      ),
    );
    expect(probe.streams).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          codec_type: "video",
          width: 480,
          height: 854,
        }),
        expect.objectContaining({
          codec_type: "audio",
          sample_rate: "48000",
          channels: 2,
        }),
      ]),
    );
    // AAC encoders can append a small amount of padding after the project boundary.
    expect(Math.abs(Number(probe.format.duration) - 2)).toBeLessThan(0.065);
    expect(ranges).toBeGreaterThan(0);
    const audio = execFileSync("ffmpeg", [
      "-v",
      "error",
      "-ss",
      "0.75",
      "-i",
      exported,
      "-t",
      "0.5",
      "-map",
      "0:a:0",
      "-f",
      "s16le",
      "pipe:1",
    ]);
    expect(audio.some((byte) => byte !== 0)).toBe(true);
    const frame = execFileSync("ffmpeg", [
      "-v",
      "error",
      "-ss",
      "0.5",
      "-i",
      exported,
      "-frames:v",
      "1",
      "-pix_fmt",
      "gray",
      "-f",
      "rawvideo",
      "pipe:1",
    ]);
    expect(frame.some((pixel) => pixel > 100)).toBe(true);
    if (browserName === "chromium") {
      const fast = page.getByRole("radio", { name: /۶۰ فریم/ });
      await expect(fast).toBeEnabled();
      await fast.check();
      await page.getByRole("button", { name: "ساخت خروجی" }).click();
      await expect(downloadLink).toBeVisible({ timeout: 30_000 });
      const [fastDownload] = await Promise.all([
        page.waitForEvent("download"),
        downloadLink.click(),
      ]);
      const videoPath = join(
        directory,
        `fast-${fastDownload.suggestedFilename()}`,
      );
      await fastDownload.saveAs(videoPath);
      const fastProbe = JSON.parse(
        execFileSync(
          "ffprobe",
          [
            "-v",
            "error",
            "-select_streams",
            "v:0",
            "-count_frames",
            "-show_streams",
            "-of",
            "json",
            videoPath,
          ],
          { encoding: "utf8" },
        ),
      );
      expect(fastProbe.streams).toMatchObject([
        {
          width: 1080,
          height: 1920,
          r_frame_rate: "60/1",
          nb_read_frames: "120",
        },
      ]);
      execFileSync("ffmpeg", [
        "-v",
        "error",
        "-xerror",
        "-i",
        videoPath,
        "-map",
        "0:a:0",
        "-f",
        "null",
        "-",
      ]);
    }
  } finally {
    await context?.close();
    rmSync(directory, { recursive: true, force: true });
  }
});

test("explains when the browser has no encoder", async ({ page }) => {
  await openEditor(page, "COMPLETED", async () => {
    await page.addInitScript(() => {
      class UnsupportedWorker extends EventTarget {
        onmessage?: (event: MessageEvent) => void;
        postMessage() {
          queueMicrotask(() =>
            this.onmessage?.(
              new MessageEvent("message", {
                data: { type: "options", options: [], issue: "device" },
              }),
            ),
          );
        }
        terminate() {}
      }
      Object.defineProperty(window, "Worker", { value: UnsupportedWorker });
    });
  });
  await page.getByRole("button", { name: "خروجی ویدیو" }).click();
  await expect(
    page.getByText("مرورگر این دستگاه امکان ساخت خروجی ویدیو را ندارد."),
  ).toBeVisible();
  await expect(page.getByRole("button", { name: "ساخت خروجی" })).toBeDisabled();
});

test("disables qualities above the device budget and can cancel rendering", async ({
  page,
}) => {
  await openEditor(page, "COMPLETED", async () => {
    await page.addInitScript((profiles) => {
      class LimitedWorker extends EventTarget {
        onmessage?: (event: MessageEvent) => void;
        postMessage(request: { type: string }) {
          const data =
            request.type === "probe"
              ? {
                  type: "options",
                  options: [
                    { profile: profiles[0], format: "mp4" },
                    { profile: profiles[1], issue: "storage" },
                    { profile: profiles[2], issue: "device" },
                  ],
                }
              : { type: "progress", progress: 42 };
          queueMicrotask(() =>
            this.onmessage?.(new MessageEvent("message", { data })),
          );
        }
        terminate() {}
      }
      Object.defineProperty(window, "Worker", { value: LimitedWorker });
    }, EXPORT_PROFILES);
  });
  await page.getByRole("button", { name: "خروجی ویدیو" }).click();
  await expect(page.getByRole("radio", { name: /۴۸۰/ })).toBeChecked();
  await expect(page.getByRole("radio", { name: /۷۲۰/ })).toBeDisabled();
  await expect(page.getByRole("radio", { name: /۱٬۰۸۰/ })).toBeDisabled();
  await expect(page.getByText(/فضای محلی مرورگر/)).toBeVisible();
  await expect(
    page.getByText("این کیفیت روی دستگاه در دسترس نیست."),
  ).toBeVisible();
  await page.getByRole("button", { name: "ساخت خروجی" }).click();
  await expect(page.getByRole("progressbar")).toHaveAttribute("value", "42");
  await page.getByRole("button", { name: "لغو خروجی" }).click();
  await expect(page.getByRole("progressbar")).toHaveCount(0);
  await expect(page.getByRole("button", { name: "ساخت خروجی" })).toBeEnabled();
});

test("keeps 60 fps eligible when the estimated output fits in storage", () => {
  const [light, , full, fast] = EXPORT_PROFILES;
  const durationMs = 15 * 60_000;
  const freeBytes = storageBytes(light, durationMs);
  expect(estimatedBytes(light, 60_000)).toBe(12_960_000);
  expect(profileRestriction(light, durationMs, freeBytes)).toBeUndefined();
  expect(profileRestriction(full, durationMs, freeBytes)).toBe("storage");
  expect(profileRestriction(fast, durationMs, freeBytes)).toBe("storage");
  expect(
    profileRestriction(fast, durationMs, storageBytes(fast, durationMs)),
  ).toBeUndefined();
});

for (const format of ["mp4", "webm"] as const) {
  test(`offers native sharing only for a shareable ${format} export`, async ({
    page,
  }) => {
    const uploads: string[] = [];
    page.on("request", (request) => {
      if (
        request.method() === "POST" &&
        /\/file-manager\/(simple-upload|multipart\/)/.test(
          new URL(request.url()).pathname,
        )
      ) {
        uploads.push(request.url());
      }
    });

    await openEditor(page, "COMPLETED", async () => {
      await page.addInitScript(
        ({ profile, format }) => {
          class FinishedExportWorker extends EventTarget {
            onmessage?: (event: MessageEvent) => void;
            postMessage(request: { type: string }) {
              const data =
                request.type === "probe"
                  ? { type: "options", options: [{ profile, format }] }
                  : {
                      type: "done",
                      file: new File(["test-video"], "temporary"),
                    };
              queueMicrotask(() =>
                this.onmessage?.(new MessageEvent("message", { data })),
              );
            }
            terminate() {}
          }
          Object.defineProperty(window, "Worker", {
            value: FinishedExportWorker,
          });
          const shares: ShareData[] = [];
          Object.defineProperty(window, "studioShares", { value: shares });
          Object.defineProperty(navigator, "canShare", {
            value: ({ files }: ShareData) =>
              format === "mp4" &&
              files?.length === 1 &&
              files[0].type === "video/mp4",
          });
          Object.defineProperty(navigator, "share", {
            value: async (data: ShareData) => {
              if (!navigator.userActivation.isActive)
                throw new Error("Missing user activation");
              shares.push(data);
              if (shares.length === 1)
                throw new DOMException("Canceled", "AbortError");
              if (shares.length === 2)
                throw new DOMException("Transfer failed", "DataError");
            },
          });
        },
        { profile: EXPORT_PROFILES[0], format },
      );
    });

    await page.getByRole("button", { name: "خروجی ویدیو" }).click();
    const share = page.getByRole("button", { name: "اشتراک‌گذاری ویدیو" });
    await expect(share).toHaveCount(0);
    await page.getByRole("button", { name: "ساخت خروجی" }).click();
    const download = page.getByRole("link", { name: "دانلود ویدیو" });
    await expect(download).toHaveAttribute("download", `پروژه.${format}`);
    if (format === "webm") {
      await expect(share).toHaveCount(0);
    } else {
      await share.click();
      await expect(share).toBeEnabled();
      const failure = page.getByText(
        "اشتراک‌گذاری انجام نشد. می‌توانی ویدیو را دانلود کنی.",
      );
      await expect(failure).toHaveCount(0);
      await share.click();
      await expect(failure).toBeVisible();
      await share.click();
      await expect(failure).toHaveCount(0);
      const payload = await page.evaluate(async () => {
        const { studioShares } = window as Window & {
          studioShares: ShareData[];
        };
        const files = studioShares.flatMap((data) => data.files ?? []);
        return Promise.all(
          files.map(async (file) => ({
            name: file.name,
            type: file.type,
            content: await file.text(),
          })),
        );
      });
      expect(payload).toEqual(
        Array.from({ length: 3 }, () => ({
          name: "پروژه.mp4",
          type: "video/mp4",
          content: "test-video",
        })),
      );
    }
    await expect(download).toBeVisible();
    expect(uploads).toEqual([]);
  });
}
