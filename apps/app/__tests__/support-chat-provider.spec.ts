import { expect, test } from "@playwright/test";

test("does not load the support chat widget in dev mode", async ({ page }) => {
  const supportChatWidgetRequests: string[] = [];

  await page.route("https://widget.ila.chat/**", async (route) => {
    supportChatWidgetRequests.push(route.request().url());

    await route.fulfill({
      contentType: "application/javascript",
      body: "",
    });
  });

  await page.goto("/");

  await expect(page.locator("#ILACHATWIDGETSCRIPT")).toHaveCount(0);
  expect(supportChatWidgetRequests).toHaveLength(0);
});
