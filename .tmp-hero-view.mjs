import { chromium } from '@playwright/test';
const b = await chromium.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe' });
try {
 const p = await b.newPage({ viewport: { width: 1440, height: 1000 }, serviceWorkers: 'block' });
 await p.route('**/*', r => new URL(r.request().url()).hostname === 'localhost' ? r.continue() : r.abort());
 await p.goto('http://localhost:5173/auth/login');
 await p.waitForTimeout(2500);
 await p.screenshot({ path: '.tmp-hero.png' });
 await p.setViewportSize({ width: 390, height: 844 });
 await p.screenshot({ path: '.tmp-hero-mobile.png', fullPage: true });
} finally { await b.close(); }
