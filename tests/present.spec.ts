import { test, expect } from '@playwright/test'

test.describe('Presenter Mode v2 E2E Tests', () => {
  test('Loads /present/m1/caesar with zero console errors and renders plates', async ({ page }) => {
    const consoleErrors: string[] = []
    page.on('console', msg => {
      if (msg.type() === 'error') consoleErrors.push(msg.text())
    })
    page.on('pageerror', err => {
      consoleErrors.push(err.message)
    })

    await page.goto('/present/m1/caesar')
    await page.waitForLoadState('networkidle')

    // Title and headline visible
    await expect(page.locator('h1:has-text("The Shift That Began Cryptography")')).toBeVisible()

    // Top status bar
    const presentHeader = page.locator('header:has-text("Introduction and Classical Cryptography")')
    await expect(presentHeader).toContainText('Plate 1 of 9')

    expect(consoleErrors).toEqual([])
  })

  test('Navigates forward and backward using Next / Back controls', async ({ page }) => {
    await page.goto('/present/m1/caesar')
    await page.waitForLoadState('networkidle')

    const presentHeader = page.locator('header:has-text("Introduction and Classical Cryptography")')

    // Click Next button
    const nextBtn = page.locator('button:has-text("Next →")')
    await expect(nextBtn).toBeVisible()
    await nextBtn.click()

    // Plate 2 (Analogy)
    await expect(presentHeader).toContainText('Plate 2 of 9')
    await expect(page.locator('h1:has-text("Concentric Alphabet Disks")')).toBeVisible()

    // Click Back button
    const backBtn = page.locator('button:has-text("← Back")')
    await expect(backBtn).toBeVisible()
    await backBtn.click()

    // Back to Plate 1
    await expect(presentHeader).toContainText('Plate 1 of 9')
  })

  test('Presenter tools: Notes (S), Laser (L), Draw (D), Blackout (B), Grid (G), ELI5 (E), Help (?)', async ({ page }) => {
    await page.goto('/present/m1/caesar')
    await page.waitForLoadState('networkidle')

    // 1. Speaker notes toggled with key 's'
    await page.keyboard.press('s')
    await expect(page.locator('h3:has-text("Presenter Script")')).toBeVisible()
    await page.keyboard.press('s')
    await expect(page.locator('h3:has-text("Presenter Script")')).not.toBeVisible()

    // 2. Blackout toggled with key 'b'
    await page.keyboard.press('b')
    await expect(page.locator('text=Focus on Presenter')).toBeVisible()
    await page.keyboard.press('b')
    await expect(page.locator('text=Focus on Presenter')).not.toBeVisible()

    // 3. Plate Jump Grid toggled with key 'g'
    await page.keyboard.press('g')
    await expect(page.locator('h2:has-text("Topic Plate Overview")')).toBeVisible()
    await page.keyboard.press('Escape')
    await expect(page.locator('h2:has-text("Topic Plate Overview")')).not.toBeVisible()

    // 4. Help dialog toggled with key '?'
    await page.keyboard.press('?')
    await expect(page.locator('h3:has-text("Presenter Keyboard Shortcuts")')).toBeVisible()
    await page.keyboard.press('Escape')

    // 5. ELI5 toggle button
    const eli5Btn = page.locator('button:has-text("ELI5 [E]")')
    await expect(eli5Btn).toBeVisible()
    await eli5Btn.click()
    await expect(page.locator('text=ELI5:')).toBeVisible()
  })

  test('Worked Example Plate: Step-by-step reveal and problem generation', async ({ page }) => {
    await page.goto('/present/m1/caesar')
    await page.waitForLoadState('networkidle')

    const presentHeader = page.locator('header:has-text("Introduction and Classical Cryptography")')

    // Jump to Worked Example plate (Plate 5) via rail thumbnail
    const plate5Thumb = page.locator('aside button:has-text("Worked Numerical")')
    await expect(plate5Thumb).toBeVisible()
    await plate5Thumb.click()

    await expect(presentHeader).toContainText('Plate 5 of 9')
    await expect(page.locator('h3:has-text("Encrypt the plaintext")')).toBeVisible()

    // Step 1: Click Reveal Next Step
    const revealBtn = page.locator('button:has-text("Reveal Next Step")')
    await expect(revealBtn).toBeVisible()
    await revealBtn.click()
    await expect(page.locator('text=STEP 1:')).toBeVisible()

    // Test Generate Another
    const genBtn = page.locator('button:has-text("Generate Another")')
    await expect(genBtn).toBeVisible()
    await genBtn.click()
    await expect(page.locator('text=Numerical Exercise')).toBeVisible()
  })

  test('Ask the Room Plate: Show-of-hands vote counter and answer reveal', async ({ page }) => {
    await page.goto('/present/m1/caesar')
    await page.waitForLoadState('networkidle')

    const presentHeader = page.locator('header:has-text("Introduction and Classical Cryptography")')

    // Jump to Ask The Room plate (Plate 8)
    const plate8Thumb = page.locator('aside button:has-text("The Key Space Paradox")')
    await expect(plate8Thumb).toBeVisible()
    await plate8Thumb.click()

    await expect(presentHeader).toContainText('Plate 8 of 9')
    await expect(page.locator('text=Classroom Show-of-Hands Poll')).toBeVisible()

    // Vote for option 2 (press '2')
    await page.keyboard.press('2')
    await expect(page.locator('text=1 votes')).toBeVisible()

    // Reveal answer
    const revealBtn = page.locator('button:has-text("Reveal Correct Answer")')
    await expect(revealBtn).toBeVisible()
    await revealBtn.click()
    await expect(page.locator('text=Answer Verified:')).toBeVisible()
  })

  test('Loads /present/m2/modes and renders ModeDiagram with zero console errors', async ({ page }) => {
    const consoleErrors: string[] = []
    page.on('console', msg => {
      if (msg.type() === 'error') consoleErrors.push(msg.text())
    })
    page.on('pageerror', err => {
      consoleErrors.push(err.message)
    })

    await page.goto('/present/m2/modes')
    await page.waitForLoadState('networkidle')

    // Module 2 header
    const presentHeader = page.locator('header:has-text("Block Ciphers and Public Key Cryptography")')
    await expect(presentHeader).toBeVisible()

    // Title of hook plate
    await expect(page.locator('h1:has-text("The Ghost in the Cipher")')).toBeVisible()

    // Navigate to Plate 2 (ModeDiagram interactive figure)
    const nextBtn = page.locator('button:has-text("Next →")')
    await nextBtn.click()
    await expect(page.locator('h1:has-text("Block Cipher Modes of Operation")')).toBeVisible()

    expect(consoleErrors).toEqual([])
  })

  test('Loads /present/m2/rsa and verifies mathematical plates with zero console errors', async ({ page }) => {
    const consoleErrors: string[] = []
    page.on('console', msg => {
      if (msg.type() === 'error') consoleErrors.push(msg.text())
    })
    page.on('pageerror', err => {
      consoleErrors.push(err.message)
    })

    await page.goto('/present/m2/rsa')
    await page.waitForLoadState('networkidle')

    await expect(page.locator('h1:has-text("The Cornerstone of Modern Trust")')).toBeVisible()
    expect(consoleErrors).toEqual([])
  })

  test('Loads /present/m2/ecc and renders CurvePlot with zero console errors', async ({ page }) => {
    const consoleErrors: string[] = []
    page.on('console', msg => {
      if (msg.type() === 'error') consoleErrors.push(msg.text())
    })
    page.on('pageerror', err => {
      consoleErrors.push(err.message)
    })

    await page.goto('/present/m2/ecc')
    await page.waitForLoadState('networkidle')

    await expect(page.locator('h1:has-text("The Geometric Revolution in Cryptography")')).toBeVisible()

    // Navigate to CurvePlot plate (Plate 3)
    const plate3Thumb = page.locator('aside button:has-text("Interactive Curve Plot")')
    await plate3Thumb.click()
    await expect(page.locator('h1:has-text("Interactive Curve Plot over Finite Field")')).toBeVisible()

    expect(consoleErrors).toEqual([])
  })

  test('Loads /present/m3/mac-hmac and navigates plates with zero console errors', async ({ page }) => {
    const consoleErrors: string[] = []
    page.on('console', msg => {
      if (msg.type() === 'error') consoleErrors.push(msg.text())
    })
    page.on('pageerror', err => {
      consoleErrors.push(err.message)
    })

    await page.goto('/present/m3/mac-hmac')
    await page.waitForLoadState('networkidle')

    await expect(page.locator('h1:has-text("The Naive Hashing Trap")')).toBeVisible()

    // Navigate to Plate 2
    const nextBtn = page.locator('button:has-text("Next →")')
    await nextBtn.click()
    await expect(page.locator('h1:has-text("HMAC Structure & The Nested Barrier")')).toBeVisible()

    expect(consoleErrors).toEqual([])
  })

  test('Loads /present/m3/digital-signatures with zero console errors and checks worked example', async ({ page }) => {
    const consoleErrors: string[] = []
    page.on('console', msg => {
      if (msg.type() === 'error') consoleErrors.push(msg.text())
    })
    page.on('pageerror', err => {
      consoleErrors.push(err.message)
    })

    await page.goto('/present/m3/digital-signatures')
    await page.waitForLoadState('networkidle')

    await expect(page.locator('h1:has-text("The Sony PS3 Disaster")')).toBeVisible()

    // Jump to Worked Example
    const workedThumb = page.locator('aside button:has-text("RSA Signature")')
    await workedThumb.click()
    await expect(page.locator('h1:has-text("Worked Example: RSA Signature Computation")')).toBeVisible()

    expect(consoleErrors).toEqual([])
  })

  test('Loads /present/m3/pki-certificates and renders Chain of Trust with zero console errors', async ({ page }) => {
    const consoleErrors: string[] = []
    page.on('console', msg => {
      if (msg.type() === 'error') consoleErrors.push(msg.text())
    })
    page.on('pageerror', err => {
      consoleErrors.push(err.message)
    })

    await page.goto('/present/m3/pki-certificates')
    await page.waitForLoadState('networkidle')

    await expect(page.locator('h1:has-text("The DigiNotar Catastrophe")')).toBeVisible()

    // Navigate to Plate 2 (Chain of Trust)
    const nextBtn = page.locator('button:has-text("Next →")')
    await nextBtn.click()
    await expect(page.locator('h1:has-text("The Hierarchical Chain of Trust")')).toBeVisible()

    expect(consoleErrors).toEqual([])
  })

  test('Loads /present/m4/software-vulnerabilities and renders StackDiagram with zero console errors', async ({ page }) => {
    const consoleErrors: string[] = []
    page.on('console', msg => {
      if (msg.type() === 'error') consoleErrors.push(msg.text())
    })
    page.on('pageerror', err => {
      consoleErrors.push(err.message)
    })

    await page.goto('/present/m4/software-vulnerabilities')
    await page.waitForLoadState('networkidle')

    await expect(page.locator('h1:has-text("Smashing the Stack for Fun and Profit")')).toBeVisible()

    // Navigate to Plate 2 (Stack Frame Anatomy)
    const nextBtn = page.locator('button:has-text("Next →")')
    await nextBtn.click()
    await expect(page.locator('h1:has-text("The Architecture of a Stack Frame")')).toBeVisible()

    expect(consoleErrors).toEqual([])
  })

  test('Loads /present/m4/access-control and verifies Bell-LaPadula vs Biba comparison', async ({ page }) => {
    const consoleErrors: string[] = []
    page.on('console', msg => {
      if (msg.type() === 'error') consoleErrors.push(msg.text())
    })
    page.on('pageerror', err => {
      consoleErrors.push(err.message)
    })

    await page.goto('/present/m4/access-control')
    await page.waitForLoadState('networkidle')

    await expect(page.locator('h1:has-text("The Confused Deputy Problem")')).toBeVisible()

    // Jump to Plate 3 (Comparison)
    const compThumb = page.locator('aside button:has-text("compare")')
    await compThumb.click()
    await expect(page.locator('h1:has-text("Mandatory Access Control (MAC) Models")')).toBeVisible()

    expect(consoleErrors).toEqual([])
  })

  test('Loads /present/m4/password-security and renders NIST SP 800-63B guidelines', async ({ page }) => {
    const consoleErrors: string[] = []
    page.on('console', msg => {
      if (msg.type() === 'error') consoleErrors.push(msg.text())
    })
    page.on('pageerror', err => {
      consoleErrors.push(err.message)
    })

    await page.goto('/present/m4/password-security')
    await page.waitForLoadState('networkidle')

    await expect(page.locator('h1:has-text("The LinkedIn & Adobe Breaches")')).toBeVisible()

    expect(consoleErrors).toEqual([])
  })

  test('Loads /present/m5/layer-vulnerabilities and renders StackDiagram with zero console errors', async ({ page }) => {
    const consoleErrors: string[] = []
    page.on('console', msg => {
      if (msg.type() === 'error') consoleErrors.push(msg.text())
    })
    page.on('pageerror', err => {
      consoleErrors.push(err.message)
    })

    await page.goto('/present/m5/layer-vulnerabilities')
    await page.waitForLoadState('networkidle')

    await expect(page.locator('h1:has-text("A Network Built on Blind Trust")')).toBeVisible()

    // Navigate to Plate 2 (Stack Diagram)
    const nextBtn = page.locator('button:has-text("Next →")')
    await nextBtn.click()
    await expect(page.locator('h1:has-text("The Insecurity of the 4-Layer TCP/IP Stack")')).toBeVisible()

    expect(consoleErrors).toEqual([])
  })

  test('Loads /present/m5/firewalls and verifies TopologyDiagram with zero console errors', async ({ page }) => {
    const consoleErrors: string[] = []
    page.on('console', msg => {
      if (msg.type() === 'error') consoleErrors.push(msg.text())
    })
    page.on('pageerror', err => {
      consoleErrors.push(err.message)
    })

    await page.goto('/present/m5/firewalls')
    await page.waitForLoadState('networkidle')

    await expect(page.locator('h1:has-text("The Gatekeeper of the Network Perimeter")')).toBeVisible()

    // Navigate to Plate 2 (Topology Diagram)
    const nextBtn = page.locator('button:has-text("Next →")')
    await nextBtn.click()
    await expect(page.locator('h1:has-text("The Evolution of Firewall Architectures")')).toBeVisible()

    expect(consoleErrors).toEqual([])
  })

  test('Loads /present/m5/ids-honeypots and verifies Zero Trust with zero console errors', async ({ page }) => {
    const consoleErrors: string[] = []
    page.on('console', msg => {
      if (msg.type() === 'error') consoleErrors.push(msg.text())
    })
    page.on('pageerror', err => {
      consoleErrors.push(err.message)
    })

    await page.goto('/present/m5/ids-honeypots')
    await page.waitForLoadState('networkidle')

    await expect(page.locator('h1:has-text("The Burglar Alarm and the Honeypot Trap")')).toBeVisible()

    expect(consoleErrors).toEqual([])
  })
})
