export type QuestionType =
  | 'mcq'
  | 'multi'
  | 'numeric'
  | 'order'
  | 'match'
  | 'label'
  | 'spot'
  | 'fill'
  | 'tf-why'

export type BloomLevel = 'L1' | 'L2' | 'L3' | 'L4'
export type ModuleCode = 'M1' | 'M2' | 'M3' | 'M4' | 'M5' | 'M6'

export interface BaseQuestion {
  id: string
  module: ModuleCode
  topicId: string
  tags: string[]
  bloom: BloomLevel
  difficulty: 1 | 2 | 3
  marks: number
  timeSec: number
  prompt: string
  explanation: string // Why right + why distractors wrong
  figureSceneId?: string
  replayStep?: number // Step index in scene to jump to on "Show me"
  status?: 'ready' | 'soon'
}

export interface McqQuestion extends BaseQuestion {
  type: 'mcq'
  options: string[]
  answerIndex: number
}

export interface MultiQuestion extends BaseQuestion {
  type: 'multi'
  options: string[]
  answerIndexes: number[]
}

export interface NumericQuestion extends BaseQuestion {
  type: 'numeric'
  given: Record<string, number | string>
  answer: number | string
  tolerance?: number
  unit?: string
  steps: string[] // Detailed step-by-step worked derivation
  generator?: () => NumericQuestion
}

export interface OrderQuestion extends BaseQuestion {
  type: 'order'
  items: string[] // List of items in initial shuffled or display order
  correctOrder: number[] // Indices mapping correctly: e.g. [2, 0, 1] means items[2] is first
}

export interface MatchQuestion extends BaseQuestion {
  type: 'match'
  pairs: [string, string][] // e.g. [["Caesar", "Shift key 0-25"], ["Playfair", "5x5 Digraph matrix"]]
}

export interface LabelHotspot {
  id: string
  x: number // percentage 0-100
  y: number // percentage 0-100
  expected: string
}

export interface LabelQuestion extends BaseQuestion {
  type: 'label'
  diagramType: 'symmetric-cipher' | 'feistel' | 'pki-chain' | 'buffer-stack' | 'packet-header'
  hotspots: LabelHotspot[]
  labels: string[]
}

export interface SpotQuestion extends BaseQuestion {
  type: 'spot'
  sceneSnippetId: string
  options: string[]
  answerIndex: number
}

export interface FillQuestion extends BaseQuestion {
  type: 'fill'
  template: string // e.g. "In Caesar cipher with key k=3, letter 'H' encrypts to {{b1}} and 'Z' to {{b2}}."
  blanks: string[] // expected answers e.g. ["K", "C"]
}

export interface TfWhyQuestion extends BaseQuestion {
  type: 'tf-why'
  statement: string
  isTrue: boolean
  whyOptions: string[]
  whyIndex: number
}

export type Question =
  | McqQuestion
  | MultiQuestion
  | NumericQuestion
  | OrderQuestion
  | MatchQuestion
  | LabelQuestion
  | SpotQuestion
  | FillQuestion
  | TfWhyQuestion

export type QuizModeId =
  | 'exam-challenge'
  | 'classroom'
  | 'numerical-lab'
  | 'diagram-quiz'
  | 'self-test'

export interface QuizModeInfo {
  id: QuizModeId
  title: string
  subtitle: string
  description: string
  audience: string
  features: string[]
}

export interface TeamScore {
  id: string
  name: string
  score: number
  answersGiven: number
}

export interface QuestionAnswerRecord {
  question: Question
  userResponse: unknown
  isCorrect: boolean
  timeSpentSec: number
}

export interface QuizSessionSummary {
  mode: QuizModeId
  timestamp: number
  durationSec: number
  totalQuestions: number
  totalMarks: number
  earnedMarks: number
  accuracyRate: number
  moduleAccuracy: Record<ModuleCode, { total: number; correct: number; rate: number }>
  bloomAccuracy: Record<BloomLevel, { total: number; correct: number; rate: number }>
  typeAccuracy: Record<string, { total: number; correct: number; rate: number }>
  records: QuestionAnswerRecord[]
}
