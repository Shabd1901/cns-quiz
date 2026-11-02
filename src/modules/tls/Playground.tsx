"use client"

import React, { useState } from "react"
import {
  requestTicketGrantingTicket,
  requestServiceTicket,
  authenticateWithAppServer,
  KerberosAuthenticator
} from "@/lib/applications/kerberos"
import {
  simulateTlsHandshakeFlow,
  calculateHandshakeLatencyMs,
  TlsVersion
} from "@/lib/applications/tlsProtocol"
import {
  buildIpsecPacket,
  evaluateSpdAndSad,
  IpsecProtocol,
  IpsecMode,
  SpdRule
} from "@/lib/applications/ipsec"

export default function TLSApplicationsPlayground() {
  const [activeTab, setActiveTab] = useState<'tls' | 'kerberos' | 'ipsec'>('tls')

  // ========================================================
  // TAB 1: TLS 1.2 vs 1.3 PROTOCOL FLIGHT EXPLORER
  // ========================================================
  const [tlsVersion, setTlsVersion] = useState<TlsVersion>('1.3')
  const [isZeroRtt, setIsZeroRtt] = useState<boolean>(false)
  const [rttMs, setRttMs] = useState<number>(80)

  const tlsHandshake = simulateTlsHandshakeFlow(tlsVersion, tlsVersion === '1.3' ? isZeroRtt : false)
  const latency = calculateHandshakeLatencyMs(rttMs, tlsVersion)

  // ========================================================
  // TAB 2: KERBEROS v5 TICKET EXCHANGE SIMULATION
  // ========================================================
  const [clientSkewSec, setClientSkewSec] = useState<number>(30)

  // Execute Kerberos steps
  const asResult = requestTicketGrantingTicket('alice@CAMPUS.EDU', 'alice-pw-key', 'kdc-master-key')
  const now = asResult.tgt.timestamp + clientSkewSec * 1000
  const tgsAuth: KerberosAuthenticator = {
    clientId: 'alice@CAMPUS.EDU',
    timestamp: now,
    clientIp: '192.168.1.100',
    encryptedWithSessionKey: asResult.clientTgsSessionKey
  }
  const tgsResult = requestServiceTicket(
    asResult.tgt,
    tgsAuth,
    'fileserver',
    'fileserver-secret-key',
    asResult.clientTgsSessionKey
  )

  const replayCache = new Set<string>()
  const appAuth: KerberosAuthenticator = {
    clientId: 'alice@CAMPUS.EDU',
    timestamp: now,
    clientIp: '192.168.1.100',
    encryptedWithSessionKey: tgsResult.clientServerSessionKey
  }
  const appResult = authenticateWithAppServer(
    tgsResult.serviceTicket,
    appAuth,
    'fileserver-secret-key',
    replayCache
  )

  // ========================================================
  // TAB 3: IPSEC (AH vs ESP) PACKET DISSECTOR
  // ========================================================
  const [ipsecProto, setIpsecProto] = useState<IpsecProtocol>('ESP')
  const [ipsecMode, setIpsecMode] = useState<IpsecMode>('TUNNEL')
  const [payloadSize, setPayloadSize] = useState<number>(120)

  const ipsecPacket = buildIpsecPacket(ipsecProto, ipsecMode, payloadSize)

  const spdRules: SpdRule[] = [
    { id: '1', srcSubnet: '192.168.1.0/24', dstSubnet: '10.0.0.0/24', action: 'PROTECT', protocol: 'ESP', mode: 'TUNNEL', spi: 0x1A2B3C },
    { id: '2', srcSubnet: '192.168.1.0/24', dstSubnet: '8.8.8.8', action: 'BYPASS' }
  ]
  const spdResult = evaluateSpdAndSad(spdRules, '192.168.1.50', '10.0.0.42')

  return (
    <div className="space-y-8 font-mono">
      {/* Top Header */}
      <div className="border-b border-rule pb-4">
        <div className="flex items-center gap-3">
          <span className="font-mono text-xs uppercase tracking-widest text-signal font-bold">
            Module 6 Interactive Lab
          </span>
          <span className="font-mono text-[10px] px-1.5 py-0.5 border border-rule text-ink-soft">
            Kerberos · TLS 1.3 · IPsec AH/ESP
          </span>
        </div>
        <h2 className="font-serif text-3xl font-bold text-ink mt-1">
          Network Security Protocols & Authentication Architecture
        </h2>
        <p className="font-sans text-xs sm:text-sm text-ink-soft mt-1">
          Step through Kerberos 3-step ticket grants, measure TLS 1.2 vs 1.3 flight latencies, and dissect IPsec AH vs ESP packet headers.
        </p>

        {/* Tab Switcher */}
        <div className="flex items-center gap-2 mt-4 text-xs">
          <button
            onClick={() => setActiveTab('tls')}
            className={`px-3 py-1.5 border transition-all ${
              activeTab === 'tls'
                ? "border-signal bg-signal text-paper font-bold shadow-[2px_2px_0_var(--ink)]"
                : "border-rule bg-card text-ink hover:border-ink"
            }`}
          >
            1. TLS 1.2 vs 1.3 Flights
          </button>
          <button
            onClick={() => setActiveTab('kerberos')}
            className={`px-3 py-1.5 border transition-all ${
              activeTab === 'kerberos'
                ? "border-signal bg-signal text-paper font-bold shadow-[2px_2px_0_var(--ink)]"
                : "border-rule bg-card text-ink hover:border-ink"
            }`}
          >
            2. Kerberos v5 Ticketing
          </button>
          <button
            onClick={() => setActiveTab('ipsec')}
            className={`px-3 py-1.5 border transition-all ${
              activeTab === 'ipsec'
                ? "border-signal bg-signal text-paper font-bold shadow-[2px_2px_0_var(--ink)]"
                : "border-rule bg-card text-ink hover:border-ink"
            }`}
          >
            3. IPsec (AH vs ESP) Dissector
          </button>
        </div>
      </div>

      {/* ======================================================== */}
      {/* TAB 1: TLS 1.2 vs 1.3 FLIGHT EXPLORER                   */}
      {/* ======================================================== */}
      {activeTab === 'tls' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="p-5 bg-card border border-ink shadow-[4px_4px_0_var(--rule)] space-y-4">
              <h3 className="font-serif text-lg font-bold text-ink border-b border-rule pb-2">
                Handshake Parameters
              </h3>

              <div className="space-y-2">
                <label className="text-xs uppercase text-ink-soft block font-bold">Protocol Version:</label>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <button
                    onClick={() => { setTlsVersion('1.2'); setIsZeroRtt(false) }}
                    className={`p-2 border text-center ${
                      tlsVersion === '1.2'
                        ? "border-signal bg-signal text-paper font-bold"
                        : "border-rule bg-paper text-ink hover:border-ink"
                    }`}
                  >
                    TLS 1.2 (2-RTT)
                  </button>
                  <button
                    onClick={() => setTlsVersion('1.3')}
                    className={`p-2 border text-center ${
                      tlsVersion === '1.3'
                        ? "border-signal bg-signal text-paper font-bold"
                        : "border-rule bg-paper text-ink hover:border-ink"
                    }`}
                  >
                    TLS 1.3 (1-RTT)
                  </button>
                </div>
              </div>

              {tlsVersion === '1.3' && (
                <div className="space-y-2 pt-2 border-t border-rule text-xs">
                  <label className="text-xs uppercase text-ink-soft block font-bold">Early Data (0-RTT):</label>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setIsZeroRtt(false)}
                      className={`px-3 py-1 border text-xs ${
                        !isZeroRtt ? "border-signal bg-signal text-paper font-bold" : "border-rule bg-paper text-ink"
                      }`}
                    >
                      Standard (1-RTT)
                    </button>
                    <button
                      onClick={() => setIsZeroRtt(true)}
                      className={`px-3 py-1 border text-xs ${
                        isZeroRtt ? "border-signal bg-signal text-paper font-bold" : "border-rule bg-paper text-ink"
                      }`}
                    >
                      0-RTT PSK Early Data
                    </button>
                  </div>
                </div>
              )}

              <div className="space-y-2 pt-2 border-t border-rule text-xs">
                <div className="flex justify-between">
                  <span className="text-ink-soft">Round-Trip Time (RTT):</span>
                  <span className="font-bold text-ink">{rttMs} ms</span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="250"
                  step="10"
                  value={rttMs}
                  onChange={e => setRttMs(parseInt(e.target.value))}
                  className="w-full accent-signal"
                />
              </div>

              {/* Latency Summary */}
              <div className="p-3 bg-paper border border-rule space-y-1.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-ink-soft">Handshake Flights:</span>
                  <span className="font-bold text-signal">{tlsHandshake.totalRtt} RTT</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-ink-soft">Handshake Time:</span>
                  <span className="font-bold text-ink">{latency.handshakeLatencyMs} ms</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-ink-soft">Cipher Suite:</span>
                  <span className="font-bold text-ok">{tlsHandshake.cipherSuite}</span>
                </div>
              </div>
            </div>

            {/* Flight Sequence Diagram */}
            <div className="lg:col-span-2 p-5 bg-card border border-ink shadow-[4px_4px_0_var(--rule)] space-y-4">
              <div className="flex justify-between items-center border-b border-rule pb-2">
                <h3 className="font-serif text-lg font-bold text-ink">
                  Handshake Packet Sequence (Client ↔ Server)
                </h3>
                <span className="font-mono text-xs text-signal font-bold">
                  TLS {tlsVersion} ({tlsHandshake.messages.length} Flights)
                </span>
              </div>

              <div className="space-y-3 text-xs">
                {tlsHandshake.messages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`p-3 border ${
                      msg.direction === 'CLIENT_TO_SERVER'
                        ? "border-ink bg-paper ml-0 mr-8"
                        : "border-signal bg-paper ml-8 mr-0"
                    }`}
                  >
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-bold text-[11px] text-signal uppercase">
                        {msg.direction === 'CLIENT_TO_SERVER' ? "→ Client to Server" : "← Server to Client"}
                      </span>
                      <span className="text-[10px] text-ink-soft">Flight {msg.flight}</span>
                    </div>

                    <div className="font-bold text-ink mb-1 text-sm">{msg.name}</div>
                    <div className="p-2 bg-card border border-rule text-[11px] space-y-1">
                      <div className="text-ink-soft">{msg.description}</div>
                      <div className="font-bold text-ink-soft text-[10px] mt-1">Fields:</div>
                      {Object.entries(msg.payloadFields).map(([k, v]) => (
                        <div key={k} className="text-ink truncate">· <strong>{k}:</strong> {v}</div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 2: KERBEROS TICKETING SIMULATOR                     */}
      {/* ======================================================== */}
      {activeTab === 'kerberos' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="p-5 bg-card border border-ink shadow-[4px_4px_0_var(--rule)] space-y-4">
              <h3 className="font-serif text-lg font-bold text-ink border-b border-rule pb-2">
                Kerberos Session Setup
              </h3>

              <div className="space-y-1 text-xs">
                <span className="text-ink-soft uppercase text-[10px] font-bold">Client Principal:</span>
                <div className="p-2 border border-rule bg-paper text-ink">alice@CAMPUS.EDU</div>
              </div>

              <div className="space-y-1 text-xs">
                <span className="text-ink-soft uppercase text-[10px] font-bold">Target Service:</span>
                <div className="p-2 border border-rule bg-paper text-ink">fileserver</div>
              </div>

              <div className="space-y-2 pt-2 border-t border-rule text-xs">
                <div className="flex justify-between">
                  <span className="text-ink-soft">Clock Skew Offset:</span>
                  <span className={`font-bold ${Math.abs(clientSkewSec) > 300 ? "text-bad" : "text-ok"}`}>
                    {clientSkewSec} seconds
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="600"
                  step="15"
                  value={clientSkewSec}
                  onChange={e => setClientSkewSec(parseInt(e.target.value))}
                  className="w-full accent-signal"
                />
              </div>

              <div className={`p-3 border text-xs space-y-1 ${
                appResult.authenticated ? "border-ok bg-ok/10 text-ok" : "border-bad bg-bad/10 text-bad"
              }`}>
                <div className="font-bold uppercase tracking-wider">
                  {appResult.authenticated ? "✓ AUTHENTICATION OK" : "✗ AUTHENTICATION FAILED"}
                </div>
                <div className="text-[11px]">
                  {appResult.authenticated
                    ? `Mutual Auth verified: ${appResult.serverMutualAuthToken}`
                    : `Error: ${appResult.errorReason || "Clock skew exceeded threshold."}`}
                </div>
              </div>
            </div>

            {/* Kerberos Ticket Inspection */}
            <div className="lg:col-span-2 p-5 bg-card border border-ink shadow-[4px_4px_0_var(--rule)] space-y-4">
              <div className="flex justify-between items-center border-b border-rule pb-2">
                <h3 className="font-serif text-lg font-bold text-ink">
                  Kerberos 3-Phase Ticket Exchange
                </h3>
                <span className="font-mono text-xs text-signal font-bold">Realm: CAMPUS.EDU</span>
              </div>

              <div className="space-y-3 text-xs">
                {/* 1. AS Exchange */}
                <div className="p-3 border border-rule bg-paper space-y-2">
                  <div className="flex justify-between font-bold text-signal">
                    <span>1. AS Exchange (Authentication Service)</span>
                    <span className="text-[10px] px-1 border border-rule bg-card">KRB_AS_REP</span>
                  </div>
                  <div className="text-[11px] text-ink-soft">
                    Issued TGT encrypted with K_TGS. Client-TGS Session Key: {asResult.clientTgsSessionKey}
                  </div>
                  <pre className="p-2 bg-card border border-rule text-[10px] text-ink overflow-x-auto">
                    {JSON.stringify(asResult.tgt, null, 2)}
                  </pre>
                </div>

                {/* 2. TGS Exchange */}
                <div className="p-3 border border-rule bg-paper space-y-2">
                  <div className="flex justify-between font-bold text-ok">
                    <span>2. TGS Exchange (Ticket Granting Service)</span>
                    <span className="text-[10px] px-1 border border-rule bg-card">KRB_TGS_REP</span>
                  </div>
                  <div className="text-[11px] text-ink-soft">
                    Issued Service Ticket for fileserver. Client-Server Session Key: {tgsResult.clientServerSessionKey}
                  </div>
                  <pre className="p-2 bg-card border border-rule text-[10px] text-ink overflow-x-auto">
                    {JSON.stringify(tgsResult.serviceTicket, null, 2)}
                  </pre>
                </div>

                {/* 3. AP Validation */}
                <div className="p-3 border border-rule bg-paper space-y-1">
                  <div className="flex justify-between font-bold text-ink">
                    <span>3. Client/Server AP Exchange</span>
                    <span className="text-[10px] px-1 border border-rule bg-card">KRB_AP_REP</span>
                  </div>
                  <div className="text-[11px] text-ink-soft">
                    Mutual Authentication: {appResult.serverMutualAuthToken || "Denied"}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 3: IPSEC (AH vs ESP) DISSECTOR                      */}
      {/* ======================================================== */}
      {activeTab === 'ipsec' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="p-5 bg-card border border-ink shadow-[4px_4px_0_var(--rule)] space-y-4">
              <h3 className="font-serif text-lg font-bold text-ink border-b border-rule pb-2">
                IPsec Policy & Mode
              </h3>

              <div className="space-y-2">
                <label className="text-xs uppercase text-ink-soft block font-bold">Protocol:</label>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <button
                    onClick={() => setIpsecProto('AH')}
                    className={`p-2 border text-center ${
                      ipsecProto === 'AH'
                        ? "border-signal bg-signal text-paper font-bold"
                        : "border-rule bg-paper text-ink hover:border-ink"
                    }`}
                  >
                    AH (Protocol 51)
                  </button>
                  <button
                    onClick={() => setIpsecProto('ESP')}
                    className={`p-2 border text-center ${
                      ipsecProto === 'ESP'
                        ? "border-signal bg-signal text-paper font-bold"
                        : "border-rule bg-paper text-ink hover:border-ink"
                    }`}
                  >
                    ESP (Protocol 50)
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs uppercase text-ink-soft block font-bold">Mode:</label>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <button
                    onClick={() => setIpsecMode('TRANSPORT')}
                    className={`p-2 border text-center ${
                      ipsecMode === 'TRANSPORT'
                        ? "border-signal bg-signal text-paper font-bold"
                        : "border-rule bg-paper text-ink hover:border-ink"
                    }`}
                  >
                    Transport Mode
                  </button>
                  <button
                    onClick={() => setIpsecMode('TUNNEL')}
                    className={`p-2 border text-center ${
                      ipsecMode === 'TUNNEL'
                        ? "border-signal bg-signal text-paper font-bold"
                        : "border-rule bg-paper text-ink hover:border-ink"
                    }`}
                  >
                    Tunnel Mode
                  </button>
                </div>
              </div>

              {/* Payload Size */}
              <div className="space-y-2 pt-2 border-t border-rule text-xs">
                <div className="flex justify-between">
                  <span className="text-ink-soft">Payload Size:</span>
                  <span className="font-bold text-ink">{payloadSize} bytes</span>
                </div>
                <input
                  type="range"
                  min="40"
                  max="1400"
                  step="20"
                  value={payloadSize}
                  onChange={e => setPayloadSize(parseInt(e.target.value))}
                  className="w-full accent-signal"
                />
              </div>

              {/* SPD Action */}
              <div className="p-3 bg-paper border border-rule text-xs space-y-1">
                <div className="text-ink-soft uppercase text-[10px] font-bold">SPD Policy Selector:</div>
                <div className="flex justify-between">
                  <span className="text-ink-soft">Policy Action:</span>
                  <span className="font-bold text-signal">{spdResult.action}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-ink-soft">SAD SPI:</span>
                  <span className="font-bold text-ink">{spdResult.selectedRule?.spi || "N/A"}</span>
                </div>
              </div>
            </div>

            {/* Packet Header Layout Dissection */}
            <div className="lg:col-span-2 p-5 bg-card border border-ink shadow-[4px_4px_0_var(--rule)] space-y-4">
              <div className="flex justify-between items-center border-b border-rule pb-2">
                <h3 className="font-serif text-lg font-bold text-ink">
                  Packet Dissection ({ipsecProto} in {ipsecMode} Mode)
                </h3>
                <span className="text-xs font-bold text-signal">
                  Overhead: +{ipsecPacket.overheadBytes} bytes (Total: {ipsecPacket.totalSizeBytes}B)
                </span>
              </div>

              <div className="space-y-2 text-xs">
                {ipsecPacket.segments.map((s, sIdx) => (
                  <div
                    key={sIdx}
                    className={`p-3 border flex justify-between items-center ${
                      s.isEncrypted
                        ? "border-bad bg-bad/10 text-bad font-bold"
                        : s.isAuthenticated
                          ? "border-ok bg-ok/10 text-ok font-bold"
                          : "border-rule bg-paper text-ink"
                    }`}
                  >
                    <div>
                      <div className="text-xs uppercase">{s.name}</div>
                      <div className="text-[10px] opacity-75">{s.description}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold">{s.bytes} Bytes</div>
                      <div className="text-[9px] uppercase tracking-wider">
                        {s.isEncrypted ? "Encrypted" : s.isAuthenticated ? "Authenticated" : "Clear"}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-3 bg-paper border border-rule text-xs space-y-1">
                <div className="font-bold text-ink uppercase text-[10px]">Security Guarantees:</div>
                <div className="flex gap-4 text-[11px]">
                  <span>Confidentiality: <strong className={ipsecPacket.securityGuarantees.confidentiality ? "text-ok" : "text-bad"}>{ipsecPacket.securityGuarantees.confidentiality ? "YES" : "NO"}</strong></span>
                  <span>Integrity: <strong className={ipsecPacket.securityGuarantees.integrity ? "text-ok" : "text-bad"}>{ipsecPacket.securityGuarantees.integrity ? "YES" : "NO"}</strong></span>
                  <span>NAT Compatible: <strong className={ipsecPacket.preservesNat ? "text-ok" : "text-bad"}>{ipsecPacket.preservesNat ? "YES" : "NO (Breaks ICV)"}</strong></span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
