import { expect, test } from "@playwright/test";

test("saving profile information keeps the saved fields during refetch", async ({ page, context, baseURL }) => {
  if (!baseURL) throw new Error("Playwright baseURL is required");
  await context.addCookies([{ name: "access_token", value: "test-token", url: baseURL }]);
  await page.route("**/api/v1/**", (route) => route.fulfill({ json: { items: [], has_next: false } }));
  await page.route("**/api/v1/wallet/wallet", (route) => route.fulfill({
    json: { wallet_uuid: "wallet-1", balance_usdmicro: 1000, is_active: true },
  }));
  await page.route("**/api/v1/user/subscription/active", (route) => route.fulfill({
    json: { plan: { name: "starter", display_name: "Starter", is_default: false } },
  }));
  const original = {
    name: "Original Name", email: "original@example.com", phone_number: "09123456789",
    is_verified: true, scopes: [], default_wallet_uuid: "wallet-1", is_active: true,
    created_at: "2026-01-01T00:00:00Z", updated_at: "2026-01-01T00:00:00Z",
  };
  const saved = { ...original, name: "Saved Name", email: "saved@example.com" };
  let releaseRefetch: () => void = () => {};
  const refetchReady = new Promise<void>((resolve) => { releaseRefetch = resolve; });
  let savedSuccessfully = false;
  let refetchRequested = false;
  await page.route("**/api/v1/user/get-info", async (route) => {
    if (savedSuccessfully) {
      refetchRequested = true;
      await refetchReady;
    }
    await route.fulfill({ json: savedSuccessfully ? saved : original });
  });
  await page.route("**/api/v1/user/edit-info", (route) => {
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
    await page.getByRole("button", { name: "ویرایش اطلاعات", exact: true }).click();
    await expect.poll(() => refetchRequested).toBe(true);
    await expect(name).toHaveValue(saved.name);
    await expect(email).toHaveValue(saved.email);
    await expect(page.getByRole("button", { name: "ویرایش اطلاعات", exact: true })).toBeDisabled();
    releaseRefetch();
    await expect(name).toHaveValue(saved.name);
  } finally {
    releaseRefetch();
  }
});
