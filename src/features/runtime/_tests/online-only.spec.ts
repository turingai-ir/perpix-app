import { expect, test } from "@playwright/test";
import { openAuthenticatedEditor } from "../../../pages/editor/_tests/image-editor-test-setup";

test("boot discards legacy offline data without restoring it or deleting editor drafts", async ({
  page,
}) => {
  await openAuthenticatedEditor(page);
  await page.evaluate(async () => {
    const path = "/src/features/runtime/_tests/storage.ts";
    await (await import(/* @vite-ignore */ path)).seedLegacyOfflineData();
  });
  await page.reload();
  await expect(page.getByRole("button", { name: "بازگشت" })).toBeVisible();
  const restored = await page.evaluate(async () => {
    const path = "/src/lib/react-query.ts";
    return (await import(/* @vite-ignore */ path)).queryClient.getQueryData([
      "offline-sentinel",
    ]);
  });
  expect(restored).toBeUndefined();
  await expect
    .poll(() =>
      page.evaluate(async () => {
        const path = "/src/features/runtime/_tests/storage.ts";
        return (await import(/* @vite-ignore */ path)).storedData();
      }),
    )
    .toEqual({
      keys: ["editor-snapshot:offline-removal-test"],
      draft: { layers: ["draft"] },
    });
});

test("queries and mutations fail instead of entering an offline queue", async ({
  page,
}) => {
  await openAuthenticatedEditor(page);
  const result = await page.evaluate(async () => {
    const path = "/src/features/runtime/_tests/storage.ts";
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
