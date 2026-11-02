import { Plate, TopicPresentation } from "@/lib/present/types"

export const kerberosPlates: Plate[] = [
  // 1. Hook
  {
    id: 'kerb-hook',
    kind: 'hook',
    title: 'The Three-Headed Hound of Authentication',
    subtitle: 'From Plaintext Passwords to Single Sign-On (MIT Project Athena)',
    caption: 'In Greek mythology, Cerberus guards the gates of the underworld; in distributed networks, Kerberos guards enterprise resources by never transmitting passwords over the wire.',
    eli5Caption: 'Getting a single VIP pass at the entrance gate so you don’t have to show your ID card at every ride in the amusement park.',
    speakerNotes: {
      script: 'Start with MIT Project Athena in 1983. In a university network of thousands of workstations, users needed access to file servers, mail servers, and printers. Sending passwords across Ethernet leads to instant sniffing. Kerberos solved this by establishing a trusted third-party Key Distribution Center (KDC) providing Single Sign-On (SSO) with Ticket Granting Tickets.',
      likelyQuestions: [
        {
          question: 'Where is Kerberos used today in modern enterprises?',
          answer: 'Kerberos v5 (RFC 4120) is the default authentication protocol for Microsoft Active Directory and enterprise UNIX/Linux realms worldwide.'
        }
      ]
    }
  },

  // 2. Concept: The Three-Headed Architecture
  {
    id: 'kerb-concept',
    kind: 'concept',
    title: 'The Kerberos Trust Architecture',
    subtitle: 'Client, KDC (AS + TGS), and Application Server',
    caption: 'Kerberos divides authentication into three distinct actors: the Authentication Server (AS) verifies user identity, the Ticket Granting Server (TGS) issues service passes, and the Application Server provides resources.',
    eli5Caption: 'The passport office checks your identity once (AS), the visa office gives you travel stamps (TGS), and the border guard lets you enter (Server).',
    scene: {
      id: 'scene-kerb-architecture',
      title: 'Kerberos 3-Party Architecture',
      actors: [
        { id: 'client', kind: 'alice', label: 'Alice (Client)', pos: { x: 80, y: 150 } },
        { id: 'kdc', kind: 'kdc', label: 'KDC (AS + TGS)', pos: { x: 250, y: 150 } },
        { id: 'server', kind: 'server', label: 'File Server', pos: { x: 420, y: 150 } }
      ],
      objects: [
        { id: 'tgt', kind: 'ticket', label: 'TGT (Encrypted with K_tgs)', at: { x: 250, y: 150 } }
      ],
      steps: [
        {
          caption: 'Alice logs in by entering username. Client requests TGT from the Authentication Server (AS).',
          actions: [
            { do: 'highlight', target: ['client', 'kdc'], tone: 'info' }
          ]
        },
        {
          caption: 'AS returns Ticket Granting Ticket (TGT) encrypted with K_tgs, plus session key K_c_tgs encrypted with Alice password key.',
          actions: [
            { do: 'move', obj: 'tgt', to: { x: 80, y: 150 } },
            { do: 'highlight', target: ['client'], tone: 'ok' }
          ]
        },
        {
          caption: 'Alice sends TGT + Authenticator({timestamp}) to Ticket Granting Server (TGS) to request a Service Ticket.',
          actions: [
            { do: 'move', obj: 'tgt', to: { x: 250, y: 150 } },
            { do: 'appear', obj: { id: 'st', kind: 'ticket', label: 'Service Ticket (K_server)', at: { x: 250, y: 150 } } }
          ]
        },
        {
          caption: 'TGS returns Service Ticket. Alice delivers Service Ticket to File Server for seamless access!',
          actions: [
            { do: 'move', obj: 'st', to: { x: 420, y: 150 } },
            { do: 'highlight', target: ['server'], tone: 'ok' }
          ]
        }
      ],
      viewBox: '0 0 500 300'
    },
    speakerNotes: {
      script: 'Walk through the 6-step message exchange: 1. Client -> AS (AS_REQ). 2. AS -> Client (AS_REP: TGT + Session Key). 3. Client -> TGS (TGS_REQ: TGT + Authenticator). 4. TGS -> Client (TGS_REP: Service Ticket). 5. Client -> Server (AP_REQ: Service Ticket + Authenticator). 6. Server -> Client (AP_REP: Mutual Auth).',
      likelyQuestions: [
        {
          question: 'Does the AS know the user’s cleartext password?',
          answer: 'The AS stores a cryptographic hash of the password as a secret symmetric key; the cleartext password is never transmitted across the network.'
        }
      ]
    }
  },

  // 3. Process: 6-Step Message Exchange
  {
    id: 'kerb-process',
    kind: 'process',
    title: 'The 6-Step Authentication Dance',
    subtitle: 'From Login to Mutual Application Server Verification',
    caption: 'The complete lifecycle requires exactly 3 round-trip exchanges: AS exchange, TGS exchange, and Client-Server application exchange.',
    eli5Caption: 'Step 1: Get ticket pass. Step 2: Swap pass for movie ticket. Step 3: Give ticket to usher and watch the movie.',
    customFigure: 'SequenceDiagram',
    speakerNotes: {
      script: 'Use the Sequence Diagram to trace message timestamps: Point out that the Authenticator contains a live timestamp $\{ID, TS\}$ encrypted with the session key. Because tickets have longer lifetimes (8-10 hours), an eavesdropper might steal a ticket; however, without the session key, the eavesdropper cannot forge a fresh Authenticator with the current timestamp.',
      likelyQuestions: [
        {
          question: 'Why are authenticators needed if tickets already exist?',
          answer: 'A ticket is reusable for hours and can be intercepted; the authenticator is single-use, valid for only 5 minutes, and proves that the sender genuinely holds the shared session key.'
        }
      ]
    }
  },

  // 4. Attack & Defense: Replay Attacks & Kerberoasting
  {
    id: 'kerb-attack-defense',
    kind: 'attack-defense',
    title: 'Vulnerability Spotlight: Replay Attacks & Kerberoasting',
    subtitle: 'Clock Skew Tolerances vs Offline Service Account Cracking',
    caption: 'Attackers capture network packets to replay authenticators or request Service Tickets for offline password cracking (Kerberoasting); defended via replay caches, 5-minute skew limits, and AES-256 service keys.',
    eli5Caption: 'Recording someone’s voice saying "Open sesame" vs having a code that changes every 60 seconds.',
    attackDefense: {
      attackName: 'Replay Attack & Kerberoasting (TGS Extraction)',
      normalFlowDescription: 'Alice sends Service Ticket and fresh Authenticator timestamp to access file share.',
      attackFlowDescription: 'Attacker sniffs ticket and attempts replay; or requests TGS tickets for Service Principal Names (SPN) and cracks service passwords offline.',
      defenseFlowDescription: '1. Server maintains a Replay Cache of recent authenticators within a 5-minute clock skew window. 2. Managed Service Accounts (gMSA) with 128-char randomized passwords neutralize Kerberoasting.'
    },
    speakerNotes: {
      script: 'Discuss the dual defense: To stop replaying an intercepted ticket, Kerberos uses synchronized clocks (NTP). If the authenticator timestamp differs from server time by more than 5 minutes (default skew), the server rejects it. To stop replays within the 5-minute window, servers maintain an in-memory replay cache of $\{Client, TS\}$ pairs.',
      likelyQuestions: [
        {
          question: 'What happens if server clocks desynchronize?',
          answer: 'Kerberos authentication fails completely with KRB_AP_ERR_SKEW errors; maintaining precise NTP synchronization is mandatory in Active Directory.'
        }
      ]
    }
  },

  // 5. Worked Example: Kerberos Clock Skew & Ticket Expiration Math
  {
    id: 'kerb-worked-example',
    kind: 'worked-example',
    title: 'Worked Example: Kerberos Ticket Validation & Clock Skew',
    subtitle: 'Evaluating Ticket Lifetime and Authenticator Skew Window',
    caption: 'A server accepts an authentication request only if the ticket is unexpired ($T_{now} \\le T_{issue} + Lifetime$) AND the authenticator clock skew is within threshold ($|T_{server} - T_{auth}| \\le \\Delta t_{max}$).',
    eli5Caption: 'Checking the expiration date on your concert ticket, and checking the digital timestamp on your phone screen.',
    workedExample: {
      problem: 'Alice presents a Service Ticket issued at 09:00:00 with a lifetime of 3,600 seconds (1 hour). At server time 09:42:00, Alice sends an Authenticator stamped 09:39:30. The server enforces a maximum clock skew threshold of $\\Delta t_{max} = 300$ seconds (5 minutes). Is Alice authenticated?',
      given: {
        'Ticket Issuance Time': '09:00:00',
        'Ticket Lifetime': '3,600 seconds (expires 10:00:00)',
        'Server Current Time': '09:42:00',
        'Authenticator Timestamp': '09:39:30',
        'Max Skew Threshold (\\Delta t_{max})': '300 seconds'
      },
      steps: [
        {
          label: '1. Check Ticket Expiration',
          formula: 'T_{now} \\le T_{issue} + Lifetime',
          substitution: '09:42:00 \\le 09:00:00 + 3,600s = 10:00:00',
          result: 'VALID (Ticket Active)',
          note: 'Ticket still has 18 minutes of valid operational lifetime remaining.'
        },
        {
          label: '2. Compute Authenticator Clock Skew',
          formula: '\\Delta t = |T_{server} - T_{auth}|',
          substitution: '|09:42:00 - 09:39:30| = 150 \\text{ seconds}',
          result: '150 seconds (2.5 minutes)',
          note: 'Time difference between client timestamp and server local clock.'
        },
        {
          label: '3. Test Skew Against Replay Tolerance',
          formula: '\\Delta t \\le \\Delta t_{max}',
          substitution: '150 \\le 300',
          result: 'TRUE (Within Tolerance)',
          note: 'Skew is well below the 300-second threshold.'
        }
      ],
      finalAnswer: 'Alice is authenticated successfully. The Service Ticket is valid until 10:00:00 and the Authenticator skew of 150s is within the 300s limit.',
      checkVerification: 'If Alice’s clock drifted past 09:37:00 (skew > 300s), server returns KRB_AP_ERR_SKEW.'
    },
    speakerNotes: {
      script: 'Review these calculations on the board. Make sure students understand that tickets have coarse lifetimes (hours), while authenticators have fine lifetimes (minutes). Both checks must pass for access to be granted.',
      likelyQuestions: []
    }
  },

  // 6. Comparison: Kerberos v4 vs Kerberos v5
  {
    id: 'kerb-comparison',
    kind: 'compare',
    title: 'Kerberos Version Comparison',
    subtitle: 'Evolution from DES Limitations to RFC 4120 Modern Standards',
    caption: 'Kerberos v5 addressed critical cryptographic weaknesses in v4, replacing single DES with AES, expanding ticket lifetimes, and supporting cross-realm multi-hop trust.',
    eli5Caption: 'Upgrading from an old wooden padlock to a modern electronic keycard system.',
    comparison: {
      leftTitle: 'Kerberos Version 4 (1989)',
      rightTitle: 'Kerberos Version 5 (RFC 4120)',
      differences: [
        {
          feature: 'Encryption Algorithm',
          left: 'Hardcoded 56-bit Single DES (broken by brute force)',
          right: 'Cipher agility: AES-128, AES-256, Camellia, RC4-HMAC',
          diffTone: 'signal'
        },
        {
          feature: 'Maximum Ticket Lifetime',
          left: 'Limited to ~21 hours (stored as 8-bit byte in 5-min units)',
          right: 'Arbitrary 32-bit timestamps; renewable tickets for days/weeks',
          diffTone: 'ok'
        },
        {
          feature: 'Network Protocol Support',
          left: 'Hardcoded strictly to IPv4 addresses',
          right: 'Address-agnostic: supports IPv4, IPv6, and nameless tickets',
          diffTone: 'info'
        },
        {
          feature: 'Cross-Realm Authentication',
          left: 'Limited to direct pairwise bilateral realm trust',
          right: 'Multi-hop transitive realm trust paths (A -> B -> C)',
          diffTone: 'ok'
        }
      ],
      summaryTakeaway: 'Kerberos v5 replaced brittle DES ciphers with AES-256 and introduced extensible ASN.1 encoding for modern enterprise scalability.'
    },
    speakerNotes: {
      script: 'Point out the 5-mark exam question: "What are the limitations of Kerberos v4 that led to v5?" 1. Hardcoded DES encryption. 2. 8-bit ticket lifetime encoding limit. 3. IPv4 dependency. 4. Lack of forwardable/renewable tickets. 5. Inability to do transitive cross-realm trust.',
      likelyQuestions: []
    }
  },

  // 7. Ask The Room
  {
    id: 'kerb-ask-the-room',
    kind: 'ask-the-room',
    title: 'Concept Check: Kerberos Authenticators',
    subtitle: 'Why Are Authenticators Necessary?',
    caption: 'Test your understanding of Kerberos replay defense.',
    eli5Caption: 'Why isn’t a ticket alone enough to prove who you are?',
    askTheRoom: {
      question: 'Why does Kerberos require a client to send an Authenticator alongside a Ticket when accessing an Application Server?',
      options: [
        'Because tickets are unencrypted and can be read by anyone on the network',
        'Because tickets are reusable for hours; the single-use Authenticator (encrypted with the shared session key and containing a fresh timestamp) proves the sender is the legitimate owner and prevents replay attacks',
        'Because the application server does not have an internet connection to contact the KDC',
        'Because the operating system requires an MD5 checksum on all file operations'
      ],
      correctIndex: 1,
      explanation: 'Tickets are valid for several hours. If an eavesdropper sniffs a ticket from the network, they cannot use it without the shared session key. The Authenticator contains a timestamp encrypted with that session key, proving the client possesses the secret session key and is not replaying an old transmission.'
    },
    speakerNotes: {
      script: 'Give the class 30 seconds to vote. Ensure everyone understands the difference between the ticket (proves authorization) and the authenticator (proves identity/liveness).',
      likelyQuestions: []
    }
  },

  // 8. Exam Words
  {
    id: 'kerb-exam-words',
    kind: 'exam-words',
    title: 'Exam Terminology: Kerberos Authentication Service',
    subtitle: 'Definitions and Keywords for Examinations',
    caption: 'Memorize these core terms for university Network Security exam papers.',
    eli5Caption: 'The exact phrasing that examiners look for on Kerberos questions.',
    examWords: {
      term: 'Kerberos Authentication & Ticket Granting Service',
      definition: 'A trusted third-party authentication protocol based on symmetric cryptography (Needham-Schroeder) that enables mutual Single Sign-On (SSO) across distributed insecure networks without transmitting passwords over the wire.',
      keywords: [
        'Authentication Server (AS)',
        'Ticket Granting Server (TGS)',
        'Ticket Granting Ticket (TGT)',
        'Session Keys ($K_{c,tgs}, K_{c,v}$)',
        'Authenticator & Clock Skew ($\\Delta t \\le 300s$)'
      ],
      mustRememberPoints: [
        'The KDC comprises two distinct logical servers: Authentication Server (AS) and Ticket Granting Server (TGS).',
        'The TGT is encrypted with the secret key of the TGS ($K_{tgs}$); client cannot decrypt or alter it.',
        'Authenticators contain timestamps and are single-use within a 5-minute skew window to thwart replay attacks.'
      ],
      typicalMarks: 5
    },
    speakerNotes: {
      script: 'Advise students to sketch the 3-box diagram (Client, KDC, Server) with the 6 numbered arrows in their exam answer. A neat diagram with $K_{c,tgs}$ and $K_{c,v}$ notations guarantees 5/5 marks.',
      likelyQuestions: []
    }
  }
]

export const kerberosPresentation: TopicPresentation = {
  moduleId: 'm6',
  moduleTitle: 'M6: Network Security Applications',
  topicId: 'kerberos',
  topicTitle: 'Kerberos Authentication Service',
  targetDurationMinutes: 12,
  plates: kerberosPlates
}
