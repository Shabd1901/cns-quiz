/**
 * ARP Protocol and Cache Poisoning Simulator
 * Simulates address resolution, gratuitous ARP poisoning (MITM),
 * and Dynamic ARP Inspection (DAI) defenses.
 */

export interface ArpEntry {
  ip: string
  mac: string
  type: 'static' | 'dynamic'
  interfaceName: string
  lastUpdated: number
}

export interface NetworkHost {
  id: string
  name: string
  ip: string
  mac: string
  arpTable: Map<string, ArpEntry>
}

export interface ArpPacket {
  op: 'REQUEST' | 'REPLY'
  senderMac: string
  senderIp: string
  targetMac: string
  targetIp: string
  isGratuitous?: boolean
}

/**
 * Initializes a standard local LAN subnet with Alice, Bob (Gateway), and Mallory.
 */
export function createLanHosts(): Record<'alice' | 'gateway' | 'mallory', NetworkHost> {
  const alice: NetworkHost = {
    id: 'alice',
    name: 'Alice (Client)',
    ip: '192.168.1.10',
    mac: 'AA:AA:AA:11:11:11',
    arpTable: new Map([
      ['192.168.1.1', { ip: '192.168.1.1', mac: 'BB:BB:BB:00:00:01', type: 'dynamic', interfaceName: 'eth0', lastUpdated: Date.now() }]
    ])
  }

  const gateway: NetworkHost = {
    id: 'gateway',
    name: 'Default Gateway Router',
    ip: '192.168.1.1',
    mac: 'BB:BB:BB:00:00:01',
    arpTable: new Map([
      ['192.168.1.10', { ip: '192.168.1.10', mac: 'AA:AA:AA:11:11:11', type: 'dynamic', interfaceName: 'eth0', lastUpdated: Date.now() }]
    ])
  }

  const mallory: NetworkHost = {
    id: 'mallory',
    name: 'Mallory (Attacker)',
    ip: '192.168.1.66',
    mac: 'EE:EE:EE:66:66:66',
    arpTable: new Map()
  }

  return { alice, gateway, mallory }
}

/**
 * Simulates Mallory generating Gratuitous ARP replies to poison Alice and Gateway.
 */
export function generateArpPoisonPackets(
  victimIp: string,
  victimMac: string,
  gatewayIp: string,
  gatewayMac: string,
  attackerMac: string
): { packetToAlice: ArpPacket; packetToGateway: ArpPacket } {
  // Tell Alice: "I have gatewayIp, send traffic to attackerMac"
  const packetToAlice: ArpPacket = {
    op: 'REPLY',
    senderMac: attackerMac,
    senderIp: gatewayIp, // Mallory lies about owning gateway IP
    targetMac: victimMac,
    targetIp: victimIp,
    isGratuitous: true
  }

  // Tell Gateway: "I have victimIp, send traffic to attackerMac"
  const packetToGateway: ArpPacket = {
    op: 'REPLY',
    senderMac: attackerMac,
    senderIp: victimIp, // Mallory lies about owning victim IP
    targetMac: gatewayMac,
    targetIp: gatewayIp,
    isGratuitous: true
  }

  return { packetToAlice, packetToGateway }
}

/**
 * Applies an ARP packet to a host's ARP cache.
 * Evaluates whether Dynamic ARP Inspection (DAI) drops spoofed frames.
 */
export function receiveArpPacket(
  host: NetworkHost,
  packet: ArpPacket,
  daiEnabled = false,
  dhcpSnoopingTable?: Map<string, string> // ip -> legitimate mac
): { updated: boolean; alert?: string; currentMacForIp: string } {
  // If DAI is enabled, verify sender IP and MAC against DHCP Snooping Binding Database
  if (daiEnabled && dhcpSnoopingTable) {
    const legitimateMac = dhcpSnoopingTable.get(packet.senderIp)
    if (legitimateMac && legitimateMac !== packet.senderMac) {
      return {
        updated: false,
        alert: `DAI ALERT: Dropped spoofed ARP packet! Sender claims IP ${packet.senderIp} with MAC ${packet.senderMac}, but trusted DHCP binding is ${legitimateMac}.`,
        currentMacForIp: host.arpTable.get(packet.senderIp)?.mac || 'NONE'
      }
    }
  }

  // Stateless ARP accepts replies even without pending requests
  const existing = host.arpTable.get(packet.senderIp)
  host.arpTable.set(packet.senderIp, {
    ip: packet.senderIp,
    mac: packet.senderMac,
    type: 'dynamic',
    interfaceName: 'eth0',
    lastUpdated: Date.now()
  })

  let alertMessage: string | undefined
  if (existing && existing.mac !== packet.senderMac) {
    alertMessage = `ARP Cache Poisoned: IP ${packet.senderIp} remapped from ${existing.mac} to ${packet.senderMac}!`
  }

  return {
    updated: true,
    alert: alertMessage,
    currentMacForIp: packet.senderMac
  }
}
