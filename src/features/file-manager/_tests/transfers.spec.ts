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
        })),
      },
    });
  });
  await page.evaluate(async () => {
    const path = "/src/features/file-manager/_tests/harness.tsx";
    (await import(/* @vite-ignore */ path)).mount();
  });
});
test("completion retries reuse the signed operation without resending bytes", async ({
  page,
  baseURL,
}) => {
  const bodies: unknown[] = [];
  let puts = 0;
  await page.route("**/multipart/initiate", (route) =>
    route.fulfill({
      json: {
        upload_id: "signed.opaque",
        object_name: "owner/object",
        uuid: "saved-file",
        chunk_size: 6 * 1024 * 1024,
        parts_count: 1,
      },
    }),
  );
  await page.route("**/multipart/presign-part", (route) =>
    route.fulfill({ json: { presigned_url: `${baseURL}/storage/part` } }),
  );
  await page.route("**/storage/part", (route) => {
    puts++;
    return route.fulfill({ headers: { ETag: '"part"' }, body: "" });
  });
  await page.route("**/multipart/complete", (route) => {
    bodies.push(route.request().postDataJSON());
    return route.fulfill(
      bodies.length === 1
        ? { status: 503, json: {} }
        : { json: { uuid: "saved-file" } },
    );
  });
  await page.getByLabel("Upload", { exact: true }).setInputFiles({
    name: "sound.mp3",
    mimeType: "audio/mpeg",
    buffer: Buffer.alloc(6 * 1024 * 1024),
  });
  await expect(page.getByLabel("Result")).toHaveText("saved-file");
  expect(bodies).toHaveLength(2);
  expect(bodies[0]).toEqual(bodies[1]);
  expect(puts).toBe(1);
});
test("pagination retains earlier preview URLs", async ({ page }) => {
  await expect(page.getByLabel("Previews")).toHaveText("20");
  const ids: string[] = [];
  page.on("request", (request) => {
    if (request.url().endsWith("/presigned-urls"))
      ids.push(...request.postDataJSON().file_uuids);
  });
  await page.getByRole("button", { name: "More", exact: true }).click();
  await expect(page.getByLabel("Previews")).toHaveText("40");
  expect(ids).toHaveLength(20);
  expect(ids).not.toContain("file-0");
});
test("missing files are isolated from healthy previews", async ({ page }) => {
  await expect(page.getByLabel("Previews")).toHaveText("20");
  await page.route("**/file-manager/files/presigned-urls", (route) => {
    const ids: string[] = route.request().postDataJSON().file_uuids;
    return route.fulfill(
      ids.includes("file-25")
        ? { status: 404, json: {} }
        : {
            json: {
              files: ids.map((id) => ({
                file_uuid: id,
                preview_url: `https://storage.test/${id}`,
                download_url: `https://storage.test/${id}`,
              })),
            },
          },
    );
  });
  await page.getByRole("button", { name: "More", exact: true }).click();
  await expect(page.getByLabel("Previews")).toHaveText("39");
});
test("unknown simple upload outcomes do not cause automatic duplicate writes", async ({
  page,
}) => {
  let requests = 0;
  await page.route("**/simple-upload", (route) => {
    requests++;
    return route.fulfill({ status: 503, json: {} });
  });
  await page.getByLabel("Upload", { exact: true }).setInputFiles({
    name: "sound.mp3",
    mimeType: "audio/mpeg",
    buffer: Buffer.alloc(100),
  });
  await expect(page.getByLabel("Result")).toContainText("فهرست");
  expect(requests).toBe(1);
});

test("a thousand files use bounded batches and reuse cached previews", async ({
  page,
}) => {
  await expect(page.getByLabel("Previews")).toHaveText("20");
  let active = 0,
    maximum = 0;
  const requested: string[] = [];
  await page.route("**/files/presigned-urls", async (route) => {
    const ids: string[] = route.request().postDataJSON().file_uuids;
    expect(ids.length).toBeLessThanOrEqual(20);
    requested.push(...ids);
    active++;
    maximum = Math.max(maximum, active);
    await new Promise((resolve) => setTimeout(resolve, 10));
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
  await page.getByRole("button", { name: "Many", exact: true }).click();
  await expect(page.getByLabel("Previews")).toHaveText("1000", {
    timeout: 15_000,
  });
  expect(maximum).toBeLessThanOrEqual(3);
  expect(requested).toHaveLength(980);
});
test("a failed optimistic delete restores the file", async ({ page }) => {
  await expect(page.getByLabel("Files", { exact: true })).toHaveText("file-0");
  let release: () => void = () => {};
  const gate = new Promise<void>((resolve) => {
    release = resolve;
  });
  await page.route("**/files/file-0", async (route) => {
    await gate;
    await route.fulfill({ status: 503, json: {} });
  });
  await page.getByRole("button", { name: "Delete", exact: true }).click();
  await expect(page.getByLabel("Files", { exact: true })).toHaveText("");
  release();
  await expect(page.getByLabel("Action error")).toContainText("موقتاً");
  await expect(page.getByLabel("Files", { exact: true })).toHaveText("file-0");
});
test("replacement invalidates the preview for the stable UUID", async ({
  page,
}) => {
  await expect(page.getByLabel("Single URL")).toContainText("storage.test");
  await page.route("**/files/presigned-urls", (route) =>
    route.fulfill({
      json: {
        files: route
          .request()
          .postDataJSON()
          .file_uuids.map((id: string) => ({
            file_uuid: id,
            preview_url: `https://changed.test/${id}`,
            download_url: `https://changed.test/${id}`,
          })),
      },
    }),
  );
  await page.route("**/files/file-0", (route) =>
    route.fulfill({ json: { uuid: "file-0" } }),
  );
  await page.getByRole("button", { name: "Replace", exact: true }).click();
  await expect(page.getByLabel("Single URL")).toBeVisible();
  await expect(page.getByLabel("Single URL")).toContainText("changed.test");
});
test("staged picker selection preserves toggling and excludes near-expiry files", async ({
  page,
}) => {
  await page.route("**/file-manager/user-files*", (route) =>
    route.fulfill({
      json: {
        files: [30, 120, 180].map((minutes) => ({
          uuid: `expires-${minutes}`,
          file_name: `photo-${minutes}.webp`,
          file_size: 100,
          content_type: "image/webp",
          is_public: false,
          expire_at: new Date(Date.now() + minutes * 60_000).toISOString(),
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
    page.getByRole("button", { name: /photo-30.webp/ }),
  ).toBeDisabled();
  const photo = page.getByRole("button", { name: /photo-120.webp/ });
  await photo.click();
  await expect(photo).toHaveAttribute("aria-pressed", "true");
  await photo.click();
  await expect(photo).toHaveAttribute("aria-pressed", "false");
  await photo.click();
  await page.getByRole("button", { name: /افزودن.*عکس/ }).click();
  await expect(page.getByLabel("Selection")).toHaveText("expires-120");
});

test("unfinished uploads are not replayed on reconnection or reload", async ({
  page,
  baseURL,
}) => {
  let completed = 0;
  await page.route("**/multipart/initiate", (route) =>
    route.fulfill({
      json: {
        upload_id: "signed.unfinished",
        object_name: "owner/object",
        uuid: "saved-file",
        chunk_size: 6 * 1024 * 1024,
        parts_count: 1,
      },
    }),
  );
  await page.route("**/multipart/presign-part", (route) =>
    route.fulfill({ json: { presigned_url: `${baseURL}/storage/part` } }),
  );
  await page.route("**/storage/part", (route) =>
    route.fulfill({ headers: { ETag: '"part"' }, body: "" }),
  );
  await page.route("**/multipart/complete", (route) => {
    completed++;
    return route.fulfill({ status: 503, json: {} });
  });
  await page
    .getByLabel("Upload", { exact: true })
    .setInputFiles({
      name: "sound.mp3",
      mimeType: "audio/mpeg",
      buffer: Buffer.alloc(6 * 1024 * 1024),
    });
  await expect(page.getByLabel("Result")).toContainText("موقتاً");
  expect(completed).toBe(3);
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
  await page.clock.fastForward(3_000);
  expect(completed).toBe(3);
});

test("a disconnected upload reports its error without queueing a write", async ({
  page,
  context,
}) => {
  let requests = 0;
  page.on("request", (request) => {
    if (request.url().endsWith("/simple-upload")) requests++;
  });
  await context.setOffline(true);
  await page
    .getByLabel("Upload", { exact: true })
    .setInputFiles({
      name: "sound.mp3",
      mimeType: "audio/mpeg",
      buffer: Buffer.alloc(100),
    });
  await expect(page.getByLabel("Result")).toContainText("متصل نیستید");
  expect(requests).toBe(0);
});
