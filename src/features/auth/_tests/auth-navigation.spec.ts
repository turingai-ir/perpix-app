import { expect, test } from "@playwright/test";

import { mockAuthenticatedSession } from "../../../../__tests__/support/auth-session";

import { mockAppShellApis } from "./support";

for (const destination of [
  "https://evil.example/",
  "//evil.example/",
  "/\\evil.example/",
  "/auth/login",
  "/api/v1/auth/logout",
  "/%2e%2e/auth/login",
]) {
  test(`login rejects unsafe continuation ${destination}`, async ({ page }) => {
    await mockAppShellApis(page);
    await mockAuthenticatedSession(page);
    await page.goto(`/auth/login?returnTo=${encodeURIComponent(destination)}`);
    await expect(page).toHaveURL("/");
    await expect(page.locator("aside")).toBeVisible();
  });
}

test("a signed-in user resumes a safe deep link including its query and anchor", async ({
  page,
}) => {
  await mockAuthenticatedSession(page);
  const destination =
    "/payment/verify/11111111-1111-4111-8111-111111111111?source=bank#receipt";
  await page.route("**/api/v1/payment-executions/*", (route) =>
    route.fulfill({ status: 404, json: { detail: "Not found" } }),
  );
  await page.route("**/api/v1/payment-events", (route) =>
    route.fulfill({ contentType: "text/event-stream", body: "" }),
  );
  await page.goto(`/auth/login?returnTo=${encodeURIComponent(destination)}`);
  await expect(page).toHaveURL(destination);
});
