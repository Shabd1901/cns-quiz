import { describe, it, expect } from 'vitest'
import {
  requestTicketGrantingTicket,
  requestServiceTicket,
  authenticateWithAppServer,
  KerberosAuthenticator
} from '@/lib/applications/kerberos'
import {
  simulateTlsHandshakeFlow,
  calculateHandshakeLatencyMs
} from '@/lib/applications/tlsProtocol'
import {
  buildIpsecPacket,
  evaluateSpdAndSad,
  SpdRule
} from '@/lib/applications/ipsec'
import {
  simulatePgpPipeline,
  createPgpAsciiArmor,
  getEmailTrustComparison
} from '@/lib/applications/secureEmail'
import {
  classifyNetworkFlow,
  evaluateConfusionMatrix,
  simulateAdversarialEvasion,
  triggerSoarPlaybook,
  NetworkFlowFeatures
} from '@/lib/applications/aiSecurity'
import {
  checkPerfectForwardSecrecy,
  getKeyDistributionModels
} from '@/lib/applications/keyManagement'

describe('Module M6 Solvers: Kerberos Authentication', () => {
  it('executes full Kerberos 3-step authentication and detects replays', () => {
    // 1. AS Exchange -> TGT
    const asResult = requestTicketGrantingTicket('alice@CORP', 'alice-pw-key', 'kdc-master-key')
    expect(asResult.tgt.ticketType).toBe('TGT')
    expect(asResult.tgt.encryptedWith).toBe('K_tgs')

    // 2. TGS Exchange -> Service Ticket
    const now = Date.now()
    const tgsAuth: KerberosAuthenticator = {
      clientId: 'alice@CORP',
      timestamp: now,
      clientIp: '192.168.1.100',
      encryptedWithSessionKey: asResult.clientTgsSessionKey
    }
    const tgsResult = requestServiceTicket(
      asResult.tgt,
      tgsAuth,
      'fileserver',
      'server-secret-key',
      asResult.clientTgsSessionKey
    )
    expect(tgsResult.serviceTicket.ticketType).toBe('SERVICE_TICKET')
    expect(tgsResult.serviceTicket.serviceId).toBe('fileserver')

    // 3. Application Server Validation
    const replayCache = new Set<string>()
    const appAuth: KerberosAuthenticator = {
      clientId: 'alice@CORP',
      timestamp: now,
      clientIp: '192.168.1.100',
      encryptedWithSessionKey: tgsResult.clientServerSessionKey
    }
    const appResult = authenticateWithAppServer(
      tgsResult.serviceTicket,
      appAuth,
      'K_fileserver',
      replayCache
    )
    expect(appResult.authenticated).toBe(true)
    expect(appResult.serverMutualAuthToken).toContain('MUTUAL_AUTH_OK')

    // 4. Test Replay Attack
    const replayResult = authenticateWithAppServer(
      tgsResult.serviceTicket,
      appAuth,
      'K_fileserver',
      replayCache
    )
    expect(replayResult.authenticated).toBe(false)
    expect(replayResult.errorReason).toContain('REPLAY DETECTED')
  })
})

describe('Module M6 Solvers: TLS Protocol Architecture', () => {
  it('simulates TLS 1.2 2-RTT vs TLS 1.3 1-RTT and 0-RTT PSK', () => {
    const tls12 = simulateTlsHandshakeFlow('1.2')
    expect(tls12.totalRtt).toBe(2)
    expect(tls12.messages.length).toBe(4)

    const tls13 = simulateTlsHandshakeFlow('1.3', false)
    expect(tls13.totalRtt).toBe(1)
    expect(tls13.messages.length).toBe(3)

    const tls13Psk = simulateTlsHandshakeFlow('1.3', true)
    expect(tls13Psk.totalRtt).toBe(0)

    const latency12 = calculateHandshakeLatencyMs(50, '1.2')
    expect(latency12.handshakeLatencyMs).toBe(100) // 2 * 50ms

    const latency13 = calculateHandshakeLatencyMs(50, '1.3')
    expect(latency13.handshakeLatencyMs).toBe(50) // 1 * 50ms
  })
})

describe('Module M6 Solvers: IPsec (AH vs ESP)', () => {
  it('builds packet models for Transport vs Tunnel mode across AH and ESP', () => {
    const ahTransport = buildIpsecPacket('AH', 'TRANSPORT', 100)
    expect(ahTransport.securityGuarantees.confidentiality).toBe(false)
    expect(ahTransport.securityGuarantees.integrity).toBe(true)
    expect(ahTransport.preservesNat).toBe(false) // AH breaks with NAT

    const espTunnel = buildIpsecPacket('ESP', 'TUNNEL', 100)
    expect(espTunnel.securityGuarantees.confidentiality).toBe(true)
    expect(espTunnel.securityGuarantees.integrity).toBe(true)
    expect(espTunnel.preservesNat).toBe(true)
    expect(espTunnel.overheadBytes).toBe(48)
  })

  it('evaluates Security Policy Database (SPD) rules', () => {
    const rules: SpdRule[] = [
      { id: '1', srcSubnet: '192.168.1.0/24', dstSubnet: '10.0.0.0/24', action: 'PROTECT', protocol: 'ESP', mode: 'TUNNEL', spi: 1001 },
      { id: '2', srcSubnet: '192.168.1.0/24', dstSubnet: '8.8.8.8', action: 'BYPASS' }
    ]

    const protectedMatch = evaluateSpdAndSad(rules, '192.168.1.50', '10.0.0.42')
    expect(protectedMatch.action).toBe('PROTECT')
    expect(protectedMatch.selectedRule?.spi).toBe(1001)

    const bypassMatch = evaluateSpdAndSad(rules, '192.168.1.50', '8.8.8.8')
    expect(bypassMatch.action).toBe('BYPASS')
  })
})

describe('Module M6 Solvers: Secure Email (PGP & S/MIME)', () => {
  it('executes 5-step PGP pipeline: Sign -> Compress -> Encrypt -> KeyWrap -> Armor', () => {
    const pipeline = simulatePgpPipeline('Top secret CNS exam paper draft')
    expect(pipeline.steps.length).toBe(5)
    expect(pipeline.steps[0].name).toContain('Signature')
    expect(pipeline.steps[1].name).toContain('Compression')
    expect(pipeline.steps[2].name).toContain('Symmetric')
    expect(pipeline.steps[3].name).toContain('Wrapping')
    expect(pipeline.steps[4].name).toContain('Armor')

    expect(pipeline.asciiArmoredMessage).toContain('-----BEGIN PGP MESSAGE-----')
    expect(pipeline.asciiArmoredMessage).toContain('-----END PGP MESSAGE-----')

    const comparisons = getEmailTrustComparison()
    expect(comparisons.length).toBeGreaterThanOrEqual(4)
  })
})

describe('Module M6 Solvers: AI Security & Machine Learning', () => {
  it('classifies intrusion traffic and evaluates confusion matrix metrics', () => {
    const synFloodFlow: NetworkFlowFeatures = {
      flowDurationSec: 5,
      totalPackets: 500,
      totalBytes: 20000,
      synFlagRatio: 0.98,
      avgPacketSizeBytes: 40
    }
    const pred = classifyNetworkFlow(synFloodFlow)
    expect(pred.isAttackPredicted).toBe(true)
    expect(pred.attackType).toBe('SYN_FLOOD')

    // Confusion Matrix: TP=90, FP=5, TN=95, FN=10
    const cm = evaluateConfusionMatrix(90, 5, 95, 10)
    expect(cm.accuracy).toBe(0.925)
    expect(cm.precision).toBeCloseTo(0.9474, 3)
    expect(cm.recall).toBeCloseTo(0.9, 3)
  })

  it('demonstrates adversarial evasion and triggers SOAR response playbooks', () => {
    const attackFlow: NetworkFlowFeatures = {
      flowDurationSec: 5,
      totalPackets: 500,
      totalBytes: 20000,
      synFlagRatio: 0.98,
      avgPacketSizeBytes: 40
    }
    const evasion = simulateAdversarialEvasion(attackFlow, 'add-benign-traffic')
    expect(evasion.originalPrediction.isAttackPredicted).toBe(true)
    expect(evasion.adversarialPrediction.isAttackPredicted).toBe(false) // successfully tricked AI classifier
    expect(evasion.evasionSuccessful).toBe(true)

    const soarSteps = triggerSoarPlaybook('DATA_EXFILTRATION', '198.51.100.42', 'host-db-01')
    expect(soarSteps.length).toBeGreaterThanOrEqual(3)
    expect(soarSteps.some(s => s.action.includes('Automated IP Block'))).toBe(true)
  })
})

describe('Module M6 Solvers: Key Management & Forward Secrecy', () => {
  it('validates Perfect Forward Secrecy for cipher suites', () => {
    const ecdhe = checkPerfectForwardSecrecy('TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256')
    expect(ecdhe.hasPfs).toBe(true)
    expect(ecdhe.keyExchangeType).toBe('ECDHE')

    const staticRsa = checkPerfectForwardSecrecy('TLS_RSA_WITH_AES_256_CBC_SHA')
    expect(staticRsa.hasPfs).toBe(false)
    expect(staticRsa.keyExchangeType).toBe('STATIC_RSA')

    const models = getKeyDistributionModels()
    expect(models.length).toBe(3)
  })
})
