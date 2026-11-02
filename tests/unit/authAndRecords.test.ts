import { describe, it, expect, beforeEach } from "vitest"
import { useAuthStore } from "@/lib/authStore"
import { useQuizRecordsStore } from "@/lib/quizRecordsStore"

describe("Local Authentication & Records Stores", () => {
  beforeEach(() => {
    useAuthStore.getState().logout()
    useQuizRecordsStore.getState().resetToDefaultSubmissions()
  })

  describe("useAuthStore", () => {
    it("starts with unauthenticated state", () => {
      const state = useAuthStore.getState()
      expect(state.isAuthenticated).toBe(false)
      expect(state.role).toBeNull()
      expect(state.student).toBeNull()
      expect(state.teacher).toBeNull()
    })

    it("allows student to log in with name and roll number", () => {
      useAuthStore.getState().loginAsStudent({
        name: "Dev Shah",
        rollNo: "21bcp042",
        batch: "Batch A1",
      })

      const state = useAuthStore.getState()
      expect(state.isAuthenticated).toBe(true)
      expect(state.role).toBe("student")
      expect(state.student?.name).toBe("Dev Shah")
      expect(state.student?.rollNo).toBe("21BCP042") // capitalized
      expect(state.student?.batch).toBe("Batch A1")
      expect(state.teacher).toBeNull()
    })

    it("allows teacher to log in with default PIN cns2026", () => {
      const result = useAuthStore.getState().loginAsTeacher("cns2026", "Prof. S. R. Raman")
      expect(result.success).toBe(true)

      const state = useAuthStore.getState()
      expect(state.isAuthenticated).toBe(true)
      expect(state.role).toBe("teacher")
      expect(state.teacher?.name).toBe("Prof. S. R. Raman")
      expect(state.student).toBeNull()
    })

    it("rejects invalid teacher PIN", () => {
      const result = useAuthStore.getState().loginAsTeacher("wrongpin")
      expect(result.success).toBe(false)
      expect(result.error).toContain("Invalid Faculty PIN")

      const state = useAuthStore.getState()
      expect(state.isAuthenticated).toBe(false)
      expect(state.role).toBeNull()
    })

    it("allows teacher to log in with proper credentials (email and password)", () => {
      const result = useAuthStore.getState().loginAsTeacherCredentials({
        emailOrId: "raman.sr@tcetmumbai.in",
        password: "cns2026",
      })
      expect(result.success).toBe(true)

      const state = useAuthStore.getState()
      expect(state.isAuthenticated).toBe(true)
      expect(state.role).toBe("teacher")
      expect(state.teacher?.name).toBe("Prof. S. R. Raman")
      expect(state.teacher?.employeeId).toBe("TCET-CMPN-104")
      expect(state.teacher?.department).toContain("CMPN")
    })

    it("allows teacher to log in with Employee ID", () => {
      const result = useAuthStore.getState().loginAsTeacherCredentials({
        emailOrId: "TCET-CMPN-101",
        password: "cns2026",
      })
      expect(result.success).toBe(true)

      const state = useAuthStore.getState()
      expect(state.isAuthenticated).toBe(true)
      expect(state.teacher?.name).toBe("Dr. Kamal Shah")
    })

    it("rejects teacher login with incorrect password", () => {
      const result = useAuthStore.getState().loginAsTeacherCredentials({
        emailOrId: "raman.sr@tcetmumbai.in",
        password: "wrongpassword",
      })
      expect(result.success).toBe(false)
      expect(result.error).toContain("Incorrect password")
    })

    it("logs out and resets state", () => {
      useAuthStore.getState().loginAsStudent({ name: "Dev", rollNo: "21BCP042" })
      expect(useAuthStore.getState().isAuthenticated).toBe(true)

      useAuthStore.getState().logout()
      const state = useAuthStore.getState()
      expect(state.isAuthenticated).toBe(false)
      expect(state.role).toBeNull()
      expect(state.student).toBeNull()
    })
  })

  describe("useQuizRecordsStore", () => {
    it("loads default seed submissions", () => {
      const { submissions } = useQuizRecordsStore.getState()
      expect(submissions.length).toBeGreaterThanOrEqual(5)
      expect(submissions[0].studentName).toBeDefined()
    })

    it("adds a new submission to the top of the list", () => {
      const initialCount = useQuizRecordsStore.getState().submissions.length

      const added = useQuizRecordsStore.getState().addSubmission({
        studentName: "Test Student",
        rollNo: "TEST-01",
        mode: "exam-challenge",
        modeTitle: "Exam Challenge Mode",
        totalQuestions: 20,
        correctCount: 18,
        accuracyRate: 90,
        earnedMarks: 45,
        totalMarks: 50,
        durationSec: 400,
      })

      const { submissions } = useQuizRecordsStore.getState()
      expect(submissions.length).toBe(initialCount + 1)
      expect(submissions[0].id).toBe(added.id)
      expect(submissions[0].studentName).toBe("Test Student")
      expect(submissions[0].accuracyRate).toBe(90)
    })

    it("deletes a submission by id", () => {
      const { submissions } = useQuizRecordsStore.getState()
      const idToDelete = submissions[0].id

      useQuizRecordsStore.getState().deleteSubmission(idToDelete)

      const updated = useQuizRecordsStore.getState().submissions
      expect(updated.find((s) => s.id === idToDelete)).toBeUndefined()
    })

    it("clears and resets submissions", () => {
      useQuizRecordsStore.getState().clearAllSubmissions()
      expect(useQuizRecordsStore.getState().submissions.length).toBe(0)

      useQuizRecordsStore.getState().resetToDefaultSubmissions()
      expect(useQuizRecordsStore.getState().submissions.length).toBeGreaterThan(0)
    })
  })
})
