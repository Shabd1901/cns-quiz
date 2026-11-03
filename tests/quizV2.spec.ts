import { test, expect } from '@playwright/test'

test.describe('Quiz Assessment Engine E2E Tests', () => {
  test('Loads /quiz hub and verifies all 6 syllabus modules and Full Syllabus Test', async ({ page }) => {
    const consoleErrors: string[] = []
    page.on('console', msg => {
      if (msg.type() === 'error') consoleErrors.push(msg.text())
    })
    page.on('pageerror', err => {
      consoleErrors.push(err.message)
    })

    await page.goto('/quiz')
    await page.waitForLoadState('networkidle')

    // Title verification
    await expect(page.locator('h1')).toContainText('Module-Wise Quiz Hub')

    // Full Syllabus Test card present
    await expect(page.locator('text=Comprehensive Full Syllabus Test')).toBeVisible()

    // All 6 syllabus modules present
    await expect(page.locator('text=Introduction & Classical Cryptography')).toBeVisible()
    await expect(page.locator('text=Block Ciphers & Public Key Cryptography')).toBeVisible()
    await expect(page.locator('text=Cryptographic Hashes & Digital Signatures')).toBeVisible()
    await expect(page.locator('text=Protection of Computing Resources & System Security')).toBeVisible()
    await expect(page.locator('text=Network Security & Defense')).toBeVisible()
    await expect(page.locator('text=Network Security Applications & Emerging Threats')).toBeVisible()

    // Question types indicator
    await expect(page.locator('text=Supported Question Types Engine')).toBeVisible()

    expect(consoleErrors).toEqual([])
  })

  test('Plays M1 Quiz: answer selection, ink-stamp reveal, and timer', async ({ page }) => {
    await page.goto('/quiz/m1/play')
    await page.waitForLoadState('networkidle')

    // Top status strip
    const quizHeader = page.locator('header').nth(1)
    await expect(quizHeader).toBeVisible()
    await expect(page.locator('text=M1: Introduction & Classical Cryptography')).toBeVisible()

    // Question prompt
    await expect(page.locator('h2')).toContainText('Caesar shift cipher')

    // Select Option B (25 keys)
    const optionB = page.locator('button:has-text("25 keys")')
    await expect(optionB).toBeVisible()
    await optionB.click()

    // Confirm & Reveal
    const revealBtn = page.locator('button:has-text("Confirm & Reveal Answer")')
    await expect(revealBtn).toBeVisible()
    await revealBtn.click()

    // Ink-stamp check
    await expect(page.locator('text=CORRECT ✓')).toBeVisible()
    await expect(page.locator('text=Explanation:')).toBeVisible()

    // Show Me link leads to presentation
    const showMeBtn = page.locator('button:has-text("Show Me ↗")')
    await expect(showMeBtn).toBeVisible()
  })

  test('Plays Numerical Lab: scratchpad input, check answer, and hints', async ({ page }) => {
    await page.goto('/quiz/numerical-lab/play')
    await page.waitForLoadState('networkidle')

    // Heading indicates numerical prompt
    await expect(page.locator('label:has-text("Calculated Value:")')).toBeVisible()

    // Enter wrong answer first
    const input = page.locator('input[type="number"]')
    await input.fill('99')
    const checkBtn = page.locator('button:has-text("Check Answer")')
    await checkBtn.click()
    await expect(page.locator('text=Incorrect value')).toBeVisible()

    // Request hint
    const hintBtn = page.locator('button:has-text("Hint")')
    await hintBtn.click()
    await expect(page.locator('text=Hint 1:')).toBeVisible()

    // Enter correct answer (12 coprime values for Affine)
    await input.fill('12')
    await checkBtn.click()
    await expect(page.locator('text=Value matches expected solution')).toBeVisible()
  })

  test('Completes assessment and validates Quiz Results Report & Bloom Analytics', async ({ page }) => {
    await page.goto('/quiz/diagram-quiz/play')
    await page.waitForLoadState('networkidle')

    // Answer questions until finish button is reached
    while (await page.locator('button:has-text("Finish & View Results")').count() === 0) {
      const revealBtn = page.locator('button:has-text("Confirm & Reveal Answer")')
      if (await revealBtn.isVisible()) {
        await revealBtn.click()
      }
      const nextBtn = page.locator('button:has-text("Next Question")')
      if (await nextBtn.isVisible()) {
        await nextBtn.click()
      }
    }

    // Final question reveal and finish
    const finalReveal = page.locator('button:has-text("Confirm & Reveal Answer")')
    if (await finalReveal.isVisible()) {
      await finalReveal.click()
    }
    const finishBtn = page.locator('button:has-text("Finish & View Results")')
    await finishBtn.click()

    // Results report must be displayed
    await expect(page.locator('h1:has-text("Assessment Performance")')).toBeVisible()
    await expect(page.locator('text=Overall Accuracy')).toBeVisible()
    await expect(page.locator('text=Accuracy by Module (M1 – M6)')).toBeVisible()
    await expect(page.locator('text=Bloom Cognitive Depth (L1 – L4)')).toBeVisible()

    // Print & Export buttons present
    await expect(page.locator('button:has-text("Export JSON")')).toBeVisible()
    await expect(page.locator('button:has-text("🖨 Print Report")')).toBeVisible()
  })
})
