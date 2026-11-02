"use client"

import React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/lib/authStore"
import { useQuizRecordsStore } from "@/lib/quizRecordsStore"
import { useMounted } from "@/hooks/useMounted"
import {
  Flame,
  ArrowRight,
  Presentation,
  BookOpen,
  Key,
  Cpu,
  Lock,
  Terminal,
  Network,
  FileKey2,
} from "lucide-react"

const enrolledCourseModules = [
  {
    id: "classical",
    code: "M1",
    title: "Introduction & Classical Cryptography",
    hours: "5 hrs",
    bloom: "Bloom L1–L3",
    icon: Key,
    desc: "OSI security architecture (X.800), symmetric cipher model, Caesar, Affine, Playfair, Vigenère, Hill, transposition, and cryptanalysis.",
    primaryTopic: "caesar",
    keyTopics: ["OSI X.800", "Caesar & Affine", "Playfair 5x5", "Hill Matrix", "Vigenère"],
  },
  {
    id: "block-public-key",
    code: "M2",
    title: "Block Ciphers & Public Key Cryptography",
    hours: "8 hrs",
    bloom: "Bloom L1–L3",
    icon: Cpu,
    desc: "Feistel design principles, cipher modes (ECB, CBC, CFB, OFB, CTR), DES, AES, RSA, ECC, and Diffie-Hellman key exchange.",
    primaryTopic: "des",
    keyTopics: ["Feistel Network", "DES & AES", "RSA Math", "Diffie-Hellman", "ECC Curves"],
  },
  {
    id: "hash-signatures",
    code: "M3",
    title: "Cryptographic Hashes & Digital Signatures",
    hours: "7 hrs",
    bloom: "Bloom L1–L4",
    icon: Lock,
    desc: "Authentication functions, MACs, HMACs, hash properties, MD5 collision exploits, SHA-256, digital signatures, and X.509 PKI trust chains.",
    primaryTopic: "mac-hmac",
    keyTopics: ["Hash Properties", "HMAC Construction", "SHA-256 / SHA-3", "Digital Signatures", "X.509 PKI"],
  },
  {
    id: "computing-resources",
    code: "M4",
    title: "Protection of Computing Resources & Features",
    hours: "8 hrs",
    bloom: "Bloom L1–L3",
    icon: Terminal,
    desc: "Secure programming, stack buffer overflows, incomplete mediation, malware defenses, access control (DAC/MAC/RBAC), and MFA security.",
    primaryTopic: "software-vulnerabilities",
    keyTopics: ["Stack Overflows", "Incomplete Mediation", "Malware Defenses", "RBAC / DAC", "MFA & Passwords"],
  },
  {
    id: "network-security",
    code: "M5",
    title: "Network Security & Defense",
    hours: "10 hrs",
    bloom: "Bloom L1–L4",
    icon: Network,
    desc: "TCP/IP vulnerabilities, ARP/IP/DNS spoofing, SYN flood, DoS/DDoS mitigation, packet filtering, stateful firewalls, and IDS/IPS.",
    primaryTopic: "layer-vulnerabilities",
    keyTopics: ["ARP / DNS Spoofing", "SYN Flood & DoS", "Stateful Firewalls", "Signature IDS", "Zero Trust"],
  },
  {
    id: "security-applications",
    code: "M6",
    title: "Network Security Applications",
    hours: "7 hrs",
    bloom: "Bloom L1–L4",
    icon: FileKey2,
    desc: "Kerberos v5 ticketing, SSL/TLS 1.3 protocol architecture, IPsec (AH & ESP), secure email (PGP & S/MIME), and AI security.",
    primaryTopic: "kerberos",
    keyTopics: ["Kerberos v5", "TLS 1.3 Handshake", "IPsec AH & ESP", "PGP / S-MIME", "AI Security"],
  },
]

export default function StudentPortalPage() {
  const router = useRouter()
  const { role, student, teacher, isAuthenticated, logout } = useAuthStore()
  const { submissions } = useQuizRecordsStore()
  const mounted = useMounted()

  if (!mounted) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-4">
        <div className="font-mono text-sm text-ink-soft animate-pulse">
          Loading student dashboard...
        </div>
      </div>
    )
  }

  // If logged in as teacher, politely guide them to Faculty Gradebook
  if (isAuthenticated && role === "teacher") {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 font-sans text-center space-y-6">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-signal/10 text-signal text-2xl font-bold">
          👩‍🏫
        </div>
        <h1 className="font-serif text-3xl font-bold text-ink">
          Faculty Session Active
        </h1>
        <p className="text-sm text-ink-soft max-w-md mx-auto">
          You are currently signed in as Faculty Examiner ({teacher?.name}). Please open the Faculty Gradebook to inspect submissions or view analytics.
        </p>
        <div className="flex items-center justify-center gap-4 pt-2">
          <Link
            href="/teacher"
            className="px-6 py-2.5 bg-signal text-paper font-mono text-xs font-bold uppercase tracking-wider hover:opacity-90 transition-opacity"
          >
            Go to Faculty Gradebook →
          </Link>
          <button
            type="button"
            onClick={logout}
            className="px-4 py-2.5 border border-rule hover:border-ink bg-card font-mono text-xs uppercase text-ink transition-colors"
          >
            Sign Out
          </button>
        </div>
      </div>
    )
  }

  // Not logged in
  if (!isAuthenticated || role !== "student" || !student) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 font-sans text-center space-y-6">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-signal/10 text-signal text-2xl font-bold">
          👨‍🎓
        </div>
        <h1 className="font-serif text-3xl font-bold text-ink">
          Student Portal Access Required
        </h1>
        <p className="text-sm text-ink-soft max-w-md mx-auto">
          Please log in with your Name and Roll Number to view your personal assessment records, quiz scorecards, and learning progress.
        </p>
        <div className="flex items-center justify-center gap-4 pt-2">
          <Link
            href="/login"
            className="px-6 py-2.5 bg-signal text-paper font-mono text-xs font-bold uppercase tracking-wider hover:opacity-90 transition-opacity"
          >
            Go to Student Login →
          </Link>
          <Link
            href="/quiz"
            className="px-5 py-2.5 border border-rule hover:border-ink bg-card font-mono text-xs uppercase text-ink transition-colors"
          >
            Take Quiz as Guest
          </Link>
        </div>
      </div>
    )
  }

  // Filter submissions for this student
  const studentSubmissions = submissions.filter(
    (s) =>
      s.rollNo.toUpperCase() === student.rollNo.toUpperCase() ||
      s.studentName.toLowerCase() === student.name.toLowerCase()
  )

  const totalAttempts = studentSubmissions.length
  const avgAccuracy =
    totalAttempts > 0
      ? Math.round(
          studentSubmissions.reduce((acc, curr) => acc + curr.accuracyRate, 0) /
            totalAttempts
        )
      : 0
  const totalEarnedMarks = studentSubmissions.reduce(
    (acc, curr) => acc + curr.earnedMarks,
    0
  )
  const totalPossibleMarks = studentSubmissions.reduce(
    (acc, curr) => acc + curr.totalMarks,
    0
  )
  const bestScore =
    totalAttempts > 0
      ? Math.max(...studentSubmissions.map((s) => s.accuracyRate))
      : 0

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 font-sans space-y-10">
      {/* Student Profile Header */}
      <div className="bg-card border-2 border-ink p-6 sm:p-8 shadow-[6px_6px_0_var(--rule)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 bg-signal text-paper font-mono text-[11px] font-bold uppercase tracking-wider">
              Student Profile
            </span>
            <span className="font-mono text-xs text-ink-soft">
              {student.department || "Computer Engineering (CMPN)"}
            </span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-ink pt-1">
            {student.name}
          </h1>
          <p className="font-mono text-xs text-ink-soft flex items-center gap-4">
            <span>Roll No: <strong className="text-ink font-semibold">{student.rollNo}</strong></span>
            <span>Batch: <strong className="text-ink font-semibold">{student.batch || "Batch A1"}</strong></span>
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/quiz"
            className="px-4 py-2 bg-ink text-paper hover:bg-signal font-mono text-xs uppercase tracking-wider transition-colors flex items-center gap-1.5"
          >
            <Flame className="h-3.5 w-3.5 text-warn" />
            <span>Launch Assessment</span>
          </Link>
          <button
            type="button"
            onClick={() => {
              logout()
              router.push("/login")
            }}
            className="px-3.5 py-2 border border-rule hover:border-ink bg-paper font-mono text-xs uppercase text-ink transition-colors"
          >
            Sign Out
          </button>
        </div>
      </div>

      {/* Top Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 bg-card border border-rule">
          <span className="font-mono text-[10px] uppercase tracking-wider text-ink-soft block font-bold">
            Total Assessments
          </span>
          <div className="font-serif text-3xl sm:text-4xl text-ink font-bold mt-1">
            {totalAttempts}
          </div>
          <span className="font-mono text-[11px] text-ink-soft mt-0.5 block">
            Recorded in Gradebook
          </span>
        </div>

        <div className="p-4 bg-card border border-rule">
          <span className="font-mono text-[10px] uppercase tracking-wider text-ink-soft block font-bold">
            Average Accuracy
          </span>
          <div className="font-serif text-3xl sm:text-4xl text-signal font-bold mt-1">
            {avgAccuracy}%
          </div>
          <span className="font-mono text-[11px] text-ink-soft mt-0.5 block">
            Across all attempts
          </span>
        </div>

        <div className="p-4 bg-card border border-rule">
          <span className="font-mono text-[10px] uppercase tracking-wider text-ink-soft block font-bold">
            Marks Earned
          </span>
          <div className="font-serif text-3xl sm:text-4xl text-ink font-bold mt-1">
            {totalEarnedMarks}
            <span className="text-base text-ink-soft font-normal ml-1">
              / {totalPossibleMarks || 0}
            </span>
          </div>
          <span className="font-mono text-[11px] text-ink-soft mt-0.5 block">
            Cumulative marks
          </span>
        </div>

        <div className="p-4 bg-card border border-rule">
          <span className="font-mono text-[10px] uppercase tracking-wider text-ink-soft block font-bold">
            Personal Best
          </span>
          <div className="font-serif text-3xl sm:text-4xl text-ok font-bold mt-1">
            {bestScore}%
          </div>
          <span className="font-mono text-[11px] text-ink-soft mt-0.5 block">
            Top quiz score
          </span>
        </div>
      </div>

      {/* ENROLLED COURSE NOTES & LABORATORIES (SHOWN ONLY UPON LOGIN) */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-2 border-ink pb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 bg-signal text-paper font-mono text-[10px] font-bold uppercase tracking-wider">
                Enrolled Course
              </span>
              <span className="font-mono text-xs text-ink-soft">
                TE Computer Engineering · Semester VI · CSC602
              </span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-ink flex items-center gap-2">
              <BookOpen className="h-6 w-6 text-signal" />
              <span>Cryptography &amp; Network Security — Notes &amp; Labs</span>
            </h2>
          </div>
          <Link
            href="/revision"
            className="px-3.5 py-1.5 border border-rule hover:border-ink bg-card font-mono text-xs uppercase text-ink transition-colors self-start sm:self-auto"
          >
            Revision Hub &amp; Formula Sheets →
          </Link>
        </div>

        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {enrolledCourseModules.map((module) => {
            const Icon = module.icon
            return (
              <div
                key={module.id}
                className="h-full flex flex-col bg-card border border-ink p-6 shadow-[4px_4px_0_var(--rule)] hover:shadow-[6px_6px_0_var(--signal)] hover:border-signal transition-all"
              >
                {/* Top Bar: Icon + Code + Badges */}
                <div className="mb-4 flex justify-between items-start">
                  <div className="p-2 border border-ink bg-paper text-signal">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="flex items-center gap-1.5 font-mono text-[10px]">
                    <span className="px-1.5 py-0.5 border border-rule bg-paper text-ink-soft font-bold">
                      {module.hours}
                    </span>
                    <span className="px-1.5 py-0.5 border border-signal/30 bg-signal/10 text-signal font-bold">
                      {module.bloom}
                    </span>
                    <span className="px-1.5 py-0.5 border border-ink bg-ink text-paper font-bold">
                      {module.code}
                    </span>
                  </div>
                </div>

                <h3 className="font-bold text-lg mb-2 font-serif text-ink">
                  {module.title}
                </h3>
                <p className="text-xs text-ink-soft leading-relaxed flex-1 mb-4 font-sans">
                  {module.desc}
                </p>

                {/* Key Topics Tag Strip */}
                <div className="flex flex-wrap gap-1.5 mb-5 font-mono text-[10px]">
                  {module.keyTopics.map((topic) => (
                    <span
                      key={topic}
                      className="px-2 py-0.5 bg-paper border border-rule text-ink-soft"
                    >
                      {topic}
                    </span>
                  ))}
                </div>

                {/* Action Buttons */}
                <div className="pt-4 border-t border-rule flex items-center justify-between gap-2 text-xs font-mono uppercase tracking-wider">
                  <Link
                    href={`/modules/${module.id}`}
                    className="px-3 py-2 bg-ink hover:bg-signal text-paper transition-colors font-bold flex items-center gap-1 text-xs shadow-xs"
                  >
                    <span>Open Notes</span>
                    <ArrowRight className="h-3 w-3" />
                  </Link>

                  <Link
                    href={`/present/${module.code.toLowerCase()}/${module.primaryTopic}`}
                    className="px-2.5 py-2 border border-rule hover:border-ink bg-paper text-ink transition-colors flex items-center gap-1 text-[11px]"
                  >
                    <Presentation className="h-3 w-3 text-signal" />
                    <span>[P] Slides</span>
                  </Link>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* Assessment History Table */}
      <div className="bg-card border border-rule space-y-4 p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-rule pb-4">
          <div>
            <h2 className="font-serif text-xl font-bold text-ink">
              My Assessment History
            </h2>
            <p className="text-xs text-ink-soft font-mono mt-0.5">
              Verified records stored for {student.name} ({student.rollNo})
            </p>
          </div>
          <Link
            href="/quiz"
            className="font-mono text-xs text-signal font-semibold hover:underline"
          >
            + Start New Assessment
          </Link>
        </div>

        {studentSubmissions.length === 0 ? (
          <div className="text-center py-10 space-y-3 font-mono">
            <span className="text-2xl block">📝</span>
            <p className="text-xs text-ink-soft">
              No quiz attempts recorded yet for {student.name}.
            </p>
            <Link
              href="/quiz"
              className="inline-block px-5 py-2 bg-signal text-paper font-mono text-xs uppercase font-bold hover:opacity-90"
            >
              Take Your First Quiz Now
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-xs border-collapse">
              <thead>
                <tr className="border-b border-rule text-ink-soft uppercase text-[10px]">
                  <th className="py-2.5 px-3">Date</th>
                  <th className="py-2.5 px-3">Assessment Mode</th>
                  <th className="py-2.5 px-3">Accuracy</th>
                  <th className="py-2.5 px-3">Marks</th>
                  <th className="py-2.5 px-3">Duration</th>
                  <th className="py-2.5 px-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-rule/60">
                {studentSubmissions.map((sub) => {
                  const isPass = sub.accuracyRate >= 50
                  const isDistinction = sub.accuracyRate >= 75
                  return (
                    <tr key={sub.id} className="hover:bg-paper/50 transition-colors">
                      <td className="py-3 px-3 text-ink-soft">
                        {new Date(sub.timestamp).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-3 font-semibold text-ink">
                        {sub.modeTitle}
                      </td>
                      <td className="py-3 px-3 font-bold">
                        <span
                          className={
                            isDistinction
                              ? "text-ok"
                              : isPass
                              ? "text-signal"
                              : "text-bad"
                          }
                        >
                          {sub.accuracyRate}%
                        </span>
                      </td>
                      <td className="py-3 px-3 text-ink">
                        {sub.earnedMarks} / {sub.totalMarks}
                      </td>
                      <td className="py-3 px-3 text-ink-soft">
                        {Math.floor(sub.durationSec / 60)}m {sub.durationSec % 60}s
                      </td>
                      <td className="py-3 px-3 text-right">
                        <span
                          className={`inline-block px-2 py-0.5 text-[10px] font-bold uppercase rounded-sm ${
                            isDistinction
                              ? "bg-ok/10 text-ok border border-ok/30"
                              : isPass
                              ? "bg-signal/10 text-signal border border-signal/30"
                              : "bg-bad/10 text-bad border border-bad/30"
                          }`}
                        >
                          {isDistinction ? "Distinction" : isPass ? "Pass" : "Review"}
                        </span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Recommended Next Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Link
          href="/quiz"
          className="p-5 bg-card border border-rule hover:border-signal transition-colors group block"
        >
          <span className="text-xl block mb-2">🎯</span>
          <h3 className="font-serif text-base font-bold text-ink group-hover:text-signal">
            Module-Wise Quizzes
          </h3>
          <p className="text-xs text-ink-soft mt-1">
            Test yourself on M1 through M6 or take the full syllabus comprehensive exam.
          </p>
        </Link>

        <Link
          href="/revision"
          className="p-5 bg-card border border-rule hover:border-signal transition-colors group block"
        >
          <span className="text-xl block mb-2">📖</span>
          <h3 className="font-serif text-base font-bold text-ink group-hover:text-signal">
            Open Revision Hub
          </h3>
          <p className="text-xs text-ink-soft mt-1">
            Access formula cheat sheets, per-module revision summaries, and syllabus progress tracking.
          </p>
        </Link>

        <Link
          href="/modules/classical"
          className="p-5 bg-card border border-rule hover:border-signal transition-colors group block"
        >
          <span className="text-xl block mb-2">🔬</span>
          <h3 className="font-serif text-base font-bold text-ink group-hover:text-signal">
            Interactive Simulators
          </h3>
          <p className="text-xs text-ink-soft mt-1">
            Practice live cipher steps: AES State Matrix, Feistel network, RSA key derivation.
          </p>
        </Link>
      </div>
    </div>
  )
}
