/**
 * IPsec Architecture (RFC 4301, RFC 4302 AH, RFC 4303 ESP)
 * Simulates Transport Mode vs Tunnel Mode packet structures,
 * Authentication Header (AH) vs Encapsulating Security Payload (ESP),
 * Security Association Database (SAD), and Security Policy Database (SPD).
 */

import { matchesCidr } from "@/lib/network/firewalls"

export type IpsecProtocol = 'AH' | 'ESP'
export type IpsecMode = 'TRANSPORT' | 'TUNNEL'

export interface PacketHeaderSegment {
  name: string
  bytes: number
  isEncrypted: boolean
  isAuthenticated: boolean
  description: string
  color: 'ink' | 'signal' | 'ok' | 'info'
}

export interface IpsecPacketModel {
  protocol: IpsecProtocol
  mode: IpsecMode
  totalSizeBytes: number
  overheadBytes: number
  segments: PacketHeaderSegment[]
  preservesNat: boolean
  securityGuarantees: {
    confidentiality: boolean
    integrity: boolean
    originAuthentication: boolean
    antiReplay: boolean
  }
}

/**
 * Builds the exact layer-wise byte structure of an IPsec packet.
 */
export function buildIpsecPacket(
  protocol: IpsecProtocol,
  mode: IpsecMode,
  payloadSizeBytes = 100
): IpsecPacketModel {
  const segments: PacketHeaderSegment[] = []
  let overhead = 0

  if (protocol === 'AH') {
    if (mode === 'TRANSPORT') {
      // Original IP Header (modified proto=51) -> AH Header -> TCP/UDP -> Payload
      segments.push(
        { name: 'Original IP Header (Proto=51 AH)', bytes: 20, isEncrypted: false, isAuthenticated: true, description: 'Source & Destination endpoints (Immutable fields protected by ICV)', color: 'info' },
        { name: 'Authentication Header (AH)', bytes: 24, isEncrypted: false, isAuthenticated: true, description: 'Next Header, Payload Len, SPI (32-bit), Seq# (32-bit), ICV HMAC-SHA-256 (96-bit)', color: 'signal' },
        { name: 'Transport Header (TCP/UDP)', bytes: 20, isEncrypted: false, isAuthenticated: true, description: 'Original ports (Protected from tampering)', color: 'ok' },
        { name: 'Data Payload', bytes: payloadSizeBytes, isEncrypted: false, isAuthenticated: true, description: 'Unencrypted cleartext payload with integrity check', color: 'ink' }
      )
      overhead = 24
    } else {
      // Tunnel Mode AH: New IP Header -> AH Header -> Original IP Header -> Transport -> Payload
      segments.push(
        { name: 'New Gateway IP Header (Proto=51 AH)', bytes: 20, isEncrypted: false, isAuthenticated: true, description: 'VPN Gateway source & destination IP', color: 'info' },
        { name: 'Authentication Header (AH)', bytes: 24, isEncrypted: false, isAuthenticated: true, description: 'SPI, Sequence number, ICV signature', color: 'signal' },
        { name: 'Original Inner IP Header', bytes: 20, isEncrypted: false, isAuthenticated: true, description: 'Original source and destination intranet hosts', color: 'info' },
        { name: 'Transport Header (TCP/UDP)', bytes: 20, isEncrypted: false, isAuthenticated: true, description: 'Inner port numbers', color: 'ok' },
        { name: 'Data Payload', bytes: payloadSizeBytes, isEncrypted: false, isAuthenticated: true, description: 'Inner application data', color: 'ink' }
      )
      overhead = 20 + 24 // New IP + AH
    }

    return {
      protocol: 'AH',
      mode,
      totalSizeBytes: segments.reduce((sum, s) => sum + s.bytes, 0),
      overheadBytes: overhead,
      segments,
      preservesNat: false, // AH breaks with NAT because NAT alters IP addresses, invalidating the ICV hash
      securityGuarantees: {
        confidentiality: false, // AH provides ZERO encryption!
        integrity: true,
        originAuthentication: true,
        antiReplay: true
      }
    }
  }

  // Protocol === 'ESP' (RFC 4303)
  if (mode === 'TRANSPORT') {
    // Original IP Header (Proto=50 ESP) -> ESP Header [SPI, Seq] -> (ENCRYPTED: TCP/UDP -> Payload -> ESP Trailer) -> ESP Auth ICV
    segments.push(
      { name: 'Original IP Header (Proto=50 ESP)', bytes: 20, isEncrypted: false, isAuthenticated: false, description: 'Source & Destination IPs (Not signed by ESP)', color: 'info' },
      { name: 'ESP Header (SPI + Seq#)', bytes: 8, isEncrypted: false, isAuthenticated: true, description: 'Security Parameter Index (32-bit) + Replay Sequence Number', color: 'signal' },
      { name: 'Encrypted Transport Header (TCP/UDP)', bytes: 20, isEncrypted: true, isAuthenticated: true, description: 'Encrypted ports: hidden from network eavesdroppers', color: 'signal' },
      { name: 'Encrypted Data Payload', bytes: payloadSizeBytes, isEncrypted: true, isAuthenticated: true, description: 'AES-CBC or AES-GCM encrypted ciphertext', color: 'signal' },
      { name: 'ESP Trailer (Padding + PadLen + NextHeader)', bytes: 4, isEncrypted: true, isAuthenticated: true, description: 'Cipher block padding and next header pointer', color: 'signal' },
      { name: 'ESP Authentication ICV (MAC)', bytes: 16, isEncrypted: false, isAuthenticated: true, description: 'Integrity Check Value covering ESP Header through Trailer', color: 'ok' }
    )
    overhead = 8 + 4 + 16 // ESP Header + Trailer + ICV = 28 bytes
  } else {
    // Tunnel Mode ESP: New IP Header -> ESP Header -> (ENCRYPTED: Original IP -> TCP/UDP -> Payload -> ESP Trailer) -> ESP ICV
    segments.push(
      { name: 'New Gateway IP Header (Proto=50 ESP)', bytes: 20, isEncrypted: false, isAuthenticated: false, description: 'Outer VPN gateway addresses (WAN routable)', color: 'info' },
      { name: 'ESP Header (SPI + Seq#)', bytes: 8, isEncrypted: false, isAuthenticated: true, description: 'SPI + Sequence number for anti-replay', color: 'signal' },
      { name: 'Encrypted Original IP Header', bytes: 20, isEncrypted: true, isAuthenticated: true, description: 'Inner private IP addresses completely encrypted and hidden!', color: 'signal' },
      { name: 'Encrypted Transport Header', bytes: 20, isEncrypted: true, isAuthenticated: true, description: 'Inner ports encrypted', color: 'signal' },
      { name: 'Encrypted Data Payload', bytes: payloadSizeBytes, isEncrypted: true, isAuthenticated: true, description: 'Private intranet application data', color: 'signal' },
      { name: 'ESP Trailer', bytes: 4, isEncrypted: true, isAuthenticated: true, description: 'Padding and next header', color: 'signal' },
      { name: 'ESP Authentication ICV (MAC)', bytes: 16, isEncrypted: false, isAuthenticated: true, description: 'Cryptographic ICV authentication tag', color: 'ok' }
    )
    overhead = 20 + 8 + 4 + 16 // New IP (20) + ESP Header (8) + Trailer (4) + ICV (16) = 48 bytes
  }

  return {
    protocol: 'ESP',
    mode,
    totalSizeBytes: segments.reduce((sum, s) => sum + s.bytes, 0),
    overheadBytes: overhead,
    segments,
    preservesNat: true, // ESP can be encapsulated in UDP port 4500 (NAT-Traversal)
    securityGuarantees: {
      confidentiality: true, // ESP encrypts the payload!
      integrity: true,
      originAuthentication: true,
      antiReplay: true
    }
  }
}

/**
 * Evaluates the Security Policy Database (SPD) and selects a Security Association (SA).
 */
export interface SpdRule {
  id: string
  srcSubnet: string
  dstSubnet: string
  action: 'BYPASS' | 'DISCARD' | 'PROTECT'
  protocol?: IpsecProtocol
  mode?: IpsecMode
  spi?: number
}

export function evaluateSpdAndSad(
  rules: SpdRule[],
  srcIp: string,
  dstIp: string
): { action: 'BYPASS' | 'DISCARD' | 'PROTECT'; selectedRule?: SpdRule; explanation: string } {
  for (const rule of rules) {
    if (matchesCidr(srcIp, rule.srcSubnet) && matchesCidr(dstIp, rule.dstSubnet)) {
      if (rule.action === 'PROTECT') {
        return {
          action: 'PROTECT',
          selectedRule: rule,
          explanation: `Matched SPD Rule #${rule.id}: Traffic encapsulated using ${rule.protocol} in ${rule.mode} mode (SPI: ${rule.spi})`
        }
      }
      return {
        action: rule.action,
        selectedRule: rule,
        explanation: `Matched SPD Rule #${rule.id}: Traffic action is ${rule.action}`
      }
    }
  }

  return {
    action: 'DISCARD',
    explanation: 'No matching SPD rule found. Default action is DISCARD.'
  }
}
