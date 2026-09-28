import { chromium } from 'playwright';

const browser = await chromium.connectOverCDP('http://127.0.0.1:9222');
const context = browser.contexts()[0];
const page = [...context.pages()].reverse().find((candidate) => candidate.url().includes('higgsfield.ai'));
if (!page) throw new Error('No Higgsfield page found');

const targetUrl = process.argv[2] || 'https://higgsfield.ai/ai/video?model=genjutsu';
await page.goto(targetUrl, { waitUntil: 'domcontentloaded' });
await page.waitForTimeout(7000);
await page.screenshot({ path: '.artifacts/higgsfield-reset-video.png', fullPage: false });

const visibleControls = await page.locator('body').evaluate(() => [...document.querySelectorAll(
  'button, [role="button"], [role="radio"], [role="switch"], input, textarea, select'
)].map((element) => {
  const rect = element.getBoundingClientRect();
  return {
    text: element.textContent?.replace(/\s+/g, ' ').trim().slice(0, 180) || '',
    ariaLabel: element.getAttribute('aria-label'),
    placeholder: element.getAttribute('placeholder'),
    role: element.getAttribute('role'),
    x: Math.round(rect.x),
    y: Math.round(rect.y),
    width: Math.round(rect.width),
    height: Math.round(rect.height),
  };
}).filter((item) => item.width > 0 && item.height > 0 && item.y >= 80 && item.y < innerHeight && item.x < 440));

console.log(JSON.stringify({ url: page.url(), visibleControls }, null, 2));
await browser.close();
