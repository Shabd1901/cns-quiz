"use client"

import React from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { ModuleId, getModule } from "@/lib/syllabus"
import { ArrowRight, AlertTriangle, BookOpen } from "lucide-react"

const CHEAT_SHEET_DATA: Record<ModuleId, {
  title: string
  hours: string
  bloom: string
  coreConcepts: { name: string; summary: string }[]
  keyFormulas: string[]
  commonTraps: string[]
}> = {
  m1: {
    title: "Module 1: Introduction & Classical Cryptography",
    hours: "5 Hours",
    bloom: "Bloom L1-L3",
    coreConcepts: [
      { name: "OSI Security Architecture (X.800)", summary: "Defines Security Attacks (Passive eavesdropping vs Active modification/replay/DoS), Security Services (Confidentiality, Integrity, Authentication, Access Control, Non-repudiation), and Security Mechanisms (Encipherment, Digital Signatures, Routing Control)." },
      { name: "Symmetric Cipher Model", summary: "Single shared secret key K known only to sender and receiver. Plaintext P, Ciphertext C = E_K(P), Decryption P = D_K(C). Kerckhoffs's Principle: System security must depend solely on key secrecy, never algorithm obscurity." },
      { name: "Substitution Ciphers", summary: "Caesar: C = (P + k) mod 26. Affine: C = (aP + b) mod 26 where gcd(a, 26) = 1. Playfair: 5×5 digraph matrix (I/J combined), same row/col/rect rules. Vigenère: Polyalphabetic key repetition, C_i = (P_i + K_i) mod 26. Hill: Matrix multiplication C = P · K mod 26." },
      { name: "Transposition Ciphers", summary: "Rail Fence (zigzag depth write, row-by-row read) and Columnar Transposition (write in grid, read columns in alphabetical key order). Product ciphers alternate substitution (confusion) and transposition (diffusion)." },
      { name: "Cryptanalysis Techniques", summary: "Frequency analysis (single letter peak at 'E', digrams 'TH', 'HE'). Kasiski Examination and Index of Coincidence (IoC ≈ 0.065 for English, 0.038 for uniform random) deduce Vigenère key length." }
    ],
    keyFormulas: [
      "Caesar: C = (P + k) mod 26 | P = (C - k) mod 26",
      "Affine: C = (aP + b) mod 26 | P = a⁻¹(C - b) mod 26 (12 valid multipliers: gcd(a, 26) = 1)",
      "Hill 2×2 Inversion: det(K) = (ad - bc) mod 26 | K⁻¹ = det⁻¹ · [[d, -b], [-c, a]] mod 26",
      "Index of Coincidence: IoC = Σ [f_i · (f_i - 1)] / [N · (N - 1)]"
    ],
    commonTraps: [
      "Thinking monoalphabetic substitution is secure because key space is 26! ≈ 4×10²⁶: Frequency analysis cracks it in minutes because relative letter frequencies are perfectly preserved.",
      "Choosing even numbers or 13 for Affine multiplier 'a': gcd(a, 26) must equal 1, or modular inverse does not exist and decryption is impossible.",
      "Confusing confusion and diffusion: Confusion obscures key-ciphertext relation (substitution); Diffusion spreads plaintext statistics across entire ciphertext (transposition/permutations)."
    ]
  },
  m2: {
    title: "Module 2: Block Ciphers & Public Key Cryptography",
    hours: "8 Hours",
    bloom: "Bloom L1-L3",
    coreConcepts: [
      { name: "Feistel Cipher Structure", summary: "Splits block into (L_i, R_i). Round: L_{i+1} = R_i; R_{i+1} = L_i ⊕ F(R_i, K_i). Reversible without inverting round function F; encryption and decryption share identical circuit with reversed subkeys." },
      { name: "Block Cipher Modes (NIST SP 800-38A)", summary: "ECB (vulnerable, identical blocks produce identical ciphertext; leaks Tux image pattern); CBC (IV ⊕ P_i, sequential, requires padding); CFB/OFB (stream modes turning block cipher into keystream generator); CTR (Counter mode, parallelizable, random access, no padding)." },
      { name: "DES & AES", summary: "DES: 64-bit block, 56-bit key, 16 Feistel rounds. Broken by brute force. AES: 128-bit block, 128/192/256-bit key (10/12/14 rounds SPN). 4 byte operations per round: SubBytes (S-box), ShiftRows, MixColumns (Galois Field GF(2^8)), AddRoundKey." },
      { name: "Public Key Principles & RSA", summary: "Asymmetric key pairs (public for encryption/verify, private for decrypt/sign). RSA based on factoring n = pq. Keygen: n = pq, φ(n) = (p-1)(q-1), ed ≡ 1 mod φ(n). Encrypt: C = Mᵉ mod n; Decrypt: M = Cᵈ mod n." },
      { name: "Diffie-Hellman & ECC", summary: "Diffie-Hellman establishes shared secret K = (Y_B)^X_A mod q over untrusted channel. ECC uses elliptic curves y² = x³ + ax + b over GF(p), offering 256-bit keys with security equivalent to 3072-bit RSA." },
      { name: "Lightweight Cryptography (TEA)", summary: "Tiny Encryption Algorithm: 64-bit block, 128-bit key, 32 cycles. Uses golden ratio constant δ = 0x9E3779B9. Minimal memory footprint for IoT and microcontrollers." }
    ],
    keyFormulas: [
      "RSA: n = p · q | φ(n) = (p - 1)(q - 1) | e · d ≡ 1 (mod φ(n))",
      "Diffie-Hellman: Y_A = α^(X_A) mod q | K = (Y_B)^(X_A) mod q = α^(X_A · X_B) mod q",
      "ECC Point Addition: λ = (y₂ - y₁) / (x₂ - x₁) mod p | x₃ = λ² - x₁ - x₂ mod p",
      "TEA Round: v0 += ((v1 << 4) + k0) ^ (v1 + sum) ^ ((v1 >> 5) + k1)"
    ],
    commonTraps: [
      "Using ECB mode for files larger than one block: Leaves visual and statistical patterns completely intact.",
      "Confusing private exponent d with φ(n) modulus: d is derived modulo φ(n), but encryption/decryption happens modulo n.",
      "Assuming Diffie-Hellman provides authentication: Raw DH is vulnerable to active Man-in-the-Middle unless combined with digital certificates."
    ]
  },
  m3: {
    title: "Module 3: Cryptographic Hashes & Digital Signatures",
    hours: "7 Hours",
    bloom: "Bloom L1-L4",
    coreConcepts: [
      { name: "Hash Functions & Security Properties", summary: "One-way compression mapping arbitrary length inputs to fixed-size digest. 1. Pre-image resistance (given y, hard to find x with H(x)=y). 2. Second pre-image resistance (given x, hard to find x' with H(x)=H(x')). 3. Collision resistance (hard to find any x!=x' with H(x)=H(x'))." },
      { name: "MACs and HMAC (RFC 2104)", summary: "Keyed hash construction providing message integrity and origin authentication. HMAC(K, m) = H((K+ ⊕ opad) || H((K+ ⊕ ipad) || m)). Defeats length extension attacks with nested hashing; ipad = 0x36, opad = 0x5C." },
      { name: "MD5 vs SHA Family", summary: "MD5 (128b) and SHA-1 (160b) broken by collision attacks (Wang et al., SHAttered). SHA-2 (256/512b) remains secure. SHA-3 uses Keccak sponge construction (absorbing and squeezing rate/capacity bits), eliminating Merkle-Damgård vulnerabilities." },
      { name: "Digital Signatures", summary: "Sign with private key, verify with public key. Provides authenticity, integrity, and non-repudiation. RSA signature: S = H(M)ᵈ mod n. ECDSA uses elliptic curve points; reusing nonce k allows full private key extraction (Sony PS3 hack)." },
      { name: "PKI & Digital Certificates (X.509)", summary: "Hierarchical trust binding public keys to identities. Root CA signs Intermediate CA, which signs leaf certificate. Revocation handled via CRLs and real-time OCSP (with server OCSP Stapling)." }
    ],
    keyFormulas: [
      "HMAC: HMAC(K, M) = H((K ⊕ opad) || H((K ⊕ ipad) || M)) | ipad=0x36, opad=0x5C",
      "Birthday Bound: Collision in n-bit hash takes ≈ 2^(n/2) operations (50% probability)",
      "RSA Signature: S ≡ H(M)ᵈ (mod n) | Verify: H(M) ≡ Sᵉ (mod n)",
      "ECDSA Nonce Attack: k = (z₁ - z₂) / (s₁ - s₂) mod n | d = (s₁ · k - z₁) · r⁻¹ mod n"
    ],
    commonTraps: [
      "Confusing MACs with Digital Signatures: A MAC uses a symmetric key and cannot provide non-repudiation (receiver can forge tags). Digital signatures use asymmetric keys and provide legal non-repudiation.",
      "Assuming 128-bit hash requires 2¹²⁸ work to find collision: Birthday paradox reduces collision work to 2⁶⁴ operations.",
      "Reusing random nonce k in ECDSA: Subtraction reveals k instantly, followed by private key recovery."
    ]
  },
  m4: {
    title: "Module 4: Protection of Computing Resources & Security Features",
    hours: "8 Hours",
    bloom: "Bloom L1-L3",
    coreConcepts: [
      { name: "Secure Programs & Buffer Overflows", summary: "Stack frames store local variables, saved frame pointer (EBP), and return address (EIP). Writing past array bounds in C (strcpy, gets) overwrites EIP to redirect execution to shellcode. Defenses: Stack Canaries (-fstack-protector), ASLR (randomizes memory offsets), DEP/NX bit (W^X memory)." },
      { name: "Incomplete Mediation & Malicious Code", summary: "Incomplete mediation: Relying solely on client-side validation; attackers tamper with parameters directly in HTTP requests. Malware: Viruses (attach to host files), Worms (self-propagating over network), Trojans (disguised as benign), Rootkits (kernel stealth)." },
      { name: "Access Control Mechanisms", summary: "DAC (Discretionary: owner controls ACLs), MAC (Mandatory: central security labels, e.g. Bell-LaPadula confidentiality 'no read up, no write down', Biba integrity 'no read down, no write up'), RBAC (Role-Based: users inherit permissions via assigned enterprise roles)." },
      { name: "User Authentication & MFA", summary: "3 core factors: Knowledge (password/PIN), Possession (YubiKey/hardware token/phone), Inherence (biometrics). MFA requires 2 or more distinct factor categories. RFC 6238 TOTP derives 6-digit codes via HMAC-SHA1 of shared secret and 30s epoch counter." },
      { name: "Password Security & NIST SP 800-63B", summary: "Defenses: Salts neutralize precomputed rainbow tables; Slow key stretching (bcrypt, PBKDF2, Argon2id) mitigates offline GPU brute force. NIST guidelines discourage mandatory periodic resets (causes predictable patterns) and recommend screening against breached passwords." }
    ],
    keyFormulas: [
      "Password Entropy: E = L · log₂(R) bits (L = length, R = character pool size)",
      "TOTP RFC 6238: T = ⌊(current_unix_time - T0) / X⌋ | Code = Truncate(HMAC-SHA1(K, T)) mod 10⁶",
      "Bell-LaPadula (Confidentiality): Simple Security (No Read Up) | *-Property (No Write Down)",
      "Biba (Integrity): Simple Integrity (No Read Down) | *-Property (No Write Up)"
    ],
    commonTraps: [
      "Enforcing 90-day mandatory password rotations: Empirical NIST studies show users choose predictable variations (Summer2025! -> Summer2026!), degrading overall security.",
      "Believing passwords + SMS OTP is strong MFA: SMS is vulnerable to SIM-swapping and SS7 interception. Hardware FIDO2 WebAuthn keys are preferred.",
      "Thinking ASLR alone stops stack exploits: ASLR without DEP/NX allows brute-forcing NOP sleds; ASLR + DEP + Canaries must be combined (defense-in-depth)."
    ]
  },
  m5: {
    title: "Module 5: Network Security",
    hours: "10 Hours",
    bloom: "Bloom L1-L4",
    coreConcepts: [
      { name: "TCP/IP Layer Vulnerabilities", summary: "Layer 2 (ARP lacks authentication -> ARP poisoning/MITM); Layer 3 (IP source address easily forged -> IP spoofing, routing redirects); Layer 4 (TCP sequence numbers predictable -> RST injection, connection hijacking; UDP connectionless -> reflection/amplification)." },
      { name: "Attacks: Sniffing, Spoofing & Scanning", summary: "Sniffing: NIC promiscuous mode captures switch traffic via ARP cache poisoning. Port scanning: TCP SYN (half-open stealth), TCP FIN/XMAS (RFC 793 anomalies), UDP scan. DNS spoofing: Poisoning resolver cache by racing responses." },
      { name: "DoS & DDoS Defenses", summary: "TCP SYN flood: Saturates server connection backlog with half-open connections. Defense: SYN Cookies (encode state into Initial Sequence Number; zero server memory allocated). Amplification attacks (DNS/NTP): Spoofed small queries trigger massive replies." },
      { name: "Firewall Technologies", summary: "Stateless packet filters (examine 5-tuple header, fast, blind to context); Stateful inspection firewalls (track connection states in conntrack table; return traffic allowed); Application proxy gateways (inspect Layer 7 payloads; termination of connection at proxy)." },
      { name: "IDS, Honeypots & Zero Trust", summary: "NIDS vs HIDS. Signature detection (matches CVE byte patterns, high speed, blind to zero-days) vs Anomaly detection (Z-score behavioral baseline, detects zero-days, risk of false positives). Honeypots: Low vs high interaction decoys. Zero Trust: 'Never Trust, Always Verify', microsegmentation." }
    ],
    keyFormulas: [
      "SYN Cookie ISN: t_5bit || MSS_3bit || HMAC(srcIP, dstIP, srcPort, dstPort, secret, t)",
      "Statistical Z-Score Anomaly: Z = (x - μ) / σ (Alert triggered when |Z| ≥ 3.0)",
      "DDoS Amplification Factor: Factor = Response Size / Request Size (DNS up to 50×, NTP up to 556×)",
      "Entropy of DNS Tunneling: H = -Σ p_i · log₂(p_i) (Tunnel domain entropy > 3.0)"
    ],
    commonTraps: [
      "Assuming switches prevent packet sniffing: ARP spoofing tricks switches into redirecting all traffic through the attacker's MAC address.",
      "Thinking stateful firewalls inspect payload malware: Stateful firewalls only monitor connection state transitions (SYN -> SYN-ACK -> ESTABLISHED); Next-Gen Firewalls (NGFW) or WAFs are required for payload inspection.",
      "Deploying Zero Trust solely at the network edge: Zero Trust rejects perimeter trust; every internal microsegment and service transaction must be authenticated."
    ]
  },
  m6: {
    title: "Module 6: Network Security Applications",
    hours: "7 Hours",
    bloom: "Bloom L1-L4",
    coreConcepts: [
      { name: "Kerberos Authentication Service", summary: "Single sign-on protocol using symmetric cryptography. Authentication Server (AS) issues Ticket Granting Ticket (TGT) encrypted with K_TGS. Client uses TGT to request Service Tickets from Ticket Granting Server (TGS). Authenticators use timestamps (skew ≤ 300s) to prevent replay." },
      { name: "SSL / TLS Protocol Architecture", summary: "Record Protocol encapsulates data, fragments, encrypts via AEAD. Handshake Protocol negotiates cipher suites and keys. TLS 1.3 reduces handshake from 2-RTT to 1-RTT, deprecates RSA key exchange and static ciphers in favor of mandatory (EC)DHE forward secrecy, and adds 0-RTT PSK resumption." },
      { name: "IPsec (AH & ESP)", summary: "Network-layer security. Authentication Header (AH, Protocol 51): Integrity and origin authentication including IP header; broken by NAT. Encapsulating Security Payload (ESP, Protocol 50): Encryption, integrity, and anti-replay. Transport Mode (protects payload only) vs Tunnel Mode (new outer IP header, site-to-site VPN)." },
      { name: "Secure Email (PGP & S/MIME)", summary: "5-step PGP pipeline: 1. Sign (hash + sender private key), 2. Compress (ZIP before encrypt), 3. Symmetric Encrypt (one-time session key), 4. Key Wrap (recipient public key), 5. Radix-64 ASCII Armor (24-bit CRC). PGP uses Web of Trust; S/MIME uses X.509 CAs." },
      { name: "AI in Cybersecurity & Threat Response", summary: "NetFlow anomaly detection via machine learning. Performance evaluated via Confusion Matrix: Precision = TP/(TP+FP), Recall = TP/(TP+FN), F1-Score = 2PR/(P+R). Adversarial ML: Evasion (perturbing test inputs to bypass classifier) vs Poisoning (corrupting training sets). SOAR automates playbooks." }
    ],
    keyFormulas: [
      "Pairwise Symmetric Keys without KDC: Total = N(N - 1) / 2 keys",
      "Kerberos Skew Check: |t_client - t_server| ≤ Δt (default 300 seconds)",
      "Precision = TP / (TP + FP) | Recall = TP / (TP + FN)",
      "F1-Score = 2 · (Precision · Recall) / (Precision + Recall)"
    ],
    commonTraps: [
      "Assuming IPsec AH works through home broadband NAT routers: AH hashes the IP source address; when NAT translates the IP, the receiver's ICV check fails, dropping all packets.",
      "Compressing email messages AFTER encryption: Ciphertext has maximum Shannon entropy and cannot be compressed; PGP compresses before encryption to remove linguistic redundancy.",
      "Relying on TLS 1.3 0-RTT for financial transactions: 0-RTT Early Data has no server freshness and is vulnerable to replay attacks; only idempotent requests (GET) should use 0-RTT."
    ]
  }
}

export default function SyllabusCheatSheet({ moduleId }: { moduleId: ModuleId }) {
  const current = CHEAT_SHEET_DATA[moduleId] || CHEAT_SHEET_DATA.m1
  const modInfo = getModule(moduleId)

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <Card className="border border-ink shadow-[4px_4px_0_var(--rule)]">
        <CardHeader className="border-b border-rule pb-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <span className="text-signal uppercase text-xs font-bold font-mono tracking-wider">
                {current.hours} · {current.bloom}
              </span>
              <CardTitle className="text-2xl sm:text-3xl font-serif text-ink font-bold mt-1">
                {current.title}
              </CardTitle>
            </div>
            <span className="px-2.5 py-1 border border-ink bg-paper text-ink text-xs font-mono font-bold">
              {modInfo?.code} Exam Cheat Sheet
            </span>
          </div>
        </CardHeader>

        <CardContent className="pt-6 space-y-8 font-sans">
          {/* Section 1: Core Concepts */}
          <div>
            <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-ink-soft mb-3 flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-signal" />
              <span>Core Theoretical Concepts</span>
            </h4>
            <div className="grid gap-3">
              {current.coreConcepts.map((c, idx) => (
                <div key={idx} className="p-3 bg-paper border border-rule/80 text-xs sm:text-sm">
                  <span className="font-bold font-mono text-signal mr-2">{idx + 1}. {c.name}:</span>
                  <span className="text-ink leading-relaxed">{c.summary}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Section 2: Key Formulas */}
          <div>
            <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-ink-soft mb-3 flex items-center gap-2">
              <span>∑</span>
              <span>Essential Exam Formulas & Algorithms</span>
            </h4>
            <div className="space-y-2">
              {current.keyFormulas.map((f, idx) => (
                <div key={idx} className="p-2.5 bg-ink text-paper font-mono text-xs border border-ink flex items-center gap-2">
                  <span className="text-signal font-bold shrink-0">&gt;</span>
                  <span className="overflow-x-auto">{f}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Section 3: Common Traps */}
          <div>
            <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-bad mb-3 flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-bad" />
              <span>High-Risk Exam Traps & Pitfalls</span>
            </h4>
            <div className="space-y-2.5">
              {current.commonTraps.map((t, idx) => (
                <div key={idx} className="p-3 bg-bad/5 border-l-4 border-bad text-xs sm:text-sm text-ink leading-relaxed">
                  <strong className="text-bad mr-1">Trap {idx + 1}:</strong> {t}
                </div>
              ))}
            </div>
          </div>

          {/* Link to Revision Hub */}
          <div className="pt-4 border-t border-rule flex flex-col sm:flex-row justify-between sm:items-center gap-3">
            <span className="text-xs text-ink-soft font-mono">
              Need flashcards, formula tables, and viva Q&A?
            </span>
            <Link
              href="/revision"
              className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-signal hover:underline"
            >
              <span>Visit Full Revision Hub</span>
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

