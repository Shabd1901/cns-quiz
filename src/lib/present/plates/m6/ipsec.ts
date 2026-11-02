import { Plate, TopicPresentation } from "@/lib/present/types"

export const ipsecPlates: Plate[] = [
  // 1. Hook
  {
    id: 'ipsec-hook',
    kind: 'hook',
    title: 'Encryption at the IP Layer',
    subtitle: 'From Application Silos to Transparent Network-Layer Security (RFC 4301)',
    caption: 'TLS encrypts individual application sockets; IPsec operates at the Network Layer (Layer 3), transparently securing all TCP, UDP, and ICMP traffic across entire networks without modifying a single line of application code.',
    eli5Caption: 'Building an underground bulletproof tunnel between two bank branches so every car driving between them is automatically protected.',
    speakerNotes: {
      script: 'Start by contrasting Layer 3 (IPsec) with Layer 4/7 (TLS). TLS requires each application to be coded for it (e.g. web browser using HTTPS). IPsec sits directly inside the operating system IP stack or edge router. Everything that travels across the network—legacy ERP software, internal databases, VoIP calls, ICMP pings—is transparently encrypted and authenticated.',
      likelyQuestions: [
        {
          question: 'Where is IPsec most commonly used?',
          answer: 'Site-to-Site Virtual Private Networks (VPNs) connecting branch offices to corporate headquarters, and remote-access VPN clients.'
        }
      ]
    }
  },

  // 2. Concept: The IPsec Protocol Suite
  {
    id: 'ipsec-concept',
    kind: 'concept',
    title: 'The Core Protocols: AH, ESP, and IKE',
    subtitle: 'Authentication Header vs Encapsulating Security Payload',
    caption: 'IPsec consists of three interlocking components: Authentication Header (AH) for integrity, Encapsulating Security Payload (ESP) for encryption and integrity, and Internet Key Exchange (IKEv2) for automated key negotiation.',
    eli5Caption: 'A wax seal verifying the letter is untouched (AH), a locked steel briefcase hiding the letter (ESP), and two couriers agreeing on the padlock combination (IKE).',
    customFigure: 'PacketBuilder',
    speakerNotes: {
      script: 'Use the PacketBuilder figure to highlight the two protocols: 1. Authentication Header (AH, IP Protocol 51): provides integrity and anti-replay, but ZERO encryption! Cleartext is still readable. 2. Encapsulating Security Payload (ESP, IP Protocol 50): provides confidentiality (encryption) PLUS integrity and anti-replay. Today, ESP is used in over 99% of deployments.',
      likelyQuestions: [
        {
          question: 'Why does anyone still study AH if ESP also provides integrity?',
          answer: 'AH covers parts of the outer IP header (like IP addresses) in its Integrity Check Value (ICV), whereas ESP only covers the payload and ESP headers. However, AH’s coverage makes it incompatible with Network Address Translation (NAT).'
        }
      ]
    }
  },

  // 3. Process: Transport Mode vs Tunnel Mode
  {
    id: 'ipsec-process',
    kind: 'process',
    title: 'Modes of Operation: Transport Mode vs Tunnel Mode',
    subtitle: 'Host-to-Host Communication vs Gateway-to-Gateway VPNs',
    caption: 'In Transport Mode, IPsec protects the payload while keeping the original IP header; in Tunnel Mode, the entire original IP packet is encrypted and tucked inside a brand-new outer IP header.',
    eli5Caption: 'Putting a wax seal on an envelope (Transport) vs placing the entire sealed envelope inside a larger new shipping box (Tunnel).',
    scene: {
      id: 'scene-ipsec-modes',
      title: 'Transport vs Tunnel Mode Encapsulation',
      actors: [
        { id: 'host-a', kind: 'client', label: 'Host A (192.168.1.5)', pos: { x: 80, y: 150 } },
        { id: 'gw-a', kind: 'router', label: 'VPN Gateway A (203.0.113.1)', pos: { x: 200, y: 150 } },
        { id: 'gw-b', kind: 'router', label: 'VPN Gateway B (198.51.100.2)', pos: { x: 340, y: 150 } },
        { id: 'host-b', kind: 'server', label: 'Host B (10.0.0.9)', pos: { x: 440, y: 150 } }
      ],
      objects: [
        { id: 'inner-pkt', kind: 'packet', label: 'Original IP: 192.168.1.5 -> 10.0.0.9', at: { x: 80, y: 150 } }
      ],
      steps: [
        {
          caption: 'Host A generates standard private IP packet addressed to internal Host B.',
          actions: [
            { do: 'highlight', target: ['host-a', 'inner-pkt'], tone: 'info' }
          ]
        },
        {
          caption: 'Packet reaches Gateway A. Security Policy Database (SPD) matches: Action = PROTECT (ESP Tunnel Mode).',
          actions: [
            { do: 'move', obj: 'inner-pkt', to: { x: 200, y: 150 } },
            { do: 'highlight', target: ['gw-a'], tone: 'signal' }
          ]
        },
        {
          caption: 'Gateway A encrypts the entire original packet and prepends New Outer IP Header: 203.0.113.1 -> 198.51.100.2.',
          actions: [
            { do: 'transform', obj: 'inner-pkt', into: { label: 'ESP Tunnel: [New IP] + [ESP] + [Encrypted Inner Packet]' } },
            { do: 'move', obj: 'inner-pkt', to: { x: 340, y: 150 } },
            { do: 'highlight', target: ['gw-b'], tone: 'ok' }
          ]
        },
        {
          caption: 'Gateway B decrypts ESP, extracts original private packet, and delivers it locally to Host B.',
          actions: [
            { do: 'transform', obj: 'inner-pkt', into: { label: 'Original IP: 192.168.1.5 -> 10.0.0.9' } },
            { do: 'move', obj: 'inner-pkt', to: { x: 440, y: 150 } },
            { do: 'highlight', target: ['host-b'], tone: 'ok' }
          ]
        }
      ],
      viewBox: '0 0 500 300'
    },
    speakerNotes: {
      script: 'Emphasize the architecture: Transport Mode is end-to-end between two hosts (e.g., client workstation connecting directly to a database server). Tunnel Mode is gateway-to-gateway (e.g. connecting New York office to London office). In Tunnel Mode, external eavesdroppers on the internet only see the public gateway IPs; the internal IP addresses and internal port numbers are 100% encrypted.',
      likelyQuestions: [
        {
          question: 'Can Transport Mode be used across the public internet between private subnets?',
          answer: 'No, because private RFC 1918 addresses (192.168.x.x, 10.x.x.x) are non-routable on the public internet; Tunnel Mode is required to encapsulate them inside public routable IP headers.'
        }
      ]
    }
  },

  // 4. Attack & Defense: NAT Traversal & Replay Protection
  {
    id: 'ipsec-attack-defense',
    kind: 'attack-defense',
    title: 'Vulnerability Spotlight: The NAT Dilemma & Replay Defense',
    subtitle: 'Why AH Breaks with Routers vs NAT-Traversal (NAT-T UDP 4500)',
    caption: 'Network Address Translation (NAT) alters IP headers; because AH includes IP addresses in its ICV checksum, NAT routers inadvertently break AH integrity. ESP solves this via NAT-Traversal.',
    eli5Caption: 'A security sticker that tears in half if the mail sorter changes the apartment number on the envelope.',
    attackDefense: {
      attackName: 'Replay Attacks & NAT Header Modification Failure',
      normalFlowDescription: 'IPsec encrypts packets and appends monotonically increasing 32-bit sequence numbers.',
      attackFlowDescription: 'Attacker captures IPsec frames and replays them; or a NAT router modifies the source IP address, causing an ICV verification failure.',
      defenseFlowDescription: '1. Sliding Receive Window (typically 64 packets) detects and discards replayed sequence numbers. 2. NAT-Traversal (RFC 3948) encapsulates ESP inside UDP port 4500, preserving NAT routing.'
    },
    speakerNotes: {
      script: 'Explain the NAT problem: Home routers use NAT/NAPT (Network Address Port Translation) to share a single public IP. When a packet passes through, the router rewrites the Source IP and recalculates checksums. In AH, the sender included the source IP inside the HMAC hash! When the receiver verifies the hash, it fails! In ESP, the outer IP header is excluded from the ICV, allowing NAT-T (UDP port 4500 encapsulation) to pass through home Wi-Fi routers seamlessly.',
      likelyQuestions: [
        {
          question: 'How does IPsec prevent sequence number rollover in high-speed links?',
          answer: 'Extended Sequence Numbers (ESN) expand sequence space from 32 bits to 64 bits, allowing multi-terabit transmissions without repeating numbers.'
        }
      ]
    }
  },

  // 5. Worked Example: IPsec Packet Overhead Calculation
  {
    id: 'ipsec-worked-example',
    kind: 'worked-example',
    title: 'Worked Example: IPsec Overhead & Maximum Transmission Unit (MTU)',
    subtitle: 'Calculating Packet Expansion and Preventing Fragmentation',
    caption: 'Adding IPsec headers expands packet byte size; if the total exceeds standard Ethernet MTU (1500 bytes), packets fragment, crippling network throughput.',
    eli5Caption: 'Making sure your package plus its protective bubble wrap still fits inside the standard post office mailbox.',
    workedExample: {
      problem: 'An enterprise application transmits 1,420 bytes of TCP payload (plus 20B TCP header). The VPN gateway encapsulates the packet using ESP Tunnel Mode with AES-256 (16-byte cipher block size) and HMAC-SHA-256 ICV (16 bytes). New outer IP header is 20 bytes, ESP header is 8 bytes, ESP trailer has 4 bytes plus padding. What is the total size of the encapsulated packet, and will it exceed the 1500-byte Ethernet MTU?',
      given: {
        'Original Inner IP + TCP + Payload': '20B (Inner IP) + 20B (TCP) + 1420B (Payload) = 1,460 bytes',
        'ESP Cipher Block Size (AES)': '16 bytes (requires payload + trailer to be multiple of 16)',
        'New Outer IP Header': '20 bytes',
        'ESP Header (SPI + Seq)': '8 bytes',
        'ESP Trailer Base (PadLen + NextHdr)': '2 bytes',
        'ESP ICV Authentication Tag': '16 bytes'
      },
      steps: [
        {
          label: '1. Compute Encrypted Inner Block Size',
          formula: 'DataToEncrypt = InnerIP (20) + TCP (20) + Payload (1420) = 1,460 \\text{ bytes}',
          substitution: '1,460 + 2 \\text{ (min trailer)} = 1,462 \\text{ bytes}',
          result: '1,462 bytes',
          note: 'Must be padded to the next multiple of 16 bytes (AES block size).'
        },
        {
          label: '2. Compute AES Block Padding',
          formula: 'PaddedSize = \\lceil 1,462 / 16 \\rceil \\times 16 = 92 \\times 16',
          substitution: '1,472 \\text{ bytes (10 bytes of padding added)}',
          result: '1,472 bytes',
          note: 'Padded encrypted payload = 1,472 bytes.'
        },
        {
          label: '3. Add Outer Header & ESP ICV',
          formula: 'TotalSize = OuterIP (20) + ESPHeader (8) + PaddedPayload (1472) + ESP_ICV (16)',
          substitution: '20 + 8 + 1,472 + 16',
          result: '1,516 bytes',
          note: 'Overhead = 1,516 - 1,460 = 56 bytes.'
        },
        {
          label: '4. Compare against Ethernet MTU',
          formula: 'TotalSize > 1,500 \\implies \\text{Packet Fragmentation!}',
          substitution: '1,516 > 1,500',
          result: 'EXCEEDS MTU by 16 bytes',
          note: 'Router must fragment packet into two frames, degrading VPN throughput by 50%!'
        }
      ],
      finalAnswer: 'Total packet size is 1,516 bytes, exceeding the 1,500-byte MTU by 16 bytes. Solution: Configure TCP MSS Clamping (`ip tcp adjust-mss 1360`) on the router to reduce payload size and prevent fragmentation.',
      checkVerification: 'MSS Clamp formula: Max TCP payload = 1500 - 56 (overhead) - 40 (IP/TCP) = 1,404 bytes.'
    },
    speakerNotes: {
      script: 'Highlight the practical network engineering reality: When you turn on IPsec VPNs, packet size expands by 40-70 bytes. If users send standard 1460-byte web packets, every single packet gets fragmented into two packets across the internet! The cure is TCP MSS clamping on the firewall, forcing clients to send slightly smaller packets.',
      likelyQuestions: [
        {
          question: 'What is Path MTU Discovery (PMTUD)?',
          answer: 'A technique where hosts set the Don’t Fragment (DF) bit in IP headers; if a router cannot forward without fragmenting, it returns ICMP Type 3 Code 4 (Fragmentation Needed).'
        }
      ]
    }
  },

  // 6. Comparison: AH vs ESP
  {
    id: 'ipsec-comparison',
    kind: 'compare',
    title: 'Authentication Header (AH) vs Encapsulating Security Payload (ESP)',
    subtitle: 'Choosing the Right Protocol for Network Layer Security',
    caption: 'AH provides integrity over both payload and outer IP headers but no encryption; ESP encrypts the payload and is compatible with NAT-Traversal.',
    eli5Caption: 'A transparent glass case with a tamper seal vs an opaque steel vault with an armed guard.',
    comparison: {
      leftTitle: 'Authentication Header (AH, Protocol 51)',
      rightTitle: 'Encapsulating Security Payload (ESP, Protocol 50)',
      differences: [
        {
          feature: 'Confidentiality (Encryption)',
          left: 'NONE: Payloads travel in readable cleartext',
          right: 'FULL: Encrypted via symmetric ciphers (AES-CBC / AES-GCM)',
          diffTone: 'signal'
        },
        {
          feature: 'Integrity & Authentication',
          left: 'Covers entire packet including immutable outer IP header fields',
          right: 'Covers ESP header, encrypted payload, and ESP trailer',
          diffTone: 'ok'
        },
        {
          feature: 'NAT Compatibility',
          left: 'INCOMPATIBLE: NAT address translation breaks the ICV checksum',
          right: 'COMPATIBLE: Can be encapsulated inside UDP port 4500 (NAT-T)',
          diffTone: 'ok'
        },
        {
          feature: 'Modern Enterprise Adoption',
          left: 'Near zero (< 1% of enterprise VPN deployments)',
          right: 'Dominant (> 99% of global IPsec tunnels)',
          diffTone: 'info'
        }
      ],
      summaryTakeaway: 'ESP is the universal standard for VPNs because it provides encryption, integrity, and NAT-Traversal compatibility.'
    },
    speakerNotes: {
      script: 'Summarize the comparison: AH protects the IP address itself, but breaks with NAT. ESP encrypts the payload and protects integrity, and encapsulates into UDP port 4500 to slide through home routers effortlessly.',
      likelyQuestions: []
    }
  },

  // 7. Ask The Room
  {
    id: 'ipsec-ask-the-room',
    kind: 'ask-the-room',
    title: 'Concept Check: IPsec Protocol Selection',
    subtitle: 'Confidentiality vs Integrity Guarantees',
    caption: 'Which IPsec protocol should be chosen for private communication?',
    eli5Caption: 'Which tool actually hides your secrets?',
    askTheRoom: {
      question: 'An organization needs to build a Site-to-Site VPN across the public internet between two branch offices. Which combination of IPsec protocol and mode MUST be selected to guarantee both payload confidentiality (encryption) and hiding of internal IP addresses?',
      options: [
        'Authentication Header (AH) in Transport Mode',
        'Authentication Header (AH) in Tunnel Mode',
        'Encapsulating Security Payload (ESP) in Transport Mode',
        'Encapsulating Security Payload (ESP) in Tunnel Mode'
      ],
      correctIndex: 3,
      explanation: 'To provide confidentiality (encryption), ESP must be used because AH does not encrypt payloads. To hide internal IP addresses and traverse the public internet, Tunnel Mode must be used because it encapsulates the original IP header inside a new public gateway IP header.'
    },
    speakerNotes: {
      script: 'Remind students of the 2x2 matrix: AH vs ESP on one axis, Transport vs Tunnel on the other. ESP Tunnel Mode is the correct answer for enterprise VPNs.',
      likelyQuestions: []
    }
  },

  // 8. Exam Words
  {
    id: 'ipsec-exam-words',
    kind: 'exam-words',
    title: 'Exam Terminology: IPsec Architecture',
    subtitle: 'Definitions and Database Structures for Exams',
    caption: 'Memorize these definitions for high marks on your Network Security exam paper.',
    eli5Caption: 'The exact phrasing professors look for on IPsec questions.',
    examWords: {
      term: 'IPsec Architecture (AH, ESP, SAD, SPD)',
      definition: 'A suite of open standards operating at the Network layer (Layer 3) that provides data confidentiality, integrity, origin authentication, and anti-replay protection for IP packets using two security protocols (AH and ESP) controlled by Security Associations.',
      keywords: [
        'AH (Proto 51) vs ESP (Proto 50)',
        'Transport vs Tunnel Mode',
        'Security Association (SA) & SPI (32-bit)',
        'Security Policy Database (SPD)',
        'Security Association Database (SAD)'
      ],
      mustRememberPoints: [
        'AH provides integrity and authentication but NO confidentiality; ESP provides both encryption and integrity.',
        'Transport Mode preserves original IP headers (host-to-host); Tunnel Mode encrypts the entire original IP packet (gateway-to-gateway).',
        'The SPD determines WHAT traffic to protect; the SAD stores the active cryptographic keys and algorithms indexed by the SPI.'
      ],
      typicalMarks: 5
    },
    speakerNotes: {
      script: 'Review the two critical database acronyms: SPD (Security Policy Database: rules like BYPASS, DISCARD, PROTECT) and SAD (Security Association Database: stores SPI, keys, sequence numbers, encryption algorithms). Mentioning both guarantees full marks on an IPsec architecture question.',
      likelyQuestions: []
    }
  }
]

export const ipsecPresentation: TopicPresentation = {
  moduleId: 'm6',
  moduleTitle: 'M6: Network Security Applications',
  topicId: 'ipsec',
  topicTitle: 'IPsec (AH & ESP)',
  targetDurationMinutes: 12,
  plates: ipsecPlates
}
