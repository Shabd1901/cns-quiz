import { Plate, TopicPresentation } from "@/lib/present/types"

export const dosDdosPlates: Plate[] = [
  // 1. Hook
  {
    id: 'dos-hook',
    kind: 'hook',
    title: 'Asymmetry in Cyberspace',
    subtitle: 'How a 1 Mbps Stream Starves a 10 Gbps Enterprise Server',
    caption: 'Denial of Service exploits resource asymmetry: sending a single 40-byte SYN packet forces the server to allocate 840 bytes of kernel memory for 75 seconds; a modest stream of bogus requests exhausts all connection memory.',
    eli5Caption: 'Calling a busy restaurant to reserve every single table using fake names, and never showing up.',
    speakerNotes: {
      script: 'Start by explaining the mathematical asymmetry of DoS. An attacker spends virtually zero CPU and bandwidth to send raw 40-byte TCP SYN frames with fake IP addresses. The server, however, must allocate a full transmission control block (`struct tcp_request_sock`, ~840 bytes), set a 75-second timeout, and retransmit SYN-ACK packets. When the backlog queue fills up, legitimate users are completely blocked.',
      likelyQuestions: [
        {
          question: 'What is the difference between DoS and DDoS?',
          answer: 'DoS originates from a single attacker system or IP; DDoS (Distributed Denial of Service) coordinates thousands or millions of compromised IoT devices or botnets simultaneously.'
        }
      ]
    }
  },

  // 2. Concept: Backlog Queue Saturation Mechanics
  {
    id: 'dos-concept',
    kind: 'concept',
    title: 'The Anatomy of a TCP SYN Flood',
    subtitle: 'Saturating the Server’s Half-Open Connection Queue',
    caption: 'Every operating system allocates a finite queue (`listen(sock, backlog)`) for connections in the `SYN_RCVD` state. Flooding spoofed SYNs fills this queue, dropping legitimate connection attempts.',
    eli5Caption: 'Filling a waiting room with cardboard cutouts so real patients are turned away at the clinic door.',
    scene: {
      id: 'scene-syn-flood',
      title: 'Backlog Queue Saturation Sequence',
      actors: [
        { id: 'attacker', kind: 'mallory', label: 'Attacker (Spoofed IPs)', pos: { x: 80, y: 100 } },
        { id: 'client', kind: 'alice', label: 'Legitimate Alice', pos: { x: 80, y: 220 } },
        { id: 'server', kind: 'server', label: 'Target Server (Backlog=4)', pos: { x: 420, y: 160 } }
      ],
      objects: [
        { id: 'syn1', kind: 'packet', label: 'SYN from 1.1.1.1', at: { x: 120, y: 100 } },
        { id: 'syn2', kind: 'packet', label: 'SYN from 2.2.2.2', at: { x: 140, y: 100 } },
        { id: 'syn3', kind: 'packet', label: 'SYN from 3.3.3.3', at: { x: 160, y: 100 } },
        { id: 'syn4', kind: 'packet', label: 'SYN from 4.4.4.4', at: { x: 180, y: 100 } }
      ],
      steps: [
        {
          caption: 'Attacker blasts thousands of TCP SYN packets with randomized spoofed source IP addresses.',
          actions: [
            { do: 'highlight', target: ['attacker', 'syn1', 'syn2', 'syn3', 'syn4'], tone: 'bad' }
          ]
        },
        {
          caption: 'Server allocates memory for all 4 half-open sockets; the backlog queue reaches 100% capacity.',
          actions: [
            { do: 'move', obj: 'syn1', to: { x: 420, y: 160 } },
            { do: 'move', obj: 'syn2', to: { x: 420, y: 160 } },
            { do: 'move', obj: 'syn3', to: { x: 420, y: 160 } },
            { do: 'move', obj: 'syn4', to: { x: 420, y: 160 } },
            { do: 'highlight', target: ['server'], tone: 'bad' }
          ]
        },
        {
          caption: 'Legitimate Alice attempts to connect with a standard SYN packet.',
          actions: [
            { do: 'appear', obj: { id: 'alice-syn', kind: 'packet', label: 'Alice SYN', at: { x: 120, y: 220 } } },
            { do: 'move', obj: 'alice-syn', to: { x: 380, y: 180 } }
          ]
        },
        {
          caption: 'Server has zero available backlog slots: Alice’s connection is silently dropped!',
          actions: [
            { do: 'vanish', obj: 'alice-syn' },
            { do: 'highlight', target: ['client'], tone: 'bad' }
          ]
        }
      ],
      viewBox: '0 0 500 320'
    },
    speakerNotes: {
      script: 'Walk through the kernel queue mechanics. In Linux, `/proc/sys/net/ipv4/tcp_max_syn_backlog` defines the maximum number of remembered connection requests. If the queue holds 1,024 entries, an attacker sending just 20 packets per second can keep the queue permanently saturated because each entry persists until the 75-second timeout expires.',
      likelyQuestions: [
        {
          question: 'Why doesn’t the server just allocate an infinite queue?',
          answer: 'Memory is finite: allocating unbounded queue state invites kernel out-of-memory (OOM) crashes, which crash the entire operating system.'
        }
      ]
    }
  },

  // 3. Process: SYN Cookies (RFC 4987)
  {
    id: 'dos-process',
    kind: 'process',
    title: 'Stateless Salvation: RFC 4987 SYN Cookies',
    subtitle: 'Zero Memory Allocation during the Initial Handshake',
    caption: 'Dan Bernstein and Eric Schenk solved SYN floods by encoding all socket state cryptographically into the 32-bit Initial Sequence Number (ISN); the server allocates ZERO memory until the client returns a valid ACK.',
    eli5Caption: 'Giving out a numbered ticket stamped with cryptographic ink instead of writing people’s names into a guest book.',
    scene: {
      id: 'scene-syn-cookies',
      title: 'The Stateless SYN Cookie Verification Cycle',
      actors: [
        { id: 'client', kind: 'alice', label: 'Client (Alice)', pos: { x: 80, y: 150 } },
        { id: 'server', kind: 'server', label: 'Server (SYN Cookies ON)', pos: { x: 420, y: 150 } }
      ],
      objects: [
        { id: 'p-syn', kind: 'packet', label: 'SYN (Seq=x)', at: { x: 120, y: 150 } }
      ],
      steps: [
        {
          caption: 'Client sends SYN packet to initiate connection.',
          actions: [
            { do: 'highlight', target: ['client', 'p-syn'], tone: 'info' }
          ]
        },
        {
          caption: 'Server receives SYN, allocates ZERO memory, and computes 32-bit ISN cookie from endpoints and secret key.',
          actions: [
            { do: 'move', obj: 'p-syn', to: { x: 420, y: 150 } },
            { do: 'highlight', target: ['server'], tone: 'ok' }
          ]
        },
        {
          caption: 'Server replies with SYN-ACK containing the cryptographic cookie as its sequence number.',
          actions: [
            { do: 'appear', obj: { id: 'p-cookie', kind: 'packet', label: 'SYN-ACK (Seq = Cookie)', at: { x: 420, y: 150 } } },
            { do: 'move', obj: 'p-cookie', to: { x: 80, y: 150 } },
            { do: 'highlight', target: ['client'], tone: 'info' }
          ]
        },
        {
          caption: 'Client returns ACK with AckNumber = Cookie + 1. Server verifies hash; ONLY NOW does it allocate socket memory!',
          actions: [
            { do: 'appear', obj: { id: 'p-ack', kind: 'packet', label: 'ACK (Ack = Cookie + 1)', at: { x: 80, y: 150 } } },
            { do: 'move', obj: 'p-ack', to: { x: 420, y: 150 } },
            { do: 'highlight', target: ['server'], tone: 'ok' }
          ]
        }
      ],
      viewBox: '0 0 500 300'
    },
    speakerNotes: {
      script: 'Emphasize the cryptographic brilliance of SYN Cookies. If an attacker sends a million spoofed SYNs, the server responds with a million SYN-ACK cookies and immediately forgets about them. Memory allocated = ZERO bytes. The flood packets cause zero memory starvation! Only a real client that receives the SYN-ACK and returns the ACK will trigger socket allocation.',
      likelyQuestions: [
        {
          question: 'Are there any drawbacks to SYN cookies?',
          answer: 'Because the 32-bit ISN only has 3 bits to store MSS, large TCP options (like selective acknowledgments SACK and window scaling) were originally lost, though TCP timestamps (RFC 7323) now mitigate this.'
        }
      ]
    }
  },

  // 4. Attack & Defense: Volumetric DDoS & Amplification
  {
    id: 'dos-attack-defense',
    kind: 'attack-defense',
    title: 'Vulnerability Spotlight: Reflection DDoS vs Edge Scrubbing',
    subtitle: 'Abusing Open UDP Resolvers to Saturate Enterprise Links',
    caption: 'Attackers spoof victim IPs to query open NTP/DNS servers, multiplying small 50-byte queries into massive 3,000-byte responses (up to 50,000x amplification on Memcached).',
    eli5Caption: 'Sending letters to 10,000 companies asking for 500-page catalogs, but putting your enemy’s address on the envelope.',
    attackDefense: {
      attackName: 'UDP Reflection & Amplification DDoS',
      normalFlowDescription: 'Client queries DNS or NTP server and receives a proportional response answering its query.',
      attackFlowDescription: 'Attacker sends 50-byte UDP packets with victim’s spoofed IP to thousands of open servers, triggering a 50x-10,000x flood of return traffic that saturates victim bandwidth.',
      defenseFlowDescription: 'Upstream DDoS Scrubbing Centers (Anycast routing + BGP flowspec) filter volumetric UDP floods before they reach the target datacenter pipe.'
    },
    speakerNotes: {
      script: 'Explain the concept of Amplification Factor: DNS ANY queries provide ~50x amplification; NTP `monlist` command provides 206x; Memcached on UDP port 11211 famously achieved a 51,000x amplification factor in the 1.3 Tbps GitHub attack of 2018. A single 10 Mbps laptop can generate 500 Gbps of attack traffic against a target!',
      likelyQuestions: [
        {
          question: 'Can a local firewall stop a volumetric amplification attack?',
          answer: 'No! If the incoming pipe is 1 Gbps and the flood is 100 Gbps, the physical fiber optic line is saturated at the ISP; packets are dropped before reaching the firewall.'
        }
      ]
    }
  },

  // 5. Worked Example: RFC 4987 SYN Cookie Bit Packing
  {
    id: 'dos-worked-example',
    kind: 'worked-example',
    title: 'Worked Example: SYN Cookie Bit Construction',
    subtitle: 'Encoding 32-Bit Stateless Initial Sequence Numbers',
    caption: 'Under RFC 4987, the 32-bit ISN packs: 5 bits of timestamp $t$, 3 bits of MSS index, and 24 bits of cryptographic HMAC over endpoints and secrets.',
    eli5Caption: 'Packing three different pieces of information into a single 32-bit lock combination.',
    workedExample: {
      problem: 'A server receives a SYN with MSS = 1460 bytes (MSS index 2 = `010` in binary) at time counter t = 14 (binary `01110`). The secret hash over the endpoints yields 24-bit value `0x1A2B3C`. What is the 32-bit ISN SYN cookie generated by the server?',
      given: {
        'Timestamp t (5 bits)': '14 (binary 01110)',
        'MSS Index (3 bits)': '2 (binary 010, for MSS=1460)',
        '24-Bit Secret Hash': '0x1A2B3C (24 bits)'
      },
      steps: [
        {
          label: '1. Shift Timestamp to Top 5 Bits (Bits 31..27)',
          formula: 'Field_1 = (t \\pmod{32}) \\ll 27',
          substitution: '14 \\ll 27 = 01110_2 \\ll 27',
          result: '0x70000000',
          note: 'Represents coarse time counter in ~64 second units for expiration checking.'
        },
        {
          label: '2. Shift MSS Index to Next 3 Bits (Bits 26..24)',
          formula: 'Field_2 = (MSS_{idx} \\& 0x07) \\ll 24',
          substitution: '2 \\ll 24 = 010_2 \\ll 24',
          result: '0x02000000',
          note: 'Preserves the server-chosen maximum segment size across the stateless gap.'
        },
        {
          label: '3. Combine with 24-Bit Secret Cryptographic Hash',
          formula: 'ISN = Field_1 \\mid Field_2 \\mid (Hash \\& 0x00FFFFFF)',
          substitution: '0x70000000 \\mid 0x02000000 \\mid 0x001A2B3C',
          result: '0x721A2B3C (1,914,317,628 decimal)',
          note: 'Full 32-bit integer transmitted as the server Initial Sequence Number.'
        }
      ],
      finalAnswer: 'The generated SYN Cookie ISN is 0x721A2B3C. When the client returns ACK = 0x721A2B3D, the server subtracts 1, extracts t=14 and MSS=2, and verifies the hash without having stored any state.',
      checkVerification: 'Deconstruction check: (0x721A2B3C >>> 27) = 14 (t). ((0x721A2B3C >>> 24) & 7) = 2 (MSS). Bottom 24 bits = 0x1A2B3C. Perfect recovery!'
    },
    speakerNotes: {
      script: 'Review the bit layout on the board: [5 bits: time] [3 bits: MSS] [24 bits: keyed hash]. When the client responds with ACK number Cookie+1, the server extracts the top 5 bits to check if time has advanced more than 2 windows (~2 minutes). If fresh, it recomputes the HMAC and verifies the bottom 24 bits. If they match, the connection is genuine and memory is allocated.',
      likelyQuestions: [
        {
          question: 'Can an attacker forge a valid ACK without sending a SYN?',
          answer: 'No! The attacker must guess the 24-bit hash, which has 2^24 = 16,777,216 possibilities. Blind guessing will almost certainly fail.'
        }
      ]
    }
  },

  // 6. Comparison: DoS vs DDoS
  {
    id: 'dos-comparison',
    kind: 'compare',
    title: 'Single-Source DoS vs Distributed DDoS',
    subtitle: 'Evolution from Script Kiddie Tools to Nation-State Botnets',
    caption: 'DoS attacks attempt resource exhaustion from a single origin; DDoS attacks overwhelm network infrastructure using distributed zombie botnets.',
    eli5Caption: 'One angry caller jamming your phone line vs thousands of automated callers flooding the entire city telephone network.',
    comparison: {
      leftTitle: 'Denial of Service (DoS)',
      rightTitle: 'Distributed Denial of Service (DDoS)',
      differences: [
        {
          feature: 'Attack Sources',
          left: 'Single machine, single IP address or single uplink pipe',
          right: 'Distributed botnets (thousands to millions of IoT/PC nodes)',
          diffTone: 'info'
        },
        {
          feature: 'Target Mechanism',
          left: 'Resource starvation (socket memory, CPU, app threads)',
          right: 'Volumetric link saturation (Tbps bandwidth floods) + resource exhaustion',
          diffTone: 'bad'
        },
        {
          feature: 'Defense Simplicity',
          left: 'Simple: Blacklist attacking IP on edge firewall or apply SYN cookies',
          right: 'Complex: Requires Anycast scrubbing, BGP flowspec, and CDN absorption',
          diffTone: 'signal'
        },
        {
          feature: 'Attribution',
          left: 'Traceable to single offending source IP or upstream ISP',
          right: 'Nearly impossible; commands issued via hidden Command-and-Control (C2)',
          diffTone: 'ok'
        }
      ],
      summaryTakeaway: 'DoS attacks can be mitigated locally via OS kernel settings; DDoS requires global cloud-scale scrubbing infrastructure.'
    },
    speakerNotes: {
      script: 'Point out the transition in cyber warfare: In the late 1990s, tools like Trinoo, TFN, and Stacheldraht introduced the concept of botnets. Today, botnets like Mirai compromise hundreds of thousands of default-password IoT cameras and routers to execute multi-terabit volumetric floods.',
      likelyQuestions: []
    }
  },

  // 7. Ask The Room
  {
    id: 'dos-ask-the-room',
    kind: 'ask-the-room',
    title: 'Concept Check: SYN Flood Mitigation',
    subtitle: 'The Mechanics of SYN Cookies',
    caption: 'How do SYN cookies defeat resource exhaustion?',
    eli5Caption: 'What is the secret magic of SYN cookies?',
    askTheRoom: {
      question: 'How do TCP SYN Cookies protect a server against backlog queue exhaustion during a SYN Flood attack?',
      options: [
        'By encrypting the client’s IP address with 256-bit AES',
        'By allocating zero socket memory at SYN time and encoding necessary connection parameters inside the 32-bit Initial Sequence Number',
        'By requiring all connecting clients to solve a proof-of-work Bitcoin block before receiving a reply',
        'By automatically disconnecting the server from the public internet during attack peaks'
      ],
      correctIndex: 1,
      explanation: 'Under SYN cookies (RFC 4987), the server does not allocate socket data structures upon receiving a SYN. Instead, it computes a cryptographic hash of connection parameters and sends it as the ISN in the SYN-ACK. Socket memory is only allocated if and when the client returns a matching ACK.'
    },
    speakerNotes: {
      script: 'Emphasize that the key phrase is "zero socket memory at SYN time". This is what neutralizes the attacker’s asymmetric advantage.',
      likelyQuestions: []
    }
  },

  // 8. Exam Words
  {
    id: 'dos-exam-words',
    kind: 'exam-words',
    title: 'Exam Terminology: Denial of Service & SYN Cookies',
    subtitle: 'Definitions and Defense Keywords for Exams',
    caption: 'Memorize these core definitions for University Network Security examinations.',
    eli5Caption: 'The exact phrasing that examiners look for in DoS/DDoS questions.',
    examWords: {
      term: 'SYN Flood & RFC 4987 SYN Cookies',
      definition: 'A Transport-layer Denial of Service attack where an attacker floods a target with TCP SYN packets to saturate the half-open backlog queue; defended by SYN Cookies, which eliminate kernel state allocation by encoding connection parameters into the 32-bit Initial Sequence Number.',
      keywords: [
        'Half-Open connection backlog',
        'RFC 4987 SYN cookies',
        'Stateless initial sequence number (ISN)',
        'Reflection and amplification factor',
        'Anycast scrubbing'
      ],
      mustRememberPoints: [
        'SYN floods exploit TCP statefulness by leaving half-open sockets in SYN_RCVD state.',
        'SYN cookies pack 5 bits of time, 3 bits of MSS, and 24 bits of keyed hash into the 32-bit ISN.',
        'Zero kernel socket memory is allocated until a valid client ACK completes the 3-way handshake.'
      ],
      typicalMarks: 5
    },
    speakerNotes: {
      script: 'Review the 5-mark structure: 1. Explain the attack (backlog saturation, half-open sockets). 2. Explain why it hurts (840 bytes memory held for 75s). 3. Explain SYN cookies (ISN bit formula, stateless operation).',
      likelyQuestions: []
    }
  }
]

export const dosDdosPresentation: TopicPresentation = {
  moduleId: 'm5',
  moduleTitle: 'M5: Network Security',
  topicId: 'dos-ddos',
  topicTitle: 'SYN Flood, DoS and DDoS Attacks',
  targetDurationMinutes: 12,
  plates: dosDdosPlates
}
