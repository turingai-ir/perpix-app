import { chromium } from '@playwright/test';

const browser = await chromium.connectOverCDP('http://127.0.0.1:9222');
const context = browser.contexts()[0];
const page = [...context.pages()].reverse().find((candidate) => candidate.url().includes('higgsfield.ai'));

if (!page) throw new Error('No Higgsfield page found');

const normalize = (value) => value?.replace(/\s+/g, ' ').trim() || '';

async function openModelPicker() {
  const search = page.locator('input[placeholder="Search..."]');
  if (await search.isVisible().catch(() => false)) return search;
  const modelButton = page.getByRole('button', { name: 'Model' });
  await modelButton.scrollIntoViewIfNeeded();
  await modelButton.click();
  await search.waitFor({ state: 'visible' });
  return search;
}

async function inspectLeftPanel() {
  return page.locator('body').evaluate(() => {
    const normalizeInner = (value) => value?.replace(/\s+/g, ' ').trim() || '';
    const all = [...document.querySelectorAll('button, [role="button"], [role="radio"], input, textarea, select')];
    return all
      .map((element) => {
        const rect = element.getBoundingClientRect();
        return {
          text: normalizeInner(element.textContent).slice(0, 240),
          ariaLabel: element.getAttribute('aria-label'),
          placeholder: element.getAttribute('placeholder'),
          type: element.getAttribute('type'),
          role: element.getAttribute('role'),
          x: Math.round(rect.x),
          y: Math.round(rect.y),
          width: Math.round(rect.width),
          height: Math.round(rect.height),
        };
      })
      .filter((item) => item.width > 0 && item.height > 0 && item.x < 420);
  });
}

async function selectModel(query, fileSlug) {
  const search = await openModelPicker();
  await search.fill(query);
  await page.waitForTimeout(350);

  const pickerButtons = await page.locator('button').evaluateAll((elements) => elements
    .map((element, index) => ({
      index,
      text: element.textContent?.replace(/\s+/g, ' ').trim() || '',
      rect: element.getBoundingClientRect().toJSON(),
    }))
    .filter((item) => item.rect.width > 0 && item.rect.height > 0 && item.rect.x > 300 && item.rect.x < 950));

  const preferred = pickerButtons.find((item) => normalize(item.text).toLowerCase().startsWith(query.toLowerCase()));
  if (!preferred) {
    return { query, error: 'No matching row', pickerButtons };
  }

  const allButtons = page.locator('button');
  await allButtons.nth(preferred.index).click();
  await page.waitForTimeout(850);
  await page.screenshot({ path: `.artifacts/higgsfield-flow-${fileSlug}.png`, fullPage: false });
  return {
    query,
    url: page.url(),
    titleText: await page.locator('[role="button"]').filter({ hasText: query }).first().textContent().catch(() => null),
    leftControls: await inspectLeftPanel(),
  };
}

const targets = [
  ['Higgsfield Genjutsu', 'genjutsu'],
  ['Seedance 2.5 Edit', 'seedance-edit'],
  ['Kling 3.0 Motion Control', 'kling-motion'],
  ['FLUX.3 Video', 'flux-video'],
  ['Wan 3.0', 'wan-3'],
];

const results = [];
for (const [query, slug] of targets) {
  results.push(await selectModel(query, slug));
}

console.log(JSON.stringify(results, null, 2));
process.exit(0);
