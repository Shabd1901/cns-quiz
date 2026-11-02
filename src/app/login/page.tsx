"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useAuthStore } from "@/lib/authStore"
import { useMounted } from "@/hooks/useMounted"
import { FacultyLoginForm } from "@/components/auth/FacultyLoginForm"

export default function LoginPage() {
  const router = useRouter()
  const { role, student, teacher, isAuthenticated, loginAsStudent, logout } =
    useAuthStore()

  const mounted = useMounted()
  const [activeTab, setActiveTab] = useState<"student" | "teacher">("student")

  // Student form state
  const [studentName, setStudentName] = useState("")
  const [rollNo, setRollNo] = useState("")
  const [batch, setBatch] = useState("Batch A1")
  const [studentError, setStudentError] = useState("")

  if (!mounted) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-4">
        <div className="font-mono text-sm text-ink-soft animate-pulse">
          Loading CNS authentication...
        </div>
      </div>
    )
  }

  const handleStudentLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setStudentError("")

    if (!studentName.trim()) {
      setStudentError("Please enter your full name.")
      return
    }
    if (!rollNo.trim()) {
      setStudentError("Please enter your student Roll Number or ID.")
      return
    }

    loginAsStudent({
      name: studentName.trim(),
      rollNo: rollNo.trim().toUpperCase(),
      batch: batch.trim() || "Batch A1",
      department: "Thakur College of Engineering & Technology (CMPN)",
    })

    router.push("/student")
  }

  const handleFillDemoStudent = () => {
    setStudentName("Dev Shah")
    setRollNo("21BCP042")
    setBatch("Batch A1")
    setStudentError("")
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 font-sans space-y-10">
      {/* Page Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-card border border-rule font-mono text-xs text-signal font-semibold uppercase tracking-wider">
          <span>🏛️</span> Thakur College of Engineering &amp; Technology · TCET LMS
        </div>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-ink">
          TCET Portal Authentication
        </h1>
        <p className="max-w-xl mx-auto text-sm text-ink-soft">
          Thakur College of Engineering and Technology Learning Management System. Log in to record student assessment marks, view personal progress, or access the Faculty Gradebook.
        </p>
      </div>

      {/* If already authenticated, show status banner */}
      {isAuthenticated && (
        <div className="bg-card border-2 border-signal p-6 rounded-sm space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <span className="font-mono text-xs uppercase tracking-wider text-signal font-bold">
                Currently Active Session
              </span>
              <h2 className="font-serif text-2xl font-bold text-ink mt-0.5">
                {role === "teacher" ? (
                  <>Faculty: {teacher?.name}</>
                ) : (
                  <>Student: {student?.name} ({student?.rollNo})</>
                )}
              </h2>
              <p className="font-mono text-xs text-ink-soft">
                Role: {role?.toUpperCase()} · {role === "teacher" ? teacher?.designation : student?.batch}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Link
                href={role === "teacher" ? "/teacher" : "/student"}
                className="px-4 py-2 bg-signal text-paper font-mono text-xs font-semibold uppercase tracking-wide hover:opacity-90 transition-opacity"
              >
                Go to {role === "teacher" ? "Teacher Portal" : "Student Dashboard"} →
              </Link>
              <button
                type="button"
                onClick={logout}
                className="px-3 py-2 border border-rule hover:border-ink bg-paper font-mono text-xs uppercase text-ink transition-colors"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Auth Card with Dual Tabs */}
      <div className="bg-card border border-rule shadow-[6px_6px_0_var(--rule)]">
        {/* Tab Selector */}
        <div className="grid grid-cols-2 border-b border-rule font-mono text-sm">
          <button
            type="button"
            onClick={() => setActiveTab("student")}
            className={`py-4 px-6 font-bold flex items-center justify-center gap-2 transition-colors ${
              activeTab === "student"
                ? "bg-paper text-signal border-b-2 border-signal"
                : "bg-card text-ink-soft hover:text-ink hover:bg-paper/50"
            }`}
          >
            <span>👨‍🎓</span>
            <span>Student Portal</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("teacher")}
            className={`py-4 px-6 font-bold flex items-center justify-center gap-2 transition-colors ${
              activeTab === "teacher"
                ? "bg-paper text-signal border-b-2 border-signal"
                : "bg-card text-ink-soft hover:text-ink hover:bg-paper/50"
            }`}
          >
            <span>👩‍🏫</span>
            <span>Faculty Portal</span>
          </button>
        </div>

        <div className="p-6 sm:p-10">
          {activeTab === "student" ? (
            /* Student Form */
            <form onSubmit={handleStudentLogin} className="space-y-6 max-w-xl mx-auto">
              <div className="space-y-1">
                <h3 className="font-serif text-2xl font-bold text-ink">
                  Student Sign In
                </h3>
                <p className="text-xs text-ink-soft">
                  Enter your university details to save your quiz attempts, track your syllabus coverage, and export verified scorecards.
                </p>
              </div>

              {studentError && (
                <div className="p-3 bg-bad/10 border border-bad/30 font-mono text-xs text-bad">
                  {studentError}
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label className="block font-mono text-xs uppercase tracking-wider text-ink font-bold mb-1.5">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                    placeholder="e.g. Dev Shah"
                    className="w-full px-3.5 py-2.5 bg-paper border border-rule focus:border-signal focus:outline-none font-sans text-sm text-ink"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-mono text-xs uppercase tracking-wider text-ink font-bold mb-1.5">
                      Roll Number / ID *
                    </label>
                    <input
                      type="text"
                      value={rollNo}
                      onChange={(e) => setRollNo(e.target.value)}
                      placeholder="e.g. 21BCP042"
                      className="w-full px-3.5 py-2.5 bg-paper border border-rule focus:border-signal focus:outline-none font-mono text-sm text-ink uppercase"
                      required
                    />
                  </div>

                  <div>
                    <label className="block font-mono text-xs uppercase tracking-wider text-ink font-bold mb-1.5">
                      Lab Batch / Div
                    </label>
                    <input
                      type="text"
                      value={batch}
                      onChange={(e) => setBatch(e.target.value)}
                      placeholder="e.g. Batch A1"
                      className="w-full px-3.5 py-2.5 bg-paper border border-rule focus:border-signal focus:outline-none font-sans text-sm text-ink"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-rule">
                <button
                  type="button"
                  onClick={handleFillDemoStudent}
                  className="w-full sm:w-auto font-mono text-xs text-ink-soft hover:text-signal underline text-left"
                >
                  ⚡ Auto-fill Demo Student (Dev Shah - 21BCP042)
                </button>
                <button
                  type="submit"
                  className="w-full sm:w-auto px-6 py-3 bg-signal text-paper font-mono text-xs font-bold uppercase tracking-wider hover:opacity-90 transition-opacity"
                >
                  Continue to Student Hub →
                </button>
              </div>
            </form>
          ) : (
            /* Proper Faculty Form */
            <FacultyLoginForm onSuccess={() => router.push("/teacher")} />
          )}
        </div>
      </div>

      {/* Feature matrix callout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
        <div className="p-5 bg-card border border-rule space-y-2">
          <h4 className="font-serif text-base font-bold text-ink flex items-center gap-2">
            <span>👨‍🎓</span> Student Capabilities
          </h4>
          <ul className="text-xs text-ink-soft space-y-1.5 list-disc pl-4 font-sans">
            <li>Takes timed assessments across 6 CNS syllabus modules.</li>
            <li>Automatic score recording linked to your Roll Number.</li>
            <li>Personal scorecard with Bloom&apos;s taxonomy accuracy breakdown.</li>
            <li>Review weak topics & access targeted flashcards.</li>
          </ul>
        </div>

        <div className="p-5 bg-card border border-rule space-y-2">
          <h4 className="font-serif text-base font-bold text-ink flex items-center gap-2">
            <span>👩‍🏫</span> Faculty Examiner Capabilities
          </h4>
          <ul className="text-xs text-ink-soft space-y-1.5 list-disc pl-4 font-sans">
            <li>Live class submission ledger with real-time score updates.</li>
            <li>Class average accuracy, pass rate, and distribution curves.</li>
            <li>One-click CSV gradebook export ready for faculty records.</li>
            <li>Simulate mock student submissions for live presentation.</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
