import { Plate, TopicPresentation } from "@/lib/present/types"

export const keyManagementPlates: Plate[] = [
  // 1. Hook
  {
    id: 'km-hook',
    kind: 'hook',
    title: 'The Achilles Heel of Cryptography',
    subtitle: 'From Auguste Kerckhoffs to Modern Key Orchestration',
    caption: 'Kerckhoffs’s Principle dictates that a cryptosystem must be secure even if everything about it is public, except the key; therefore, securing key distribution is the single most critical challenge in cybersecurity.',
    eli5Caption: 'Having the strongest vault door in the world means nothing if you leave the physical brass key under the front door mat.',
    speakerNotes: {
      script: 'Start with Kerckhoffs’s Principle (1883): "A cryptographic system should be secure even if everything about the system, except the key, is public knowledge." Algorithms like AES and RSA are open source. The entire security of modern civilization rests on key management: generation, distribution, storage, rotation, and revocation.',
      likelyQuestions: [
        {
          question: 'What is the "Key Distribution Problem"?',
          answer: 'Before two parties can communicate securely using symmetric encryption, they must securely exchange a shared secret key without an eavesdropper intercepting it.'
        }
      ]
    }
  },

  // 2. Concept: Key Distribution Paradigms
  {
    id: 'km-concept',
    kind: 'concept',
    title: 'Symmetric vs Asymmetric Key Distribution',
    subtitle: 'From Centralized KDCs to Public Key Infrastructure and Ephemeral Diffie-Hellman',
    caption: 'For N users, pairwise symmetric keys require $O(N^2)$ keys, demanding centralized Key Distribution Centers ($O(N)$); asymmetric systems use public key directories, while ephemeral Diffie-Hellman provides Forward Secrecy.',
    eli5Caption: 'Giving everyone a master keycard to the company front desk instead of cutting 10,000 individual keys for every employee pair.',
    customFigure: 'GrowthChart',
    speakerNotes: {
      script: 'Explain the $O(N^2)$ problem: If an organization has 1,000 employees, pairwise symmetric keys require $N(N-1)/2 = 499,500$ secret keys! A Key Distribution Center (KDC) reduces this to $N$ keys: each user only shares 1 master key with the KDC. Asymmetric cryptography eliminates master secrets entirely by publishing public keys certified by CAs.',
      likelyQuestions: [
        {
          question: 'What is a session key vs a master key?',
          answer: 'A master key is a long-lived secret used only to authenticate and distribute keys; a session key is a temporary, disposable symmetric key used to encrypt one specific data exchange.'
        }
      ]
    }
  },

  // 3. Process: Perfect Forward Secrecy (PFS)
  {
    id: 'km-process',
    kind: 'process',
    title: 'The Shield of Forward Secrecy (PFS)',
    subtitle: 'Why Ephemeral Diffie-Hellman Prevents Retroactive Decryption',
    caption: 'Under Perfect Forward Secrecy, session keys are derived from ephemeral, disposable key pairs; compromising a server’s long-term private key in the future cannot decrypt historically recorded traffic.',
    eli5Caption: 'Using a temporary code that burns to ash immediately after opening the door, so even if someone steals the master blueprints years later, past doors cannot be unlocked.',
    scene: {
      id: 'scene-pfs-flow',
      title: 'Ephemeral Key Generation & Disposal',
      actors: [
        { id: 'alice', kind: 'client', label: 'Alice', pos: { x: 80, y: 150 } },
        { id: 'eve', kind: 'eve', label: 'Eve (Passive Recorder)', pos: { x: 250, y: 240 } },
        { id: 'bob', kind: 'server', label: 'Bob Server', pos: { x: 420, y: 150 } }
      ],
      objects: [
        { id: 'dhe-share', kind: 'key-shared', label: 'Ephemeral DHE Shares (g^a, g^b)', at: { x: 250, y: 150 } }
      ],
      steps: [
        {
          caption: 'Alice and Bob generate random ephemeral private keys a and b, exchanging g^a and g^b.',
          actions: [
            { do: 'highlight', target: ['alice', 'bob', 'dhe-share'], tone: 'info' }
          ]
        },
        {
          caption: 'Eve records all ciphertext and public key shares on the wire and stores them on hard disk.',
          actions: [
            { do: 'appear', obj: { id: 'disk', kind: 'text', label: 'Recorded Ciphertext on Eve Disk', at: { x: 250, y: 270 } } },
            { do: 'highlight', target: ['eve', 'disk'], tone: 'bad' }
          ]
        },
        {
          caption: 'Session completes: Alice and Bob permanently erase ephemeral values a and b from RAM.',
          actions: [
            { do: 'vanish', obj: 'dhe-share' }
          ]
        },
        {
          caption: 'Five years later: Eve steals Bob’s long-term private key! But without ephemeral a and b, historical traffic CANNOT be decrypted!',
          actions: [
            { do: 'highlight', target: ['bob'], tone: 'signal' },
            { do: 'highlight', target: ['eve'], tone: 'bad' }
          ]
        }
      ],
      viewBox: '0 0 500 320'
    },
    speakerNotes: {
      script: 'Emphasize the intelligence agency threat: Intelligence agencies record terabytes of encrypted internet traffic daily ("store now, decrypt later"). If a server uses static RSA, seizing or subpoenaing the server’s RSA private key 10 years later unlocks all recorded historical communications. With Ephemeral Diffie-Hellman (ECDHE), the private numbers $a$ and $b$ only existed in volatile RAM for milliseconds and are permanently gone.',
      likelyQuestions: [
        {
          question: 'Does quantum computing threaten Forward Secrecy?',
          answer: 'Yes! Shor’s algorithm can compute discrete logarithms over recorded ephemeral DHE shares; that is why Post-Quantum Cryptography (PQC / ML-KEM) is being integrated into TLS.'
        }
      ]
    }
  },

  // 4. Attack & Defense: Man-in-the-Middle on Unauthenticated Key Exchange
  {
    id: 'km-attack-defense',
    kind: 'attack-defense',
    title: 'Vulnerability Spotlight: Unauthenticated DH vs Digital Signatures',
    subtitle: 'Mallory in the Middle vs Authenticated Ephemeral Exchanges',
    caption: 'Diffie-Hellman alone has no identity verification; Mallory splits the exchange into two separate sessions unless the ephemeral shares are digitally signed with certified long-term keys.',
    eli5Caption: 'Shaking hands in the dark with someone pretending to be your business partner.',
    attackDefense: {
      attackName: 'Diffie-Hellman Man-in-the-Middle Interception',
      normalFlowDescription: 'Alice sends $g^a$, Bob sends $g^b$; both compute shared secret $K = g^{ab} \\pmod p$.',
      attackFlowDescription: 'Mallory intercepts $g^a$, sends $g^m$ to Bob; intercepts $g^b$, sends $g^m$ to Alice; Mallory establishes two separate keys and decrypts everything.',
      defenseFlowDescription: 'Authenticated Key Exchange: Ephemeral shares ($g^a, g^b$) must be digitally signed using the sender’s certified asymmetric key (e.g., ECDSA in TLS 1.3 or IKE_AUTH in IPsec).'
    },
    speakerNotes: {
      script: 'Remind students of the classic Diffie-Hellman trap: DH establishes a shared secret, but gives ZERO proof of who is on the other end of the line! Without digital signatures or pre-shared keys, Diffie-Hellman is trivially vulnerable to an active Man-in-the-Middle.',
      likelyQuestions: [
        {
          question: 'What protocol authenticates Diffie-Hellman in TLS 1.3?',
          answer: 'The CertificateVerify message: the server signs a cryptographic hash of all preceding handshake messages (including the ephemeral key share) using its private key.'
        }
      ]
    }
  },

  // 5. Worked Example: Pairwise Key Scaling Math ($O(N^2)$ vs $O(N)$)
  {
    id: 'km-worked-example',
    kind: 'worked-example',
    title: 'Worked Example: Pairwise Key Scaling & KDC Efficiency',
    subtitle: 'Calculating Key Explosion in Enterprise Networks',
    caption: 'Computing the mathematical key explosion for full-mesh pairwise symmetric keys vs centralized Key Distribution Centers.',
    eli5Caption: 'Counting the number of handshakes required if everyone at a party has to shake hands with everyone else.',
    workedExample: {
      problem: 'An enterprise bank expands from N = 50 users to N = 5,000 users. Calculate: Case 1: Total pairwise symmetric keys required for direct communication. Case 2: Total master keys required under a centralized KDC architecture. What is the key reduction factor at N = 5,000?',
      given: {
        'Initial Users (N_1)': 50,
        'Expanded Users (N_2)': 5000,
        'Pairwise Formula': 'K_{pair} = \\frac{N(N-1)}{2}',
        'KDC Formula': 'K_{kdc} = N'
      },
      steps: [
        {
          label: '1. Compute Pairwise Keys for N = 50',
          formula: 'K_{pair}(50) = \\frac{50 \\times 49}{2}',
          substitution: '\\frac{2,450}{2}',
          result: '1,225 keys',
          note: 'Manageable for small groups of 50 users.'
        },
        {
          label: '2. Compute Pairwise Keys for N = 5,000',
          formula: 'K_{pair}(5000) = \\frac{5,000 \\times 4,999}{2}',
          substitution: '\\frac{24,995,000}{2}',
          result: '12,497,500 keys (~12.5 Million Keys!)',
          note: 'Catastrophic key explosion: storing and rotating 12.5M keys is impossible!'
        },
        {
          label: '3. Compute KDC Keys for N = 5,000',
          formula: 'K_{kdc}(5000) = N',
          substitution: '5,000',
          result: '5,000 keys',
          note: 'Each user only stores 1 master key shared with the KDC.'
        },
        {
          label: '4. Compute Efficiency Reduction Factor',
          formula: 'Factor = \\frac{K_{pair}}{K_{kdc}} = \\frac{12,497,500}{5,000}',
          substitution: '2,499.5',
          result: '2,500x Reduction in Key Burden',
          note: 'KDC reduces key management complexity from quadratic $O(N^2)$ to linear $O(N)$.'
        }
      ],
      finalAnswer: 'At N = 5,000 users, pairwise symmetric keys explode to 12,497,500 keys. A centralized KDC requires only 5,000 master keys, reducing the key management burden by 2,500 times.',
      checkVerification: 'Linear vs Quadratic scaling: $\\frac{N(N-1)}{2N} = \\frac{N-1}{2} = \\frac{4999}{2} \\approx 2,500$.'
    },
    speakerNotes: {
      script: 'Walk through this formula: $K = N(N-1)/2$. Show students why decentralized pairwise symmetric encryption completely failed in the 1970s. For 5,000 nodes, 12.5 million keys would have to be distributed over courier! The KDC reduced this to 5,000 keys.',
      likelyQuestions: []
    }
  },

  // 6. Comparison: KDC vs CA vs Decentralized Ephemeral
  {
    id: 'km-comparison',
    kind: 'compare',
    title: 'Key Management Architecture Comparison',
    subtitle: 'Symmetric KDC vs Public Key Infrastructure (PKI) vs Ephemeral DH',
    caption: 'Each model balances trust centralization against forward secrecy and architectural scalability.',
    eli5Caption: 'A single company security guard vs a government passport agency vs disposable one-time burner phones.',
    comparison: {
      leftTitle: 'Symmetric KDC (Kerberos)',
      rightTitle: 'Ephemeral DH + PKI (TLS 1.3)',
      differences: [
        {
          feature: 'Perfect Forward Secrecy',
          left: 'NO: KDC master key compromise unlocks all past tickets',
          right: 'YES: Ephemeral keys are discarded immediately after derivation',
          diffTone: 'signal'
        },
        {
          feature: 'Online Availability Dependency',
          left: 'CRITICAL: KDC must be 100% online in real time to issue tickets',
          right: 'OFFLINE: CA only needed during cert issuance; verification is local',
          diffTone: 'ok'
        },
        {
          feature: 'Single Point of Failure',
          left: 'Severe: If KDC crashes, all authentication site-wide halts',
          right: 'Resilient: Web servers operate independently using cached certs',
          diffTone: 'bad'
        },
        {
          feature: 'Network Scope',
          left: 'Optimized for local corporate intranet LANs and realms',
          right: 'Universal global internet scale across millions of domains',
          diffTone: 'info'
        }
      ],
      summaryTakeaway: 'Symmetric KDCs excel at high-speed internal enterprise single sign-on; Ephemeral DH + PKI is the undisputed champion for global internet security.'
    },
    speakerNotes: {
      script: 'Summarize the architectural tradeoff: Kerberos requires the KDC to be online for every single session request. If the KDC dies, nobody can log in. In TLS PKI, the CA does not need to be online when you browse Google: Google’s server presents its certificate, and your browser verifies the signature offline using root keys in your OS.',
      likelyQuestions: []
    }
  },

  // 7. Ask The Room
  {
    id: 'km-ask-the-room',
    kind: 'ask-the-room',
    title: 'Concept Check: Perfect Forward Secrecy',
    subtitle: 'Understanding the Core Guarantee',
    caption: 'How does Ephemeral Diffie-Hellman protect against retroactive decryption?',
    eli5Caption: 'What is the secret trick of Perfect Forward Secrecy?',
    askTheRoom: {
      question: 'Which property describes a cryptosystem where the compromise of long-term server private keys does NOT compromise the confidentiality of past recorded communication sessions?',
      options: [
        'Zero-Knowledge Proof',
        'Perfect Forward Secrecy (PFS)',
        'Homomorphic Encryption',
        'Avalanche Effect'
      ],
      correctIndex: 1,
      explanation: 'Perfect Forward Secrecy (PFS) ensures that session keys are generated using ephemeral, disposable Diffie-Hellman parameters that are erased from memory after the session ends. Even if an adversary steals the server’s long-term private key in the future, past sessions cannot be decrypted.'
    },
    speakerNotes: {
      script: 'Review the definition of PFS. Ensure every student understands why PFS is now mandatory in TLS 1.3.',
      likelyQuestions: []
    }
  },

  // 8. Exam Words
  {
    id: 'km-exam-words',
    kind: 'exam-words',
    title: 'Exam Terminology: Key Management & Distribution',
    subtitle: 'Core Definitions and Formulas for Examinations',
    caption: 'Memorize these definitions and formulas for University Network Security examinations.',
    eli5Caption: 'High-scoring definitions to write on your exam paper.',
    examWords: {
      term: 'Key Management & Perfect Forward Secrecy (PFS)',
      definition: 'The comprehensive lifecycle of cryptographic keys (generation, distribution, storage, revocation), including mechanisms like centralized KDCs ($O(N)$ complexity) and Ephemeral Diffie-Hellman (PFS) ensuring past sessions remain secure if long-term keys are compromised.',
      keywords: [
        'Pairwise scaling: $N(N-1)/2$',
        'Key Distribution Center (KDC)',
        'Session key vs Master key',
        'Perfect Forward Secrecy (DHE / ECDHE)',
        'Public Key Infrastructure (PKI)'
      ],
      mustRememberPoints: [
        'Pairwise symmetric key distribution scales quadratically $O(N^2)$; KDCs reduce complexity to linear $O(N)$.',
        'A KDC is an online single point of failure; PKI enables offline certificate verification.',
        'Perfect Forward Secrecy requires ephemeral key exchange (DHE/ECDHE) and forbids static RSA key exchange.'
      ],
      typicalMarks: 5
    },
    speakerNotes: {
      script: 'Review the 5-mark structure: 1. State the $N(N-1)/2$ formula. 2. Define KDC master vs session keys. 3. Define Perfect Forward Secrecy and how ephemeral Diffie-Hellman satisfies it.',
      likelyQuestions: []
    }
  }
]

export const keyManagementPresentation: TopicPresentation = {
  moduleId: 'm6',
  moduleTitle: 'M6: Network Security Applications',
  topicId: 'key-management',
  topicTitle: 'Key Management & Distribution',
  targetDurationMinutes: 12,
  plates: keyManagementPlates
}
