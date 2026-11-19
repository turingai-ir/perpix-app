import { expect, test, type Page } from "@playwright/test";

import { mockAuthenticatedSession } from "../../../../__tests__/support/auth-session";

test.use({ viewport: { width: 390, height: 844 }, hasTouch: true });

const FUTURE = () =>
  new Date(Date.now() + 5 * 86_400_000 - 3_600_000).toISOString();
const NOW = () => new Date().toISOString();

type Status = "PROCESSING" | "COMPLETED" | "FAILED";

/** An in-memory backend for one project, a file upload and its transcript. */
async function mockBackend(page: Page, transcriptStatuses: Status[]) {
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
  const state = { saves: [] as unknown[], transcriptPosts: 0, reads: 0 };
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

  await page.route("**/api/v1/file-manager/simple-upload", (route) =>
    route.fulfill({ json: { uuid: "f1" } }),
  );
  await page.route("**/api/v1/studio/projects/p1", async (route) => {
    const request = route.request();
    if (request.method() === "PUT") {
      const body = request.postDataJSON() as {
        document: Record<string, unknown>;
        files: Array<{ file_uuid: string; role: string }>;
      };
      state.saves.push(body);
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

const addVideo = (page: Page) =>
  page
    .getByTestId("clip-input")
    .setInputFiles("src/features/studio/_tests/clip.webm");

test("an empty project explains what to add and its limits", async ({
  page,
}) => {
  await mockBackend(page, ["PROCESSING"]);
  await page.goto("/studio/p1");

  await expect(page.getByText("ویدیو اضافه کن")).toBeVisible();
  await expect(page.getByText(/تا ۱۰۰ مگابایت/)).toBeVisible();
});

test("a video is uploaded, saved as a clip, and its subtitles are polled until ready", async ({
  page,
}) => {
  const { state } = await mockBackend(page, [
    "PROCESSING",
    "PROCESSING",
    "COMPLETED",
  ]);
  await page.goto("/studio/p1");
  await addVideo(page);

  await expect(page.getByText("clip", { exact: true })).toBeVisible();
  await expect(page.getByText("۰:۰۲")).toBeVisible();
  await expect(page.getByText("زیرنویس در حال ساخت")).toBeVisible();
  await expect(page.getByText("زیرنویس آماده")).toBeVisible({
    timeout: 15_000,
  });

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
              name: "clip",
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

test("a failed subtitle can be retried", async ({ page }) => {
  const { state } = await mockBackend(page, ["FAILED"]);
  await page.goto("/studio/p1");
  await addVideo(page);

  await expect(page.getByText("ساخت زیرنویس نشد")).toBeVisible();
  await page.getByRole("button", { name: "دوباره" }).click();
  await expect.poll(() => state.transcriptPosts).toBe(2);
});

test("removing a clip takes its file out of the project", async ({ page }) => {
  const { state } = await mockBackend(page, ["COMPLETED"]);
  await page.goto("/studio/p1");
  await addVideo(page);
  await expect(page.getByText("زیرنویس آماده")).toBeVisible();

  await page.getByRole("button", { name: "حذف «clip»" }).click();

  await expect(page.getByText("clip", { exact: true })).toHaveCount(0);
  await expect(page.getByText("ویدیو اضافه کن")).toBeVisible();
  expect(state.saves.at(-1)).toMatchObject({
    files: [],
    document: { tracks: [{ kind: "video", clips: [] }] },
  });
});
