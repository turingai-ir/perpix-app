import {
  conversationMessages,
  expect,
  taskUuid,
  test,
} from "./fixtures/image-conversation";

test.beforeEach(async ({ page, imageConversationApi }, testInfo) => {
  await page.emulateMedia({
    reducedMotion: testInfo.title.includes("appearance")
      ? "reduce"
      : "no-preference",
  });
  imageConversationApi.setTaskMessages(
    conversationMessages({
      prompt: "A cinematic lighthouse",
      status: "IN_PROGRESS",
    }),
  );
  await page.goto(`/generation/image/${taskUuid}`);
  await expect(page.locator("[data-unborn-museum]")).toBeVisible({
    timeout: 15_000,
  });
});

test("pending image animations pause offscreen and resume at the same phase", async ({
  page,
}) => {
  const placeholder = page.locator("[data-unborn-museum]");
  await expect(placeholder).toBeVisible();
  await placeholder.scrollIntoViewIfNeeded();
  await expect(placeholder).toHaveAttribute("data-paused", "false");
  expect(
    await placeholder.evaluate(
      (element) => element.getAnimations({ subtree: true }).length,
    ),
  ).toBeGreaterThan(10);
  await placeholder.evaluate((element) => {
    element.style.transform = "translateY(20000px)";
  });
  await expect(placeholder).toHaveAttribute("data-paused", "true");
  await placeholder.evaluate(async (element) => {
    await Promise.all(
      element
        .getAnimations({ subtree: true })
        .map((animation) => animation.ready),
    );
  });
  const phase = await placeholder.evaluate((element) =>
    element
      .getAnimations({ subtree: true })
      .map((animation) => animation.currentTime),
  );
  await page.waitForTimeout(150);
  expect(
    await placeholder.evaluate((element) =>
      element
        .getAnimations({ subtree: true })
        .map((animation) => animation.currentTime),
    ),
  ).toEqual(phase);
  await placeholder.evaluate((element) => {
    element.style.removeProperty("transform");
  });
  await expect(placeholder).toHaveAttribute("data-paused", "false");
  await expect
    .poll(() =>
      placeholder.evaluate((element) =>
        element
          .getAnimations({ subtree: true })
          .some((animation) => animation.playState === "running"),
      ),
    )
    .toBe(true);
});

test("hidden and offscreen canvases stop drawing and resume", async ({
  page,
}) => {
  const background = page.locator("[data-neural-network]");
  const placeholder = page.locator("[data-unborn-museum]");
  await expect(background.locator("canvas")).toHaveCount(1, {
    timeout: 15_000,
  });
  await placeholder.scrollIntoViewIfNeeded();
  await expect(background).toHaveAttribute("data-paused", "false");
  await page.evaluate(() => {
    const context = document.querySelector("canvas")!.getContext("2d")!;
    const clear = context.clearRect.bind(context);
    context.clearRect = (...args) => {
      document.documentElement.dataset.canvasDraws = String(
        Number(document.documentElement.dataset.canvasDraws ?? 0) + 1,
      );
      clear(...args);
    };
  });
  await expect
    .poll(() =>
      page.evaluate(() =>
        Number(document.documentElement.dataset.canvasDraws ?? 0),
      ),
    )
    .toBeGreaterThan(2);
  await page.evaluate(() => {
    Object.defineProperty(document, "hidden", {
      configurable: true,
      value: true,
    });
    document.dispatchEvent(new Event("visibilitychange"));
  });
  await expect(background).toHaveAttribute("data-paused", "true");
  await expect(placeholder).toHaveAttribute("data-paused", "true");
  await expect
    .poll(async () => {
      const before = await page.evaluate(() =>
        Number(document.documentElement.dataset.canvasDraws),
      );
      await page.waitForTimeout(150);
      return (
        (await page.evaluate(() =>
          Number(document.documentElement.dataset.canvasDraws),
        )) - before
      );
    })
    .toBe(0);
  const draws = await page.evaluate(() =>
    Number(document.documentElement.dataset.canvasDraws),
  );
  await page.evaluate(() => {
    Object.defineProperty(document, "hidden", {
      configurable: true,
      value: false,
    });
    document.dispatchEvent(new Event("visibilitychange"));
  });
  await expect(background).toHaveAttribute("data-paused", "false");
  await expect
    .poll(() =>
      page.evaluate(() =>
        Number(document.documentElement.dataset.canvasDraws ?? 0),
      ),
    )
    .toBeGreaterThan(draws);

  await background.evaluate((element) => {
    element.style.transform = "translateY(20000px)";
  });
  await expect(background).toHaveAttribute("data-paused", "true");
  await expect
    .poll(async () => {
      const before = await page.evaluate(() =>
        Number(document.documentElement.dataset.canvasDraws),
      );
      await page.waitForTimeout(150);
      return (
        (await page.evaluate(() =>
          Number(document.documentElement.dataset.canvasDraws),
        )) - before
      );
    })
    .toBe(0);
  await background.evaluate((element) => {
    element.style.removeProperty("transform");
  });
  await expect(background).toHaveAttribute("data-paused", "false");
});

for (const viewport of [
  { width: 375, height: 812 },
  { width: 768, height: 1024 },
  { width: 1440, height: 900 },
]) {
  test(`pending image appearance survives pause and resume at ${viewport.width}`, async ({
    page,
  }) => {
    await page.setViewportSize(viewport);
    await page.emulateMedia({ reducedMotion: "reduce" });
    const placeholder = page.locator("[data-unborn-museum]");
    await placeholder.scrollIntoViewIfNeeded();
    await page.evaluate(() => document.fonts.ready);
    await expect(page.locator("[data-neural-network] canvas")).toBeVisible();
    const appearance = await placeholder.screenshot({ animations: "disabled" });
    await page.evaluate(() => {
      Object.defineProperty(document, "hidden", {
        configurable: true,
        value: true,
      });
      document.dispatchEvent(new Event("visibilitychange"));
    });
    await expect(placeholder).toHaveAttribute("data-paused", "true");
    await page.evaluate(() => {
      Object.defineProperty(document, "hidden", {
        configurable: true,
        value: false,
      });
      document.dispatchEvent(new Event("visibilitychange"));
    });
    await expect(placeholder).toHaveAttribute("data-paused", "false");
    expect(
      (await placeholder.screenshot({ animations: "disabled" })).equals(
        appearance,
      ),
    ).toBe(true);
    await page.screenshot({
      path: test.info().outputPath(`pending-image-${viewport.width}.png`),
    });
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
  });
}
