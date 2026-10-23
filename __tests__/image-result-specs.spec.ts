import {
  conversationMessages,
  expect,
  taskUuid,
  test,
} from "./fixtures/image-conversation";

const viewports = [
  { width: 320, height: 740 },
  { width: 375, height: 812 },
  { width: 812, height: 375 },
  { width: 768, height: 1024 },
  { width: 1440, height: 900 },
];
const specs = [
  { ratio: "1:1", resolution: "1024px" },
  { ratio: "16:9", resolution: undefined },
  { ratio: "9:16", resolution: "4096 × 2048 pixels" },
];

for (const viewport of viewports) {
  for (const spec of specs) {
    test(`result specs fit ${viewport.width}x${viewport.height}, ${spec.ratio}, ${spec.resolution ?? "no resolution"}`, async ({
      imageConversationApi,
      page,
    }, testInfo) => {
      await page.setViewportSize(viewport);
      await page.emulateMedia({ reducedMotion: "reduce" });
      const messages = conversationMessages({
        aspectRatio: spec.ratio,
        prompt: "A cinematic lighthouse above a stormy sea",
      });
      for (const message of messages) {
        message.ai_model_config.resolution = spec.resolution;
      }
      imageConversationApi.setTaskMessages(messages);
      await page.goto(`/generation/image/${taskUuid}`);
      const result = page
        .locator("article")
        .filter({ hasText: "تصویر آماده است" });
      const header = result.locator("header");
      const metadata = header.locator("aside");
      await expect(metadata).toBeVisible();
      await expect(metadata.locator("dd")).toHaveText(
        spec.resolution ? [spec.ratio, spec.resolution] : [spec.ratio],
      );
      await expect(metadata.locator("dl")).toBeVisible();
      await page.evaluate(() => document.fonts.ready);
      const layout = await header.evaluate((element) => {
        const box = element.getBoundingClientRect();
        const aside = element.querySelector("aside")!;
        const title = element.querySelector(":scope > span")!;
        const specBox = aside.getBoundingClientRect();
        const titleBox = title.getBoundingClientRect();
        const screen = aside.querySelector("dl")!;
        const screenBox = screen.getBoundingClientRect();
        const bodyBox = screen.parentElement!.getBoundingClientRect();
        return {
          height: specBox.height,
          contained: [aside, title, ...aside.querySelectorAll("dd")].every(
            (node) => {
              const rect = node.getBoundingClientRect();
              return rect.left >= box.left - 1 && rect.right <= box.right + 1;
            },
          ),
          overlaps:
            specBox.left < titleBox.right &&
            specBox.right > titleBox.left &&
            specBox.top < titleBox.bottom &&
            specBox.bottom > titleBox.top,
          clippedText: [...aside.querySelectorAll("dd")].some(
            (node) => node.scrollWidth > node.clientWidth + 1,
          ),
          inRobotBody:
            screenBox.left >= bodyBox.left &&
            screenBox.right <= bodyBox.right &&
            screenBox.top >= bodyBox.top &&
            screenBox.bottom <= bodyBox.bottom,
          readable: [...screen.querySelectorAll("dd")].every(
            (node) => parseFloat(getComputedStyle(node).fontSize) >= 12,
          ),
          textInScreen: [...screen.querySelectorAll("dd")].every((node) => {
            const rect = node.getBoundingClientRect();
            return (
              rect.left >= screenBox.left &&
              rect.right <= screenBox.right &&
              rect.top >= screenBox.top &&
              rect.bottom <= screenBox.bottom
            );
          }),
          exposed: !screen.closest('[aria-hidden="true"]'),
        };
      });
      expect(layout.height).toBeLessThanOrEqual(144);
      expect(layout.contained).toBe(true);
      expect(layout.overlaps).toBe(false);
      expect(layout.clippedText).toBe(false);
      expect(layout.inRobotBody).toBe(true);
      expect(layout.readable).toBe(true);
      expect(layout.textInScreen).toBe(true);
      expect(layout.exposed).toBe(true);
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth > window.innerWidth,
      );
      expect(overflow).toBe(false);
      await expect(
        result.getByRole("button", { name: "استفاده به‌عنوان مرجع" }),
      ).toBeVisible();
      expect(imageConversationApi.generateRequests).toEqual([]);
      await header.evaluate((element) => {
        element.scrollIntoView({ block: "center", behavior: "instant" });
      });
      const screenshotPath = testInfo.outputPath("result-header.png");
      await header.screenshot({
        animations: "disabled",
        path: screenshotPath,
      });
      await testInfo.attach("result-header", {
        path: screenshotPath,
        contentType: "image/png",
      });
    });
  }
}

test("robot metadata remains stable while decorative parts animate", async ({
  imageConversationApi,
  page,
}) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.emulateMedia({ reducedMotion: "no-preference" });
  imageConversationApi.setTaskMessages(
    conversationMessages({
      prompt: "A cinematic lighthouse above a stormy sea",
    }),
  );
  await page.goto(`/generation/image/${taskUuid}`);
  const robot = page.locator("article header aside");
  await expect(robot.locator("dl")).toBeVisible();
  const motion = await robot.evaluate((element) => {
    const screen = element.querySelector("dl")!;
    const rig = screen.parentElement!.parentElement!;
    const head = rig.querySelector('[aria-hidden="true"] + div')!;
    return {
      rig: getComputedStyle(rig).animationName,
      screen: getComputedStyle(screen).animationName,
      head: getComputedStyle(head).animationName,
    };
  });
  expect(motion.rig).toBe("none");
  expect(motion.screen).toBe("none");
  expect(motion.head).not.toBe("none");
  await page.emulateMedia({ reducedMotion: "reduce" });
  expect(
    await robot.evaluate((element) =>
      element
        .getAnimations({ subtree: true })
        .every((animation) =>
          ["finished", "idle"].includes(animation.playState),
        ),
    ),
  ).toBe(true);
});
