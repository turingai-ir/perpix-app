import { expect, test } from "@playwright/test";
import { mockAuthenticatedSession } from "../../../../__tests__/support/auth-session";
import { mockAppShellApis } from "./support";

test("a protected response from an ended auth cycle cannot reach the caller", async ({
  page,
}) => {
  await mockAppShellApis(page);
  await mockAuthenticatedSession(page);
  await page.goto("/profile/settings");
  await expect(
    page.getByRole("textbox", { name: "نام کامل", exact: true }),
  ).toBeVisible();
  let requested = false;
  let release = () => {};
  const gate = new Promise<void>((resolve) => {
    release = resolve;
  });
  await page.route("**/api/v1/wallet/wallet", async (route) => {
    requested = true;
    await gate;
    await route.fulfill({
      json: {
        wallet_uuid: "old-account",
        balance_usdmicro: 5,
        is_active: true,
      },
    });
  });
  const result = page.evaluate(async () => {
    const clientPath = "/src/services/api/client.ts";
    const { apiClient } = await import(clientPath);
    try {
      await apiClient.GET("/api/v1/wallet/wallet");
      return "delivered";
    } catch (error) {
      return error instanceof DOMException ? error.name : "other-error";
    }
  });
  try {
    await expect.poll(() => requested).toBe(true);
    await page.evaluate(async () => {
      const managerPath = "/src/features/auth/services/session-manager.ts";
      const { startSession } = await import(managerPath);
      startSession({
        accessToken: "new-account",
        csrfToken: "csrf-new",
        expiresInSeconds: 900,
      });
    });
  } finally {
    release();
  }
  expect(await result).toBe("AbortError");
});
