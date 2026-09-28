import { chromium } from '@playwright/test';

const browser = await chromium.connectOverCDP('http://127.0.0.1:9222');
const context = browser.contexts()[0];
const pages = context.pages();

console.log(JSON.stringify(await Promise.all(pages.map(async (page, index) => ({
  index,
  title: await page.title(),
  url: page.url(),
}))), null, 2));

const page = [...pages].reverse().find((candidate) => candidate.url().includes('higgsfield.ai'));
if (!page) throw new Error('No Higgsfield page found');

await page.waitForTimeout(1200);
await page.screenshot({ path: '.artifacts/higgsfield-live-current.png', fullPage: false });

const result = await page.locator('body').evaluate(() => {
  const normalize = (value) => value?.replace(/\s+/g, ' ').trim() || '';
  const elements = [...document.querySelectorAll(
    'button, [role="button"], [role="tab"], [role="menuitem"], input, textarea, select, a[href]'
  )];

  return {
    headingText: [...document.querySelectorAll('h1, h2, h3')]
      .filter((element) => element.getBoundingClientRect().width > 0)
      .map((element) => normalize(element.textContent))
      .filter(Boolean)
      .slice(0, 80),
    controls: elements
      .filter((element) => {
        const rect = element.getBoundingClientRect();
        return rect.width > 0 && rect.height > 0;
      })
      .map((element) => {
        const rect = element.getBoundingClientRect();
        return {
          tag: element.tagName.toLowerCase(),
          role: element.getAttribute('role'),
          type: element.getAttribute('type'),
          text: normalize(element.textContent).slice(0, 180),
          ariaLabel: element.getAttribute('aria-label'),
          placeholder: element.getAttribute('placeholder'),
          title: element.getAttribute('title'),
          href: element.getAttribute('href'),
          disabled: element.matches(':disabled') || element.getAttribute('aria-disabled') === 'true',
          x: Math.round(rect.x),
          y: Math.round(rect.y),
          width: Math.round(rect.width),
          height: Math.round(rect.height),
        };
      })
      .slice(0, 240),
  };
});

console.log(JSON.stringify(result, null, 2));
