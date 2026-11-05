import { expect, test } from "@playwright/test";
import { openAuthenticatedEditor } from "../../../pages/editor/_tests/image-editor-test-setup";

test("startup removes obsolete API caches and preserves editor drafts", async ({
  page,
}) => {
  await openAuthenticatedEditor(page);
  await page.evaluate(async () => {
    const path = "/src/features/app-runtime/_tests/browser-store.ts";
    await (await import(/* @vite-ignore */ path)).seedOldCache();
  });
  await page.reload();
  await expect(page.getByRole("button", { name: "بازگشت" })).toBeVisible();
  await expect
    .poll(() =>
      page.evaluate(async () => {
        const path = "/src/features/app-runtime/_tests/browser-store.ts";
        return (await import(/* @vite-ignore */ path)).inspectStorage();
      }),
    )
    .toEqual({ keys: ["editor-snapshot:keep-draft"], draft: { layers: [1] } });
});
test("requests fail instead of waiting in a disconnected queue", async ({
  page,
}) => {
  await openAuthenticatedEditor(page);
  const result = await page.evaluate(async () => {
    const path = "/src/features/app-runtime/_tests/browser-store.ts";
    return (
      await import(/* @vite-ignore */ path)
    ).exerciseDisconnectedRequests();
  });
  expect(result).toEqual({
    results: ["error", "error"],
    queries: 1,
    mutations: 1,
  });
});
