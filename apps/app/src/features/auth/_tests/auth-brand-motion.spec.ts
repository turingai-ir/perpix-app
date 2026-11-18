import { expect, test } from "@playwright/test";
import { mockAnonymousSession } from "../../../../__tests__/support/auth-session";

test("the PerPix mark orbits above the accessible authentication form", async ({
  page,
}) => {
  await mockAnonymousSession(page);
  await page.goto("/auth/login");

  await expect(page.locator("[data-hero-logo]")).toHaveCount(1);
  await expect(page.locator("[data-auth-step='phone']")).toBeVisible();
  await expect(page.locator("[data-login-artwork]")).toHaveAttribute(
    "aria-hidden",
    "true",
  );
});

test("the logo scene rests when reduced motion is requested", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await mockAnonymousSession(page);
  await page.goto("/auth/login");

  const animation = await page
    .locator("[data-hero-logo]")
    .first()
    .evaluate((element) => getComputedStyle(element).animationName);
  expect(animation).toBe("none");
});
