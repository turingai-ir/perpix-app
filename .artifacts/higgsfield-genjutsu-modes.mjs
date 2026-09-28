import { chromium } from 'playwright';

const browser = await chromium.connectOverCDP('http://127.0.0.1:9222');
const page = browser.contexts()[0].pages().at(-1);
if (!page) throw new Error('No browser page found');

const tab = page.getByRole('tab', { name: 'Objects swap' });
await tab.click();
await page.waitForTimeout(650);
await page.screenshot({ path: '.artifacts/higgsfield-genjutsu-objects-swap.png', fullPage: false });

const controls = await page.locator('body').evaluate(() => [...document.querySelectorAll(
  'button, [role="button"], [role="tab"], [role="switch"], input, textarea, select'
)].map((element) => {
  const rect = element.getBoundingClientRect();
  return {
    text: element.textContent?.replace(/\s+/g, ' ').trim().slice(0, 180) || '',
    ariaLabel: element.getAttribute('aria-label'),
    placeholder: element.getAttribute('placeholder'),
    role: element.getAttribute('role'),
    x: Math.round(rect.x), y: Math.round(rect.y), width: Math.round(rect.width), height: Math.round(rect.height),
  };
}).filter((item) => item.width > 0 && item.height > 0 && item.y >= 80 && item.y < innerHeight && item.x < 440));

console.log(JSON.stringify(controls, null, 2));
await browser.close();
