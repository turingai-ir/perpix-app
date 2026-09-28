import { chromium } from "@playwright/test";

const browser = await chromium.connectOverCDP("http://127.0.0.1:9222");
const context = browser.contexts()[0];
const page =
  context.pages().find((candidate) => candidate.url().includes("localhost:5173")) ??
  (await context.newPage());

page.on("console", (message) => {
  if (["error", "warning"].includes(message.type())) {
    console.log(`console:${message.type()}: ${message.text()}`);
  }
});
page.on("pageerror", (error) => console.log(`pageerror: ${error.message}`));
await page.setViewportSize({ width: 1440, height: 960 });
await page.goto("http://localhost:5173/generation/video", {
  waitUntil: "domcontentloaded",
  timeout: 15_000,
});
await page.waitForTimeout(5000);

console.log(
  JSON.stringify(
    {
      url: page.url(),
      title: await page.title(),
      text: (await page.locator("body").innerText()).slice(0, 5000),
      composer: await page.locator("[data-generation-composer]").count(),
      stage: await page.locator("[data-video-director-stage]").count(),
    },
    null,
    2,
  ),
);

await page.screenshot({
  path: ".artifacts/perpix-live-video.png",
  fullPage: true,
});

await page.bringToFront();
process.exit(0);
