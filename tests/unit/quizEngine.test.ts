import { describe, it, expect } from "vitest"
import { m1Questions, generateAffineVariation } from "@/lib/quiz/v2/questions/m1"
import { getQuestionsByModule } from "@/lib/quiz/v2/questions"
import { generateFullSyllabusMockTest, filterQuestions } from "@/lib/quiz/v2/mockTest"
import { McqQuestion, NumericQuestion, OrderQuestion, MatchQuestion } from "@/lib/quiz/v2/types"

describe("Quiz v2 Engine & M1 Questions Unit Tests", () => {
  it("includes all 9 required question types in M1", () => {
    const typesPresent = new Set(m1Questions.map(q => q.type))
    const expectedTypes = ['mcq', 'multi', 'numeric', 'order', 'match', 'label', 'spot', 'fill', 'tf-why']

    expectedTypes.forEach(t => {
      expect(typesPresent.has(t as McqQuestion['type'])).toBe(true)
    })
  })

  it("verifies Caesar keyspace MCQ question has valid answer", () => {
    const mcq = m1Questions.find(q => q.id === 'm1-mcq-caesar-keyspace') as McqQuestion
    expect(mcq).toBeDefined()
    expect(mcq.answerIndex).toBe(1)
    expect(mcq.options[mcq.answerIndex]).toContain("25 keys")
  })

  it("verifies Affine numeric question generator produces valid questions", () => {
    const numQ = m1Questions.find(q => q.id === 'm1-num-affine-coprime') as NumericQuestion
    expect(numQ).toBeDefined()
    expect(numQ.answer).toBe(12)

    const generated = generateAffineVariation()
    expect(generated.type).toBe('numeric')
    expect(typeof generated.answer).toBe('number')
    expect(generated.answer).toBeGreaterThan(0)
  })

  it("verifies Playfair ordering question has correct sequence", () => {
    const orderQ = m1Questions.find(q => q.id === 'm1-order-playfair-steps') as OrderQuestion
    expect(orderQ).toBeDefined()
    expect(orderQ.items.length).toBe(4)
    expect(orderQ.correctOrder).toEqual([0, 1, 2, 3])
  })

  it("verifies Match question has valid pairs", () => {
    const matchQ = m1Questions.find(q => q.id === 'm1-match-ciphers-keys') as MatchQuestion
    expect(matchQ).toBeDefined()
    expect(matchQ.pairs.length).toBe(4)
    expect(matchQ.pairs[0][0]).toBe("Caesar Cipher")
  })

  it("verifies syllabus question bank satisfies university requirements (>=25 per module, >=150 total)", () => {
    const modules = ['M1', 'M2', 'M3', 'M4', 'M5', 'M6'] as const
    const maxBloom: Record<string, string[]> = {
      M1: ['L1', 'L2', 'L3'],
      M2: ['L1', 'L2', 'L3'],
      M3: ['L1', 'L2', 'L3', 'L4'],
      M4: ['L1', 'L2', 'L3'],
      M5: ['L1', 'L2', 'L3', 'L4'],
      M6: ['L1', 'L2', 'L3', 'L4']
    }

    let total = 0
    modules.forEach(m => {
      const qList = getQuestionsByModule(m)
      expect(qList.length, `${m} should have at least 25 questions`).toBeGreaterThanOrEqual(25)
      total += qList.length

      qList.forEach(q => {
        expect(q.prompt, `${q.id} missing prompt`).toBeTruthy()
        expect(q.explanation, `${q.id} missing explanation`).toBeTruthy()
        expect(maxBloom[m], `${q.id} Bloom level ${q.bloom} exceeds module ${m} max`).toContain(q.bloom)
      })
    })

    expect(total, "Total quiz bank questions should be at least 150").toBeGreaterThanOrEqual(150)
  })

  it("verifies 45-question full syllabus mock test matches exact syllabus hours (5/8/7/8/10/7)", () => {
    const mockTest = generateFullSyllabusMockTest()
    expect(mockTest.length).toBe(45)

    const counts: Record<string, number> = { M1: 0, M2: 0, M3: 0, M4: 0, M5: 0, M6: 0 }
    mockTest.forEach(q => {
      counts[q.module] = (counts[q.module] || 0) + 1
    })

    expect(counts['M1']).toBe(5)
    expect(counts['M2']).toBe(8)
    expect(counts['M3']).toBe(7)
    expect(counts['M4']).toBe(8)
    expect(counts['M5']).toBe(10)
    expect(counts['M6']).toBe(7)
  })

  it("verifies question filter filters correctly by module, bloom, and difficulty", () => {
    const m2L3Only = filterQuestions({ module: 'M2', bloom: 'L3' })
    expect(m2L3Only.length).toBeGreaterThan(0)
    m2L3Only.forEach(q => {
      expect(q.module).toBe('M2')
      expect(q.bloom).toBe('L3')
    })

    const diff1Only = filterQuestions({ difficulty: 1 })
    expect(diff1Only.length).toBeGreaterThan(0)
    diff1Only.forEach(q => {
      expect(q.difficulty).toBe(1)
    })
  })
})
