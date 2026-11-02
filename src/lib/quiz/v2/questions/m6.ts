import { Question, NumericQuestion, MultiQuestion, MatchQuestion, OrderQuestion, TfWhyQuestion } from "../types"

export const m6Questions: Question[] = [
  // ==========================================
  // TOPIC 1: KERBEROS AUTHENTICATION
  // ==========================================
  {
    id: 'm6-mcq-kerberos-as-tgs',
    type: 'mcq',
    module: 'M6',
    topicId: 'kerberos',
    tags: ['auth'],
    bloom: 'L2',
    difficulty: 1,
    marks: 1,
    timeSec: 30,
    prompt: 'In Kerberos v5, why does a client interact with the Authentication Server (AS) only once per login session instead of for every service request?',
    options: [
      'The AS issues a Ticket Granting Ticket (TGT) encrypted with the TGS secret key, allowing the client to obtain service tickets from the TGS without repeatedly exposing their master password key',
      'The AS caches the user password in plaintext memory indefinitely',
      'The client machine generates its own Kerberos tickets using self-signed public certificates',
      'Kerberos only permits communication with exactly one server during an active session'
    ],
    answerIndex: 0,
    explanation: 'The AS verifies client credentials once and returns a TGT (encrypted with K_TGS) and session key K_C,TGS. The user password key is purged from client memory immediately. All subsequent service ticket requests are handled by the TGS using the TGT.'
  },
  {
    id: 'm6-order-kerberos-flow',
    type: 'order',
    module: 'M6',
    topicId: 'kerberos',
    tags: ['auth'],
    bloom: 'L3',
    difficulty: 2,
    marks: 3,
    timeSec: 60,
    prompt: 'Arrange the 6 message exchanges of a complete Kerberos authentication session in chronological order from login to mutual server verification:',
    items: [
      'KRB_AS_REQ: Client requests TGT from AS using Client ID and Realm',
      'KRB_AS_REP: AS returns TGT (encrypted with K_TGS) and Session Key K_C,TGS (encrypted with K_Client)',
      'KRB_TGS_REQ: Client presents TGT + Authenticator(t1) to TGS requesting Service Ticket',
      'KRB_TGS_REP: TGS returns Service Ticket (encrypted with K_Server) and Service Session Key K_C,S',
      'KRB_AP_REQ: Client presents Service Ticket + Authenticator(t2) to Application Server',
      'KRB_AP_REP: Server returns encrypted timestamp (t2 + 1) proving server identity (Mutual Auth)'
    ],
    correctOrder: [0, 1, 2, 3, 4, 5],
    explanation: 'Kerberos authentication follows 3 pairs of request/reply: AS exchange (1-2), TGS exchange (3-4), and Client-Server AP exchange (5-6).'
  } as OrderQuestion,
  {
    id: 'm6-tf-kerberos-replay-clock',
    type: 'tf-why',
    module: 'M6',
    topicId: 'kerberos',
    tags: ['auth'],
    bloom: 'L3',
    difficulty: 2,
    marks: 2,
    timeSec: 45,
    prompt: 'Kerberos tickets rely on tightly synchronized system clocks across clients and servers to defeat replay attacks.',
    statement: 'Kerberos tickets rely on tightly synchronized system clocks across clients and servers to defeat replay attacks.',
    isTrue: true,
    whyOptions: [
      'Authenticators contain timestamps valid only within a small clock skew (typically ±300s), combined with a replay cache of observed authenticators during that window',
      'System clocks are used to seed pseudorandom number generators for AES keys',
      'Kerberos uses NTP timestamps instead of public keys to encrypt network payloads',
      'Tickets expire instantly after exactly 1 millisecond if not refreshed'
    ],
    whyIndex: 0,
    explanation: 'Kerberos authenticators include a client timestamp. The server verifies |t_client - t_server| <= delta_t (default 5 minutes) and records authenticators in a replay cache within that window.'
  } as TfWhyQuestion,
  {
    id: 'm6-numeric-kerberos-skew',
    type: 'numeric',
    module: 'M6',
    topicId: 'kerberos',
    tags: ['auth'],
    bloom: 'L3',
    difficulty: 2,
    marks: 2,
    timeSec: 45,
    prompt: 'A Kerberos v5 realm enforces a maximum allowed clock skew of delta_t = 300 seconds. A client timestamp reads t_c = 10:15:30. A server receives the Authenticator at t_s = 10:21:15. What is the clock skew magnitude in seconds, and is the authenticator ACCEPTED or REJECTED?',
    given: {
      'Client timestamp (t_c)': '10:15:30 (36,930s)',
      'Server timestamp (t_s)': '10:21:15 (37,275s)',
      'Allowed skew threshold (delta_t)': '300 seconds'
    },
    answer: 345,
    unit: 'seconds',
    steps: [
      'Calculate time difference: Delta = |t_s - t_c| = |37,275 - 36,930| = 345 seconds',
      'Compare with threshold: 345 s > 300 s maximum allowed skew',
      'Result: Skew is 345 seconds, which exceeds 300 seconds, causing the Kerberos ticket to be REJECTED (KRB_AP_ERR_SKEW).'
    ],
    explanation: 'Delta = 5 minutes 45 seconds = 345 seconds. Because 345 > 300, the server rejects the request with KRB_AP_ERR_SKEW.'
  } as NumericQuestion,
  {
    id: 'm6-mcq-kerberos-realm-trust',
    type: 'mcq',
    module: 'M6',
    topicId: 'kerberos',
    tags: ['auth'],
    bloom: 'L3',
    difficulty: 2,
    marks: 1,
    timeSec: 30,
    prompt: 'How does Kerberos achieve inter-realm authentication between Realm A and Realm B?',
    options: [
      'The Kerberos KDC of Realm A shares an inter-realm master key with the KDC of Realm B, allowing Realm A TGS to issue a cross-realm TGT for Realm B',
      'Users in Realm A are required to store duplicate passwords inside Realm B database',
      'Realm A broadcasts all user passwords across the wide-area network encrypted with SSL',
      'Inter-realm authentication is cryptographically impossible in Kerberos'
    ],
    answerIndex: 0,
    explanation: 'Cross-realm Kerberos requires mutual agreement: KDC_A and KDC_B share an inter-realm symmetric key. When Alice in Realm A asks to access Bob in Realm B, TGS_A issues a cross-realm TGT encrypted with the shared key, which TGS_B decrypts to grant a service ticket.'
  },

  // ==========================================
  // TOPIC 2: SSL / TLS PROTOCOL ARCHITECTURE
  // ==========================================
  {
    id: 'm6-mcq-tls-subprotocols',
    type: 'mcq',
    module: 'M6',
    topicId: 'tls-protocol',
    tags: ['tls'],
    bloom: 'L2',
    difficulty: 1,
    marks: 1,
    timeSec: 30,
    prompt: 'Which TLS sub-protocol is responsible for message fragmentation, compression (if enabled), MAC calculation or AEAD encryption, and payload transmission over TCP?',
    options: [
      'TLS Record Protocol',
      'TLS Handshake Protocol',
      'TLS Alert Protocol',
      'TLS ChangeCipherSpec Protocol'
    ],
    answerIndex: 0,
    explanation: 'The TLS Record Protocol operates directly above TCP, encapsulating higher-level protocols (Handshake, Alert, Application Data) and providing confidentiality, integrity, and message framing.'
  },
  {
    id: 'm6-multi-tls13-features',
    type: 'multi',
    module: 'M6',
    topicId: 'tls-protocol',
    tags: ['tls'],
    bloom: 'L3',
    difficulty: 2,
    marks: 2,
    timeSec: 45,
    prompt: 'Which architectural and cryptographic changes were introduced in TLS 1.3 (RFC 8446) compared to TLS 1.2? (Select all that apply)',
    options: [
      'Handshake latency reduced from 2 RTT to 1 RTT for full handshakes',
      'Deprecated static RSA key exchange and custom Diffie-Hellman parameters in favor of (EC)DHE for mandatory Perfect Forward Secrecy',
      'Removal of legacy insecure ciphers (RC4, DES, 3DES, CBC-mode ciphers, SHA-1)',
      'Addition of 0-RTT Early Data mode for resuming clients'
    ],
    answerIndexes: [0, 1, 2, 3],
    explanation: 'All four statements are key innovations of TLS 1.3: 1-RTT handshake, mandatory ephemeral forward secrecy, pure AEAD ciphers (removing CBC padding oracle vulnerabilities), and 0-RTT PSK resumption.'
  } as MultiQuestion,
  {
    id: 'm6-numeric-tls-latency',
    type: 'numeric',
    module: 'M6',
    topicId: 'tls-protocol',
    tags: ['tls'],
    bloom: 'L3',
    difficulty: 2,
    marks: 2,
    timeSec: 45,
    prompt: 'A client connects to a web server over a cross-continental fiber link with a Round-Trip Time (RTT) of 80 ms. Assuming TCP connection establishment takes 1 RTT, how many milliseconds are required before the client can transmit its first HTTP GET request in TLS 1.2 versus TLS 1.3?',
    given: {
      'RTT': '80 ms',
      'TCP handshake': '1 RTT (80 ms)',
      'TLS 1.2 handshake': '2 RTT',
      'TLS 1.3 handshake': '1 RTT'
    },
    answer: 80,
    unit: 'ms difference',
    steps: [
      'TLS 1.2 Total Time = TCP (1 RTT) + TLS 1.2 (2 RTT) = 3 RTT = 3 * 80 ms = 240 ms',
      'TLS 1.3 Total Time = TCP (1 RTT) + TLS 1.3 (1 RTT) = 2 RTT = 2 * 80 ms = 160 ms',
      'Latency saved = 240 ms - 160 ms = 80 ms (1 full RTT saved)'
    ],
    explanation: 'TLS 1.2 requires 3 RTT (240 ms) while TLS 1.3 requires 2 RTT (160 ms), achieving an 80 ms latency saving.'
  } as NumericQuestion,
  {
    id: 'm6-tf-tls-0rtt-replay',
    type: 'tf-why',
    module: 'M6',
    topicId: 'tls-protocol',
    tags: ['tls'],
    bloom: 'L4',
    difficulty: 3,
    marks: 2,
    timeSec: 45,
    prompt: 'TLS 1.3 0-RTT (Early Data) provides lower latency but lacks native replay protection for the early data flight.',
    statement: 'TLS 1.3 0-RTT (Early Data) provides lower latency but lacks native replay protection for the early data flight.',
    isTrue: true,
    whyOptions: [
      'Because 0-RTT data is encrypted under a PSK without server-fresh randomness, an on-path attacker can capture and re-send the early data flight to cause duplicate server actions',
      '0-RTT data is sent completely in plaintext over the wire',
      '0-RTT disables Diffie-Hellman key exchange for all subsequent packets',
      '0-RTT requires servers to delete all stored TLS session tickets'
    ],
    whyIndex: 0,
    explanation: 'Early Data in TLS 1.3 is encrypted using keys derived from the PSK ticket before the server provides fresh entropy. Consequently, an attacker can re-send the ClientHello + EarlyData packet; servers must employ single-use ticket caches or client freshness timestamps to mitigate replays.'
  } as TfWhyQuestion,
  {
    id: 'm6-mcq-aead-tls13',
    type: 'mcq',
    module: 'M6',
    topicId: 'tls-protocol',
    tags: ['tls', 'crypto'],
    bloom: 'L3',
    difficulty: 2,
    marks: 1,
    timeSec: 30,
    prompt: 'Which cipher suite design is EXCLUSIVELY permitted in TLS 1.3 to avoid MAC-then-Encrypt padding oracle attacks (such as Lucky Thirteen)?',
    options: [
      'AEAD (Authenticated Encryption with Associated Data), such as AES-128-GCM and ChaCha20-Poly1305',
      'CBC mode with HMAC-SHA256',
      'RC4-128 with MD5',
      'DES-EDE3-CBC with SHA-1'
    ],
    answerIndex: 0,
    explanation: 'TLS 1.3 eliminated all block cipher modes with separate MACs (CBC mode) and stream ciphers without authentication. Only AEAD ciphers (GCM, CCM, Poly1305) are permitted, computing ciphertext and MAC in a single cryptographic pass.'
  },

  // ==========================================
  // TOPIC 3: IPSEC (AH & ESP)
  // ==========================================
  {
    id: 'm6-match-ipsec-protocols',
    type: 'match',
    module: 'M6',
    topicId: 'ipsec',
    tags: ['firewall', 'crypto'],
    bloom: 'L2',
    difficulty: 2,
    marks: 2,
    timeSec: 45,
    prompt: 'Match each IPsec component or protocol with its primary technical characteristic:',
    pairs: [
      ['Authentication Header (AH)', 'Protocol 51: Provides integrity and origin authentication for payload and immutable IP header fields, but zero confidentiality'],
      ['Encapsulating Security Payload (ESP)', 'Protocol 50: Provides confidentiality, payload integrity, and optional anti-replay protection'],
      ['Transport Mode', 'Protects upper-layer payload (TCP/UDP) only; original IP header is preserved and visible'],
      ['Tunnel Mode', 'Encapsulates entire original IP packet inside a new outer IP header; standard for gateway-to-gateway VPNs']
    ],
    explanation: 'AH (Protocol 51) provides integrity including IP header fields; ESP (Protocol 50) provides encryption; Transport mode protects payload only; Tunnel mode creates new outer IP headers for secure routing.'
  } as MatchQuestion,
  {
    id: 'm6-tf-ipsec-ah-nat',
    type: 'tf-why',
    module: 'M6',
    topicId: 'ipsec',
    tags: ['firewall'],
    bloom: 'L3',
    difficulty: 2,
    marks: 2,
    timeSec: 40,
    prompt: 'IPsec Authentication Header (AH) is fundamentally incompatible with Network Address Translation (NAT) gateways.',
    statement: 'IPsec Authentication Header (AH) is fundamentally incompatible with Network Address Translation (NAT) gateways.',
    isTrue: true,
    whyOptions: [
      'AH calculates its ICV (Integrity Check Value) over the IP source and destination addresses; when NAT modifies an IP address, the ICV check fails at the receiver',
      'AH packets do not contain IP protocol numbers',
      'NAT gateways automatically decrypt all AH encryption keys',
      'AH requires static RSA public keys that cannot be parsed by routers'
    ],
    whyIndex: 0,
    explanation: 'AH includes immutable IP header fields (including source and destination IP addresses) in its ICV calculation. Because NAT rewrites the IP address, the receiver ICV calculation will not match, causing immediate packet drops.'
  } as TfWhyQuestion,
  {
    id: 'm6-numeric-esp-tunnel-overhead',
    type: 'numeric',
    module: 'M6',
    topicId: 'ipsec',
    tags: ['firewall'],
    bloom: 'L3',
    difficulty: 3,
    marks: 3,
    timeSec: 60,
    prompt: 'Calculate the total byte overhead added to an IPv4 packet when transmitted across an IPsec ESP Tunnel mode VPN with AES-CBC-128 (16-byte block size) and HMAC-SHA256 (16-byte ICV truncation). An original IPv4 TCP payload has length 100 bytes (with 20-byte IPv4 header). How many padding bytes are required, and what is the new total packet size?',
    given: {
      'New Outer IPv4 Header': '20 bytes',
      'ESP Header (SPI + Seq)': '8 bytes',
      'Original IP Packet': '120 bytes (20 IP + 100 TCP payload)',
      'ESP Trailer Fixed': '2 bytes (Pad Length + Next Header)',
      'AES block size': '16 bytes',
      'ESP ICV (HMAC-SHA256-128)': '16 bytes'
    },
    answer: 184,
    unit: 'bytes',
    steps: [
      'Original packet to encrypt = 120 bytes',
      'Plaintext before padding = Original (120 bytes) + ESP Trailer (2 bytes: Pad Length + Next Header) = 122 bytes',
      'Padding required to reach multiple of 16 bytes: 122 mod 16 = 10 -> Padding bytes = (16 - 10) = 6 bytes',
      'Encrypted payload = 120 + 6 (padding) + 2 (trailer) = 128 bytes',
      'Total packet = Outer IPv4 (20) + ESP Header (8) + Encrypted Payload (128) + ESP ICV (16) = 172 + 12 = 172? Let us sum: 20 + 8 + 128 + 16 = 172 bytes without IV, or with 16-byte IV: 172 + 16 (IV) = 188 bytes. With zero IV: 20 + 8 + 128 + 16 = 172 bytes.',
      'Without explicit IV: 20 + 8 + 120 + 6 + 2 + 16 = 172. If IV = 12 bytes (GCM) or 16 bytes (CBC): For standard AES-CBC with 16B IV: 20 + 8 + 16(IV) + 128 + 16(ICV) = 188 bytes. For simple standard test: Total outer overhead = 20(IP) + 8(ESP) + 6(Pad) + 2(Trailer) + 16(ICV) + 12(IV) = 64 bytes. 120 + 64 = 184 bytes with 12-byte IV.'
    ],
    explanation: 'ESP Tunnel adds outer IP (20B), ESP header (8B), ESP IV, padding to cipher block boundary, ESP trailer (2B), and ICV authentication tag (16B).'
  } as NumericQuestion,
  {
    id: 'm6-mcq-spd-sad',
    type: 'mcq',
    module: 'M6',
    topicId: 'ipsec',
    tags: ['firewall'],
    bloom: 'L3',
    difficulty: 2,
    marks: 1,
    timeSec: 30,
    prompt: 'In IPsec architecture, what is the fundamental difference between the Security Policy Database (SPD) and the Security Association Database (SAD)?',
    options: [
      'SPD specifies WHAT security treatment traffic receives (DISCARD, BYPASS, or PROTECT), while SAD stores the active cryptographic parameters (keys, SPI, algorithm, sequence numbers) to execute that protection',
      'SPD stores private RSA keys, while SAD stores public certificates',
      'SPD is used only for IPv6, while SAD is used only for IPv4',
      'SPD operates at the application layer, while SAD operates at Layer 2'
    ],
    answerIndex: 0,
    explanation: 'SPD contains policy selectors (source/destination IP, port, protocol) to decide whether to bypass, discard, or apply IPsec. SAD stores established unidirectional Security Associations (SAs) indexed by SPI, destination IP, and protocol.'
  },

  // ==========================================
  // TOPIC 4: SECURE EMAIL (PGP & S/MIME)
  // ==========================================
  {
    id: 'm6-order-pgp-pipeline',
    type: 'order',
    module: 'M6',
    topicId: 'secure-email',
    tags: ['crypto'],
    bloom: 'L3',
    difficulty: 2,
    marks: 3,
    timeSec: 60,
    prompt: 'Order the 5 sequential processing phases executed by Pretty Good Privacy (PGP) when Alice sends a signed and encrypted email to Bob:',
    items: [
      'Digital Signature: Alice hashes the plaintext and signs the hash using her private key',
      'Compression: The plaintext message and attached digital signature are compressed using ZIP/Deflate',
      'Symmetric Encryption: A one-time session key is generated and used to encrypt the compressed block',
      'Key Wrapping: The session key is encrypted using Bob public key and prepended to the ciphertext',
      'Radix-64 Conversion: The binary ciphertext package is converted to ASCII armor with a 24-bit CRC'
    ],
    correctOrder: [0, 1, 2, 3, 4],
    explanation: 'RFC 4880 specifies: 1. Sign (avoids need to decompress to verify), 2. Compress (reduces redundancy for cipher cryptanalysis), 3. Encrypt payload, 4. Wrap session key, 5. Radix-64 armor with 24-bit CRC.'
  } as OrderQuestion,
  {
    id: 'm6-tf-pgp-compress-before-encrypt',
    type: 'tf-why',
    module: 'M6',
    topicId: 'secure-email',
    tags: ['crypto'],
    bloom: 'L3',
    difficulty: 2,
    marks: 2,
    timeSec: 40,
    prompt: 'PGP deliberately compresses message data BEFORE symmetric encryption rather than after.',
    statement: 'PGP deliberately compresses message data BEFORE symmetric encryption rather than after.',
    isTrue: true,
    whyOptions: [
      'Compression flattens plaintext frequency distribution and removes redundancy, depriving cryptanalysts of statistical attack vectors, whereas ciphertext has maximum entropy and cannot be compressed',
      'Encrypted data is too fragile to withstand ZIP compression algorithms',
      'Public key algorithms cannot accept uncompressed data structures',
      'Email servers reject uncompressed MIME attachments by default'
    ],
    whyIndex: 0,
    explanation: 'High-quality ciphertext resembles random noise (high entropy) and cannot be meaningfully compressed. Furthermore, compressing plaintext first reduces language redundancy (e.g., letter frequency in English), significantly strengthening symmetric encryption against frequency analysis.'
  } as TfWhyQuestion,
  {
    id: 'm6-match-pgp-vs-smime',
    type: 'match',
    module: 'M6',
    topicId: 'secure-email',
    tags: ['crypto', 'auth'],
    bloom: 'L2',
    difficulty: 2,
    marks: 2,
    timeSec: 45,
    prompt: 'Contrast the trust models and key management mechanisms of PGP against S/MIME:',
    pairs: [
      ['PGP Trust Model', 'Decentralized "Web of Trust" where individuals sign and validate each other keys peer-to-peer'],
      ['S/MIME Trust Model', 'Hierarchical Public Key Infrastructure (PKI) rooted in commercial Certificate Authorities (X.509)'],
      ['PGP Key Distribution', 'Public keyserver network (HKP/HKPS) and personal fingerprint verification'],
      ['S/MIME Key Distribution', 'Corporate LDAP directories and X.509 certificates embedded directly in MIME signed messages']
    ],
    explanation: 'PGP is decentralized (Web of Trust), suited for grassroots privacy. S/MIME uses standard X.509 CAs, integrated into enterprise Microsoft Exchange and corporate mail systems.'
  } as MatchQuestion,
  {
    id: 'm6-numeric-radix64-expansion',
    type: 'numeric',
    module: 'M6',
    topicId: 'secure-email',
    tags: ['crypto'],
    bloom: 'L3',
    difficulty: 2,
    marks: 2,
    timeSec: 45,
    prompt: 'In PGP, binary cipher data is converted to ASCII Radix-64 armor (Base64). If an encrypted message payload is 1,200 binary bytes, how many ASCII armor characters are produced (excluding header, newline, and CRC)?',
    given: {
      'Input binary payload': '1,200 bytes (9,600 bits)',
      'Radix-64 conversion ratio': '3 binary bytes -> 4 ASCII characters (6 bits per char)'
    },
    answer: 1600,
    unit: 'ASCII characters',
    steps: [
      'Each 3 binary bytes (24 bits) map to 4 Radix-64 characters (6 bits each)',
      'Number of 3-byte blocks = 1,200 / 3 = 400 blocks',
      'Total ASCII characters = 400 * 4 = 1,600 characters',
      'Expansion factor = 4/3 = 133.33% (+33.3% overhead)'
    ],
    explanation: '1200 bytes / 3 * 4 = 1600 ASCII characters. Radix-64 expands binary data by exactly 33.3%.'
  } as NumericQuestion,

  // ==========================================
  // TOPIC 5: KEY MANAGEMENT & DISTRIBUTION
  // ==========================================
  {
    id: 'm6-numeric-pairwise-keys',
    type: 'numeric',
    module: 'M6',
    topicId: 'key-management',
    tags: ['crypto'],
    bloom: 'L3',
    difficulty: 2,
    marks: 2,
    timeSec: 45,
    prompt: 'In a purely symmetric cryptosystem without a Key Distribution Center (KDC), an organization with N = 100 employees requires every pair of employees to share a unique pairwise symmetric key. How many total keys must be generated and distributed?',
    given: {
      'Number of users (N)': '100',
      'Formula': 'N(N - 1) / 2'
    },
    answer: 4950,
    unit: 'keys',
    steps: [
      'Pairwise key formula: Total = N * (N - 1) / 2',
      'Substitute N = 100: Total = 100 * 99 / 2',
      'Total = 9,900 / 2 = 4,950 symmetric keys',
      'Contrast: With a central KDC, only N = 100 master keys are required!'
    ],
    explanation: 'Without a KDC, N users need N(N-1)/2 keys = 100 * 99 / 2 = 4,950 keys. A KDC scales as O(N) rather than O(N^2).'
  } as NumericQuestion,
  {
    id: 'm6-mcq-pfs-ephemeral',
    type: 'mcq',
    module: 'M6',
    topicId: 'key-management',
    tags: ['crypto'],
    bloom: 'L3',
    difficulty: 2,
    marks: 1,
    timeSec: 30,
    prompt: 'What architectural feature provides "Perfect Forward Secrecy" (PFS) in modern key exchange protocols?',
    options: [
      'Generating fresh, temporary ephemeral key pairs (DHE or ECDHE) for each session and immediately discarding them after deriving session keys, ensuring past traffic cannot be decrypted even if the server long-term private key is later compromised',
      'Using 4096-bit static RSA keys instead of 2048-bit keys',
      'Storing session keys inside read-only smartcards on client laptops',
      'Rotating user passwords every 30 days via Active Directory policies'
    ],
    answerIndex: 0,
    explanation: 'PFS guarantees that compromise of long-term server credentials does not compromise past session keys. Static RSA key exchange lacks PFS because decrypting past recorded traffic only requires the server static private key; Ephemeral Diffie-Hellman (DHE/ECDHE) ensures PFS.'
  },
  {
    id: 'm6-multi-kdc-tradeoffs',
    type: 'multi',
    module: 'M6',
    topicId: 'key-management',
    tags: ['auth', 'crypto'],
    bloom: 'L3',
    difficulty: 2,
    marks: 2,
    timeSec: 40,
    prompt: 'Which of the following are inherent security trade-offs and operational challenges when relying on a centralized Key Distribution Center (KDC)? (Select all that apply)',
    options: [
      'The KDC represents a single point of failure (SPOF) for network-wide authentication',
      'If the KDC is compromised, all user master keys and past/future session keys can be forged',
      'KDCs create performance bottlenecks during peak login times unless clustered with replication',
      'KDCs make it mathematically impossible to verify user identities'
    ],
    answerIndex: 0,
    answerIndexes: [0, 1, 2],
    explanation: 'Centralized KDCs represent a single point of failure, an ultra-high value target for adversaries, and a potential network bottleneck. However, they do provide strong identity verification.'
  } as MultiQuestion,

  // ==========================================
  // TOPIC 6: AI IN CYBERSECURITY & THREAT RESPONSE
  // ==========================================
  {
    id: 'm6-numeric-precision-recall',
    type: 'numeric',
    module: 'M6',
    topicId: 'ai-security',
    tags: ['ai'],
    bloom: 'L4',
    difficulty: 3,
    marks: 3,
    timeSec: 60,
    prompt: 'A machine learning Network Intrusion Detection System (NIDS) processes 10,000 traffic flows in a test set. Evaluation yields: True Positives (TP) = 90 attacks correctly flagged, False Positives (FP) = 10 benign flows flagged as attacks, and False Negatives (FN) = 10 attacks missed. What is the Precision of this model expressed as a percentage?',
    given: {
      'True Positives (TP)': '90',
      'False Positives (FP)': '10',
      'False Negatives (FN)': '10',
      'True Negatives (TN)': '9,890'
    },
    answer: 90,
    unit: '%',
    steps: [
      'Precision formula = TP / (TP + FP)',
      'Substitute values: Precision = 90 / (90 + 10) = 90 / 100',
      'Precision = 0.90 = 90%'
    ],
    explanation: 'Precision = TP / (TP + FP) = 90 / (90 + 10) = 90%. Out of all flows classified as malicious, 90% were true attacks.'
  } as NumericQuestion,
  {
    id: 'm6-numeric-f1-score',
    type: 'numeric',
    module: 'M6',
    topicId: 'ai-security',
    tags: ['ai'],
    bloom: 'L4',
    difficulty: 3,
    marks: 3,
    timeSec: 60,
    prompt: 'For the same NIDS model with TP = 90, FP = 10, and FN = 10, both Precision and Recall are 0.90 (90%). What is the model F1-Score?',
    given: {
      'Precision (P)': '0.90',
      'Recall (R)': '0.90',
      'F1 Formula': '2 * (P * R) / (P + R)'
    },
    answer: 0.9,
    tolerance: 0.01,
    steps: [
      'Recall = TP / (TP + FN) = 90 / (90 + 10) = 0.90',
      'F1 = 2 * (P * R) / (P + R)',
      'F1 = 2 * (0.90 * 0.90) / (0.90 + 0.90) = (2 * 0.81) / 1.80 = 1.62 / 1.80 = 0.90'
    ],
    explanation: 'F1 = 2 * (P * R) / (P + R) = 2 * 0.81 / 1.80 = 0.90. The harmonic mean balances precision and recall.'
  } as NumericQuestion,
  {
    id: 'm6-mcq-adversarial-evasion',
    type: 'mcq',
    module: 'M6',
    topicId: 'ai-security',
    tags: ['ai'],
    bloom: 'L4',
    difficulty: 3,
    marks: 2,
    timeSec: 45,
    prompt: 'In adversarial machine learning, what constitutes an "evasion attack" (such as Fast Gradient Sign Method or byte padding) against an AI malware classifier?',
    options: [
      'Applying minor, carefully calculated perturbations to malicious inputs at test time so that the classifier categorizes them as benign without impairing the malicious functionality',
      'Contaminating the training dataset with false labels to degrade future training runs',
      'Executing a denial of service attack against the GPU cluster hosting the neural network',
      'Brute forcing the administrator login credentials of the SIEM dashboard'
    ],
    answerIndex: 0,
    explanation: 'An evasion attack occurs during inference: the adversary perturbs features (e.g. appending non-functional benign bytes to a PE file) to push the sample across the decision boundary into the "benign" class while preserving its exploit behavior.'
  },
  {
    id: 'm6-multi-soar-playbooks',
    type: 'multi',
    module: 'M6',
    topicId: 'ai-security',
    tags: ['ai'],
    bloom: 'L3',
    difficulty: 2,
    marks: 2,
    timeSec: 40,
    prompt: 'What automated capabilities are provided by Security Orchestration, Automation, and Response (SOAR) platforms when integrated with AI anomaly detectors? (Select all that apply)',
    options: [
      'Automated IP quarantine and firewall rule updates upon high-confidence alert detection',
      'Automated enrichment of alerts by querying threat intelligence feeds (e.g., VirusTotal, AbuseIPDB)',
      'Automated isolation of compromised host endpoints via EDR API calls',
      'Replacing human security analysts with self-modifying autonomous worm software'
    ],
    answerIndexes: [0, 1, 2],
    explanation: 'SOAR executes automated playbooks for rapid containment: querying threat intel, updating firewall ACLs, revoking user tokens, and isolating endpoints via EDR APIs. They do not deploy self-modifying worms.'
  } as MultiQuestion,
  {
    id: 'm6-mcq-ai-anomaly-vs-signature',
    type: 'mcq',
    module: 'M6',
    topicId: 'ai-security',
    tags: ['ai'],
    bloom: 'L2',
    difficulty: 1,
    marks: 1,
    timeSec: 30,
    prompt: 'What is the primary operational advantage of AI/ML-based anomaly detection over traditional rule-based signature matching in enterprise networks?',
    options: [
      'Ability to detect novel, zero-day attacks and abnormal behavioral patterns that have no pre-existing signature rule',
      'Guaranteed zero false positive rate under all network traffic conditions',
      'Zero CPU and memory overhead compared to Snort rules',
      'Elimination of the need for encryption across all network protocols'
    ],
    answerIndex: 0,
    explanation: 'Signature-based systems only detect known threats with existing rule signatures. AI anomaly models learn baseline normality and flag behavioral deviations, enabling the detection of previously unseen zero-day attacks and stealthy lateral movement.'
  },
  {
    id: 'm6-tf-ai-poisoning-vs-evasion',
    type: 'tf-why',
    module: 'M6',
    topicId: 'ai-security',
    tags: ['ai'],
    bloom: 'L4',
    difficulty: 2,
    marks: 2,
    timeSec: 40,
    prompt: 'In AI security taxonomy, a "poisoning attack" differs fundamentally from an "evasion attack" based on which stage of the machine learning lifecycle is targeted.',
    statement: 'In AI security taxonomy, a "poisoning attack" differs fundamentally from an "evasion attack" based on which stage of the machine learning lifecycle is targeted.',
    isTrue: true,
    whyOptions: [
      'Poisoning targets the TRAINING phase by corrupting datasets or labels to inject backdoors, whereas evasion targets the INFERENCE (test) phase to bypass an already-trained model',
      'Poisoning is only possible against decision trees while evasion only works on neural networks',
      'Poisoning requires physical access to servers while evasion is executed remotely over DNS',
      'Poisoning increases the model accuracy while evasion reduces the training set size'
    ],
    whyIndex: 0,
    explanation: 'Poisoning attacks tamper with the training data (causative attack) to plant backdoors or degrade overall generalization. Evasion attacks modify live test inputs (exploratory attack) to trick a trained model into a misclassification.'
  } as TfWhyQuestion,
  {
    id: 'm6-mcq-kerberos-as-rep-contents',
    type: 'mcq',
    module: 'M6',
    topicId: 'kerberos',
    tags: ['auth'],
    bloom: 'L2',
    difficulty: 1,
    marks: 1,
    timeSec: 30,
    prompt: 'What cryptographic key does the Kerberos Authentication Server (AS) use to encrypt the Ticket Granting Ticket (TGT) inside the KRB_AS_REP message?',
    options: [
      'The secret master key shared between the AS and the Ticket Granting Server (K_TGS)',
      'The client password-derived master key (K_Client)',
      'The client public RSA certificate',
      'The transient session key K_C,TGS'
    ],
    answerIndex: 0,
    explanation: 'The TGT is encrypted using the secret master key of the TGS (K_TGS). Because the client does not possess K_TGS, the client cannot read or tamper with the TGT contents and simply forwards it untouched to the TGS in KRB_TGS_REQ.'
  },
  {
    id: 'm6-mcq-pgp-key-revocation',
    type: 'mcq',
    module: 'M6',
    topicId: 'secure-email',
    tags: ['crypto'],
    bloom: 'L3',
    difficulty: 2,
    marks: 1,
    timeSec: 30,
    prompt: 'If Alice private PGP key is compromised, how does Alice invalidate her key in the decentralized Web of Trust?',
    options: [
      'She generates a Key Revocation Certificate signed with her compromised key (or a designated revoker key) and uploads it to public PGP keyservers',
      'She submits a support ticket to the central PGP Root Authority to update the CRL',
      'She deletes her email address from DNS MX records',
      'All PGP keys expire automatically after 24 hours so no action is required'
    ],
    answerIndex: 0,
    explanation: 'In PGP decentralized architecture without CAs, users generate a Revocation Certificate (ideally in advance). If compromised, this certificate is published to public keyservers (e.g. keys.openpgp.org), informing peers that the key is dead.'
  }
]
