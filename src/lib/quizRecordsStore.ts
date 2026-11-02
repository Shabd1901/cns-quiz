import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"

export interface QuizSubmission {
  id: string
  studentName: string
  rollNo: string
  batch?: string
  mode: string // 'exam-challenge' | 'classroom' | 'numerical-lab' | 'diagram-quiz' | 'self-test'
  modeTitle: string
  totalQuestions: number
  correctCount: number
  accuracyRate: number
  earnedMarks: number
  totalMarks: number
  durationSec: number
  timestamp: number
  moduleBreakdown?: Record<string, { total: number; correct: number; rate: number }>
}

const memoryStorage = (() => {
  const store = new Map<string, string>()
  return {
    getItem: (key: string) => store.get(key) ?? null,
    setItem: (key: string, value: string) => {
      store.set(key, value)
    },
    removeItem: (key: string) => {
      store.delete(key)
    },
  }
})()

const safeStorage = createJSONStorage(() =>
  typeof window !== "undefined" && window.localStorage ? window.localStorage : memoryStorage
)

const INITIAL_SUBMISSIONS: QuizSubmission[] = [
  {
    id: "sub-101",
    studentName: "Dev Shah",
    rollNo: "21BCP042",
    batch: "Batch A1",
    mode: "exam-challenge",
    modeTitle: "Exam Challenge Mode",
    totalQuestions: 20,
    correctCount: 19,
    accuracyRate: 95,
    earnedMarks: 48,
    totalMarks: 50,
    durationSec: 540,
    timestamp: Date.now() - 1000 * 60 * 35, // 35 mins ago
    moduleBreakdown: {
      M1: { total: 4, correct: 4, rate: 100 },
      M2: { total: 4, correct: 4, rate: 100 },
      M3: { total: 4, correct: 4, rate: 100 },
      M4: { total: 4, correct: 3, rate: 75 },
      M5: { total: 2, correct: 2, rate: 100 },
      M6: { total: 2, correct: 2, rate: 100 },
    },
  },
  {
    id: "sub-102",
    studentName: "Alice Sharma",
    rollNo: "21BCP004",
    batch: "Batch A1",
    mode: "exam-challenge",
    modeTitle: "Exam Challenge Mode",
    totalQuestions: 20,
    correctCount: 17,
    accuracyRate: 85,
    earnedMarks: 42,
    totalMarks: 50,
    durationSec: 610,
    timestamp: Date.now() - 1000 * 60 * 120, // 2 hrs ago
    moduleBreakdown: {
      M1: { total: 4, correct: 4, rate: 100 },
      M2: { total: 4, correct: 3, rate: 75 },
      M3: { total: 4, correct: 4, rate: 100 },
      M4: { total: 4, correct: 3, rate: 75 },
      M5: { total: 2, correct: 1, rate: 50 },
      M6: { total: 2, correct: 2, rate: 100 },
    },
  },
  {
    id: "sub-103",
    studentName: "Rahul Patel",
    rollNo: "21BCP088",
    batch: "Batch A2",
    mode: "numerical-lab",
    modeTitle: "Numerical Lab (Diffie-Hellman / RSA / Hill)",
    totalQuestions: 10,
    correctCount: 9,
    accuracyRate: 90,
    earnedMarks: 45,
    totalMarks: 50,
    durationSec: 780,
    timestamp: Date.now() - 1000 * 60 * 300, // 5 hrs ago
  },
  {
    id: "sub-104",
    studentName: "Priya Nair",
    rollNo: "21BCP071",
    batch: "Batch B1",
    mode: "classroom",
    modeTitle: "Classroom Rapid Fire",
    totalQuestions: 15,
    correctCount: 11,
    accuracyRate: 73,
    earnedMarks: 33,
    totalMarks: 45,
    durationSec: 420,
    timestamp: Date.now() - 1000 * 60 * 60 * 24, // 1 day ago
  },
  {
    id: "sub-105",
    studentName: "Rohan Verma",
    rollNo: "21BCP115",
    batch: "Batch B2",
    mode: "diagram-quiz",
    modeTitle: "Diagram Quiz",
    totalQuestions: 12,
    correctCount: 8,
    accuracyRate: 67,
    earnedMarks: 28,
    totalMarks: 40,
    durationSec: 510,
    timestamp: Date.now() - 1000 * 60 * 60 * 48, // 2 days ago
  },
]

export interface QuizRecordsState {
  submissions: QuizSubmission[]
  addSubmission: (
    submission: Omit<QuizSubmission, "id" | "timestamp"> & { timestamp?: number }
  ) => QuizSubmission
  deleteSubmission: (id: string) => void
  resetToDefaultSubmissions: () => void
  clearAllSubmissions: () => void
  addMockSubmission: () => QuizSubmission
}

export const useQuizRecordsStore = create<QuizRecordsState>()(
  persist(
    (set, get) => ({
      submissions: INITIAL_SUBMISSIONS,

      addSubmission: (sub) => {
        const newRecord: QuizSubmission = {
          ...sub,
          id: `sub-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
          timestamp: sub.timestamp || Date.now(),
        }

        set({
          submissions: [newRecord, ...get().submissions],
        })

        return newRecord
      },

      deleteSubmission: (id: string) => {
        set({
          submissions: get().submissions.filter((s) => s.id !== id),
        })
      },

      resetToDefaultSubmissions: () => {
        set({
          submissions: INITIAL_SUBMISSIONS,
        })
      },

      clearAllSubmissions: () => {
        set({
          submissions: [],
        })
      },

      addMockSubmission: () => {
        const mockNames = [
          { name: "Ananya Desai", roll: "21BCP019", batch: "Batch A1" },
          { name: "Kunal Ghosh", roll: "21BCP056", batch: "Batch A2" },
          { name: "Simran Kaur", roll: "21BCP102", batch: "Batch B1" },
          { name: "Aditya Mehta", roll: "21BCP031", batch: "Batch B2" },
        ]
        const sample = mockNames[Math.floor(Math.random() * mockNames.length)]
        const total = 20
        const correct = Math.floor(Math.random() * 8) + 12 // 12 to 19
        const accuracy = Math.round((correct / total) * 100)
        const marks = correct * 2.5

        const newRecord: QuizSubmission = {
          id: `sub-${Date.now()}`,
          studentName: sample.name,
          rollNo: sample.roll,
          batch: sample.batch,
          mode: "exam-challenge",
          modeTitle: "Exam Challenge Mode",
          totalQuestions: total,
          correctCount: correct,
          accuracyRate: accuracy,
          earnedMarks: marks,
          totalMarks: 50,
          durationSec: Math.floor(Math.random() * 300) + 300,
          timestamp: Date.now(),
        }

        set({
          submissions: [newRecord, ...get().submissions],
        })

        return newRecord
      },
    }),
    {
      name: "cns-quiz-records",
      storage: safeStorage,
    }
  )
)

export function downloadSubmissionsCSV(submissions: QuizSubmission[]) {
  if (typeof window === "undefined" || !submissions.length) return

  const headers = [
    "Submission ID",
    "Student Name",
    "Roll Number",
    "Batch",
    "Quiz Mode",
    "Questions Total",
    "Questions Correct",
    "Accuracy (%)",
    "Marks Earned",
    "Total Marks",
    "Duration (seconds)",
    "Date & Time",
  ]

  const rows = submissions.map((s) => [
    `"${s.id}"`,
    `"${s.studentName}"`,
    `"${s.rollNo}"`,
    `"${s.batch || "N/A"}"`,
    `"${s.modeTitle || s.mode}"`,
    s.totalQuestions,
    s.correctCount,
    `${s.accuracyRate}%`,
    s.earnedMarks,
    s.totalMarks,
    s.durationSec,
    `"${new Date(s.timestamp).toLocaleString()}"`,
  ])

  const csvContent =
    "data:text/csv;charset=utf-8," +
    [headers.join(","), ...rows.map((r) => r.join(","))].join("\n")

  const encodedUri = encodeURI(csvContent)
  const link = document.createElement("a")
  link.setAttribute("href", encodedUri)
  link.setAttribute(
    "download",
    `cns-class-gradebook-${new Date().toISOString().slice(0, 10)}.csv`
  )
  document.body.appendChild(link)
  link.click()
  link.remove()
}
