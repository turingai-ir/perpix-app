import {
  closeSync,
  mkdtempSync,
  openSync,
  readFileSync,
  rmSync,
  statSync,
  truncateSync,
  writeSync,
} from "node:fs";
import { execFileSync } from "node:child_process";
import { tmpdir } from "node:os";
import { join } from "node:path";
import {
  expect,
  test,
  webkit,
  type Page,
  type BrowserContext,
} from "@playwright/test";

import { mockAuthenticatedSession } from "../../../../__tests__/support/auth-session";

test.use({ viewport: { width: 390, height: 844 }, hasTouch: true });

const VIDEO = readFileSync("src/features/studio/_tests/clip.webm");
const FUTURE = () =>
  new Date(Date.now() + 5 * 86_400_000 - 3_600_000).toISOString();
const NOW = () => new Date().toISOString();

type Status = "PROCESSING" | "COMPLETED" | "FAILED";

/** An in-memory backend for one project, a file upload and its transcript. */
async function mockBackend(
  page: Page,
  transcriptStatuses: Status[],
  {
    galleryHasVideo = true,
    rejectFirstTranscript = false,
  }: {
    galleryHasVideo?: boolean;
    rejectFirstTranscript?: boolean;
  } = {},
) {
  const project = {
    uuid: "p1",
    title: "پروژه",
    revision: 1,
    document: { tracks: [{ kind: "video", clips: [] }] } as Record<
      string,
      unknown
    >,
    files: [] as Array<{ file_uuid: string; role: string }>,
  };
  const state = {
    saves: [] as unknown[],
    transcriptPosts: 0,
    transcriptRequests: [] as unknown[],
    reads: 0,
    uploads: 0,
    order: [] as string[],
  };
  let transcript: { status: Status } | null = null;

  await mockAuthenticatedSession(page);
  await page.route("**/api/v1/user/me", (route) =>
    route.fulfill({
      json: {
        email: "t@example.com",
        phone_number: "+989123456789",
        name: null,
        is_verified: true,
        scopes: [],
        default_wallet_uuid: null,
        is_active: true,
        created_at: NOW(),
        updated_at: NOW(),
      },
    }),
  );
  for (const path of ["/api/v1/ai-task/events", "/api/v1/payment-events"]) {
    await page.route(`**${path}`, (route) =>
      route.fulfill({ contentType: "text/event-stream", body: "" }),
    );
  }
  const view = () => ({
    uuid: project.uuid,
    title: project.title,
    schema_version: 1,
    revision: project.revision,
    expire_at: FUTURE(),
    created_at: NOW(),
    updated_at: NOW(),
    document: project.document,
    files: project.files.map((file) => ({
      ...file,
      available: true,
      content_type: state.uploads ? "audio/mpeg" : "video/webm",
      expire_at: FUTURE(),
    })),
  });
  const summary = () => ({
    uuid: "t1",
    file_uuid: "f1",
    status: transcript?.status ?? "PROCESSING",
    language: "fa",
    duration_ms: 2000,
    failure_message: null,
    created_at: NOW(),
    expire_at: FUTURE(),
  });

  await page.route("**/api/v1/file-manager/simple-upload", (route) => {
    state.uploads += 1;
    state.order.push("upload");
    return route.fulfill({ json: { uuid: "f1" } });
  });
  await page.route("**/api/v1/file-manager/user-files**", (route) =>
    route.fulfill({
      json: {
        files: galleryHasVideo
          ? [
              {
                uuid: "f1",
                file_name: "holiday.webm",
                file_size: 5_000_000,
                content_type: "video/webm",
                is_public: false,
                media_metadata: { kind: "video", duration_seconds: 2 },
              },
            ]
          : [],
        has_next: false,
      },
    }),
  );
  await page.route("**/api/v1/file-manager/files/presigned-urls", (route) =>
    route.fulfill({
      json: {
        files: [
          {
            file_uuid: "f1",
            preview_url: "http://localhost:5173/__media/f1.webm",
            download_url: "http://localhost:5173/__media/f1.webm",
            expire_at: FUTURE(),
          },
        ],
      },
    }),
  );
  await page.route("**/__media/f1.webm", (route) =>
    route.fulfill({ status: 200, contentType: "video/webm", body: VIDEO }),
  );
  await page.route("**/api/v1/studio/projects/p1", async (route) => {
    const request = route.request();
    if (request.method() === "PUT") {
      const body = request.postDataJSON() as {
        document: Record<string, unknown>;
        files: Array<{ file_uuid: string; role: string }>;
      };
      state.saves.push(body);
      state.order.push("save");
      project.document = body.document;
      project.files = body.files;
      project.revision += 1;
    }
    return route.fulfill({ json: view() });
  });
  await page.route("**/api/v1/studio/caption-presets", (route) =>
    route.fulfill({ json: { system: [], mine: [], mine_limit: 0 } }),
  );
  await page.route("**/api/v1/studio/transcripts**", (route) => {
    const request = route.request();
    if (request.method() === "POST") {
      state.transcriptPosts += 1;
      state.transcriptRequests.push(request.postDataJSON());
      if (rejectFirstTranscript && state.transcriptPosts === 1) {
        return route.fulfill({
          status: 426,
          json: { status_code: 1206, detail: "Model access forbidden" },
        });
      }
      transcript = { status: "PROCESSING" };
      return route.fulfill({ json: { ...summary(), words: [], text: "" } });
    }
    if (request.url().endsWith("/transcripts/t1")) {
      return route.fulfill({
        json: {
          ...summary(),
          text: "سلام",
          words: [{ text: "سلام", start_ms: 200, end_ms: 900, speaker: null }],
        },
      });
    }
    if (transcript) {
      transcript.status =
        transcriptStatuses[
          Math.min(state.reads, transcriptStatuses.length - 1)
        ];
      state.reads += 1;
    }
    return route.fulfill({
      json: { items: transcript ? [summary()] : [] },
    });
  });
  return { state };
}

const pickFromGallery = async (page: Page) => {
  await page.getByRole("button", { name: "افزودن ویدیو از گالری" }).click();
  await page.getByRole("button", { name: /holiday\.webm/ }).click();
};

test("an empty project sends the user to the gallery and shows the limits", async ({
  page,
}) => {
  await mockBackend(page, ["PROCESSING"]);
  await page.goto("/studio/p1");

  await expect(page.getByText(/از گالری‌ات انتخاب کن/)).toBeVisible();
  await expect(
    page.getByText(/فقط صدایش برای زیرنویس آپلود می‌شود/).first(),
  ).toBeVisible();
  await expect(page.getByTestId("clip-input")).toHaveCount(0);
});

test("the picker lists the gallery's videos with their length and size", async ({
  page,
}) => {
  await mockBackend(page, ["PROCESSING"]);
  await page.goto("/studio/p1");
  await page.getByRole("button", { name: "افزودن ویدیو از گالری" }).click();

  const card = page.getByRole("button", { name: /holiday\.webm/ });
  await expect(card).toBeVisible();
  await expect(card).toContainText("۰:۰۲");
  await expect(card).toContainText("۴٫۸ مگابایت");
});

test("can choose English before the first gallery transcription", async ({
  page,
}) => {
  const { state } = await mockBackend(page, ["COMPLETED"]);
  await page.goto("/studio/p1");
  const add = page.getByRole("button", { name: "افزودن ویدیو از گالری" });
  await add.click();
  const language = page.getByRole("combobox", { name: "زبان گفتار" });
  await expect(language).toHaveValue("auto", { timeout: 5000 });
  await language.selectOption("en");
  await page.getByRole("button", { name: /holiday\.webm/ }).click();
  await expect
    .poll(() => state.transcriptRequests)
    .toEqual([{ file_uuid: "f1", language: "en" }]);
  expect(state.uploads).toBe(0);

  await add.click();
  await expect(language).toHaveValue("auto");
});

test("a gallery video becomes a clip and its subtitles are polled until ready", async ({
  page,
}) => {
  const { state } = await mockBackend(page, [
    "PROCESSING",
    "PROCESSING",
    "COMPLETED",
  ]);
  await page.goto("/studio/p1");
  await pickFromGallery(page);

  await expect(page.getByText("holiday", { exact: true })).toBeVisible();
  await expect(page.getByText("۰:۰۲").first()).toBeVisible();
  await expect(page.getByText("زیرنویس در حال ساخت")).toBeVisible();
  await expect(page.getByText("زیرنویس آماده")).toBeVisible({
    timeout: 15_000,
  });

  expect(state.uploads).toBe(0);
  expect(state.transcriptPosts).toBe(1);
  expect(state.saves).toHaveLength(1);
  expect(state.saves[0]).toMatchObject({
    revision: 1,
    files: [{ file_uuid: "f1", role: "SOURCE" }],
    document: {
      tracks: [
        {
          kind: "video",
          clips: [
            {
              file_uuid: "f1",
              name: "holiday",
              duration_ms: 2000,
              source_in_ms: 0,
              source_out_ms: 2000,
            },
          ],
        },
      ],
    },
  });
});

test("a 300 MB local video only uploads its audio and can be opened again", async ({
  page: defaultPage,
  browserName,
  baseURL,
}) => {
  test.setTimeout(95_000);
  const temporary = mkdtempSync(join(tmpdir(), "studio-local-video-"));
  let context: BrowserContext | undefined;
  try {
    // WebKit's ephemeral Playwright context cannot open an OPFS writer.
    if (browserName === "webkit") {
      context = await webkit.launchPersistentContext(
        join(temporary, "profile"),
        {
          baseURL,
          viewport: { width: 390, height: 844 },
          hasTouch: true,
        },
      );
    }
    const page = context?.pages()[0] ?? defaultPage;
    await page.addInitScript(() => {
      // WebKit's request interception omits file contents from multipart bodies.
      const append = FormData.prototype.append;
      FormData.prototype.append = function (...args) {
        const [name, item] = args;
        if (name === "file" && item instanceof File) {
          (window as Window & { studioTestUpload?: File }).studioTestUpload =
            item;
        }
        Reflect.apply(append, this, args);
      };
    });
    const webm = browserName === "webkit";
    const video = join(temporary, webm ? "large.webm" : "large.mp4");
    execFileSync("ffmpeg", [
      "-v",
      "error",
      "-f",
      "lavfi",
      "-i",
      "color=s=64x64:r=25",
      "-f",
      "lavfi",
      "-i",
      "sine=frequency=440:sample_rate=48000",
      "-t",
      "2",
      ...(webm
        ? ["-c:v", "libvpx", "-c:a", "libopus"]
        : ["-c:v", "libx264", "-c:a", "aac", "-movflags", "+faststart"]),
      video,
    ]);
    const offset = statSync(video).size;
    const bytes = 300 * 1024 * 1024;
    const atom = Buffer.alloc(webm ? 6 : 8);
    if (webm) {
      // EBML Void with a five-byte size field.
      atom[0] = 0xec;
      atom[1] = 0x08;
      atom.writeUInt32BE(bytes - offset - atom.length, 2);
    } else {
      atom.writeUInt32BE(bytes - offset);
      atom.write("free", 4);
    }
    const fd = openSync(video, "r+");
    try {
      writeSync(fd, atom, 0, atom.length, offset);
    } finally {
      closeSync(fd);
    }
    truncateSync(video, bytes);

    const { state } = await mockBackend(page, ["COMPLETED"], {
      galleryHasVideo: false,
    });
    await page.goto("/studio/p1");
    await page.getByRole("button", { name: "افزودن ویدیو از گالری" }).click();
    await expect(page.getByText(/ویدیویی نیست/)).toBeVisible();

    await page.getByTestId("gallery-upload-input").setInputFiles(video);

    await expect(page.getByText("large", { exact: true })).toBeVisible({
      timeout: 45_000,
    });
    expect(state.uploads).toBe(1);
    expect(state.order).toEqual(["upload", "save"]);
    await expect.poll(() => state.transcriptPosts).toBe(1);
    const upload = await page.evaluate(async () => {
      const file = (window as Window & { studioTestUpload?: File })
        .studioTestUpload;
      if (!file || file.type !== "audio/mpeg" || file.size >= 25_000) {
        throw new Error(
          `Expected a small MP3 upload, got ${file?.type} (${file?.size} bytes)`,
        );
      }
      return Array.from(new Uint8Array(await file.arrayBuffer()));
    });
    const probe = JSON.parse(
      execFileSync(
        "ffprobe",
        ["-v", "error", "-f", "mp3", "-show_streams", "-of", "json", "pipe:0"],
        { encoding: "utf8", input: Buffer.from(upload) },
      ),
    );
    expect(probe.streams).toMatchObject([
      {
        codec_name: "mp3",
        sample_rate: "16000",
        channels: 1,
      },
    ]);
    // ffprobe may estimate the bitrate when the MP3 has no Xing header.
    expect(
      Math.abs(Number(probe.streams[0].bit_rate) - 32_000),
    ).toBeLessThanOrEqual(1_000);
    expect(state.saves.at(-1)).toMatchObject({
      document: {
        tracks: [
          { clips: [{ file_uuid: "f1", local_source: { size: bytes } }] },
        ],
      },
    });
    await expect(page.getByText("زیرنویس آماده")).toBeVisible();
    await page.getByRole("button", { name: "ویرایش و کپشن" }).click();
    await expect(page.getByTestId("stage-video")).toHaveAttribute(
      "src",
      /^blob:/,
    );
    await page.reload();
    await expect(page.getByTestId("stage-video")).toHaveAttribute(
      "src",
      /^blob:/,
    );
    await page.evaluate(async () => {
      const root = await navigator.storage.getDirectory();
      const studio = await root.getDirectoryHandle("studio-videos");
      await studio.removeEntry("p1", { recursive: true });
    });
    await page.reload();
    const relink = page.getByRole("button", {
      name: "انتخاب دوبارهٔ ویدیوی اصلی",
    });
    await expect(relink).toBeVisible();
    const input = page.getByTestId("studio-relink-input");
    await input.setInputFiles({
      name: "wrong.mp4",
      mimeType: "video/mp4",
      buffer: Buffer.from("wrong video"),
    });
    await expect(
      page.getByText("این فایل با ویدیوی اصلی پروژه مطابقت ندارد."),
    ).toBeVisible();
    await input.setInputFiles(video);
    await expect(page.getByTestId("stage-video")).toHaveAttribute(
      "src",
      /^blob:/,
      { timeout: 20_000 },
    );
    expect(state.uploads).toBe(1);
    await page
      .getByRole("button", { name: "پخش", exact: true })
      .first()
      .click();
    await expect
      .poll(
        () =>
          page
            .getByTestId("stage-video")
            .evaluate((element) => (element as HTMLVideoElement).currentTime),
        { timeout: 15_000 },
      )
      .toBeGreaterThan(0);
    await page.getByRole("button", { name: "ویرایش زیرنویس" }).click();
    await expect(
      page.getByRole("button", { name: "سلام", exact: true }),
    ).toBeVisible();
    await page.keyboard.press("Escape");
    await page.getByRole("button", { name: "خروجی ویدیو" }).click();
    const lowest = page.getByRole("radio", { name: /۴۸۰/ });
    await expect(lowest).toBeChecked();
    await page.getByRole("button", { name: "ساخت خروجی" }).click();
    await expect(page.getByRole("link", { name: "دانلود ویدیو" })).toBeVisible({
      timeout: 25_000,
    });
    expect(state.uploads).toBe(1);
    expect(state.transcriptPosts).toBe(1);
  } finally {
    await context?.close();
    rmSync(temporary, { recursive: true, force: true });
  }
});

test("a gallery video already in the project cannot be added twice", async ({
  page,
}) => {
  const { state } = await mockBackend(page, ["COMPLETED"]);
  await page.goto("/studio/p1");
  await pickFromGallery(page);
  await expect(page.getByText("زیرنویس آماده")).toBeVisible();

  await page.getByRole("button", { name: "افزودن ویدیو از گالری" }).click();
  const card = page.getByRole("button", { name: /holiday\.webm/ });
  await expect(card).toBeDisabled();
  await expect(page.getByText("توی پروژه‌ست")).toBeVisible();
  expect(state.saves).toHaveLength(1);
});

test("a failed subtitle can be retried", async ({ page }) => {
  const { state } = await mockBackend(page, ["FAILED"]);
  await page.goto("/studio/p1");
  await pickFromGallery(page);

  await expect(page.getByText("ساخت زیرنویس نشد")).toBeVisible();
  await page.getByRole("button", { name: "دوباره" }).click();
  await expect.poll(() => state.transcriptPosts).toBe(2);
});

test("a rejected subtitle request stays retryable after reloading the project", async ({
  page,
}) => {
  const { state } = await mockBackend(page, ["COMPLETED"], {
    rejectFirstTranscript: true,
  });
  await page.goto("/studio/p1");
  const rejected = page.waitForResponse(
    (response) =>
      response.url().endsWith("/api/v1/studio/transcripts") &&
      response.status() === 426,
  );
  await pickFromGallery(page);
  await rejected;

  await page.reload();
  await expect(page.getByText("ساخت زیرنویس شروع نشده")).toBeVisible();
  await expect(page.getByText("زیرنویس در حال ساخت")).toHaveCount(0);
  await page.getByRole("button", { name: "ساخت زیرنویس" }).click();
  await expect(page.getByText("زیرنویس آماده")).toBeVisible();
  expect(state.transcriptPosts).toBe(2);
  expect(state.saves).toHaveLength(1);
});

test("removing a clip takes its file out of the project", async ({ page }) => {
  const { state } = await mockBackend(page, ["COMPLETED"]);
  await page.goto("/studio/p1");
  await pickFromGallery(page);
  await expect(page.getByText("زیرنویس آماده")).toBeVisible();

  await page.getByRole("button", { name: "حذف «holiday»" }).click();

  await expect(page.getByText("holiday", { exact: true })).toHaveCount(0);
  await expect(page.getByText(/از گالری‌ات انتخاب کن/)).toBeVisible();
  expect(state.saves.at(-1)).toMatchObject({
    files: [],
    document: { tracks: [{ kind: "video", clips: [] }] },
  });
});

test("can rebuild a completed transcript in English without uploading again", async ({
  page,
}) => {
  const { state } = await mockBackend(page, ["COMPLETED"]);
  await page.goto("/studio/p1");
  await pickFromGallery(page);
  await expect(page.getByText("زیرنویس آماده")).toBeVisible();

  await page
    .getByRole("button", { name: "زبان گفتار" })
    .click({ timeout: 5000 });
  const dialog = page.getByRole("dialog", { name: "زبان گفتار" });
  await dialog.getByRole("radio", { name: "انگلیسی" }).check();
  await dialog.getByRole("button", { name: "ساخت دوبارهٔ زیرنویس" }).click();
  await expect
    .poll(() => state.transcriptRequests)
    .toEqual([
      { file_uuid: "f1" },
      { file_uuid: "f1", language: "en", replace_transcript_uuid: "t1" },
    ]);
  expect(state.uploads).toBe(0);
});

test("can choose Persian before the first device transcription", async ({
  page: defaultPage,
  browserName,
  baseURL,
}) => {
  const temporary = mkdtempSync(join(tmpdir(), "studio-device-language-"));
  let context: BrowserContext | undefined;
  try {
    if (browserName === "webkit") {
      context = await webkit.launchPersistentContext(
        join(temporary, "profile"),
        { baseURL },
      );
    }
    const page = context?.pages()[0] ?? defaultPage;
    const video = join(temporary, "spoken.webm");
    execFileSync("ffmpeg", [
      "-v",
      "error",
      "-f",
      "lavfi",
      "-i",
      "color=s=64x64:r=25",
      "-f",
      "lavfi",
      "-i",
      "sine=frequency=440:sample_rate=48000",
      "-t",
      "2",
      "-c:v",
      "libvpx",
      "-c:a",
      "libopus",
      video,
    ]);
    const { state } = await mockBackend(page, ["COMPLETED"], {
      galleryHasVideo: false,
    });
    await page.goto("/studio/p1");
    await page.getByRole("button", { name: "افزودن ویدیو از گالری" }).click();
    await page.getByRole("combobox", { name: "زبان گفتار" }).selectOption("fa");
    await page.getByTestId("gallery-upload-input").setInputFiles(video);
    await expect
      .poll(() => state.transcriptRequests)
      .toEqual([{ file_uuid: "f1", language: "fa" }]);
    expect(state.uploads).toBe(1);
  } finally {
    await context?.close();
    rmSync(temporary, { recursive: true, force: true });
  }
});
