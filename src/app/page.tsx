"use client"

import React, { useState } from "react"
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
  Building2,
  CheckCircle2,
  Sparkles,
  Database,
  Binary,
  Share2,
  Compass,
  LogIn,
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

const activeCourseModules: SyllabusModuleCard[] = [
  {
    id: "classical",
    code: "M1",
    title: "Introduction & Classical Cryptography",
    hours: "5 hrs",
    bloom: "Bloom L1-L3",
    icon: <Key className="h-5 w-5" />,
    desc: "OSI security architecture (X.800), symmetric cipher model, classical substitution (Caesar, Affine, Playfair, Vigenère, Hill), transposition, and cryptanalysis.",
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
    desc: "Feistel design principles, cipher modes (ECB, CBC, CFB, OFB, CTR), DES, AES, Blowfish, RC5, RSA, Rabin, ElGamal, ECC, Diffie-Hellman, and TEA.",
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
    title: "Network Security & Defense",
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

const upcomingSubjects = [
  {
    title: "Database Management Systems (DBMS)",
    code: "CSC403",
    year: "SE · Sem IV",
    dept: "CMPN / INFT",
    icon: <Database className="h-5 w-5 text-signal" />,
    desc: "Relational algebra, SQL engine simulator, normal forms (1NF to BCNF) validator, ACID transaction manager, and indexing visualizers.",
    status: "Curriculum Staged",
  },
  {
    title: "Operating Systems (OS)",
    code: "CSC404",
    year: "SE · Sem IV",
    dept: "CMPN / INFT / AI&DS",
    icon: <Binary className="h-5 w-5 text-ok" />,
    desc: "Interactive CPU scheduling (RR, SJF, Priority), virtual memory paging, deadlock Bankers algorithm, and POSIX multithreading sandbox.",
    status: "In Development",
  },
  {
    title: "Artificial Intelligence & Data Science",
    code: "AIC501",
    year: "TE · Sem V",
    dept: "AI&DS / AIML",
    icon: <Sparkles className="h-5 w-5 text-warn" />,
    desc: "Search algorithms (A*, Minimax), neural network backpropagation playground, regression analyzers, and model accuracy benchmarking.",
    status: "Roadmap Q3",
  },
  {
    title: "Computer Networks (CN)",
    code: "CSC503",
    year: "TE · Sem V",
    dept: "CMPN / INFT / EXTC",
    icon: <Share2 className="h-5 w-5 text-info" />,
    desc: "CIDR subnet calculator, sliding window protocol simulator, link-state routing (OSPF/Dijkstra), and packet trace visualizers.",
    status: "Roadmap Q3",
  },
]

const academicYears = [
  {
    id: "fe",
    year: "First Year (FE)",
    sem: "Semesters I & II",
    focus: "Basic Sciences, Engineering Mathematics & Programming Fundamentals",
    subjects: ["Applied Mathematics I & II", "Applied Physics", "Applied Chemistry", "C Programming & Problem Solving", "Basic Electrical Engineering"],
  },
  {
    id: "se",
    year: "Second Year (SE)",
    sem: "Semesters III & IV",
    focus: "Core Computing Foundations, Data Structures & System Architecture",
    subjects: ["Data Structures & Algorithms", "Discrete Mathematics", "Object Oriented Programming (Java)", "Computer Organization & Arch", "Operating Systems"],
  },
  {
    id: "te",
    year: "Third Year (TE)",
    sem: "Semesters V & VI",
    focus: "Advanced Systems, Security & Distributed Applications",
    subjects: ["Cryptography & Network Security (Active)", "Database Management Systems", "Computer Networks", "Software Engineering", "Web Computing"],
    isActive: true,
  },
  {
    id: "be",
    year: "Final Year (BE)",
    sem: "Semesters VII & VIII",
    focus: "Artificial Intelligence, Cloud Computing & Capstone Research",
    subjects: ["Artificial Intelligence & Deep Learning", "Cloud Computing & DevOps", "Big Data Analytics", "Cyber Law & Ethics", "Major Capstone Project"],
  },
]

export default function Dashboard() {
  const mounted = useMounted()
  const { role, student, teacher, isAuthenticated, logout } = useAuthStore()
  const [selectedYear, setSelectedYear] = useState("te")

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-paper font-mono text-sm text-ink-soft animate-pulse">
        Loading TCET LMS...
      </div>
    )
  }

  const isStudent = isAuthenticated && role === "student"
  const isTeacher = isAuthenticated && role === "teacher"

  return (
    <div className="min-h-screen flex flex-col bg-paper relative overflow-hidden">
      {/* Background Ambience Lines */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-20">
        <div className="absolute top-[15%] left-[8%] w-[850px] h-px bg-signal rotate-12 opacity-50"></div>
        <div className="absolute top-[35%] right-[8%] w-[650px] h-px bg-ink rotate-45 opacity-50"></div>
        <div className="absolute -left-20 top-[60%] text-[200px] font-serif text-rule opacity-10">§</div>
      </div>

      <main className="flex-1 container mx-auto px-4 sm:px-6 py-8 sm:py-12 md:py-16 max-w-6xl relative z-10 space-y-16 sm:space-y-24">
        {/* ACTIVE SESSION OR INSTITUTIONAL BANNER */}
        {isAuthenticated ? (
          <div className="p-4 bg-card border-2 border-ok/50 rounded-sm shadow-[4px_4px_0_var(--rule)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-ok text-paper flex items-center justify-center font-bold text-sm shrink-0">
                <CheckCircle2 className="h-5 w-5" />
              </div>
              <div>
                <p className="font-serif text-base font-bold text-ink">
                  {isTeacher
                    ? `Faculty Session Active: ${teacher?.name}`
                    : `Enrolled Student: ${student?.name} (${student?.rollNo})`}
                </p>
                <p className="font-mono text-xs text-ink-soft">
                  Thakur College of Engineering &amp; Technology · CMPN Department · {isTeacher ? "Examiner Mode" : (student?.batch || "Batch A1")}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Link
                href={isTeacher ? "/teacher" : "/student"}
                className="px-3.5 py-1.5 bg-ink text-paper hover:bg-signal font-mono text-xs uppercase font-bold tracking-wider transition-colors flex items-center gap-1.5"
              >
                <span>{isTeacher ? "Faculty Gradebook" : "My Student Profile"}</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
              <button
                type="button"
                onClick={logout}
                className="px-3 py-1.5 border border-rule hover:border-bad bg-paper font-mono text-xs uppercase text-bad transition-colors"
              >
                Sign Out
              </button>
            </div>
          </div>
        ) : (
          <div className="p-3.5 bg-card border border-rule flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 font-mono text-xs text-ink-soft">
            <div className="flex items-center gap-2">
              <span className="text-signal font-bold">🏛️ TCET LMS</span>
              <span>· Autonomous College Digital Curriculum &amp; Assessment Platform</span>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/login" className="text-signal font-bold hover:underline">
                Student Login &rarr;
              </Link>
              <span>·</span>
              <Link href="/teacher" className="text-ink font-semibold hover:underline">
                Faculty Access &rarr;
              </Link>
            </div>
          </div>
        )}

        {/* HERO SECTION */}
        <header className="text-center md:text-left flex flex-col md:flex-row items-center justify-between gap-8 md:gap-12">
          <div className="max-w-2xl w-full">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 bg-card border border-ink text-ink font-mono text-[10px] uppercase tracking-widest px-3 py-1 mb-4 sm:mb-6 shadow-[2px_2px_0_var(--rule)]"
            >
              <Building2 className="h-3 w-3 text-signal" />
              <span>Thakur College of Engineering &amp; Technology · Autonomous</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl sm:text-5xl md:text-7xl font-serif text-ink tracking-tight mb-4 md:mb-6 leading-tight"
            >
              TCET <br />
              <span className="text-signal italic">Learning Management System</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-base sm:text-lg md:text-xl text-ink-soft max-w-lg mb-8 md:mb-10 font-sans leading-relaxed mx-auto md:mx-0"
            >
              Centralized academic learning platform for Thakur College of Engineering and Technology. Unifying curriculum notes, interactive algorithm laboratories, faculty evaluation gradebooks, and student performance tracking across all 4 engineering years and departments.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center md:justify-start w-full sm:w-auto"
            >
              {isStudent ? (
                <>
                  <Button
                    size="lg"
                    className="w-full sm:w-auto bg-signal hover:bg-signal/90 text-paper border border-signal font-bold uppercase tracking-wider text-xs sm:text-sm h-12 sm:h-14 px-6 sm:px-8"
                    asChild
                  >
                    <Link href="/student">
                      <GraduationCap className="mr-2 h-4 w-4" /> My Student Profile
                    </Link>
                  </Button>
                  <Button
                    size="lg"
                    className="w-full sm:w-auto bg-card hover:bg-rule text-ink border border-ink font-bold uppercase tracking-wider text-xs sm:text-sm h-12 sm:h-14 px-6 sm:px-8"
                    asChild
                  >
                    <a href="#courses">
                      Browse Course Notes <ArrowRight className="ml-2 h-4 w-4" />
                    </a>
                  </Button>
                </>
              ) : isTeacher ? (
                <>
                  <Button
                    size="lg"
                    className="w-full sm:w-auto bg-ink hover:bg-signal text-paper border border-ink font-bold uppercase tracking-wider text-xs sm:text-sm h-12 sm:h-14 px-6 sm:px-8"
                    asChild
                  >
                    <Link href="/teacher">
                      <ShieldCheck className="mr-2 h-4 w-4 text-signal" /> Faculty Gradebook
                    </Link>
                  </Button>
                  <Button
                    size="lg"
                    className="w-full sm:w-auto bg-card hover:bg-rule text-ink border border-ink font-bold uppercase tracking-wider text-xs sm:text-sm h-12 sm:h-14 px-6 sm:px-8"
                    asChild
                  >
                    <a href="#courses">
                      Browse Course Notes <ArrowRight className="ml-2 h-4 w-4" />
                    </a>
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
                      <LogIn className="mr-2 h-4 w-4" /> Student Portal Login
                    </Link>
                  </Button>
                  <Button
                    size="lg"
                    className="w-full sm:w-auto bg-card hover:bg-rule text-ink border border-ink font-bold uppercase tracking-wider text-xs sm:text-sm h-12 sm:h-14 px-6 sm:px-8"
                    asChild
                  >
                    <Link href="/teacher">
                      <ShieldCheck className="mr-2 h-4 w-4 text-signal" /> Faculty Portal
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
                  Faculty Presentation Mode
                </h3>
                <p className="text-xs sm:text-sm text-ink-soft">
                  Press Present or [P] in any module for fullscreen lecture hall projector display with interactive animated diagrams.
                </p>
              </div>
            </div>

            <div className="bg-paper border border-rule p-4 sm:p-6 w-full max-w-sm flex items-start gap-4 relative left-0 md:-left-8 text-left shadow-[4px_4px_0_var(--rule)]">
              <div className="bg-ok/10 p-2.5 sm:p-3 text-ok shrink-0">
                <GraduationCap className="h-5 w-5 sm:h-6 sm:w-6" />
              </div>
              <div>
                <h3 className="font-bold text-xs sm:text-sm uppercase tracking-wider font-mono mb-1 sm:mb-2 text-ink">
                  Autonomous Syllabus
                </h3>
                <p className="text-xs sm:text-sm text-ink-soft">
                  Strictly aligned with TCET autonomous curriculum scheme, Bloom&apos;s Taxonomy L1–L4, and comprehensive exam rubrics.
                </p>
              </div>
            </div>
          </motion.div>
        </header>

        {/* COLLEGE-WIDE ACADEMIC ARCHITECTURE STRIP */}
        <section id="curriculum" className="border-t border-b border-rule py-10 space-y-8 scroll-mt-20">
          <div className="text-center max-w-2xl mx-auto space-y-1">
            <span className="font-mono text-xs uppercase tracking-wider text-signal font-bold">
              Institutional Scope &amp; Architecture
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-ink">
              Four-Year Engineering Curriculum Matrix
            </h2>
            <p className="text-xs sm:text-sm text-ink-soft">
              Unified digital learning framework across all engineering branches at Thakur College of Engineering &amp; Technology.
            </p>
          </div>

          {/* Department Badges */}
          <div className="flex flex-wrap items-center justify-center gap-2 font-mono text-[11px]">
            {["CMPN (Computer Engg)", "INFT (Information Tech)", "AI & DS", "AIML", "IoT & Cyber Security", "EXTC (Telecomm)", "Civil Engg", "Mechanical Engg"].map((dept) => (
              <span key={dept} className="px-3 py-1 bg-card border border-rule text-ink font-semibold">
                {dept}
              </span>
            ))}
          </div>

          {/* 4-Year Interactive Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {academicYears.map((item) => (
              <div
                key={item.id}
                onClick={() => setSelectedYear(item.id)}
                className={`p-5 bg-card border cursor-pointer transition-all ${
                  item.id === selectedYear
                    ? "border-signal shadow-[4px_4px_0_var(--signal)] bg-paper"
                    : "border-rule hover:border-ink shadow-[2px_2px_0_var(--rule)]"
                }`}
              >
                <div className="flex justify-between items-center text-xs font-mono mb-2">
                  <span className="font-bold text-signal">{item.year}</span>
                  {item.isActive && (
                    <span className="px-1.5 py-0.5 bg-ok text-paper text-[10px] uppercase font-bold">
                      Active Pilot
                    </span>
                  )}
                </div>
                <h4 className="font-serif font-bold text-ink text-base">
                  {item.sem}
                </h4>
                <p className="text-xs text-ink-soft mt-1 leading-relaxed">
                  {item.focus}
                </p>
                <div className="mt-3 pt-3 border-t border-rule space-y-1 font-mono text-[11px] text-ink-soft">
                  {item.subjects.slice(0, 3).map((sub) => (
                    <div key={sub} className="truncate flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 bg-rule rounded-full shrink-0"></span>
                      <span>{sub}</span>
                    </div>
                  ))}
                  {item.subjects.length > 3 && (
                    <span className="text-[10px] text-signal block font-bold">
                      +{item.subjects.length - 3} more subjects
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ACTIVE LIVE COURSE: CRYPTOGRAPHY & NETWORK SECURITY */}
        <section id="courses" className="space-y-8 scroll-mt-20">
          <div className="bg-card border-2 border-ink p-6 sm:p-8 shadow-[6px_6px_0_var(--rule)] space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-rule pb-6">
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className="px-2.5 py-0.5 bg-signal text-paper font-mono text-[10px] font-bold uppercase tracking-wider">
                    ⭐ Active Live Course
                  </span>
                  <span className="font-mono text-xs text-ink-soft">
                    TE Computer Engineering · Semester VI · Course Code: CSC602
                  </span>
                </div>
                <h2 className="font-serif text-3xl sm:text-4xl font-bold text-ink">
                  Cryptography &amp; Network Security (CNS)
                </h2>
                <p className="text-sm text-ink-soft max-w-2xl mt-1">
                  Complete 45-hour autonomous course notes, scrollytelling visual breakdowns, interactive algorithm simulators, and timed assessment challenges.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <Button
                  size="sm"
                  className="bg-ink hover:bg-signal text-paper font-mono text-xs uppercase font-bold tracking-wider"
                  asChild
                >
                  <Link href="/quiz">
                    <Flame className="mr-1.5 h-3.5 w-3.5 text-warn" /> Quiz Engine
                  </Link>
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="border-rule hover:border-ink bg-paper font-mono text-xs uppercase text-ink"
                  asChild
                >
                  <Link href="/revision">
                    Formula Sheets &rarr;
                  </Link>
                </Button>
              </div>
            </div>

            {/* ALL 6 UNITS - DIRECT NOTES */}
            <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {activeCourseModules.map((module, i) => (
                <motion.div
                  key={module.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 * i }}
                >
                  <div className="h-full flex flex-col bg-paper border border-ink p-6 shadow-[4px_4px_0_var(--rule)] hover:shadow-[6px_6px_0_var(--signal)] hover:border-signal transition-all">
                    {/* Top Bar: Icon + Code + Badges */}
                    <div className="mb-4 flex justify-between items-start">
                      <div className="p-2 border border-ink bg-card text-signal">
                        {module.icon}
                      </div>
                      <div className="flex items-center gap-1.5 font-mono text-[10px]">
                        <span className="px-1.5 py-0.5 border border-rule bg-card text-ink-soft font-bold">
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
                          className="px-2 py-0.5 bg-card border border-rule text-ink-soft"
                        >
                          {topic}
                        </span>
                      ))}
                    </div>

                    {/* Direct Notes & Slides Actions */}
                    <div className="pt-4 border-t border-rule flex items-center justify-between gap-2 text-xs font-mono uppercase tracking-wider">
                      <Link
                        href={`/modules/${module.id}`}
                        className="px-3.5 py-2 bg-ink hover:bg-signal text-paper transition-colors font-bold flex items-center gap-1.5 text-xs shadow-xs"
                      >
                        <span>Open Notes</span>
                        <ArrowRight className="h-3 w-3" />
                      </Link>

                      <Link
                        href={`/present/${module.code.toLowerCase()}/${module.primaryTopic}`}
                        className="px-2.5 py-2 border border-rule hover:border-ink bg-card text-ink transition-colors flex items-center gap-1.5 text-[11px]"
                      >
                        <Presentation className="h-3 w-3 text-signal" />
                        <span>[P] Slides</span>
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* FUTURE EXPANSION ROADMAP */}
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-rule pb-4">
            <div>
              <div className="inline-flex items-center gap-2 font-mono text-xs text-signal font-bold uppercase tracking-wider mb-1">
                <Compass className="h-4 w-4" />
                <span>Expansion Roadmap</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-serif text-ink font-bold">
                Upcoming Subjects Across Departments
              </h2>
              <p className="text-xs sm:text-sm text-ink-soft font-mono mt-0.5">
                Staged for progressive rollout across SE, TE, and BE semesters.
              </p>
            </div>
            <span className="font-mono text-xs text-ink-soft bg-card px-3 py-1 border border-rule">
              Phase II &amp; III Curriculum Expansion
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {upcomingSubjects.map((subject) => (
              <div
                key={subject.code}
                className="p-6 bg-card border border-rule space-y-4 hover:border-ink transition-colors"
              >
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-paper border border-rule">
                      {subject.icon}
                    </div>
                    <div>
                      <span className="font-mono text-[10px] text-ink-soft uppercase tracking-wider block">
                        {subject.year} · {subject.dept}
                      </span>
                      <h3 className="font-serif text-lg font-bold text-ink">
                        {subject.title}
                      </h3>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 bg-paper border border-rule text-ink-soft font-mono text-[10px] uppercase font-bold">
                    {subject.status}
                  </span>
                </div>

                <p className="text-xs text-ink-soft leading-relaxed font-sans">
                  {subject.desc}
                </p>

                <div className="pt-2 border-t border-rule/60 flex items-center justify-between text-xs font-mono text-ink-soft">
                  <span>Course Code: {subject.code}</span>
                  <span className="text-signal font-semibold">Simulators in Development</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* INSTITUTIONAL PORTAL CAPABILITIES */}
        <section id="portals" className="bg-card border border-rule p-8 sm:p-12 space-y-8 scroll-mt-20">
          <div className="max-w-2xl space-y-2">
            <span className="font-mono text-xs uppercase tracking-wider text-signal font-bold">
              Autonomous College Framework
            </span>
            <h2 className="text-2xl sm:text-4xl font-serif text-ink font-bold">
              Integrated Campus Portals
            </h2>
            <p className="text-sm text-ink-soft leading-relaxed">
              TCET LMS provides tailored dashboards for students to verify competencies and for faculty to conduct assessment evaluations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 bg-paper border border-rule space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xs bg-signal/15 text-signal flex items-center justify-center font-bold text-lg">
                  👨‍🎓
                </div>
                <div>
                  <h3 className="font-serif text-xl font-bold text-ink">Student Capabilities</h3>
                  <p className="text-xs text-ink-soft font-mono">Roll-Number Linked Progress</p>
                </div>
              </div>
              <ul className="text-xs text-ink-soft space-y-2 list-disc pl-5 font-sans leading-relaxed">
                <li>Access complete lecture notes, formulas, and visual cipher animations.</li>
                <li>Submit timed lab assessments; scores are automatically catalogued to the instructor gradebook.</li>
                <li>Inspect personal accuracy rates broken down by Bloom&apos;s Taxonomy.</li>
                <li>Master cybersecurity concepts with interactive laboratory simulators.</li>
              </ul>
              <div className="pt-2">
                <Link
                  href={isStudent ? "/student" : "/login"}
                  className="inline-flex items-center gap-1.5 font-mono text-xs text-signal font-bold hover:underline uppercase"
                >
                  {isStudent ? "Go to My Student Profile →" : "Access Student Portal →"}
                </Link>
              </div>
            </div>

            <div className="p-6 bg-paper border border-rule space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xs bg-ok/15 text-ok flex items-center justify-center font-bold text-lg">
                  👩‍🏫
                </div>
                <div>
                  <h3 className="font-serif text-xl font-bold text-ink">Faculty &amp; Examiner Tools</h3>
                  <p className="text-xs text-ink-soft font-mono">Protected by Faculty Credentials (cns2026)</p>
                </div>
              </div>
              <ul className="text-xs text-ink-soft space-y-2 list-disc pl-5 font-sans leading-relaxed">
                <li>Master class submission ledger updating dynamically as students finish terminal evaluations.</li>
                <li>Real-time distribution metrics: Class average, passing percentage, and distinction rate.</li>
                <li>1-click CSV Gradebook export formatted for university internal assessment submission.</li>
                <li>Fullscreen Projector Presentation Mode (`[P]`) for engaging classroom teaching.</li>
              </ul>
              <div className="pt-2">
                <Link
                  href="/teacher"
                  className="inline-flex items-center gap-1.5 font-mono text-xs text-ink font-bold hover:text-signal hover:underline uppercase"
                >
                  {isTeacher ? "Go to Faculty Gradebook →" : "Open Faculty Examiner Portal →"}
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* INSTITUTIONAL FOOTER */}
        <footer className="border-t border-rule pt-8 pb-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 font-mono text-xs text-ink-soft">
          <div>
            <div className="flex items-center gap-2 text-ink font-serif font-bold text-base mb-1">
              <span>Thakur College of Engineering and Technology</span>
            </div>
            <p className="max-w-md text-[11px] leading-relaxed">
              TCET Learning Management System (TCET LMS) · Autonomous Institute Affiliated to University of Mumbai · Approved by AICTE &amp; Govt. of Maharashtra · Accredited by NAAC with &apos;A&apos; Grade.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 text-[11px]">
            <Link href={isStudent ? "/student" : "/login"} className="hover:text-signal transition-colors">
              Student Portal
            </Link>
            <span>·</span>
            <Link href="/teacher" className="hover:text-signal transition-colors">
              Faculty Portal
            </Link>
            <span>·</span>
            <Link href="/quiz" className="hover:text-signal transition-colors">
              Assessment Engine
            </Link>
            <span>·</span>
            <Link href="/revision" className="hover:text-signal transition-colors">
              Revision Hub
            </Link>
            <span>·</span>
            <span className="text-ink">TCET LMS v2.4 (2026)</span>
          </div>
        </footer>
      </main>
    </div>
  )
}
