import { chromium } from 'playwright';

const browser = await chromium.connectOverCDP('http://127.0.0.1:9222');
const page = browser.contexts()[0].pages().at(-1);
if (!page) throw new Error('No browser page found');

const result = {};
for (const label of ['Duration', 'Ratio', 'Resolution', 'Bitrate']) {
  const control = page.getByLabel(label, { exact: true });
  await control.click();
  await page.waitForTimeout(180);
  result[label] = await page.locator('body').evaluate(() => [...document.querySelectorAll(
    'button, [role="option"], [role="menuitem"], [role="radio"]'
  )].map((element) => {
    const rect = element.getBoundingClientRect();
    return {
      text: element.textContent?.replace(/\s+/g, ' ').trim().slice(0, 120) || '',
      role: element.getAttribute('role'), checked: element.getAttribute('aria-checked'), selected: element.getAttribute('aria-selected'),
      x: Math.round(rect.x), y: Math.round(rect.y), width: Math.round(rect.width), height: Math.round(rect.height),
    };
  }).filter((item) => item.width > 0 && item.height > 0 && item.x < 430 && item.y > 80 && item.y < innerHeight));
  await page.screenshot({ path: `.artifacts/higgsfield-setting-${label.toLowerCase()}.png`, fullPage: false });
  await page.keyboard.press('Escape');
  await page.waitForTimeout(100);
}

console.log(JSON.stringify(result, null, 2));
await browser.close();
