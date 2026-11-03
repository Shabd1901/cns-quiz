import { test, expect } from '@playwright/test';

const routes = [
  '/',
  '/quiz',
  '/revision',
  '/timeline',
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

test('Mobile Student Portal has no horizontal overflow and tabs switch cleanly', async ({ page }) => {
  const consoleErrors: string[] = [];
  page.on('console', msg => {
    if (msg.type() === 'error') consoleErrors.push(msg.text());
  });

  await page.addInitScript(() => {
    window.localStorage.setItem(
      'cns-auth-session',
      JSON.stringify({
        state: {
          role: 'student',
          student: {
            name: 'Dev Shah',
            rollNo: '21BCP042',
            batch: 'Batch A1',
            department: 'Thakur College of Engineering & Technology (CMPN)',
          },
          teacher: null,
          isAuthenticated: true,
        },
        version: 0,
      })
    );
  });

  await page.goto('/student', { waitUntil: 'networkidle' });

  const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
  const innerWidth = await page.evaluate(() => window.innerWidth);
  expect(scrollWidth).toBeLessThanOrEqual(innerWidth);
  expect(consoleErrors.length).toBe(0);

  // Switch tabs
  await page.getByRole('button', { name: /Portion Timeline/i }).click();
  await page.waitForTimeout(200);
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(innerWidth);

  await page.getByRole('button', { name: /Course Notes/i }).click();
  await page.waitForTimeout(200);
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(innerWidth);

  await page.getByRole('button', { name: /Multi-Subject Marks/i }).click();
  await page.waitForTimeout(200);
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(innerWidth);
  expect(consoleErrors.length).toBe(0);
});

test('Mobile Teacher Portal has no horizontal overflow and tabs switch cleanly', async ({ page }) => {
  const consoleErrors: string[] = [];
  page.on('console', msg => {
    if (msg.type() === 'error') consoleErrors.push(msg.text());
  });

  await page.addInitScript(() => {
    window.localStorage.setItem(
      'cns-auth-session',
      JSON.stringify({
        state: {
          role: 'teacher',
          student: null,
          teacher: {
            name: 'Prof. S. R. Raman',
            email: 'raman.sr@tcetmumbai.in',
            employeeId: 'TCET-CMPN-104',
            designation: 'Associate Professor & CNS Course In-Charge',
            department: 'Computer Engineering (CMPN)',
            cabin: 'A-Block 402',
          },
          isAuthenticated: true,
        },
        version: 0,
      })
    );
  });

  await page.goto('/teacher', { waitUntil: 'networkidle' });

  const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
  const innerWidth = await page.evaluate(() => window.innerWidth);
  expect(scrollWidth).toBeLessThanOrEqual(innerWidth);
  expect(consoleErrors.length).toBe(0);

  // Switch tabs
  await page.getByRole('button', { name: /Student Marks/i }).click();
  await page.waitForTimeout(200);
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(innerWidth);

  await page.getByRole('button', { name: /Lab Quiz Gradebook/i }).click();
  await page.waitForTimeout(200);
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(innerWidth);

  expect(consoleErrors.length).toBe(0);
});

test('Mobile Crypto Playground horizontal tab swipe works cleanly on 360px screen', async ({ page }) => {
  await page.addInitScript(() => {
    window.localStorage.setItem(
      'cns-auth-session',
      JSON.stringify({
        state: {
          role: 'student',
          student: {
            name: 'Dev Shah',
            rollNo: '21BCP042',
            batch: 'Batch A1',
            department: 'Thakur College of Engineering & Technology (CMPN)',
          },
          teacher: null,
          isAuthenticated: true,
        },
        version: 0,
      })
    );
  });

  await page.goto('/modules/crypto', { waitUntil: 'networkidle' });

  // Open Try tab in module shell
  await page.locator('button', { hasText: '02 Try' }).click();
  await page.waitForTimeout(200);

  // Click tabs that used to wrap into 4 stacked rows
  const playfairTab = page.locator('button:has-text("Playfair")').first();
  await playfairTab.click();
  await page.waitForTimeout(200);

  const rsaTab = page.locator('button:has-text("RSA")').first();
  await rsaTab.click();
  await page.waitForTimeout(200);

  const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
  const innerWidth = await page.evaluate(() => window.innerWidth);
  expect(scrollWidth).toBeLessThanOrEqual(innerWidth);
});
