"use client"

import React, { useEffect, useRef } from "react"
import Link from "next/link"
import { QuizSessionSummary } from "@/lib/quiz/v2/types"
import { SYLLABUS } from "@/lib/syllabus"
import { useAuthStore } from "@/lib/authStore"
import { useQuizRecordsStore } from "@/lib/quizRecordsStore"

export function QuizResultsReport({
  summary,
  onRestart
}: {
  summary: QuizSessionSummary
  onRestart?: () => void
}) {
  const bloomLevels: ('L1' | 'L2' | 'L3' | 'L4')[] = ['L1', 'L2', 'L3', 'L4']
  const modules: ('M1' | 'M2' | 'M3' | 'M4' | 'M5' | 'M6')[] = ['M1', 'M2', 'M3', 'M4', 'M5', 'M6']

  const { role, student } = useAuthStore()
  const addSubmission = useQuizRecordsStore(state => state.addSubmission)
  const hasRecordedRef = useRef(false)

  useEffect(() => {
    if (role === "student" && student && !hasRecordedRef.current) {
      hasRecordedRef.current = true
      addSubmission({
        studentName: student.name,
        rollNo: student.rollNo,
        batch: student.batch,
        mode: summary.mode,
        modeTitle: summary.mode.toUpperCase(),
        totalQuestions: summary.totalQuestions,
        correctCount: summary.records.filter(r => r.isCorrect).length,
        accuracyRate: summary.accuracyRate,
        earnedMarks: summary.earnedMarks,
        totalMarks: summary.totalMarks,
        durationSec: summary.durationSec,
        moduleBreakdown: summary.moduleAccuracy,
      })
    }
  }, [role, student, summary, addSubmission])

  const handleExportJson = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(summary, null, 2))
    const downloadAnchor = document.createElement("a")
    downloadAnchor.setAttribute("href", dataStr)
    downloadAnchor.setAttribute("download", `cns-quiz-results-${summary.mode}-${Date.now()}.json`)
    document.body.appendChild(downloadAnchor)
    downloadAnchor.click()
    downloadAnchor.remove()
  }

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print()
    }
  }

  const missedRecords = summary.records.filter(r => !r.isCorrect)

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8 p-4 sm:p-8 font-sans">
      {/* Header Banner */}
      <div className="border-b-2 border-ink pb-6 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <span className="font-mono text-xs uppercase tracking-widest text-signal font-bold">
            Assessment Complete · Lab Notebook Report
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl text-ink font-bold mt-1">Assessment Performance</h1>
          <p className="font-mono text-xs text-ink-soft mt-1">
            Mode: {summary.mode.toUpperCase()} · Time: {Math.round(summary.durationSec / 60)}m {summary.durationSec % 60}s · {new Date(summary.timestamp).toLocaleString()}
          </p>
        </div>

        <div className="flex items-center gap-3 no-print">
          <button
            onClick={handleExportJson}
            className="px-3 py-1.5 border border-rule hover:border-ink bg-card font-mono text-xs uppercase"
          >
            Export JSON
          </button>
          <button
            onClick={handlePrint}
            className="px-3 py-1.5 border border-rule hover:border-ink bg-card font-mono text-xs uppercase"
          >
            🖨 Print Report
          </button>
          {onRestart && (
            <button
              onClick={onRestart}
              className="px-4 py-1.5 bg-ink text-paper hover:bg-signal font-mono text-xs uppercase transition-colors"
            >
              Take Another
            </button>
          )}
        </div>
      </div>

      {/* Auth Session Status Banner */}
      {role === "student" && student ? (
        <div className="bg-ok/10 border border-ok/40 p-4 rounded-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-sm font-sans no-print">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-ok text-paper text-sm font-bold shadow-sm">
              ✓
            </span>
            <div>
              <p className="font-bold text-ink">
                Attempt Recorded to Faculty Gradebook
              </p>
              <p className="text-xs text-ink-soft">
                Student: <span className="font-mono font-semibold text-ink">{student.name}</span> · Roll No: <span className="font-mono font-semibold text-ink">{student.rollNo}</span> {student.batch ? `(${student.batch})` : ""}
              </p>
            </div>
          </div>
          <Link
            href="/student"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-card border border-rule hover:border-ink font-mono text-xs text-signal font-semibold uppercase transition-colors"
          >
            My Student Profile →
          </Link>
        </div>
      ) : role === "teacher" ? (
        <div className="bg-signal/10 border border-signal/30 p-4 rounded-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-sm font-sans no-print">
          <div>
            <p className="font-bold text-ink">Previewing as Faculty Examiner</p>
            <p className="text-xs text-ink-soft">This attempt was taken while logged into the Teacher Account.</p>
          </div>
          <Link
            href="/teacher"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-ink text-paper hover:bg-signal font-mono text-xs uppercase transition-colors"
          >
            Open Teacher Portal →
          </Link>
        </div>
      ) : (
        <div className="bg-card border border-rule p-4 rounded-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-sm font-sans no-print">
          <div>
            <p className="font-semibold text-ink">Guest Assessment Session</p>
            <p className="text-xs text-ink-soft">
              This score is stored locally in your browser. Log in as a student to link future attempts to your university roll number.
            </p>
          </div>
          <Link
            href="/login"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-signal text-paper font-mono text-xs font-semibold uppercase hover:opacity-90 transition-opacity"
          >
            Login as Student →
          </Link>
        </div>
      )}

      {/* Top 3 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 bg-card border border-ink shadow-[4px_4px_0_var(--rule)]">
          <span className="font-mono text-[10px] uppercase tracking-wider text-ink-soft block font-bold">
            Overall Accuracy
          </span>
          <div className="font-serif text-4xl sm:text-5xl text-ink font-bold mt-1">
            {summary.accuracyRate}%
          </div>
          <span className="font-mono text-xs text-ink-soft mt-1 block">
            {summary.records.filter(r => r.isCorrect).length} of {summary.totalQuestions} questions correct
          </span>
        </div>

        <div className="p-5 bg-card border border-ink shadow-[4px_4px_0_var(--rule)]">
          <span className="font-mono text-[10px] uppercase tracking-wider text-ink-soft block font-bold">
            Score / Marks Earned
          </span>
          <div className="font-serif text-4xl sm:text-5xl text-signal font-bold mt-1">
            {summary.earnedMarks} <span className="text-xl sm:text-2xl text-ink font-normal">/ {summary.totalMarks}</span>
          </div>
          <span className="font-mono text-xs text-ink-soft mt-1 block">
            Weighted by syllabus difficulty marks
          </span>
        </div>

        <div className="p-5 bg-card border border-ink shadow-[4px_4px_0_var(--rule)]">
          <span className="font-mono text-[10px] uppercase tracking-wider text-ink-soft block font-bold">
            Average Speed Per Item
          </span>
          <div className="font-serif text-4xl sm:text-5xl text-ink font-bold mt-1">
            {Math.round(summary.durationSec / Math.max(1, summary.totalQuestions))}s
          </div>
          <span className="font-mono text-xs text-ink-soft mt-1 block">
            Target benchmark: 45s / question
          </span>
        </div>
      </div>

      {/* Analytics Grid: Module Accuracy & Bloom Taxonomy */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Module Accuracy (6-Row Bar Chart) */}
        <div className="p-6 bg-card border border-rule space-y-4">
          <h3 className="font-serif text-lg font-bold text-ink border-b border-rule pb-2">
            Accuracy by Module (M1 – M6)
          </h3>
          <div className="space-y-3 font-mono text-xs">
            {modules.map(modCode => {
              const stats = summary.moduleAccuracy[modCode] || { total: 0, correct: 0, rate: 0 }
              return (
                <div key={modCode} className="space-y-1">
                  <div className="flex justify-between items-center text-[11px]">
                    <span className="font-bold text-ink">{modCode}: {SYLLABUS.find(m => m.code === modCode)?.title.split(' ')[0]}</span>
                    <span className="text-ink-soft">
                      {stats.correct}/{stats.total} ({stats.rate}%)
                    </span>
                  </div>
                  <div className="h-2 w-full bg-paper border border-rule overflow-hidden">
                    <div
                      className={`h-full ${stats.rate >= 75 ? "bg-ok" : stats.rate >= 50 ? "bg-warn" : "bg-signal"}`}
                      style={{ width: `${stats.rate}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Bloom Taxonomy Mastery (L1 to L4) */}
        <div className="p-6 bg-card border border-rule space-y-4">
          <h3 className="font-serif text-lg font-bold text-ink border-b border-rule pb-2">
            Bloom Cognitive Depth (L1 – L4)
          </h3>
          <div className="space-y-3 font-mono text-xs">
            {bloomLevels.map(lvl => {
              const stats = summary.bloomAccuracy[lvl] || { total: 0, correct: 0, rate: 0 }
              const label = lvl === 'L1' ? 'Remember' : lvl === 'L2' ? 'Understand' : lvl === 'L3' ? 'Apply' : 'Analyze'
              return (
                <div key={lvl} className="space-y-1">
                  <div className="flex justify-between items-center text-[11px]">
                    <span className="font-bold text-ink">{lvl}: {label}</span>
                    <span className="text-ink-soft">
                      {stats.correct}/{stats.total} ({stats.rate}%)
                    </span>
                  </div>
                  <div className="h-2 w-full bg-paper border border-rule overflow-hidden">
                    <div
                      className="h-full bg-signal"
                      style={{ width: `${stats.rate}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Missed Questions Table with "Show me" Replay Links */}
      {missedRecords.length > 0 && (
        <div className="p-6 bg-card border border-rule space-y-4">
          <div className="flex justify-between items-center border-b border-rule pb-2">
            <h3 className="font-serif text-xl font-bold text-ink">
              Review Missed Questions ({missedRecords.length})
            </h3>
            <span className="font-mono text-xs text-ink-soft">
              Every item includes an animated figure replay step
            </span>
          </div>

          <div className="divide-y divide-rule font-sans text-xs">
            {missedRecords.map((rec, idx) => (
              <div key={idx} className="py-4 space-y-2">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <span className="font-mono text-[10px] uppercase px-1.5 py-0.5 border border-rule text-signal font-bold mr-2">
                      {rec.question.module} · {rec.question.bloom}
                    </span>
                    <strong className="text-ink text-sm font-serif">{rec.question.prompt}</strong>
                  </div>

                  {/* "Show Me" Button linking to animated figure step */}
                  <Link
                    href={`/present/${rec.question.module.toLowerCase()}/${rec.question.topicId}`}
                    className="px-3 py-1 bg-paper border border-ink font-mono text-xs text-signal hover:bg-signal hover:text-paper font-bold uppercase transition-colors shrink-0"
                  >
                    Show Me ↗
                  </Link>
                </div>

                <div className="p-3 bg-paper border border-rule font-sans text-xs text-ink-soft">
                  <strong className="text-ink font-bold block mb-1">Cryptographic Explanation:</strong>
                  {rec.question.explanation}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recommended Next Lessons */}
      <div className="p-6 bg-paper border-2 border-ink space-y-4">
        <h3 className="font-serif text-xl font-bold text-ink">Recommended Next Study Plates</h3>
        <p className="font-sans text-xs text-ink-soft">
          Based on missed question patterns, revise the following syllabus topic plates:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono text-xs">
          <Link
            href="/present/m1/caesar"
            className="p-3 bg-card border border-rule hover:border-ink flex justify-between items-center transition-all"
          >
            <div>
              <span className="text-signal font-bold block">M1: Caesar & Monoalphabetic</span>
              <span className="text-ink-soft text-[10px]">9 Plates · Process Scene & Frequency Attack</span>
            </div>
            <span>→</span>
          </Link>
          <Link
            href="/present/m1/playfair"
            className="p-3 bg-card border border-rule hover:border-ink flex justify-between items-center transition-all"
          >
            <div>
              <span className="text-signal font-bold block">M1: Playfair Digraphic Cipher</span>
              <span className="text-ink-soft text-[10px]">6 Plates · 5×5 Matrix State Grid</span>
            </div>
            <span>→</span>
          </Link>
        </div>
      </div>
    </div>
  )
}
