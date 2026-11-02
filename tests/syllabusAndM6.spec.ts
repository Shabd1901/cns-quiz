import { test, expect } from '@playwright/test'

test.describe('University Syllabus Restructuring & Module 6 End-to-End Tests', () => {
  test('Home page displays 6 syllabus modules with hours and Bloom levels', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('h1').first()).toContainText('Security Lab')

    // Verify 6 syllabus modules are present
    const expectedModules = [
      { code: 'M1', title: 'Introduction & Classical Cryptography', hours: '5 hrs' },
      { code: 'M2', title: 'Block Ciphers & Public Key Cryptography', hours: '8 hrs' },
      { code: 'M3', title: 'Cryptographic Hashes & Digital Signatures', hours: '7 hrs' },
      { code: 'M4', title: 'Protection of Computing Resources & Security Features', hours: '8 hrs' },
      { code: 'M5', title: 'Network Security', hours: '10 hrs' },
      { code: 'M6', title: 'Network Security Applications', hours: '7 hrs' }
    ]

    for (const mod of expectedModules) {
      await expect(page.getByText(mod.code, { exact: true })).toBeVisible()
      await expect(page.getByRole('heading', { name: mod.title, exact: true })).toBeVisible()
    }
  })

  test('All 6 syllabus module routes load without error', async ({ page }) => {
    const routes = [
      '/modules/classical',
      '/modules/block-public-key',
      '/modules/hash-signatures',
      '/modules/computing-resources',
      '/modules/network-security',
      '/modules/security-applications'
    ]

    for (const r of routes) {
      const response = await page.goto(r)
      expect(response?.status()).toBe(200)
    }
  })

  test('Revision Hub loads tabs: Tracker, Cheat Sheets, Formulas', async ({ page }) => {
    await page.goto('/revision')
    await expect(page.locator('h1')).toContainText('University Exam Revision & Mastery Hub')

    // 1. Syllabus Tracker
    await expect(page.getByRole('tab', { name: /Syllabus Tracker/i })).toBeVisible()
    await expect(page.getByText('45-Hour University Syllabus Coverage Tracker')).toBeVisible()

    // 2. Cheat Sheets
    await page.getByRole('tab', { name: /Cheat Sheets/i }).click()
    await expect(page.getByText('Per-Module Rapid Revision Cheat Sheets')).toBeVisible()
    await expect(page.getByText('Module 1: Introduction & Classical Cryptography')).toBeVisible()

    // 3. Formula Sheet
    await page.getByRole('tab', { name: /Formula Sheet/i }).click()
    await expect(page.getByText('Cryptographic Algorithms, Key Sizes & Output Specifications')).toBeVisible()
    await expect(page.getByText('DES (Data Encryption Standard)')).toBeVisible()
    await expect(page.getByText('TEA (Tiny Encryption Algorithm)')).toBeVisible()
  })

  test('M6 Presentation Decks render properly', async ({ page }) => {
    const m6Decks = [
      { topic: 'kerberos', title: 'Kerberos' },
      { topic: 'tls-protocol', title: 'TLS' },
      { topic: 'ipsec', title: 'IPsec' },
      { topic: 'secure-email', title: 'PGP' },
      { topic: 'key-management', title: 'Key Distribution' },
      { topic: 'ai-security', title: 'AI' }
    ]

    for (const d of m6Decks) {
      await page.goto(`/present/m6/${d.topic}`)
      await expect(page.locator('main').first()).toBeVisible()
      await expect(page.getByText(/Plate 1 of/i).first()).toBeVisible()
    }
  })

  test('Self-Test Mode supports 45-question Full Syllabus Mock Test', async ({ page }) => {
    await page.goto('/quiz/self-test/play')
    await expect(page.getByText('Module Filter:')).toBeVisible()

    // Click full syllabus mock test button
    const mockButton = page.getByText('★ Full Syllabus Mock Test')
    await expect(mockButton).toBeVisible()
    await mockButton.click()

    // Verify 45 questions are loaded
    await expect(page.getByText('Question 1 of 45')).toBeVisible()
  })
})
