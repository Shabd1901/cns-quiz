import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"

export type UserRole = "student" | "teacher" | null

export interface StudentProfile {
  name: string
  rollNo: string
  batch?: string
  department?: string
}

export interface TeacherProfile {
  name: string
  email: string
  designation: string
  department: string
}

export interface AuthState {
  role: UserRole
  student: StudentProfile | null
  teacher: TeacherProfile | null
  isAuthenticated: boolean
  loginAsStudent: (profile: StudentProfile) => void
  loginAsTeacher: (pin: string, customName?: string) => { success: boolean; error?: string }
  logout: () => void
}

const DEFAULT_TEACHER_PIN = "cns2026"
const BACKUP_PINS = ["faculty2026", "admin2026", "teacher123", "cns123"]

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

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      role: null,
      student: null,
      teacher: null,
      isAuthenticated: false,

      loginAsStudent: (profile: StudentProfile) => {
        set({
          role: "student",
          student: {
            name: profile.name.trim() || "Student",
            rollNo: profile.rollNo.trim().toUpperCase() || "CNS-STUDENT",
            batch: profile.batch?.trim() || "Batch A1",
            department: profile.department?.trim() || "Computer Science & Engineering",
          },
          teacher: null,
          isAuthenticated: true,
        })
      },

      loginAsTeacher: (pin: string, customName?: string) => {
        const cleanedPin = pin.trim().toLowerCase()
        const isMatch =
          cleanedPin === DEFAULT_TEACHER_PIN ||
          BACKUP_PINS.includes(cleanedPin)

        if (!isMatch) {
          return {
            success: false,
            error: "Invalid Faculty PIN. Default PIN is 'cns2026'.",
          }
        }

        set({
          role: "teacher",
          student: null,
          teacher: {
            name: customName?.trim() || "Prof. S. R. Raman",
            email: "cns.faculty@college.edu",
            designation: "Course Coordinator & Examiner",
            department: "Computer Science & Engineering",
          },
          isAuthenticated: true,
        })

        return { success: true }
      },

      logout: () => {
        set({
          role: null,
          student: null,
          teacher: null,
          isAuthenticated: false,
        })
      },
    }),
    {
      name: "cns-auth-session",
      storage: safeStorage,
    }
  )
)
