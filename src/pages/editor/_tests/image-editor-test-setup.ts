import type { BrowserContext, Page } from "@playwright/test";

export async function openAuthenticatedEditor(
  page: Page,
  context: BrowserContext,
  baseURL: string | undefined,
): Promise<void> {
  if (!baseURL) throw new Error("Playwright baseURL is required");

  await page.route("**/user/get-info", async (route) => {
    await route.fulfill({
      contentType: "application/json",
      status: 200,
      body: JSON.stringify({
        uuid: "123",
        email: "test@example.com",
        wallet_balance: 100000,
      }),
    });
  });
  await page.route("**/ai-task/list", async (route) => {
    await route.fulfill({
      contentType: "application/json",
      status: 200,
      body: JSON.stringify({ items: [] }),
    });
  });
  await page.route("**/ai-task/events-stream", async (route) => {
    await route.fulfill({
      contentType: "text/event-stream",
      status: 200,
      body: "",
    });
  });
  await context.addCookies([
    { name: "access_token", value: "test-token", url: baseURL },
  ]);
  await page.goto("/editor");
}
