import { expect, test } from "@playwright/test";
import { openAuthenticatedEditor } from "../../../pages/editor/_tests/image-editor-test-setup";

test.beforeEach(async ({ page }) => {
  await openAuthenticatedEditor(page);
  await page.route("**/file-manager/user-files*", (route) =>
    route.fulfill({
      json: {
        files: [
          {
            uuid: "file-0",
            file_name: "sound.mp3",
            file_size: 100,
            content_type: "audio/mpeg",
            is_public: false,
          },
        ],
        has_next: false,
      },
    }),
  );
  await page.route("**/file-manager/files/presigned-urls", (route) => {
    const ids: string[] = route.request().postDataJSON().file_uuids;
    return route.fulfill({
      json: {
        files: ids.map((id) => ({
          file_uuid: id,
          preview_url: `https://storage.test/${id}`,
          download_url: `https://storage.test/${id}`,
          expire_at: new Date(Date.now() + 600_000).toISOString(),
          file_size: 100,
          content_type: "audio/mpeg",
        })),
      },
    });
  });
  await page.evaluate(async () => {
    const path = "/src/features/file-manager/_tests/harness.tsx";
    const module = await import(/* @vite-ignore */ path);
    module.mount();
  });
});

test("retries only complete after 503, preserving the token and parts", async ({
  page,
}) => {
  const completeBodies: unknown[] = [];
  let parts = 0;
  await page.route("**/file-manager/multipart/initiate", (route) =>
    route.fulfill({
      json: {
        upload_id: "opaque.signed-token",
        object_name: "owner/object",
        uuid: "uploaded-file",
        chunk_size: 6 * 1024 * 1024,
        parts_count: 1,
      },
    }),
  );
  await page.route("**/file-manager/multipart/presign-part", (route) =>
    route.fulfill({
      json: {
        presigned_url: "http://127.0.0.1:5179/storage/part",
        part_number: 1,
        expire_at: new Date(Date.now() + 600_000).toISOString(),
      },
    }),
  );
  await page.route("**/storage/part", (route) => {
    parts++;
    return route.fulfill({ headers: { ETag: '"part-etag"' }, body: "" });
  });
  await page.route("**/file-manager/multipart/complete", (route) => {
    completeBodies.push(route.request().postDataJSON());
    return route.fulfill(
      completeBodies.length === 1
        ? { status: 503, json: { detail: "temporary" } }
        : {
            json: {
              uuid: "uploaded-file",
              file_name: "sound.mp3",
              file_size: 6 * 1024 * 1024,
              content_type: "audio/mpeg",
              is_public: false,
            },
          },
    );
  });
  await page.getByLabel("Upload", { exact: true }).setInputFiles({
    name: "sound.mp3",
    mimeType: "audio/mpeg",
    buffer: Buffer.alloc(6 * 1024 * 1024),
  });
  await expect(page.getByLabel("Upload result")).toHaveText("uploaded-file");
  expect(completeBodies).toHaveLength(2);
  expect(completeBodies[0]).toEqual(completeBodies[1]);
  expect(parts).toBe(1);
});

test("adding a page reuses existing preview URLs", async ({ page }) => {
  await expect(page.getByLabel("Previews")).toHaveText("20");
  const requested: string[] = [];
  page.on("request", (request) => {
    if (request.url().endsWith("/files/presigned-urls"))
      requested.push(...request.postDataJSON().file_uuids);
  });
  await page.getByRole("button", { name: "More files" }).click();
  await expect(page.getByLabel("Previews")).toHaveText("40");
  expect(requested).toHaveLength(20);
  expect(requested).not.toContain("file-0");
});

test("one expired file does not hide healthy previews", async ({ page }) => {
  await page.route("**/file-manager/files/presigned-urls", (route) => {
    const ids: string[] = route.request().postDataJSON().file_uuids;
    return route.fulfill(
      ids.includes("file-25")
        ? { status: 404, json: { detail: "missing" } }
        : {
            json: {
              files: ids.map((id) => ({
                file_uuid: id,
                preview_url: `https://storage.test/${id}`,
                download_url: `https://storage.test/${id}`,
                expire_at: new Date(Date.now() + 600_000).toISOString(),
              })),
            },
          },
    );
  });
  await expect(page.getByLabel("Previews")).toHaveText("20");
  await page.getByRole("button", { name: "More files" }).click();
  await expect(page.getByLabel("Previews")).toHaveText("39");
});

test("simple upload with an unknown outcome is never retried automatically", async ({
  page,
}) => {
  let requests = 0;
  await page.route("**/file-manager/simple-upload", (route) => {
    requests++;
    return route.fulfill({ status: 503, json: { detail: "unknown commit" } });
  });
  await page.getByLabel("Upload", { exact: true }).setInputFiles({
    name: "sound.mp3",
    mimeType: "audio/mpeg",
    buffer: Buffer.alloc(100),
  });
  await expect(page.getByLabel("Upload result")).toContainText("فهرست");
  expect(requests).toBe(1);
});

test("permanent validation failure is localized and selecting the same name can succeed", async ({
  page,
}) => {
  let requests = 0;
  await page.route("**/file-manager/simple-upload", (route) => {
    requests++;
    return route.fulfill(
      requests === 1
        ? { status: 415, json: {} }
        : { json: { uuid: "recovered-file" } },
    );
  });
  const file = {
    name: "sound.mp3",
    mimeType: "audio/mpeg",
    buffer: Buffer.alloc(100),
  };
  await page.getByLabel("Upload", { exact: true }).setInputFiles(file);
  await expect(page.getByLabel("Upload result")).toContainText("فرمت");
  expect(requests).toBe(1);
  await page.getByLabel("Upload", { exact: true }).setInputFiles([]);
  await page.getByLabel("Upload", { exact: true }).setInputFiles(file);
  await expect(page.getByLabel("Upload result")).toHaveText("recovered-file");
});

test("offline upload fails promptly without a paused mutation or request", async ({
  page,
  context,
}) => {
  let requests = 0;
  page.on("request", (request) => {
    if (request.url().endsWith("/simple-upload")) requests++;
  });
  await context.setOffline(true);
  await page.getByLabel("Upload", { exact: true }).setInputFiles({
    name: "sound.mp3",
    mimeType: "audio/mpeg",
    buffer: Buffer.alloc(100),
  });
  await expect(page.getByLabel("Upload result")).toContainText("متصل نیستید");
  expect(requests).toBe(0);
});

test("a failed optimistic delete restores the file", async ({ page }) => {
  await expect(page.getByLabel("Files", { exact: true })).toHaveText("file-0");
  let release: () => void = () => {};
  const gate = new Promise<void>((resolve) => {
    release = resolve;
  });
  await page.route("**/file-manager/files/file-0", async (route) => {
    await gate;
    await route.fulfill({ status: 503, json: {} });
  });
  await page.getByRole("button", { name: "Delete file" }).click();
  await expect(page.getByLabel("Files", { exact: true })).toHaveText("");
  release();
  await expect(page.getByLabel("Mutation error")).toContainText("موقتاً");
  await expect(page.getByLabel("Files", { exact: true })).toHaveText("file-0");
});

test("replace refreshes the existing UUID preview", async ({ page }) => {
  await expect(
    page.getByLabel("Single preview", { exact: true }),
  ).toContainText("storage.test/file-0");
  await page.route("**/file-manager/files/presigned-urls", (route) =>
    route.fulfill({
      json: {
        files: route
          .request()
          .postDataJSON()
          .file_uuids.map((id: string) => ({
            file_uuid: id,
            preview_url: `https://new.test/${id}`,
            download_url: `https://new.test/${id}`,
            expire_at: new Date(Date.now() + 600_000).toISOString(),
          })),
      },
    }),
  );
  await page.route("**/file-manager/files/file-0", (route) =>
    route.fulfill({ json: { uuid: "file-0" } }),
  );
  await page.getByRole("button", { name: "Replace file" }).click();
  await expect(page.getByLabel("Single preview", { exact: true })).toHaveText(
    "https://new.test/file-0",
  );
});

test("a thousand previews use bounded batches and concurrency", async ({
  page,
}) => {
  await expect(page.getByLabel("Previews")).toHaveText("20");
  let active = 0;
  let maximum = 0;
  const requested: string[] = [];
  await page.route("**/file-manager/files/presigned-urls", async (route) => {
    const ids: string[] = route.request().postDataJSON().file_uuids;
    expect(ids.length).toBeLessThanOrEqual(20);
    requested.push(...ids);
    active++;
    maximum = Math.max(maximum, active);
    await new Promise((resolve) => setTimeout(resolve, 15));
    await route.fulfill({
      json: {
        files: ids.map((id) => ({
          file_uuid: id,
          preview_url: `https://storage.test/${id}`,
          download_url: `https://storage.test/${id}`,
          expire_at: new Date(Date.now() + 600_000).toISOString(),
        })),
      },
    });
    active--;
  });
  await page.getByRole("button", { name: "Many files" }).click();
  await expect(page.getByLabel("Previews")).toHaveText("1000", {
    timeout: 15_000,
  });
  expect(maximum).toBeLessThanOrEqual(3);
  expect(requested).toHaveLength(980);
  expect(new Set(requested).size).toBe(980);
});

test("unfinished complete is not replayed on reconnection or reload", async ({
  page,
}) => {
  let initiated = 0;
  let parts = 0;
  let completed = 0;
  await page.route("**/file-manager/multipart/initiate", (route) => {
    initiated++;
    return route.fulfill({
      json: {
        upload_id: "opaque.recovery-token",
        object_name: "owner/object",
        uuid: "saved-file",
        chunk_size: 6 * 1024 * 1024,
        parts_count: 1,
      },
    });
  });
  await page.route("**/file-manager/multipart/presign-part", (route) =>
    route.fulfill({
      json: {
        presigned_url: "http://127.0.0.1:5179/storage/recovery",
        part_number: 1,
      },
    }),
  );
  await page.route("**/storage/recovery", (route) => {
    parts++;
    return route.fulfill({ headers: { ETag: "saved-etag" }, body: "" });
  });
  await page.route("**/file-manager/multipart/complete", (route) => {
    completed++;
    return route.fulfill({ status: 503, json: {} });
  });
  await page.getByLabel("Upload", { exact: true }).setInputFiles({
    name: "sound.mp3",
    mimeType: "audio/mpeg",
    buffer: Buffer.alloc(6 * 1024 * 1024),
  });
  await expect(page.getByLabel("Upload result")).toContainText("موقتاً");
  expect(completed).toBe(3);
  await page.route("**/file-manager/multipart/complete", (route) => {
    completed++;
    return route.fulfill({ json: { uuid: "saved-file" } });
  });
  await page.clock.install();
  await page.evaluate(() => window.dispatchEvent(new Event("online")));
  await page.clock.fastForward(3_000);
  expect(completed).toBe(3);
  await page.reload();
  await expect(page.getByRole("button", { name: "بازگشت" })).toBeVisible();
  await page.evaluate(async () => {
    const path = "/src/features/file-manager/_tests/harness.tsx";
    (await import(/* @vite-ignore */ path)).mount();
  });
  await expect(page.getByLabel("Previews")).toHaveText("20");
  await page.evaluate(() => window.dispatchEvent(new Event("online")));
  await page.clock.fastForward(3_000);
  expect(completed).toBe(3);
  expect(initiated).toBe(1);
  expect(parts).toBe(1);
});

test("short-lived URLs refresh before expiry without writing persistent cache", async ({
  page,
}) => {
  await expect(page.getByLabel("Previews")).toHaveText("20");
  await page.clock.install();
  let calls = 0;
  await page.route("**/file-manager/files/presigned-urls", (route) => {
    calls++;
    return route.fulfill({
      json: {
        files: route
          .request()
          .postDataJSON()
          .file_uuids.map((id: string) => ({
            file_uuid: id,
            preview_url: `https://renewed.test/${id}/${calls}`,
            download_url: `https://renewed.test/${id}/${calls}`,
            expire_at: new Date(Date.now() + 60_000).toISOString(),
          })),
      },
    });
  });
  await page.route("**/file-manager/files/file-0", (route) =>
    route.fulfill({ json: { uuid: "file-0" } }),
  );
  await page.getByRole("button", { name: "Replace file" }).click();
  await expect(
    page.getByLabel("Single preview", { exact: true }),
  ).toContainText("renewed.test/file-0/1");
  await page.clock.fastForward(35_000);
  await expect(
    page.getByLabel("Single preview", { exact: true }),
  ).toContainText("renewed.test/file-0/2");
  const storedKeys = await page.evaluate(async () => {
    const path = "/src/features/runtime/_tests/storage.ts";
    return (await import(/* @vite-ignore */ path)).storedData();
  });
  expect(storedKeys.keys).not.toContain("REACT_QUERY_OFFLINE_CACHE");
});

test("permission failure clears stale preview without retrying", async ({
  page,
}) => {
  await expect(
    page.getByLabel("Single preview", { exact: true }),
  ).toContainText("storage.test");
  let calls = 0;
  await page.route("**/file-manager/files/presigned-urls", (route) => {
    calls++;
    return route.fulfill({ status: 403, json: {} });
  });
  await page.route("**/file-manager/files/file-0", (route) =>
    route.fulfill({ status: 409, json: {} }),
  );
  await page.getByRole("button", { name: "Replace file" }).click();
  await expect(page.getByLabel("Mutation error")).toContainText("تغییر کرده");
  await expect(page.getByLabel("Single preview error")).toHaveText("true");
  await expect(page.getByLabel("Single preview", { exact: true })).toHaveText(
    "",
  );
  expect(calls).toBe(1);
});

test("picker disables files that cannot outlive generation admission", async ({
  page,
}) => {
  await page.route("**/file-manager/user-files*", (route) =>
    route.fulfill({
      json: {
        files: [30, 120].map((minutes) => ({
          uuid: `expires-${minutes}`,
          file_name: `sound-${minutes}.m4a`,
          file_size: 100,
          content_type: "audio/mp4",
          is_public: false,
          expire_at: new Date(Date.now() + minutes * 60_000).toISOString(),
          media_metadata: null,
        })),
        has_next: false,
      },
    }),
  );
  await page.evaluate(async () => {
    const path = "/src/features/file-manager/_tests/harness.tsx";
    (await import(/* @vite-ignore */ path)).mountPicker();
  });
  await page.getByRole("button", { name: "Choose file" }).click();
  await expect(
    page.getByRole("button", { name: /sound-30.m4a/ }),
  ).toBeDisabled();
  await expect(
    page.getByRole("button", { name: /sound-120.m4a/ }),
  ).toBeEnabled();
  await expect(
    page.getByText("برای تولید محتوا کمتر از یک ساعت اعتبار دارد"),
  ).toBeVisible();
});

test("malformed success of simple upload is treated as an unknown outcome", async ({
  page,
}) => {
  let calls = 0;
  await page.route("**/file-manager/simple-upload", (route) => {
    calls++;
    return route.fulfill({ json: {} });
  });
  await page.getByLabel("Upload", { exact: true }).setInputFiles({
    name: "sound.mp3",
    mimeType: "audio/mpeg",
    buffer: Buffer.alloc(100),
  });
  await expect(page.getByLabel("Upload result")).toContainText("فهرست");
  expect(calls).toBe(1);
});

test("an uncertain replace refreshes state and asks for inspection without retrying", async ({
  page,
}) => {
  await expect(
    page.getByLabel("Single preview", { exact: true }),
  ).toContainText("storage.test");
  let calls = 0;
  await page.route("**/file-manager/files/file-0", (route) => {
    calls++;
    return route.fulfill({ status: 503, json: {} });
  });
  await page.getByRole("button", { name: "Replace file" }).click();
  await expect(page.getByLabel("Mutation error")).toContainText(
    "فایل را بررسی کنید",
  );
  expect(calls).toBe(1);
});
