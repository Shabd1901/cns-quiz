"use client"

import React, { useState, useSyncExternalStore } from "react"
import { SYLLABUS, ModuleInfo } from "@/lib/syllabus"
import Link from "next/link"

const STORAGE_KEY = "cns-syllabus-tracker-v1"

const subscribeNoop = () => () => {}
const getClientSnapshot = () => true
const getServerSnapshot = () => false

export default function SyllabusTracker() {
  const isClient = useSyncExternalStore(subscribeNoop, getClientSnapshot, getServerSnapshot)

  const [completedTopics, setCompletedTopics] = useState<Record<string, boolean>>(() => {
    if (typeof window === "undefined") return {}
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      return saved ? JSON.parse(saved) : {}
    } catch {
      return {}
    }
  })

  const toggleTopic = (topicKey: string) => {
    setCompletedTopics(prev => {
      const next = { ...prev, [topicKey]: !prev[topicKey] }
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
      } catch {
        // Ignore
      }
      return next
    })
  }

  const markAllInModule = (mod: ModuleInfo, state: boolean) => {
    setCompletedTopics(prev => {
      const next = { ...prev }
      mod.topics.forEach(t => {
        const key = `${mod.code}:${t.id}`
        next[key] = state
      })
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
      } catch {
        // Ignore
      }
      return next
    })
  }

  // Calculate totals
  let totalTopics = 0
  let completedCount = 0
  let totalHours = 0
  let completedHours = 0

  SYLLABUS.forEach(m => {
    totalHours += m.hours
    m.topics.forEach(t => {
      totalTopics += 1
      const key = `${m.code}:${t.id}`
      if (completedTopics[key]) {
        completedCount += 1
        completedHours += t.hours
      }
    })
  })

  const progressPercent = totalTopics > 0 ? Math.round((completedCount / totalTopics) * 100) : 0

  if (!isClient) {
    return <div className="p-8 text-center font-mono text-xs text-ink-soft">Loading Syllabus Coverage Tracker...</div>
  }

  return (
    <div className="space-y-8 max-w-5xl mx-auto py-4 sm:py-8">
      {/* Header and Progress Bar */}
      <div className="bg-card border border-ink p-6 shadow-[4px_4px_0_var(--rule)] space-y-4">
        <div className="flex flex-col sm:flex-row justify-between sm:items-end gap-3 border-b border-rule pb-4">
          <div>
            <div className="font-mono text-xs uppercase tracking-widest text-signal font-bold mb-1">
              Browser-Persisted Checklist
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif text-ink font-bold">
              45-Hour University Syllabus Coverage Tracker
            </h2>
            <p className="text-xs sm:text-sm text-ink-soft font-sans mt-1">
              Mark off topics as you revise. Your mastery progress is automatically preserved in your browser local storage.
            </p>
          </div>

          <div className="text-right font-mono">
            <span className="text-3xl font-bold text-signal">{progressPercent}%</span>
            <div className="text-[11px] text-ink-soft">
              {completedCount} of {totalTopics} Topics ({completedHours.toFixed(1)} / {totalHours} hrs)
            </div>
          </div>
        </div>

        {/* Visual Progress Bar */}
        <div className="h-2.5 w-full bg-rule/30 rounded-none overflow-hidden border border-rule">
          <div
            className="h-full bg-signal transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        <div className="flex justify-between items-center text-[11px] font-mono text-ink-soft">
          <span>Target: 45 Hours across 6 Modules (Bloom L1-L4)</span>
          <button
            onClick={() => {
              if (window.confirm("Reset all topic completion checkboxes?")) {
                setCompletedTopics({})
                localStorage.removeItem(STORAGE_KEY)
              }
            }}
            className="text-signal hover:underline uppercase"
          >
            Reset Progress ↺
          </button>
        </div>
      </div>

      {/* Module Topic Checklists */}
      <div className="space-y-6">
        {SYLLABUS.map(mod => {
          const modCompleted = mod.topics.filter(t => completedTopics[`${mod.code}:${t.id}`]).length
          const modPercent = Math.round((modCompleted / mod.topics.length) * 100)

          return (
            <div key={mod.id} className="bg-card border border-ink p-5 sm:p-6 shadow-[3px_3px_0_var(--rule)] space-y-4">
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 border-b border-rule pb-3">
                <div className="flex items-center gap-3">
                  <span className="px-2 py-0.5 border border-ink bg-ink text-paper font-mono text-xs font-bold">
                    {mod.code}
                  </span>
                  <div>
                    <h3 className="font-serif text-lg font-bold text-ink">{mod.title}</h3>
                    <div className="flex items-center gap-2 font-mono text-[11px] text-ink-soft">
                      <span>{mod.hours} Hours</span>
                      <span>·</span>
                      <span className="text-signal font-bold">{mod.bloomRange}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 font-mono text-xs">
                  <span className="text-ink-soft font-bold">
                    {modCompleted}/{mod.topics.length} ({modPercent}%)
                  </span>
                  <button
                    onClick={() => markAllInModule(mod, modCompleted < mod.topics.length)}
                    className="px-2 py-1 border border-rule hover:border-ink bg-paper text-[10px] uppercase font-bold"
                  >
                    {modCompleted < mod.topics.length ? "Select All" : "Deselect"}
                  </button>
                </div>
              </div>

              {/* Topics Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 font-mono text-xs">
                {mod.topics.map(topic => {
                  const key = `${mod.code}:${topic.id}`
                  const isChecked = !!completedTopics[key]

                  return (
                    <div
                      key={topic.id}
                      onClick={() => toggleTopic(key)}
                      className={`p-3 border flex items-start gap-3 cursor-pointer transition-all ${
                        isChecked
                          ? "border-ok bg-ok/10 text-ink shadow-[2px_2px_0_var(--ok)]"
                          : "border-rule bg-paper text-ink hover:border-ink"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => {}} // Handled by parent div
                        className="mt-0.5 accent-signal cursor-pointer"
                      />

                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start gap-1">
                          <span className={`font-bold text-[11px] leading-tight ${isChecked ? "text-ink" : "text-ink"}`}>
                            {topic.title}
                          </span>
                          <span className="text-[10px] text-ink-soft shrink-0">
                            {topic.hours}h · {topic.bloom}
                          </span>
                        </div>
                        <p className="text-[10px] text-ink-soft font-sans mt-0.5 line-clamp-1">
                          {topic.description}
                        </p>
                      </div>

                      <Link
                        href={`/present/${mod.code.toLowerCase()}/${topic.id}`}
                        onClick={e => e.stopPropagation()}
                        className="text-[10px] text-signal hover:underline uppercase shrink-0 pt-0.5"
                      >
                        [P]
                      </Link>
                    </div>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
