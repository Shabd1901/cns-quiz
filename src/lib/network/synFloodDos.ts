/**
 * SYN Flood DoS, SYN Cookies (RFC 4987), and DDoS Amplification
 * Implements mathematical models of socket backlog queues, stateless SYN cookies,
 * and reflective amplification factors.
 */

export interface BacklogEntry {
  id: string
  srcIp: string
  srcPort: number
  state: 'SYN_RCVD' | 'ESTABLISHED'
  createdAtSeconds: number
  isAttacker: boolean
}

export interface SynFloodSimulationResult {
  totalSeconds: number
  backlogCapacity: number
  legitimateAttempts: number
  legitimateConnected: number
  legitimateDropped: number
  dropPercentage: number
  synCookiesProtected: boolean
  queueOverheadBytes: number
  timeline: Array<{
    second: number
    queueFillRatio: number
    attackerPackets: number
    legitimateState: 'SUCCESS' | 'DROPPED'
  }>
}

/**
 * Simulates TCP SYN Flood attack on a server socket backlog queue.
 */
export function simulateSynFlood(
  backlogCapacity = 128,
  synTimeoutSec = 60,
  attackerRatePerSec = 50,
  durationSec = 10,
  enableSynCookies = false
): SynFloodSimulationResult {
  const queue: BacklogEntry[] = []
  let legitimateAttempts = 0
  let legitimateConnected = 0
  let legitimateDropped = 0
  const timeline: SynFloodSimulationResult['timeline'] = []

  const socketStructureBytes = 840 // Linux struct tcp_request_sock ~840 bytes

  for (let sec = 1; sec <= durationSec; sec++) {
    // 1. Evict expired entries if syn cookies are disabled
    if (!enableSynCookies) {
      for (let i = queue.length - 1; i >= 0; i--) {
        if (sec - queue[i].createdAtSeconds >= synTimeoutSec) {
          queue.splice(i, 1)
        }
      }
    }

    // 2. Attacker floods SYN packets with spoofed IPs
    const attackerCount = attackerRatePerSec
    if (!enableSynCookies) {
      for (let i = 0; i < attackerCount; i++) {
        if (queue.length < backlogCapacity) {
          queue.push({
            id: `att-${sec}-${i}`,
            srcIp: `198.51.100.${(i * 7) % 254 + 1}`,
            srcPort: 1024 + ((i * 13) % 60000),
            state: 'SYN_RCVD',
            createdAtSeconds: sec,
            isAttacker: true
          })
        }
      }
    }

    // 3. Legitimate client attempts to connect (1 per second)
    legitimateAttempts++
    let legState: 'SUCCESS' | 'DROPPED' = 'DROPPED'

    if (enableSynCookies) {
      // With SYN cookies, server does NOT allocate queue memory at SYN time!
      // Server generates ISN crypto cookie and responds SYN-ACK.
      // When legitimate client completes 3-way handshake with ACK, connection establishes.
      legitimateConnected++
      legState = 'SUCCESS'
    } else {
      if (queue.length < backlogCapacity) {
        queue.push({
          id: `leg-${sec}`,
          srcIp: '10.0.0.42',
          srcPort: 54321,
          state: 'SYN_RCVD',
          createdAtSeconds: sec,
          isAttacker: false
        })
        legitimateConnected++
        legState = 'SUCCESS'
      } else {
        legitimateDropped++
        legState = 'DROPPED'
      }
    }

    timeline.push({
      second: sec,
      queueFillRatio: enableSynCookies ? 0 : Math.min(1.0, queue.length / backlogCapacity),
      attackerPackets: attackerCount,
      legitimateState: legState
    })
  }

  const dropPercentage = legitimateAttempts > 0
    ? (legitimateDropped / legitimateAttempts) * 100
    : 0

  const queueOverheadBytes = enableSynCookies ? 0 : queue.length * socketStructureBytes

  return {
    totalSeconds: durationSec,
    backlogCapacity,
    legitimateAttempts,
    legitimateConnected,
    legitimateDropped,
    dropPercentage,
    synCookiesProtected: enableSynCookies,
    queueOverheadBytes,
    timeline
  }
}

/**
 * RFC 4987 SYN Cookie Encoding:
 * Top 5 bits: t mod 32 (timestamp counter in ~64 second units)
 * Next 3 bits: MSS index (encodes Maximum Segment Size chosen by server)
 * Bottom 24 bits: s = hash(src, dst, sport, dport, t, secret) mod 2^24
 */
export function generateSynCookie(
  srcIp: string,
  dstIp: string,
  srcPort: number,
  dstPort: number,
  secretKey: string,
  timestampMinutes: number,
  mssIndex = 2 // 0=536, 1=1200, 2=1460, 3=8960
): { isn: number; tBits: number; mssBits: number; hashBits: number } {
  const tBits = (timestampMinutes % 32) & 0x1f
  const mssBits = mssIndex & 0x07

  // Simple deterministic 24-bit hash simulation representing cryptographic HMAC
  let hash = 0x811c9dc5
  const combined = `${srcIp}:${dstIp}:${srcPort}:${dstPort}:${tBits}:${secretKey}`
  for (let i = 0; i < combined.length; i++) {
    hash ^= combined.charCodeAt(i)
    hash = Math.imul(hash, 0x01000193)
  }
  const hashBits = Math.abs(hash) & 0x00ffffff // 24 bits

  // Pack into 32-bit unsigned integer:
  // [5 bits: t] [3 bits: mss] [24 bits: hash]
  const isn = ((tBits << 27) | (mssBits << 24) | hashBits) >>> 0

  return { isn, tBits, mssBits, hashBits }
}

/**
 * Validates a received TCP ACK sequence number against SYN cookie parameters.
 */
export function verifySynCookie(
  srcIp: string,
  dstIp: string,
  srcPort: number,
  dstPort: number,
  secretKey: string,
  receivedAck: number,
  currentTimestampMinutes: number
): { valid: boolean; recoveredMssIndex: number; elapsedWindowMinutes: number } {
  // Client's ACK number equals Server's ISN + 1
  const isn = (receivedAck - 1) >>> 0

  const receivedT = (isn >>> 27) & 0x1f
  const recoveredMssIndex = (isn >>> 24) & 0x07
  const receivedHash = isn & 0x00ffffff

  // Check window freshness (must be within ~2 time windows, e.g. 0 to 2 minutes)
  const currentT = (currentTimestampMinutes % 32) & 0x1f
  const elapsedWindow = (currentT - receivedT + 32) % 32

  if (elapsedWindow > 2) {
    return { valid: false, recoveredMssIndex, elapsedWindowMinutes: elapsedWindow }
  }

  // Recalculate hash with receivedT
  let hash = 0x811c9dc5
  const combined = `${srcIp}:${dstIp}:${srcPort}:${dstPort}:${receivedT}:${secretKey}`
  for (let i = 0; i < combined.length; i++) {
    hash ^= combined.charCodeAt(i)
    hash = Math.imul(hash, 0x01000193)
  }
  const expectedHash = Math.abs(hash) & 0x00ffffff

  const valid = receivedHash === expectedHash

  return {
    valid,
    recoveredMssIndex,
    elapsedWindowMinutes: elapsedWindow
  }
}
