import type { Page, Route } from "@playwright/test";

export const CHALLENGE_ID = "11111111-1111-4111-8111-111111111111";

export function errorBody(detail: unknown = "Unauthorized", code = 999) {
  return { detail, status_code: code, request_id: null };
}

export function challenge(
  overrides: { expiresInMs?: number; resendInMs?: number; id?: string } = {},
) {
  const now = Date.now();

  return {
    challenge_id: overrides.id ?? CHALLENGE_ID,
    expires_at: new Date(
      now + (overrides.expiresInMs ?? 120_000),
    ).toISOString(),
    resend_available_at: new Date(
      now + (overrides.resendInMs ?? 60_000),
    ).toISOString(),
  };
}

const emptyStream = (route: Route) =>
  route.fulfill({ status: 200, contentType: "text/event-stream", body: "" });

/** Minimal API surface the authenticated app shell needs to render. */
export async function mockAppShellApis(page: Page): Promise<void> {
  await page.route("**/api/v1/**", (route) => {
    if (new URL(route.request().url()).pathname.startsWith("/api/v1/auth/"))
      return route.fallback();
    return route.fulfill({ json: { items: [], has_next: false } });
  });
  await page.route("**/api/v1/user/get-info", (route) =>
    route.fulfill({
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
    }),
  );
  await page.route("**/api/v1/wallet/wallet", (route) =>
    route.fulfill({
      json: { wallet_uuid: CHALLENGE_ID, balance_usdmicro: 0, is_active: true },
    }),
  );
  await page.route("**/api/v1/user/subscription/active", (route) =>
    route.fulfill({
      json: {
        uuid: CHALLENGE_ID,
        plan: {
          uuid: CHALLENGE_ID,
          name: "free",
          display_name: "Free",
          description: null,
          scopes: [],
          allowed_models: [],
          price_usdmicro: 0,
          duration_days: 0,
          balance_gift_amount_usdmicro: null,
          is_default: true,
          meta: {},
        },
      },
    }),
  );
  await page.route("**/api/v1/ai-task/list*", (route) =>
    route.fulfill({ json: { items: [], has_next: false } }),
  );
  await page.route("**/api/v1/ai-task/events", emptyStream);
  await page.route("**/api/v1/payment-events", emptyStream);
}
