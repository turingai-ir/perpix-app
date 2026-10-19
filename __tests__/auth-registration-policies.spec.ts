import { mockAnonymousSession } from "./support/auth-session";
import { challenge } from "../src/features/auth/_tests/support";
import { expect, type Page, test } from "@playwright/test";

test("shows the terms and privacy policy after a new user sets a password", async ({
  page,
}) => {
  await mockRegistrationApi(page);

  await page.goto("/auth/login");
  await page.getByLabel("شماره موبایل").fill("09123456789");
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
  await mockAnonymousSession(page);
  await page.route("**/api/v1/auth/start", (route) =>
    route.fulfill({
      json: { next_step: "registration", ...challenge() },
    }),
  );
}
