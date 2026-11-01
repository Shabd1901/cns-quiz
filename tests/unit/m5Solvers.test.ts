import { describe, it, expect } from 'vitest'
import {
  simulateHandshake,
  predictSequenceNumber,
  simulateTcpResetAttack,
  simulateUdpReflection
} from '@/lib/network/tcpVulnerabilities'
import {
  createLanHosts,
  generateArpPoisonPackets,
  receiveArpPacket
} from '@/lib/network/arpSpoofing'
import {
  probePort,
  scanTarget,
  PortConfiguration
} from '@/lib/network/portScanning'
import {
  simulateSynFlood,
  generateSynCookie,
  verifySynCookie
} from '@/lib/network/synFloodDos'
import {
  simulateKaminskyPoisoning,
  calculateShannonEntropy,
  encodeDnsTunnel,
  decodeDnsTunnel,
  validateDnssecChain
} from '@/lib/network/dnsSecurity'
import {
  matchesCidr,
  matchesPort,
  evaluateStateless,
  StatefulFirewall,
  evaluateDmzPolicy,
  Firewall5TupleRule,
  NetworkPacket
} from '@/lib/network/firewalls'
import {
  evaluateSnortRules,
  detectStatisticalAnomaly,
  evaluateZeroTrustAccess,
  SnortSignature,
  TrafficPacket
} from '@/lib/network/idsHoneypots'

describe('Module M5 Solvers: TCP/IP Vulnerabilities & Attacks', () => {
  it('correctly simulates 3-way handshake sequence numbers and flags', () => {
    const handshake = simulateHandshake('192.168.1.100', '192.168.1.1', 50000, 80, 12345, 67890)
    expect(handshake.step1_syn.seq).toBe(12345)
    expect(handshake.step1_syn.flags.syn).toBe(true)

    expect(handshake.step2_synack.seq).toBe(67890)
    expect(handshake.step2_synack.ack).toBe(12346)
    expect(handshake.step2_synack.flags.syn).toBe(true)
    expect(handshake.step2_synack.flags.ack).toBe(true)

    expect(handshake.step3_ack.seq).toBe(12346)
    expect(handshake.step3_ack.ack).toBe(67891)
    expect(handshake.step3_ack.flags.ack).toBe(true)
    expect(handshake.clientEstablished).toBe(true)
  })

  it('predicts linear sequence numbers and evaluates TCP reset window boundaries', () => {
    const history = [100000, 164000, 228000, 292000] // increment of 64000
    const prediction = predictSequenceNumber(history, 'predictable-linear')
    expect(prediction.nextPredictedIsn).toBe(356000)
    expect(prediction.confidence).toBeGreaterThan(0.9)

    // TCP Reset: in-window vs out-of-window
    const rstInWindow = simulateTcpResetAttack(5000, 1000, 5500)
    expect(rstInWindow.terminated).toBe(true)

    const rstOutWindow = simulateTcpResetAttack(5000, 1000, 6500)
    expect(rstOutWindow.terminated).toBe(false)
  })

  it('evaluates UDP amplification factors for Memcached, NTP, and DNS', () => {
    const memcached = simulateUdpReflection('MEMCACHED', 100)
    expect(memcached.amplificationFactor).toBe(10000)
    expect(memcached.responseBytes).toBe(1000000)
    expect(memcached.riskLevel).toBe('EXTREME')

    const ntp = simulateUdpReflection('NTP', 50)
    expect(ntp.amplificationFactor).toBe(206)
  })
})

describe('Module M5 Solvers: ARP Spoofing & Cache Poisoning', () => {
  it('simulates ARP cache poisoning and DAI defense', () => {
    const hosts = createLanHosts()
    const { packetToAlice } = generateArpPoisonPackets(
      hosts.alice.ip,
      hosts.alice.mac,
      hosts.gateway.ip,
      hosts.gateway.mac,
      hosts.mallory.mac
    )

    // Without DAI: Alice gets poisoned
    const poisoned = receiveArpPacket(hosts.alice, packetToAlice, false)
    expect(poisoned.updated).toBe(true)
    expect(hosts.alice.arpTable.get(hosts.gateway.ip)?.mac).toBe(hosts.mallory.mac)

    // With DAI and DHCP snooping binding table: Mallory is dropped
    const dhcpTable = new Map([[hosts.gateway.ip, hosts.gateway.mac]])
    const daiResult = receiveArpPacket(hosts.alice, packetToAlice, true, dhcpTable)
    expect(daiResult.updated).toBe(false)
    expect(daiResult.alert).toContain('DAI ALERT')
  })
})

describe('Module M5 Solvers: Port Scanning Probes & Stealth', () => {
  const ports: PortConfiguration[] = [
    { port: 80, service: 'HTTP', state: 'open' },
    { port: 22, service: 'SSH', state: 'closed' },
    { port: 445, service: 'SMB', state: 'filtered' }
  ]

  it('simulates TCP SYN half-open scan vs Connect scan', () => {
    const synScan = scanTarget(ports, 'syn', 'linux')
    expect(synScan.openPorts).toContain(80)
    expect(synScan.closedPorts).toContain(22)
    expect(synScan.filteredPorts).toContain(445)
    expect(synScan.stealthScore).toBeGreaterThan(5)

    const connectProbe = probePort(ports[0], 'connect')
    expect(connectProbe.loggedByTarget).toBe(true)

    const synProbe = probePort(ports[0], 'syn')
    expect(synProbe.loggedByTarget).toBe(false)
  })

  it('verifies RFC 793 FIN scan behavior on Linux vs Windows', () => {
    const linuxFin = probePort(ports[0], 'fin', 'linux')
    expect(linuxFin.status).toBe('open|filtered')

    const winFin = probePort(ports[0], 'fin', 'windows')
    expect(winFin.status).toBe('closed') // Windows responds RST to FIN
  })
})

describe('Module M5 Solvers: SYN Flood & RFC 4987 SYN Cookies', () => {
  it('demonstrates queue saturation without SYN cookies and survival with SYN cookies', () => {
    // Small queue of 10 slots under 20 SYN/sec flood
    const unprot = simulateSynFlood(10, 60, 20, 5, false)
    expect(unprot.dropPercentage).toBeGreaterThan(0)
    expect(unprot.queueOverheadBytes).toBeGreaterThan(0)

    const prot = simulateSynFlood(10, 60, 20, 5, true)
    expect(prot.dropPercentage).toBe(0)
    expect(prot.legitimateConnected).toBe(prot.legitimateAttempts)
    expect(prot.queueOverheadBytes).toBe(0)
  })

  it('encodes and verifies 32-bit RFC 4987 SYN Cookies', () => {
    const cookie = generateSynCookie('192.168.1.5', '10.0.0.1', 45000, 443, 'kdc-secret-key', 14, 2)
    expect(cookie.isn).toBeGreaterThan(0)
    expect(cookie.tBits).toBe(14)
    expect(cookie.mssBits).toBe(2)

    // Verification of client ACK (ACK = ISN + 1)
    const clientAck = cookie.isn + 1
    const verified = verifySynCookie('192.168.1.5', '10.0.0.1', 45000, 443, 'kdc-secret-key', clientAck, 14)
    expect(verified.valid).toBe(true)
    expect(verified.recoveredMssIndex).toBe(2)

    // Verification with wrong IP fails
    const invalidIp = verifySynCookie('192.168.1.99', '10.0.0.1', 45000, 443, 'kdc-secret-key', clientAck, 14)
    expect(invalidIp.valid).toBe(false)
  })
})

describe('Module M5 Solvers: DNS Security & Exfiltration', () => {
  it('calculates Kaminsky poisoning probability and source port randomization', () => {
    const withoutSpr = simulateKaminskyPoisoning(500, false)
    const withSpr = simulateKaminskyPoisoning(500, true)
    expect(withoutSpr.probabilitySuccess).toBeGreaterThan(withSpr.probabilitySuccess)
  })

  it('calculates Shannon entropy and encodes/decodes DNS tunneling data', () => {
    const plainEntropy = calculateShannonEntropy('google.com')
    const encoded = encodeDnsTunnel('TOP_SECRET_CNS_CREDENTIALS', 'attacker-c2.net')
    expect(encoded.queries.length).toBeGreaterThan(0)
    expect(encoded.averageEntropy).toBeGreaterThan(plainEntropy)
    expect(encoded.isDetectedAsTunnel).toBe(true)

    const decoded = decodeDnsTunnel(encoded.queries)
    expect(decoded).toBe('TOP_SECRET_CNS_CREDENTIALS')
  })

  it('validates DNSSEC chain of trust and detects tampering', () => {
    const validChain = validateDnssecChain('ietf.org', false)
    expect(validChain.secure).toBe(true)
    expect(validChain.chain.every(c => c.signatureStatus === 'VALID')).toBe(true)

    const tampered = validateDnssecChain('ietf.org', true)
    expect(tampered.secure).toBe(false)
    expect(tampered.failureReason).toContain('DNSSEC BOGUS')
  })
})

describe('Module M5 Solvers: Firewalls (Stateless & Stateful Conntrack)', () => {
  const rules: Firewall5TupleRule[] = [
    { id: '1', order: 1, action: 'ALLOW', protocol: 'TCP', srcSubnet: 'ANY', dstSubnet: '10.0.0.5/32', srcPort: 'ANY', dstPort: '80' },
    { id: '2', order: 2, action: 'DROP', protocol: 'TCP', srcSubnet: '192.168.1.100/32', dstSubnet: 'ANY', srcPort: 'ANY', dstPort: '22' },
    { id: '3', order: 3, action: 'ALLOW', protocol: 'TCP', srcSubnet: '192.168.1.0/24', dstSubnet: 'ANY', srcPort: 'ANY', dstPort: '22' }
  ]

  it('evaluates CIDR subnet matching and stateless 5-tuple filtering', () => {
    expect(matchesCidr('192.168.1.55', '192.168.1.0/24')).toBe(true)
    expect(matchesCidr('192.168.2.1', '192.168.1.0/24')).toBe(false)
    expect(matchesPort(80, '80')).toBe(true)
    expect(matchesPort(8080, '1024-65535')).toBe(true)

    const p1: NetworkPacket = { srcIp: '172.16.0.1', dstIp: '10.0.0.5', srcPort: 49200, dstPort: 80, protocol: 'TCP' }
    expect(evaluateStateless(rules, p1).action).toBe('ALLOW')

    const pBlocked: NetworkPacket = { srcIp: '192.168.1.100', dstIp: '10.0.0.1', srcPort: 49200, dstPort: 22, protocol: 'TCP' }
    expect(evaluateStateless(rules, pBlocked).action).toBe('DROP')
  })

  it('handles stateful connection tracking table for return traffic', () => {
    const fw = new StatefulFirewall(rules)

    // Outbound SYN to port 80
    const syn: NetworkPacket = {
      srcIp: '192.168.1.50',
      dstIp: '10.0.0.5',
      srcPort: 54321,
      dstPort: 80,
      protocol: 'TCP',
      tcpFlags: { syn: true }
    }
    const res1 = fw.processPacket(syn)
    expect(res1.action).toBe('ALLOW')
    expect(res1.state).toBe('NEW')

    // Inbound SYN-ACK response from server to client
    const returnAck: NetworkPacket = {
      srcIp: '10.0.0.5',
      dstIp: '192.168.1.50',
      srcPort: 80,
      dstPort: 54321,
      protocol: 'TCP',
      tcpFlags: { syn: true, ack: true }
    }
    const res2 = fw.processPacket(returnAck)
    expect(res2.action).toBe('ALLOW')
    expect(res2.conntrackHit).toBe(true)
    expect(res2.state).toBe('ESTABLISHED')

    // Spurious inbound ACK with no prior state
    const spurious: NetworkPacket = {
      srcIp: '198.51.100.22',
      dstIp: '10.0.0.5',
      srcPort: 9999,
      dstPort: 80,
      protocol: 'TCP',
      tcpFlags: { ack: true }
    }
    const res3 = fw.processPacket(spurious)
    expect(res3.action).toBe('DROP')
    expect(res3.state).toBe('INVALID')
  })

  it('enforces DMZ isolation policies', () => {
    expect(evaluateDmzPolicy('WAN', 'DMZ', 80).allowed).toBe(true)
    expect(evaluateDmzPolicy('WAN', 'LAN', 80).allowed).toBe(false)
    expect(evaluateDmzPolicy('DMZ', 'LAN', 22).allowed).toBe(false) // Bastion isolation
    expect(evaluateDmzPolicy('LAN', 'DMZ', 5432).allowed).toBe(true)
  })
})

describe('Module M5 Solvers: IDS & Zero Trust Architecture', () => {
  it('matches Snort rules against packet payloads', () => {
    const snortRules: SnortSignature[] = [
      {
        sid: 10001,
        protocol: 'TCP',
        dstPort: '80',
        pattern: '/etc/passwd',
        msg: 'Directory Traversal Attempt',
        severity: 'CRITICAL',
        action: 'ALERT'
      }
    ]

    const pkt: TrafficPacket = {
      id: 'p1',
      srcIp: '10.0.0.99',
      dstIp: '192.168.1.10',
      protocol: 'TCP',
      srcPort: 34567,
      dstPort: 80,
      payload: 'GET /../../../../etc/passwd HTTP/1.1'
    }

    const alerts = evaluateSnortRules(snortRules, pkt)
    expect(alerts.length).toBe(1)
    expect(alerts[0].sid).toBe(10001)
    expect(alerts[0].msg).toBe('Directory Traversal Attempt')
  })

  it('calculates statistical anomalies with Z-scores', () => {
    const normal = detectStatisticalAnomaly(100, 15, 120)
    expect(normal.isAnomaly).toBe(false)
    expect(normal.status).toBe('NORMAL')

    const attack = detectStatisticalAnomaly(100, 15, 180) // (180-100)/15 = 5.33
    expect(attack.isAnomaly).toBe(true)
    expect(attack.status).toBe('ANOMALOUS_ATTACK')
    expect(attack.zScore).toBeGreaterThan(5.0)
  })

  it('evaluates Zero Trust Access requests based on identity, device health, and role', () => {
    const compliantSubject = {
      username: 'alice@corp.internal',
      mfaVerified: true,
      deviceManaged: true,
      edrActive: true,
      diskEncrypted: true,
      clientIp: '10.10.1.20',
      geoCountry: 'US',
      userRole: 'engineer' as const
    }

    const highSecResource = {
      name: 'Production Kubernetes Cluster',
      sensitivity: 'HIGH' as const,
      requiredRole: 'engineer' as const,
      allowedCountries: ['US', 'CA']
    }

    const grantRes = evaluateZeroTrustAccess(compliantSubject, highSecResource)
    expect(grantRes.decision).toBe('GRANT')
    expect(grantRes.score).toBe(100)

    // Unmanaged device without EDR
    const riskySubject = { ...compliantSubject, deviceManaged: false, edrActive: false }
    const denyRes = evaluateZeroTrustAccess(riskySubject, highSecResource)
    expect(denyRes.decision).toBe('DENY')
    expect(denyRes.failedChecks.length).toBeGreaterThanOrEqual(2)
  })
})
