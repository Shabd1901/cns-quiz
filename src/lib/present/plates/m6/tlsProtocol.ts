import { Plate, TopicPresentation } from "@/lib/present/types"

export const tlsProtocolPlates: Plate[] = [
  // 1. Hook
  {
    id: 'tls-hook',
    kind: 'hook',
    title: 'The Lock in the Browser Address Bar',
    subtitle: 'From Netscape SSL 1994 to Modern TLS 1.3 Web Encryption',
    caption: 'Transport Layer Security (TLS) secures over 95% of global internet traffic, transforming unencrypted HTTP into HTTPS to protect financial transactions, emails, and cloud APIs from pervasive eavesdropping.',
    eli5Caption: 'A private armored limousine for your internet data that no one can peek inside or tamper with as it drives across the city.',
    speakerNotes: {
      script: 'Start by explaining the history of SSL and TLS. In 1994, Netscape invented SSL 2.0 to enable e-commerce. Following cryptographic attacks on SSL 3.0 (POODLE) and TLS 1.0/1.1 (BEAST, CRIME), the IETF standardized TLS 1.3 in RFC 8446. TLS sits between Transport (TCP) and Application (HTTP) layers, providing transparent encryption, data integrity, and server authentication.',
      likelyQuestions: [
        {
          question: 'What is the difference between SSL and TLS?',
          answer: 'SSL (Secure Sockets Layer) was Netscape’s proprietary predecessor; TLS (Transport Layer Security) is the official IETF open standard. All versions of SSL are now cryptographically broken and deprecated.'
        }
      ]
    }
  },

  // 2. Concept: Protocol Sub-Layers
  {
    id: 'tls-concept',
    kind: 'concept',
    title: 'The Four Sub-Protocols of TLS Architecture',
    subtitle: 'Handshake, ChangeCipherSpec, Alert, and Record Protocol',
    caption: 'TLS operates as two layers: the higher-level management protocols (Handshake, Alert, ChangeCipherSpec) establish cryptographic parameters; the lower Record Protocol encrypts and fragments application data.',
    eli5Caption: 'Two security guards negotiating a secret code over the radio before placing letters into locked metal boxes.',
    scene: {
      id: 'scene-tls-layers',
      title: 'TLS Layered Architecture',
      actors: [
        { id: 'client', kind: 'client', label: 'Client Browser', pos: { x: 80, y: 150 } },
        { id: 'record', kind: 'server', label: 'TLS Record Layer', pos: { x: 250, y: 150 } },
        { id: 'server', kind: 'server', label: 'HTTPS Server', pos: { x: 420, y: 150 } }
      ],
      objects: [
        { id: 'handshake', kind: 'text', label: 'Handshake Protocol', at: { x: 80, y: 80 } },
        { id: 'record-pkt', kind: 'packet', label: 'Encrypted Record (AEAD)', at: { x: 250, y: 150 } }
      ],
      steps: [
        {
          caption: 'Handshake Protocol negotiates cipher suites, exchanges nonces, and authenticates certificates.',
          actions: [
            { do: 'highlight', target: ['client', 'handshake'], tone: 'info' }
          ]
        },
        {
          caption: 'Alert Protocol signals warnings (e.g. close_notify) or fatal errors (bad_certificate).',
          actions: [
            { do: 'appear', obj: { id: 'alert', kind: 'text', label: 'Alert Protocol', at: { x: 250, y: 80 } } }
          ]
        },
        {
          caption: 'Record Protocol fragments application data into 16KB blocks, adds AEAD tag, and encrypts with session key.',
          actions: [
            { do: 'highlight', target: ['record', 'record-pkt'], tone: 'signal' }
          ]
        },
        {
          caption: 'Encrypted records stream over standard TCP port 443 with guaranteed confidentiality and integrity.',
          actions: [
            { do: 'move', obj: 'record-pkt', to: { x: 420, y: 150 } },
            { do: 'highlight', target: ['server'], tone: 'ok' }
          ]
        }
      ],
      viewBox: '0 0 500 300'
    },
    speakerNotes: {
      script: 'Walk through the 4 sub-protocols: 1. Handshake (negotiates algorithms and keys). 2. ChangeCipherSpec (signals transition to encrypted state in TLS 1.2). 3. Alert (handles errors and session shutdown). 4. Record Layer (fragments data into <= 16,384 byte chunks, applies AEAD MAC, and encrypts).',
      likelyQuestions: [
        {
          question: 'What is the maximum size of a TLS record?',
          answer: '2^14 bytes (16,384 bytes = 16 KB) before encryption and authentication overhead.'
        }
      ]
    }
  },

  // 3. Process: TLS 1.2 vs TLS 1.3 Handshake Flights
  {
    id: 'tls-process',
    kind: 'process',
    title: 'The Great Latency Leap: 2-RTT to 1-RTT',
    subtitle: 'TLS 1.2 Two-Round-Trip vs TLS 1.3 One-Round-Trip Architecture',
    caption: 'TLS 1.2 required 2 full round trips (RTT) before transmitting HTTP data; TLS 1.3 halved latency to 1-RTT by including ECDHE key shares in the initial ClientHello.',
    eli5Caption: 'Saying hello and immediately holding out your hand to shake, instead of saying hello, waiting for an answer, and then holding out your hand.',
    customFigure: 'SequenceDiagram',
    speakerNotes: {
      script: 'Trace the two flows: In TLS 1.2: Flight 1 = ClientHello. Flight 2 = ServerHello + Cert + ServerKeyExchange. Flight 3 = ClientKeyExchange + Finished. Flight 4 = ServerFinished. Total = 2-RTT! In TLS 1.3, the client anticipates the curve (e.g. X25519) and includes its public key share in ClientHello. The server responds with its share and encrypts its certificate immediately. Result: 1-RTT for new connections and 0-RTT for resumed connections!',
      likelyQuestions: [
        {
          question: 'Why was RSA key exchange removed in TLS 1.3?',
          answer: 'Static RSA key exchange lacks Perfect Forward Secrecy (PFS); if a server’s private key is stolen years later, past recorded traffic can be retroactively decrypted. TLS 1.3 mandates ephemeral Diffie-Hellman (DHE/ECDHE).'
        }
      ]
    }
  },

  // 4. Attack & Defense: Downgrade Attacks & Forward Secrecy
  {
    id: 'tls-attack-defense',
    kind: 'attack-defense',
    title: 'Vulnerability Spotlight: Downgrade Attacks vs TLS 1.3 Enforcement',
    subtitle: 'From POODLE & FREAK to Strict Cipher Modernization',
    caption: 'Active attackers intercept handshakes and alter cipher negotiation to force legacy export-grade ciphers (FREAK/Logjam) or broken SSL 3.0 (POODLE); defended via TLS_FALLBACK_SCSV and dropping legacy ciphers.',
    eli5Caption: 'An attacker tampering with your job application to make you look unqualified so you get assigned a lower-paying role.',
    attackDefense: {
      attackName: 'Protocol Downgrade Attack (FREAK / POODLE / Logjam)',
      normalFlowDescription: 'Client and Server negotiate TLS 1.3 with AES-256-GCM and Curve25519.',
      attackFlowDescription: 'Man-in-the-Middle attacker strips TLS 1.3 from ClientHello, forcing server to fall back to insecure SSL 3.0 or 512-bit export RSA.',
      defenseFlowDescription: '1. Completely disable SSL 2.0/3.0 and TLS 1.0/1.1 in web server configs. 2. Implement TLS_FALLBACK_SCSV and mandate TLS 1.3 AEAD cipher suites.'
    },
    speakerNotes: {
      script: 'Highlight the cleanup in TLS 1.3: The IETF eliminated all obsolete cryptographic algorithms: static RSA key exchange (no PFS), CBC mode ciphers (vulnerable to Lucky Thirteen and padding oracles), SHA-1 hashes (collision attacks), and compression (CRIME/BREACH attacks). TLS 1.3 only supports Authenticated Encryption with Associated Data (AEAD): AES-GCM, AES-CCM, and ChaCha20-Poly1305.',
      likelyQuestions: [
        {
          question: 'What is an AEAD cipher?',
          answer: 'Authenticated Encryption with Associated Data: a symmetric cipher mode (like AES-GCM) that simultaneously provides confidentiality, integrity, and authenticity in a single unified cryptographic operation.'
        }
      ]
    }
  },

  // 5. Worked Example: Handshake Latency Calculation
  {
    id: 'tls-worked-example',
    kind: 'worked-example',
    title: 'Worked Example: Handshake Latency across Global Networks',
    subtitle: 'Comparing TLS 1.2 vs TLS 1.3 vs 0-RTT Connection Latency',
    caption: 'Computing the wall-clock connection setup time across an intercontinental transatlantic fiber link with RTT = 75 ms.',
    eli5Caption: 'Measuring the total travel time for sending couriers back and forth across the ocean.',
    workedExample: {
      problem: 'A browser in Mumbai connects to a web server in London across an undersea fiber optic path with Round Trip Time RTT = 75 ms. TCP 3-way handshake takes 1 RTT (75 ms). Calculate the total elapsed time until the first byte of HTTP GET data is received by the server under: Case A: TLS 1.2 (2-RTT handshake). Case B: TLS 1.3 initial connection (1-RTT handshake). Case C: TLS 1.3 0-RTT session resumption.',
      given: {
        'One Round Trip Time (RTT)': '75 ms',
        'TCP 3-Way Handshake': '1 RTT (75 ms)',
        'TLS 1.2 Handshake': '2 RTT',
        'TLS 1.3 Initial Handshake': '1 RTT',
        'TLS 1.3 0-RTT Resumption': '0 RTT (Data sent with ClientHello)'
      },
      steps: [
        {
          label: '1. Case A: TLS 1.2 Total Latency',
          formula: 'T_{total} = RTT_{TCP} + RTT_{TLS1.2} = 1(75) + 2(75)',
          substitution: '75 \\text{ ms} + 150 \\text{ ms}',
          result: '225 ms',
          note: 'Requires 3 full round trips before the server receives the HTTP request.'
        },
        {
          label: '2. Case B: TLS 1.3 Initial Connection Latency',
          formula: 'T_{total} = RTT_{TCP} + RTT_{TLS1.3} = 1(75) + 1(75)',
          substitution: '75 \\text{ ms} + 75 \\text{ ms}',
          result: '150 ms (33% Faster)',
          note: 'ECDHE key share in ClientHello saves one full 75ms round trip!'
        },
        {
          label: '3. Case C: TLS 1.3 0-RTT Resumption Latency',
          formula: 'T_{total} = RTT_{TCP} + RTT_{0-RTT} = 1(75) + 0(75)',
          substitution: '75 \\text{ ms} + 0 \\text{ ms}',
          result: '75 ms (66% Faster)',
          note: 'Early application data is transmitted immediately alongside ClientHello.'
        }
      ],
      finalAnswer: 'TLS 1.2 requires 225 ms; TLS 1.3 requires 150 ms (saving 75 ms); TLS 1.3 0-RTT delivers data in just 75 ms, radically speeding up modern mobile web browsing.',
      checkVerification: 'Latency reduction formula: $\\Delta T = 75 \\text{ ms} \\times (2 - 1) = 75 \\text{ ms}$.'
    },
    speakerNotes: {
      script: 'Walk through this calculation slowly. In mobile networks where RTT can be 150-200ms, shaving off 1 or 2 round trips makes websites feel instantaneous. This performance breakthrough was the primary driving force behind Google and Cloudflare’s aggressive push for TLS 1.3.',
      likelyQuestions: []
    }
  },

  // 6. Comparison: TLS 1.2 vs TLS 1.3
  {
    id: 'tls-comparison',
    kind: 'compare',
    title: 'TLS 1.2 vs TLS 1.3 Architectural Comparison',
    subtitle: 'Comprehensive Breakdown of Changes in RFC 8446',
    caption: 'TLS 1.3 represents the most comprehensive redesign in protocol history, discarding insecure legacy algorithms and redesigning the handshake from the ground up.',
    eli5Caption: 'Comparing a 2008 flip phone with a 2026 smartphone.',
    comparison: {
      leftTitle: 'TLS 1.2 (RFC 5246, 2008)',
      rightTitle: 'TLS 1.3 (RFC 8446, 2018)',
      differences: [
        {
          feature: 'Handshake Round Trips',
          left: '2-RTT (Two round trips before encrypted application data)',
          right: '1-RTT (One round trip for initial, 0-RTT for resumption)',
          diffTone: 'signal'
        },
        {
          feature: 'Static RSA Key Exchange',
          left: 'Permitted (Vulnerable: No Perfect Forward Secrecy)',
          right: 'Completely Removed (Mandatory DHE / ECDHE for PFS)',
          diffTone: 'ok'
        },
        {
          feature: 'Certificate Privacy',
          left: 'Server Certificate transmitted in unencrypted cleartext',
          right: 'Server Certificate encrypted with handshake session key',
          diffTone: 'info'
        },
        {
          feature: 'Symmetric Cipher Modes',
          left: 'Supports CBC mode, RC4 stream, and AEAD modes',
          right: 'AEAD ONLY (AES-GCM, AES-CCM, ChaCha20-Poly1305); CBC/RC4 forbidden',
          diffTone: 'ok'
        }
      ],
      summaryTakeaway: 'TLS 1.3 delivers faster connections, mandatory Forward Secrecy, encrypted server certificates, and zero vulnerable legacy ciphers.'
    },
    speakerNotes: {
      script: 'Review the 4 core pillars of TLS 1.3: 1. 1-RTT speed. 2. Forward Secrecy only (no static RSA). 3. AEAD only (no CBC padding oracles). 4. Encrypted certificates (protecting SNI/domain privacy).',
      likelyQuestions: []
    }
  },

  // 7. Ask The Room
  {
    id: 'tls-ask-the-room',
    kind: 'ask-the-room',
    title: 'Concept Check: TLS 1.3 Security Advances',
    subtitle: 'Why Was Static RSA Removed?',
    caption: 'What security risk caused the IETF to ban static RSA key exchange in TLS 1.3?',
    eli5Caption: 'Why did cryptographers throw out the old RSA key exchange?',
    askTheRoom: {
      question: 'Why did the IETF completely eliminate static RSA key exchange from the TLS 1.3 specification?',
      options: [
        'Because RSA cannot be executed on 64-bit microprocessors',
        'Because static RSA does not provide Perfect Forward Secrecy (PFS); if a server’s private key is compromised in the future, all historically recorded sessions can be decrypted',
        'Because RSA keys cannot be verified by Certificate Authorities',
        'Because RSA requires more than 4 round trips to negotiate'
      ],
      correctIndex: 1,
      explanation: 'Under static RSA key exchange, the client encrypts the pre-master secret using the server’s public key. If an adversary records encrypted network traffic and steals the server’s private key years later, the adversary can retroactively decrypt all past sessions. Ephemeral Diffie-Hellman generates disposable keys, guaranteeing Forward Secrecy.'
    },
    speakerNotes: {
      script: 'Emphasize the definition of Perfect Forward Secrecy (PFS). This is one of the most frequently asked university exam questions in cryptography and network security.',
      likelyQuestions: []
    }
  },

  // 8. Exam Words
  {
    id: 'tls-exam-words',
    kind: 'exam-words',
    title: 'Exam Terminology: SSL / TLS Architecture',
    subtitle: 'Definitions and Keywords for Examinations',
    caption: 'Memorize these core definitions for University Network Security examinations.',
    eli5Caption: 'The exact phrasing professors look for when grading TLS questions.',
    examWords: {
      term: 'TLS Protocol Architecture & Handshake 1-RTT',
      definition: 'A cryptographic protocol operating between Transport and Application layers that provides endpoint authentication, confidentiality, and data integrity via two layers: higher-level management protocols (Handshake, Alert) and the lower-level Record Protocol.',
      keywords: [
        'TLS Handshake vs Record Protocol',
        '1-RTT latency & 0-RTT early data',
        'Perfect Forward Secrecy (ECDHE)',
        'AEAD ciphers (AES-GCM)',
        'Server Certificate Encryption'
      ],
      mustRememberPoints: [
        'TLS operates two layers: Record Protocol (encryption/fragmentation) and Handshake/Alert protocols.',
        'TLS 1.3 reduces handshake latency from 2-RTT to 1-RTT by including ECDHE key shares in ClientHello.',
        'Static RSA key exchange and CBC mode ciphers were completely eliminated in TLS 1.3.'
      ],
      typicalMarks: 5
    },
    speakerNotes: {
      script: 'Review the 5-mark structure: 1. Name the 4 sub-protocols. 2. Contrast TLS 1.2 (2-RTT, plaintext certs, static RSA) with TLS 1.3 (1-RTT, encrypted certs, AEAD only, PFS mandatory).',
      likelyQuestions: []
    }
  }
]

export const tlsProtocolPresentation: TopicPresentation = {
  moduleId: 'm6',
  moduleTitle: 'M6: Network Security Applications',
  topicId: 'tls-protocol',
  topicTitle: 'SSL / TLS Protocol Architecture',
  targetDurationMinutes: 12,
  plates: tlsProtocolPlates
}
