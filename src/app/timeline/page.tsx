"use client"

import React from "react"
import Link from "next/link"
import { useAuthStore } from "@/lib/authStore"
import { useMounted } from "@/hooks/useMounted"
import { AcademicTimelineView } from "@/components/academic/AcademicTimelineView"
import { ShieldCheck, GraduationCap } from "lucide-react"

export default function AcademicTimelinePage() {
  const mounted = useMounted()
  const { role, isAuthenticated, student, teacher } = useAuthStore()

  if (!mounted) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-4">
        <div className="font-mono text-sm text-ink-soft animate-pulse">
          Loading TCET Academic Timeline...
        </div>
      </div>
    )
  }

  const isTeacher = isAuthenticated && role === "teacher"
  const isStudent = isAuthenticated && role === "student"

  return (
    <div className="min-h-screen bg-paper py-8 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Navigation Breadcrumb / Role Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-rule pb-4 font-mono text-xs">
          <div className="flex items-center gap-2">
            <Link href="/" className="text-ink-soft hover:text-signal">
              TCET LMS
            </Link>
            <span className="text-rule">/</span>
            <span className="text-signal font-bold">Academic Assessment Timeline</span>
          </div>

          <div>
            {isTeacher ? (
              <span className="px-2.5 py-1 bg-ink text-paper font-bold flex items-center gap-1.5 rounded-xs">
                <ShieldCheck className="h-3.5 w-3.5 text-signal" />
                <span>Faculty Examiner Mode ({teacher?.name}) · Editing Enabled</span>
              </span>
            ) : isStudent ? (
              <span className="px-2.5 py-1 bg-card border border-ink text-ink font-bold flex items-center gap-1.5 rounded-xs">
                <GraduationCap className="h-3.5 w-3.5 text-signal" />
                <span>Student View ({student?.name} · {student?.rollNo})</span>
              </span>
            ) : (
              <div className="flex items-center gap-2">
                <span className="text-ink-soft">Guest View</span>
                <span>·</span>
                <Link href="/login" className="text-signal font-bold hover:underline">
                  Sign In for Personalized Dates →
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Master Timeline View */}
        <AcademicTimelineView isEditable={isTeacher} />
      </div>
    </div>
  )
}
