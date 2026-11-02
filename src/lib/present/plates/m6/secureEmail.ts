import { Plate, TopicPresentation } from "@/lib/present/types"

export const secureEmailPlates: Plate[] = [
  // 1. Hook
  {
    id: 'email-hook',
    kind: 'hook',
    title: 'The Postcard of the Internet',
    subtitle: 'From Plaintext SMTP (RFC 821) to Phil Zimmermann’s PGP (1991)',
    caption: 'Simple Mail Transfer Protocol (SMTP) transmits messages in unencrypted plaintext across dozens of mail transfer agents (MTAs); anyone with network access can read, alter, or forge email without detection.',
    eli5Caption: 'Writing personal letters on postcards that every postal worker along the road can read and photocopy.',
    speakerNotes: {
      script: 'Start by explaining SMTP’s plaintext design: In 1982, email was designed like physical postcards. Phil Zimmermann created Pretty Good Privacy (PGP) in 1991 to give citizens military-grade end-to-end encryption. The US government initially subjected Zimmermann to a criminal investigation for "munitions export" because 128-bit encryption was legally considered a military weapon.',
      likelyQuestions: [
        {
          question: 'Does TLS (STARTTLS) solve email security without PGP?',
          answer: 'No! STARTTLS only encrypts the hop between individual mail servers (hop-by-hop). The email sits completely unencrypted in plaintext inside mail server queues and cloud provider inboxes.'
        }
      ]
    }
  },

  // 2. Concept: The 5-Step PGP Pipeline
  {
    id: 'email-concept',
    kind: 'concept',
    title: 'The 5-Step PGP Hybrid Encryption Pipeline',
    subtitle: 'Sign -> Compress -> Symmetric Encrypt -> Asymmetric Wrap -> ASCII Armor',
    caption: 'PGP combines five distinct cryptographic and data processing stages to provide authentication, confidentiality, cryptanalysis defense, and email gateway compatibility in a single pipeline.',
    eli5Caption: 'A 5-step factory assembly line: sign your name, vacuum-pack the box, lock it with a key, put the key in a safe, and wrap the safe in brown paper.',
    scene: {
      id: 'scene-pgp-pipeline',
      title: 'PGP End-to-End Processing Flow',
      actors: [
        { id: 'alice', kind: 'alice', label: 'Alice (Sender)', pos: { x: 80, y: 150 } },
        { id: 'mail-mta', kind: 'server', label: 'Untrusted SMTP Relays', pos: { x: 250, y: 150 } },
        { id: 'bob', kind: 'bob', label: 'Bob (Recipient)', pos: { x: 420, y: 150 } }
      ],
      objects: [
        { id: 'plain', kind: 'plain', label: 'Confidential Plaintext', at: { x: 80, y: 150 } }
      ],
      steps: [
        {
          caption: 'Alice signs the plaintext message with her RSA Private Key (Step 1: Digital Signature).',
          actions: [
            { do: 'highlight', target: ['alice', 'plain'], tone: 'info' }
          ]
        },
        {
          caption: 'Signed message is compressed using ZIP/Deflate to reduce plaintext redundancy (Step 2: Compression).',
          actions: [
            { do: 'transform', obj: 'plain', into: { label: 'Compressed [Sign + Msg]' } }
          ]
        },
        {
          caption: 'Alice generates random 256-bit session key K_s and encrypts data via AES/CAST-5 (Step 3: Symmetric Encryption).',
          actions: [
            { do: 'transform', obj: 'plain', into: { label: 'AES-Encrypted Ciphertext' } },
            { do: 'highlight', target: ['plain'], tone: 'signal' }
          ]
        },
        {
          caption: 'Session key K_s is encrypted with Bob’s RSA Public Key and prepended (Step 4: Asymmetric Key Wrap).',
          actions: [
            { do: 'appear', obj: { id: 'key-wrap', kind: 'key-pub', label: 'RSA_Enc(K_s, Bob_Pub)', at: { x: 120, y: 110 } } }
          ]
        },
        {
          caption: 'Binary ciphertext is encoded into 7-bit Radix-64 ASCII Armor with CRC-24 checksum (Step 5: ASCII Armor).',
          actions: [
            { do: 'transform', obj: 'plain', into: { label: '-----BEGIN PGP MESSAGE-----' } },
            { do: 'move', obj: 'plain', to: { x: 250, y: 150 } },
            { do: 'move', obj: 'plain', to: { x: 420, y: 150 } },
            { do: 'highlight', target: ['bob'], tone: 'ok' }
          ]
        }
      ],
      viewBox: '0 0 500 300'
    },
    speakerNotes: {
      script: 'Emphasize the 5 steps in order: 1. Sign (Sender Private Key). 2. Compress (ZIP). 3. Encrypt (Symmetric Session Key). 4. Wrap Key (Recipient Public Key). 5. Armor (Radix-64). Be ready to explain why compression happens BEFORE encryption: encrypted data has maximal entropy and cannot be compressed, and compressing first eliminates character frequency patterns.',
      likelyQuestions: [
        {
          question: 'Why does PGP compress before signing or after signing?',
          answer: 'PGP signs BEFORE compression so that digital signatures can be verified independently without requiring specific decompressor implementations.'
        }
      ]
    }
  },

  // 3. Process: Radix-64 ASCII Armoring (Base64 + CRC-24)
  {
    id: 'email-process',
    kind: 'process',
    title: 'Radix-64 ASCII Armoring & CRC-24 Checksum',
    subtitle: 'Navigating 7-Bit Legacy Mail Gateways',
    caption: 'Legacy internet email systems (RFC 821) only supported 7-bit ASCII characters (values 0-127). PGP maps groups of three 8-bit binary bytes (24 bits) into four 6-bit printable ASCII characters with a CRC-24 checksum.',
    eli5Caption: 'Translating binary machine code into safe alphabet letters so ancient telegraph machines don’t crash.',
    customFigure: 'BitStrip',
    speakerNotes: {
      script: 'Walk through Radix-64 mechanics: 3 bytes of binary data = 24 bits. Split into four 6-bit chunks ($2^6 = 64$ printable characters: A-Z, a-z, 0-9, +, /). This expands data size by exactly 33%. RFC 4880 appends a 24-bit CRC checksum preceded by an equals sign (`=`) to detect email line truncation or corruption.',
      likelyQuestions: [
        {
          question: 'What is the overhead expansion of Radix-64?',
          answer: 'Exactly 4/3 or a 33.3% increase in transmitted message size.'
        }
      ]
    }
  },

  // 4. Attack & Defense: Web of Trust vs X.509 Certificate Authorities
  {
    id: 'email-attack-defense',
    kind: 'attack-defense',
    title: 'Vulnerability Spotlight: Rogue Key Injection vs Web of Trust',
    subtitle: 'Decentralized PGP Signatures vs S/MIME Enterprise Hierarchies',
    caption: 'Adversaries upload fake public keys with legitimate email addresses to public keyservers. PGP solves this through a decentralized Web of Trust, while S/MIME relies on hierarchical Certificate Authorities.',
    eli5Caption: 'Asking your trusted friends if they personally know John vs checking John’s state-issued driver’s license.',
    attackDefense: {
      attackName: 'Public Key Impersonation & Keyserver Poisoning',
      normalFlowDescription: 'User downloads public key and verifies that the key fingerprint matches the sender’s true identity.',
      attackFlowDescription: 'Attacker uploads a rogue RSA public key for "ceo@company.com" to public keyservers, intercepting encrypted communications.',
      defenseFlowDescription: '1. PGP Web of Trust: Public keys are validated only if signed by trusted introducers. 2. S/MIME: Public keys must be signed by an enterprise X.509 CA.'
    },
    speakerNotes: {
      script: 'Contrast the trust models: PGP uses the "Web of Trust" (WoT). There is no central boss. Alice signs Bob’s key at a key signing party. Charlie trusts Alice, so Charlie automatically trusts Bob! S/MIME uses standard corporate PKI: a root CA (like DigiCert or corporate Microsoft CA) issues certificates. S/MIME is preferred in large companies because IT can centrally revoke employee certificates when they leave.',
      likelyQuestions: [
        {
          question: 'Why is PGP rare in large corporations?',
          answer: 'Web of Trust is difficult to manage at enterprise scale (lack of central governance and centralized key escrow for legal discovery).'
        }
      ]
    }
  },

  // 5. Worked Example: Radix-64 Expansion & 24-Bit Bit Conversion
  {
    id: 'email-worked-example',
    kind: 'worked-example',
    title: 'Worked Example: Radix-64 Encoding Calculations',
    subtitle: 'Converting 8-Bit Binary Bytes into Printable ASCII Characters',
    caption: 'Converting three 8-bit bytes into four 6-bit Radix-64 characters using the standard Base64 alphabet table.',
    eli5Caption: 'Taking three large coins and trading them for four smaller coins that have the exact same total value.',
    workedExample: {
      problem: 'Encode the 3-character ASCII string "CNS" into Radix-64 (Base64) format. Show the 24-bit binary representation, the four 6-bit splits, and the resulting ASCII characters.',
      given: {
        'Input String': '"CNS"',
        'Character "C" Hex / ASCII': '0x43 = 67 (01000011 binary)',
        'Character "N" Hex / ASCII': '0x4E = 78 (01001110 binary)',
        'Character "S" Hex / ASCII': '0x53 = 83 (01010011 binary)'
      },
      steps: [
        {
          label: '1. Assemble 24-Bit Binary Stream',
          formula: 'Stream_{24} = Byte_1 \\parallel Byte_2 \\parallel Byte_3',
          substitution: '01000011 \\parallel 01001110 \\parallel 01010011',
          result: '010000110100111001010011',
          note: 'Concatenation of the three 8-bit input bytes.'
        },
        {
          label: '2. Partition into Four 6-Bit Blocks',
          formula: 'Chunk_1 = 010000, Chunk_2 = 110100, Chunk_3 = 111001, Chunk_4 = 010011',
          substitution: 'Values in decimal: 16, 52, 57, 19',
          result: '16, 52, 57, 19',
          note: 'Each 6-bit integer ranges from 0 to 63.'
        },
        {
          label: '3. Map to Base64 Alphabet',
          formula: 'Table: 16 \\rightarrow Q, 52 \\rightarrow 0, 57 \\rightarrow 5, 19 \\rightarrow T',
          substitution: 'Index 16 = "Q", Index 52 = "0", Index 57 = "5", Index 19 = "T"',
          result: '"Q05T"',
          note: 'Mapped via RFC 4880 standard conversion table.'
        }
      ],
      finalAnswer: 'The Radix-64 representation of "CNS" is "Q05T". Overhead ratio: 3 bytes expanded to 4 bytes (33.3% increase).',
      checkVerification: 'Decode check: Q(16) << 18 + 0(52) << 12 + 5(57) << 6 + T(19) = 0x434E53 = "CNS".'
    },
    speakerNotes: {
      script: 'Walk through the 6-bit binary math on the blackboard: 010000 = 16 (Q), 110100 = 52 (0), 111001 = 57 (5), 010011 = 19 (T). Remind students of padding: if the input is not a multiple of 3 bytes, Base64 appends `=` or `==` padding characters at the end.',
      likelyQuestions: []
    }
  },

  // 6. Comparison: PGP vs S/MIME
  {
    id: 'email-comparison',
    kind: 'compare',
    title: 'PGP vs S/MIME Protocol Comparison',
    subtitle: 'Decentralized Grassroots Security vs Enterprise PKI Hierarchy',
    caption: 'PGP is ideal for decentralized, peer-to-peer security; S/MIME is the corporate enterprise standard natively integrated into Microsoft Outlook and Apple Mail.',
    eli5Caption: 'Personal wax seals between friends vs corporate ID cards verified by company headquarters.',
    comparison: {
      leftTitle: 'Pretty Good Privacy (PGP / OpenPGP)',
      rightTitle: 'S/MIME (RFC 8551)',
      differences: [
        {
          feature: 'Trust Architecture',
          left: 'Decentralized peer-to-peer Web of Trust (WoT)',
          right: 'Strict hierarchical PKI rooted at commercial Certificate Authorities',
          diffTone: 'info'
        },
        {
          feature: 'Key Certification Format',
          left: 'OpenPGP key certificates with public key fingerprints',
          right: 'ITU-T X.509 v3 Digital Certificates',
          diffTone: 'ok'
        },
        {
          feature: 'Email Client Integration',
          left: 'Requires third-party plugins (GPGTools, Enigmail, Mailvelope)',
          right: 'Natively built into Microsoft Outlook, Apple Mail, and Thunderbird',
          diffTone: 'signal'
        },
        {
          feature: 'Enterprise Administration',
          left: 'Difficult: No central key recovery or automated deployment',
          right: 'Seamless: Automated Active Directory / MDM cert provisioning',
          diffTone: 'ok'
        }
      ],
      summaryTakeaway: 'PGP provides grassroots independence without government/corporate authorities; S/MIME provides centralized manageability for enterprise compliance.'
    },
    speakerNotes: {
      script: 'Review the classic university comparison question: "Differentiate between PGP and S/MIME based on trust model, certificate format, and enterprise adoption." WoT vs X.509 is the key conceptual difference.',
      likelyQuestions: []
    }
  },

  // 7. Ask The Room
  {
    id: 'email-ask-the-room',
    kind: 'ask-the-room',
    title: 'Concept Check: Secure Email Pipelines',
    subtitle: 'Why Compress Before Encrypting?',
    caption: 'Why does PGP compress messages before encrypting them?',
    eli5Caption: 'Why do you vacuum-pack the box before locking it?',
    askTheRoom: {
      question: 'Why does PGP perform data compression (ZIP) BEFORE symmetric encryption rather than after encryption?',
      options: [
        'Because symmetric ciphers cannot encrypt uncompressed plaintexts',
        'Because encrypted ciphertext has near-maximal entropy (resembles random noise) and cannot be compressed; compressing first reduces plaintext redundancy, strengthening the message against frequency cryptanalysis',
        'Because compression automatically signs the sender’s public key',
        'Because email gateways reject any packet smaller than 100 kilobytes'
      ],
      correctIndex: 1,
      explanation: 'Shannon’s Information Theory proves that truly encrypted data has maximal entropy and is mathematically incompressible. Furthermore, compressing the plaintext before encryption eliminates redundant character patterns and letter frequencies, denying valuable statistical patterns to cryptanalysts.'
    },
    speakerNotes: {
      script: 'This is a favorite exam trick question: "Can you compress ciphertext?" Emphasize that good ciphertext looks like pure random noise; attempting to compress it usually makes it larger due to compression headers.',
      likelyQuestions: []
    }
  },

  // 8. Exam Words
  {
    id: 'email-exam-words',
    kind: 'exam-words',
    title: 'Exam Terminology: Secure Email (PGP & S/MIME)',
    subtitle: 'Definitions and Keywords for Examinations',
    caption: 'Memorize these core definitions for University Network Security examinations.',
    eli5Caption: 'The exact phrasing professors look for when grading secure email questions.',
    examWords: {
      term: 'Pretty Good Privacy (PGP) & Hybrid Cryptosystem',
      definition: 'An end-to-end secure email framework that combines digital signatures (RSA/DSA), symmetric session encryption (CAST-5/AES), asymmetric key distribution, and Radix-64 conversion under a decentralized Web of Trust architecture.',
      keywords: [
        '5-Step PGP Pipeline',
        'Radix-64 ASCII Armor & CRC-24',
        'Web of Trust vs X.509 PKI',
        'Hybrid Encryption ($K_s$ session key)',
        'Compression before encryption'
      ],
      mustRememberPoints: [
        'PGP 5 steps: Sign -> Compress -> Encrypt -> Key Wrap -> Radix-64 Armor.',
        'Radix-64 converts three 8-bit binary bytes into four 6-bit ASCII characters (33% expansion).',
        'PGP uses decentralized Web of Trust; S/MIME uses centralized hierarchical X.509 CAs.'
      ],
      typicalMarks: 5
    },
    speakerNotes: {
      script: 'Advise students to memorize the 5 PGP steps in order: S-C-E-K-A (Sign, Compress, Encrypt, Key-wrap, Armor). Remembering this acronym guarantees 5/5 marks on any PGP question.',
      likelyQuestions: []
    }
  }
]

export const secureEmailPresentation: TopicPresentation = {
  moduleId: 'm6',
  moduleTitle: 'M6: Network Security Applications',
  topicId: 'secure-email',
  topicTitle: 'Secure Email: PGP and S/MIME',
  targetDurationMinutes: 12,
  plates: secureEmailPlates
}
