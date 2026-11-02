"use client"

import React, { useState } from "react"
import { Eye, EyeOff, Lock, UserCheck, Shield } from "lucide-react"
import { useAuthStore, REGISTERED_FACULTY, FacultyMember } from "@/lib/authStore"

interface FacultyLoginFormProps {
  onSuccess?: () => void
  redirectAfterLogin?: boolean
}

export function FacultyLoginForm({ onSuccess }: FacultyLoginFormProps) {
  const { loginAsTeacherCredentials } = useAuthStore()

  const [emailOrId, setEmailOrId] = useState("raman.sr@tcetmumbai.in")
  const [password, setPassword] = useState("cns2026")
  const [department, setDepartment] = useState("Computer Engineering (CMPN)")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [selectedFacultyId, setSelectedFacultyId] = useState("fac-1")

  const handleSelectFaculty = (fac: FacultyMember) => {
    setSelectedFacultyId(fac.id)
    setEmailOrId(fac.email)
    setPassword(fac.defaultPassword)
    setDepartment(fac.department)
    setError("")
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    const result = loginAsTeacherCredentials({
      emailOrId,
      password,
      department,
    })

    if (result.success) {
      if (onSuccess) {
        onSuccess()
      }
    } else {
      setError(result.error || "Invalid faculty credentials.")
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-xl mx-auto font-sans">
      <div className="space-y-1 text-left">
        <div className="inline-flex items-center gap-1.5 font-mono text-[11px] text-signal font-bold uppercase tracking-wider">
          <Shield className="h-3.5 w-3.5" />
          <span>TCET Faculty Authentication</span>
        </div>
        <h3 className="font-serif text-2xl font-bold text-ink">
          Faculty Examiner &amp; Instructor Login
        </h3>
        <p className="text-xs text-ink-soft">
          Official access to class submission ledger, live evaluation gradebook, CSV export, and lecture hall presentation mode.
        </p>
      </div>

      {error && (
        <div className="p-3 bg-bad/10 border border-bad/30 font-mono text-xs text-bad">
          {error}
        </div>
      )}

      {/* Quick Select Faculty Pills */}
      <div className="space-y-2 text-left">
        <label className="block font-mono text-[10px] uppercase tracking-wider text-ink-soft font-bold">
          Quick Fill Registered TCET Faculty Profile:
        </label>
        <div className="grid grid-cols-2 gap-2 font-mono text-[11px]">
          {REGISTERED_FACULTY.map((fac) => (
            <button
              key={fac.id}
              type="button"
              onClick={() => handleSelectFaculty(fac)}
              className={`p-2 border text-left rounded-xs transition-all ${
                selectedFacultyId === fac.id
                  ? "border-signal bg-signal/10 text-signal font-bold"
                  : "border-rule bg-paper hover:border-ink text-ink"
              }`}
            >
              <div className="truncate font-semibold">{fac.name}</div>
              <div className="text-[10px] text-ink-soft truncate">{fac.employeeId}</div>
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4 text-left">
        {/* Email / Employee ID */}
        <div>
          <label className="block font-mono text-xs uppercase tracking-wider text-ink font-bold mb-1.5">
            Faculty College Email or Employee ID *
          </label>
          <div className="relative">
            <input
              type="text"
              value={emailOrId}
              onChange={(e) => {
                setEmailOrId(e.target.value)
                setSelectedFacultyId("")
              }}
              placeholder="e.g. raman.sr@tcetmumbai.in or TCET-CMPN-104"
              className="w-full px-3.5 py-2.5 bg-paper border border-rule focus:border-signal focus:outline-none font-mono text-xs sm:text-sm text-ink"
              required
            />
            <span className="absolute right-3 top-2.5 text-xs font-mono text-ink-soft pointer-events-none">
              TCET-ID
            </span>
          </div>
        </div>

        {/* Password with visibility toggle */}
        <div>
          <div className="flex justify-between items-center mb-1.5">
            <label className="font-mono text-xs uppercase tracking-wider text-ink font-bold">
              Faculty Password *
            </label>
            <span className="font-mono text-[11px] text-signal font-semibold">
              Default: <code className="bg-paper px-1 border border-rule">cns2026</code>
            </span>
          </div>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter faculty password"
              className="w-full px-3.5 py-2.5 bg-paper border border-rule focus:border-signal focus:outline-none font-mono text-xs sm:text-sm text-ink pr-10"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-2.5 text-ink-soft hover:text-ink focus:outline-none"
              title={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>

        {/* Department Selection */}
        <div>
          <label className="block font-mono text-xs uppercase tracking-wider text-ink font-bold mb-1.5">
            Academic Department
          </label>
          <select
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            className="w-full px-3.5 py-2.5 bg-paper border border-rule focus:border-signal focus:outline-none font-sans text-xs sm:text-sm text-ink"
          >
            <option value="Computer Engineering (CMPN)">Computer Engineering (CMPN)</option>
            <option value="Information Technology (INFT)">Information Technology (INFT)</option>
            <option value="Artificial Intelligence & Data Science (AI&DS)">Artificial Intelligence &amp; Data Science (AI&amp;DS)</option>
            <option value="Electronics & Telecommunication (EXTC)">Electronics &amp; Telecommunication (EXTC)</option>
          </select>
        </div>
      </div>

      <div className="p-3 bg-paper border border-rule font-mono text-[11px] text-ink-soft flex items-center justify-between gap-2 text-left">
        <div className="flex items-center gap-2">
          <UserCheck className="h-4 w-4 text-signal shrink-0" />
          <span>Examiner credentials verified for internal evaluation.</span>
        </div>
        <span className="text-ink font-bold">TCET-AUTH</span>
      </div>

      <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-rule">
        <button
          type="button"
          onClick={() => {
            handleSelectFaculty(REGISTERED_FACULTY[0])
          }}
          className="w-full sm:w-auto font-mono text-xs text-signal hover:underline text-left font-bold"
        >
          ⚡ Reset to Prof. S. R. Raman (Course In-Charge)
        </button>
        <button
          type="submit"
          className="w-full sm:w-auto px-6 py-3 bg-ink text-paper hover:bg-signal font-mono text-xs font-bold uppercase tracking-wider transition-colors inline-flex items-center justify-center gap-2"
        >
          <Lock className="h-3.5 w-3.5" />
          <span>Sign In to Faculty Portal &rarr;</span>
        </button>
      </div>
    </form>
  )
}
