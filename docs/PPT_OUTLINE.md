# TCET LMS · Computer Network Security Presentation Outline

**Presentation Format:** 10-Slide Deck for 6-Student Team Oral Presentation  
**Course Code:** `CSC602` | **Academic Year:** 2025–2026 | **Time Allocation:** 12–15 Minutes

---

## Slide 1: Title & Project Overview
- **Header:** TCET LMS · Computer Network Security (CNS) Academic Platform
- **Sub-header:** Autonomous Academic Project & Continuous Evaluation Portal
- **Institution:** Thakur College of Engineering & Technology, Department of Computer Engineering
- **Team (6 Presenters):**
  1. Student 1 (Architecture & Project Scope)
  2. Student 2 (M1 & M2: Cryptography & Public-Key Algorithms)
  3. Student 3 (M3 & M4: Hashes, Access Control & Memory Defense)
  4. Student 4 (M5 & M6: Firewalls, IDS, Kerberos & TLS 1.3)
  5. Student 5 (Campus Portals & 135-Mark Continuous Evaluation)
  6. Student 6 (Assessment Engine, Mobile Ergonomics & Live Demo)
- **Visual:** High-resolution screenshot of the TCET LMS Landing Page (`/`) and Four-Year Engineering Matrix.

---

## Slide 2: The Academic Challenge & Objectives
- **Speaker:** Student 1
- **Key Talking Points:**
  - *Theoretical Abstraction:* Abstract mathematical algorithms (RSA, ECC, Diffie-Hellman, HMAC padding) are difficult for students to visualize through static lecture slides.
  - *Disconnected Lab Experience:* Traditional command-line lab tools fail to connect packet dynamics with exam questions.
  - *Evaluation Fragmentation:* Continuous evaluation marks (ISE, FA, Term Work) are scattered across manual spreadsheets without student-facing grade prediction.
- **Objectives:** Build an institutional-grade, zero-backend progressive web application that unifies syllabus theory, live interactive simulators, faculty evaluation tools, and semester exam preparation.

---

## Slide 3: Unified System Architecture & Technology Stack
- **Speaker:** Student 1
- **Key Talking Points:**
  - *Frontend Framework:* **Next.js 16.4.3** with App Router and Turbopack; 95 pre-rendered static routes.
  - *Programming Language:* **TypeScript 5 (ES2022)** utilizing native `BigInt` for 2048-bit RSA math and bitwise SYN cookie generation.
  - *State & Persistence:* **Zustand** stores wrapped in custom `safeStorage` adapters, eliminating React hydration mismatches while operating 100% offline.
  - *Visual Design System:* Custom **"Lab Notebook"** aesthetic (Instrument Serif, JetBrains Mono, warm paper `#F4F1EA`, carbon ink `#16130F`, and signal vermilion `#E5390F`).
- **Visual:** Architectural layer diagram showing Client Browser $\rightarrow$ React 19 UI $\rightarrow$ Zustand State $\rightarrow$ Pure Algorithmic Solvers.

---

## Slide 4: Modules 1 & 2 — Cryptography & Public-Key Algorithms
- **Speaker:** Student 2
- **Key Talking Points:**
  - *Module 1 (M1 · 5 Hours):* Classical ciphers (Caesar, Affine, Playfair 5×5 digraph rules, Hill matrix modulo 26, Vigenère polyalphabetic) and cryptanalysis via Friedman's Index of Coincidence ($I_c$).
  - *Module 2 (M2 · 8 Hours):* Feistel network principles; DES 16-round breakdown demonstrating the Avalanche Effect ($>50\%$ bit variation by Round 3); AES Substitution-Permutation layers (SubBytes, ShiftRows, MixColumns $\text{GF}(2^8)$); RSA key generation and modular exponentiation; Diffie-Hellman Man-in-the-Middle (MITM) exploit simulation; Elliptic Curve point addition and doubling on $y^2 \equiv x^3 + ax + b \pmod p$.
- **Visual:** Interactive DES bit-flip chart and RSA modular key derivation simulator.

---

## Slide 5: Modules 3 & 4 — Hashes, Signatures & System Defense
- **Speaker:** Student 3
- **Key Talking Points:**
  - *Module 3 (M3 · 7 Hours):* SHA-256 compression engine; HMAC (RFC 2104) inner/outer key padding and demonstration of Length Extension Attacks; Birthday Paradox collision bounds ($B \approx 1.177 \sqrt{2^b}$); DSA / ECDSA digital signatures; X.509 PKI certificate chain of trust validator.
  - *Module 4 (M4 · 8 Hours):* Formal comparison of Bell-LaPadula confidentiality (*No Read-Up, No Write-Down*) vs Biba integrity (*No Read-Down, No Write-Up*); Buffer Overflow memory visualizer demonstrating stack canary detection (StackGuard) and Non-Executable Stack (DEP/NX) enforcement; WebAuthn (FIDO2) phishing-resistant challenge-response; NIST SP 800-63B password entropy calculator.
- **Visual:** Buffer overflow stack memory diagram and Bell-LaPadula vs Biba state matrix.

---

## Slide 6: Modules 5 & 6 — Network Defense & Emerging Threats
- **Speaker:** Student 4
- **Key Talking Points:**
  - *Module 5 (M5 · 10 Hours):* 5-Tuple ACL packet filter; Stateful TCP connection tracking (Conntrack) table; TCP SYN Flood defense via RFC 4987 stateless 32-bit SYN cookies; Snort signature regex matching; Shannon entropy analysis for DNS Tunneling detection; NIST Zero Trust Architecture (ZTA) dynamic policy evaluator.
  - *Module 6 (M6 · 7 Hours):* Kerberos v5 3-step ticket exchange (AS $\rightarrow$ TGS $\rightarrow$ AP) with replay detection; TLS 1.2 vs 1.3 flight explorer (2-RTT vs 1-RTT latency reduction); IPsec packet header dissector (Authentication Header [AH] vs Encapsulating Security Payload [ESP]); OpenPGP 5-step pipeline with ASCII armor; Machine learning network flow anomaly classifier with SOAR playbook triggers.
- **Visual:** SYN Cookie 32-bit ISN decomposition diagram and TLS 1.3 1-RTT flight comparison.

---

## Slide 7: Classroom Presentation Mode (`[P]`) & Guided Lessons
- **Speaker:** Student 5
- **Key Talking Points:**
  - *Three-Layer Pedagogical Framework:* Every concept is structured through `<GuidedLesson>`:
    1. **Picture it:** Concrete physical analogy.
    2. **See it work:** Animated step-by-step SVG diagram.
    3. **Say it in exam words:** University-standard formal definition.
  - *Fullscreen Presentation Mode:* Activated by pressing `[P]` on any module page. Tailored for lecture hall projectors with high-contrast text, speaker notes drawer, and keyboard slide controls (`[←]`, `[→]`, `[Esc]`).
- **Visual:** Split-view of Guided Lesson scrollytelling and fullscreen Presentation Mode slide deck.

---

## Slide 8: Continuous Academic Evaluation & Campus Portals
- **Speaker:** Student 5
- **Key Talking Points:**
  - *Institutional 135-Mark Evaluation Framework:*
    $$\text{Total} = \text{ISE}_1 (20) + \text{FA}_1 (25) + \text{ISE}_2 (20) + \text{ISE}_3 (20) + \text{FA}_2 (25) + \text{Term Work} (25) = 135$$
  - *Student Portal (`/student`):* Multi-subject continuous evaluation statement, calculated percentage, predicted university grade (O, A+, A), SGPA band estimation, and syllabus timeline.
  - *Faculty Gradebook (`/teacher`):* Live editable marks spreadsheet with auto-saving to local storage, passing/distinction analysis, and one-click CSV export.
  - *Portion Progression Engine:* Setting completed teaching to Topic $N$ automatically unlocks up to Topic $N+3$ notes for student pre-reading.
- **Visual:** Multi-Subject Continuous Evaluation Ledger and Portion Milestone Bar.

---

## Slide 9: Assessment Engine & Bloom's Taxonomy Diagnostics
- **Speaker:** Student 6
- **Key Talking Points:**
  - *Four Evaluation Modes:* Self-Test Mode, Numerical Lab with scratchpad, Speed Drill, and a 45-Question Full Syllabus Mock Exam.
  - *In-Window Ink-Stamp Evaluation:* Replaces intrusive popups with clean ink-stamped stamps (`CORRECT ✓` / `INCORRECT ✗`), complete answer explanations, and direct slide links ("Show Me ↗").
  - *Diagnostic Reporting:* Post-quiz breakdown mapping student performance across Bloom's cognitive levels: Level 1 (Remember), Level 2 (Understand), Level 3 (Apply), Level 4 (Analyze).
  - *Mobile Optimization:* 100% responsive down to 360px viewport with horizontal touch-scrollable tab bars and full-width touch buttons.
- **Visual:** Ink-stamp verification badge and Bloom's Taxonomy radial diagnostic report.

---

## Slide 10: Quality Verification, Live Demo & Conclusion
- **Speaker:** Team (Led by Student 6)
- **Key Talking Points:**
  - *Zero-Defect Quality Standard:* **183 automated tests passed** (125 Vitest unit tests + 58 Playwright end-to-end tests). Zero console errors, zero hydration mismatches, 100% pass rate.
  - *Conclusion:* TCET LMS successfully digitizes the Computer Network Security curriculum, elevating classroom engagement and continuous academic tracking.
- **Action:** Transition to live application demonstration on `localhost:3000` (or Vercel production deployment).
- **Floor Opened for Faculty Viva & Q&A.**
