import { chromium } from '@playwright/test';

const query = process.argv[2];
const slug = process.argv[3] || query?.toLowerCase().replace(/[^a-z0-9]+/g, '-');
if (!query) throw new Error('Pass a model query');

const browser = await chromium.connectOverCDP('http://127.0.0.1:9222');
const context = browser.contexts()[0];
const page = [...context.pages()].reverse().find((candidate) => candidate.url().includes('higgsfield.ai'));
if (!page) throw new Error('No Higgsfield page found');
page.setDefaultTimeout(5000);

const upgradeHeading = page.getByText('UPGRADE REQUIRED', { exact: true });
if (await upgradeHeading.isVisible().catch(() => false)) {
  const size = await page.evaluate(() => ({ width: document.documentElement.clientWidth }));
  const candidates = await page.locator('button').evaluateAll((elements, viewportWidth) => elements
    .map((element, index) => ({ index, rect: element.getBoundingClientRect().toJSON() }))
    .filter((item) => item.rect.width > 0 && item.rect.x > viewportWidth - 60 && item.rect.y < 60), size.width);
  const closeButton = candidates.at(-1);
  if (closeButton) await page.locator('button').nth(closeButton.index).click();
  if (await upgradeHeading.isVisible().catch(() => false)) await page.keyboard.press('Escape');
  await page.waitForTimeout(350);
}

const search = page.locator('input[placeholder="Search..."], input[placeholder="Search"]');
if (!(await search.isVisible().catch(() => false))) {
  const changeButton = page.getByText('Change', { exact: true }).first();
  await changeButton.click();
  await search.waitFor({ state: 'visible' });
}

await search.fill(query);
await page.waitForTimeout(350);

const results = await page.locator('button').evaluateAll((elements) => elements
  .map((element, index) => {
    const rect = element.getBoundingClientRect();
    return {
      index,
      text: element.textContent?.replace(/\s+/g, ' ').trim() || '',
      x: Math.round(rect.x),
      y: Math.round(rect.y),
      width: Math.round(rect.width),
      height: Math.round(rect.height),
    };
  })
  .filter((item) => item.width > 0 && item.height > 0 && item.x > 300 && item.x < 950));

const normalizedQuery = query.toLowerCase();
const chosen = results.find((item) => item.text.toLowerCase().startsWith(normalizedQuery));
if (!chosen) {
  console.log(JSON.stringify({ query, error: 'No matching row', results }, null, 2));
  process.exit(0);
}

await page.locator('button').nth(chosen.index).click();
await page.waitForTimeout(900);

const gated = await upgradeHeading.isVisible().catch(() => false);
await page.screenshot({ path: `.artifacts/higgsfield-select-${slug}.png`, fullPage: false });

const controls = await page.locator('body').evaluate(() => [...document.querySelectorAll(
  'button, [role="button"], [role="radio"], input, textarea, select'
)].map((element) => {
  const rect = element.getBoundingClientRect();
  return {
    text: element.textContent?.replace(/\s+/g, ' ').trim().slice(0, 220) || '',
    ariaLabel: element.getAttribute('aria-label'),
    placeholder: element.getAttribute('placeholder'),
    role: element.getAttribute('role'),
    x: Math.round(rect.x),
    y: Math.round(rect.y),
    width: Math.round(rect.width),
    height: Math.round(rect.height),
  };
}).filter((item) => item.width > 0 && item.height > 0 && item.x < 430));

console.log(JSON.stringify({ query, chosen, gated, url: page.url(), controls }, null, 2));
process.exit(0);
