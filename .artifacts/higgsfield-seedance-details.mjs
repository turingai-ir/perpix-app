import { chromium } from 'playwright';

const browser = await chromium.connectOverCDP('http://127.0.0.1:9222');
const page = browser.contexts()[0].pages().at(-1);
if (!page) throw new Error('No browser page found');

const snapshot = async (name) => {
  await page.screenshot({ path: `.artifacts/${name}.png`, fullPage: false });
  return page.locator('body').evaluate(() => [...document.querySelectorAll(
    'button, [role="button"], [role="radio"], [role="switch"], [role="combobox"], input, textarea, select'
  )].map((element) => {
    const rect = element.getBoundingClientRect();
    return {
      text: element.textContent?.replace(/\s+/g, ' ').trim().slice(0, 180) || '',
      ariaLabel: element.getAttribute('aria-label'), placeholder: element.getAttribute('placeholder'), role: element.getAttribute('role'),
      x: Math.round(rect.x), y: Math.round(rect.y), width: Math.round(rect.width), height: Math.round(rect.height),
    };
  }).filter((item) => item.width > 0 && item.height > 0 && item.y >= 80 && item.y < innerHeight && item.x < 440));
};

await page.getByRole('radio', { name: 'Extend Video' }).click();
await page.waitForTimeout(500);
const extend = await snapshot('higgsfield-seedance-extend');

await page.getByRole('radio', { name: 'References' }).click();
await page.waitForTimeout(350);
const scrollables = await page.evaluate(() => [...document.querySelectorAll('*')].map((element, index) => {
  const rect = element.getBoundingClientRect();
  return { index, x: rect.x, y: rect.y, width: rect.width, height: rect.height, scrollHeight: element.scrollHeight, clientHeight: element.clientHeight };
}).filter((item) => item.x < 430 && item.width > 250 && item.scrollHeight > item.clientHeight + 100));

await page.evaluate(() => {
  const scroller = [...document.querySelectorAll('*')].find((element) => {
    const rect = element.getBoundingClientRect();
    return rect.x < 430 && rect.width > 250 && element.scrollHeight > element.clientHeight + 100;
  });
  if (scroller) scroller.scrollTop = scroller.scrollHeight;
});
await page.waitForTimeout(450);
const bottom = await snapshot('higgsfield-seedance-bottom');

console.log(JSON.stringify({ extend, scrollables, bottom }, null, 2));
await browser.close();
