"use client"

import React, { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { WPModuleId, getWPModule } from "@/lib/syllabus/wpSyllabus"
import { CheckCircle2, XCircle, ArrowRight, RotateCcw, Award } from "lucide-react"

interface QuizQuestion {
  id: string
  prompt: string
  scenario?: string
  options: string[]
  answerIndex: number
  explanation: string
}

const WP_QUIZ_QUESTIONS: Record<WPModuleId, QuizQuestion[]> = {
  'wp-m1': [
    {
      id: "wp1-q1",
      prompt: "Which HTML5 semantic tag should be used to enclose self-contained, independently distributable content like a blog post or news story?",
      scenario: "An IT department website needs to display multiple campus announcements and notices on its home page.",
      options: [
        "<section>",
        "<article>",
        "<aside>",
        "<main>"
      ],
      answerIndex: 1,
      explanation: "The <article> element represents a self-contained composition in a document, page, or site intended to be independently distributable or reusable (e.g., in syndication or RSS)."
    },
    {
      id: "wp1-q2",
      prompt: "If an element has width: 250px, padding: 20px, border: 5px, and box-sizing: content-box, what is its total rendered layout width?",
      scenario: "Designing a student profile card where layout elements must not overflow their assigned container column.",
      options: [
        "250px",
        "275px",
        "300px",
        "310px"
      ],
      answerIndex: 2,
      explanation: "With 'box-sizing: content-box', Total Width = Content Width (250) + Left/Right Padding (20×2 = 40) + Left/Right Border (5×2 = 10) = 300px. With 'border-box' it would remain 250px."
    },
    {
      id: "wp1-q3",
      prompt: "Which CSS layout mechanism is best suited for a 2-dimensional grid layout requiring explicit control over both rows and columns?",
      scenario: "Constructing a responsive college course catalog page showing semester subjects in structured matrices.",
      options: [
        "CSS Grid",
        "CSS Flexbox",
        "Float Layout",
        "Inline-Block"
      ],
      answerIndex: 0,
      explanation: "CSS Grid is inherently two-dimensional, allowing positioning along both row and column axes simultaneously. Flexbox is designed primarily for one-dimensional layouts along a single axis."
    },
    {
      id: "wp1-q4",
      prompt: "Which CSS selector has the highest specificity according to standard CSS cascading rules?",
      scenario: "Troubleshooting a navigation link color that is refusing to apply despite being declared in the stylesheet.",
      options: [
        "#navbar a.active",
        "nav ul li a:hover",
        ".header .nav-item a",
        "header > nav a"
      ],
      answerIndex: 0,
      explanation: "Specificity vector: #navbar a.active has [0, 1, 1, 1] (1 ID, 1 class, 1 element). The others have 0 ID selectors. ID selectors always override class and element selectors."
    },
    {
      id: "wp1-q5",
      prompt: "What is the primary purpose of adding the viewport meta tag '<meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">'?",
      scenario: "A college admissions page looks zoomed out and unreadable when opened on mobile smartphones.",
      options: [
        "It forces the browser to download mobile-specific image files automatically",
        "It sets the layout viewport width equal to the physical screen width and establishes a 1:1 scale ratio",
        "It disables pinch-to-zoom gestures entirely across all touch devices",
        "It triggers CSS Grid hardware acceleration on mobile GPUs"
      ],
      answerIndex: 1,
      explanation: "Without the viewport meta tag, mobile browsers default to rendering at a desktop viewport width (~980px) and scale it down. Setting width=device-width matches the CSS pixel grid to device width."
    }
  ],
  'wp-m2': [
    {
      id: "wp2-q1",
      prompt: "What is the key difference between 'let' and 'var' declarations in modern JavaScript?",
      scenario: "Refactoring legacy JavaScript student evaluation loops to eliminate accidental variable leakage.",
      options: [
        "'let' is block-scoped and exists in a Temporal Dead Zone before declaration, whereas 'var' is function-scoped and hoisted with undefined",
        "'var' is block-scoped and immutable, whereas 'let' can be reassigned globally",
        "'let' can be redeclared in the same scope, but 'var' throws a SyntaxError",
        "'let' attaches directly to the global window object in browsers"
      ],
      answerIndex: 0,
      explanation: "'let' adheres to block scoping ({...}) and cannot be accessed before declaration (Temporal Dead Zone). 'var' is function-scoped and hoisted to the top of its enclosing function with initial value undefined."
    },
    {
      id: "wp2-q2",
      prompt: "In the JavaScript Event Loop, what is the exact execution priority between Microtasks and Macrotasks?",
      scenario: "Tracing the console output of a script combining setTimeout(..., 0), Promise.resolve().then(...), and synchronous logs.",
      options: [
        "Macrotasks run first, followed by microtasks at the end of the script",
        "Synchronous code runs, then the Microtask Queue is completely drained, and then ONE Macrotask is executed",
        "Timers always execute before Promises regardless of call stack state",
        "Microtasks and macrotasks alternate evenly in round-robin order"
      ],
      answerIndex: 1,
      explanation: "After synchronous code finishes and the Call Stack empties, the Event Loop drains ALL microtasks (Promises, queueMicrotask) before picking the next macrotask (setTimeout, setInterval, I/O)."
    },
    {
      id: "wp2-q3",
      prompt: "What will the following ES6 code snippet output? const [a, , b = 10] = [1, 2]; console.log(a, b);",
      scenario: "Reviewing array destructuring code used to unpack student grade percentiles.",
      options: [
        "1 2",
        "1 10",
        "1 undefined",
        "SyntaxError: Missing element"
      ],
      answerIndex: 1,
      explanation: "Array destructuring skips the second element (2) via the empty comma, and 'b' falls back to its default value 10 because the 3rd element in [1, 2] is undefined."
    },
    {
      id: "wp2-q4",
      prompt: "Why does an ES6 Arrow Function behave differently than a standard 'function' expression regarding the 'this' keyword?",
      scenario: "Handling a click event inside a class component where 'this.state' is undefined in callback.",
      options: [
        "Arrow functions have dynamic 'this' bound to the invoking element",
        "Arrow functions lack their own 'this' and lexically inherit 'this' from the enclosing execution context",
        "Arrow functions bind 'this' to the global window object permanently",
        "Arrow functions require explicit .bind(this) calls in the constructor"
      ],
      answerIndex: 1,
      explanation: "Arrow functions do not define their own 'this'; they capture the 'this' value of the enclosing lexical scope at the time they are created, making them ideal for event callbacks."
    },
    {
      id: "wp2-q5",
      prompt: "In DOM Event Propagation, what are the three phases in order of execution?",
      scenario: "Implementing an interactive shopping cart table where row clicks must not trigger the delete button handler.",
      options: [
        "Bubbling phase -> Target phase -> Capturing phase",
        "Capturing phase -> Target phase -> Bubbling phase",
        "Dispatch phase -> Evaluation phase -> Propagation phase",
        "Target phase -> Bubbling phase -> Termination phase"
      ],
      answerIndex: 1,
      explanation: "Events travel down from the window/document to the target element (Capturing Phase), trigger at the target (Target Phase), and propagate back up the tree (Bubbling Phase). e.stopPropagation() halts bubbling."
    }
  ],
  'wp-m3': [
    {
      id: "wp3-q1",
      prompt: "Why must React components and hooks adhere to the rule that Hooks cannot be called inside loops, conditions, or nested functions?",
      scenario: "A student portal dashboard throws an invariant error: 'Rendered fewer hooks than expected'.",
      options: [
        "React relies on the call order of hooks remaining strictly identical across every render to match state variables to internal Fiber arrays",
        "Conditional hooks overload the JavaScript Call Stack and trigger memory leaks",
        "Hooks called in loops create duplicate Virtual DOM nodes in memory",
        "The browser V8 engine disallows function pointers inside conditional statements"
      ],
      answerIndex: 0,
      explanation: "React relies on a linked list or array of hook states. To preserve state pairing across re-renders, the sequence of hook invocations must be unconditionally identical on every render cycle."
    },
    {
      id: "wp3-q2",
      prompt: "In Next.js, which rendering strategy is optimal for a Live Examination Timetable where seat allocations change by the minute?",
      scenario: "Designing a university exam portal needing instant real-time data accuracy with search engine indexing.",
      options: [
        "SSG (Static Site Generation)",
        "SSR (Server-Side Rendering)",
        "CSR with zero initial HTML",
        "Pure Static HTML file"
      ],
      answerIndex: 1,
      explanation: "SSR (Server-Side Rendering) fetches and compiles fresh data on the server for every single incoming HTTP request, ensuring students always receive the most up-to-date seat timetable without stale cache."
    },
    {
      id: "wp3-q3",
      prompt: "What is the purpose of the dependency array in React's 'useEffect' hook?",
      scenario: "A component fetching student records enters an infinite loop, continuously re-fetching data from the API.",
      options: [
        "It defines which HTML DOM elements the effect will query",
        "It specifies the variables that React compares between renders; the effect re-runs only if at least one dependency has changed",
        "It limits the execution time of asynchronous promises to avoid timeouts",
        "It automatically cancels pending HTTP requests when empty"
      ],
      answerIndex: 1,
      explanation: "React performs shallow comparison (Object.is) on the dependency array. If empty ([]), it runs only once on mount and unmount. If omitted, it runs after EVERY single render, causing infinite loops if state is set inside."
    },
    {
      id: "wp3-q4",
      prompt: "Why is using array index as a 'key' prop (e.g. key={index}) considered an anti-pattern when rendering dynamic lists in React?",
      scenario: "A list of registered courses displays wrong input values after deleting or re-ordering items.",
      options: [
        "It throws a compilation error in Next.js production builds",
        "When items are reordered, deleted, or prepended, array indexes change, causing React's reconciliation diffing to confuse component identities and retain stale input state",
        "Array indexes increase memory consumption by 300% in the Virtual DOM",
        "React keys only accept UUID string identifiers"
      ],
      answerIndex: 1,
      explanation: "Keys provide a stable identity for list items. If an item is deleted from the beginning of a list, the item previously at index 1 becomes index 0, tricking React into reusing the wrong DOM node."
    },
    {
      id: "wp3-q5",
      prompt: "What is Incremental Static Regeneration (ISR) in Next.js?",
      scenario: "A college course catalog with 5,000 subjects needs fast CDN delivery without rebuilding the whole site for small updates.",
      options: [
        "Rebuilding all 5,000 pages synchronously whenever any single record changes",
        "Serving pre-rendered static pages from edge cache while revalidating and regenerating updated pages in the background on demand",
        "Converting the entire application into a single-page client-rendered application",
        "Streaming server components directly over WebSockets"
      ],
      answerIndex: 1,
      explanation: "ISR allows you to retain the sub-millisecond benefits of static site generation while updating static pages in the background using a 'revalidate' timer or on-demand webhook."
    }
  ],
  'wp-m4': [
    {
      id: "wp4-q1",
      prompt: "How does Express.js pass control from one middleware function to the next in the request-response cycle?",
      scenario: "An authentication middleware verifies a token; what must it call to allow the route handler to execute?",
      options: [
        "res.continue()",
        "next()",
        "req.nextStep()",
        "return true"
      ],
      answerIndex: 1,
      explanation: "Calling 'next()' passes control to the next middleware function in the stack. If 'next()' is not called and 'res.send()' is not called, the request hangs indefinitely."
    },
    {
      id: "wp4-q2",
      prompt: "What signature distinguishes an Error-Handling Middleware in Express from standard middleware?",
      scenario: "Catching uncaught exceptions across all API endpoints in a centralized handler.",
      options: [
        "It takes 4 parameters: (err, req, res, next)",
        "It is declared with 'async error (req, res)'",
        "It must return a Promise rejecting an Error object",
        "It uses app.catchError() instead of app.use()"
      ],
      answerIndex: 0,
      explanation: "Express identifies error-handling middleware specifically by checking 'fn.length === 4', meaning it must explicitly accept four arguments: (err, req, res, next)."
    },
    {
      id: "wp4-q3",
      prompt: "Which HTTP status code is most appropriate for a REST API endpoint that successfully creates a new student registration record?",
      scenario: "Responding to a POST /api/students submission with the newly generated record ID.",
      options: [
        "200 OK",
        "201 Created",
        "204 No Content",
        "304 Not Modified"
      ],
      answerIndex: 1,
      explanation: "HTTP 201 Created indicates that the request has succeeded and led to the creation of a new resource, typically accompanied by a Location header or the created entity in JSON."
    },
    {
      id: "wp4-q4",
      prompt: "Why should developers avoid 'fs.readFileSync()' in production Node.js web servers?",
      scenario: "Reading an institution syllabus configuration file during user login requests.",
      options: [
        "It is deprecated in all modern versions of Node.js",
        "It synchronously blocks the single-threaded Event Loop, preventing the server from handling any other incoming user requests until the disk read finishes",
        "It cannot read files larger than 1024 bytes",
        "It bypasses operating system security permissions"
      ],
      answerIndex: 1,
      explanation: "Node.js runs single-threaded. Synchronous file I/O stops the entire event loop dead in its tracks. All concurrent users will experience severe lag or request timeouts."
    },
    {
      id: "wp4-q5",
      prompt: "What is the purpose of the 'cors' middleware package in an Express.js backend?",
      scenario: "A Next.js frontend on localhost:3000 fails to fetch student API data from Express on localhost:5000.",
      options: [
        "It encrypts all network packets using TLS 1.3",
        "It configures HTTP response headers like 'Access-Control-Allow-Origin' so browser same-origin security policies permit cross-origin API calls",
        "It compresses API responses using gzip algorithms",
        "It caches database queries in server RAM"
      ],
      answerIndex: 1,
      explanation: "CORS (Cross-Origin Resource Sharing) headers inform web browsers that a web app running at one origin has permission to access resources from a server at a different origin."
    }
  ],
  'wp-m5': [
    {
      id: "wp5-q1",
      prompt: "How does PHP Data Objects (PDO) Prepared Statements eliminate SQL Injection vulnerabilities?",
      scenario: "Protecting an online student exam login form against credentials bypass attacks like \"' OR '1'='1\".",
      options: [
        "By replacing all vowels in user input with escape slashes",
        "By separating the SQL query structure from user parameters: the query template is pre-compiled first, and user inputs are strictly bound as literal data values",
        "By encrypting the entire MySQL database using AES-256",
        "By disabling POST requests that contain punctuation marks"
      ],
      answerIndex: 1,
      explanation: "Prepared statements compile the SQL command structure into an execution plan first. When user inputs are supplied in execute(), the database engine treats them strictly as data, never executable SQL grammar."
    },
    {
      id: "wp5-q2",
      prompt: "Which PHP Superglobal array contains data submitted via an HTTP POST request from an HTML form?",
      scenario: "Retrieving student registration details after form submission.",
      options: [
        "$_REQUEST_BODY",
        "$_GET",
        "$_POST",
        "$_SERVER['FORM']"
      ],
      answerIndex: 2,
      explanation: "$_POST is an associative array of variables passed to the current script via the HTTP POST method (such as an HTML <form method=\"POST\">)."
    },
    {
      id: "wp5-q3",
      prompt: "What must be called at the very beginning of a PHP script before accessing or storing data in the '$_SESSION' superglobal?",
      scenario: "Maintaining user authentication state across page navigations in a student portal.",
      options: [
        "session_start()",
        "session_init()",
        "session_register()",
        "new Session()"
      ],
      answerIndex: 0,
      explanation: "'session_start()' creates a session or resumes the current one based on a session identifier passed via a GET or POST request, or passed via a cookie (PHPSESSID)."
    },
    {
      id: "wp5-q4",
      prompt: "Which native PHP function is recommended for securely hashing passwords before storing them in a database?",
      scenario: "Storing new student account passwords securely to resist rainbow table and offline GPU attacks.",
      options: [
        "md5($password)",
        "sha1($password)",
        "password_hash($password, PASSWORD_BCRYPT)",
        "base64_encode($password)"
      ],
      answerIndex: 2,
      explanation: "'password_hash()' with PASSWORD_BCRYPT or PASSWORD_DEFAULT implements slow, adaptive hashing with an automatically generated cryptographically secure salt."
    },
    {
      id: "wp5-q5",
      prompt: "What is the difference between 'include' and 'require' in PHP?",
      scenario: "Importing a database connection header file across multiple campus portal scripts.",
      options: [
        "'include' produces a fatal error (E_COMPILE_ERROR) and stops script execution if the file is missing; 'require' only produces a warning",
        "'require' produces a fatal error (E_COMPILE_ERROR) and halts execution if the file is missing; 'include' only produces a warning (E_WARNING) and continues executing",
        "'require' executes faster because it skips syntax checking",
        "'include' is restricted to HTML templates only"
      ],
      answerIndex: 1,
      explanation: "'require' is identical to 'include', except that upon failure it will produce a fatal E_COMPILE_ERROR level error, halting the script. Critical dependencies like db configs should always use 'require'."
    }
  ],
  'wp-m6': [
    {
      id: "wp6-q1",
      prompt: "What are the three dot-separated components of a JSON Web Token (JWT)?",
      scenario: "Inspecting an Authorization Bearer token header sent to a protected university microservice.",
      options: [
        "Header . Payload . Signature",
        "Client . Server . Nonce",
        "Username . Password . Hash",
        "Issuer . Audience . Timestamp"
      ],
      answerIndex: 0,
      explanation: "A JWT is composed of three Base64URL-encoded parts separated by dots: Header (algorithm & token type), Payload (user claims and expiry), and Signature (verifies integrity)."
    },
    {
      id: "wp6-q2",
      prompt: "Why should sensitive JWT tokens generally be stored in 'HttpOnly' cookies rather than browser 'localStorage'?",
      scenario: "Hardening a college web application against OWASP Top 10 client-side attacks.",
      options: [
        "'localStorage' is limited to 100 bytes of data",
        "Cookies stored with the 'HttpOnly' flag cannot be accessed by client-side JavaScript, neutralizing token theft via Cross-Site Scripting (XSS)",
        "Browser cookies automatically renew every 15 minutes",
        "'localStorage' requires a database round-trip on every read"
      ],
      answerIndex: 1,
      explanation: "If an application suffers from an XSS flaw, malicious injected scripts can easily read 'localStorage.getItem(\"token\")'. 'HttpOnly' cookies are inaccessible to document.cookie in JS."
    },
    {
      id: "wp6-q3",
      prompt: "What HTTP method does a web browser use to perform a CORS Preflight check?",
      scenario: "A Next.js frontend sends a POST request with 'Content-Type: application/json' and custom Auth headers to an external API.",
      options: [
        "GET",
        "OPTIONS",
        "HEAD",
        "TRACE"
      ],
      answerIndex: 1,
      explanation: "For non-simple HTTP requests, browsers automatically issue an 'OPTIONS' preflight request to inspect 'Access-Control-Allow-Methods' and 'Access-Control-Allow-Headers' before sending the actual request."
    },
    {
      id: "wp6-q4",
      prompt: "In Git version control, how do you resolve a Merge Conflict between two branches?",
      scenario: "Two developers modified the same line in a course syllabus component on 'feature/auth' and 'main'.",
      options: [
        "Git automatically deletes both files and resets the repository",
        "Open the conflicted files, manually choose the correct code between '<<<<<<<', '=======', and '>>>>>>>' markers, stage the resolved files with 'git add', and commit",
        "Run 'git drop conflict' to ignore the changes",
        "Run 'git push --force' immediately"
      ],
      answerIndex: 1,
      explanation: "Git inserts conflict markers indicating the incoming and current branch changes. Developers inspect the code, remove the markers, stage the corrected files with 'git add', and complete the merge commit."
    },
    {
      id: "wp6-q5",
      prompt: "Which OWASP Top 10 vulnerability involves an attacker tricking a victim's authenticated browser into executing unwanted actions on a trusted site?",
      scenario: "A victim visits a malicious webpage that contains a hidden image tag: <img src=\"https://bank.com/transfer?amount=1000&to=attacker\">.",
      options: [
        "Cross-Site Scripting (XSS)",
        "Cross-Site Request Forgery (CSRF)",
        "SQL Injection",
        "Denial of Service (DoS)"
      ],
      answerIndex: 1,
      explanation: "CSRF exploits the trust a site has in the user's browser by abusing ambient credentials (automatic session cookies). It is mitigated by anti-CSRF tokens and 'SameSite=Lax/Strict' cookie attributes."
    }
  ]
}

export default function WPQuiz({ moduleId }: { moduleId: WPModuleId }) {
  const modInfo = getWPModule(moduleId)
  const questions = WP_QUIZ_QUESTIONS[moduleId] || WP_QUIZ_QUESTIONS['wp-m1']

  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedOption, setSelectedOption] = useState<number | null>(null)
  const [isAnswered, setIsAnswered] = useState(false)
  const [score, setScore] = useState(0)

  const currentQ = questions[currentIndex]

  const handleSelect = (idx: number) => {
    if (isAnswered) return
    setSelectedOption(idx)
  }

  const handleSubmit = () => {
    if (selectedOption === null || isAnswered || !currentQ) return
    setIsAnswered(true)

    if (selectedOption === currentQ.answerIndex) {
      setScore(prev => prev + 1)
    }
  }

  const handleNext = () => {
    setSelectedOption(null)
    setIsAnswered(false)
    setCurrentIndex(prev => prev + 1)
  }

  const handleRestart = () => {
    setCurrentIndex(0)
    setSelectedOption(null)
    setIsAnswered(false)
    setScore(0)
  }

  if (!currentQ || currentIndex >= questions.length) {
    return (
      <div className="max-w-3xl mx-auto py-8">
        <Card className="border border-ink shadow-[4px_4px_0_var(--rule)] p-6 sm:p-10 text-center space-y-6 bg-card">
          <div className="inline-block p-4 bg-signal/10 border border-signal/30 text-signal mb-2">
            <Award className="h-10 w-10 mx-auto" />
          </div>
          <div>
            <h2 className="text-3xl font-serif text-ink font-bold">Practice Round Complete!</h2>
            <p className="text-sm font-sans text-ink-soft mt-2">
              Module: {modInfo?.title}
            </p>
          </div>

          <div className="p-6 border border-ink bg-paper max-w-sm mx-auto shadow-[2px_2px_0_var(--rule)]">
            <span className="font-mono text-xs uppercase tracking-wider text-ink-soft block mb-1">Final Score</span>
            <span className="font-mono text-4xl font-bold text-signal">
              {score} / {questions.length}
            </span>
            <span className="block font-sans text-xs text-ink-soft mt-2">
              {score === questions.length ? "Mastery Achieved! 100% correct." : "Good effort. Review the notes and try again."}
            </span>
          </div>

          <div className="flex justify-center gap-4 pt-4">
            <Button
              onClick={handleRestart}
              className="inline-flex items-center gap-2 bg-ink hover:bg-ink/90 text-paper font-mono uppercase tracking-wider text-xs px-6 py-2.5 shadow-[2px_2px_0_var(--rule)] rounded-none"
            >
              <RotateCcw className="h-4 w-4" />
              <span>Restart Quiz</span>
            </Button>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto py-4 sm:py-8 space-y-6">
      <Card className="border border-ink shadow-[4px_4px_0_var(--rule)] bg-card">
        {/* Header bar */}
        <CardHeader className="border-b border-rule pb-3">
          <div className="flex justify-between items-center font-mono text-[11px]">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 bg-ink text-paper font-bold">{modInfo?.code}</span>
              <span className="text-ink-soft uppercase font-bold">
                Question {currentIndex + 1} of {questions.length}
              </span>
            </div>
            <span className="text-signal font-bold font-mono">
              Score: {score}
            </span>
          </div>
        </CardHeader>

        <CardContent className="pt-6 space-y-6">
          {/* Scenario Callout if present */}
          {currentQ.scenario && (
            <div className="p-3 bg-paper border-l-4 border-signal text-ink-soft font-sans text-xs leading-relaxed">
              <span className="font-mono font-bold text-signal uppercase text-[10px] block mb-0.5">Scenario / Context:</span>
              {currentQ.scenario}
            </div>
          )}

          {/* Question Prompt */}
          <h3 className="font-serif text-lg sm:text-xl font-bold text-ink leading-snug">
            {currentQ.prompt}
          </h3>

          {/* Options */}
          <div className="space-y-2.5">
            {currentQ.options.map((option, idx) => {
              const isSelected = selectedOption === idx
              const isCorrect = idx === currentQ.answerIndex

              let btnStyle = "border-rule bg-paper hover:border-ink text-ink"
              let badgeStyle = "border-rule bg-card text-ink-soft"

              if (isAnswered) {
                if (isCorrect) {
                  // User requested: "rather then pop alert kep it inside window only making it green"
                  btnStyle = "border-ok bg-ok text-paper shadow-[2px_2px_0_var(--ok)] font-medium"
                  badgeStyle = "border-paper bg-paper text-ok font-bold"
                } else if (isSelected) {
                  btnStyle = "border-bad bg-bad text-paper font-medium"
                  badgeStyle = "border-paper bg-paper text-bad font-bold"
                } else {
                  btnStyle = "border-rule/40 bg-paper/50 text-ink-soft opacity-60"
                  badgeStyle = "border-rule/40 bg-card/50 text-ink-soft"
                }
              } else if (isSelected) {
                btnStyle = "border-signal bg-signal text-paper shadow-[2px_2px_0_var(--signal)] font-medium"
                badgeStyle = "border-paper bg-paper text-signal font-bold"
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleSelect(idx)}
                  disabled={isAnswered}
                  className={`w-full p-3.5 border text-left flex items-start gap-3 transition-all cursor-pointer ${btnStyle}`}
                >
                  <span className={`w-6 h-6 rounded-none border flex items-center justify-center font-mono text-xs shrink-0 mt-0.5 ${badgeStyle}`}>
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <span className="text-xs sm:text-sm font-sans leading-relaxed flex-1">
                    {option}
                  </span>
                </button>
              )
            })}
          </div>

          {/* In-Window Explanation: "inside window only making it green" */}
          {isAnswered && (
            <div className={`p-4 border font-sans text-xs leading-relaxed space-y-1.5 ${
              selectedOption === currentQ.answerIndex 
                ? "bg-ok/10 border-ok text-ink" 
                : "bg-paper border-ink text-ink"
            }`}>
              <div className="flex items-center gap-1.5 font-mono text-[10px] uppercase font-bold tracking-wider">
                {selectedOption === currentQ.answerIndex ? (
                  <span className="text-ok flex items-center gap-1">
                    <CheckCircle2 className="h-4 w-4" /> Correct Answer
                  </span>
                ) : (
                  <span className="text-bad flex items-center gap-1">
                    <XCircle className="h-4 w-4" /> Incorrect Selection
                  </span>
                )}
                <span className="text-ink-soft">· Examiner Notes</span>
              </div>
              <p className="text-ink leading-relaxed">
                {currentQ.explanation}
              </p>
            </div>
          )}

          {/* Action buttons */}
          <div className="flex justify-between items-center pt-4 border-t border-rule">
            <span className="font-mono text-[11px] text-ink-soft">
              {!isAnswered ? "Select an option and submit" : "Review explanation above"}
            </span>

            {!isAnswered ? (
              <Button
                onClick={handleSubmit}
                disabled={selectedOption === null}
                className="bg-ink hover:bg-ink/90 text-paper font-mono uppercase tracking-wider text-xs px-5 py-2 shadow-[2px_2px_0_var(--rule)] disabled:opacity-40 rounded-none cursor-pointer"
              >
                Submit Answer
              </Button>
            ) : (
              <Button
                onClick={handleNext}
                className="inline-flex items-center gap-2 bg-signal hover:bg-signal/90 text-paper font-mono uppercase tracking-wider text-xs px-5 py-2 shadow-[2px_2px_0_var(--ink)] rounded-none cursor-pointer"
              >
                <span>{currentIndex + 1 < questions.length ? "Next Question" : "View Final Score"}</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
