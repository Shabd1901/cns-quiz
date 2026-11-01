/**
 * Port Scanning and Reconnaissance Techniques
 * Simulates TCP Connect, SYN Stealth, FIN, NULL, Xmas, and UDP scans according to RFC 793 and Nmap behavior.
 */

export type ScanType = 'connect' | 'syn' | 'fin' | 'null' | 'xmas' | 'udp'

export type PortStatus = 'open' | 'closed' | 'filtered' | 'open|filtered'

export interface PortScanProbe {
  port: number
  type: ScanType
  sentFlags: string[]
  receivedFlags: string[] | 'ICMP-UNREACHABLE' | 'NO-RESPONSE'
  status: PortStatus
  explanation: string
  loggedByTarget: boolean
}

export interface PortConfiguration {
  port: number
  service: string
  state: 'open' | 'closed' | 'filtered'
}

/**
 * Evaluates how a target TCP/IP stack responds to a probe based on RFC 793.
 *
 * Rules:
 * 1. SYN scan:
 *    - Open: Target replies SYN-ACK. Attacker sends RST immediately (Half-Open; rarely logged by app layer).
 *    - Closed: Target replies RST.
 *    - Filtered: Packet dropped by firewall, timeout (no response).
 *
 * 2. Connect scan:
 *    - Open: Full 3-way handshake (SYN -> SYN-ACK -> ACK -> FIN). Logged by application daemon.
 *    - Closed: Target replies RST.
 *
 * 3. FIN / NULL / Xmas scans (RFC 793 rule):
 *    - Closed: Replies RST.
 *    - Open or Filtered: Silently ignored/dropped (no response).
 *    - Note: Microsoft Windows stacks violate RFC 793 and send RST for all ports.
 *
 * 4. UDP scan:
 *    - Closed: ICMP Port Unreachable (Type 3, Code 3).
 *    - Open: UDP response or no response if service is quiet.
 */
export function probePort(
  targetPortConfig: PortConfiguration,
  scanType: ScanType,
  targetOs: 'linux' | 'windows' = 'linux'
): PortScanProbe {
  const { port, state } = targetPortConfig

  if (scanType === 'connect') {
    if (state === 'open') {
      return {
        port,
        type: 'connect',
        sentFlags: ['SYN', 'ACK', 'FIN'],
        receivedFlags: ['SYN-ACK'],
        status: 'open',
        explanation: 'Full TCP 3-way handshake established. Application daemon logged connection.',
        loggedByTarget: true
      }
    } else if (state === 'closed') {
      return {
        port,
        type: 'connect',
        sentFlags: ['SYN'],
        receivedFlags: ['RST'],
        status: 'closed',
        explanation: 'Port closed; target kernel responded with RST flag.',
        loggedByTarget: false
      }
    } else {
      return {
        port,
        type: 'connect',
        sentFlags: ['SYN'],
        receivedFlags: 'NO-RESPONSE',
        status: 'filtered',
        explanation: 'Firewall dropped SYN packet without responding; probe timed out.',
        loggedByTarget: false
      }
    }
  }

  if (scanType === 'syn') {
    if (state === 'open') {
      return {
        port,
        type: 'syn',
        sentFlags: ['SYN', 'RST'],
        receivedFlags: ['SYN-ACK'],
        status: 'open',
        explanation: 'Target responded with SYN-ACK; scanner immediately tore down with RST before 3-way completion. Stealthy.',
        loggedByTarget: false
      }
    } else if (state === 'closed') {
      return {
        port,
        type: 'syn',
        sentFlags: ['SYN'],
        receivedFlags: ['RST'],
        status: 'closed',
        explanation: 'Target responded with RST packet indicating closed port.',
        loggedByTarget: false
      }
    } else {
      return {
        port,
        type: 'syn',
        sentFlags: ['SYN'],
        receivedFlags: 'NO-RESPONSE',
        status: 'filtered',
        explanation: 'Firewall silently dropped SYN probe; scanner detected timeout.',
        loggedByTarget: false
      }
    }
  }

  if (scanType === 'fin' || scanType === 'null' || scanType === 'xmas') {
    const flagsSent =
      scanType === 'fin' ? ['FIN'] :
      scanType === 'null' ? [] :
      ['FIN', 'PSH', 'URG']

    if (targetOs === 'windows') {
      // Windows replies RST regardless of whether port is open or closed
      return {
        port,
        type: scanType,
        sentFlags: flagsSent,
        receivedFlags: ['RST'],
        status: 'closed',
        explanation: 'Windows TCP/IP stack violates RFC 793: responds with RST for both open and closed ports.',
        loggedByTarget: false
      }
    }

    if (state === 'closed') {
      return {
        port,
        type: scanType,
        sentFlags: flagsSent,
        receivedFlags: ['RST'],
        status: 'closed',
        explanation: 'Closed port adheres to RFC 793 by generating RST response.',
        loggedByTarget: false
      }
    } else {
      // Open or filtered ports drop unexpected FIN/NULL/Xmas frames without reply
      return {
        port,
        type: scanType,
        sentFlags: flagsSent,
        receivedFlags: 'NO-RESPONSE',
        status: 'open|filtered',
        explanation: 'RFC 793 rule: Open port drops unsolicited frame without response. Inconclusive between open and firewall-filtered.',
        loggedByTarget: false
      }
    }
  }

  // UDP scan
  if (state === 'closed') {
    return {
      port,
      type: 'udp',
      sentFlags: ['UDP-PROBE'],
      receivedFlags: 'ICMP-UNREACHABLE',
      status: 'closed',
      explanation: 'Target kernel returned ICMP Port Unreachable (Type 3, Code 3).',
      loggedByTarget: false
    }
  } else if (state === 'open') {
    return {
      port,
      type: 'udp',
      sentFlags: ['UDP-PROBE'],
      receivedFlags: ['UDP-RESPONSE'],
      status: 'open',
      explanation: 'UDP service responded with application payload.',
      loggedByTarget: true
    }
  } else {
    return {
      port,
      type: 'udp',
      sentFlags: ['UDP-PROBE'],
      receivedFlags: 'NO-RESPONSE',
      status: 'open|filtered',
      explanation: 'No response received; could be open non-responsive service or firewall filter.',
      loggedByTarget: false
    }
  }
}

/**
 * Simulates an Nmap scan across an array of target ports.
 */
export function scanTarget(
  targetPorts: PortConfiguration[],
  scanType: ScanType,
  targetOs: 'linux' | 'windows' = 'linux'
): {
  scanType: ScanType
  results: PortScanProbe[]
  openPorts: number[]
  closedPorts: number[]
  filteredPorts: number[]
  stealthScore: number // 1 to 10
} {
  const results = targetPorts.map(p => probePort(p, scanType, targetOs))
  const openPorts = results.filter(r => r.status === 'open' || r.status === 'open|filtered').map(r => r.port)
  const closedPorts = results.filter(r => r.status === 'closed').map(r => r.port)
  const filteredPorts = results.filter(r => r.status === 'filtered').map(r => r.port)

  let stealthScore = 3
  if (scanType === 'connect') stealthScore = 1 // creates connection log in auth.log / access.log
  else if (scanType === 'syn') stealthScore = 7 // bypassed legacy app logging
  else if (scanType === 'fin' || scanType === 'null' || scanType === 'xmas') stealthScore = 9 // stealthy on UNIX, slips past naive SYN-filtering firewalls
  else if (scanType === 'udp') stealthScore = 5

  return {
    scanType,
    results,
    openPorts,
    closedPorts,
    filteredPorts,
    stealthScore
  }
}
