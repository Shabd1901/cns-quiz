import { useState, useEffect, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { calculatePasswordEntropy, getPasswordStrengthLabel, isVulnerableToDictionary } from "@/lib/auth/password"
import { generateTOTP } from "@/lib/auth/totp"
import { sha256 } from "@/lib/crypto/hash"
import { evaluateBellLaPadula, evaluateBiba, ClearanceLevel } from "@/lib/security/accessControl"
import { registerWebAuthnCredential, authenticateWebAuthn } from "@/lib/security/userAuth"
import { evaluateNistPassword, estimateCrackingTime } from "@/lib/security/passwordAttacks"

export default function AuthPlayground() {
  const [password, setPassword] = useState("")
  const [salt, setSalt] = useState("random_salt_123")
  const [hashedPass, setHashedPass] = useState("")

  const entropy = calculatePasswordEntropy(password)
  const strength = getPasswordStrengthLabel(entropy)
  const dictVuln = isVulnerableToDictionary(password)

  useEffect(() => {
    sha256(password + salt).then(setHashedPass)
  }, [password, salt])

  const [totpSecret, setTotpSecret] = useState("MYSECRETKEY")
  const [totpCode, setTotpCode] = useState("")
  const [timeLeft, setTimeLeft] = useState(30)

  useEffect(() => {
    const updateTotp = async () => {
      const { code, timeLeft: tl } = await generateTOTP(totpSecret, 30)
      setTotpCode(code)
      setTimeLeft(tl)
    }
    updateTotp()
    const timer = setInterval(updateTotp, 1000)
    return () => clearInterval(timer)
  }, [totpSecret])

  // --- M4 States ---
  // Access Control (Bell-LaPadula & Biba)
  const [acSubjectClearance, setAcSubjectClearance] = useState<ClearanceLevel>("secret")
  const [acObjectClassification, setAcObjectClassification] = useState<ClearanceLevel>("confidential")
  const [acOperation, setAcOperation] = useState<"read" | "write">("read")
  const [acModel, setAcModel] = useState<"bell_lapadula" | "biba">("bell_lapadula")

  const acDecision = useMemo(() => {
    if (acModel === "bell_lapadula") {
      return evaluateBellLaPadula("User_Agent", acSubjectClearance, "Resource_File", acObjectClassification, acOperation)
    }
    return evaluateBiba("Process_Thread", acSubjectClearance, "System_Object", acObjectClassification, acOperation)
  }, [acModel, acSubjectClearance, acObjectClassification, acOperation])

  // FIDO2 / WebAuthn Passwordless State
  const [webAuthnDomain] = useState("https://cns-lab.edu")
  const [webAuthnPhishToggle, setWebAuthnPhishToggle] = useState(false)
  const webAuthnCred = useMemo(
    () => registerWebAuthnCredential("student@cns.edu", "https://cns-lab.edu"),
    []
  )
  const webAuthnResult = useMemo(() => {
    const activeOrigin = webAuthnPhishToggle ? "https://evil-cns-lab-phish.com" : webAuthnDomain
    return authenticateWebAuthn(webAuthnCred, "random_server_challenge_nonce_42", activeOrigin)
  }, [webAuthnCred, webAuthnDomain, webAuthnPhishToggle])

  // NIST SP 800-63B Password State
  const [nistInput, setNistInput] = useState("correct-horse-battery-staple")
  const nistResult = useMemo(() => evaluateNistPassword(nistInput), [nistInput])
  const crackingEstimates = useMemo(() => estimateCrackingTime(nistResult.entropyBits), [nistResult.entropyBits])

  return (
    <div className="space-y-8 sm:space-y-12">
      <Card>
        <CardHeader>
          <CardTitle className="font-serif text-2xl sm:text-3xl">Password Strength & Salting</CardTitle>
          <p className="text-ink-soft text-xs sm:text-sm font-sans mt-1 sm:mt-2">See how entropy and dictionary checks affect password strength, and how salting changes the hash.</p>
        </CardHeader>
        <CardContent className="space-y-4 sm:space-y-6">
          <div>
            <label className="font-mono text-[10px] uppercase tracking-wider font-bold mb-2 block text-ink">Password Input</label>
            <input 
              type="text"
              className="w-full p-3 border border-ink bg-paper font-mono text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal" 
              value={password} 
              onChange={e => setPassword(e.target.value)}
              placeholder="Type a password..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 font-mono text-sm">
            <div className="p-3 sm:p-4 border border-rule bg-card space-y-2">
              <h4 className="font-bold text-[10px] uppercase tracking-wider text-ink mb-3 sm:mb-4 border-b border-rule pb-2">Security Metrics</h4>
              <div className="flex justify-between mb-1">
                <span className="text-ink-soft">Entropy</span>
                <strong>{entropy} bits</strong>
              </div>
              <div className="flex justify-between mb-1">
                <span className="text-ink-soft">Strength</span>
                <strong className={strength.color.replace('text-', 'text-')}>{strength.label}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-ink-soft">Dictionary Attack</span>
                {dictVuln ? (
                  <strong className="text-bad">Vulnerable!</strong>
                ) : (
                  <strong className="text-ok">Resistant</strong>
                )}
              </div>
            </div>

            <div className="p-3 sm:p-4 border border-rule bg-card space-y-3 sm:space-y-4">
              <h4 className="font-bold text-[10px] uppercase tracking-wider text-ink mb-2 border-b border-rule pb-2">Salting & Hashing</h4>
              <div>
                <label className="font-mono text-[10px] uppercase tracking-wider font-bold mb-1 sm:mb-2 block text-ink">Database Salt (per user)</label>
                <input 
                  className="w-full p-2 border border-ink bg-paper text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal" 
                  value={salt} 
                  onChange={e => setSalt(e.target.value)}
                />
              </div>
              <div>
                <label className="font-mono text-[10px] uppercase tracking-wider font-bold mb-1 sm:mb-2 block text-signal">Resulting Database Hash</label>
                <div className="p-2.5 sm:p-3 bg-signal/10 border border-signal rounded-[4px] font-mono break-all text-xs sm:text-sm text-ink tracking-widest min-h-[44px] flex items-center">
                  {hashedPass || "Generating..."}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="font-serif text-2xl sm:text-3xl">TOTP Authenticator Simulator</CardTitle>
          <p className="text-ink-soft text-xs sm:text-sm font-sans mt-1 sm:mt-2">
            TOTP uses a shared secret and the current UTC time. No network requests are made.
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 items-center">
            <div>
              <label className="font-mono text-[10px] uppercase tracking-wider font-bold mb-2 block text-ink">Shared Secret Key</label>
              <input 
                className="w-full p-3 border border-ink bg-paper font-mono text-sm uppercase focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal" 
                value={totpSecret} 
                onChange={e => setTotpSecret(e.target.value.toUpperCase())}
              />
            </div>
            
            <div className="flex flex-col items-center justify-center p-4 sm:p-6 border border-rule bg-paper">
              <div className="text-3xl sm:text-4xl md:text-5xl font-mono font-bold tracking-widest text-signal mb-3 sm:mb-4">
                {totpCode.slice(0,3)} {totpCode.slice(3,6)}
              </div>
              <div className="w-full bg-rule h-1 overflow-hidden">
                <div 
                  className={`h-full transition-all duration-1000 ${timeLeft < 5 ? 'bg-bad' : 'bg-signal'}`} 
                  style={{ width: `${(timeLeft / 30) * 100}%` }}
                />
              </div>
              <div className="text-[10px] uppercase font-mono text-ink-soft mt-3 sm:mt-4 tracking-widest">
                Changes in {timeLeft}s
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* --- ACCESS CONTROL CARD: BELL-LAPADULA & BIBA --- */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <span className="font-mono text-[10px] uppercase tracking-widest text-signal font-bold">M4 · Topic 3</span>
              <CardTitle className="font-serif text-2xl sm:text-3xl mt-1">Multi-Level Security: Bell-LaPadula & Biba</CardTitle>
            </div>
            <span className="font-mono text-xs px-2 py-1 bg-paper border border-rule text-ink-soft">NRU / NWD vs NRD / NWU</span>
          </div>
          <p className="text-ink-soft text-xs sm:text-sm font-sans mt-2">
            Simulate military mandatory access control decisions for confidentiality (Bell-LaPadula) vs data integrity (Biba).
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 font-mono text-xs">
            <div>
              <label className="font-bold text-ink block mb-1">Security Model</label>
              <select
                className="w-full p-2 border border-ink bg-paper"
                value={acModel}
                onChange={e => setAcModel(e.target.value as "bell_lapadula" | "biba")}
              >
                <option value="bell_lapadula">Bell-LaPadula (Confidentiality)</option>
                <option value="biba">Biba Model (Integrity)</option>
              </select>
            </div>
            <div>
              <label className="font-bold text-ink block mb-1">Subject Clearance</label>
              <select
                className="w-full p-2 border border-ink bg-paper"
                value={acSubjectClearance}
                onChange={e => setAcSubjectClearance(e.target.value as ClearanceLevel)}
              >
                <option value="unclassified">Unclassified (0)</option>
                <option value="confidential">Confidential (1)</option>
                <option value="secret">Secret (2)</option>
                <option value="top_secret">Top Secret (3)</option>
              </select>
            </div>
            <div>
              <label className="font-bold text-ink block mb-1">Object Classification</label>
              <select
                className="w-full p-2 border border-ink bg-paper"
                value={acObjectClassification}
                onChange={e => setAcObjectClassification(e.target.value as ClearanceLevel)}
              >
                <option value="unclassified">Unclassified (0)</option>
                <option value="confidential">Confidential (1)</option>
                <option value="secret">Secret (2)</option>
                <option value="top_secret">Top Secret (3)</option>
              </select>
            </div>
            <div>
              <label className="font-bold text-ink block mb-1">Operation</label>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setAcOperation("read")}
                  className={`flex-1 text-xs ${acOperation === "read" ? "bg-ink text-paper" : ""}`}
                >
                  READ
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setAcOperation("write")}
                  className={`flex-1 text-xs ${acOperation === "write" ? "bg-ink text-paper" : ""}`}
                >
                  WRITE
                </Button>
              </div>
            </div>
          </div>

          {/* Decision Box */}
          <div className={`p-4 border font-mono text-xs space-y-1.5 ${
            acDecision.allowed ? "bg-ok/10 border-ok text-ok" : "bg-bad/10 border-bad text-bad"
          }`}>
            <div className="font-bold text-sm">
              {acDecision.allowed ? "ACCESS GRANTED ✓" : "ACCESS DENIED ✕"} ({acDecision.ruleTriggered})
            </div>
            <div className="text-ink">{acDecision.explanation}</div>
          </div>
        </CardContent>
      </Card>

      {/* --- FIDO2 / WEBAUTHN PASSWORDLESS CARD --- */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <span className="font-mono text-[10px] uppercase tracking-widest text-signal font-bold">M4 · Topic 4</span>
              <CardTitle className="font-serif text-2xl sm:text-3xl mt-1">FIDO2 / WebAuthn Origin Binding</CardTitle>
            </div>
            <span className="font-mono text-xs px-2 py-1 bg-paper border border-rule text-ink-soft">Phishing-Resistant MFA</span>
          </div>
          <p className="text-ink-soft text-xs sm:text-sm font-sans mt-2">
            Demonstrates why hardware security keys defeat reverse-proxy phishing attacks (Evilginx) by cryptographically binding signatures to browser domain origins.
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 font-mono text-xs p-3 border border-rule bg-card">
            <div>
              <span className="text-ink-soft block text-[10px] uppercase">Registered Relying Party:</span>
              <strong>{webAuthnCred.rpOrigin}</strong> (User: {webAuthnCred.userName})
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setWebAuthnPhishToggle(!webAuthnPhishToggle)}
              className={webAuthnPhishToggle ? "bg-bad text-paper" : ""}
            >
              {webAuthnPhishToggle ? "Phishing Site Active [ON]" : "Simulate Phishing Site"}
            </Button>
          </div>

          <div className={`p-4 border font-mono text-xs space-y-2 ${
            webAuthnResult.success ? "bg-ok/10 border-ok text-ok" : "bg-bad/10 border-bad text-bad"
          }`}>
            <div className="font-bold text-sm">
              {webAuthnResult.success ? "WEBAUTHN VERIFIED: AUTHENTICATION GRANTED" : "PHISHING ATTACK THWARTED: REJECTED"}
            </div>
            <div className="text-ink">{webAuthnResult.explanation}</div>
          </div>
        </CardContent>
      </Card>

      {/* --- NIST SP 800-63B GUIDELINES CARD --- */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <span className="font-mono text-[10px] uppercase tracking-widest text-signal font-bold">M4 · Topic 5</span>
              <CardTitle className="font-serif text-2xl sm:text-3xl mt-1">NIST SP 800-63B Password Criteria & Cracking Speeds</CardTitle>
            </div>
            <span className="font-mono text-xs px-2 py-1 bg-paper border border-rule text-ink-soft">Entropy & Key Stretching</span>
          </div>
          <p className="text-ink-soft text-xs sm:text-sm font-sans mt-2">
            Length over complexity: Evaluates passwords against NIST standards and compares brute-force resistance across fast hashes (GPU) vs memory-hard Argon2id.
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <label className="font-mono text-[10px] uppercase tracking-wider font-bold mb-2 block text-ink">
              Test Password / Passphrase ({nistInput.length} characters)
            </label>
            <input
              className="w-full p-2.5 border border-ink bg-paper font-mono text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal"
              value={nistInput}
              onChange={e => setNistInput(e.target.value)}
            />
          </div>

          {/* Compliance & Entropy Status */}
          <div className={`p-3.5 border font-mono text-xs space-y-1 ${
            nistResult.isCompliant ? "bg-ok/10 border-ok text-ok" : "bg-bad/10 border-bad text-bad"
          }`}>
            <div className="font-bold">{nistResult.verdict}</div>
            {nistResult.legacyRuleWarnings.length > 0 && (
              <div className="text-amber-800 text-[11px]">{nistResult.legacyRuleWarnings.join(" ")}</div>
            )}
          </div>

          {/* Cracking Speeds Comparison Table */}
          <div className="p-4 border border-rule bg-card space-y-3 font-mono text-xs">
            <h4 className="font-bold text-ink uppercase tracking-wider border-b border-rule pb-2">
              Time to Crack Keyspace (2^{nistResult.entropyBits} combinations) on Dedicated Hardware
            </h4>
            <div className="space-y-2">
              {crackingEstimates.map(est => (
                <div key={est.algorithm} className="flex justify-between items-center p-2 bg-paper border border-rule">
                  <div>
                    <strong>{est.algorithm}</strong>
                    <span className="text-[10px] text-ink-soft block">{est.hashesPerSecondDisplay} ({est.memoryRequirement})</span>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-signal">{est.timeDisplay}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
