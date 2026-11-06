import { expect, test } from "@playwright/test";
import { mockAnonymousSession } from "../../../../__tests__/support/auth-session";

const splash = "[data-boot-splash]";

test.describe("with the splash opted in", () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() =>
      window.localStorage.setItem("perpix:boot-splash", "on"),
    );
  });

  test("the office splash covers the first load and leaves once the app is ready", async ({
    page,
  }) => {
    await mockAnonymousSession(page);
    await page.goto("/auth/login");

    await expect(page.locator(splash)).toBeVisible();
    await expect(page.locator("[data-office-screen]")).toBeVisible();
    await expect(page.locator("[data-office-sign]")).toHaveText(
      "پرپیکس می‌تونه!",
    );
    await expect(page.getByRole("status")).toHaveAccessibleName(
      "در حال ورود به پرپیکس…",
    );
    await expect(page.locator(splash)).toHaveCount(0, { timeout: 15_000 });
    await expect(page.locator("[data-auth-step='phone']")).toBeVisible();
  });

  test("reduced motion skips the camera movement and opens the app", async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await mockAnonymousSession(page);
    await page.goto("/auth/login");

    await expect(page.locator(`${splash} canvas`)).toHaveCount(0);
    await expect(page.locator(splash)).toHaveCount(0, { timeout: 10_000 });
  });

  for (const [sceneIndex, scene] of ["office", "turing", "tesla"].entries()) {
    for (const viewport of [
      { width: 375, height: 812 },
      { width: 360, height: 640 },
      { width: 768, height: 1024 },
      { width: 1440, height: 900 },
      { width: 812, height: 375 },
    ]) {
      test(`the ${scene} composition fits ${viewport.width}x${viewport.height}`, async ({
        page,
      }) => {
        await page.setViewportSize(viewport);
        await page.addInitScript((index) => {
          Math.random = () => (index + 0.5) / 3;
        }, sceneIndex);
        const requestedScenes: string[] = [];
        page.on("request", (request) => {
          const name = new URL(request.url()).pathname.match(
            /\/images\/boot\/(office|turing|tesla)\.webp$/,
          )?.[1];
          if (name) requestedScenes.push(name);
        });
        await page.clock.install();
        await page.clock.pauseAt(new Date(Date.now() + 1000));
        await mockAnonymousSession(page);
        await page.goto("/auth/login");
        await page.addStyleTag({
          content:
            "[data-boot-splash] * { transition: none !important; animation: none !important; }",
        });
        await expect(page.locator("[data-loaded='true']")).toBeVisible();
        await expect(page.locator("[data-scene]")).toHaveAttribute(
          "data-scene",
          scene,
        );
        expect(requestedScenes).toEqual([scene]);
        await page.evaluate(() => document.fonts.ready);
        for (const selector of [
          "[data-office-screen]",
          "[data-office-sign]",
          `${splash} button`,
        ]) {
          const box = await page.locator(selector).boundingBox();
          expect(box).not.toBeNull();
          expect(box!.x).toBeGreaterThanOrEqual(0);
          expect(box!.y).toBeGreaterThanOrEqual(0);
          expect(box!.x + box!.width).toBeLessThanOrEqual(viewport.width);
          expect(box!.y + box!.height).toBeLessThanOrEqual(viewport.height);
        }
        expect(
          await page.evaluate(() => document.documentElement.scrollWidth),
        ).toBeLessThanOrEqual(viewport.width);
        if (scene === "tesla") {
          const photograph = await page
            .locator('[data-scene="tesla"] > div > img')
            .boundingBox();
          const sign = await page.locator("[data-office-sign]").boundingBox();
          // The photographed character's hair starts at 34% of the image.
          // Reserve wall space above it, independent of viewport/font sizing.
          expect(sign!.y + sign!.height).toBeLessThanOrEqual(
            photograph!.y + photograph!.height * 0.32,
          );
        }
        await page.screenshot({
          path: `.artifacts/office/splash-${scene}-${viewport.width}.png`,
        });
        await expect(page.locator(`${splash} button`)).toBeFocused();
        await page.keyboard.press("Escape");
        await page.clock.runFor(250);
        await expect(page.locator(splash)).toHaveCount(0);
        await expect(page.locator("[data-auth-step='phone']")).toBeVisible();
      });
    }
  }

  test("missing artwork does not prevent entry", async ({ page }) => {
    await mockAnonymousSession(page);
    await page.route("**/images/boot/*.webp", (route) => route.abort());
    await page.goto("/auth/login");
    await page.locator(`${splash} button`).click();
    await expect(page.locator(splash)).toHaveCount(0);
    await expect(page.locator("[data-auth-step='phone']")).toBeVisible();
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
