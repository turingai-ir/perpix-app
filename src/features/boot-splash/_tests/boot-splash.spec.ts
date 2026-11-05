import { expect, test } from "@playwright/test";
import { mockAnonymousSession } from "../../../../__tests__/support/auth-session";

const splash = "[data-boot-splash]";

test.describe("with the splash opted in", () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() =>
      window.localStorage.setItem("perpix:boot-splash", "on"),
    );
  });

  test("the versus splash covers the first load and leaves once the app is ready", async ({
    page,
  }) => {
    await mockAnonymousSession(page);
    await page.goto("/auth/login");

    await expect(page.locator(splash)).toBeVisible();
    await expect(page.getByRole("status")).toHaveAccessibleName(
      "در حال ورود به پرپیکس…",
    );
    await expect(page.locator(splash)).toHaveCount(0, { timeout: 15_000 });
    await expect(page.locator("[data-auth-step='phone']")).toBeVisible();
  });

  test("reduced motion skips the 3D fight and fades straight into the app", async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await mockAnonymousSession(page);
    await page.goto("/auth/login");

    await expect(page.locator(splash)).toBeVisible();
    await expect(page.locator(`${splash} canvas`)).toHaveCount(0);
    await expect(page.locator(splash)).toHaveCount(0, { timeout: 10_000 });
  });
});

test("automated browsers skip the splash unless a test opts in", async ({
  page,
}) => {
  await mockAnonymousSession(page);
  await page.goto("/auth/login");

  await expect(page.locator("[data-auth-step='phone']")).toBeVisible();
  await expect(page.locator(splash)).toHaveCount(0);
});

test("the page background is dark before any script runs", async ({ page }) => {
  await page.route("**/src/main.tsx*", (route) => route.abort());
  await page.goto("/auth/login");

  const background = await page.evaluate(
    () => getComputedStyle(document.documentElement).backgroundColor,
  );
  expect(background).toBe("rgb(8, 9, 13)");
});
