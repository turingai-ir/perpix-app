import { readFileSync } from "node:fs";
import { expect, test, type Page } from "@playwright/test";

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
  { galleryHasVideo = true }: { galleryHasVideo?: boolean } = {},
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
    reads: 0,
    uploads: 0,
    order: [] as string[],
  };
  let inGallery = galleryHasVideo;
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
      content_type: "video/webm",
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
    inGallery = true;
    return route.fulfill({ json: { uuid: "f1" } });
  });
  await page.route("**/api/v1/file-manager/user-files**", (route) =>
    route.fulfill({
      json: {
        files: inGallery
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
  await page.route("**/api/v1/studio/transcripts**", (route) => {
    const request = route.request();
    if (request.method() === "POST") {
      state.transcriptPosts += 1;
      transcript = { status: "PROCESSING" };
      return route.fulfill({ json: { ...summary(), words: [], text: "" } });
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
  await expect(page.getByText(/تا ۱۰۰ مگابایت/).first()).toBeVisible();
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

test("a video from the device goes to the gallery first and is then added to the project", async ({
  page,
}) => {
  const { state } = await mockBackend(page, ["PROCESSING"], {
    galleryHasVideo: false,
  });
  await page.goto("/studio/p1");
  await page.getByRole("button", { name: "افزودن ویدیو از گالری" }).click();
  await expect(page.getByText(/ویدیویی نیست/)).toBeVisible();

  await page
    .getByTestId("gallery-upload-input")
    .setInputFiles("src/features/studio/_tests/clip.webm");

  await expect(page.getByText("clip", { exact: true })).toBeVisible();
  expect(state.uploads).toBe(1);
  expect(state.order).toEqual(["upload", "save"]);
  expect(state.transcriptPosts).toBe(1);
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
