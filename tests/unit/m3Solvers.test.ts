import { describe, it, expect } from 'vitest'
import { computeHMACEducational, simulateLengthExtensionAttack } from '../../src/lib/crypto/hmac'
import {
  birthdayCollisionProbability,
  requiredTrialsForCollision,
  toyHash16,
  findBirthdayCollision,
  measureAvalanche
} from '../../src/lib/crypto/hashProperties'
import { simulateSponge } from '../../src/lib/crypto/sponge'
import {
  rsaSign,
  rsaVerify,
  simulateRsaMultiplicativeAttack,
  ecdsaSign,
  ecdsaVerify,
  exploitEcdsaNonceReuse
} from '../../src/lib/crypto/signatures'
import {
  validateCertificateChain,
  SAMPLE_ROOT_CA,
  SAMPLE_INTERMEDIATE_CA,
  SAMPLE_LEAF_CERT,
  X509Certificate
} from '../../src/lib/crypto/pki'
import { ECCurve, ECPoint, ecMultiply } from '../../src/lib/crypto/ecc'

describe('Module M3: Cryptographic Hashes and Digital Signatures Solvers', () => {

  // 1. HMAC & Length Extension
  describe('HMAC & Keyed Hashing', () => {
    it('computes educational HMAC with valid ipad and opad XOR operations', () => {
      const res = computeHMACEducational('secretkey', 'Transfer $500 to Bob', 16)
      expect(res.key).toBe('secretkey')
      expect(res.ipadHex.length).toBe(32) // 16 bytes = 32 hex chars
      expect(res.opadHex.length).toBe(32)
      expect(res.hmacResultHex.length).toBe(8) // 32-bit hex

      // Determinism
      const res2 = computeHMACEducational('secretkey', 'Transfer $500 to Bob', 16)
      expect(res.hmacResultHex).toBe(res2.hmacResultHex)

      // Key sensitivity
      const resDiffKey = computeHMACEducational('differentkey', 'Transfer $500 to Bob', 16)
      expect(res.hmacResultHex).not.toBe(resDiffKey.hmacResultHex)

      // Message sensitivity
      const resDiffMsg = computeHMACEducational('secretkey', 'Transfer $900 to Bob', 16)
      expect(res.hmacResultHex).not.toBe(resDiffMsg.hmacResultHex)
    })

    it('simulates Length Extension vulnerability on naive H(K || M) vs HMAC immunity', () => {
      const sim = simulateLengthExtensionAttack('msg=admin&role=user', '&role=root', 16)
      expect(sim.naiveVulnerable).toBe(true)
      expect(sim.hmacResistant).toBe(true)
      expect(sim.explanation).toContain('Merkle-Damgard')
    })
  })

  // 2. Hash Properties & Birthday Paradox
  describe('Hash Properties & Birthday Paradox', () => {
    it('calculates birthday collision probabilities and trial bounds', () => {
      // For 1 trial, collision probability is 0
      expect(birthdayCollisionProbability(1, 16)).toBe(0)

      // For 16-bit space (N = 65,536), 50% probability requires ~301 trials:
      // k ≈ 1.1774 * 2^8 = 301.4
      const trials50 = requiredTrialsForCollision(0.5, 16)
      expect(trials50).toBeGreaterThan(280)
      expect(trials50).toBeLessThan(320)

      const probAt301 = birthdayCollisionProbability(trials50, 16)
      expect(probAt301).toBeCloseTo(0.5, 1)
    })

    it('empirically finds a real collision in toy 16-bit hash via birthday search', () => {
      const col = findBirthdayCollision('test_prefix')
      expect(col.input1).not.toBe(col.input2)
      expect(toyHash16(col.input1)).toBe(toyHash16(col.input2))
      expect(col.hashVal).toBe(toyHash16(col.input1))
      // By birthday bound, trials should be small (< 1000)
      expect(col.trials).toBeLessThan(1000)
    })

    it('measures avalanche effect on 1-character difference', () => {
      const avalanche = measureAvalanche('The quick brown fox jumps over the lazy dog', 'The quick brown fox jumps over the lazy cog')
      expect(avalanche.totalBits).toBe(32)
      // Good diffusion flips between 25% and 75% of bits
      expect(avalanche.flippedBits).toBeGreaterThan(8)
      expect(avalanche.flippedBits).toBeLessThan(28)
      expect(avalanche.flipPercentage).toBeGreaterThanOrEqual(25)
    })
  })

  // 3. Sponge Construction (SHA-3)
  describe('Sponge Construction (Keccak / SHA-3)', () => {
    it('simulates absorbing and squeezing phases across state bitrate and capacity', () => {
      const sim = simulateSponge('SPONGE_TEST', 4, 4, 8)
      expect(sim.rateBytes).toBe(4)
      expect(sim.capacityBytes).toBe(4)
      expect(sim.stateWidthBytes).toBe(8)
      expect(sim.outputBytesRequested).toBe(8)
      expect(sim.finalDigestHex.length).toBe(16) // 8 bytes = 16 hex chars

      // Check phase sequence: init, absorb, permute, squeeze
      const phases = sim.steps.map(s => s.phase)
      expect(phases).toContain('init')
      expect(phases).toContain('absorb')
      expect(phases).toContain('permute')
      expect(phases).toContain('squeeze')

      // Squeezing should produce deterministic result for same input
      const sim2 = simulateSponge('SPONGE_TEST', 4, 4, 8)
      expect(sim.finalDigestHex).toBe(sim2.finalDigestHex)

      // Different message produces different output
      const simDiff = simulateSponge('SPONGE_TEST_DIFFERENT', 4, 4, 8)
      expect(sim.finalDigestHex).not.toBe(simDiff.finalDigestHex)
    })
  })

  // 4. Digital Signatures (RSA & ECDSA)
  describe('Digital Signatures: RSA & ECDSA', () => {
    it('generates and verifies RSA signature, detecting tampering', () => {
      // RSA keys with p=61, q=53 -> n=3233, e=17, d=2753
      const e = BigInt(17)
      const d = BigInt(2753)
      const n = BigInt(3233)
      const digest = BigInt(1234)

      // Sign: S = digest^d mod n
      const sig = rsaSign(digest, d, n)
      expect(sig > BigInt(0)).toBe(true)

      // Verify: S^e mod n == digest
      const isValid = rsaVerify(sig, digest, e, n)
      expect(isValid).toBe(true)

      // Tampered digest fails
      const tamperedDigest = BigInt(1235)
      expect(rsaVerify(sig, tamperedDigest, e, n)).toBe(false)

      // Tampered signature fails
      const tamperedSig = sig + BigInt(1)
      expect(rsaVerify(tamperedSig, digest, e, n)).toBe(false)
    })

    it('simulates multiplicative homomorphic attack on raw unhashed RSA', () => {
      const e = BigInt(17)
      const d = BigInt(2753)
      const n = BigInt(3233)
      const m1 = BigInt(10)
      const m2 = BigInt(20)

      const exploit = simulateRsaMultiplicativeAttack(m1, m2, e, d, n)
      expect(exploit.verified).toBe(true)
      expect(exploit.forgedM).toBe(BigInt(200))
      expect(exploit.defenseExplanation).toContain('Hash-then-Sign')
    })

    it('signs and verifies message with ECDSA over Weierstrass curve', () => {
      // Curve y^2 ≡ x^3 + 2 (mod 13)
      // G = (1, 4), prime group order n = 19
      const curve: ECCurve = { a: 0, b: 2, p: 13 }
      const G: ECPoint = { x: 1, y: 4 }
      const orderN = 19

      // Alice's private key d = 5, public key Q = 5 * G
      const d = 5
      const Q = ecMultiply(d, G, curve)!
      expect(Q).not.toBeNull()

      // ephemeral nonce k = 3, hash z = 9
      const k = 3
      const z = 9

      const sig = ecdsaSign(curve, G, orderN, d, z, k)
      expect(sig).not.toBeNull()
      if (!sig) return

      expect(sig.r).toBeGreaterThan(0)
      expect(sig.s).toBeGreaterThan(0)

      // Verify signature
      const valid = ecdsaVerify(curve, G, orderN, Q, z, sig)
      expect(valid).toBe(true)

      // Verify tampered message fails
      const tamperedZ = 10
      expect(ecdsaVerify(curve, G, orderN, Q, tamperedZ, sig)).toBe(false)
    })

    it('Sony PS3 Exploit: extracts master private key from reused nonce k', () => {
      const curve: ECCurve = { a: 0, b: 2, p: 13 }
      const G: ECPoint = { x: 1, y: 4 }
      const orderN = 19
      const secretD = 5
      const reusedK = 3

      const z1 = 9
      const z2 = 14

      const sig1 = ecdsaSign(curve, G, orderN, secretD, z1, reusedK)
      const sig2 = ecdsaSign(curve, G, orderN, secretD, z2, reusedK)

      expect(sig1).not.toBeNull()
      expect(sig2).not.toBeNull()
      if (!sig1 || !sig2) return

      // Notice r is identical because R = k * G
      expect(sig1.r).toBe(sig2.r)

      // Mallory exploits nonce reuse
      const exploit = exploitEcdsaNonceReuse(sig1, z1, sig2, z2, orderN)
      expect(exploit).not.toBeNull()
      if (!exploit) return

      expect(exploit.success).toBe(true)
      expect(exploit.recoveredK).toBe(reusedK)
      expect(exploit.recoveredPrivateKey).toBe(secretD)
    })
  })

  // 5. PKI & Certificate Chain Validation
  describe('PKI & Digital Certificate Chain', () => {
    it('validates a correct X.509 certificate chain to a trusted Root CA', () => {
      const chain = [SAMPLE_LEAF_CERT, SAMPLE_INTERMEDIATE_CA]
      const trustStore = [SAMPLE_ROOT_CA]

      const result = validateCertificateChain(
        chain,
        trustStore,
        new Date("2026-06-01T00:00:00Z")
      )

      expect(result.isValid).toBe(true)
      expect(result.errors).toHaveLength(0)
      expect(result.trustedRoot).toBe(SAMPLE_ROOT_CA.subject)
      expect(result.chainLength).toBe(3)
    })

    it('fails when a certificate in chain is expired', () => {
      const chain = [SAMPLE_LEAF_CERT, SAMPLE_INTERMEDIATE_CA]
      const trustStore = [SAMPLE_ROOT_CA]

      // Check on year 2028 when leaf cert (valid until 2027) is expired
      const result = validateCertificateChain(
        chain,
        trustStore,
        new Date("2028-01-01T00:00:00Z")
      )

      expect(result.isValid).toBe(false)
      expect(result.errors.some(e => e.includes('expired'))).toBe(true)
    })

    it('fails when a certificate has been revoked via CRL/OCSP', () => {
      const chain = [SAMPLE_LEAF_CERT, SAMPLE_INTERMEDIATE_CA]
      const trustStore = [SAMPLE_ROOT_CA]

      const result = validateCertificateChain(
        chain,
        trustStore,
        new Date("2026-06-01T00:00:00Z"),
        [SAMPLE_LEAF_CERT.serialNumber] // Leaf revoked
      )

      expect(result.isValid).toBe(false)
      expect(result.errors.some(e => e.includes('revoked'))).toBe(true)
    })

    it('fails when intermediate certificate lacks isCA flag', () => {
      const badIntermediate: X509Certificate = {
        ...SAMPLE_INTERMEDIATE_CA,
        isCA: false // Violates basic constraints!
      }
      const chain = [SAMPLE_LEAF_CERT, badIntermediate]
      const trustStore = [SAMPLE_ROOT_CA]

      const result = validateCertificateChain(
        chain,
        trustStore,
        new Date("2026-06-01T00:00:00Z")
      )

      expect(result.isValid).toBe(false)
      expect(result.errors.some(e => e.includes('BasicConstraints isCA=true'))).toBe(true)
    })

    it('fails when chain terminates at an untrusted root', () => {
      const chain = [SAMPLE_LEAF_CERT, SAMPLE_INTERMEDIATE_CA]
      const emptyTrustStore: X509Certificate[] = []

      const result = validateCertificateChain(
        chain,
        emptyTrustStore,
        new Date("2026-06-01T00:00:00Z")
      )

      expect(result.isValid).toBe(false)
      expect(result.errors.some(e => e.includes('not in the trusted Root CA store'))).toBe(true)
    })
  })
})
