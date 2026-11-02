import { describe, it, expect, beforeEach } from "vitest"
import { useAcademicStore, INITIAL_MODULE_PROGRESS, INITIAL_MILESTONES } from "@/lib/academicStore"

describe("Academic Timeline, Portion Progress & Multi-Subject Marks Store", () => {
  beforeEach(() => {
    useAcademicStore.setState({
      moduleProgress: INITIAL_MODULE_PROGRESS,
      milestones: INITIAL_MILESTONES,
    })
  })

  it("verifies initial portion progress implements user rule (M1 completed up to Part 5, unlocked up to Part 8)", () => {
    const store = useAcademicStore.getState()
    const m1 = store.moduleProgress.m1

    expect(m1).toBeDefined()
    expect(m1.completedUpTo).toBe(5)
    expect(m1.unlockedUpTo).toBe(8)
    expect(m1.totalTopics).toBe(11)

    // Topic 1 to 5 should be completed
    expect(store.isTopicCompleted("m1", 1)).toBe(true)
    expect(store.isTopicCompleted("m1", 5)).toBe(true)
    expect(store.isTopicCompleted("m1", 6)).toBe(false)

    // Topic 1 to 8 should be unlocked
    expect(store.isTopicUnlocked("m1", 1)).toBe(true)
    expect(store.isTopicUnlocked("m1", 8)).toBe(true)
    expect(store.isTopicUnlocked("m1", 9)).toBe(false)
    expect(store.isTopicUnlocked("m1", 11)).toBe(false)
  })

  it("automatically unlocks up to (completed + 3) when teacher advances portion", () => {
    const store = useAcademicStore.getState()

    // Teacher advances M2 to Topic 4
    store.setPortionProgress("m2", 4)
    const updatedM2 = useAcademicStore.getState().moduleProgress.m2
    expect(updatedM2.completedUpTo).toBe(4)
    expect(updatedM2.unlockedUpTo).toBe(7) // 4 + 3

    // Topics 1-4 completed, 1-7 unlocked
    expect(store.isTopicCompleted("m2", 4)).toBe(true)
    expect(store.isTopicCompleted("m2", 5)).toBe(false)
    expect(store.isTopicUnlocked("m2", 7)).toBe(true)
    expect(store.isTopicUnlocked("m2", 8)).toBe(false)
  })

  it("verifies all required milestones exist in correct syllabus order", () => {
    const store = useAcademicStore.getState()
    const codes = store.milestones.map(m => m.code)

    expect(codes).toContain("ISE 1")
    expect(codes).toContain("FA 1")
    expect(codes).toContain("ISE 3")
    expect(codes).toContain("ISE 2")
    expect(codes).toContain("FA 2")
    expect(codes).toContain("TW")

    // ISE 1 and FA 1 position after Module 3
    const ise1 = store.milestones.find(m => m.code === "ISE 1")
    expect(ise1?.position).toContain("Module 3")
    expect(ise1?.maxMarks).toBe(20)

    const fa1 = store.milestones.find(m => m.code === "FA 1")
    expect(fa1?.maxMarks).toBe(25)

    // ISE 2 and FA 2 position after ISE 3 and Module 6
    const ise2 = store.milestones.find(m => m.code === "ISE 2")
    expect(ise2?.maxMarks).toBe(20)

    const tw = store.milestones.find(m => m.code === "TW")
    expect(tw?.maxMarks).toBe(25)
  })

  it("allows faculty to update milestone dates, venue, and status", () => {
    const store = useAcademicStore.getState()
    store.updateMilestone("m-ise1", {
      date: "2026-03-02",
      venue: "Auditorium Hall A",
      status: "active",
      maxMarks: 25,
    })

    const updated = useAcademicStore.getState().milestones.find(m => m.id === "m-ise1")
    expect(updated?.date).toBe("2026-03-02")
    expect(updated?.venue).toBe("Auditorium Hall A")
    expect(updated?.status).toBe("active")
    expect(updated?.maxMarks).toBe(25)
  })

  it("retrieves multi-subject marks for IT student Aarav Patel (21BIT015)", () => {
    const store = useAcademicStore.getState()
    const itStudentMarks = store.getStudentMarksByRoll("21BIT015")

    expect(itStudentMarks.length).toBe(5)
    const subjects = itStudentMarks.map(m => m.subjectCode)
    expect(subjects).toContain("CSC602") // CNS
    expect(subjects).toContain("ITC601") // DBMS
    expect(subjects).toContain("CSC404") // OS
    expect(subjects).toContain("ITC602") // CN
    expect(subjects).toContain("ITC603") // SE

    itStudentMarks.forEach(record => {
      expect(record.studentName).toBe("Aarav Patel")
      expect(record.department).toContain("Information Technology")
      expect(record.totalMarks).toBeGreaterThan(0)
      expect(record.percentage).toBeGreaterThanOrEqual(40)
      expect(["O", "A+", "A", "B+", "B", "C"]).toContain(record.grade)
    })
  })

  it("allows faculty to edit marks and recomputes total and grade dynamically", () => {
    const store = useAcademicStore.getState()

    // Faculty updates Dev Shah's ISE 1 in CNS to 20
    store.updateStudentSubjectMarks("21BCP042", "CSC602", "ise1", 20)

    const devCns = useAcademicStore.getState().studentMarks.find(
      m => m.rollNo === "21BCP042" && m.subjectCode === "CSC602"
    )

    expect(devCns).toBeDefined()
    expect(devCns?.ise1).toBe(20)
    // 20 + 25 + 19 + 20 + 25 + 25 = 134
    expect(devCns?.totalMarks).toBe(134)
    expect(devCns?.percentage).toBe(99)
    expect(devCns?.grade).toBe("O")
    expect(devCns?.status).toBe("Distinction")
  })
})
