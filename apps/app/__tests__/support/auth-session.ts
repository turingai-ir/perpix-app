import type { BrowserContext, Page } from "@playwright/test";

type Routable = Page | BrowserContext;

export const TEST_ACCESS_TOKEN = "test-access-token";

export const accessResponse = {
  access_token: TEST_ACCESS_TOKEN,
  token_type: "bearer",
  expires_in: 900,
};

export const sessionHeaders = {
  "Access-Control-Expose-Headers": "X-CSRF-TOKEN",
  "X-CSRF-TOKEN": "test-csrf-token",
  "Cache-Control": "no-store",
};

/**
 * Makes the app bootstrap as signed in: GET /auth/csrf then POST /auth/refresh
 * succeed, exactly like a reload with a valid refresh cookie.
 */
export async function mockAuthenticatedSession(page: Routable): Promise<void> {
  await page.route("**/api/v1/auth/csrf", (route) =>
    route.fulfill({ json: { csrf_token: "test-csrf-token" } }),
  );
  await page.route("**/api/v1/auth/refresh", (route) =>
    route.fulfill({ headers: sessionHeaders, json: accessResponse }),
  );
}

/** Makes the app bootstrap as anonymous (no usable refresh cookie). */
export async function mockAnonymousSession(page: Routable): Promise<void> {
  await page.route("**/api/v1/auth/csrf", (route) =>
    route.fulfill({
      status: 401,
      json: { detail: "Unauthorized", status_code: 999, request_id: null },
    }),
  );
}
