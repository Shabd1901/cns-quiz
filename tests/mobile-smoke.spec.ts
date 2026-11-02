import { test, expect } from '@playwright/test';

const routes = [
  '/',
  '/quiz',
  '/revision',
  '/modules/crypto',
  '/modules/auth',
  '/modules/firewall',
  '/modules/cloud',
  '/modules/attacks',
  '/modules/ids',
  '/modules/tls',
  '/modules/ai'
];

test.use({ viewport: { width: 360, height: 640 } }); // Narrow mobile screen (360px)

for (const route of routes) {
  test(`Mobile Route ${route} has no horizontal overflow and hamburger works`, async ({ page }) => {
    const consoleErrors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });

    await page.goto(route, { waitUntil: 'networkidle' });

    // Verify no horizontal overflow beyond viewport width
    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    const innerWidth = await page.evaluate(() => window.innerWidth);
    expect(scrollWidth).toBeLessThanOrEqual(innerWidth);

    // Verify no console errors
    expect(consoleErrors.length).toBe(0);

    // Verify mobile hamburger button is visible
    const hamburger = page.locator('button[aria-label="Toggle navigation menu"]');
    await expect(hamburger).toBeVisible();

    // Open hamburger drawer
    await hamburger.click();
    await page.waitForTimeout(200);

    // Close hamburger drawer
    await hamburger.click();
  });
}
