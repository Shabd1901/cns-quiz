import { Plate, TopicPresentation } from "@/lib/present/types"

export const layerVulnerabilitiesPlates: Plate[] = [
  // 1. Hook
  {
    id: 'layer-hook',
    kind: 'hook',
    title: 'A Network Built on Blind Trust',
    subtitle: 'The 1970s ARPANET Design Legacy',
    caption: 'The TCP/IP stack was created for trusted academic researchers; none of the foundational protocols (ARP, IP, ICMP, TCP, UDP) included authentication, encryption, or integrity checks.',
    eli5Caption: 'Sending postcards through the mail where anyone along the road can read your secrets, forge the return address, or alter the writing.',
    speakerNotes: {
      script: 'Start by explaining the historical context of ARPANET in the 1970s. Cerf and Kahn designed TCP/IP for resilience against physical network failures, assuming all connected nodes were benign research institutions. Consequently, IP addresses can be freely forged, ARP blindly trusts broadcast claims, TCP sequence numbers were originally predictable, and payloads travel in cleartext.',
      likelyQuestions: [
        {
          question: 'Why wasn’t cryptography designed into TCP/IP originally?',
          answer: 'In the 1970s, compute resources were too weak for symmetric or asymmetric ciphers on packet routers, and the ARPANET community was closed and mutually trusted.'
        }
      ]
    }
  },

  // 2. Concept: TCP/IP Layer Stack Vulnerabilities
  {
    id: 'layer-stack-concept',
    kind: 'concept',
    title: 'The Insecurity of the 4-Layer TCP/IP Stack',
    subtitle: 'Layer-by-Layer Attack Surfaces',
    caption: 'Every layer of the protocol stack has distinct native vulnerabilities: Link layer lacks identity, Network layer lacks authentication, Transport layer is vulnerable to desync and starvation, Application layer is vulnerable to eavesdropping.',
    eli5Caption: 'A 4-story building where every single floor was built without locks on the doors.',
    customFigure: 'StackDiagram',
    speakerNotes: {
      script: 'Walk down the stack: At Layer 4 (Application: HTTP, FTP, Telnet), credentials travel in plaintext. At Layer 3 (Transport: TCP/UDP), TCP is vulnerable to SYN floods and reset injection, while UDP is stateless and abused for DDoS reflection. At Layer 2 (Internet: IP/ICMP), IP has no source authentication so packets can be spoofed; ICMP is used for ping floods. At Layer 1 (Link: Ethernet/ARP), ARP cache poisoning and MAC spoofing allow MITM on the local LAN.',
      likelyQuestions: [
        {
          question: 'Which layer is the most critical to secure?',
          answer: 'Defense-in-depth requires security at multiple layers: Link layer (802.1X/DAI), Network layer (IPsec), Transport/App layer (TLS 1.3).'
        }
      ]
    }
  },

  // 3. Process: Cleartext Transmission vs Eavesdropping
  {
    id: 'layer-cleartext-process',
    kind: 'process',
    title: 'Cleartext Protocol Interception',
    subtitle: 'How Eve Captures Passwords in Plain Transit',
    caption: 'When legacy protocols like HTTP, Telnet, or FTP transmit data, every intermediary router and link-layer eavesdropper reads authentication headers byte-for-byte.',
    eli5Caption: 'Speaking your secret password loudly across a crowded library room.',
    scene: {
      id: 'scene-layer-cleartext',
      title: 'Packet Traversal across Untrusted Network Hop',
      actors: [
        { id: 'alice', kind: 'client', label: 'Alice (Client)', pos: { x: 80, y: 150 } },
        { id: 'router', kind: 'router', label: 'Gateway Router', pos: { x: 250, y: 150 } },
        { id: 'eve', kind: 'eve', label: 'Eve (Sniffer)', pos: { x: 250, y: 260 } },
        { id: 'server', kind: 'server', label: 'Bank Server', pos: { x: 420, y: 150 } }
      ],
      objects: [
        { id: 'pkt1', kind: 'packet', label: 'HTTP GET /login (pass=s3cret)', at: { x: 120, y: 150 } }
      ],
      steps: [
        {
          caption: 'Alice connects to the server using unencrypted HTTP on port 80.',
          actions: [
            { do: 'highlight', target: ['alice', 'pkt1'], tone: 'info' }
          ]
        },
        {
          caption: 'The packet reaches the intermediate gateway router.',
          actions: [
            { do: 'move', obj: 'pkt1', to: { x: 250, y: 150 } }
          ]
        },
        {
          caption: 'Eve runs a sniffer in promiscuous mode and duplicates the packet payload.',
          actions: [
            { do: 'appear', obj: { id: 'pkt-stolen', kind: 'packet', label: 'PASS=s3cret!', at: { x: 250, y: 220 } } },
            { do: 'highlight', target: ['eve', 'pkt-stolen'], tone: 'bad' }
          ]
        },
        {
          caption: 'The server receives the request, completely unaware that Eve copied the credentials.',
          actions: [
            { do: 'move', obj: 'pkt1', to: { x: 420, y: 150 } },
            { do: 'highlight', target: ['server'], tone: 'ok' }
          ]
        }
      ],
      viewBox: '0 0 500 320'
    },
    speakerNotes: {
      script: 'Emphasize that the server cannot tell if a cleartext packet was observed by Eve. The internet routing model passes packets through 10 to 20 autonomous system hops; any compromised transit router can tap the link without breaking packet flow.',
      likelyQuestions: [
        {
          question: 'Can end users tell if their traffic is being sniffed on a public Wi-Fi?',
          answer: 'Passive sniffing is completely invisible to the sender and receiver; only cryptographic protocols like TLS guarantee confidentiality.'
        }
      ]
    }
  },

  // 4. Attack & Defense: IP Address Spoofing
  {
    id: 'layer-attack-defense',
    kind: 'attack-defense',
    title: 'Vulnerability Spotlight: IP Spoofing vs BCP 38 Ingress Filtering',
    subtitle: 'Falsifying Header Source Addresses vs Boundary Validation',
    caption: 'Because IP headers carry an unauthenticated Source IP field, attackers send packets with arbitrary source addresses; BCP 38 ingress filtering enforces subnet boundaries.',
    eli5Caption: 'Dropping a letter in a mailbox with someone else’s name as the return address so the reply goes to them.',
    attackDefense: {
      attackName: 'Blind IP Source Address Spoofing',
      normalFlowDescription: 'Host at 192.168.1.50 sends packet with true Source IP 192.168.1.50 to destination 10.0.0.1.',
      attackFlowDescription: 'Attacker at 198.51.100.99 forges IP header with Source IP 10.0.0.5 (trusted database) to trick firewall filters or reflect responses.',
      defenseFlowDescription: 'BCP 38 (RFC 2827) Ingress Filtering on edge routers: drops any outgoing packet whose source IP does not match the customer’s allocated subnet prefix.'
    },
    speakerNotes: {
      script: 'Explain BCP 38 (Best Current Practice 38 / RFC 2827). If an Internet Service Provider (ISP) router customer interface is assigned 203.0.113.0/24, the router should drop any packet leaving that customer with a source IP outside that CIDR block. If all ISPs deployed BCP 38, spoofed DDoS reflection attacks would be virtually eliminated.',
      likelyQuestions: [
        {
          question: 'Why do IP spoofing attacks still occur if BCP 38 exists?',
          answer: 'BCP 38 requires voluntary adoption across thousands of global ISPs; transit providers often do not enforce it due to multihoming complexity or lack of regulatory mandate.'
        }
      ]
    }
  },

  // 5. Worked Example: TCP Reset Attack Window Math
  {
    id: 'layer-worked-example',
    kind: 'worked-example',
    title: 'Worked Example: TCP RST Packet Injection',
    subtitle: 'Calculating Window Boundaries for Connection Termination',
    caption: 'Under RFC 793, a TCP endpoint accepts a RST packet only if the sequence number falls within the active receive window [RCV.NXT, RCV.NXT + RCV.WND).',
    eli5Caption: 'Finding the combination to a safe: if your guess falls inside the acceptable margin of error, the safe pops open.',
    workedExample: {
      problem: 'Alice and Bob have an established TCP session. Alice expects next sequence RCV.NXT = 40,000 with receive window RCV.WND = 16,384 bytes. Mallory injects a forged TCP RST packet with spoofed Source IP=Bob, Seq = 52,000. Will the connection be terminated?',
      given: {
        'Expected Sequence (RCV.NXT)': 40000,
        'Receive Window Size (RCV.WND)': 16384,
        'Injected Packet Sequence (Seq)': 52000
      },
      steps: [
        {
          label: '1. Compute Lower Window Boundary',
          formula: 'Window_{min} = RCV.NXT',
          substitution: '40,000',
          result: '40,000',
          note: 'Packets below this have already been acknowledged and are discarded as duplicates.'
        },
        {
          label: '2. Compute Upper Window Boundary',
          formula: 'Window_{max} = RCV.NXT + RCV.WND',
          substitution: '40,000 + 16,384',
          result: '56,384',
          note: 'Packets at or above this exceed buffer capacity and are discarded.'
        },
        {
          label: '3. Test Injected Sequence Number Inclusion',
          formula: 'Window_{min} \\le Seq_{injected} < Window_{max}',
          substitution: '40,000 \\le 52,000 < 56,384',
          result: 'TRUE (In Window)',
          note: '52,000 is inside the 16,384-byte window!'
        }
      ],
      finalAnswer: 'Connection is terminated immediately. The RST packet is accepted because 52,000 falls within [40,000, 56,384).',
      checkVerification: 'Window span = 56,384 - 40,000 = 16,384. Offset = 52,000 - 40,000 = 12,000 < 16,384. Valid RST.'
    },
    speakerNotes: {
      script: 'Walk through this calculation slowly. In early TCP implementations (RFC 793), an attacker did not need the exact sequence number! With a typical 64KB window, only 65,536 blind guesses were needed to sever any connection worldwide. RFC 5961 mitigated this by requiring the sequence number to match RCV.NXT exactly before tearing down immediately.',
      likelyQuestions: [
        {
          question: 'How did RFC 5961 fix the TCP reset vulnerability?',
          answer: 'RFC 5961 requires the RST sequence number to match RCV.NXT exactly; if it falls within the window but is not exact, the receiver sends a Challenge ACK instead of terminating.'
        }
      ]
    }
  },

  // 6. Comparison: TCP vs UDP Inherent Vulnerabilities
  {
    id: 'layer-comparison',
    kind: 'compare',
    title: 'Transport Layer Security Comparison',
    subtitle: 'TCP Statefulness vs UDP Stateless Reflection Risks',
    caption: 'TCP requires state tracking and handshakes, making it vulnerable to resource exhaustion; UDP is stateless, making it the primary weapon for spoofed amplification DDoS.',
    eli5Caption: 'A formal phone call that can tie up your receptionist vs a swarm of postcards that overwhelm your mailbox.',
    comparison: {
      leftTitle: 'TCP (Transmission Control Protocol)',
      rightTitle: 'UDP (User Datagram Protocol)',
      differences: [
        {
          feature: 'Connection Paradigm',
          left: 'Connection-oriented (SYN, SYN-ACK, ACK 3-way handshake)',
          right: 'Connectionless (stateless fire-and-forget datagrams)',
          diffTone: 'info'
        },
        {
          feature: 'Source IP Verification',
          left: 'Validated during handshake (server replies to client ISN)',
          right: 'Zero validation; source IP is trivially spoofed',
          diffTone: 'bad'
        },
        {
          feature: 'Primary Attack Vector',
          left: 'SYN Flood (exhausts OS socket backlog queues) & RST injection',
          right: 'Reflection / Amplification DDoS (NTP, DNS, Memcached)',
          diffTone: 'signal'
        },
        {
          feature: 'State Overhead',
          left: 'Requires ~840 bytes memory per half-open connection',
          right: 'Zero server connection state stored in kernel',
          diffTone: 'ok'
        }
      ],
      summaryTakeaway: 'TCP attacks target receiver state (memory & CPU starvation); UDP attacks abuse statelessness to overwhelm victim bandwidth (link saturation).'
    },
    speakerNotes: {
      script: 'Highlight the fundamental design tradeoff: TCP provides reliability, ordering, and flow control at the cost of state maintenance. Attackers exploit TCP statefulness with SYN floods. UDP avoids state, but because servers never verify who sent the request, attackers spoof victim IPs to bounce multi-gigabit traffic.',
      likelyQuestions: [
        {
          question: 'Can you spoof an IP address during a TCP connection?',
          answer: 'You can spoof the initial SYN, but you will not receive the server’s SYN-ACK; unless you can predict the server’s ISN, the handshake cannot complete.'
        }
      ]
    }
  },

  // 7. Ask The Room
  {
    id: 'layer-ask-the-room',
    kind: 'ask-the-room',
    title: 'Concept Check: Protocol Layer Vulnerabilities',
    subtitle: 'Identifying the Root Vulnerability',
    caption: 'Test your understanding of the TCP/IP architectural limitations.',
    eli5Caption: 'Which layer of the postal service failed here?',
    askTheRoom: {
      question: 'Why are UDP protocols (such as DNS, NTP, and SNMP) predominantly exploited for reflection and amplification DDoS attacks rather than TCP?',
      options: [
        'UDP packets have larger default header sizes than TCP packets',
        'UDP is stateless and does not perform a handshake to verify the sender’s source IP address before replying',
        'TCP firewalls automatically block all encrypted traffic',
        'UDP routers reject all incoming packets from external networks'
      ],
      correctIndex: 1,
      explanation: 'Because UDP is connectionless and does not verify the source address via a handshake, a server immediately sends large responses to whatever IP address was placed in the UDP packet header. Attackers place the victim’s IP in the source field, causing massive reflection.'
    },
    speakerNotes: {
      script: 'Give students 30 seconds to vote. Make sure they understand that in TCP, the server replies with SYN-ACK to the source IP. If the IP was spoofed to a random victim, the victim receives a SYN-ACK, replies with RST, and the attack terminates without application data.',
      likelyQuestions: []
    }
  },

  // 8. Exam Words
  {
    id: 'layer-exam-words',
    kind: 'exam-words',
    title: 'Exam Terminology: TCP/IP Security Architecture',
    subtitle: 'Standard University Definition & Keywords',
    caption: 'Memorize these foundational networking security concepts for university examinations.',
    eli5Caption: 'The exact definitions that professors look for when grading written exams.',
    examWords: {
      term: 'TCP/IP Layer Vulnerability Matrix',
      definition: 'The systemic security weaknesses inherent in the four layers of the Internet Protocol suite caused by the historical absence of native cryptographic authentication, confidentiality, and integrity mechanisms.',
      keywords: [
        'ARPANET trust model',
        'IP spoofing',
        'Stateless protocol reflection',
        'BCP 38 ingress filtering',
        'Receive window exhaustion'
      ],
      mustRememberPoints: [
        'Network layer (IP) provides no source authentication, enabling arbitrary address spoofing.',
        'Transport layer (TCP) maintains state tables that are vulnerable to SYN flood queue starvation.',
        'BCP 38 / RFC 2827 ingress filtering prevents spoofed traffic at the customer network boundary.'
      ],
      typicalMarks: 5
    },
    speakerNotes: {
      script: 'Advise students to structure their 5-mark exam answers using a layer-by-layer breakdown: Link (ARP poisoning), Internet (IP spoofing, ICMP flooding), Transport (SYN flood, RST injection), Application (cleartext interception). Mentioning BCP 38 guarantees full marks.',
      likelyQuestions: [
        {
          question: 'What is the full form of BCP in networking?',
          answer: 'Best Current Practice (RFC publication category defining operational standards).'
        }
      ]
    }
  }
]

export const layerVulnerabilitiesPresentation: TopicPresentation = {
  moduleId: 'm5',
  moduleTitle: 'M5: Network Security',
  topicId: 'layer-vulnerabilities',
  topicTitle: 'TCP/IP Layer-Wise Vulnerabilities',
  targetDurationMinutes: 12,
  plates: layerVulnerabilitiesPlates
}
