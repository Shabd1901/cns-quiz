/**
 * Firewall Technologies: Stateless 5-Tuple Filtering, Stateful Inspection (Conntrack), and DMZ Routing
 * Simulates top-down rule evaluation, CIDR subnet matching, dynamic state tables, and DMZ trust boundaries.
 */

export type ProtocolType = 'TCP' | 'UDP' | 'ICMP' | 'ANY'
export type FirewallAction = 'ALLOW' | 'DROP' | 'REJECT'
export type ConntrackState = 'NEW' | 'ESTABLISHED' | 'RELATED' | 'INVALID'

export interface Firewall5TupleRule {
  id: string
  order: number
  action: FirewallAction
  protocol: ProtocolType
  srcSubnet: string // CIDR or 'ANY'
  dstSubnet: string // CIDR or 'ANY'
  srcPort: string   // number or 'ANY'
  dstPort: string   // number or 'ANY'
  description?: string
}

export interface NetworkPacket {
  id?: string
  srcIp: string
  dstIp: string
  srcPort: number
  dstPort: number
  protocol: ProtocolType
  tcpFlags?: {
    syn?: boolean
    ack?: boolean
    fin?: boolean
    rst?: boolean
  }
  payload?: string
}

export interface ConntrackEntry {
  protocol: ProtocolType
  srcIp: string
  srcPort: number
  dstIp: string
  dstPort: number
  state: ConntrackState
  expiresInSec: number
  bytesSeen: number
}

/**
 * Checks if an IPv4 address falls within a given CIDR subnet or matches 'ANY'.
 */
export function matchesCidr(ip: string, cidr: string): boolean {
  if (cidr === 'ANY' || cidr === '0.0.0.0/0' || cidr === '*') return true
  if (ip === cidr) return true

  if (!cidr.includes('/')) {
    return ip === cidr
  }

  const [baseIp, prefixStr] = cidr.split('/')
  const prefix = parseInt(prefixStr, 10)
  if (isNaN(prefix) || prefix < 0 || prefix > 32) return false

  const ipToInt = (addr: string) =>
    addr.split('.').reduce((acc, octet) => (acc << 8) + parseInt(octet, 10), 0) >>> 0

  const ipInt = ipToInt(ip)
  const baseInt = ipToInt(baseIp)

  const mask = prefix === 0 ? 0 : (~0 << (32 - prefix)) >>> 0

  return (ipInt & mask) === (baseInt & mask)
}

/**
 * Checks if a port matches a port rule (exact number, 'ANY', or range '1024-65535').
 */
export function matchesPort(port: number, portRule: string): boolean {
  if (portRule === 'ANY' || portRule === '*') return true
  if (portRule.includes('-')) {
    const [min, max] = portRule.split('-').map(Number)
    return port >= min && port <= max
  }
  return port === parseInt(portRule, 10)
}

/**
 * Evaluates a packet against stateless 5-tuple firewall rules (First Match Wins).
 */
export function evaluateStateless(
  rules: Firewall5TupleRule[],
  packet: NetworkPacket
): { action: FirewallAction; matchedRuleId?: string; explanation: string } {
  // Sort rules strictly by order
  const sortedRules = [...rules].sort((a, b) => a.order - b.order)

  for (const rule of sortedRules) {
    const protoMatch = rule.protocol === 'ANY' || rule.protocol === packet.protocol
    const srcIpMatch = matchesCidr(packet.srcIp, rule.srcSubnet)
    const dstIpMatch = matchesCidr(packet.dstIp, rule.dstSubnet)
    const srcPortMatch = matchesPort(packet.srcPort, rule.srcPort)
    const dstPortMatch = matchesPort(packet.dstPort, rule.dstPort)

    if (protoMatch && srcIpMatch && dstIpMatch && srcPortMatch && dstPortMatch) {
      return {
        action: rule.action,
        matchedRuleId: rule.id,
        explanation: `Packet matched Rule #${rule.order} (${rule.action} ${rule.protocol} ${rule.srcSubnet}:${rule.srcPort} -> ${rule.dstSubnet}:${rule.dstPort})`
      }
    }
  }

  // Default implicit deny
  return {
    action: 'DROP',
    explanation: 'No rule matched. Dropped by implicit default deny policy.'
  }
}

/**
 * Stateful Inspection Engine (Netfilter/iptables conntrack simulation).
 * Checks if packet belongs to an existing established session, opens new session, or drops invalid.
 */
export class StatefulFirewall {
  private conntrackTable: ConntrackEntry[] = []

  constructor(public statelessRules: Firewall5TupleRule[]) {}

  public getConntrackTable(): ConntrackEntry[] {
    return [...this.conntrackTable]
  }

  public clearTable(): void {
    this.conntrackTable = []
  }

  public processPacket(packet: NetworkPacket): {
    action: FirewallAction
    state: ConntrackState
    conntrackHit: boolean
    explanation: string
  } {
    // 1. Check if packet matches an existing state entry (forward or reverse)
    const existingIndex = this.conntrackTable.findIndex(entry => {
      const forwardMatch =
        entry.protocol === packet.protocol &&
        entry.srcIp === packet.srcIp &&
        entry.srcPort === packet.srcPort &&
        entry.dstIp === packet.dstIp &&
        entry.dstPort === packet.dstPort

      const reverseMatch =
        entry.protocol === packet.protocol &&
        entry.srcIp === packet.dstIp &&
        entry.srcPort === packet.dstPort &&
        entry.dstIp === packet.srcIp &&
        entry.dstPort === packet.srcPort

      return forwardMatch || reverseMatch
    })

    if (existingIndex !== -1) {
      // Packet belongs to an ESTABLISHED connection!
      const entry = this.conntrackTable[existingIndex]
      entry.bytesSeen += (packet.payload?.length || 40)
      entry.state = 'ESTABLISHED'
      entry.expiresInSec = 300

      // If FIN or RST seen, transition toward termination
      if (packet.tcpFlags?.fin || packet.tcpFlags?.rst) {
        this.conntrackTable.splice(existingIndex, 1)
      }

      return {
        action: 'ALLOW',
        state: 'ESTABLISHED',
        conntrackHit: true,
        explanation: 'Stateful Pass: Packet belongs to an ESTABLISHED connection in the conntrack table.'
      }
    }

    // 2. If it's a TCP SYN without existing state, it is NEW
    if (packet.protocol === 'TCP' && packet.tcpFlags?.syn && !packet.tcpFlags?.ack) {
      // Must pass stateless rules first
      const ruleResult = evaluateStateless(this.statelessRules, packet)
      if (ruleResult.action === 'ALLOW') {
        this.conntrackTable.push({
          protocol: 'TCP',
          srcIp: packet.srcIp,
          srcPort: packet.srcPort,
          dstIp: packet.dstIp,
          dstPort: packet.dstPort,
          state: 'NEW',
          expiresInSec: 30,
          bytesSeen: 40
        })
        return {
          action: 'ALLOW',
          state: 'NEW',
          conntrackHit: false,
          explanation: `New connection allowed by rule #${ruleResult.matchedRuleId} and tracked in state table.`
        }
      } else {
        return {
          action: 'DROP',
          state: 'INVALID',
          conntrackHit: false,
          explanation: 'Connection initiation rejected by stateless rules.'
        }
      }
    }

    // 3. Any inbound non-SYN packet without established state is INVALID
    if (packet.protocol === 'TCP' && packet.tcpFlags?.ack && !packet.tcpFlags?.syn) {
      return {
        action: 'DROP',
        state: 'INVALID',
        conntrackHit: false,
        explanation: 'Stateful Drop: Spurious or out-of-order ACK without matching connection state (possible TCP ACK scan or desync).'
      }
    }

    // 4. Default evaluation for UDP / ICMP
    const defaultStateless = evaluateStateless(this.statelessRules, packet)
    return {
      action: defaultStateless.action,
      state: defaultStateless.action === 'ALLOW' ? 'NEW' : 'INVALID',
      conntrackHit: false,
      explanation: defaultStateless.explanation
    }
  }
}

/**
 * DMZ Multi-Homed Topology Policy Evaluator.
 * Zones:
 * - WAN: Public Internet
 * - DMZ: Demilitarized Zone (Public Web/Mail servers)
 * - LAN: Internal trusted corporate network
 */
export function evaluateDmzPolicy(
  srcZone: 'WAN' | 'DMZ' | 'LAN',
  dstZone: 'WAN' | 'DMZ' | 'LAN',
  dstPort: number
): { allowed: boolean; rule: string; rationale: string } {
  if (srcZone === 'WAN' && dstZone === 'DMZ') {
    if (dstPort === 80 || dstPort === 443 || dstPort === 25) {
      return {
        allowed: true,
        rule: 'WAN -> DMZ (Published Services)',
        rationale: 'Public clients may only reach DMZ on designated service ports (HTTP/HTTPS/SMTP).'
      }
    }
    return {
      allowed: false,
      rule: 'WAN -> DMZ (Prohibited Ports)',
      rationale: 'Unpublished DMZ ports (e.g. SSH, DB, RPC) are blocked from public internet.'
    }
  }

  if (srcZone === 'WAN' && dstZone === 'LAN') {
    return {
      allowed: false,
      rule: 'WAN -> LAN (Strict Ingress Block)',
      rationale: 'Direct traffic from WAN to internal LAN is completely forbidden by perimeter firewall.'
    }
  }

  if (srcZone === 'DMZ' && dstZone === 'LAN') {
    return {
      allowed: false,
      rule: 'DMZ -> LAN (Bastion Isolation)',
      rationale: 'CRITICAL SECURITY RULE: Compromised DMZ servers cannot initiate connections into internal LAN.'
    }
  }

  if (srcZone === 'LAN' && dstZone === 'DMZ') {
    return {
      allowed: true,
      rule: 'LAN -> DMZ (Internal Admin/DB query)',
      rationale: 'Internal servers and administrators may initiate connections to DMZ resources.'
    }
  }

  if (srcZone === 'LAN' && dstZone === 'WAN') {
    return {
      allowed: true,
      rule: 'LAN -> WAN (Outbound NAT / Egress Inspection)',
      rationale: 'Internal hosts can access external web via NAT firewall with stateful return.'
    }
  }

  return {
    allowed: false,
    rule: 'Default Deny Inter-Zone',
    rationale: 'No policy permits this cross-zone path.'
  }
}
