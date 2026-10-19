import { expect, type Page } from "@playwright/test";

import { mockAuthenticatedSession } from "../../../../__tests__/support/auth-session";

export async function openAuthenticatedEditor(page: Page): Promise<void> {
  await mockAuthenticatedSession(page);
  await page.route("**/api/v1/user/get-info", (route) =>
    route.fulfill({
      json: {
        email: "test@example.com",
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
  await page.route("**/api/v1/ai-task/list*", (route) =>
    route.fulfill({ json: { items: [], has_next: false } }),
  );
  for (const path of ["/api/v1/ai-task/events", "/api/v1/payment-events"]) {
    await page.route(`**${path}`, (route) =>
      route.fulfill({ contentType: "text/event-stream", body: "" }),
    );
  }
  await page.goto("/editor");
  await expect(page.getByRole("button", { name: "بازگشت" })).toBeVisible();
}
