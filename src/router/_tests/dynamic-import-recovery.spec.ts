import { expect, test } from "@playwright/test";

test("reloads once when a route module is missing after a deployment", async ({
  page,
}) => {
  let layoutModuleRequests = 0;
  const browserErrors: string[] = [];
  page.on("console", (message) => {
    if (message.type() === "error") {
      browserErrors.push(message.text());
    }
  });
  await page.route("**/*", async (route) => {
    if (!route.request().url().includes("auth/login/page")) {
      await route.continue();
      return;
    }

    layoutModuleRequests += 1;

    if (layoutModuleRequests === 1) {
      await route.abort("failed");
      return;
    }

    await route.continue();
  });

  await page.goto("/auth/login");

  await expect.poll(() => layoutModuleRequests).toBe(2);
  expect(browserErrors).toContain("Failed to load resource: net::ERR_FAILED");
});
