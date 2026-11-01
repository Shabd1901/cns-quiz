import { Plate, TopicPresentation } from "@/lib/present/types"

export const idsHoneypotsPlates: Plate[] = [
  // 1. Hook
  {
    id: 'ids-hook',
    kind: 'hook',
    title: 'The Burglar Alarm and the Honeypot Trap',
    subtitle: 'From Passive Detection to Active Deception and Zero Trust',
    caption: 'Firewalls enforce perimeter boundaries like locked doors; Intrusion Detection Systems (IDS) act as burglar alarms that detect when someone sneaks past, while Honeypots lay deliberate traps to study adversary tradecraft.',
    eli5Caption: 'A motion sensor inside a jewelry store, and a fake glass diamond placed on a pedestal to catch the burglar red-handed.',
    speakerNotes: {
      script: 'Start by distinguishing firewalls from intrusion detection. A firewall is preventive (like a locked door): if port 443 is open, the firewall lets all traffic pass without inspecting what the user is doing. An IDS is detective (like a security camera and motion detector): it analyzes traffic flows, looking for SQL injections, exploit payloads, or lateral movement.',
      likelyQuestions: [
        {
          question: 'What is the difference between an IDS and an IPS?',
          answer: 'An IDS (Intrusion Detection System) operates out-of-band via a SPAN/TAP port and generates alerts; an IPS (Intrusion Prevention System) sits in-line and actively drops malicious packets.'
        }
      ]
    }
  },

  // 2. Concept: Taxonomy of Detection & Deception
  {
    id: 'ids-concept',
    kind: 'concept',
    title: 'Detection Paradigms: NIDS, HIDS, and Honeypots',
    subtitle: 'Network Sensors, Endpoint Telemetry, and Decoy Systems',
    caption: 'Network IDS (NIDS) inspects packet wires, Host IDS (HIDS) monitors OS system calls and logs, Honeypots provide zero-false-positive deception, and Zero Trust enforces microsegmentation at every hop.',
    eli5Caption: 'Guard dogs patrol the perimeter fence (NIDS), bodyguards watch the doors of individual rooms (HIDS), and decoy rooms trap intruders (Honeypot).',
    customFigure: 'TopologyDiagram',
    speakerNotes: {
      script: 'Explain the four components of modern internal defense: 1. NIDS (Snort, Suricata, Zeek) monitors switch mirror ports. 2. HIDS (OSSEC, Wazuh, modern EDR) monitors processes, file integrity (FIM), and registry changes on the host. 3. Honeypots (Cowrie, Honeyd) have no production purpose; any interaction is 100% malicious. 4. Zero Trust Architecture (ZTA) abandons the "trusted internal network" concept entirely.',
      likelyQuestions: [
        {
          question: 'Why do honeypots have a near-zero false positive rate?',
          answer: 'Because a honeypot has no legitimate business purpose and publishes no legitimate services; no real user or employee has any reason to connect to it.'
        }
      ]
    }
  },

  // 3. Process: Signature Matching vs Anomaly Detection
  {
    id: 'ids-process',
    kind: 'process',
    title: 'Snort Rule Matching vs Statistical Anomaly Detection',
    subtitle: 'Known Pattern Signatures vs Behavioral Deviations',
    caption: 'Signature detection compares packet bytes against a database of known exploit strings; Anomaly detection models baseline network metrics and flags statistical outliers ($Z > 3.0$).',
    eli5Caption: 'Checking a photo lineup of known criminals vs spotting someone pacing nervously outside a bank vault.',
    scene: {
      id: 'scene-ids-detection',
      title: 'Snort Signature Matching Flow',
      actors: [
        { id: 'attacker', kind: 'mallory', label: 'Attacker', pos: { x: 80, y: 150 } },
        { id: 'ids', kind: 'ids', label: 'Snort NIDS Sensor', pos: { x: 250, y: 150 } },
        { id: 'web', kind: 'server', label: 'Web Server', pos: { x: 420, y: 150 } }
      ],
      objects: [
        { id: 'exploit', kind: 'packet', label: 'Payload: /etc/passwd', at: { x: 120, y: 150 } }
      ],
      steps: [
        {
          caption: 'Attacker launches Directory Traversal exploit targeting sensitive system files.',
          actions: [
            { do: 'highlight', target: ['attacker', 'exploit'], tone: 'bad' }
          ]
        },
        {
          caption: 'Packet passes through the network tap to the Snort NIDS sensor.',
          actions: [
            { do: 'move', obj: 'exploit', to: { x: 250, y: 150 } },
            { do: 'highlight', target: ['ids'], tone: 'info' }
          ]
        },
        {
          caption: 'Snort evaluates Rule SID:10001: content:"/etc/passwd" -> Signature Match!',
          actions: [
            { do: 'appear', obj: { id: 'alert', kind: 'text', label: 'ALERT: SID 10001 (CRITICAL)', at: { x: 250, y: 90 } } },
            { do: 'highlight', target: ['ids', 'alert'], tone: 'bad' }
          ]
        },
        {
          caption: 'Alert logged to SIEM dashboard; in-line IPS drops packet before reaching target server.',
          actions: [
            { do: 'vanish', obj: 'exploit' },
            { do: 'highlight', target: ['web'], tone: 'ok' }
          ]
        }
      ],
      viewBox: '0 0 500 300'
    },
    speakerNotes: {
      script: 'Walk through the Snort rule anatomy: `alert tcp any any -> $HOME_NET 80 (msg:"Directory Traversal"; content:"/etc/passwd"; sid:10001;)`. Signature systems excel at detecting known exploits with near-zero false positives. However, they are completely blind to novel zero-day attacks or polymorphic shellcode. That is where anomaly detection and machine learning step in.',
      likelyQuestions: [
        {
          question: 'What happens if the attacker encrypts traffic with HTTPS?',
          answer: 'A traditional NIDS cannot inspect encrypted payloads; organizations must use TLS termination, SSL decryption proxies, or endpoint HIDS/EDR sensors.'
        }
      ]
    }
  },

  // 4. Attack & Defense: Honeypots & Zero Trust Architecture
  {
    id: 'ids-attack-defense',
    kind: 'attack-defense',
    title: 'Vulnerability Spotlight: Lateral Movement vs Zero Trust (ZTA)',
    subtitle: 'NIST SP 800-207: "Never Trust, Always Verify"',
    caption: 'Perimeter security assumes everyone inside the firewall is trusted. Zero Trust treats all networks as hostile: every access request requires dynamic verification of Identity, Device Health, and Least Privilege.',
    eli5Caption: 'Instead of trusting anyone who has a badge at the front gate, requiring fingerprint scans and permission checks at every single interior door.',
    attackDefense: {
      attackName: 'Internal Lateral Movement & Privilege Escalation',
      normalFlowDescription: 'Attacker compromises single workstation in corporate LAN and moves freely between internal servers without inspection.',
      attackFlowDescription: 'Attacker scans internal subnets for unpatched SMB/RDP shares and moves laterally to domain controllers.',
      defenseFlowDescription: 'Zero Trust Architecture (ZTA) microsegmentation: Every request is authenticated, authorized, and encrypted; honeypots detect unauthorized reconnaissance.'
    },
    speakerNotes: {
      script: 'Explain the core mantra of NIST SP 800-207 Zero Trust Architecture: "Never Trust, Always Verify". In traditional perimeter defense (the "castle and moat" model), once an attacker gets past the perimeter firewall (via phishing or VPN credential theft), they have free rein over the flat internal network. Under Zero Trust, network location gives ZERO privilege: identity, device posture, and least privilege are enforced at every individual transaction.',
      likelyQuestions: [
        {
          question: 'What are the three core pillars of Zero Trust?',
          answer: '1. Explicit verification of identity and context. 2. Least privilege access. 3. Assume breach at all times.'
        }
      ]
    }
  },

  // 5. Worked Example: Statistical Anomaly Detection Z-Score Math
  {
    id: 'ids-worked-example',
    kind: 'worked-example',
    title: 'Worked Example: Statistical Anomaly Z-Score Calculation',
    subtitle: 'Detecting Port Scan Outliers using Gaussian Distribution Math',
    caption: 'Anomaly IDSes model baseline metrics (mean $\\mu$, standard deviation $\\sigma$) and compute the standardized Z-Score $Z = \\frac{x - \\mu}{\\sigma}$. If $|Z| \\ge 3.0$ (99.7% threshold), an anomaly alert triggers.',
    eli5Caption: 'Calculating how unusually high a spike in temperature is compared to the normal weekly weather.',
    workedExample: {
      problem: 'An internal web server baseline profile exhibits a mean inbound SYN rate of \\mu = 120 \\text{ packets/min} with standard deviation \\sigma = 18 \\text{ packets/min}. During a sudden 1-minute window, the sensor observes x = 210 \\text{ SYN packets}. Calculate the Z-score and determine if an anomaly alert is raised (threshold Z_{thresh} = 3.0).',
      given: {
        'Baseline Mean (\\mu)': '120 packets/min',
        'Standard Deviation (\\sigma)': '18 packets/min',
        'Observed Rate (x)': '210 packets/min',
        'Anomaly Threshold (Z_{thresh})': '3.0 (99.7% confidence)'
      },
      steps: [
        {
          label: '1. Z-Score Standardization Formula',
          formula: 'Z = \\frac{x - \\mu}{\\sigma}',
          substitution: 'Z = \\frac{210 - 120}{18}',
          result: 'Z = \\frac{90}{18} = 5.00',
          note: 'The observed rate is 5 full standard deviations above the baseline mean!'
        },
        {
          label: '2. Compare against Anomaly Alert Threshold',
          formula: '|Z| \\ge Z_{thresh} \\implies \\text{Trigger Alert}',
          substitution: '5.00 \\ge 3.00',
          result: 'TRUE (Anomalous Outlier)',
          note: 'Threshold exceeded by 2.0 standard deviations.'
        },
        {
          label: '3. Compute Statistical Anomaly Probability (P-Value)',
          formula: 'P(X \\ge 210) \\approx 2.87 \\times 10^{-7}',
          substitution: 'Probability under standard normal distribution N(0,1)',
          result: '0.0000287% Chance under Normal Behavior',
          note: 'Astronomically unlikely to be random noise. Highly indicative of active SYN scanning.'
        }
      ],
      finalAnswer: 'The calculated Z-score is 5.00, far exceeding the 3.00 threshold. The IDS logs a high-severity statistical anomaly alert for port scanning reconnaissance.',
      checkVerification: 'Reverse check: Threshold rate for Z=3 is x = 120 + 3(18) = 174 packets/min. 210 > 174. Alert confirmed.'
    },
    speakerNotes: {
      script: 'Walk through the 3-sigma rule ($Z > 3$). In Gaussian distributions, 99.73% of normal traffic falls within 3 standard deviations of the mean. A Z-score of 5.0 has a probability of less than 1 in 3 million under normal operating conditions. This provides a clean mathematical justification for flagging malicious traffic.',
      likelyQuestions: [
        {
          question: 'What is the biggest operational challenge with statistical anomaly detection?',
          answer: 'High False Positive Rates (FPR): flash crowds, software updates, or marketing campaigns cause genuine non-malicious spikes that trip anomaly alarms.'
        }
      ]
    }
  },

  // 6. Comparison: Signature IDS vs Anomaly IDS vs Honeypots
  {
    id: 'ids-comparison',
    kind: 'compare',
    title: 'Detection & Deception Mechanism Comparison',
    subtitle: 'Matching Known Patterns vs Statistical Anomalies vs Deception Traps',
    caption: 'Effective enterprise security combines all three technologies to balance zero-day detection with operational alert fatigue.',
    eli5Caption: 'Recognizing a wanted criminal’s face vs noticing someone acting strange vs leaving out a fake wallet.',
    comparison: {
      leftTitle: 'Signature-Based IDS (Snort)',
      rightTitle: 'Anomaly-Based IDS / Machine Learning',
      differences: [
        {
          feature: 'Detection Basis',
          left: 'Explicit byte patterns, regex, and known CVE signatures',
          right: 'Deviations from learned statistical baseline profile',
          diffTone: 'info'
        },
        {
          feature: 'Zero-Day Vulnerability Detection',
          left: 'Poor: Completely blind to new, unreleased exploits',
          right: 'Strong: Flags novel behavioral deviations automatically',
          diffTone: 'signal'
        },
        {
          feature: 'False Positive Rate',
          left: 'Very low: Specific signatures rarely trigger on benign traffic',
          right: 'High: Benign traffic spikes frequently trigger false alarms',
          diffTone: 'bad'
        },
        {
          feature: 'Maintenance Requirement',
          left: 'Requires continuous signature feed updates from threat intel',
          right: 'Requires retraining baseline models to adapt to network changes',
          diffTone: 'ok'
        }
      ],
      summaryTakeaway: 'Signature IDS catches known threats with surgical precision; Anomaly IDS and Honeypots provide early warning for zero-day intrusions.'
    },
    speakerNotes: {
      script: 'Contrast the three tools: Signature IDS gives high fidelity for known threats. Anomaly IDS catches novel threats but generates alert fatigue. Honeypots solve alert fatigue because ANY connection to a honeypot is by definition an intrusion.',
      likelyQuestions: []
    }
  },

  // 7. Ask The Room
  {
    id: 'ids-ask-the-room',
    kind: 'ask-the-room',
    title: 'Concept Check: Intrusion Detection Principles',
    subtitle: 'Evaluating Detection Strengths',
    caption: 'Why are honeypots uniquely valuable in a Security Operations Center?',
    eli5Caption: 'Why do security teams love honeypots?',
    askTheRoom: {
      question: 'What is the primary operational advantage of deploying a Honeypot inside a corporate network compared to a traditional Network IDS?',
      options: [
        'Honeypots automatically reverse-hack the attacker’s computer and destroy their hard drive',
        'Honeypots have a near-zero false positive rate because legitimate corporate users have no business reason to connect to a decoy system',
        'Honeypots replace the need for perimeter firewalls entirely',
        'Honeypots double the available internet bandwidth of the corporate network'
      ],
      correctIndex: 1,
      explanation: 'Because honeypots contain no legitimate corporate data and offer no legitimate business services, any traffic directed toward them is inherently suspicious or malicious. This gives honeypots a near-zero false positive rate, cutting through alert fatigue.'
    },
    speakerNotes: {
      script: 'Highlight the phrase "near-zero false positive rate". Security teams suffer from thousands of daily false alerts from firewalls and IDSes; when a honeypot alarm triggers, analysts know with 99.9% certainty that an attacker is scanning the network.',
      likelyQuestions: []
    }
  },

  // 8. Exam Words
  {
    id: 'ids-exam-words',
    kind: 'exam-words',
    title: 'Exam Terminology: IDS, IPS, Honeypots & Zero Trust',
    subtitle: 'Standard University Definitions and Exam Points',
    caption: 'Memorize these definitions for maximum marks on your Network Security exam paper.',
    eli5Caption: 'The exact phrasing professors look for on IDS and Zero Trust questions.',
    examWords: {
      term: 'Intrusion Detection Systems & Zero Trust Architecture',
      definition: 'Security monitoring frameworks that inspect network traffic and host activity for malicious behavior using signature or anomaly analysis, complemented by Honeypots for deception and Zero Trust Architecture (NIST SP 800-207) enforcing strict microsegmentation.',
      keywords: [
        'NIDS vs HIDS',
        'Signature pattern matching',
        'Statistical anomaly Z-score',
        'Low vs high-interaction honeypots',
        'NIST SP 800-207 Zero Trust'
      ],
      mustRememberPoints: [
        'Signature detection has low false positives but fails on zero-day exploits.',
        'Anomaly detection calculates statistical deviations ($Z > 3$) but suffers from high false positive rates.',
        'Zero Trust replaces perimeter-based security with continuous explicit verification of identity and device posture.'
      ],
      typicalMarks: 5
    },
    speakerNotes: {
      script: 'Review the key exam distinction between NIDS (promiscuous packet capture) and HIDS (host log/file integrity monitoring), and remind students to quote NIST SP 800-207 when discussing Zero Trust Architecture.',
      likelyQuestions: []
    }
  }
]

export const idsHoneypotsPresentation: TopicPresentation = {
  moduleId: 'm5',
  moduleTitle: 'M5: Network Security',
  topicId: 'ids-honeypots',
  topicTitle: 'IDS, IPS, Honeypots & Zero Trust',
  targetDurationMinutes: 12,
  plates: idsHoneypotsPlates
}
