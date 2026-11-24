import assert from "node:assert/strict";
import { test, describe } from "node:test";
import { chromium } from "../../../node_modules/.pnpm/@playwright+test@1.64.1/node_modules/@playwright/test/index.mjs";

describe("Browser Multi-Device & Theme Render Audit", () => {
  const VIEWPORTS = [
    { name: "Mobile iPhone 15", width: 390, height: 844 },
    { name: "Tablet iPad Mini", width: 768, height: 1024 },
    { name: "Desktop Wide", width: 1280, height: 800 },
  ];

  const THEMES = ["light", "dark"];
  const DIRECTIONS = ["rtl", "ltr"];

  test("Renders Liquid Glass components without horizontal overflow or runtime errors", async () => {
    const browser = await chromium.launch();

    for (const vp of VIEWPORTS) {
      for (const theme of THEMES) {
        for (const dir of DIRECTIONS) {
          const context = await browser.newContext({
            viewport: { width: vp.width, height: vp.height },
            hasTouch: vp.width < 1000,
          });

          const page = await context.newPage();
          const pageErrors = [];
          page.on("pageerror", (err) => pageErrors.push(err.message));

          await page.setContent(`
            <!DOCTYPE html>
            <html dir="${dir}" class="${theme === "dark" ? "dark" : ""}">
            <head>
              <meta charset="utf-8" />
              <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
              <style>
                * { box-sizing: border-box; margin: 0; padding: 0; }
                body {
                  font-family: system-ui, -apple-system, sans-serif;
                  background: ${theme === "dark" ? "#0f0f12" : "#f8f9fc"};
                  color: ${theme === "dark" ? "#f1f1f5" : "#1a1a24"};
                  padding: 16px;
                  overflow-x: hidden;
                }
                .glass-card {
                  backdrop-filter: blur(20px);
                  -webkit-backdrop-filter: blur(20px);
                  background: ${theme === "dark" ? "rgba(25, 25, 35, 0.65)" : "rgba(255, 255, 255, 0.6)"};
                  border: 1px solid ${theme === "dark" ? "rgba(255, 255, 255, 0.1)" : "rgba(255, 255, 255, 0.45)"};
                  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
                  border-radius: 16px;
                  padding: 16px;
                  margin-bottom: 16px;
                }
                .tab-track {
                  display: flex;
                  gap: 8px;
                  overflow-x: auto;
                  scrollbar-width: none;
                  padding: 4px;
                }
                .tab-item {
                  flex-shrink: 0;
                  padding: 8px 16px;
                  border-radius: 9999px;
                  background: rgba(255, 255, 255, 0.15);
                  border: 1px solid rgba(255, 255, 255, 0.1);
                  min-height: 44px;
                  display: flex;
                  align-items: center;
                }
              </style>
            </head>
            <body>
              <div class="glass-card" id="card">
                <h2>Liquid Glass Test [${vp.name} - ${theme} - ${dir}]</h2>
                <div class="tab-track" id="track">
                  <div class="tab-item">تب اول</div>
                  <div class="tab-item">تب دوم طولانی</div>
                  <div class="tab-item">تب سوم ویژه</div>
                  <div class="tab-item">تب چهارم تنظیمات</div>
                  <div class="tab-item">تب پنجم خروجی</div>
                  <div class="tab-item">تب ششم پیشرفته</div>
                </div>
              </div>
            </body>
            </html>
          `);

          // Ensure no unhandled runtime errors
          assert.strictEqual(
            pageErrors.length,
            0,
            `Runtime errors found in ${vp.name} (${theme}, ${dir}): ${pageErrors.join(", ")}`,
          );

          // Verify body does not have runaway horizontal page overflow
          const overflow = await page.evaluate(() => {
            return {
              scrollWidth: document.documentElement.scrollWidth,
              clientWidth: document.documentElement.clientWidth,
            };
          });

          assert.ok(
            overflow.scrollWidth <= overflow.clientWidth + 1,
            `Page overflow detected in ${vp.name} (${theme}, ${dir}): scrollWidth ${overflow.scrollWidth} > clientWidth ${overflow.clientWidth}`,
          );

          await context.close();
        }
      }
    }

    await browser.close();
  });
});
