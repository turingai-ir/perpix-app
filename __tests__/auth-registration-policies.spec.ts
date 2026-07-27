import { expect, type Page, test } from "@playwright/test";

test("shows the terms and privacy policy after a new user sets a password", async ({
  page,
}) => {
  await mockRegistrationApi(page);

  await page.goto("/auth/login");
  await page.getByLabel("شماره تلفن").fill("09123456789");
  await page.getByRole("button", { name: "ادامه دادن" }).click();

  const termsLink = page.getByRole("link", { name: "شرایط استفاده" });
  const privacyLink = page.getByRole("link", { name: "سیاست حریم خصوصی" });

  await expect(termsLink).toHaveAttribute("href", "https://perpixai.ir/terms/");
  await expect(privacyLink).toHaveAttribute(
    "href",
    "https://perpixai.ir/privacy/",
  );
});

async function mockRegistrationApi(page: Page): Promise<void> {
  await page.route("**/user/start", async (route) => {
    await route.fulfill({
      contentType: "application/json",
      body: JSON.stringify({
        token: "temporary-token",
        is_verified: false,
        is_registering: true,
        next_otp_at: null,
      }),
    });
  });

  await page.route("**/user/set-password", async (route) => {
    await route.fulfill({
      contentType: "application/json",
      body: JSON.stringify({
        token: "access-token",
        phone_number: "09123456789",
        email: null,
        name: null,
        user_uuid: "user-1",
        is_registering: true,
      }),
    });
  });
}
