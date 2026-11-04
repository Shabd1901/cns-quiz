import { Plate, TopicPresentation } from "@/lib/present/types"

// ==========================================
// WP MODULE 1: Web Architecture & CSS Box Model
// ==========================================
export const wp1Plates: Plate[] = [
  {
    id: 'wp1-hook',
    kind: 'hook',
    title: 'The Anatomy of the Modern Web',
    subtitle: 'From Tim Berners-Lee to Reactive Edge Systems',
    caption: 'How does a browser convert a string of HTML, CSS, and HTTP bytes into an interactive digital interface in 16 milliseconds?',
    eli5Caption: 'The web is a conversation: your browser asks, the server answers, and CSS draws the pixels.',
    speakerNotes: {
      script: 'Welcome to Web Technology Fundamentals. In this presentation, we explore how client-server protocols, HTML5 semantic structures, and the CSS box model collaborate to produce accessible, high-performance web applications.',
      likelyQuestions: [
        {
          question: 'What is the real difference between 2-tier and 3-tier web architectures?',
          answer: 'In 2-tier, client connects directly to the database. In 3-tier, an application server sits between client and DB, enforcing business logic, caching, and security boundaries.'
        }
      ]
    }
  },
  {
    id: 'wp1-analogy',
    kind: 'analogy',
    title: 'The Blueprint and the Shipping Box',
    subtitle: 'HTML5 as Architecture, CSS Box Model as Shipping Packaging',
    caption: 'HTML5 semantic tags form the steel framing of a building; the CSS Box Model is the concentric packaging (Content, Padding, Border, Margin) protecting the cargo.',
    eli5Caption: 'HTML is the skeleton, CSS is the skin and clothes, and box-sizing determines how wide the coat fits.',
    speakerNotes: {
      script: 'Always use semantic tags like header, nav, main, and article to give structural meaning to assistive tech and search engines. Remember the box model calculation: content-box expands outer width, whereas border-box keeps width fixed.',
      likelyQuestions: [
        {
          question: 'Why does border-box solve layout breakage?',
          answer: 'Because border-box subtracts padding and border from the specified width, ensuring that adding padding never pushes adjacent columns down.'
        }
      ]
    }
  },
  {
    id: 'wp1-concept',
    kind: 'concept',
    title: 'Modern Layouts: Flexbox vs CSS Grid',
    subtitle: '1D Linear Flow vs 2D Coordinate Matrix',
    caption: 'Flexbox distributes items along a single axis (row or column); CSS Grid aligns items along both rows and columns simultaneously with fr units.',
    eli5Caption: 'Flexbox is for a train of items in a single row or column; Grid is for the whole chessboard.',
    speakerNotes: {
      script: 'Rule of thumb for examiners: Flexbox for components like navigation bars and toolbars; CSS Grid for page layouts, galleries, and dashboard cards.',
      likelyQuestions: [
        {
          question: 'Can you nest Flexbox inside CSS Grid?',
          answer: 'Yes! Grid structures the macro layout of the page, while Flexbox handles internal alignment of header, button, or card elements.'
        }
      ]
    }
  }
]

export const wp1Presentation: TopicPresentation = {
  moduleId: 'wp-m1',
  moduleTitle: 'ITC504 M1: Web Fundamentals & CSS3',
  topicId: 'web-arch-http',
  topicTitle: 'Client-Server Architecture & HTTP Protocol',
  targetDurationMinutes: 12,
  plates: wp1Plates
}

// ==========================================
// WP MODULE 2: JavaScript & Modern Client-Side
// ==========================================
export const wp2Plates: Plate[] = [
  {
    id: 'wp2-hook',
    kind: 'hook',
    title: 'Single-Threaded Speed: The JavaScript Concurrency Miracle',
    subtitle: 'How a Single Thread Handles Millions of Network Events Without Freezing',
    caption: 'JavaScript executes on a single main thread, yet powers real-time interfaces, video streaming, and rapid asynchronous I/O. What is the engine secret?',
    eli5Caption: 'JavaScript does not do two things at once; it passes chores to browser helpers and handles results as they finish.',
    speakerNotes: {
      script: 'JavaScript uses an event-driven, non-blocking I/O model powered by the Event Loop. We will unpack how the Call Stack, Web APIs, Microtask Queue, and Callback Queue interact.',
      likelyQuestions: [
        {
          question: 'What happens when you run while(true) in JavaScript?',
          answer: 'The Call Stack never empties. The Event Loop is blocked, so no clicks, animations, or async callbacks can ever execute.'
        }
      ]
    }
  },
  {
    id: 'wp2-analogy',
    kind: 'analogy',
    title: 'The Head Chef and the Kitchen Waiters',
    subtitle: 'Call Stack, Web APIs, Microtasks, and Macrotasks',
    caption: 'The Head Chef (Call Stack) prepares one dish at a time. Assistants (Web APIs) wait for ovens. VIP tickets (Promises) must ALL be cleared before regular tickets (setTimeout).',
    eli5Caption: 'Chef cooks; VIP tickets (Promises) jump ahead of normal timer tickets.',
    speakerNotes: {
      script: 'Emphasize the priority order for exam questions: Synchronous call stack code runs first -> Microtask queue drains completely -> ONE macrotask runs -> Render phase -> repeat.',
      likelyQuestions: [
        {
          question: 'Why does Promise.resolve() run before setTimeout(..., 0)?',
          answer: 'Promises enter the Microtask Queue, which the Event Loop drains immediately after call stack ticks before inspecting the Macrotask Queue.'
        }
      ]
    }
  }
]

export const wp2Presentation: TopicPresentation = {
  moduleId: 'wp-m2',
  moduleTitle: 'ITC504 M2: JavaScript & Modern Client-Side',
  topicId: 'js-core-scoping',
  topicTitle: 'JavaScript Core, Scoping & Event Loop',
  targetDurationMinutes: 14,
  plates: wp2Plates
}

// ==========================================
// WP MODULE 3: React & Next.js
// ==========================================
export const wp3Plates: Plate[] = [
  {
    id: 'wp3-hook',
    kind: 'hook',
    title: 'Declarative UI & The Virtual DOM Revolution',
    subtitle: 'Transforming Imperative DOM Spaghetti into Predictable Component Trees',
    caption: 'Why did React replace manual DOM manipulation with a virtual abstraction, and how does Next.js bridge client components with server rendering?',
    eli5Caption: 'Instead of moving each brick by hand, you sketch the whole house and let React swap only what changed.',
    speakerNotes: {
      script: 'React decouples what the UI should look like from the imperative steps to mutate the DOM. The Virtual DOM diffing algorithm operates in O(N) time thanks to heuristic keys and component types.',
      likelyQuestions: [
        {
          question: 'What makes direct DOM manipulation slow?',
          answer: 'Direct DOM manipulation triggers browser layout reflow and repaint passes. React batches changes into minimal real DOM mutations.'
        }
      ]
    }
  },
  {
    id: 'wp3-concept',
    kind: 'concept',
    title: 'Next.js Hybrid Rendering Spectrum',
    subtitle: 'CSR vs SSR vs SSG vs ISR',
    caption: 'CSR runs in user browsers; SSR renders on every server request; SSG builds static pages at compile time; ISR revalidates cached static pages on demand.',
    eli5Caption: 'SSG is a pre-printed newspaper; SSR is a fresh live TV broadcast; ISR is a newspaper updated automatically in the background.',
    speakerNotes: {
      script: 'For Mumbai University exams, memorize when to recommend SSR vs SSG: SSG for static public pages (About, Blogs), SSR for dynamic authenticated portals (Student Exam Results, Seat Availability).',
      likelyQuestions: [
        {
          question: 'What is the main benefit of Next.js App Router Server Components?',
          answer: 'Server components execute only on the server, zeroing out client-side bundle size and allowing direct access to server databases.'
        }
      ]
    }
  }
]

export const wp3Presentation: TopicPresentation = {
  moduleId: 'wp-m3',
  moduleTitle: 'ITC504 M3: React & Next.js Frontend',
  topicId: 'react-components-jsx',
  topicTitle: 'React Fundamentals, JSX & Virtual DOM',
  targetDurationMinutes: 15,
  plates: wp3Plates
}

// ==========================================
// WP MODULE 4: Node.js & Express
// ==========================================
export const wp4Plates: Plate[] = [
  {
    id: 'wp4-hook',
    kind: 'hook',
    title: 'Server-Side JavaScript: The Node.js & Express Architecture',
    subtitle: 'High-Concurrency Microservices with libuv and Middleware Chains',
    caption: 'How can a single-threaded runtime serve 20,000 simultaneous HTTP connections without multi-threaded memory overhead?',
    eli5Caption: 'Node never waits for the phone to stop ringing; it writes down who called and answers when the data is ready.',
    speakerNotes: {
      script: 'Node.js delegates blocking I/O to libuv epoll and kernel pollers. Express structures applications as an ordered sequence of middleware functions (req, res, next).',
      likelyQuestions: [
        {
          question: 'What is the purpose of next() in Express?',
          answer: 'next() passes control to the next middleware in the pipeline. Omitting it without sending a response hangs the HTTP request.'
        }
      ]
    }
  }
]

export const wp4Presentation: TopicPresentation = {
  moduleId: 'wp-m4',
  moduleTitle: 'ITC504 M4: Node.js & Express.js',
  topicId: 'nodejs-architecture',
  topicTitle: 'Node.js Architecture & Middleware Pipeline',
  targetDurationMinutes: 12,
  plates: wp4Plates
}

// ==========================================
// WP MODULE 5: PHP & MySQL / PDO
// ==========================================
export const wp5Plates: Plate[] = [
  {
    id: 'wp5-hook',
    kind: 'hook',
    title: 'Dynamic Web Persistence: PHP & MySQL Security',
    subtitle: 'From Stateless Requests to Bulletproof PDO Prepared Statements',
    caption: 'How does PHP manage session state across stateless HTTP requests, and why do PDO prepared statements eliminate SQL Injection at the root?',
    eli5Caption: 'PDO separates the blueprint from user input so bad inputs can never act like code.',
    speakerNotes: {
      script: 'PHP Superglobals ($_POST, $_SESSION, $_COOKIE) organize incoming HTTP data. To eliminate SQL Injection, never concatenate strings into SQL; always use PDO prepared statements.',
      likelyQuestions: [
        {
          question: 'Why is session_start() required before outputting any HTML?',
          answer: 'Because session_start() sends the Set-Cookie PHPSESSID header, and HTTP headers must be transmitted before the response body.'
        }
      ]
    }
  }
]

export const wp5Presentation: TopicPresentation = {
  moduleId: 'wp-m5',
  moduleTitle: 'ITC504 M5: PHP & MySQL',
  topicId: 'php-syntax-superglobals',
  topicTitle: 'PHP Architecture & PDO Database Security',
  targetDurationMinutes: 12,
  plates: wp5Plates
}

// ==========================================
// WP MODULE 6: Full-Stack Architecture, JWT & OWASP
// ==========================================
export const wp6Plates: Plate[] = [
  {
    id: 'wp6-hook',
    kind: 'hook',
    title: 'Enterprise Full-Stack Architecture & Web Security',
    subtitle: '3-Tier Separation, CORS Preflight, Stateless JWT, and OWASP Top 10',
    caption: 'How do production web applications isolate presentation from data, authenticate users across distributed microservices, and defend against OWASP exploits?',
    eli5Caption: '3-tier is dining room, kitchen, and pantry; JWT is a tamper-proof digital wristband; CORS is the bouncer at the door.',
    speakerNotes: {
      script: 'In Module 6, we synthesize the entire full-stack lifecycle: presentation tier (React/Next), business tier (Node/PHP), data tier (MySQL). We implement CORS, JWT authorization headers, Git CI/CD, and OWASP defenses.',
      likelyQuestions: [
        {
          question: 'Why do browsers send an OPTIONS request before a POST with application/json?',
          answer: 'That is the CORS preflight check. It verifies whether the server permits custom headers and cross-origin methods before sending sensitive data.'
        }
      ]
    }
  }
]

export const wp6Presentation: TopicPresentation = {
  moduleId: 'wp-m6',
  moduleTitle: 'ITC504 M6: Full-Stack & Web Security',
  topicId: 'fullstack-tier-cors',
  topicTitle: '3-Tier Architecture, JWT & Web Security',
  targetDurationMinutes: 15,
  plates: wp6Plates
}
