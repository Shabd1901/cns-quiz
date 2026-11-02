import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"

export interface ModulePortionProgress {
  moduleId: string
  code: string
  title: string
  totalTopics: number
  completedUpTo: number // 1-based topic index completed in class (e.g. 5)
  unlockedUpTo: number  // 1-based topic index unlocked for students (e.g. 8)
  lastUpdatedDate: string
  updatedBy: string
}

export type MilestoneType = 'exam' | 'assessment' | 'submission' | 'checkpoint'
export type MilestoneStatus = 'upcoming' | 'active' | 'completed'

export interface AcademicMilestone {
  id: string
  title: string
  code: string
  type: MilestoneType
  position: string       // e.g. "After Module 3", "After Module 6"
  date: string           // e.g. "2026-02-26"
  time: string           // e.g. "10:30 AM – 12:30 PM"
  venue: string          // e.g. "Room 402 & 403"
  maxMarks: number       // e.g. 20, 25
  syllabusCoverage: string
  guidelines: string
  status: MilestoneStatus
}

export interface StudentSubjectMarks {
  id: string
  rollNo: string
  studentName: string
  department: string // e.g. "Information Technology (INFT)" | "Computer Engineering (CMPN)"
  batch: string
  subjectCode: string // e.g. "CSC602"
  subjectName: string // e.g. "Cryptography & Network Security"
  inCharge: string    // e.g. "Prof. S. R. Raman"
  ise1: number        // out of 20
  fa1: number         // out of 25
  ise2: number        // out of 20
  ise3: number        // out of 20
  fa2: number         // out of 25
  termWork: number    // out of 25
  totalMarks: number  // out of 135
  percentage: number
  grade: string       // "O" | "A+" | "A" | "B+" | "B" | "C" | "F"
  status: "Distinction" | "First Class" | "Pass" | "Needs Improvement"
  feedback?: string
}

export interface SubjectItem {
  code: string
  name: string
  semester: string
  credits: number
  inCharge: string
  department: string
}

export const ACADEMIC_SUBJECTS: SubjectItem[] = [
  {
    code: "CSC602",
    name: "Cryptography & Network Security",
    semester: "Semester VI",
    credits: 4,
    inCharge: "Prof. S. R. Raman",
    department: "Computer Engineering (CMPN)",
  },
  {
    code: "ITC601",
    name: "Database Management Systems & Warehousing",
    semester: "Semester VI",
    credits: 4,
    inCharge: "Dr. Archana Belge",
    department: "Information Technology (INFT)",
  },
  {
    code: "CSC404",
    name: "Operating Systems & Virtualization",
    semester: "Semester VI",
    credits: 4,
    inCharge: "Prof. Shiwani Gupta",
    department: "Computer Engineering (CMPN)",
  },
  {
    code: "ITC602",
    name: "Computer Networks & Protocol Architectures",
    semester: "Semester VI",
    credits: 4,
    inCharge: "Dr. Kamal Shah",
    department: "Information Technology (INFT)",
  },
  {
    code: "ITC603",
    name: "Software Engineering & Agile Methodologies",
    semester: "Semester VI",
    credits: 3,
    inCharge: "Prof. V. K. Singh",
    department: "Information Technology (INFT)",
  },
]

export const INITIAL_MODULE_PROGRESS: Record<string, ModulePortionProgress> = {
  m1: {
    moduleId: "m1",
    code: "M1",
    title: "Introduction & Classical Cryptography",
    totalTopics: 11,
    completedUpTo: 5, // Completed till Part 5 (Playfair)
    unlockedUpTo: 8,  // Unlocked till Part 8 (Hill)
    lastUpdatedDate: "2026-02-18",
    updatedBy: "Prof. S. R. Raman",
  },
  m2: {
    moduleId: "m2",
    code: "M2",
    title: "Block Ciphers & Public Key Cryptography",
    totalTopics: 12,
    completedUpTo: 3,
    unlockedUpTo: 6,
    lastUpdatedDate: "2026-02-18",
    updatedBy: "Prof. S. R. Raman",
  },
  m3: {
    moduleId: "m3",
    code: "M3",
    title: "Cryptographic Hashes & Digital Signatures",
    totalTopics: 9,
    completedUpTo: 2,
    unlockedUpTo: 5,
    lastUpdatedDate: "2026-02-17",
    updatedBy: "Prof. S. R. Raman",
  },
  m4: {
    moduleId: "m4",
    code: "M4",
    title: "Protection of Computing Resources & System Security",
    totalTopics: 8,
    completedUpTo: 0,
    unlockedUpTo: 3,
    lastUpdatedDate: "2026-02-10",
    updatedBy: "Prof. S. R. Raman",
  },
  m5: {
    moduleId: "m5",
    code: "M5",
    title: "Network Security & Defense",
    totalTopics: 9,
    completedUpTo: 0,
    unlockedUpTo: 2,
    lastUpdatedDate: "2026-02-10",
    updatedBy: "Prof. S. R. Raman",
  },
  m6: {
    moduleId: "m6",
    code: "M6",
    title: "Network Security Applications & Emerging Threats",
    totalTopics: 8,
    completedUpTo: 0,
    unlockedUpTo: 2,
    lastUpdatedDate: "2026-02-10",
    updatedBy: "Prof. S. R. Raman",
  },
}

export const INITIAL_MILESTONES: AcademicMilestone[] = [
  {
    id: "m-ise1",
    title: "In-Semester Evaluation 1 (ISE 1)",
    code: "ISE 1",
    type: "exam",
    position: "After Module 3",
    date: "2026-02-26",
    time: "10:30 AM – 12:30 PM",
    venue: "Main Exam Hall 401 & 402",
    maxMarks: 20,
    syllabusCoverage: "Modules 1, 2, and 3 (Classical Ciphers, Block Ciphers, Hashes & Signatures)",
    guidelines: "Descriptive 20-mark written test. Covers Bloom Levels L1 to L3. Compulsory for continuous evaluation.",
    status: "upcoming",
  },
  {
    id: "m-fa1",
    title: "Formative Assessment 1 (FA 1)",
    code: "FA 1",
    type: "assessment",
    position: "After ISE 1",
    date: "2026-03-06",
    time: "02:00 PM – 05:00 PM",
    venue: "Network Security Lab 304",
    maxMarks: 25,
    syllabusCoverage: "Lab Experiments 1 to 4 (Classical Ciphers, DES, AES implementation)",
    guidelines: "Practical code execution, algorithm efficiency verification, and one-on-one technical viva.",
    status: "upcoming",
  },
  {
    id: "m-ise3",
    title: "Continuous Evaluation & Mini-Project (ISE 3)",
    code: "ISE 3",
    type: "checkpoint",
    position: "After Module 6",
    date: "2026-04-02",
    time: "11:00 AM – 04:00 PM",
    venue: "Project Innovation Center",
    maxMarks: 20,
    syllabusCoverage: "Full Course Project (Modules 1 through 6 applied security)",
    guidelines: "Team security case study submission, Wireshark PCAP telemetry inspection, and prototype defense.",
    status: "upcoming",
  },
  {
    id: "m-ise2",
    title: "In-Semester Evaluation 2 (ISE 2)",
    code: "ISE 2",
    type: "exam",
    position: "After ISE 3",
    date: "2026-04-10",
    time: "10:30 AM – 12:30 PM",
    venue: "Main Exam Hall 401 & 402",
    maxMarks: 20,
    syllabusCoverage: "Modules 4, 5, and 6 (Computing Resources, Network Defense, IPsec & TLS)",
    guidelines: "Terminal written exam covering advanced protocols, attacks, and defense architectures.",
    status: "upcoming",
  },
  {
    id: "m-fa2",
    title: "Formative Assessment 2 (FA 2)",
    code: "FA 2",
    type: "assessment",
    position: "After ISE 2",
    date: "2026-04-17",
    time: "02:00 PM – 05:00 PM",
    venue: "Network Security Lab 304",
    maxMarks: 25,
    syllabusCoverage: "Lab Experiments 5 to 8 (Firewalls, Snort IDS, IPsec VPN, Kerberos)",
    guidelines: "Live firewall packet filtering configuration and terminal oral examination.",
    status: "upcoming",
  },
  {
    id: "m-termwork",
    title: "Term Work (TW) & Journal Final Sign-Off",
    code: "TW",
    type: "submission",
    position: "Semester Final Submission",
    date: "2026-04-24",
    time: "05:00 PM Strict Deadline",
    venue: "Department Office / Faculty Cabin",
    maxMarks: 25,
    syllabusCoverage: "Complete Lab Journal (All 8 Experiments) + Continuous Evaluation Rubric",
    guidelines: "Certified lab manual submission stamped by faculty course in-charge and HOD.",
    status: "upcoming",
  },
]

function computeGradeAndStatus(total: number, max: number): {
  percentage: number
  grade: string
  status: "Distinction" | "First Class" | "Pass" | "Needs Improvement"
} {
  const percentage = Math.round((total / max) * 100)
  let grade = "F"
  let status: "Distinction" | "First Class" | "Pass" | "Needs Improvement" = "Needs Improvement"

  if (percentage >= 85) {
    grade = "O"
    status = "Distinction"
  } else if (percentage >= 75) {
    grade = "A+"
    status = "Distinction"
  } else if (percentage >= 65) {
    grade = "A"
    status = "First Class"
  } else if (percentage >= 55) {
    grade = "B+"
    status = "Pass"
  } else if (percentage >= 50) {
    grade = "B"
    status = "Pass"
  } else if (percentage >= 40) {
    grade = "C"
    status = "Pass"
  }

  return { percentage, grade, status }
}

export function buildStudentMarks(
  rollNo: string,
  studentName: string,
  department: string,
  batch: string,
  subjectCode: string,
  subjectName: string,
  inCharge: string,
  marks: {
    ise1: number
    fa1: number
    ise2: number
    ise3: number
    fa2: number
    termWork: number
  },
  feedback?: string
): StudentSubjectMarks {
  const totalMarks = marks.ise1 + marks.fa1 + marks.ise2 + marks.ise3 + marks.fa2 + marks.termWork
  const { percentage, grade, status } = computeGradeAndStatus(totalMarks, 135)

  return {
    id: `${rollNo}-${subjectCode}`,
    rollNo,
    studentName,
    department,
    batch,
    subjectCode,
    subjectName,
    inCharge,
    ...marks,
    totalMarks,
    percentage,
    grade,
    status,
    feedback: feedback || "Consistent academic performance and active laboratory participation.",
  }
}

export const INITIAL_STUDENT_MARKS: StudentSubjectMarks[] = [
  // IT Student: Aarav Patel (21BIT015)
  buildStudentMarks(
    "21BIT015",
    "Aarav Patel",
    "Information Technology (INFT)",
    "Batch IT-B",
    "CSC602",
    "Cryptography & Network Security",
    "Prof. S. R. Raman",
    { ise1: 18, fa1: 23, ise2: 17, ise3: 19, fa2: 24, termWork: 23 },
    "Strong understanding of classical ciphers and public key algorithms."
  ),
  buildStudentMarks(
    "21BIT015",
    "Aarav Patel",
    "Information Technology (INFT)",
    "Batch IT-B",
    "ITC601",
    "Database Management Systems & Warehousing",
    "Dr. Archana Belge",
    { ise1: 19, fa1: 24, ise2: 18, ise3: 18, fa2: 23, termWork: 24 },
    "Excellent query optimization and ER modeling skills."
  ),
  buildStudentMarks(
    "21BIT015",
    "Aarav Patel",
    "Information Technology (INFT)",
    "Batch IT-B",
    "CSC404",
    "Operating Systems & Virtualization",
    "Prof. Shiwani Gupta",
    { ise1: 16, fa1: 22, ise2: 17, ise3: 18, fa2: 22, termWork: 22 },
    "Good grasp of process scheduling and deadlock recovery."
  ),
  buildStudentMarks(
    "21BIT015",
    "Aarav Patel",
    "Information Technology (INFT)",
    "Batch IT-B",
    "ITC602",
    "Computer Networks & Protocol Architectures",
    "Dr. Kamal Shah",
    { ise1: 17, fa1: 23, ise2: 18, ise3: 17, fa2: 23, termWork: 23 },
    "Proficient in packet sniffing and subnet allocation."
  ),
  buildStudentMarks(
    "21BIT015",
    "Aarav Patel",
    "Information Technology (INFT)",
    "Batch IT-B",
    "ITC603",
    "Software Engineering & Agile Methodologies",
    "Prof. V. K. Singh",
    { ise1: 19, fa1: 24, ise2: 19, ise3: 19, fa2: 24, termWork: 25 },
    "Exceptional sprint documentation and agile methodology execution."
  ),

  // IT Student: Priya Sharma (21BIT028)
  buildStudentMarks(
    "21BIT028",
    "Priya Sharma",
    "Information Technology (INFT)",
    "Batch IT-A",
    "CSC602",
    "Cryptography & Network Security",
    "Prof. S. R. Raman",
    { ise1: 19, fa1: 24, ise2: 18, ise3: 19, fa2: 24, termWork: 24 }
  ),
  buildStudentMarks(
    "21BIT028",
    "Priya Sharma",
    "Information Technology (INFT)",
    "Batch IT-A",
    "ITC601",
    "Database Management Systems & Warehousing",
    "Dr. Archana Belge",
    { ise1: 20, fa1: 25, ise2: 19, ise3: 20, fa2: 25, termWork: 25 }
  ),
  buildStudentMarks(
    "21BIT028",
    "Priya Sharma",
    "Information Technology (INFT)",
    "Batch IT-A",
    "CSC404",
    "Operating Systems & Virtualization",
    "Prof. Shiwani Gupta",
    { ise1: 18, fa1: 23, ise2: 17, ise3: 18, fa2: 23, termWork: 23 }
  ),
  buildStudentMarks(
    "21BIT028",
    "Priya Sharma",
    "Information Technology (INFT)",
    "Batch IT-A",
    "ITC602",
    "Computer Networks & Protocol Architectures",
    "Dr. Kamal Shah",
    { ise1: 19, fa1: 24, ise2: 18, ise3: 19, fa2: 24, termWork: 24 }
  ),
  buildStudentMarks(
    "21BIT028",
    "Priya Sharma",
    "Information Technology (INFT)",
    "Batch IT-A",
    "ITC603",
    "Software Engineering & Agile Methodologies",
    "Prof. V. K. Singh",
    { ise1: 19, fa1: 25, ise2: 19, ise3: 20, fa2: 24, termWork: 25 }
  ),

  // CMPN Student: Dev Shah (21BCP042)
  buildStudentMarks(
    "21BCP042",
    "Dev Shah",
    "Computer Engineering (CMPN)",
    "Batch A1",
    "CSC602",
    "Cryptography & Network Security",
    "Prof. S. R. Raman",
    { ise1: 19, fa1: 25, ise2: 19, ise3: 20, fa2: 25, termWork: 25 },
    "Top performing student in classical ciphers, DES, AES and terminal lab challenges."
  ),
  buildStudentMarks(
    "21BCP042",
    "Dev Shah",
    "Computer Engineering (CMPN)",
    "Batch A1",
    "ITC601",
    "Database Management Systems & Warehousing",
    "Dr. Archana Belge",
    { ise1: 18, fa1: 24, ise2: 18, ise3: 19, fa2: 24, termWork: 24 }
  ),
  buildStudentMarks(
    "21BCP042",
    "Dev Shah",
    "Computer Engineering (CMPN)",
    "Batch A1",
    "CSC404",
    "Operating Systems & Virtualization",
    "Prof. Shiwani Gupta",
    { ise1: 19, fa1: 24, ise2: 18, ise3: 19, fa2: 24, termWork: 24 }
  ),
  buildStudentMarks(
    "21BCP042",
    "Dev Shah",
    "Computer Engineering (CMPN)",
    "Batch A1",
    "ITC602",
    "Computer Networks & Protocol Architectures",
    "Dr. Kamal Shah",
    { ise1: 18, fa1: 24, ise2: 19, ise3: 19, fa2: 24, termWork: 24 }
  ),
  buildStudentMarks(
    "21BCP042",
    "Dev Shah",
    "Computer Engineering (CMPN)",
    "Batch A1",
    "ITC603",
    "Software Engineering & Agile Methodologies",
    "Prof. V. K. Singh",
    { ise1: 20, fa1: 25, ise2: 19, ise3: 20, fa2: 25, termWork: 25 }
  ),

  // IT Student: Rohan Mehta (21BIT044)
  buildStudentMarks(
    "21BIT044",
    "Rohan Mehta",
    "Information Technology (INFT)",
    "Batch IT-B",
    "CSC602",
    "Cryptography & Network Security",
    "Prof. S. R. Raman",
    { ise1: 15, fa1: 20, ise2: 14, ise3: 16, fa2: 21, termWork: 21 }
  ),
  buildStudentMarks(
    "21BIT044",
    "Rohan Mehta",
    "Information Technology (INFT)",
    "Batch IT-B",
    "ITC601",
    "Database Management Systems & Warehousing",
    "Dr. Archana Belge",
    { ise1: 16, fa1: 21, ise2: 15, ise3: 17, fa2: 22, termWork: 22 }
  ),
  buildStudentMarks(
    "21BIT044",
    "Rohan Mehta",
    "Information Technology (INFT)",
    "Batch IT-B",
    "CSC404",
    "Operating Systems & Virtualization",
    "Prof. Shiwani Gupta",
    { ise1: 14, fa1: 19, ise2: 15, ise3: 16, fa2: 20, termWork: 20 }
  ),
  buildStudentMarks(
    "21BIT044",
    "Rohan Mehta",
    "Information Technology (INFT)",
    "Batch IT-B",
    "ITC602",
    "Computer Networks & Protocol Architectures",
    "Dr. Kamal Shah",
    { ise1: 15, fa1: 20, ise2: 16, ise3: 16, fa2: 21, termWork: 21 }
  ),
  buildStudentMarks(
    "21BIT044",
    "Rohan Mehta",
    "Information Technology (INFT)",
    "Batch IT-B",
    "ITC603",
    "Software Engineering & Agile Methodologies",
    "Prof. V. K. Singh",
    { ise1: 17, fa1: 22, ise2: 16, ise3: 18, fa2: 22, termWork: 23 }
  ),
]

export interface AcademicStoreState {
  moduleProgress: Record<string, ModulePortionProgress>
  milestones: AcademicMilestone[]
  studentMarks: StudentSubjectMarks[]

  // Portion completion actions
  setPortionProgress: (
    moduleId: string,
    completedUpTo: number,
    unlockedUpTo?: number,
    updatedBy?: string
  ) => void

  isTopicCompleted: (moduleId: string, topicIndex1Based: number) => boolean
  isTopicUnlocked: (moduleId: string, topicIndex1Based: number) => boolean

  // Timeline & Milestones actions
  updateMilestone: (id: string, updates: Partial<AcademicMilestone>) => void
  resetMilestones: () => void

  // Marks upload & management actions
  updateStudentSubjectMarks: (
    rollNo: string,
    subjectCode: string,
    field: "ise1" | "fa1" | "ise2" | "ise3" | "fa2" | "termWork",
    value: number
  ) => void
  addStudentMarksRecord: (record: StudentSubjectMarks) => void
  getStudentMarksByRoll: (rollNo: string) => StudentSubjectMarks[]
  getMarksBySubject: (subjectCode: string) => StudentSubjectMarks[]
  resetAllMarks: () => void
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

export const useAcademicStore = create<AcademicStoreState>()(
  persist(
    (set, get) => ({
      moduleProgress: INITIAL_MODULE_PROGRESS,
      milestones: INITIAL_MILESTONES,
      studentMarks: INITIAL_STUDENT_MARKS,

      setPortionProgress: (moduleId, completedUpTo, customUnlockedUpTo, updatedBy = "Faculty In-Charge") => {
        set((state) => {
          const current = state.moduleProgress[moduleId]
          if (!current) return state

          const safeCompleted = Math.max(0, Math.min(current.totalTopics, completedUpTo))
          // Rule: If teacher completed till Part 5, Part 8 is unlocked (completedUpTo + 3)
          const safeUnlocked =
            customUnlockedUpTo !== undefined
              ? Math.max(safeCompleted, Math.min(current.totalTopics, customUnlockedUpTo))
              : Math.min(current.totalTopics, safeCompleted + 3)

          return {
            moduleProgress: {
              ...state.moduleProgress,
              [moduleId]: {
                ...current,
                completedUpTo: safeCompleted,
                unlockedUpTo: safeUnlocked,
                lastUpdatedDate: new Date().toISOString().split("T")[0],
                updatedBy,
              },
            },
          }
        })
      },

      isTopicCompleted: (moduleId, topicIndex1Based) => {
        const prog = get().moduleProgress[moduleId]
        if (!prog) return true
        return topicIndex1Based <= prog.completedUpTo
      },

      isTopicUnlocked: (moduleId, topicIndex1Based) => {
        const prog = get().moduleProgress[moduleId]
        if (!prog) return true
        return topicIndex1Based <= prog.unlockedUpTo
      },

      updateMilestone: (id, updates) => {
        set((state) => ({
          milestones: state.milestones.map((m) =>
            m.id === id ? { ...m, ...updates } : m
          ),
        }))
      },

      resetMilestones: () => {
        set({ milestones: INITIAL_MILESTONES })
      },

      updateStudentSubjectMarks: (rollNo, subjectCode, field, value) => {
        set((state) => ({
          studentMarks: state.studentMarks.map((rec) => {
            if (
              rec.rollNo.toUpperCase() === rollNo.toUpperCase() &&
              rec.subjectCode.toUpperCase() === subjectCode.toUpperCase()
            ) {
              const updatedRec = { ...rec, [field]: Number(value) || 0 }
              const total =
                updatedRec.ise1 +
                updatedRec.fa1 +
                updatedRec.ise2 +
                updatedRec.ise3 +
                updatedRec.fa2 +
                updatedRec.termWork
              const { percentage, grade, status } = computeGradeAndStatus(total, 135)
              return {
                ...updatedRec,
                totalMarks: total,
                percentage,
                grade,
                status,
              }
            }
            return rec
          }),
        }))
      },

      addStudentMarksRecord: (record) => {
        set((state) => {
          const exists = state.studentMarks.findIndex(
            (r) =>
              r.rollNo.toUpperCase() === record.rollNo.toUpperCase() &&
              r.subjectCode.toUpperCase() === record.subjectCode.toUpperCase()
          )
          if (exists >= 0) {
            const copy = [...state.studentMarks]
            copy[exists] = record
            return { studentMarks: copy }
          }
          return { studentMarks: [...state.studentMarks, record] }
        })
      },

      getStudentMarksByRoll: (rollNo) => {
        const marks = get().studentMarks
        return marks.filter((m) => m.rollNo.toUpperCase() === rollNo.toUpperCase())
      },

      getMarksBySubject: (subjectCode) => {
        const marks = get().studentMarks
        return marks.filter((m) => m.subjectCode.toUpperCase() === subjectCode.toUpperCase())
      },

      resetAllMarks: () => {
        set({ studentMarks: INITIAL_STUDENT_MARKS })
      },
    }),
    {
      name: "tcet-academic-lms-store",
      storage: safeStorage,
    }
  )
)
