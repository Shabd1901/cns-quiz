"use client"

import React, { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { TopicPresentation } from "@/lib/present/types"
import { ScenePlayer } from "@/components/scene/ScenePlayer"
import { PresenterToolsOverlay } from "./PresenterTools"
import { CaesarConcentricDisks, CaesarModularFormula, PlayfairRulesVisual } from "./PlateFigures"
import { FeistelDiagram } from "@/components/figures/FeistelDiagram"
import { ModeDiagram } from "@/components/figures/ModeDiagram"
import { CurvePlot } from "@/components/figures/CurvePlot"
import { getModule } from "@/lib/syllabus"

export function PresenterModeV2({
  presentation,
  onExit
}: {
  presentation: TopicPresentation
  onExit?: () => void
}) {
  const router = useRouter()
  const plates = presentation.plates

  const [activePlateIndex, setActivePlateIndex] = useState(0)
  const [workedStepIndex, setWorkedStepIndex] = useState(0)
  const [isEli5, setIsEli5] = useState(false)
  const [isLaserActive, setIsLaserActive] = useState(false)
  const [isDrawActive, setIsDrawActive] = useState(false)
  const [isBlackout, setIsBlackout] = useState(false)
  const [isNotesOpen, setIsNotesOpen] = useState(false)
  const [showJumpGrid, setShowJumpGrid] = useState(false)
  const [showHelp, setShowHelp] = useState(false)
  const [isRailOpen, setIsRailOpen] = useState(true)

  // Poll state for 'ask-the-room'
  const [pollVotes, setPollVotes] = useState<[number, number, number, number]>([0, 0, 0, 0])
  const [isPollRevealed, setIsPollRevealed] = useState(false)

  // Dynamic worked example generator state
  const [dynamicWorkedExample, setDynamicWorkedExample] = useState(
    plates[activePlateIndex]?.workedExample
  )

  // Presentation Timer (Elapsed seconds)
  const [elapsedSec, setElapsedSec] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => setElapsedSec(s => s + 1), 1000)
    return () => clearInterval(timer)
  }, [])

  // Syllabus topic sequencing
  const modInfo = getModule(presentation.moduleId)
  const topicList = modInfo?.topics || []
  const currentTopicIndex = topicList.findIndex(t => t.id.toLowerCase() === presentation.topicId.toLowerCase())
  const prevTopic = currentTopicIndex > 0 ? topicList[currentTopicIndex - 1] : null
  const nextTopic = currentTopicIndex >= 0 && currentTopicIndex < topicList.length - 1 ? topicList[currentTopicIndex + 1] : null

  const currentPlate = plates[activePlateIndex] || plates[0]

  const changePlate = useCallback((newIndex: number) => {
    setActivePlateIndex(newIndex)
    setWorkedStepIndex(0)
    setIsPollRevealed(false)
    setPollVotes([0, 0, 0, 0])
    setDynamicWorkedExample(plates[newIndex]?.workedExample)
  }, [plates])

  const handleNext = useCallback(() => {
    if (currentPlate.kind === 'worked-example' && dynamicWorkedExample) {
      if (workedStepIndex < dynamicWorkedExample.steps.length) {
        setWorkedStepIndex(prev => prev + 1)
        return
      }
    }
    if (activePlateIndex < plates.length - 1) {
      changePlate(activePlateIndex + 1)
    }
  }, [currentPlate.kind, dynamicWorkedExample, workedStepIndex, activePlateIndex, plates.length, changePlate])

  const handlePrev = useCallback(() => {
    if (currentPlate.kind === 'worked-example' && workedStepIndex > 0) {
      setWorkedStepIndex(prev => prev - 1)
      return
    }
    if (activePlateIndex > 0) {
      changePlate(activePlateIndex - 1)
    }
  }, [currentPlate.kind, workedStepIndex, activePlateIndex, changePlate])

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept typing in inputs
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) return

      if (e.key === 'ArrowRight') {
        e.preventDefault()
        handleNext()
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault()
        handlePrev()
      } else if (e.key === 's' || e.key === 'S') {
        setIsNotesOpen(prev => !prev)
      } else if (e.key === 'l' || e.key === 'L') {
        setIsLaserActive(prev => !prev)
      } else if (e.key === 'd' || e.key === 'D') {
        setIsDrawActive(prev => !prev)
      } else if (e.key === 'e' || e.key === 'E') {
        setIsEli5(prev => !prev)
      } else if (e.key === 'b' || e.key === 'B') {
        setIsBlackout(prev => !prev)
      } else if (e.key === 'g' || e.key === 'G') {
        setShowJumpGrid(prev => !prev)
      } else if (e.key === '?') {
        setShowHelp(prev => !prev)
      } else if (e.key === 'q' || e.key === 'Q') {
        router.push(`/quiz?topic=${presentation.topicId}`)
      } else if (e.key === 'Escape') {
        if (isBlackout) setIsBlackout(false)
        else if (showJumpGrid) setShowJumpGrid(false)
        else if (showHelp) setShowHelp(false)
        else if (isNotesOpen) setIsNotesOpen(false)
        else if (onExit) onExit()
        else router.back()
      } else if (currentPlate.kind === 'ask-the-room') {
        if (['1', '2', '3', '4'].includes(e.key)) {
          const optIdx = parseInt(e.key) - 1
          setPollVotes(v => {
            const copy = [...v] as [number, number, number, number]
            copy[optIdx] += 1
            return copy
          })
        } else if (e.key === 'Enter') {
          setIsPollRevealed(true)
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleNext, handlePrev, isBlackout, showJumpGrid, showHelp, isNotesOpen, onExit, router, currentPlate.kind, presentation.topicId])

  const formatElapsed = (sec: number) => {
    const m = Math.floor(sec / 60)
    const s = sec % 60
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
  }

  const handlePrintHandout = () => {
    if (typeof window !== "undefined") {
      window.print()
    }
  }

  // Generate another problem for Worked Example
  const handleGenerateAnother = () => {
    const keys = [3, 5, 7, 9, 11]
    const words = ["CIPHER", "SECRET", "DEFEND", "SHADOW", "VECTOR"]
    const randomKey = keys[Math.floor(Math.random() * keys.length)]
    const randomWord = words[Math.floor(Math.random() * words.length)]

    const indices = randomWord.split("").map(c => c.charCodeAt(0) - 65)
    const encIndices = indices.map(idx => (idx + randomKey) % 26)
    const cipherStr = encIndices.map(idx => String.fromCharCode(idx + 65)).join("")

    setDynamicWorkedExample({
      problem: `Encrypt the plaintext "${randomWord}" using Caesar cipher with key k = ${randomKey}.`,
      given: {
        'Plaintext (P)': `"${randomWord}"`,
        'Shift Key (k)': randomKey,
        'Modulus (m)': 26
      },
      steps: [
        {
          label: 'Map characters to numerical indices in ℤ₂₆',
          formula: 'Letter -> Index (0..25)',
          substitution: indices.map((val, i) => `${randomWord[i]}=${val}`).join(', '),
          result: `[${indices.join(', ')}]`
        },
        {
          label: `Apply encryption formula C_i = (P_i + ${randomKey}) mod 26`,
          formula: `C_i = (P_i + ${randomKey}) mod 26`,
          substitution: indices.map(val => `(${val}+${randomKey})=${(val + randomKey) % 26}`).join(', '),
          result: `[${encIndices.join(', ')}]`
        },
        {
          label: 'Convert resulting indices back to alphabetic characters',
          formula: 'Index -> Letter',
          substitution: encIndices.map(val => `${val}=${String.fromCharCode(val + 65)}`).join(', '),
          result: `"${cipherStr}"`
        }
      ],
      finalAnswer: `Ciphertext C = "${cipherStr}"`,
      checkVerification: `Decryption check: D("${cipherStr}") with k=${randomKey} -> subtract ${randomKey} mod 26 restores "${randomWord}". Verified.`
    })
    setWorkedStepIndex(0)
  }

  // Render the central visual area based on plate kind
  const renderVisualContent = () => {
    // 1. Process plate with declarative scene
    if (currentPlate.scene) {
      return (
        <div className="w-full max-w-4xl mx-auto">
          <ScenePlayer scene={currentPlate.scene} autoPlayIntervalMs={2500} />
        </div>
      )
    }

    // 2. Custom figure components
    if (currentPlate.customFigure === 'CaesarConcentricDisks') {
      const shiftVal = typeof currentPlate.customFigureProps?.shift === 'number' ? currentPlate.customFigureProps.shift : 3
      return <CaesarConcentricDisks shift={shiftVal} />
    }
    if (currentPlate.customFigure === 'CaesarModularFormula') {
      return <CaesarModularFormula />
    }
    if (currentPlate.customFigure === 'PlayfairRulesVisual') {
      return <PlayfairRulesVisual />
    }
    if (currentPlate.customFigure === 'FeistelDiagram') {
      return (
        <div className="w-full max-w-2xl mx-auto">
          <FeistelDiagram roundCount={16} />
        </div>
      )
    }
    if (currentPlate.customFigure === 'ModeDiagram') {
      return (
        <div className="w-full max-w-3xl mx-auto">
          <ModeDiagram />
        </div>
      )
    }
    if (currentPlate.customFigure === 'CurvePlot') {
      return (
        <div className="w-full max-w-2xl mx-auto">
          <CurvePlot a={1} b={1} prime={23} />
        </div>
      )
    }

    // 3. Worked Example Plate (with step reveal & "Your Turn")
    if (currentPlate.kind === 'worked-example' && dynamicWorkedExample) {
      const ex = dynamicWorkedExample
      const isComplete = workedStepIndex >= ex.steps.length

      return (
        <div className="w-full max-w-3xl mx-auto bg-card border border-ink p-6 shadow-[6px_6px_0_var(--rule)] space-y-6">
          {/* Problem Banner */}
          <div className="border-b border-rule pb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
            <div>
              <span className="font-mono text-[10px] uppercase tracking-widest text-signal font-bold">
                Numerical Exercise
              </span>
              <h3 className="font-serif text-xl sm:text-2xl text-ink font-bold">{ex.problem}</h3>
            </div>
            <button
              onClick={handleGenerateAnother}
              className="px-3 py-1.5 bg-paper border border-ink font-mono text-xs hover:bg-rule uppercase transition-colors shrink-0"
            >
              🎲 Generate Another
            </button>
          </div>

          {/* Given Parameters */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 bg-paper p-3 border border-rule font-mono text-xs">
            {Object.entries(ex.given).map(([k, v]) => (
              <div key={k}>
                <span className="text-ink-soft block text-[10px]">{k}</span>
                <span className="text-ink font-bold">{v}</span>
              </div>
            ))}
          </div>

          {/* Step-by-Step Derivation */}
          <div className="space-y-3">
            {ex.steps.map((st, i) => {
              const isRevealed = i < workedStepIndex
              return (
                <div
                  key={i}
                  className={`p-4 border transition-all ${
                    isRevealed
                      ? "border-rule bg-paper opacity-100"
                      : "border-dashed border-rule/60 bg-paper/30 opacity-60"
                  }`}
                >
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-mono text-xs font-bold text-signal">
                      STEP {i + 1}: {st.label}
                    </span>
                    {!isRevealed && (
                      <span className="font-mono text-[10px] text-ink-soft uppercase px-1.5 py-0.5 border border-rule">
                        [Your Turn — Solve Now]
                      </span>
                    )}
                  </div>

                  {isRevealed ? (
                    <div className="font-mono text-xs space-y-1">
                      <div className="text-ink-soft">Formula: {st.formula}</div>
                      {st.substitution && <div className="text-ink">Substituted: {st.substitution}</div>}
                      <div className="text-ink font-bold text-sm bg-card p-1.5 border border-rule mt-1">
                        Result: <span className="text-signal">{st.result}</span>
                      </div>
                    </div>
                  ) : (
                    <div className="h-6 flex items-center">
                      <span className="font-mono text-xs text-ink-soft/60">Press [→] to reveal solution step</span>
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          {/* Final Answer & Verification */}
          {isComplete && (
            <div className="p-4 bg-ok/10 border-2 border-ok space-y-2">
              <div className="font-mono text-xs text-ok font-bold uppercase tracking-wider">Final Answer Verified</div>
              <div className="font-mono text-lg font-bold text-ink">{ex.finalAnswer}</div>
              <div className="font-mono text-xs text-ink-soft italic border-t border-ok/30 pt-1.5">
                {ex.checkVerification}
              </div>
            </div>
          )}

          {/* Step reveal control bar */}
          <div className="flex items-center justify-between pt-2 border-t border-rule font-mono text-xs">
            <span className="text-ink-soft">
              Step {Math.min(workedStepIndex, ex.steps.length)} of {ex.steps.length} revealed
            </span>
            <button
              onClick={() => {
                if (workedStepIndex < ex.steps.length) setWorkedStepIndex(w => w + 1)
              }}
              disabled={isComplete}
              className="px-3 py-1 bg-ink text-paper font-mono text-xs uppercase disabled:opacity-30 hover:bg-signal"
            >
              {isComplete ? "All Steps Revealed" : "Reveal Next Step [→]"}
            </button>
          </div>
        </div>
      )
    }

    // 4. Comparison Plate
    if (currentPlate.kind === 'compare' && currentPlate.comparison) {
      const comp = currentPlate.comparison
      return (
        <div className="w-full max-w-4xl mx-auto bg-card border border-ink p-6 shadow-[6px_6px_0_var(--rule)] space-y-6">
          <div className="grid grid-cols-3 gap-2 border-b border-rule pb-3 font-mono text-xs uppercase tracking-wider font-bold">
            <div className="text-ink-soft">Evaluation Feature</div>
            <div className="text-signal text-center">{comp.leftTitle}</div>
            <div className="text-info text-center">{comp.rightTitle}</div>
          </div>

          <div className="divide-y divide-rule font-sans text-xs">
            {comp.differences.map((diff, i) => (
              <div key={i} className="grid grid-cols-3 gap-2 py-3 items-center">
                <span className="font-mono text-ink font-bold text-[11px]">{diff.feature}</span>
                <span className="font-mono text-center px-2 py-1 bg-paper border border-rule text-ink">
                  {diff.left}
                </span>
                <span className="font-mono text-center px-2 py-1 bg-paper border border-rule text-ink">
                  {diff.right}
                </span>
              </div>
            ))}
          </div>

          <div className="bg-paper p-3 border-l-4 border-signal text-xs font-sans italic text-ink">
            <strong>Takeaway:</strong> {comp.summaryTakeaway}
          </div>
        </div>
      )
    }

    // 5. Ask-the-Room Poll Plate
    if (currentPlate.kind === 'ask-the-room' && currentPlate.askTheRoom) {
      const poll = currentPlate.askTheRoom
      const totalVotes = pollVotes.reduce((a, b) => a + b, 0)

      return (
        <div className="w-full max-w-3xl mx-auto bg-card border border-ink p-8 shadow-[6px_6px_0_var(--rule)] space-y-6">
          <div className="border-b border-rule pb-4">
            <span className="font-mono text-xs uppercase tracking-widest text-signal font-bold">
              Classroom Show-of-Hands Poll
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl text-ink font-bold mt-1">{poll.question}</h3>
          </div>

          <div className="space-y-3">
            {poll.options.map((opt, idx) => {
              const voteCount = pollVotes[idx]
              const pct = totalVotes > 0 ? Math.round((voteCount / totalVotes) * 100) : 0
              const isCorrect = idx === poll.correctIndex

              return (
                <div
                  key={idx}
                  onClick={() => {
                    setPollVotes(v => {
                      const copy = [...v] as [number, number, number, number]
                      copy[idx] += 1
                      return copy
                    })
                  }}
                  className={`p-4 border relative cursor-pointer select-none transition-all ${
                    isPollRevealed
                      ? isCorrect
                        ? "border-ok bg-ok/10"
                        : "border-rule bg-paper opacity-50"
                      : "border-rule bg-paper hover:border-ink hover:bg-card"
                  }`}
                >
                  <div className="flex justify-between items-center relative z-10">
                    <span className="font-sans text-sm text-ink font-medium">{opt}</span>
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-xs text-ink-soft">
                        {voteCount} votes ({pct}%)
                      </span>
                      <span className="font-mono text-[10px] px-1.5 py-0.5 border border-rule text-ink-soft">
                        [{idx + 1}]
                      </span>
                    </div>
                  </div>

                  {/* Horizontal Vote Bar */}
                  <div
                    className="absolute left-0 bottom-0 top-0 bg-signal/15 transition-all duration-300 pointer-events-none"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              )
            })}
          </div>

          {/* Reveal Button / Outcome */}
          <div className="pt-4 border-t border-rule flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            {!isPollRevealed ? (
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsPollRevealed(true)}
                  className="px-4 py-2 bg-ink text-paper font-mono text-xs uppercase hover:bg-signal transition-colors"
                >
                  Reveal Correct Answer [Enter]
                </button>
                <span className="font-mono text-xs text-ink-soft">
                  Click options or press [1-4] to count hands
                </span>
              </div>
            ) : (
              <div className="w-full space-y-2">
                <div className="flex items-center gap-2 text-ok font-mono text-xs uppercase font-bold">
                  <span>✓ Answer Verified: Option {String.fromCharCode(65 + poll.correctIndex)}</span>
                </div>
                <p className="font-sans text-xs text-ink bg-paper p-3 border border-rule">
                  {poll.explanation}
                </p>
              </div>
            )}
          </div>
        </div>
      )
    }

    // 6. Exam Words Plate
    if (currentPlate.kind === 'exam-words' && currentPlate.examWords) {
      const ex = currentPlate.examWords
      return (
        <div className="w-full max-w-3xl mx-auto bg-card border border-ink p-8 shadow-[6px_6px_0_var(--rule)] space-y-6">
          <div className="flex justify-between items-start border-b border-rule pb-4">
            <div>
              <span className="font-mono text-[10px] uppercase tracking-widest text-signal font-bold">
                Syllabus Exam Definition
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl text-ink font-bold mt-1">{ex.term}</h3>
            </div>
            <span className="font-mono text-xs px-2.5 py-1 bg-ink text-paper font-bold uppercase shrink-0">
              {ex.typicalMarks} Marks Question
            </span>
          </div>

          <div className="p-4 bg-paper border border-ink space-y-2">
            <span className="font-mono text-[10px] uppercase tracking-wider text-ink-soft block font-bold">
              Model Exam Answer Definition:
            </span>
            <p className="font-serif text-base sm:text-lg text-ink leading-relaxed italic">
              &ldquo;{ex.definition}&rdquo;
            </p>
          </div>

          <div className="space-y-2">
            <span className="font-mono text-[10px] uppercase tracking-wider text-ink-soft block font-bold">
              Grading Rubric Keywords (Must Include):
            </span>
            <div className="flex flex-wrap gap-2">
              {ex.keywords.map((kw, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 bg-paper border border-signal font-mono text-xs font-bold text-signal"
                >
                  {kw}
                </span>
              ))}
            </div>
          </div>

          <div className="space-y-2 border-t border-rule pt-4">
            <span className="font-mono text-[10px] uppercase tracking-wider text-ink-soft block font-bold">
              3 Things to Never Forget:
            </span>
            <ul className="space-y-1.5 font-sans text-xs text-ink">
              {ex.mustRememberPoints.map((pt, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="font-mono font-bold text-signal">{idx + 1}.</span>
                  <span>{pt}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )
    }

    // Default fallback concept plate
    return (
      <div className="w-full max-w-2xl mx-auto p-12 bg-card border border-rule text-center shadow-[4px_4px_0_var(--rule)]">
        <h3 className="font-serif text-3xl text-ink mb-3">{currentPlate.title}</h3>
        <p className="font-sans text-sm text-ink-soft max-w-md mx-auto">{currentPlate.caption}</p>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 z-[100] bg-paper flex flex-col overflow-hidden select-none">
      {/* Printable Handout Only Area */}
      <div className="hidden print:block p-8 space-y-12">
        <div className="border-b-2 border-ink pb-4">
          <h1 className="font-serif text-4xl text-ink font-bold">{presentation.topicTitle}</h1>
          <p className="font-mono text-sm text-ink-soft mt-1">
            {presentation.moduleTitle} · Student Handout & Exam Study Guide
          </p>
        </div>

        {plates.map((plate, idx) => (
          <div key={plate.id} className="page-break space-y-4 pt-6 border-t border-rule">
            <div className="flex justify-between items-baseline">
              <h2 className="font-serif text-2xl font-bold text-ink">
                Plate {idx + 1}: {plate.title}
              </h2>
              <span className="font-mono text-xs text-ink-soft uppercase">{plate.kind}</span>
            </div>
            <p className="font-sans text-sm text-ink italic">{plate.caption}</p>
            {plate.examWords && (
              <div className="p-4 border border-ink bg-card space-y-2 text-xs">
                <strong>Exam Definition:</strong> {plate.examWords.definition}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Screen Presentation (Non-print) */}
      <div className="flex-1 flex flex-col print:hidden">
        {/* Top Status Bar (Thin, Projector-First) */}
        <header className="h-11 px-4 sm:px-6 border-b border-rule bg-card flex items-center justify-between font-mono text-xs">
          <div className="flex items-center gap-2 sm:gap-4 truncate">
            <button
              onClick={() => setIsRailOpen(r => !r)}
              className="px-2 py-0.5 border border-rule text-ink-soft hover:text-ink text-[11px] uppercase tracking-wider"
              title="Toggle Plate Strip"
            >
              {isRailOpen ? "Hide Rail ⇤" : "Show Rail ⇥"}
            </button>
            <span className="font-bold text-signal">{presentation.moduleTitle}</span>
            <span className="text-rule">/</span>
            <span className="text-ink truncate font-medium">{presentation.topicTitle}</span>
            <span className="text-rule hidden sm:inline">·</span>
            <span className="text-ink-soft hidden sm:inline">
              Plate {activePlateIndex + 1} of {plates.length}
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-4 shrink-0 font-mono text-xs">
            {/* Timer readout */}
            <div className="px-2 py-0.5 bg-paper border border-rule text-ink-soft text-[11px]">
              ⏱ {formatElapsed(elapsedSec)} / {presentation.targetDurationMinutes}:00
            </div>

            {/* Quick Action Tools */}
            <button
              onClick={() => setIsEli5(e => !e)}
              className={`px-2 py-0.5 border text-[11px] uppercase ${
                isEli5 ? "bg-signal text-paper border-signal font-bold" : "border-rule text-ink hover:bg-rule"
              }`}
              title="Toggle Simpler ELI5 Explanations [E]"
            >
              ELI5 [E]
            </button>
            <button
              onClick={() => setIsLaserActive(l => !l)}
              className={`px-2 py-0.5 border text-[11px] uppercase ${
                isLaserActive ? "bg-signal text-paper border-signal font-bold" : "border-rule text-ink hover:bg-rule"
              }`}
              title="Toggle Laser Pointer [L]"
            >
              Laser [L]
            </button>
            <button
              onClick={() => setIsDrawActive(d => !d)}
              className={`px-2 py-0.5 border text-[11px] uppercase ${
                isDrawActive ? "bg-signal text-paper border-signal font-bold" : "border-rule text-ink hover:bg-rule"
              }`}
              title="Draw on Canvas [D]"
            >
              Draw [D]
            </button>
            <button
              onClick={() => setIsNotesOpen(n => !n)}
              className={`px-2 py-0.5 border text-[11px] uppercase ${
                isNotesOpen ? "bg-signal text-paper border-signal font-bold" : "border-rule text-ink hover:bg-rule"
              }`}
              title="Speaker Notes [S]"
            >
              Notes [S]
            </button>
            <button
              onClick={() => setShowHelp(true)}
              className="px-2 py-0.5 border border-rule text-ink hover:bg-rule text-[11px]"
              title="Keyboard Shortcuts [?]"
            >
              ?
            </button>
            <button
              onClick={onExit || (() => router.back())}
              className="px-2.5 py-0.5 bg-paper border border-ink text-ink hover:bg-rule text-[11px] font-bold uppercase"
              title="Exit Presentation [Esc]"
            >
              Exit ✕
            </button>
          </div>
        </header>

        {/* Center Presentation Stage */}
        <div className="flex-1 flex overflow-hidden">
          {/* Collapsible Left Rail: Plate Thumbnails */}
          {isRailOpen && (
            <aside className="w-56 border-r border-rule bg-card flex flex-col shrink-0 overflow-y-auto p-3 space-y-2">
              <div className="font-mono text-[10px] uppercase tracking-wider text-ink-soft font-bold px-1 mb-1">
                Plate Sequence ({plates.length})
              </div>
              {plates.map((plate, idx) => (
                <button
                  key={plate.id}
                  onClick={() => changePlate(idx)}
                  className={`w-full text-left p-2.5 border transition-all text-xs ${
                    idx === activePlateIndex
                      ? "border-signal bg-paper shadow-[2px_2px_0_var(--signal)]"
                      : "border-rule bg-card hover:bg-paper"
                  }`}
                >
                  <div className="flex justify-between items-center mb-0.5">
                    <span className="font-mono text-[9px] font-bold text-ink-soft">0{idx + 1}</span>
                    <span className="font-mono text-[8px] uppercase px-1 border border-rule text-signal">
                      {plate.kind}
                    </span>
                  </div>
                  <div className="font-serif text-xs text-ink font-bold line-clamp-1">{plate.title}</div>
                </button>
              ))}

              {/* Syllabus Topic Ordering */}
              {(prevTopic || nextTopic) && (
                <div className="pt-2 border-t border-rule space-y-1.5 mt-auto">
                  <div className="font-mono text-[9px] uppercase tracking-wider text-ink-soft font-bold px-1">
                    Syllabus Sequence:
                  </div>
                  {prevTopic && (
                    <button
                      onClick={() => router.push(`/present/${presentation.moduleId.toLowerCase()}/${prevTopic.id}`)}
                      className="w-full p-1.5 border border-rule bg-paper hover:border-ink text-left font-mono text-[10px] text-ink truncate block"
                      title={prevTopic.title}
                    >
                      ← {prevTopic.title}
                    </button>
                  )}
                  {nextTopic && (
                    <button
                      onClick={() => router.push(`/present/${presentation.moduleId.toLowerCase()}/${nextTopic.id}`)}
                      className="w-full p-1.5 border border-signal bg-signal/10 hover:bg-signal hover:text-paper text-signal font-bold text-left font-mono text-[10px] truncate block"
                      title={nextTopic.title}
                    >
                      Next: {nextTopic.title} →
                    </button>
                  )}
                </div>
              )}
            </aside>
          )}

          {/* Main Visual Plate Canvas */}
          <main className="flex-1 flex flex-col justify-between p-6 sm:p-10 overflow-y-auto relative">
            {/* Top Plate Headline */}
            <div className="text-center max-w-3xl mx-auto mb-6 shrink-0">
              <span className="font-mono text-[10px] uppercase tracking-widest text-signal font-bold">
                Plate {activePlateIndex + 1} of {plates.length} · {currentPlate.kind.toUpperCase()}
              </span>
              <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl text-ink font-bold mt-1 tracking-tight">
                {currentPlate.title}
              </h1>
              {currentPlate.subtitle && (
                <p className="font-sans text-xs text-ink-soft mt-1">{currentPlate.subtitle}</p>
              )}
            </div>

            {/* Central Visual / Diagram */}
            <div className="flex-1 flex items-center justify-center my-auto w-full">
              {renderVisualContent()}
            </div>

            {/* Bottom Caption Bar */}
            <div className="mt-6 text-center max-w-2xl mx-auto shrink-0">
              <p className="font-sans text-sm sm:text-base text-ink leading-relaxed">
                {isEli5 && currentPlate.eli5Caption ? (
                  <span className="bg-signal/10 px-2 py-1 rounded-xs border-l-2 border-signal inline-block">
                    <strong>ELI5:</strong> {currentPlate.eli5Caption}
                  </span>
                ) : (
                  currentPlate.caption
                )}
              </p>
            </div>
          </main>
        </div>

        {/* Bottom Control Bar */}
        <footer className="h-12 px-6 border-t border-rule bg-card flex items-center justify-between font-mono text-xs">
          <div className="flex items-center gap-3">
            <button
              onClick={handlePrev}
              disabled={activePlateIndex === 0 && workedStepIndex === 0}
              className="px-3 py-1 bg-paper border border-ink text-ink hover:bg-rule disabled:opacity-30 disabled:cursor-not-allowed uppercase font-mono text-xs"
            >
              ← Back
            </button>
            <button
              onClick={handleNext}
              disabled={activePlateIndex === plates.length - 1}
              className="px-3 py-1 bg-ink text-paper hover:bg-signal disabled:opacity-30 disabled:cursor-not-allowed uppercase font-mono text-xs transition-colors"
            >
              Next →
            </button>
          </div>

          <div className="font-mono text-xs text-ink-soft hidden sm:flex items-center gap-4">
            <span>[← / →] Navigate</span>
            <span>[S] Notes</span>
            <span>[D] Draw</span>
            <span>[G] Plate Grid</span>
            <span>[Q] Quiz</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrintHandout}
              className="px-2.5 py-1 border border-rule hover:border-ink bg-paper text-ink font-mono text-xs uppercase"
              title="Print Topic Handout"
            >
              🖨 Handout
            </button>
          </div>
        </footer>
      </div>

      {/* Presenter Tools: Laser, Marker Canvas, Blackout, Notes, Grid */}
      <PresenterToolsOverlay
        currentPlate={currentPlate}
        allPlates={plates}
        activePlateIndex={activePlateIndex}
        onJumpToPlate={idx => changePlate(idx)}
        isLaserActive={isLaserActive}
        isDrawActive={isDrawActive}
        isBlackout={isBlackout}
        isNotesOpen={isNotesOpen}
        showJumpGrid={showJumpGrid}
        showHelp={showHelp}
        onToggleBlackout={() => setIsBlackout(b => !b)}
        onToggleNotes={() => setIsNotesOpen(n => !n)}
        onToggleJumpGrid={() => setShowJumpGrid(g => !g)}
        onToggleHelp={() => setShowHelp(h => !h)}
        onPrintHandout={handlePrintHandout}
      />
    </div>
  )
}
