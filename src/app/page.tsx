"use client"

import React from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/Button"
import {
  Key,
  Lock,
  Network,
  FileKey2,
  ArrowRight,
  Presentation,
  GraduationCap,
  Flame,
  Cpu,
  Terminal,
  ShieldCheck,
  BookOpen,
  Award,
  Sparkles,
  CheckCircle2,
} from "lucide-react"
import { useAuthStore } from "@/lib/authStore"
import { useMounted } from "@/hooks/useMounted"

export interface SyllabusModuleCard {
  id: string
  code: string
  title: string
  hours: string
  bloom: string
  icon: React.ReactNode
  desc: string
  primaryTopic: string
  keyTopics: string[]
}

const modules: SyllabusModuleCard[] = [
  {
    id: "classical",
    code: "M1",
    title: "Introduction & Classical Cryptography",
    hours: "5 hrs",
    bloom: "Bloom L1-L3",
    icon: <Key className="h-5 w-5" />,
    desc: "OSI security architecture, symmetric model, substitution (Caesar, Affine, Playfair, Vigenère, Hill), transposition, and cryptanalysis.",
    primaryTopic: "caesar",
    keyTopics: ["OSI X.800", "Caesar & Affine", "Playfair 5x5", "Hill Matrix", "Vigenère"],
  },
  {
    id: "block-public-key",
    code: "M2",
    title: "Block Ciphers & Public Key Cryptography",
    hours: "8 hrs",
    bloom: "Bloom L1-L3",
    icon: <Cpu className="h-5 w-5" />,
    desc: "Feistel design, cipher modes (ECB, CBC, CFB, OFB, CTR), DES, AES, Blowfish, RC5, RSA, Rabin, ElGamal, ECC, Diffie-Hellman, and TEA.",
    primaryTopic: "des",
    keyTopics: ["Feistel Network", "DES & AES", "RSA Math", "Diffie-Hellman", "ECC Curves"],
  },
  {
    id: "hash-signatures",
    code: "M3",
    title: "Cryptographic Hashes & Digital Signatures",
    hours: "7 hrs",
    bloom: "Bloom L1-L4",
    icon: <Lock className="h-5 w-5" />,
    desc: "Authentication functions, MACs, HMACs, hash properties, MD5 collision exploits, SHA-1/2/3, RSA/ECC signatures, and X.509 PKI trust chains.",
    primaryTopic: "mac-hmac",
    keyTopics: ["Hash Properties", "HMAC Construction", "SHA-256 / SHA-3", "Digital Signatures", "X.509 PKI"],
  },
  {
    id: "computing-resources",
    code: "M4",
    title: "Protection of Computing Resources & Features",
    hours: "8 hrs",
    bloom: "Bloom L1-L3",
    icon: <Terminal className="h-5 w-5" />,
    desc: "Secure programming, stack buffer overflows, incomplete mediation, malware defenses, access control (DAC/MAC/RBAC), MFA, and password security.",
    primaryTopic: "software-vulnerabilities",
    keyTopics: ["Stack Overflows", "Incomplete Mediation", "Malware Defenses", "RBAC / DAC", "MFA & Passwords"],
  },
  {
    id: "network-security",
    code: "M5",
    title: "Network Security",
    hours: "10 hrs",
    bloom: "Bloom L1-L4",
    icon: <Network className="h-5 w-5" />,
    desc: "TCP/IP layer vulnerabilities, ARP/IP/DNS spoofing, port scanning, SYN flood, DoS/DDoS mitigation, firewalls, IDS/IPS, honeypots, and Zero Trust.",
    primaryTopic: "layer-vulnerabilities",
    keyTopics: ["ARP / DNS Spoofing", "SYN Flood & DoS", "Stateful Firewalls", "Signature IDS", "Zero Trust"],
  },
  {
    id: "security-applications",
    code: "M6",
    title: "Network Security Applications",
    hours: "7 hrs",
    bloom: "Bloom L1-L4",
    icon: <FileKey2 className="h-5 w-5" />,
    desc: "Kerberos v5 ticketing, SSL/TLS 1.2 vs 1.3 protocol architecture, IPsec (AH & ESP), secure email (PGP & S/MIME), key management, and AI security.",
    primaryTopic: "kerberos",
    keyTopics: ["Kerberos v5", "TLS 1.3 Handshake", "IPsec AH & ESP", "PGP / S-MIME", "AI Security"],
  },
]

export default function Dashboard() {
  const mounted = useMounted()
  const { role, student, teacher, isAuthenticated, loginAsStudent, loginAsTeacher } = useAuthStore()

  const isUserLoggedIn = mounted && isAuthenticated

  const handleQuickDemoStudent = () => {
    loginAsStudent({
      name: "Dev Shah",
      rollNo: "21BCP042",
      batch: "Batch A1",
      department: "Computer Science & Engineering",
    })
  }

  const handleQuickDemoTeacher = () => {
    loginAsTeacher("cns2026")
  }

  return (
    <div className="min-h-screen flex flex-col bg-paper relative overflow-hidden">
      {/* Background Ambience Lines */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-20">
        <div className="absolute top-[20%] left-[10%] w-[800px] h-px bg-signal rotate-12 opacity-50"></div>
        <div className="absolute top-[40%] right-[10%] w-[600px] h-px bg-ink rotate-45 opacity-50"></div>
        <div className="absolute -left-20 top-[60%] text-[200px] font-serif text-rule opacity-10">§</div>
      </div>

      <main className="flex-1 container mx-auto px-4 sm:px-6 py-8 sm:py-12 md:py-16 max-w-6xl relative z-10 space-y-16 sm:space-y-24">
        {/* ========================================================= */}
        {/* HERO SECTION                                             */}
        {/* ========================================================= */}
        <header className="text-center md:text-left flex flex-col md:flex-row items-center justify-between gap-8 md:gap-12">
          <div className="max-w-2xl w-full">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 bg-card border border-ink text-ink font-mono text-[10px] uppercase tracking-widest px-3 py-1 mb-4 sm:mb-6 shadow-[2px_2px_0_var(--rule)]"
            >
              <Sparkles className="h-3 w-3 text-signal" />
              <span>Interactive Learning Environment v2.0</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl sm:text-5xl md:text-7xl font-serif text-ink tracking-tight mb-4 md:mb-6 leading-tight"
            >
              The Modern <br />
              <span className="text-signal italic">Security Lab</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-base sm:text-lg md:text-xl text-ink-soft max-w-lg mb-8 md:mb-10 font-sans leading-relaxed mx-auto md:mx-0"
            >
              A precision academic platform for mastering Computer Network Security. Featuring scrollytelling notes, live algorithm simulators, and verified assessment gradebooks.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center md:justify-start w-full sm:w-auto"
            >
              {isUserLoggedIn ? (
                <>
                  <Button
                    size="lg"
                    className="w-full sm:w-auto bg-signal hover:bg-signal/90 text-paper border border-signal font-bold uppercase tracking-wider text-xs sm:text-sm h-12 sm:h-14 px-6 sm:px-8"
                    asChild
                  >
                    <a href="#syllabus-notes">
                      Access Course Notes <ArrowRight className="ml-2 h-4 w-4" />
                    </a>
                  </Button>
                  <Button
                    size="lg"
                    className="w-full sm:w-auto bg-card hover:bg-rule text-ink border border-ink font-bold uppercase tracking-wider text-xs sm:text-sm h-12 sm:h-14 px-6 sm:px-8"
                    asChild
                  >
                    <Link href={role === "teacher" ? "/teacher" : "/student"}>
                      <ShieldCheck className="mr-2 h-4 w-4 text-signal" />
                      {role === "teacher" ? "Teacher Gradebook" : "My Student Hub"}
                    </Link>
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    size="lg"
                    className="w-full sm:w-auto bg-signal hover:bg-signal/90 text-paper border border-signal font-bold uppercase tracking-wider text-xs sm:text-sm h-12 sm:h-14 px-6 sm:px-8"
                    asChild
                  >
                    <Link href="/login">
                      Login to Unlock Notes <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                  <Button
                    size="lg"
                    className="w-full sm:w-auto bg-card hover:bg-rule text-ink border border-ink font-bold uppercase tracking-wider text-xs sm:text-sm h-12 sm:h-14 px-6 sm:px-8"
                    asChild
                  >
                    <Link href="/quiz">
                      <Flame className="mr-2 h-4 w-4 text-warn" /> Free Practice Quiz
                    </Link>
                  </Button>
                </>
              )}
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="w-full md:w-auto flex flex-col gap-3 sm:gap-4 items-center md:items-start"
          >
            <div className="bg-card border border-ink p-4 sm:p-6 w-full max-w-sm flex items-start gap-4 text-left shadow-[4px_4px_0_var(--rule)]">
              <div className="bg-signal/10 p-2.5 sm:p-3 text-signal shrink-0">
                <Presentation className="h-5 w-5 sm:h-6 sm:w-6" />
              </div>
              <div>
                <h3 className="font-bold text-xs sm:text-sm uppercase tracking-wider font-mono mb-1 sm:mb-2 text-ink">
                  Lecturer Ready
                </h3>
                <p className="text-xs sm:text-sm text-ink-soft">
                  Press Present or [P] in any module to launch the fullscreen, distraction-free Presenter Mode.
                </p>
              </div>
            </div>

            <div className="bg-paper border border-rule p-4 sm:p-6 w-full max-w-sm flex items-start gap-4 relative left-0 md:-left-8 text-left shadow-[4px_4px_0_var(--rule)]">
              <div className="bg-ok/10 p-2.5 sm:p-3 text-ok shrink-0">
                <GraduationCap className="h-5 w-5 sm:h-6 sm:w-6" />
              </div>
              <div>
                <h3 className="font-bold text-xs sm:text-sm uppercase tracking-wider font-mono mb-1 sm:mb-2 text-ink">
                  Exam & Viva Focused
                </h3>
                <p className="text-xs sm:text-sm text-ink-soft">
                  Every concept includes visual diagrams, real-world analogies, and strict university exam definitions.
                </p>
              </div>
            </div>
          </motion.div>
        </header>

        {/* ========================================================= */}
        {/* PLATFORM ARCHITECTURE & CAPABILITIES STRIP                */}
        {/* ========================================================= */}
        <section className="border-t border-b border-rule py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="space-y-1">
              <span className="font-mono text-3xl sm:text-4xl font-bold text-ink">45 hrs</span>
              <p className="font-mono text-[11px] uppercase tracking-wider text-ink-soft">
                Full University Syllabus
              </p>
            </div>
            <div className="space-y-1">
              <span className="font-mono text-3xl sm:text-4xl font-bold text-signal">6 Units</span>
              <p className="font-mono text-[11px] uppercase tracking-wider text-ink-soft">
                M1 Classical to M6 Cloud/AI
              </p>
            </div>
            <div className="space-y-1">
              <span className="font-mono text-3xl sm:text-4xl font-bold text-ink">100+</span>
              <p className="font-mono text-[11px] uppercase tracking-wider text-ink-soft">
                Interactive Questions & Problems
              </p>
            </div>
            <div className="space-y-1">
              <span className="font-mono text-3xl sm:text-4xl font-bold text-ok">L1 - L4</span>
              <p className="font-mono text-[11px] uppercase tracking-wider text-ink-soft">
                Bloom&apos;s Taxonomy Marking
              </p>
            </div>
          </div>
        </section>

        {/* ========================================================= */}
        {/* SYLLABUS COURSE NOTES SECTION (PROTECTED / GATED)         */}
        {/* ========================================================= */}
        <section id="syllabus-notes" className="space-y-8 scroll-mt-20">
          {/* Header of Section */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-rule pb-4">
            <div>
              <div className="inline-flex items-center gap-2 font-mono text-xs text-signal font-bold uppercase tracking-wider mb-1">
                <BookOpen className="h-4 w-4" />
                <span>Curriculum Modules & Notes</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-serif text-ink font-bold">
                University Syllabus Notes
              </h2>
              <p className="text-xs sm:text-sm text-ink-soft font-mono mt-0.5">
                Complete scrollytelling lessons, step-by-step algorithms, and mathematical derivations.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href="/revision"
                className="text-xs sm:text-sm font-mono uppercase tracking-wider text-signal hover:underline flex items-center gap-1.5"
              >
                <span>Revision Hub & Cheat Sheets</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>

          {/* AUTH STATUS NOTIFICATION / GATE BANNER */}
          {isUserLoggedIn ? (
            /* Logged in state: Show congratulations / active session banner */
            <div className="p-5 bg-card border-2 border-ok/40 rounded-sm shadow-[4px_4px_0_var(--rule)] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-ok text-paper flex items-center justify-center font-bold text-lg shrink-0">
                  <CheckCircle2 className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-serif text-lg font-bold text-ink">
                    Course Notes & Interactive Simulators Unlocked
                  </h3>
                  <p className="text-xs text-ink-soft">
                    {role === "teacher" ? (
                      <>Faculty Account Active: <strong className="text-ink font-semibold">{teacher?.name}</strong>. Full lecture slide and grading tools available.</>
                    ) : (
                      <>Enrolled Student: <strong className="text-ink font-semibold">{student?.name}</strong> (Roll No: <span className="font-mono font-bold text-ink">{student?.rollNo}</span>). Progress recorded automatically.</>
                    )}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <Link
                  href={role === "teacher" ? "/teacher" : "/student"}
                  className="px-4 py-2 bg-ink text-paper hover:bg-signal font-mono text-xs uppercase font-bold tracking-wider transition-colors"
                >
                  {role === "teacher" ? "Open Gradebook →" : "My Student Portal →"}
                </Link>
              </div>
            </div>
          ) : (
            /* Logged out state: Prominent callout explaining notes are for logged in users only */
            <div className="p-6 sm:p-8 bg-card border-2 border-signal shadow-[6px_6px_0_var(--rule)] space-y-5">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border-b border-rule pb-6">
                <div className="space-y-2 max-w-xl">
                  <div className="inline-flex items-center gap-2 px-2.5 py-0.5 bg-signal/15 border border-signal/40 font-mono text-xs text-signal font-bold uppercase tracking-wider">
                    <Lock className="h-3 w-3" />
                    <span>Protected Access · Login Required</span>
                  </div>
                  <h3 className="font-serif text-2xl sm:text-3xl font-bold text-ink">
                    Course Notes & Simulators Are Available on Login
                  </h3>
                  <p className="text-sm text-ink-soft leading-relaxed">
                    Detailed scrollytelling lecture notes, live cipher playgrounds, and syllabus derivations are reserved for university students and course faculty. Log in to access all 6 modules.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto shrink-0">
                  <Button
                    size="lg"
                    className="bg-signal text-paper hover:bg-signal/90 font-mono text-xs uppercase font-bold tracking-wider h-11 px-6"
                    asChild
                  >
                    <Link href="/login">
                      Sign In as Student
                    </Link>
                  </Button>

                  <Button
                    size="lg"
                    variant="outline"
                    className="border-ink text-ink hover:bg-paper font-mono text-xs uppercase font-bold tracking-wider h-11 px-5"
                    asChild
                  >
                    <Link href="/login">
                      Faculty Portal
                    </Link>
                  </Button>
                </div>
              </div>

              {/* Quick bypass helpers for evaluator / grading viva demo */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs font-mono text-ink-soft">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-3.5 w-3.5 text-signal" />
                  <span>Evaluating this project? Unlock with 1-click viva bypass:</span>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={handleQuickDemoStudent}
                    className="text-signal hover:underline font-bold"
                  >
                    ⚡ Unlock Demo Student
                  </button>
                  <span>·</span>
                  <button
                    type="button"
                    onClick={handleQuickDemoTeacher}
                    className="text-ink hover:text-signal hover:underline font-bold"
                  >
                    ⚡ Unlock Faculty PIN (cns2026)
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* GRID OF MODULES */}
          <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {modules.map((module, i) => (
              <motion.div
                key={module.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.06 * i }}
              >
                <div
                  className={`h-full flex flex-col bg-card border p-6 transition-all ${
                    isUserLoggedIn
                      ? "border-ink shadow-[4px_4px_0_var(--rule)] hover:shadow-[6px_6px_0_var(--signal)] hover:border-signal"
                      : "border-rule hover:border-ink shadow-[3px_3px_0_var(--rule)]"
                  }`}
                >
                  {/* Top Bar: Icon + Code + Badges */}
                  <div className="mb-4 flex justify-between items-start">
                    <div className="p-2 border border-ink bg-paper text-signal">
                      {module.icon}
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

                  <h3 className="font-bold text-xl mb-2 font-serif text-ink">
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

                  {/* Actions: Unlocked vs Locked */}
                  <div className="pt-4 border-t border-rule flex items-center justify-between gap-2 text-xs font-mono uppercase tracking-wider">
                    {isUserLoggedIn ? (
                      <>
                        <Link
                          href={`/modules/${module.id}`}
                          className="px-3.5 py-2 bg-ink hover:bg-signal text-paper transition-colors font-bold flex items-center gap-1.5 text-xs"
                        >
                          <span>Explore Notes</span>
                          <ArrowRight className="h-3 w-3" />
                        </Link>

                        <Link
                          href={`/present/${module.code.toLowerCase()}/${module.primaryTopic}`}
                          className="px-2.5 py-2 border border-rule hover:border-ink bg-paper text-ink transition-colors flex items-center gap-1.5 text-[11px]"
                        >
                          <Presentation className="h-3 w-3 text-signal" />
                          <span>[P] Slides</span>
                        </Link>
                      </>
                    ) : (
                      <Link
                        href="/login"
                        className="w-full py-2 bg-card border border-rule hover:border-signal text-center text-ink-soft hover:text-signal font-semibold flex items-center justify-center gap-2 transition-colors"
                      >
                        <Lock className="h-3.5 w-3.5 text-signal" />
                        <span>Sign In to Read Notes</span>
                      </Link>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ========================================================= */}
        {/* FEATURE SHOWCASE: WHY USE CNS SECURITY LAB                */}
        {/* ========================================================= */}
        <section className="bg-card border border-rule p-8 sm:p-12 space-y-8">
          <div className="max-w-2xl space-y-2">
            <span className="font-mono text-xs uppercase tracking-wider text-signal font-bold">
              Integrated Academic Suite
            </span>
            <h2 className="text-2xl sm:text-4xl font-serif text-ink font-bold">
              Built for Classroom & Independent Mastery
            </h2>
            <p className="text-sm text-ink-soft leading-relaxed">
              CNS Security Lab bridges abstract theory and practical implementation with zero external cloud dependencies.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-5 bg-paper border border-rule space-y-3">
              <div className="w-9 h-9 rounded bg-signal/10 text-signal flex items-center justify-center font-bold">
                <BookOpen className="h-5 w-5" />
              </div>
              <h3 className="font-serif text-lg font-bold text-ink">Scrollytelling Lessons</h3>
              <p className="text-xs text-ink-soft leading-relaxed">
                Step-by-step visual breakdowns of complex ciphers like AES state transformations, Diffie-Hellman key exchanges, and Feistel rounds.
              </p>
            </div>

            <div className="p-5 bg-paper border border-rule space-y-3">
              <div className="w-9 h-9 rounded bg-ok/10 text-ok flex items-center justify-center font-bold">
                <Award className="h-5 w-5" />
              </div>
              <h3 className="font-serif text-lg font-bold text-ink">Verified Gradebook</h3>
              <p className="text-xs text-ink-soft leading-relaxed">
                Automatic submission recording linked to university roll numbers. Faculty can view class accuracy curves and export CSV reports.
              </p>
            </div>

            <div className="p-5 bg-paper border border-rule space-y-3">
              <div className="w-9 h-9 rounded bg-warn/10 text-warn flex items-center justify-center font-bold">
                <Flame className="h-5 w-5" />
              </div>
              <h3 className="font-serif text-lg font-bold text-ink">Rapid-Fire Team Quiz</h3>
              <p className="text-xs text-ink-soft leading-relaxed">
                Classroom competition mode with synchronized team scoring, countdown timers, and oral viva voce defense modules.
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
