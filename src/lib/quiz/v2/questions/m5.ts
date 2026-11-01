import { Question, NumericQuestion, MultiQuestion, MatchQuestion, TfWhyQuestion } from "../types"

export const m5Questions: Question[] = [
  // ==========================================
  // TOPIC 1: TCP/IP LAYER-WISE VULNERABILITIES
  // ==========================================
  {
    id: 'm5-mcq-layer-insecurity',
    type: 'mcq',
    module: 'M5',
    topicId: 'layer-vulnerabilities',
    tags: ['attacks'],
    bloom: 'L2',
    difficulty: 1,
    marks: 1,
    timeSec: 30,
    prompt: 'Why are standard TCP/IP protocol implementations natively vulnerable to packet sniffing, IP spoofing, and sequence number prediction?',
    options: [
      'The original 1970s ARPANET protocols were designed for a closed, mutually trusted academic research community without native authentication or encryption',
      'The IEEE 802.3 Ethernet standard deliberately forbids cryptographic checksums',
      'IP headers cannot support payload encryption due to a 20-byte maximum header size limit',
      'Operating systems require all packet headers to be transmitted in unencrypted base64 format'
    ],
    answerIndex: 0,
    explanation: 'ARPANET was a trusted research network designed for survivability rather than adversarial security; protocols like IP, ARP, ICMP, and TCP were designed without cryptographic signatures, origin authentication, or confidentiality mechanisms.'
  },
  {
    id: 'm5-multi-layer-attacks',
    type: 'multi',
    module: 'M5',
    topicId: 'layer-vulnerabilities',
    tags: ['attacks'],
    bloom: 'L3',
    difficulty: 2,
    marks: 2,
    timeSec: 40,
    prompt: 'Which of the following vulnerabilities exist natively at the Network (IP) and Transport (TCP/UDP) layers of the TCP/IP stack? (Select all that apply)',
    options: [
      'IP address spoofing due to lack of source address authentication in the IPv4 header',
      'UDP reflection and amplification attacks abusing connectionless stateless replies',
      'TCP blind reset (RST) injection attacks exploiting receive window vulnerabilities',
      'Automatic hardware-level memory encryption inside standard Layer 2 switches'
    ],
    answerIndexes: [0, 1, 2],
    explanation: 'IPv4 headers carry unauthenticated source IP fields; UDP is stateless allowing forged reflection; TCP RFC 793 accepted RST packets anywhere within the receive window.'
  } as MultiQuestion,
  {
    id: 'm5-numeric-rst-window',
    type: 'numeric',
    module: 'M5',
    topicId: 'layer-vulnerabilities',
    tags: ['attacks'],
    bloom: 'L3',
    difficulty: 3,
    marks: 3,
    timeSec: 60,
    prompt: 'In a classic RFC 793 TCP session, the receiver expects next sequence RCV.NXT = 20,000 with a receive window RCV.WND = 32,768 bytes. What is the MAXIMUM sequence number that an injected RST packet can have to be accepted by the receiver?',
    given: {
      'RCV.NXT': '20,000',
      'RCV.WND': '32,768 bytes'
    },
    answer: 52767,
    tolerance: 0,
    unit: 'sequence number',
    steps: [
      '1. Compute receive window span: Window_max = RCV.NXT + RCV.WND = 20,000 + 32,768 = 52,768.',
      '2. Window inclusion condition under RFC 793: RCV.NXT <= Seq < Window_max.',
      '3. Maximum accepted sequence number = Window_max - 1 = 52,768 - 1 = 52,767.'
    ],
    explanation: 'The TCP receive window is defined as [RCV.NXT, RCV.NXT + RCV.WND). The highest sequence number accepted is 20,000 + 32,768 - 1 = 52,767.'
  } as NumericQuestion,

  // ==========================================
  // TOPIC 2: PACKET SNIFFING & ARP SPOOFING
  // ==========================================
  {
    id: 'm5-mcq-arp-poisoning',
    type: 'mcq',
    module: 'M5',
    topicId: 'arp-sniffing',
    tags: ['attacks'],
    bloom: 'L2',
    difficulty: 1,
    marks: 1,
    timeSec: 30,
    prompt: 'What mechanism allows Mallory to poison Alice’s ARP cache on a switched Ethernet local area network?',
    options: [
      'Sending unsolicited Gratuitous ARP replies mapping the Gateway IP address to Mallory’s MAC address',
      'Encrypting the switch’s CAM table using an asymmetric RSA key pair',
      'Broadcasting ICMP Type 8 Echo Requests with invalid IP header checksums',
      'Exploiting a buffer overflow in the physical twisted-pair copper wire'
    ],
    answerIndex: 0,
    explanation: 'ARP is stateless and does not authenticate replies. By transmitting unsolicited Gratuitous ARP replies, Mallory tricks Alice into updating her dynamic ARP table, redirecting outbound traffic to Mallory’s machine.'
  },
  {
    id: 'm5-tf-dai-snooping',
    type: 'tf-why',
    module: 'M5',
    topicId: 'arp-sniffing',
    tags: ['attacks'],
    bloom: 'L3',
    difficulty: 2,
    marks: 2,
    timeSec: 40,
    prompt: 'Evaluate the role of Dynamic ARP Inspection (DAI) on managed Layer 2 switches:',
    statement: 'Dynamic ARP Inspection (DAI) can operate autonomously on a switch without requiring DHCP Snooping or manual static IP-to-MAC bindings.',
    isTrue: false,
    whyOptions: [
      'DAI uses an internal AI neural network to guess whether a MAC address is malicious',
      'DAI relies strictly on a trusted binding database (populated by DHCP Snooping or static ARP ACLs) to validate sender IP-to-MAC mappings',
      'DAI only operates on Layer 3 BGP border routers, never on Ethernet switches',
      'DAI permits all ARP packets by default and only logs them to a syslog server'
    ],
    whyIndex: 1,
    explanation: 'DAI cannot validate ARP packets without a source of ground truth. It relies directly on the DHCP Snooping database (or static ARP access-lists) to inspect and drop forged ARP replies.'
  } as TfWhyQuestion,
  {
    id: 'm5-order-arp-resolution',
    type: 'order',
    module: 'M5',
    topicId: 'arp-sniffing',
    tags: ['attacks'],
    bloom: 'L2',
    difficulty: 2,
    marks: 2,
    timeSec: 45,
    prompt: 'Order the steps of legitimate ARP address resolution between Client (Alice) and Default Gateway Router:',
    items: [
      'Alice checks local dynamic ARP cache; destination gateway IP mapping is not present',
      'Alice broadcasts ARP Request (Who has 192.168.1.1? Tell 192.168.1.10) to MAC FF:FF:FF:FF:FF:FF',
      'Ethernet switch floods broadcast frame to all access ports on the VLAN',
      'Gateway router unicasts ARP Reply containing its physical MAC address BB:BB:BB:00:00:01',
      'Alice caches Gateway IP-to-MAC mapping and transmits queued IP datagram'
    ],
    correctOrder: [0, 1, 2, 3, 4],
    explanation: 'Resolution proceeds from cache check, broadcast request, switch flooding, unicast reply, and local cache update.'
  },

  // ==========================================
  // TOPIC 3: PORT SCANNING & IP SPOOFING
  // ==========================================
  {
    id: 'm5-mcq-syn-scan-benefit',
    type: 'mcq',
    module: 'M5',
    topicId: 'scanning-spoofing',
    tags: ['attacks', 'firewall'],
    bloom: 'L2',
    difficulty: 2,
    marks: 1,
    timeSec: 30,
    prompt: 'Why is a TCP SYN scan (-sS) traditionally referred to as a "half-open" or "stealth" scan compared to a TCP Connect scan (-sT)?',
    options: [
      'The scanner immediately tears down the connection with a RST packet upon receiving SYN-ACK, never completing the handshake to avoid triggering application accept() logging',
      'The scanner encrypts the TCP header so network firewalls cannot read port numbers',
      'The scan only operates on half of the 65,535 available port numbers',
      'The scanner uses UDP instead of TCP to evade Wireshark packet capture'
    ],
    answerIndex: 0,
    explanation: 'A SYN scan terminates the connection with a RST frame immediately after receiving the SYN-ACK. Because the 3-way handshake is never completed, the application daemon never calls accept(), leaving no log entry in traditional application server access logs.'
  },
  {
    id: 'm5-match-scan-types',
    type: 'match',
    module: 'M5',
    topicId: 'scanning-spoofing',
    tags: ['attacks'],
    bloom: 'L3',
    difficulty: 3,
    marks: 3,
    timeSec: 50,
    prompt: 'Match each Nmap port scanning technique with its packet signature and behavior:',
    pairs: [
      ['TCP Connect (-sT)', 'Full 3-way handshake using standard unprivileged connect() system call'],
      ['TCP SYN (-sS)', 'Sends SYN, receives SYN-ACK, immediately transmits RST (requires root/raw sockets)'],
      ['TCP Xmas (-sX)', 'Sets FIN, PSH, and URG flags; closed ports reply RST, open ports drop silently under RFC 793'],
      ['UDP Scan (-sU)', 'Sends raw UDP payload; closed ports elicit ICMP Port Unreachable (Type 3, Code 3)']
    ],
    explanation: 'Connect uses OS sockets; SYN uses raw half-open RST; Xmas lights up FIN+PSH+URG; UDP relies on ICMP port unreachable responses.'
  } as MatchQuestion,
  {
    id: 'm5-tf-xmas-windows',
    type: 'tf-why',
    module: 'M5',
    topicId: 'scanning-spoofing',
    tags: ['attacks'],
    bloom: 'L3',
    difficulty: 2,
    marks: 2,
    timeSec: 40,
    prompt: 'Evaluate the effectiveness of RFC 793 Inverse Scans (FIN, NULL, Xmas) against Microsoft Windows targets:',
    statement: 'Xmas and NULL scans reliably distinguish open ports from closed ports on Microsoft Windows operating systems.',
    isTrue: false,
    whyOptions: [
      'Microsoft Windows firewalls automatically block all incoming Ethernet frames',
      'The Microsoft TCP/IP stack violates RFC 793 by returning RST packets for all unexpected flag probes, regardless of whether the port is open or closed',
      'Windows operating systems do not support TCP port numbers above 1024',
      'Xmas scans only function over IPv6, which is disabled on Windows by default'
    ],
    whyIndex: 1,
    explanation: 'Microsoft’s TCP/IP stack does not adhere to RFC 793 for inverse scans; Windows machines reply with RST to FIN, NULL, and Xmas frames whether the port is open or closed, rendering inverse scans useless against Windows.'
  } as TfWhyQuestion,

  // ==========================================
  // TOPIC 4: SYN FLOOD, DOS AND DDOS ATTACKS
  // ==========================================
  {
    id: 'm5-mcq-syn-flood-cause',
    type: 'mcq',
    module: 'M5',
    topicId: 'dos-ddos',
    tags: ['attacks'],
    bloom: 'L2',
    difficulty: 1,
    marks: 1,
    timeSec: 30,
    prompt: 'What specific operating system resource is exhausted during a classic TCP SYN Flood attack?',
    options: [
      'The socket backlog queue for connections in the SYN_RCVD half-open state',
      'The physical hard disk sector allocation table',
      'The hardware CPU instruction cache on the motherboard',
      'The DNS authoritative root zone file'
    ],
    answerIndex: 0,
    explanation: 'A SYN flood floods spoofed SYN packets without sending completing ACKs. The server allocates a connection block for each in its half-open backlog queue (`listen(sock, backlog)`); once full, legitimate connection requests are dropped.'
  },
  {
    id: 'm5-multi-syn-cookies',
    type: 'multi',
    module: 'M5',
    topicId: 'dos-ddos',
    tags: ['attacks'],
    bloom: 'L3',
    difficulty: 2,
    marks: 2,
    timeSec: 45,
    prompt: 'Which statements accurately describe the RFC 4987 TCP SYN Cookie defense mechanism? (Select all that apply)',
    options: [
      'The server allocates zero socket memory upon receiving the initial SYN packet',
      'Necessary connection parameters (timestamp, MSS index, cryptographic hash) are encoded inside the 32-bit Initial Sequence Number (ISN)',
      'Socket state and buffers are only allocated after receiving a valid client ACK with matching sequence numbers',
      'The server sends an SMS verification code to the client’s mobile phone before replying'
    ],
    answerIndexes: [0, 1, 2],
    explanation: 'SYN cookies eliminate memory starvation during handshakes by making the server stateless until the client proves its legitimacy by returning the cryptographic ISN cookie incremented by 1 in the ACK packet.'
  } as MultiQuestion,
  {
    id: 'm5-numeric-amplification',
    type: 'numeric',
    module: 'M5',
    topicId: 'dos-ddos',
    tags: ['attacks'],
    bloom: 'L3',
    difficulty: 2,
    marks: 2,
    timeSec: 45,
    prompt: 'An attacker launches an NTP Monlist amplification DDoS attack using a botnet uplinking 50 Megabits per second (Mbps) of spoofed UDP requests to open NTP servers. If NTP Monlist has an amplification factor of 206x, what is the resulting flood bandwidth directed at the victim in Megabits per second (Mbps)?',
    given: {
      'Attacker Uplink Bandwidth': '50 Mbps',
      'NTP Amplification Factor': '206x'
    },
    answer: 10300,
    tolerance: 0,
    unit: 'Mbps',
    steps: [
      '1. Compute amplified flood bandwidth = Request bandwidth * Amplification factor.',
      '2. Substitute given values: 50 Mbps * 206 = 10,300 Mbps.',
      '3. Resulting flood bandwidth directed at victim = 10,300 Mbps (10.3 Gbps).'
    ],
    explanation: '50 Mbps * 206 = 10,300 Mbps (10.3 Gbps). A modest 50 Mbps botnet generates over 10 Gbps of saturated flood traffic at the victim.'
  } as NumericQuestion,

  // ==========================================
  // TOPIC 5: DNS SPOOFING & DNS TUNNELING
  // ==========================================
  {
    id: 'm5-mcq-kaminsky-flaw',
    type: 'mcq',
    module: 'M5',
    topicId: 'dns-security',
    tags: ['attacks'],
    bloom: 'L3',
    difficulty: 2,
    marks: 1,
    timeSec: 35,
    prompt: 'How did Dan Kaminsky’s 2008 DNS cache poisoning attack bypass the Time-To-Live (TTL) waiting constraint of traditional DNS cache poisoning?',
    options: [
      'By querying randomized non-existent subdomains (e.g. x101.bank.com), forcing the resolver to issue continuous recursive queries while injecting forged authoritative NS records into the Additional Records section',
      'By decrypting the DNS root zone master key using quantum Shor’s algorithm',
      'By physically cutting the undersea fiber cables connecting DNS root servers',
      'By transmitting forged BGP route announcements to hijack AS 15169'
    ],
    answerIndex: 0,
    explanation: 'Kaminsky realized that querying non-existent subdomains forces the recursive resolver to constantly ask the authoritative nameserver without waiting for cached TTLs. Flooding forged responses with a fake `bank.com NS attacker.com` in the Authority section poisons the entire domain zone once a 16-bit TXID matches.'
  },
  {
    id: 'm5-tf-dnssec-privacy',
    type: 'tf-why',
    module: 'M5',
    topicId: 'dns-security',
    tags: ['attacks'],
    bloom: 'L2',
    difficulty: 2,
    marks: 2,
    timeSec: 40,
    prompt: 'Evaluate the privacy guarantees of Domain Name System Security Extensions (DNSSEC):',
    statement: 'Deploying DNSSEC prevents an Internet Service Provider (ISP) or local Wi-Fi eavesdropper from seeing which domain names a user is querying.',
    isTrue: false,
    whyOptions: [
      'DNSSEC queries are automatically encrypted using 4096-bit RSA keys',
      'DNSSEC provides authentication and data integrity via digital signatures (RRSIG), but does NOT encrypt queries; DNS requests and responses remain plaintext unless DoH or DoT is used',
      'DNSSEC replaces UDP port 53 with an unmonitored peer-to-peer Tor circuit',
      'DNSSEC is only supported on intranet domains and cannot resolve public internet addresses'
    ],
    whyIndex: 1,
    explanation: 'DNSSEC signs DNS records to prevent spoofing and poisoning, but provides ZERO confidentiality. Queries and responses travel in unencrypted plaintext. Privacy against ISP snooping requires DNS-over-HTTPS (DoH) or DNS-over-TLS (DoT).'
  } as TfWhyQuestion,
  {
    id: 'm5-order-dnssec-chain',
    type: 'order',
    module: 'M5',
    topicId: 'dns-security',
    tags: ['attacks'],
    bloom: 'L4',
    difficulty: 3,
    marks: 3,
    timeSec: 50,
    prompt: 'Order the hierarchical verification steps in the DNSSEC chain of trust from the Root Anchor down to an individual web server record (e.g. www.example.org):',
    items: [
      'Resolver verifies Root Zone (.) KSK against pre-installed local trust anchor',
      'Root zone signs Delegation Signer (DS) record pointing to .org TLD Key Signing Key (KSK)',
      '.org TLD zone verifies its KSK and signs DS record for example.org',
      'example.org KSK verifies its Zone Signing Key (ZSK)',
      'example.org ZSK validates the RRSIG digital signature covering the www.example.org A record'
    ],
    correctOrder: [0, 1, 2, 3, 4],
    explanation: 'DNSSEC validates hierarchically: Root KSK -> Root DS (.org) -> .org KSK -> .org DS (example.org) -> example.org KSK -> example.org ZSK -> RRSIG (A record).'
  },

  // ==========================================
  // TOPIC 6: FIREWALL TECHNOLOGIES
  // ==========================================
  {
    id: 'm5-mcq-stateful-benefit',
    type: 'mcq',
    module: 'M5',
    topicId: 'firewalls',
    tags: ['firewall'],
    bloom: 'L2',
    difficulty: 1,
    marks: 1,
    timeSec: 30,
    prompt: 'What is the primary operational advantage of a stateful inspection firewall over a stateless packet filter?',
    options: [
      'It maintains a dynamic connection tracking table (conntrack), automatically permitting inbound return traffic for established sessions without opening permanent high-port inbound holes',
      'It decrypts all SSL/TLS traffic without requiring an enterprise root certificate',
      'It eliminates the need for IP addresses by routing packets based purely on hostname strings',
      'It compresses network packets to increase internet download speeds by 50%'
    ],
    answerIndex: 0,
    explanation: 'Stateful firewalls track session state (NEW, ESTABLISHED, RELATED). When an internal host sends an outbound request, the return path is dynamically permitted without needing a static rule opening all high ports.'
  },
  {
    id: 'm5-multi-dmz-rules',
    type: 'multi',
    module: 'M5',
    topicId: 'firewalls',
    tags: ['firewall'],
    bloom: 'L3',
    difficulty: 2,
    marks: 2,
    timeSec: 40,
    prompt: 'In a standard three-zone Demilitarized Zone (DMZ) firewall architecture (WAN, DMZ, Internal LAN), which traffic flows should be strictly PROHIBITED? (Select all that apply)',
    options: [
      'Connections initiated from DMZ servers into the internal LAN (e.g., DMZ web server initiating connection to internal payroll database)',
      'Direct unrestricted incoming traffic from WAN directly into the internal LAN',
      'Outbound web browsing traffic from internal LAN clients to external WAN servers',
      'Inbound HTTPS traffic on port 443 from public WAN clients to public DMZ web servers'
    ],
    answerIndexes: [0, 1],
    explanation: 'Core DMZ security rules: 1. Direct WAN to LAN is blocked. 2. Crucially, DMZ servers must NEVER be allowed to initiate connections into the internal LAN; if a DMZ bastion is hacked, the breach is contained in the DMZ.'
  } as MultiQuestion,
  {
    id: 'm5-numeric-rule-order',
    type: 'numeric',
    module: 'M5',
    topicId: 'firewalls',
    tags: ['firewall'],
    bloom: 'L3',
    difficulty: 2,
    marks: 2,
    timeSec: 45,
    prompt: 'An Access Control List has 4 rules evaluated sequentially top-down:\nRule 1: ALLOW TCP 10.0.0.0/8 -> ANY:80\nRule 2: DROP TCP ANY:ANY -> 192.168.1.10:22\nRule 3: ALLOW TCP ANY:ANY -> 192.168.1.10:ANY\nRule 4: DROP ALL ANY -> ANY\nA packet arrives: TCP 10.0.1.50:48200 -> 192.168.1.10:22. Which rule number (1, 2, 3, or 4) matches and determines the packet’s fate?',
    given: {
      'Packet Protocol': 'TCP',
      'Source IP': '10.0.1.50 (in 10.0.0.0/8)',
      'Destination IP': '192.168.1.10',
      'Destination Port': '22'
    },
    answer: 2,
    tolerance: 0,
    unit: 'rule number',
    steps: [
      '1. Test Rule 1: Destination port 22 does not match required port 80 (No match).',
      '2. Test Rule 2: Matches TCP from any source to 192.168.1.10:22 (Match!).',
      '3. Under First-Match-Wins logic, Rule 2 matches and drops the packet.'
    ],
    explanation: 'Rule 1 fails because port is 22 (not 80). Rule 2 matches TCP port 22 to 192.168.1.10 and immediately DROPS the packet under First-Match-Wins logic.'
  } as NumericQuestion,

  // ==========================================
  // TOPIC 7: IDS, IPS, HONEYPOTS & ZERO TRUST
  // ==========================================
  {
    id: 'm5-mcq-honeypot-value',
    type: 'mcq',
    module: 'M5',
    topicId: 'ids-honeypots',
    tags: ['ids'],
    bloom: 'L2',
    difficulty: 1,
    marks: 1,
    timeSec: 30,
    prompt: 'What unique operational characteristic gives Honeypots a near-zero false positive rate compared to traditional Network IDSes?',
    options: [
      'Honeypots have no legitimate business or operational utility; therefore, any connection attempt directed at a honeypot is inherently unauthorized or malicious',
      'Honeypots run exclusively on quantum hardware that never makes mathematical errors',
      'Honeypots require all attackers to sign a digital waiver before exploiting them',
      'Honeypots only monitor outbound traffic from approved domain controllers'
    ],
    answerIndex: 0,
    explanation: 'Because a honeypot is a decoy with zero legitimate users, zero business traffic, and zero production duties, any packet reaching it indicates scanning, misconfiguration, or active intrusion, virtually eliminating false alarms.'
  },
  {
    id: 'm5-match-ids-types',
    type: 'match',
    module: 'M5',
    topicId: 'ids-honeypots',
    tags: ['ids', 'cloud'],
    bloom: 'L3',
    difficulty: 3,
    marks: 3,
    timeSec: 50,
    prompt: 'Match each security monitoring and defense technology with its primary mechanism:',
    pairs: [
      ['Signature-based NIDS (Snort)', 'Evaluates packet payloads against known CVE byte patterns and regex rules'],
      ['Statistical Anomaly Detection', 'Flags events when observed traffic metrics exceed baseline mean by Z >= 3.0 standard deviations'],
      ['Host IDS (HIDS / OSSEC)', 'Monitors local file integrity, system audit logs, and OS kernel process execution'],
      ['Zero Trust Architecture (ZTA)', 'Enforces dynamic microsegmentation and "Never Trust, Always Verify" policy at every hop']
    ],
    explanation: 'Signature matches byte patterns; Anomaly checks statistical baselines; HIDS monitors host logs/files; Zero Trust verifies identity/posture per transaction.'
  } as MatchQuestion,
  {
    id: 'm5-tf-zero-trust-perimeter',
    type: 'tf-why',
    module: 'M5',
    topicId: 'ids-honeypots',
    tags: ['cloud'],
    bloom: 'L3',
    difficulty: 2,
    marks: 2,
    timeSec: 40,
    prompt: 'Evaluate the foundational premise of NIST SP 800-207 Zero Trust Architecture (ZTA):',
    statement: 'In a Zero Trust Architecture, devices connected to the corporate internal office Wi-Fi are automatically granted default access to internal company databases without further authentication.',
    isTrue: false,
    whyOptions: [
      'Zero Trust requires all office Wi-Fi networks to use unencrypted WEP protocols',
      'Zero Trust rejects network location as a proxy for trust; every access request must be explicitly authenticated, authorized, and validated for device posture regardless of whether it originates inside or outside the corporate perimeter',
      'Zero Trust only applies to public cloud virtual machines running in AWS or Azure',
      'Zero Trust allows unlimited access to any employee with an active badge'
    ],
    whyIndex: 1,
    explanation: 'The core tenet of Zero Trust (NIST SP 800-207) is "Never Trust, Always Verify". Physical or logical presence on the internal corporate network conveys ZERO intrinsic trust. Every transaction is authenticated and verified dynamically.'
  } as TfWhyQuestion
]
