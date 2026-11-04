"use client"

import React, { useEffect } from "react"
import { useRouter } from "next/navigation"
import { ModuleShell } from "@/components/layout/ModuleShell"
import { WPModuleId, getWPModule } from "@/lib/syllabus/wpSyllabus"
import WPLearn from "./WPLearn"
import WPPlayground from "./WPPlayground"
import WPComplexity from "./WPComplexity"
import WPQuiz from "./WPQuiz"
import WPCheatSheet from "./WPCheatSheet"

export default function WPModuleView({ moduleId }: { moduleId: WPModuleId }) {
  const router = useRouter()
  const mod = getWPModule(moduleId)

  const primaryTopic = mod?.topics[0]?.id || "topic1"
  const presentUrl = `/present/${mod?.code.toLowerCase() || 'wp-m1'}/${primaryTopic}`

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.key === 'p' || e.key === 'P') && !e.metaKey && !e.ctrlKey && e.target === document.body) {
        router.push(presentUrl)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [presentUrl, router])

  if (!mod) {
    return null
  }

  return (
    <ModuleShell
      title={mod.title}
      description={`ITC504 · ${mod.code} · ${mod.hours} Hours · ${mod.bloomRange} · ${mod.description}`}
      learnContent={<WPLearn moduleId={moduleId} />}
      playgroundContent={<WPPlayground moduleId={moduleId} />}
      complexityContent={<WPComplexity moduleId={moduleId} />}
      quizContent={<WPQuiz moduleId={moduleId} />}
      cheatSheetContent={<WPCheatSheet moduleId={moduleId} />}
      onPresent={() => router.push(presentUrl)}
    />
  )
}
