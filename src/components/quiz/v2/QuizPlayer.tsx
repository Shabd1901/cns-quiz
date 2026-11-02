"use client"

import React, { useState, useEffect, useCallback, useRef } from "react"
import { useRouter } from "next/navigation"
import {
  Question,
  QuizModeId,
  QuestionAnswerRecord,
  QuizSessionSummary,
  TeamScore,
  VivaResponseRecord,
  ModuleCode,
  BloomLevel,
  McqQuestion,
  MultiQuestion,
  NumericQuestion,
  OrderQuestion,
  MatchQuestion,
  LabelQuestion,
  SpotQuestion,
  FillQuestion,
  TfWhyQuestion
} from "@/lib/quiz/v2/types"
import {
  McqRenderer,
  MultiRenderer,
  NumericRenderer,
  OrderRenderer,
  MatchRenderer,
  LabelRenderer,
  SpotRenderer,
  FillRenderer,
  TfWhyRenderer
} from "./QuestionComponents"
import { QuizResultsReport } from "./QuizResultsReport"
import { generateFullSyllabusMockTest, filterQuestions } from "@/lib/quiz/v2/mockTest"

export function QuizPlayer({
  mode,
  questions,
  teams = [
    { id: 't1', name: 'Alpha Squad', score: 0, answersGiven: 0 },
    { id: 't2', name: 'Beta Cipher', score: 0, answersGiven: 0 }
  ]
}: {
  mode: QuizModeId
  questions: Question[]
  teams?: TeamScore[]
}) {
  const router = useRouter()

  const [activeQuestions, setActiveQuestions] = useState<Question[]>(questions)
  const [filterModule, setFilterModule] = useState<ModuleCode | 'ALL'>('ALL')
  const [filterBloom, setFilterBloom] = useState<BloomLevel | 'ALL'>('ALL')
  const [filterDiff, setFilterDiff] = useState<1 | 2 | 3 | 'ALL'>('ALL')
  const [isMockTest, setIsMockTest] = useState(false)

  const [currentIndex, setCurrentIndex] = useState(0)
  const [activeTeamIndex, setActiveTeamIndex] = useState(0)
  const [teamScores, setTeamScores] = useState<TeamScore[]>(teams)
  const [userAnswer, setUserAnswer] = useState<unknown>(null)
  const [isRevealed, setIsRevealed] = useState(false)
  const [timeLeft, setTimeLeft] = useState(questions[0]?.timeSec || 45)
  const [records, setRecords] = useState<QuestionAnswerRecord[]>([])
  const [vivaRecords, setVivaRecords] = useState<VivaResponseRecord[]>([])
  const [isFinished, setIsFinished] = useState(false)
  const [sessionSummary, setSessionSummary] = useState<QuizSessionSummary | null>(null)

  const currentQuestion = activeQuestions[currentIndex] || activeQuestions[0] || questions[0]
  const totalDurationRef = useRef(0)

  const handleFilterChange = (mod: ModuleCode | 'ALL', blm: BloomLevel | 'ALL', diff: 1 | 2 | 3 | 'ALL') => {
    setIsMockTest(false)
    setFilterModule(mod)
    setFilterBloom(blm)
    setFilterDiff(diff)
    const filtered = filterQuestions({ module: mod, bloom: blm, difficulty: diff })
    const nextList = filtered.length > 0 ? filtered : questions
    setActiveQuestions(nextList)
    setCurrentIndex(0)
    setUserAnswer(null)
    setIsRevealed(false)
    setRecords([])
    setTimeLeft(nextList[0]?.timeSec || 45)
  }

  const handleLaunchMockTest = () => {
    setIsMockTest(true)
    setFilterModule('ALL')
    setFilterBloom('ALL')
    setFilterDiff('ALL')
    const mockList = generateFullSyllabusMockTest()
    setActiveQuestions(mockList)
    setCurrentIndex(0)
    setUserAnswer(null)
    setIsRevealed(false)
    setRecords([])
    setTimeLeft(mockList[0]?.timeSec || 45)
  }

  // Timer countdown
  useEffect(() => {
    if (isFinished || isRevealed) return
    const timer = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          setIsRevealed(true)
          return 0
        }
        return t - 1
      })
      totalDurationRef.current += 1
    }, 1000)
    return () => clearInterval(timer)
  }, [isFinished, isRevealed])

  // Check correctness of answer
  const evaluateAnswer = useCallback((): boolean => {
    if (!currentQuestion) return false

    if (currentQuestion.type === 'mcq') {
      return userAnswer === currentQuestion.answerIndex
    }
    if (currentQuestion.type === 'multi') {
      if (!Array.isArray(userAnswer)) return false
      const expected = [...currentQuestion.answerIndexes].sort()
      const given = [...userAnswer].sort()
      return JSON.stringify(expected) === JSON.stringify(given)
    }
    if (currentQuestion.type === 'numeric') {
      const val = parseFloat(userAnswer as string)
      const expected = typeof currentQuestion.answer === 'number' ? currentQuestion.answer : parseFloat(currentQuestion.answer)
      const tol = currentQuestion.tolerance || 0
      return !isNaN(val) && Math.abs(val - expected) <= tol
    }
    if (currentQuestion.type === 'order') {
      return JSON.stringify(userAnswer) === JSON.stringify(currentQuestion.correctOrder)
    }
    if (currentQuestion.type === 'match') {
      if (!userAnswer || typeof userAnswer !== 'object') return false
      const matchMap = userAnswer as Record<string, string>
      return currentQuestion.pairs.every(([l, r]) => matchMap[l] === r)
    }
    if (currentQuestion.type === 'spot') {
      return userAnswer === currentQuestion.answerIndex
    }
    if (currentQuestion.type === 'fill') {
      if (!Array.isArray(userAnswer)) return false
      return currentQuestion.blanks.every(
        (b, i) => ((userAnswer as string[])[i] || '').trim().toUpperCase() === b.trim().toUpperCase()
      )
    }
    if (currentQuestion.type === 'tf-why') {
      const tfVal = userAnswer as { isTrue: boolean | null; whyIndex: number | null } | null
      return tfVal?.isTrue === currentQuestion.isTrue && tfVal?.whyIndex === currentQuestion.whyIndex
    }
    return false
  }, [currentQuestion, userAnswer])

  // Build final session summary
  const generateFinalSummary = useCallback((
    finalRecords: QuestionAnswerRecord[],
    finalViva: VivaResponseRecord[]
  ): QuizSessionSummary => {
    const totalQ = finalRecords.length
    const correctQ = finalRecords.filter(r => r.isCorrect).length
    const totalMarks = finalRecords.reduce((acc, r) => acc + r.question.marks, 0)
    const earnedMarks = finalRecords.reduce((acc, r) => acc + (r.isCorrect ? r.question.marks : 0), 0)

    const moduleAccuracy: Record<ModuleCode, { total: number; correct: number; rate: number }> = {
      M1: { total: 0, correct: 0, rate: 0 },
      M2: { total: 0, correct: 0, rate: 0 },
      M3: { total: 0, correct: 0, rate: 0 },
      M4: { total: 0, correct: 0, rate: 0 },
      M5: { total: 0, correct: 0, rate: 0 },
      M6: { total: 0, correct: 0, rate: 0 }
    }

    const bloomAccuracy: Record<BloomLevel, { total: number; correct: number; rate: number }> = {
      L1: { total: 0, correct: 0, rate: 0 },
      L2: { total: 0, correct: 0, rate: 0 },
      L3: { total: 0, correct: 0, rate: 0 },
      L4: { total: 0, correct: 0, rate: 0 }
    }

    const typeAccuracy: Record<string, { total: number; correct: number; rate: number }> = {}

    finalRecords.forEach(r => {
      const m = r.question.module
      if (moduleAccuracy[m]) {
        moduleAccuracy[m].total++
        if (r.isCorrect) moduleAccuracy[m].correct++
      }

      const b = r.question.bloom
      if (bloomAccuracy[b]) {
        bloomAccuracy[b].total++
        if (r.isCorrect) bloomAccuracy[b].correct++
      }

      const t = r.question.type
      if (!typeAccuracy[t]) typeAccuracy[t] = { total: 0, correct: 0, rate: 0 }
      typeAccuracy[t].total++
      if (r.isCorrect) typeAccuracy[t].correct++
    })

    Object.keys(moduleAccuracy).forEach(k => {
      const item = moduleAccuracy[k as ModuleCode]
      item.rate = item.total > 0 ? Math.round((item.correct / item.total) * 100) : 0
    })
    Object.keys(bloomAccuracy).forEach(k => {
      const item = bloomAccuracy[k as BloomLevel]
      item.rate = item.total > 0 ? Math.round((item.correct / item.total) * 100) : 0
    })
    Object.keys(typeAccuracy).forEach(k => {
      const item = typeAccuracy[k]
      item.rate = item.total > 0 ? Math.round((item.correct / item.total) * 100) : 0
    })

    return {
      mode,
      timestamp: Date.now(),
      durationSec: totalDurationRef.current,
      totalQuestions: totalQ,
      totalMarks,
      earnedMarks,
      accuracyRate: totalQ > 0 ? Math.round((correctQ / totalQ) * 100) : 0,
      moduleAccuracy,
      bloomAccuracy,
      typeAccuracy,
      records: finalRecords,
      vivaRecords: finalViva
    }
  }, [mode])

  // Reveal Answer handler
  const handleReveal = useCallback(() => {
    setIsRevealed(true)
    const isCorrect = evaluateAnswer()

    if (isCorrect && mode === 'exam-challenge') {
      setTeamScores(prev =>
        prev.map((t, i) =>
          i === activeTeamIndex
            ? { ...t, score: t.score + currentQuestion.marks * 10, answersGiven: t.answersGiven + 1 }
            : t
        )
      )
    }

    setRecords(prev => [
      ...prev,
      {
        question: currentQuestion,
        userResponse: userAnswer,
        isCorrect,
        timeSpentSec: (currentQuestion.timeSec || 45) - timeLeft
      }
    ])
  }, [activeTeamIndex, currentQuestion, evaluateAnswer, mode, timeLeft, userAnswer])

  // Advance to next question
  const handleNextQuestion = useCallback(() => {
    if (currentIndex < activeQuestions.length - 1) {
      const nextIdx = currentIndex + 1
      setCurrentIndex(nextIdx)
      setActiveTeamIndex(t => (t + 1) % teamScores.length)
      setTimeLeft(activeQuestions[nextIdx]?.timeSec || 45)
      setUserAnswer(null)
      setIsRevealed(false)
    } else {
      const finalSummary = generateFinalSummary(records, vivaRecords)
      setSessionSummary(finalSummary)
      setIsFinished(true)
    }
  }, [activeQuestions, currentIndex, generateFinalSummary, records, teamScores.length, vivaRecords])

  // Viva self-rate handler
  const handleVivaRate = useCallback((rating: 'got-it' | 'partly' | 'no') => {
    const updatedViva: VivaResponseRecord[] = [
      ...vivaRecords,
      {
        questionId: currentQuestion.id,
        prompt: currentQuestion.prompt,
        modelAnswer: currentQuestion.explanation,
        rating,
        topicId: currentQuestion.topicId
      }
    ]
    setVivaRecords(updatedViva)

    if (currentIndex < activeQuestions.length - 1) {
      const nextIdx = currentIndex + 1
      setCurrentIndex(nextIdx)
      setActiveTeamIndex(t => (t + 1) % teamScores.length)
      setTimeLeft(activeQuestions[nextIdx]?.timeSec || 45)
      setUserAnswer(null)
      setIsRevealed(false)
    } else {
      const finalSummary = generateFinalSummary(records, updatedViva)
      setSessionSummary(finalSummary)
      setIsFinished(true)
    }
  }, [activeQuestions, currentIndex, currentQuestion, generateFinalSummary, records, teamScores.length, vivaRecords])

  // Keyboard shortcut for space reveal / next
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) return
      if (e.key === ' ' && !isRevealed) {
        e.preventDefault()
        handleReveal()
      } else if (e.key === 'Enter' && isRevealed && mode !== 'viva-mode') {
        e.preventDefault()
        handleNextQuestion()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isRevealed, mode, handleReveal, handleNextQuestion])

  if (isFinished && sessionSummary) {
    return (
      <div className="min-h-screen bg-paper py-8 px-4">
        {mode === 'exam-challenge' && (
          <div className="w-full max-w-2xl mx-auto mb-8 p-6 bg-card border border-ink text-center shadow-[6px_6px_0_var(--ink)]">
            <h2 className="font-serif text-3xl font-bold text-ink mb-4">🏆 Team Podium</h2>
            <div className="flex justify-center items-end gap-4 h-48 border-b border-rule pb-2">
              {[...teamScores]
                .sort((a, b) => b.score - a.score)
                .map((t, idx) => (
                  <div
                    key={t.id}
                    className={`w-32 border flex flex-col justify-end p-2 transition-all ${
                      idx === 0
                        ? "bg-signal text-paper border-signal h-44 shadow-[4px_0_0_var(--rule)]"
                        : "bg-paper text-ink border-ink h-28"
                    }`}
                  >
                    <span className="font-mono text-2xl font-bold">{t.score}</span>
                    <span className="font-sans text-xs uppercase font-bold truncate">{t.name}</span>
                    <span className="font-mono text-[10px] opacity-80">Rank #{idx + 1}</span>
                  </div>
                ))}
            </div>
          </div>
        )}

        <QuizResultsReport
          summary={sessionSummary}
          onRestart={() => {
            setCurrentIndex(0)
            setRecords([])
            setVivaRecords([])
            setIsFinished(false)
            setSessionSummary(null)
            setTimeLeft(activeQuestions[0]?.timeSec || 45)
            setUserAnswer(null)
            setIsRevealed(false)
          }}
        />
      </div>
    )
  }

  // Render Question based on question.type
  const renderQuestionBody = () => {
    switch (currentQuestion.type) {
      case 'mcq':
        return (
          <McqRenderer
            question={currentQuestion as McqQuestion}
            isRevealed={isRevealed}
            onAnswerChange={ans => setUserAnswer(ans)}
            userAnswer={userAnswer as number | null}
          />
        )
      case 'multi':
        return (
          <MultiRenderer
            question={currentQuestion as MultiQuestion}
            isRevealed={isRevealed}
            onAnswerChange={ans => setUserAnswer(ans)}
            userAnswer={userAnswer as number[] | undefined}
          />
        )
      case 'numeric':
        return (
          <NumericRenderer
            question={currentQuestion as NumericQuestion}
            isRevealed={isRevealed}
            onAnswerChange={ans => setUserAnswer(ans)}
            userAnswer={userAnswer as string | undefined}
          />
        )
      case 'order':
        return (
          <OrderRenderer
            question={currentQuestion as OrderQuestion}
            isRevealed={isRevealed}
            onAnswerChange={ans => setUserAnswer(ans)}
            userAnswer={userAnswer as number[] | undefined}
          />
        )
      case 'match':
        return (
          <MatchRenderer
            question={currentQuestion as MatchQuestion}
            isRevealed={isRevealed}
            onAnswerChange={ans => setUserAnswer(ans)}
            userAnswer={userAnswer as Record<string, string> | undefined}
          />
        )
      case 'label':
        return (
          <LabelRenderer
            question={currentQuestion as LabelQuestion}
            isRevealed={isRevealed}
            onAnswerChange={ans => setUserAnswer(ans)}
            userAnswer={userAnswer as Record<string, string> | undefined}
          />
        )
      case 'spot':
        return (
          <SpotRenderer
            question={currentQuestion as SpotQuestion}
            isRevealed={isRevealed}
            onAnswerChange={ans => setUserAnswer(ans)}
            userAnswer={userAnswer as number | null}
          />
        )
      case 'fill':
        return (
          <FillRenderer
            question={currentQuestion as FillQuestion}
            isRevealed={isRevealed}
            onAnswerChange={ans => setUserAnswer(ans)}
            userAnswer={userAnswer as string[] | undefined}
          />
        )
      case 'tf-why':
        return (
          <TfWhyRenderer
            question={currentQuestion as TfWhyQuestion}
            isRevealed={isRevealed}
            onAnswerChange={ans => setUserAnswer(ans)}
            userAnswer={userAnswer as { isTrue: boolean | null; whyIndex: number | null } | undefined}
          />
        )
      default:
        return <div>Unsupported question type</div>
    }
  }

  const timerRatio = Math.max(0, Math.min(1, timeLeft / (currentQuestion.timeSec || 45)))

  return (
    <div className="min-h-screen bg-paper flex flex-col justify-between p-4 sm:p-8">
      {/* Top Header */}
      <header className="max-w-5xl w-full mx-auto flex items-center justify-between border-b border-rule pb-3 font-mono text-xs">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push("/quiz")}
            className="px-2 py-0.5 border border-rule hover:border-ink bg-card text-ink-soft uppercase text-[10px]"
          >
            ← Exit
          </button>
          <span className="font-bold text-signal uppercase tracking-wider">{mode.replace('-', ' ')}</span>
          <span className="text-rule">/</span>
          <span className="text-ink">
            Question {currentIndex + 1} of {activeQuestions.length}
          </span>
        </div>

        {mode === 'exam-challenge' && (
          <div className="flex items-center gap-4">
            {teamScores.map((t, idx) => (
              <div
                key={t.id}
                className={`px-2.5 py-0.5 border text-xs font-mono flex items-center gap-2 ${
                  idx === activeTeamIndex
                    ? "border-signal bg-paper text-signal font-bold shadow-[2px_2px_0_var(--signal)]"
                    : "border-rule bg-card text-ink"
                }`}
              >
                <span>{t.name}:</span>
                <span className="font-bold">{t.score} pts</span>
              </div>
            ))}
          </div>
        )}

        <div className="flex items-center gap-2">
          <span className="text-ink-soft">Time:</span>
          <span
            className={`font-mono text-base font-bold ${
              timeLeft <= 5 ? "text-bad animate-pulse" : "text-ink"
            }`}
          >
            {timeLeft}s
          </span>
        </div>
      </header>

      {/* Self-Test Filter Toolbar */}
      {mode === 'self-test' && (
        <div className="max-w-5xl w-full mx-auto mt-4 p-4 bg-card border border-ink text-xs font-mono space-y-3 shadow-[3px_3px_0_var(--rule)]">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-rule pb-2">
            <div className="flex items-center gap-2">
              <span className="font-bold text-signal uppercase tracking-wider">Self-Test Diagnostic Filter</span>
              <span className="text-ink-soft">({activeQuestions.length} questions loaded)</span>
            </div>
            <button
              onClick={handleLaunchMockTest}
              className={`px-3 py-1 border font-bold uppercase transition-all ${
                isMockTest
                  ? "border-signal bg-signal text-paper shadow-[2px_2px_0_var(--ink)]"
                  : "border-rule bg-paper text-ink hover:border-ink hover:text-signal"
              }`}
            >
              ★ Full Syllabus Mock Test (45 Qs · 5/8/7/8/10/7 hrs)
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            {/* Module filter */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-ink-soft uppercase text-[10px] font-bold">Module:</span>
              {(['ALL', 'M1', 'M2', 'M3', 'M4', 'M5', 'M6'] as const).map(mod => (
                <button
                  key={mod}
                  onClick={() => handleFilterChange(mod, filterBloom, filterDiff)}
                  className={`px-2 py-0.5 border text-[11px] ${
                    filterModule === mod && !isMockTest
                      ? "border-signal bg-signal text-paper font-bold"
                      : "border-rule bg-paper text-ink hover:border-ink"
                  }`}
                >
                  {mod}
                </button>
              ))}
            </div>

            {/* Bloom filter */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-ink-soft uppercase text-[10px] font-bold">Bloom:</span>
              {(['ALL', 'L1', 'L2', 'L3', 'L4'] as const).map(blm => (
                <button
                  key={blm}
                  onClick={() => handleFilterChange(filterModule, blm, filterDiff)}
                  className={`px-2 py-0.5 border text-[11px] ${
                    filterBloom === blm && !isMockTest
                      ? "border-signal bg-signal text-paper font-bold"
                      : "border-rule bg-paper text-ink hover:border-ink"
                  }`}
                >
                  {blm}
                </button>
              ))}
            </div>

            {/* Difficulty filter */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-ink-soft uppercase text-[10px] font-bold">Difficulty:</span>
              {([
                { label: 'ALL', val: 'ALL' as const },
                { label: 'Easy (1)', val: 1 as const },
                { label: 'Med (2)', val: 2 as const },
                { label: 'Hard (3)', val: 3 as const }
              ]).map(d => (
                <button
                  key={d.label}
                  onClick={() => handleFilterChange(filterModule, filterBloom, d.val)}
                  className={`px-2 py-0.5 border text-[11px] ${
                    filterDiff === d.val && !isMockTest
                      ? "border-signal bg-signal text-paper font-bold"
                      : "border-rule bg-paper text-ink hover:border-ink"
                  }`}
                >
                  {d.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Main Exam Paper Card Area */}
      <main className="max-w-5xl w-full mx-auto my-6 flex-1 flex flex-col">
        <div className="bg-card border border-ink p-6 sm:p-10 shadow-[6px_6px_0_var(--ink)] flex-1 flex flex-col justify-between relative overflow-hidden">
          {/* Timer Line (Drains left to right, vermilion in last 5s) */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-rule/30">
            <div
              className={`h-full transition-all duration-1000 ${
                timeLeft <= 5 ? "bg-signal" : "bg-ink"
              }`}
              style={{ width: `${timerRatio * 100}%` }}
            />
          </div>

          <div>
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-rule pb-3 mb-6 font-mono text-[11px]">
              <div className="flex items-center gap-2 text-ink-soft">
                <span className="px-1.5 py-0.5 bg-paper border border-rule text-signal font-bold">
                  {currentQuestion.module}
                </span>
                <span>{currentQuestion.topicId.toUpperCase()}</span>
                <span>·</span>
                <span className="px-1.5 py-0.5 bg-paper border border-rule text-ink font-bold">
                  {currentQuestion.bloom}
                </span>
              </div>
              <span className="font-bold text-ink uppercase tracking-wider">
                {currentQuestion.marks} Mark{currentQuestion.marks > 1 ? "s" : ""}
              </span>
            </div>

            <h2 className="font-serif text-2xl sm:text-3xl text-ink font-bold leading-tight mb-8">
              {currentQuestion.prompt}
            </h2>

            <div className="mb-8">{renderQuestionBody()}</div>
          </div>

          <div className="border-t border-rule pt-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            {!isRevealed ? (
              <div className="flex items-center gap-3">
                <button
                  onClick={handleReveal}
                  className="px-6 py-2.5 bg-ink text-paper font-mono text-xs uppercase tracking-wider hover:bg-signal transition-colors font-bold"
                >
                  Confirm & Reveal Answer [Space]
                </button>
                <span className="font-mono text-xs text-ink-soft hidden sm:inline">
                  Lock in choice to see explanation
                </span>
              </div>
            ) : mode === 'viva-mode' ? (
              <div className="w-full flex items-center justify-between gap-3">
                <span className="font-mono text-xs text-ink-soft">Self-rate your recall:</span>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleVivaRate('got-it')}
                    className="px-3 py-1.5 bg-ok text-paper font-mono text-xs uppercase font-bold"
                  >
                    Got It ✓
                  </button>
                  <button
                    onClick={() => handleVivaRate('partly')}
                    className="px-3 py-1.5 bg-warn text-paper font-mono text-xs uppercase font-bold"
                  >
                    Partly ~
                  </button>
                  <button
                    onClick={() => handleVivaRate('no')}
                    className="px-3 py-1.5 bg-bad text-paper font-mono text-xs uppercase font-bold"
                  >
                    Need Review ✗
                  </button>
                </div>
              </div>
            ) : (
              <div className="w-full flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="font-sans text-xs text-ink-soft max-w-xl">
                  <strong className="text-ink block mb-0.5">Explanation:</strong>
                  {currentQuestion.explanation}
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  {currentQuestion.topicId && (
                    <button
                      onClick={() =>
                        router.push(`/present/${currentQuestion.module.toLowerCase()}/${currentQuestion.topicId}`)
                      }
                      className="px-3 py-2 border border-ink bg-paper font-mono text-xs uppercase hover:bg-rule"
                    >
                      Show Me ↗
                    </button>
                  )}
                  <button
                    onClick={handleNextQuestion}
                    className="px-6 py-2 bg-signal text-paper font-mono text-xs uppercase tracking-wider hover:bg-ink transition-colors font-bold"
                  >
                    {currentIndex < activeQuestions.length - 1 ? "Next Question [Enter] →" : "Finish & View Results →"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <footer className="max-w-5xl w-full mx-auto text-center font-mono text-[10px] text-ink-soft">
        CNS Security Lab Assessment Engine v2 · Lab Notebook Strict Formatting · 0 Console Errors
      </footer>
    </div>
  )
}
