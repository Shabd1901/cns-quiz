# TCET LMS · Cybersecurity & Network Security (CNS) Academic Platform

[![Next.js 16](https://img.shields.io/badge/Next.js-16.4.3-black?style=flat&logo=next.js)](https://nextjs.org/)
[![React 19](https://img.shields.io/badge/React-19.3.0-blue?style=flat&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?style=flat&logo=tailwind-css)](https://tailwindcss.com/)
[![Vitest](https://img.shields.io/badge/Vitest-125_Passed-6E9F18?style=flat&logo=vitest)](https://vitest.dev/)
[![Playwright](https://img.shields.io/badge/Playwright-58_Passed-2EAD33?style=flat&logo=playwright)](https://playwright.dev/)

An interactive, university syllabus-aligned digital learning and continuous evaluation platform for **Computer Network Security (CNS)**, developed for the Autonomous Academic Curriculum at **Thakur College of Engineering & Technology (TCET)**, affiliated with the University of Mumbai.

The application combines a high-contrast **"Lab Notebook"** visual design system, **scrollytelling guided lessons**, **algorithmic simulator playgrounds**, a **fullscreen presentation mode for lecture halls**, a **Bloom's Taxonomy-aligned quiz engine**, and **integrated campus portals** for students and faculty.

---

## 🌟 Key Features

### 1. Six University Syllabus Modules (TCET / Mumbai University Autonomous Scheme)
Strictly mapped to course code **CSC602** (Semester VI, Third Year B.Tech):
- **Module 1: Introduction & Classical Cryptography (5 Hours · Bloom L1–L3)**
  - OSI Security Architecture (X.800 services & mechanisms), symmetric cipher model, cryptanalysis (frequency analysis & Index of Coincidence).
  - *Interactive Simulators:* Caesar, Affine, Playfair 5×5 Matrix, Hill Matrix Inversion (mod 26), Vigenère Polyalphabetic, Columnar Transposition.
- **Module 2: Block Ciphers & Public Key Cryptography (8 Hours · Bloom L1–L3)**
  - Feistel cipher structure, DES 16-round breakdown & avalanche effect, AES Substitution-Permutation Network (SubBytes, ShiftRows, MixColumns, AddRoundKey), block cipher modes (ECB, CBC, CFB, OFB, CTR).
  - *Interactive Simulators:* DES & AES step visualizers, RSA KeyGen & modular exponentiation (`BigInt`), Diffie-Hellman Key Exchange with Man-in-the-Middle (MITM) exploit, Elliptic Curve Cryptography (ECC point addition/doubling over finite fields), ElGamal, Rabin, and TEA.
- **Module 3: Cryptographic Hashes & Digital Signatures (7 Hours · Bloom L1–L4)**
  - Cryptographic hash properties (pre-image, second pre-image, collision resistance), MD5 vs SHA-256 vs SHA-512 Merkle-Damgård construction, Birthday Paradox collision attack bounds, HMAC (RFC 2104).
  - *Interactive Simulators:* SHA-256 digest engine, HMAC padding and length extension attack, Birthday collision finder, RSA & ECDSA digital signatures, X.509 PKI certificate chain of trust validator.
- **Module 4: Protection of Computing Resources & System Security (8 Hours · Bloom L1–L3)**
  - Access control matrices, Discretionary vs Mandatory vs Role-Based Access Control (DAC, MAC, RBAC), Bell-LaPadula confidentiality model vs Biba integrity model.
  - *Interactive Simulators:* Bell-LaPadula vs Biba decision engine, Buffer Overflow sandbox with Stack Canaries and DEP/NX execution defense, WebAuthn (FIDO2) phishing-resistant challenge-response, NIST SP 800-63B password entropy and dictionary attack estimator.
- **Module 5: Network Security & Defense (10 Hours · Bloom L1–L4)**
  - Perimeter defense, stateless packet filters, stateful connection tracking (conntrack), DMZ subnet architecture, DoS/DDoS amplification, Snort rule syntax.
  - *Interactive Simulators:* 5-Tuple ACL Packet Filter, Stateful TCP Conntrack Table, TCP SYN Flood defense via RFC 4987 SYN Cookies (stateless ACK validation), Snort Signature & Anomaly IDS, DNS Tunneling Shannon Entropy detector, NIST Zero Trust Architecture (ZTA) policy engine.
- **Module 6: Network Security Applications & Emerging Threats (7 Hours · Bloom L1–L4)**
  - Authentication protocols, Kerberos v5 ticket-granting workflow, SSL/TLS 1.2 vs 1.3 protocol architecture, IPsec (AH & ESP), secure email (PGP RFC 4880 & S/MIME).
  - *Interactive Simulators:* Kerberos v5 3-step ticketing (AS-REQ/TGS-REQ/AP-REQ) with replay detection, TLS 1.2 vs 1.3 flight explorer and latency comparison, IPsec AH vs ESP packet header dissector, OpenPGP 5-step pipeline with ASCII armor, ML network flow anomaly classifier (Precision, Recall, F1-Score), SOAR playbooks.

### 2. Campus Portals & Continuous Academic Evaluation
- **Student Dashboard (`/student`):**
  - Multi-Subject Internal Continuous Evaluation Marks Sheet (ISE 1 [20] + FA 1 [25] + ISE 2 [20] + ISE 3 [20] + FA 2 [25] + Term Work [25] = 135 total marks).
  - Semester VI Course Portion Timeline with automated notes unlock progression (Rule: teacher completes Topic $N \rightarrow$ unlocks up to Topic $N+3$ for pre-reading).
  - Personal Lab Quiz Gradebook with timestamped submissions, accuracy percentages, and Bloom performance breakdown.
- **Faculty Gradebook (`/teacher`):**
  - Editable continuous evaluation ledger across enrolled engineering students with live CSV export and printable statements.
  - Portion progress manager: update syllabus completion with instant student unlocks.
  - Lab Quiz Submission Ledger: review student assessment attempts, scores, and completion times.
- **Institutional Scope Matrix (`/`):**
  - 4-Year Engineering Curriculum Matrix covering FE (Sem I & II), SE (Sem III & IV), TE (Sem V & VI - Active Pilot), and BE (Sem VII & VIII).
  - Roadmap preview of staged upcoming departmental subjects: DBMS (`CSC403`), OS (`CSC404`), AI & Data Science (`AIC501`), Computer Networks (`CSC503`).

### 3. Assessment & Revision Engine
- **Module Quizzes & Assessment Hub (`/quiz`):**
  - Four assessment modes: **Self-Test Mode** (flexible learning), **Numerical Lab** (cryptographic calculations & scratchpad), **Speed Drill** (rapid-fire timer), and **Full Syllabus Mock Exam** (comprehensive 45-question test).
  - Instant in-window verification, ink-stamp results (`CORRECT ✓` / `INCORRECT ✗`), comprehensive explanations, and one-click navigation to relevant lecture slides ("Show Me ↗").
  - Bloom's Taxonomy analytics tracking mastery across Recall (L1), Understanding (L2), Application (L3), and Analysis (L4).
- **Exam Revision & Mastery Hub (`/revision`):**
  - 45-Hour University Syllabus Coverage Tracker.
  - Per-Module Rapid Revision Cheat Sheets with key formulas and exam rubrics.
  - Master Formula Sheet (modular arithmetic, Feistel rounds, RSA keys, hash lengths, entropy equations).
  - Top 25 Viva Questions with concise, examiner-focused answers.

### 4. Classroom Presentation Mode (`[P]`)
- Fullscreen projector-friendly presentation deck for every syllabus topic (`/present/[module]/[topic]`).
- Clean typography, high-contrast diagrams, slide controls, speaker notes drawer, and presentation hotkeys (`[P]`, `[←]`, `[→]`, `[Esc]`).

### 5. Mobile & Touch Optimization
- Fully responsive from desktop monitors down to 360px smartphone screens.
- Horizontal touch-scrollable tab navigation (`overflow-x-auto` pill bars) preventing vertical button stacking.
- Ergonomic 44px+ touch targets and swipe affordances for wide continuous evaluation tables.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Framework** | [Next.js 16.4.3](https://nextjs.org/) (App Router, Turbopack, Partial Prerendering) |
| **Language** | [TypeScript 5](https://www.typescriptlang.org/) (ES2022 Target with native `BigInt` support) |
| **UI Library** | [React 19.3.0](https://react.dev/) |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/) + Custom "Lab Notebook" CSS Design Tokens |
| **Icons** | [Lucide React](https://lucide.dev/) |
| **Motion** | [Framer Motion](https://www.framer.com/motion/) |
| **State & Storage** | [Zustand](https://github.com/pmndrs/zustand) with SSR-safe hydration wrappers (`safeStorage`) |
| **Unit Testing** | [Vitest](https://vitest.dev/) (125 tests covering cryptographic and security solvers) |
| **E2E Testing** | [Playwright](https://playwright.dev/) (58 tests covering routes, mobile viewports, presenter mode, quizzes) |

---

## 📂 Project Structure

```text
cns-lab/
├── docs/                       # Project documentation, TRD, PRD, architecture, and Viva guides
│   ├── ARCHITECTURE.md         # Full system architecture and state flow
│   ├── PRD.md                  # Product requirements and university syllabus mapping
│   ├── TRD.md                  # Technical specification and simulator algorithms
│   ├── REPORT.md               # Formal university project evaluation report
│   ├── REVAMP.md               # Engineering roadmap and design system changelog
│   ├── AUDIT.md                # Quality assurance, hydration fix, and audit records
│   ├── VIVA.md                 # Comprehensive Viva preparation guide (M1–M6)
│   ├── ASSUMPTIONS.md          # Technical constraints and architectural decisions
│   └── PPT_OUTLINE.md          # 10-slide team presentation outline
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── page.tsx            # TCET LMS home page & 4-year curriculum matrix
│   │   ├── layout.tsx          # Root layout, theme providers, and font definitions
│   │   ├── login/              # Student and faculty role authentication
│   │   ├── student/            # Student portal: multi-subject marks, timeline & gradebook
│   │   ├── teacher/            # Faculty portal: marks upload, portion progress & quiz ledger
│   │   ├── timeline/           # Standalone academic portion coverage timeline
│   │   ├── revision/           # Revision hub: syllabus tracker, cheat sheets, formulas
│   │   ├── quiz/               # Quiz hub & /quiz/[mode]/play assessment runner
│   │   ├── present/            # Fullscreen lecture presentation mode: /[module]/[topic]
│   │   └── modules/[slug]/     # Dynamic module views (M1–M6 + legacy route fallbacks)
│   ├── components/             # Reusable UI components
│   │   ├── academic/           # StudentMarksView, AcademicTimelineView
│   │   ├── layout/             # Navbar, ModuleShell, GuidedLesson, PresenterMode
│   │   ├── quiz/               # QuizPlayer v2, AssessmentResults, BloomAnalytics
│   │   └── ui/                 # Card, Button, Tabs, Callouts (Lab Notebook theme)
│   ├── lib/                    # Pure TypeScript algorithmic security solvers & state stores
│   │   ├── academicStore.ts    # Student marks, subject codes, portion milestones store
│   │   ├── authStore.ts        # Role-based auth (Student & Faculty profiles)
│   │   ├── quizRecordsStore.ts # Assessment submission ledger & history
│   │   ├── syllabus.ts         # University 6-module curriculum definitions & topic trees
│   │   ├── crypto/             # Classical ciphers, RSA BigInt, ECC, hashes, PKI
│   │   ├── security/           # Bell-LaPadula, Biba, Buffer Overflow, WebAuthn, ZTA
│   │   ├── network/            # Stateful conntrack, SYN cookies, packet dissector
│   │   └── auth/               # Password entropy, TOTP, dictionary matching
│   └── data/                   # Assessment questions & Bloom taxonomy mappings
└── tests/                      # Automated test harness
    ├── unit/                   # 125 Vitest tests for all algorithmic solvers
    └── *.spec.ts               # 58 Playwright tests (smoke, mobile-smoke, present, quiz)
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18.x or 20.x+
- `npm` (Package manager of choice)

### Local Development Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/dev7shah/cns-quiz.git
   cd cns-quiz
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the local development server:**
   ```bash
   npm run dev
   ```

4. **Open in browser:**
   Navigate to [http://localhost:3000](http://localhost:3000).

### Available Scripts

| Command | Action |
|---|---|
| `npm run dev` | Starts Next.js development server with Turbopack |
| `npm run build` | Builds optimized production bundle (generates 95 static routes) |
| `npm start` | Starts production server locally |
| `npm test` | Runs both Vitest unit tests and Playwright E2E tests |
| `npm run test:unit` | Runs the 125 Vitest unit tests |
| `npm run test:e2e` | Runs the 58 Playwright end-to-end tests |

---

## 🧪 Test Verification & Quality Assurance

The codebase maintains a zero-tolerance policy for runtime crashes, hydration mismatches, and broken navigation.

```bash
# Run complete test harness
npm test
```

- **Unit Solvers (125/125 Passed):**
  - M1 Classical Ciphers & Cryptanalysis (Caesar, Affine, Playfair, Hill, Transposition).
  - M2 Block Ciphers & Public Key (DES, AES, RSA, Diffie-Hellman, ECC).
  - M3 Hashes, HMAC, Birthday Bounds, DSA, X.509 PKI Chain Validation.
  - M4 Access Control (Bell-LaPadula vs Biba), Buffer Overflow canary/DEP, WebAuthn FIDO2.
  - M5 5-Tuple ACL Filter, Stateful Conntrack, SYN Cookies RFC 4987, Shannon Entropy, Zero Trust.
  - M6 Kerberos v5 3-step ticketing, TLS handshake latencies, IPsec dissectors.
- **End-to-End Suite (58/58 Passed):**
  - Smoke tests across all 12 core and legacy routes with zero console errors.
  - 15 mobile tests on a 360px viewport verifying horizontal swipeable tabs and touch navigation.
  - Presenter Mode keyboard hotkey tests (`[P]`, `[←]`, `[→]`, `[Esc]`).
  - Quiz Assessment Engine end-to-end question flow and ink-stamp evaluation.

---

## 🏛️ Institutional Alignment

- **Institution:** Thakur College of Engineering & Technology (TCET), Mumbai
- **Course:** Computer Network Security (CNS) · Course Code: `CSC602`
- **Department:** Department of Computer Engineering (CMPN) / Information Technology (INFT)
- **Pedagogical Alignment:** Bloom's Revised Taxonomy (Level 1 Remember through Level 4 Analyze)
- **Continuous Evaluation:** 135 Total Marks (ISE 1 [20] + FA 1 [25] + ISE 2 [20] + ISE 3 [20] + FA 2 [25] + Term Work [25])

---

## 📄 License & Attribution

Developed for academic presentation and educational purposes. Distributed under the MIT License.
