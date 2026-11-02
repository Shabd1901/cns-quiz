"use client"

import React, { useEffect } from "react"
import { useRouter } from "next/navigation"
import { ModuleShell } from "@/components/layout/ModuleShell"
import { ModuleId, getModule } from "@/lib/syllabus"
import SyllabusLearn from "./SyllabusLearn"
import SyllabusPlayground from "./SyllabusPlayground"
import SyllabusComplexity from "./SyllabusComplexity"
import SyllabusQuiz from "./SyllabusQuiz"
import SyllabusCheatSheet from "./SyllabusCheatSheet"

export default function SyllabusModuleView({ moduleId }: { moduleId: ModuleId }) {
  const router = useRouter()
  const mod = getModule(moduleId)

  const primaryTopic = mod?.topics[0]?.id || "principles"
  const presentUrl = `/present/${mod?.code.toLowerCase() || 'm1'}/${primaryTopic}`

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
      description={`${mod.code} · ${mod.hours} Hours · ${mod.bloomRange} · ${mod.description}`}
      learnContent={<SyllabusLearn moduleId={moduleId} />}
      playgroundContent={<SyllabusPlayground moduleId={moduleId} />}
      complexityContent={<SyllabusComplexity moduleId={moduleId} />}
      quizContent={<SyllabusQuiz moduleId={moduleId} />}
      cheatSheetContent={<SyllabusCheatSheet moduleId={moduleId} />}
      onPresent={() => router.push(presentUrl)}
    />
  )
}

