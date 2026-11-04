"use client"

import React, { useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { ModuleId, getModule } from "@/lib/syllabus"
import { Presentation, ArrowRight, Lightbulb, ShieldCheck, AlertCircle, BookMarked, Lock, CheckCircle2, Clock, BookOpen, Layers } from "lucide-react"
import { useAcademicStore } from "@/lib/academicStore"
import { GuidedLesson, LessonStepType } from "@/components/layout/GuidedLesson"
import { cryptoLessonSteps, cryptoLessonDiagrams } from "@/modules/crypto/Learn"
import { authLessonSteps, authLessonDiagrams } from "@/modules/auth/Learn"
import { tlsLessonSteps, tlsLessonDiagrams } from "@/modules/tls/Learn"
import { attacksLessonSteps, attacksLessonDiagrams } from "@/modules/attacks/Learn"
import { firewallLessonSteps, firewallLessonDiagrams } from "@/modules/firewall/Learn"
import { idsLessonSteps, idsLessonDiagrams } from "@/modules/ids/Learn"

const MODULE_GUIDED_LESSONS: Record<ModuleId, {
  steps: LessonStepType[]
  diagrams: Record<string, React.FC<{ activeSubStep: number }>>
}> = {
  m1: { steps: cryptoLessonSteps, diagrams: cryptoLessonDiagrams },
  m2: { steps: authLessonSteps, diagrams: authLessonDiagrams },
  m3: { steps: tlsLessonSteps, diagrams: tlsLessonDiagrams },
  m4: { steps: attacksLessonSteps, diagrams: attacksLessonDiagrams },
  m5: { steps: firewallLessonSteps, diagrams: firewallLessonDiagrams },
  m6: { steps: idsLessonSteps, diagrams: idsLessonDiagrams },
}

const MODULE_DEEP_DIVES: Record<ModuleId, {
  analogy: string
  mechanics: string
  examAnswer: string
  watchOut: string
}> = {
  m1: {
    analogy: "Classical cryptography is like secret codes in ancient diplomacy. Caesar shifted the alphabet; Playfair substituted letter pairs to disguise single-letter frequencies; and Transposition shuffled the physical order of letters like rearranging tiles.",
    mechanics: "Substitution replaces plaintext symbols with ciphertext symbols while maintaining their positional sequence. Transposition rearranges symbol positions without altering their identities. Product ciphers alternate substitution (confusion) and transposition (diffusion) to defeat frequency cryptanalysis.",
    examAnswer: "Classical cryptography comprises symmetric substitution (Caesar, Affine, Playfair, Vigenère, Hill) and transposition ciphers, analyzed under Kerckhoffs's Principle via frequency analysis, Kasiski examination, and the Index of Coincidence.",
    watchOut: "Never assume a monoalphabetic cipher is secure just because 26! is huge. Frequency analysis breaks monoalphabetic substitution in seconds because natural letter frequencies are fully preserved."
  },
  m2: {
    analogy: "A Feistel block cipher is like a two-chamber lock where only half the block is scrambled at each step, making the lock reversible without inverting the scrambling function. Public-key cryptography is like a street mailbox with a drop slot (public key) that only the mail carrier's physical key (private key) can open.",
    mechanics: "Symmetric block ciphers (DES, AES) operate on fixed blocks (64 or 128 bits) across iterated substitution-permutation rounds. Public-key systems (RSA, ECC, Diffie-Hellman) rely on mathematically intractable trapdoor one-way problems: prime factorization, discrete logarithms, and elliptic curve point multiplication.",
    examAnswer: "Modern block ciphers (AES, DES) utilize Feistel or SPN structures with modes of operation (ECB, CBC, CFB, OFB, CTR). Public-key cryptosystems enable secure key distribution and asymmetric encryption based on computational hardness assumptions.",
    watchOut: "ECB mode must never be used for multi-block data because identical plaintext blocks always encrypt to identical ciphertext blocks, preserving visual and statistical patterns."
  },
  m3: {
    analogy: "A cryptographic hash is like a digital blender: you drop in any file, and it produces a unique fixed-length puree. You can never reconstitute the fruit from the puree, and changing a single seed changes the entire color (the avalanche effect). A digital signature is a notarized wax seal that proves only the author could have stamped it.",
    mechanics: "Hash functions map arbitrary-length inputs to fixed-size outputs (e.g., 256 bits for SHA-256) satisfying pre-image, second pre-image, and collision resistance. HMACs construct secure message authentication codes via nested hashing. Digital signatures combine hashing with asymmetric private-key signing (RSA or ECDSA).",
    examAnswer: "Cryptographic hash functions provide data integrity and pseudo-randomness. HMACs guarantee message origin authentication. Digital signatures (hash-then-sign paradigm) ensure non-repudiation, authenticity, and integrity, backed by X.509 PKI trust hierarchies.",
    watchOut: "A MAC is NOT a digital signature. MACs use symmetric shared keys and cannot provide non-repudiation because both sender and receiver possess the secret key."
  },
  m4: {
    analogy: "A buffer overflow is like pouring 12 ounces of water into an 8-ounce glass: the excess water spills onto the counter and ruins the paperwork underneath (the saved return pointer on the stack). Access control is the bouncer checking security clearances (Bell-LaPadula: no read up, no write down).",
    mechanics: "In C/C++, writing beyond allocated array bounds overwrites adjacent stack frame memory (saved EBP, EIP), redirecting execution flow to injected shellcode or ROP gadgets. Defenses include stack canaries, ASLR, and DEP/NX. Access control enforces DAC, MAC, or RBAC security policies.",
    examAnswer: "Protection of computing resources addresses memory corruption vulnerabilities (stack buffer overflow), malicious code classification (viruses, worms, trojans), formal access control models (Bell-LaPadula confidentiality, Biba integrity), and multi-factor authentication conforming to NIST SP 800-63B.",
    watchOut: "ASLR alone does not stop buffer overflows. Attackers use NOP sleds or brute force. Defense-in-depth requires combining ASLR + DEP/NX + Stack Canaries simultaneously."
  },
  m5: {
    analogy: "Network security is protecting a highway where cars can paint any license plate on their bumper (IP spoofing) and flood the toll booths with empty trucks (SYN flood). Firewalls act as border security checkpoints, while IDS systems act as security cameras watching for suspicious patterns.",
    mechanics: "Standard TCP/IP protocols lack inherent cryptographic origin authentication, enabling packet sniffing in promiscuous mode, ARP spoofing, TCP SYN floods, and DNS cache poisoning. Defenses employ stateless 5-tuple ACLs, stateful conntrack firewalls, SYN cookies (zero memory allocation), signature/anomaly IDS, and Zero Trust microsegmentation.",
    examAnswer: "Network security identifies layer-wise vulnerabilities across the TCP/IP stack (ARP, IP, TCP, DNS) and enforces defense mechanisms including packet filtering firewalls, stateful inspection, TCP SYN cookies, Snort intrusion detection, and Zero Trust architectures.",
    watchOut: "Switched networks do not protect against eavesdropping. Attackers use ARP cache poisoning to trick switches into routing all traffic through their interface."
  },
  m6: {
    analogy: "Kerberos is like an amusement park ticket booth: you show your ID once to get a wristband (TGT), and you present the wristband to get ride passes (service tickets) without ever taking your wallet out again. TLS 1.3 is like an expedited border control lane that negotiates secret keys in a single round trip.",
    mechanics: "Kerberos v5 uses symmetric KDC cryptography (AS and TGS) with timestamped authenticators. SSL/TLS 1.3 optimizes handshakes to 1-RTT using mandatory (EC)DHE for forward secrecy. IPsec provides network-layer security via AH and ESP in transport or tunnel mode. PGP implements a 5-step hybrid pipeline for secure email. AI models classify NetFlow telemetry to automate threat responses.",
    examAnswer: "Network security applications encompass enterprise authentication (Kerberos v5), transport-layer security (TLS 1.3), network-layer VPNs (IPsec AH/ESP), hybrid encrypted messaging (PGP, S/MIME), and machine learning applications in anomaly detection and SOAR automation.",
    watchOut: "IPsec AH cannot be used through standard NAT routers because AH computes an integrity checksum over the IP header; when NAT translates the IP address, the checksum fails and drops all packets."
  }
}

export default function SyllabusLearn({ moduleId }: { moduleId: ModuleId }) {
  const mod = getModule(moduleId)
  const deepDive = MODULE_DEEP_DIVES[moduleId] || MODULE_DEEP_DIVES.m1
  const lesson = MODULE_GUIDED_LESSONS[moduleId]
  const { isTopicCompleted, isTopicUnlocked, moduleProgress } = useAcademicStore()
  const progress = moduleProgress[moduleId]

  if (!mod) return null

  return (
    <div className="space-y-10 max-w-5xl mx-auto">
      {/* 1. Module Overview Banner */}
      <Card className="border border-ink shadow-[4px_4px_0_var(--rule)] bg-card">
        <CardHeader className="border-b border-rule pb-4">
          <div className="flex flex-wrap items-center justify-between gap-2 font-mono text-[11px] mb-2">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 bg-ink text-paper font-bold">{mod.code}</span>
              <span className="text-signal font-bold uppercase">{mod.hours} Hours Total</span>
            </div>
            <span className="px-2 py-0.5 border border-signal/30 bg-signal/10 text-signal font-bold">
              {mod.bloomRange}
            </span>
          </div>
          <CardTitle className="font-serif text-2xl sm:text-3xl text-ink font-bold">
            {mod.title}
          </CardTitle>
          <p className="text-xs sm:text-sm text-ink-soft font-sans mt-2 leading-relaxed">
            {mod.description}
          </p>
        </CardHeader>

        <CardContent className="pt-4 flex flex-col sm:flex-row justify-between sm:items-center gap-3">
          <span className="font-mono text-xs text-ink-soft">
            {mod.topics.length} Syllabus Topics · Scrollytelling & Interactive Plates
          </span>
          <Link
            href={`/present/${mod.code.toLowerCase()}/${mod.topics[0]?.id || 'principles'}`}
            className="inline-flex items-center gap-2 px-3 py-1.5 bg-signal hover:bg-signal/90 text-paper font-mono uppercase tracking-wider text-xs font-bold shadow-[2px_2px_0_var(--ink)]"
          >
            <Presentation className="h-3.5 w-3.5" />
            <span>Launch Presentation Slides [P]</span>
          </Link>
        </CardContent>
      </Card>

      {/* 2. Interactive Guided Lesson with Scrollytelling & Diagrams */}
      {lesson && (
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-rule pb-2">
            <h3 className="font-serif text-xl sm:text-2xl font-bold text-ink flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-signal" />
              <span>Interactive Guided Theory Lessons</span>
            </h3>
            <span className="font-mono text-xs text-ink-soft">Step-by-step scrollytelling &amp; animations</span>
          </div>
          <GuidedLesson steps={lesson.steps} diagrams={lesson.diagrams} />
        </div>
      )}

      {/* 3. Structured Teaching Breakdown (Picture it -> See it -> Exam Definition) */}
      <div className="grid gap-4 sm:gap-6 grid-cols-1 md:grid-cols-2">
        {/* Card A: Picture it (Analogy) */}
        <Card className="border border-rule bg-card">
          <CardHeader className="pb-2">
            <div className="font-mono text-[11px] font-bold uppercase tracking-wider text-signal flex items-center gap-1.5">
              <Lightbulb className="h-3.5 w-3.5" />
              <span>1. Picture It (Intuitive Analogy)</span>
            </div>
          </CardHeader>
          <CardContent className="text-xs sm:text-sm text-ink-soft leading-relaxed font-sans">
            {deepDive.analogy}
          </CardContent>
        </Card>

        {/* Card B: See it work (Technical Mechanics) */}
        <Card className="border border-rule bg-card">
          <CardHeader className="pb-2">
            <div className="font-mono text-[11px] font-bold uppercase tracking-wider text-signal flex items-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>2. How It Works (Technical Mechanics)</span>
            </div>
          </CardHeader>
          <CardContent className="text-xs sm:text-sm text-ink-soft leading-relaxed font-sans">
            {deepDive.mechanics}
          </CardContent>
        </Card>

        {/* Card C: Say it in exam words */}
        <Card className="border border-rule bg-card">
          <CardHeader className="pb-2">
            <div className="font-mono text-[11px] font-bold uppercase tracking-wider text-ok flex items-center gap-1.5">
              <BookMarked className="h-3.5 w-3.5" />
              <span>3. University Exam Definition</span>
            </div>
          </CardHeader>
          <CardContent className="text-xs sm:text-sm text-ink leading-relaxed font-sans font-medium">
            &ldquo;{deepDive.examAnswer}&rdquo;
          </CardContent>
        </Card>

        {/* Card D: Watch Out */}
        <Card className="border border-rule bg-card">
          <CardHeader className="pb-2">
            <div className="font-mono text-[11px] font-bold uppercase tracking-wider text-bad flex items-center gap-1.5">
              <AlertCircle className="h-3.5 w-3.5" />
              <span>4. High-Risk Exam Trap</span>
            </div>
          </CardHeader>
          <CardContent className="text-xs sm:text-sm text-bad leading-relaxed font-sans font-medium">
            {deepDive.watchOut}
          </CardContent>
        </Card>
      </div>

      {/* 3. Syllabus Topics Roadmap & Progressive Unlock Status */}
      <div className="space-y-4 pt-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-rule pb-2">
          <div>
            <h3 className="font-serif text-xl sm:text-2xl font-bold text-ink">
              Official Syllabus Topics ({mod.topics.length})
            </h3>
            <p className="text-xs text-ink-soft font-mono">
              Portion Progress: Faculty covered up to Topic {progress?.completedUpTo ?? 0} · Notes unlocked up to Topic {progress?.unlockedUpTo ?? 0}
            </p>
          </div>
          <span className="font-mono text-xs text-ink-soft">Bloom Levels L1 to L4</span>
        </div>

        <div className="grid gap-3">
          {mod.topics.map((t, idx) => {
            const topicNum = idx + 1
            const isCompleted = isTopicCompleted(moduleId, topicNum)
            const isUnlocked = isTopicUnlocked(moduleId, topicNum)

            return (
              <div
                key={t.id}
                className={`p-4 border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                  !isUnlocked
                    ? "bg-paper/70 border-rule opacity-80"
                    : isCompleted
                    ? "bg-card border-ok/40 hover:border-ok shadow-xs"
                    : "bg-card border-rule hover:border-ink shadow-xs"
                }`}
              >
                <div className="space-y-1 max-w-xl">
                  <div className="flex flex-wrap items-center gap-2 font-mono text-[10px]">
                    <span className="font-bold text-ink">Part {topicNum}</span>
                    <span className="px-1.5 py-0.5 border border-rule bg-paper text-ink-soft">{t.hours} hrs</span>
                    <span className="px-1.5 py-0.5 border border-signal/30 bg-signal/10 text-signal font-bold">{t.bloom}</span>

                    {/* Progressive Unlock Badges */}
                    {isCompleted ? (
                      <span className="px-1.5 py-0.5 bg-ok/10 border border-ok/30 text-ok font-bold flex items-center gap-1">
                        <CheckCircle2 className="h-3 w-3" />
                        <span>Covered in Class</span>
                      </span>
                    ) : isUnlocked ? (
                      <span className="px-1.5 py-0.5 bg-signal/10 border border-signal/30 text-signal font-bold flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>Unlocked (Pre-Reading)</span>
                      </span>
                    ) : (
                      <span className="px-1.5 py-0.5 bg-card border border-rule text-ink-soft font-bold flex items-center gap-1">
                        <Lock className="h-3 w-3" />
                        <span>Locked by Faculty</span>
                      </span>
                    )}

                    {t.isSelfLearning && (
                      <span className="px-1.5 py-0.5 border border-ok/30 bg-ok/10 text-ok font-bold">[Self-Learning]</span>
                    )}
                  </div>
                  <h4 className="font-serif text-base sm:text-lg font-bold text-ink">
                    {t.title}
                  </h4>
                  <p className="text-xs text-ink-soft font-sans leading-relaxed">
                    {t.description}
                  </p>
                  {!isUnlocked && (
                    <p className="font-mono text-[11px] text-ink-soft italic pt-0.5">
                      🔒 Unlocks as teacher completes portion up to Part {Math.max(1, topicNum - 3)}.
                    </p>
                  )}
                </div>

                <div className="shrink-0 flex sm:flex-col items-center sm:items-end gap-2">
                  <Link
                    href={`/present/${mod.code.toLowerCase()}/${t.id}`}
                    className="px-3 py-1.5 border border-rule hover:border-signal bg-paper hover:bg-signal hover:text-paper text-ink transition-colors font-mono text-xs uppercase tracking-wider flex items-center gap-1.5 font-bold"
                  >
                    <Presentation className="h-3 w-3" />
                    <span>Slides [P]</span>
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

