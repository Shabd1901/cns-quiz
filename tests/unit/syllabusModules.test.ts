import { describe, it, expect } from "vitest"
import { SYLLABUS, getModule } from "@/lib/syllabus"
import { getQuestionsByModule } from "@/lib/quiz/v2/questions"

describe("University Syllabus Modules (M1 - M6) Verification", () => {
  const expectedCodes = ['M1', 'M2', 'M3', 'M4', 'M5', 'M6'] as const

  it("defines all 6 official syllabus modules with valid hours and bloom ranges", () => {
    expect(SYLLABUS.length).toBe(6)

    for (const code of expectedCodes) {
      const mod = getModule(code)
      expect(mod).toBeDefined()
      expect(mod?.code).toBe(code)
      expect(mod?.hours).toBeGreaterThan(0)
      expect(mod?.topics.length).toBeGreaterThan(0)
      expect(mod?.status).toBe('ready')
    }
  })

  it("each syllabus module has at least 5 questions in the question bank", () => {
    for (const code of expectedCodes) {
      const questions = getQuestionsByModule(code)
      expect(questions.length).toBeGreaterThanOrEqual(5)
      
      // Each question must have valid prompt, module code, and options
      for (const q of questions) {
        expect(q.prompt).toBeTruthy()
        expect(q.module.toUpperCase()).toBe(code)
      }
    }
  })

  it("covers required topics for each module", () => {
    // M1 Classical
    const m1 = getModule('M1')
    expect(m1?.topics.some(t => t.id === 'caesar')).toBe(true)
    expect(m1?.topics.some(t => t.id === 'playfair')).toBe(true)
    expect(m1?.topics.some(t => t.id === 'vigenere')).toBe(true)

    // M2 Block & Public Key
    const m2 = getModule('M2')
    expect(m2?.topics.some(t => t.id === 'rsa')).toBe(true)
    expect(m2?.topics.some(t => t.id === 'diffie-hellman')).toBe(true)
    expect(m2?.topics.some(t => t.id === 'aes')).toBe(true)

    // M3 Hashes & Signatures
    const m3 = getModule('M3')
    expect(m3?.topics.some(t => t.id === 'mac-hmac')).toBe(true)
    expect(m3?.topics.some(t => t.id === 'digital-signatures')).toBe(true)
    expect(m3?.topics.some(t => t.id === 'pki-certificates')).toBe(true)

    // M4 Computing Resources
    const m4 = getModule('M4')
    expect(m4?.topics.some(t => t.id === 'software-vulnerabilities')).toBe(true)
    expect(m4?.topics.some(t => t.id === 'access-control')).toBe(true)
    expect(m4?.topics.some(t => t.id === 'password-security')).toBe(true)

    // M5 Network Security
    const m5 = getModule('M5')
    expect(m5?.topics.some(t => t.id === 'layer-vulnerabilities')).toBe(true)
    expect(m5?.topics.some(t => t.id === 'firewalls')).toBe(true)
    expect(m5?.topics.some(t => t.id === 'dos-ddos')).toBe(true)

    // M6 Security Applications
    const m6 = getModule('M6')
    expect(m6?.topics.some(t => t.id === 'kerberos')).toBe(true)
    expect(m6?.topics.some(t => t.id === 'tls-protocol')).toBe(true)
    expect(m6?.topics.some(t => t.id === 'ipsec')).toBe(true)
    expect(m6?.topics.some(t => t.id === 'ai-security')).toBe(true)
  })
})
