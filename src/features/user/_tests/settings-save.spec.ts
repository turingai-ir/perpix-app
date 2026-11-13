import { expect, test } from "@playwright/test";

import { mockAuthenticatedSession } from "../../../../__tests__/support/auth-session";

test("saving profile information keeps the saved fields during refetch", async ({
  page,
}) => {
  await page.route("**/api/v1/**", (route) =>
    route.fulfill({ json: { items: [], has_next: false } }),
  );
  // Registered after the catch-all so session bootstrap is not swallowed by it.
  await mockAuthenticatedSession(page);
  await page.route("**/api/v1/wallet", (route) =>
    route.fulfill({
      json: {
        wallet_uuid: "wallet-1",
        balance_usdmicro: 1000,
        is_active: true,
      },
    }),
  );
  await page.route("**/api/v1/user/subscription/active", (route) =>
    route.fulfill({
      json: {
        plan: { name: "starter", display_name: "Starter", is_default: false },
      },
    }),
  );
  const original = {
    name: "Original Name",
    email: "original@example.com",
    phone_number: "09123456789",
    is_verified: true,
    scopes: [],
    default_wallet_uuid: "wallet-1",
    is_active: true,
    created_at: "2026-01-01T00:00:00Z",
    updated_at: "2026-01-01T00:00:00Z",
  };
  const saved = { ...original, name: "Saved Name", email: "saved@example.com" };
  let releaseRefetch: () => void = () => {};
  const refetchReady = new Promise<void>((resolve) => {
    releaseRefetch = resolve;
  });
  let savedSuccessfully = false;
  let refetchRequested = false;
  await page.route("**/api/v1/user/me", async (route) => {
    if (savedSuccessfully) {
      refetchRequested = true;
      await refetchReady;
    }
    await route.fulfill({ json: savedSuccessfully ? saved : original });
  });
  await page.route("**/api/v1/user/me", (route) => {
    if (route.request().method() !== "PATCH") return route.fallback();
    savedSuccessfully = true;
    return route.fulfill({ json: saved });
  });

  try {
    await page.goto("/profile/settings");
    const name = page.getByRole("textbox", { name: "نام کامل", exact: true });
    const email = page.getByRole("textbox", { name: "ایمیل", exact: true });
    await expect(name).toHaveValue(original.name, { timeout: 15000 });
    await name.fill(saved.name);
    await email.fill(saved.email);
    await page
      .getByRole("button", { name: "ذخیرهٔ تغییرات", exact: true })
      .click();
    await expect.poll(() => refetchRequested).toBe(true);
    await expect(name).toHaveValue(saved.name);
    await expect(email).toHaveValue(saved.email);
    await expect(
      page.getByRole("button", { name: "ذخیرهٔ تغییرات", exact: true }),
    ).toBeDisabled();
    releaseRefetch();
    await expect(name).toHaveValue(saved.name);
  } finally {
    releaseRefetch();
  }
});
