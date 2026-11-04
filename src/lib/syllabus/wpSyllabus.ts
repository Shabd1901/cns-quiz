export type WPModuleId = 'wp-m1' | 'wp-m2' | 'wp-m3' | 'wp-m4' | 'wp-m5' | 'wp-m6'
export type BloomLevel = 'L1' | 'L2' | 'L3' | 'L4' | 'L5' | 'L6'
export type ContentStatus = 'ready' | 'soon'

export interface WPTopicInfo {
  id: string
  title: string
  hours: number
  bloom: BloomLevel
  status: ContentStatus
  description: string
  tags: string[]
  isSelfLearning?: boolean
}

export interface WPModuleInfo {
  id: WPModuleId
  code: string
  title: string
  hours: number
  bloomRange: string
  status: ContentStatus
  description: string
  slug: string
  topics: WPTopicInfo[]
}

export const WP_SYLLABUS: WPModuleInfo[] = [
  {
    id: 'wp-m1',
    code: 'WP-M1',
    slug: 'wp-fundamentals',
    title: 'Web Technology Fundamentals, HTML5 and CSS3',
    hours: 8,
    bloomRange: 'L1, L2, L3, L6',
    status: 'ready',
    description: 'Foundations of web development, client-server architecture, HTTP protocol, HTML5 semantic markup, multimedia canvas, CSS3 box model, Flexbox, CSS Grid, and responsive design.',
    topics: [
      {
        id: 'web-arch-http',
        title: 'Client-Server Architecture & HTTP Protocol',
        hours: 1.5,
        bloom: 'L2',
        status: 'ready',
        description: 'Evolution of web technologies, 2-tier vs 3-tier architecture, HTTP request-response cycle, methods (GET, POST, PUT, DELETE), status codes, and headers.',
        tags: ['architecture', 'http', 'network']
      },
      {
        id: 'html5-semantics-forms',
        title: 'HTML5 Semantic Elements & Form Validation',
        hours: 2.0,
        bloom: 'L3',
        status: 'ready',
        description: 'Semantic tags (header, nav, main, article, section, aside, footer), native form validation attributes, accessible inputs, and audio/video multimedia.',
        tags: ['html5', 'semantics', 'forms']
      },
      {
        id: 'css-box-model-selectors',
        title: 'CSS3 Fundamentals, Selectors & The Box Model',
        hours: 1.5,
        bloom: 'L3',
        status: 'ready',
        description: 'Cascade hierarchy, specificity calculation (Inline > ID > Class > Element), Box Model dimensions (content, padding, border, margin), and box-sizing.',
        tags: ['css3', 'box-model', 'specificity']
      },
      {
        id: 'css-flexbox-grid',
        title: 'Modern Layouts: Flexbox & CSS Grid',
        hours: 1.5,
        bloom: 'L6',
        status: 'ready',
        description: 'One-dimensional layouts with Flexbox (axes, justify-content, align-items, flex-grow) vs two-dimensional layouts with CSS Grid (grid-template, fr units, areas).',
        tags: ['flexbox', 'grid', 'layout']
      },
      {
        id: 'responsive-animations',
        title: 'Responsive Design, Media Queries & Animations',
        hours: 1.5,
        bloom: 'L6',
        status: 'ready',
        description: 'Mobile-first methodology, viewport meta configuration, CSS media queries across breakpoints, transitions, 2D transforms, and keyframe animations.',
        tags: ['responsive', 'media-queries', 'animations']
      }
    ]
  },
  {
    id: 'wp-m2',
    code: 'WP-M2',
    slug: 'wp-javascript',
    title: 'JavaScript and Modern Client-Side Programming',
    hours: 8,
    bloomRange: 'L1, L2, L3, L6',
    status: 'ready',
    description: 'JavaScript language mechanics, execution context, DOM manipulation, event-driven programming, modern ES6+ syntax, and the asynchronous event loop.',
    topics: [
      {
        id: 'js-core-scoping',
        title: 'JavaScript Core, Scoping & Data Structures',
        hours: 2.0,
        bloom: 'L2',
        status: 'ready',
        description: 'Primitive vs reference types, var vs let vs const, block scoping, hoisting, closures, object manipulation, and array functional methods (map, filter, reduce).',
        tags: ['javascript', 'es6', 'scoping']
      },
      {
        id: 'dom-event-delegation',
        title: 'DOM Manipulation & Event-Driven Architecture',
        hours: 2.0,
        bloom: 'L3',
        status: 'ready',
        description: 'Traversing and mutating the Document Object Model, Event Bubbling vs Capturing, event delegation, and real-time client-side form validation.',
        tags: ['dom', 'events', 'ui']
      },
      {
        id: 'es6-modern-features',
        title: 'ES6+ Features: Destructuring, Spread & Modules',
        hours: 1.5,
        bloom: 'L3',
        status: 'ready',
        description: 'Arrow functions (lexical this), template literals, array/object destructuring, spread and rest operators, default parameters, and ES Modules (import/export).',
        tags: ['es6', 'arrow-functions', 'syntax']
      },
      {
        id: 'async-event-loop',
        title: 'Asynchronous JavaScript: Callbacks, Promises & Event Loop',
        hours: 2.5,
        bloom: 'L6',
        status: 'ready',
        description: 'Single-threaded non-blocking concurrency, Call Stack, Web APIs, Microtask Queue vs Callback Queue, Promise lifecycle, async/await, and Fetch API.',
        tags: ['async', 'promises', 'event-loop', 'fetch']
      }
    ]
  },
  {
    id: 'wp-m3',
    code: 'WP-M3',
    slug: 'wp-react',
    title: 'Frontend Development with React and Next.js',
    hours: 8,
    bloomRange: 'L1, L2, L3, L5, L6',
    status: 'ready',
    description: 'Component-driven frontend engineering, JSX, Virtual DOM reconciliation, React Hooks (useState, useEffect), Next.js App Router, SSR, SSG, and API routes.',
    topics: [
      {
        id: 'react-components-jsx',
        title: 'React Fundamentals, JSX & Virtual DOM',
        hours: 2.0,
        bloom: 'L3',
        status: 'ready',
        description: 'Declarative component architecture, JSX syntax, Virtual DOM diffing algorithm, unidirectional data flow, props validation, and state immutability.',
        tags: ['react', 'jsx', 'virtual-dom']
      },
      {
        id: 'react-hooks-state',
        title: 'React Hooks: State Management & Lifecycle Side Effects',
        hours: 2.5,
        bloom: 'L5',
        status: 'ready',
        description: 'Functional state with useState, handling component mount/update/cleanup with useEffect, dependency arrays, synthetic events, and controlled forms.',
        tags: ['react-hooks', 'usestate', 'useeffect']
      },
      {
        id: 'nextjs-architecture',
        title: 'Next.js App Router, SSR & Static Generation (SSG)',
        hours: 2.5,
        bloom: 'L6',
        status: 'ready',
        description: 'File-system routing, Server-Side Rendering (SSR) vs Static Site Generation (SSG) vs Client-Side Rendering (CSR), incremental builds, and API Route handlers.',
        tags: ['nextjs', 'ssr', 'ssg', 'routing']
      },
      {
        id: 'fullstack-react-integration',
        title: 'Full-Stack React: API Consumption & Performance',
        hours: 1.0,
        bloom: 'L6',
        status: 'ready',
        description: 'Data fetching in Next.js, loading states, error boundaries, dynamic routing parameters ([slug]), and performance optimization with image/font loaders.',
        tags: ['nextjs', 'api', 'performance']
      }
    ]
  },
  {
    id: 'wp-m4',
    code: 'WP-M4',
    slug: 'wp-nodejs',
    title: 'Server-Side Programming: Node.js and Express.js',
    hours: 7,
    bloomRange: 'L1, L2, L3, L5, L6',
    status: 'ready',
    description: 'Server runtime architecture, Node.js event-driven non-blocking I/O, NPM package ecosystem, Express.js middleware pipeline, RESTful API design, and error handling.',
    topics: [
      {
        id: 'nodejs-architecture',
        title: 'Node.js Architecture, libuv & Built-in Modules',
        hours: 2.0,
        bloom: 'L2',
        status: 'ready',
        description: 'V8 JavaScript engine, libuv event loop and thread pool, non-blocking asynchronous I/O, NPM package management, File System (fs), Path, and HTTP server creation.',
        tags: ['nodejs', 'libuv', 'fs', 'npm']
      },
      {
        id: 'express-middleware-pipeline',
        title: 'Express.js Framework & Middleware Architecture',
        hours: 2.5,
        bloom: 'L5',
        status: 'ready',
        description: 'Express application setup, routing with HTTP verbs, route parameters (:id), query strings, middleware chaining (app, router, third-party), next() flow, and body parsing.',
        tags: ['express', 'middleware', 'routing']
      },
      {
        id: 'rest-api-error-handling',
        title: 'RESTful API Engineering & Error Handling',
        hours: 2.5,
        bloom: 'L6',
        status: 'ready',
        description: 'Designing RESTful web services (CRUD operations), standard HTTP status codes (200, 201, 400, 401, 404, 500), centralized error handling middleware, and database pooling.',
        tags: ['rest-api', 'crud', 'error-handling']
      }
    ]
  },
  {
    id: 'wp-m5',
    code: 'WP-M5',
    slug: 'wp-php',
    title: 'Server-Side Programming: PHP and MySQL',
    hours: 9,
    bloomRange: 'L1, L2, L3, L4, L6',
    status: 'ready',
    description: 'Server-side execution model, PHP syntax, Superglobals, state management with Sessions and Cookies, MySQL integration via PDO, CRUD operations, and security defenses.',
    topics: [
      {
        id: 'php-syntax-superglobals',
        title: 'PHP Fundamentals, Superglobals & Form Processing',
        hours: 2.5,
        bloom: 'L2',
        status: 'ready',
        description: 'Server-side interpreter lifecycle, syntax, arrays (indexed, associative), Superglobals ($_GET, $_POST, $_SERVER), form validation, input sanitization, and file uploads.',
        tags: ['php', 'superglobals', 'forms']
      },
      {
        id: 'php-sessions-cookies',
        title: 'State Management: Sessions, Cookies & File I/O',
        hours: 2.5,
        bloom: 'L3',
        status: 'ready',
        description: 'Stateless HTTP state persistence using session_start(), session storage, setcookie() options (HttpOnly, Secure, SameSite), and server file I/O operations.',
        tags: ['php', 'sessions', 'cookies', 'state']
      },
      {
        id: 'php-pdo-mysql-crud',
        title: 'PHP Data Objects (PDO), MySQL Integration & CRUD',
        hours: 2.5,
        bloom: 'L6',
        status: 'ready',
        description: 'Database connectivity with PDO vs MySQLi, executing Prepared Statements, parameterized queries, transaction control, and complete CRUD web application flows.',
        tags: ['php', 'pdo', 'mysql', 'crud']
      },
      {
        id: 'php-security-practices',
        title: 'PHP Application Security: SQLi, XSS & Password Hashing',
        hours: 1.5,
        bloom: 'L4',
        status: 'ready',
        description: 'Defeating SQL Injection via PDO parameterized statements, XSS defense with htmlspecialchars(), CSRF tokens, and secure password hashing with password_hash() and Bcrypt.',
        tags: ['php', 'security', 'sqli', 'csrf']
      }
    ]
  },
  {
    id: 'wp-m6',
    code: 'WP-M6',
    slug: 'wp-fullstack',
    title: 'Full-Stack Architecture, Deployment and Best Practices',
    hours: 5,
    bloomRange: 'L1, L2, L3, L6',
    status: 'ready',
    description: '3-tier full-stack architecture, frontend-backend API integration, CORS headers, JWT authentication, Git version control, deployment workflows, and OWASP web security.',
    topics: [
      {
        id: 'fullstack-tier-cors',
        title: '3-Tier Architecture, CORS & API Integration',
        hours: 1.5,
        bloom: 'L3',
        status: 'ready',
        description: 'Client-server separation, presentation/business/data tiers, Cross-Origin Resource Sharing (CORS preflight OPTIONS request), and consuming REST APIs from React/Next.',
        tags: ['fullstack', 'architecture', 'cors']
      },
      {
        id: 'jwt-auth-state',
        title: 'Authentication & State: Sessions vs JWT (JSON Web Tokens)',
        hours: 1.5,
        bloom: 'L6',
        status: 'ready',
        description: 'Token-based authentication with JWT (Header, Payload, Signature), Access vs Refresh tokens, Bearer authorization headers, and client-side global state management.',
        tags: ['jwt', 'authentication', 'security']
      },
      {
        id: 'git-deployment-owasp',
        title: 'Git Version Control, Cloud Deployment & OWASP Top 10',
        hours: 2.0,
        bloom: 'L6',
        status: 'ready',
        description: 'Git branching and merge conflict resolution, production deployment (Nginx reverse proxy, Vercel, CI/CD), and defensive mitigation of OWASP Top 10 vulnerabilities.',
        tags: ['git', 'deployment', 'owasp', 'devops']
      }
    ]
  }
]

export function getWPModule(idOrSlug: string): WPModuleInfo | undefined {
  return WP_SYLLABUS.find(m => m.id === idOrSlug || m.slug === idOrSlug || m.code.toLowerCase() === idOrSlug.toLowerCase())
}
