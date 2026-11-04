# TCET LMS · Computer Network Security (CNS) Academic Platform
## Comprehensive Academic Project & Evaluation Report

**Department of Computer Engineering & Information Technology**  
**Thakur College of Engineering & Technology (Autonomous)**  
*(Affiliated with University of Mumbai, Approved by AICTE, Accredited by NAAC with 'A' Grade)*  
**Academic Year:** 2025–2026 | **Semester:** VI | **Course Code:** `CSC602`

---

## Abstract

Theoretical instruction in Computer Network Security (CNS) often presents significant challenges due to the abstract nature of mathematical cryptography, layered communication protocols, and dynamic threat landscapes. Traditional classroom pedagogical tools—such as static slideshows and disconnected terminal exercises—fail to bridge the gap between mathematical proofs and practical network mechanics.

This project introduces **TCET LMS CNS**, a unified, offline-first educational web platform aligned strictly with the autonomous syllabus of Thakur College of Engineering & Technology (University of Mumbai). Engineered with **Next.js 16**, **React 19**, **TypeScript**, and **Tailwind CSS v4**, the application eliminates external backend dependencies by implementing pure algorithmic simulators in the browser. 

The platform features:
1. **Six University Syllabus Modules (M1–M6)** with interactive simulators and three-layer scrollytelling lessons (*Picture it*, *See it work*, *Say it in exam words*).
2. **Fullscreen Lecture Hall Presentation Mode (`[P]`)** for faculty classroom instruction.
3. **Student & Faculty Portals** managing a multi-subject continuous evaluation scheme (135 marks: ISE 1, FA 1, ISE 2, ISE 3, FA 2, Term Work) and portion completion milestones.
4. **Bloom's Taxonomy-Aligned Assessment Engine** supporting Self-Test, Numerical Lab, Speed Drill, and a 45-Question Mock Exam with instant ink-stamp evaluation and diagnostic analytics.
5. **Mobile-First Touch Ergonomics** engineered for 360px smartphone viewports.
6. A rigorous automated test suite consisting of **125 Vitest unit tests** and **58 Playwright end-to-end tests** (183 tests total) verifying mathematical accuracy and zero-error execution.

---

## 1. Introduction & Motivation

Cybersecurity education requires balancing rigorous mathematical rigor (e.g. modular matrix inversions, Euler's totient, elliptic curve point doubling) with practical protocol execution (e.g. TLS handshakes, Kerberos ticket granting, TCP SYN cookies). 

Within TCET's autonomous engineering curriculum, Course Code `CSC602` requires students to achieve Bloom's Taxonomy cognitive levels ranging from Level 1 (Remembering cryptographic definitions) to Level 4 (Analyzing protocol vulnerabilities and designing perimeter defenses). 

To address these academic objectives, our project team developed a modern, cohesive digital learning platform. Rather than building a conventional quiz web app, we engineered an end-to-end learning management system tailored specifically to our syllabus, faculty requirements, and continuous evaluation scheme.

---

## 2. System Architecture & Design Philosophy

### 2.1 "The Lab Notebook" Design System
To replace generic, distracting user interfaces, the application implements a purpose-built editorial aesthetic called **The Lab Notebook**:
- **Palette:** Warm paper backgrounds (`#F4F1EA`), elevated ledger cards (`#FBF9F4`), high-contrast carbon ink typography (`#16130F`), and vibrant vermilion accents (`#E5390F`).
- **Typography:** Instrument Serif for editorial headings, Geist Sans for instructional UI, and JetBrains Mono for cryptographic keys, equations, and protocol headers.
- **Structural Lines:** 1px technical ruled lines separating instrument panels, evoking physical engineering ledger sheets and calibration benches.

### 2.2 Client-Side Architecture & Hydration Safety
The platform is 100% serverless, generating 95 static routes at build time. All user sessions, continuous evaluation marksheets, portion milestones, and quiz records persist across browser reloads using Zustand wrapped in a custom `safeStorage` adapter. This eliminates server maintenance costs while ensuring 100% offline functionality in college laboratories.

Hydration safety is enforced via a two-phase render pattern:
```tsx
const mounted = useMounted()
if (!mounted) return <LoadingSkeleton />
return <ComponentWithPersistedData />
```
This guarantees that server-rendered HTML and initial client-rendered DOM match perfectly, completely avoiding Next.js hydration mismatch exceptions.

---

## 3. Syllabus Mapping & Module Breakdown

The application is structured into six comprehensive syllabus modules, mapping 1:1 with the official TCET curriculum:

```
TCET Autonomous CNS Curriculum (CSC602)
├── Module 1: Introduction & Classical Cryptography (5 Hours · Bloom L1–L3)
├── Module 2: Block Ciphers & Public Key Cryptography (8 Hours · Bloom L1–L3)
├── Module 3: Cryptographic Hashes & Digital Signatures (7 Hours · Bloom L1–L4)
├── Module 4: Protection of Computing Resources & System Security (8 Hours · Bloom L1–L3)
├── Module 5: Network Security & Defense (10 Hours · Bloom L1–L4)
└── Module 6: Network Security Applications & Emerging Threats (7 Hours · Bloom L1–L4)
```

### 3.1 Module 1: Introduction & Classical Cryptography (5 Hours)
- **Theoretical Scope:** OSI Security Architecture (X.800 services and mechanisms), symmetric cipher model, cryptanalysis concepts.
- **Implemented Simulators:**
  - *Caesar & Affine:* Modular linear transformation $C \equiv (aP + b) \pmod{26}$.
  - *Playfair 5×5 Matrix:* Digraph replacement rules with step-by-step matrix visualization.
  - *Hill Matrix Inversion:* $2 \times 2$ matrix multiplication and decryption via modular determinant inverse $\det(K)^{-1} \pmod{26}$.
  - *Polyalphabetic & Transposition:* Vigenère cipher and Columnar transposition.
  - *Cryptanalysis:* Frequency histograms and Friedman's Index of Coincidence ($I_c$).

### 3.2 Module 2: Block Ciphers & Public Key Cryptography (8 Hours)
- **Theoretical Scope:** Feistel network principles, DES and AES structure, block cipher modes of operation, asymmetric mathematical foundations.
- **Implemented Simulators:**
  - *DES Avalanche Effect:* Live bit-flip counter demonstrating $>50\%$ ciphertext alteration across rounds.
  - *AES Substitution-Permutation:* Tracing SubBytes, ShiftRows, MixColumns ($\text{GF}(2^8)$), and AddRoundKey.
  - *RSA Modular Exponentiation:* Native `BigInt` key generation, Euler totient calculation $\phi(n)$, and encryption $C \equiv M^e \pmod n$.
  - *Diffie-Hellman Key Exchange:* Visual key derivation alongside an active Man-in-the-Middle (MITM) key-replacement exploit.
  - *Elliptic Curve Cryptography (ECC):* Discrete points on $y^2 \equiv x^3 + ax + b \pmod p$ with geometric point addition and doubling.
  - *Historical & IoT Ciphers:* ElGamal, Rabin, and TEA (Tiny Encryption Algorithm).

### 3.3 Module 3: Cryptographic Hashes & Digital Signatures (7 Hours)
- **Theoretical Scope:** Hash functions, MACs, digital signature algorithms, and PKI.
- **Implemented Simulators:**
  - *SHA-256 Digest Engine:* Step-by-step 512-bit compression tracking 64 logical rounds.
  - *HMAC (RFC 2104):* Inner and outer padding verification ($K^+ \oplus \text{ipad}$, $K^+ \oplus \text{opad}$) and Merkle-Damgård length extension attack demonstration.
  - *Birthday Paradox Bound:* Mathematical simulation of collision probability scaling with $\sqrt{N}$.
  - *Digital Signatures:* DSA / ECDSA signature generation, verification, and nonce reuse vulnerability demonstration.
  - *X.509 PKI Chain of Trust:* Hierarchical certificate validator tracing Root CA, Intermediate CA, leaf certificates, expiration dates, and revocation lists.

### 3.4 Module 4: Protection of Computing Resources & System Security (8 Hours)
- **Theoretical Scope:** Access control models, software memory exploits, authentication security.
- **Implemented Simulators:**
  - *Access Control Matrix:* Comparing Bell-LaPadula confidentiality (*No Read-Up, No Write-Down*) against Biba integrity (*No Read-Down, No Write-Up*).
  - *Buffer Overflow & Memory Exploits:* Stack memory layout tracing buffer overruns into saved frame pointers (EBP) and return addresses (EIP), with StackGuard canary and DEP/NX execution defenses.
  - *WebAuthn / FIDO2:* Phishing-resistant public-key challenge-response bound to browser origin.
  - *NIST SP 800-63B Password Security:* Entropy calculation $E = L \log_2(R)$ and dictionary attack duration estimation.

### 3.5 Module 5: Network Security & Defense (10 Hours)
- **Theoretical Scope:** Perimeter security, firewalls, intrusion detection, zero trust architecture.
- **Implemented Simulators:**
  - *5-Tuple ACL Packet Filter:* Top-down rule evaluation on IP addresses, ports, and protocols.
  - *Stateful Connection Tracking (Conntrack):* TCP session state machine tracking 3-way handshake transitions and timeouts.
  - *TCP SYN Flood Defense:* RFC 4987 32-bit stateless SYN cookie generator and validator.
  - *Snort Signature IDS & DNS Tunneling:* Regex pattern matching on payloads and Shannon entropy calculation to detect covert DNS exfiltration.
  - *NIST Zero Trust Engine:* Dynamic policy evaluation scoring identity, endpoint posture, and anomalous behavior.

### 3.6 Module 6: Network Security Applications & Emerging Threats (7 Hours)
- **Theoretical Scope:** Enterprise authentication, transport encryption, packet encapsulation, and AI defense.
- **Implemented Simulators:**
  - *Kerberos v5:* 3-step ticket-granting exchange (AS-REQ $\rightarrow$ TGS-REQ $\rightarrow$ AP-REQ) with replay detection.
  - *TLS 1.2 vs 1.3 Latency Flight Explorer:* Measuring round-trip time (RTT) differences during handshake negotiation.
  - *IPsec Protocol Dissector:* Header breakdown comparing Authentication Header (AH) vs Encapsulating Security Payload (ESP) in Transport and Tunnel modes.
  - *OpenPGP (RFC 4880):* 5-step compression, signature, hybrid encryption, and ASCII armor pipeline.
  - *ML Anomaly Classifier & SOAR Playbooks:* Flow classifier calculating Precision, Recall, and F1-Score, triggering automated response playbooks.

---

## 4. Academic Evaluation & Campus Portals

### 4.1 Continuous Evaluation Scheme (135 Marks)
The application digitizes the institutional evaluation scheme for TCET engineering courses:

$$\text{Total Continuous Marks} = \text{ISE}_1 (20) + \text{FA}_1 (25) + \text{ISE}_2 (20) + \text{ISE}_3 (20) + \text{FA}_2 (25) + \text{Term Work} (25) = 135$$

- **Student Portal (`/student`):** Allows students to view their official internal marks statement, percentage, predicted grade (O, A+, A), and SGPA band.
- **Faculty Gradebook (`/teacher`):** Enables course coordinators to record marks, inspect passing criteria, auto-save to browser storage, and export rosters directly to CSV.

### 4.2 Portion Progression & Notes Unlock Engine
To encourage continuous student study habits, the system implements an automated unlock rule:
$$\text{Unlocked Notes Topic Threshold} = \min(\text{Total Topics}, \text{Faculty Completed Topics} + 3)$$
Faculty update their teaching milestones in `/teacher`, instantly making upcoming lecture notes accessible to students for pre-reading while maintaining structural curriculum control.

---

## 5. Assessment Engine & Bloom's Taxonomy Diagnostics

The quiz hub (`/quiz`) features four specialized evaluation modes:
1. **Self-Test Mode:** Topic-specific practice with hints and retry capabilities.
2. **Numerical Lab:** Scratchpad interface for calculation-intensive cryptographic problems.
3. **Speed Drill:** Timed rapid-fire challenge.
4. **Full Syllabus Mock Exam:** 45-question randomized examination mirroring university semester exams.

Every assessment attempt is evaluated instantaneously with in-window ink-stamp badges (`CORRECT ✓` / `INCORRECT ✗`), followed by detailed diagnostic reports categorizing student competency across Bloom's Taxonomy cognitive levels:
- **Level 1 (Remember):** Definitions, port numbers, standard parameters.
- **Level 2 (Understand):** Protocol flow, cipher mode differences, security trade-offs.
- **Level 3 (Apply):** Solving modular equations, calculating hash lengths, writing ACL filters.
- **Level 4 (Analyze):** Identifying replay vulnerabilities, comparing handshake latencies, diagnosing memory leaks.

---

## 6. Mobile & Phone Optimization

Recognizing that students frequently study on mobile devices while traveling or between lectures, the platform was audited and optimized across 360px–414px viewports:
- **Touch-Scrollable Pill Bars:** Converted dense multi-tab menus (such as the 18 tabs in Cryptography and portal tabs) into smooth horizontal touch-scrolling containers (`overflow-x-auto pb-2 scrollbar-none flex-nowrap shrink-0`).
- **Touch Ergonomics:** Enlarged primary action buttons to 100% viewport width (`w-full sm:w-auto`) with minimum 44px tap targets for thumb reachability.
- **Responsive Table Affordances:** Dense continuous evaluation marksheets feature horizontal scroll cues (`← Swipe table horizontally →`) and optimized padding (`p-4 sm:p-6`).

---

## 7. Verification, Testing & Quality Assurance

To ensure zero production failures, the platform implements a dual-tier testing harness:

| Suite | Runner | Test Count | Scope | Result |
|---|---|---|---|---|
| **Unit Solvers** | Vitest | 125 | Deterministic mathematical validation of all cryptographic ciphers, hash engines, access models, and SYN cookies. | **125 / 125 PASSED** |
| **End-to-End** | Playwright | 58 | Browser automation validating all 12 core routes, mobile 360px responsiveness, presenter hotkeys, and quiz execution. | **58 / 58 PASSED** |
| **Total** | | **183** | **Zero console errors, zero hydration mismatches, zero broken routes.** | **100% PASSED** |

---

## 8. Conclusion & Future Roadmap

The TCET LMS CNS academic platform successfully transforms complex, abstract cybersecurity concepts into an intuitive, visually engaging, and rigorously evaluated educational tool. It satisfies all requirements of the University of Mumbai autonomous curriculum scheme while providing a modern foundation for continuous academic tracking.

### Future Roadmap
1. **Phase II Curriculum Expansion:** Staging companion modules for Database Management Systems (`CSC403`) and Operating Systems (`CSC404`).
2. **WebAssembly Acceleration:** Porting high-iteration cryptographic proofs to Rust compiled to Wasm for real-time demonstration of large prime generation.
3. **Institutional LMS Integration:** Supporting LTI (Learning Tools Interoperability) standards to sync continuous evaluation marks directly into university grade databases.
