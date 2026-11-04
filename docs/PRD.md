# Product Requirements Document (PRD)

## Project: TCET LMS · Computer Network Security (CNS) Academic Platform
- **Course Code:** `CSC602` (Semester VI, Third Year B.Tech)
- **Institution:** Thakur College of Engineering & Technology (Autonomous), affiliated with University of Mumbai
- **Department:** Computer Engineering (CMPN) & Information Technology (INFT)
- **Target Audience:** Engineering Students, Faculty Examiners, and University Evaluators

---

## 1. Context & Problem Statement

### 1.1 Academic Context
Computer Network Security (CNS) is a core theoretical and laboratory course in Mumbai University's Third-Year computer engineering curriculum. Students frequently struggle with:
1. **Mathematical Abstraction:** Algorithms such as RSA modular exponentiation, Diffie-Hellman key exchange, Elliptic Curve point multiplication, and HMAC padding are taught statically through equations without visual or mechanical intuition.
2. **Disconnected Lab & Theory Portions:** Laboratory assignments often involve disconnected command-line exercises, leaving students unable to correlate theoretical protocol headers (e.g. TLS 1.3 flights or IPsec encapsulation) with live packet behavior.
3. **Fragmented Academic Assessment:** Continuous evaluation marks (ISE, FA, Term Work) are traditionally managed in disparate spreadsheets, making it difficult for students to monitor their internal marks progression against university grade bands.

### 1.2 The Solution
TCET LMS CNS is a unified digital platform that merges **curriculum theory (Guided Lessons)**, **algorithmic experimentation (Simulators)**, **formal continuous evaluation (Student & Faculty Portals)**, and **exam assessment (Bloom's Taxonomy-aligned Quiz Engine)** into a zero-configuration, browser-based web application.

---

## 2. User Personas

| Persona | Role | Primary Needs | Key Platform Touchpoints |
|---|---|---|---|
| **Aarav / Dev (Student)** | TE B.Tech CMPN Student (Sem VI) | Master syllabus topics visually, solve numerical problems, take practice quizzes, track continuous evaluation marks. | `/`, `/student`, `/modules/[slug]`, `/quiz`, `/revision` |
| **Prof. S. R. Raman (Faculty)** | Course In-Charge & Faculty Examiner | Project animated diagrams in classroom lectures, manage portion completion timelines, record continuous evaluation marks, review student quiz submissions. | `/teacher`, `/present/[module]/[topic]`, `/timeline` |
| **External Examiner (Viva/Exam)** | University Reviewer | Inspect syllabus coverage, verify student project quality, test student algorithmic understanding in viva examination. | `/revision`, `/modules/[slug]`, `/quiz` |

---

## 3. Core Functional Requirements

### 3.1 FR1: Autonomous Syllabus Restructuring (6 Modules)
The system must provide comprehensive coverage of the six Mumbai University / TCET autonomous syllabus modules:
- **Module 1 (M1): Introduction & Classical Cryptography (5 Hours · Bloom L1–L3)**
- **Module 2 (M2): Block Ciphers & Public Key Cryptography (8 Hours · Bloom L1–L3)**
- **Module 3 (M3): Cryptographic Hashes & Digital Signatures (7 Hours · Bloom L1–L4)**
- **Module 4 (M4): Protection of Computing Resources & System Security (8 Hours · Bloom L1–L3)**
- **Module 5 (M5): Network Security & Defense (10 Hours · Bloom L1–L4)**
- **Module 6 (M6): Network Security Applications & Emerging Threats (7 Hours · Bloom L1–L4)**

### 3.2 FR2: Three-Layer Pedagogical Guided Lessons
Every concept within the 6 modules must implement a structured three-tier pedagogical approach:
1. **Picture it:** A relatable, real-world physical analogy.
2. **See it work:** An interactive, animated step-by-step SVG diagram with playback controls (Back, Next, step dot indicators).
3. **Say it in exam words:** A formal university-standard definition suitable for written examination answers.

### 3.3 FR3: Interactive Security Simulators (Playgrounds)
Every module must provide live, purely client-side algorithmic simulators:
- **M1:** Caesar, Affine, Playfair 5×5 Matrix, Hill Matrix Inversion, Vigenère, Columnar Transposition, Frequency Analysis & Index of Coincidence.
- **M2:** DES 16-round breakdown & Avalanche Effect, AES Substitution-Permutation steps, RSA modular exponentiation with `BigInt`, Diffie-Hellman Key Exchange with MITM simulation, ECC point addition/doubling, ElGamal, Rabin, TEA.
- **M3:** SHA-256 digest engine, HMAC RFC 2104 inner/outer key padding and length extension attack, Birthday collision finder, RSA & ECDSA signatures, X.509 PKI certificate chain of trust validator.
- **M4:** Discretionary vs Mandatory vs Role-Based Access Control (Bell-LaPadula vs Biba decision engine), Buffer Overflow simulator with Stack Canary and DEP/NX defense, WebAuthn (FIDO2) cryptographic challenge-response, NIST SP 800-63B password entropy and cracking time estimator.
- **M5:** 5-Tuple ACL Filter, Stateful TCP Conntrack Table, TCP SYN Flood defense with RFC 4987 SYN Cookies (stateless ACK validation), Snort Signature & Anomaly IDS, DNS Tunneling Shannon Entropy detector, NIST Zero Trust Architecture (ZTA) policy engine.
- **M6:** Kerberos v5 3-step ticketing (AS-REQ/TGS-REQ/AP-REQ) with replay detection, TLS 1.2 vs 1.3 flight explorer and latency comparison, IPsec AH vs ESP packet header dissector, OpenPGP 5-step pipeline with ASCII armor, ML network flow anomaly classifier (Precision, Recall, F1-Score), SOAR playbooks.

### 3.4 FR4: Fullscreen Lecture Hall Presentation Mode (`[P]`)
- Accessible via the `[P]` keyboard shortcut or top navigation button on any syllabus module page.
- Distraction-free, high-contrast slides optimized for projector visibility.
- Includes speaker notes drawer, keyboard navigation (`[←]`, `[→]`, `[Esc]`), and direct quiz launcher.

### 3.5 FR5: Campus Portals & Continuous Academic Evaluation
- **Continuous Evaluation Scheme (135 Marks Total):**
  - In-Semester Evaluation 1 (ISE 1): 20 Marks
  - Formative Assessment 1 (FA 1): 25 Marks
  - In-Semester Evaluation 2 (ISE 2): 20 Marks
  - In-Semester Evaluation 3 (ISE 3): 20 Marks
  - Formative Assessment 2 (FA 2): 25 Marks
  - Term Work (TW): 25 Marks
- **Student Portal (`/student`):**
  - Displays multi-subject continuous evaluation marksheets across enrolled courses.
  - Generates calculated percentage, predicted university grade (O, A+, A), and SGPA band.
  - Portion timeline tracking module coverage.
- **Faculty Gradebook (`/teacher`):**
  - Editable marks ledger supporting inline grade editing, automated saving to local gradebook, and CSV export.
  - Portion completion updater allowing faculty to set covered topics.

### 3.6 FR6: Automated Notes Unlock Rule Engine
- **Academic Unlock Rule:** When faculty complete teaching up to Topic $N$ of a module, the platform automatically unlocks study notes up to Topic $N+3$ for student pre-reading and preparation.

### 3.7 FR7: Quiz Assessment Engine
- Four dedicated assessment modes:
  1. **Self-Test Mode:** Flexible module-wise practice.
  2. **Numerical Lab:** Cryptographic calculations, modular math, and interactive scratchpad.
  3. **Speed Drill:** Rapid-fire timed questions for competitive retention.
  4. **Full Syllabus Mock Exam:** 45-question timed mock test covering all 6 syllabus modules.
- In-window ink-stamp evaluation (`CORRECT ✓` / `INCORRECT ✗`).
- Bloom's Taxonomy analytics tracking mastery across Recall (L1), Understanding (L2), Application (L3), and Analysis (L4).

### 3.8 FR8: Mobile & Touch Ergonomics
- 100% responsive across mobile viewports (360px–414px width).
- Horizontal touch-scrollable tab bars (`overflow-x-auto` pill bars) preventing vertical button stacking.
- Full-width mobile touch targets (minimum 44px height) for thumb tap accessibility.
- Horizontal scroll indicators for wide academic ledger tables.

---

## 4. Non-Functional Requirements

| Metric | Target | Verification Method |
|---|---|---|
| **Performance** | Instant navigation, <1.5s First Contentful Paint | Lighthouse audit, static prerendering of 95 routes |
| **Availability** | 100% offline-ready once loaded | Zero external API calls, client-side execution |
| **Hydration Safety** | 0 React hydration warnings or errors | `useMounted` guard, verified in Playwright test suite |
| **Browser Compatibility** | Chrome, Edge, Firefox, Safari (ES2022+) | Target ES2022 with native `BigInt` support |
| **Test Coverage** | 100% passing automated test suite | 125 Vitest unit tests + 58 Playwright E2E tests |

---

## 5. Non-Goals
1. **No External Database:** Avoids Postgres/MySQL/Prisma overhead. Persistent client data is safely handled via `safeStorage` LocalStorage wrappers.
2. **No Real Malicious Attacks:** The platform strictly provides educational simulations; no real network packets are transmitted, avoiding ethical or network security violations in campus computer labs.
