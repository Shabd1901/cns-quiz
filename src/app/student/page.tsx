"use client"

import React, { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/lib/authStore"
import { useQuizRecordsStore } from "@/lib/quizRecordsStore"
import { useAcademicStore, ACADEMIC_SUBJECTS, SubjectItem } from "@/lib/academicStore"
import { useMounted } from "@/hooks/useMounted"
import { AcademicTimelineView } from "@/components/academic/AcademicTimelineView"
import { StudentMarksView } from "@/components/academic/StudentMarksView"
import {
  Flame,
  ArrowRight,
  ArrowLeft,
  Presentation,
  BookOpen,
  Key,
  Cpu,
  Lock,
  Terminal,
  Network,
  FileKey2,
  Calendar,
  Award,
  Layers,
  Server,
  Database,
  Globe,
  GraduationCap,
  CheckCircle2,
  Sparkles,
  FileText,
  Clock,
  Compass
} from "lucide-react"

// Syllabus Modules for CSC602 (CNS)
const cnsCourseModules = [
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

// Syllabus Modules for ITC504 (Web Programming)
const wpCourseModules = [
  {
    id: "wp-fundamentals",
    code: "WP-M1",
    title: "Web Tech Fundamentals, HTML5 & CSS3",
    hours: "8 hrs",
    bloom: "Bloom L1–L3, L6",
    icon: Layers,
    desc: "Client-server architecture, HTTP request-response cycle, HTML5 semantic layout, multimedia canvas, CSS Box Model, Flexbox 1D, and CSS Grid 2D.",
    primaryTopic: "web-arch-http",
    keyTopics: ["HTTP Protocol", "HTML5 Semantics", "CSS Box Model", "Flexbox 1D", "CSS Grid 2D"],
  },
  {
    id: "wp-javascript",
    code: "WP-M2",
    title: "JavaScript & Modern Client-Side",
    hours: "8 hrs",
    bloom: "Bloom L1–L3, L6",
    icon: Terminal,
    desc: "Single-threaded non-blocking runtime, scoping (var/let/const), DOM manipulation, event bubbling & delegation, ES6+ features, and the Event Loop.",
    primaryTopic: "js-core-scoping",
    keyTopics: ["Scoping & Closures", "DOM Bubbling", "ES6 Destructuring", "Event Loop", "Promises & Async"],
  },
  {
    id: "wp-react",
    code: "WP-M3",
    title: "Frontend Engineering: React & Next.js",
    hours: "8 hrs",
    bloom: "Bloom L1–L3, L5–L6",
    icon: Cpu,
    desc: "Component architecture, Virtual DOM diffing reconciliation, React Hooks (useState, useEffect), Next.js App Router, SSR, SSG, and ISR.",
    primaryTopic: "react-components-jsx",
    keyTopics: ["Virtual DOM", "React Hooks", "Next.js App Router", "SSR vs SSG", "ISR"],
  },
  {
    id: "wp-nodejs",
    code: "WP-M4",
    title: "Server-Side: Node.js & Express.js",
    hours: "7 hrs",
    bloom: "Bloom L1–L3, L5–L6",
    icon: Server,
    desc: "V8 & libuv event loop, non-blocking I/O, Express middleware pipeline (req, res, next), RESTful CRUD endpoints, and centralized error handling.",
    primaryTopic: "nodejs-architecture",
    keyTopics: ["libuv Architecture", "Express Middleware", "RESTful CRUD", "Status Codes", "Error Pipeline"],
  },
  {
    id: "wp-php",
    code: "WP-M5",
    title: "Server-Side: PHP & MySQL (PDO)",
    hours: "9 hrs",
    bloom: "Bloom L1–L4, L6",
    icon: Database,
    desc: "Server-side scripting lifecycle, PHP Superglobals, stateful session cookies, relational database querying with PDO prepared statements, and SQLi defense.",
    primaryTopic: "php-syntax-superglobals",
    keyTopics: ["PHP Superglobals", "session_start()", "PDO Prepared", "SQLi Immunity", "password_hash()"],
  },
  {
    id: "wp-fullstack",
    code: "WP-M6",
    title: "Full-Stack Architecture & Web Security",
    hours: "5 hrs",
    bloom: "Bloom L1–L3, L6",
    icon: Globe,
    desc: "3-tier architecture, CORS preflight negotiation, stateless JWT token authentication, Git version control workflows, CI/CD, and OWASP Top 10 defense.",
    primaryTopic: "fullstack-tier-cors",
    keyTopics: ["3-Tier Separation", "CORS Preflight", "Stateless JWT", "Git Branching", "OWASP Top 10"],
  },
]

// Topic Laboratories for CNS
const cnsSimulators = [
  { href: "/modules/crypto", label: "Classical Cipher Lab", sub: "Caesar, Affine, Playfair, Hill Matrix, Transposition", icon: Key },
  { href: "/modules/auth", label: "DES & AES Block Cipher Lab", sub: "Feistel Rounds, S-Box, MixColumns, AES Key Expansion", icon: Cpu },
  { href: "/modules/firewall", label: "Firewall & DMZ Defense Lab", sub: "Packet Filter Rule Matrix, Stateful Inspection, NAT", icon: Network },
  { href: "/modules/attacks", label: "Computing Attacks Lab", sub: "Buffer Overflow, SQL Injection, XSS, Stack Canaries", icon: Lock },
  { href: "/modules/ids", label: "IDS & IPS Lab", sub: "Signature, Anomaly Detection, Snort Rule Engine", icon: Terminal },
  { href: "/modules/tls", label: "SSL / TLS Lab", sub: "Handshake Flights, Cipher Suites, 1-RTT Forward Secrecy", icon: FileKey2 },
  { href: "/modules/cloud", label: "Cloud Security Lab", sub: "Shared Responsibility, IAM Policies, S3 Storage", icon: Server },
  { href: "/modules/ai", label: "AI Security Lab", sub: "Adversarial Evasion, Model Poisoning, ML Defense", icon: Sparkles }
]

// Topic Laboratories for Web Programming
const wpSimulators = [
  { href: "/modules/wp-fundamentals", label: "CSS Box Model & Grid Matrix Lab", sub: "Box-sizing, padding/margin math, Flexbox 1D & Grid 2D", icon: Layers },
  { href: "/modules/wp-javascript", label: "JavaScript Event Loop & Closures Lab", sub: "Call Stack, Microtask queue, timers, and lexical scope", icon: Terminal },
  { href: "/modules/wp-react", label: "React Virtual DOM Reconciliation Lab", sub: "O(N) Diff heuristic, useState dependency rules, SSR", icon: Cpu },
  { href: "/modules/wp-nodejs", label: "Node.js Express Middleware Pipeline", sub: "libuv async I/O, request routing, error pipeline", icon: Server },
  { href: "/modules/wp-php", label: "PHP PDO SQLi Immunity Lab", sub: "Prepared statements parameter binding vs dynamic strings", icon: Database },
  { href: "/modules/wp-fullstack", label: "Full-Stack JWT & CORS Security Lab", sub: "Stateless Bearer auth, preflight headers, OWASP Top 10", icon: Globe }
]

// Syllabus info for other 4 subjects
const OTHER_SUBJECTS_DETAILS: Record<string, {
  syllabusHours: number
  description: string
  units: { code: string; title: string; desc: string; topics: string[] }[]
}> = {
  ITC601: {
    syllabusHours: 45,
    description: "Relational database modeling, SQL DDL/DML, functional dependencies, BCNF normalization, ACID transactions, and NoSQL warehousing.",
    units: [
      { code: "M1", title: "Introduction & Relational Model", desc: "Entity-Relationship (ER/EER) modeling, relational schema translation, and Relational Algebra operators.", topics: ["ER Diagrams", "Relational Algebra", "Tuple Calculus", "Integrity Constraints"] },
      { code: "M2", title: "Advanced SQL & Database Design", desc: "Complex nested queries, joins, triggers, assertions, stored procedures, and dynamic SQL.", topics: ["Subqueries & Joins", "Triggers & Views", "Stored Procedures", "Embedded SQL"] },
      { code: "M3", title: "Relational Design & Normalization", desc: "Functional dependencies, Armstrong's axioms, 1NF, 2NF, 3NF, BCNF, lossless join decomposition.", topics: ["Functional Dependency", "1NF to 3NF", "Boyce-Codd Normal Form", "Lossless Decomposition"] },
      { code: "M4", title: "Transaction Processing & Concurrency", desc: "ACID properties, serializability, lock-based protocols (2PL), deadlock prevention, and timestamp ordering.", topics: ["ACID Properties", "Two-Phase Locking (2PL)", "Deadlock Detection", "Timestamp Protocols"] },
      { code: "M5", title: "Crash Recovery Systems", desc: "Log-based recovery, write-ahead logging (WAL), checkpoints, ARIES algorithm, and shadow paging.", topics: ["Write-Ahead Logging", "Checkpoints", "ARIES Algorithm", "Shadow Paging"] },
      { code: "M6", title: "Data Warehousing & NoSQL", desc: "Star and snowflake dimensional schemas, ETL pipeline, OLAP cubes, MongoDB document storage, and CAP theorem.", topics: ["Star/Snowflake Schema", "OLAP Cubes", "MongoDB Document Store", "CAP Theorem"] }
    ]
  },
  CSC404: {
    syllabusHours: 45,
    description: "Operating system principles, kernel architecture, process scheduling, concurrency synchronization, virtual memory paging, and file systems.",
    units: [
      { code: "M1", title: "OS Architecture & Process Model", desc: "Monolithic vs microkernels, system calls, PCB structure, process state transitions, and context switching.", topics: ["Kernel Architecture", "Process Control Block (PCB)", "System Calls", "Context Switching"] },
      { code: "M2", title: "CPU Scheduling Algorithms", desc: "Preemptive vs non-preemptive algorithms: FCFS, SJF, Round Robin, Priority, and Multi-Level Feedback Queues.", topics: ["FCFS & SJF", "Round Robin (RR)", "Priority Scheduling", "Multilevel Queues"] },
      { code: "M3", title: "Process Synchronization & Deadlocks", desc: "Critical section problem, Peterson's algorithm, Semaphores, Monitors, Banker's algorithm for deadlock avoidance.", topics: ["Critical Section", "Counting Semaphores", "Dining Philosophers", "Banker's Algorithm"] },
      { code: "M4", title: "Memory Management & Paging", desc: "Contiguous allocation, paging, Page Table Base Register (PTBR), Translation Lookaside Buffer (TLB), and segmentation.", topics: ["Paging Hardware", "TLB Translation", "Segmentation", "Internal/External Frag"] },
      { code: "M5", title: "Virtual Memory & Page Replacement", desc: "Demand paging, page fault handling, FIFO, LRU, Optimal page replacement algorithms, and thrashing mitigation.", topics: ["Demand Paging", "FIFO vs LRU vs OPT", "Belady's Anomaly", "Thrashing & Working Set"] },
      { code: "M6", title: "Storage & File Systems", desc: "Disk scheduling (SSTF, SCAN, C-SCAN), inode structure, file allocation methods (contiguous, linked, indexed).", topics: ["Disk Scheduling", "Unix Inode Table", "File Allocation", "RAID Architectures"] }
    ]
  },
  ITC602: {
    syllabusHours: 45,
    description: "Computer network protocols, layered architecture, data link flow control, IP subnetting & CIDR, routing algorithms, and transport protocols.",
    units: [
      { code: "M1", title: "Network Reference Models & Physical Layer", desc: "OSI 7-layer model, TCP/IP 4-layer model, packet vs circuit switching, guided transmission media, and topologies.", topics: ["OSI 7-Layer", "TCP/IP Suite", "Packet Switching", "Transmission Media"] },
      { code: "M2", title: "Data Link Layer & MAC Protocols", desc: "Framing, error detection (CRC-32, Checksum), flow control (Stop-and-Wait, Go-Back-N, Selective Repeat), CSMA/CD.", topics: ["CRC-32 Calculation", "Go-Back-N vs SR", "Sliding Window", "Ethernet CSMA/CD"] },
      { code: "M3", title: "Network Layer & IP Subnetting", desc: "IPv4 addressing, Classless Inter-Domain Routing (CIDR), Variable Length Subnet Masking (VLSM), IPv6 header, ARP/RARP.", topics: ["CIDR Subnet Math", "VLSM Allocation", "IPv4 vs IPv6 Header", "ARP Protocol"] },
      { code: "M4", title: "Routing Protocols & Algorithms", desc: "Intra-domain vs inter-domain routing: Dijkstra's Link-State (OSPF), Bellman-Ford Distance Vector (RIP), and BGP.", topics: ["Dijkstra Shortest Path", "Bellman-Ford & Count-to-Inf", "OSPF Areas", "BGP Path Vector"] },
      { code: "M5", title: "Transport Layer: TCP & UDP", desc: "3-way handshake, connection teardown, TCP sliding window, flow control, and congestion control (AIMD, Slow Start).", topics: ["TCP 3-Way Handshake", "TCP vs UDP", "AIMD Congestion", "Fast Retransmit"] },
      { code: "M6", title: "Application Layer Services", desc: "Domain Name System (DNS) resolution, HTTP/1.1 vs HTTP/2, SMTP/IMAP email transfer, FTP, and DHCP dynamic allocation.", topics: ["DNS Hierarchy", "HTTP/2 Multiplexing", "SMTP & MIME", "DHCP DORA Flow"] }
    ]
  },
  ITC603: {
    syllabusHours: 40,
    description: "Software engineering methodologies, Agile Scrum, requirements modeling, design patterns, testing techniques, and CI/CD pipelines.",
    units: [
      { code: "M1", title: "Software Process Models", desc: "Waterfall, Incremental, Spiral, Agile Scrum framework (Sprints, Standups, Retrospectives), and Kanban boards.", topics: ["Waterfall vs Agile", "Scrum Framework", "User Stories", "Kanban Workflows"] },
      { code: "M2", title: "Requirements Engineering", desc: "Functional vs non-functional requirements, SRS document IEEE standard, use case modeling, and feasibility analysis.", topics: ["IEEE SRS Standard", "Use Case Diagrams", "Feasibility Study", "Requirement Traceability"] },
      { code: "M3", title: "Software Architecture & Design", desc: "Coupling and cohesion metrics, architectural styles (MVC, Microservices, Event-Driven), and GoF design patterns.", topics: ["Coupling & Cohesion", "MVC Architecture", "Microservices", "Design Patterns (GoF)"] },
      { code: "M4", title: "Software Testing & QA", desc: "Black-box testing (Equivalence Partitioning, BVA), White-box testing (Basis Path, Cyclomatic Complexity), unit & integration.", topics: ["Equivalence Partitioning", "Cyclomatic Complexity", "Basis Path Testing", "Unit vs Integration"] },
      { code: "M5", title: "Project Estimation & Risk", desc: "COCOMO I & II cost estimation, Function Point analysis, risk management matrix, and Gantt charts.", topics: ["COCOMO Estimation", "Function Points", "Risk Matrix", "Critical Path Method"] },
      { code: "M6", title: "DevOps & Quality Standards", desc: "Git workflows, CI/CD automated test pipelines, CMMI maturity levels, and ISO 9001 software quality benchmarks.", topics: ["Git Branching Flow", "CI/CD Pipelines", "CMMI Levels 1-5", "Software Maintenance"] }
    ]
  }
}

export default function StudentPortalPage() {
  const router = useRouter()
  const { role, student, teacher, isAuthenticated, logout } = useAuthStore()
  const { submissions } = useQuizRecordsStore()
  const { studentMarks } = useAcademicStore()
  const mounted = useMounted()

  // The core state: selectedSubject is null -> shows "My Enrolled Subjects" grid.
  // When a subject is selected -> shows ALL info for THAT subject only!
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null)
  const [subjectTab, setSubjectTab] = useState<"modules" | "quizzes" | "marks" | "timeline" | "simulators">("modules")

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
            onClick={() => {
              logout()
              router.push("/")
            }}
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
          Please log in with your Name and Roll Number to view your enrolled subjects, course notes, and marks.
        </p>
        <div className="flex items-center justify-center gap-4 pt-2">
          <Link
            href="/login"
            className="px-6 py-2.5 bg-signal text-paper font-mono text-xs font-bold uppercase tracking-wider hover:opacity-90 transition-opacity"
          >
            Go to Student Login →
          </Link>
          <Link
            href="/"
            className="px-5 py-2.5 border border-rule hover:border-ink bg-card font-mono text-xs uppercase text-ink transition-colors"
          >
            Return to Landing Page
          </Link>
        </div>
      </div>
    )
  }

  // Filter student marks for this student
  const effectiveRoll = student.rollNo
  const myMarks = studentMarks.filter(
    (m) => m.rollNo.toUpperCase() === effectiveRoll.toUpperCase()
  )

  // Current selected subject object
  const activeSubjectInfo = ACADEMIC_SUBJECTS.find((s) => s.code === selectedSubject)
  const activeSubjectMark = myMarks.find((m) => m.subjectCode === selectedSubject)

  return (
    <div className="min-h-screen bg-paper py-8 px-4 sm:px-6">
      <div className="max-w-6xl w-full mx-auto space-y-8">
        {/* Student Profile Top Strip */}
        <div className="bg-card border-2 border-ink p-6 shadow-[6px_6px_0_var(--rule)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 bg-signal text-paper font-mono text-[10px] font-bold uppercase tracking-wider">
                Active Student Portal
              </span>
              <span className="font-mono text-xs text-ink-soft">
                {student.department || "Computer Engineering (CMPN)"}
              </span>
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-ink">
              Welcome, {student.name}
            </h1>
            <p className="font-mono text-xs text-ink-soft flex items-center gap-4">
              <span>Roll No: <strong className="text-signal font-semibold">{student.rollNo}</strong></span>
              <span>Batch: <strong className="text-ink font-semibold">{student.batch || "Batch A1"}</strong></span>
              <span>Term: <strong className="text-ink font-semibold">Semester VI (2025–26)</strong></span>
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <Link
              href="/"
              className="px-3 py-1.5 border border-rule hover:border-ink bg-paper font-mono text-xs uppercase text-ink transition-colors"
            >
              Landing Page
            </Link>
            <button
              type="button"
              onClick={() => {
                logout()
                router.push("/")
              }}
              className="px-3 py-1.5 border border-rule hover:border-bad bg-paper font-mono text-xs uppercase text-bad transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* VIEW 1: MY ENROLLED SUBJECTS GRID (When no subject is selected)            */}
        {/* ========================================================================= */}
        {!selectedSubject && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b-2 border-ink pb-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2 py-0.5 bg-ok text-paper font-mono text-[10px] font-bold uppercase tracking-wider">
                    Enrolled Courses · 6 Subjects
                  </span>
                  <span className="font-mono text-xs text-ink-soft">
                    Thakur College of Engineering &amp; Technology · Autonomous
                  </span>
                </div>
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-ink flex items-center gap-2">
                  <BookOpen className="h-6 w-6 text-signal" />
                  <span>My Enrolled Subjects</span>
                </h2>
                <p className="font-sans text-xs sm:text-sm text-ink-soft mt-1 max-w-2xl leading-relaxed">
                  Select any subject to enter its dedicated workspace containing its syllabus modules, theory notes,
                  interactive laboratories, quizzes, and continuous evaluation marks.
                </p>
              </div>
            </div>

            {/* Grid of 6 Enrolled Subjects */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {ACADEMIC_SUBJECTS.map((sub) => {
                const subMark = myMarks.find((m) => m.subjectCode === sub.code)
                const isCNS = sub.code === "CSC602"
                const isWP = sub.code === "ITC504"
                const isInteractive = isCNS || isWP

                return (
                  <div
                    key={sub.code}
                    onClick={() => {
                      setSelectedSubject(sub.code)
                      setSubjectTab("modules")
                    }}
                    className={`p-6 border bg-card hover:border-signal hover:shadow-[6px_6px_0_var(--signal)] transition-all flex flex-col justify-between cursor-pointer group ${
                      isInteractive ? "border-ink shadow-[4px_4px_0_var(--rule)]" : "border-rule"
                    }`}
                  >
                    <div className="space-y-4">
                      {/* Top Badges */}
                      <div className="flex items-center justify-between">
                        <span className="px-2 py-0.5 bg-ink text-paper font-mono text-xs font-bold">
                          {sub.code}
                        </span>
                        <div className="flex items-center gap-1 font-mono text-[10px]">
                          <span className="px-1.5 py-0.5 bg-paper border border-rule text-ink-soft">
                            {sub.credits} Credits
                          </span>
                          {isInteractive && (
                            <span className="px-1.5 py-0.5 bg-signal/10 border border-signal/30 text-signal font-bold uppercase">
                              Active Labs
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Course Title */}
                      <div>
                        <h3 className="font-serif text-xl font-bold text-ink group-hover:text-signal transition-colors leading-snug">
                          {sub.name}
                        </h3>
                        <p className="font-mono text-xs text-ink-soft mt-1">
                          In-Charge: {sub.inCharge}
                        </p>
                        <p className="font-mono text-[11px] text-ink-soft/80">
                          {sub.department} · {sub.semester}
                        </p>
                      </div>

                      {/* Subject Feature List */}
                      <div className="space-y-1.5 pt-2 border-t border-rule font-mono text-[11px] text-ink">
                        {isCNS && (
                          <>
                            <div className="flex items-center gap-1.5 text-signal font-semibold">
                              <span>■</span> 6 Syllabus Modules (M1–M6) · 45 Hours
                            </div>
                            <div className="flex items-center gap-1.5 text-ink-soft">
                              <span>■</span> 8 Deep-Dive Security Simulators
                            </div>
                            <div className="flex items-center gap-1.5 text-ink-soft">
                              <span>■</span> Module Quizzes &amp; 45Q Mock Exam
                            </div>
                          </>
                        )}
                        {isWP && (
                          <>
                            <div className="flex items-center gap-1.5 text-signal font-semibold">
                              <span>■</span> 6 Web Modules (WP-M1–WP-M6) · 45 Hours
                            </div>
                            <div className="flex items-center gap-1.5 text-ink-soft">
                              <span>■</span> HTML5, React, Node, PHP &amp; Security Labs
                            </div>
                            <div className="flex items-center gap-1.5 text-ink-soft">
                              <span>■</span> Module Quizzes &amp; 30Q Exam
                            </div>
                          </>
                        )}
                        {!isInteractive && (
                          <>
                            <div className="flex items-center gap-1.5 text-ink-soft">
                              <span>■</span> 6 Autonomous Syllabus Units
                            </div>
                            <div className="flex items-center gap-1.5 text-ink-soft">
                              <span>■</span> Continuous Evaluation Schedule
                            </div>
                            <div className="flex items-center gap-1.5 text-ink-soft">
                              <span>■</span> Course Reference Materials
                            </div>
                          </>
                        )}
                      </div>

                      {/* Current Score Summary */}
                      {subMark && (
                        <div className="p-3 bg-paper border border-rule flex items-center justify-between font-mono text-xs">
                          <div>
                            <span className="text-[10px] uppercase text-ink-soft block font-bold">Internal Score</span>
                            <span className="font-bold text-ink">{subMark.totalMarks} / 135</span>
                            <span className="text-ink-soft text-[10px] ml-1">({subMark.percentage}%)</span>
                          </div>
                          <span
                            className={`px-2 py-0.5 text-xs font-bold border ${
                              subMark.status === "Distinction"
                                ? "bg-ok/10 text-ok border-ok/30"
                                : "bg-signal/10 text-signal border-signal/30"
                            }`}
                          >
                            Grade {subMark.grade}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Action Button */}
                    <div className="pt-4 border-t border-rule mt-4 flex justify-end">
                      <button
                        type="button"
                        className="w-full py-2.5 bg-ink text-paper group-hover:bg-signal font-mono text-xs uppercase font-bold transition-colors flex items-center justify-center gap-1.5 shadow-[2px_2px_0_var(--rule)]"
                      >
                        <span>Open Subject Workspace</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* VIEW 2: SELECTED SUBJECT WORKSPACE (All info for ONE subject only)         */}
        {/* ========================================================================= */}
        {selectedSubject && activeSubjectInfo && (
          <div className="space-y-6">
            {/* Top Switcher & Return Bar */}
            <div className="p-4 bg-card border border-ink flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <button
                onClick={() => setSelectedSubject(null)}
                className="px-3.5 py-1.5 border border-rule hover:border-ink bg-paper font-mono text-xs uppercase text-ink font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                <span>← Back to My Enrolled Subjects</span>
              </button>

              {/* Quick Subject Switcher Pills */}
              <div className="flex flex-wrap items-center gap-1.5 font-mono text-xs">
                <span className="text-ink-soft uppercase text-[10px] font-bold mr-1">Switch:</span>
                {ACADEMIC_SUBJECTS.map((sub) => (
                  <button
                    key={sub.code}
                    onClick={() => {
                      setSelectedSubject(sub.code)
                      setSubjectTab("modules")
                    }}
                    className={`px-2.5 py-1 border text-[11px] font-bold uppercase transition-colors cursor-pointer ${
                      selectedSubject === sub.code
                        ? "bg-signal text-paper border-signal"
                        : "bg-paper text-ink border-rule hover:border-ink"
                    }`}
                  >
                    {sub.code}
                  </button>
                ))}
              </div>
            </div>

            {/* Subject Workspace Banner */}
            <div className="p-6 sm:p-8 bg-card border-2 border-ink shadow-[6px_6px_0_var(--rule)] space-y-4">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-rule pb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2.5 py-0.5 bg-signal text-paper font-mono text-[10px] font-bold uppercase tracking-wider">
                      Course Code: {activeSubjectInfo.code}
                    </span>
                    <span className="font-mono text-xs text-ink-soft">
                      {activeSubjectInfo.department} · {activeSubjectInfo.semester}
                    </span>
                  </div>
                  <h2 className="font-serif text-3xl sm:text-4xl font-bold text-ink">
                    {activeSubjectInfo.name}
                  </h2>
                  <p className="font-mono text-xs text-ink-soft mt-1">
                    Faculty In-Charge: <strong className="text-ink">{activeSubjectInfo.inCharge}</strong> · Credits: {activeSubjectInfo.credits}
                  </p>
                </div>

                {activeSubjectMark && (
                  <div className="p-4 bg-paper border border-ink text-right font-mono min-w-[200px]">
                    <span className="text-[10px] uppercase text-ink-soft block font-bold">Continuous Score</span>
                    <div className="text-2xl font-bold text-signal">
                      {activeSubjectMark.totalMarks} / 135
                    </div>
                    <span className="text-xs text-ink-soft block">
                      {activeSubjectMark.percentage}% · Grade {activeSubjectMark.grade} ({activeSubjectMark.status})
                    </span>
                  </div>
                )}
              </div>

              {/* Sub-Tabs strictly for this subject */}
              <div className="flex flex-wrap items-center gap-2 pt-2 font-mono text-xs">
                <button
                  onClick={() => setSubjectTab("modules")}
                  className={`px-4 py-2 uppercase font-bold border transition-all cursor-pointer flex items-center gap-2 ${
                    subjectTab === "modules"
                      ? "bg-signal text-paper border-signal shadow-[2px_2px_0_var(--ink)]"
                      : "bg-paper text-ink border-rule hover:border-ink"
                  }`}
                >
                  <BookOpen className="h-4 w-4" />
                  <span>1. Course Modules &amp; Notes</span>
                </button>

                <button
                  onClick={() => setSubjectTab("quizzes")}
                  className={`px-4 py-2 uppercase font-bold border transition-all cursor-pointer flex items-center gap-2 ${
                    subjectTab === "quizzes"
                      ? "bg-signal text-paper border-signal shadow-[2px_2px_0_var(--ink)]"
                      : "bg-paper text-ink border-rule hover:border-ink"
                  }`}
                >
                  <Award className="h-4 w-4" />
                  <span>2. Quizzes &amp; Assessments</span>
                </button>

                <button
                  onClick={() => setSubjectTab("marks")}
                  className={`px-4 py-2 uppercase font-bold border transition-all cursor-pointer flex items-center gap-2 ${
                    subjectTab === "marks"
                      ? "bg-signal text-paper border-signal shadow-[2px_2px_0_var(--ink)]"
                      : "bg-paper text-ink border-rule hover:border-ink"
                  }`}
                >
                  <FileText className="h-4 w-4" />
                  <span>3. My Marks &amp; Evaluation</span>
                </button>

                <button
                  onClick={() => setSubjectTab("timeline")}
                  className={`px-4 py-2 uppercase font-bold border transition-all cursor-pointer flex items-center gap-2 ${
                    subjectTab === "timeline"
                      ? "bg-signal text-paper border-signal shadow-[2px_2px_0_var(--ink)]"
                      : "bg-paper text-ink border-rule hover:border-ink"
                  }`}
                >
                  <Calendar className="h-4 w-4" />
                  <span>4. Portion Timeline &amp; Dates</span>
                </button>

                {(selectedSubject === "CSC602" || selectedSubject === "ITC504") && (
                  <button
                    onClick={() => setSubjectTab("simulators")}
                    className={`px-4 py-2 uppercase font-bold border transition-all cursor-pointer flex items-center gap-2 ${
                      subjectTab === "simulators"
                        ? "bg-signal text-paper border-signal shadow-[2px_2px_0_var(--ink)]"
                        : "bg-paper text-ink border-rule hover:border-ink"
                    }`}
                  >
                    <Sparkles className="h-4 w-4" />
                    <span>5. Topic Laboratories</span>
                  </button>
                )}
              </div>
            </div>

            {/* ========================================================================= */}
            {/* SUB-TAB 1: COURSE MODULES & NOTES (Only for Selected Subject)             */}
            {/* ========================================================================= */}
            {subjectTab === "modules" && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-rule pb-3">
                  <h3 className="font-serif text-2xl font-bold text-ink">
                    {selectedSubject === "CSC602"
                      ? "CNS Syllabus Modules (CSC602 · M1 to M6)"
                      : selectedSubject === "ITC504"
                      ? "Web Programming Syllabus Modules (ITC504 · WP-M1 to WP-M6)"
                      : `${activeSubjectInfo.name} Syllabus Units (${activeSubjectInfo.code})`}
                  </h3>
                  <span className="font-mono text-xs text-ink-soft">
                    Access step-by-step interactive theory, classroom slides, and module quizzes
                  </span>
                </div>

                {/* CSC602 Modules */}
                {selectedSubject === "CSC602" && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {cnsCourseModules.map((mod) => {
                      const Icon = mod.icon
                      return (
                        <div
                          key={mod.id}
                          className="p-6 bg-card border border-ink shadow-[4px_4px_0_var(--rule)] hover:shadow-[6px_6px_0_var(--signal)] hover:border-signal transition-all flex flex-col justify-between"
                        >
                          <div>
                            <div className="flex items-center justify-between mb-3">
                              <span className="px-2 py-0.5 bg-ink text-paper font-mono text-xs font-bold">
                                {mod.code}
                              </span>
                              <div className="flex items-center gap-1.5 font-mono text-[10px]">
                                <span className="px-1.5 py-0.5 bg-paper border border-rule text-ink-soft">
                                  {mod.hours}
                                </span>
                                <span className="px-1.5 py-0.5 bg-signal/10 border border-signal/30 text-signal font-bold">
                                  {mod.bloom}
                                </span>
                              </div>
                            </div>

                            <h4 className="font-serif text-xl font-bold text-ink mb-2">
                              {mod.title}
                            </h4>
                            <p className="font-sans text-xs text-ink-soft leading-relaxed mb-4">
                              {mod.desc}
                            </p>

                            <div className="space-y-1 mb-5 font-mono text-[11px]">
                              {mod.keyTopics.map((topic) => (
                                <div key={topic} className="flex items-center gap-1.5 text-ink">
                                  <span className="text-signal">■</span>
                                  <span>{topic}</span>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div className="pt-4 border-t border-rule flex flex-wrap items-center justify-between gap-2 font-mono text-xs uppercase">
                            <Link
                              href={`/modules/${mod.id}`}
                              className="px-3.5 py-2 bg-ink hover:bg-signal text-paper font-bold transition-colors flex items-center gap-1 shadow-xs"
                            >
                              <span>Open Theory</span>
                              <ArrowRight className="h-3 w-3" />
                            </Link>

                            <Link
                              href={`/present/${mod.code.toLowerCase()}/${mod.primaryTopic}`}
                              className="px-2.5 py-2 border border-rule hover:border-ink bg-paper text-ink transition-colors flex items-center gap-1 text-[11px]"
                            >
                              <Presentation className="h-3 w-3 text-signal" />
                              <span>[P] Slides</span>
                            </Link>

                            <Link
                              href={`/quiz/${mod.code.toLowerCase()}/play`}
                              className="px-2.5 py-2 border border-rule hover:border-signal bg-paper text-signal transition-colors text-[11px] font-bold"
                            >
                              Quiz →
                            </Link>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}

                {/* ITC504 Modules */}
                {selectedSubject === "ITC504" && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {wpCourseModules.map((mod) => {
                      const Icon = mod.icon
                      return (
                        <div
                          key={mod.id}
                          className="p-6 bg-card border border-ink shadow-[4px_4px_0_var(--rule)] hover:shadow-[6px_6px_0_var(--signal)] hover:border-signal transition-all flex flex-col justify-between"
                        >
                          <div>
                            <div className="flex items-center justify-between mb-3">
                              <span className="px-2 py-0.5 bg-ink text-paper font-mono text-xs font-bold">
                                {mod.code}
                              </span>
                              <div className="flex items-center gap-1.5 font-mono text-[10px]">
                                <span className="px-1.5 py-0.5 bg-paper border border-rule text-ink-soft">
                                  {mod.hours}
                                </span>
                                <span className="px-1.5 py-0.5 bg-signal/10 border border-signal/30 text-signal font-bold">
                                  {mod.bloom}
                                </span>
                              </div>
                            </div>

                            <h4 className="font-serif text-xl font-bold text-ink mb-2">
                              {mod.title}
                            </h4>
                            <p className="font-sans text-xs text-ink-soft leading-relaxed mb-4">
                              {mod.desc}
                            </p>

                            <div className="space-y-1 mb-5 font-mono text-[11px]">
                              {mod.keyTopics.map((topic) => (
                                <div key={topic} className="flex items-center gap-1.5 text-ink">
                                  <span className="text-signal">■</span>
                                  <span>{topic}</span>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div className="pt-4 border-t border-rule flex flex-wrap items-center justify-between gap-2 font-mono text-xs uppercase">
                            <Link
                              href={`/modules/${mod.id}`}
                              className="px-3.5 py-2 bg-ink hover:bg-signal text-paper font-bold transition-colors flex items-center gap-1 shadow-xs"
                            >
                              <span>Open Theory</span>
                              <ArrowRight className="h-3 w-3" />
                            </Link>

                            <Link
                              href={`/present/${mod.code.toLowerCase()}/${mod.primaryTopic}`}
                              className="px-2.5 py-2 border border-rule hover:border-ink bg-paper text-ink transition-colors flex items-center gap-1 text-[11px]"
                            >
                              <Presentation className="h-3 w-3 text-signal" />
                              <span>[P] Slides</span>
                            </Link>

                            <Link
                              href={`/quiz/${mod.code.toLowerCase()}/play`}
                              className="px-2.5 py-2 border border-rule hover:border-signal bg-paper text-signal transition-colors text-[11px] font-bold"
                            >
                              Quiz →
                            </Link>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}

                {/* Other 4 Subjects Syllabus Units */}
                {selectedSubject !== "CSC602" && selectedSubject !== "ITC504" && OTHER_SUBJECTS_DETAILS[selectedSubject] && (
                  <div className="space-y-6">
                    <div className="p-4 bg-paper border border-rule">
                      <p className="font-sans text-xs text-ink-soft leading-relaxed">
                        {OTHER_SUBJECTS_DETAILS[selectedSubject].description}
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {OTHER_SUBJECTS_DETAILS[selectedSubject].units.map((unit) => (
                        <div
                          key={unit.code}
                          className="p-6 bg-card border border-rule hover:border-ink transition-colors space-y-3"
                        >
                          <div className="flex items-center justify-between">
                            <span className="px-2 py-0.5 bg-ink text-paper font-mono text-xs font-bold">
                              {unit.code}
                            </span>
                            <span className="font-mono text-[10px] text-ink-soft">Autonomous Scheme</span>
                          </div>

                          <h4 className="font-serif text-lg font-bold text-ink">
                            {unit.title}
                          </h4>
                          <p className="font-sans text-xs text-ink-soft leading-relaxed">
                            {unit.desc}
                          </p>

                          <div className="pt-2 border-t border-rule space-y-1 font-mono text-[11px] text-ink">
                            {unit.topics.map((t) => (
                              <div key={t} className="flex items-center gap-1.5">
                                <span className="text-signal">■</span>
                                <span>{t}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ========================================================================= */}
            {/* SUB-TAB 2: QUIZZES & ASSESSMENTS (Only for Selected Subject)              */}
            {/* ========================================================================= */}
            {subjectTab === "quizzes" && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-rule pb-3">
                  <h3 className="font-serif text-2xl font-bold text-ink">
                    Quizzes &amp; Mock Exams · {activeSubjectInfo.name} ({activeSubjectInfo.code})
                  </h3>
                  <span className="font-mono text-xs text-ink-soft">
                    Module-wise practice tests &amp; full syllabus examination
                  </span>
                </div>

                {/* CSC602 Quizzes */}
                {selectedSubject === "CSC602" && (
                  <div className="space-y-6">
                    {/* Full Syllabus Mock Banner */}
                    <div className="p-6 bg-card border-2 border-ink shadow-[4px_4px_0_var(--ink)] flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 bg-signal text-paper font-mono text-xs font-bold uppercase">
                            Full Syllabus Mock
                          </span>
                          <span className="font-mono text-xs text-ink-soft">
                            Mumbai University Pattern · 45 Questions · 45 Min
                          </span>
                        </div>
                        <h4 className="font-serif text-2xl font-bold text-ink">
                          Comprehensive CSC602 Examination
                        </h4>
                        <p className="font-sans text-xs text-ink-soft max-w-xl">
                          Covers all 6 syllabus modules (M1 to M6) with timer scoring, distractor explanations, and Bloom's analytics.
                        </p>
                      </div>

                      <button
                        onClick={() => router.push("/quiz/all/play")}
                        className="px-6 py-3.5 bg-signal text-paper hover:bg-ink transition-colors font-mono text-xs uppercase font-bold tracking-wider shrink-0 shadow-[2px_2px_0_var(--ink)] cursor-pointer"
                      >
                        Launch CNS Mock Exam (45 Qs) →
                      </button>
                    </div>

                    {/* Module-Wise Quiz Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {cnsCourseModules.map((mod) => (
                        <div key={mod.id} className="p-5 border border-rule bg-card hover:border-ink transition-colors flex flex-col justify-between">
                          <div>
                            <div className="flex justify-between items-center mb-2 font-mono text-xs">
                              <span className="px-1.5 py-0.5 bg-paper border border-ink text-signal font-bold">{mod.code}</span>
                              <span className="text-ink-soft">{mod.bloom}</span>
                            </div>
                            <h5 className="font-serif text-base font-bold text-ink mb-1">{mod.title}</h5>
                            <p className="font-sans text-xs text-ink-soft mb-3">{mod.desc}</p>
                          </div>
                          <button
                            onClick={() => router.push(`/quiz/${mod.code.toLowerCase()}/play`)}
                            className="w-full py-2 bg-ink text-paper hover:bg-signal font-mono text-xs uppercase font-bold transition-colors shadow-xs"
                          >
                            Start {mod.code} Quiz →
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* ITC504 Quizzes */}
                {selectedSubject === "ITC504" && (
                  <div className="space-y-6">
                    {/* Full Syllabus Mock Banner */}
                    <div className="p-6 bg-card border-2 border-ink shadow-[4px_4px_0_var(--ink)] flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 bg-signal text-paper font-mono text-xs font-bold uppercase">
                            Full Syllabus Exam
                          </span>
                          <span className="font-mono text-xs text-ink-soft">
                            Web Engineering · 30 Questions · 30 Min
                          </span>
                        </div>
                        <h4 className="font-serif text-2xl font-bold text-ink">
                          Comprehensive ITC504 Examination
                        </h4>
                        <p className="font-sans text-xs text-ink-soft max-w-xl">
                          Covers HTML5/CSS3, JavaScript ES6+, React &amp; Next.js, Node.js, PHP &amp; MySQL, and full-stack security.
                        </p>
                      </div>

                      <button
                        onClick={() => router.push("/quiz/wp-all/play")}
                        className="px-6 py-3.5 bg-signal text-paper hover:bg-ink transition-colors font-mono text-xs uppercase font-bold tracking-wider shrink-0 shadow-[2px_2px_0_var(--ink)] cursor-pointer"
                      >
                        Launch WP Full Exam (30 Qs) →
                      </button>
                    </div>

                    {/* Module-Wise Quiz Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {wpCourseModules.map((mod) => (
                        <div key={mod.id} className="p-5 border border-rule bg-card hover:border-ink transition-colors flex flex-col justify-between">
                          <div>
                            <div className="flex justify-between items-center mb-2 font-mono text-xs">
                              <span className="px-1.5 py-0.5 bg-paper border border-ink text-signal font-bold">{mod.code}</span>
                              <span className="text-ink-soft">{mod.bloom}</span>
                            </div>
                            <h5 className="font-serif text-base font-bold text-ink mb-1">{mod.title}</h5>
                            <p className="font-sans text-xs text-ink-soft mb-3">{mod.desc}</p>
                          </div>
                          <button
                            onClick={() => router.push(`/quiz/${mod.code.toLowerCase()}/play`)}
                            className="w-full py-2 bg-ink text-paper hover:bg-signal font-mono text-xs uppercase font-bold transition-colors shadow-xs"
                          >
                            Start {mod.code} Quiz →
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Other Subjects Quizzes */}
                {selectedSubject !== "CSC602" && selectedSubject !== "ITC504" && (
                  <div className="p-8 bg-card border border-rule text-center space-y-3 font-mono">
                    <Award className="h-8 w-8 text-signal mx-auto" />
                    <h4 className="font-serif text-xl font-bold text-ink">Question Bank &amp; Practice Sets</h4>
                    <p className="font-sans text-xs text-ink-soft max-w-md mx-auto">
                      Unit-by-unit practice question banks and previous year university papers for {activeSubjectInfo.name} are accessible in the department library.
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* ========================================================================= */}
            {/* SUB-TAB 3: MY MARKS & EVALUATION (Only for Selected Subject)              */}
            {/* ========================================================================= */}
            {subjectTab === "marks" && (
              <div className="space-y-6">
                <StudentMarksView
                  isFaculty={false}
                  currentStudentRoll={student.rollNo}
                  filterSubjectCode={selectedSubject}
                />
              </div>
            )}

            {/* ========================================================================= */}
            {/* SUB-TAB 4: PORTION TIMELINE & SCHEDULE (Only for Selected Subject)        */}
            {/* ========================================================================= */}
            {subjectTab === "timeline" && (
              <div className="space-y-6">
                {selectedSubject === "CSC602" ? (
                  <AcademicTimelineView isEditable={false} />
                ) : (
                  <div className="p-6 bg-card border border-ink space-y-4">
                    <div className="flex items-center gap-2 border-b border-rule pb-3">
                      <Calendar className="h-5 w-5 text-signal" />
                      <h4 className="font-serif text-xl font-bold text-ink">
                        {activeSubjectInfo.name} · Academic Milestones
                      </h4>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono text-xs">
                      <div className="p-4 border border-rule bg-paper">
                        <span className="text-[10px] text-ink-soft uppercase font-bold block mb-1">In-Semester Exam 1</span>
                        <strong className="text-sm text-ink block">Feb 24, 2026</strong>
                        <span className="text-ok text-[11px]">Units M1 &amp; M2</span>
                      </div>
                      <div className="p-4 border border-rule bg-paper">
                        <span className="text-[10px] text-ink-soft uppercase font-bold block mb-1">Formative Assessment 1</span>
                        <strong className="text-sm text-ink block">March 10, 2026</strong>
                        <span className="text-signal text-[11px]">Unit M3 Hands-On Lab</span>
                      </div>
                      <div className="p-4 border border-rule bg-paper">
                        <span className="text-[10px] text-ink-soft uppercase font-bold block mb-1">Final Term Work Submission</span>
                        <strong className="text-sm text-ink block">April 24, 2026</strong>
                        <span className="text-ink text-[11px]">All 6 Units Journal</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ========================================================================= */}
            {/* SUB-TAB 5: TOPIC LABORATORIES (For Active Lab Subjects)                   */}
            {/* ========================================================================= */}
            {subjectTab === "simulators" && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-rule pb-3">
                  <h3 className="font-serif text-2xl font-bold text-ink">
                    Interactive Laboratories &amp; Simulators · {activeSubjectInfo.code}
                  </h3>
                  <span className="font-mono text-xs text-ink-soft">
                    Hands-on algorithm playgrounds, parameter builders &amp; attack spotters
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {(selectedSubject === "CSC602" ? cnsSimulators : wpSimulators).map((lab) => {
                    const Icon = lab.icon
                    return (
                      <Link
                        key={lab.href}
                        href={lab.href}
                        className="p-5 bg-card border border-rule hover:border-ink hover:shadow-[4px_4px_0_var(--signal)] transition-all flex flex-col justify-between group"
                      >
                        <div>
                          <div className="flex items-center justify-between mb-3">
                            <div className="p-2 border border-rule bg-paper text-signal">
                              <Icon className="h-5 w-5" />
                            </div>
                            <span className="font-mono text-[9px] uppercase px-1.5 py-0.5 border border-rule text-ink-soft font-bold">
                              Lab
                            </span>
                          </div>

                          <h4 className="font-serif text-base font-bold text-ink mb-1 group-hover:text-signal transition-colors">
                            {lab.label}
                          </h4>
                          <p className="font-sans text-xs text-ink-soft leading-relaxed">
                            {lab.sub}
                          </p>
                        </div>

                        <div className="pt-3 border-t border-rule mt-4 flex items-center justify-between font-mono text-xs text-signal font-bold">
                          <span>Launch Simulator</span>
                          <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
                        </div>
                      </Link>
                    )
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
