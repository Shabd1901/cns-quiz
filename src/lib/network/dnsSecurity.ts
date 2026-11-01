/**
 * DNS Security: Kaminsky Cache Poisoning, DNS Tunneling & Exfiltration, and DNSSEC
 * Implements probabilistic analysis of cache poisoning, DNS exfiltration encoding/decoding,
 * Shannon entropy detection, and DNSSEC hierarchical validation.
 */

export interface KaminskySimulationResult {
  queriesSent: number
  spoofedRepliesSent: number
  txidBits: number
  portBits: number
  totalEntropyBits: number
  probabilitySuccess: number
  success: boolean
  explanation: string
}

/**
 * Simulates Dan Kaminsky's 2008 DNS Cache Poisoning vulnerability.
 *
 * Vulnerability Insight:
 * Traditional cache poisoning required waiting for an authoritative record (TTL) to expire.
 * Kaminsky discovered that querying random non-existent subdomains (`x101.bank.com`, `x102.bank.com`)
 * forces the recursive resolver to constantly ask the authoritative nameserver.
 * The attacker floods forged replies including an authoritative NS record (`bank.com IN NS ns.attacker.com`).
 * If one forged packet matches the 16-bit Transaction ID (TXID) before the real answer arrives,
 * the entire domain zone is poisoned!
 */
export function simulateKaminskyPoisoning(
  attempts = 100,
  randomizeSourcePort = true
): KaminskySimulationResult {
  const txidBits = 16
  const portBits = randomizeSourcePort ? 16 : 0 // Source port randomization (SPR) adds ~16 bits
  const totalEntropyBits = txidBits + portBits
  const spaceSize = Math.pow(2, totalEntropyBits)

  // Probability of at least one collision after N queries with M forged replies per query
  // Birthday attack approximation: P ≈ 1 - exp(- (attempts * forged_per_query) / spaceSize)
  const forgedPerAttempt = 50
  const totalForged = attempts * forgedPerAttempt

  // Exact collision probability over uniform space
  const prob = 1 - Math.exp(-totalForged / spaceSize)

  // Determine if this run succeeds
  const success = Math.random() < prob

  return {
    queriesSent: attempts,
    spoofedRepliesSent: totalForged,
    txidBits,
    portBits,
    totalEntropyBits,
    probabilitySuccess: Math.min(1.0, prob),
    success,
    explanation: randomizeSourcePort
      ? `Source Port Randomization enabled (${totalEntropyBits} bits of entropy = 2^32 space). Poisoning is statistically infeasible (~${(prob * 100).toFixed(4)}% chance).`
      : `Static source port used! Only 16 bits of TXID entropy (2^16 = 65,536 possibilities). Resolver is vulnerable to Kaminsky poisoning (~${(prob * 100).toFixed(2)}% chance).`
  }
}

/**
 * Calculates Shannon Entropy of a string.
 * Used by modern IDSes and DNS firewalls to detect DNS tunneling / covert channels.
 * Normal domains have entropy ~2.5 - 3.5; encoded Base32/Base64 exfiltration exceeds 4.2.
 */
export function calculateShannonEntropy(str: string): number {
  if (!str) return 0
  const freq: Record<string, number> = {}
  for (let i = 0; i < str.length; i++) {
    const char = str[i]
    freq[char] = (freq[char] || 0) + 1
  }

  let entropy = 0
  const len = str.length
  for (const char in freq) {
    const p = freq[char] / len
    entropy -= p * Math.log2(p)
  }

  return Number(entropy.toFixed(3))
}

const B32_ALPHABET = 'abcdefghijklmnopqrstuvwxyz234567'

function toBase32(bytes: Uint8Array): string {
  let bits = 0
  let value = 0
  let output = ''

  for (let i = 0; i < bytes.length; i++) {
    value = (value << 8) | bytes[i]
    bits += 8
    while (bits >= 5) {
      output += B32_ALPHABET[(value >>> (bits - 5)) & 31]
      bits -= 5
    }
  }

  if (bits > 0) {
    output += B32_ALPHABET[(value << (5 - bits)) & 31]
  }

  return output
}

function fromBase32(str: string): Uint8Array {
  const clean = str.toLowerCase().replace(/[^a-z2-7]/g, '')
  let bits = 0
  let value = 0
  const bytes: number[] = []

  for (let i = 0; i < clean.length; i++) {
    const idx = B32_ALPHABET.indexOf(clean[i])
    if (idx === -1) continue
    value = (value << 5) | idx
    bits += 5
    if (bits >= 8) {
      bytes.push((value >>> (bits - 8)) & 255)
      bits -= 8
    }
  }

  return new Uint8Array(bytes)
}

/**
 * Encodes sensitive plaintext into a series of DNS tunneling queries using Base32.
 * Simulates tools like `iodine` or `dnscat2`.
 */
export function encodeDnsTunnel(
  secretData: string,
  rootDomain = 'c2-server.net',
  maxChunkLen = 24
): {
  queries: string[]
  totalBytes: number
  averageEntropy: number
  isDetectedAsTunnel: boolean
} {
  const encoder = new TextEncoder()
  const rawBytes = encoder.encode(secretData)
  const b32 = toBase32(rawBytes)

  const chunks: string[] = []
  for (let i = 0; i < b32.length; i += maxChunkLen) {
    chunks.push(b32.slice(i, i + maxChunkLen))
  }

  const queries = chunks.map((chunk, idx) => `q${idx}.${chunk}.${rootDomain}`)

  const totalEntropy = queries.reduce((acc, q) => acc + calculateShannonEntropy(q.split('.')[1]), 0)
  const averageEntropy = chunks.length > 0 ? Number((totalEntropy / chunks.length).toFixed(3)) : 0

  return {
    queries,
    totalBytes: secretData.length,
    averageEntropy,
    isDetectedAsTunnel: averageEntropy > 3.0 // SOC IDS anomaly threshold for 24-char subdomains
  }
}

/**
 * Decodes Base32 DNS exfiltration subdomains back into plaintext.
 */
export function decodeDnsTunnel(queries: string[]): string {
  try {
    let combinedB32 = ''
    for (const q of queries) {
      const parts = q.split('.')
      if (parts.length >= 3) {
        combinedB32 += parts[1] // The base32 payload chunk
      }
    }

    const bytes = fromBase32(combinedB32)
    const decoder = new TextDecoder()
    return decoder.decode(bytes)
  } catch {
    return 'Failed to decode tunnel payload'
  }
}

/**
 * DNSSEC Validation Chain
 * Verifies the hierarchical trust chain: Root (.) -> TLD (.org) -> Domain (ietf.org).
 */
export interface DnssecTrustTier {
  zone: string
  keyType: 'KSK' | 'ZSK' | 'DS'
  keyTag: number
  algorithm: string
  signatureStatus: 'VALID' | 'INVALID' | 'BOGUS'
  details: string
}

export function validateDnssecChain(domain: string, injectTamper = false): {
  chain: DnssecTrustTier[]
  secure: boolean
  failureReason?: string
} {
  const chain: DnssecTrustTier[] = [
    {
      zone: '.',
      keyType: 'KSK',
      keyTag: 20326,
      algorithm: 'RSA/SHA-256 (Alg 8)',
      signatureStatus: 'VALID',
      details: 'ICANN Root Trust Anchor installed in local resolver.'
    },
    {
      zone: '.',
      keyType: 'DS',
      keyTag: 1862,
      algorithm: 'SHA-256 (Alg 2)',
      signatureStatus: 'VALID',
      details: 'Root zone signed Delegation Signer (DS) record pointing to .org TLD KSK.'
    },
    {
      zone: '.org',
      keyType: 'KSK',
      keyTag: 1862,
      algorithm: 'RSA/SHA-256',
      signatureStatus: 'VALID',
      details: '.org Key Signing Key verified against Root DS hash.'
    },
    {
      zone: domain,
      keyType: 'DS',
      keyTag: 34567,
      algorithm: 'SHA-256',
      signatureStatus: injectTamper ? 'BOGUS' : 'VALID',
      details: injectTamper
        ? 'CRITICAL: Hash mismatch! Parent DS record does not match domain DNSKEY public key.'
        : `TLD DS record matches ${domain} KSK hash.`
    },
    {
      zone: domain,
      keyType: 'ZSK',
      keyTag: 48921,
      algorithm: 'ECDSA P-256 (Alg 13)',
      signatureStatus: injectTamper ? 'INVALID' : 'VALID',
      details: injectTamper
        ? 'RRSIG signature verification failed. Untrusted response discarded.'
        : `RRSIG valid for A/AAAA records of ${domain}.`
    }
  ]

  const secure = !injectTamper

  return {
    chain,
    secure,
    failureReason: injectTamper ? 'DNSSEC BOGUS: Signature verification failed along chain of trust' : undefined
  }
}
