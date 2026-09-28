import { chromium } from 'playwright';

const browser = await chromium.connectOverCDP('http://127.0.0.1:9222');
const pages = browser.contexts()[0]?.pages() ?? [];
const page = pages.at(-1);

if (!page) throw new Error('No browser page found');

const heading = page.getByText('UPGRADE REQUIRED', { exact: true }).first();
if (await heading.isVisible().catch(() => false)) {
  await heading.evaluate((node) => {
    let parent = node.parentElement;
    while (parent) {
      const buttons = [...parent.querySelectorAll('button')];
      const close = buttons.find((button) => {
        const rect = button.getBoundingClientRect();
        return rect.top < 40 && rect.right > window.innerWidth - 40;
      });
      if (close) {
        close.click();
        return;
      }
      parent = parent.parentElement;
    }
  });
  await page.waitForTimeout(500);
}

console.log(JSON.stringify({
  url: page.url(),
  upgradeVisible: await heading.isVisible().catch(() => false),
}, null, 2));

await browser.close();
