"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { analyzeLogs, LogEvent, IDSAlert } from "@/lib/ids/simulator"
import {
  encodeDnsTunnel,
  decodeDnsTunnel,
  calculateShannonEntropy,
  validateDnssecChain
} from "@/lib/network/dnsSecurity"
import {
  evaluateZeroTrustAccess,
  ZeroTrustSubject,
  ZeroTrustResource
} from "@/lib/network/idsHoneypots"

const sampleLogs: LogEvent[] = [
  { id: 101, ip: "192.168.1.45", action: "GET /index.html", timestamp: 1620000000 },
  { id: 102, ip: "10.0.0.99", action: "Nmap scan -sS", timestamp: 1620000010 },
  { id: 103, ip: "172.16.0.5", action: "Failed login", timestamp: 1620000020 },
  { id: 104, ip: "172.16.0.5", action: "Failed login", timestamp: 1620000022 },
  { id: 105, ip: "172.16.0.5", action: "Failed login", timestamp: 1620000024 },
  { id: 106, ip: "172.16.0.5", action: "Failed login", timestamp: 1620000026 },
  { id: 107, ip: "172.16.0.5", action: "Failed login", timestamp: 1620000028 },
  { id: 108, ip: "192.168.1.10", action: "POST /login UNION SELECT * FROM users", timestamp: 1620000030 },
]

export default function IDSPlayground() {
  const [activeTab, setActiveTab] = useState<"signatures" | "dnstunnel" | "zerotrust">("signatures")

  // --- TAB 1: Signature IDS State ---
  const [logs, setLogs] = useState<LogEvent[]>(sampleLogs)
  const [alerts, setAlerts] = useState<IDSAlert[]>([])

  const runSimulation = () => {
    const results = analyzeLogs(logs)
    setAlerts(results)
  }

  const addNormalTraffic = () => {
    setLogs(prev => [...prev, { id: Date.now(), ip: "192.168.1.100", action: "GET /about.html", timestamp: Date.now() }])
  }

  const addMaliciousTraffic = () => {
    setLogs(prev => [...prev, { id: Date.now(), ip: "10.0.0.50", action: "GET /../../../etc/passwd", timestamp: Date.now() }])
  }

  // --- TAB 2: DNS Tunneling State ---
  const [secretText, setSecretText] = useState("CONFIDENTIAL_FINANCIAL_REPORTS_2026")
  const [tunnelDomain, setTunnelDomain] = useState("c2-exfil.net")
  const encodedTunnel = encodeDnsTunnel(secretText, tunnelDomain)
  const decodedSecret = decodeDnsTunnel(encodedTunnel.queries)
  const [dnssecTamper, setDnssecTamper] = useState(false)
  const dnssecChain = validateDnssecChain(tunnelDomain, dnssecTamper)

  // --- TAB 3: Zero Trust State ---
  const [subject, setSubject] = useState<ZeroTrustSubject>({
    username: "dev7shah@corp.internal",
    mfaVerified: true,
    deviceManaged: true,
    edrActive: true,
    diskEncrypted: true,
    clientIp: "10.0.1.42",
    geoCountry: "US",
    userRole: "engineer"
  })

  const [resource] = useState<ZeroTrustResource>({
    name: "Production Payment Processing Database",
    sensitivity: "RESTRICTED",
    requiredRole: "engineer",
    allowedCountries: ["US", "CA", "GB"]
  })

  const ztaResult = evaluateZeroTrustAccess(subject, resource)

  return (
    <div className="space-y-8">
      {/* Navigation Tabs */}
      <div className="overflow-x-auto pb-2 -mx-2 px-2 sm:mx-0 sm:px-0 scrollbar-none border-b border-rule">
        <div className="flex flex-nowrap sm:flex-wrap gap-2 w-max sm:w-full">
          <button
            onClick={() => setActiveTab("signatures")}
            className={`px-4 py-2 font-mono text-xs uppercase tracking-wider font-bold shrink-0 whitespace-nowrap transition-all ${
              activeTab === "signatures"
                ? "bg-signal text-paper border border-signal shadow-[2px_2px_0_var(--ink)]"
                : "bg-paper text-ink hover:bg-card border border-rule"
            }`}
          >
            1. Signature & Anomaly IDS
          </button>
          <button
            onClick={() => setActiveTab("dnstunnel")}
            className={`px-4 py-2 font-mono text-xs uppercase tracking-wider font-bold shrink-0 whitespace-nowrap transition-all ${
              activeTab === "dnstunnel"
                ? "bg-signal text-paper border border-signal shadow-[2px_2px_0_var(--ink)]"
                : "bg-paper text-ink hover:bg-card border border-rule"
            }`}
          >
            2. DNS Tunneling & Entropy
          </button>
          <button
            onClick={() => setActiveTab("zerotrust")}
            className={`px-4 py-2 font-mono text-xs uppercase tracking-wider font-bold shrink-0 whitespace-nowrap transition-all ${
              activeTab === "zerotrust"
                ? "bg-signal text-paper border border-signal shadow-[2px_2px_0_var(--ink)]"
                : "bg-paper text-ink hover:bg-card border border-rule"
            }`}
          >
            3. NIST Zero Trust Engine (ZTA)
          </button>
        </div>
      </div>

      {/* TAB 1: SIGNATURE & ANOMALY IDS */}
      {activeTab === "signatures" && (
        <div className="space-y-8">
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3">
                <div>
                  <CardTitle className="font-serif text-2xl sm:text-3xl">Network Traffic Logs & Snort Sensor</CardTitle>
                  <p className="text-ink-soft text-xs sm:text-sm font-sans mt-1">
                    Simulate real-time network traffic and pass it through signature pattern matching and anomaly thresholding.
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button variant="outline" size="sm" onClick={addNormalTraffic} className="text-xs h-8 px-2.5">+ Normal</Button>
                  <Button variant="outline" size="sm" onClick={addMaliciousTraffic} className="text-xs h-8 px-2.5 text-bad">+ Malicious /etc/passwd</Button>
                  <Button size="sm" onClick={runSimulation} className="bg-signal text-paper hover:bg-signal/90 font-mono uppercase tracking-wider text-[11px] font-bold h-8 px-3">
                    Analyze Logs
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="border border-rule bg-card max-h-80 overflow-y-auto overflow-x-auto rounded-[2px]">
                <table className="w-full text-xs font-mono text-left min-w-[360px]">
                  <thead className="bg-paper sticky top-0 border-b border-rule z-10 text-[10px] uppercase tracking-wider text-ink-soft font-bold">
                    <tr>
                      <th className="p-2.5 border-r border-rule">Event ID</th>
                      <th className="p-2.5 border-r border-rule">Source IP</th>
                      <th className="p-2.5">Action / Payload</th>
                    </tr>
                  </thead>
                  <tbody>
                    {logs.map((log) => (
                      <tr key={log.id} className="border-b border-rule last:border-0 hover:bg-rule/40 transition-colors text-ink">
                        <td className="p-2.5 border-r border-rule whitespace-nowrap">{log.id}</td>
                        <td className="p-2.5 border-r border-rule whitespace-nowrap">{log.ip}</td>
                        <td className="p-2.5 break-all">{log.action}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {alerts.length > 0 && (
            <Card className="border-bad shadow-[3px_3px_0_var(--rule)]">
              <CardHeader>
                <CardTitle className="font-serif text-2xl text-bad">IDS Alerts ({alerts.length})</CardTitle>
                <p className="text-ink-soft text-xs font-sans mt-1">Signatures matched against traffic payloads or brute-force threshold exceeded.</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 font-mono">
                  {alerts.map((alert, i) => (
                    <div
                      key={i}
                      className={`p-3 border bg-card flex items-start gap-3 rounded-[2px] ${
                        alert.severity === "CRITICAL"
                          ? "border-bad text-bad"
                          : alert.severity === "HIGH"
                          ? "border-orange-500 text-orange-600"
                          : "border-signal text-signal"
                      }`}
                    >
                      <div className="font-bold shrink-0 uppercase tracking-wider text-[10px] bg-paper px-2 py-1 border border-current">
                        {alert.severity}
                      </div>
                      <div>
                        <div className="font-bold text-xs sm:text-sm">{alert.message}</div>
                        <div className="text-[10px] opacity-80 mt-1 uppercase tracking-wider">Triggered by Event ID: {alert.eventId}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* TAB 2: DNS TUNNELING & SHANNON ENTROPY */}
      {activeTab === "dnstunnel" && (
        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle className="font-serif text-2xl sm:text-3xl">Covert DNS Exfiltration & Shannon Entropy Analyzer</CardTitle>
              <p className="text-ink-soft text-xs sm:text-sm font-sans mt-1">
                Encode confidential payloads into Base32 DNS subdomains. Watch how Shannon Entropy flags covert tunnels!
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-mono text-[10px] uppercase tracking-wider font-bold block mb-1">
                    Confidential Plaintext to Exfiltrate
                  </label>
                  <textarea
                    rows={3}
                    className="w-full p-2.5 border border-ink bg-paper font-mono text-xs"
                    value={secretText}
                    onChange={(e) => setSecretText(e.target.value)}
                  />
                </div>
                <div>
                  <label className="font-mono text-[10px] uppercase tracking-wider font-bold block mb-1">
                    Attacker C2 Authoritative Domain
                  </label>
                  <input
                    className="w-full p-2.5 border border-ink bg-paper font-mono text-xs"
                    value={tunnelDomain}
                    onChange={(e) => setTunnelDomain(e.target.value)}
                  />
                  <div className="mt-3 p-3 bg-card border border-rule text-xs font-mono">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-ink-soft uppercase text-[10px]">Average Shannon Entropy:</span>
                      <strong className={`font-bold ${encodedTunnel.isDetectedAsTunnel ? "text-bad" : "text-ok"}`}>
                        {encodedTunnel.averageEntropy} bits/char
                      </strong>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-ink-soft uppercase text-[10px]">SOC IDS Tunnel Detection:</span>
                      <span className={`px-2 py-0.5 border text-[10px] font-bold ${
                        encodedTunnel.isDetectedAsTunnel ? "bg-bad/10 text-bad border-bad" : "bg-ok/10 text-ok border-ok"
                      }`}>
                        {encodedTunnel.isDetectedAsTunnel ? "ALERT: DNS TUNNEL DETECTED" : "NORMAL DOMAIN ENTROPY"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Generated Tunnel Queries */}
              <div>
                <div className="font-mono text-xs uppercase tracking-wider font-bold mb-2 flex justify-between">
                  <span>Generated Subdomain Queries ({encodedTunnel.queries.length} total)</span>
                  <span className="text-ink-soft">Decoded Plaintext: &quot;{decodedSecret}&quot;</span>
                </div>
                <div className="bg-paper border border-rule p-3 font-mono text-xs max-h-40 overflow-y-auto space-y-1">
                  {encodedTunnel.queries.map((q, idx) => (
                    <div key={idx} className="flex justify-between text-ink">
                      <span>{q}</span>
                      <span className="text-ink-soft text-[10px]">Entropy: {calculateShannonEntropy(q.split(".")[1])}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* DNSSEC Chain Validation */}
              <div className="p-4 bg-card border border-rule rounded-[2px] space-y-3">
                <div className="flex justify-between items-center">
                  <div className="font-serif text-lg font-bold text-ink">DNSSEC Cryptographic Chain of Trust</div>
                  <Button
                    size="sm"
                    variant={dnssecTamper ? "destructive" : "outline"}
                    onClick={() => setDnssecTamper(!dnssecTamper)}
                    className="text-xs h-7"
                  >
                    {dnssecTamper ? "Remove Tamper" : "Simulate Rogue DNS Injection"}
                  </Button>
                </div>
                <div className="space-y-2">
                  {dnssecChain.chain.map((tier, idx) => (
                    <div key={idx} className="flex items-center justify-between p-2 bg-paper border border-rule text-xs font-mono">
                      <div>
                        <span className="font-bold text-signal mr-2">{tier.zone}</span>
                        <span className="text-ink-soft text-[10px] mr-2">[{tier.keyType} Tag: {tier.keyTag}]</span>
                        <span className="text-ink">{tier.details}</span>
                      </div>
                      <span className={`px-2 py-0.5 border text-[10px] font-bold ${
                        tier.signatureStatus === "VALID" ? "bg-ok/10 text-ok border-ok" : "bg-bad/10 text-bad border-bad"
                      }`}>
                        {tier.signatureStatus}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* TAB 3: ZERO TRUST ARCHITECTURE (ZTA) */}
      {activeTab === "zerotrust" && (
        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle className="font-serif text-2xl sm:text-3xl">NIST SP 800-207 Zero Trust Policy Engine</CardTitle>
              <p className="text-ink-soft text-xs sm:text-sm font-sans mt-1">
                Principle: &quot;Never Trust, Always Verify&quot;. Access is calculated on dynamic identity, device health, and least privilege.
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Subject Context Controls */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-card border border-rule rounded-[2px]">
                <div className="space-y-3">
                  <h4 className="font-serif font-bold text-ink">User Identity & Authentication Context</h4>
                  <div>
                    <label className="font-mono text-[10px] uppercase tracking-wider font-bold block mb-1">User Role</label>
                    <select
                      className="w-full p-2 border border-ink bg-paper font-mono text-xs"
                      value={subject.userRole}
                      onChange={(e) => setSubject({ ...subject, userRole: e.target.value as "guest" | "finance" | "engineer" | "admin" })}
                    >
                      <option value="guest">Guest</option>
                      <option value="finance">Finance</option>
                      <option value="engineer">Engineer</option>
                      <option value="admin">Administrator</option>
                    </select>
                  </div>
                  <div>
                    <label className="font-mono text-[10px] uppercase tracking-wider font-bold block mb-1">Geographic Country</label>
                    <input
                      className="w-full p-2 border border-ink bg-paper font-mono text-xs"
                      value={subject.geoCountry}
                      onChange={(e) => setSubject({ ...subject, geoCountry: e.target.value })}
                    />
                  </div>
                  <div className="flex items-center gap-2 pt-1">
                    <input
                      type="checkbox"
                      id="mfa"
                      checked={subject.mfaVerified}
                      onChange={(e) => setSubject({ ...subject, mfaVerified: e.target.checked })}
                      className="accent-signal"
                    />
                    <label htmlFor="mfa" className="text-xs font-mono">Multi-Factor Authentication (MFA) Verified</label>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-serif font-bold text-ink">Device Health & Posture Assessment</h4>
                  <div className="space-y-2 pt-2">
                    <label className="flex items-center gap-2 text-xs font-mono">
                      <input
                        type="checkbox"
                        checked={subject.deviceManaged}
                        onChange={(e) => setSubject({ ...subject, deviceManaged: e.target.checked })}
                        className="accent-signal"
                      />
                      Corporate MDM Enrolled (Managed Device)
                    </label>
                    <label className="flex items-center gap-2 text-xs font-mono">
                      <input
                        type="checkbox"
                        checked={subject.edrActive}
                        onChange={(e) => setSubject({ ...subject, edrActive: e.target.checked })}
                        className="accent-signal"
                      />
                      Endpoint Detection & Response (EDR) Active
                    </label>
                    <label className="flex items-center gap-2 text-xs font-mono">
                      <input
                        type="checkbox"
                        checked={subject.diskEncrypted}
                        onChange={(e) => setSubject({ ...subject, diskEncrypted: e.target.checked })}
                        className="accent-signal"
                      />
                      Full Disk Encryption (BitLocker / FileVault) Enabled
                    </label>
                  </div>
                </div>
              </div>

              {/* Zero Trust Decision Panel */}
              <div className="p-5 bg-paper border border-ink rounded-[2px] space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-[10px] font-mono uppercase tracking-wider text-ink-soft">Target Resource Requested</div>
                    <div className="font-serif text-lg font-bold text-ink">{resource.name} (Role Required: {resource.requiredRole.toUpperCase()})</div>
                  </div>
                  <div className="text-right">
                    <div className="text-[10px] font-mono uppercase tracking-wider text-ink-soft">Calculated Trust Score</div>
                    <div className="font-mono text-2xl font-bold text-signal">{ztaResult.score} / 100</div>
                  </div>
                </div>

                <div className={`p-4 border rounded-[2px] flex items-center justify-between ${
                  ztaResult.decision === "GRANT"
                    ? "bg-ok/10 text-ok border-ok"
                    : ztaResult.decision === "STEP_UP_MFA_REQUIRED"
                    ? "bg-signal/10 text-signal border-signal"
                    : "bg-bad/10 text-bad border-bad"
                }`}>
                  <div>
                    <div className="font-mono text-sm font-bold uppercase tracking-wider">
                      DECISION: {ztaResult.decision}
                    </div>
                    <div className="text-xs font-sans mt-0.5 text-ink">{ztaResult.explanation}</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
