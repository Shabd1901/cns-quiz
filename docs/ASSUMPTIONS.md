# Technical Constraints & Architectural Assumptions Record

## 1. Overview

During the design, engineering, and verification of the **TCET LMS Computer Network Security (CNS)** academic platform, the following technical constraints, environmental assumptions, and pedagogical boundaries were established:

---

## 2. Technical & Environmental Assumptions

### 2.1 Zero-Backend, Client-Side Deterministic Execution
- **Assumption:** The application will operate without a dedicated server-side database (e.g. PostgreSQL, MongoDB) or external API gateways.
- **Rationale & Implementation:**
  - Ensures 100% offline functionality in university computer laboratories where external internet access may be restricted or firewalled.
  - Guarantees zero recurring server hosting costs for the academic department.
  - All mathematical solvers (RSA modular exponentiation, Diffie-Hellman key derivation, HMAC padding, AES MixColumns) are implemented in pure TypeScript within `src/lib/`.
  - State persistence (student continuous evaluation marks, active role sessions, quiz records) is handled through browser `localStorage` wrapped with an SSR-safe `safeStorage` adapter.

### 2.2 Safe Educational Simulation vs. Destructive Exploits
- **Assumption:** The goal of the platform is pedagogical understanding, not the deployment of malicious tooling.
- **Rationale & Implementation:**
  - No real network scanning, raw packet transmission, or remote exploit code is executed.
  - Network components (e.g. 5-Tuple ACL packet filter, TCP SYN flood RFC 4987 cookies, Snort rules, IPsec dissector) simulate protocol behavior using deterministic in-memory state machines.
  - Memory vulnerabilities (Buffer Overflow) are emulated in an educational virtual stack model (`src/lib/security/bufferOverflow.ts`), demonstrating stack canary integrity checks and non-executable stack flags without risking machine stability.

### 2.3 Client-Side Role-Based Campus Authentication
- **Assumption:** Institutional access control can be simulated client-side for academic presentation, portfolio evaluation, and classroom demonstrations.
- **Rationale & Implementation:**
  - The application provides distinct role perspectives for **Students** (`/student`) and **Faculty** (`/teacher`).
  - To prevent evaluation friction during live examiner demonstrations, the platform includes a **1-Click Demo Access** button on login screens, allowing instant evaluation without requiring manual credential registration.
  - Session state persists under the `cns-auth-session` key and hydrates cleanly without React hydration mismatch warnings.

### 2.4 Modern Web Engine & JavaScript Primitives (`BigInt`)
- **Assumption:** Students, faculty, and university examiners will access the web application through modern evergreen browsers (Google Chrome 90+, Microsoft Edge 90+, Mozilla Firefox 88+, Apple Safari 15+) or mobile browser equivalents released after 2021.
- **Rationale & Implementation:**
  - Module 2 (RSA Cryptography) requires high-precision arithmetic for 2048-bit prime numbers and modular exponentiation. Standard JavaScript IEEE-754 64-bit numbers (`Number`) lose precision beyond $2^{53} - 1$.
  - The build pipeline targets `ES2022`, utilizing native JavaScript `BigInt` primitives across all asymmetric cryptographic solvers.

### 2.5 Static Site Pre-Rendering (SSG) on Next.js 16
- **Assumption:** The production application should be deployable to static edge hosting environments (such as Vercel or GitHub Pages) with zero runtime server configuration.
- **Rationale & Implementation:**
  - The dynamic route `src/app/modules/[slug]/page.tsx` utilizes `generateStaticParams()` to pre-render all 6 university syllabus routes (`classical`, `block-public-key`, `hash-signatures`, `computing-resources`, `network-security`, `security-applications`) as well as 8 legacy route fallbacks (`crypto`, `auth`, `firewall`, `ids`, `tls`, `cloud`, `attacks`, `ai`), yielding 95 fully optimized static HTML pages at compile time.

### 2.6 Mumbai University / TCET Autonomous Curriculum Scheme
- **Assumption:** The curriculum structure must follow the official Autonomous Course Code `CSC602` for Semester VI Third-Year Computer Engineering / Information Technology.
- **Rationale & Implementation:**
  - The six modules adhere to accredited hour allocations (5h, 8h, 7h, 8h, 10h, 7h).
  - The continuous evaluation ledger in the Faculty Gradebook strictly models the **135 Total Marks** framework: ISE 1 (20) + FA 1 (25) + ISE 2 (20) + ISE 3 (20) + FA 2 (25) + Term Work (25).

### 2.7 Mobile-First Touch Ergonomics
- **Assumption:** Students access course revision materials, formula sheets, and practice quizzes on smartphones.
- **Rationale & Implementation:**
  - Viewports down to 360px width are fully supported without horizontal document overflow (`scrollWidth <= innerWidth`).
  - Dense tab navigation bars support horizontal touch scrolling (`overflow-x-auto pb-2 scrollbar-none flex-nowrap shrink-0`).
  - Primary quiz action buttons expand to full viewport width (`w-full sm:w-auto`) for ergonomic single-thumb interaction.
