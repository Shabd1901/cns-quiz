import { test, expect } from '@playwright/test'

test.describe('Module M5: Network Security & Firewall / IDS Playgrounds', () => {
  test('Firewall playground: 5-Tuple ACL, Stateful Conntrack, and SYN Cookies', async ({ page }) => {
    const consoleErrors: string[] = []
    page.on('console', msg => {
      if (msg.type() === 'error') consoleErrors.push(msg.text())
    })
    page.on('pageerror', err => {
      consoleErrors.push(err.message)
    })

    await page.goto('/modules/firewall')
    await page.waitForLoadState('networkidle')

    // Navigate to Try (02 Try) tab
    await page.locator('button', { hasText: '02 Try' }).click()

    // 1. ACL Tab
    await expect(page.locator('h3, h4, div:has-text("Access Control List")').first()).toBeVisible()
    await expect(page.locator('text=ALLOW').first()).toBeVisible()

    // 2. Stateful Conntrack Tab
    const statefulTab = page.locator('button:has-text("2. Stateful Conntrack Table")')
    await statefulTab.click()
    await expect(page.locator('text=Active Dynamic Session Table')).toBeVisible()

    // Click "1. Send Outbound SYN"
    const synBtn = page.locator('button:has-text("1. Send Outbound SYN")')
    await synBtn.click()
    await expect(page.locator('td:has-text("54321")').first()).toBeVisible()

    // Click "2. Send Inbound Return SYN-ACK"
    const returnBtn = page.locator('button:has-text("2. Send Inbound Return SYN-ACK")')
    await returnBtn.click()
    await expect(page.locator('span:has-text("ESTABLISHED")').first()).toBeVisible()

    // 3. SYN Flood & SYN Cookies Tab
    const synFloodTab = page.locator('button:has-text("3. SYN Flood & SYN Cookies")')
    await synFloodTab.click()
    await expect(page.locator('text=RFC 4987 32-Bit ISN Cookie Decomposition')).toBeVisible()
    await expect(page.locator('text=Stateless ACK Verification Succeeded')).toBeVisible()

    expect(consoleErrors).toEqual([])
  })

  test('IDS playground: Signatures, DNS Tunneling & Entropy, and Zero Trust ZTA', async ({ page }) => {
    const consoleErrors: string[] = []
    page.on('console', msg => {
      if (msg.type() === 'error') consoleErrors.push(msg.text())
    })
    page.on('pageerror', err => {
      consoleErrors.push(err.message)
    })

    await page.goto('/modules/ids')
    await page.waitForLoadState('networkidle')

    // Navigate to Try tab
    await page.locator('button', { hasText: '02 Try' }).click()

    // 1. Signature IDS Tab
    await expect(page.locator('button:has-text("Analyze Logs")')).toBeVisible()
    await page.locator('button:has-text("Analyze Logs")').click()
    await expect(page.locator('text=SQL Injection payload detected')).toBeVisible()

    // 2. DNS Tunneling & Entropy Tab
    const dnsTab = page.locator('button:has-text("2. DNS Tunneling & Entropy")')
    await dnsTab.click()
    await expect(page.locator('text=Average Shannon Entropy:')).toBeVisible()
    await expect(page.locator('text=ALERT: DNS TUNNEL DETECTED')).toBeVisible()

    // 3. Zero Trust Tab
    const ztaTab = page.locator('button:has-text("3. NIST Zero Trust Engine (ZTA)")')
    await ztaTab.click()
    await expect(page.locator('text=DECISION: GRANT')).toBeVisible()
    await expect(page.locator('text=100 / 100')).toBeVisible()

    expect(consoleErrors).toEqual([])
  })
})
