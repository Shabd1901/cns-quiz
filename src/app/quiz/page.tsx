"use client"

import React, { useState, useSyncExternalStore } from "react"
import { useRouter } from "next/navigation"
import { QuizModeId, QuizModeInfo } from "@/lib/quiz/v2/types"

const QUIZ_MODES: QuizModeInfo[] = [
  {
    id: 'exam-challenge',
    title: 'Exam Challenge',
    subtitle: 'Team-Based Competitive Arena',
    description: 'Multi-team tournament with timed rounds (Rapid, Scenario, Image, Mixed), live scoreboard HUD, and victory podium.',
    audience: 'Live classroom teams & lab hackathons',
    features: ['2-6 Custom Squads', 'Draining Timer Bar', 'Live Team Scoreboard', 'Podium with Confetti']
  },
  {
    id: 'classroom',
    title: 'Classroom Quiz',
    subtitle: 'Professor Projector Mode',
    description: 'One full-screen question at a time with show-of-hands vote count bars. Revealing highlights distractors and identifies class misconceptions.',
    audience: 'Lecturers projecting in auditorium',
    features: ['Show-of-Hands [1-4]', 'Classroom Heatmap', 'Misconception Analysis', 'Show Me Replay']
  },
  {
    id: 'numerical-lab',
    title: 'Numerical Lab',
    subtitle: 'Math & Cryptanalysis Practice',
    description: 'Practice modular arithmetic, key spaces, Euler totient, Affine and Hill determinants with scratchpad inputs and 3-level hints.',
    audience: 'Students preparing for university numericals',
    features: ['Random Problem Generator', 'Step-by-Step Derivations', 'Live Scratchpad Check', 'Formula Sheets']
  },
  {
    id: 'diagram-quiz',
    title: 'Diagram Quiz',
    subtitle: 'Visual Architecture & Flow Identification',
    description: 'Label architectural hotspots on cipher models, reconstruct handshake sequence timelines, and spot attacks in animated scenes.',
    audience: 'Visual learners & system architects',
    features: ['Label Hotspot Pins', 'Chronological Reordering', 'Scene Attack Spotting', 'Network Topologies']
  },
  {
    id: 'self-test',
    title: 'Self-Test by Module',
    subtitle: 'Customizable Diagnostic Assessment',
    description: 'Filter questions across specific syllabus modules (M1-M6) and Bloom taxonomy levels (L1 Remember to L4 Analyze) for diagnostic mastery.',
    audience: 'Individual self-paced study',
    features: ['Module Selector', 'Bloom Filter (L1-L4)', 'Target Question Count', 'Mastery Radar Report']
  }
]

export default function QuizModeHub() {
  const router = useRouter()
  const [selectedMode, setSelectedMode] = useState<QuizModeId>('exam-challenge')
  const hasSavedSession = useSyncExternalStore(
    () => () => {},
    () => typeof window !== "undefined" && !!localStorage.getItem("cns-quiz-session"),
    () => false
  )

  const handleStartMode = (modeId: QuizModeId) => {
    router.push(`/quiz/${modeId}/play`)
  }

  return (
    <div className="min-h-screen bg-paper py-8 px-4 sm:px-6">
      <div className="max-w-6xl w-full mx-auto space-y-8">
        {/* Top Header */}
        <div className="border-b-2 border-ink pb-6 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
          <div>
            <div className="flex items-center gap-3">
              <span className="font-mono text-xs uppercase tracking-widest text-signal font-bold">
                Assessment Engine v2
              </span>
              <span className="font-mono text-[10px] px-1.5 py-0.5 border border-rule text-ink-soft">
                9 Question Types · 5 Assessment Modes
              </span>
            </div>
            <h1 className="font-serif text-3xl sm:text-5xl text-ink font-bold mt-1">
              CNS Security Assessment Lab
            </h1>
            <p className="font-sans text-xs sm:text-sm text-ink-soft mt-1">
              Select an assessment mode tailored for live team rounds, professor classroom projection, or numerical practice.
            </p>
          </div>

          {hasSavedSession && (
            <div className="flex items-center gap-3">
              <button
                onClick={() => router.push("/quiz/exam-challenge/play")}
                className="px-3 py-1.5 border border-signal bg-signal text-paper font-mono text-xs uppercase font-bold"
              >
                Resume Session ↺
              </button>
            </div>
          )}
        </div>

        {/* 6 Mode Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {QUIZ_MODES.map(mode => {
            const isSelected = selectedMode === mode.id

            return (
              <div
                key={mode.id}
                onClick={() => setSelectedMode(mode.id)}
                className={`p-6 border flex flex-col justify-between transition-all cursor-pointer ${
                  isSelected
                    ? "border-signal bg-card shadow-[6px_6px_0_var(--signal)]"
                    : "border-rule bg-card hover:border-ink hover:bg-paper"
                }`}
              >
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-mono text-[10px] uppercase tracking-wider text-signal font-bold">
                      {mode.subtitle}
                    </span>
                    <span className="font-mono text-[9px] px-1 border border-rule text-ink-soft">
                      {mode.id}
                    </span>
                  </div>

                  <h3 className="font-serif text-2xl text-ink font-bold mb-2">{mode.title}</h3>
                  <p className="font-sans text-xs text-ink-soft leading-relaxed mb-4">
                    {mode.description}
                  </p>

                  <div className="space-y-1.5 mb-6">
                    <span className="font-mono text-[10px] uppercase text-ink-soft block font-bold">
                      Key Highlights:
                    </span>
                    {mode.features.map((feat, idx) => (
                      <div key={idx} className="flex items-center gap-2 font-mono text-[11px] text-ink">
                        <span className="text-signal">■</span>
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-rule flex items-center justify-between">
                  <span className="font-mono text-[10px] text-ink-soft truncate mr-2">
                    {mode.audience}
                  </span>
                  <button
                    onClick={e => {
                      e.stopPropagation()
                      handleStartMode(mode.id)
                    }}
                    className={`px-4 py-2 font-mono text-xs uppercase font-bold transition-colors ${
                      isSelected
                        ? "bg-signal text-paper hover:bg-ink"
                        : "bg-ink text-paper hover:bg-signal"
                    }`}
                  >
                    Launch Mode →
                  </button>
                </div>
              </div>
            )
          })}
        </div>

        {/* Syllabus Question Types Matrix Footer */}
        <div className="p-6 bg-card border border-ink shadow-[4px_4px_0_var(--rule)] space-y-4">
          <div className="flex justify-between items-center border-b border-rule pb-2">
            <h3 className="font-serif text-lg font-bold text-ink">
              Question Types Engine (9 of 9 Implemented)
            </h3>
            <span className="font-mono text-xs text-ink-soft">
              Tested across Bloom L1 (Remember) through L4 (Analyze)
            </span>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-9 gap-2 font-mono text-[11px] text-center">
            {['mcq', 'multi', 'numeric', 'order', 'match', 'label', 'spot', 'fill', 'tf-why'].map(t => (
              <div key={t} className="p-2 border border-rule bg-paper">
                <span className="text-signal block font-bold uppercase">{t}</span>
                <span className="text-ink-soft text-[9px]">Verified</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
