"use client"

import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/Table"
import { ModuleId } from "@/lib/syllabus"

interface ComplexityItem {
  algo: string
  time: string
  space: string
  meaning: string
}

const COMPLEXITY_DATA: Record<ModuleId, {
  title: string
  subtitle: string
  rows: ComplexityItem[]
  deepDiveTitle: string
  deepDiveContent: React.ReactNode
}> = {
  m1: {
    title: "Classical Cryptography Computational Complexity",
    subtitle: "Analyzing algorithm efficiency vs brute-force cryptanalysis cost for classical ciphers.",
    rows: [
      { algo: "Caesar Cipher Encrypt / Decrypt", time: "O(N)", space: "O(N)", meaning: "N = message length. Single-pass linear modular shift C = (P + k) mod 26." },
      { algo: "Caesar Brute-Force Keyspace", time: "O(26) = O(1)", space: "O(1)", meaning: "Keyspace is only 25 valid shifts. Instantly cracked in microseconds." },
      { algo: "Affine Cipher Encrypt", time: "O(N)", space: "O(1)", meaning: "C = (aP + b) mod 26. 12 valid multipliers coprime to 26 (keyspace = 12 × 26 = 312)." },
      { algo: "Playfair Cipher Digraph Lookup", time: "O(N)", space: "O(1)", meaning: "Substitutes letter pairs using 5×5 matrix. Keyspace 25! eliminates single-letter frequencies." },
      { algo: "Vigenère Cipher (Known Key Len)", time: "O(N)", space: "O(1)", meaning: "Polyalphabetic substitution. Linear with message length." },
      { algo: "Vigenère Cryptanalysis (Kasiski + IoC)", time: "O(N²)", space: "O(N)", meaning: "N-gram distance matching + Index of Coincidence (IoC ≈ 0.065) reveals key length." },
      { algo: "Hill Cipher 2×2 Matrix Mult", time: "O(N)", space: "O(1)", meaning: "C = P · K mod 26. Matrix inversion requires det(K) coprime to 26." },
      { algo: "Columnar Transposition", time: "O(N)", space: "O(N)", meaning: "Grid permutation. Preserves letter frequencies perfectly while diffusing order." }
    ],
    deepDiveTitle: "Why does 26! keyspace fail to make Monoalphabetic Substitution secure?",
    deepDiveContent: (
      <>
        <p className="mb-3">
          A monoalphabetic substitution cipher has a staggering keyspace of <strong>26! ≈ 4.03 × 10²⁶</strong> keys. Brute-forcing this would take millions of years on modern supercomputers.
        </p>
        <p className="mb-3">
          However, <strong>Frequency Analysis</strong> bypasses the keyspace entirely in <strong>O(N)</strong> time. Because each plaintext letter always maps to the same ciphertext letter, the relative letter frequencies of natural language (such as &apos;E&apos; at 12.7%, &apos;T&apos; at 9.1%) are perfectly preserved in the ciphertext.
        </p>
        <p>
          This demonstrates Shannon&apos;s fundamental principle: high keyspace alone provides zero security without <strong className="text-signal">confusion and diffusion</strong>.
        </p>
      </>
    )
  },
  m2: {
    title: "Block Ciphers & Public Key Complexity",
    subtitle: "Comparing symmetric hardware-accelerated block ciphers with asymmetric number theory algorithms.",
    rows: [
      { algo: "DES (Data Encryption Standard)", time: "O(1) / block", space: "O(1)", meaning: "64-bit block, 16 Feistel rounds. 56-bit keyspace (2⁵⁶) broken by brute force in hours." },
      { algo: "AES-128 / 192 / 256 (SPN)", time: "O(1) / block", space: "O(1)", meaning: "128-bit block, 10/12/14 rounds in GF(2⁸). Hardware accelerated (AES-NI) at &gt;3 GB/s." },
      { algo: "Feistel Decryption", time: "O(1) / block", space: "O(1)", meaning: "Identical circuit as encryption with reversed round subkeys. Round function F need not be invertible." },
      { algo: "RSA Key Generation", time: "O(log³ N)", space: "O(log N)", meaning: "Finding two 1024-bit primes p, q via Miller-Rabin probabilistic test." },
      { algo: "RSA Public Encryption (e = 65537)", time: "O(log² N)", space: "O(log N)", meaning: "Modular exponentiation C = Mᵉ mod n using repeated squaring (fast with 17-bit Fermat prime)." },
      { algo: "RSA Private Decryption (M = Cᵈ mod n)", time: "O(log³ N)", space: "O(log N)", meaning: "Full modular exponentiation with 2048-bit d. Highly CPU-intensive." },
      { algo: "Diffie-Hellman Key Exchange", time: "O(log³ q)", space: "O(log q)", meaning: "K = (Y_B)^X_A mod q. Discrete logarithm hardness provides asymmetric secret generation." },
      { algo: "ECC Point Multiplication (k · P)", time: "O(log p)", space: "O(log p)", meaning: "Elliptic curve chord-and-tangent scalar multiplication. 256-bit ECC matches 3072-bit RSA security." },
      { algo: "TEA (Tiny Encryption Algorithm)", time: "O(1)", space: "O(1)", meaning: "32 Feistel cycles, 64-bit block, 128-bit key. Ultra-lightweight for IoT microcontrollers." }
    ],
    deepDiveTitle: "Why do we never use RSA or ECC to encrypt bulk data files?",
    deepDiveContent: (
      <>
        <p className="mb-3">
          RSA modular exponentiation operates on multi-precision numbers (2048 to 4096 bits) and requires <strong>O(log³ N)</strong> operations. In practice, RSA software encryption benchmarks around <strong>1 to 5 MB/s</strong>.
        </p>
        <p className="mb-3">
          In contrast, symmetric ciphers like AES perform simple bitwise XOR and byte substitutions, accelerated natively by CPU hardware (Intel AES-NI, ARM Cryptography Extension) at over <strong>3,500 MB/s</strong> (nearly 1,000× faster).
        </p>
        <p>
          Consequently, real-world protocols (TLS, SSH, PGP) always use <strong>Hybrid Encryption</strong>: asymmetric algorithms (RSA, ECC, Diffie-Hellman) negotiate a short-lived 256-bit symmetric key, which is then used by AES for high-speed bulk data transfer.
        </p>
      </>
    )
  },
  m3: {
    title: "Cryptographic Hashes & Signatures Complexity",
    subtitle: "Mathematical complexity of collision resistance, Merkle-Damgård, and signature verification.",
    rows: [
      { algo: "SHA-256 Hashing", time: "O(L)", space: "O(1)", meaning: "L = message byte length. Processes 512-bit message blocks through 64 compression rounds." },
      { algo: "HMAC-SHA256 (RFC 2104)", time: "O(L)", space: "O(1)", meaning: "Two nested hash passes: H((K ⊕ opad) || H((K ⊕ ipad) || M)). Immune to length extension." },
      { algo: "Hash Collision Attack (Birthday Bound)", time: "O(2^(n/2))", space: "O(2^(n/2))", meaning: "Birthday paradox: For an n-bit hash, a collision occurs with 50% probability in ~2^(n/2) work." },
      { algo: "MD5 Collision Exploitation", time: "O(2³²)", space: "O(1)", meaning: "Wang et al. differential collision attack finds rogue MD5 certificate collisions in seconds." },
      { algo: "Second Pre-Image Attack", time: "O(2ⁿ)", space: "O(1)", meaning: "Given message M, finding M' ≠ M such that H(M') = H(M) requires full exhaustive search." },
      { algo: "RSA Signature Generation (S = H(M)ᵈ mod n)", time: "O(log³ N)", space: "O(log N)", meaning: "Hash-then-sign paradigm. Requires private exponent modular exponentiation." },
      { algo: "RSA Signature Verification (H(M) = Sᵉ mod n)", time: "O(log² N)", space: "O(log N)", meaning: "Very fast verification with e = 65537 (only 17 squarings and additions)." },
      { algo: "X.509 PKI Chain Validation", time: "O(D)", space: "O(D)", meaning: "D = depth of certificate chain. Validates signatures, expiration, and CRL/OCSP status." }
    ],
    deepDiveTitle: "Why does the Birthday Paradox reduce 128-bit MD5 security to only 64 bits?",
    deepDiveContent: (
      <>
        <p className="mb-3">
          If you want to find an input that hashes to a <em>specific target digest</em>, you need approximately <strong>2¹²⁸</strong> attempts. This is <strong>Pre-image resistance</strong>.
        </p>
        <p className="mb-3">
          However, for <strong>Collision resistance</strong>, the attacker only needs to find <em>any two messages</em> that produce the same digest. According to the Birthday Paradox, in a room of only 23 people, there is a 50% chance two share a birthday (out of 365 days).
        </p>
        <p>
          Mathematically, the number of trials needed to find any collision among N possibilities is approximately <strong>√(N) = √(2ⁿ) = 2^(n/2)</strong>. For MD5 (128 bits), this drops required operations from 2¹²⁸ down to <strong>2⁶⁴</strong>, making collisions computationally practical.
        </p>
      </>
    )
  },
  m4: {
    title: "Computing Resources & Security Features Complexity",
    subtitle: "Analyzing stack vulnerability defenses, access control evaluation, and password entropy.",
    rows: [
      { algo: "Stack Canary Verification", time: "O(1)", space: "O(1)", meaning: "Single XOR comparison against Thread Local Storage (TLS) canary prior to RET instruction." },
      { algo: "ASLR Memory Offset Calculation", time: "O(1)", space: "O(1)", meaning: "OS kernel randomizes stack, heap, and library base addresses during execve()." },
      { algo: "Dictionary Attack (Single Hash)", time: "O(W × H)", space: "O(1)", meaning: "W = words in dictionary, H = cost of hashing algorithm (bcrypt / PBKDF2 / Argon2)." },
      { algo: "Rainbow Table Hash Lookup", time: "O(1) lookup", space: "O(W) storage", meaning: "Trades massive precomputed disk storage for instant lookup. Completely neutralized by salts." },
      { algo: "Password Entropy (NIST SP 800-63B)", time: "O(L)", space: "O(1)", meaning: "E = L · log₂(R) bits. 12-char mixed password yields ~71 bits of entropy." },
      { algo: "TOTP RFC 6238 Token Generation", time: "O(1)", space: "O(1)", meaning: "HMAC-SHA1 of shared 160-bit secret and 30-second epoch counter T = ⌊(time - T0) / 30⌋." },
      { algo: "Bell-LaPadula / Biba Access Check", time: "O(1)", space: "O(1)", meaning: "Simple scalar comparison: Subject clearance level vs Resource security classification." },
      { algo: "RBAC Role-Permission Evaluation", time: "O(R × P)", space: "O(U)", meaning: "Traversing user roles to resolve effective permission set. Cached in JWT session claims." }
    ],
    deepDiveTitle: "Why does Salting completely kill Rainbow Tables?",
    deepDiveContent: (
      <>
        <p className="mb-3">
          A <strong>Rainbow Table</strong> precomputes billions of plaintext-to-hash mappings for common passwords into reduction chains. An attacker who steals a database of unsalted MD5 hashes can look up precomputed hashes in <strong>O(1)</strong> time.
        </p>
        <p className="mb-3">
          A <strong>Salt</strong> is a unique random string (e.g., 128 bits) appended to the password before hashing: <code>H(password + salt)</code>. Because every single user has a completely distinct random salt, an attacker cannot use one universal rainbow table.
        </p>
        <p>
          The attacker would have to compute a <em>separate multi-gigabyte rainbow table specifically for each individual user&apos;s salt</em>, making precomputation attacks completely economically infeasible.
        </p>
      </>
    )
  },
  m5: {
    title: "Network Security & Defense Complexity",
    subtitle: "Computational cost of packet filtering, stateful conntrack, SYN cookies, and IDS pattern matching.",
    rows: [
      { algo: "Stateless Packet Filter (5-Tuple ACL)", time: "O(R)", space: "O(R)", meaning: "R = number of firewall rules. Evaluates IP/Port rules sequentially top-to-bottom." },
      { algo: "Stateful Firewall Conntrack Lookup", time: "O(1) established", space: "O(C)", meaning: "C = concurrent connections. Established packets bypass rule evaluation via hash table lookup." },
      { algo: "TCP SYN Cookie Generation", time: "O(1) time", space: "O(0) memory!", meaning: "Encodes connection state into 32-bit ISN via HMAC. Allocates ZERO server memory during SYN flood." },
      { algo: "Signature-Based NIDS (Snort)", time: "O(P × S)", space: "O(S)", meaning: "P = packet payload bytes, S = signature rules. Optimized via Aho-Corasick multi-string search." },
      { algo: "Statistical Anomaly Detection (Z-Score)", time: "O(1)", space: "O(W)", meaning: "Z = (x - μ) / σ over rolling window W. Alerts when traffic deviation |Z| ≥ 3.0." },
      { algo: "DNS Tunneling Shannon Entropy", time: "O(N)", space: "O(1)", meaning: "H = -Σ p_i · log₂(p_i). Encoded tunnel subdomains exhibit entropy H &gt; 3.8." },
      { algo: "DDoS Amplification Ratio", time: "O(1) attacker", space: "O(A) target", meaning: "A = Amplification factor: DNS up to 50×, NTP up to 556×. Tiny spoofed request triggers massive reply." }
    ],
    deepDiveTitle: "How do SYN Cookies mitigate SYN Floods with Zero Memory Allocation?",
    deepDiveContent: (
      <>
        <p className="mb-3">
          In a standard TCP 3-way handshake, when the server receives a SYN packet, it allocates a <strong>Transmission Control Block (TCB)</strong> in memory (~500 bytes) and waits for the client&apos;s ACK. In a <strong>SYN Flood</strong>, an attacker sends millions of spoofed SYNs, saturating the server&apos;s backlog queue and denying legitimate users.
        </p>
        <p className="mb-3">
          <strong>SYN Cookies</strong> solve this by allocating <em>zero state</em>. Instead of storing the connection in a queue, the server encodes all connection parameters (timestamp, MSS, source/destination IPs and ports) into a cryptographic hash that becomes the <strong>Initial Sequence Number (ISN)</strong> of the SYN-ACK.
        </p>
        <p>
          When a legitimate client responds with ACK (acknowledging ISN + 1), the server recalculates the hash from the incoming ACK number. If valid, the TCB is created only then. Malicious half-open connections consume zero server memory!
        </p>
      </>
    )
  },
  m6: {
    title: "Network Security Applications & AI Complexity",
    subtitle: "Scalability of Kerberos authentication, TLS 1.3 round trips, IPsec overhead, and ML confusion matrix.",
    rows: [
      { algo: "Pairwise Symmetric Keys without KDC", time: "O(1)", space: "O(N²)", meaning: "N users require N(N - 1) / 2 shared keys. 1,000 users need ~500,000 keys (unscalable)." },
      { algo: "Kerberos Key Distribution (KDC)", time: "O(1)", space: "O(N)", meaning: "Each user shares only 1 master key with KDC. KDC scales linearly to millions of principals." },
      { algo: "Kerberos Ticket Exchange (AS + TGS)", time: "2 Round Trips", space: "O(1)", meaning: "Client gets TGT from AS, then Service Ticket from TGS. Zero plaintext passwords on network." },
      { algo: "SSL / TLS 1.3 Handshake Latency", time: "1-RTT (0-RTT PSK)", space: "O(1)", meaning: "Eliminates 1 round trip compared to TLS 1.2 (2-RTT). Key exchange combined with ClientHello." },
      { algo: "IPsec Tunnel Mode Overhead", time: "O(1) per packet", space: "52-60 bytes", meaning: "Adds 20B outer IP + 8B ESP + 16B IV + 16B ICV. Protects entire inner IP packet." },
      { algo: "NetFlow AI Flow Classification", time: "O(F)", space: "O(1)", meaning: "F = number of flow features. Decision tree or linear classifier evaluates flow in microseconds." },
      { algo: "ML Confusion Matrix Evaluation", time: "O(N)", space: "O(1)", meaning: "Computes Precision = TP/(TP+FP), Recall = TP/(TP+FN), and F1-Score = 2PR/(P+R)." }
    ],
    deepDiveTitle: "Why did TLS 1.3 deprecate RSA Key Exchange in favor of Ephemeral Diffie-Hellman?",
    deepDiveContent: (
      <>
        <p className="mb-3">
          In TLS 1.2 RSA key exchange, the browser encrypts a premaster secret with the web server&apos;s public RSA key. If an adversary records all encrypted internet traffic today, and then 5 years later steals the server&apos;s private RSA key (or subpoenas it), they can decrypt <em>every historical session ever recorded</em>.
        </p>
        <p className="mb-3">
          TLS 1.3 completely removed RSA key exchange and mandates <strong>Ephemeral Diffie-Hellman (ECDHE)</strong> to guarantee <strong>Perfect Forward Secrecy (PFS)</strong>.
        </p>
        <p>
          With ECDHE, a brand new temporary key pair is generated for each individual session and discarded immediately after. Even if the server&apos;s long-term certificate private key is compromised in the future, past communications remain mathematically unbreakable.
        </p>
      </>
    )
  }
}

export default function SyllabusComplexity({ moduleId }: { moduleId: ModuleId }) {
  const data = COMPLEXITY_DATA[moduleId] || COMPLEXITY_DATA.m1

  return (
    <div className="space-y-8 sm:space-y-12">
      <Card>
        <CardHeader>
          <div className="font-mono text-xs uppercase tracking-widest text-signal font-bold mb-1">
            03 Cost Analysis
          </div>
          <CardTitle className="font-serif text-2xl sm:text-3xl text-ink">
            {data.title}
          </CardTitle>
          <p className="text-ink-soft text-xs sm:text-sm font-sans mt-2">
            {data.subtitle}
          </p>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto border border-rule bg-card">
            <Table>
              <TableHeader className="bg-paper border-b border-rule">
                <TableRow>
                  <TableHead className="font-mono text-xs uppercase tracking-wider text-ink font-bold">Algorithm / Operation</TableHead>
                  <TableHead className="font-mono text-xs uppercase tracking-wider text-signal font-bold whitespace-nowrap">Time Complexity</TableHead>
                  <TableHead className="font-mono text-xs uppercase tracking-wider text-signal font-bold whitespace-nowrap">Space Complexity</TableHead>
                  <TableHead className="font-mono text-xs uppercase tracking-wider text-ink font-bold">Plain English Meaning</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.rows.map((row, i) => (
                  <TableRow key={i} className="border-b border-rule/60 hover:bg-paper/50 transition-colors">
                    <TableCell className="font-mono text-xs font-bold text-ink whitespace-nowrap">{row.algo}</TableCell>
                    <TableCell className="font-mono text-xs text-signal font-bold whitespace-nowrap">{row.time}</TableCell>
                    <TableCell className="font-mono text-xs text-ink-soft font-bold whitespace-nowrap">{row.space}</TableCell>
                    <TableCell className="text-xs sm:text-sm text-ink-soft leading-relaxed min-w-[240px]">{row.meaning}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="font-mono text-[10px] uppercase tracking-widest text-signal font-bold mb-1">
            Critical Viva Question
          </div>
          <CardTitle className="font-serif text-xl sm:text-2xl text-ink">
            {data.deepDiveTitle}
          </CardTitle>
        </CardHeader>
        <CardContent className="font-sans text-xs sm:text-sm text-ink leading-relaxed">
          {data.deepDiveContent}
        </CardContent>
      </Card>
    </div>
  )
}

