"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import {
  Firewall5TupleRule,
  NetworkPacket,
  evaluateStateless,
  StatefulFirewall,
  ConntrackEntry
} from "@/lib/network/firewalls"
import {
  simulateSynFlood,
  generateSynCookie,
  verifySynCookie
} from "@/lib/network/synFloodDos"

const defaultStatelessRules: Firewall5TupleRule[] = [
  { id: "1", order: 1, action: "ALLOW", protocol: "TCP", srcSubnet: "192.168.1.0/24", dstSubnet: "10.0.0.5/32", srcPort: "ANY", dstPort: "80", description: "Allow Internal LAN to Web Server HTTP" },
  { id: "2", order: 2, action: "DROP", protocol: "TCP", srcSubnet: "ANY", dstSubnet: "10.0.0.5/32", srcPort: "ANY", dstPort: "22", description: "Block all direct SSH to Web Server" },
  { id: "3", order: 3, action: "ALLOW", protocol: "TCP", srcSubnet: "192.168.1.100/32", dstSubnet: "10.0.0.5/32", srcPort: "ANY", dstPort: "22", description: "Shadowed Admin SSH Rule (Dead Code due to Rule 2!)" },
  { id: "4", order: 4, action: "ALLOW", protocol: "ICMP", srcSubnet: "192.168.1.0/24", dstSubnet: "ANY", srcPort: "ANY", dstPort: "ANY", description: "Allow Ping from LAN" }
]

export default function FirewallPlayground() {
  const [activeTab, setActiveTab] = useState<"acl" | "stateful" | "synflood">("acl")

  // --- Tab 1: Stateless 5-Tuple ---
  const [statelessRules] = useState<Firewall5TupleRule[]>(defaultStatelessRules)
  const [packet, setPacket] = useState<NetworkPacket>({
    protocol: "TCP",
    srcIp: "192.168.1.50",
    dstIp: "10.0.0.5",
    srcPort: 49152,
    dstPort: 80
  })
  const statelessEval = evaluateStateless(statelessRules, packet)

  // --- Tab 2: Stateful Conntrack ---
  const [statefulFw] = useState<StatefulFirewall>(() => new StatefulFirewall(defaultStatelessRules))
  const [conntrackTable, setConntrackTable] = useState<ConntrackEntry[]>([])
  const [statefulLog, setStatefulLog] = useState<Array<{ text: string; action: string; state: string }>>([])

  const sendStatefulSyn = () => {
    const synPkt: NetworkPacket = {
      srcIp: "192.168.1.50",
      dstIp: "10.0.0.5",
      srcPort: 54321,
      dstPort: 80,
      protocol: "TCP",
      tcpFlags: { syn: true }
    }
    const res = statefulFw.processPacket(synPkt)
    setConntrackTable(statefulFw.getConntrackTable())
    setStatefulLog(prev => [
      { text: `Outbound SYN: 192.168.1.50:54321 -> 10.0.0.5:80: ${res.explanation}`, action: res.action, state: res.state },
      ...prev.slice(0, 7)
    ])
  }

  const sendStatefulReturnAck = () => {
    const returnPkt: NetworkPacket = {
      srcIp: "10.0.0.5",
      dstIp: "192.168.1.50",
      srcPort: 80,
      dstPort: 54321,
      protocol: "TCP",
      tcpFlags: { syn: true, ack: true }
    }
    const res = statefulFw.processPacket(returnPkt)
    setConntrackTable(statefulFw.getConntrackTable())
    setStatefulLog(prev => [
      { text: `Inbound SYN-ACK Return: 10.0.0.5:80 -> 192.168.1.50:54321: ${res.explanation}`, action: res.action, state: res.state },
      ...prev.slice(0, 7)
    ])
  }

  const sendSpuriousInboundAck = () => {
    const spuriousPkt: NetworkPacket = {
      srcIp: "198.51.100.99",
      dstIp: "192.168.1.50",
      srcPort: 80,
      dstPort: 44444,
      protocol: "TCP",
      tcpFlags: { ack: true }
    }
    const res = statefulFw.processPacket(spuriousPkt)
    setStatefulLog(prev => [
      { text: `Spurious Inbound ACK (No prior state): 198.51.100.99 -> 192.168.1.50: ${res.explanation}`, action: res.action, state: res.state },
      ...prev.slice(0, 7)
    ])
  }

  const clearStateful = () => {
    statefulFw.clearTable()
    setConntrackTable([])
    setStatefulLog([])
  }

  // --- Tab 3: SYN Flood & SYN Cookies ---
  const [backlogCapacity, setBacklogCapacity] = useState(16)
  const [attackerRate, setAttackerRate] = useState(30)
  const [synCookiesEnabled, setSynCookiesEnabled] = useState(false)
  const [floodResult, setFloodResult] = useState(() =>
    simulateSynFlood(16, 60, 30, 8, false)
  )

  const runFloodSim = (useCookies: boolean) => {
    setSynCookiesEnabled(useCookies)
    const res = simulateSynFlood(backlogCapacity, 60, attackerRate, 8, useCookies)
    setFloodResult(res)
  }

  // Interactive single SYN cookie calculator
  const sampleCookie = generateSynCookie("192.168.1.50", "10.0.0.5", 54321, 80, "firewall-master-key", 14, 2)
  const verifyResult = verifySynCookie("192.168.1.50", "10.0.0.5", 54321, 80, "firewall-master-key", sampleCookie.isn + 1, 14)

  return (
    <div className="space-y-8">
      {/* Navigation Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-rule pb-3">
        <button
          onClick={() => setActiveTab("acl")}
          className={`px-4 py-2 font-mono text-xs uppercase tracking-wider font-bold transition-all ${
            activeTab === "acl"
              ? "bg-signal text-paper border border-signal shadow-[2px_2px_0_var(--ink)]"
              : "bg-paper text-ink hover:bg-card border border-rule"
          }`}
        >
          1. 5-Tuple ACL Filter
        </button>
        <button
          onClick={() => setActiveTab("stateful")}
          className={`px-4 py-2 font-mono text-xs uppercase tracking-wider font-bold transition-all ${
            activeTab === "stateful"
              ? "bg-signal text-paper border border-signal shadow-[2px_2px_0_var(--ink)]"
              : "bg-paper text-ink hover:bg-card border border-rule"
          }`}
        >
          2. Stateful Conntrack Table
        </button>
        <button
          onClick={() => setActiveTab("synflood")}
          className={`px-4 py-2 font-mono text-xs uppercase tracking-wider font-bold transition-all ${
            activeTab === "synflood"
              ? "bg-signal text-paper border border-signal shadow-[2px_2px_0_var(--ink)]"
              : "bg-paper text-ink hover:bg-card border border-rule"
          }`}
        >
          3. SYN Flood & SYN Cookies (RFC 4987)
        </button>
      </div>

      {/* TAB 1: 5-TUPLE ACL FILTER */}
      {activeTab === "acl" && (
        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle className="font-serif text-2xl sm:text-3xl">Access Control List (5-Tuple Sequential Engine)</CardTitle>
              <p className="text-ink-soft text-xs sm:text-sm font-sans mt-1">
                First-Match-Wins evaluation: Packets traverse rules top-down. Notice how Rule 3 is shadowed by Rule 2!
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-paper border border-rule rounded-[2px] overflow-x-auto">
                <table className="w-full text-xs font-mono text-left min-w-[600px]">
                  <thead className="bg-card border-b border-rule text-[10px] uppercase tracking-wider text-ink font-bold">
                    <tr>
                      <th className="p-3 border-r border-rule">Order</th>
                      <th className="p-3 border-r border-rule">Action</th>
                      <th className="p-3 border-r border-rule">Protocol</th>
                      <th className="p-3 border-r border-rule">Src Subnet</th>
                      <th className="p-3 border-r border-rule">Dst Subnet</th>
                      <th className="p-3 border-r border-rule">Port</th>
                      <th className="p-3">Description & Shadow Alert</th>
                    </tr>
                  </thead>
                  <tbody>
                    {statelessRules.map((rule) => {
                      const isMatch = statelessEval.matchedRuleId === rule.id
                      return (
                        <tr
                          key={rule.id}
                          className={`border-b border-rule last:border-0 ${
                            isMatch ? "bg-signal/10 font-bold" : ""
                          }`}
                        >
                          <td className="p-3 border-r border-rule">{rule.order}</td>
                          <td className={`p-3 border-r border-rule font-bold ${rule.action === "ALLOW" ? "text-ok" : "text-bad"}`}>
                            {rule.action}
                          </td>
                          <td className="p-3 border-r border-rule">{rule.protocol}</td>
                          <td className="p-3 border-r border-rule">{rule.srcSubnet}</td>
                          <td className="p-3 border-r border-rule">{rule.dstSubnet}</td>
                          <td className="p-3 border-r border-rule">{rule.dstPort}</td>
                          <td className="p-3 text-ink-soft text-[11px]">
                            {rule.description}
                            {rule.id === "3" && (
                              <span className="block text-bad font-bold text-[10px] mt-0.5">
                                [WARNING: RULE SHADOWED BY RULE #2]
                              </span>
                            )}
                          </td>
                        </tr>
                      )
                    })}
                    <tr className={`border-b border-rule ${!statelessEval.matchedRuleId ? "bg-bad/10 font-bold" : ""}`}>
                      <td className="p-3 border-r border-rule">*</td>
                      <td className="p-3 border-r border-rule text-bad font-bold">DROP</td>
                      <td className="p-3 border-r border-rule">ANY</td>
                      <td className="p-3 border-r border-rule">ANY</td>
                      <td className="p-3 border-r border-rule">ANY</td>
                      <td className="p-3 border-r border-rule">ANY</td>
                      <td className="p-3 text-ink-soft text-[11px] italic">Default Implicit Deny</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Packet Sender Controls */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3 p-4 bg-card border border-rule rounded-[2px]">
                <div>
                  <label className="font-mono text-[10px] uppercase tracking-wider font-bold block mb-1">Protocol</label>
                  <select
                    className="w-full p-2 border border-ink bg-paper font-mono text-xs"
                    value={packet.protocol}
                    onChange={(e) => setPacket({ ...packet, protocol: e.target.value as any })}
                  >
                    <option value="TCP">TCP</option>
                    <option value="UDP">UDP</option>
                    <option value="ICMP">ICMP</option>
                  </select>
                </div>
                <div>
                  <label className="font-mono text-[10px] uppercase tracking-wider font-bold block mb-1">Source IP</label>
                  <input
                    className="w-full p-2 border border-ink bg-paper font-mono text-xs"
                    value={packet.srcIp}
                    onChange={(e) => setPacket({ ...packet, srcIp: e.target.value })}
                  />
                </div>
                <div>
                  <label className="font-mono text-[10px] uppercase tracking-wider font-bold block mb-1">Dest IP</label>
                  <input
                    className="w-full p-2 border border-ink bg-paper font-mono text-xs"
                    value={packet.dstIp}
                    onChange={(e) => setPacket({ ...packet, dstIp: e.target.value })}
                  />
                </div>
                <div>
                  <label className="font-mono text-[10px] uppercase tracking-wider font-bold block mb-1">Dest Port</label>
                  <input
                    type="number"
                    className="w-full p-2 border border-ink bg-paper font-mono text-xs"
                    value={packet.dstPort}
                    onChange={(e) => setPacket({ ...packet, dstPort: parseInt(e.target.value, 10) || 0 })}
                  />
                </div>
                <div className="flex flex-col justify-end">
                  <div className="text-[10px] font-mono uppercase tracking-wider text-ink-soft mb-1">Presets</div>
                  <div className="flex gap-1">
                    <Button variant="outline" size="sm" onClick={() => setPacket({ protocol: "TCP", srcIp: "192.168.1.50", dstIp: "10.0.0.5", srcPort: 49152, dstPort: 80 })} className="text-[10px] h-7 px-1.5">HTTP</Button>
                    <Button variant="outline" size="sm" onClick={() => setPacket({ protocol: "TCP", srcIp: "192.168.1.100", dstIp: "10.0.0.5", srcPort: 49152, dstPort: 22 })} className="text-[10px] h-7 px-1.5">SSH</Button>
                    <Button variant="outline" size="sm" onClick={() => setPacket({ protocol: "ICMP", srcIp: "192.168.1.10", dstIp: "8.8.8.8", srcPort: 0, dstPort: 0 })} className="text-[10px] h-7 px-1.5">Ping</Button>
                  </div>
                </div>
              </div>

              {/* Status Output */}
              <div className="p-4 bg-paper border border-ink rounded-[2px] flex items-center justify-between">
                <div>
                  <div className="font-mono text-[10px] uppercase tracking-wider text-ink-soft">Evaluation Result</div>
                  <div className="font-serif text-lg font-bold text-ink mt-0.5">{statelessEval.explanation}</div>
                </div>
                <div className={`px-4 py-2 font-mono text-lg font-bold uppercase tracking-wider border ${
                  statelessEval.action === "ALLOW"
                    ? "bg-ok/10 text-ok border-ok"
                    : "bg-bad/10 text-bad border-bad"
                }`}>
                  {statelessEval.action}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* TAB 2: STATEFUL CONNTRACK TABLE */}
      {activeTab === "stateful" && (
        <div className="space-y-8">
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3">
                <div>
                  <CardTitle className="font-serif text-2xl sm:text-3xl">Stateful Inspection & Conntrack Table</CardTitle>
                  <p className="text-ink-soft text-xs sm:text-sm font-sans mt-1">
                    See how outbound sessions dynamically permit return packets without opening inbound firewall rules.
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button size="sm" onClick={sendStatefulSyn} className="text-xs h-8 px-2.5">1. Send Outbound SYN</Button>
                  <Button size="sm" onClick={sendStatefulReturnAck} variant="outline" className="text-xs h-8 px-2.5">2. Send Inbound Return SYN-ACK</Button>
                  <Button size="sm" onClick={sendSpuriousInboundAck} variant="outline" className="text-xs h-8 px-2.5 text-bad">Test Spurious Inbound ACK</Button>
                  <Button size="sm" onClick={clearStateful} variant="ghost" className="text-xs h-8 px-2 text-ink-soft">Clear</Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Conntrack Table */}
              <div>
                <div className="font-mono text-xs uppercase tracking-wider font-bold mb-2 flex items-center justify-between">
                  <span>Active Dynamic Session Table (`conntrack`)</span>
                  <span className="text-ink-soft">{conntrackTable.length} active sessions</span>
                </div>
                <div className="bg-paper border border-rule rounded-[2px] overflow-x-auto">
                  <table className="w-full text-xs font-mono text-left min-w-[500px]">
                    <thead className="bg-card border-b border-rule text-[10px] uppercase tracking-wider text-ink font-bold">
                      <tr>
                        <th className="p-2.5 border-r border-rule">Protocol</th>
                        <th className="p-2.5 border-r border-rule">Client Socket</th>
                        <th className="p-2.5 border-r border-rule">Server Socket</th>
                        <th className="p-2.5 border-r border-rule">Connection State</th>
                        <th className="p-2.5 border-r border-rule">TTL Expire</th>
                        <th className="p-2.5">Bytes Seen</th>
                      </tr>
                    </thead>
                    <tbody>
                      {conntrackTable.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="p-4 text-center text-ink-soft italic">
                            No active sessions in conntrack table. Click &quot;Send Outbound SYN&quot; to initiate a connection.
                          </td>
                        </tr>
                      ) : (
                        conntrackTable.map((entry, idx) => (
                          <tr key={idx} className="border-b border-rule last:border-0 hover:bg-rule/30">
                            <td className="p-2.5 border-r border-rule font-bold">{entry.protocol}</td>
                            <td className="p-2.5 border-r border-rule">{entry.srcIp}:{entry.srcPort}</td>
                            <td className="p-2.5 border-r border-rule">{entry.dstIp}:{entry.dstPort}</td>
                            <td className="p-2.5 border-r border-rule">
                              <span className={`px-2 py-0.5 border text-[10px] font-bold ${
                                entry.state === "ESTABLISHED"
                                  ? "bg-ok/10 text-ok border-ok"
                                  : "bg-signal/10 text-signal border-signal"
                              }`}>
                                {entry.state}
                              </span>
                            </td>
                            <td className="p-2.5 border-r border-rule">{entry.expiresInSec}s</td>
                            <td className="p-2.5">{entry.bytesSeen} B</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Stateful Activity Log */}
              <div>
                <div className="font-mono text-xs uppercase tracking-wider font-bold mb-2">Kernel Packet Log</div>
                <div className="bg-card border border-rule p-3 space-y-2 max-h-48 overflow-y-auto font-mono text-xs">
                  {statefulLog.length === 0 ? (
                    <div className="text-ink-soft text-center py-2">No packet events logged yet.</div>
                  ) : (
                    statefulLog.map((log, idx) => (
                      <div key={idx} className="flex items-start gap-2 border-b border-rule/50 pb-1.5 last:border-0">
                        <span className={`px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider border shrink-0 ${
                          log.action === "ALLOW" ? "bg-ok/10 text-ok border-ok" : "bg-bad/10 text-bad border-bad"
                        }`}>
                          {log.action}
                        </span>
                        <span className="text-ink-soft text-[10px] px-1 bg-paper border border-rule shrink-0">{log.state}</span>
                        <span className="text-ink break-all text-[11px]">{log.text}</span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* TAB 3: SYN FLOOD & SYN COOKIES */}
      {activeTab === "synflood" && (
        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle className="font-serif text-2xl sm:text-3xl">SYN Flood & RFC 4987 SYN Cookies</CardTitle>
              <p className="text-ink-soft text-xs sm:text-sm font-sans mt-1">
                Compare kernel queue saturation without SYN cookies vs zero-memory cryptographic survival with SYN cookies enabled.
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Controls */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 bg-card border border-rule rounded-[2px]">
                <div>
                  <label className="font-mono text-[10px] uppercase tracking-wider font-bold block mb-1">
                    Backlog Queue Capacity ({backlogCapacity} sockets)
                  </label>
                  <input
                    type="range"
                    min="4"
                    max="64"
                    value={backlogCapacity}
                    onChange={(e) => setBacklogCapacity(parseInt(e.target.value, 10))}
                    className="w-full accent-signal"
                  />
                </div>
                <div>
                  <label className="font-mono text-[10px] uppercase tracking-wider font-bold block mb-1">
                    Attacker Flood Rate ({attackerRate} SYN/sec)
                  </label>
                  <input
                    type="range"
                    min="10"
                    max="100"
                    value={attackerRate}
                    onChange={(e) => setAttackerRate(parseInt(e.target.value, 10))}
                    className="w-full accent-signal"
                  />
                </div>
                <div className="flex gap-2 items-end">
                  <Button
                    onClick={() => runFloodSim(false)}
                    variant="outline"
                    size="sm"
                    className="text-xs h-8 flex-1 text-bad border-bad hover:bg-bad/10"
                  >
                    Simulate Unprotected Flood
                  </Button>
                  <Button
                    onClick={() => runFloodSim(true)}
                    size="sm"
                    className="text-xs h-8 flex-1 bg-signal text-paper hover:bg-signal/90"
                  >
                    Enable SYN Cookies
                  </Button>
                </div>
              </div>

              {/* Simulation Result Statistics */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 bg-paper border border-rule rounded-[2px] text-center">
                  <div className="text-[10px] font-mono uppercase tracking-wider text-ink-soft">Protection Mode</div>
                  <div className={`font-mono text-base font-bold mt-1 ${synCookiesEnabled ? "text-ok" : "text-bad"}`}>
                    {synCookiesEnabled ? "SYN COOKIES ACTIVE" : "STANDARD QUEUE"}
                  </div>
                </div>
                <div className="p-3 bg-paper border border-rule rounded-[2px] text-center">
                  <div className="text-[10px] font-mono uppercase tracking-wider text-ink-soft">Legitimate Drop Rate</div>
                  <div className={`font-mono text-base font-bold mt-1 ${floodResult.dropPercentage > 0 ? "text-bad" : "text-ok"}`}>
                    {floodResult.dropPercentage.toFixed(1)}%
                  </div>
                </div>
                <div className="p-3 bg-paper border border-rule rounded-[2px] text-center">
                  <div className="text-[10px] font-mono uppercase tracking-wider text-ink-soft">Legitimate Connected</div>
                  <div className="font-mono text-base font-bold text-ink mt-1">
                    {floodResult.legitimateConnected} / {floodResult.legitimateAttempts}
                  </div>
                </div>
                <div className="p-3 bg-paper border border-rule rounded-[2px] text-center">
                  <div className="text-[10px] font-mono uppercase tracking-wider text-ink-soft">Kernel Queue Overhead</div>
                  <div className="font-mono text-base font-bold text-ink mt-1">
                    {floodResult.queueOverheadBytes} Bytes
                  </div>
                </div>
              </div>

              {/* Timeline scrub chart */}
              <div>
                <div className="font-mono text-[10px] uppercase tracking-wider font-bold mb-2">Backlog Queue Fill Ratio Timeline (8 Seconds)</div>
                <div className="grid grid-cols-8 gap-1 h-14 bg-card border border-rule p-1">
                  {floodResult.timeline.map((item) => (
                    <div key={item.second} className="flex flex-col justify-end items-center h-full">
                      <div
                        className={`w-full rounded-[1px] transition-all ${
                          item.queueFillRatio >= 1.0
                            ? "bg-bad"
                            : item.queueFillRatio > 0.5
                            ? "bg-signal"
                            : "bg-ok"
                        }`}
                        style={{ height: `${Math.max(10, item.queueFillRatio * 100)}%` }}
                      />
                      <span className="text-[9px] font-mono text-ink-soft mt-1">t={item.second}s</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Single SYN Cookie Bit Breakdown */}
              <div className="p-4 bg-paper border border-rule rounded-[2px] space-y-3">
                <div className="font-serif text-lg font-bold text-ink">RFC 4987 32-Bit ISN Cookie Decomposition</div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-xs">
                  <div className="p-2.5 bg-card border border-rule">
                    <span className="text-ink-soft text-[10px] uppercase block">Top 5 Bits: Time (t mod 32)</span>
                    <span className="font-bold text-signal text-sm">{sampleCookie.tBits} (Window Freshness)</span>
                  </div>
                  <div className="p-2.5 bg-card border border-rule">
                    <span className="text-ink-soft text-[10px] uppercase block">Next 3 Bits: MSS Index</span>
                    <span className="font-bold text-info text-sm">{sampleCookie.mssBits} (MSS = 1460 bytes)</span>
                  </div>
                  <div className="p-2.5 bg-card border border-rule">
                    <span className="text-ink-soft text-[10px] uppercase block">Bottom 24 Bits: Keyed Hash</span>
                    <span className="font-bold text-ink text-sm">0x{sampleCookie.hashBits.toString(16).toUpperCase()}</span>
                  </div>
                </div>
                <div className="text-xs font-mono text-ink-soft flex items-center justify-between border-t border-rule pt-2">
                  <span>Constructed 32-bit ISN: <strong className="text-ink">0x{sampleCookie.isn.toString(16).toUpperCase()} ({sampleCookie.isn})</strong></span>
                  <span className={`font-bold ${verifyResult.valid ? "text-ok" : "text-bad"}`}>
                    {verifyResult.valid ? "✓ Stateless ACK Verification Succeeded" : "✕ Hash Verification Failed"}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
