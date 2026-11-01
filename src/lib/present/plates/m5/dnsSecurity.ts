import { Plate, TopicPresentation } from "@/lib/present/types"

export const dnsSecurityPlates: Plate[] = [
  // 1. Hook
  {
    id: 'dns-hook',
    kind: 'hook',
    title: 'Poisoning the Internet’s Address Book',
    subtitle: 'From Plaintext Lookups to the Landmark 2008 Kaminsky Flaw',
    caption: 'Domain Name System (DNS) maps human-readable domain names to IP addresses over unauthenticated UDP port 53; in 2008, Dan Kaminsky discovered a flaw that allowed attackers to hijack entire domain zones in seconds.',
    eli5Caption: 'Sneaking into the telephone operator’s booth and switching the bank’s phone number with your own.',
    speakerNotes: {
      script: 'Start with the fundamental importance of DNS. When a user types `bank.com`, the browser trusts the DNS resolver to return the true IP. Because DNS originally ran over plain UDP with only a 16-bit Transaction ID (TXID) for authentication, attackers could spoof responses. In 2008, Dan Kaminsky discovered that querying randomized subdomains allowed unlimited parallel attempts to poison entire domain zones.',
      likelyQuestions: [
        {
          question: 'What is a DNS resolver cache?',
          answer: 'A local server memory store that holds previously resolved domain-to-IP mappings according to Time-To-Live (TTL) values so repeated queries do not traverse the internet.'
        }
      ]
    }
  },

  // 2. Concept: Dan Kaminsky’s 2008 Attack Discovery
  {
    id: 'dns-concept',
    kind: 'concept',
    title: 'The Kaminsky DNS Cache Poisoning Flaw',
    subtitle: 'Bypassing TTL Limits with Randomized Subdomain Queries',
    caption: 'Before Kaminsky, poisoning required waiting hours for cached records to expire. Kaminsky queried non-existent subdomains (`x101.bank.com`), triggering continuous recursive lookups while flooding forged authoritative NS records (`bank.com IN NS ns.attacker.com`).',
    eli5Caption: 'Asking 1,000 made-up names at the front desk so the secretary is forced to constantly call headquarters, letting you forge the boss’s phone number.',
    scene: {
      id: 'scene-kaminsky',
      title: 'Dan Kaminsky DNS Cache Poisoning Mechanism',
      actors: [
        { id: 'attacker', kind: 'mallory', label: 'Attacker (Mallory)', pos: { x: 80, y: 150 } },
        { id: 'resolver', kind: 'server', label: 'Local DNS Resolver', pos: { x: 250, y: 150 } },
        { id: 'auth-ns', kind: 'server', label: 'Auth NS (bank.com)', pos: { x: 420, y: 150 } }
      ],
      objects: [
        { id: 'q1', kind: 'packet', label: 'Query: random101.bank.com', at: { x: 120, y: 150 } }
      ],
      steps: [
        {
          caption: 'Mallory sends query for random non-existent subdomain `x1.bank.com` to the target resolver.',
          actions: [
            { do: 'highlight', target: ['attacker', 'q1'], tone: 'bad' }
          ]
        },
        {
          caption: 'Resolver has no cached entry for `x1.bank.com`, so it forwards a recursive query to Authoritative NS.',
          actions: [
            { do: 'move', obj: 'q1', to: { x: 250, y: 150 } },
            { do: 'appear', obj: { id: 'q-rec', kind: 'packet', label: 'Recursive Query (TXID=?)', at: { x: 250, y: 150 } } },
            { do: 'move', obj: 'q-rec', to: { x: 420, y: 150 } }
          ]
        },
        {
          caption: 'Simultaneously, Mallory floods the resolver with hundreds of forged UDP replies guessing the 16-bit TXID.',
          actions: [
            { do: 'appear', obj: { id: 'forged', kind: 'packet', label: 'Forged Reply: NS=attacker.com', at: { x: 80, y: 220 } } },
            { do: 'move', obj: 'forged', to: { x: 250, y: 150 } },
            { do: 'highlight', target: ['resolver'], tone: 'bad' }
          ]
        },
        {
          caption: 'One forged reply matches the TXID before the real answer arrives: the resolver caches Mallory as the NS for ALL of bank.com!',
          actions: [
            { do: 'highlight', target: ['resolver'], tone: 'signal' }
          ]
        }
      ],
      viewBox: '0 0 500 300'
    },
    speakerNotes: {
      script: 'Explain the critical difference: In standard DNS, you could only guess once per TTL expiration (e.g., once every 24 hours). Kaminsky realized that by asking for `x1.bank.com`, `x2.bank.com`, `x3.bank.com`, you force the resolver to generate new queries immediately. In the Additional Records section of the forged response, the attacker injects `bank.com NS attacker.com`. Once accepted, the entire domain zone is compromised for all users of that resolver.',
      likelyQuestions: [
        {
          question: 'What immediate patch was deployed globally in 2008?',
          answer: 'Source Port Randomization (SPR): resolvers stopped using static UDP port 53 for outgoing queries and instead randomized both the 16-bit TXID and 16-bit UDP port, expanding the keyspace from 2^16 to 2^32.'
        }
      ]
    }
  },

  // 3. Process: DNS Exfiltration & Tunneling
  {
    id: 'dns-tunneling-process',
    kind: 'process',
    title: 'Covert DNS Exfiltration & Tunneling',
    subtitle: 'Smuggling Stolen Data across Enterprise Firewalls',
    caption: 'Firewalls typically permit outbound UDP port 53 to internal resolvers. Malware chunks confidential data into Base32 subdomains (`creditcard.attacker-c2.net`), exfiltrating secrets past perimeter firewalls.',
    eli5Caption: 'Writing stolen company secrets in tiny code inside the envelope address lines of letters sent to the mailroom.',
    scene: {
      id: 'scene-dns-tunnel',
      title: 'DNS Tunneling Exfiltration Path',
      actors: [
        { id: 'infected', kind: 'client', label: 'Infected Host', pos: { x: 80, y: 150 } },
        { id: 'corp-dns', kind: 'server', label: 'Internal Corp DNS', pos: { x: 250, y: 150 } },
        { id: 'c2-ns', kind: 'server', label: 'Attacker C2 Authoritative NS', pos: { x: 420, y: 150 } }
      ],
      objects: [
        { id: 'exfil', kind: 'packet', label: 'Query: 414243.c2.net', at: { x: 120, y: 150 } }
      ],
      steps: [
        {
          caption: 'Malware encodes stolen data into Base32/hex chunks and prepends it to the C2 domain name.',
          actions: [
            { do: 'highlight', target: ['infected', 'exfil'], tone: 'bad' }
          ]
        },
        {
          caption: 'Infected host sends standard DNS query to the trusted corporate internal resolver.',
          actions: [
            { do: 'move', obj: 'exfil', to: { x: 250, y: 150 } },
            { do: 'highlight', target: ['corp-dns'], tone: 'info' }
          ]
        },
        {
          caption: 'Corporate resolver recurses through the internet and queries the Authoritative NS for c2.net.',
          actions: [
            { do: 'move', obj: 'exfil', to: { x: 420, y: 150 } },
            { do: 'highlight', target: ['c2-ns'], tone: 'bad' }
          ]
        },
        {
          caption: 'Attacker’s authoritative nameserver logs the subdomain string and reassembles the stolen file.',
          actions: [
            { do: 'highlight', target: ['c2-ns'], tone: 'signal' }
          ]
        }
      ],
      viewBox: '0 0 500 300'
    },
    speakerNotes: {
      script: 'Walk through why DNS tunneling is so insidious: The infected machine does not need a direct connection to the public internet! It can be on an air-gapped internal LAN with only access to the internal Active Directory DNS server. The internal DNS server innocently resolves the external domain, acting as an unwitting proxy for the data exfiltration.',
      likelyQuestions: [
        {
          question: 'How do Security Operations Centers (SOCs) detect DNS tunneling?',
          answer: 'SOCs analyze DNS query logs for high Shannon entropy, unusually long subdomain labels (>50 characters), high query frequency to uncommon TLDs, and abnormal TXT/NULL record query ratios.'
        }
      ]
    }
  },

  // 4. Attack & Defense: DNSSEC Hierarchical Trust
  {
    id: 'dns-attack-defense',
    kind: 'attack-defense',
    title: 'Vulnerability Spotlight: Cache Poisoning vs DNSSEC',
    subtitle: 'Cryptographic Authenticity along the Chain of Trust',
    caption: 'Domain Name System Security Extensions (DNSSEC) adds digital signatures to DNS records; resolvers verify RRSIG records against DNSKEY public keys chained to the ICANN Root Anchor.',
    eli5Caption: 'Every phonebook entry is signed with a certified wax seal that can be verified all the way up to the President’s office.',
    customFigure: 'ChainDiagram',
    attackDefense: {
      attackName: 'DNS Cache Poisoning & Record Falsification',
      normalFlowDescription: 'Resolver queries recursive authority and accepts plaintext IP address based only on matching 16-bit TXID.',
      attackFlowDescription: 'Attacker forges UDP response containing incorrect IP address and poisoned authoritative NS delegation.',
      defenseFlowDescription: 'DNSSEC cryptographic validation: Resolvers verify RRSIG signatures using Zone Signing Keys (ZSK) validated by Key Signing Keys (KSK) anchored at the Root Zone DS record.'
    },
    speakerNotes: {
      script: 'Review the DNSSEC trust chain: 1. Root Zone (.) signs a Delegation Signer (DS) record pointing to .org. 2. The .org registry signs a DS record pointing to example.org. 3. example.org provides its DNSKEY and signs its A records with an RRSIG. If an attacker injects a spoofed IP, the cryptographic signature fails, and the resolver rejects the record as BOGUS.',
      likelyQuestions: [
        {
          question: 'Does DNSSEC encrypt DNS queries?',
          answer: 'NO! DNSSEC provides authentication and data integrity, NOT confidentiality. Anyone can still read DNS queries in transit. Confidentiality requires DoH (DNS over HTTPS) or DoT (DNS over TLS).'
        }
      ]
    }
  },

  // 5. Worked Example: Kaminsky Probability & Entropy Math
  {
    id: 'dns-worked-example',
    kind: 'worked-example',
    title: 'Worked Example: Kaminsky Attack Success Probability',
    subtitle: 'Impact of Source Port Randomization on Poisoning Feasibility',
    caption: 'Calculating the number of queries required to poison a DNS resolver with and without Source Port Randomization (SPR) using the Birthday Collision formula.',
    eli5Caption: 'Calculating how many lottery tickets you need to buy when the winning combination has 4 numbers vs 8 numbers.',
    workedExample: {
      problem: 'An attacker attempts Kaminsky cache poisoning against a recursive resolver by sending N = 1,000 queries with M = 50 forged responses per query (total 50,000 forged packets). Calculate the collision probability P: Case A: Static source port (16-bit TXID only, 2^16 space). Case B: Source Port Randomization enabled (16-bit TXID + 16-bit port, 2^32 space).',
      given: {
        'Total Forged Responses': '50,000 packets',
        'Case A Keyspace (16 bits)': '2^{16} = 65,536',
        'Case B Keyspace (32 bits)': '2^{32} = 4,294,967,296'
      },
      steps: [
        {
          label: '1. Birthday Collision Probability Formula',
          formula: 'P \\approx 1 - e^{-\\frac{TotalForged}{Keyspace}}',
          substitution: 'Exponential decay collision approximation over uniform discrete space',
          result: 'Formula established',
          note: 'Approximates probability of at least one forged packet matching the resolver’s pending query.'
        },
        {
          label: '2. Case A: Static Source Port (16-bit TXID)',
          formula: 'P_A = 1 - e^{-\\frac{50,000}{65,536}} = 1 - e^{-0.7629}',
          substitution: '1 - 0.4663',
          result: '0.5337 (53.4% Chance)',
          note: 'Attacker has over 53% probability of successfully poisoning the resolver within 1,000 queries (under 10 seconds)!'
        },
        {
          label: '3. Case B: Source Port Randomization (32-bit Entropy)',
          formula: 'P_B = 1 - e^{-\\frac{50,000}{4,294,967,296}} = 1 - e^{-0.0000116}',
          substitution: '1 - 0.9999884',
          result: '0.0000116 (0.00116% Chance)',
          note: 'Probability drops by a factor of 46,000! Poisoning requires hundreds of millions of packets, taking days and alerting IDSes.'
        }
      ],
      finalAnswer: 'Without SPR (Case A), success probability is 53.4% in seconds. With SPR (Case B), probability collapses to 0.00116%, successfully rendering brute-force Kaminsky poisoning infeasible.',
      checkVerification: 'Ratio of spaces = 2^32 / 2^16 = 65,536x increase in defensive entropy.'
    },
    speakerNotes: {
      script: 'Emphasize the power of adding 16 bits of randomness. By randomizing the client UDP source port in addition to the transaction ID, the attacker must guess a 32-bit combination (1 in 4.3 billion) instead of 1 in 65,536. This single patch rescued the internet in 2008 while DNSSEC adoption slowly gained traction.',
      likelyQuestions: [
        {
          question: 'What is Bailiwick checking in DNS?',
          answer: 'A security rule where a resolver only accepts records that are within the geographic scope of the server queried (e.g., an answer from `bank.com` cannot claim authority over `google.com`).'
        }
      ]
    }
  },

  // 6. Comparison: DNSSEC vs DoH / DoT
  {
    id: 'dns-comparison',
    kind: 'compare',
    title: 'DNSSEC vs DNS-over-HTTPS (DoH)',
    subtitle: 'Cryptographic Authenticity vs Transport Confidentiality',
    caption: 'A common misconception is that DNSSEC encrypts traffic; in reality, DNSSEC guarantees authenticity, while DoH/DoT provides privacy.',
    eli5Caption: 'A notarized legal document signed with a pen vs sealing a letter inside an opaque metal briefcase.',
    comparison: {
      leftTitle: 'DNSSEC (RFC 4033)',
      rightTitle: 'DNS-over-HTTPS / DoT (RFC 8484 / 7858)',
      differences: [
        {
          feature: 'Primary Goal',
          left: 'Authenticity & Data Integrity (Anti-Poisoning / Anti-Spoofing)',
          right: 'Confidentiality & Privacy (Anti-Eavesdropping / Anti-Censorship)',
          diffTone: 'info'
        },
        {
          feature: 'Traffic Encryption',
          left: 'None: Record contents and domain queries travel in plain cleartext',
          right: 'Full TLS 1.3 encryption (TCP port 443 / 853)',
          diffTone: 'signal'
        },
        {
          feature: 'Trust Anchor',
          left: 'ICANN Root Zone Key Signing Key (KSK) hierarchy',
          right: 'X.509 Certificate Authorities (Web PKI)',
          diffTone: 'ok'
        },
        {
          feature: 'Vulnerability Mitigated',
          left: 'Kaminsky cache poisoning and rogue DNS response injection',
          right: 'ISP surveillance, Wi-Fi eavesdropping, and SNI/DNS filtering',
          diffTone: 'bad'
        }
      ],
      summaryTakeaway: 'DNSSEC ensures you get the TRUE answer; DoH ensures NOBODY SEES what you asked.'
    },
    speakerNotes: {
      script: 'This is a favorite university exam trick question: "Does DNSSEC prevent your ISP from seeing what websites you browse?" The answer is NO. DNSSEC signatures are public; the packet is unencrypted. Only DoH or DoT encrypts the communication channel between client and resolver.',
      likelyQuestions: []
    }
  },

  // 7. Ask The Room
  {
    id: 'dns-ask-the-room',
    kind: 'ask-the-room',
    title: 'Concept Check: DNS Security Features',
    subtitle: 'Identifying Security Guarantees',
    caption: 'Test your understanding of DNSSEC guarantees.',
    eli5Caption: 'What does DNSSEC actually protect?',
    askTheRoom: {
      question: 'Which of the following security guarantees is provided by DNSSEC (Domain Name System Security Extensions)?',
      options: [
        'End-to-end payload encryption preventing ISPs from inspecting domain queries',
        'Cryptographic authentication of DNS data origin and proof of data integrity',
        'Automatic protection against volumetric UDP reflection DDoS attacks',
        'Anonymization of client IP addresses using onion routing'
      ],
      correctIndex: 1,
      explanation: 'DNSSEC provides origin authentication and integrity verification using digital signatures (RRSIG). It guarantees that a DNS response originated from the legitimate zone owner and was not altered in transit. It does NOT encrypt queries.'
    },
    speakerNotes: {
      script: 'Emphasize that DNSSEC does not hide queries or protect against volumetric DDoS; its sole mission is cryptographic truth in resolving names.',
      likelyQuestions: []
    }
  },

  // 8. Exam Words
  {
    id: 'dns-exam-words',
    kind: 'exam-words',
    title: 'Exam Terminology: DNS Attacks & DNSSEC',
    subtitle: 'Core Terms and Definitions for Exams',
    caption: 'Memorize these essential definitions for University Network Security examinations.',
    eli5Caption: 'High-scoring definitions to write on your exam paper.',
    examWords: {
      term: 'Kaminsky DNS Poisoning & DNSSEC',
      definition: 'A cache poisoning flaw discovered in 2008 where an attacker queries random non-existent subdomains to flood forged authoritative NS records into a recursive resolver; mitigated via Source Port Randomization (SPR) and cryptographic DNSSEC validation.',
      keywords: [
        'Kaminsky flaw',
        '16-bit Transaction ID (TXID)',
        'Source Port Randomization (SPR)',
        'DNSSEC (RRSIG, DNSKEY, DS)',
        'DNS Tunneling exfiltration'
      ],
      mustRememberPoints: [
        'Kaminsky bypassed TTL caching delays by generating queries for randomized non-existent subdomains.',
        'SPR increases entropy from 16 bits (65,536) to 32 bits (4.3 billion) by randomizing the UDP source port.',
        'DNSSEC provides authentication and integrity via hierarchical digital signatures, but does NOT encrypt queries.'
      ],
      typicalMarks: 5
    },
    speakerNotes: {
      script: 'Students must be able to list the three core DNSSEC record types: RRSIG (Resource Record Signature), DNSKEY (public key), and DS (Delegation Signer hash link in parent zone). Mentioning these guarantees maximum marks.',
      likelyQuestions: []
    }
  }
]

export const dnsSecurityPresentation: TopicPresentation = {
  moduleId: 'm5',
  moduleTitle: 'M5: Network Security',
  topicId: 'dns-security',
  topicTitle: 'DNS Spoofing & DNS Tunneling',
  targetDurationMinutes: 12,
  plates: dnsSecurityPlates
}
