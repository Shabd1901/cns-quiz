"use client"

import React, { useState, useMemo } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { ModuleId, getModule } from "@/lib/syllabus"
import { getQuestionsByModule } from "@/lib/quiz/v2/questions"
import { McqQuestion, MultiQuestion } from "@/lib/quiz/v2/types"
import { CheckCircle2, XCircle, ArrowRight, RotateCcw, Flame } from "lucide-react"

export default function SyllabusQuiz({ moduleId }: { moduleId: ModuleId }) {
  const modCode = moduleId.toUpperCase()
  const modInfo = getModule(moduleId)
  const allModuleQuestions = useMemo(() => {
    const list = getQuestionsByModule(modCode)
    // Filter to standard MCQ and Multi questions for interactive practice
    return list.filter((q): q is McqQuestion | MultiQuestion => q.type === 'mcq' || q.type === 'multi')
  }, [modCode])

  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedOption, setSelectedOption] = useState<number | null>(null)
  const [isAnswered, setIsAnswered] = useState(false)
  const [score, setScore] = useState(0)

  // Use a subset of 5 questions per practice run
  const questions = useMemo(() => allModuleQuestions.slice(0, 7), [allModuleQuestions])

  const currentQ = questions[currentIndex]

  const handleSelect = (idx: number) => {
    if (isAnswered) return
    setSelectedOption(idx)
  }

  const handleSubmit = () => {
    if (selectedOption === null || isAnswered || !currentQ) return
    setIsAnswered(true)

    const isCorrect = currentQ.type === 'mcq'
      ? selectedOption === (currentQ as McqQuestion).answerIndex
      : (currentQ as MultiQuestion).answerIndexes.includes(selectedOption)

    if (isCorrect) {
      setScore(prev => prev + 1)
    }
  }

  const handleNext = () => {
    setSelectedOption(null)
    setIsAnswered(false)
    setCurrentIndex(prev => prev + 1)
  }

  const handleRestart = () => {
    setCurrentIndex(0)
    setSelectedOption(null)
    setIsAnswered(false)
    setScore(0)
  }

  if (!currentQ || currentIndex >= questions.length) {
    return (
      <div className="max-w-3xl mx-auto py-8">
        <Card className="border border-ink shadow-[4px_4px_0_var(--rule)] p-6 sm:p-10 text-center space-y-6">
          <div className="inline-block p-4 bg-signal/10 border border-signal/30 text-signal mb-2">
            <CheckCircle2 className="h-10 w-10 mx-auto" />
          </div>
          <div>
            <h2 className="text-3xl font-serif text-ink font-bold">Practice Round Complete!</h2>
            <p className="text-sm text-ink-soft font-mono mt-1">
              You scored {score} out of {questions.length} on {modInfo?.code} ({Math.round((score / questions.length) * 100)}%)
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
            <Button
              onClick={handleRestart}
              className="bg-ink hover:bg-signal text-paper font-mono uppercase tracking-wider text-xs px-6 py-3"
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Retake Module Quiz
            </Button>
            <Button
              asChild
              variant="outline"
              className="border-ink font-mono uppercase tracking-wider text-xs px-6 py-3"
            >
              <Link href="/quiz">
                <Flame className="h-4 w-4 mr-2 text-signal" />
                Full 45Q Mock Test
              </Link>
            </Button>
          </div>
        </Card>
      </div>
    )
  }

  const isCurrentCorrect = currentQ.type === 'mcq'
    ? selectedOption === (currentQ as McqQuestion).answerIndex
    : (currentQ as MultiQuestion).answerIndexes.includes(selectedOption ?? -1)

  const correctIndex = currentQ.type === 'mcq' ? (currentQ as McqQuestion).answerIndex : (currentQ as MultiQuestion).answerIndexes[0]

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <Card className="border border-ink shadow-[4px_4px_0_var(--rule)]">
        <CardHeader className="border-b border-rule pb-4">
          <div className="flex flex-wrap items-center justify-between gap-2 font-mono text-[11px]">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 bg-ink text-paper font-bold">{modInfo?.code} Practice</span>
              <span className="text-ink-soft">Question {currentIndex + 1} of {questions.length}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-1.5 py-0.5 border border-signal/30 bg-signal/10 text-signal font-bold">
                {currentQ.bloom}
              </span>
              <span className="text-ink-soft">Score: {score}</span>
            </div>
          </div>
          <CardTitle className="font-serif text-xl sm:text-2xl text-ink mt-3 leading-snug">
            {currentQ.prompt}
          </CardTitle>
        </CardHeader>

        <CardContent className="pt-6 space-y-4">
          {/* Options */}
          <div className="space-y-2.5">
            {currentQ.options.map((opt, idx) => {
              const isSelected = selectedOption === idx
              const isOptionCorrect = currentQ.type === 'mcq'
                ? idx === (currentQ as McqQuestion).answerIndex
                : (currentQ as MultiQuestion).answerIndexes.includes(idx)

              let optionStyle = "border-rule bg-card hover:border-ink text-ink"
              if (isSelected) {
                optionStyle = "border-ink bg-ink/5 text-ink font-bold shadow-[2px_2px_0_var(--ink)]"
              }
              if (isAnswered) {
                if (isOptionCorrect) {
                  optionStyle = "border-ok bg-ok/10 text-ok font-bold shadow-[2px_2px_0_var(--ok)]"
                } else if (isSelected) {
                  optionStyle = "border-bad bg-bad/10 text-bad font-bold shadow-[2px_2px_0_var(--bad)]"
                } else {
                  optionStyle = "border-rule/50 bg-paper/50 text-ink-soft opacity-60"
                }
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleSelect(idx)}
                  disabled={isAnswered}
                  className={`w-full text-left p-3.5 border transition-all flex items-start gap-3 text-xs sm:text-sm font-sans ${optionStyle}`}
                >
                  <span className="font-mono text-xs font-bold uppercase shrink-0 mt-0.5 w-6 h-6 border border-rule flex items-center justify-center bg-paper">
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <span className="flex-1 leading-relaxed">{opt}</span>
                  {isAnswered && isOptionCorrect && (
                    <CheckCircle2 className="h-5 w-5 text-ok shrink-0 mt-0.5" />
                  )}
                  {isAnswered && isSelected && !isOptionCorrect && (
                    <XCircle className="h-5 w-5 text-bad shrink-0 mt-0.5" />
                  )}
                </button>
              )
            })}
          </div>

          {/* Explanation Box */}
          {isAnswered && (
            <div className={`p-4 border text-xs sm:text-sm leading-relaxed ${
              isCurrentCorrect ? 'border-ok/30 bg-ok/5 text-ink' : 'border-bad/30 bg-bad/5 text-ink'
            }`}>
              <div className="font-mono text-[11px] font-bold uppercase tracking-wider mb-1 flex items-center gap-1.5">
                {isCurrentCorrect ? (
                  <span className="text-ok flex items-center gap-1"><CheckCircle2 className="h-3.5 w-3.5" /> Correct!</span>
                ) : (
                  <span className="text-bad flex items-center gap-1"><XCircle className="h-3.5 w-3.5" /> Incorrect (Option {String.fromCharCode(65 + correctIndex)})</span>
                )}
              </div>
              <p className="font-sans text-ink-soft">{currentQ.explanation}</p>
            </div>
          )}

          {/* Controls */}
          <div className="pt-4 border-t border-rule flex justify-between items-center">
            <span className="font-mono text-[11px] text-ink-soft">
              Topic: <span className="font-bold text-ink">{currentQ.topicId}</span>
            </span>

            {!isAnswered ? (
              <Button
                onClick={handleSubmit}
                disabled={selectedOption === null}
                className="bg-ink hover:bg-signal text-paper font-mono uppercase tracking-wider text-xs px-5 py-2 font-bold"
              >
                Check Answer
              </Button>
            ) : (
              <Button
                onClick={handleNext}
                className="bg-signal hover:bg-signal/90 text-paper font-mono uppercase tracking-wider text-xs px-5 py-2 font-bold flex items-center gap-1.5"
              >
                <span>{currentIndex + 1 < questions.length ? "Next Question" : "View Results"}</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

