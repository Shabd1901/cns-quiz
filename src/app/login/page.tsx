"use client"

import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useAuthStore } from "@/lib/authStore"
import { useMounted } from "@/hooks/useMounted"
import { Building2, GraduationCap, ArrowRight, Sparkles } from "lucide-react"

export default function LoginPage() {
  const router = useRouter()
  const { role, student, isAuthenticated, loginAsStudent, logout } = useAuthStore()
  const mounted = useMounted()

  // Student form state
  const [studentName, setStudentName] = useState("")
  const [rollNo, setRollNo] = useState("")
  const [batch, setBatch] = useState("Batch A1")
  const [department, setDepartment] = useState("Computer Engineering (CMPN)")
  const [studentError, setStudentError] = useState("")

  // If already authenticated as student, direct immediately to profile
  useEffect(() => {
    if (mounted && isAuthenticated && role === "student") {
      router.replace("/student")
    }
  }, [mounted, isAuthenticated, role, router])

  if (!mounted) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-4">
        <div className="font-mono text-sm text-ink-soft animate-pulse">
          Loading TCET authentication...
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
      department: department.trim() || "Computer Engineering (CMPN)",
    })

    // Directly show the student profile after login
    router.push("/student")
  }

  const handleFillDemoStudent = (type: "cmpn" | "inft" = "cmpn") => {
    if (type === "inft") {
      setStudentName("Aarav Patel")
      setRollNo("21BIT015")
      setBatch("Batch IT-B")
      setDepartment("Information Technology (INFT)")
    } else {
      setStudentName("Dev Shah")
      setRollNo("21BCP042")
      setBatch("Batch A1")
      setDepartment("Computer Engineering (CMPN)")
    }
    setStudentError("")
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-12 font-sans space-y-8">
      {/* Page Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-card border border-rule font-mono text-xs text-signal font-semibold uppercase tracking-wider">
          <Building2 className="h-3.5 w-3.5" />
          <span>Thakur College of Engineering &amp; Technology · TCET LMS</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-ink">
          Student Portal Login
        </h1>
        <p className="max-w-lg mx-auto text-xs sm:text-sm text-ink-soft leading-relaxed">
          Sign in to access protected course notes, interactive laboratory simulators, and track your assessment scorecards in the campus gradebook.
        </p>
      </div>

      {/* If already authenticated, show status card */}
      {isAuthenticated && role === "student" && student && (
        <div className="bg-card border-2 border-signal p-6 rounded-sm space-y-3">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <span className="font-mono text-xs uppercase tracking-wider text-signal font-bold">
                Active Student Session
              </span>
              <h2 className="font-serif text-xl font-bold text-ink mt-0.5">
                {student.name} ({student.rollNo})
              </h2>
              <p className="font-mono text-xs text-ink-soft">
                {student.batch} · {student.department}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Link
                href="/student"
                className="px-4 py-2 bg-signal text-paper font-mono text-xs font-semibold uppercase tracking-wide hover:opacity-90 transition-opacity"
              >
                Go to My Profile →
              </Link>
              <button
                type="button"
                onClick={() => {
                  logout()
                  router.push("/")
                }}
                className="px-3 py-2 border border-rule hover:border-ink bg-paper font-mono text-xs uppercase text-ink transition-colors"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Student Login Box */}
      <div className="bg-card border-2 border-ink shadow-[6px_6px_0_var(--rule)] p-6 sm:p-8 space-y-6">
        <div className="flex items-center gap-3 border-b border-rule pb-4">
          <div className="w-10 h-10 rounded-full bg-signal/10 text-signal flex items-center justify-center font-bold text-lg shrink-0">
            <GraduationCap className="h-5 w-5" />
          </div>
          <div>
            <h2 className="font-serif text-xl font-bold text-ink">
              Student Identification
            </h2>
            <p className="font-mono text-xs text-ink-soft">
              No password required · University Roll Number verified locally
            </p>
          </div>
        </div>

        {studentError && (
          <div className="p-3 bg-bad/10 border border-bad/30 font-mono text-xs text-bad">
            {studentError}
          </div>
        )}

        <form onSubmit={handleStudentLogin} className="space-y-4">
          <div>
            <label className="block font-mono text-xs uppercase tracking-wider text-ink font-bold mb-1.5">
              Full Name *
            </label>
            <input
              type="text"
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
              placeholder="e.g. Dev Shah"
              className="w-full px-3.5 py-2.5 bg-paper border border-rule focus:border-signal focus:outline-none font-sans text-sm text-ink rounded-xs"
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
                className="w-full px-3.5 py-2.5 bg-paper border border-rule focus:border-signal focus:outline-none font-mono text-sm text-ink uppercase rounded-xs"
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
                className="w-full px-3.5 py-2.5 bg-paper border border-rule focus:border-signal focus:outline-none font-sans text-sm text-ink rounded-xs"
              />
            </div>
          </div>

          <div>
            <label className="block font-mono text-xs uppercase tracking-wider text-ink font-bold mb-1.5">
              Engineering Department
            </label>
            <select
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-paper border border-rule focus:border-signal focus:outline-none font-sans text-sm text-ink rounded-xs"
            >
              <option value="Computer Engineering (CMPN)">Computer Engineering (CMPN)</option>
              <option value="Information Technology (INFT)">Information Technology (INFT)</option>
              <option value="Artificial Intelligence & Data Science (AI&DS)">Artificial Intelligence & Data Science (AI&DS)</option>
              <option value="Artificial Intelligence & Machine Learning (AIML)">Artificial Intelligence & Machine Learning (AIML)</option>
              <option value="Internet of Things & Cyber Security (IoT)">Internet of Things & Cyber Security (IoT)</option>
              <option value="Electronics & Telecommunication (EXTC)">Electronics & Telecommunication (EXTC)</option>
            </select>
          </div>

          <div className="pt-3 border-t border-rule flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => handleFillDemoStudent("inft")}
                className="font-mono text-xs text-ok hover:underline text-left font-bold flex items-center gap-1"
              >
                <Sparkles className="h-3.5 w-3.5" />
                <span>1-Click IT Student (Aarav · 21BIT015)</span>
              </button>
              <span className="text-rule">·</span>
              <button
                type="button"
                onClick={() => handleFillDemoStudent("cmpn")}
                className="font-mono text-xs text-signal hover:underline text-left font-bold flex items-center gap-1"
              >
                <span>Dev Shah (21BCP042)</span>
              </button>
            </div>

            <button
              type="submit"
              className="w-full sm:w-auto px-6 py-2.5 bg-signal text-paper font-mono text-xs font-bold uppercase tracking-wider hover:opacity-90 transition-opacity flex items-center justify-center gap-1.5"
            >
              <span>Sign In &amp; Open Profile</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </form>
      </div>

      {/* Discrete faculty navigation link (strictly external, not a tab or credentials form) */}
      <div className="text-center font-mono text-xs text-ink-soft pt-2">
        <span>Are you a faculty examiner? </span>
        <Link href="/teacher" className="text-ink font-bold hover:text-signal underline">
          Go to Faculty Portal →
        </Link>
      </div>
    </div>
  )
}
