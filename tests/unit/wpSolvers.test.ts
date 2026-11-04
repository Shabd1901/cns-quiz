import { describe, it, expect } from "vitest"
import { WP_SYLLABUS, getWPModule } from "@/lib/syllabus/wpSyllabus"
import { ACADEMIC_SUBJECTS, useAcademicStore } from "@/lib/academicStore"
import { WP_CHEAT_SHEETS } from "@/modules/wp/WPCheatSheet"
import { getPresentation } from "@/lib/present/plates"

describe("Web Programming (ITC504) Multi-Subject LMS Verification", () => {
  const expectedWPModuleIds = ['wp-m1', 'wp-m2', 'wp-m3', 'wp-m4', 'wp-m5', 'wp-m6'] as const
  const expectedSlugs = [
    'wp-fundamentals',
    'wp-javascript',
    'wp-react',
    'wp-nodejs',
    'wp-php',
    'wp-fullstack'
  ] as const

  it("defines all 6 accredited Web Programming modules with valid hours totaling 45h", () => {
    expect(WP_SYLLABUS.length).toBe(6)

    let totalHours = 0
    for (const mod of WP_SYLLABUS) {
      expect(mod.id).toBeTruthy()
      expect(mod.title).toBeTruthy()
      expect(mod.hours).toBeGreaterThan(0)
      expect(mod.topics.length).toBeGreaterThan(0)
      expect(mod.status).toBe('ready')
      totalHours += mod.hours
    }

    // Accredited Mumbai University / TCET autonomous scheme: exactly 45 teaching hours
    expect(totalHours).toBe(45)
  })

  it("resolves all modules by ID, slug, and code via getWPModule", () => {
    for (let i = 0; i < expectedWPModuleIds.length; i++) {
      const id = expectedWPModuleIds[i]
      const slug = expectedSlugs[i]

      const byId = getWPModule(id)
      const bySlug = getWPModule(slug)
      const byCode = getWPModule(`wp-m${i + 1}`)

      expect(byId).toBeDefined()
      expect(bySlug).toBeDefined()
      expect(byCode).toBeDefined()
      expect(byId?.id).toBe(id)
      expect(bySlug?.id).toBe(id)
    }
  })

  it("covers required topics in each module", () => {
    // M1: Fundamentals
    const m1 = getWPModule('wp-m1')
    expect(m1?.topics.some(t => t.id === 'web-arch-http')).toBe(true)
    expect(m1?.topics.some(t => t.id === 'css-box-model-selectors')).toBe(true)
    expect(m1?.topics.some(t => t.id === 'css-flexbox-grid')).toBe(true)

    // M2: JavaScript & Event Loop
    const m2 = getWPModule('wp-m2')
    expect(m2?.topics.some(t => t.id === 'js-core-scoping')).toBe(true)
    expect(m2?.topics.some(t => t.id === 'dom-event-delegation')).toBe(true)
    expect(m2?.topics.some(t => t.id === 'async-event-loop')).toBe(true)

    // M3: React & Next.js
    const m3 = getWPModule('wp-m3')
    expect(m3?.topics.some(t => t.id === 'react-components-jsx')).toBe(true)
    expect(m3?.topics.some(t => t.id === 'react-hooks-state')).toBe(true)
    expect(m3?.topics.some(t => t.id === 'nextjs-architecture')).toBe(true)

    // M4: Node.js & Express
    const m4 = getWPModule('wp-m4')
    expect(m4?.topics.some(t => t.id === 'nodejs-architecture')).toBe(true)
    expect(m4?.topics.some(t => t.id === 'express-middleware-pipeline')).toBe(true)
    expect(m4?.topics.some(t => t.id === 'rest-api-error-handling')).toBe(true)

    // M5: PHP & MySQL (PDO)
    const m5 = getWPModule('wp-m5')
    expect(m5?.topics.some(t => t.id === 'php-syntax-superglobals')).toBe(true)
    expect(m5?.topics.some(t => t.id === 'php-pdo-mysql-crud')).toBe(true)
    expect(m5?.topics.some(t => t.id === 'php-security-practices')).toBe(true)

    // M6: Full-Stack Architecture, JWT & OWASP
    const m6 = getWPModule('wp-m6')
    expect(m6?.topics.some(t => t.id === 'fullstack-tier-cors')).toBe(true)
    expect(m6?.topics.some(t => t.id === 'jwt-auth-state')).toBe(true)
    expect(m6?.topics.some(t => t.id === 'git-deployment-owasp')).toBe(true)
  })

  it("verifies multi-subject integration in ACADEMIC_SUBJECTS store", () => {
    expect(ACADEMIC_SUBJECTS.length).toBeGreaterThanOrEqual(2)
    const cns = ACADEMIC_SUBJECTS.find(s => s.code === 'CSC602')
    const wp = ACADEMIC_SUBJECTS.find(s => s.code === 'ITC504')

    expect(cns).toBeDefined()
    expect(wp).toBeDefined()
    expect(wp?.name).toContain("Web Programming")
    expect(wp?.credits).toBe(4)

    // Check studentMarks in academic store
    const store = useAcademicStore.getState()
    const wpMarks = store.studentMarks.filter(m => m.subjectCode === 'ITC504')
    expect(wpMarks.length).toBeGreaterThanOrEqual(3) // Dev Shah, Aarav Patel, Priya Sharma
  })

  it("verifies high-density revision cheat sheet data exists for all 6 WP modules", () => {
    for (const modId of expectedWPModuleIds) {
      const sheet = WP_CHEAT_SHEETS[modId]
      expect(sheet).toBeDefined()
      expect(sheet.coreConcepts.length).toBeGreaterThanOrEqual(3)
      expect(sheet.keyFormulas.length).toBeGreaterThanOrEqual(2)
      expect(sheet.commonTraps.length).toBeGreaterThanOrEqual(2)
    }
  })

  it("verifies presentation plates resolve for Web Programming topics", () => {
    const p1 = getPresentation('wp-m1', 'web-arch-http')
    expect(p1).toBeDefined()
    expect(p1?.plates.length).toBeGreaterThan(0)

    const p2 = getPresentation('wp-m2', 'js-core-scoping')
    expect(p2).toBeDefined()
    expect(p2?.plates.length).toBeGreaterThan(0)

    const p3 = getPresentation('wp-m3', 'react-components-jsx')
    expect(p3).toBeDefined()
    expect(p3?.plates.length).toBeGreaterThan(0)

    const p4 = getPresentation('wp-m4', 'nodejs-architecture')
    expect(p4).toBeDefined()
    expect(p4?.plates.length).toBeGreaterThan(0)

    const p5 = getPresentation('wp-m5', 'php-syntax-superglobals')
    expect(p5).toBeDefined()
    expect(p5?.plates.length).toBeGreaterThan(0)

    const p6 = getPresentation('wp-m6', 'fullstack-tier-cors')
    expect(p6).toBeDefined()
    expect(p6?.plates.length).toBeGreaterThan(0)
  })
})
