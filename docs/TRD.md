# Technical Requirements Document (TRD)

## 1. System Overview & Technology Stack

The **TCET LMS Computer Network Security (CNS)** application is engineered with an emphasis on client-side performance, deterministic mathematical accuracy, offline reliability, and educational interactivity.

| Dimension | Specification | Justification |
|---|---|---|
| **Framework** | Next.js 16.4.3 (App Router + Turbopack) | Static site generation (SSG) of 95 routes, rapid local build speeds, zero server maintenance. |
| **Language** | TypeScript 5 (Target: `ES2022`) | Enables native `BigInt` operations required for 2048-bit RSA arithmetic and RFC 4987 32-bit SYN cookie bitwise calculations. |
| **UI Library** | React 19.3.0 | Modern concurrent rendering, clean separation of presentation and solver state. |
| **Styling** | Tailwind CSS v4 + Tokens | Strict 12-column grid, custom "Lab Notebook" design tokens (`tokens.css`), hardware-accelerated animations. |
| **State Management** | Zustand 5.0.15 + `safeStorage` | Lightweight reactive store with custom SSR-safe `localStorage` wrapper to prevent hydration mismatches. |
| **Icons & Media** | Lucide React | Clean, scalable vector iconography aligned with technical instrument aesthetics. |
| **Unit Testing** | Vitest 5.0.3 | High-speed unit execution for 125 cryptographic and security solver algorithms. |
| **E2E Testing** | Playwright 1.63.0 | Browser automation verifying route rendering, mobile touch viewports (360px), presenter mode hotkeys, and zero console errors. |

---

## 2. Algorithmic Modules & Mathematical Solvers (`src/lib/*`)

All algorithmic engines reside in `src/lib/` and are decoupled from React components to enable standalone testing and deterministic execution.

### 2.1 Module 1: Classical Ciphers & Cryptanalysis (`src/lib/crypto/`)
- **Caesar & Affine Ciphers:** Modular arithmetic implementation $C \equiv (a \cdot P + b) \pmod{26}$, with greatest common divisor checking $\gcd(a, 26) = 1$ and modular inverse calculation $a^{-1} \pmod{26}$.
- **Playfair 5×5 Matrix:** Digraph substitution engine with dynamic key square generation, 'I/J' combination, same-row right shift, same-column down shift, and rectangle corner swap rules.
- **Hill Cipher Matrix:** $2 \times 2$ matrix multiplication modulo 26, determinant evaluation $\det(K) = (ad - bc) \pmod{26}$, modular multiplicative inverse calculation $\det(K)^{-1} \pmod{26}$, and adjugate matrix decryption:
  $$K^{-1} = \det(K)^{-1} \cdot \begin{pmatrix} d & -b \\ -c & a \end{pmatrix} \pmod{26}$$
- **Vigenère Polyalphabetic Cipher:** Dynamic key repeating, periodic polyalphabetic shift $C_i \equiv (P_i + K_{i \pmod m}) \pmod{26}$.
- **Columnar Transposition:** Key-ordered permutation matrix with padding handling.
- **Cryptanalysis & Index of Coincidence (IoC):** Monofrequency histogram analysis and Friedman's Index of Coincidence:
  $$I_c = \frac{\sum_{i=1}^{26} f_i (f_i - 1)}{N (N - 1)}$$
  (Used to distinguish polyalphabetic ciphers $I_c \approx 0.038$ from monoalphabetic ciphers $I_c \approx 0.067$).

### 2.2 Module 2: Block Ciphers & Public Key Cryptography
- **DES (Data Encryption Standard):** 16-round Feistel network simulation demonstrating the **Avalanche Effect** (flipping 1 bit in plaintext shifts $\ge 50\%$ of ciphertext bits by Round 3).
- **AES (Advanced Encryption Standard):** 128-bit block visualization tracing SubBytes (S-Box non-linear substitution), ShiftRows (cyclical byte shifts), MixColumns (matrix multiplication in $\text{GF}(2^8)$), and AddRoundKey.
- **RSA Public-Key Algorithm:** Native `BigInt` implementation:
  1. Prime generation: $p, q$
  2. Modulus: $n = p \cdot q$
  3. Euler's Totient: $\phi(n) = (p - 1)(q - 1)$
  4. Public exponent: $e$ such that $\gcd(e, \phi(n)) = 1$
  5. Private exponent: $d \equiv e^{-1} \pmod{\phi(n)}$ via Extended Euclidean Algorithm
  6. Encryption & Decryption: $C \equiv M^e \pmod n$, $M \equiv C^d \pmod n$ using modular exponentiation.
- **Diffie-Hellman Key Exchange & MITM Exploit:** Prime modulus $p$, generator $g$. Simulates private secrets $a, b$, public values $A = g^a \pmod p, B = g^b \pmod p$, shared key $K = B^a \equiv A^b \pmod p$, and an active attacker Mallory injecting surrogate keys $M_1, M_2$.
- **Elliptic Curve Cryptography (ECC):** Arithmetic over finite field $\mathbb{F}_p$ on short Weierstraß curve $y^2 \equiv x^3 + ax + b \pmod p$. Implements non-singularity check $4a^3 + 27b^2 \not\equiv 0 \pmod p$, point addition ($P + Q$), and point doubling ($2P$).
- **Additional Ciphers:** ElGamal discrete log encryption, Rabin quadratic residue encryption, and TEA (Tiny Encryption Algorithm) 32-cycle Feistel iterations.

### 2.3 Module 3: Hashes & Digital Signatures
- **SHA-256 Digest Engine:** 512-bit message block processing, bitwise logical functions ($\text{Ch}, \text{Maj}, \Sigma_0, \Sigma_1$), and 64 round constant iterations.
- **HMAC (RFC 2104):** Key padding ($K^+$ to 64 bytes), inner pad XOR ($K^+ \oplus \text{ipad}$ with `0x36`), outer pad XOR ($K^+ \oplus \text{opad}$ with `0x5c`):
  $$\text{HMAC}(K, M) = H((K^+ \oplus \text{opad}) \mathbin{\Vert} H((K^+ \oplus \text{ipad}) \mathbin{\Vert} M))$$
  Includes simulation of Merkle-Damgård Length Extension Attacks against raw $H(K \mathbin{\Vert} M)$.
- **Birthday Paradox Collision Bound:** Mathematical approximation showing a hash with $b$-bit security requires only $B \approx 1.177 \sqrt{2^b} = 1.177 \cdot 2^{b/2}$ trials for a $50\%$ collision probability.
- **Digital Signatures (DSA / ECDSA):** Signing $(r, s)$ calculation, message digest verification, and security flaw demonstration when ephemeral nonce $k$ is reused.
- **X.509 PKI Chain of Trust Validator:** Validates root certificate self-signing, intermediate CA signing authority, expiration dates (`notBefore`, `notAfter`), revocation checks (CRL / OCSP simulation), and Subject Key Identifier matching.

### 2.4 Module 4: Protection of Computing Resources & System Security
- **Access Control Models:** Formal policy evaluator comparing **Bell-LaPadula** (Confidentiality: *No Read-Up [ss-property]*, *No Write-Down [*-property]*) against **Biba** (Integrity: *No Read-Down*, *No Write-Up*).
- **Buffer Overflow & Memory Defense:** Stack frame memory layout visualizer (Local Variables $\rightarrow$ Saved Frame Pointer $\rightarrow$ Return Address). Demonstrates canary overwrite detection (StackGuard) and Non-Executable Stack (DEP/NX) enforcement.
- **WebAuthn / FIDO2 Challenge-Response:** Hardware authenticator simulation generating cryptographic keypairs bound to origin (`rpId`), preventing credential reuse on phishing origins.
- **NIST SP 800-63B Password Security:** Calculates entropy bits $E = L \log_2(R)$ and estimates cracking time across dictionary, GPU hash-cluster, and rainbow table scenarios.

### 2.5 Module 5: Network Security & Defense
- **5-Tuple ACL Packet Filter:** Top-down first-match policy evaluation over Source IP/CIDR, Destination IP/CIDR, Protocol (TCP/UDP/ICMP), Source Port, and Destination Port.
- **Stateful Connection Tracking (Conntrack):** Dynamic bidirectional session table tracking TCP three-way handshake transitions (`SYN_SENT` $\rightarrow$ `SYN_RECV` $\rightarrow$ `ESTABLISHED` $\rightarrow$ `FIN_WAIT` $\rightarrow$ `CLOSED`) with timeout aging.
- **TCP SYN Flood & RFC 4987 SYN Cookies:** Computes 32-bit Initial Sequence Number (ISN) with zero server-side state allocation:
  - Bits 0–2: MSS encoder index
  - Bits 3–7: Server slow counter $t \pmod{32}$
  - Bits 8–31: $\text{HMAC-SHA256}(s, d, s_{\text{port}}, d_{\text{port}}, t, \text{key}) \pmod{2^{24}}$
- **Intrusion Detection (IDS/IPS):** Snort rule syntax engine parsing action, protocol, IP/ports, and payload regex matching. Shannon entropy analysis detecting DNS Tunneling:
  $$H(X) = -\sum_{i=1}^n P(x_i) \log_2 P(x_i)$$
- **NIST Zero Trust Engine (ZTA):** Contextual risk evaluation combining device health, IP reputation, credential assurance, and behavioral anomaly scoring.

### 2.6 Module 6: Applications & Emerging Threats
- **Kerberos v5 Authentication:** 3-step ticket-granting pipeline:
  1. Authentication Service: $\text{AS-REQ} \rightarrow \text{AS-REP}$ (produces TGT encrypted with $K_{\text{tgs}}$).
  2. Ticket-Granting Service: $\text{TGS-REQ} \rightarrow \text{TGS-REP}$ (produces Service Ticket encrypted with $K_{\text{service}}$).
  3. Application Exchange: $\text{AP-REQ} \rightarrow \text{AP-REP}$ with replay detection via timestamp authenticators.
- **SSL / TLS 1.2 vs 1.3 Flight Explorer:** Compares 2-RTT handshake overhead of TLS 1.2 against 1-RTT (and 0-RTT PSK resumption) in TLS 1.3, tracing ClientHello, KeyShare, and encrypted extensions.
- **IPsec Dissector:** Packet header breakdown comparing Transport Mode vs Tunnel Mode across **AH** (Authentication Header, Protocol 51, mutable IP fields zeroed) and **ESP** (Encapsulating Security Payload, Protocol 50, payload encryption + integrity ICV).
- **OpenPGP (RFC 4880):** 5-phase pipeline: 1. Zip Compression $\rightarrow$ 2. RSA Digital Signature $\rightarrow$ 3. AES Session Key Encryption $\rightarrow$ 4. Asymmetric Key Wrap $\rightarrow$ 5. Radix-64 ASCII Armor formatting.
- **ML Anomaly Classifier & SOAR:** Network flow classifier calculating True Positives, False Positives, False Negatives, Precision, Recall, and $F_1\text{-Score} = 2 \cdot \frac{P \cdot R}{P + R}$, triggering automated SOAR playbook actions.

---

## 3. Data & State Management Schemas

### 3.1 Continuous Academic Evaluation Schema (`useAcademicStore`)
```typescript
export interface StudentSubjectMarks {
  id: string
  rollNo: string
  studentName: string
  department: string
  batch: string
  subjectCode: string      // e.g. "CSC602"
  subjectName: string      // e.g. "Cryptography & Network Security"
  inCharge: string         // e.g. "Prof. S. R. Raman"
  ise1: number             // Max 20
  fa1: number              // Max 25
  ise2: number             // Max 20
  ise3: number             // Max 20
  fa2: number              // Max 25
  termWork: number         // Max 25
  totalMarks: number       // Max 135
  percentage: number       // Math.round((totalMarks / 135) * 100)
  grade: string            // "O" | "A+" | "A" | "B+" | "B" | "F"
  status: "Distinction" | "First Class" | "Pass" | "Fail"
  facultyRemarks?: string
}

export interface AcademicMilestone {
  id: string
  title: string
  subjectCode: string
  type: "ISE" | "FA" | "TERM_WORK" | "VIVA" | "ORAL_PRACTICAL"
  maxMarks: number
  date: string
  time?: string
  venue?: string
  status: "completed" | "active" | "upcoming"
  guidelines: string
}
```

### 3.2 Quiz Assessment Schema (`useQuizRecordsStore`)
```typescript
export interface QuizSubmission {
  id: string
  studentRollNo: string
  studentName: string
  batch?: string
  timestamp: string
  mode: "self-test" | "numerical" | "speed-drill" | "mock-exam"
  moduleFilter: string
  score: number
  totalQuestions: number
  accuracyPercentage: number
  durationSeconds: number
  bloomBreakdown: {
    L1: { correct: number; total: number }
    L2: { correct: number; total: number }
    L3: { correct: number; total: number }
    L4: { correct: number; total: number }
  }
}
```

---

## 4. UI Architecture & Responsive Mobile Engineering

### 4.1 "The Lab Notebook" Design System
- Tokenized in `src/styles/tokens.css` with dark/light variables:
  - `--paper`: `#F4F1EA` (warm instrument paper background)
  - `--card`: `#FBF9F4` (elevated ledger card)
  - `--ink`: `#16130F` (deep carbon black typography)
  - `--ink-soft`: `#5D574C` (annotation gray)
  - `--rule`: `#D9D3C5` (1px technical ruled line)
  - `--signal`: `#E5390F` (high-visibility vermilion alert)
  - `--ok`: `#1F7A4D` (passing verification green)

### 4.2 Mobile Touch Engineering (360px–414px)
To maintain ergonomics across narrow smartphone screens:
- **Touch-Scroll Pill Bars:** Multi-tab navigations implement `-mx-4 px-4 overflow-x-auto pb-2 scrollbar-none` containing flex containers with `shrink-0 whitespace-nowrap` buttons.
- **Thumb Reachability:** Evaluation buttons (*Confirm & Reveal*, *Next Question*) transition to `w-full` on mobile viewports.
- **Table Visual Cues:** Dense continuous evaluation tables are housed in `overflow-x-auto` wrappers accompanied by mobile swipe indicators (`← Swipe table horizontally →`).

---

## 5. Automated Verification & Testing Harness

The platform enforces a mandatory test execution pipeline before any production deployment:

```bash
# Complete Test Run
npm test
```

1. **Unit Testing (`vitest run`):** 125 tests executing isolated mathematical assertions across all 6 module solvers in `tests/unit/`.
2. **End-to-End Testing (`playwright test`):** 58 tests across headless Chromium validating:
   - Full route tree load without console errors or page errors.
   - 360px mobile viewport rendering and touch drawer functionality (`tests/mobile-smoke.spec.ts`).
   - Presentation Mode keyboard interactions (`[P]`, `[←]`, `[→]`, `[Esc]`).
   - Quiz assessment engine execution, answer locking, ink-stamp verification, and score reporting.
