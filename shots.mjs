// shots.mjs — takes the entry's screenshots with Playwright Chromium.
// Run from the repo root while `node serve.ts` serves app/ on :8080:
//   node shots.mjs
// Writes 4 screenshots into screenshots/. Each is a real render of the
// site's own code, never edited or composited.

import { chromium } from 'playwright-core';
import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const outDir = join(here, 'screenshots');
const exe = process.env.CHROME_PATH ?? '/home/hatch/.cache/ms-playwright/chromium-1255/chrome-linux64/chrome';

const shots = [
  {
    file: '1-cover.png',
    url: 'http://localhost:8080/',
    viewport: { width: 1280, height: 800 },
  },
  {
    file: '2-filtered.png',
    url: 'http://localhost:8080/?min=50&sort=discount',
    viewport: { width: 1280, height: 800 },
  },
  {
    file: '3-compare.png',
    url: 'http://localhost:8080/',
    viewport: { width: 1280, height: 800 },
    scrollTo: '.compare-section',
  },
  {
    file: '4-phone.png',
    url: 'http://localhost:8080/',
    viewport: { width: 390, height: 844 },
  },
];

const browser = await chromium.launch({ executablePath: exe });
for (const shot of shots) {
  const page = await browser.newPage({ viewport: shot.viewport });
  await page.goto(shot.url, { waitUntil: 'networkidle' });
  await page.waitForFunction(() => window.__shotReady === true, { timeout: 10000 });
  if (shot.scrollTo) {
    await page.locator(shot.scrollTo).scrollIntoViewIfNeeded();
    await page.waitForTimeout(300);
  }
  const path = join(outDir, shot.file);
  await page.screenshot({ path, type: 'png' });
  console.log('wrote', path);
  await page.close();
}
await browser.close();
