"use client"

import React from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/Table"

export default function FormulaSheet() {
  const ciphers = [
    { name: "DES (Data Encryption Standard)", key: "56 bits (64b w/ parity)", block: "64 bits", rounds: "16 rounds", structure: "Feistel Network", status: "Broken (Brute-force in 1999)" },
    { name: "3DES (Triple DES - EDE)", key: "112 or 168 bits", block: "64 bits", rounds: "48 (16 × 3)", structure: "Feistel (Encrypt-Decrypt-Encrypt)", status: "Deprecated (Sweet32 64-bit collision)" },
    { name: "AES-128 (Rijndael)", key: "128 bits", block: "128 bits", rounds: "10 rounds", structure: "Substitution-Permutation Network (SPN)", status: "Industry Standard (NIST FIPS 197)" },
    { name: "AES-192", key: "192 bits", block: "128 bits", rounds: "12 rounds", structure: "Substitution-Permutation Network (SPN)", status: "NIST Top Secret Approved" },
    { name: "AES-256", key: "256 bits", block: "128 bits", rounds: "14 rounds", structure: "Substitution-Permutation Network (SPN)", status: "Post-Quantum Resilient (Grover 128b)" },
    { name: "Blowfish", key: "32 to 448 bits variable", block: "64 bits", rounds: "16 rounds", structure: "Feistel with Key-Dependent S-Boxes", status: "Legacy (Replaced by Twofish)" },
    { name: "RC5", key: "0 to 2040 bits variable", block: "32, 64, or 128 bits", rounds: "0 to 255 (std: 12)", structure: "Feistel with Data-Dependent Rotations", status: "Proprietary (Rivest / RSA Security)" },
    { name: "TEA (Tiny Encryption Algorithm)", key: "128 bits (4 × 32b words)", block: "64 bits (2 × 32b halves)", rounds: "32 cycles (64 Feistel)", structure: "Feistel with Golden Ratio δ constant", status: "IoT / Resource-Constrained (XTEA fixed)" },
  ]

  const hashes = [
    { name: "MD5", output: "128 bits (16 bytes)", block: "512 bits", rounds: "64 rounds (4 steps × 16)", structure: "Merkle-Damgård", collision: "Broken (Wang et al. 2004, Flame malware)" },
    { name: "SHA-1", output: "160 bits (20 bytes)", block: "512 bits", rounds: "80 rounds (4 steps × 20)", structure: "Merkle-Damgård", collision: "Broken (SHAttered attack 2017)" },
    { name: "SHA-224 / SHA-256", output: "224 / 256 bits", block: "512 bits", rounds: "64 rounds", structure: "Merkle-Damgård (Davis-Meyer)", collision: "Secure (Standard for TLS/Bitcoin)" },
    { name: "SHA-384 / SHA-512", output: "384 / 512 bits", block: "1024 bits", rounds: "80 rounds (64-bit words)", structure: "Merkle-Damgård", collision: "Secure (High security enterprise)" },
    { name: "SHA-3-256 (Keccak)", output: "256 bits", block: "Rate: 1088b, Capacity: 512b", rounds: "24 rounds (1600b state)", structure: "Sponge Construction (Absorb/Squeeze)", collision: "Secure (NIST FIPS 202 - Sponge)" },
    { name: "SHA-3-512 (Keccak)", output: "512 bits", block: "Rate: 576b, Capacity: 1024b", rounds: "24 rounds (1600b state)", structure: "Sponge Construction (Absorb/Squeeze)", collision: "Secure (NIST FIPS 202 - Maximum margin)" }
  ]

  return (
    <div className="space-y-10 max-w-5xl mx-auto py-4 sm:py-8 font-mono">
      {/* Header */}
      <div className="border-b border-rule pb-4">
        <span className="text-xs uppercase tracking-widest text-signal font-bold">University Formula Sheet</span>
        <h2 className="text-2xl sm:text-3xl font-serif text-ink font-bold mt-1">
          Cryptographic Algorithms, Key Sizes & Output Specifications
        </h2>
        <p className="text-xs sm:text-sm text-ink-soft font-sans mt-1">
          Strict parameters, block sizes, round counts, and exact mathematical derivations tested in exam papers.
        </p>
      </div>

      {/* Table 1: Symmetric Ciphers */}
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <h3 className="font-serif text-xl font-bold text-ink">
            1. Symmetric Block Ciphers Parameter Sheet
          </h3>
          <span className="text-xs text-ink-soft">DES · AES · Blowfish · RC5 · TEA</span>
        </div>

        <div className="overflow-x-auto border border-ink bg-card shadow-[4px_4px_0_var(--rule)]">
          <Table className="min-w-[700px] text-xs">
            <TableHeader className="bg-paper border-b border-ink">
              <TableRow className="hover:bg-transparent">
                <TableHead className="font-bold text-ink uppercase">Cipher</TableHead>
                <TableHead className="font-bold text-ink uppercase">Key Size</TableHead>
                <TableHead className="font-bold text-ink uppercase">Block Size</TableHead>
                <TableHead className="font-bold text-ink uppercase">Rounds</TableHead>
                <TableHead className="font-bold text-ink uppercase">Architecture</TableHead>
                <TableHead className="font-bold text-ink uppercase">Cryptanalytic Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {ciphers.map((c, i) => (
                <TableRow key={i} className="border-b border-rule hover:bg-paper">
                  <TableCell className="font-bold text-ink">{c.name}</TableCell>
                  <TableCell className="text-signal font-bold">{c.key}</TableCell>
                  <TableCell className="text-ink">{c.block}</TableCell>
                  <TableCell className="text-ink">{c.rounds}</TableCell>
                  <TableCell className="text-ink-soft">{c.structure}</TableCell>
                  <TableCell className="text-ink text-[11px]">{c.status}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Table 2: Cryptographic Hash Families */}
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <h3 className="font-serif text-xl font-bold text-ink">
            2. Cryptographic Hash Family Output & Collision Sheet
          </h3>
          <span className="text-xs text-ink-soft">MD5 · SHA-1 · SHA-2 · SHA-3</span>
        </div>

        <div className="overflow-x-auto border border-ink bg-card shadow-[4px_4px_0_var(--rule)]">
          <Table className="min-w-[700px] text-xs">
            <TableHeader className="bg-paper border-b border-ink">
              <TableRow className="hover:bg-transparent">
                <TableHead className="font-bold text-ink uppercase">Hash Function</TableHead>
                <TableHead className="font-bold text-ink uppercase">Digest Output</TableHead>
                <TableHead className="font-bold text-ink uppercase">Internal Block / Rate</TableHead>
                <TableHead className="font-bold text-ink uppercase">Rounds</TableHead>
                <TableHead className="font-bold text-ink uppercase">Construction</TableHead>
                <TableHead className="font-bold text-ink uppercase">Collision Resistance Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {hashes.map((h, i) => (
                <TableRow key={i} className="border-b border-rule hover:bg-paper">
                  <TableCell className="font-bold text-ink">{h.name}</TableCell>
                  <TableCell className="text-signal font-bold">{h.output}</TableCell>
                  <TableCell className="text-ink">{h.block}</TableCell>
                  <TableCell className="text-ink">{h.rounds}</TableCell>
                  <TableCell className="text-ink-soft">{h.structure}</TableCell>
                  <TableCell className="text-ink text-[11px]">{h.collision}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Table 3: Core Exam Mathematical Derivations */}
      <div className="space-y-4">
        <h3 className="font-serif text-xl font-bold text-ink">
          3. Core Mathematical Formulas & Algorithm Derivations
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
          {/* RSA */}
          <div className="p-4 bg-card border border-ink shadow-[3px_3px_0_var(--rule)] space-y-2">
            <div className="flex justify-between items-center border-b border-rule pb-1.5">
              <span className="font-bold text-signal uppercase">RSA Asymmetric Cryptosystem</span>
              <span className="text-[10px] text-ink-soft">Rivest, Shamir, Adleman (1977)</span>
            </div>
            <ul className="space-y-1 text-ink-soft leading-relaxed text-[11px]">
              <li>· Choose primes <strong className="text-ink">p, q</strong>; compute modulus <strong className="text-ink">n = p · q</strong></li>
              <li>· Euler totient: <strong className="text-ink">φ(n) = (p - 1)(q - 1)</strong></li>
              <li>· Public exponent: <strong className="text-ink">1 &lt; e &lt; φ(n)</strong> such that <strong className="text-ink">gcd(e, φ(n)) = 1</strong></li>
              <li>· Private exponent: <strong className="text-ink">d ≡ e⁻¹ (mod φ(n))</strong></li>
              <li>· Encryption: <strong className="text-signal">C ≡ Mᵉ (mod n)</strong></li>
              <li>· Decryption: <strong className="text-ok">M ≡ Cᵈ (mod n)</strong></li>
            </ul>
          </div>

          {/* Diffie-Hellman */}
          <div className="p-4 bg-card border border-ink shadow-[3px_3px_0_var(--rule)] space-y-2">
            <div className="flex justify-between items-center border-b border-rule pb-1.5">
              <span className="font-bold text-signal uppercase">Diffie-Hellman Key Exchange</span>
              <span className="text-[10px] text-ink-soft">RFC 2631 / Discrete Log</span>
            </div>
            <ul className="space-y-1 text-ink-soft leading-relaxed text-[11px]">
              <li>· Public params: large prime <strong className="text-ink">q</strong>, primitive root <strong className="text-ink">α</strong></li>
              <li>· Alice private <strong className="text-ink">X_A &lt; q</strong>, Public <strong className="text-ink">Y_A = α^(X_A) mod q</strong></li>
              <li>· Bob private <strong className="text-ink">X_B &lt; q</strong>, Public <strong className="text-ink">Y_B = α^(X_B) mod q</strong></li>
              <li>· Shared Secret Key: <strong className="text-signal">K = (Y_B)^(X_A) mod q = (Y_A)^(X_B) mod q</strong></li>
              <li>· Vulnerability: Unauthenticated DH is vulnerable to MITM</li>
            </ul>
          </div>

          {/* Affine Cipher */}
          <div className="p-4 bg-card border border-ink shadow-[3px_3px_0_var(--rule)] space-y-2">
            <div className="flex justify-between items-center border-b border-rule pb-1.5">
              <span className="font-bold text-signal uppercase">Affine Monoalphabetic Cipher</span>
              <span className="text-[10px] text-ink-soft">Modular Arithmetic</span>
            </div>
            <ul className="space-y-1 text-ink-soft leading-relaxed text-[11px]">
              <li>· Encryption: <strong className="text-signal">C = (a · P + b) mod 26</strong></li>
              <li>· Decryption: <strong className="text-ok">P = a⁻¹ · (C - b) mod 26</strong></li>
              <li>· Coprime condition: <strong className="text-ink">gcd(a, 26) = 1</strong></li>
              <li>· Valid multipliers: <strong className="text-ink">{'{1, 3, 5, 7, 9, 11, 15, 17, 19, 21, 23, 25}'}</strong> (12 values)</li>
              <li>· Total keyspace: <strong className="text-ink">12 × 26 = 312 keys</strong> (26 keys if a=1 Caesar)</li>
            </ul>
          </div>

          {/* Birthday Paradox & Entropy */}
          <div className="p-4 bg-card border border-ink shadow-[3px_3px_0_var(--rule)] space-y-2">
            <div className="flex justify-between items-center border-b border-rule pb-1.5">
              <span className="font-bold text-signal uppercase">Hash Collision & Shannon Entropy</span>
              <span className="text-[10px] text-ink-soft">Information Theory</span>
            </div>
            <ul className="space-y-1 text-ink-soft leading-relaxed text-[11px]">
              <li>· Pre-image resistance cost: <strong className="text-ink">O(2ⁿ)</strong> evaluations</li>
              <li>· Birthday collision bound: <strong className="text-signal">O(2^(n/2))</strong> evaluations for 50% probability</li>
              <li>· MD5 128-bit collision complexity: <strong className="text-ink">≈ 2⁶⁴ operations</strong></li>
              <li>· Shannon Entropy: <strong className="text-ink">H(X) = -Σ P(x) · log₂(P(x))</strong></li>
              <li>· Password entropy: <strong className="text-ok">E = L · log₂(R) bits</strong></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
