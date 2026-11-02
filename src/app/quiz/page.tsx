"use client"

import React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/lib/authStore"
import { useMounted } from "@/hooks/useMounted"

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

const MODULE_QUIZZES: ModuleQuizItem[] = [
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

export default function ModuleQuizHub() {
  const router = useRouter()
  const mounted = useMounted()
  const { student, role } = useAuthStore()

  const isStudent = mounted && role === "student" && student

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
                6 Modules · 172 Question Bank
              </span>
            </div>
            <h1 className="font-serif text-3xl sm:text-5xl text-ink font-bold mt-1">
              Module-Wise Quiz Hub
            </h1>
            <p className="font-sans text-xs sm:text-sm text-ink-soft mt-1 max-w-2xl">
              Select any Mumbai University syllabus module (M1 through M6) to take a targeted assessment,
              or launch the comprehensive 45-question full syllabus mock test.
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
                  className="px-3 py-1.5 border border-rule hover:border-ink bg-card font-mono text-xs uppercase text-ink"
                >
                  Student Login →
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Full Syllabus Mock Exam Featured Banner */}
        <div className="p-6 bg-card border-2 border-ink shadow-[6px_6px_0_var(--ink)] flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 bg-signal text-paper font-mono text-xs font-bold uppercase tracking-wider">
                Full Syllabus
              </span>
              <span className="font-mono text-xs text-ink-soft font-semibold">
                University Mock Exam Simulation
              </span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-ink">
              Comprehensive Full Syllabus Test (45 Questions)
            </h2>
            <p className="font-sans text-xs sm:text-sm text-ink-soft max-w-2xl leading-relaxed">
              Standardized question distribution strictly weighted by Mumbai University syllabus teaching hours:
              5 from M1 · 8 from M2 · 7 from M3 · 8 from M4 · 10 from M5 · 7 from M6.
            </p>
          </div>

          <button
            onClick={() => router.push("/quiz/all/play")}
            className="px-6 py-3.5 bg-signal text-paper font-mono text-xs uppercase tracking-wider font-bold hover:bg-ink transition-colors shadow-[3px_3px_0_var(--ink)] shrink-0 w-full md:w-auto text-center"
          >
            Launch Full Syllabus Test →
          </button>
        </div>

        {/* 6 Module Cards Grid */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-xl font-bold text-ink">
              Individual Syllabus Modules (M1 – M6)
            </h3>
            <span className="font-mono text-xs text-ink-soft">
              Click any module to start its focused quiz
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {MODULE_QUIZZES.map(mod => (
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
                    onClick={() => router.push(`/quiz/${mod.id}/play`)}
                    className="px-4 py-2 bg-ink text-paper group-hover:bg-signal font-mono text-xs uppercase font-bold transition-colors shadow-[2px_2px_0_var(--rule)]"
                  >
                    Start {mod.code} Quiz →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Question Types Engine Strip */}
        <div className="p-6 bg-card border border-ink shadow-[4px_4px_0_var(--rule)] space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-rule pb-2">
            <h3 className="font-serif text-lg font-bold text-ink">
              Supported Question Types Engine
            </h3>
            <span className="font-mono text-xs text-ink-soft">
              Covering Bloom Cognitive Levels L1 (Remember) through L4 (Analyze)
            </span>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-9 gap-2 font-mono text-[11px] text-center">
            {[
              { type: 'mcq', label: 'MCQ Single' },
              { type: 'multi', label: 'Multi-Select' },
              { type: 'numeric', label: 'Numerical' },
              { type: 'order', label: 'Sequence' },
              { type: 'match', label: 'Pair Match' },
              { type: 'label', label: 'Diagram Pin' },
              { type: 'spot', label: 'Attack Spot' },
              { type: 'fill', label: 'Fill Blanks' },
              { type: 'tf-why', label: 'T/F Justify' }
            ].map(item => (
              <div key={item.type} className="p-2 border border-rule bg-paper">
                <span className="text-signal block font-bold uppercase">{item.type}</span>
                <span className="text-ink-soft text-[9px] block truncate">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
