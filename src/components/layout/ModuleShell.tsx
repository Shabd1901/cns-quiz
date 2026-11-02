"use client"

import React from "react"
import Link from "next/link"
import { ArrowLeft, CheckCircle2 } from "lucide-react"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/Tabs"
import { Button } from "@/components/ui/Button"
import { useAuthStore } from "@/lib/authStore"
import { useMounted } from "@/hooks/useMounted"

export interface ModuleShellProps {
  title: string
  description: string
  learnContent: React.ReactNode
  playgroundContent: React.ReactNode
  complexityContent: React.ReactNode
  quizContent: React.ReactNode
  cheatSheetContent: React.ReactNode
  onPresent?: () => void
  backHref?: string
  backLabel?: string
}

export function ModuleShell({
  title,
  description,
  learnContent,
  playgroundContent,
  complexityContent,
  quizContent,
  cheatSheetContent,
  onPresent,
  backHref = "/",
  backLabel = "Back to Modules"
}: ModuleShellProps) {
  const mounted = useMounted()
  const { role, student, teacher, isAuthenticated, loginAsStudent } = useAuthStore()
  const isUserLoggedIn = mounted && isAuthenticated

  if (mounted && !isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-16 max-w-xl text-center space-y-6 font-sans">
        <div className="w-12 h-12 rounded-full bg-signal/15 text-signal flex items-center justify-center font-bold text-xl mx-auto">
          🔒
        </div>
        <div className="space-y-2">
          <span className="font-mono text-xs uppercase tracking-wider text-signal font-bold">
            TCET LMS · Restricted Academic Access
          </span>
          <h2 className="font-serif text-3xl font-bold text-ink">
            Sign In Required to Access Notes
          </h2>
          <p className="text-xs text-ink-soft max-w-md mx-auto">
            This syllabus module ({title}) is restricted to registered TCET engineering students and faculty. Please sign in to view the notes, scrollytelling tutorials, and simulators.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link
            href="/login"
            className="w-full sm:w-auto px-6 py-2.5 bg-signal text-paper font-mono text-xs uppercase font-bold tracking-wider hover:opacity-90"
          >
            TCET Student / Faculty Login &rarr;
          </Link>
          <button
            type="button"
            onClick={() =>
              loginAsStudent({
                name: "Dev Shah",
                rollNo: "21BCP042",
                batch: "Batch A1",
                department: "Thakur College of Engineering & Technology (CMPN)",
              })
            }
            className="w-full sm:w-auto px-4 py-2.5 border border-rule hover:border-ink bg-card font-mono text-xs text-ink font-semibold"
          >
            ⚡ 1-Click Demo Access
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-4 md:py-8 max-w-[1280px] space-y-4">
      {/* Top Breadcrumb & Navigation Bar: Back Button */}
      <div className="border-b border-rule pb-3 flex items-center justify-between">
        <Link
          href={backHref}
          className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-ink-soft hover:text-signal transition-colors group py-1.5 px-3 border border-rule bg-card hover:border-ink shadow-[2px_2px_0_var(--rule)] hover:shadow-[2px_2px_0_var(--signal)]"
        >
          <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-1" />
          <span>{backLabel}</span>
        </Link>
        <div className="font-mono text-[11px] text-ink-soft uppercase tracking-widest hidden sm:flex items-center gap-2">
          {isUserLoggedIn ? (
            <span className="flex items-center gap-1.5 text-ok">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>TCET LMS · {role === "teacher" ? teacher?.name : `${student?.name} (${student?.rollNo})`}</span>
            </span>
          ) : (
            <span className="flex items-center gap-1.5 text-ink-soft">
              <span>TCET LMS · Department of Computer Engineering</span>
            </span>
          )}
        </div>
      </div>

      <Tabs defaultValue="learn" className="w-full flex flex-col md:flex-row gap-6 md:gap-12 items-start">
        
        {/* Left Rail / Mobile Top Bar */}
        <div className="w-full md:w-[220px] md:sticky md:top-24 shrink-0 space-y-4 md:space-y-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-serif text-ink tracking-tight mb-1 md:mb-2 leading-tight">{title}</h1>
            <p className="text-[11px] font-mono text-ink-soft uppercase tracking-wider">{description.split('·')[0] || description.split(' ')[0]} Module</p>
          </div>

          {/* Horizontal scrollable tab list on mobile, vertical sticky rail on desktop */}
          <div className="overflow-x-auto pb-1 -mx-4 px-4 md:mx-0 md:px-0 md:pb-0 scrollbar-none">
            <TabsList className="flex flex-row md:flex-col items-center md:items-start w-max md:w-full gap-1.5 md:gap-2 border-b md:border-none pb-2 md:pb-0 bg-transparent">
              <TabsTrigger value="learn" className="shrink-0 whitespace-nowrap text-left text-xs sm:text-sm py-2 px-3 rounded md:rounded-none border md:border-0 md:border-l-2 border-rule md:border-transparent data-[state=active]:border-signal data-[state=active]:bg-signal data-[state=active]:text-paper md:data-[state=active]:bg-signal/5 md:data-[state=active]:text-ink transition-colors">
                01 Learn
              </TabsTrigger>
              <TabsTrigger value="playground" className="shrink-0 whitespace-nowrap text-left text-xs sm:text-sm py-2 px-3 rounded md:rounded-none border md:border-0 md:border-l-2 border-rule md:border-transparent data-[state=active]:border-signal data-[state=active]:bg-signal data-[state=active]:text-paper md:data-[state=active]:bg-signal/5 md:data-[state=active]:text-ink transition-colors">
                02 Try
              </TabsTrigger>
              <TabsTrigger value="complexity" className="shrink-0 whitespace-nowrap text-left text-xs sm:text-sm py-2 px-3 rounded md:rounded-none border md:border-0 md:border-l-2 border-rule md:border-transparent data-[state=active]:border-signal data-[state=active]:bg-signal data-[state=active]:text-paper md:data-[state=active]:bg-signal/5 md:data-[state=active]:text-ink transition-colors">
                03 Cost
              </TabsTrigger>
              <TabsTrigger value="quiz" className="shrink-0 whitespace-nowrap text-left text-xs sm:text-sm py-2 px-3 rounded md:rounded-none border md:border-0 md:border-l-2 border-rule md:border-transparent data-[state=active]:border-signal data-[state=active]:bg-signal data-[state=active]:text-paper md:data-[state=active]:bg-signal/5 md:data-[state=active]:text-ink transition-colors">
                04 Quiz
              </TabsTrigger>
              <TabsTrigger value="cheatsheet" className="shrink-0 whitespace-nowrap text-left text-xs sm:text-sm py-2 px-3 rounded md:rounded-none border md:border-0 md:border-l-2 border-rule md:border-transparent data-[state=active]:border-signal data-[state=active]:bg-signal data-[state=active]:text-paper md:data-[state=active]:bg-signal/5 md:data-[state=active]:text-ink transition-colors">
                05 Recap
              </TabsTrigger>
            </TabsList>
          </div>

          {onPresent && (
            <div className="pt-2 md:pt-6 md:border-t border-rule">
              <Button onClick={onPresent} variant="outline" size="sm" className="w-full justify-center md:justify-start gap-2 font-mono text-xs uppercase tracking-wider">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
                Present <span className="hidden md:inline">[P]</span>
              </Button>
            </div>
          )}
        </div>

        {/* Main Content Area */}
        <div className="flex-1 min-w-0 w-full">
          <TabsContent value="learn" className="m-0 focus-visible:ring-0 focus-visible:outline-none">
            {learnContent}
          </TabsContent>
          <TabsContent value="playground" className="m-0 focus-visible:ring-0 focus-visible:outline-none">
            {playgroundContent}
          </TabsContent>
          <TabsContent value="complexity" className="m-0 focus-visible:ring-0 focus-visible:outline-none">
            {complexityContent}
          </TabsContent>
          <TabsContent value="quiz" className="m-0 focus-visible:ring-0 focus-visible:outline-none">
            {quizContent}
          </TabsContent>
          <TabsContent value="cheatsheet" className="m-0 focus-visible:ring-0 focus-visible:outline-none">
            {cheatSheetContent}
          </TabsContent>
        </div>

      </Tabs>
    </div>
  )
}
