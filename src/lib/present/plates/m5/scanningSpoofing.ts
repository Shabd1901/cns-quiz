import { Plate, TopicPresentation } from "@/lib/present/types"

export const scanningSpoofingPlates: Plate[] = [
  // 1. Hook
  {
    id: 'scan-hook',
    kind: 'hook',
    title: 'Knocking on Every Digital Door',
    subtitle: 'Reconnaissance: The Precursor to Every Cyber Attack',
    caption: 'Before an adversary can exploit a target, they must map the target’s network perimeter, identifying listening services, open ports, and operating system kernels.',
    eli5Caption: 'Jiggling the door handles of every home in a neighborhood to see which ones are left unlocked.',
    speakerNotes: {
      script: 'Start by highlighting Sun Tzu: "Know your enemy". In computer security, reconnaissance represents phase 1 of the Cyber Kill Chain. Attackers scan TCP and UDP ports (0 to 65535) to find services like Apache, OpenSSH, or MySQL. Different scan types manipulate TCP flags to evade firewall detection and minimize forensic log footprints.',
      likelyQuestions: [
        {
          question: 'Is port scanning illegal?',
          answer: 'In many jurisdictions, unauthorized port scanning is viewed as suspicious or civil trespass; in others, it is considered equivalent to checking a lock, but unauthorized access following a scan is strictly illegal.'
        }
      ]
    }
  },

  // 2. Concept: Port Scanning Taxonomy
  {
    id: 'scan-concept',
    kind: 'concept',
    title: 'The Spectrum of Port Scanning Techniques',
    subtitle: 'Manipulating TCP Flags and Operating System Responses',
    caption: 'Scanners vary from overt (TCP Connect) to stealthy (SYN Half-Open) to exotic RFC 793 violations (FIN, NULL, Xmas) that slip past stateless packet filters.',
    eli5Caption: 'Different ways of whispering or shouting down a hallway to see if someone answers from an open door.',
    customFigure: 'PacketBuilder',
    speakerNotes: {
      script: 'Use the PacketBuilder figure to show students how TCP flags (SYN, ACK, FIN, RST, PSH, URG) are toggled. In a TCP Connect scan (-sT), the OS kernel completes the full 3-way handshake. In a SYN scan (-sS), the scanner sends RST before completing the handshake. In FIN, NULL, and Xmas scans, unexpected flag combinations exploit RFC 793 rules.',
      likelyQuestions: [
        {
          question: 'Why are Xmas scans named after Christmas?',
          answer: 'Because the FIN, PSH, and URG flags are all set simultaneously, making the control bits "light up like a Christmas tree" in packet hex viewers.'
        }
      ]
    }
  },

  // 3. Process: SYN Stealth vs Connect Scan
  {
    id: 'scan-process',
    kind: 'process',
    title: 'SYN Half-Open Stealth Scan',
    subtitle: 'Eradicating Application-Layer Connection Logs',
    caption: 'By sending a RST immediately upon receiving a SYN-ACK, the scanner prevents the operating system from completing the socket handshake, avoiding application-level audit logs.',
    eli5Caption: 'Ringing the doorbell, hearing someone walking toward the door, and running away before they open it.',
    scene: {
      id: 'scene-syn-scan',
      title: 'SYN Half-Open Scan Sequence',
      actors: [
        { id: 'scanner', kind: 'client', label: 'Nmap Scanner', pos: { x: 80, y: 150 } },
        { id: 'firewall', kind: 'firewall', label: 'Firewall', pos: { x: 250, y: 150 } },
        { id: 'target', kind: 'server', label: 'Web Server (Port 80)', pos: { x: 420, y: 150 } }
      ],
      objects: [
        { id: 'p-syn', kind: 'packet', label: 'TCP SYN (Port 80)', at: { x: 120, y: 150 } }
      ],
      steps: [
        {
          caption: 'Scanner sends raw TCP SYN packet to target port 80.',
          actions: [
            { do: 'highlight', target: ['scanner', 'p-syn'], tone: 'info' }
          ]
        },
        {
          caption: 'Firewall permits SYN packet through to the listening web daemon.',
          actions: [
            { do: 'move', obj: 'p-syn', to: { x: 420, y: 150 } },
            { do: 'highlight', target: ['target'], tone: 'info' }
          ]
        },
        {
          caption: 'Target acknowledges listening port with SYN-ACK: Port 80 is confirmed OPEN!',
          actions: [
            { do: 'appear', obj: { id: 'p-synack', kind: 'packet', label: 'TCP SYN-ACK', at: { x: 420, y: 150 } } },
            { do: 'move', obj: 'p-synack', to: { x: 80, y: 150 } },
            { do: 'highlight', target: ['scanner'], tone: 'ok' }
          ]
        },
        {
          caption: 'Scanner immediately tears down connection with RST before accept() is called by the application.',
          actions: [
            { do: 'appear', obj: { id: 'p-rst', kind: 'packet', label: 'TCP RST (Tear Down)', at: { x: 80, y: 150 } } },
            { do: 'move', obj: 'p-rst', to: { x: 420, y: 150 } },
            { do: 'highlight', target: ['target'], tone: 'bad' }
          ]
        }
      ],
      viewBox: '0 0 500 300'
    },
    speakerNotes: {
      script: 'Walk through the kernel mechanics: The server’s kernel responds to the SYN with SYN-ACK and places the socket in the SYN_RCVD backlog queue. In a normal connect scan, the scanner sends ACK, moving the socket into ESTABLISHED, which triggers the accept() system call and creates an entry in Apache/Nginx access logs. In a SYN scan, sending RST aborts the socket before accept() is ever triggered, leaving zero log footprint in traditional web server logs.',
      likelyQuestions: [
        {
          question: 'Do modern firewalls and IDSes detect SYN scans?',
          answer: 'Yes! Modern IDSes like Snort and Zeek track half-open connection rates and readily flag SYN scans; the term "stealth" is largely historical relative to application logging.'
        }
      ]
    }
  },

  // 4. Attack & Defense: Decoy Scanning & IP Spoofing
  {
    id: 'scan-attack-defense',
    kind: 'attack-defense',
    title: 'Vulnerability Spotlight: Nmap Decoys vs Threat Intel',
    subtitle: 'Concealing the True Attacker among Benign Targets',
    caption: 'Attackers generate decoy scans (-D RND:10) where hundreds of spoofed IPs probe the target simultaneously alongside the real attacker, overwhelming security teams.',
    eli5Caption: 'Throwing 10 red herring darts at a dartboard at the same time so nobody knows which one was yours.',
    attackDefense: {
      attackName: 'Decoy Port Scanning & Multi-Source Obfuscation',
      normalFlowDescription: 'Attacker at IP 198.51.100.42 scans target, leaving a single distinct source IP in network firewall alert logs.',
      attackFlowDescription: 'Attacker specifies `-D 8.8.8.8,1.1.1.1,ME,9.9.9.9`; the target receives identical probes from Google, Cloudflare, Quad9, and the attacker, hiding the true source.',
      defenseFlowDescription: 'Stateful firewall connection tracking combined with reverse routing path verification (uRPF) and threat intelligence correlation.'
    },
    speakerNotes: {
      script: 'Explain Nmap’s decoy feature (`nmap -D RND:10 target`). The scanner forges 10 arbitrary source IPs (even belonging to banks or universities) and sends probes from each in interleaved fashion. The target IDS logs 11 different scan sources. The administrator cannot easily tell which one is the real attacker without examining return traffic paths.',
      likelyQuestions: [
        {
          question: 'Can decoy scanning be used for TCP Connect scans?',
          answer: 'No! Decoy scanning only works with raw SYN scans or stateless scans where the attacker does not need to receive the server’s return packets on the spoofed decoy addresses.'
        }
      ]
    }
  },

  // 5. Worked Example: RFC 793 Inverse Scan Rule
  {
    id: 'scan-worked-example',
    kind: 'worked-example',
    title: 'Worked Example: Inverse TCP Scanning (RFC 793)',
    subtitle: 'Determining Port State from Closed vs Open Port Responses',
    caption: 'Under RFC 793, any incoming packet that does NOT have the SYN, RST, or ACK flags set must elicit a RST packet if the destination port is CLOSED, but must be silently DROPPED if OPEN.',
    eli5Caption: 'A rule that says: only slam the door shut if your room is locked; if your door is unlocked, do not make a sound.',
    workedExample: {
      problem: 'An analyst runs an Nmap Xmas Scan (`nmap -sX target`) against ports 21, 22, and 80. Port 21 is CLOSED, Port 22 is OPEN, and Port 80 is protected by a stateless firewall dropping non-SYN packets. What does the scanner observe and report for each port?',
      given: {
        'Probe Packet Flags': 'FIN + PSH + URG (Xmas)',
        'Port 21 State': 'CLOSED',
        'Port 22 State': 'OPEN',
        'Port 80 State': 'FILTERED (Firewall)'
      },
      steps: [
        {
          label: '1. Evaluate Port 21 (CLOSED)',
          formula: 'RFC 793: \\text{Closed port receives non-RST segment} \\rightarrow \\text{Send RST}',
          substitution: 'Port 21 is closed; kernel generates RST packet',
          result: 'RST Received -> Status: CLOSED',
          note: 'Target kernel actively rejects the Xmas packet with a reset frame.'
        },
        {
          label: '2. Evaluate Port 22 (OPEN)',
          formula: 'RFC 793: \\text{Open port receives unsolicited non-SYN/ACK/RST} \\rightarrow \\text{Discard segment silently}',
          substitution: 'Port 22 is open; kernel drops Xmas frame without sending any reply',
          result: 'NO RESPONSE -> Status: OPEN|FILTERED',
          note: 'Because no packet came back, scanner knows it is either open or dropped by a firewall.'
        },
        {
          label: '3. Evaluate Port 80 (FILTERED)',
          formula: 'Firewall Rule: \\text{Drop non-SYN incoming packet} \\rightarrow \\text{Discard silently}',
          substitution: 'Firewall drops packet; scanner receives no response',
          result: 'NO RESPONSE -> Status: OPEN|FILTERED',
          note: 'Notice: Open port and Firewall Filtered look identical to an inverse scanner!'
        }
      ],
      finalAnswer: 'Port 21 is identified as CLOSED (RST received). Ports 22 and 80 are both reported as OPEN|FILTERED because neither generates a response packet.',
      checkVerification: 'Windows OS violation: Microsoft TCP stacks send RST for all Xmas packets regardless of open/closed status, rendering Xmas scans ineffective against Windows.'
    },
    speakerNotes: {
      script: 'Emphasize the nuance of Inverse Scanning (FIN, NULL, Xmas). The beauty of these scans is that legacy stateless firewalls only blocked packets with the SYN flag set. Because FIN/NULL/Xmas have no SYN flag, they traversed the firewall unimpeded. The limitation is that they cannot distinguish an open port from a filtered port, and Windows stacks violate RFC 793.',
      likelyQuestions: [
        {
          question: 'Why does Windows send RST for open ports on Xmas scan?',
          answer: 'Microsoft chose a defensive implementation: rather than silently dropping unexpected flag combinations, the Windows TCP/IP stack resets all irregular connections.'
        }
      ]
    }
  },

  // 6. Comparison: Connect Scan vs SYN Scan vs Inverse Scan
  {
    id: 'scan-comparison',
    kind: 'compare',
    title: 'Port Scanning Methodology Comparison',
    subtitle: 'Comparing Overhead, Privileges, and Detection Surface',
    caption: 'Choosing a scanning technique requires balancing raw socket privileges against detection risk and operating system compatibility.',
    eli5Caption: 'Walking up to the door and shaking hands vs tapping on the window vs peeking through a crack in the blinds.',
    comparison: {
      leftTitle: 'TCP Connect (-sT)',
      rightTitle: 'TCP SYN Stealth (-sS)',
      differences: [
        {
          feature: 'Handshake Completion',
          left: 'Full 3-way handshake (SYN, SYN-ACK, ACK, FIN)',
          right: 'Half-open (SYN, SYN-ACK, RST)',
          diffTone: 'info'
        },
        {
          feature: 'Privileges Required',
          left: 'Unprivileged user (standard connect() OS socket call)',
          right: 'Root / Administrator privileges (raw socket packet craft)',
          diffTone: 'signal'
        },
        {
          feature: 'Target Logging',
          left: 'High: Logs connection event in application audit logs',
          right: 'Low: App layer never receives connection; logged only at packet level',
          diffTone: 'bad'
        },
        {
          feature: 'Speed & Overhead',
          left: 'Slower; OS allocates socket descriptors and buffers',
          right: 'Blazing fast; asynchronous raw packet transmission',
          diffTone: 'ok'
        }
      ],
      summaryTakeaway: 'SYN scan is the industry gold standard for security professionals due to speed and efficiency, but requires administrative raw socket permissions.'
    },
    speakerNotes: {
      script: 'Remind students of user permission requirements: Any unprivileged user on Linux can run `nmap -sT` because it uses the POSIX `connect()` syscall. But `nmap -sS`, `-sF`, or `-sX` require raw socket manipulation (`AF_PACKET` / `SOCK_RAW`), which demands `sudo` or `CAP_NET_RAW`.',
      likelyQuestions: []
    }
  },

  // 7. Ask The Room
  {
    id: 'scan-ask-the-room',
    kind: 'ask-the-room',
    title: 'Concept Check: Port Scanning Mechanics',
    subtitle: 'Interpreting Probe Results',
    caption: 'How does an attacker infer open ports during a SYN scan?',
    eli5Caption: 'What reply proves the door is unlocked?',
    askTheRoom: {
      question: 'During a TCP SYN (Half-Open) port scan, which response packet from the target proves that a specific port is OPEN and listening for connections?',
      options: [
        'A TCP packet with the RST (Reset) flag set',
        'A TCP packet with both the SYN and ACK flags set',
        'An ICMP Type 3 Code 3 (Port Unreachable) error message',
        'An immediate HTTP 200 OK text response'
      ],
      correctIndex: 1,
      explanation: 'When a TCP port is open, the kernel stack replies to an incoming SYN with a SYN-ACK packet, indicating readiness to establish the session. The scanner interprets SYN-ACK as confirmation of an OPEN port.'
    },
    speakerNotes: {
      script: 'Review the standard responses: SYN-ACK means open; RST means closed; ICMP Type 3 or silence means filtered by a firewall.',
      likelyQuestions: []
    }
  },

  // 8. Exam Words
  {
    id: 'scan-exam-words',
    kind: 'exam-words',
    title: 'Exam Terminology: Network Scanning & Reconnaissance',
    subtitle: 'Key Terms and Definitions for Exams',
    caption: 'Master these terms for high-mark university test responses.',
    eli5Caption: 'The vocabulary you need to score 100% on port scanning questions.',
    examWords: {
      term: 'SYN Stealth Scan (Half-Open Scanning)',
      definition: 'A reconnaissance technique where an attacker transmits raw TCP SYN packets to probe port status, immediately returning a RST frame upon receiving a SYN-ACK to prevent connection completion and avoid application-layer logging.',
      keywords: [
        'Half-Open connection',
        'RST tear-down',
        'RFC 793 compliance',
        'Inverse TCP scanning (FIN/NULL/Xmas)',
        'Decoy scanning (-D)'
      ],
      mustRememberPoints: [
        'SYN scanning requires administrative / root privileges to craft raw IP packets.',
        'Closed ports reply with RST; open ports reply with SYN-ACK.',
        'Inverse scans (FIN, NULL, Xmas) exploit RFC 793: closed ports reset, open ports drop silently.'
      ],
      typicalMarks: 5
    },
    speakerNotes: {
      script: 'Advise students to draw the 3-step packet sequence for the SYN scan in their exam papers: 1. Attacker -> SYN. 2. Target -> SYN-ACK. 3. Attacker -> RST. A quick hand-drawn diagram will earn full marks on any university exam.',
      likelyQuestions: [
        {
          question: 'Can port scanning detect firewall presence?',
          answer: 'Yes! Dropped packets with zero response or ICMP admin prohibited messages indicate packet filtering.'
        }
      ]
    }
  }
]

export const scanningSpoofingPresentation: TopicPresentation = {
  moduleId: 'm5',
  moduleTitle: 'M5: Network Security',
  topicId: 'scanning-spoofing',
  topicTitle: 'Port Scanning & IP Spoofing',
  targetDurationMinutes: 12,
  plates: scanningSpoofingPlates
}
