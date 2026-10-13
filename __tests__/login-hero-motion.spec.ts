import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.route("**/*", (route) => {
    const url = new URL(route.request().url());
    return url.origin === new URL(test.info().project.use.baseURL!).origin
      ? route.continue()
      : route.abort();
  });
  await page.goto("/auth/login");
});

test("hero settles within five seconds without a redundant pause control", async ({
  page,
}) => {
  await expect(page.getByRole("button", { name: "توقف حرکت" })).toHaveCount(0);
  const artwork = page.locator("[data-login-artwork]");
  await expect(artwork).toBeVisible();
  await expect
    .poll(
      () =>
        artwork.evaluate(
          (el) =>
            el
              .getAnimations({ subtree: true })
              .filter((animation) => animation.playState === "running").length,
        ),
      { timeout: 6500 },
    )
    .toBe(0);
});

test("hero responds to mouse movement and resets on exit", async ({ page }) => {
  const artwork = page.locator("[data-login-artwork]");
  await artwork.hover({ position: { x: 100, y: 100 } });
  await expect(artwork).toHaveAttribute("style", /--tilt-y:/);
  await page.mouse.move(0, 0);
  await expect(artwork).not.toHaveAttribute("style", /--tilt-y:/);
});

for (const viewport of [
  { width: 375, height: 812 },
  { width: 812, height: 375 },
  { width: 768, height: 1024 },
  { width: 1440, height: 900 },
]) {
  test(`login stays balanced at ${viewport.width}x${viewport.height}`, async ({
    page,
  }) => {
    await page.setViewportSize(viewport);
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.evaluate(() => document.fonts.ready);
    await expect(page.locator("[data-login-artwork]")).toBeVisible();
    await expect(
      page.getByRole("spinbutton", { name: "شماره تلفن" }),
    ).toBeVisible();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    await page.screenshot({
      path: test.info().outputPath("login-layout.png"),
      fullPage: true,
    });
  });
}

test("reduced motion disables decorative animation and mobile has no overflow", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  for (const width of [390, 320]) {
    await page.setViewportSize({ width, height: 844 });
    const logo = page.locator('img[src="/android-chrome-512x512.png"]');
    await expect(logo).toHaveCSS("animation-name", "none");
    await expect(page.getByRole("button", { name: "توقف حرکت" })).toBeHidden();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
  }
});
