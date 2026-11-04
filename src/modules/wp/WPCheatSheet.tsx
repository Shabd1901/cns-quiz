"use client"

import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { WPModuleId, getWPModule } from "@/lib/syllabus/wpSyllabus"
import { AlertTriangle, BookOpen, Code, Terminal, CheckCircle2 } from "lucide-react"

export interface CheatSheetData {
  title: string
  hours: string
  bloom: string
  coreConcepts: { name: string; summary: string }[]
  keyFormulas: string[]
  commonTraps: string[]
}

export const WP_CHEAT_SHEETS: Record<WPModuleId, CheatSheetData> = {
  'wp-m1': {
    title: "Module 1: HTML5 Semantics & CSS3 Box Model / Layouts",
    hours: "8 Hours",
    bloom: "Bloom L1-L3, L6",
    coreConcepts: [
      { name: "HTML5 Semantic Architecture", summary: "<header>, <nav>, <main>, <section> (thematic grouping with heading), <article> (self-contained, syndicated post), <aside> (sidebar/related content), <footer>. Replaces generic <div> soup to improve SEO and screen reader accessibility." },
      { name: "CSS Box Model & Sizing", summary: "Four concentric layers: Content, Padding, Border, Margin. Default `box-sizing: content-box` calculates: Total Width = width + 2×padding + 2×border. `box-sizing: border-box` enforces that specified width includes padding and border." },
      { name: "CSS Specificity Vector [a, b, c, d]", summary: "Inline styles = [1,0,0,0], ID selectors = [0,1,0,0], Class / Pseudo-class / Attribute = [0,0,1,0], Element / Pseudo-element = [0,0,0,1]. Specificity is evaluated column-by-column from left to right." },
      { name: "Flexbox (1D Layout)", summary: "Aligns along Main Axis (flex-direction: row | column) and Cross Axis. Key properties: justify-content (main axis alignment), align-items (cross axis alignment), flex-grow, flex-shrink, and flex-basis." },
      { name: "CSS Grid (2D Layout)", summary: "Establishes rows and columns simultaneously. Features fractional (`fr`) flexible units, `grid-template-columns: repeat(auto-fit, minmax(250px, 1fr))`, and named `grid-template-areas`." },
      { name: "Responsive Media Queries", summary: "@media (min-width: 768px) { ... } mobile-first responsive design. Pairs with `<meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">`." }
    ],
    keyFormulas: [
      "content-box: Total Width = Width + 2×(Padding + Border + Margin)",
      "border-box: Total Width = Width + 2×Margin (Padding and Border absorbed into Width)",
      "Universal Reset: *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }",
      "CSS Grid Auto-Responsive: grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));"
    ],
    commonTraps: [
      "Forgetting the viewport meta tag: On smartphones, the layout defaults to a 980px desktop window and looks zoomed-out and unreadable.",
      "Misusing <section> instead of <article>: Use <article> when content can be distributed independently outside the site (e.g. news story, blog, product card).",
      "Overusing '!important' to fix CSS specificity: Refactor selector specificity by adding a class or nesting rather than breaking the cascade."
    ]
  },
  'wp-m2': {
    title: "Module 2: JavaScript Mechanics, ES6+ & Asynchronous Event Loop",
    hours: "8 Hours",
    bloom: "Bloom L1-L3, L6",
    coreConcepts: [
      { name: "Variable Scoping (var vs let vs const)", summary: "'var' is function-scoped and hoisted with value 'undefined'. 'let' and 'const' are block-scoped ({...}) and reside in the Temporal Dead Zone (TDZ) where accessing before declaration throws ReferenceError." },
      { name: "ES6+ Modern Syntax", summary: "Arrow functions (() => {}) lexically inherit 'this'. Template literals (`Hello ${name}`) allow interpolation and multiline strings. Destructuring ({ name, age } = user) and Spread/Rest (...args) simplify object and array manipulations." },
      { name: "Event Propagation Pipeline", summary: "1. Capturing Phase (window -> document -> target). 2. Target Phase. 3. Bubbling Phase (target -> parent -> window). 'e.stopPropagation()' stops bubbling; 'e.preventDefault()' halts browser default actions (like form reload)." },
      { name: "The Asynchronous Event Loop", summary: "JavaScript is single-threaded. Call Stack (LIFO) executes synchronous code. Async tasks delegate to Web APIs. Resolved callbacks enter either the Microtask Queue (Promises, async/await) or Macrotask Queue (setTimeout, I/O)." },
      { name: "Promises & Async / Await", summary: "Promises have 3 states: Pending, Fulfilled, Rejected. 'async/await' is syntactic sugar on top of Promises, allowing asynchronous code to be written sequentially while yielding execution to the event loop." }
    ],
    keyFormulas: [
      "ES6 Arrow: const add = (a, b) => a + b;",
      "Array Destructuring: const [head, ...tail] = [1, 2, 3, 4];",
      "Object Destructuring with Default: const { role = 'student' } = user;",
      "Fetch with async/await: const res = await fetch(url); const data = await res.json();",
      "Event Loop Rule: Microtask Queue drains 100% to empty before next Macrotask runs."
    ],
    commonTraps: [
      "Assuming 'const' makes objects immutable: 'const' only freezes the variable reference binding; object properties can still be modified unless 'Object.freeze()' is used.",
      "Using arrow functions as object methods: Arrow functions lack their own 'this', so 'this' will resolve to the outer global/window scope instead of the object instance.",
      "Forgetting to wrap 'await' in try/catch: Unhandled rejected promises in async functions lead to uncaught runtime errors."
    ]
  },
  'wp-m3': {
    title: "Module 3: React Virtual DOM, Hooks & Next.js Architecture",
    hours: "8 Hours",
    bloom: "Bloom L1-L3, L5, L6",
    coreConcepts: [
      { name: "Virtual DOM & Reconciliation", summary: "Lightweight JS object representation of the real DOM. React's heuristic algorithm diffs trees in O(N) linear time using component types and stable 'key' props to batch DOM mutations." },
      { name: "Rules of React Hooks", summary: "1. Only call hooks at the top level (never in conditions, loops, or nested functions). 2. Only call hooks from React function components or custom hooks." },
      { name: "Core Hooks (useState, useEffect, useMemo)", summary: "useState: triggers re-render on state change. useEffect: handles side effects (mount, unmount cleanup, dependency updates). useMemo: caches expensive calculations. useCallback: caches function references." },
      { name: "Next.js Rendering Strategies", summary: "CSR: Client renders JS. SSR: Server renders fresh HTML per request (`getServerSideProps` or dynamic fetch). SSG: Pre-rendered static HTML at build time (`getStaticProps`). ISR: Edge-cached static pages revalidated incrementally in the background." },
      { name: "Next.js App Router Structure", summary: "File-system routing in `/app`: `page.tsx` (route UI), `layout.tsx` (shared persistent shell), `loading.tsx` (Suspense fallback), `route.ts` (API route endpoints). Components are Server Components by default." }
    ],
    keyFormulas: [
      "State: const [count, setCount] = useState<number>(0);",
      "Effect with cleanup: useEffect(() => { const id = setInterval(...); return () => clearInterval(id); }, [dep]);",
      "Controlled Input: <input value={text} onChange={(e) => setText(e.target.value)} />",
      "ISR Config: export const revalidate = 60; // Revalidate every 60 seconds"
    ],
    commonTraps: [
      "Using array indexes as keys (key={index}): Breaks component state and focus when list items are deleted, prepended, or sorted.",
      "Omitting variables in useEffect dependency arrays: Leads to stale closures where the effect accesses outdated state values.",
      "Directly mutating state (state.items.push(x)): React requires immutable updates (`setItems([...items, x])`) to detect reference changes."
    ]
  },
  'wp-m4': {
    title: "Module 4: Node.js Concurrency, Express.js & RESTful APIs",
    hours: "7 Hours",
    bloom: "Bloom L1-L3, L5, L6",
    coreConcepts: [
      { name: "Node.js libuv Architecture", summary: "V8 JS Engine + libuv event-driven C library. Non-blocking asynchronous I/O utilizing OS kernel polling (epoll/kqueue) and a background thread pool (default 4 threads) for fs and crypto." },
      { name: "Express Middleware Chain", summary: "Functions with access to (req, res, next). Middleware execute sequentially: request parsing -> authentication -> route validation -> controller handler. `next()` advances the chain." },
      { name: "Centralized Error Handling", summary: "Middleware with four arguments `(err, req, res, next)`. Placed at the very end of the middleware stack to intercept errors passed via `next(err)`." },
      { name: "RESTful API Conventions", summary: "GET (read resource), POST (create resource), PUT/PATCH (update resource), DELETE (remove resource). Standard status codes: 200 OK, 201 Created, 204 No Content, 400 Bad Request, 401 Unauthorized, 404 Not Found, 500 Internal Server Error." },
      { name: "CORS (Cross-Origin Resource Sharing)", summary: "Browser security mechanism. Servers send `Access-Control-Allow-Origin: *` or specific origin to allow frontends on different ports/domains to access API responses." }
    ],
    keyFormulas: [
      "Express Server Setup: const app = express(); app.use(express.json());",
      "Middleware: const auth = (req, res, next) => { if (!req.headers.token) return res.status(401).json({ error: 'Unauthorized' }); next(); };",
      "Error Middleware: app.use((err, req, res, next) => { res.status(500).json({ error: err.message }); });",
      "Stream Piping: fs.createReadStream('file.csv').pipe(res);"
    ],
    commonTraps: [
      "Forgetting to call `next()` in custom middleware: Leaves client requests hanging forever until browser network timeout.",
      "Running heavy synchronous loops on the main thread: Blocks all concurrent users on the server because Node.js event loop is single-threaded.",
      "Sending multiple responses (`res.send()` called twice): Throws 'Error: Cannot set headers after they are sent to the client'."
    ]
  },
  'wp-m5': {
    title: "Module 5: PHP Scripting, MySQL Integration & PDO Security",
    hours: "9 Hours",
    bloom: "Bloom L1-L4, L6",
    coreConcepts: [
      { name: "PHP Superglobals", summary: "$_GET (URL query parameters), $_POST (form POST payloads), $_SESSION (server session store), $_COOKIE (client cookie store), $_SERVER (header/host metadata), $_FILES (uploaded multipart files)." },
      { name: "Session State Management", summary: "`session_start()` must be invoked before outputting any HTML. Generates a unique `PHPSESSID` cookie sent to the client, while session data is stored securely on the server." },
      { name: "PHP Data Objects (PDO)", summary: "Database abstraction layer supporting prepared statements. Decouples SQL parsing from data binding, rendering SQL injection impossible." },
      { name: "SQL Injection Defense", summary: "Never interpolate variables into raw queries (`' OR '1'='1`). Always use parameterized placeholders (`:email` or `?`) with PDO `bindValue()` or `execute([$data])`." },
      { name: "Password Security in PHP", summary: "Use `password_hash($pass, PASSWORD_BCRYPT)` and `password_verify($pass, $hash)`. Employs adaptive salt generation and 60-character bcrypt hash digests." }
    ],
    keyFormulas: [
      "PDO Connection: $pdo = new PDO('mysql:host=localhost;dbname=college', $user, $pass, [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]);",
      "PDO Prepared: $stmt = $pdo->prepare('SELECT * FROM students WHERE email = :e'); $stmt->execute([':e' => $email]); $student = $stmt->fetch();",
      "Session Start: <?php session_start(); $_SESSION['user_id'] = $id; ?>",
      "Password Hashing: $hash = password_hash($password, PASSWORD_BCRYPT); if (password_verify($input, $hash)) { ... }"
    ],
    commonTraps: [
      "Concatenating user input into SQL: `$query = \"SELECT * FROM users WHERE user = '\" . $_POST['user'] . \"'\"` is instantly vulnerable to SQL Injection.",
      "Calling `session_start()` after HTML output: Causes 'Headers already sent' warning and breaks session cookie delivery.",
      "Using `md5()` or `sha1()` for passwords: Vulnerable to instant cracking via pre-computed rainbow tables and GPU brute force."
    ]
  },
  'wp-m6': {
    title: "Module 6: Full-Stack Architecture, JWT, Git & OWASP Top 10",
    hours: "5 Hours",
    bloom: "Bloom L1-L3, L6",
    coreConcepts: [
      { name: "3-Tier Architecture", summary: "Presentation Tier (React / Next.js UI) <-> Application / Logic Tier (Node.js Express / PHP APIs) <-> Data Tier (MySQL / PostgreSQL / Redis). Enforces separation of concerns and horizontal scalability." },
      { name: "JSON Web Tokens (JWT)", summary: "Compact URL-safe token format: `header.payload.signature`. Transmitted via `Authorization: Bearer <token>`. Stateless: verified via cryptographic signature without database lookups." },
      { name: "Token Security Best Practices", summary: "Store access tokens in `HttpOnly`, `Secure`, `SameSite=Strict` cookies to neutralize Cross-Site Scripting (XSS) token theft. Keep access token lifespan short (15 mins) and use refresh tokens." },
      { name: "Git Version Control Workflow", summary: "Working Directory -> Staging Area (`git add`) -> Local Repository (`git commit`) -> Remote Repository (`git push`). Branching (`git checkout -b feature`), merging (`git merge`), and conflict resolution." },
      { name: "OWASP Top 10 Mitigations", summary: "Injection (use PDO prepared statements), Broken Authentication (multi-factor, bcrypt), XSS (sanitize HTML, escape output, CSP), CSRF (anti-CSRF tokens, SameSite cookies), Security Misconfiguration (disable debug in prod)." }
    ],
    keyFormulas: [
      "JWT Structure: Base64URL(Header) . Base64URL(Payload) . HMAC-SHA256(Header.Payload, Secret)",
      "Auth Header: Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "Git Feature Workflow: git checkout -b feat/login -> git commit -m 'feat' -> git push origin feat/login",
      "Cookie Hardening: Set-Cookie: token=xyz; Secure; HttpOnly; SameSite=Strict; Max-Age=900"
    ],
    commonTraps: [
      "Storing sensitive JWTs in browser localStorage: Any XSS vulnerability will allow attackers to steal the token via `localStorage.getItem()`.",
      "Committing '.env' files with API secrets to Git: Secrets are permanently recorded in git commit history unless scrubbed with git filter-repo.",
      "Disabling CORS with `Access-Control-Allow-Origin: *` on authenticated endpoints: Exposes sensitive intranet or authenticated endpoints to unauthorized web origins."
    ]
  }
}

export default function WPCheatSheet({ moduleId }: { moduleId: WPModuleId }) {
  const data = WP_CHEAT_SHEETS[moduleId] || WP_CHEAT_SHEETS['wp-m1']
  const modInfo = getWPModule(moduleId)

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Title Card */}
      <Card className="border border-ink shadow-[4px_4px_0_var(--rule)] bg-card">
        <CardHeader className="border-b border-rule pb-4">
          <div className="flex justify-between items-center font-mono text-[11px] mb-2">
            <span className="px-2 py-0.5 bg-ink text-paper font-bold">{modInfo?.code} · ITC504</span>
            <span className="text-signal font-bold uppercase">{data.hours} · {data.bloom}</span>
          </div>
          <CardTitle className="font-serif text-2xl sm:text-3xl text-ink font-bold">
            {data.title} Cheat Sheet
          </CardTitle>
          <p className="text-xs sm:text-sm text-ink-soft font-sans mt-2">
            High-density revision summary compiled from Mumbai University / TCET curricula and exam answer schemes.
          </p>
        </CardHeader>
      </Card>

      {/* Core Concepts Grid */}
      <Card className="border border-ink shadow-[4px_4px_0_var(--rule)] bg-card">
        <CardHeader className="border-b border-rule pb-3">
          <div className="flex items-center gap-2 text-ink font-mono text-xs uppercase tracking-wider font-bold">
            <BookOpen className="h-4 w-4 text-signal" />
            <span>Core Theoretical Concepts & Architecture</span>
          </div>
        </CardHeader>
        <CardContent className="pt-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {data.coreConcepts.map((concept, idx) => (
              <div key={idx} className="p-3.5 border border-rule bg-paper space-y-1">
                <h4 className="font-mono text-xs font-bold text-signal flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-ok shrink-0" />
                  <span>{concept.name}</span>
                </h4>
                <p className="text-xs font-sans text-ink leading-relaxed">
                  {concept.summary}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Key Formulas & Code Patterns */}
      <Card className="border border-ink shadow-[4px_4px_0_var(--rule)] bg-card">
        <CardHeader className="border-b border-rule pb-3">
          <div className="flex items-center gap-2 text-signal font-mono text-xs uppercase tracking-wider font-bold">
            <Terminal className="h-4 w-4" />
            <span>Essential Code Syntaxes & Calculation Formulas</span>
          </div>
        </CardHeader>
        <CardContent className="pt-4 space-y-2">
          {data.keyFormulas.map((formula, idx) => (
            <div key={idx} className="p-2.5 border border-rule bg-paper font-mono text-xs text-ink flex items-start gap-2">
              <span className="text-signal font-bold shrink-0">&gt;</span>
              <code className="text-xs break-all leading-normal">{formula}</code>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Common Traps Callout */}
      <Card className="border border-bad shadow-[4px_4px_0_var(--rule)] bg-bad/5">
        <CardHeader className="border-b border-bad/30 pb-3">
          <div className="flex items-center gap-2 text-bad font-mono text-xs uppercase tracking-wider font-bold">
            <AlertTriangle className="h-4 w-4" />
            <span>Examiner Watch-Out: Common Traps & Antipatterns</span>
          </div>
        </CardHeader>
        <CardContent className="pt-4 space-y-3">
          {data.commonTraps.map((trap, idx) => (
            <div key={idx} className="flex items-start gap-2 text-xs font-sans text-ink leading-relaxed">
              <span className="text-bad font-bold font-mono shrink-0">[{idx + 1}]</span>
              <span>{trap}</span>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
