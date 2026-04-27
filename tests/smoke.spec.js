import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const BASE = '/visual-aids';

// Discover slugs from dist/ at test collection time — requires a prior `npm run build`
const distDir = path.resolve(__dirname, '../dist');
const slugs = fs.readdirSync(distDir).filter(name => /^\d{8}-/.test(name));

test('index page loads and shows all aid cards', async ({ page }) => {
  const jsErrors = [];
  page.on('pageerror', err => jsErrors.push(err.message));

  await page.goto(`${BASE}/`);
  await page.waitForSelector('#root > *', { timeout: 5000 });

  await expect(page).toHaveTitle('Visual Aids');
  // Site header with breadcrumb is present
  await expect(page.locator('header nav[aria-label="breadcrumb"]')).toBeVisible();
  await expect(page.locator('header')).toContainText('Visual Aids');
  expect(jsErrors).toHaveLength(0);

  // One card link per discovered aid
  const cards = page.locator(`a[href*="${BASE}/"]`);
  await expect(cards).toHaveCount(slugs.length);
});

for (const slug of slugs) {
  test(`aid page renders without JS errors: ${slug}`, async ({ page }) => {
    const jsErrors = [];
    page.on('pageerror', err => jsErrors.push(err.message));

    await page.goto(`${BASE}/${slug}/`);
    // Wait for React to mount something into #root
    await page.waitForSelector('#root > *', { timeout: 5000 });
    // Site header is present and links back to index
    await expect(page.locator('header nav[aria-label="breadcrumb"]')).toBeVisible();
    await expect(page.locator('header')).toContainText('Visual Aids');

    expect(jsErrors, `JS errors on ${slug}: ${jsErrors.join(', ')}`).toHaveLength(0);
  });
}

test('page-content class present on index page', async ({ page }) => {
  await page.goto(`${BASE}/`);
  await page.waitForSelector('#root > *', { timeout: 5000 });
  await expect(page.locator('.page-content')).toBeVisible();
  await expect(page.locator('.site-header')).toBeVisible();
});

for (const slug of slugs) {
  test(`page-content class present on aid page: ${slug}`, async ({ page }) => {
    await page.goto(`${BASE}/${slug}/`);
    await page.waitForSelector('#root > *', { timeout: 5000 });
    await expect(page.locator('.page-content')).toBeVisible();
    await expect(page.locator('.site-header')).toBeVisible();
  });
}
