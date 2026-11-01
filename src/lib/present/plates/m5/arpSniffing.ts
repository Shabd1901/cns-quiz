import { Plate, TopicPresentation } from "@/lib/present/types"

export const arpSniffingPlates: Plate[] = [
  // 1. Hook
  {
    id: 'arp-hook',
    kind: 'hook',
    title: 'The Illusion of Switched Network Privacy',
    subtitle: 'From Shared Hubs to Deceptive Layer-2 Broadcasts',
    caption: 'Ethernet switches separate collision domains, but they do not authenticate Layer-2 identity; gratuitous ARP messages allow any machine on a LAN to redirect all local traffic through itself.',
    eli5Caption: 'Wearing a badge that says "I am the front desk mailman" and taking everyone’s letters before they reach the manager.',
    speakerNotes: {
      script: 'In legacy 10BASE-T networks with physical hubs, every packet broadcast to all wire ports (promiscuous mode sniffer saw everything). Switches solved collision domains by learning MAC-to-port mappings. But ARP (RFC 826) has zero authentication: any computer can broadcast "I am the router", and every device updates its cache blindly.',
      likelyQuestions: [
        {
          question: 'Does HTTPS prevent ARP spoofing?',
          answer: 'No. HTTPS encrypts the payload, but ARP spoofing still succeeds at Layer 2, allowing the attacker to intercept packets, conduct SSL stripping, or launch a denial of service.'
        }
      ]
    }
  },

  // 2. Concept: ARP Resolution Architecture
  {
    id: 'arp-concept',
    kind: 'concept',
    title: 'How ARP Maps IP Addresses to Physical Hardware',
    subtitle: 'The Translation Layer between Layer 3 and Layer 2',
    caption: 'When a host knows a destination IP but not the destination MAC, it broadcasts an ARP Request: "Who has IP 192.168.1.1? Tell 192.168.1.10." The owner unicasts an ARP Reply with its MAC.',
    eli5Caption: 'Shouting into an auditorium "Who is John?" and waiting for John to stand up with his ID badge.',
    scene: {
      id: 'scene-arp-concept',
      title: 'Normal ARP Resolution on Local Broadcast Domain',
      actors: [
        { id: 'alice', kind: 'client', label: 'Alice (192.168.1.10)', pos: { x: 80, y: 150 } },
        { id: 'switch', kind: 'switch', label: 'Layer 2 Switch', pos: { x: 250, y: 150 } },
        { id: 'gateway', kind: 'router', label: 'Gateway (192.168.1.1)', pos: { x: 420, y: 150 } }
      ],
      objects: [
        { id: 'req', kind: 'packet', label: 'ARP Who-has 192.168.1.1?', at: { x: 120, y: 150 } }
      ],
      steps: [
        {
          caption: 'Alice needs to communicate with the Gateway but has no MAC address cached in memory.',
          actions: [
            { do: 'highlight', target: ['alice', 'req'], tone: 'info' }
          ]
        },
        {
          caption: 'Alice sends a broadcast frame (FF:FF:FF:FF:FF:FF) into the switch.',
          actions: [
            { do: 'move', obj: 'req', to: { x: 250, y: 150 } }
          ]
        },
        {
          caption: 'The switch floods the request out of all connected ports.',
          actions: [
            { do: 'move', obj: 'req', to: { x: 420, y: 150 } }
          ]
        },
        {
          caption: 'The Gateway unicasts an ARP Reply containing its physical MAC address BB:BB:BB:00:00:01.',
          actions: [
            { do: 'appear', obj: { id: 'rep', kind: 'packet', label: 'ARP Reply: MAC=BB:BB:BB', at: { x: 420, y: 150 } } },
            { do: 'move', obj: 'rep', to: { x: 80, y: 150 } },
            { do: 'highlight', target: ['alice'], tone: 'ok' }
          ]
        }
      ],
      viewBox: '0 0 500 300'
    },
    speakerNotes: {
      script: 'Emphasize that the ARP request is a Layer 2 broadcast (FF:FF:FF:FF:FF:FF) while the reply is unicast directly back to Alice. Once received, Alice stores the mapping in her dynamic ARP cache, usually with a 2 to 20 minute TTL.',
      likelyQuestions: [
        {
          question: 'What is inside an ARP cache?',
          answer: 'A simple lookup table mapping IP addresses (Layer 3) to MAC addresses (Layer 2) along with interface names and expiration timestamps.'
        }
      ]
    }
  },

  // 3. Process: Gratuitous ARP Poisoning (Man-in-the-Middle)
  {
    id: 'arp-poisoning-process',
    kind: 'process',
    title: 'Bidirectional ARP Cache Poisoning',
    subtitle: 'Mallory Diverts Traffic as the Man-in-the-Middle',
    caption: 'Mallory sends unsolicited Gratuitous ARP replies telling Alice "I am the Gateway" and telling the Gateway "I am Alice". All two-way traffic now passes through Mallory.',
    eli5Caption: 'Telling both Alice and Bob that you are the other person’s courier, reading all letters before passing them along.',
    scene: {
      id: 'scene-arp-mitm',
      title: 'Mallory Infiltrates the Communication Path',
      actors: [
        { id: 'alice', kind: 'client', label: 'Alice', pos: { x: 80, y: 100 } },
        { id: 'mallory', kind: 'mallory', label: 'Mallory (Attacker)', pos: { x: 250, y: 220 } },
        { id: 'gateway', kind: 'router', label: 'Gateway Router', pos: { x: 420, y: 100 } }
      ],
      objects: [
        { id: 'p1', kind: 'packet', label: 'Poison: 192.168.1.1 is Mallory', at: { x: 250, y: 220 } },
        { id: 'p2', kind: 'packet', label: 'Poison: 192.168.1.10 is Mallory', at: { x: 250, y: 220 } }
      ],
      steps: [
        {
          caption: 'Mallory prepares two forged unsolicited ARP replies.',
          actions: [
            { do: 'highlight', target: ['mallory', 'p1', 'p2'], tone: 'bad' }
          ]
        },
        {
          caption: 'Mallory injects poison reply into Alice: "Gateway IP 192.168.1.1 has MAC EE:EE:EE (Mallory)".',
          actions: [
            { do: 'move', obj: 'p1', to: { x: 80, y: 100 } },
            { do: 'highlight', target: ['alice'], tone: 'bad' }
          ]
        },
        {
          caption: 'Mallory injects poison reply into Gateway: "Alice IP 192.168.1.10 has MAC EE:EE:EE (Mallory)".',
          actions: [
            { do: 'move', obj: 'p2', to: { x: 420, y: 100 } },
            { do: 'highlight', target: ['gateway'], tone: 'bad' }
          ]
        },
        {
          caption: 'Alice sends web traffic destined for Gateway; switch directs it straight to Mallory for eavesdropping and forwarding.',
          actions: [
            { do: 'appear', obj: { id: 'data', kind: 'packet', label: 'Alice Data -> Mallory -> Gateway', at: { x: 80, y: 100 } } },
            { do: 'move', obj: 'data', to: { x: 250, y: 220 } },
            { do: 'move', obj: 'data', to: { x: 420, y: 100 } }
          ]
        }
      ],
      viewBox: '0 0 500 320'
    },
    speakerNotes: {
      script: 'Notice why this is called bidirectional poisoning: Mallory must poison both ends. If Mallory only poisons Alice, outbound traffic is intercepted, but returning packets from the gateway go straight to Alice, breaking TCP full-duplex communication and exposing the attack.',
      likelyQuestions: [
        {
          question: 'Why does a computer accept an ARP reply if it never asked for one?',
          answer: 'RFC 826 allows Gratuitous ARP to announce IP/MAC changes dynamically (e.g., when a server replaces its network card or joins a network). Operating systems update their caches unconditionally.'
        }
      ]
    }
  },

  // 4. Attack & Defense: Dynamic ARP Inspection (DAI)
  {
    id: 'arp-attack-defense',
    kind: 'attack-defense',
    title: 'Vulnerability Spotlight: ARP Spoofing vs DAI',
    subtitle: 'Gratuitous Forgery vs Hardware Switch Port Enforcement',
    caption: 'Switches running Dynamic ARP Inspection (DAI) cross-check all ARP packets against a trusted DHCP Snooping database and drop forged MAC claims before forwarding.',
    eli5Caption: 'A security guard at the door who checks your government ID against the registered tenant list before letting you announce yourself.',
    attackDefense: {
      attackName: 'ARP Cache Poisoning / Switched Man-in-the-Middle',
      normalFlowDescription: 'Alice sends ARP query, receives true Gateway MAC BB:BB:BB, and sends frames directly to the gateway port.',
      attackFlowDescription: 'Mallory floods network with forged ARP packets claiming the Gateway IP is mapped to Mallory’s MAC EE:EE:EE.',
      defenseFlowDescription: 'Dynamic ARP Inspection (DAI) paired with DHCP Snooping: Managed switch validates that Sender IP and MAC match the trusted DHCP lease database on untrusted ports.'
    },
    speakerNotes: {
      script: 'Explain the DAI mechanism: 1. Switch enables DHCP Snooping, monitoring Layer 2 DHCP handshakes (DORA) to build a trusted binding table [MAC, IP, VLAN, Port]. 2. When DAI is turned on, any ARP packet received on an untrusted port is intercepted by the switch CPU and compared with the binding table. If Mallory claims IP 192.168.1.1 on port 4, the switch immediately drops the frame and increments an alert counter.',
      likelyQuestions: [
        {
          question: 'What happens if static IP addresses are used instead of DHCP?',
          answer: 'Network administrators must configure static ARP access lists on the switch to bind static IP-MAC pairs into the DAI database.'
        }
      ]
    }
  },

  // 5. Worked Example: MAC Address Table Flooding (CAM Overflow)
  {
    id: 'arp-worked-example',
    kind: 'worked-example',
    title: 'Worked Example: CAM Table Overflow Calculations',
    subtitle: 'Exhausting Switch Memory to Force Hub Fail-Open Mode',
    caption: 'When an attacker floods a switch with bogus MAC addresses, the Content Addressable Memory (CAM) table fills up, causing the switch to fail-open and flood all traffic like a dumb hub.',
    eli5Caption: 'Cramming a roll of names so full that the bouncer gives up and lets everyone in without checking who they are.',
    workedExample: {
      problem: 'An enterprise Catalyst switch has a CAM table capacity of 8,192 MAC entries with an aging timeout of 300 seconds. An attacker runs `macof` generating 5,000 unique spoofed MAC frames per second. How long will it take to exhaust the CAM table, and what is the steady-state packet flooding behavior?',
      given: {
        'CAM Table Maximum Entries': 8192,
        'Aging Timer (Timeout)': '300 seconds',
        'Attacker Injection Rate': '5,000 frames/sec'
      },
      steps: [
        {
          label: '1. Compute Time to Full CAM Saturation',
          formula: 'T_{saturate} = \\frac{CAM_{capacity}}{InjectionRate}',
          substitution: '\\frac{8,192}{5,000}',
          result: '1.638 seconds',
          note: 'The entire switch table is exhausted in under 2 seconds!'
        },
        {
          label: '2. Compare Injection Rate to Aging Eviction Rate',
          formula: 'EvictionRate_{max} = \\frac{8,192}{300} = 27.3 \\text{ entries/sec}',
          substitution: '5,000 \\gg 27.3',
          result: 'Sustained 100% Saturation',
          note: 'Attacker injects entries 183x faster than the aging timer can evict old entries.'
        },
        {
          label: '3. Determine Post-Saturation Switch Behavior',
          formula: 'SwitchState = \\text{Fail-Open Unicast Flooding}',
          substitution: 'CAM is full; new destination MAC lookups fail',
          result: 'Reverts to Hub Behavior',
          note: 'The switch floods all incoming frames out of every port on the VLAN.'
        }
      ],
      finalAnswer: 'The CAM table overflows in 1.64 seconds. The switch enters fail-open unicast flooding mode, allowing passive packet sniffing across all ports without needing ARP spoofing.',
      checkVerification: 'Defense: Cisco Port Security (`switchport port-security maximum 2`) shuts down the port when rogue MAC thresholds are exceeded.'
    },
    speakerNotes: {
      script: 'Contrast CAM table flooding with ARP spoofing: CAM flooding targets switch hardware memory using random MAC frames (macof tool). Once the table fills, the switch cannot look up ports and behaves like a broadcast hub. The standard defense is Port Security, which limits the number of MAC addresses learned on a single physical access port.',
      likelyQuestions: [
        {
          question: 'What is Port Security violation action?',
          answer: 'Shutdown (disables port with err-disable), Restrict (drops packet and sends SNMP trap), or Protect (silently drops excess packets).'
        }
      ]
    }
  },

  // 6. Comparison: Hub Sniffing vs Switch Sniffing
  {
    id: 'arp-comparison',
    kind: 'compare',
    title: 'Passive Hub Sniffing vs Active Switch Sniffing',
    subtitle: 'Evolution of Eavesdropping on Local Area Networks',
    caption: 'Hub sniffing requires no active packet injection; switch sniffing requires active deception (ARP spoofing or CAM table overflow).',
    eli5Caption: 'Listening to an open loudspeaker vs hacking into the private telephone exchange.',
    comparison: {
      leftTitle: 'Passive Sniffing (Hubs / Shared Media)',
      rightTitle: 'Active Sniffing (Switches)',
      differences: [
        {
          feature: 'Network Hardware',
          left: 'Legacy shared hubs or unencrypted Wi-Fi (802.11 open)',
          right: 'Modern Layer 2 / Layer 3 managed Ethernet switches',
          diffTone: 'info'
        },
        {
          feature: 'Attacker Transmission',
          left: 'Purely passive; network card in promiscuous mode sends 0 packets',
          right: 'Active packet injection (Gratuitous ARP replies or MAC flood)',
          diffTone: 'bad'
        },
        {
          feature: 'Detection Feasibility',
          left: 'Extremely difficult to detect; zero packets emitted onto wire',
          right: 'Easily detectable by IDS/DAI via duplicate MAC/IP anomalies',
          diffTone: 'ok'
        },
        {
          feature: 'Mitigation Mechanism',
          left: 'Replace hubs with switches; enable WPA3 Wi-Fi encryption',
          right: 'Dynamic ARP Inspection (DAI), Port Security, Static ARP',
          diffTone: 'signal'
        }
      ],
      summaryTakeaway: 'Switches eliminate passive sniffing by default; attackers must use active Layer 2 attacks that leave clear audit trails.'
    },
    speakerNotes: {
      script: 'Review the key distinction: In a hub, everyone sees everything passively. In a switched network, an attacker MUST generate traffic (active attack). This means tools like Arpwatch, Snort, or switch syslog can detect ARP spoofing almost instantaneously if monitoring is enabled.',
      likelyQuestions: []
    }
  },

  // 7. Ask The Room
  {
    id: 'arp-ask-the-room',
    kind: 'ask-the-room',
    title: 'Concept Check: ARP Poisoning Vulnerability',
    subtitle: 'The Flaw in RFC 826',
    caption: 'Why is ARP inherently vulnerable to cache poisoning?',
    eli5Caption: 'What is the biggest design bug in the address resolution protocol?',
    askTheRoom: {
      question: 'What fundamental architectural property of the Address Resolution Protocol (ARP) makes ARP spoofing possible?',
      options: [
        'ARP packets are encrypted with weak 56-bit DES keys',
        'ARP is stateless and does not authenticate replies, allowing hosts to accept unsolicited replies that overwrite existing cache entries',
        'ARP requires IP addresses to be registered with the United States Department of Defense',
        'ARP tables can only store up to 8 MAC addresses per network interface'
      ],
      correctIndex: 1,
      explanation: 'ARP is completely stateless and lacks cryptographic authentication or digital signatures. Operating systems accept unsolicited ARP replies (Gratuitous ARP) and immediately update their internal cache tables, trusting whatever sender MAC address was declared.'
    },
    speakerNotes: {
      script: 'Ask students to reflect on why RFC 826 did not specify authentication: In 1982, adding digital signatures to ARP packets would have made local Ethernet resolution impossibly slow on 8-bit microprocessors.',
      likelyQuestions: []
    }
  },

  // 8. Exam Words
  {
    id: 'arp-exam-words',
    kind: 'exam-words',
    title: 'Exam Terminology: ARP Spoofing & Layer-2 Security',
    subtitle: 'Definitions and Defense Keywords',
    caption: 'Key concepts frequently tested in University Network Security examinations.',
    eli5Caption: 'High-scoring definitions to write on your exam paper.',
    examWords: {
      term: 'ARP Cache Poisoning & Dynamic ARP Inspection',
      definition: 'A Layer-2 attack where an adversary broadcasts forged Gratuitous ARP replies to map a legitimate host’s IP address to the adversary’s MAC address, enabling Man-in-the-Middle traffic interception; mitigated by Dynamic ARP Inspection (DAI) on managed switches.',
      keywords: [
        'Gratuitous ARP',
        'Dynamic ARP Inspection (DAI)',
        'DHCP Snooping binding database',
        'CAM table overflow',
        'Promiscuous mode'
      ],
      mustRememberPoints: [
        'ARP has no authentication; hosts update dynamic caches upon receiving unsolicited replies.',
        'DAI intercepts ARP packets on untrusted switch ports and validates them against the DHCP snooping table.',
        'Port security mitigates CAM table flooding by enforcing a maximum MAC address threshold per port.'
      ],
      typicalMarks: 5
    },
    speakerNotes: {
      script: 'Make sure students remember both the attack (Gratuitous ARP) and the exact pair of enterprise defenses: Dynamic ARP Inspection (DAI) and DHCP Snooping. They must mention that DAI requires DHCP Snooping to provide the binding database.',
      likelyQuestions: [
        {
          question: 'Can DAI function without DHCP Snooping?',
          answer: 'Only if manual static ARP access-lists are manually entered into switch configuration for every connected host.'
        }
      ]
    }
  }
]

export const arpSniffingPresentation: TopicPresentation = {
  moduleId: 'm5',
  moduleTitle: 'M5: Network Security',
  topicId: 'arp-sniffing',
  topicTitle: 'Packet Sniffing & ARP Spoofing',
  targetDurationMinutes: 12,
  plates: arpSniffingPlates
}
