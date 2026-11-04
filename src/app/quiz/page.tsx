"use client"

import React, { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/lib/authStore"
import { useMounted } from "@/hooks/useMounted"
import {
  Award,
  GraduationCap,
  Clock,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  FileCheck,
  Layers,
  HelpCircle,
  Sparkles
} from "lucide-react"

interface ModuleQuizItem {
  code: string
  id: string
  title: string
  hours: number
  bloom: string
  questionCount: number
  description: string
  topics: string[]
  color: string
}

const CNS_MODULE_QUIZZES: ModuleQuizItem[] = [
  {
    code: "M1",
    id: "m1",
    title: "Introduction & Classical Cryptography",
    hours: 5,
    bloom: "Bloom L1–L3",
    questionCount: 38,
    description: "OSI X.800 architecture, symmetric models, Caesar, Affine, Playfair, Hill, Vigenère, and transposition ciphers.",
    topics: ["Caesar & Monoalphabetic", "Affine Modular Arithmetic", "Playfair 5x5 Matrix", "Hill Matrix & Inverses", "Transposition Ciphers"],
    color: "border-ink"
  },
  {
    code: "M2",
    id: "m2",
    title: "Block Ciphers & Public Key Cryptography",
    hours: 8,
    bloom: "Bloom L1–L3",
    questionCount: 30,
    description: "Feistel networks, DES rounds, AES substitution-permutation layers, block modes (ECB, CBC, CFB, OFB, CTR), RSA, Diffie-Hellman, and ECC.",
    topics: ["DES & 16-Round Feistel", "AES S-Box & MixColumns", "Block Cipher Modes", "RSA Factorization", "Diffie-Hellman & ECC"],
    color: "border-ink"
  },
  {
    code: "M3",
    id: "m3",
    title: "Cryptographic Hashes & Digital Signatures",
    hours: 7,
    bloom: "Bloom L1–L4",
    questionCount: 25,
    description: "MD5, SHA-512 Merkle-Damgård construction, HMAC, Birthday collision attack bounds, Digital Signature Algorithm (DSA), PKI, and X.509.",
    topics: ["SHA-512 vs MD5", "HMAC Key Padding", "Birthday Bound Attack", "DSA Verification", "X.509 Certificates & PKI"],
    color: "border-ink"
  },
  {
    code: "M4",
    id: "m4",
    title: "Protection of Computing Resources & System Security",
    hours: 8,
    bloom: "Bloom L1–L3",
    questionCount: 25,
    description: "Access control matrices, DAC vs MAC vs RBAC, memory exploits (Buffer Overflow, Format Strings), web injection (SQLi, XSS), and defenses.",
    topics: ["DAC, MAC & RBAC", "Buffer Overflow Exploits", "SQL Injection Patterns", "Cross-Site Scripting (XSS)", "Stack Canary Defenses"],
    color: "border-ink"
  },
  {
    code: "M5",
    id: "m5",
    title: "Network Security & Defense",
    hours: 10,
    bloom: "Bloom L1–L4",
    questionCount: 25,
    description: "Stateless vs stateful packet filters, application firewalls, DMZ perimeter architecture, Snort rule syntax, signature vs anomaly IDS, and honeypots.",
    topics: ["Packet Filtering Rules", "Stateful Inspection & DMZ", "Snort Rule Anatomy", "Signature vs Anomaly IDS", "Honeypot Decoy Systems"],
    color: "border-ink"
  },
  {
    code: "M6",
    id: "m6",
    title: "Network Security Applications & Emerging Threats",
    hours: 7,
    bloom: "Bloom L1–L4",
    questionCount: 29,
    description: "IPsec AH/ESP in tunnel and transport modes, SSL/TLS 1.3 handshake sequence, Kerberos v5 ticket-granting, PGP/S-MIME, and Cloud/AI security.",
    topics: ["IPsec Tunnel vs Transport", "TLS 1.3 Handshake", "Kerberos v5 AS/TGS", "PGP Hybrid Cryptosystem", "Cloud & Adversarial AI"],
    color: "border-ink"
  }
]

const WP_MODULE_QUIZZES: ModuleQuizItem[] = [
  {
    code: "WP-M1",
    id: "wp-m1",
    title: "Web Tech Fundamentals, HTML5 & CSS3",
    hours: 8,
    bloom: "Bloom L1–L3, L6",
    questionCount: 5,
    description: "HTML5 semantic layout, CSS Box Model calculation, Flexbox 1D, CSS Grid 2D, and mobile viewport responsive queries.",
    topics: ["HTML5 Semantics", "CSS Box Model", "Flexbox 1D Layout", "CSS Grid Matrix", "Responsive Queries"],
    color: "border-ink"
  },
  {
    code: "WP-M2",
    id: "wp-m2",
    title: "JavaScript & Modern Client-Side",
    hours: 8,
    bloom: "Bloom L1–L3, L6",
    questionCount: 5,
    description: "Scoping (var/let/const), DOM event bubbling & delegation, ES6+ arrow functions/destructuring, and Event Loop microtasks.",
    topics: ["Block Scoping & Closures", "DOM Event Delegation", "ES6+ Destructuring", "Microtasks vs Macrotasks", "Promises & Async/Await"],
    color: "border-ink"
  },
  {
    code: "WP-M3",
    id: "wp-m3",
    title: "Frontend Engineering: React & Next.js",
    hours: 8,
    bloom: "Bloom L1–L3, L5–L6",
    questionCount: 5,
    description: "Virtual DOM reconciliation diffing, useState & useEffect dependency rules, Next.js SSR vs SSG vs ISR rendering.",
    topics: ["Virtual DOM O(N) Diff", "useState & useEffect", "Next.js App Router", "SSR vs SSG vs ISR", "Controlled Form State"],
    color: "border-ink"
  },
  {
    code: "WP-M4",
    id: "wp-m4",
    title: "Server-Side: Node.js & Express.js",
    hours: 7,
    bloom: "Bloom L1–L3, L5–L6",
    questionCount: 5,
    description: "Node.js libuv event loop, Express middleware pipeline (req, res, next), RESTful API design, and error handlers.",
    topics: ["V8 & libuv Architecture", "Express Middleware Chain", "RESTful Status Codes", "fs Streams vs Buffer", "CORS Preflight Config"],
    color: "border-ink"
  },
  {
    code: "WP-M5",
    id: "wp-m5",
    title: "Server-Side: PHP & MySQL (PDO)",
    hours: 9,
    bloom: "Bloom L1–L4, L6",
    questionCount: 5,
    description: "PHP Superglobals, session_start() persistence, MySQL PDO prepared statements, and SQL injection defense.",
    topics: ["PHP Superglobals", "session_start() Engine", "PDO Prepared Statements", "SQLi & XSS Mitigation", "password_hash() Bcrypt"],
    color: "border-ink"
  },
  {
    code: "WP-M6",
    id: "wp-m6",
    title: "Full-Stack Architecture & Web Security",
    hours: 5,
    bloom: "Bloom L1–L3, L6",
    questionCount: 5,
    description: "3-tier architecture, CORS headers, stateless JWT token authentication, Git version control, and OWASP Top 10 defenses.",
    topics: ["3-Tier Separation", "CORS Preflight Flow", "Stateless JWT Structure", "Git Conflict Resolution", "OWASP Top 10 Defenses"],
    color: "border-ink"
  }
]

export default function ModuleQuizHub() {
  const router = useRouter()
  const mounted = useMounted()
  const { student, role } = useAuthStore()

  // The two core formats: 'module-wise' and 'full-syllabus'
  const [quizType, setQuizType] = useState<'module-wise' | 'full-syllabus'>('module-wise')
  const [subject, setSubject] = useState<'CSC602' | 'ITC504'>('CSC602')

  const isStudent = mounted && role === "student" && student
  const activeQuizzes = subject === 'CSC602' ? CNS_MODULE_QUIZZES : WP_MODULE_QUIZZES

  return (
    <div className="min-h-screen bg-paper py-8 px-4 sm:px-6">
      <div className="max-w-6xl w-full mx-auto space-y-8">
        {/* Top Header */}
        <div className="border-b-2 border-ink pb-6 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
          <div>
            <div className="flex items-center gap-3">
              <span className="font-mono text-xs uppercase tracking-widest text-signal font-bold">
                TCET LMS · Assessment Hub
              </span>
              <span className="font-mono text-[10px] px-1.5 py-0.5 border border-rule text-ink-soft">
                Module-Wise Practice &amp; Full Syllabus Exams
              </span>
            </div>
            <h1 className="font-serif text-3xl sm:text-5xl text-ink font-bold mt-1">
              Curriculum Quizzes &amp; Assessments
            </h1>
            <p className="font-sans text-xs sm:text-sm text-ink-soft mt-1 max-w-2xl leading-relaxed">
              Test your mastery with targeted unit-by-unit quizzes featuring instant inside-window feedback,
              or challenge yourself with comprehensive Full Syllabus Examinations.
            </p>
          </div>

          <div className="flex flex-col sm:items-end gap-2 shrink-0">
            {isStudent ? (
              <div className="p-3 bg-card border border-ink font-mono text-xs text-right">
                <span className="text-[10px] uppercase text-ink-soft block font-bold">Logged In Student</span>
                <span className="font-bold text-ink">{student.name}</span>
                <span className="text-ink-soft block text-[11px]">{student.rollNo} · {student.batch || "TCET"}</span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/login"
                  className="px-3.5 py-1.5 border border-rule hover:border-ink bg-card font-mono text-xs uppercase text-ink"
                >
                  Student Login →
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Primary Controls: Quiz Type (Module-Wise vs Full Syllabus) & Course Switcher */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-rule pb-4">
          {/* Format Tabs: Module-Wise vs Full Syllabus */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setQuizType('module-wise')}
              className={`px-4 py-2 font-mono text-xs uppercase font-bold border transition-all cursor-pointer flex items-center gap-2 ${
                quizType === 'module-wise'
                  ? "bg-signal text-paper border-signal shadow-[2px_2px_0_var(--ink)]"
                  : "bg-paper text-ink border-rule hover:border-ink"
              }`}
            >
              <Award className="h-4 w-4" />
              <span>📝 Module-Wise Quizzes</span>
            </button>
            <button
              onClick={() => setQuizType('full-syllabus')}
              className={`px-4 py-2 font-mono text-xs uppercase font-bold border transition-all cursor-pointer flex items-center gap-2 ${
                quizType === 'full-syllabus'
                  ? "bg-signal text-paper border-signal shadow-[2px_2px_0_var(--ink)]"
                  : "bg-paper text-ink border-rule hover:border-ink"
              }`}
            >
              <GraduationCap className="h-4 w-4" />
              <span>🎓 Full Syllabus Exam</span>
            </button>
          </div>

          {/* Course Switcher */}
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs text-ink-soft uppercase font-bold">Course:</span>
            <button
              onClick={() => setSubject('CSC602')}
              className={`px-3 py-1.5 text-xs font-mono font-bold uppercase border cursor-pointer transition-colors ${
                subject === 'CSC602' ? "bg-ink text-paper border-ink" : "bg-card text-ink border-rule hover:border-ink"
              }`}
            >
              CSC602 (CNS)
            </button>
            <button
              onClick={() => setSubject('ITC504')}
              className={`px-3 py-1.5 text-xs font-mono font-bold uppercase border cursor-pointer transition-colors ${
                subject === 'ITC504' ? "bg-ink text-paper border-ink" : "bg-card text-ink border-rule hover:border-ink"
              }`}
            >
              ITC504 (WP)
            </button>
          </div>
        </div>

        {/* VIEW 1: MODULE-WISE PRACTICE QUIZZES */}
        {quizType === 'module-wise' && (
          <div className="space-y-6">
            {/* Quick Switch Banner to Full Syllabus */}
            <div className="p-4 bg-card border border-rule flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <div className="flex items-center gap-2.5">
                <GraduationCap className="h-5 w-5 text-signal shrink-0" />
                <span className="font-sans text-xs text-ink-soft">
                  Preparing for final university examinations? Attempt the timed
                  <strong className="text-ink ml-1">Full Syllabus Examination</strong> covering all 6 curriculum modules.
                </span>
              </div>
              <button
                onClick={() => setQuizType('full-syllabus')}
                className="font-mono text-xs text-signal font-bold hover:underline shrink-0 flex items-center gap-1 cursor-pointer"
              >
                <span>View Full Syllabus Exam</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
              <h2 className="font-serif text-2xl font-bold text-ink">
                {subject === 'CSC602'
                  ? "CNS Module-Wise Targeted Practice Quizzes (M1 – M6)"
                  : "Web Programming Module-Wise Quizzes (WP-M1 – WP-M6)"}
              </h2>
              <span className="font-mono text-xs text-ink-soft">
                Instant inside-window grading &amp; detailed explanations
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {activeQuizzes.map((mod) => (
                <div
                  key={mod.id}
                  className="p-6 border border-rule bg-card hover:border-ink hover:shadow-[4px_4px_0_var(--ink)] transition-all flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="px-2 py-0.5 bg-paper border border-ink font-mono text-xs font-bold text-signal">
                        {mod.code}
                      </span>
                      <span className="font-mono text-[11px] text-ink-soft">
                        {mod.hours} Syllabus Hours
                      </span>
                    </div>

                    <h3 className="font-serif text-xl font-bold text-ink mb-2 group-hover:text-signal transition-colors">
                      {mod.title}
                    </h3>

                    <p className="font-sans text-xs text-ink-soft leading-relaxed mb-4">
                      {mod.description}
                    </p>

                    <div className="space-y-1.5 mb-6">
                      <span className="font-mono text-[10px] uppercase text-ink-soft block font-bold">
                        Key Topics Covered:
                      </span>
                      {mod.topics.map((t, idx) => (
                        <div key={idx} className="flex items-center gap-2 font-mono text-[11px] text-ink">
                          <span className="text-signal text-[10px]">■</span>
                          <span className="truncate">{t}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-rule flex items-center justify-between">
                    <div>
                      <span className="font-mono text-xs font-bold text-ink block">
                        {mod.questionCount} Questions
                      </span>
                      <span className="font-mono text-[10px] text-ink-soft">
                        {mod.bloom}
                      </span>
                    </div>

                    <button
                      onClick={() => router.push(`/quiz/${mod.id}/play`)}
                      className="px-4 py-2 bg-ink text-paper group-hover:bg-signal font-mono text-xs uppercase font-bold transition-colors shadow-[2px_2px_0_var(--rule)] cursor-pointer"
                    >
                      Start {mod.code} Quiz →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* VIEW 2: FULL SYLLABUS EXAMINATION */}
        {quizType === 'full-syllabus' && (
          <div className="space-y-6">
            {/* Quick Switch Banner to Module-Wise */}
            <div className="p-4 bg-card border border-rule flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <div className="flex items-center gap-2.5">
                <BookOpen className="h-5 w-5 text-signal shrink-0" />
                <span className="font-sans text-xs text-ink-soft">
                  Need to practice an individual topic first? You can test unit-by-unit with
                  <strong className="text-ink ml-1">Module-Wise Quizzes</strong>.
                </span>
              </div>
              <button
                onClick={() => setQuizType('module-wise')}
                className="font-mono text-xs text-signal font-bold hover:underline shrink-0 flex items-center gap-1 cursor-pointer"
              >
                <span>Switch to Module Quizzes</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>

            {/* CNS Full Syllabus Exam */}
            {subject === 'CSC602' ? (
              <div className="space-y-6">
                <div className="p-6 sm:p-8 bg-card border-2 border-ink shadow-[6px_6px_0_var(--ink)] space-y-6">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-rule pb-6">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="px-2 py-0.5 bg-signal text-paper font-mono text-xs font-bold uppercase tracking-wider">
                          Full Syllabus Mock Exam
                        </span>
                        <span className="font-mono text-xs text-ink-soft font-semibold">
                          Mumbai University Pattern Simulation · CSC602
                        </span>
                      </div>
                      <h2 className="font-serif text-2xl sm:text-4xl font-bold text-ink">
                        Comprehensive 45-Question CNS Examination
                      </h2>
                      <p className="font-sans text-xs sm:text-sm text-ink-soft mt-1 max-w-2xl leading-relaxed">
                        Strictly weighted question distribution covering all curriculum units (M1 to M6) with live per-question countdown timer,
                        immediate grading, distractor analysis, and diagnostic Bloom level analytics.
                      </p>
                    </div>

                    <button
                      onClick={() => router.push("/quiz/all/play")}
                      className="px-6 py-4 bg-signal text-paper font-mono text-xs uppercase tracking-wider font-bold hover:bg-ink transition-colors shadow-[3px_3px_0_var(--ink)] shrink-0 w-full md:w-auto text-center cursor-pointer"
                    >
                      Launch CNS Full Exam (45 Qs) →
                    </button>
                  </div>

                  {/* 4 Key Exam Specs */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 font-mono text-center">
                    <div className="p-4 border border-rule bg-paper">
                      <span className="text-ink-soft text-[10px] uppercase font-bold block mb-1">Total Questions</span>
                      <span className="text-2xl font-bold text-ink">45 Qs</span>
                      <span className="text-[10px] text-signal block mt-1">Balanced Units</span>
                    </div>
                    <div className="p-4 border border-rule bg-paper">
                      <span className="text-ink-soft text-[10px] uppercase font-bold block mb-1">Time Limit</span>
                      <span className="text-2xl font-bold text-ink">45 Min</span>
                      <span className="text-[10px] text-ink-soft block mt-1">Draining Timer Bar</span>
                    </div>
                    <div className="p-4 border border-rule bg-paper">
                      <span className="text-ink-soft text-[10px] uppercase font-bold block mb-1">Total Marks</span>
                      <span className="text-2xl font-bold text-ink">100 Marks</span>
                      <span className="text-[10px] text-ok block mt-1">Scaled Score</span>
                    </div>
                    <div className="p-4 border border-rule bg-paper">
                      <span className="text-ink-soft text-[10px] uppercase font-bold block mb-1">Bloom Taxonomy</span>
                      <span className="text-2xl font-bold text-ink">L1 – L4</span>
                      <span className="text-[10px] text-ink-soft block mt-1">Analysis &amp; Design</span>
                    </div>
                  </div>

                  {/* Syllabus Weightage Breakdown Table */}
                  <div className="border border-rule bg-paper p-5 space-y-3">
                    <h3 className="font-serif text-lg font-bold text-ink">
                      Curriculum Unit Weightage Breakdown
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 font-mono text-xs">
                      <div className="p-3 border border-rule bg-card space-y-1">
                        <div className="flex justify-between font-bold text-ink">
                          <span>M1: Classical Cryptography</span>
                          <span className="text-signal">8 Questions</span>
                        </div>
                        <p className="text-[11px] text-ink-soft font-sans">Caesar, Playfair, Hill, Affine, Transposition ciphers.</p>
                      </div>
                      <div className="p-3 border border-rule bg-card space-y-1">
                        <div className="flex justify-between font-bold text-ink">
                          <span>M2: Block &amp; Public Key</span>
                          <span className="text-signal">8 Questions</span>
                        </div>
                        <p className="text-[11px] text-ink-soft font-sans">DES rounds, AES layers, Block modes, RSA, DH &amp; ECC.</p>
                      </div>
                      <div className="p-3 border border-rule bg-card space-y-1">
                        <div className="flex justify-between font-bold text-ink">
                          <span>M3: Hashes &amp; Signatures</span>
                          <span className="text-signal">8 Questions</span>
                        </div>
                        <p className="text-[11px] text-ink-soft font-sans">SHA-512, MD5, HMAC, DSA, X.509 &amp; PKI trust trees.</p>
                      </div>
                      <div className="p-3 border border-rule bg-card space-y-1">
                        <div className="flex justify-between font-bold text-ink">
                          <span>M4: Computing Resources</span>
                          <span className="text-signal">7 Questions</span>
                        </div>
                        <p className="text-[11px] text-ink-soft font-sans">DAC/MAC/RBAC, Buffer Overflows, SQLi, XSS, Canaries.</p>
                      </div>
                      <div className="p-3 border border-rule bg-card space-y-1">
                        <div className="flex justify-between font-bold text-ink">
                          <span>M5: Network Security &amp; Defense</span>
                          <span className="text-signal">7 Questions</span>
                        </div>
                        <p className="text-[11px] text-ink-soft font-sans">Firewall rules, DMZ, Snort rule syntax, IDS/IPS, Honeypots.</p>
                      </div>
                      <div className="p-3 border border-rule bg-card space-y-1">
                        <div className="flex justify-between font-bold text-ink">
                          <span>M6: Applications &amp; Threats</span>
                          <span className="text-signal">7 Questions</span>
                        </div>
                        <p className="text-[11px] text-ink-soft font-sans">IPsec tunnel/transport, TLS 1.3 handshake, Kerberos, Cloud/AI.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              /* WP Full Syllabus Exam */
              <div className="space-y-6">
                <div className="p-6 sm:p-8 bg-card border-2 border-ink shadow-[6px_6px_0_var(--ink)] space-y-6">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-rule pb-6">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="px-2 py-0.5 bg-signal text-paper font-mono text-xs font-bold uppercase tracking-wider">
                          Full Syllabus Examination
                        </span>
                        <span className="font-mono text-xs text-ink-soft font-semibold">
                          Comprehensive Web Engineering Assessment · ITC504
                        </span>
                      </div>
                      <h2 className="font-serif text-2xl sm:text-4xl font-bold text-ink">
                        Comprehensive 30-Question Web Programming Exam
                      </h2>
                      <p className="font-sans text-xs sm:text-sm text-ink-soft mt-1 max-w-2xl leading-relaxed">
                        End-to-end curriculum evaluation covering HTML5/CSS3, modern JavaScript ES6+, React &amp; Next.js frontend,
                        Node.js &amp; Express backend, PHP &amp; MySQL PDO, and full-stack web security.
                      </p>
                    </div>

                    <button
                      onClick={() => router.push("/quiz/wp-all/play")}
                      className="px-6 py-4 bg-signal text-paper font-mono text-xs uppercase tracking-wider font-bold hover:bg-ink transition-colors shadow-[3px_3px_0_var(--ink)] shrink-0 w-full md:w-auto text-center cursor-pointer"
                    >
                      Launch WP Full Exam (30 Qs) →
                    </button>
                  </div>

                  {/* 4 Key Exam Specs */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 font-mono text-center">
                    <div className="p-4 border border-rule bg-paper">
                      <span className="text-ink-soft text-[10px] uppercase font-bold block mb-1">Total Questions</span>
                      <span className="text-2xl font-bold text-ink">30 Qs</span>
                      <span className="text-[10px] text-signal block mt-1">5 Qs Per Unit</span>
                    </div>
                    <div className="p-4 border border-rule bg-paper">
                      <span className="text-ink-soft text-[10px] uppercase font-bold block mb-1">Time Limit</span>
                      <span className="text-2xl font-bold text-ink">30 Min</span>
                      <span className="text-[10px] text-ink-soft block mt-1">Timed Assessment</span>
                    </div>
                    <div className="p-4 border border-rule bg-paper">
                      <span className="text-ink-soft text-[10px] uppercase font-bold block mb-1">Total Marks</span>
                      <span className="text-2xl font-bold text-ink">60 Marks</span>
                      <span className="text-[10px] text-ok block mt-1">Curriculum Marks</span>
                    </div>
                    <div className="p-4 border border-rule bg-paper">
                      <span className="text-ink-soft text-[10px] uppercase font-bold block mb-1">Bloom Taxonomy</span>
                      <span className="text-2xl font-bold text-ink">L1 – L6</span>
                      <span className="text-[10px] text-ink-soft block mt-1">Full Engineering Spectrum</span>
                    </div>
                  </div>

                  {/* Syllabus Weightage Breakdown Table */}
                  <div className="border border-rule bg-paper p-5 space-y-3">
                    <h3 className="font-serif text-lg font-bold text-ink">
                      Curriculum Unit Weightage Breakdown
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 font-mono text-xs">
                      <div className="p-3 border border-rule bg-card space-y-1">
                        <div className="flex justify-between font-bold text-ink">
                          <span>WP-M1: HTML5 &amp; CSS3</span>
                          <span className="text-signal">5 Questions</span>
                        </div>
                        <p className="text-[11px] text-ink-soft font-sans">Semantics, Box Model, Flexbox 1D, CSS Grid 2D, Viewport.</p>
                      </div>
                      <div className="p-3 border border-rule bg-card space-y-1">
                        <div className="flex justify-between font-bold text-ink">
                          <span>WP-M2: Modern JavaScript</span>
                          <span className="text-signal">5 Questions</span>
                        </div>
                        <p className="text-[11px] text-ink-soft font-sans">Scoping, Closures, DOM Bubbling, Event Loop, Promises.</p>
                      </div>
                      <div className="p-3 border border-rule bg-card space-y-1">
                        <div className="flex justify-between font-bold text-ink">
                          <span>WP-M3: React &amp; Next.js</span>
                          <span className="text-signal">5 Questions</span>
                        </div>
                        <p className="text-[11px] text-ink-soft font-sans">Virtual DOM, Hooks, Next.js App Router, SSR, SSG, ISR.</p>
                      </div>
                      <div className="p-3 border border-rule bg-card space-y-1">
                        <div className="flex justify-between font-bold text-ink">
                          <span>WP-M4: Node.js &amp; Express</span>
                          <span className="text-signal">5 Questions</span>
                        </div>
                        <p className="text-[11px] text-ink-soft font-sans">V8/libuv, Express middleware pipeline, RESTful APIs, CORS.</p>
                      </div>
                      <div className="p-3 border border-rule bg-card space-y-1">
                        <div className="flex justify-between font-bold text-ink">
                          <span>WP-M5: PHP &amp; MySQL (PDO)</span>
                          <span className="text-signal">5 Questions</span>
                        </div>
                        <p className="text-[11px] text-ink-soft font-sans">Superglobals, session cookies, PDO statements, SQLi defense.</p>
                      </div>
                      <div className="p-3 border border-rule bg-card space-y-1">
                        <div className="flex justify-between font-bold text-ink">
                          <span>WP-M6: Architecture &amp; Security</span>
                          <span className="text-signal">5 Questions</span>
                        </div>
                        <p className="text-[11px] text-ink-soft font-sans">3-Tier design, Stateless JWT, Git conflicts, OWASP Top 10.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Question Types Engine Strip */}
        <div className="p-6 bg-card border border-ink shadow-[4px_4px_0_var(--rule)] space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-rule pb-2">
            <h3 className="font-serif text-lg font-bold text-ink">
              Supported Question Types Engine (All Formats Active)
            </h3>
            <span className="font-mono text-xs text-ink-soft">
              Tested across Bloom Cognitive Levels L1 (Remember) through L4 (Analyze)
            </span>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-9 gap-2 font-mono text-[11px] text-center">
            {[
              { type: 'mcq', label: 'MCQ Single' },
              { type: 'multi', label: 'Multi Select' },
              { type: 'numeric', label: 'Numerical' },
              { type: 'order', label: 'Sequencing' },
              { type: 'match', label: 'Matching' },
              { type: 'label', label: 'Diagram Pin' },
              { type: 'spot', label: 'Attack Spot' },
              { type: 'fill', label: 'Fill Blanks' },
              { type: 'tf-why', label: 'T/F & Reason' },
            ].map((t) => (
              <div key={t.type} className="p-2 border border-rule bg-paper">
                <span className="text-signal block font-bold uppercase text-[10px]">{t.type}</span>
                <span className="text-ink-soft text-[9px] block truncate">{t.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
