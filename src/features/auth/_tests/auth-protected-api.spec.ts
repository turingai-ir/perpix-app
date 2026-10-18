import { expect, test, type Page } from "@playwright/test";

import { sessionHeaders } from "../../../../__tests__/support/auth-session";

import { errorBody, mockAppShellApis } from "./support";

interface RefreshLog {
  refreshes: number;
  profileAuthorizations: (string | undefined)[];
}

/** Refresh issues token-1, then token-2, …; profile only accepts token-2+. */
async function mockRotatingSession(
  page: Page,
  options: { profileStatus?: number } = {},
) {
  const log: RefreshLog = { refreshes: 0, profileAuthorizations: [] };
  await mockAppShellApis(page);
  await page.route("**/api/v1/auth/csrf", (route) =>
    route.fulfill({ json: { csrf_token: "csrf-1" } }),
  );
  await page.route("**/api/v1/auth/refresh", (route) => {
    log.refreshes += 1;

    return route.fulfill({
      headers: sessionHeaders,
      json: {
        access_token: `token-${log.refreshes}`,
        token_type: "bearer",
        expires_in: 900,
      },
    });
  });
  await page.route("**/api/v1/user/get-info", (route) => {
    const authorization = route.request().headers().authorization;
    log.profileAuthorizations.push(authorization);
    if (options.profileStatus) {
      return route.fulfill({
        status: options.profileStatus,
        json: errorBody(),
      });
    }

    return authorization === "Bearer token-1"
      ? route.fulfill({ status: 401, json: errorBody() })
      : route.fulfill({
          json: {
            email: null,
            phone_number: "+989123456789",
            name: null,
            is_verified: true,
            scopes: [],
            default_wallet_uuid: null,
            is_active: true,
            created_at: "2026-10-18T00:00:00Z",
            updated_at: "2026-10-18T00:00:00Z",
          },
        });
  });

  return log;
}

test("a 401 from a protected API refreshes once and retries the request once", async ({
  page,
}) => {
  const log = await mockRotatingSession(page);

  await page.goto("/");

  await expect(page.locator("aside")).toBeVisible();
  await expect
    .poll(() => log.profileAuthorizations.includes("Bearer token-2"))
    .toBe(true);
  // bootstrap + exactly one coordinated recovery, shared by concurrent 401s
  expect(log.refreshes).toBe(2);
});

test("a 403 never triggers a refresh", async ({ page }) => {
  const log = await mockRotatingSession(page, { profileStatus: 403 });

  await page.goto("/");

  await expect.poll(() => log.profileAuthorizations.length).toBeGreaterThan(0);
  expect(log.refreshes).toBe(1);
});
