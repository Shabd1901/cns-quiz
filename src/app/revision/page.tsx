"use client"

import React from "react"
import Link from "next/link"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs"
import SyllabusTracker from "./SyllabusTracker"
import FormulaSheet from "./FormulaSheet"
import ModuleCheatSheets from "./ModuleCheatSheets"
import { motion } from "framer-motion"
import { CheckSquare, FileText, Binary, Lock } from "lucide-react"
import { useAuthStore } from "@/lib/authStore"
import { useMounted } from "@/hooks/useMounted"

export default function RevisionPage() {
  const mounted = useMounted()
  const { isAuthenticated, loginAsStudent } = useAuthStore()

  if (mounted && !isAuthenticated) {
    return (
      <div className="min-h-[75vh] flex items-center justify-center p-4 bg-paper font-sans">
        <div className="max-w-md w-full bg-card border-2 border-ink p-8 shadow-[6px_6px_0_var(--rule)] text-center space-y-5">
          <div className="w-12 h-12 rounded-full bg-signal/15 text-signal flex items-center justify-center font-bold text-xl mx-auto">
            <Lock className="h-6 w-6" />
          </div>
          <div className="space-y-2">
            <span className="font-mono text-xs uppercase tracking-wider text-signal font-bold">
              TCET LMS · Restricted Academic Access
            </span>
            <h1 className="font-serif text-2xl font-bold text-ink">
              Revision Hub Locked
            </h1>
            <p className="text-xs text-ink-soft">
              Formula sheets, module cheat sheets, and syllabus tracking are accessible to logged-in TCET engineering students and faculty only.
            </p>
          </div>

          <div className="space-y-2.5 pt-2">
            <Link
              href="/login"
              className="block w-full py-2.5 bg-signal text-paper font-mono text-xs uppercase font-bold tracking-wider hover:opacity-90"
            >
              Sign In to TCET LMS &rarr;
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
              className="block w-full py-2 border border-rule hover:border-ink bg-paper font-mono text-xs text-ink font-semibold"
            >
              ⚡ 1-Click Demo Student Access
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-paper py-8 sm:py-12 px-4 md:px-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="max-w-6xl mx-auto"
      >
        <div className="mb-6 sm:mb-10 border-b border-rule pb-6 text-center">
          <div className="inline-block bg-card border border-ink text-ink font-mono text-[10px] uppercase tracking-widest px-3 py-1 mb-3">
            Syllabus Revision Hub
          </div>
          <h1 className="text-3xl sm:text-5xl font-serif text-ink tracking-tight mb-2 font-bold">
            University Exam Revision &amp; Mastery Hub
          </h1>
          <p className="text-ink-soft text-xs sm:text-base font-sans max-w-2xl mx-auto">
            Comprehensive formula sheets, per-module cheat sheets, and live autonomous syllabus coverage tracking.
          </p>
        </div>

        <Tabs defaultValue="tracker" className="w-full">
          <div className="flex justify-center mb-6 sm:mb-8 overflow-x-auto -mx-2 px-2 scrollbar-none">
            <TabsList className="flex bg-card border border-ink shadow-[3px_3px_0_var(--rule)] sm:shadow-[4px_4px_0_var(--rule)] h-auto p-0 w-max">
              <TabsTrigger 
                value="tracker" 
                className="rounded-none border-r border-ink data-[state=active]:bg-signal data-[state=active]:text-paper px-3 sm:px-5 py-2.5 sm:py-3.5 font-mono uppercase tracking-wider text-[10px] sm:text-xs shrink-0 whitespace-nowrap"
              >
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <CheckSquare className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  Syllabus Tracker
                </div>
              </TabsTrigger>

              <TabsTrigger 
                value="cheatsheet" 
                className="rounded-none border-r border-ink data-[state=active]:bg-signal data-[state=active]:text-paper px-3 sm:px-5 py-2.5 sm:py-3.5 font-mono uppercase tracking-wider text-[10px] sm:text-xs shrink-0 whitespace-nowrap"
              >
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <FileText className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  Cheat Sheets
                </div>
              </TabsTrigger>

              <TabsTrigger 
                value="formulas" 
                className="rounded-none data-[state=active]:bg-signal data-[state=active]:text-paper px-3 sm:px-5 py-2.5 sm:py-3.5 font-mono uppercase tracking-wider text-[10px] sm:text-xs shrink-0 whitespace-nowrap"
              >
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <Binary className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  Formula Sheet
                </div>
              </TabsTrigger>
            </TabsList>
          </div>
          
          <div className="min-h-[500px]">
            <TabsContent value="tracker" className="m-0 mt-4 focus-visible:outline-none focus-visible:ring-0">
              <SyllabusTracker />
            </TabsContent>

            <TabsContent value="cheatsheet" className="m-0 mt-4 focus-visible:outline-none focus-visible:ring-0">
              <ModuleCheatSheets />
            </TabsContent>

            <TabsContent value="formulas" className="m-0 mt-4 focus-visible:outline-none focus-visible:ring-0">
              <FormulaSheet />
            </TabsContent>
          </div>
        </Tabs>
      </motion.div>
    </div>
  )
}
