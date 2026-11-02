"use client"

import { useState, useMemo, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { caesarCipher, bruteForceCaesar } from "@/lib/crypto/caesar"
import { vigenereCipher } from "@/lib/crypto/vigenere"
import { generateRSAKeys, rsaEncrypt, rsaDecrypt } from "@/lib/crypto/rsa"
import { sha256 } from "@/lib/crypto/hash"
import {
  affineEncrypt,
  affineDecrypt,
  isValidAffineMultiplier,
  modInverse26,
  getValidAffineMultipliers
} from "@/lib/crypto/affine"
import {
  buildPlayfairMatrix,
  prepareDigraphs,
  playfairEncrypt,
  playfairDecrypt
} from "@/lib/crypto/playfair"
import {
  det2x2,
  isValidHillMatrix,
  invertMatrix2x2,
  hillEncrypt2x2,
  hillDecrypt2x2,
  Matrix2x2
} from "@/lib/crypto/hill"
import {
  railFenceEncrypt,
  railFenceDecrypt,
  columnarEncrypt,
  columnarDecrypt,
  getColumnOrder
} from "@/lib/crypto/transposition"
import {
  ENGLISH_LETTER_FREQUENCIES,
  computeFrequencies,
  indexOfCoincidence
} from "@/lib/crypto/cryptanalysis"
import { runNormalDH, runMitmDH } from "@/lib/crypto/diffieHellman"
import { ECCurve, isCurveNonSingular, ecMultiply, findCurvePoints, ECPoint } from "@/lib/crypto/ecc"
import { generateElGamalKey, elgamalEncrypt, elgamalDecrypt } from "@/lib/crypto/elgamal"
import { generateRabinKeys, rabinEncrypt, rabinDecrypt } from "@/lib/crypto/rabin"
import { teaEncrypt, teaDecrypt, TeaKey } from "@/lib/crypto/tea"
import { computeHMACEducational, simulateLengthExtensionAttack } from "@/lib/crypto/hmac"
import {
  requiredTrialsForCollision,
  findBirthdayCollision,
  CollisionResult
} from "@/lib/crypto/hashProperties"
import {
  rsaSign,
  rsaVerify,
  simulateRsaMultiplicativeAttack,
  ecdsaSign,
  ecdsaVerify,
  exploitEcdsaNonceReuse
} from "@/lib/crypto/signatures"
import {
  validateCertificateChain,
  SAMPLE_ROOT_CA,
  SAMPLE_INTERMEDIATE_CA,
  SAMPLE_LEAF_CERT,
  X509Certificate
} from "@/lib/crypto/pki"

export type CryptoPlaygroundTab =
  | 'caesar'
  | 'affine'
  | 'playfair'
  | 'vigenere'
  | 'hill'
  | 'transposition'
  | 'cryptanalysis'
  | 'rsa'
  | 'diffie-hellman'
  | 'ecc'
  | 'elgamal'
  | 'rabin'
  | 'tea'
  | 'hash'
  | 'hmac'
  | 'birthday'
  | 'signatures'
  | 'pki'

export interface CryptoPlaygroundProps {
  filter?: 'm1' | 'm2' | 'm3' | 'all'
  defaultTab?: CryptoPlaygroundTab
}

const ALL_CRYPTO_TABS: { id: CryptoPlaygroundTab; label: string; tag: string; module: 'm1' | 'm2' | 'm3' }[] = [
  { id: 'caesar', label: 'Caesar', tag: 'Shift', module: 'm1' },
  { id: 'affine', label: 'Affine', tag: 'Linear', module: 'm1' },
  { id: 'playfair', label: 'Playfair', tag: 'Digraph', module: 'm1' },
  { id: 'vigenere', label: 'Vigenère', tag: 'Poly', module: 'm1' },
  { id: 'hill', label: 'Hill', tag: 'Matrix', module: 'm1' },
  { id: 'transposition', label: 'Transposition', tag: 'Permute', module: 'm1' },
  { id: 'cryptanalysis', label: 'Cryptanalysis', tag: 'Freq / IoC', module: 'm1' },
  { id: 'rsa', label: 'RSA', tag: 'Asymmetric', module: 'm2' },
  { id: 'diffie-hellman', label: 'Diffie-Hellman', tag: 'M2 · Key', module: 'm2' },
  { id: 'ecc', label: 'ECC', tag: 'M2 · Curve', module: 'm2' },
  { id: 'elgamal', label: 'ElGamal', tag: 'M2 · DLP', module: 'm2' },
  { id: 'rabin', label: 'Rabin', tag: 'M2 · Roots', module: 'm2' },
  { id: 'tea', label: 'TEA', tag: 'M2 · IoT', module: 'm2' },
  { id: 'hash', label: 'SHA-256', tag: 'M3 · Digest', module: 'm3' },
  { id: 'hmac', label: 'HMAC', tag: 'M3 · RFC 2104', module: 'm3' },
  { id: 'birthday', label: 'Birthday Attack', tag: 'M3 · Collisions', module: 'm3' },
  { id: 'signatures', label: 'Signatures', tag: 'M3 · PS3 Hack', module: 'm3' },
  { id: 'pki', label: 'PKI & X.509', tag: 'M3 · Trust', module: 'm3' }
];

export default function CryptoPlayground({
  filter = 'all',
  defaultTab
}: CryptoPlaygroundProps = {}) {
  const tabs = filter === 'all' ? ALL_CRYPTO_TABS : ALL_CRYPTO_TABS.filter(t => t.module === filter);
  const [selectedTab, setSelectedTab] = useState<CryptoPlaygroundTab | null>(defaultTab || null);
  const activeTab = (selectedTab && tabs.some(t => t.id === selectedTab)) ? selectedTab : tabs[0].id;

  // --- 1. Caesar State ---
  const [caesarInput, setCaesarInput] = useState("HELLO WORLD")
  const [caesarShift, setCaesarShift] = useState(3)
  const caesarOutput = useMemo(() => caesarCipher(caesarInput, caesarShift), [caesarInput, caesarShift])
  const caesarBruteForce = useMemo(() => bruteForceCaesar(caesarOutput), [caesarOutput])

  // --- 2. Affine State ---
  const [affineInput, setAffineInput] = useState("AFFINE CIPHER")
  const [affineA, setAffineA] = useState(7)
  const [affineB, setAffineB] = useState(2)
  const validMultipliers = useMemo(() => getValidAffineMultipliers(26), [])
  const isAValid = isValidAffineMultiplier(affineA, 26)
  const aInverse = useMemo(() => modInverse26(affineA, 26), [affineA])
  const affineEncrypted = useMemo(() => {
    if (!isAValid) return "Invalid multiplier 'a'"
    try {
      return affineEncrypt(affineInput, affineA, affineB, 26)
    } catch {
      return "Error"
    }
  }, [affineInput, affineA, affineB, isAValid])
  const affineDecrypted = useMemo(() => {
    if (!isAValid) return "Invalid multiplier 'a'"
    try {
      return affineDecrypt(affineEncrypted, affineA, affineB, 26)
    } catch {
      return "Error"
    }
  }, [affineEncrypted, affineA, affineB, isAValid])

  // --- 3. Playfair State ---
  const [playfairInput, setPlayfairInput] = useState("INSTRUMENT")
  const [playfairKeyword, setPlayfairKeyword] = useState("MONARCHY")
  const playfairMatrix = useMemo(() => buildPlayfairMatrix(playfairKeyword), [playfairKeyword])
  const playfairDigraphs = useMemo(() => prepareDigraphs(playfairInput), [playfairInput])
  const playfairCipher = useMemo(() => {
    try {
      return playfairEncrypt(playfairInput, playfairKeyword)
    } catch {
      return "Error"
    }
  }, [playfairInput, playfairKeyword])
  const playfairDecrypted = useMemo(() => {
    try {
      return playfairDecrypt(playfairCipher, playfairKeyword)
    } catch {
      return "Error"
    }
  }, [playfairCipher, playfairKeyword])

  // --- 4. Vigenère State ---
  const [vigenereInput, setVigenereInput] = useState("ATTACK AT DAWN")
  const [vigenereKey, setVigenereKey] = useState("LEMON")
  const vigenereOutput = useMemo(() => vigenereCipher(vigenereInput, vigenereKey), [vigenereInput, vigenereKey])

  // --- 5. Hill State ---
  const [hillInput, setHillInput] = useState("ACT")
  const [h00, setH00] = useState(3)
  const [h01, setH01] = useState(3)
  const [h10, setH10] = useState(2)
  const [h11, setH11] = useState(5)
  const hillMatrix: Matrix2x2 = useMemo(() => [[h00, h01], [h10, h11]], [h00, h01, h10, h11])
  const hillDet = useMemo(() => det2x2(hillMatrix), [hillMatrix])
  const isHillValid = useMemo(() => isValidHillMatrix(hillMatrix), [hillMatrix])
  const hillInverse = useMemo(() => {
    if (!isHillValid) return null
    try {
      return invertMatrix2x2(hillMatrix)
    } catch {
      return null
    }
  }, [hillMatrix, isHillValid])
  const hillCipher = useMemo(() => {
    if (!isHillValid) return "Invalid key matrix (det has no inverse mod 26)"
    try {
      return hillEncrypt2x2(hillInput, hillMatrix)
    } catch {
      return "Error"
    }
  }, [hillInput, hillMatrix, isHillValid])
  const hillDecrypted = useMemo(() => {
    if (!isHillValid) return "Invalid key matrix"
    try {
      return hillDecrypt2x2(hillCipher, hillMatrix)
    } catch {
      return "Error"
    }
  }, [hillCipher, hillMatrix, isHillValid])

  // --- 6. Transposition State ---
  const [transInput, setTransInput] = useState("DEFEND THE EAST WALL")
  const [transType, setTransType] = useState<'rail' | 'columnar'>('rail')
  const [railDepth, setRailDepth] = useState(3)
  const [colKey, setColKey] = useState("ZEBRA")
  const railCipher = useMemo(() => railFenceEncrypt(transInput, railDepth), [transInput, railDepth])
  const railDecrypted = useMemo(() => railFenceDecrypt(railCipher, railDepth), [railCipher, railDepth])
  const colCipher = useMemo(() => columnarEncrypt(transInput, colKey), [transInput, colKey])
  const colDecrypted = useMemo(() => columnarDecrypt(colCipher, colKey), [colCipher, colKey])
  const colOrder = useMemo(() => getColumnOrder(colKey), [colKey])

  // --- 7. Cryptanalysis State ---
  const [cryptoAnalysisText, setCryptoAnalysisText] = useState(
    "WKH TXLFN EURZQ IRA MXPSV RYHU WKH ODCB GRJ DQG UXQV DZDB WR VDIHWB"
  )
  const textFreqs = useMemo(() => computeFrequencies(cryptoAnalysisText), [cryptoAnalysisText])
  const textIoC = useMemo(() => indexOfCoincidence(cryptoAnalysisText), [cryptoAnalysisText])

  // --- 8. RSA State ---
  const [rsaP, setRsaP] = useState(61)
  const [rsaQ, setRsaQ] = useState(53)
  const [rsaMessage, setRsaMessage] = useState(65)
  const rsaKeys = useMemo(() => generateRSAKeys(rsaP, rsaQ), [rsaP, rsaQ])
  let rsaEncrypted = ""
  let rsaDecrypted = ""
  if (rsaKeys) {
    try {
      const msg = BigInt(rsaMessage)
      const e = BigInt(rsaKeys.e)
      const n = BigInt(rsaKeys.n)
      const d = BigInt(rsaKeys.d)
      rsaEncrypted = rsaEncrypt(msg, e, n).toString()
      rsaDecrypted = rsaDecrypt(BigInt(rsaEncrypted), d, n).toString()
    } catch {
      rsaEncrypted = "Error"
    }
  }

  // --- 9. Hash State ---
  const [hashInput, setHashInput] = useState("CNS Security")
  const [hashOutput, setHashOutput] = useState("")
  useEffect(() => {
    sha256(hashInput).then(setHashOutput)
  }, [hashInput])

  // --- 10. Diffie-Hellman State ---
  const [dhP, setDhP] = useState(23)
  const [dhG, setDhG] = useState(5)
  const [dhA, setDhA] = useState(4)
  const [dhB, setDhB] = useState(3)
  const [dhMitm, setDhMitm] = useState(false)
  const dhResult = useMemo(() => {
    try {
      if (dhMitm) {
        return { isMitm: true as const, data: runMitmDH(dhP, dhG, dhA, dhB, 2) }
      }
      return { isMitm: false as const, data: runNormalDH(dhP, dhG, dhA, dhB) }
    } catch {
      return null
    }
  }, [dhP, dhG, dhA, dhB, dhMitm])

  // --- 11. ECC State ---
  const [eccA, setEccA] = useState(1)
  const [eccB, setEccB] = useState(6)
  const [eccP, setEccP] = useState(11)
  const [eccK, setEccK] = useState(2)
  const eccCurve: ECCurve = useMemo(() => ({ a: eccA, b: eccB, p: eccP }), [eccA, eccB, eccP])
  const eccIsNonSingular = useMemo(() => isCurveNonSingular(eccCurve), [eccCurve])
  const eccPoints = useMemo(() => eccIsNonSingular ? findCurvePoints(eccCurve) : [], [eccCurve, eccIsNonSingular])
  const [selectedPointIdx, setSelectedPointIdx] = useState(0)
  const selectedPoint = eccPoints[selectedPointIdx] || eccPoints[0] || null
  const eccMultResult = useMemo(() => {
    if (!selectedPoint || !eccIsNonSingular) return null
    return ecMultiply(eccK, selectedPoint, eccCurve)
  }, [selectedPoint, eccK, eccCurve, eccIsNonSingular])

  // --- 12. ElGamal State ---
  const [egP, setEgP] = useState(23)
  const [egG, setEgG] = useState(5)
  const [egX, setEgX] = useState(6)
  const [egMsg, setEgMsg] = useState(9)
  const [egK, setEgK] = useState(15)
  const elgamalData = useMemo(() => {
    try {
      const keys = generateElGamalKey(egP, egG, egX)
      const cipher = elgamalEncrypt(BigInt(egMsg), keys.p, keys.g, keys.y, BigInt(egK))
      const plain = elgamalDecrypt(cipher, keys.p, keys.x)
      return { keys, cipher, plain, error: null }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err)
      return { keys: null, cipher: null, plain: null, error: message }
    }
  }, [egP, egG, egX, egMsg, egK])

  // --- 13. Rabin State ---
  const [rabP, setRabP] = useState(7)
  const [rabQ, setRabQ] = useState(11)
  const [rabMsg, setRabMsg] = useState(20)
  const rabinData = useMemo(() => {
    try {
      const keys = generateRabinKeys(rabP, rabQ)
      if (!keys) return { error: "p and q must be distinct Blum primes (p ≡ q ≡ 3 mod 4)", keys: null, cipher: null, roots: null }
      const cipher = rabinEncrypt(BigInt(rabMsg), keys.n)
      const roots = rabinDecrypt(cipher, keys.p, keys.q)
      return { error: null, keys, cipher, roots }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err)
      return { error: message, keys: null, cipher: null, roots: null }
    }
  }, [rabP, rabQ, rabMsg])

  // --- 14. TEA State ---
  const [teaV0, setTeaV0] = useState(0x12345678)
  const [teaV1, setTeaV1] = useState(0x9ABCDEF0)
  const teaData = useMemo(() => {
    const key: TeaKey = [0xA56BABCD, 0x00000000, 0xFFFFFFFF, 0xABCDEF01]
    const enc = teaEncrypt({ v0: teaV0, v1: teaV1 }, key)
    const dec = teaDecrypt(enc, key)
    return { enc, dec }
  }, [teaV0, teaV1])

  // --- 15. M3: HMAC State ---
  const [hmacKey, setHmacKey] = useState("secret_key")
  const [hmacMsg, setHmacMsg] = useState("Transfer $500 to Bob")
  const [hmacExtMsg, setHmacExtMsg] = useState("&role=admin")
  const [hmacSimulateExt, setHmacSimulateExt] = useState(false)
  const hmacBreakdown = useMemo(() => computeHMACEducational(hmacKey, hmacMsg, 16), [hmacKey, hmacMsg])
  const lengthExtSim = useMemo(() => simulateLengthExtensionAttack(hmacMsg, hmacExtMsg, 16), [hmacMsg, hmacExtMsg])

  // --- 16. M3: Birthday Paradox State ---
  const [birthdayBits, setBirthdayBits] = useState(16)
  const [birthdayCollision, setBirthdayCollision] = useState<CollisionResult | null>(null)
  const [isSearchingCollision, setIsSearchingCollision] = useState(false)
  const requiredTrials50 = useMemo(() => requiredTrialsForCollision(0.5, birthdayBits), [birthdayBits])

  // --- 17. M3: Digital Signatures State ---
  const [sigDigest, setSigDigest] = useState(1234)
  const [sigRsaTampered, setSigRsaTampered] = useState(false)
  const [sigM1] = useState(10)
  const [sigM2] = useState(20)
  const [sigZ1] = useState(9)
  const [sigZ2] = useState(14)
  const [sigK] = useState(3)
  const [sigD] = useState(5)

  // RSA Sign Calculation
  const rsaSigData = useMemo(() => {
    const e = BigInt(17)
    const d = BigInt(2753)
    const n = BigInt(3233)
    const dgst = BigInt(sigDigest)
    const sig = rsaSign(dgst, d, n)
    const effectiveSig = sigRsaTampered ? sig + BigInt(1) : sig
    const isValid = rsaVerify(effectiveSig, dgst, e, n)
    const forgery = simulateRsaMultiplicativeAttack(BigInt(sigM1), BigInt(sigM2), e, d, n)
    return { e, d, n, sig, effectiveSig, isValid, forgery }
  }, [sigDigest, sigRsaTampered, sigM1, sigM2])

  // ECDSA Sign & PS3 Nonce Reuse Calculation
  const ecdsaData = useMemo(() => {
    const curve: ECCurve = { a: 0, b: 2, p: 13 }
    const G: ECPoint = { x: 1, y: 4 }
    const orderN = 19
    const Q = ecMultiply(sigD, G, curve)
    const sig1 = ecdsaSign(curve, G, orderN, sigD, sigZ1, sigK)
    const sig2 = ecdsaSign(curve, G, orderN, sigD, sigZ2, sigK)
    const isSig1Valid = sig1 && Q ? ecdsaVerify(curve, G, orderN, Q, sigZ1, sig1) : false
    const exploit = sig1 && sig2 ? exploitEcdsaNonceReuse(sig1, sigZ1, sig2, sigZ2, orderN) : null
    return { curve, G, orderN, Q, sig1, sig2, isSig1Valid, exploit }
  }, [sigD, sigZ1, sigZ2, sigK])

  // --- 18. M3: PKI Certificate Chain State ---
  const [pkiLeafExpired, setPkiLeafExpired] = useState(false)
  const [pkiLeafRevoked, setPkiLeafRevoked] = useState(false)
  const [pkiUntrustedRoot, setPkiUntrustedRoot] = useState(false)

  const pkiChainData = useMemo(() => {
    const leaf: X509Certificate = {
      ...SAMPLE_LEAF_CERT,
      validNotAfter: pkiLeafExpired ? "2024-01-01T00:00:00Z" : SAMPLE_LEAF_CERT.validNotAfter
    }
    const chain = [leaf, SAMPLE_INTERMEDIATE_CA]
    const trustStore = pkiUntrustedRoot ? [] : [SAMPLE_ROOT_CA]
    const revoked = pkiLeafRevoked ? [leaf.serialNumber] : []
    const validation = validateCertificateChain(chain, trustStore, new Date("2026-06-01T00:00:00Z"), revoked)
    return { chain, trustStore, validation }
  }, [pkiLeafExpired, pkiLeafRevoked, pkiUntrustedRoot])

  // Tabs are derived dynamically above via ALL_CRYPTO_TABS

  return (
    <div className="space-y-8">
      {/* Top Tab Navigation */}
      <div className="flex flex-wrap gap-2 border-b border-rule pb-3">
        {tabs.map(t => (
          <button
            key={t.id}
            onClick={() => setSelectedTab(t.id)}
            className={`px-3 py-1.5 font-mono text-xs uppercase tracking-wider transition-colors border ${
              activeTab === t.id
                ? 'bg-ink text-paper border-ink font-bold shadow-[2px_2px_0_var(--signal)]'
                : 'bg-card text-ink border-rule hover:border-ink'
            }`}
          >
            {t.label} <span className="opacity-60 text-[10px]">[{t.tag}]</span>
          </button>
        ))}
      </div>

      {/* --- CAESAR TAB --- */}
      {activeTab === 'caesar' && (
        <Card>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <span className="font-mono text-[10px] uppercase tracking-widest text-signal font-bold">M1 · Topic 4</span>
                <CardTitle className="font-serif text-2xl sm:text-3xl mt-1">Caesar Cipher</CardTitle>
              </div>
              <span className="font-mono text-xs px-2 py-1 bg-paper border border-rule text-ink-soft">Keyspace: 25</span>
            </div>
            <p className="text-ink-soft text-xs sm:text-sm font-sans mt-2">
              Monoalphabetic shift cipher: <code className="font-mono font-bold text-ink">C = (P + k) mod 26</code>.
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-4 sm:items-end">
              <div className="flex-1">
                <label className="font-mono text-[10px] uppercase tracking-wider font-bold mb-2 block text-ink">Plaintext (P)</label>
                <input
                  className="w-full p-3 border border-ink bg-paper font-mono text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal"
                  value={caesarInput}
                  onChange={e => setCaesarInput(e.target.value.toUpperCase())}
                />
              </div>
              <div className="w-full sm:w-36">
                <label className="font-mono text-[10px] uppercase tracking-wider font-bold mb-2 block text-ink">Shift (k: 0..25)</label>
                <input
                  type="number"
                  min="0"
                  max="25"
                  className="w-full p-3 border border-ink bg-paper font-mono text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal"
                  value={caesarShift}
                  onChange={e => setCaesarShift(parseInt(e.target.value) || 0)}
                />
              </div>
            </div>
            <div>
              <label className="font-mono text-[10px] uppercase tracking-wider font-bold mb-2 block text-signal">Ciphertext (C)</label>
              <div className="p-3 sm:p-4 bg-signal/10 border border-signal rounded-[4px] font-mono break-all text-sm text-ink font-bold tracking-widest">
                {caesarOutput}
              </div>
            </div>
            <details className="mt-4 border border-rule bg-paper rounded-[4px]">
              <summary className="cursor-pointer font-bold text-ink p-3 sm:p-4 font-mono text-xs uppercase tracking-wider bg-card hover:bg-rule transition-colors">
                Launch Brute-Force Key Exhaustion (25 Keys)
              </summary>
              <div className="p-3 sm:p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2 text-[11px] font-mono max-h-64 overflow-y-auto">
                {caesarBruteForce.map(b => (
                  <div
                    key={b.shift}
                    className={`p-2 border ${b.shift === caesarShift ? "border-signal bg-signal/10 text-signal font-bold" : "border-transparent text-ink-soft"}`}
                  >
                    k={b.shift}: {b.result}
                  </div>
                ))}
              </div>
            </details>
          </CardContent>
        </Card>
      )}

      {/* --- AFFINE TAB --- */}
      {activeTab === 'affine' && (
        <Card>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <span className="font-mono text-[10px] uppercase tracking-widest text-signal font-bold">M1 · Topic 5</span>
                <CardTitle className="font-serif text-2xl sm:text-3xl mt-1">Affine Cipher</CardTitle>
              </div>
              <span className="font-mono text-xs px-2 py-1 bg-paper border border-rule text-ink-soft">Keyspace: 12 × 26 = 312</span>
            </div>
            <p className="text-ink-soft text-xs sm:text-sm font-sans mt-2">
              Linear modular transformation: <code className="font-mono font-bold text-ink">C ≡ (a·P + b) mod 26</code>. Multiplier <code className="font-mono font-bold text-ink">a</code> must satisfy <code className="font-mono font-bold text-ink">gcd(a, 26) = 1</code>.
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-1">
                <label className="font-mono text-[10px] uppercase tracking-wider font-bold mb-2 block text-ink">
                  Multiplier a (Coprime to 26)
                </label>
                <select
                  value={affineA}
                  onChange={e => setAffineA(parseInt(e.target.value))}
                  className="w-full p-3 border border-ink bg-paper font-mono text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal"
                >
                  {validMultipliers.map(m => (
                    <option key={m} value={m}>
                      a = {m} (a⁻¹ mod 26 = {modInverse26(m, 26)})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="font-mono text-[10px] uppercase tracking-wider font-bold mb-2 block text-ink">
                  Shift b (0..25)
                </label>
                <input
                  type="number"
                  min="0"
                  max="25"
                  value={affineB}
                  onChange={e => setAffineB(parseInt(e.target.value) || 0)}
                  className="w-full p-3 border border-ink bg-paper font-mono text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal"
                />
              </div>
              <div>
                <label className="font-mono text-[10px] uppercase tracking-wider font-bold mb-2 block text-ink">
                  Modular Inverse a⁻¹
                </label>
                <div className="p-3 bg-card border border-rule font-mono text-sm text-ink font-bold">
                  {aInverse !== null ? `a⁻¹ = ${aInverse}` : 'No inverse'}
                </div>
              </div>
            </div>

            <div>
              <label className="font-mono text-[10px] uppercase tracking-wider font-bold mb-2 block text-ink">Plaintext (P)</label>
              <input
                className="w-full p-3 border border-ink bg-paper font-mono text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal"
                value={affineInput}
                onChange={e => setAffineInput(e.target.value.toUpperCase())}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="font-mono text-[10px] uppercase tracking-wider font-bold mb-2 block text-signal">
                  Ciphertext C ≡ ({affineA}·P + {affineB}) mod 26
                </label>
                <div className="p-3 bg-signal/10 border border-signal rounded-[4px] font-mono break-all text-sm text-ink font-bold tracking-widest">
                  {affineEncrypted}
                </div>
              </div>
              <div>
                <label className="font-mono text-[10px] uppercase tracking-wider font-bold mb-2 block text-ok">
                  Decrypted P ≡ {aInverse}·(C - {affineB}) mod 26
                </label>
                <div className="p-3 bg-ok/10 border border-ok rounded-[4px] font-mono break-all text-sm text-ink font-bold tracking-widest">
                  {affineDecrypted}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* --- PLAYFAIR TAB --- */}
      {activeTab === 'playfair' && (
        <Card>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <span className="font-mono text-[10px] uppercase tracking-widest text-signal font-bold">M1 · Topic 6</span>
                <CardTitle className="font-serif text-2xl sm:text-3xl mt-1">Playfair Cipher</CardTitle>
              </div>
              <span className="font-mono text-xs px-2 py-1 bg-paper border border-rule text-ink-soft">5×5 Matrix · Digraphs</span>
            </div>
            <p className="text-ink-soft text-xs sm:text-sm font-sans mt-2">
              Digraph substitution using a 5×5 key matrix (I/J merged). Rules: same row (shift right), same column (shift down), rectangle (swap columns).
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="font-mono text-[10px] uppercase tracking-wider font-bold mb-2 block text-ink">
                  Keyword
                </label>
                <input
                  className="w-full p-3 border border-ink bg-paper font-mono text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal uppercase"
                  value={playfairKeyword}
                  onChange={e => setPlayfairKeyword(e.target.value.toUpperCase())}
                />

                <div className="mt-4">
                  <label className="font-mono text-[10px] uppercase tracking-wider font-bold mb-2 block text-ink">
                    Plaintext
                  </label>
                  <input
                    className="w-full p-3 border border-ink bg-paper font-mono text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal uppercase"
                    value={playfairInput}
                    onChange={e => setPlayfairInput(e.target.value.toUpperCase())}
                  />
                </div>

                <div className="mt-4 p-3 bg-card border border-rule font-mono text-xs">
                  <span className="text-ink-soft block text-[10px] uppercase">Digraph Pairs (with filler X):</span>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {playfairDigraphs.map(([a, b], idx) => (
                      <span key={idx} className="px-2 py-0.5 bg-paper border border-ink font-bold">
                        {a}{b}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* 5x5 Key Matrix Display */}
              <div>
                <label className="font-mono text-[10px] uppercase tracking-wider font-bold mb-2 block text-ink">
                  5×5 Key Matrix
                </label>
                <div className="inline-block p-3 bg-card border border-ink shadow-[4px_4px_0_var(--rule)]">
                  <div className="grid grid-cols-5 gap-1.5">
                    {playfairMatrix.map((row, r) =>
                      row.map((ch, c) => (
                        <div
                          key={`${r}-${c}`}
                          className="w-9 h-9 flex items-center justify-center font-mono font-bold text-sm bg-paper border border-rule hover:border-signal hover:text-signal transition-colors"
                        >
                          {ch}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="font-mono text-[10px] uppercase tracking-wider font-bold mb-2 block text-signal">
                  Ciphertext
                </label>
                <div className="p-3 bg-signal/10 border border-signal rounded-[4px] font-mono break-all text-sm text-ink font-bold tracking-widest">
                  {playfairCipher}
                </div>
              </div>
              <div>
                <label className="font-mono text-[10px] uppercase tracking-wider font-bold mb-2 block text-ok">
                  Decrypted Text
                </label>
                <div className="p-3 bg-ok/10 border border-ok rounded-[4px] font-mono break-all text-sm text-ink font-bold tracking-widest">
                  {playfairDecrypted}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* --- VIGENÈRE TAB --- */}
      {activeTab === 'vigenere' && (
        <Card>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <span className="font-mono text-[10px] uppercase tracking-widest text-signal font-bold">M1 · Topic 7</span>
                <CardTitle className="font-serif text-2xl sm:text-3xl mt-1">Vigenère Cipher</CardTitle>
              </div>
              <span className="font-mono text-xs px-2 py-1 bg-paper border border-rule text-ink-soft">Polyalphabetic</span>
            </div>
            <p className="text-ink-soft text-xs sm:text-sm font-sans mt-2">
              Polyalphabetic substitution with repeating keyword: <code className="font-mono font-bold text-ink">C_i = (P_i + K_(i mod d)) mod 26</code>.
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="font-mono text-[10px] uppercase tracking-wider font-bold mb-2 block text-ink">Plaintext</label>
                <input
                  className="w-full p-3 border border-ink bg-paper font-mono text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal"
                  value={vigenereInput}
                  onChange={e => setVigenereInput(e.target.value.toUpperCase())}
                />
              </div>
              <div>
                <label className="font-mono text-[10px] uppercase tracking-wider font-bold mb-2 block text-ink">Keyword</label>
                <input
                  className="w-full p-3 border border-ink bg-paper font-mono text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal uppercase"
                  value={vigenereKey}
                  onChange={e => setVigenereKey(e.target.value.toUpperCase())}
                />
              </div>
            </div>
            <div>
              <label className="font-mono text-[10px] uppercase tracking-wider font-bold mb-2 block text-signal">Ciphertext</label>
              <div className="p-3 sm:p-4 bg-signal/10 border border-signal rounded-[4px] font-mono break-all text-sm text-ink font-bold tracking-widest">
                {vigenereOutput}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* --- HILL TAB --- */}
      {activeTab === 'hill' && (
        <Card>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <span className="font-mono text-[10px] uppercase tracking-widest text-signal font-bold">M1 · Topic 8</span>
                <CardTitle className="font-serif text-2xl sm:text-3xl mt-1">Hill Cipher (2×2 Matrix)</CardTitle>
              </div>
              <span className="font-mono text-xs px-2 py-1 bg-paper border border-rule text-ink-soft">Linear Algebra mod 26</span>
            </div>
            <p className="text-ink-soft text-xs sm:text-sm font-sans mt-2">
              Block cipher via matrix multiplication: <code className="font-mono font-bold text-ink">C = P · K mod 26</code>. Invertible only when <code className="font-mono font-bold text-ink">gcd(det(K), 26) = 1</code>.
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="font-mono text-[10px] uppercase tracking-wider font-bold mb-2 block text-ink">
                  2×2 Key Matrix K
                </label>
                <div className="inline-block p-4 bg-card border border-ink shadow-[4px_4px_0_var(--rule)]">
                  <div className="grid grid-cols-2 gap-3 w-44">
                    <input
                      type="number"
                      className="p-2 border border-ink bg-paper font-mono text-center font-bold"
                      value={h00}
                      onChange={e => setH00(parseInt(e.target.value) || 0)}
                    />
                    <input
                      type="number"
                      className="p-2 border border-ink bg-paper font-mono text-center font-bold"
                      value={h01}
                      onChange={e => setH01(parseInt(e.target.value) || 0)}
                    />
                    <input
                      type="number"
                      className="p-2 border border-ink bg-paper font-mono text-center font-bold"
                      value={h10}
                      onChange={e => setH10(parseInt(e.target.value) || 0)}
                    />
                    <input
                      type="number"
                      className="p-2 border border-ink bg-paper font-mono text-center font-bold"
                      value={h11}
                      onChange={e => setH11(parseInt(e.target.value) || 0)}
                    />
                  </div>
                </div>

                <div className="mt-4 p-3 bg-paper border border-rule font-mono text-xs space-y-1">
                  <div>
                    <span className="text-ink-soft">Determinant det(K): </span>
                    <strong className={isHillValid ? 'text-ok' : 'text-bad'}>{hillDet} mod 26</strong>
                  </div>
                  <div>
                    <span className="text-ink-soft">Status: </span>
                    <strong className={isHillValid ? 'text-ok' : 'text-bad'}>
                      {isHillValid ? 'Invertible (Valid Key)' : 'Singular / Not Coprime (Invalid Key)'}
                    </strong>
                  </div>
                  {hillInverse && (
                    <div className="text-[11px] text-ink-soft pt-1 border-t border-rule">
                      Inverse K⁻¹: [[{hillInverse[0][0]}, {hillInverse[0][1]}], [{hillInverse[1][0]}, {hillInverse[1][1]}]]
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="font-mono text-[10px] uppercase tracking-wider font-bold mb-2 block text-ink">
                  Plaintext (P)
                </label>
                <input
                  className="w-full p-3 border border-ink bg-paper font-mono text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal uppercase"
                  value={hillInput}
                  onChange={e => setHillInput(e.target.value.toUpperCase())}
                />

                <div className="mt-4 space-y-3">
                  <div>
                    <label className="font-mono text-[10px] uppercase tracking-wider font-bold mb-1 block text-signal">
                      Ciphertext (C)
                    </label>
                    <div className="p-3 bg-signal/10 border border-signal rounded-[4px] font-mono break-all text-sm text-ink font-bold tracking-widest">
                      {hillCipher}
                    </div>
                  </div>
                  <div>
                    <label className="font-mono text-[10px] uppercase tracking-wider font-bold mb-1 block text-ok">
                      Decrypted (P)
                    </label>
                    <div className="p-3 bg-ok/10 border border-ok rounded-[4px] font-mono break-all text-sm text-ink font-bold tracking-widest">
                      {hillDecrypted}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* --- TRANSPOSITION TAB --- */}
      {activeTab === 'transposition' && (
        <Card>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <span className="font-mono text-[10px] uppercase tracking-widest text-signal font-bold">M1 · Topic 9</span>
                <CardTitle className="font-serif text-2xl sm:text-3xl mt-1">Transposition Ciphers</CardTitle>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setTransType('rail')}
                  className={`px-2 py-1 font-mono text-xs border ${transType === 'rail' ? 'bg-ink text-paper border-ink' : 'bg-paper text-ink border-rule'}`}
                >
                  Rail Fence
                </button>
                <button
                  onClick={() => setTransType('columnar')}
                  className={`px-2 py-1 font-mono text-xs border ${transType === 'columnar' ? 'bg-ink text-paper border-ink' : 'bg-paper text-ink border-rule'}`}
                >
                  Columnar
                </button>
              </div>
            </div>
            <p className="text-ink-soft text-xs sm:text-sm font-sans mt-2">
              Permutation ciphers rearrange the order of symbols without altering individual character identities.
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <label className="font-mono text-[10px] uppercase tracking-wider font-bold mb-2 block text-ink">Plaintext</label>
              <input
                className="w-full p-3 border border-ink bg-paper font-mono text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal"
                value={transInput}
                onChange={e => setTransInput(e.target.value.toUpperCase())}
              />
            </div>

            {transType === 'rail' ? (
              <div className="space-y-4">
                <div className="w-48">
                  <label className="font-mono text-[10px] uppercase tracking-wider font-bold mb-2 block text-ink">Rail Depth (d)</label>
                  <input
                    type="number"
                    min="2"
                    max="10"
                    className="w-full p-3 border border-ink bg-paper font-mono text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal"
                    value={railDepth}
                    onChange={e => setRailDepth(parseInt(e.target.value) || 2)}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="font-mono text-[10px] uppercase tracking-wider font-bold mb-1 block text-signal">
                      Rail Fence Ciphertext
                    </label>
                    <div className="p-3 bg-signal/10 border border-signal rounded-[4px] font-mono break-all text-sm text-ink font-bold tracking-widest">
                      {railCipher}
                    </div>
                  </div>
                  <div>
                    <label className="font-mono text-[10px] uppercase tracking-wider font-bold mb-1 block text-ok">
                      Decrypted Plaintext
                    </label>
                    <div className="p-3 bg-ok/10 border border-ok rounded-[4px] font-mono break-all text-sm text-ink font-bold tracking-widest">
                      {railDecrypted}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="w-64">
                  <label className="font-mono text-[10px] uppercase tracking-wider font-bold mb-2 block text-ink">Transposition Key</label>
                  <input
                    className="w-full p-3 border border-ink bg-paper font-mono text-sm uppercase focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal"
                    value={colKey}
                    onChange={e => setColKey(e.target.value.toUpperCase())}
                  />
                  <span className="text-[10px] font-mono text-ink-soft mt-1 block">
                    Column Order: [{colOrder.join(', ')}]
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="font-mono text-[10px] uppercase tracking-wider font-bold mb-1 block text-signal">
                      Columnar Ciphertext
                    </label>
                    <div className="p-3 bg-signal/10 border border-signal rounded-[4px] font-mono break-all text-sm text-ink font-bold tracking-widest">
                      {colCipher}
                    </div>
                  </div>
                  <div>
                    <label className="font-mono text-[10px] uppercase tracking-wider font-bold mb-1 block text-ok">
                      Decrypted Plaintext
                    </label>
                    <div className="p-3 bg-ok/10 border border-ok rounded-[4px] font-mono break-all text-sm text-ink font-bold tracking-widest">
                      {colDecrypted}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* --- CRYPTANALYSIS TAB --- */}
      {activeTab === 'cryptanalysis' && (
        <Card>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <span className="font-mono text-[10px] uppercase tracking-widest text-signal font-bold">M1 · Topic 11</span>
                <CardTitle className="font-serif text-2xl sm:text-3xl mt-1">Cryptanalysis & Statistical Profiler</CardTitle>
              </div>
              <span className="font-mono text-xs px-2 py-1 bg-paper border border-rule text-ink-soft">Al-Kindi Frequency Analysis</span>
            </div>
            <p className="text-ink-soft text-xs sm:text-sm font-sans mt-2">
              Inspect letter unigram distributions and Index of Coincidence (IoC) to detect monoalphabetic vs polyalphabetic encryption.
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <label className="font-mono text-[10px] uppercase tracking-wider font-bold mb-2 block text-ink">
                Intercepted Ciphertext / Sample Text
              </label>
              <textarea
                rows={3}
                className="w-full p-3 border border-ink bg-paper font-mono text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal uppercase"
                value={cryptoAnalysisText}
                onChange={e => setCryptoAnalysisText(e.target.value.toUpperCase())}
              />
            </div>

            {/* Metric Strip */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-xs">
              <div className="p-3 bg-paper border border-rule">
                <span className="text-ink-soft block text-[10px]">Index of Coincidence (IoC)</span>
                <strong className="text-lg text-signal">{textIoC.toFixed(4)}</strong>
                <span className="text-[10px] text-ink-soft block mt-1">
                  (English ≈ 0.065, Random/Poly ≈ 0.038)
                </span>
              </div>
              <div className="p-3 bg-paper border border-rule">
                <span className="text-ink-soft block text-[10px]">Cipher Profile Classification</span>
                <strong className="text-lg text-ink">
                  {textIoC > 0.055 ? 'Monoalphabetic' : 'Polyalphabetic / High Entropy'}
                </strong>
                <span className="text-[10px] text-ink-soft block mt-1">Based on IoC threshold</span>
              </div>
              <div className="p-3 bg-paper border border-rule">
                <span className="text-ink-soft block text-[10px]">Total Alphabetic Characters</span>
                <strong className="text-lg text-ink">
                  {cryptoAnalysisText.replace(/[^A-Z]/g, '').length}
                </strong>
                <span className="text-[10px] text-ink-soft block mt-1">Min 30 letters recommended</span>
              </div>
            </div>

            {/* Frequency Bar Chart */}
            <div className="p-4 bg-paper border border-rule">
              <div className="font-mono text-xs uppercase text-ink-soft mb-3 flex justify-between">
                <span>Letter Frequencies vs English Standard</span>
                <span className="text-[10px]">Vermilion = Observed, Gray = English Reference</span>
              </div>
              <div className="grid grid-cols-13 sm:grid-cols-26 gap-1 items-end h-36 border-b border-rule pb-1">
                {"ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").map(ch => {
                  const obsPct = textFreqs[ch] || 0
                  const refPct = ENGLISH_LETTER_FREQUENCIES[ch] || 0
                  const obsHeight = Math.min(100, Math.round(obsPct * 7))
                  const refHeight = Math.min(100, Math.round(refPct * 7))
                  return (
                    <div key={ch} className="flex flex-col items-center h-full justify-end group relative">
                      <div className="w-full flex items-end justify-center gap-0.5 h-full">
                        {/* Reference English (gray) */}
                        <div
                          style={{ height: `${refHeight}%` }}
                          className="w-1.5 bg-rule rounded-t-sm"
                          title={`English ${ch}: ${refPct.toFixed(1)}%`}
                        />
                        {/* Observed (signal) */}
                        <div
                          style={{ height: `${obsHeight}%` }}
                          className="w-1.5 bg-signal rounded-t-sm"
                          title={`Observed ${ch}: ${obsPct.toFixed(1)}%`}
                        />
                      </div>
                      <span className="font-mono text-[9px] font-bold text-ink mt-1">{ch}</span>
                    </div>
                  )
                })}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* --- RSA TAB --- */}
      {activeTab === 'rsa' && (
        <Card>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <span className="font-mono text-[10px] uppercase tracking-widest text-signal font-bold">M2 · Topic Preview</span>
                <CardTitle className="font-serif text-2xl sm:text-3xl mt-1">RSA (Public-Key Simulation)</CardTitle>
              </div>
              <span className="font-mono text-xs px-2 py-1 bg-paper border border-rule text-ink-soft">Trapdoor Permutation</span>
            </div>
            <p className="text-ink-soft text-xs sm:text-sm font-sans mt-2">Using small primes for visibility. Real RSA uses 2048+ bit primes.</p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-b border-rule pb-6">
              <div>
                <label className="font-mono text-[10px] uppercase tracking-wider font-bold mb-2 block text-ink">Prime p</label>
                <input
                  type="number"
                  className="w-full p-3 border border-ink bg-paper font-mono focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal"
                  value={rsaP}
                  onChange={e => setRsaP(parseInt(e.target.value) || 0)}
                />
              </div>
              <div>
                <label className="font-mono text-[10px] uppercase tracking-wider font-bold mb-2 block text-ink">Prime q</label>
                <input
                  type="number"
                  className="w-full p-3 border border-ink bg-paper font-mono focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal"
                  value={rsaQ}
                  onChange={e => setRsaQ(parseInt(e.target.value) || 0)}
                />
              </div>
            </div>

            {rsaKeys ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-sm">
                <div className="p-4 border border-rule bg-card space-y-2">
                  <div className="flex justify-between border-b border-rule pb-2">
                    <span className="text-ink-soft">Modulus (n = p·q)</span>
                    <strong className="text-ink">{rsaKeys.n}</strong>
                  </div>
                  <div className="flex justify-between pt-2">
                    <span className="text-ink-soft">Totient φ(n) = (p-1)(q-1)</span>
                    <strong className="text-ink">{rsaKeys.phi}</strong>
                  </div>
                </div>
                <div className="p-4 border border-rule bg-card space-y-2">
                  <div className="flex justify-between border-b border-rule pb-2">
                    <span className="text-signal font-bold uppercase text-[10px] tracking-wider">Public Key (e)</span>
                    <strong className="text-signal">{rsaKeys.e}</strong>
                  </div>
                  <div className="flex justify-between pt-2">
                    <span className="text-bad font-bold uppercase text-[10px] tracking-wider">Private Key (d)</span>
                    <strong className="text-bad">{rsaKeys.d}</strong>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-4 bg-bad/10 text-bad border border-bad font-mono text-sm">Invalid primes.</div>
            )}

            <div className="pt-4 border-t border-rule space-y-4">
              <div>
                <label className="font-mono text-[10px] uppercase tracking-wider font-bold mb-2 block text-ink">Message (Number M &lt; n)</label>
                <input
                  type="number"
                  className="w-full sm:w-1/2 p-3 border border-ink bg-paper font-mono focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal"
                  value={rsaMessage}
                  onChange={e => setRsaMessage(parseInt(e.target.value) || 0)}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-sm">
                <div className="p-4 border border-signal bg-signal/5">
                  <div className="text-[10px] uppercase tracking-wider text-signal mb-2">Encrypted (M<sup>e</sup> mod n)</div>
                  <div className="text-2xl text-ink break-all font-bold">{rsaEncrypted}</div>
                </div>
                <div className="p-4 border border-ok bg-ok/5">
                  <div className="text-[10px] uppercase tracking-wider text-ok mb-2">Decrypted (C<sup>d</sup> mod n)</div>
                  <div className="text-2xl text-ink break-all font-bold">{rsaDecrypted}</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* --- DIFFIE-HELLMAN TAB --- */}
      {activeTab === 'diffie-hellman' && (
        <Card>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <span className="font-mono text-[10px] uppercase tracking-widest text-signal font-bold">M2 · Topic 13</span>
                <CardTitle className="font-serif text-2xl sm:text-3xl mt-1">Diffie-Hellman Key Exchange</CardTitle>
              </div>
              <span className="font-mono text-xs px-2 py-1 bg-paper border border-rule text-ink-soft">DLP Protocol</span>
            </div>
            <p className="text-ink-soft text-xs sm:text-sm font-sans mt-2">
              Public key agreement protocol establishing a shared symmetric secret over untrusted channels: <code className="font-mono font-bold text-ink">K = g^(ab) mod p</code>.
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div>
                <label className="font-mono text-[10px] uppercase tracking-wider font-bold mb-1 block text-ink">Prime (p)</label>
                <input
                  type="number"
                  className="w-full p-2.5 border border-ink bg-paper font-mono text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal"
                  value={dhP}
                  onChange={e => setDhP(parseInt(e.target.value) || 23)}
                />
              </div>
              <div>
                <label className="font-mono text-[10px] uppercase tracking-wider font-bold mb-1 block text-ink">Generator (g)</label>
                <input
                  type="number"
                  className="w-full p-2.5 border border-ink bg-paper font-mono text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal"
                  value={dhG}
                  onChange={e => setDhG(parseInt(e.target.value) || 5)}
                />
              </div>
              <div>
                <label className="font-mono text-[10px] uppercase tracking-wider font-bold mb-1 block text-ink">Alice Private (a)</label>
                <input
                  type="number"
                  className="w-full p-2.5 border border-ink bg-paper font-mono text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal"
                  value={dhA}
                  onChange={e => setDhA(parseInt(e.target.value) || 4)}
                />
              </div>
              <div>
                <label className="font-mono text-[10px] uppercase tracking-wider font-bold mb-1 block text-ink">Bob Private (b)</label>
                <input
                  type="number"
                  className="w-full p-2.5 border border-ink bg-paper font-mono text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal"
                  value={dhB}
                  onChange={e => setDhB(parseInt(e.target.value) || 3)}
                />
              </div>
            </div>

            <div className="flex items-center gap-2 p-3 bg-paper border border-rule">
              <input
                type="checkbox"
                id="dh-mitm-toggle"
                checked={dhMitm}
                onChange={e => setDhMitm(e.target.checked)}
                className="accent-signal cursor-pointer"
              />
              <label htmlFor="dh-mitm-toggle" className="font-mono text-xs text-ink cursor-pointer select-none">
                Simulate active Mallory Man-in-the-Middle (MitM) interception
              </label>
            </div>

            {dhResult && !dhResult.isMitm && 'sharedSecretAlice' in dhResult.data && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono text-xs">
                  <div className="p-4 border border-rule bg-card">
                    <div className="font-bold text-signal uppercase mb-1">Alice Public Value</div>
                    <div className="text-sm">Y_A = g^a mod p = {dhG}^{dhA} mod {dhP} = <span className="font-bold text-ink">{dhResult.data.alice.publicKey.toString()}</span></div>
                  </div>
                  <div className="p-4 border border-rule bg-card">
                    <div className="font-bold text-signal uppercase mb-1">Bob Public Value</div>
                    <div className="text-sm">Y_B = g^b mod p = {dhG}^{dhB} mod {dhP} = <span className="font-bold text-ink">{dhResult.data.bob.publicKey.toString()}</span></div>
                  </div>
                </div>

                <div className="p-4 border border-ok bg-ok/5 font-mono text-center">
                  <div className="text-[10px] uppercase tracking-wider text-ok font-bold mb-1">Shared Symmetric Key Established</div>
                  <div className="text-2xl font-bold text-ink">K = {dhResult.data.sharedSecretAlice?.toString()}</div>
                  <div className="text-[11px] text-ink-soft mt-1">Alice: (Y_B)^a mod p = {dhResult.data.sharedSecretAlice?.toString()} | Bob: (Y_A)^b mod p = {dhResult.data.sharedSecretBob?.toString()}</div>
                </div>
              </div>
            )}

            {dhResult && dhResult.isMitm && 'mallory' in dhResult.data && (
              <div className="p-4 border border-bad bg-bad/5 font-mono space-y-3 text-xs">
                <div className="font-bold text-bad uppercase tracking-wider">Compromised! Mallory Intercepted Communications</div>
                <p className="text-ink-soft">Because unauthenticated DH lacks digital signatures, Mallory substituted her rogue public key:</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-2 border border-bad/30 bg-paper">
                    <div className="text-[10px] text-bad font-bold">Alice &lt;-&gt; Mallory Key</div>
                    <div className="text-base font-bold text-ink">K_AM = {dhResult.data.mallory.secretWithAlice.toString()}</div>
                  </div>
                  <div className="p-2 border border-bad/30 bg-paper">
                    <div className="text-[10px] text-bad font-bold">Mallory &lt;-&gt; Bob Key</div>
                    <div className="text-base font-bold text-ink">K_MB = {dhResult.data.mallory.secretWithBob.toString()}</div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* --- ECC TAB --- */}
      {activeTab === 'ecc' && (
        <Card>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <span className="font-mono text-[10px] uppercase tracking-widest text-signal font-bold">M2 · Topic 12</span>
                <CardTitle className="font-serif text-2xl sm:text-3xl mt-1">Elliptic Curve Cryptography</CardTitle>
              </div>
              <span className={`font-mono text-xs px-2 py-1 border ${eccIsNonSingular ? 'bg-ok/10 text-ok border-ok' : 'bg-bad/10 text-bad border-bad'}`}>
                {eccIsNonSingular ? 'Non-Singular' : 'Singular (Invalid)'}
              </span>
            </div>
            <p className="text-ink-soft text-xs sm:text-sm font-sans mt-2">
              Weierstrass curve over prime field F_p: <code className="font-mono font-bold text-ink">y² ≡ x³ + ax + b (mod p)</code>.
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div>
                <label className="font-mono text-[10px] uppercase tracking-wider font-bold mb-1 block text-ink">Param a</label>
                <input
                  type="number"
                  className="w-full p-2.5 border border-ink bg-paper font-mono text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal"
                  value={eccA}
                  onChange={e => setEccA(parseInt(e.target.value) || 0)}
                />
              </div>
              <div>
                <label className="font-mono text-[10px] uppercase tracking-wider font-bold mb-1 block text-ink">Param b</label>
                <input
                  type="number"
                  className="w-full p-2.5 border border-ink bg-paper font-mono text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal"
                  value={eccB}
                  onChange={e => setEccB(parseInt(e.target.value) || 0)}
                />
              </div>
              <div>
                <label className="font-mono text-[10px] uppercase tracking-wider font-bold mb-1 block text-ink">Prime (p)</label>
                <input
                  type="number"
                  className="w-full p-2.5 border border-ink bg-paper font-mono text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal"
                  value={eccP}
                  onChange={e => setEccP(parseInt(e.target.value) || 11)}
                />
              </div>
              <div>
                <label className="font-mono text-[10px] uppercase tracking-wider font-bold mb-1 block text-ink">Scalar k (k·P)</label>
                <input
                  type="number"
                  min="1"
                  max="20"
                  className="w-full p-2.5 border border-ink bg-paper font-mono text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal"
                  value={eccK}
                  onChange={e => setEccK(parseInt(e.target.value) || 1)}
                />
              </div>
            </div>

            {eccIsNonSingular ? (
              <div className="space-y-4">
                <div>
                  <label className="font-mono text-[10px] uppercase tracking-wider font-bold mb-2 block text-ink">Select Base Point P on Curve ({eccPoints.length} rational points found)</label>
                  <div className="flex flex-wrap gap-2 max-h-28 overflow-y-auto p-2 border border-rule bg-card">
                    {eccPoints.map((pt, idx) => (
                      <button
                        key={`${pt.x}-${pt.y}`}
                        onClick={() => setSelectedPointIdx(idx)}
                        className={`px-2 py-1 font-mono text-xs border ${
                          selectedPointIdx === idx
                            ? 'bg-signal text-paper border-signal font-bold'
                            : 'bg-paper text-ink border-rule hover:border-ink'
                        }`}
                      >
                        ({pt.x}, {pt.y})
                      </button>
                    ))}
                  </div>
                </div>

                {selectedPoint && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono text-xs">
                    <div className="p-4 border border-rule bg-card">
                      <div className="font-bold text-signal uppercase mb-1">Base Point P</div>
                      <div className="text-xl font-bold text-ink">P = ({selectedPoint.x}, {selectedPoint.y})</div>
                      <div className="text-[10px] text-ink-soft mt-1">LHS: {selectedPoint.y}² mod {eccP} = {(selectedPoint.y * selectedPoint.y) % eccP} | RHS: ({selectedPoint.x}³+{eccA}·{selectedPoint.x}+{eccB}) mod {eccP} = {((selectedPoint.x**3 + eccA*selectedPoint.x + eccB) % eccP + eccP) % eccP}</div>
                    </div>
                    <div className="p-4 border border-ok bg-ok/5">
                      <div className="font-bold text-ok uppercase mb-1">Scalar Product: Q = {eccK} · P</div>
                      <div className="text-xl font-bold text-ink">
                        {eccMultResult ? `(${eccMultResult.x}, ${eccMultResult.y})` : 'Point at Infinity (O)'}
                      </div>
                      <div className="text-[10px] text-ink-soft mt-1">Computed via Double-and-Add algorithm</div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="p-4 bg-bad/10 text-bad border border-bad font-mono text-xs">
                Singular curve! 4a³ + 27b² ≡ 0 (mod {eccP}). Cusps or nodes present; group law undefined.
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* --- ELGAMAL TAB --- */}
      {activeTab === 'elgamal' && (
        <Card>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <span className="font-mono text-[10px] uppercase tracking-widest text-signal font-bold">M2 · Topic 11</span>
                <CardTitle className="font-serif text-2xl sm:text-3xl mt-1">ElGamal Cryptosystem</CardTitle>
              </div>
              <span className="font-mono text-xs px-2 py-1 bg-paper border border-rule text-ink-soft">Probabilistic DLP</span>
            </div>
            <p className="text-ink-soft text-xs sm:text-sm font-sans mt-2">
              Randomized asymmetric encryption producing ciphertext pairs <code className="font-mono font-bold text-ink">(c1 = g^k mod p, c2 = M·y^k mod p)</code>.
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              <div>
                <label className="font-mono text-[10px] uppercase tracking-wider font-bold mb-1 block text-ink">Prime (p)</label>
                <input
                  type="number"
                  className="w-full p-2 border border-ink bg-paper font-mono text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal"
                  value={egP}
                  onChange={e => setEgP(parseInt(e.target.value) || 23)}
                />
              </div>
              <div>
                <label className="font-mono text-[10px] uppercase tracking-wider font-bold mb-1 block text-ink">Generator (g)</label>
                <input
                  type="number"
                  className="w-full p-2 border border-ink bg-paper font-mono text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal"
                  value={egG}
                  onChange={e => setEgG(parseInt(e.target.value) || 5)}
                />
              </div>
              <div>
                <label className="font-mono text-[10px] uppercase tracking-wider font-bold mb-1 block text-ink">Private Key (x)</label>
                <input
                  type="number"
                  className="w-full p-2 border border-ink bg-paper font-mono text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal"
                  value={egX}
                  onChange={e => setEgX(parseInt(e.target.value) || 6)}
                />
              </div>
              <div>
                <label className="font-mono text-[10px] uppercase tracking-wider font-bold mb-1 block text-ink">Message (M &lt; p)</label>
                <input
                  type="number"
                  className="w-full p-2 border border-ink bg-paper font-mono text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal"
                  value={egMsg}
                  onChange={e => setEgMsg(parseInt(e.target.value) || 9)}
                />
              </div>
              <div>
                <label className="font-mono text-[10px] uppercase tracking-wider font-bold mb-1 block text-ink">Ephemeral (k)</label>
                <input
                  type="number"
                  className="w-full p-2 border border-ink bg-paper font-mono text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal"
                  value={egK}
                  onChange={e => setEgK(parseInt(e.target.value) || 15)}
                />
              </div>
            </div>

            {elgamalData.error ? (
              <div className="p-4 bg-bad/10 text-bad border border-bad font-mono text-xs">{elgamalData.error}</div>
            ) : elgamalData.keys && elgamalData.cipher && (
              <div className="space-y-4 font-mono text-xs">
                <div className="p-3 border border-rule bg-card">
                  <div className="font-bold text-signal uppercase mb-1">Public Key y = g^x mod p</div>
                  <div className="text-base font-bold text-ink">y = {elgamalData.keys.y.toString()} (Published: p={egP}, g={egG}, y={elgamalData.keys.y.toString()})</div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 border border-signal bg-signal/5">
                    <div className="font-bold text-signal uppercase mb-1">Ciphertext Pair (c1, c2)</div>
                    <div className="text-xl font-bold text-ink">
                      c1 = {elgamalData.cipher.c1.toString()} | c2 = {elgamalData.cipher.c2.toString()}
                    </div>
                    <div className="text-[10px] text-ink-soft mt-1">c1 = g^k mod p | c2 = (M · y^k) mod p</div>
                  </div>
                  <div className="p-4 border border-ok bg-ok/5">
                    <div className="font-bold text-ok uppercase mb-1">Decrypted Plaintext</div>
                    <div className="text-xl font-bold text-ink">M = {elgamalData.plain?.toString()}</div>
                    <div className="text-[10px] text-ink-soft mt-1">M = c2 · (c1^x)⁻¹ mod p (Restored!)</div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* --- RABIN TAB --- */}
      {activeTab === 'rabin' && (
        <Card>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <span className="font-mono text-[10px] uppercase tracking-widest text-signal font-bold">M2 · Topic 10</span>
                <CardTitle className="font-serif text-2xl sm:text-3xl mt-1">Rabin Cryptosystem</CardTitle>
              </div>
              <span className="font-mono text-xs px-2 py-1 bg-paper border border-rule text-ink-soft">4-Root Ambiguity</span>
            </div>
            <p className="text-ink-soft text-xs sm:text-sm font-sans mt-2">
              Provably secure asymmetric squaring cipher: <code className="font-mono font-bold text-ink">C = M² mod n</code>, decrypted via CRT into four square roots.
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="font-mono text-[10px] uppercase tracking-wider font-bold mb-1 block text-ink">Blum Prime p (p ≡ 3 mod 4)</label>
                <input
                  type="number"
                  className="w-full p-2.5 border border-ink bg-paper font-mono text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal"
                  value={rabP}
                  onChange={e => setRabP(parseInt(e.target.value) || 7)}
                />
              </div>
              <div>
                <label className="font-mono text-[10px] uppercase tracking-wider font-bold mb-1 block text-ink">Blum Prime q (q ≡ 3 mod 4)</label>
                <input
                  type="number"
                  className="w-full p-2.5 border border-ink bg-paper font-mono text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal"
                  value={rabQ}
                  onChange={e => setRabQ(parseInt(e.target.value) || 11)}
                />
              </div>
              <div>
                <label className="font-mono text-[10px] uppercase tracking-wider font-bold mb-1 block text-ink">Message (M &lt; pq)</label>
                <input
                  type="number"
                  className="w-full p-2.5 border border-ink bg-paper font-mono text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal"
                  value={rabMsg}
                  onChange={e => setRabMsg(parseInt(e.target.value) || 20)}
                />
              </div>
            </div>

            {rabinData.error ? (
              <div className="p-4 bg-bad/10 text-bad border border-bad font-mono text-xs">{rabinData.error}</div>
            ) : rabinData.keys && rabinData.cipher && rabinData.roots && (
              <div className="space-y-4 font-mono text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 border border-rule bg-card">
                    <div className="font-bold text-signal uppercase mb-1">Public Modulus n = p · q</div>
                    <div className="text-xl font-bold text-ink">n = {rabinData.keys.n.toString()}</div>
                    <div className="text-[10px] text-ink-soft mt-1">p = {rabP}, q = {rabQ}</div>
                  </div>
                  <div className="p-4 border border-signal bg-signal/5">
                    <div className="font-bold text-signal uppercase mb-1">Encrypted (C = M² mod n)</div>
                    <div className="text-xl font-bold text-ink">C = {rabinData.cipher.toString()}</div>
                    <div className="text-[10px] text-ink-soft mt-1">{rabMsg}² mod {rabinData.keys.n.toString()} = {rabinData.cipher.toString()}</div>
                  </div>
                </div>

                <div className="p-4 border border-ok bg-ok/5">
                  <div className="font-bold text-ok uppercase mb-2">Chinese Remainder Theorem 4 Candidate Roots</div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
                    {[rabinData.roots.r1, rabinData.roots.r2, rabinData.roots.r3, rabinData.roots.r4].map((r, idx) => {
                      const isOriginal = r.toString() === rabMsg.toString()
                      return (
                        <div key={idx} className={`p-2 border ${isOriginal ? 'bg-ok/20 border-ok font-bold text-ink' : 'bg-paper border-rule text-ink-soft'}`}>
                          <div className="text-[10px] uppercase">Root r{idx + 1}</div>
                          <div className="text-lg">{r.toString()}</div>
                          {isOriginal && <div className="text-[9px] text-ok font-bold uppercase mt-1">Original Match</div>}
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* --- TEA TAB --- */}
      {activeTab === 'tea' && (
        <Card>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <span className="font-mono text-[10px] uppercase tracking-widest text-signal font-bold">M2 · Topic 14</span>
                <CardTitle className="font-serif text-2xl sm:text-3xl mt-1">Tiny Encryption Algorithm (TEA)</CardTitle>
              </div>
              <span className="font-mono text-xs px-2 py-1 bg-paper border border-rule text-ink-soft">Lightweight IoT</span>
            </div>
            <p className="text-ink-soft text-xs sm:text-sm font-sans mt-2">
              Wheeler &amp; Needham 64-bit Feistel cipher: 32 cycles with golden ratio constant <code className="font-mono font-bold text-ink">DELTA = 0x9E3779B9</code>.
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="font-mono text-[10px] uppercase tracking-wider font-bold mb-1 block text-ink">Left Half v0 (32-bit Integer)</label>
                <input
                  type="number"
                  className="w-full p-2.5 border border-ink bg-paper font-mono text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal"
                  value={teaV0}
                  onChange={e => setTeaV0(parseInt(e.target.value) || 0)}
                />
              </div>
              <div>
                <label className="font-mono text-[10px] uppercase tracking-wider font-bold mb-1 block text-ink">Right Half v1 (32-bit Integer)</label>
                <input
                  type="number"
                  className="w-full p-2.5 border border-ink bg-paper font-mono text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal"
                  value={teaV1}
                  onChange={e => setTeaV1(parseInt(e.target.value) || 0)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono text-xs">
              <div className="p-4 border border-signal bg-signal/5">
                <div className="font-bold text-signal uppercase mb-1">Encrypted 64-bit Block (32 Cycles)</div>
                <div className="text-base font-bold text-ink">
                  v0: 0x{teaData.enc.v0.toString(16).toUpperCase().padStart(8, '0')} | v1: 0x{teaData.enc.v1.toString(16).toUpperCase().padStart(8, '0')}
                </div>
                <div className="text-[10px] text-ink-soft mt-1">Integrated shifts (v1&lt;&lt;4, v1&gt;&gt;5) and delta accumulation</div>
              </div>
              <div className="p-4 border border-ok bg-ok/5">
                <div className="font-bold text-ok uppercase mb-1">Decrypted Block Recovery</div>
                <div className="text-base font-bold text-ink">
                  v0: {teaData.dec.v0} | v1: {teaData.dec.v1}
                </div>
                <div className="text-[10px] text-ink-soft mt-1">Exact reversible recovery of original 64-bit plaintext</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* --- HASH TAB --- */}
      {activeTab === 'hash' && (
        <Card>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <span className="font-mono text-[10px] uppercase tracking-widest text-signal font-bold">M3 · Topic 4</span>
                <CardTitle className="font-serif text-2xl sm:text-3xl mt-1">SHA-256 Hashing & Avalanche Effect</CardTitle>
              </div>
              <span className="font-mono text-xs px-2 py-1 bg-paper border border-rule text-ink-soft">Deterministic Digest</span>
            </div>
            <p className="text-ink-soft text-xs sm:text-sm font-sans mt-2">
              Merkle-Damgård construction producing a deterministic 256-bit fixed-length output with strict avalanche dispersion.
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <label className="font-mono text-[10px] uppercase tracking-wider font-bold mb-2 block text-ink">Input String</label>
              <input
                className="w-full p-3 border border-ink bg-paper font-mono text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal"
                placeholder="Type to hash..."
                value={hashInput}
                onChange={e => setHashInput(e.target.value)}
              />
            </div>
            <div>
              <label className="font-mono text-[10px] uppercase tracking-wider font-bold mb-2 block text-ink">Output Digest (256-bit Hex)</label>
              <div className="p-4 bg-ink text-paper rounded-[4px] font-mono break-all text-xs sm:text-sm leading-relaxed tracking-wider shadow-inner">
                {hashOutput || "Generating..."}
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button onClick={() => setHashInput("CNS Security")} variant="outline" size="sm" className="text-xs">
                &quot;CNS Security&quot;
              </Button>
              <Button onClick={() => setHashInput("cNS Security")} variant="outline" size="sm" className="text-xs">
                &quot;cNS Security&quot; (1 bit change)
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* --- HMAC TAB --- */}
      {activeTab === 'hmac' && (
        <Card>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <span className="font-mono text-[10px] uppercase tracking-widest text-signal font-bold">M3 · Topic 2</span>
                <CardTitle className="font-serif text-2xl sm:text-3xl mt-1">HMAC (RFC 2104) & Length Extension</CardTitle>
              </div>
              <span className="font-mono text-xs px-2 py-1 bg-paper border border-rule text-ink-soft">Nested Hashing</span>
            </div>
            <p className="text-ink-soft text-xs sm:text-sm font-sans mt-2">
              Keyed-Hash Message Authentication Code using inner pad (0x36) and outer pad (0x5C) to block length extension attacks.
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="font-mono text-[10px] uppercase tracking-wider font-bold mb-2 block text-ink">Secret Shared Key (K)</label>
                <input
                  className="w-full p-2.5 border border-ink bg-paper font-mono text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal"
                  value={hmacKey}
                  onChange={e => setHmacKey(e.target.value)}
                />
              </div>
              <div>
                <label className="font-mono text-[10px] uppercase tracking-wider font-bold mb-2 block text-ink">Message (M)</label>
                <input
                  className="w-full p-2.5 border border-ink bg-paper font-mono text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal"
                  value={hmacMsg}
                  onChange={e => setHmacMsg(e.target.value)}
                />
              </div>
            </div>

            {/* Step-by-Step Breakdown */}
            <div className="p-4 border border-rule bg-card space-y-3 font-mono text-xs">
              <div className="flex justify-between border-b border-rule pb-2 font-bold text-ink">
                <span>STEP</span>
                <span>VALUE / OPERATION</span>
              </div>
              <div className="flex justify-between">
                <span className="text-ink-soft">1. Padded Key (K+):</span>
                <span className="text-signal truncate max-w-[280px] sm:max-w-md">{hmacBreakdown.normalizedKeyHex}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-ink-soft">2. Inner Mask (K+ ^ ipad):</span>
                <span className="truncate max-w-[280px] sm:max-w-md">{hmacBreakdown.kXorIpadHex}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-ink-soft">3. Inner Hash Digest:</span>
                <span className="font-bold">{hmacBreakdown.innerHashHex}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-ink-soft">4. Outer Mask (K+ ^ opad):</span>
                <span className="truncate max-w-[280px] sm:max-w-md">{hmacBreakdown.kXorOpadHex}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-rule font-bold text-sm">
                <span className="text-ink">Final HMAC Result:</span>
                <span className="text-signal">{hmacBreakdown.hmacResultHex}</span>
              </div>
            </div>

            {/* Length Extension Vulnerability Toggle */}
            <div className="p-4 border border-signal/40 bg-signal/5 rounded-[4px] space-y-3">
              <div className="flex justify-between items-center">
                <span className="font-mono text-xs font-bold text-signal uppercase tracking-wider">
                  Vulnerability Spotlight: Length Extension Attack on Naive H(K || M)
                </span>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setHmacSimulateExt(!hmacSimulateExt)}
                  className="text-xs"
                >
                  {hmacSimulateExt ? "Hide Exploit" : "Simulate Exploit"}
                </Button>
              </div>

              {hmacSimulateExt && (
                <div className="space-y-3 font-mono text-xs pt-2 border-t border-signal/20">
                  <div className="flex items-center gap-2">
                    <span className="text-ink-soft">Extension Data:</span>
                    <input
                      className="p-1 border border-ink bg-paper font-mono text-xs"
                      value={hmacExtMsg}
                      onChange={e => setHmacExtMsg(e.target.value)}
                    />
                  </div>
                  <div className="p-2 bg-bad/10 border border-bad/30 text-bad">
                    <strong>Naive H(K || M):</strong> Forged Hash: {lengthExtSim.naiveForgedHash} (Vulnerable without knowing Key K!)
                  </div>
                  <div className="p-2 bg-ok/10 border border-ok/30 text-ok">
                    <strong>HMAC RFC 2104:</strong> Completely immune. Outer hash hides inner compression state.
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* --- BIRTHDAY ATTACK TAB --- */}
      {activeTab === 'birthday' && (
        <Card>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <span className="font-mono text-[10px] uppercase tracking-widest text-signal font-bold">M3 · Topic 3</span>
                <CardTitle className="font-serif text-2xl sm:text-3xl mt-1">Birthday Paradox & Hash Collisions</CardTitle>
              </div>
              <span className="font-mono text-xs px-2 py-1 bg-paper border border-rule text-ink-soft">O(2^(n/2)) Bound</span>
            </div>
            <p className="text-ink-soft text-xs sm:text-sm font-sans mt-2">
              Why finding any hash collision requires only square-root effort (~2^(n/2) operations) compared to 2^n for pre-images.
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between font-mono text-xs">
                <span>Output Bit-Length (n): <strong>{birthdayBits} bits</strong></span>
                <span>Total Keyspace (2^{birthdayBits}): <strong>{Math.pow(2, birthdayBits).toLocaleString()}</strong></span>
              </div>
              <input
                type="range"
                min="8"
                max="32"
                step="2"
                value={birthdayBits}
                onChange={e => setBirthdayBits(Number(e.target.value))}
                className="w-full accent-signal"
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono text-xs pt-2">
                <div className="p-3 border border-rule bg-card">
                  <span className="text-ink-soft block">Pre-Image Search (50% Prob):</span>
                  <strong className="text-sm">~{Math.round(0.693 * Math.pow(2, birthdayBits)).toLocaleString()} trials</strong>
                </div>
                <div className="p-3 border border-signal bg-signal/5">
                  <span className="text-signal block font-bold">Collision Search (50% Birthday Prob):</span>
                  <strong className="text-sm text-signal">~{requiredTrials50.toLocaleString()} trials</strong>
                </div>
              </div>
            </div>

            {/* Live 16-bit Collision Finder */}
            <div className="p-4 border border-rule bg-card space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="font-mono text-xs font-bold text-ink uppercase tracking-wider">Live Real-Time Collision Finder (16-bit Hash)</h4>
                  <p className="text-ink-soft text-xs font-sans">Searches 65,536 buckets; birthday bound predicts a collision in ~300 trials.</p>
                </div>
                <Button
                  size="sm"
                  onClick={() => {
                    setIsSearchingCollision(true)
                    setTimeout(() => {
                      const res = findBirthdayCollision("demo_" + Date.now().toString(36))
                      setBirthdayCollision(res)
                      setIsSearchingCollision(false)
                    }, 50)
                  }}
                  disabled={isSearchingCollision}
                  className="bg-signal text-paper font-mono text-xs"
                >
                  {isSearchingCollision ? "Searching..." : "Find Collision Now"}
                </Button>
              </div>

              {birthdayCollision && (
                <div className="p-3 bg-paper border border-ok text-ok font-mono text-xs space-y-1">
                  <div className="font-bold">COLLISION FOUND in {birthdayCollision.trials} trials! (Predicted: ~301)</div>
                  <div className="text-ink text-[11px]">Message 1: <span className="font-bold">{birthdayCollision.input1}</span></div>
                  <div className="text-ink text-[11px]">Message 2: <span className="font-bold">{birthdayCollision.input2}</span></div>
                  <div className="text-signal font-bold pt-1 border-t border-rule">Shared Hash: {birthdayCollision.hashHex}</div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* --- DIGITAL SIGNATURES TAB --- */}
      {activeTab === 'signatures' && (
        <Card>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <span className="font-mono text-[10px] uppercase tracking-widest text-signal font-bold">M3 · Topic 5</span>
                <CardTitle className="font-serif text-2xl sm:text-3xl mt-1">Digital Signatures & The PS3 Exploit</CardTitle>
              </div>
              <span className="font-mono text-xs px-2 py-1 bg-paper border border-rule text-ink-soft">RSA & ECDSA</span>
            </div>
            <p className="text-ink-soft text-xs sm:text-sm font-sans mt-2">
              Hash-then-Sign paradigm, raw RSA multiplicative homomorphic forgery, and ECDSA master key extraction via nonce reuse.
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* RSA Digital Signature */}
            <div className="p-4 border border-rule bg-card space-y-3 font-mono text-xs">
              <h4 className="font-bold text-ink uppercase tracking-wider border-b border-rule pb-2">
                1. RSA Signature: S = h^d mod n (p=61, q=53, n=3233, e=17, d=2753)
              </h4>
              <div className="flex flex-wrap items-center gap-4">
                <label className="text-ink-soft">Message Digest (h):</label>
                <input
                  type="number"
                  className="p-1 border border-ink bg-paper font-mono text-xs w-28"
                  value={sigDigest}
                  onChange={e => setSigDigest(Number(e.target.value))}
                />
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setSigRsaTampered(!sigRsaTampered)}
                  className={`text-xs ${sigRsaTampered ? "bg-bad text-paper" : ""}`}
                >
                  {sigRsaTampered ? "Tampered (+1)" : "Tamper with Sig"}
                </Button>
              </div>
              <div className="flex justify-between pt-1">
                <span className="text-ink-soft">Computed Signature S:</span>
                <span className="font-bold text-signal">{rsaSigData.effectiveSig.toString()}</span>
              </div>
              <div className="flex justify-between items-center pt-1 border-t border-rule">
                <span>Verification Check (S^e mod n === h):</span>
                <strong className={rsaSigData.isValid ? "text-ok" : "text-bad"}>
                  {rsaSigData.isValid ? "VALID SIGNATURE" : "TAMPER DETECTED / INVALID"}
                </strong>
              </div>
            </div>

            {/* Sony PS3 Nonce Reuse Exploit */}
            <div className="p-4 border border-signal/40 bg-signal/5 rounded-[4px] space-y-3 font-mono text-xs">
              <h4 className="font-bold text-signal uppercase tracking-wider border-b border-signal/20 pb-2">
                2. Sony PS3 Exploit: ECDSA Nonce Reuse (Curve y^2 ≡ x^3 + 2 mod 13, Order n = 19)
              </h4>
              <p className="text-ink-soft font-sans text-xs">
                Alice signs two different game messages (z1 = {sigZ1}, z2 = {sigZ2}) using the SAME ephemeral nonce k = {sigK}.
              </p>
              {ecdsaData.sig1 && ecdsaData.sig2 && (
                <div className="space-y-1 bg-paper p-3 border border-rule">
                  <div>Signature 1 (r, s1): ({ecdsaData.sig1.r}, {ecdsaData.sig1.s})</div>
                  <div>Signature 2 (r, s2): ({ecdsaData.sig2.r}, {ecdsaData.sig2.s}) <span className="text-signal font-bold">(r is IDENTICAL!)</span></div>
                </div>
              )}
              {ecdsaData.exploit && (
                <div className="p-3 bg-bad/10 border border-bad/30 text-bad space-y-1">
                  <div className="font-bold">EXPLOIT SUCCESSFUL! Master Private Key Recovered:</div>
                  <div>Recovered Nonce k: <strong>{ecdsaData.exploit.recoveredK}</strong> (Actual: {sigK})</div>
                  <div>Recovered Private Key d: <strong>{ecdsaData.exploit.recoveredPrivateKey}</strong> (Actual: {sigD})</div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* --- PKI TAB --- */}
      {activeTab === 'pki' && (
        <Card>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <span className="font-mono text-[10px] uppercase tracking-widest text-signal font-bold">M3 · Topic 6</span>
                <CardTitle className="font-serif text-2xl sm:text-3xl mt-1">PKI & X.509 Chain Validator</CardTitle>
              </div>
              <span className="font-mono text-xs px-2 py-1 bg-paper border border-rule text-ink-soft">Hierarchy of Trust</span>
            </div>
            <p className="text-ink-soft text-xs sm:text-sm font-sans mt-2">
              Validates digital certificates from Leaf to Intermediate CA up to pre-installed Root CA anchors with revocation and expiry checks.
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Control Toggles */}
            <div className="flex flex-wrap gap-3 font-mono text-xs">
              <Button
                size="sm"
                variant="outline"
                onClick={() => setPkiLeafExpired(!pkiLeafExpired)}
                className={pkiLeafExpired ? "bg-bad text-paper" : ""}
              >
                {pkiLeafExpired ? "Leaf Expired [ON]" : "Simulate Expired Cert"}
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setPkiLeafRevoked(!pkiLeafRevoked)}
                className={pkiLeafRevoked ? "bg-bad text-paper" : ""}
              >
                {pkiLeafRevoked ? "Leaf Revoked via CRL/OCSP [ON]" : "Simulate Revoked Cert"}
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setPkiUntrustedRoot(!pkiUntrustedRoot)}
                className={pkiUntrustedRoot ? "bg-bad text-paper" : ""}
              >
                {pkiUntrustedRoot ? "Untrusted Root [ON]" : "Simulate Untrusted Root CA"}
              </Button>
            </div>

            {/* Certificate Chain Flow */}
            <div className="space-y-3 font-mono text-xs">
              {/* Root */}
              <div className="p-3 border border-rule bg-card flex justify-between items-center">
                <div>
                  <span className="text-[10px] text-signal font-bold uppercase block">Tier 1: Root CA (Self-Signed Anchor)</span>
                  <strong>{SAMPLE_ROOT_CA.subject}</strong>
                </div>
                <span className="text-[10px] px-2 py-0.5 bg-paper border border-rule">Trust Store</span>
              </div>
              {/* Intermediate */}
              <div className="p-3 border border-rule bg-card flex justify-between items-center ml-4">
                <div>
                  <span className="text-[10px] text-ink-soft font-bold uppercase block">Tier 2: Intermediate CA</span>
                  <strong>{SAMPLE_INTERMEDIATE_CA.subject}</strong>
                </div>
                <span className="text-[10px] px-2 py-0.5 bg-paper border border-rule">isCA: TRUE</span>
              </div>
              {/* Leaf */}
              <div className="p-3 border border-rule bg-card flex justify-between items-center ml-8">
                <div>
                  <span className="text-[10px] text-ink-soft font-bold uppercase block">Tier 3: Leaf Server Certificate</span>
                  <strong>{SAMPLE_LEAF_CERT.subject}</strong>
                </div>
                <span className="text-[10px] px-2 py-0.5 bg-paper border border-rule">Domain Web Server</span>
              </div>
            </div>

            {/* Validation Verdict */}
            <div className={`p-4 border font-mono text-xs space-y-2 ${
              pkiChainData.validation.isValid ? "bg-ok/10 border-ok text-ok" : "bg-bad/10 border-bad text-bad"
            }`}>
              <div className="font-bold text-sm">
                {pkiChainData.validation.isValid ? "CHAIN VALIDATION: TRUSTED SECURE CONNECTION" : "CHAIN VALIDATION FAILED: WARNING"}
              </div>
              {pkiChainData.validation.errors.length > 0 && (
                <ul className="list-disc list-inside space-y-1 pt-1 text-ink">
                  {pkiChainData.validation.errors.map((err, idx) => (
                    <li key={idx} className="text-bad font-bold">{err}</li>
                  ))}
                </ul>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
