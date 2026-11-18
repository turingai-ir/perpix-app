import { expect, test } from "@playwright/test";

import { mockAuthenticatedSession } from "../../../../__tests__/support/auth-session";

import { mockAppShellApis } from "./support";

test("token_expired closes the stream, refreshes once and reconnects with the new Bearer", async ({
  page,
}) => {
  const requests: { url: string; authorization?: string }[] = [];
  await mockAppShellApis(page);
  await mockAuthenticatedSession(page);
  let refreshes = 0;
  await page.route("**/api/v1/auth/refresh", (route) => {
    refreshes += 1;

    return route.fulfill({
      headers: {
        "X-CSRF-TOKEN": "csrf",
        "Access-Control-Expose-Headers": "X-CSRF-TOKEN",
        "Cache-Control": "no-store",
      },
      json: {
        access_token: `token-${refreshes}`,
        token_type: "bearer",
        expires_in: 900,
      },
    });
  });
  await page.route("**/api/v1/payment-events", (route) => {
    const request = route.request();
    const { authorization } = request.headers();
    requests.push({ url: request.url(), authorization });

    return route.fulfill({
      status: 200,
      contentType: "text/event-stream",
      body:
        authorization === "Bearer token-1"
          ? 'event: auth_error\ndata: {"code":"token_expired"}\n\n'
          : "",
    });
  });

  await page.goto("/");

  await expect
    .poll(() => requests.some((r) => r.authorization === "Bearer token-2"))
    .toBe(true);
  expect(requests.every((r) => !new URL(r.url).search)).toBe(true);
  // bootstrap + exactly one refresh for the expired stream
  expect(refreshes).toBe(2);
});
