"use client"

import React, { useState } from "react"
import { useAcademicStore, AcademicMilestone } from "@/lib/academicStore"
import { Calendar, CheckCircle2, Clock, MapPin, BookOpen, Edit3, Save, X } from "lucide-react"

interface AcademicTimelineViewProps {
  isEditable?: boolean
}

export function AcademicTimelineView({ isEditable = false }: AcademicTimelineViewProps) {
  const { moduleProgress, milestones, setPortionProgress, updateMilestone } = useAcademicStore()

  // State for milestone editing modal / inline form
  const [editingMilestoneId, setEditingMilestoneId] = useState<string | null>(null)
  const [editDate, setEditDate] = useState("")
  const [editTime, setEditTime] = useState("")
  const [editVenue, setEditVenue] = useState("")
  const [editStatus, setEditStatus] = useState<AcademicMilestone["status"]>("upcoming")
  const [editMarks, setEditMarks] = useState<number>(20)
  const [editGuidelines, setEditGuidelines] = useState("")
  const [savedNotice, setSavedNotice] = useState("")

  // State for portion progress editing
  const [selectedModuleId, setSelectedModuleId] = useState<string>("m1")

  const handleStartEditMilestone = (m: AcademicMilestone) => {
    setEditingMilestoneId(m.id)
    setEditDate(m.date)
    setEditTime(m.time || "")
    setEditVenue(m.venue || "")
    setEditStatus(m.status)
    setEditMarks(m.maxMarks)
    setEditGuidelines(m.guidelines)
  }

  const handleSaveMilestone = (id: string) => {
    updateMilestone(id, {
      date: editDate,
      time: editTime,
      venue: editVenue,
      status: editStatus,
      maxMarks: Number(editMarks) || 20,
      guidelines: editGuidelines,
    })
    setEditingMilestoneId(null)
    setSavedNotice("Milestone schedule updated successfully!")
    setTimeout(() => setSavedNotice(""), 3500)
  }

  const handleUpdatePortion = (modId: string, completedVal: number) => {
    // Automatically apply TCET rule: if teacher completed till Part 5, Part 8 is unlocked (completed + 3)
    const current = moduleProgress[modId]
    if (!current) return
    const safeCompleted = Math.max(0, Math.min(current.totalTopics, completedVal))
    const unlockedVal = Math.min(current.totalTopics, safeCompleted + 3)

    setPortionProgress(modId, safeCompleted, unlockedVal)
    setSavedNotice(`Updated ${current.code} portion: Covered up to Topic ${safeCompleted} · Notes unlocked up to Topic ${unlockedVal}`)
    setTimeout(() => setSavedNotice(""), 3500)
  }

  const handleCustomUnlock = (modId: string, unlockedVal: number) => {
    const current = moduleProgress[modId]
    if (!current) return
    setPortionProgress(modId, current.completedUpTo, unlockedVal)
    setSavedNotice(`Custom unlock for ${current.code}: Notes unlocked up to Topic ${unlockedVal}`)
    setTimeout(() => setSavedNotice(""), 3500)
  }

  // Calculate overall syllabus portion covered
  const modulesList = Object.values(moduleProgress)
  const totalTopicsAll = modulesList.reduce((acc, m) => acc + m.totalTopics, 0)
  const completedTopicsAll = modulesList.reduce((acc, m) => acc + m.completedUpTo, 0)
  const unlockedTopicsAll = modulesList.reduce((acc, m) => acc + m.unlockedUpTo, 0)
  const portionPercentage = Math.round((completedTopicsAll / totalTopicsAll) * 100)

  return (
    <div className="space-y-8 font-sans">
      {/* Toast Alert */}
      {savedNotice && (
        <div className="p-3 bg-ok/10 border-2 border-ok text-ok font-mono text-xs flex items-center justify-between gap-3 shadow-[2px_2px_0_var(--ok)] animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 shrink-0" />
            <span>{savedNotice}</span>
          </div>
          <button onClick={() => setSavedNotice("")} className="hover:opacity-75">
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-card border-2 border-ink p-6 sm:p-8 shadow-[6px_6px_0_var(--rule)] space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-rule pb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 bg-signal text-paper font-mono text-[10px] font-bold uppercase tracking-wider">
                TCET Autonomous Academic Calendar
              </span>
              <span className="font-mono text-xs text-ink-soft">
                Term: Jan – May 2026 · Semester VI
              </span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-ink">
              Portion Completion &amp; Assessment Timeline
            </h2>
            <p className="text-xs sm:text-sm text-ink-soft max-w-2xl mt-1">
              Live tracking of covered syllabus topics, progressive note unlock states, and official evaluation dates for ISE 1, FA 1, ISE 3, ISE 2, FA 2, and Term Work Submission.
            </p>
          </div>

          <div className="bg-paper border border-ink p-4 min-w-[200px] text-right font-mono">
            <span className="text-[10px] uppercase text-ink-soft block font-bold">
              Portion Covered by Faculty
            </span>
            <div className="text-3xl font-bold text-signal">
              {portionPercentage}%
            </div>
            <span className="text-[11px] text-ink-soft block">
              {completedTopicsAll} of {totalTopicsAll} topics covered ({unlockedTopicsAll} unlocked)
            </span>
          </div>
        </div>

        {/* Portion Progress Across 6 Modules */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-base font-bold text-ink flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-signal" />
              <span>Module Portion Coverage &amp; Note Unlock Status</span>
            </h3>
            <span className="font-mono text-xs text-ink-soft hidden sm:inline">
              Rule: Teacher completed Part 5 &rarr; Unlocks up to Part 8 for pre-reading
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {modulesList.map((mod) => {
              const compPercent = Math.round((mod.completedUpTo / mod.totalTopics) * 100)
              const unlockPercent = Math.round((mod.unlockedUpTo / mod.totalTopics) * 100)

              return (
                <div
                  key={mod.moduleId}
                  className={`p-4 border bg-paper space-y-3 transition-all ${
                    isEditable && selectedModuleId === mod.moduleId
                      ? "border-signal shadow-[4px_4px_0_var(--signal)]"
                      : "border-rule hover:border-ink"
                  }`}
                  onClick={() => isEditable && setSelectedModuleId(mod.moduleId)}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="px-1.5 py-0.5 bg-card border border-ink text-signal font-mono text-xs font-bold mr-2">
                        {mod.code}
                      </span>
                      <h4 className="font-serif font-bold text-ink text-sm inline">
                        {mod.title}
                      </h4>
                    </div>
                    <span className="font-mono text-[10px] text-ink-soft shrink-0">
                      {mod.totalTopics} Topics
                    </span>
                  </div>

                  {/* Dual Bar: Completed (green) + Unlocked (signal) + Locked (grey) */}
                  <div className="space-y-1">
                    <div className="h-2.5 w-full bg-rule/30 rounded-xs overflow-hidden flex">
                      <div
                        className="bg-ok transition-all"
                        style={{ width: `${compPercent}%` }}
                        title={`Completed: ${mod.completedUpTo}/${mod.totalTopics}`}
                      />
                      <div
                        className="bg-signal/70 transition-all"
                        style={{ width: `${Math.max(0, unlockPercent - compPercent)}%` }}
                        title={`Unlocked Ahead: ${mod.unlockedUpTo}/${mod.totalTopics}`}
                      />
                    </div>

                    <div className="flex justify-between items-center font-mono text-[10px]">
                      <span className="text-ok font-bold">
                        ✓ Covered: Part {mod.completedUpTo} of {mod.totalTopics}
                      </span>
                      <span className="text-signal font-bold">
                        🔓 Unlocked: Part {mod.unlockedUpTo}
                      </span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-rule/50 flex justify-between items-center text-[10px] font-mono text-ink-soft">
                    <span>Updated: {mod.lastUpdatedDate}</span>
                    <span>{mod.updatedBy}</span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Faculty Portion Adjustment Controls (Rendered if isEditable) */}
        {isEditable && (
          <div className="p-4 bg-paper border border-signal rounded-xs space-y-4 mt-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-rule pb-2">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 bg-signal text-paper font-mono text-[10px] font-bold uppercase">
                  Faculty Controls
                </span>
                <span className="font-serif text-sm font-bold text-ink">
                  Update Covered Portion &amp; Unlock Limit
                </span>
              </div>
              <span className="font-mono text-xs text-ink-soft">
                Selecting module: <strong className="text-signal uppercase">{selectedModuleId}</strong>
              </span>
            </div>

            {moduleProgress[selectedModuleId] && (
              <div className="space-y-4">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-xs text-ink-soft">Switch Module:</span>
                  {modulesList.map((m) => (
                    <button
                      key={m.moduleId}
                      onClick={() => setSelectedModuleId(m.moduleId)}
                      className={`px-2.5 py-1 font-mono text-xs uppercase font-bold border transition-colors ${
                        selectedModuleId === m.moduleId
                          ? "bg-signal text-paper border-signal"
                          : "bg-card text-ink border-rule hover:border-ink"
                      }`}
                    >
                      {m.code}
                    </button>
                  ))}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div className="p-3 bg-card border border-rule space-y-2">
                    <label className="block font-mono text-xs font-bold text-ink uppercase">
                      1. Set Lecture Completed Up To:
                    </label>
                    <div className="flex items-center gap-3">
                      <select
                        value={moduleProgress[selectedModuleId].completedUpTo}
                        onChange={(e) => handleUpdatePortion(selectedModuleId, Number(e.target.value))}
                        className="px-3 py-2 bg-paper border border-ink font-mono text-sm text-ink rounded-xs flex-1"
                      >
                        {Array.from({ length: moduleProgress[selectedModuleId].totalTopics + 1 }, (_, i) => (
                          <option key={i} value={i}>
                            {i === 0 ? "Not Started (Topic 0)" : `Topic ${i} Covered`}
                          </option>
                        ))}
                      </select>
                      <span className="font-mono text-xs text-ok font-bold">
                        Part {moduleProgress[selectedModuleId].completedUpTo}
                      </span>
                    </div>
                    <p className="text-[11px] text-ink-soft font-mono">
                      *Automatically unlocks up to Part {Math.min(moduleProgress[selectedModuleId].totalTopics, moduleProgress[selectedModuleId].completedUpTo + 3)} for students.
                    </p>
                  </div>

                  <div className="p-3 bg-card border border-rule space-y-2">
                    <label className="block font-mono text-xs font-bold text-ink uppercase">
                      2. Custom Unlocked Limit (Pre-reading):
                    </label>
                    <div className="flex items-center gap-3">
                      <select
                        value={moduleProgress[selectedModuleId].unlockedUpTo}
                        onChange={(e) => handleCustomUnlock(selectedModuleId, Number(e.target.value))}
                        className="px-3 py-2 bg-paper border border-ink font-mono text-sm text-ink rounded-xs flex-1"
                      >
                        {Array.from({ length: moduleProgress[selectedModuleId].totalTopics + 1 }, (_, i) => (
                          <option key={i} value={i}>
                            {i === 0 ? "All Locked" : `Unlocked up to Topic ${i}`}
                          </option>
                        ))}
                      </select>
                      <span className="font-mono text-xs text-signal font-bold">
                        Part {moduleProgress[selectedModuleId].unlockedUpTo}
                      </span>
                    </div>
                    <p className="text-[11px] text-ink-soft font-mono">
                      Students can access and study notes up to this topic.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* The Master Academic Milestones Timeline */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b-2 border-ink pb-3">
          <div>
            <h3 className="font-serif text-2xl font-bold text-ink">
              Master Examination &amp; Evaluation Milestones
            </h3>
            <p className="text-xs text-ink-soft font-mono">
              Sequence: Modules 1–3 &rarr; ISE 1 &rarr; FA 1 &rarr; Modules 4–6 &rarr; ISE 3 &rarr; ISE 2 &rarr; FA 2 &rarr; Term Work
            </p>
          </div>

          <div className="flex items-center gap-2 font-mono text-xs">
            <span className="inline-block w-2.5 h-2.5 rounded-full bg-signal"></span>
            <span className="text-ink-soft">Upcoming Assessment</span>
            <span className="inline-block w-2.5 h-2.5 rounded-full bg-ok ml-2"></span>
            <span className="text-ink-soft">Completed</span>
          </div>
        </div>

        {/* Vertical Timeline Tree */}
        <div className="relative pl-6 sm:pl-8 border-l-2 border-rule space-y-8 ml-3 sm:ml-4">
          {milestones.map((m, index) => {
            const isEditing = editingMilestoneId === m.id
            const isCompleted = m.status === "completed"
            const isActive = m.status === "active"

            return (
              <div key={m.id} className="relative group">
                {/* Node Marker Dot on Vertical Line */}
                <div
                  className={`absolute -left-[31px] sm:-left-[39px] top-1.5 w-5 h-5 rounded-full border-2 flex items-center justify-center font-mono text-[9px] font-bold ${
                    isCompleted
                      ? "bg-ok border-ok text-paper"
                      : isActive
                      ? "bg-signal border-signal text-paper animate-pulse"
                      : "bg-paper border-ink text-ink"
                  }`}
                >
                  {index + 1}
                </div>

                {/* Milestone Card */}
                <div className="p-5 sm:p-6 bg-card border border-rule hover:border-ink hover:shadow-[4px_4px_0_var(--rule)] transition-all space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 border-b border-rule pb-3">
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2 font-mono text-[11px]">
                        <span className="px-2 py-0.5 bg-ink text-paper font-bold uppercase">
                          {m.code}
                        </span>
                        <span className="text-signal font-semibold">
                          {m.position}
                        </span>
                        <span className="text-rule">·</span>
                        <span
                          className={`px-2 py-0.5 border text-[10px] uppercase font-bold ${
                            isCompleted
                              ? "bg-ok/10 border-ok/30 text-ok"
                              : isActive
                              ? "bg-signal/10 border-signal text-signal"
                              : "bg-card border-rule text-ink-soft"
                          }`}
                        >
                          {m.status}
                        </span>
                      </div>

                      <h4 className="font-serif text-xl sm:text-2xl font-bold text-ink">
                        {m.title}
                      </h4>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <div className="p-2 border border-rule bg-paper font-mono text-xs text-right">
                        <span className="text-ink-soft block text-[10px] uppercase">Weightage</span>
                        <span className="font-bold text-ink">{m.maxMarks} Marks</span>
                      </div>

                      {isEditable && !isEditing && (
                        <button
                          onClick={() => handleStartEditMilestone(m)}
                          className="px-3 py-2 border border-rule hover:border-ink bg-paper text-ink font-mono text-xs uppercase flex items-center gap-1.5 font-semibold transition-colors"
                        >
                          <Edit3 className="h-3.5 w-3.5 text-signal" />
                          <span>Edit</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Normal Display vs Editing Mode */}
                  {isEditing ? (
                    <div className="p-4 bg-paper border border-signal space-y-4 animate-in fade-in">
                      <div className="flex items-center justify-between border-b border-rule pb-2">
                        <span className="font-mono text-xs font-bold text-signal uppercase">
                          Editing {m.code} Schedule &amp; Guidelines
                        </span>
                        <button
                          onClick={() => setEditingMilestoneId(null)}
                          className="text-ink-soft hover:text-bad"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-xs">
                        <div>
                          <label className="block text-ink-soft uppercase text-[10px] font-bold mb-1">
                            Date:
                          </label>
                          <input
                            type="date"
                            value={editDate}
                            onChange={(e) => setEditDate(e.target.value)}
                            className="w-full px-2.5 py-1.5 bg-card border border-ink text-ink rounded-xs"
                          />
                        </div>

                        <div>
                          <label className="block text-ink-soft uppercase text-[10px] font-bold mb-1">
                            Time Window:
                          </label>
                          <input
                            type="text"
                            value={editTime}
                            onChange={(e) => setEditTime(e.target.value)}
                            placeholder="e.g. 10:30 AM – 12:30 PM"
                            className="w-full px-2.5 py-1.5 bg-card border border-ink text-ink rounded-xs"
                          />
                        </div>

                        <div>
                          <label className="block text-ink-soft uppercase text-[10px] font-bold mb-1">
                            Venue:
                          </label>
                          <input
                            type="text"
                            value={editVenue}
                            onChange={(e) => setEditVenue(e.target.value)}
                            placeholder="e.g. Hall 401 & 402"
                            className="w-full px-2.5 py-1.5 bg-card border border-ink text-ink rounded-xs"
                          />
                        </div>

                        <div>
                          <label className="block text-ink-soft uppercase text-[10px] font-bold mb-1">
                            Status:
                          </label>
                          <select
                            value={editStatus}
                            onChange={(e) => setEditStatus(e.target.value as AcademicMilestone["status"])}
                            className="w-full px-2.5 py-1.5 bg-card border border-ink text-ink rounded-xs"
                          >
                            <option value="upcoming">Upcoming</option>
                            <option value="active">Active / Ongoing</option>
                            <option value="completed">Completed</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-ink-soft uppercase text-[10px] font-bold mb-1">
                            Max Marks:
                          </label>
                          <input
                            type="number"
                            value={editMarks}
                            onChange={(e) => setEditMarks(Number(e.target.value))}
                            className="w-full px-2.5 py-1.5 bg-card border border-ink text-ink rounded-xs"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block font-mono text-ink-soft uppercase text-[10px] font-bold mb-1">
                          Instructions &amp; Guidelines:
                        </label>
                        <textarea
                          rows={2}
                          value={editGuidelines}
                          onChange={(e) => setEditGuidelines(e.target.value)}
                          className="w-full px-3 py-2 bg-card border border-ink text-xs text-ink rounded-xs font-sans"
                        />
                      </div>

                      <div className="flex justify-end gap-2 pt-2">
                        <button
                          type="button"
                          onClick={() => setEditingMilestoneId(null)}
                          className="px-3 py-1.5 border border-rule hover:border-ink font-mono text-xs uppercase text-ink"
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          onClick={() => handleSaveMilestone(m.id)}
                          className="px-4 py-1.5 bg-signal text-paper font-mono text-xs uppercase font-bold hover:bg-ink transition-colors flex items-center gap-1.5"
                        >
                          <Save className="h-3.5 w-3.5" />
                          <span>Save Changes</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3 font-sans">
                      <div className="flex flex-wrap items-center gap-x-6 gap-y-2 font-mono text-xs text-ink">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="h-4 w-4 text-signal shrink-0" />
                          <span className="font-bold">
                            {new Date(m.date).toLocaleDateString("en-US", {
                              weekday: "short",
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })}
                          </span>
                        </div>

                        {m.time && (
                          <div className="flex items-center gap-1.5 text-ink-soft">
                            <Clock className="h-3.5 w-3.5 text-ink-soft shrink-0" />
                            <span>{m.time}</span>
                          </div>
                        )}

                        {m.venue && (
                          <div className="flex items-center gap-1.5 text-ink-soft">
                            <MapPin className="h-3.5 w-3.5 text-ink-soft shrink-0" />
                            <span>{m.venue}</span>
                          </div>
                        )}
                      </div>

                      <div className="p-3 bg-paper border border-rule text-xs space-y-1">
                        <div className="font-mono text-[10px] text-ink-soft uppercase font-bold">
                          Syllabus Coverage:
                        </div>
                        <p className="text-ink font-semibold">
                          {m.syllabusCoverage}
                        </p>
                      </div>

                      <p className="text-xs text-ink-soft leading-relaxed">
                        {m.guidelines}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
