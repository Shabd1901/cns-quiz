/**
 * TCP/IP Layer-Wise Vulnerabilities and Protocol Attacks
 * Simulates TCP 3-way handshake, sequence number prediction, TCP reset attacks,
 * and UDP stateless spoofing/reflection.
 */

export interface TcpPacket {
  srcIp: string
  dstIp: string
  srcPort: number
  dstPort: number
  seq: number
  ack: number
  flags: {
    syn?: boolean
    ack?: boolean
    fin?: boolean
    rst?: boolean
    psh?: boolean
    urg?: boolean
  }
  payloadLen?: number
  description: string
}

export interface HandshakeResult {
  step1_syn: TcpPacket
  step2_synack: TcpPacket
  step3_ack: TcpPacket
  clientEstablished: boolean
  serverEstablished: boolean
}

/**
 * Simulates standard TCP 3-way handshake with given initial sequence numbers.
 */
export function simulateHandshake(
  clientIp = "192.168.1.50",
  serverIp = "192.168.1.10",
  clientPort = 49152,
  serverPort = 80,
  clientIsn = 1000,
  serverIsn = 5000
): HandshakeResult {
  const step1_syn: TcpPacket = {
    srcIp: clientIp,
    dstIp: serverIp,
    srcPort: clientPort,
    dstPort: serverPort,
    seq: clientIsn,
    ack: 0,
    flags: { syn: true },
    payloadLen: 0,
    description: `SYN from client: Seq=${clientIsn}`
  }

  const step2_synack: TcpPacket = {
    srcIp: serverIp,
    dstIp: clientIp,
    srcPort: serverPort,
    dstPort: clientPort,
    seq: serverIsn,
    ack: clientIsn + 1,
    flags: { syn: true, ack: true },
    payloadLen: 0,
    description: `SYN-ACK from server: Seq=${serverIsn}, Ack=${clientIsn + 1}`
  }

  const step3_ack: TcpPacket = {
    srcIp: clientIp,
    dstIp: serverIp,
    srcPort: clientPort,
    dstPort: serverPort,
    seq: clientIsn + 1,
    ack: serverIsn + 1,
    flags: { ack: true },
    payloadLen: 0,
    description: `ACK from client: Seq=${clientIsn + 1}, Ack=${serverIsn + 1}`
  }

  return {
    step1_syn,
    step2_synack,
    step3_ack,
    clientEstablished: true,
    serverEstablished: true
  }
}

/**
 * Predicts the next TCP Initial Sequence Number (ISN).
 * Demonstrates the Kevin Mitnick / Robert Morris 1985 vulnerability when ISNs increment predictably.
 */
export function predictSequenceNumber(
  history: number[],
  mode: "predictable-linear" | "secure-random" = "predictable-linear"
): { nextPredictedIsn: number; pattern: string; confidence: number } {
  if (history.length < 2) {
    return { nextPredictedIsn: history[0] ? history[0] + 64000 : 100000, pattern: "Insufficient data", confidence: 0.1 }
  }

  if (mode === "predictable-linear") {
    // Check if difference between consecutive ISNs is constant or near constant (e.g., standard BSD 128000/sec)
    const diffs: number[] = []
    for (let i = 1; i < history.length; i++) {
      diffs.push(history[i] - history[i - 1])
    }
    const avgDiff = Math.round(diffs.reduce((a, b) => a + b, 0) / diffs.length)
    const nextVal = history[history.length - 1] + avgDiff
    return {
      nextPredictedIsn: nextVal,
      pattern: `Linear constant increment (+${avgDiff} per connection)`,
      confidence: 0.99
    }
  } else {
    // Cryptographically secure pseudorandom number generator (RFC 1948 / RFC 6528)
    return {
      nextPredictedIsn: Math.floor(Math.random() * 0xffffffff),
      pattern: "RFC 6528 PRNG (Hash of endpoints + secret clock)",
      confidence: 1 / 4294967296
    }
  }
}

/**
 * TCP Reset (RST) Attack Simulator.
 * An attacker injects a spoofed TCP RST packet. RFC 793 requires the sequence number
 * to fall within the receiver's receive window [RCV.NXT, RCV.NXT + RCV.WND).
 */
export function simulateTcpResetAttack(
  expectedSeq: number,
  receiveWindow: number,
  injectedSeq: number
): { terminated: boolean; reason: string; windowRange: [number, number] } {
  const windowMin = expectedSeq
  const windowMax = expectedSeq + receiveWindow

  const inWindow = injectedSeq >= windowMin && injectedSeq < windowMax

  if (inWindow) {
    return {
      terminated: true,
      reason: `TCP Reset Accepted: Injected Seq ${injectedSeq} falls within window [${windowMin}, ${windowMax}). Connection terminated immediately.`,
      windowRange: [windowMin, windowMax]
    }
  } else {
    return {
      terminated: false,
      reason: `TCP Reset Dropped: Injected Seq ${injectedSeq} is out of window [${windowMin}, ${windowMax}). Ignored by kernel.`,
      windowRange: [windowMin, windowMax]
    }
  }
}

/**
 * Simulates UDP reflection and amplification attack.
 * Because UDP is connectionless and stateless, the attacker spoofs victim's IP as source.
 */
export function simulateUdpReflection(
  protocol: "DNS" | "NTP" | "SNMP" | "MEMCACHED" | "SSDP",
  requestBytes: number
): {
  protocol: string
  requestBytes: number
  responseBytes: number
  amplificationFactor: number
  riskLevel: "HIGH" | "CRITICAL" | "EXTREME"
} {
  const factors: Record<string, number> = {
    DNS: 54, // e.g. ANY query with EDNS0 (50 bytes in, 2700 bytes out)
    NTP: 206, // monlist command
    SNMP: 6.3, // GetBulk request
    MEMCACHED: 10000, // Memcached UDP amplification (up to 51,000x)
    SSDP: 30.8 // M-SEARCH SSDP query
  }

  const factor = factors[protocol] || 10
  const responseBytes = Math.round(requestBytes * factor)

  let riskLevel: "HIGH" | "CRITICAL" | "EXTREME" = "HIGH"
  if (factor > 1000) riskLevel = "EXTREME"
  else if (factor > 50) riskLevel = "CRITICAL"

  return {
    protocol,
    requestBytes,
    responseBytes,
    amplificationFactor: factor,
    riskLevel
  }
}
