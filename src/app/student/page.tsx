"use client"

import React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/lib/authStore"
import { useQuizRecordsStore } from "@/lib/quizRecordsStore"
import { useMounted } from "@/hooks/useMounted"

export default function StudentPortalPage() {
  const router = useRouter()
  const { role, student, isAuthenticated, logout } = useAuthStore()
  const { submissions } = useQuizRecordsStore()
  const mounted = useMounted()

  if (!mounted) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-4">
        <div className="font-mono text-sm text-ink-soft animate-pulse">
          Loading student dashboard...
        </div>
      </div>
    )
  }

  // Not logged in or logged in as teacher
  if (!isAuthenticated || role !== "student" || !student) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 font-sans text-center space-y-6">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-signal/10 text-signal text-2xl font-bold">
          👨‍🎓
        </div>
        <h1 className="font-serif text-3xl font-bold text-ink">
          Student Portal Access Required
        </h1>
        <p className="text-sm text-ink-soft max-w-md mx-auto">
          Please log in with your Name and Roll Number to view your personal assessment records, quiz scorecards, and learning progress.
        </p>
        <div className="flex items-center justify-center gap-4 pt-2">
          <Link
            href="/login"
            className="px-6 py-2.5 bg-signal text-paper font-mono text-xs font-bold uppercase tracking-wider hover:opacity-90 transition-opacity"
          >
            Go to Student Login →
          </Link>
          <Link
            href="/quiz"
            className="px-5 py-2.5 border border-rule hover:border-ink bg-card font-mono text-xs uppercase text-ink transition-colors"
          >
            Take Quiz as Guest
          </Link>
        </div>
      </div>
    )
  }

  // Filter submissions for this student
  const studentSubmissions = submissions.filter(
    (s) =>
      s.rollNo.toUpperCase() === student.rollNo.toUpperCase() ||
      s.studentName.toLowerCase() === student.name.toLowerCase()
  )

  const totalAttempts = studentSubmissions.length
  const avgAccuracy =
    totalAttempts > 0
      ? Math.round(
          studentSubmissions.reduce((acc, curr) => acc + curr.accuracyRate, 0) /
            totalAttempts
        )
      : 0
  const totalEarnedMarks = studentSubmissions.reduce(
    (acc, curr) => acc + curr.earnedMarks,
    0
  )
  const totalPossibleMarks = studentSubmissions.reduce(
    (acc, curr) => acc + curr.totalMarks,
    0
  )
  const bestScore =
    totalAttempts > 0
      ? Math.max(...studentSubmissions.map((s) => s.accuracyRate))
      : 0

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 font-sans space-y-8">
      {/* Student Profile Header */}
      <div className="bg-card border-2 border-ink p-6 sm:p-8 shadow-[6px_6px_0_var(--rule)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 bg-signal text-paper font-mono text-[11px] font-bold uppercase tracking-wider">
              Student Profile
            </span>
            <span className="font-mono text-xs text-ink-soft">
              {student.department || "Computer Science & Engineering"}
            </span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-ink pt-1">
            {student.name}
          </h1>
          <p className="font-mono text-xs text-ink-soft flex items-center gap-4">
            <span>Roll No: <strong className="text-ink font-semibold">{student.rollNo}</strong></span>
            <span>Batch: <strong className="text-ink font-semibold">{student.batch || "A1"}</strong></span>
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/quiz"
            className="px-4 py-2 bg-ink text-paper hover:bg-signal font-mono text-xs uppercase tracking-wider transition-colors"
          >
            Launch Assessment 🚀
          </Link>
          <button
            type="button"
            onClick={() => {
              logout()
              router.push("/login")
            }}
            className="px-3.5 py-2 border border-rule hover:border-ink bg-paper font-mono text-xs uppercase text-ink transition-colors"
          >
            Sign Out
          </button>
        </div>
      </div>

      {/* Top Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 bg-card border border-rule">
          <span className="font-mono text-[10px] uppercase tracking-wider text-ink-soft block font-bold">
            Total Assessments
          </span>
          <div className="font-serif text-3xl sm:text-4xl text-ink font-bold mt-1">
            {totalAttempts}
          </div>
          <span className="font-mono text-[11px] text-ink-soft mt-0.5 block">
            Recorded in Gradebook
          </span>
        </div>

        <div className="p-4 bg-card border border-rule">
          <span className="font-mono text-[10px] uppercase tracking-wider text-ink-soft block font-bold">
            Average Accuracy
          </span>
          <div className="font-serif text-3xl sm:text-4xl text-signal font-bold mt-1">
            {avgAccuracy}%
          </div>
          <span className="font-mono text-[11px] text-ink-soft mt-0.5 block">
            Across all attempts
          </span>
        </div>

        <div className="p-4 bg-card border border-rule">
          <span className="font-mono text-[10px] uppercase tracking-wider text-ink-soft block font-bold">
            Marks Earned
          </span>
          <div className="font-serif text-3xl sm:text-4xl text-ink font-bold mt-1">
            {totalEarnedMarks}
            <span className="text-base text-ink-soft font-normal ml-1">
              / {totalPossibleMarks || 0}
            </span>
          </div>
          <span className="font-mono text-[11px] text-ink-soft mt-0.5 block">
            Cumulative marks
          </span>
        </div>

        <div className="p-4 bg-card border border-rule">
          <span className="font-mono text-[10px] uppercase tracking-wider text-ink-soft block font-bold">
            Personal Best
          </span>
          <div className="font-serif text-3xl sm:text-4xl text-ok font-bold mt-1">
            {bestScore}%
          </div>
          <span className="font-mono text-[11px] text-ink-soft mt-0.5 block">
            Top quiz score
          </span>
        </div>
      </div>

      {/* Assessment History Table */}
      <div className="bg-card border border-rule space-y-4 p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-rule pb-4">
          <div>
            <h2 className="font-serif text-xl font-bold text-ink">
              My Assessment History
            </h2>
            <p className="text-xs text-ink-soft">
              Every quiz completed while logged in is permanently catalogued for examiner review.
            </p>
          </div>
          <Link
            href="/quiz"
            className="font-mono text-xs text-signal font-semibold hover:underline"
          >
            + Start New Assessment
          </Link>
        </div>

        {studentSubmissions.length === 0 ? (
          <div className="text-center py-12 space-y-3 font-sans">
            <p className="font-mono text-sm text-ink-soft">
              No quiz attempts recorded yet for {student.name}.
            </p>
            <Link
              href="/quiz"
              className="inline-block px-5 py-2 bg-signal text-paper font-mono text-xs uppercase font-bold hover:opacity-90"
            >
              Take Your First Quiz Now
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left font-sans text-xs">
              <thead>
                <tr className="border-b border-rule font-mono text-[11px] uppercase tracking-wider text-ink-soft">
                  <th className="py-2.5 px-3">Date</th>
                  <th className="py-2.5 px-3">Quiz Mode</th>
                  <th className="py-2.5 px-3">Questions</th>
                  <th className="py-2.5 px-3">Accuracy</th>
                  <th className="py-2.5 px-3">Marks</th>
                  <th className="py-2.5 px-3">Time</th>
                  <th className="py-2.5 px-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-rule font-mono">
                {studentSubmissions.map((sub) => {
                  const isDistinction = sub.accuracyRate >= 85
                  const isPass = sub.accuracyRate >= 60

                  return (
                    <tr key={sub.id} className="hover:bg-paper/60 transition-colors">
                      <td className="py-3 px-3 text-ink-soft whitespace-nowrap">
                        {new Date(sub.timestamp).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-3 font-sans font-medium text-ink">
                        {sub.modeTitle || sub.mode}
                      </td>
                      <td className="py-3 px-3 text-ink">
                        {sub.correctCount} / {sub.totalQuestions}
                      </td>
                      <td className="py-3 px-3 font-bold text-ink">
                        <span
                          className={
                            isDistinction
                              ? "text-ok"
                              : isPass
                              ? "text-signal"
                              : "text-bad"
                          }
                        >
                          {sub.accuracyRate}%
                        </span>
                      </td>
                      <td className="py-3 px-3 text-ink">
                        {sub.earnedMarks} / {sub.totalMarks}
                      </td>
                      <td className="py-3 px-3 text-ink-soft">
                        {Math.floor(sub.durationSec / 60)}m {sub.durationSec % 60}s
                      </td>
                      <td className="py-3 px-3 text-right">
                        <span
                          className={`inline-block px-2 py-0.5 text-[10px] font-bold uppercase rounded-sm ${
                            isDistinction
                              ? "bg-ok/10 text-ok border border-ok/30"
                              : isPass
                              ? "bg-signal/10 text-signal border border-signal/30"
                              : "bg-bad/10 text-bad border border-bad/30"
                          }`}
                        >
                          {isDistinction ? "Distinction" : isPass ? "Pass" : "Review"}
                        </span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Recommended Next Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Link
          href="/quiz"
          className="p-5 bg-card border border-rule hover:border-signal transition-colors group block"
        >
          <span className="text-xl block mb-2">🎯</span>
          <h3 className="font-serif text-base font-bold text-ink group-hover:text-signal">
            Take Timed Exam Challenge
          </h3>
          <p className="text-xs text-ink-soft mt-1">
            Simulate 20-question comprehensive exam with questions from all 6 syllabus modules.
          </p>
        </Link>

        <Link
          href="/revision"
          className="p-5 bg-card border border-rule hover:border-signal transition-colors group block"
        >
          <span className="text-xl block mb-2">📖</span>
          <h3 className="font-serif text-base font-bold text-ink group-hover:text-signal">
            Open Revision Hub
          </h3>
          <p className="text-xs text-ink-soft mt-1">
            Access formula cheat sheets, 50+ viva defense questions, and algorithm comparisons.
          </p>
        </Link>

        <Link
          href="/modules/crypto"
          className="p-5 bg-card border border-rule hover:border-signal transition-colors group block"
        >
          <span className="text-xl block mb-2">🔬</span>
          <h3 className="font-serif text-base font-bold text-ink group-hover:text-signal">
            Interactive Simulators
          </h3>
          <p className="text-xs text-ink-soft mt-1">
            Practice live cipher steps: AES State Matrix, Feistel network, RSA key derivation.
          </p>
        </Link>
      </div>
    </div>
  )
}
