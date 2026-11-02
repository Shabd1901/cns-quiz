"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useAuthStore } from "@/lib/authStore"
import { useMounted } from "@/hooks/useMounted"

const navLinks = [
  { href: "/", label: "Campus LMS" },
  { href: "/#courses", label: "Courses & Notes" },
  { href: "/quiz", label: "Quiz Challenge" },
  { href: "/revision", label: "Revision Hub" },
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

        {/* Desktop Nav - ONLY WHEN LOGGED IN */}
        {isLoggedIn ? (
          <nav className="hidden md:flex items-center space-x-6 text-sm font-sans font-medium">
            {navLinks.map((link) => {
              const isActive = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href))
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

            <Link
              href="/teacher"
              className={`transition-colors hover:text-signal ${
                pathname.startsWith("/teacher") ? "text-signal font-bold" : "text-ink"
              }`}
            >
              Faculty Portal
            </Link>
          </nav>
        ) : (
          <div className="hidden md:flex items-center text-xs font-mono text-ink-soft">
            <span>TCET Autonomous Institutional LMS · Login Required</span>
          </div>
        )}

        {/* Desktop Auth Badge */}
        <div className="hidden md:flex items-center space-x-3 font-mono text-xs">
          {isLoggedIn ? (
            role === "teacher" ? (
              <div className="flex items-center gap-2">
                <Link
                  href="/teacher"
                  className="px-2.5 py-1 bg-ink text-paper hover:bg-signal font-bold uppercase transition-colors rounded-xs flex items-center gap-1.5"
                >
                  <span>👩‍🏫</span> Faculty
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
              <div className="flex items-center gap-2">
                <Link
                  href="/student"
                  className="px-2.5 py-1 bg-signal/15 border border-signal/40 text-signal font-bold uppercase hover:bg-signal hover:text-paper transition-colors rounded-xs flex items-center gap-1.5"
                >
                  <span>👨‍🎓</span> {student?.rollNo || "Student"}
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
            )
          ) : (
            <Link
              href="/login"
              className="px-3.5 py-1.5 bg-signal text-paper font-semibold uppercase tracking-wider transition-opacity hover:opacity-90"
            >
              Student / Faculty Login
            </Link>
          )}
        </div>

        {/* Mobile Hamburger Button - Only show if logged in or allow quick login link */}
        {isLoggedIn ? (
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
        ) : (
          <Link
            href="/login"
            className="md:hidden px-3 py-1 bg-signal text-paper font-mono text-xs uppercase font-bold"
          >
            Sign In
          </Link>
        )}
      </div>

      {/* Mobile Menu Dropdown (ONLY WHEN LOGGED IN) */}
      {isOpen && isLoggedIn && (
        <div className="md:hidden border-b border-rule bg-paper/98 backdrop-blur-sm px-4 pt-2 pb-6 space-y-4 animate-in fade-in slide-in-from-top-2 duration-200">
          <nav className="flex flex-col space-y-1 font-sans font-medium">
            {navLinks.map((link) => {
              const isActive = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href))
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

            <Link
              href="/teacher"
              onClick={() => setIsOpen(false)}
              className={`px-3 py-2.5 rounded text-base transition-colors ${
                pathname.startsWith("/teacher") ? "bg-signal text-paper font-bold" : "text-ink hover:bg-card hover:text-signal"
              }`}
            >
              👩‍🏫 Faculty Portal
            </Link>

            <Link
              href="/student"
              onClick={() => setIsOpen(false)}
              className={`px-3 py-2.5 rounded text-base transition-colors ${
                pathname.startsWith("/student") ? "bg-signal text-paper font-bold" : "text-ink hover:bg-card hover:text-signal"
              }`}
            >
              👨‍🎓 Student Dashboard
            </Link>
          </nav>

          {/* Mobile Auth button */}
          <div className="pt-2 border-t border-rule font-mono text-xs">
            <div className="flex items-center justify-between px-3 py-2 bg-card border border-rule">
              <div>
                <span className="text-[10px] uppercase text-ink-soft block">Signed in as</span>
                <span className="font-bold text-ink">
                  {role === "teacher" ? teacher?.name : `${student?.name} (${student?.rollNo})`}
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

          <div className="pt-3 border-t border-rule">
            <div className="px-3 text-[10px] font-mono uppercase tracking-widest text-ink-soft mb-2">
              Current Active Subject (CNS)
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
        </div>
      )}
    </header>
  )
}
