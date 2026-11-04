"use client"

import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/Table"
import { WPModuleId } from "@/lib/syllabus/wpSyllabus"

interface ComplexityItem {
  algo: string
  time: string
  space: string
  meaning: string
}

const WP_COMPLEXITY_DATA: Record<WPModuleId, {
  title: string
  subtitle: string
  rows: ComplexityItem[]
  deepDiveTitle: string
  deepDiveContent: React.ReactNode
}> = {
  'wp-m1': {
    title: "Module 1: Rendering Pipeline & CSS Specificity Complexity",
    subtitle: "Analyzing computational cost of DOM construction, style resolution, reflow, and repaint.",
    rows: [
      { algo: "DOM Tree Construction", time: "O(N)", space: "O(N)", meaning: "N = HTML tokens. Incremental lexical parsing from raw bytes into tree hierarchy." },
      { algo: "CSSOM Tree Construction", time: "O(M)", space: "O(M)", meaning: "M = CSS rules. Builds cascading rule hierarchy before render tree creation." },
      { algo: "CSS Specificity Calculation", time: "O(1)", space: "O(1)", meaning: "Vector arithmetic (Inline, ID, Class/Attr, Element): [a, b, c, d] tuple comparison." },
      { algo: "Box Model Layout (Reflow)", time: "O(N)", space: "O(N)", meaning: "Calculates geometry (width, height, position). Sibling and parent shifts cascade down." },
      { algo: "Flexbox 1D Layout Pass", time: "O(K)", space: "O(K)", meaning: "K = flex items. Single-pass linear constraint solving along main axis." },
      { algo: "CSS Grid 2D Resolution", time: "O(R × C)", space: "O(R × C)", meaning: "Resolves fractional (fr) tracks, minmax, and named grid areas across 2 dimensions." },
      { algo: "Pixel Repaint & Compositing", time: "O(Pixels)", space: "O(Layers)", meaning: "GPU rasterization. Transforms and opacity bypass reflow directly to compositing." },
      { algo: "Forced Synchronous Layout", time: "O(N²)", space: "O(N)", meaning: "Reading offsetHeight inside a DOM mutation loop triggers layout thrashing." }
    ],
    deepDiveTitle: "Why does Layout Thrashing devastate web performance?",
    deepDiveContent: (
      <>
        <p className="mb-3">
          Normally, modern browsers queue DOM mutations and batch <strong>Layout (Reflow)</strong> at the end of the frame (60 FPS = 16.6ms window).
        </p>
        <p className="mb-3">
          However, when JavaScript reads a geometric property (e.g., <code>element.offsetWidth</code>, <code>element.offsetTop</code>, or <code>getComputedStyle()</code>) immediately after writing a style, the browser is forced to flush the render queue instantly and recalculate the layout synchronously in <strong>O(N)</strong> time.
        </p>
        <p>
          Executing this in a loop across 500 DOM elements causes 500 consecutive full-page reflows (<strong>O(N²)</strong> overall work), completely dropping frame rates from 60 FPS down to 5 FPS. Always decouple reads from writes or use <code>requestAnimationFrame()</code>.
        </p>
      </>
    )
  },
  'wp-m2': {
    title: "Module 2: JavaScript Runtime & Event Loop Complexity",
    subtitle: "Computational complexities of the V8 engine, call stack, microtask queues, and memory garbage collection.",
    rows: [
      { algo: "Call Stack Push / Pop", time: "O(1)", space: "O(D)", meaning: "D = Call stack depth. Maximum stack depth in V8 is ~10,000 frames before RangeError." },
      { algo: "Microtask Queue Draining", time: "O(K)", space: "O(K)", meaning: "Drains ALL resolved Promises and async/await steps before ANY macrotask or UI render." },
      { algo: "Macrotask Queue Step", time: "O(1)", space: "O(M)", meaning: "Takes exactly 1 macrotask (setTimeout, I/O) per event loop iteration." },
      { algo: "V8 Young Gen GC (Scavenge)", time: "O(Live Objects)", space: "O(Nursery)", meaning: "Cheney's copying algorithm (~1-5ms). Fast evacuation of short-lived objects." },
      { algo: "V8 Old Gen GC (Mark-Sweep)", time: "O(Total Heap)", space: "O(Heap)", meaning: "Tri-color marking across long-lived objects. Incremental to avoid long pauses." },
      { algo: "DOM Lookup: getElementById", time: "O(1)", space: "O(1)", meaning: "Direct hash map lookup in browser native C++ symbol table." },
      { algo: "DOM Query: querySelectorAll", time: "O(N)", space: "O(Match)", meaning: "Depth-first tree traversal evaluating CSS selector against DOM nodes." },
      { algo: "Event Delegation Dispatch", time: "O(H)", space: "O(1)", meaning: "H = DOM tree height. Single parent listener intercepts bubbling events." }
    ],
    deepDiveTitle: "Why does Microtask Starvation freeze the user interface?",
    deepDiveContent: (
      <>
        <p className="mb-3">
          The HTML5 Event Loop specification stipulates that between turns of the event loop (macrotasks), the runtime <strong>must completely exhaust the Microtask Queue</strong> before rendering the next display frame to the monitor.
        </p>
        <p className="mb-3">
          If an application enqueues continuous microtasks (e.g. recursive <code>Promise.resolve().then(...)</code> or <code>queueMicrotask()</code>), the Event Loop never exits the microtask checkpoint.
        </p>
        <p>
          As a consequence, the browser cannot run UI rendering passes, process clicks, or execute <code>setTimeout</code> macrotasks, leading to an unresponsive browser window with 100% single-core CPU utilization.
        </p>
      </>
    )
  },
  'wp-m3': {
    title: "Module 3: React Virtual DOM & Rendering Strategy Complexity",
    subtitle: "Heuristic reconciliation algorithms and Next.js full-stack rendering tradeoffs.",
    rows: [
      { algo: "Classic Tree Edit Distance", time: "O(N³)", space: "O(N)", meaning: "Theoretical algorithm (Zhang-Shasha) to transform one tree to another. Unusable in UI." },
      { algo: "React VDOM Diffing Heuristic", time: "O(N)", space: "O(N)", meaning: "Assumes distinct component types yield distinct trees, using unique keys for siblings." },
      { algo: "Fiber Tree Work Loop", time: "O(N)", space: "O(N)", meaning: "Time-sliced cooperative scheduling with linked-list child/sibling/return pointers." },
      { algo: "useMemo / useCallback Cache", time: "O(1)", space: "O(D)", meaning: "D = dependency array length. Performs shallow equality checks (Object.is) per render." },
      { algo: "CSR (Client-Side Rendering)", time: "High TTI", space: "Low Server", meaning: "TTFB is fast (static HTML shell), but First Meaningful Paint is delayed until JS downloads." },
      { algo: "SSR (Server-Side Rendering)", time: "O(Render / req)", space: "High Server", meaning: "Computes HTML on every incoming HTTP request. Fast FCP, but adds server compute latency." },
      { algo: "SSG (Static Site Generation)", time: "O(Build)", space: "O(1) CDN", meaning: "Zero runtime server compute. Sub-millisecond global CDN edge delivery." },
      { algo: "ISR (Incremental Revalidation)", time: "O(1) + O(Reval)", space: "O(Pages)", meaning: "Serves stale cached page instantly while revalidating in background asynchronously." }
    ],
    deepDiveTitle: "How does React reduce tree diffing from O(N³) to O(N)?",
    deepDiveContent: (
      <>
        <p className="mb-3">
          The mathematically optimal algorithm to find the minimum edit operations between two arbitrary trees requires <strong>O(N³)</strong> operations. For a modest UI tree with 1,000 components, an O(N³) diff would require 1,000,000,000 calculations per state change—completely unfeasible for 60 FPS interfaces.
        </p>
        <p className="mb-3">
          React introduces two pragmatic heuristics that bring the time complexity down to <strong>O(N)</strong>:
        </p>
        <ol className="list-decimal pl-5 space-y-1 text-xs mb-3">
          <li><strong>Different Component Types:</strong> If two elements have different tags (e.g. <code>&lt;div&gt;</code> to <code>&lt;span&gt;</code>), React unmounts the old tree and builds the new tree from scratch without diffing children.</li>
          <li><strong>Keys for Child Lists:</strong> For lists of children, React uses a developer-supplied <code>key</code> to match children between old and new trees across moves and insertions.</li>
        </ol>
        <p>
          <em>Pitfall:</em> Using array indexes as keys breaks this heuristic when items are reordered or deleted, resulting in misplaced input focus and unnecessary DOM mutations.
        </p>
      </>
    )
  },
  'wp-m4': {
    title: "Module 4: Node.js Concurrency & Express Pipeline Complexity",
    subtitle: "Analyzing event-driven asynchronous I/O vs thread pool bottlenecks in Node.js.",
    rows: [
      { algo: "libuv Event Loop Tick", time: "O(Active Polls)", space: "O(Handles)", meaning: "epoll (Linux), kqueue (macOS), IOCP (Windows) monitor thousands of sockets in O(1)." },
      { algo: "Thread Pool Task Execution", time: "O(Task)", space: "O(Threads)", meaning: "Blocking C++ calls (fs, crypto, zlib) dispatched to libuv pool (default size = 4)." },
      { algo: "Express Middleware Traversal", time: "O(M)", space: "O(M)", meaning: "M = middleware count. Linear recursive next() chain execution until response sent." },
      { algo: "V8 Stream Piping (stream.pipe)", time: "O(Bytes)", space: "O(Chunk = 64KB)", meaning: "Constant memory footprint regardless of whether file is 10 MB or 10 GB." },
      { algo: "fs.readFile (Buffered)", time: "O(Bytes)", space: "O(File Size)", meaning: "Loads entire file into Node heap buffer. Causes Out-Of-Memory on massive files." },
      { algo: "JSON.parse / stringify", time: "O(Payload)", space: "O(Payload)", meaning: "Synchronous CPU-bound blocking call. Parsing a 50MB JSON payload blocks all users." },
      { algo: "bcrypt Password Hashing", time: "O(2^Cost)", space: "O(1)", meaning: "Purposely compute-heavy (cost factor 10-12). Offloaded to worker pool to protect loop." },
      { algo: "Cluster / PM2 Forking", time: "O(1) dispatch", space: "O(Cores × Heap)", meaning: "Binds multiple Node.js worker processes to one port, scaling across all CPU cores." }
    ],
    deepDiveTitle: "The Single-Thread Trap: What causes Event Loop Lag in Node.js?",
    deepDiveContent: (
      <>
        <p className="mb-3">
          Node.js is famously fast for <strong>I/O-bound</strong> tasks (network requests, database queries, file streaming) because the main thread never waits for data; it registers an epoll callback and moves to the next user.
        </p>
        <p className="mb-3">
          However, because the main JavaScript thread is <strong>strictly single-threaded</strong>, executing a synchronous CPU-bound operation (such as sorting a 1,000,000 item array, image resizing, or running an unindexed regular expression) blocks the entire server.
        </p>
        <p>
          While the event loop is blocked, no other network packets can be accepted, HTTP health checks time out, and incoming requests pile up in memory buffers. Production architectures solve this via <code>Worker Threads</code>, background queues (BullMQ/Redis), or clustering.
        </p>
      </>
    )
  },
  'wp-m5': {
    title: "Module 5: PHP Execution & Relational Query Complexity",
    subtitle: "Database indexing, PDO prepared statement caching, and PHP session concurrency.",
    rows: [
      { algo: "B-Tree Database Index Lookup", time: "O(log N)", space: "O(Index)", meaning: "N = table rows. Binary search across balanced tree nodes on disk." },
      { algo: "Full Table Scan (Unindexed)", time: "O(N)", space: "O(1)", meaning: "Must inspect every row on disk. Catastrophic when table grows to millions of rows." },
      { algo: "PDO Statement Prepare", time: "O(SQL Parse)", space: "O(AST)", meaning: "Database engine parses, validates, and optimizes execution plan once." },
      { algo: "PDO Statement Execute", time: "O(Query)", space: "O(Result)", meaning: "Binds user parameters as pure literals without re-parsing query grammar." },
      { algo: "PHP Session Start (File-based)", time: "O(1) + Lock", space: "O(Session)", meaning: "session_start() places an exclusive flock on /tmp/sess_*. Concurrency bottleneck." },
      { algo: "OPcache Script Bytecode", time: "O(1) Cache", space: "O(RAM)", meaning: "Caches pre-compiled Zend opcode in shared memory, eliminating disk read and parse." },
      { algo: "Bcrypt Hashing (password_hash)", time: "O(2^Cost)", space: "O(1)", meaning: "Adaptive salt generation with 60-character output string." },
      { algo: "PDO Transaction (ACID)", time: "O(Commit)", space: "O(WAL)", meaning: "Write-Ahead Logging guarantees Atomicity and Durability across multiple queries." }
    ],
    deepDiveTitle: "Why does PDO Prepared Statements make SQL Injection mathematically impossible?",
    deepDiveContent: (
      <>
        <p className="mb-3">
          SQL Injection occurs when untrusted user strings are concatenated directly into an SQL statement string. When the database engine parses the combined string, malicious input (such as <code>&apos; OR &apos;1&apos;=&apos;1</code>) alters the <strong>Abstract Syntax Tree (AST)</strong> grammar of the SQL command.
        </p>
        <p className="mb-3">
          PDO Prepared Statements fundamentally breaks this attack vector by separating the process into two distinct phases:
        </p>
        <ol className="list-decimal pl-5 space-y-1 text-xs mb-3">
          <li><strong>Prepare:</strong> The SQL query structure with placeholders (<code>SELECT * FROM users WHERE email = :email</code>) is sent to the database and compiled into an immutable execution plan.</li>
          <li><strong>Execute:</strong> The user input is transmitted over the wire strictly as literal parameter data. Even if the user enters SQL syntax, the database engine treats it as a benign string literal, never as executable SQL grammar.</li>
        </ol>
      </>
    )
  },
  'wp-m6': {
    title: "Module 6: Full-Stack Architecture & Auth Token Complexity",
    subtitle: "Stateless JWT cryptography vs stateful sessions, Git DAG traversal, and OWASP defenses.",
    rows: [
      { algo: "JWT Signature Verification", time: "O(1) CPU", space: "O(1)", meaning: "HMAC SHA-256 or RSA verify of token signature. Pure math, zero database round-trips." },
      { algo: "Stateful Session DB Lookup", time: "O(1) + Network RTT", space: "O(Active Users)", meaning: "Must query Redis or DB on every single HTTP request. Adds 1-5ms network latency." },
      { algo: "CORS Preflight Check (OPTIONS)", time: "O(1) Network RTT", space: "O(1)", meaning: "Browser sends extra OPTIONS round-trip prior to non-simple cross-origin requests." },
      { algo: "Git Commit DAG Traversal", time: "O(V + E)", space: "O(V)", meaning: "Directed Acyclic Graph. Fast branch merging, rebase, and 3-way merge conflict checks." },
      { algo: "Nginx Reverse Proxy Routing", time: "O(1) Event-driven", space: "O(Connections)", meaning: "Worker processes handle 10,000+ concurrent connections via epoll with minimal RAM." },
      { algo: "XSS DOM Sanitization (DOMPurify)", time: "O(HTML Length)", space: "O(HTML)", meaning: "Parses input through DOM parser, stripping malicious &lt;script&gt; tags and inline handlers." },
      { algo: "CSRF Token Validation", time: "O(1)", space: "O(1)", meaning: "Constant-time string comparison between hidden form input and session cookie token." },
      { algo: "Content Security Policy (CSP)", time: "O(1) Browser", space: "O(Rules)", meaning: "Browser engine enforces origin restrictions on script, style, and media execution." }
    ],
    deepDiveTitle: "The Architectural Trade-Off: Stateless JWT vs Stateful Redis Sessions",
    deepDiveContent: (
      <>
        <p className="mb-3">
          Full-stack engineers must balance latency against immediate revocability when architecting authentication:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs mb-3">
          <div className="p-3 border border-rule bg-card">
            <strong className="text-signal block mb-1">Stateless JWT (JSON Web Token)</strong>
            <ul className="list-disc pl-4 space-y-1 text-ink-soft">
              <li><strong>Pros:</strong> Zero database round-trips. Horizontally scales across multi-region server clusters effortlessly.</li>
              <li><strong>Cons:</strong> Cannot be instantly revoked if compromised (must wait for expiration, or maintain a token blacklist).</li>
            </ul>
          </div>
          <div className="p-3 border border-rule bg-card">
            <strong className="text-ok block mb-1">Stateful Redis Sessions</strong>
            <ul className="list-disc pl-4 space-y-1 text-ink-soft">
              <li><strong>Pros:</strong> Instant revocation (delete key in Redis, and user is logged out immediately).</li>
              <li><strong>Cons:</strong> Every single API request requires a network call to Redis. Cache clusters require memory scaling.</li>
            </ul>
          </div>
        </div>
        <p>
          <em>Industry Standard:</em> Short-lived JWT access tokens (15 minutes) paired with stateful refresh tokens stored in secure <code>HttpOnly</code> cookies.
        </p>
      </>
    )
  }
}

export default function WPComplexity({ moduleId }: { moduleId: WPModuleId }) {
  const data = WP_COMPLEXITY_DATA[moduleId] || WP_COMPLEXITY_DATA['wp-m1']

  return (
    <div className="space-y-12">
      <Card className="border border-ink shadow-[4px_4px_0_var(--rule)] bg-card">
        <CardHeader className="border-b border-rule pb-4">
          <CardTitle className="font-serif text-2xl sm:text-3xl text-ink font-bold">
            {data.title}
          </CardTitle>
          <p className="text-ink-soft text-xs sm:text-sm font-sans mt-2">
            {data.subtitle}
          </p>
        </CardHeader>
        <CardContent className="pt-4 overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-rule">
                <TableHead className="font-mono text-xs uppercase font-bold text-ink">Operation / Feature</TableHead>
                <TableHead className="font-mono text-xs uppercase font-bold text-signal">Time Complexity</TableHead>
                <TableHead className="font-mono text-xs uppercase font-bold text-signal">Space Complexity</TableHead>
                <TableHead className="font-mono text-xs uppercase font-bold text-ink">Engine & Performance Meaning</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.rows.map((row, i) => (
                <TableRow key={i} className="border-b border-rule/50 hover:bg-paper/50">
                  <TableCell className="font-mono text-xs font-bold text-ink">{row.algo}</TableCell>
                  <TableCell className="font-mono text-xs text-signal font-bold">{row.time}</TableCell>
                  <TableCell className="font-mono text-xs text-signal font-bold">{row.space}</TableCell>
                  <TableCell className="text-xs font-sans text-ink leading-relaxed">{row.meaning}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card className="border border-ink shadow-[4px_4px_0_var(--rule)] bg-card">
        <CardHeader className="border-b border-rule pb-3">
          <CardTitle className="font-serif text-xl sm:text-2xl text-ink font-bold">
            {data.deepDiveTitle}
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4 font-sans text-xs sm:text-sm text-ink leading-relaxed">
          {data.deepDiveContent}
        </CardContent>
      </Card>
    </div>
  )
}
