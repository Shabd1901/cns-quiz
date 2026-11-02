"use client"

import React, { useState, useMemo } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/lib/authStore"
import {
  useQuizRecordsStore,
  QuizSubmission,
  downloadSubmissionsCSV,
} from "@/lib/quizRecordsStore"
import { SYLLABUS } from "@/lib/syllabus"
import { useMounted } from "@/hooks/useMounted"

export default function TeacherPortalPage() {
  const router = useRouter()
  const { role, teacher, isAuthenticated, loginAsTeacher, logout } = useAuthStore()
  const {
    submissions,
    deleteSubmission,
    resetToDefaultSubmissions,
    clearAllSubmissions,
    addMockSubmission,
  } = useQuizRecordsStore()

  const mounted = useMounted()
  const [pinInput, setPinInput] = useState("")
  const [pinError, setPinError] = useState("")

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedMode, setSelectedMode] = useState<string>("all")
  const [sortBy, setSortBy] = useState<"date" | "accuracy" | "marks">("date")
  const [selectedSubmission, setSelectedSubmission] = useState<QuizSubmission | null>(null)
  const [showClearConfirm, setShowClearConfirm] = useState(false)

  // Filtered & Sorted submissions (unconditionally declared at top level)
  const filteredSubmissions = useMemo(() => {
    let list = submissions.filter((sub) => {
      const matchQuery =
        sub.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        sub.rollNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (sub.batch && sub.batch.toLowerCase().includes(searchQuery.toLowerCase()))

      const matchMode =
        selectedMode === "all" ||
        sub.mode === selectedMode ||
        (sub.modeTitle && sub.modeTitle.toLowerCase().includes(selectedMode.toLowerCase()))

      return matchQuery && matchMode
    })

    if (sortBy === "date") {
      list = [...list].sort((a, b) => b.timestamp - a.timestamp)
    } else if (sortBy === "accuracy") {
      list = [...list].sort((a, b) => b.accuracyRate - a.accuracyRate)
    } else if (sortBy === "marks") {
      list = [...list].sort((a, b) => b.earnedMarks - a.earnedMarks)
    }

    return list
  }, [submissions, searchQuery, selectedMode, sortBy])

  // Class KPI calculations
  const totalSubmissions = submissions.length
  const avgClassAccuracy =
    totalSubmissions > 0
      ? Math.round(
          submissions.reduce((acc, curr) => acc + curr.accuracyRate, 0) /
            totalSubmissions
        )
      : 0
  const passingCount = submissions.filter((s) => s.accuracyRate >= 60).length
  const passRate =
    totalSubmissions > 0 ? Math.round((passingCount / totalSubmissions) * 100) : 0
  const distinctionCount = submissions.filter((s) => s.accuracyRate >= 85).length
  const distinctionRate =
    totalSubmissions > 0 ? Math.round((distinctionCount / totalSubmissions) * 100) : 0

  if (!mounted) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-4">
        <div className="font-mono text-sm text-ink-soft animate-pulse">
          Loading Faculty Portal...
        </div>
      </div>
    )
  }

  // If not logged in as teacher, show quick unlock box
  if (!isAuthenticated || role !== "teacher") {
    const handleQuickUnlock = (e: React.FormEvent) => {
      e.preventDefault()
      setPinError("")
      const res = loginAsTeacher(pinInput)
      if (!res.success) {
        setPinError(res.error || "Incorrect faculty PIN.")
      }
    }

    return (
      <div className="max-w-md mx-auto px-4 py-16 font-sans space-y-6">
        <div className="bg-card border-2 border-ink p-8 shadow-[6px_6px_0_var(--rule)] space-y-5">
          <div className="text-center space-y-2">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-signal/10 text-signal text-xl font-bold">
              👩‍🏫
            </div>
            <h1 className="font-serif text-2xl font-bold text-ink">
              Faculty Portal Gate
            </h1>
            <p className="text-xs text-ink-soft">
              This area is reserved for course instructors, examiners, and evaluators. Please enter your faculty PIN to proceed.
            </p>
          </div>

          <form onSubmit={handleQuickUnlock} className="space-y-4">
            {pinError && (
              <div className="p-3 bg-bad/10 border border-bad/30 font-mono text-xs text-bad">
                {pinError}
              </div>
            )}

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="font-mono text-xs uppercase tracking-wider text-ink font-bold">
                  Security PIN
                </label>
                <span className="font-mono text-[11px] text-signal font-semibold">
                  Default: <code className="bg-paper px-1 border border-rule">cns2026</code>
                </span>
              </div>
              <input
                type="password"
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                placeholder="Enter PIN (e.g. cns2026)"
                className="w-full px-3.5 py-2.5 bg-paper border border-rule focus:border-signal focus:outline-none font-mono text-sm text-ink tracking-widest text-center"
                autoFocus
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-ink text-paper hover:bg-signal font-mono text-xs uppercase font-bold tracking-wider transition-colors"
            >
              Unlock Faculty Gradebook →
            </button>
          </form>

          <div className="pt-2 text-center border-t border-rule">
            <button
              type="button"
              onClick={() => {
                setPinInput("cns2026")
                loginAsTeacher("cns2026")
              }}
              className="font-mono text-xs text-ink-soft hover:text-signal underline"
            >
              ⚡ Click here for 1-click viva examiner demo bypass
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 font-sans space-y-8">
      {/* Top Faculty Header */}
      <div className="bg-card border-2 border-ink p-6 sm:p-8 shadow-[6px_6px_0_var(--rule)] space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-rule pb-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 bg-signal text-paper font-mono text-[11px] font-bold uppercase tracking-wider">
                Instructor Gradebook
              </span>
              <span className="font-mono text-xs text-ink-soft">
                Cryptography & Network Security Laboratory
              </span>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-ink pt-1.5">
              {teacher?.name || "Faculty Examiner"}
            </h1>
            <p className="font-mono text-xs text-ink-soft">
              {teacher?.designation} · {teacher?.department}
            </p>
          </div>

          {/* Action Toolbar */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={() => downloadSubmissionsCSV(submissions)}
              className="px-3.5 py-2 bg-ink text-paper hover:bg-signal font-mono text-xs uppercase font-bold tracking-wider transition-colors inline-flex items-center gap-1.5"
              title="Download CSV of all student scores"
            >
              <span>📥</span> Export CSV
            </button>

            <button
              type="button"
              onClick={() => addMockSubmission()}
              className="px-3.5 py-2 bg-card border border-rule hover:border-ink font-mono text-xs uppercase text-ink transition-colors inline-flex items-center gap-1.5"
              title="Add a sample student submission live"
            >
              <span>⚡</span> + Demo Submission
            </button>

            <button
              type="button"
              onClick={resetToDefaultSubmissions}
              className="px-3 py-2 border border-rule hover:border-ink bg-paper font-mono text-xs uppercase text-ink-soft hover:text-ink transition-colors"
              title="Restore initial class records"
            >
              Reset Data
            </button>

            <button
              type="button"
              onClick={() => {
                logout()
                router.push("/login")
              }}
              className="px-3 py-2 border border-rule hover:border-bad bg-paper font-mono text-xs uppercase text-bad transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>

        {/* KPI Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-4 bg-paper border border-rule">
            <span className="font-mono text-[10px] uppercase tracking-wider text-ink-soft block font-bold">
              Total Submissions
            </span>
            <div className="font-serif text-3xl sm:text-4xl text-ink font-bold mt-1">
              {totalSubmissions}
            </div>
            <span className="font-mono text-[11px] text-ink-soft mt-0.5 block">
              Active ledger entries
            </span>
          </div>

          <div className="p-4 bg-paper border border-rule">
            <span className="font-mono text-[10px] uppercase tracking-wider text-ink-soft block font-bold">
              Class Avg Accuracy
            </span>
            <div className="font-serif text-3xl sm:text-4xl text-signal font-bold mt-1">
              {avgClassAccuracy}%
            </div>
            <span className="font-mono text-[11px] text-ink-soft mt-0.5 block">
              Benchmark: 70% target
            </span>
          </div>

          <div className="p-4 bg-paper border border-rule">
            <span className="font-mono text-[10px] uppercase tracking-wider text-ink-soft block font-bold">
              Passing Rate
            </span>
            <div className="font-serif text-3xl sm:text-4xl text-ok font-bold mt-1">
              {passRate}%
            </div>
            <span className="font-mono text-[11px] text-ink-soft mt-0.5 block">
              Score ≥ 60% ({passingCount}/{totalSubmissions})
            </span>
          </div>

          <div className="p-4 bg-paper border border-rule">
            <span className="font-mono text-[10px] uppercase tracking-wider text-ink-soft block font-bold">
              Distinction Rate
            </span>
            <div className="font-serif text-3xl sm:text-4xl text-ink font-bold mt-1">
              {distinctionRate}%
            </div>
            <span className="font-mono text-[11px] text-ink-soft mt-0.5 block">
              Score ≥ 85% ({distinctionCount}/{totalSubmissions})
            </span>
          </div>
        </div>
      </div>

      {/* Main Ledger Section */}
      <div className="bg-card border border-rule space-y-5 p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="font-serif text-2xl font-bold text-ink">
              Student Assessment Gradebook
            </h2>
            <p className="text-xs text-ink-soft">
              Real-time student quiz logs recorded across all terminal stations.
            </p>
          </div>

          {/* Search & Mode Filters */}
          <div className="flex flex-wrap items-center gap-3">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search Name or Roll No..."
              className="px-3 py-1.5 bg-paper border border-rule focus:border-signal focus:outline-none font-mono text-xs text-ink w-48 sm:w-60"
            />

            <select
              value={selectedMode}
              onChange={(e) => setSelectedMode(e.target.value)}
              className="px-2.5 py-1.5 bg-paper border border-rule focus:border-signal font-mono text-xs text-ink"
            >
              <option value="all">All Quiz Modes</option>
              <option value="exam-challenge">Exam Challenge</option>
              <option value="classroom">Classroom Rapid Fire</option>
              <option value="numerical-lab">Numerical Lab</option>
              <option value="viva-mode">Viva Voce Mode</option>
              <option value="self-test">Self Test</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as "date" | "accuracy" | "marks")}
              className="px-2.5 py-1.5 bg-paper border border-rule focus:border-signal font-mono text-xs text-ink"
            >
              <option value="date">Sort: Latest First</option>
              <option value="accuracy">Sort: Highest Accuracy</option>
              <option value="marks">Sort: Highest Marks</option>
            </select>
          </div>
        </div>

        {/* Table of Submissions */}
        {filteredSubmissions.length === 0 ? (
          <div className="text-center py-12 space-y-2">
            <p className="font-mono text-sm text-ink-soft">
              No submissions match the current filter or search criteria.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery("")
                setSelectedMode("all")
              }}
              className="font-mono text-xs text-signal underline"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto border border-rule">
            <table className="w-full text-left font-sans text-xs">
              <thead>
                <tr className="bg-paper border-b border-rule font-mono text-[11px] uppercase tracking-wider text-ink-soft">
                  <th className="py-3 px-3">Student / Roll No</th>
                  <th className="py-3 px-3">Batch</th>
                  <th className="py-3 px-3">Mode</th>
                  <th className="py-3 px-3 text-center">Correct</th>
                  <th className="py-3 px-3 text-center">Accuracy</th>
                  <th className="py-3 px-3 text-center">Marks</th>
                  <th className="py-3 px-3">Duration</th>
                  <th className="py-3 px-3">Time</th>
                  <th className="py-3 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-rule font-mono">
                {filteredSubmissions.map((sub) => {
                  const isDistinction = sub.accuracyRate >= 85
                  const isPass = sub.accuracyRate >= 60

                  return (
                    <tr
                      key={sub.id}
                      className="hover:bg-paper/70 transition-colors cursor-pointer"
                      onClick={() => setSelectedSubmission(sub)}
                    >
                      <td className="py-3 px-3">
                        <div className="font-sans font-bold text-ink text-sm">
                          {sub.studentName}
                        </div>
                        <div className="text-[11px] text-ink-soft">
                          {sub.rollNo}
                        </div>
                      </td>

                      <td className="py-3 px-3 text-ink-soft whitespace-nowrap">
                        {sub.batch || "A1"}
                      </td>

                      <td className="py-3 px-3 font-sans font-medium text-ink max-w-[160px] truncate">
                        {sub.modeTitle || sub.mode}
                      </td>

                      <td className="py-3 px-3 text-center text-ink">
                        {sub.correctCount} / {sub.totalQuestions}
                      </td>

                      <td className="py-3 px-3 text-center font-bold">
                        <span
                          className={`inline-block px-2 py-0.5 rounded-sm text-xs ${
                            isDistinction
                              ? "bg-ok/10 text-ok border border-ok/30"
                              : isPass
                              ? "bg-signal/10 text-signal border border-signal/30"
                              : "bg-bad/10 text-bad border border-bad/30"
                          }`}
                        >
                          {sub.accuracyRate}%
                        </span>
                      </td>

                      <td className="py-3 px-3 text-center font-bold text-ink">
                        {sub.earnedMarks} <span className="text-ink-soft font-normal text-[11px]">/ {sub.totalMarks}</span>
                      </td>

                      <td className="py-3 px-3 text-ink-soft whitespace-nowrap">
                        {Math.floor(sub.durationSec / 60)}m {sub.durationSec % 60}s
                      </td>

                      <td className="py-3 px-3 text-ink-soft text-[11px] whitespace-nowrap">
                        {new Date(sub.timestamp).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })} · {new Date(sub.timestamp).toLocaleDateString([], {
                          month: "short",
                          day: "numeric",
                        })}
                      </td>

                      <td className="py-3 px-3 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => setSelectedSubmission(sub)}
                            className="p-1 hover:text-signal text-ink-soft text-[11px] font-mono"
                            title="Inspect Module Breakdown"
                          >
                            Inspect
                          </button>
                          <button
                            type="button"
                            onClick={() => deleteSubmission(sub.id)}
                            className="p-1 hover:text-bad text-ink-soft text-xs"
                            title="Delete Record"
                          >
                            ✕
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between text-xs text-ink-soft font-mono pt-2 gap-2">
          <span>
            Showing {filteredSubmissions.length} of {totalSubmissions} submissions.
          </span>
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setShowClearConfirm(true)}
              className="text-bad hover:underline"
            >
              Purge All Submissions
            </button>
          </div>
        </div>
      </div>

      {/* Syllabus Module Overview Matrix */}
      <div className="bg-card border border-rule p-6 space-y-4">
        <div className="border-b border-rule pb-3">
          <h3 className="font-serif text-lg font-bold text-ink">
            CNS Syllabus Modules Covered
          </h3>
          <p className="text-xs text-ink-soft">
            All 6 curriculum units mapped to Bloom&apos;s Taxonomy levels and interactive simulators.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {SYLLABUS.map((mod) => (
            <div
              key={mod.id}
              className="p-4 bg-paper border border-rule space-y-2 flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between items-center text-xs font-mono">
                  <span className="font-bold text-signal">{mod.code}</span>
                  <span className="text-ink-soft">{mod.bloomRange} · {mod.hours}h</span>
                </div>
                <h4 className="font-serif font-bold text-ink text-sm mt-1">
                  {mod.title}
                </h4>
                <p className="text-xs text-ink-soft line-clamp-2 mt-1">
                  {mod.description}
                </p>
              </div>

              <div className="pt-2 border-t border-rule/60 flex items-center justify-between text-xs font-mono">
                <span className="text-ink-soft">{mod.topics.length} topics</span>
                <Link
                  href={`/modules/${mod.id === "m1" ? "crypto" : mod.id === "m2" ? "tls" : mod.id === "m3" ? "auth" : mod.id === "m4" ? "firewall" : mod.id === "m5" ? "ids" : "ai"}`}
                  className="text-signal hover:underline"
                >
                  Explore Lab →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Classroom Quick Launch Tools for Examiner */}
      <div className="bg-card border border-rule p-6 space-y-4">
        <h3 className="font-serif text-lg font-bold text-ink">
          Examiner Classroom Quick Actions
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link
            href="/present/m1/principles"
            className="p-4 bg-paper border border-rule hover:border-signal transition-colors group block"
          >
            <span className="text-lg block mb-1">📽️</span>
            <h4 className="font-serif text-sm font-bold text-ink group-hover:text-signal">
              Lecture Presentation Mode
            </h4>
            <p className="text-xs text-ink-soft mt-1">
              Fullscreen projector view with keyboard slide navigation and interactive diagrams.
            </p>
          </Link>

          <Link
            href="/quiz/classroom/play"
            className="p-4 bg-paper border border-rule hover:border-signal transition-colors group block"
          >
            <span className="text-lg block mb-1">⚡</span>
            <h4 className="font-serif text-sm font-bold text-ink group-hover:text-signal">
              Rapid Fire Team Challenge
            </h4>
            <p className="text-xs text-ink-soft mt-1">
              Live split-screen team mode with countdown timer for classroom competition.
            </p>
          </Link>

          <Link
            href="/quiz/viva-mode/play"
            className="p-4 bg-paper border border-rule hover:border-signal transition-colors group block"
          >
            <span className="text-lg block mb-1">🎙️</span>
            <h4 className="font-serif text-sm font-bold text-ink group-hover:text-signal">
              Viva Voce Defense
            </h4>
            <p className="text-xs text-ink-soft mt-1">
              Oral defense questions with hidden model answers and self/examiner rating buttons.
            </p>
          </Link>
        </div>
      </div>

      {/* Detail Modal for Selected Submission */}
      {selectedSubmission && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-card border-2 border-ink max-w-lg w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start border-b border-rule pb-3">
              <div>
                <span className="font-mono text-xs text-signal font-bold uppercase">
                  Submission Detail
                </span>
                <h3 className="font-serif text-2xl font-bold text-ink">
                  {selectedSubmission.studentName}
                </h3>
                <p className="font-mono text-xs text-ink-soft">
                  Roll No: {selectedSubmission.rollNo} · {selectedSubmission.batch || "A1"}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedSubmission(null)}
                className="text-ink-soft hover:text-ink text-xl font-mono"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 font-mono text-xs">
              <div className="p-3 bg-paper border border-rule">
                <span className="text-ink-soft block text-[10px] uppercase">Mode</span>
                <span className="font-bold text-ink">{selectedSubmission.modeTitle}</span>
              </div>
              <div className="p-3 bg-paper border border-rule">
                <span className="text-ink-soft block text-[10px] uppercase">Accuracy</span>
                <span className="font-bold text-signal text-base">{selectedSubmission.accuracyRate}%</span>
              </div>
              <div className="p-3 bg-paper border border-rule">
                <span className="text-ink-soft block text-[10px] uppercase">Marks</span>
                <span className="font-bold text-ink text-base">{selectedSubmission.earnedMarks} / {selectedSubmission.totalMarks}</span>
              </div>
              <div className="p-3 bg-paper border border-rule">
                <span className="text-ink-soft block text-[10px] uppercase">Duration</span>
                <span className="font-bold text-ink">{Math.floor(selectedSubmission.durationSec / 60)}m {selectedSubmission.durationSec % 60}s</span>
              </div>
            </div>

            {selectedSubmission.moduleBreakdown && (
              <div className="space-y-2 border-t border-rule pt-3">
                <h4 className="font-serif font-bold text-sm text-ink">
                  Module Accuracy Breakdown
                </h4>
                <div className="space-y-1.5 font-mono text-xs">
                  {Object.entries(selectedSubmission.moduleBreakdown).map(
                    ([mod, stats]) => (
                      <div
                        key={mod}
                        className="flex justify-between items-center p-2 bg-paper border border-rule text-[11px]"
                      >
                        <span className="font-bold text-ink">{mod}</span>
                        <span>{stats.correct} / {stats.total} ({stats.rate}%)</span>
                      </div>
                    )
                  )}
                </div>
              </div>
            )}

            <div className="pt-2 flex justify-end gap-2 border-t border-rule">
              <button
                type="button"
                onClick={() => setSelectedSubmission(null)}
                className="px-4 py-1.5 bg-ink text-paper hover:bg-signal font-mono text-xs uppercase"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal for Clear All */}
      {showClearConfirm && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-card border-2 border-bad max-w-sm w-full p-6 shadow-2xl space-y-4">
            <h3 className="font-serif text-xl font-bold text-bad">
              Confirm Purge
            </h3>
            <p className="text-xs text-ink-soft">
              Are you sure you want to delete all student submissions from this local browser session? This cannot be undone.
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowClearConfirm(false)}
                className="px-3 py-1.5 border border-rule text-xs font-mono"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  clearAllSubmissions()
                  setShowClearConfirm(false)
                }}
                className="px-3 py-1.5 bg-bad text-paper text-xs font-mono uppercase font-bold"
              >
                Purge All
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
