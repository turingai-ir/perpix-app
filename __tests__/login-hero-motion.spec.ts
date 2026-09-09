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

test("hero keeps moving and can be paused and resumed using the keyboard", async ({
  page,
}) => {
  const logo = page.locator('img[src="/android-chrome-512x512.png"]');
  const control = page.getByRole("button", { name: "توقف حرکت" });
  await expect(control).toBeVisible();
  await page.waitForTimeout(5500);
  const transform = () => logo.evaluate((el) => getComputedStyle(el).transform);
  const moving = await transform();
  await expect.poll(transform).not.toBe(moving);
  await control.focus();
  await page.keyboard.press("Enter");
  await expect(control).toHaveAttribute("aria-pressed", "true");
  const stopped = await transform();
  await page.waitForTimeout(350);
  expect(await transform()).toBe(stopped);
  await page.keyboard.press("Enter");
  await expect.poll(transform).not.toBe(stopped);
});

test("hero responds to mouse movement and resets on exit", async ({ page }) => {
  const artwork = page.locator('[data-paused="false"]');
  await artwork.hover({ position: { x: 100, y: 100 } });
  await expect(artwork).toHaveAttribute("style", /--tilt-y:/);
  await page.mouse.move(0, 0);
  await expect(artwork).not.toHaveAttribute("style", /--tilt-y:/);
});

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
