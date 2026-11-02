"use client"

import React, { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/Table"

export default function ComparisonTables() {
  const [activeComparison, setActiveComparison] = useState<'des-aes' | 'rsa-ecc' | 'hashes' | 'tls-ipsec' | 'pgp-smime'>('des-aes')

  const desVsAes = [
    { feature: "Date of Standardization", des: "1977 (NBS / IBM)", aes: "2001 (NIST FIPS 197 / Rijndael)" },
    { feature: "Key Length", des: "56 bits (64 bits with 8 parity bits)", aes: "128, 192, or 256 bits" },
    { feature: "Block Size", des: "64 bits", aes: "128 bits" },
    { feature: "Internal Structure", des: "16-round Feistel Network", aes: "10, 12, or 14-round Substitution-Permutation Network (SPN)" },
    { feature: "Mathematical Basis", des: "Boolean logic, bit permutations, 8 non-linear S-boxes", aes: "Galois Field GF(2^8) byte transformations (SubBytes, ShiftRows, MixColumns)" },
    { feature: "Cryptanalysis Status", des: "Completely broken (Deep Crack 1999, brute-forced in 22 hrs)", aes: "Secure against all known practical attacks" },
    { feature: "Software Efficiency", des: "Slow in software (designed for 1970s hardware circuits)", aes: "Extremely fast in software and hardware (native AES-NI CPU instructions)" },
    { feature: "S-Box Design", des: "Classified NSA proprietary design criteria", aes: "Open algebraic multiplicative inverse in GF(2^8) with affine transform" }
  ]

  const rsaVsEcc = [
    { feature: "Mathematical Hard Problem", rsa: "Integer Factorization of large composite n = p · q", ecc: "Elliptic Curve Discrete Logarithm Problem (ECDLP) on y² = x³ + ax + b" },
    { feature: "128-bit Security Key Size", rsa: "3072-bit modulus (huge)", ecc: "256-bit elliptic curve point (compact)" },
    { feature: "256-bit Security Key Size", rsa: "15,360-bit modulus (impractically slow)", ecc: "512-bit elliptic curve point" },
    { feature: "Key Generation Speed", rsa: "Slow (must search for two huge probable primes)", ecc: "Fast (choose random scalar d < n and compute d · G)" },
    { feature: "Signing Speed", rsa: "Fast verification (small e=65537), slow signing (large d)", ecc: "Balanced, fast signing and verification" },
    { feature: "Memory & Bandwidth Overhead", rsa: "High (384-byte signatures and public keys)", ecc: "Low (64-byte signatures and 32-byte public keys)" },
    { feature: "IoT & Mobile Suitability", rsa: "Poor (heavy CPU power and memory drain)", ecc: "Ideal (standard for smartcards, Apple Secure Enclave, TLS 1.3)" },
    { feature: "Side-Channel Attack Risk", rsa: "Susceptible to timing and padding oracles (Bleichenbacher)", ecc: "Susceptible to scalar point multiplication timing and nonce reuse (PS3 bug)" }
  ]

  const hashesComparison = [
    { feature: "Digest Output Length", md5: "128 bits", sha1: "160 bits", sha2: "224, 256, 384, or 512 bits", sha3: "224, 256, 384, or 512 bits" },
    { feature: "Internal Construction", md5: "Merkle-Damgård", sha1: "Merkle-Damgård", sha2: "Merkle-Damgård (Davis-Meyer)", sha3: "Keccak Sponge Construction (Absorb/Squeeze)" },
    { feature: "Length Extension Attack", md5: "Vulnerable: H(m || pad || m')", sha1: "Vulnerable", sha2: "Vulnerable (except truncated variants)", sha3: "Immune (Capacity bits never exposed to output)" },
    { feature: "Collision Vulnerability", md5: "Broken (Chosen-prefix in minutes)", sha1: "Broken (SHAttered attack 2017)", sha2: "Secure (Zero collisions known)", sha3: "Secure (NIST Standard FIPS 202)" },
    { feature: "Internal State Size", md5: "128 bits (4 × 32b)", sha1: "160 bits (5 × 32b)", sha2: "256 / 512 bits", sha3: "1,600 bits (5 × 5 × 64b matrix)" },
    { feature: "Recommended Usage", md5: "Do NOT use for security", sha1: "Do NOT use for signatures", sha2: "Standard for Web PKI & HMAC", sha3: "High-security alternative independent of MD" }
  ]

  const tlsVsIpsec = [
    { feature: "OSI Layer", tls: "Transport / Application Layer (Layer 4 / 7)", ipsec: "Network Layer (Layer 3)" },
    { feature: "Packet Header Protection", tls: "Protects application payload only; TCP/IP headers are clear", ipsec: "Tunnel Mode protects entire original IP packet (New outer IP header)" },
    { feature: "Implementation Level", tls: "User-space application library (OpenSSL, BoringSSL, Browser)", ipsec: "OS Kernel, network driver stack, or hardware security gateway / router" },
    { feature: "Connection Scope", tls: "Granular per-application / per-socket connection", ipsec: "Host-to-host or network-to-network site-to-site VPN tunnel" },
    { feature: "NAT Traversal (NAT-T)", tls: "Completely transparent over standard TCP port 443", ipsec: "AH is broken by NAT; ESP requires UDP encapsulation on port 4500" },
    { feature: "Sub-Protocols", tls: "Handshake, Record, Alert, ChangeCipherSpec", ipsec: "AH (Protocol 51), ESP (Protocol 50), IKEv2 (UDP 500)" },
    { feature: "User Authentication", tls: "Typically one-way server auth (optional client certificates)", ipsec: "Pre-Shared Keys (PSK) or X.509 machine certificates via IKE" }
  ]

  const pgpVsSmime = [
    { feature: "Trust Model Architecture", pgp: "Decentralized 'Web of Trust' (individuals sign peer keys)", smime: "Hierarchical PKI rooted in commercial Certificate Authorities (X.509)" },
    { feature: "Public Key Distribution", pgp: "Public keyserver network (HKP/HKPS) and personal fingerprint exchange", smime: "Enterprise LDAP directories; public certificates embedded directly in email MIME" },
    { feature: "Key Revocation Method", pgp: "Upload pre-generated Revocation Certificate to public keyservers", smime: "Certificate Revocation Lists (CRL) and Online Certificate Status Protocol (OCSP)" },
    { feature: "Native Client Integration", pgp: "Requires third-party plugins (Gpg4win, Enigmail, Thunderbird GPG)", smime: "Built natively into Microsoft Outlook, Apple Mail, and Exchange" },
    { feature: "Target Environment", pgp: "Open source community, journalists, privacy advocates", smime: "Corporate enterprises, government agencies, and regulated industries" },
    { feature: "Message Format", pgp: "ASCII Armor Radix-64 package with 24-bit CRC (RFC 4880)", smime: "Standard MIME encapsulation (multipart/signed, application/pkcs7-mime)" }
  ]

  return (
    <div className="space-y-8 max-w-5xl mx-auto py-4 sm:py-8 font-mono">
      {/* Header */}
      <div className="border-b border-rule pb-4">
        <span className="text-xs uppercase tracking-widest text-signal font-bold">University Revision Tables</span>
        <h2 className="text-2xl sm:text-3xl font-serif text-ink font-bold mt-1">
          Architectural & Cryptographic Comparison Tables
        </h2>
        <p className="text-xs sm:text-sm text-ink-soft font-sans mt-1">
          Side-by-side technical trade-offs frequently queried in university examinations and oral vivas.
        </p>

        {/* Comparison Tab Selector */}
        <div className="flex flex-wrap items-center gap-2 mt-4 text-xs">
          {[
            { id: 'des-aes', label: '1. DES vs AES' },
            { id: 'rsa-ecc', label: '2. RSA vs ECC' },
            { id: 'hashes', label: '3. MD5 vs SHA Family' },
            { id: 'tls-ipsec', label: '4. TLS vs IPsec' },
            { id: 'pgp-smime', label: '5. PGP vs S/MIME' }
          ].map(t => (
            <button
              key={t.id}
              onClick={() => setActiveComparison(t.id as typeof activeComparison)}
              className={`px-3 py-1.5 border transition-all ${
                activeComparison === t.id
                  ? "border-signal bg-signal text-paper font-bold shadow-[2px_2px_0_var(--ink)]"
                  : "border-rule bg-card text-ink hover:border-ink"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Comparison View 1: DES vs AES */}
      {activeComparison === 'des-aes' && (
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <h3 className="font-serif text-xl font-bold text-ink">Comparison: DES vs AES</h3>
            <span className="text-xs text-ink-soft">Feistel vs Substitution-Permutation Network</span>
          </div>
          <div className="overflow-x-auto border border-ink bg-card shadow-[4px_4px_0_var(--rule)]">
            <Table className="min-w-[650px] text-xs">
              <TableHeader className="bg-paper border-b border-ink">
                <TableRow className="hover:bg-transparent">
                  <TableHead className="font-bold text-ink uppercase w-1/4">Comparison Criteria</TableHead>
                  <TableHead className="font-bold text-signal uppercase w-3/8">Data Encryption Standard (DES)</TableHead>
                  <TableHead className="font-bold text-ok uppercase w-3/8">Advanced Encryption Standard (AES)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {desVsAes.map((row, i) => (
                  <TableRow key={i} className="border-b border-rule hover:bg-paper">
                    <TableCell className="font-bold text-ink">{row.feature}</TableCell>
                    <TableCell className="text-ink-soft">{row.des}</TableCell>
                    <TableCell className="text-ink font-bold">{row.aes}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      )}

      {/* Comparison View 2: RSA vs ECC */}
      {activeComparison === 'rsa-ecc' && (
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <h3 className="font-serif text-xl font-bold text-ink">Comparison: RSA vs Elliptic Curve Cryptography (ECC)</h3>
            <span className="text-xs text-ink-soft">Integer Factorization vs Elliptic Curve DLP</span>
          </div>
          <div className="overflow-x-auto border border-ink bg-card shadow-[4px_4px_0_var(--rule)]">
            <Table className="min-w-[650px] text-xs">
              <TableHeader className="bg-paper border-b border-ink">
                <TableRow className="hover:bg-transparent">
                  <TableHead className="font-bold text-ink uppercase w-1/4">Comparison Metric</TableHead>
                  <TableHead className="font-bold text-signal uppercase w-3/8">RSA Public Key System</TableHead>
                  <TableHead className="font-bold text-ok uppercase w-3/8">Elliptic Curve Cryptography (ECC)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rsaVsEcc.map((row, i) => (
                  <TableRow key={i} className="border-b border-rule hover:bg-paper">
                    <TableCell className="font-bold text-ink">{row.feature}</TableCell>
                    <TableCell className="text-ink-soft">{row.rsa}</TableCell>
                    <TableCell className="text-ink font-bold">{row.ecc}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      )}

      {/* Comparison View 3: MD5 vs SHA Family */}
      {activeComparison === 'hashes' && (
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <h3 className="font-serif text-xl font-bold text-ink">Comparison: Cryptographic Hash Families</h3>
            <span className="text-xs text-ink-soft">MD5 vs SHA-1 vs SHA-2 vs SHA-3</span>
          </div>
          <div className="overflow-x-auto border border-ink bg-card shadow-[4px_4px_0_var(--rule)]">
            <Table className="min-w-[700px] text-xs">
              <TableHeader className="bg-paper border-b border-ink">
                <TableRow className="hover:bg-transparent">
                  <TableHead className="font-bold text-ink uppercase">Metric</TableHead>
                  <TableHead className="font-bold text-bad uppercase">MD5</TableHead>
                  <TableHead className="font-bold text-bad uppercase">SHA-1</TableHead>
                  <TableHead className="font-bold text-signal uppercase">SHA-2 (256/512)</TableHead>
                  <TableHead className="font-bold text-ok uppercase">SHA-3 (Keccak)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {hashesComparison.map((row, i) => (
                  <TableRow key={i} className="border-b border-rule hover:bg-paper">
                    <TableCell className="font-bold text-ink">{row.feature}</TableCell>
                    <TableCell className="text-bad text-[11px]">{row.md5}</TableCell>
                    <TableCell className="text-bad text-[11px]">{row.sha1}</TableCell>
                    <TableCell className="text-signal text-[11px] font-bold">{row.sha2}</TableCell>
                    <TableCell className="text-ok text-[11px] font-bold">{row.sha3}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      )}

      {/* Comparison View 4: TLS vs IPsec */}
      {activeComparison === 'tls-ipsec' && (
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <h3 className="font-serif text-xl font-bold text-ink">Comparison: SSL/TLS vs IPsec</h3>
            <span className="text-xs text-ink-soft">Transport/Application Layer vs Network Layer Protection</span>
          </div>
          <div className="overflow-x-auto border border-ink bg-card shadow-[4px_4px_0_var(--rule)]">
            <Table className="min-w-[650px] text-xs">
              <TableHeader className="bg-paper border-b border-ink">
                <TableRow className="hover:bg-transparent">
                  <TableHead className="font-bold text-ink uppercase w-1/4">Architecture Feature</TableHead>
                  <TableHead className="font-bold text-signal uppercase w-3/8">SSL / TLS (RFC 8446)</TableHead>
                  <TableHead className="font-bold text-ok uppercase w-3/8">IPsec (RFC 4301 - AH & ESP)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tlsVsIpsec.map((row, i) => (
                  <TableRow key={i} className="border-b border-rule hover:bg-paper">
                    <TableCell className="font-bold text-ink">{row.feature}</TableCell>
                    <TableCell className="text-ink-soft">{row.tls}</TableCell>
                    <TableCell className="text-ink font-bold">{row.ipsec}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      )}

      {/* Comparison View 5: PGP vs S/MIME */}
      {activeComparison === 'pgp-smime' && (
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <h3 className="font-serif text-xl font-bold text-ink">Comparison: Secure Email (PGP vs S/MIME)</h3>
            <span className="text-xs text-ink-soft">Web of Trust vs Hierarchical X.509 PKI</span>
          </div>
          <div className="overflow-x-auto border border-ink bg-card shadow-[4px_4px_0_var(--rule)]">
            <Table className="min-w-[650px] text-xs">
              <TableHeader className="bg-paper border-b border-ink">
                <TableRow className="hover:bg-transparent">
                  <TableHead className="font-bold text-ink uppercase w-1/4">Standard Feature</TableHead>
                  <TableHead className="font-bold text-signal uppercase w-3/8">Pretty Good Privacy (PGP / GPG)</TableHead>
                  <TableHead className="font-bold text-ok uppercase w-3/8">S/MIME (RFC 8551)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pgpVsSmime.map((row, i) => (
                  <TableRow key={i} className="border-b border-rule hover:bg-paper">
                    <TableCell className="font-bold text-ink">{row.feature}</TableCell>
                    <TableCell className="text-ink-soft">{row.pgp}</TableCell>
                    <TableCell className="text-ink font-bold">{row.smime}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      )}
    </div>
  )
}
