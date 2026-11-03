import { test, expect } from '@playwright/test';

test.describe('Cryptography Module Tests', () => {
  test.beforeEach(async ({ page }) => {
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
  });

  test('Loads Cryptography module and verifies tabs', async ({ page }) => {
    await page.goto('/modules/crypto');
    await expect(page).toHaveTitle(/TCET LMS/);

    // Verify left sticky rail title
    await expect(page.locator('h1', { hasText: 'Cryptography' })).toBeVisible();

    // Verify all 5 tabs exist with new numbering
    await expect(page.locator('button', { hasText: '01 Learn' })).toBeVisible();
    await expect(page.locator('button', { hasText: '02 Try' })).toBeVisible();
    await expect(page.locator('button', { hasText: '03 Cost' })).toBeVisible();
    await expect(page.locator('button', { hasText: '04 Quiz' })).toBeVisible();
    await expect(page.locator('button', { hasText: '05 Recap' })).toBeVisible();

    // Verify Guided Lesson renders
    await expect(page.locator('h2', { hasText: 'Hashing: The One-Way Blender' })).toBeVisible();

    // Go to Try tab
    await page.locator('button', { hasText: '02 Try' }).click();
    await expect(page.locator('h3', { hasText: 'Caesar Cipher' })).toBeVisible();

    // Go to Cost tab
    await page.locator('button', { hasText: '03 Cost' }).click();
    await expect(page.locator('h3', { hasText: 'Cryptographic Complexity' })).toBeVisible();
  });

  test('Presenter Mode opens via button and keyboard shortcut', async ({ page }) => {
    await page.goto('/modules/crypto');
    
    // Click Present button
    await page.locator('button', { hasText: 'Present' }).first().click();
    
    // Verify Presenter Mode UI renders
    await expect(page.locator('h1', { hasText: 'Hashing: The One-Way Blender' }).nth(0)).toBeVisible();
    await expect(page.locator('button', { hasText: 'Exit ✕' })).toBeVisible();

    // Press Escape to close
    await page.keyboard.press('Escape');
    
    // Verify it closed
    await expect(page.locator('button', { hasText: 'Exit ✕' })).not.toBeVisible();

    // Trigger via P key
    await page.keyboard.press('P');
    await expect(page.locator('button', { hasText: 'Exit ✕' })).toBeVisible();

    // Toggle Speaker Notes
    await page.keyboard.press('s');
    await expect(page.locator('text=Speaker Notes')).toBeVisible();
    await page.keyboard.press('s');
    await expect(page.locator('text=Speaker Notes')).not.toBeVisible();
  });

  test('Interactive M3 Playground tabs: HMAC, Birthday, Signatures, and PKI', async ({ page }) => {
    await page.goto('/modules/crypto');
    await page.locator('button', { hasText: '02 Try' }).click();

    // 1. HMAC tab
    const hmacTab = page.locator('button:has-text("HMAC")');
    await expect(hmacTab).toBeVisible();
    await hmacTab.click();
    await expect(page.locator('h3:has-text("HMAC (RFC 2104)")')).toBeVisible();

    // 2. Birthday tab & collision search
    const bdayTab = page.locator('button:has-text("Birthday Attack")');
    await expect(bdayTab).toBeVisible();
    await bdayTab.click();
    await expect(page.locator('h3:has-text("Birthday Paradox & Hash Collisions")')).toBeVisible();
    const findColBtn = page.locator('button:has-text("Find Collision Now")');
    await expect(findColBtn).toBeVisible();
    await findColBtn.click();
    await expect(page.locator('text=COLLISION FOUND')).toBeVisible();

    // 3. Digital Signatures tab
    const sigTab = page.locator('button:has-text("Signatures")');
    await expect(sigTab).toBeVisible();
    await sigTab.click();
    await expect(page.locator('h3:has-text("Digital Signatures & The PS3 Exploit")')).toBeVisible();
    await expect(page.locator('text=EXPLOIT SUCCESSFUL! Master Private Key Recovered:')).toBeVisible();

    // 4. PKI & X.509 Chain tab
    const pkiTab = page.locator('button:has-text("PKI & X.509")');
    await expect(pkiTab).toBeVisible();
    await pkiTab.click();
    await expect(page.locator('h3:has-text("PKI & X.509 Chain Validator")')).toBeVisible();
    await expect(page.locator('text=CHAIN VALIDATION: TRUSTED SECURE CONNECTION')).toBeVisible();
  });
});
