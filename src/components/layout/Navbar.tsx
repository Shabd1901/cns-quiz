"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useAuthStore } from "@/lib/authStore"
import { useMounted } from "@/hooks/useMounted"

const studentNavLinks = [
  { href: "/", label: "Campus LMS" },
  { href: "/student", label: "My Profile & Marks" },
  { href: "/timeline", label: "Academic Timeline" },
  { href: "/quiz", label: "Module Quizzes" },
  { href: "/revision", label: "Revision Hub" },
]

const teacherNavLinks = [
  { href: "/", label: "Campus LMS" },
  { href: "/teacher", label: "Faculty Gradebook" },
  { href: "/timeline", label: "Portion Timeline" },
  { href: "/quiz", label: "Module Quizzes" },
  { href: "/revision", label: "Revision Hub" },
]

const publicNavLinks = [
  { href: "/", label: "TCET LMS" },
  { href: "/#curriculum", label: "Curriculum Matrix" },
  { href: "/timeline", label: "Portion Timeline" },
  { href: "/#portals", label: "Campus Portals" },
  { href: "/login", label: "Student Login" },
]

const modulesList = [
  { href: "/modules/crypto", label: "Cryptography (M1)" },
  { href: "/modules/tls", label: "SSL / TLS (M2)" },
  { href: "/modules/firewall", label: "Firewalls (M4)" },
  { href: "/modules/auth", label: "Authentication (M3)" },
  { href: "/modules/attacks", label: "Attacks (M4)" },
  { href: "/modules/ids", label: "IDS / IPS (M5)" },
  { href: "/modules/cloud", label: "Cloud Security (M6)" },
  { href: "/modules/ai", label: "AI Security (M6)" },
]

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const mounted = useMounted()
  const pathname = usePathname()
  const { role, student, teacher, isAuthenticated, logout } = useAuthStore()

  const isLoggedIn = mounted && isAuthenticated
  const isStudent = isLoggedIn && role === "student"
  const isTeacher = isLoggedIn && role === "teacher"

  const activeNavLinks = isTeacher
    ? teacherNavLinks
    : isStudent
    ? studentNavLinks
    : publicNavLinks

  return (
    <header className="sticky top-0 z-50 w-full border-b border-rule bg-paper">
      <div className="container mx-auto flex h-14 items-center justify-between px-4 max-w-[1180px]">
        {/* Brand */}
        <Link href="/" className="flex items-center space-x-3 group" onClick={() => setIsOpen(false)}>
          <div className="w-8 h-8 rounded-xs bg-ink text-paper flex items-center justify-center font-serif font-bold text-sm border border-ink group-hover:bg-signal transition-colors shrink-0">
            T
          </div>
          <div className="flex flex-col">
            <span className="font-serif text-lg tracking-wide font-bold leading-tight text-ink">
              TCET LMS
            </span>
            <span className="font-mono text-[9px] text-ink-soft uppercase tracking-wider hidden sm:block">
              Thakur College of Engg &amp; Tech
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center space-x-6 text-sm font-sans font-medium">
          {activeNavLinks.map((link) => {
            const isActive =
              pathname === link.href ||
              (link.href !== "/" && !link.href.startsWith("/#") && pathname.startsWith(link.href))
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`transition-colors hover:text-signal ${
                  isActive ? "text-signal font-bold" : "text-ink"
                }`}
              >
                {link.label}
              </Link>
            )
          })}
        </nav>

        {/* Desktop Right Actions / Auth Badge */}
        <div className="hidden md:flex items-center space-x-3 font-mono text-xs">
          {isTeacher ? (
            <div className="flex items-center gap-2">
              <Link
                href="/teacher"
                className="px-2.5 py-1 bg-ink text-paper hover:bg-signal font-bold uppercase transition-colors rounded-xs flex items-center gap-1.5"
              >
                <span>👩‍🏫</span> Faculty ({teacher?.name.split(" ")[1] || "Examiner"})
              </Link>
              <button
                type="button"
                onClick={logout}
                className="text-ink-soft hover:text-ink text-[11px] underline"
                title="Sign out"
              >
                Exit
              </button>
            </div>
          ) : isStudent ? (
            <div className="flex items-center gap-2">
              <Link
                href="/student"
                className="px-2.5 py-1 bg-signal/15 border border-signal/40 text-signal font-bold uppercase hover:bg-signal hover:text-paper transition-colors rounded-xs flex items-center gap-1.5"
              >
                <span>👨‍🎓</span> {student?.rollNo || "Profile"}
              </Link>
              <button
                type="button"
                onClick={logout}
                className="text-ink-soft hover:text-ink text-[11px] underline"
                title="Sign out"
              >
                Exit
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                href="/login"
                className="px-3.5 py-1.5 bg-signal text-paper font-semibold uppercase tracking-wider transition-opacity hover:opacity-90"
              >
                Student Login
              </Link>
              <Link
                href="/teacher"
                className="text-ink-soft hover:text-ink text-[11px] underline"
              >
                Faculty Access
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Hamburger Button */}
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-ink hover:text-signal hover:bg-card focus:outline-none"
          aria-expanded={isOpen}
          aria-label="Toggle navigation menu"
        >
          {isOpen ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div className="md:hidden border-b border-rule bg-paper/98 backdrop-blur-sm px-4 pt-2 pb-6 space-y-4 animate-in fade-in slide-in-from-top-2 duration-200">
          <nav className="flex flex-col space-y-1 font-sans font-medium">
            {activeNavLinks.map((link) => {
              const isActive =
                pathname === link.href ||
                (link.href !== "/" && !link.href.startsWith("/#") && pathname.startsWith(link.href))
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={`px-3 py-2.5 rounded text-base transition-colors ${
                    isActive ? "bg-signal text-paper font-bold" : "text-ink hover:bg-card hover:text-signal"
                  }`}
                >
                  {link.label}
                </Link>
              )
            })}

            {!isLoggedIn && (
              <div className="pt-2 flex flex-col gap-2">
                <Link
                  href="/login"
                  onClick={() => setIsOpen(false)}
                  className="px-3 py-2 bg-signal text-paper font-mono text-xs uppercase font-bold text-center"
                >
                  Student Login
                </Link>
                <Link
                  href="/teacher"
                  onClick={() => setIsOpen(false)}
                  className="px-3 py-2 border border-rule bg-card text-ink font-mono text-xs uppercase text-center"
                >
                  Faculty Portal Access
                </Link>
              </div>
            )}
          </nav>

          {/* Mobile Auth status when logged in */}
          {isLoggedIn && (
            <div className="pt-2 border-t border-rule font-mono text-xs">
              <div className="flex items-center justify-between px-3 py-2 bg-card border border-rule">
                <div>
                  <span className="text-[10px] uppercase text-ink-soft block">
                    {isTeacher ? "Faculty Account" : "Student Account"}
                  </span>
                  <span className="font-bold text-ink">
                    {isTeacher ? teacher?.name : `${student?.name} (${student?.rollNo})`}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    logout()
                    setIsOpen(false)
                  }}
                  className="px-2.5 py-1 bg-paper border border-rule text-bad uppercase font-bold"
                >
                  Exit
                </button>
              </div>
            </div>
          )}

          {isLoggedIn && (
            <div className="pt-3 border-t border-rule">
              <div className="px-3 text-[10px] font-mono uppercase tracking-widest text-ink-soft mb-2">
                Active Course Modules (CNS)
              </div>
              <div className="grid grid-cols-2 gap-1 text-xs font-mono">
                {modulesList.map((mod) => (
                  <Link
                    key={mod.href}
                    href={mod.href}
                    onClick={() => setIsOpen(false)}
                    className={`p-2 rounded hover:bg-card hover:text-signal truncate transition-colors ${
                      pathname === mod.href ? "text-signal font-bold bg-signal/5" : "text-ink"
                    }`}
                  >
                    {mod.label}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </header>
  )
}
