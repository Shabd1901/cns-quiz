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
  employeeId?: string
  designation: string
  department: string
  cabin?: string
}

export interface FacultyMember {
  id: string
  name: string
  email: string
  employeeId: string
  designation: string
  department: string
  cabin: string
  defaultPassword: string
}

export const REGISTERED_FACULTY: FacultyMember[] = [
  {
    id: "fac-1",
    name: "Prof. S. R. Raman",
    email: "raman.sr@tcetmumbai.in",
    employeeId: "TCET-CMPN-104",
    designation: "Associate Professor & CNS Course In-Charge",
    department: "Computer Engineering (CMPN)",
    cabin: "A-Block 402",
    defaultPassword: "cns2026",
  },
  {
    id: "fac-2",
    name: "Dr. Kamal Shah",
    email: "kamal.shah@tcetmumbai.in",
    employeeId: "TCET-CMPN-101",
    designation: "Professor & Dean Academics",
    department: "Computer Engineering (CMPN)",
    cabin: "A-Block 401",
    defaultPassword: "cns2026",
  },
  {
    id: "fac-3",
    name: "Prof. Shiwani Gupta",
    email: "shiwani.gupta@tcetmumbai.in",
    employeeId: "TCET-CMPN-115",
    designation: "Associate Professor (Cybersecurity Lead)",
    department: "Computer Engineering (CMPN)",
    cabin: "A-Block 408",
    defaultPassword: "cns2026",
  },
  {
    id: "fac-4",
    name: "Dr. Archana Belge",
    email: "archana.belge@tcetmumbai.in",
    employeeId: "TCET-INFT-103",
    designation: "Assistant Professor & Lab In-Charge",
    department: "Information Technology (INFT)",
    cabin: "B-Block 305",
    defaultPassword: "cns2026",
  },
]

export interface AuthState {
  role: UserRole
  student: StudentProfile | null
  teacher: TeacherProfile | null
  isAuthenticated: boolean
  loginAsStudent: (profile: StudentProfile) => void
  loginAsTeacher: (pin: string, customName?: string) => { success: boolean; error?: string }
  loginAsTeacherCredentials: (params: {
    emailOrId: string
    password: string
    department?: string
    designation?: string
    name?: string
  }) => { success: boolean; error?: string }
  logout: () => void
}

const DEFAULT_TEACHER_PIN = "cns2026"
const ACCEPTED_PASSWORDS = ["cns2026", "tcet@2026", "faculty2026", "admin2026", "teacher123", "cns123"]

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
            department: profile.department?.trim() || "Thakur College of Engineering & Technology (CMPN)",
          },
          teacher: null,
          isAuthenticated: true,
        })
      },

      // Backwards-compatible PIN login
      loginAsTeacher: (pin: string, customName?: string) => {
        const cleanedPin = pin.trim().toLowerCase()
        const isMatch =
          cleanedPin === DEFAULT_TEACHER_PIN ||
          ACCEPTED_PASSWORDS.includes(cleanedPin)

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
            email: "faculty.cmpn@tcetmumbai.in",
            employeeId: "TCET-CMPN-104",
            designation: "Course Coordinator & Faculty Examiner",
            department: "Thakur College of Engineering & Technology (CMPN)",
            cabin: "A-Block 402",
          },
          isAuthenticated: true,
        })

        return { success: true }
      },

      // Full-fledged credential login for teachers
      loginAsTeacherCredentials: ({ emailOrId, password, department, designation, name }) => {
        const cleanedId = emailOrId.trim().toLowerCase()
        const cleanedPass = password.trim().toLowerCase()

        if (!cleanedId) {
          return {
            success: false,
            error: "Please enter your Faculty Email or Employee ID.",
          }
        }

        if (!cleanedPass) {
          return {
            success: false,
            error: "Please enter your faculty password.",
          }
        }

        // Check if matches pre-registered faculty directory
        const matchedFaculty = REGISTERED_FACULTY.find(
          (f) =>
            f.email.toLowerCase() === cleanedId ||
            f.employeeId.toLowerCase() === cleanedId ||
            f.name.toLowerCase().includes(cleanedId)
        )

        if (matchedFaculty) {
          const isCorrectPassword =
            cleanedPass === matchedFaculty.defaultPassword.toLowerCase() ||
            ACCEPTED_PASSWORDS.includes(cleanedPass)

          if (!isCorrectPassword) {
            return {
              success: false,
              error: `Incorrect password for ${matchedFaculty.name}. Default password is '${matchedFaculty.defaultPassword}'.`,
            }
          }

          set({
            role: "teacher",
            student: null,
            teacher: {
              name: matchedFaculty.name,
              email: matchedFaculty.email,
              employeeId: matchedFaculty.employeeId,
              designation: matchedFaculty.designation,
              department: matchedFaculty.department,
              cabin: matchedFaculty.cabin,
            },
            isAuthenticated: true,
          })

          return { success: true }
        }

        // Otherwise allow custom faculty credentials with valid college format or password
        const isPassValid = ACCEPTED_PASSWORDS.includes(cleanedPass) || cleanedPass.length >= 4
        if (!isPassValid) {
          return {
            success: false,
            error: "Invalid faculty password. Hint: default password is 'cns2026'.",
          }
        }

        const derivedName =
          name?.trim() ||
          cleanedId
            .split("@")[0]
            .replace(/[._]/g, " ")
            .replace(/\b\w/g, (c) => c.toUpperCase()) ||
          "Faculty Examiner"

        set({
          role: "teacher",
          student: null,
          teacher: {
            name: derivedName.startsWith("Prof") || derivedName.startsWith("Dr") ? derivedName : `Prof. ${derivedName}`,
            email: cleanedId.includes("@") ? cleanedId : `${cleanedId}@tcetmumbai.in`,
            employeeId: cleanedId.toUpperCase().startsWith("TCET") ? cleanedId.toUpperCase() : `TCET-FAC-${Math.floor(100 + Math.random() * 900)}`,
            designation: designation || "Assistant Professor & Faculty Examiner",
            department: department || "Thakur College of Engineering & Technology (CMPN)",
            cabin: "A-Block Faculty Wing",
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
