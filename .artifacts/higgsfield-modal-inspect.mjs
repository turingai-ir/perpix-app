import { chromium } from '@playwright/test';

const browser = await chromium.connectOverCDP('http://127.0.0.1:9222');
const page = [...browser.contexts()[0].pages()].reverse().find((candidate) => candidate.url().includes('higgsfield.ai'));
const result = await page.locator('button').evaluateAll((elements) => elements.map((element, index) => {
  const rect = element.getBoundingClientRect();
  const style = getComputedStyle(element);
  return {
    index,
    text: element.textContent?.replace(/\s+/g, ' ').trim() || '',
    ariaLabel: element.getAttribute('aria-label'),
    rect: { x: rect.x, y: rect.y, width: rect.width, height: rect.height },
    zIndex: style.zIndex,
    position: style.position,
    pointerEvents: style.pointerEvents,
    html: element.outerHTML.slice(0, 500),
  };
}).filter((item) => item.rect.width > 0 && item.rect.x > 950 && item.rect.y < 80));
console.log(JSON.stringify(result, null, 2));
process.exit(0);
