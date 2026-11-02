"use client"

import React, { useState } from "react"
import { useAcademicStore, ACADEMIC_SUBJECTS, buildStudentMarks } from "@/lib/academicStore"
import { Award, CheckCircle2, Download, Plus, Search } from "lucide-react"

interface StudentMarksViewProps {
  isFaculty?: boolean
  currentStudentRoll?: string
}

export function StudentMarksView({ isFaculty = false, currentStudentRoll }: StudentMarksViewProps) {
  const {
    studentMarks,
    updateStudentSubjectMarks,
    addStudentMarksRecord,
    resetAllMarks,
  } = useAcademicStore()

  // Faculty view state
  const [selectedSubject, setSelectedSubject] = useState<string>("CSC602")
  const [selectedDeptFilter, setSelectedDeptFilter] = useState<string>("ALL")
  const [searchQuery, setSearchQuery] = useState("")
  const [toastMessage, setToastMessage] = useState("")

  // Add new student modal state
  const [isAddingStudent, setIsAddingStudent] = useState(false)
  const [newRoll, setNewRoll] = useState("")
  const [newName, setNewName] = useState("")
  const [newDept, setNewDept] = useState("Information Technology (INFT)")
  const [newBatch, setNewBatch] = useState("Batch IT-A")

  // For Student view: filter marks for this student
  // Fallback to "21BCP042" (Dev Shah) or "21BIT015" (Aarav Patel) if not specified
  const effectiveRoll = currentStudentRoll || "21BIT015"
  const studentRecords = studentMarks.filter(
    (m) => m.rollNo.toUpperCase() === effectiveRoll.toUpperCase()
  )

  // Overall student aggregates
  const studentTotalMarks = studentRecords.reduce((acc, curr) => acc + curr.totalMarks, 0)
  const studentMaxPossible = studentRecords.length * 135
  const studentAvgPercentage =
    studentRecords.length > 0
      ? Math.round((studentTotalMarks / (studentRecords.length * 135)) * 100)
      : 0
  const distinctionSubjectsCount = studentRecords.filter((r) => r.status === "Distinction").length

  // For Faculty view: filter records by subject and department
  const facultyRecords = studentMarks.filter((m) => {
    const matchSubject = m.subjectCode.toUpperCase() === selectedSubject.toUpperCase()
    const matchDept =
      selectedDeptFilter === "ALL" || m.department.toLowerCase().includes(selectedDeptFilter.toLowerCase())
    const matchSearch =
      searchQuery.trim() === "" ||
      m.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.rollNo.toLowerCase().includes(searchQuery.toLowerCase())
    return matchSubject && matchDept && matchSearch
  })

  const currentSubjectInfo = ACADEMIC_SUBJECTS.find((s) => s.code === selectedSubject) || ACADEMIC_SUBJECTS[0]

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print()
    }
  }

  const handleExportCsv = () => {
    const rows = [
      ["Roll No", "Student Name", "Department", "Subject", "ISE 1 (20)", "FA 1 (25)", "ISE 2 (20)", "ISE 3 (20)", "FA 2 (25)", "Term Work (25)", "Total (135)", "Percentage", "Grade", "Status"],
      ...facultyRecords.map((r) => [
        r.rollNo,
        `"${r.studentName}"`,
        `"${r.department}"`,
        r.subjectCode,
        r.ise1,
        r.fa1,
        r.ise2,
        r.ise3,
        r.fa2,
        r.termWork,
        r.totalMarks,
        `${r.percentage}%`,
        r.grade,
        r.status,
      ]),
    ]

    const csvContent = "data:text/csv;charset=utf-8," + rows.map((e) => e.join(",")).join("\n")
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement("a")
    link.setAttribute("href", encodedUri)
    link.setAttribute("download", `TCET-Internal-Marks-${selectedSubject}-${Date.now()}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleCreateStudent = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newRoll.trim() || !newName.trim()) return

    // Create marks records for all 5 subjects for this student
    ACADEMIC_SUBJECTS.forEach((sub) => {
      const record = buildStudentMarks(
        newRoll.trim().toUpperCase(),
        newName.trim(),
        newDept,
        newBatch,
        sub.code,
        sub.name,
        sub.inCharge,
        { ise1: 17, fa1: 22, ise2: 17, ise3: 18, fa2: 22, termWork: 22 },
        "Newly enrolled student internal evaluation record."
      )
      addStudentMarksRecord(record)
    })

    setIsAddingStudent(false)
    setNewRoll("")
    setNewName("")
    setToastMessage(`Enrolled ${newName} (${newRoll}) across all 5 semester subjects.`)
    setTimeout(() => setToastMessage(""), 3500)
  }

  // ==========================================
  // 1. STUDENT VIEW
  // ==========================================
  if (!isFaculty) {
    const studentInfo = studentRecords[0] || {
      studentName: "Student",
      rollNo: effectiveRoll,
      department: "Information Technology (INFT)",
      batch: "Batch IT-B",
    }

    return (
      <div className="space-y-6 font-sans">
        {/* Header Strip */}
        <div className="bg-card border-2 border-ink p-6 sm:p-8 shadow-[6px_6px_0_var(--rule)] space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-rule pb-6">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2.5 py-0.5 bg-signal text-paper font-mono text-[10px] font-bold uppercase tracking-wider">
                  TCET Autonomous Statement of Internal Assessment
                </span>
                <span className="font-mono text-xs text-ink-soft">
                  Semester VI · Academic Year 2025–26
                </span>
              </div>
              <h2 className="font-serif text-3xl font-bold text-ink">
                Multi-Subject Internal Marks Card
              </h2>
              <p className="text-xs sm:text-sm text-ink-soft mt-1">
                Official institutional continuous evaluation scores across all enrolled department subjects.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handlePrint}
                className="px-4 py-2 border border-rule hover:border-ink bg-paper font-mono text-xs uppercase text-ink flex items-center gap-1.5 font-bold transition-colors shadow-xs"
              >
                <span>🖨️ Print Statement</span>
              </button>
            </div>
          </div>

          {/* Student Profile Info Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-paper border border-rule font-mono text-xs">
            <div>
              <span className="text-ink-soft text-[10px] uppercase block font-bold">Candidate Name</span>
              <strong className="text-ink text-sm font-serif">{studentInfo.studentName}</strong>
            </div>
            <div>
              <span className="text-ink-soft text-[10px] uppercase block font-bold">University Roll Number</span>
              <strong className="text-signal text-sm">{studentInfo.rollNo}</strong>
            </div>
            <div>
              <span className="text-ink-soft text-[10px] uppercase block font-bold">Department &amp; Branch</span>
              <strong className="text-ink text-xs">{studentInfo.department}</strong>
            </div>
            <div>
              <span className="text-ink-soft text-[10px] uppercase block font-bold">Lab Batch / Division</span>
              <strong className="text-ink text-xs">{studentInfo.batch}</strong>
            </div>
          </div>

          {/* Academic Summary Metric Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 bg-paper border border-rule">
              <span className="font-mono text-[10px] uppercase tracking-wider text-ink-soft block font-bold">
                Cumulative Marks
              </span>
              <div className="font-serif text-3xl font-bold text-ink mt-1">
                {studentTotalMarks}
                <span className="text-sm font-normal text-ink-soft ml-1">/ {studentMaxPossible}</span>
              </div>
              <span className="font-mono text-[11px] text-ink-soft mt-0.5 block">
                Across {studentRecords.length} subjects
              </span>
            </div>

            <div className="p-4 bg-paper border border-rule">
              <span className="font-mono text-[10px] uppercase tracking-wider text-ink-soft block font-bold">
                Internal Aggregate
              </span>
              <div className="font-serif text-3xl font-bold text-signal mt-1">
                {studentAvgPercentage}%
              </div>
              <span className="font-mono text-[11px] text-ink-soft mt-0.5 block">
                Semester VI Average
              </span>
            </div>

            <div className="p-4 bg-paper border border-rule">
              <span className="font-mono text-[10px] uppercase tracking-wider text-ink-soft block font-bold">
                Predicted Grade
              </span>
              <div className="font-serif text-3xl font-bold text-ok mt-1">
                {studentAvgPercentage >= 85 ? "O (Outstanding)" : studentAvgPercentage >= 75 ? "A+ (Excellent)" : "A (Very Good)"}
              </div>
              <span className="font-mono text-[11px] text-ink-soft mt-0.5 block">
                SGPA Band: ~9.2 – 9.8
              </span>
            </div>

            <div className="p-4 bg-paper border border-rule">
              <span className="font-mono text-[10px] uppercase tracking-wider text-ink-soft block font-bold">
                Distinctions
              </span>
              <div className="font-serif text-3xl font-bold text-ink mt-1">
                {distinctionSubjectsCount}
                <span className="text-sm font-normal text-ink-soft ml-1">/ {studentRecords.length} Courses</span>
              </div>
              <span className="font-mono text-[11px] text-ok mt-0.5 block font-bold">
                ✓ All Pass Requirements Met
              </span>
            </div>
          </div>
        </div>

        {/* Master Multi-Subject Marks Table */}
        <div className="bg-card border-2 border-ink shadow-[4px_4px_0_var(--rule)] p-6 space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-rule pb-3">
            <div>
              <h3 className="font-serif text-xl font-bold text-ink flex items-center gap-2">
                <Award className="h-5 w-5 text-signal" />
                <span>Subject-Wise Continuous Evaluation Ledger</span>
              </h3>
              <p className="text-xs text-ink-soft font-mono">
                Evaluation weights: ISE 1 (20) + FA 1 (25) + ISE 2 (20) + ISE 3 (20) + FA 2 (25) + Term Work (25) = 135 Total
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-xs border-collapse">
              <thead>
                <tr className="border-b-2 border-ink text-ink-soft uppercase text-[10px] bg-paper">
                  <th className="py-3 px-3">Course Code &amp; Title</th>
                  <th className="py-3 px-2 text-center">ISE 1 (20)</th>
                  <th className="py-3 px-2 text-center">FA 1 (25)</th>
                  <th className="py-3 px-2 text-center">ISE 2 (20)</th>
                  <th className="py-3 px-2 text-center">ISE 3 (20)</th>
                  <th className="py-3 px-2 text-center">FA 2 (25)</th>
                  <th className="py-3 px-2 text-center">Term Work (25)</th>
                  <th className="py-3 px-3 text-center">Total (135)</th>
                  <th className="py-3 px-2 text-center">Grade</th>
                  <th className="py-3 px-3 text-right">Faculty Remarks</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-rule/60">
                {studentRecords.map((rec) => (
                  <tr key={rec.id} className="hover:bg-paper/60 transition-colors">
                    <td className="py-3.5 px-3">
                      <span className="px-1.5 py-0.5 bg-card border border-ink text-[10px] font-bold text-signal mr-2">
                        {rec.subjectCode}
                      </span>
                      <strong className="text-ink font-serif text-sm block sm:inline">
                        {rec.subjectName}
                      </strong>
                      <span className="block text-[10px] text-ink-soft font-mono mt-0.5">
                        In-Charge: {rec.inCharge}
                      </span>
                    </td>
                    <td className="py-3.5 px-2 text-center font-bold text-ink">
                      {rec.ise1}
                    </td>
                    <td className="py-3.5 px-2 text-center font-bold text-ink">
                      {rec.fa1}
                    </td>
                    <td className="py-3.5 px-2 text-center font-bold text-ink">
                      {rec.ise2}
                    </td>
                    <td className="py-3.5 px-2 text-center font-bold text-ink">
                      {rec.ise3}
                    </td>
                    <td className="py-3.5 px-2 text-center font-bold text-ink">
                      {rec.fa2}
                    </td>
                    <td className="py-3.5 px-2 text-center font-bold text-ink">
                      {rec.termWork}
                    </td>
                    <td className="py-3.5 px-3 text-center">
                      <strong className="text-base text-ink block">{rec.totalMarks}</strong>
                      <span className="text-[10px] text-ink-soft">({rec.percentage}%)</span>
                    </td>
                    <td className="py-3.5 px-2 text-center">
                      <span
                        className={`inline-block px-2 py-0.5 text-xs font-bold rounded-xs border ${
                          rec.status === "Distinction"
                            ? "bg-ok/10 text-ok border-ok/30"
                            : "bg-signal/10 text-signal border-signal/30"
                        }`}
                      >
                        {rec.grade}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 text-right text-[11px] text-ink-soft font-sans max-w-xs">
                      {rec.feedback || "Good progress throughout semester."}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    )
  }

  // ==========================================
  // 2. FACULTY EDIT / UPLOAD VIEW
  // ==========================================
  return (
    <div className="space-y-6 font-sans">
      {/* Toast */}
      {toastMessage && (
        <div className="p-3 bg-ok/10 border-2 border-ok text-ok font-mono text-xs flex items-center justify-between shadow-[2px_2px_0_var(--ok)] animate-in fade-in">
          <span>{toastMessage}</span>
          <button onClick={() => setToastMessage("")}>✕</button>
        </div>
      )}

      {/* Header & Controls */}
      <div className="bg-card border-2 border-ink p-6 sm:p-8 shadow-[6px_6px_0_var(--rule)] space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-rule pb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 bg-signal text-paper font-mono text-[10px] font-bold uppercase tracking-wider">
                Faculty Examiner Portal
              </span>
              <span className="font-mono text-xs text-ink-soft">
                Continuous Evaluation &amp; Internal Assessment Upload
              </span>
            </div>
            <h2 className="font-serif text-3xl font-bold text-ink">
              Student Marks Upload &amp; Grading Ledger
            </h2>
            <p className="text-xs sm:text-sm text-ink-soft mt-1">
              Upload, edit, and certify internal marks for ISE 1, FA 1, ISE 2, ISE 3, FA 2, and Term Work across all department students.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setIsAddingStudent(true)}
              className="px-3.5 py-2 bg-signal text-paper font-mono text-xs uppercase font-bold hover:bg-ink transition-colors flex items-center gap-1.5 shadow-[2px_2px_0_var(--ink)]"
            >
              <Plus className="h-4 w-4" />
              <span>Enroll Student</span>
            </button>
            <button
              onClick={handleExportCsv}
              className="px-3.5 py-2 border border-rule hover:border-ink bg-paper font-mono text-xs uppercase text-ink flex items-center gap-1.5 font-bold transition-colors"
            >
              <Download className="h-4 w-4 text-signal" />
              <span>Export CSV</span>
            </button>
            <button
              onClick={() => {
                resetAllMarks()
                setToastMessage("Reset student marks to default university test records.")
                setTimeout(() => setToastMessage(""), 3000)
              }}
              className="px-3 py-2 border border-rule hover:border-bad bg-paper font-mono text-xs uppercase text-ink-soft hover:text-bad transition-colors"
            >
              Reset All
            </button>
          </div>
        </div>

        {/* Subject Selector Tabs */}
        <div className="space-y-3">
          <label className="block font-mono text-xs uppercase tracking-wider text-ink font-bold">
            1. Select Course Subject:
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
            {ACADEMIC_SUBJECTS.map((sub) => (
              <button
                key={sub.code}
                onClick={() => setSelectedSubject(sub.code)}
                className={`p-3 border text-left font-mono transition-all ${
                  selectedSubject === sub.code
                    ? "border-signal bg-signal text-paper shadow-[3px_3px_0_var(--ink)]"
                    : "border-rule bg-paper text-ink hover:border-ink"
                }`}
              >
                <span className="block text-[10px] uppercase font-bold opacity-80">{sub.code}</span>
                <span className="block font-serif text-xs font-bold leading-tight truncate mt-0.5">{sub.name}</span>
                <span className="block text-[9px] opacity-75 mt-1">{sub.inCharge}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Filters: Department & Search */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2 border-t border-rule font-mono text-xs">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-ink-soft uppercase text-[10px] font-bold mr-1">Filter Branch:</span>
            {["ALL", "INFT", "CMPN"].map((dept) => (
              <button
                key={dept}
                onClick={() => setSelectedDeptFilter(dept)}
                className={`px-3 py-1 border text-xs font-bold transition-colors ${
                  selectedDeptFilter === dept
                    ? "bg-ink text-paper border-ink"
                    : "bg-paper text-ink border-rule hover:border-ink"
                }`}
              >
                {dept === "ALL" ? "All Departments" : dept}
              </button>
            ))}
          </div>

          <div className="relative min-w-[240px]">
            <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-ink-soft" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search student or roll no..."
              className="w-full pl-8 pr-3 py-1.5 bg-paper border border-rule text-xs text-ink rounded-xs focus:border-signal focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Add Student Modal */}
      {isAddingStudent && (
        <div className="fixed inset-0 bg-ink/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-card border-2 border-ink shadow-[8px_8px_0_var(--ink)] max-w-md w-full p-6 space-y-4 font-mono text-xs">
            <div className="flex justify-between items-center border-b border-rule pb-2">
              <h3 className="font-serif text-lg font-bold text-ink">Enroll Student in Gradebook</h3>
              <button onClick={() => setIsAddingStudent(false)} className="text-ink-soft hover:text-bad">✕</button>
            </div>

            <form onSubmit={handleCreateStudent} className="space-y-3">
              <div>
                <label className="block text-ink-soft uppercase text-[10px] font-bold mb-1">Student Full Name *</label>
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. Sneha Patel"
                  required
                  className="w-full px-3 py-2 bg-paper border border-ink text-sm font-sans text-ink rounded-xs"
                />
              </div>

              <div>
                <label className="block text-ink-soft uppercase text-[10px] font-bold mb-1">University Roll Number *</label>
                <input
                  type="text"
                  value={newRoll}
                  onChange={(e) => setNewRoll(e.target.value)}
                  placeholder="e.g. 21BIT099"
                  required
                  className="w-full px-3 py-2 bg-paper border border-ink text-sm font-mono uppercase text-ink rounded-xs"
                />
              </div>

              <div>
                <label className="block text-ink-soft uppercase text-[10px] font-bold mb-1">Department / Branch</label>
                <select
                  value={newDept}
                  onChange={(e) => setNewDept(e.target.value)}
                  className="w-full px-3 py-2 bg-paper border border-ink text-xs font-sans text-ink rounded-xs"
                >
                  <option value="Information Technology (INFT)">Information Technology (INFT)</option>
                  <option value="Computer Engineering (CMPN)">Computer Engineering (CMPN)</option>
                  <option value="Artificial Intelligence & Data Science (AI&DS)">Artificial Intelligence & Data Science (AI&DS)</option>
                </select>
              </div>

              <div>
                <label className="block text-ink-soft uppercase text-[10px] font-bold mb-1">Lab Batch / Division</label>
                <input
                  type="text"
                  value={newBatch}
                  onChange={(e) => setNewBatch(e.target.value)}
                  placeholder="e.g. Batch IT-A"
                  className="w-full px-3 py-2 bg-paper border border-ink text-xs text-ink rounded-xs"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-rule">
                <button
                  type="button"
                  onClick={() => setIsAddingStudent(false)}
                  className="px-3 py-1.5 border border-rule text-ink hover:border-ink font-mono text-xs uppercase"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-signal text-paper font-mono text-xs uppercase font-bold hover:bg-ink transition-colors"
                >
                  Save &amp; Enroll
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Editable Student Marks Table */}
      <div className="bg-card border-2 border-ink shadow-[4px_4px_0_var(--rule)] p-6 space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-rule pb-3">
          <div>
            <h3 className="font-serif text-xl font-bold text-ink">
              Marks Ledger: {currentSubjectInfo.name} ({currentSubjectInfo.code})
            </h3>
            <p className="text-xs text-ink-soft font-mono">
              Course In-Charge: {currentSubjectInfo.inCharge} · {facultyRecords.length} Students Listed · Edit marks directly in table
            </p>
          </div>

          <span className="font-mono text-xs text-ok font-bold flex items-center gap-1">
            <CheckCircle2 className="h-4 w-4" />
            <span>Auto-saving to Local Gradebook</span>
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs border-collapse">
            <thead>
              <tr className="border-b-2 border-ink text-ink-soft uppercase text-[10px] bg-paper">
                <th className="py-2.5 px-3">Student &amp; Roll No</th>
                <th className="py-2.5 px-2 text-center">ISE 1 (max 20)</th>
                <th className="py-2.5 px-2 text-center">FA 1 (max 25)</th>
                <th className="py-2.5 px-2 text-center">ISE 2 (max 20)</th>
                <th className="py-2.5 px-2 text-center">ISE 3 (max 20)</th>
                <th className="py-2.5 px-2 text-center">FA 2 (max 25)</th>
                <th className="py-2.5 px-2 text-center">TW (max 25)</th>
                <th className="py-2.5 px-3 text-center">Total (135)</th>
                <th className="py-2.5 px-2 text-center">Grade</th>
                <th className="py-2.5 px-3 text-right">Performance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-rule/60">
              {facultyRecords.length === 0 ? (
                <tr>
                  <td colSpan={10} className="text-center py-8 text-ink-soft font-mono">
                    No student records found matching filter.
                  </td>
                </tr>
              ) : (
                facultyRecords.map((rec) => (
                  <tr key={rec.id} className="hover:bg-paper/60 transition-colors">
                    <td className="py-2.5 px-3">
                      <strong className="text-ink font-serif text-sm block">
                        {rec.studentName}
                      </strong>
                      <span className="text-[10px] text-signal font-bold mr-2">
                        {rec.rollNo}
                      </span>
                      <span className="text-[10px] text-ink-soft">
                        {rec.batch}
                      </span>
                    </td>

                    {/* ISE 1 Input */}
                    <td className="py-2.5 px-2 text-center">
                      <input
                        type="number"
                        min={0}
                        max={20}
                        value={rec.ise1}
                        onChange={(e) => updateStudentSubjectMarks(rec.rollNo, rec.subjectCode, "ise1", Number(e.target.value))}
                        className="w-14 px-1.5 py-1 text-center font-bold bg-paper border border-rule focus:border-signal text-ink rounded-xs"
                      />
                    </td>

                    {/* FA 1 Input */}
                    <td className="py-2.5 px-2 text-center">
                      <input
                        type="number"
                        min={0}
                        max={25}
                        value={rec.fa1}
                        onChange={(e) => updateStudentSubjectMarks(rec.rollNo, rec.subjectCode, "fa1", Number(e.target.value))}
                        className="w-14 px-1.5 py-1 text-center font-bold bg-paper border border-rule focus:border-signal text-ink rounded-xs"
                      />
                    </td>

                    {/* ISE 2 Input */}
                    <td className="py-2.5 px-2 text-center">
                      <input
                        type="number"
                        min={0}
                        max={20}
                        value={rec.ise2}
                        onChange={(e) => updateStudentSubjectMarks(rec.rollNo, rec.subjectCode, "ise2", Number(e.target.value))}
                        className="w-14 px-1.5 py-1 text-center font-bold bg-paper border border-rule focus:border-signal text-ink rounded-xs"
                      />
                    </td>

                    {/* ISE 3 Input */}
                    <td className="py-2.5 px-2 text-center">
                      <input
                        type="number"
                        min={0}
                        max={20}
                        value={rec.ise3}
                        onChange={(e) => updateStudentSubjectMarks(rec.rollNo, rec.subjectCode, "ise3", Number(e.target.value))}
                        className="w-14 px-1.5 py-1 text-center font-bold bg-paper border border-rule focus:border-signal text-ink rounded-xs"
                      />
                    </td>

                    {/* FA 2 Input */}
                    <td className="py-2.5 px-2 text-center">
                      <input
                        type="number"
                        min={0}
                        max={25}
                        value={rec.fa2}
                        onChange={(e) => updateStudentSubjectMarks(rec.rollNo, rec.subjectCode, "fa2", Number(e.target.value))}
                        className="w-14 px-1.5 py-1 text-center font-bold bg-paper border border-rule focus:border-signal text-ink rounded-xs"
                      />
                    </td>

                    {/* Term Work Input */}
                    <td className="py-2.5 px-2 text-center">
                      <input
                        type="number"
                        min={0}
                        max={25}
                        value={rec.termWork}
                        onChange={(e) => updateStudentSubjectMarks(rec.rollNo, rec.subjectCode, "termWork", Number(e.target.value))}
                        className="w-14 px-1.5 py-1 text-center font-bold bg-paper border border-rule focus:border-signal text-ink rounded-xs"
                      />
                    </td>

                    {/* Computed Total */}
                    <td className="py-2.5 px-3 text-center">
                      <strong className="text-sm font-bold text-ink block">{rec.totalMarks}</strong>
                      <span className="text-[10px] text-ink-soft">({rec.percentage}%)</span>
                    </td>

                    {/* Computed Grade */}
                    <td className="py-2.5 px-2 text-center">
                      <span
                        className={`inline-block px-2 py-0.5 text-xs font-bold rounded-xs border ${
                          rec.status === "Distinction"
                            ? "bg-ok/10 text-ok border-ok/30"
                            : "bg-signal/10 text-signal border-signal/30"
                        }`}
                      >
                        {rec.grade}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="py-2.5 px-3 text-right">
                      <span className="text-xs font-semibold text-ink">
                        {rec.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
