export type ModuleId = 'm1' | 'm2' | 'm3' | 'm4' | 'm5' | 'm6'
export type BloomLevel = 'L1' | 'L2' | 'L3' | 'L4'
export type ContentStatus = 'ready' | 'soon'

export interface TopicInfo {
  id: string
  title: string
  hours: number
  bloom: BloomLevel
  status: ContentStatus
  description: string
  tags: string[]
  isSelfLearning?: boolean
}

export interface ModuleInfo {
  id: ModuleId
  code: string
  title: string
  hours: number
  bloomRange: string
  status: ContentStatus
  description: string
  topics: TopicInfo[]
}

export const SYLLABUS: ModuleInfo[] = [
  {
    id: 'm1',
    code: 'M1',
    title: 'Introduction and Classical Cryptography',
    hours: 5,
    bloomRange: 'L1-L3',
    status: 'ready',
    description: 'Foundations of network security, OSI X.800 architecture, symmetric cipher models, classical substitution, transposition, product ciphers, and cryptanalysis.',
    topics: [
      {
        id: 'principles',
        title: 'Principles of Security',
        hours: 0.5,
        bloom: 'L1',
        status: 'ready',
        description: 'CIA triad (Confidentiality, Integrity, Availability), AAA framework, and Non-repudiation.',
        tags: ['crypto', 'auth']
      },
      {
        id: 'osi-architecture',
        title: 'OSI Security Architecture (X.800)',
        hours: 0.5,
        bloom: 'L2',
        status: 'ready',
        description: 'Systematic classification of security attacks (passive vs active), services, and mechanisms.',
        tags: ['crypto', 'attacks']
      },
      {
        id: 'symmetric-model',
        title: 'Symmetric Cipher Model',
        hours: 0.5,
        bloom: 'L2',
        status: 'ready',
        description: 'Five essential ingredients of symmetric encryption and Kerckhoffs’s principle.',
        tags: ['crypto']
      },
      {
        id: 'caesar',
        title: 'Caesar and Monoalphabetic Ciphers',
        hours: 0.5,
        bloom: 'L3',
        status: 'ready',
        description: 'Shift ciphers, brute-force search space (25 keys), monoalphabetic 26! permutations, and frequency analysis.',
        tags: ['crypto']
      },
      {
        id: 'affine',
        title: 'Affine Cipher',
        hours: 0.5,
        bloom: 'L3',
        status: 'ready',
        description: 'Modular arithmetic transformation E(x) = (ax + b) mod 26, coprime conditions, and modular inverse.',
        tags: ['crypto']
      },
      {
        id: 'playfair',
        title: 'Playfair Cipher',
        hours: 0.5,
        bloom: 'L3',
        status: 'ready',
        description: 'Digraph substitution on a 5x5 key matrix (I/J merged), filler X rules, and frequency flattening.',
        tags: ['crypto']
      },
      {
        id: 'vigenere',
        title: 'Vigenère Cipher',
        hours: 0.5,
        bloom: 'L3',
        status: 'ready',
        description: 'Polyalphabetic substitution table, repeating keystream, Kasiski examination, and index of coincidence.',
        tags: ['crypto']
      },
      {
        id: 'hill',
        title: 'Hill Cipher',
        hours: 0.5,
        bloom: 'L3',
        status: 'ready',
        description: 'Multiletter substitution via matrix multiplication modulo 26, determinants, and matrix inverses.',
        tags: ['crypto']
      },
      {
        id: 'transposition',
        title: 'Transposition: Keyless & Keyed',
        hours: 0.5,
        bloom: 'L2',
        status: 'ready',
        description: 'Permutation ciphers: Rail fence zigzag (keyless) and columnar transposition (keyed).',
        tags: ['crypto']
      },
      {
        id: 'product-ciphers',
        title: 'Product Ciphers',
        hours: 0.25,
        bloom: 'L2',
        status: 'ready',
        description: 'Shannon’s principles of confusion and diffusion via cascaded substitution-permutation stages.',
        tags: ['crypto']
      },
      {
        id: 'cryptanalysis',
        title: 'Cryptanalysis of Classical Ciphers',
        hours: 0.25,
        bloom: 'L3',
        status: 'ready',
        description: 'Attack models (ciphertext-only, known-plaintext, chosen-plaintext) and letter frequency matching.',
        tags: ['crypto', 'attacks']
      }
    ]
  },
  {
    id: 'm2',
    code: 'M2',
    title: 'Block Ciphers and Public Key Cryptography',
    hours: 8,
    bloomRange: 'L1-L3',
    status: 'ready',
    description: 'Feistel networks, block cipher modes (ECB, CBC, CFB, OFB, CTR), DES, AES, Blowfish, RC5, RSA, Rabin, ElGamal, ECC, Diffie-Hellman, and lightweight TEA.',
    topics: [
      { id: 'block-principles', title: 'Block Cipher Design Principles', hours: 0.5, bloom: 'L2', status: 'ready', description: 'SPN networks, avalanche effect, and round structures.', tags: ['crypto'] },
      { id: 'feistel', title: 'Feistel Structure', hours: 0.5, bloom: 'L2', status: 'ready', description: 'Reversible split-round architecture and round functions.', tags: ['crypto'] },
      { id: 'modes', title: 'Modes of Operation (ECB, CBC, CFB, OFB, CTR)', hours: 1.0, bloom: 'L3', status: 'ready', description: 'Chaining modes, IVs, error propagation, and stream conversions.', tags: ['crypto'] },
      { id: 'des', title: 'DES & 3DES', hours: 1.0, bloom: 'L2', status: 'ready', description: '56-bit key structure, 16 rounds, S-box non-linearity, and meet-in-the-middle.', tags: ['crypto'] },
      { id: 'aes', title: 'AES (Rijndael)', hours: 1.0, bloom: 'L3', status: 'ready', description: '128-bit state matrix, SubBytes, ShiftRows, MixColumns, AddRoundKey.', tags: ['crypto'] },
      { id: 'blowfish', title: 'Blowfish', hours: 0.5, bloom: 'L2', status: 'ready', description: 'Key-dependent S-boxes and variable key length (32-448 bits).', tags: ['crypto'] },
      { id: 'rc5', title: 'RC5', hours: 0.5, bloom: 'L2', status: 'ready', description: 'Data-dependent rotations and parameter flexibility.', tags: ['crypto'] },
      { id: 'public-key-principles', title: 'Public-Key Principles', hours: 0.5, bloom: 'L1', status: 'ready', description: 'Asymmetric key pairs and trapdoor one-way functions.', tags: ['crypto'] },
      { id: 'rsa', title: 'RSA Algorithm', hours: 1.0, bloom: 'L3', status: 'ready', description: 'Prime factorization hardness, Euler totient, and modular exponentiation.', tags: ['crypto'] },
      { id: 'rabin', title: 'Rabin Cryptosystem', hours: 0.5, bloom: 'L3', status: 'ready', description: 'Quadratic residues, factoring equivalence, and 4 square roots.', tags: ['crypto'] },
      { id: 'elgamal', title: 'ElGamal Cryptosystem', hours: 0.5, bloom: 'L3', status: 'ready', description: 'Diffie-Hellman discrete log foundation and randomized ciphertexts.', tags: ['crypto'] },
      { id: 'ecc', title: 'Elliptic Curve Cryptography (ECC)', hours: 0.5, bloom: 'L3', status: 'ready', description: 'Weierstrass curves over prime fields, point addition, and key size advantage.', tags: ['crypto'] },
      { id: 'diffie-hellman', title: 'Diffie-Hellman Key Exchange', hours: 0.5, bloom: 'L3', status: 'ready', description: 'Shared secret generation and man-in-the-middle vulnerabilities.', tags: ['crypto'] },
      { id: 'lightweight-tea', title: 'Lightweight Cryptography & TEA [SL]', hours: 0.5, bloom: 'L2', status: 'ready', isSelfLearning: true, description: 'IoT resource constraints, tiny encryption algorithm cycles, and delta constant.', tags: ['crypto'] }
    ]
  },
  {
    id: 'm3',
    code: 'M3',
    title: 'Cryptographic Hashes and Digital Signatures',
    hours: 7,
    bloomRange: 'L1-L4',
    status: 'ready',
    description: 'Message authentication requirements, MAC, HMAC, hash properties, MD5, SHA families, digital signature standards, RSA/ECC signatures, and PKI.',
    topics: [
      { id: 'auth-requirements', title: 'Authentication Requirements & Functions', hours: 1.0, bloom: 'L2', status: 'ready', description: 'Message confidentiality vs authenticity and non-repudiation.', tags: ['auth'] },
      { id: 'mac-hmac', title: 'MAC and HMAC', hours: 1.0, bloom: 'L3', status: 'ready', description: 'Keyed hash construction and nested hashing guarantees.', tags: ['auth', 'crypto'] },
      { id: 'hash-functions', title: 'Cryptographic Hash Properties', hours: 1.0, bloom: 'L2', status: 'ready', description: 'Pre-image resistance, second pre-image resistance, and collision resistance.', tags: ['crypto'] },
      { id: 'md5-sha', title: 'MD5, SHA-1, SHA-2, SHA-3', hours: 1.0, bloom: 'L3', status: 'ready', description: 'Merkle-Damgård construction, collision exploits, and sponge functions.', tags: ['crypto'] },
      { id: 'digital-signatures', title: 'Digital Signatures (RSA & ECDSA)', hours: 1.5, bloom: 'L3', status: 'ready', description: 'Sign with private key, verify with public key, hash-then-sign paradigm.', tags: ['crypto', 'auth'] },
      { id: 'pki-certificates', title: 'PKI & Digital Certificates', hours: 1.5, bloom: 'L4', status: 'ready', description: 'X.509 format, Certificate Authorities, trust chains, and revocation (CRL/OCSP).', tags: ['auth', 'tls'] }
    ]
  },
  {
    id: 'm4',
    code: 'M4',
    title: 'Protection of Computing Resources and Security Features',
    hours: 8,
    bloomRange: 'L1-L3',
    status: 'ready',
    description: 'Secure programming principles, software vulnerabilities, buffer overflow, malware defenses, user authentication, MFA, passwordless, and password attack mitigation.',
    topics: [
      { id: 'software-vulnerabilities', title: 'Software Vulnerabilities & Buffer Overflow', hours: 2.0, bloom: 'L3', status: 'ready', description: 'Stack frame manipulation, return address overwrite, shellcode, and canaries.', tags: ['attacks'] },
      { id: 'malware', title: 'Malware & Malicious Code', hours: 1.5, bloom: 'L2', status: 'ready', description: 'Viruses, worms, trojans, rootkits, and signature vs heuristic detection.', tags: ['attacks'] },
      { id: 'access-control', title: 'Control Mechanisms & Resource Protection', hours: 1.5, bloom: 'L2', status: 'ready', description: 'DAC, MAC, RBAC, least privilege, and separation of duties.', tags: ['auth'] },
      { id: 'auth-methods', title: 'User Authentication & Multi-Factor Auth', hours: 1.5, bloom: 'L2', status: 'ready', description: 'Knowledge, possession, inheritance factors, TOTP RFC 6238, and FIDO2/WebAuthn.', tags: ['auth'] },
      { id: 'password-security', title: 'Password Attacks & Selection Criteria', hours: 1.5, bloom: 'L2', status: 'ready', description: 'Brute force, dictionary attacks, rainbow tables, salting, and key stretching.', tags: ['auth'] }
    ]
  },
  {
    id: 'm5',
    code: 'M5',
    title: 'Network Security',
    hours: 10,
    bloomRange: 'L1-L4',
    status: 'ready',
    description: 'TCP/IP layer-wise vulnerabilities, sniffing, ARP spoofing, port scanning, IP spoofing, TCP SYN flood, DNS attacks, DoS/DDoS, firewalls, IDS/IPS, honeypots, zero trust, and cloud network basics.',
    topics: [
      { id: 'layer-vulnerabilities', title: 'TCP/IP Layer-Wise Vulnerabilities', hours: 1.5, bloom: 'L2', status: 'ready', description: 'Insecurity of standard protocols: Ethernet, ARP, IP, ICMP, TCP, UDP.', tags: ['attacks'] },
      { id: 'arp-sniffing', title: 'Packet Sniffing & ARP Spoofing', hours: 1.5, bloom: 'L3', status: 'ready', description: 'Promiscuous mode, ARP cache poisoning, and switched network MITM.', tags: ['attacks'] },
      { id: 'scanning-spoofing', title: 'Port Scanning & IP Spoofing', hours: 1.5, bloom: 'L3', status: 'ready', description: 'TCP SYN scan, FIN scan, decoy scanning, and address falsification.', tags: ['attacks', 'firewall'] },
      { id: 'dos-ddos', title: 'SYN Flood, DoS and DDoS Attacks', hours: 1.5, bloom: 'L4', status: 'ready', description: 'Half-open connections, backlog saturation, SYN cookies, and botnets.', tags: ['attacks'] },
      { id: 'dns-security', title: 'DNS Spoofing & DNS Tunneling', hours: 1.0, bloom: 'L3', status: 'ready', description: 'Cache poisoning, bailiwick rules, DNS exfiltration, and DNSSEC.', tags: ['attacks'] },
      { id: 'firewalls', title: 'Firewall Technologies', hours: 1.5, bloom: 'L3', status: 'ready', description: 'Packet filtering, stateful inspection, application proxy, and DMZ bastions.', tags: ['firewall'] },
      { id: 'ids-honeypots', title: 'IDS, IPS, Honeypots & Zero Trust', hours: 1.5, bloom: 'L4', status: 'ready', description: 'HIDS vs NIDS, signature vs anomaly, deception traps, and microsegmentation.', tags: ['ids', 'cloud'] }
    ]
  },
  {
    id: 'm6',
    code: 'M6',
    title: 'Network Security Applications',
    hours: 7,
    bloomRange: 'L1-L4',
    status: 'ready',
    description: 'Kerberos authentication service, SSL/TLS protocol architecture, IPsec (AH and ESP), secure email (PGP and S/MIME), key management, and AI in cybersecurity.',
    topics: [
      { id: 'kerberos', title: 'Kerberos Authentication', hours: 1.5, bloom: 'L3', status: 'ready', description: 'AS, TGS, ticket-granting tickets, session keys, and realm trust.', tags: ['auth'] },
      { id: 'tls-protocol', title: 'SSL / TLS Protocol Architecture', hours: 1.5, bloom: 'L4', status: 'ready', description: 'Handshake, record protocol, cipher suites, TLS 1.2 vs TLS 1.3 1-RTT.', tags: ['tls'] },
      { id: 'ipsec', title: 'IPsec (AH & ESP)', hours: 1.5, bloom: 'L3', status: 'ready', description: 'Transport vs tunnel mode, Authentication Header, Encapsulating Security Payload.', tags: ['firewall', 'crypto'] },
      { id: 'secure-email', title: 'Secure Email: PGP and S/MIME', hours: 1.0, bloom: 'L3', status: 'ready', description: 'Web of trust vs X.509 hierarchy, hybrid encryption, and detached signatures.', tags: ['crypto', 'auth'] },
      { id: 'key-management', title: 'Key Management & Distribution', hours: 0.5, bloom: 'L3', status: 'ready', description: 'KDC master keys, public key authorities, and Perfect Forward Secrecy.', tags: ['crypto', 'auth'] },
      { id: 'ai-security', title: 'AI in Cybersecurity & Threat Response', hours: 1.0, bloom: 'L4', status: 'ready', description: 'Machine learning for anomaly detection, adversarial ML, and automated SOAR response.', tags: ['ai'] }
    ]
  }
]

export function getModule(id: string): ModuleInfo | undefined {
  return SYLLABUS.find(m => m.id.toLowerCase() === id.toLowerCase() || m.code.toLowerCase() === id.toLowerCase())
}

export function getTopic(moduleId: string, topicId: string): TopicInfo | undefined {
  const mod = getModule(moduleId)
  if (!mod) return undefined
  return mod.topics.find(t => t.id.toLowerCase() === topicId.toLowerCase())
}

export * from './wpSyllabus'

