import { Question, ModuleCode, BloomLevel } from "./types"
import { allQuestions, getQuestionsByModule } from "./questions"

export interface MockTestFilterOptions {
  module?: ModuleCode | 'ALL'
  bloom?: BloomLevel | 'ALL'
  difficulty?: 1 | 2 | 3 | 'ALL'
}

/**
 * Generates a 45-question Full Syllabus Mock Test weighted strictly
 * by university syllabus hours:
 * - M1 (5 hrs): 5 questions
 * - M2 (8 hrs): 8 questions
 * - M3 (7 hrs): 7 questions
 * - M4 (8 hrs): 8 questions
 * - M5 (10 hrs): 10 questions
 * - M6 (7 hrs): 7 questions
 * Total: 45 questions
 */
export function generateFullSyllabusMockTest(seed?: number): Question[] {
  const allocation: Record<ModuleCode, number> = {
    M1: 5,
    M2: 8,
    M3: 7,
    M4: 8,
    M5: 10,
    M6: 7
  }

  const selected: Question[] = []

  // Deterministic or pseudo-random selection based on optional seed
  let randomVal = seed !== undefined ? seed : 42
  const pseudoRandom = () => {
    randomVal = (randomVal * 9301 + 49297) % 233280
    return randomVal / 233280
  }

  ;(Object.keys(allocation) as ModuleCode[]).forEach(mod => {
    const pool = [...getQuestionsByModule(mod)]
    const count = allocation[mod]

    // Shuffle pool deterministically
    for (let i = pool.length - 1; i > 0; i--) {
      const j = Math.floor(pseudoRandom() * (i + 1))
      const temp = pool[i]
      pool[i] = pool[j]
      pool[j] = temp
    }

    selected.push(...pool.slice(0, count))
  })

  return selected
}

/**
 * Filter questions by module, Bloom taxonomy level, and difficulty.
 */
export function filterQuestions(options: MockTestFilterOptions): Question[] {
  return allQuestions.filter(q => {
    if (options.module && options.module !== 'ALL' && q.module !== options.module) {
      return false
    }
    if (options.bloom && options.bloom !== 'ALL' && q.bloom !== options.bloom) {
      return false
    }
    if (options.difficulty && options.difficulty !== 'ALL' && q.difficulty !== options.difficulty) {
      return false
    }
    return true
  })
}
