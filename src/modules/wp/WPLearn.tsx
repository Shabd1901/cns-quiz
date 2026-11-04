"use client"

import React, { useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { WPModuleId, getWPModule } from "@/lib/syllabus/wpSyllabus"
import { Presentation, ArrowRight, Lightbulb, ShieldCheck, AlertCircle, BookMarked, Code2, CheckCircle2, Layers, Cpu, Database, Server, Globe } from "lucide-react"
import { useAcademicStore } from "@/lib/academicStore"

interface DeepDiveContent {
  analogy: string
  mechanics: string
  examAnswer: string
  watchOut: string
  visualLabel: string
  visualDiagram: React.ReactNode
}

const WP_DEEP_DIVES: Record<WPModuleId, DeepDiveContent> = {
  'wp-m1': {
    analogy: "Think of an HTML5 document like constructing a modern commercial building: Semantic tags (header, nav, main, article, footer) form the steel structural skeleton with clear architectural blueprints for building inspectors (screen readers & search engines). The CSS Box Model is the physical shipping crate containing a fragile vase: the vase is your content, bubble wrap is the padding, the wooden crate is the border, and the safety clearance buffer required between crates on the freight truck is the margin.",
    mechanics: "The browser parses HTML into the Document Object Model (DOM) and CSS into the CSS Object Model (CSSOM), combining them into a Render Tree. Layout (Reflow) computes the exact geometric coordinates of each element according to the Box Model (`box-sizing: border-box` integrates padding and border into the specified width). Flexbox operates on a one-dimensional flex container (main axis vs cross axis), while CSS Grid establishes a two-dimensional grid coordinate system using fractional (`fr`) tracks and named template areas.",
    examAnswer: "HTML5 semantic markup (header, nav, section, article, aside, footer) replaces non-semantic <div> tags to improve document accessibility (a11y) and SEO parsing. The CSS Box Model governs rendered element dimensions as: Total Width = Content Width + 2×Padding + 2×Border + 2×Margin (for content-box) or specified width + 2×Margin (for border-box). Modern layouts leverage Flexbox for 1D component distribution and CSS Grid for 2D macro-layouts, styled adaptively via CSS3 media queries using mobile-first breakpoints.",
    watchOut: "Default CSS `box-sizing: content-box` causes elements to expand beyond their specified `width` when padding or borders are added, frequently breaking responsive multi-column layouts. Always apply `*, *::before, *::after { box-sizing: border-box; }` globally in production.",
    visualLabel: "CSS Box Model & 1D vs 2D Layout Geometry",
    visualDiagram: (
      <div className="space-y-4">
        {/* Box Model Layers */}
        <div className="border border-ink bg-paper p-3 text-xs font-mono">
          <div className="text-center font-bold text-signal mb-1">MARGIN (Outer Spacing)</div>
          <div className="border border-dashed border-ink/60 bg-rule/30 p-3">
            <div className="text-center font-bold text-ink-soft mb-1">BORDER (Physical Stroke)</div>
            <div className="border border-ink bg-card p-3">
              <div className="text-center font-bold text-ok mb-1">PADDING (Inner Buffer)</div>
              <div className="border border-signal bg-signal/10 p-4 text-center font-bold text-signal">
                CONTENT (Width × Height)
              </div>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
          <div className="border border-rule bg-card p-2 text-center">
            <span className="text-signal font-bold">Flexbox (1D):</span> Main Axis (Row/Col)
          </div>
          <div className="border border-rule bg-card p-2 text-center">
            <span className="text-signal font-bold">CSS Grid (2D):</span> Rows + Columns (fr units)
          </div>
        </div>
      </div>
    )
  },
  'wp-m2': {
    analogy: "JavaScript's runtime is like a bustling high-end restaurant: The Call Stack is the Head Chef who can only prepare one dish at a time (Single-Threaded). Web APIs (timers, network requests, DOM events) are the kitchen assistants who run to the market or wait on the oven outside the kitchen. When done, they place order tickets into two lines: the Microtask Queue (VIP urgent orders: Promises, `queueMicrotask`) and the Macrotask Queue (regular orders: `setTimeout`, `setInterval`). The Event Loop is the head waiter constantly checking: 'Is the Head Chef free? If yes, drain ALL VIP microtasks first, then serve one regular macrotask!'",
    mechanics: "JavaScript executes inside a single-threaded runtime environment powered by an execution context stack (Global Context + Function Contexts). Memory management utilizes a Heap for dynamically allocated objects and a Stack for primitive values and execution frames. Asynchronous operations delegate to browser Web APIs or libuv. When async operations settle, their callbacks enter the Microtask Queue (resolved Promises, `async/await`) or Macrotask Queue (`setTimeout`, DOM events). The Event Loop executes microtasks to completion immediately after each call stack tick before processing the next macrotask.",
    examAnswer: "JavaScript is a single-threaded, non-blocking, asynchronous concurrent runtime. Variable scoping is governed by `var` (function-scoped, hoisted with undefined), `let` (block-scoped, Temporal Dead Zone), and `const` (immutable binding). The Event Loop continuously monitors the Call Stack; when empty, it drains all jobs from the Microtask Queue (Promise handlers, mutation observers) before taking the next task from the Macrotask Callback Queue (setTimeout, I/O).",
    watchOut: "Microtask Starvation: If code continuously enqueues microtasks (e.g. recursive Promise chains), the Event Loop will drain them indefinitely, starving the Macrotask Queue and rendering the browser UI completely frozen.",
    visualLabel: "JavaScript Concurrency Model & Event Loop Sequence",
    visualDiagram: (
      <div className="space-y-3 font-mono text-xs">
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="border border-ink bg-card p-2">
            <div className="text-[10px] text-ink-soft uppercase font-bold">1. Call Stack</div>
            <div className="text-signal font-bold mt-1">LIFO (Single Thread)</div>
            <div className="text-[10px] text-ink-soft">Current Frame</div>
          </div>
          <div className="border border-rule bg-paper p-2">
            <div className="text-[10px] text-ink-soft uppercase font-bold">2. Web APIs</div>
            <div className="text-ink font-bold mt-1">fetch, timer, DOM</div>
            <div className="text-[10px] text-ink-soft">Background Worker</div>
          </div>
          <div className="border border-signal bg-signal/10 p-2">
            <div className="text-[10px] text-signal uppercase font-bold">3. Event Loop</div>
            <div className="text-signal font-bold mt-1">Stack == 0 ?</div>
            <div className="text-[10px] text-ink-soft">Tick Monitor</div>
          </div>
        </div>
        <div className="p-2 border border-rule bg-card space-y-1">
          <div className="flex justify-between items-center text-[11px]">
            <span className="font-bold text-ok">Microtask Queue (High Priority):</span>
            <span className="text-[10px] text-ink-soft">Promises, async/await (Drained fully)</span>
          </div>
          <div className="flex justify-between items-center text-[11px]">
            <span className="font-bold text-signal">Macrotask Queue (Normal Priority):</span>
            <span className="text-[10px] text-ink-soft">setTimeout, setInterval (One per tick)</span>
          </div>
        </div>
      </div>
    )
  },
  'wp-m3': {
    analogy: "React is like an architect drawing construction blueprints: Instead of hiring a demolition crew to knock down and rebuild a brick wall every time you change a paint color (Real DOM manipulation is slow and triggers costly reflows), React drafts a lightweight pencil sketch on paper (Virtual DOM). When state changes, React draws a second pencil sketch, compares the two drafts with a magnifying glass (Reconciliation Diffing), and sends the construction crew a single sticky note: 'Only repaint the 2nd brick in blue!'",
    mechanics: "React maintains a declarative in-memory tree representation of the UI (Virtual DOM Fiber tree). When component state (`useState`) or props change, React initiates a render phase creating a new VDOM tree. The reconciliation engine diffs the old and new trees using an $O(N)$ heuristic algorithm based on element keys and component types. In the commit phase, React performs batch DOM mutations. Next.js extends this paradigm with hybrid rendering modes: CSR (browser renders JS), SSR (server renders HTML on every request), SSG (pre-rendered HTML at build time), and ISR (incremental background revalidation).",
    examAnswer: "React utilizes a Virtual DOM abstraction with a heuristic $O(N)$ reconciliation diffing algorithm to optimize browser updates. Component state is managed via functional Hooks (`useState`, `useEffect` with dependency arrays, `useMemo`, `useCallback`). Next.js provides enterprise full-stack React capabilities featuring App Router file-system conventions, Server Components, and hybrid rendering strategies (SSG for static pages, SSR for dynamic authenticated portals, and ISR for cached catalog updates).",
    watchOut: "Never call React Hooks conditionally, in loops, or inside nested functions. Hooks rely on strict call-order array indexing across renders. Also, omitting dependencies in `useEffect` causes stale closures and synchronization bugs.",
    visualLabel: "Virtual DOM Diffing & Next.js Rendering Spectrum",
    visualDiagram: (
      <div className="space-y-3 font-mono text-xs">
        <div className="flex items-center justify-between border border-ink bg-card p-2 text-center">
          <div className="w-1/3 p-1 bg-paper border border-rule">Old VDOM Tree</div>
          <div className="text-signal font-bold px-2">Diff Algorithm O(N)</div>
          <div className="w-1/3 p-1 bg-signal/15 border border-signal">New VDOM Tree</div>
        </div>
        <div className="text-center font-bold text-signal text-[11px]">
          ↓ Target Minimally Reconciled Patch Applied to Real DOM ↓
        </div>
        <div className="grid grid-cols-4 gap-1 text-[10px] text-center">
          <div className="border border-rule bg-card p-1.5">
            <strong className="block text-ink">CSR</strong> Client-Side
          </div>
          <div className="border border-rule bg-card p-1.5">
            <strong className="block text-signal">SSR</strong> Server-Rendered
          </div>
          <div className="border border-rule bg-card p-1.5">
            <strong className="block text-ok">SSG</strong> Static at Build
          </div>
          <div className="border border-rule bg-card p-1.5">
            <strong className="block text-ink-soft">ISR</strong> Stale-While-Revalidate
          </div>
        </div>
      </div>
    )
  },
  'wp-m4': {
    analogy: "Node.js and Express are like an airport security conveyor belt: The incoming passenger is the HTTP Request (`req`). The security conveyor belt passes the luggage through a series of specialized inspectors (Middleware): Inspector 1 verifies the boarding pass (`cors()`), Inspector 2 unpacks the luggage scan (`express.json()`), Inspector 3 checks authorization credentials (`authMiddleware`). Each inspector either signals the belt to advance to the next inspector (`next()`) or ejects the passenger if contraband is found. At the end of the belt, the departure gate agent stamps the passport and hands back the boarding card (`res.status(200).json(...)`).",
    mechanics: "Node.js runs the V8 JavaScript engine backed by the libuv C library, providing an asynchronous, event-driven I/O loop with a multi-threaded C++ thread pool for blocking file system (`fs`) and cryptographic tasks. Express.js organizes server execution around a chain-of-responsibility middleware pipeline. Middleware functions receive `(req, res, next)`. Handlers process headers, parse bodies, enforce CORS, validate payloads, and pass control via `next()`. Unhandled errors pass down the chain to four-parameter error-handling middleware `(err, req, res, next)`.",
    examAnswer: "Node.js is an open-source, cross-platform JavaScript runtime environment executing on Chrome's V8 engine with asynchronous, non-blocking I/O driven by the libuv event loop. Express.js is a minimalist web framework for building RESTful APIs structured as a pipeline of middleware functions `(req, res, next)`. HTTP endpoints map REST methods (GET, POST, PUT, DELETE) to URI resources with proper HTTP status codes (200 OK, 201 Created, 400 Bad Request, 401 Unauthorized, 404 Not Found, 500 Internal Error).",
    watchOut: "Node.js is single-threaded on its main event loop. Performing heavy CPU-bound computations (like complex image processing or synchronous loops) directly on the main thread blocks all incoming HTTP requests for all users. Offload CPU-heavy operations to Worker Threads or microservices.",
    visualLabel: "Express.js Middleware Pipeline Architecture",
    visualDiagram: (
      <div className="space-y-3 font-mono text-xs">
        <div className="flex items-center justify-between border border-ink bg-card p-2 text-[11px]">
          <span className="font-bold text-signal">HTTP Request</span>
          <span className="text-ink-soft">GET /api/students</span>
          <span className="text-[10px] bg-ink text-paper px-2 py-0.5 font-bold">req</span>
        </div>
        <div className="flex items-center gap-1.5 overflow-x-auto p-2 border border-rule bg-paper text-[10px]">
          <div className="px-2 py-1 bg-card border border-ink text-center flex-1">
            <strong className="block text-signal">cors()</strong> Header check
          </div>
          <span className="text-signal">→</span>
          <div className="px-2 py-1 bg-card border border-ink text-center flex-1">
            <strong className="block text-signal">json()</strong> Body parser
          </div>
          <span className="text-signal">→</span>
          <div className="px-2 py-1 bg-card border border-ink text-center flex-1">
            <strong className="block text-signal">auth()</strong> JWT verify
          </div>
          <span className="text-signal">→</span>
          <div className="px-2 py-1 bg-card border border-ink text-center flex-1">
            <strong className="block text-ok">route()</strong> Controller
          </div>
        </div>
        <div className="flex items-center justify-between border border-ok bg-ok/10 p-2 text-[11px]">
          <span className="font-bold text-ok">HTTP Response</span>
          <span className="text-ink-soft">200 OK · application/json</span>
          <span className="text-[10px] bg-ok text-paper px-2 py-0.5 font-bold">res.json()</span>
        </div>
      </div>
    )
  },
  'wp-m5': {
    analogy: "PHP dynamic script processing is like a notary public executing a legal contract: When a user submits a form, PHP receives input through sealed official envelopes: Superglobals (`$_GET`, `$_POST`, `$_SESSION`, `$_COOKIE`). A naive notary who blindly stamps whatever handwritten text a customer submits is vulnerable to SQL Injection (where an attacker sneaks in malicious commands like `' OR '1'='1`). PHP Data Objects (PDO) with Prepared Statements acts like a tamper-proof form template with pre-cut blank slots: the database pre-compiles the SQL query template first, and treats all user variables strictly as literal values, rendering SQL injection mathematically impossible.",
    mechanics: "PHP is a server-side interpreted scripting language executed via Apache mod_php, Nginx PHP-FPM, or FastCGI. Global state and client inputs are populated into superglobals. Sessions maintain conversational state across stateless HTTP requests by issuing a `PHPSESSID` session cookie while storing session variables server-side. Database persistence connects via PDO (PHP Data Objects). PDO separates SQL query parsing from parameter binding via two-stage prepared statements (`prepare()` followed by `execute()`), ensuring untrusted inputs are never evaluated as executable SQL syntax.",
    examAnswer: "PHP (Hypertext Preprocessor) executes server-side scripts generating dynamic HTML or JSON responses. State persistence across HTTP transactions is handled via PHP Sessions (`session_start()`, `$_SESSION`) and Cookies (`setcookie()`, `$_COOKIE`). Secure relational database interaction is implemented through PDO (PHP Data Objects) utilizing parameterized prepared statements with placeholder tokens (`:id` or `?`) to completely neutralize SQL injection vulnerabilities.",
    watchOut: "Never concatenate user input directly into SQL strings (`SELECT * FROM users WHERE user = '$u'`). An attacker entering `' OR '1'='1` will bypass all authentication. Always use PDO prepared statements with parameterized bindings.",
    visualLabel: "PHP Request Lifecycle & PDO Defense Architecture",
    visualDiagram: (
      <div className="space-y-3 font-mono text-xs">
        <div className="grid grid-cols-2 gap-2 text-center">
          <div className="border border-bad bg-bad/10 p-2 text-[10px]">
            <strong className="text-bad block mb-1">Vulnerable String Concatenation</strong>
            <code>&quot;SELECT * WHERE id=&apos;&quot; . $id . &quot;&apos;&quot;</code>
            <div className="text-bad mt-1 font-bold">Risk: SQL Injection Attack</div>
          </div>
          <div className="border border-ok bg-ok/10 p-2 text-[10px]">
            <strong className="text-ok block mb-1">PDO Prepared Statements</strong>
            <code>$stmt = $pdo-&gt;prepare(&quot;... id = :id&quot;)</code>
            <div className="text-ok mt-1 font-bold">Secured: Query pre-compiled</div>
          </div>
        </div>
        <div className="p-2 border border-rule bg-card flex justify-between items-center text-[11px]">
          <span>Session Engine: <strong>session_start()</strong></span>
          <span className="text-ink-soft">Sets <code>PHPSESSID</code> Cookie · Stores state on server</span>
        </div>
      </div>
    )
  },
  'wp-m6': {
    analogy: "A modern full-stack web application is like a 3-star Michelin restaurant: The Presentation Tier (React / Next.js) is the dining room where guests view the menu, place orders, and admire the plating. The Application / Business Logic Tier (Node.js Express / PHP) is the kitchen where recipes are executed, dietary restrictions checked, and food hygiene rules enforced. The Data Tier (MySQL / PostgreSQL / MongoDB) is the temperature-controlled pantry vault where ingredients are safely cataloged. JWT authentication is like an untamperable VIP wristband stamped with an encrypted digital wax seal: the guest presents the wristband at every door, and guards verify the signature instantly without calling the manager every time.",
    mechanics: "3-Tier Architecture cleanly isolates the Presentation Tier (UI/Client), Logic Tier (Application Server/APIs), and Data Tier (Database). Cross-Origin Resource Sharing (CORS) enforces browser same-origin policies; browsers issue an `OPTIONS` preflight request inspecting `Access-Control-Allow-Origin` before sending cross-origin data. Authentication utilizes JSON Web Tokens (JWT) structured as `base64(Header).base64(Payload).Signature` signed via HMAC SHA-256 or RSA. Git enables version-controlled branching, merging, and pull-request CI/CD pipelines deployed behind Nginx reverse proxies with HTTPS enforcement.",
    examAnswer: "3-Tier Full-Stack Architecture separates Client Presentation, Server Business Logic, and Database Storage to maximize modularity and horizontal scalability. Cross-origin API calls require explicit CORS header negotiation. Modern authentication employs stateless JWT tokens transmitting cryptographically verified claims in `Authorization: Bearer <token>` headers. Production DevOps leverages Git version control, CI/CD automated test pipelines, Nginx reverse proxying, and proactive mitigation of OWASP Top 10 vulnerabilities (Injection, Broken Authentication, XSS, CSRF, Security Misconfiguration).",
    watchOut: "Storing sensitive JWT access tokens in browser `localStorage` exposes them to theft via Cross-Site Scripting (XSS). For maximum security, store sensitive auth tokens in `HttpOnly`, `Secure`, `SameSite=Strict` browser cookies.",
    visualLabel: "Full-Stack 3-Tier Architecture & JWT Verification",
    visualDiagram: (
      <div className="space-y-3 font-mono text-xs">
        <div className="grid grid-cols-3 gap-2 text-center text-[10px]">
          <div className="border border-ink bg-card p-2">
            <Globe className="h-4 w-4 mx-auto mb-1 text-signal" />
            <strong className="block text-ink">Presentation Tier</strong>
            React / Next.js / HTML5
          </div>
          <div className="border border-ink bg-card p-2">
            <Server className="h-4 w-4 mx-auto mb-1 text-signal" />
            <strong className="block text-ink">Logic Tier</strong>
            Node Express / PHP APIs
          </div>
          <div className="border border-ink bg-card p-2">
            <Database className="h-4 w-4 mx-auto mb-1 text-signal" />
            <strong className="block text-ink">Data Tier</strong>
            MySQL / PostgreSQL / Redis
          </div>
        </div>
        <div className="p-2 border border-rule bg-paper text-[11px] font-mono">
          <div className="flex justify-between items-center text-[10px]">
            <span className="text-signal font-bold">JWT:</span>
            <span className="text-ink">Header.Payload.Signature</span>
            <span className="text-ok font-bold">Stateless Auth</span>
          </div>
        </div>
      </div>
    )
  }
}

export default function WPLearn({ moduleId }: { moduleId: WPModuleId }) {
  const mod = getWPModule(moduleId)
  const deepDive = WP_DEEP_DIVES[moduleId] || WP_DEEP_DIVES['wp-m1']
  const { moduleProgress } = useAcademicStore()
  const progress = moduleProgress[moduleId as any]

  const [activeTopicIndex, setActiveTopicIndex] = useState(0)

  if (!mod) return null

  const activeTopic = mod.topics[activeTopicIndex] || mod.topics[0]

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* 1. Module Overview Banner */}
      <Card className="border border-ink shadow-[4px_4px_0_var(--rule)] bg-card">
        <CardHeader className="border-b border-rule pb-4">
          <div className="flex flex-wrap items-center justify-between gap-2 font-mono text-[11px] mb-2">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 bg-ink text-paper font-bold">{mod.code}</span>
              <span className="px-2 py-0.5 border border-ink text-ink font-bold">ITC504</span>
              <span className="text-signal font-bold uppercase">{mod.hours} Hours Total</span>
            </div>
            <span className="px-2 py-0.5 border border-signal/30 bg-signal/10 text-signal font-bold">
              Bloom: {mod.bloomRange}
            </span>
          </div>
          <CardTitle className="font-serif text-2xl sm:text-3xl text-ink font-bold">
            {mod.title}
          </CardTitle>
          <p className="text-xs sm:text-sm text-ink-soft font-sans mt-2 leading-relaxed">
            {mod.description}
          </p>
        </CardHeader>

        <CardContent className="pt-4 flex flex-col sm:flex-row justify-between sm:items-center gap-3">
          <span className="font-mono text-xs text-ink-soft">
            {mod.topics.length} Syllabus Topics · Scrollytelling & Interactive Simulators
          </span>
          <Link
            href={`/present/${mod.code.toLowerCase()}/${mod.topics[0]?.id || 'topic1'}`}
            className="inline-flex items-center gap-2 px-3 py-1.5 bg-signal hover:bg-signal/90 text-paper font-mono uppercase tracking-wider text-xs font-bold shadow-[2px_2px_0_var(--ink)]"
          >
            <Presentation className="h-3.5 w-3.5" />
            <span>Launch Presentation Slides [P]</span>
          </Link>
        </CardContent>
      </Card>

      {/* 2. Structured Teaching Breakdown (Picture it -> See it -> Exam Definition) */}
      <div className="grid gap-4 sm:gap-6 grid-cols-1 md:grid-cols-2">
        {/* Card A: Picture it (Analogy) */}
        <Card className="border border-ink shadow-[3px_3px_0_var(--rule)] bg-card flex flex-col">
          <CardHeader className="pb-3 border-b border-rule">
            <div className="flex items-center gap-2 text-signal font-mono text-xs uppercase tracking-wider font-bold">
              <Lightbulb className="h-4 w-4" />
              <span>1. Picture It (Intuitive Metaphor)</span>
            </div>
          </CardHeader>
          <CardContent className="pt-4 flex-1 flex flex-col justify-between">
            <p className="text-sm font-sans text-ink leading-relaxed">
              {deepDive.analogy}
            </p>
            <div className="mt-4 pt-3 border-t border-rule text-[11px] font-mono text-ink-soft">
              Pedagogical anchor: Maps complex web concepts to tangible mechanical systems.
            </div>
          </CardContent>
        </Card>

        {/* Card B: See it work (Visual Diagram & Mechanics) */}
        <Card className="border border-ink shadow-[3px_3px_0_var(--rule)] bg-card flex flex-col">
          <CardHeader className="pb-3 border-b border-rule">
            <div className="flex items-center gap-2 text-ink font-mono text-xs uppercase tracking-wider font-bold">
              <Layers className="h-4 w-4" />
              <span>2. See It Work ({deepDive.visualLabel})</span>
            </div>
          </CardHeader>
          <CardContent className="pt-4 flex-1 flex flex-col justify-between">
            {deepDive.visualDiagram}
            <p className="mt-3 text-xs font-sans text-ink-soft leading-normal">
              {deepDive.mechanics}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Card C: Say it in Exam Words & Watch Out */}
      <div className="grid gap-4 sm:gap-6 grid-cols-1 md:grid-cols-2">
        <Card className="border border-ink shadow-[3px_3px_0_var(--rule)] bg-card">
          <CardHeader className="pb-3 border-b border-rule">
            <div className="flex items-center gap-2 text-ok font-mono text-xs uppercase tracking-wider font-bold">
              <BookMarked className="h-4 w-4" />
              <span>3. Say It in Exam Words (Mumbai Univ / TCET)</span>
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <blockquote className="border-l-2 border-ok pl-3 font-sans text-xs sm:text-sm text-ink leading-relaxed italic bg-ok/5 py-2 pr-2">
              &quot;{deepDive.examAnswer}&quot;
            </blockquote>
            <p className="mt-3 text-[11px] font-mono text-ink-soft">
              Verbatim model answer phrasing recognized by Mumbai University examiners.
            </p>
          </CardContent>
        </Card>

        <Card className="border border-ink shadow-[3px_3px_0_var(--rule)] bg-card">
          <CardHeader className="pb-3 border-b border-rule">
            <div className="flex items-center gap-2 text-bad font-mono text-xs uppercase tracking-wider font-bold">
              <AlertCircle className="h-4 w-4" />
              <span>4. Watch Out! (Common Exam Pitfall)</span>
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="border-l-2 border-bad pl-3 font-sans text-xs sm:text-sm text-ink leading-relaxed bg-bad/5 py-2 pr-2">
              {deepDive.watchOut}
            </div>
            <p className="mt-3 text-[11px] font-mono text-ink-soft">
              Exam tip: Highlighting this pitfall demonstrates deep conceptual mastery.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* 3. Detailed Syllabus Topic Breakdown with Clickable Deep Dive */}
      <Card className="border border-ink shadow-[4px_4px_0_var(--rule)] bg-card">
        <CardHeader className="border-b border-rule pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="font-serif text-xl sm:text-2xl text-ink font-bold">
              Accredited Syllabus Subtopics ({mod.topics.length} Units)
            </CardTitle>
            <span className="font-mono text-[11px] text-ink-soft uppercase">
              Click topic to preview
            </span>
          </div>
        </CardHeader>
        <CardContent className="pt-4 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
            {mod.topics.map((t, idx) => {
              const isSelected = idx === activeTopicIndex
              return (
                <button
                  key={t.id}
                  onClick={() => setActiveTopicIndex(idx)}
                  className={`p-3 border text-left transition-all cursor-pointer font-sans ${
                    isSelected
                      ? "border-signal bg-signal/10 shadow-[2px_2px_0_var(--signal)]"
                      : "border-rule bg-paper hover:border-ink"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-mono text-[10px] text-ink-soft font-bold">
                      Topic {idx + 1}
                    </span>
                    <span className="font-mono text-[10px] px-1.5 py-0.2 border border-rule bg-card">
                      {t.hours}h · {t.bloom}
                    </span>
                  </div>
                  <h4 className="text-xs sm:text-sm font-bold text-ink line-clamp-1">
                    {t.title}
                  </h4>
                </button>
              )
            })}
          </div>

          {/* Active Topic Inspection Card */}
          {activeTopic && (
            <div className="p-4 border border-ink bg-paper shadow-[2px_2px_0_var(--rule)] space-y-2 mt-4">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-rule pb-2 font-mono text-xs">
                <span className="font-bold text-signal">{activeTopic.title}</span>
                <span className="text-ink-soft">{activeTopic.hours} Hours · Bloom {activeTopic.bloom}</span>
              </div>
              <p className="text-xs sm:text-sm text-ink leading-relaxed font-sans">
                {activeTopic.description}
              </p>
              <div className="flex flex-wrap gap-1.5 pt-2">
                {activeTopic.tags.map(tag => (
                  <span key={tag} className="px-2 py-0.5 font-mono text-[10px] bg-card border border-rule text-ink-soft">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
