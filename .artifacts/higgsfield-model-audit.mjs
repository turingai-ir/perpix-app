import { chromium } from '@playwright/test';

const browser = await chromium.connectOverCDP('http://127.0.0.1:9222');
const context = browser.contexts()[0];
const page = [...context.pages()].reverse().find((candidate) => candidate.url().includes('higgsfield.ai'));

if (!page) throw new Error('No Higgsfield page found');

const visibleText = async () => page.locator('body').evaluate(() => {
  const normalize = (value) => value?.replace(/\s+/g, ' ').trim() || '';
  return [...document.querySelectorAll('button, [role="button"], [role="option"], [role="menuitem"], input')]
    .filter((element) => {
      const rect = element.getBoundingClientRect();
      return rect.width > 0 && rect.height > 0;
    })
    .map((element) => {
      const rect = element.getBoundingClientRect();
      return {
        text: normalize(element.textContent).slice(0, 220),
        ariaLabel: element.getAttribute('aria-label'),
        role: element.getAttribute('role'),
        placeholder: element.getAttribute('placeholder'),
        x: Math.round(rect.x),
        y: Math.round(rect.y),
        width: Math.round(rect.width),
        height: Math.round(rect.height),
      };
    });
});

const festivalClose = page.locator('button').filter({ has: page.locator('svg') }).filter({ hasText: '' });
const explicitClose = page.getByRole('button', { name: 'Close' });
if (await explicitClose.count()) {
  await explicitClose.last().click().catch(() => {});
  await page.waitForTimeout(250);
}

const modelButton = page.getByRole('button', { name: 'Model' });
await modelButton.scrollIntoViewIfNeeded();
await modelButton.click();
await page.waitForTimeout(450);
await page.screenshot({ path: '.artifacts/higgsfield-live-model-picker.png', fullPage: false });

console.log(JSON.stringify({ url: page.url(), controls: await visibleText() }, null, 2));
process.exit(0);
