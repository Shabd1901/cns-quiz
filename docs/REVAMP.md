# TCET LMS Engineering Evolution & Revamp History (v1 → v2)

## 1. Evolution Overview

The **TCET LMS Computer Network Security (CNS)** platform originated as a simple, static prototype. Through eight systematic engineering iterations, it evolved into an institutional-grade learning management and continuous evaluation platform aligned with the autonomous syllabus of Thakur College of Engineering & Technology (University of Mumbai).

```
Project Evolution Roadmap
├── Phase 1: Prototype Audit & Hydration Recovery
├── Phase 2: "The Lab Notebook" Visual Design System
├── Phase 3: Autonomous University Syllabus Restructuring (M1–M6)
├── Phase 4: Three-Layer Pedagogical System & Presentation Mode ([P])
├── Phase 5: Campus Portals & Continuous Academic Evaluation
├── Phase 6: Assessment Engine v2 & Bloom's Taxonomy Diagnostics
├── Phase 7: Mobile & Phone Touch Ergonomics (360px Viewport)
└── Phase 8: Comprehensive Automated Testing Harness (183 Tests)
```

---

## 2. Detailed Phase Breakdown

### Phase 1: Prototype Audit & Hydration Recovery
- **Original Defects:**
  - Site buttons were unresponsive on production builds due to SSR hydration mismatches caused by reading `window` or `localStorage` during initial component render passes.
  - Text-heavy lesson pages without visual diagrams or step-by-step progressions.
  - Broken superscripts in mathematical equations (e.g. `C = Me mod n` instead of $C = M^e \pmod n$).
  - Icon rendering bugs where missing icon fonts displayed literal `?` characters.
- **Engineering Solutions:**
  - Introduced `useMounted()` hook and `safeStorage` adapter to guarantee neutral default rendering on both server and client before rehydrating stored state.
  - Replaced ad-hoc icons with structured SVGs from `lucide-react`.

### Phase 2: "The Lab Notebook" Visual Design System Overhaul
- **Aesthetic Direction:** Modeled after physical engineering laboratory notebooks combined with precision electronic calibration instruments.
- **Design Tokens (`src/styles/tokens.css`):**
  - `--paper`: `#F4F1EA` (light) / `#0E1116` (dark)
  - `--card`: `#FBF9F4` (light) / `#151A21` (dark)
  - `--ink`: `#16130F` (light) / `#ECE8DF` (dark)
  - `--ink-soft`: `#5D574C` (light) / `#9A958A` (dark)
  - `--rule`: `#D9D3C5` (light) / `#2A313B` (dark)
  - `--signal`: `#E5390F` (light) / `#FF5A2C` (dark)
  - `--ok`: `#1F7A4D` (light) / `#3CCB82` (dark)
- **Typography:** Instrument Serif for editorial titles, Geist Sans for interface elements, and JetBrains Mono for cryptographic keys, code, and protocol headers.

### Phase 3: Autonomous University Syllabus Restructuring (M1–M6)
- **Problem:** The original 8 prototype modules were arbitrary and unaligned with the official Mumbai University / TCET autonomous scheme for Course Code `CSC602`.
- **Solution:** Reorganized the entire curriculum into 6 accredited syllabus modules:
  - **M1:** Introduction & Classical Cryptography (5 Hours · Bloom L1–L3)
  - **M2:** Block Ciphers & Public Key Cryptography (8 Hours · Bloom L1–L3)
  - **M3:** Cryptographic Hashes & Digital Signatures (7 Hours · Bloom L1–L4)
  - **M4:** Protection of Computing Resources & System Security (8 Hours · Bloom L1–L3)
  - **M5:** Network Security & Defense (10 Hours · Bloom L1–L4)
  - **M6:** Network Security Applications & Emerging Threats (7 Hours · Bloom L1–L4)
- **Backwards Compatibility:** Retained legacy route paths (`/modules/crypto`, `/modules/auth`, etc.) via Next.js dynamic routing fallback switches to ensure zero dead links.

### Phase 4: Three-Layer Pedagogical System & Presentation Mode (`[P]`)
- **Pedagogical Structure:** Introduced `<GuidedLesson>` requiring every syllabus topic to be presented in three tiers:
  1. *Picture it:* Physical, relatable real-world analogy.
  2. *See it work:* Step-by-step animated SVG diagram with dot navigation controls.
  3. *Say it in exam words:* Formal, university-standard definition suitable for written examination answers.
- **Lecture Hall Projector Mode:** Built `<PresenterMode>` triggered by pressing `[P]` or clicking the top rail button. Features high-contrast typography, speaker notes drawer, and full keyboard navigation (`[←]`, `[→]`, `[Esc]`).

### Phase 5: Campus Portals & Continuous Academic Evaluation
- **Continuous Evaluation Ledger:** Implemented the institutional 135-mark framework (ISE 1 [20] + FA 1 [25] + ISE 2 [20] + ISE 3 [20] + FA 2 [25] + Term Work [25] = 135 total marks).
- **Student Portal (`/student`):** Multi-subject internal marks card, percentage calculation, predicted grade (O, A+, A), portion timeline, and personal quiz gradebook.
- **Faculty Portal (`/teacher`):** Editable marks spreadsheet with instant auto-save to browser storage, roster CSV export, and syllabus portion completion manager.
- **Portion Unlock Engine:** Implemented automated rule: completing teaching through Topic $N$ unlocks up to Topic $N+3$ for student pre-reading.
- **Institutional Scope (`/`):** Built a 4-year curriculum matrix on the landing page previewing staged upcoming subjects (DBMS `CSC403`, OS `CSC404`, AI `AIC501`, CN `CSC503`).

### Phase 6: Assessment Engine v2 & Bloom's Taxonomy Diagnostics
- **Quiz Hub (`/quiz`):** Replaced simplistic team setup with four dedicated assessment modes:
  - *Self-Test Mode:* Flexible practice with immediate feedback.
  - *Numerical Lab:* Scratchpad interface for calculation-intensive problems.
  - *Speed Drill:* Rapid-fire timed challenge.
  - *Full Syllabus Mock Exam:* 45-question comprehensive semester mock test.
- **In-Window Ink-Stamp Evaluation:** Replaced browser `alert()` popups with inline ink-stamped stamps (`CORRECT ✓` in green / `INCORRECT ✗` in red), complete explanations, and direct lecture slide navigation ("Show Me ↗").
- **Bloom's Taxonomy Analytics:** Post-quiz diagnostic reports breaking down student mastery across Level 1 (Remember), Level 2 (Understand), Level 3 (Apply), and Level 4 (Analyze).

### Phase 7: Mobile & Phone Touch Ergonomics (360px Viewport)
- **Horizontal Touch-Scroll Pill Containers:** Replaced vertically stacked tab buttons across module playgrounds (e.g. 18 tabs in Cryptography) and campus portals with smooth horizontal touch-scrolling bars (`overflow-x-auto pb-2 scrollbar-none flex-nowrap shrink-0 whitespace-nowrap`).
- **Touch Target Ergonomics:** Made action buttons full-width (`w-full sm:w-auto`) with minimum 44px tap targets for thumb reachability on mobile devices, hiding desktop hotkey cues (`[Space]`, `[Enter]`).
- **Ledger Table Cues:** Added horizontal swipe indicators (`← Swipe table horizontally →`) and mobile-friendly card padding (`p-4 sm:p-6`) for wide gradebook tables.

### Phase 8: Comprehensive Automated Testing Harness
- **Unit Suite:** 125 Vitest tests validating mathematical correctness of all cryptographic ciphers, hash paddings, Bell-LaPadula vs Biba decisions, and RFC 4987 SYN cookies.
- **End-to-End Suite:** 58 Playwright tests verifying all 12 core routes, mobile viewports at 360px width, presenter mode hotkeys, and full assessment quiz runs.
- **Zero-Error Standard:** Enforced zero console errors and zero hydration mismatches across every test run.
