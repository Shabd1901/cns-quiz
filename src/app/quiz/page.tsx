"use client"

import React, { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/lib/authStore"
import { useMounted } from "@/hooks/useMounted"
import { Flame, Presentation, Calculator, Sparkles, Sliders, ArrowRight, Award, CheckCircle2 } from "lucide-react"

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

interface QuizModeInfo {
  id: string
  title: string
  subtitle: string
  description: string
  audience: string
  features: string[]
  icon: React.ComponentType<{ className?: string }>
}

const QUIZ_CHALLENGE_MODES: QuizModeInfo[] = [
  {
    id: 'exam-challenge',
    title: 'Exam Challenge Arena',
    subtitle: 'Team-Based Tournament',
    description: 'Multi-team tournament with timed rounds (Rapid, Scenario, Image, Mixed), live scoreboard HUD, and victory podium.',
    audience: 'Live classroom teams & lab hackathons',
    features: ['2-6 Custom Squads', 'Draining Timer Bar', 'Live Team Scoreboard', 'Podium with Confetti'],
    icon: Flame
  },
  {
    id: 'classroom',
    title: 'Classroom Projector Mode',
    subtitle: 'Auditorium Show-of-Hands',
    description: 'One full-screen question at a time with show-of-hands vote count bars. Revealing highlights distractors and identifies class misconceptions.',
    audience: 'Lecturers projecting in auditorium',
    features: ['Show-of-Hands [1-4]', 'Classroom Heatmap', 'Misconception Analysis', 'Show Me Replay'],
    icon: Presentation
  },
  {
    id: 'numerical-lab',
    title: 'Numerical & Cryptanalysis Lab',
    subtitle: 'Step-by-Step Scratchpad',
    description: 'Practice modular arithmetic, key spaces, Euler totient, Affine and Hill determinants with scratchpad inputs and 3-level hints.',
    audience: 'Students preparing for university numericals',
    features: ['Random Problem Generator', 'Step-by-Step Derivations', 'Live Scratchpad Check', 'Formula Sheets'],
    icon: Calculator
  },
  {
    id: 'diagram-quiz',
    title: 'Diagram & Attack Flow Quiz',
    subtitle: 'Visual Architecture Identification',
    description: 'Label architectural hotspots on cipher models, reconstruct handshake sequence timelines, and spot attacks in animated scenes.',
    audience: 'Visual learners & system architects',
    features: ['Label Hotspot Pins', 'Chronological Reordering', 'Scene Attack Spotting', 'Network Topologies'],
    icon: Sparkles
  },
  {
    id: 'self-test',
    title: 'Self-Test Diagnostic',
    subtitle: 'Customizable Practice Filter',
    description: 'Filter questions across specific syllabus modules (M1-M6) and Bloom taxonomy levels (L1 Remember to L4 Analyze) for diagnostic mastery.',
    audience: 'Individual self-paced study',
    features: ['Module Selector', 'Bloom Filter (L1-L4)', 'Target Question Count', 'Mastery Radar Report'],
    icon: Sliders
  }
]

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
    id: "wp-fundamentals",
    title: "Web Tech Fundamentals, HTML5 & CSS3",
    hours: 8,
    bloom: "Bloom L1–L3, L6",
    questionCount: 21,
    description: "HTML5 semantic layout, CSS Box Model calculation, Flexbox 1D, CSS Grid 2D, and mobile media queries.",
    topics: ["HTML5 Semantics", "CSS Box Model", "Flexbox 1D Layout", "CSS Grid Matrix", "Responsive Queries"],
    color: "border-ink"
  },
  {
    code: "WP-M2",
    id: "wp-javascript",
    title: "JavaScript & Modern Client-Side",
    hours: 8,
    bloom: "Bloom L1–L3, L6",
    questionCount: 15,
    description: "Scoping (var/let/const), DOM event bubbling, ES6+ arrow functions/destructuring, and Event Loop microtasks.",
    topics: ["Block Scoping & Closures", "DOM Event Delegation", "ES6+ Destructuring", "Microtasks vs Macrotasks", "Promises & Async/Await"],
    color: "border-ink"
  },
  {
    code: "WP-M3",
    id: "wp-react",
    title: "Frontend Engineering: React & Next.js",
    hours: 8,
    bloom: "Bloom L1–L3, L5–L6",
    questionCount: 15,
    description: "Virtual DOM reconciliation diffing, useState & useEffect dependency rules, Next.js SSR vs SSG vs ISR.",
    topics: ["Virtual DOM O(N) Diff", "useState & useEffect", "Next.js App Router", "SSR vs SSG vs ISR", "Controlled Form State"],
    color: "border-ink"
  },
  {
    code: "WP-M4",
    id: "wp-nodejs",
    title: "Server-Side: Node.js & Express.js",
    hours: 7,
    bloom: "Bloom L1–L3, L5–L6",
    questionCount: 12,
    description: "Node.js libuv event loop, Express middleware pipeline (req, res, next), RESTful API design, and error handlers.",
    topics: ["V8 & libuv Architecture", "Express Middleware Chain", "RESTful Status Codes", "fs Streams vs Buffer", "CORS Preflight Config"],
    color: "border-ink"
  },
  {
    code: "WP-M5",
    id: "wp-php",
    title: "Server-Side: PHP & MySQL (PDO)",
    hours: 9,
    bloom: "Bloom L1–L4, L6",
    questionCount: 14,
    description: "PHP Superglobals, session_start() persistence, MySQL PDO prepared statements, and SQL injection defense.",
    topics: ["PHP Superglobals", "session_start() Engine", "PDO Prepared Statements", "SQLi & XSS Mitigation", "password_hash() Bcrypt"],
    color: "border-ink"
  },
  {
    code: "WP-M6",
    id: "wp-fullstack",
    title: "Full-Stack Architecture & Web Security",
    hours: 5,
    bloom: "Bloom L1–L3, L6",
    questionCount: 10,
    description: "3-tier architecture, CORS headers, stateless JWT token authentication, Git version control, and OWASP Top 10.",
    topics: ["3-Tier Separation", "CORS Preflight Flow", "Stateless JWT Structure", "Git Conflict Resolution", "OWASP Top 10 Defenses"],
    color: "border-ink"
  }
]

export default function ModuleQuizHub() {
  const router = useRouter()
  const mounted = useMounted()
  const { student, role } = useAuthStore()

  // High-level view: 'challenge' (5 interactive modes) vs 'modules' (individual module tests)
  const [activeTab, setActiveTab] = useState<'challenge' | 'modules'>('challenge')
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
                5 Quiz Challenge Modes · 12 Modules · 259 Total Questions
              </span>
            </div>
            <h1 className="font-serif text-3xl sm:text-5xl text-ink font-bold mt-1">
              Assessment &amp; Quiz Challenge Hub
            </h1>
            <p className="font-sans text-xs sm:text-sm text-ink-soft mt-1 max-w-2xl leading-relaxed">
              Launch live competitive quiz arenas with team buzzers and scoreboards, professor classroom projection,
              or practice individual module quizzes with instant in-window feedback.
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

        {/* Primary View Switcher: Challenge Modes vs Module-Wise Quizzes */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-rule pb-4">
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setActiveTab('challenge')}
              className={`px-4 py-2 font-mono text-xs uppercase font-bold border transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === 'challenge'
                  ? "bg-signal text-paper border-signal shadow-[2px_2px_0_var(--ink)]"
                  : "bg-paper text-ink border-rule hover:border-ink"
              }`}
            >
              <Flame className="h-4 w-4" />
              <span>🎮 Quiz Challenge Modes (Arena &amp; Labs)</span>
            </button>
            <button
              onClick={() => setActiveTab('modules')}
              className={`px-4 py-2 font-mono text-xs uppercase font-bold border transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === 'modules'
                  ? "bg-signal text-paper border-signal shadow-[2px_2px_0_var(--ink)]"
                  : "bg-paper text-ink border-rule hover:border-ink"
              }`}
            >
              <Award className="h-4 w-4" />
              <span>📝 Module-Wise Quizzes (M1–M6 &amp; WP)</span>
            </button>
          </div>

          {activeTab === 'modules' && (
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs text-ink-soft uppercase font-bold">Course:</span>
              <button
                onClick={() => setSubject('CSC602')}
                className={`px-2.5 py-1 text-xs font-mono font-bold uppercase border cursor-pointer ${
                  subject === 'CSC602' ? "bg-ink text-paper border-ink" : "bg-card text-ink border-rule"
                }`}
              >
                CSC602 (CNS)
              </button>
              <button
                onClick={() => setSubject('ITC504')}
                className={`px-2.5 py-1 text-xs font-mono font-bold uppercase border cursor-pointer ${
                  subject === 'ITC504' ? "bg-ink text-paper border-ink" : "bg-card text-ink border-rule"
                }`}
              >
                ITC504 (WP)
              </button>
            </div>
          )}
        </div>

        {/* SECTION 1: 5 INTERACTIVE QUIZ CHALLENGE MODES */}
        {activeTab === 'challenge' && (
          <div className="space-y-8">
            {/* Full Syllabus Mock Exam Featured Banner */}
            <div className="p-6 bg-card border-2 border-ink shadow-[6px_6px_0_var(--ink)] flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 bg-signal text-paper font-mono text-xs font-bold uppercase tracking-wider">
                    Full Syllabus Mock
                  </span>
                  <span className="font-mono text-xs text-ink-soft font-semibold">
                    Mumbai University Pattern Simulation
                  </span>
                </div>
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-ink">
                  Comprehensive 45-Question Examination Challenge
                </h2>
                <p className="font-sans text-xs sm:text-sm text-ink-soft max-w-2xl leading-relaxed">
                  Strictly weighted question distribution covering all curriculum units with timer scoring,
                  immediate feedback, and examiner grading analytics.
                </p>
              </div>

              <button
                onClick={() => router.push("/quiz/all/play")}
                className="px-6 py-3.5 bg-signal text-paper font-mono text-xs uppercase tracking-wider font-bold hover:bg-ink transition-colors shadow-[3px_3px_0_var(--ink)] shrink-0 w-full md:w-auto text-center cursor-pointer"
              >
                Launch Mock Exam (45 Qs) →
              </button>
            </div>

            {/* 5 Distinct Challenge Modes Grid */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-serif text-2xl font-bold text-ink">
                  Five Distinct Quiz Challenge Engines
                </h3>
                <span className="font-mono text-xs text-ink-soft">
                  Select a live tournament, classroom projector, or scratchpad mode
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {QUIZ_CHALLENGE_MODES.map((mode) => {
                  const Icon = mode.icon
                  return (
                    <div
                      key={mode.id}
                      className="p-6 border border-rule bg-card hover:border-ink hover:shadow-[4px_4px_0_var(--ink)] transition-all flex flex-col justify-between group"
                    >
                      <div>
                        <div className="flex justify-between items-center mb-3">
                          <span className="font-mono text-[10px] uppercase tracking-wider text-signal font-bold">
                            {mode.subtitle}
                          </span>
                          <div className="p-2 border border-rule bg-paper text-signal">
                            <Icon className="h-4 w-4" />
                          </div>
                        </div>

                        <h4 className="font-serif text-xl font-bold text-ink mb-2 group-hover:text-signal transition-colors">
                          {mode.title}
                        </h4>

                        <p className="font-sans text-xs text-ink-soft leading-relaxed mb-4">
                          {mode.description}
                        </p>

                        <div className="space-y-1.5 mb-6">
                          <span className="font-mono text-[10px] uppercase text-ink-soft block font-bold">
                            Engine Features:
                          </span>
                          {mode.features.map((feat, idx) => (
                            <div key={idx} className="flex items-center gap-2 font-mono text-[11px] text-ink">
                              <span className="text-signal text-[10px]">■</span>
                              <span>{feat}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="pt-4 border-t border-rule flex items-center justify-between">
                        <span className="font-mono text-[10px] text-ink-soft truncate mr-2">
                          {mode.audience}
                        </span>
                        <button
                          onClick={() => router.push(`/quiz/${mode.id}/play`)}
                          className="px-4 py-2 bg-ink text-paper group-hover:bg-signal font-mono text-xs uppercase font-bold transition-colors shadow-[2px_2px_0_var(--rule)] cursor-pointer"
                        >
                          Launch Mode →
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        )}

        {/* SECTION 2: MODULE-WISE PRACTICE QUIZZES */}
        {activeTab === 'modules' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-serif text-2xl font-bold text-ink">
                {subject === 'CSC602'
                  ? "CNS Module-Wise Targeted Practice Quizzes (M1 – M6)"
                  : "Web Programming Module-Wise Quizzes (WP-M1 – WP-M6)"}
              </h3>
              <span className="font-mono text-xs text-ink-soft">
                Focused in-window practice with instant grading &amp; feedback
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

                    <h4 className="font-serif text-xl font-bold text-ink mb-2 group-hover:text-signal transition-colors">
                      {mod.title}
                    </h4>

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
                      onClick={() => {
                        if (subject === 'CSC602') {
                          router.push(`/quiz/${mod.id}/play`)
                        } else {
                          router.push(`/modules/${mod.id}`)
                        }
                      }}
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

        {/* Question Types Engine Strip */}
        <div className="p-6 bg-card border border-ink shadow-[4px_4px_0_var(--rule)] space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-rule pb-2">
            <h3 className="font-serif text-lg font-bold text-ink">
              Supported Question Types Engine (All 9 Engine Formats Active)
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
