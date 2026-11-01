import { Plate, TopicPresentation } from "@/lib/present/types"

export const firewallsPlates: Plate[] = [
  // 1. Hook
  {
    id: 'fw-hook',
    kind: 'hook',
    title: 'The Gatekeeper of the Network Perimeter',
    subtitle: 'From Static Packet Filters to Deep Stateful Inspection',
    caption: 'A firewall is a network security device that monitors and filters incoming and outgoing traffic based on an organization’s previously established security policies.',
    eli5Caption: 'A castle security checkpoint that checks everyone’s passport and travel permits before letting them through the castle gate.',
    speakerNotes: {
      script: 'Introduce the firewall as the fundamental perimeter security barrier. First developed in the late 1980s as simple router packet filters, firewalls have evolved through three generations: 1st gen stateless packet filters, 2nd gen stateful inspection firewalls (Check Point 1994), and 3rd gen Next-Generation Firewalls (NGFW / WAF) that inspect full Layer 7 application protocols.',
      likelyQuestions: [
        {
          question: 'Can a firewall protect against inside threats?',
          answer: 'Traditional perimeter firewalls only inspect traffic crossing network boundaries; they are blind to lateral movement within the same internal LAN segment unless microsegmentation is deployed.'
        }
      ]
    }
  },

  // 2. Concept: Firewall Generations & Architecture
  {
    id: 'fw-concept',
    kind: 'concept',
    title: 'The Evolution of Firewall Architectures',
    subtitle: 'Packet Filters, Stateful Engines, and DMZ Bastions',
    caption: 'Network topologies segregate trust zones: Untrusted WAN (Internet), Semi-trusted DMZ (Web/Mail bastions), and Trusted Internal LAN. Firewalls enforce strict cross-zone routing rules.',
    eli5Caption: 'Dividing your house into an open front porch (DMZ) where delivery couriers drop packages, and private locked bedrooms (LAN).',
    customFigure: 'TopologyDiagram',
    speakerNotes: {
      script: 'Use the interactive TopologyDiagram to explore the network zones: The Demilitarized Zone (DMZ) houses public-facing web and mail servers. If a hacker exploits a vulnerability in Apache on the DMZ web server, the firewall strictly forbids the DMZ server from initiating any connections into the internal LAN database, containing the breach.',
      likelyQuestions: [
        {
          question: 'What is a Dual-Homed or Multi-Homed Bastion Host?',
          answer: 'A hardened server located in the DMZ with two or more physical network interfaces connecting to separate isolated subnets, preventing direct packet bridging.'
        }
      ]
    }
  },

  // 3. Process: Stateful Inspection & Connection Tracking (Conntrack)
  {
    id: 'fw-process',
    kind: 'process',
    title: 'Stateful Inspection & The Conntrack Table',
    subtitle: 'How Outbound Requests Dynamically Open Inbound Returns',
    caption: 'When an internal client connects to an external web server, the stateful firewall creates a temporary entry in its connection table (`conntrack`), automatically allowing matching return packets without opening a static inbound hole.',
    eli5Caption: 'Writing down who left the house to go shopping so the security guard recognizes them when they come back home with groceries.',
    scene: {
      id: 'scene-stateful-fw',
      title: 'Stateful Connection Tracking Sequence',
      actors: [
        { id: 'client', kind: 'alice', label: 'Internal Client (192.168.1.50)', pos: { x: 80, y: 150 } },
        { id: 'fw', kind: 'firewall', label: 'Stateful Firewall', pos: { x: 250, y: 150 } },
        { id: 'server', kind: 'server', label: 'Public Web (10.0.0.5:80)', pos: { x: 420, y: 150 } }
      ],
      objects: [
        { id: 'syn', kind: 'packet', label: 'TCP SYN (Outbound)', at: { x: 120, y: 150 } }
      ],
      steps: [
        {
          caption: 'Internal client initiates outbound connection: TCP SYN to Port 80.',
          actions: [
            { do: 'highlight', target: ['client', 'syn'], tone: 'info' }
          ]
        },
        {
          caption: 'Firewall permits outbound request and logs dynamic session entry into Conntrack Table: State=NEW.',
          actions: [
            { do: 'move', obj: 'syn', to: { x: 250, y: 150 } },
            { do: 'highlight', target: ['fw'], tone: 'ok' },
            { do: 'move', obj: 'syn', to: { x: 420, y: 150 } }
          ]
        },
        {
          caption: 'Public server replies with SYN-ACK to client ephemeral port 54321.',
          actions: [
            { do: 'appear', obj: { id: 'synack', kind: 'packet', label: 'TCP SYN-ACK (Return)', at: { x: 420, y: 150 } } },
            { do: 'move', obj: 'synack', to: { x: 250, y: 150 } }
          ]
        },
        {
          caption: 'Firewall matches return packet against Conntrack table: State=ESTABLISHED! Automatically permitted through to client.',
          actions: [
            { do: 'move', obj: 'synack', to: { x: 80, y: 150 } },
            { do: 'highlight', target: ['client'], tone: 'ok' }
          ]
        }
      ],
      viewBox: '0 0 500 300'
    },
    speakerNotes: {
      script: 'Walk through why stateful inspection was a massive breakthrough over stateless filters. In a stateless firewall, to allow web browsing, the admin had to allow all inbound packets with destination port > 1023! Attackers could easily penetrate the network by sending crafted packets to high ports. A stateful firewall tracks four states: NEW, ESTABLISHED, RELATED, and INVALID, admitting return packets only for genuine active sessions.',
      likelyQuestions: [
        {
          question: 'What is the RELATED state in Netfilter/iptables?',
          answer: 'Connections that are associated with an active session but on a different port or protocol, such as FTP data channel connections (port 20) spawned by an FTP control session (port 21).'
        }
      ]
    }
  },

  // 4. Attack & Defense: Stateless Filter Bypass vs Stateful Inspection
  {
    id: 'fw-attack-defense',
    kind: 'attack-defense',
    title: 'Vulnerability Spotlight: Stateless ACK Scan vs Stateful Inspection',
    subtitle: 'Exploiting Blind Flag Matching vs Tracking Real Session State',
    caption: 'Stateless firewalls often let ACK packets pass to permit return traffic; attackers exploit this with ACK scans to map internal networks. Stateful firewalls drop unsolicited ACKs immediately.',
    eli5Caption: 'Claiming "I was just returning from the bathroom" when you never actually walked inside in the first place.',
    attackDefense: {
      attackName: 'Stateless Firewall ACK Bypass & Reconnaissance',
      normalFlowDescription: 'Outbound TCP request is answered by server with ACK flag set; stateless rule allows all packets with ACK flag=1.',
      attackFlowDescription: 'Attacker sends unsolicited TCP ACK packets directly into internal network; stateless rule blindly forwards them because ACK bit is set.',
      defenseFlowDescription: 'Stateful Connection Tracking: Firewall drops any packet with ACK flag if no corresponding entry exists in the local conntrack session table.'
    },
    speakerNotes: {
      script: 'Explain the classic "established" rule bug: Legacy stateless filters used rules like `iptables -A INPUT -p tcp --tcp-flags ACK ACK -j ACCEPT`. Attackers immediately realized that if they set the ACK flag on any probe, the firewall let it pass! A stateful firewall replaces flag checks with true dynamic table state lookup.',
      likelyQuestions: [
        {
          question: 'What error does a target return when hit by an unsolicited ACK?',
          answer: 'The target operating system sees an ACK for a connection it knows nothing about and returns a TCP RST packet.'
        }
      ]
    }
  },

  // 5. Worked Example: Top-Down Access Control List (ACL) Processing
  {
    id: 'fw-worked-example',
    kind: 'worked-example',
    title: 'Worked Example: Access Control List (ACL) Evaluation',
    subtitle: 'First-Match-Wins Rule Evaluation Order',
    caption: 'Firewall rules are evaluated in strict top-down sequential order; the very first rule matching the packet 5-tuple determines the action. If no rule matches, the Default Implicit Deny drops the packet.',
    eli5Caption: 'Reading a checklist from item 1 to item 10: as soon as one rule says yes or no, you stop reading the rest of the list.',
    workedExample: {
      problem: 'A stateless packet filtering firewall has the following ordered ruleset:\n1. ALLOW TCP 192.168.1.0/24:ANY -> ANY:80\n2. DROP TCP ANY:ANY -> 10.0.0.5:22\n3. ALLOW TCP ANY:ANY -> 10.0.0.5:ANY\n4. DROP ALL ANY:ANY -> ANY:ANY (Implicit Deny)\nDetermine the fate of: Packet A: TCP 192.168.1.100:45000 -> 10.0.0.5:80. Packet B: TCP 198.51.100.22:33000 -> 10.0.0.5:22. Packet C: UDP 192.168.1.50:53 -> 8.8.8.8:53.',
      given: {
        'Rule 1': 'ALLOW TCP 192.168.1.0/24:* -> *:80',
        'Rule 2': 'DROP TCP *:* -> 10.0.0.5:22',
        'Rule 3': 'ALLOW TCP *:* -> 10.0.0.5:*',
        'Default Rule 4': 'DROP ALL *:* -> *:*'
      },
      steps: [
        {
          label: '1. Evaluate Packet A (TCP 192.168.1.100 -> 10.0.0.5:80)',
          formula: 'Test Rule 1: Protocol=TCP, Src in 192.168.1.0/24, DstPort=80',
          substitution: '192.168.1.100 matches /24; Port 80 matches Rule 1',
          result: 'MATCH Rule 1 -> ALLOWED',
          note: 'Processing stops immediately at Rule 1. Packet is forwarded.'
        },
        {
          label: '2. Evaluate Packet B (TCP 198.51.100.22 -> 10.0.0.5:22)',
          formula: 'Test Rule 1 (Fails, DstPort=22 != 80). Test Rule 2: Protocol=TCP, Dst=10.0.0.5, DstPort=22',
          substitution: 'Matches Rule 2',
          result: 'MATCH Rule 2 -> DROPPED',
          note: 'Notice: Even though Rule 3 allows ANY port to 10.0.0.5, Rule 2 matches first and drops SSH!'
        },
        {
          label: '3. Evaluate Packet C (UDP 192.168.1.50 -> 8.8.8.8:53)',
          formula: 'Test Rules 1-3 (All require TCP, packet is UDP). Drop through to Rule 4',
          substitution: 'Fails rules 1, 2, 3; triggers Rule 4 (Default Implicit Deny)',
          result: 'MATCH Rule 4 -> DROPPED',
          note: 'UDP packet dropped because no rule explicitly permitted UDP outbound.'
        }
      ],
      finalAnswer: 'Packet A is ALLOWED by Rule 1. Packet B is DROPPED by Rule 2. Packet C is DROPPED by Default Rule 4.',
      checkVerification: 'Rule shadowing warning: If Rule 3 were placed before Rule 2, Rule 2 would NEVER execute (shadowed rule flaw).'
    },
    speakerNotes: {
      script: 'Point out the critical vulnerability of Rule Shadowing: If a junior admin puts a broad ALLOW rule before a specific DENY rule, the DENY rule is completely neutralized. Emphasize the principle of Least Privilege and the mandatory Implicit Deny at the end of every firewall configuration.',
      likelyQuestions: [
        {
          question: 'What is rule shadowing in firewall administration?',
          answer: 'When a broader rule earlier in the sequence matches all traffic that a later, more specific rule was intended to catch, rendering the later rule dead code.'
        }
      ]
    }
  },

  // 6. Comparison: Stateless vs Stateful vs Proxy Firewalls
  {
    id: 'fw-comparison',
    kind: 'compare',
    title: 'Firewall Technology Comparison',
    subtitle: 'Packet Filtering vs Stateful Inspection vs Application Layer Proxies',
    caption: 'Each generation of firewall operates at a higher OSI layer with greater inspection fidelity, accompanied by increased processing overhead.',
    eli5Caption: 'Looking at an envelope address vs checking if a letter belongs to an ongoing mail chain vs opening the letter and reading the text.',
    comparison: {
      leftTitle: 'Stateless Packet Filter (1st Gen)',
      rightTitle: 'Stateful Inspection (2nd Gen)',
      differences: [
        {
          feature: 'OSI Operating Layer',
          left: 'Layer 3 (Network) & Layer 4 (Transport headers only)',
          right: 'Layer 3, Layer 4 + Dynamic State Connection Tracking Table',
          diffTone: 'info'
        },
        {
          feature: 'Return Traffic Handling',
          left: 'Requires static high-port hole (e.g. allow all ports > 1023)',
          right: 'Automatically opens dynamic return pinhole for ESTABLISHED sessions',
          diffTone: 'ok'
        },
        {
          feature: 'Memory Overhead',
          left: 'Zero state memory (evaluates each packet in isolation)',
          right: 'Moderate: maintains state entry for every active session',
          diffTone: 'signal'
        },
        {
          feature: 'Vulnerability to State Exhaustion',
          left: 'Immune to state table overflow attacks',
          right: 'Vulnerable to state table saturation (Conntrack table full DoS)',
          diffTone: 'bad'
        }
      ],
      summaryTakeaway: 'Stateful firewalls provide vastly superior security by tracking real handshakes, but require state table sizing to survive volumetric floods.'
    },
    speakerNotes: {
      script: 'Summarize the three tiers: 1. Stateless (fastest, dumbest). 2. Stateful (gold standard for L3/L4 routing). 3. Application Proxy / WAF (terminates TCP connection, inspects HTTP payloads, SQL injection, XSS).',
      likelyQuestions: []
    }
  },

  // 7. Ask The Room
  {
    id: 'fw-ask-the-room',
    kind: 'ask-the-room',
    title: 'Concept Check: Stateful Firewall Capabilities',
    subtitle: 'Understanding Dynamic Pinholes',
    caption: 'How does stateful inspection handle inbound return packets?',
    eli5Caption: 'Why don’t you have to leave your front door unlocked to get web pages?',
    askTheRoom: {
      question: 'Why does a stateful inspection firewall NOT require an administrator to open inbound firewall ports for internal clients to browse external websites?',
      options: [
        'Web browsing always bypasses firewalls using unmonitored UDP broadcast tunnels',
        'The firewall detects the outbound SYN request, creates an entry in its dynamic state table, and automatically permits matching inbound return packets belonging to that ESTABLISHED session',
        'Web servers automatically hack the firewall and temporarily delete incoming filter rules',
        'Browsers use asymmetric encryption to prevent firewalls from seeing destination port numbers'
      ],
      correctIndex: 1,
      explanation: 'A stateful firewall tracks the entire lifecycle of TCP sessions. When an internal client initiates an outbound connection, the firewall records the 5-tuple in its state table. When the external server responds, the firewall matches the incoming packet to the existing state table entry and automatically permits it.'
    },
    speakerNotes: {
      script: 'Make sure all students appreciate this concept: Without state tracking, internet browsing would be insecure because administrators would have to open all incoming ports above 1024 to accept server replies.',
      likelyQuestions: []
    }
  },

  // 8. Exam Words
  {
    id: 'fw-exam-words',
    kind: 'exam-words',
    title: 'Exam Terminology: Firewall Technologies',
    subtitle: 'Core Terms and Definitions for Exams',
    caption: 'Key concepts tested in University Network Security examinations.',
    eli5Caption: 'High-scoring definitions to write on your exam paper.',
    examWords: {
      term: 'Stateful Inspection & DMZ Bastion Architecture',
      definition: 'A firewall mechanism that tracks the operational state of active transport layer sessions using a dynamic connection table (conntrack) to permit valid return traffic while enforcing perimeter boundary isolation between WAN, DMZ, and internal LAN segments.',
      keywords: [
        'Conntrack table',
        'Default Deny (Implicit Deny)',
        'First-Match-Wins evaluation',
        'Demilitarized Zone (DMZ)',
        'Rule shadowing'
      ],
      mustRememberPoints: [
        'Firewalls evaluate rules sequentially top-to-bottom; first match determines the packet outcome.',
        'Stateful firewalls maintain connection states: NEW, ESTABLISHED, RELATED, and INVALID.',
        'DMZ policies must strictly prohibit compromised DMZ bastions from initiating connections into the internal LAN.'
      ],
      typicalMarks: 5
    },
    speakerNotes: {
      script: 'Review the 5-mark answer structure: 1. Define stateful inspection vs stateless packet filtering. 2. Explain the 5-tuple matching criteria. 3. Detail the DMZ 3-zone architecture (WAN, DMZ, LAN) and the strict rule that DMZ hosts cannot initiate connections into the LAN.',
      likelyQuestions: []
    }
  }
]

export const firewallsPresentation: TopicPresentation = {
  moduleId: 'm5',
  moduleTitle: 'M5: Network Security',
  topicId: 'firewalls',
  topicTitle: 'Firewall Technologies',
  targetDurationMinutes: 12,
  plates: firewallsPlates
}
