"use client"

import React, { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import {
  Key,
  Lock,
  Network,
  FileKey2,
  ArrowRight,
  Presentation,
  Cpu,
  Terminal,
  Layers,
  Server,
  Database,
  Globe,
  Sparkles,
  ShieldAlert,
  Flame,
  BookOpen
} from "lucide-react"

interface ModuleCardItem {
  id: string
  code: string
  title: string
  hours: string
  bloom: string
  icon: React.ComponentType<{ className?: string }>
  desc: string
  primaryTopic: string
  keyTopics: string[]
}

const CNS_MODULES: ModuleCardItem[] = [
  {
    id: "classical",
    code: "M1",
    title: "Introduction & Classical Cryptography",
    hours: "5 hrs",
    bloom: "Bloom L1–L3",
    icon: Key,
    desc: "OSI security architecture (X.800), symmetric cipher model, Caesar, Affine, Playfair 5x5, Vigenère, Hill matrix inversion, and transposition ciphers.",
    primaryTopic: "caesar",
    keyTopics: ["OSI X.800", "Caesar & Affine", "Playfair 5x5", "Hill Matrix", "Vigenère"]
  },
  {
    id: "block-public-key",
    code: "M2",
    title: "Block Ciphers & Public Key Cryptography",
    hours: "8 hrs",
    bloom: "Bloom L1–L3",
    icon: Cpu,
    desc: "Feistel design principles, cipher modes (ECB, CBC, CFB, OFB, CTR), DES 16-round breakdown, AES SPN layers, RSA BigInt, ECC curves, and Diffie-Hellman key exchange.",
    primaryTopic: "des",
    keyTopics: ["Feistel Network", "DES & AES", "RSA Math", "Diffie-Hellman", "ECC Curves"]
  },
  {
    id: "hash-signatures",
    code: "M3",
    title: "Cryptographic Hashes & Digital Signatures",
    hours: "7 hrs",
    bloom: "Bloom L1–L4",
    icon: Lock,
    desc: "Cryptographic hash properties, MD5 vs SHA-256 Merkle-Damgård construction, Birthday Paradox bounds, HMAC RFC 2104, digital signatures, and X.509 PKI trust chains.",
    primaryTopic: "mac-hmac",
    keyTopics: ["Hash Properties", "HMAC Padding", "SHA-256 Engine", "Digital Signatures", "X.509 PKI"]
  },
  {
    id: "computing-resources",
    code: "M4",
    title: "Protection of Computing Resources & System Security",
    hours: "8 hrs",
    bloom: "Bloom L1–L3",
    icon: Terminal,
    desc: "Access control matrices, Discretionary vs Mandatory vs RBAC, Bell-LaPadula vs Biba, Buffer Overflow stack canaries & DEP/NX, and WebAuthn MFA.",
    primaryTopic: "software-vulnerabilities",
    keyTopics: ["Stack Canaries", "Buffer Overflow", "Bell-LaPadula", "RBAC Access", "WebAuthn MFA"]
  },
  {
    id: "network-security",
    code: "M5",
    title: "Network Security & Defense",
    hours: "10 hrs",
    bloom: "Bloom L1–L4",
    icon: Network,
    desc: "TCP/IP vulnerabilities, ARP/IP/DNS spoofing, SYN flood mitigation via RFC 4987 SYN Cookies, stateless 5-tuple ACLs, stateful conntrack firewalls, and Snort IDS.",
    primaryTopic: "layer-vulnerabilities",
    keyTopics: ["ARP / DNS Spoofing", "SYN Cookies", "Stateful Firewalls", "Snort IDS", "Zero Trust"]
  },
  {
    id: "security-applications",
    code: "M6",
    title: "Network Security Applications & Emerging Threats",
    hours: "7 hrs",
    bloom: "Bloom L1–L4",
    icon: FileKey2,
    desc: "Kerberos v5 ticket-granting workflow, SSL/TLS 1.2 vs 1.3 protocol architecture, IPsec AH & ESP packet dissector, OpenPGP 5-step pipeline, and AI security.",
    primaryTopic: "kerberos",
    keyTopics: ["Kerberos v5", "TLS 1.3 1-RTT", "IPsec AH & ESP", "PGP Hybrid", "AI Security"]
  }
]

const WP_MODULES: ModuleCardItem[] = [
  {
    id: "wp-fundamentals",
    code: "WP-M1",
    title: "Web Tech Fundamentals, HTML5 & CSS3",
    hours: "8 hrs",
    bloom: "Bloom L1–L3, L6",
    icon: Layers,
    desc: "Client-server architecture, HTTP request-response cycle, HTML5 semantic layout, multimedia canvas, CSS Box Model calculation, Flexbox 1D, and CSS Grid 2D.",
    primaryTopic: "web-arch-http",
    keyTopics: ["HTTP Protocol", "HTML5 Semantics", "CSS Box Model", "Flexbox 1D", "CSS Grid 2D"]
  },
  {
    id: "wp-javascript",
    code: "WP-M2",
    title: "JavaScript & Modern Client-Side",
    hours: "8 hrs",
    bloom: "Bloom L1–L3, L6",
    icon: Terminal,
    desc: "Single-threaded non-blocking runtime, scoping (var/let/const), DOM event bubbling & delegation, ES6+ arrow functions/destructuring, and the Event Loop.",
    primaryTopic: "js-core-scoping",
    keyTopics: ["Scoping & Closures", "DOM Bubbling", "ES6 Destructuring", "Event Loop", "Promises & Async"]
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
    keyTopics: ["Virtual DOM", "React Hooks", "Next.js App Router", "SSR vs SSG", "ISR"]
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
    keyTopics: ["libuv Architecture", "Express Middleware", "RESTful CRUD", "Status Codes", "Error Pipeline"]
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
    keyTopics: ["PHP Superglobals", "session_start()", "PDO Prepared", "SQLi Immunity", "password_hash()"]
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
    keyTopics: ["3-Tier Separation", "CORS Preflight", "Stateless JWT", "Git Branching", "OWASP Top 10"]
  }
]

const DEEP_DIVE_TOPICS = [
  { href: "/modules/crypto", label: "Cryptography Lab", sub: "Caesar, Vigenère, RSA, SHA-256", icon: Key },
  { href: "/modules/auth", label: "Authentication Lab", sub: "Salt/Hash, MFA, Biometrics, Replay", icon: Lock },
  { href: "/modules/firewall", label: "Firewall Lab", sub: "Packet Filters, Stateful Conntrack, DMZ", icon: Network },
  { href: "/modules/attacks", label: "Web Attacks Lab", sub: "XSS, SQL Injection, CSRF, MITM, DDoS", icon: ShieldAlert },
  { href: "/modules/ids", label: "IDS & IPS Lab", sub: "Signature, Anomaly, Snort Rule Engine", icon: Terminal },
  { href: "/modules/tls", label: "SSL / TLS Lab", sub: "Handshake Flights, Cipher Suites, 1-RTT", icon: FileKey2 },
  { href: "/modules/cloud", label: "Cloud Security Lab", sub: "Shared Responsibility, IAM, S3 Buckets", icon: Server },
  { href: "/modules/ai", label: "AI Security Lab", sub: "Adversarial Evasion, Model Poisoning, ML", icon: Sparkles }
]

export default function ModulesDirectoryPage() {
  const [selectedSubject, setSelectedSubject] = useState<'CSC602' | 'ITC504'>('CSC602')

  const activeModules = selectedSubject === 'CSC602' ? CNS_MODULES : WP_MODULES

  return (
    <div className="min-h-screen bg-paper py-8 px-4 sm:px-6">
      <div className="max-w-6xl w-full mx-auto space-y-10">
        {/* Top Header */}
        <div className="border-b-2 border-ink pb-6 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
          <div>
            <div className="flex items-center gap-3">
              <span className="font-mono text-xs uppercase tracking-widest text-signal font-bold">
                TCET LMS · Academic Curriculum
              </span>
              <span className="font-mono text-[10px] px-1.5 py-0.5 border border-rule text-ink-soft">
                {selectedSubject === 'CSC602' ? 'CSC602 · Sem VI · 45 Hours' : 'ITC504 · Sem V · 45 Hours'}
              </span>
            </div>
            <h1 className="font-serif text-3xl sm:text-5xl text-ink font-bold mt-1">
              Course Modules &amp; Theory Notes
            </h1>
            <p className="font-sans text-xs sm:text-sm text-ink-soft mt-1 max-w-2xl leading-relaxed">
              Explore step-by-step interactive theory lessons, live visual simulators, computational complexity analysis,
              and authentic university question bank quizzes.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/quiz"
              className="px-4 py-2 bg-ink text-paper hover:bg-signal font-mono text-xs uppercase font-bold tracking-wider transition-colors shadow-[2px_2px_0_var(--rule)]"
            >
              <span>Quiz Challenge →</span>
            </Link>
          </div>
        </div>

        {/* Subject Switcher Pill Bar */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-mono text-xs text-ink-soft uppercase font-bold mr-1">
            Choose Course:
          </span>
          <button
            onClick={() => setSelectedSubject('CSC602')}
            className={`px-4 py-2 font-mono text-xs uppercase font-bold border transition-all cursor-pointer ${
              selectedSubject === 'CSC602'
                ? "bg-signal text-paper border-signal shadow-[2px_2px_0_var(--ink)]"
                : "bg-paper text-ink border-rule hover:border-ink"
            }`}
          >
            CSC602: Cryptography &amp; Network Security
          </button>
          <button
            onClick={() => setSelectedSubject('ITC504')}
            className={`px-4 py-2 font-mono text-xs uppercase font-bold border transition-all cursor-pointer ${
              selectedSubject === 'ITC504'
                ? "bg-signal text-paper border-signal shadow-[2px_2px_0_var(--ink)]"
                : "bg-paper text-ink border-rule hover:border-ink"
            }`}
          >
            ITC504: Web Programming &amp; Applications
          </button>
        </div>

        {/* Main 6 Modules Grid */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-2xl font-bold text-ink">
              {selectedSubject === 'CSC602'
                ? "Accredited CNS Syllabus Modules (M1 – M6)"
                : "Accredited Web Programming Modules (WP-M1 – WP-M6)"}
            </h2>
            <span className="font-mono text-xs text-ink-soft">
              6 Modules · Full Scrollytelling &amp; Simulators
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeModules.map((module) => {
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

                  {/* Direct Action Buttons */}
                  <div className="pt-4 border-t border-rule flex items-center justify-between gap-2 text-xs font-mono uppercase tracking-wider">
                    <Link
                      href={`/modules/${module.id}`}
                      className="px-3.5 py-2 bg-ink hover:bg-signal text-paper transition-colors font-bold flex items-center gap-1 text-xs shadow-xs"
                    >
                      <span>Open Theory</span>
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
        </div>

        {/* Deep-Dive Security Simulators (Direct Access to 8 Core Topics) */}
        {selectedSubject === 'CSC602' && (
          <div className="pt-6 border-t border-rule space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-serif text-xl font-bold text-ink">
                  Direct Topic Laboratories (8 Guided Modules)
                </h3>
                <p className="text-xs text-ink-soft font-mono">
                  Deep-dive simulators with step-by-step guided lessons, complexity analysis, and numerical tools.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {DEEP_DIVE_TOPICS.map((topic) => {
                const Icon = topic.icon
                return (
                  <Link
                    key={topic.href}
                    href={topic.href}
                    className="p-4 bg-card border border-rule hover:border-ink hover:shadow-[3px_3px_0_var(--signal)] transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <Icon className="h-4 w-4 text-signal" />
                        <span className="font-mono text-[9px] uppercase px-1 border border-rule text-ink-soft">Lab</span>
                      </div>
                      <h4 className="font-serif text-sm font-bold text-ink mb-1">
                        {topic.label}
                      </h4>
                      <p className="font-sans text-[11px] text-ink-soft line-clamp-2">
                        {topic.sub}
                      </p>
                    </div>
                    <span className="text-[10px] font-mono uppercase text-signal font-bold mt-3 block">
                      Launch Lab →
                    </span>
                  </Link>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
