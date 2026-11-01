/**
 * Intrusion Detection Systems (IDS/IPS), Honeypots, and Zero Trust Architecture (ZTA)
 * Implements Snort-like signature pattern matching, statistical anomaly Z-score detection,
 * Honeypot classification, and NIST SP 800-207 Zero Trust evaluation.
 */

export interface SnortSignature {
  sid: number
  protocol: 'TCP' | 'UDP' | 'ICMP' | 'ANY'
  srcPort?: string
  dstPort?: string
  pattern: string
  isRegex?: boolean
  msg: string
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
  action: 'ALERT' | 'DROP' // IDS generates alert; IPS drops packet
}

export interface SnortAlert {
  sid: number
  msg: string
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
  action: 'ALERT' | 'DROP'
  packetSummary: string
  matchedContent: string
}

export interface TrafficPacket {
  id: string
  srcIp: string
  dstIp: string
  protocol: 'TCP' | 'UDP' | 'ICMP' | 'ANY'
  srcPort: number
  dstPort: number
  payload: string
}

/**
 * Snort-style rule evaluation engine.
 */
export function evaluateSnortRules(
  rules: SnortSignature[],
  packet: TrafficPacket
): SnortAlert[] {
  const alerts: SnortAlert[] = []

  for (const rule of rules) {
    if (rule.protocol !== 'ANY' && rule.protocol !== packet.protocol) continue

    if (rule.dstPort && rule.dstPort !== 'ANY' && parseInt(rule.dstPort, 10) !== packet.dstPort) {
      continue
    }

    let match = false
    let matchedStr = ''

    if (rule.isRegex) {
      try {
        const regex = new RegExp(rule.pattern, 'i')
        const m = packet.payload.match(regex)
        if (m) {
          match = true
          matchedStr = m[0]
        }
      } catch {
        // invalid regex
      }
    } else {
      if (packet.payload.toLowerCase().includes(rule.pattern.toLowerCase())) {
        match = true
        matchedStr = rule.pattern
      }
    }

    if (match) {
      alerts.push({
        sid: rule.sid,
        msg: rule.msg,
        severity: rule.severity,
        action: rule.action,
        packetSummary: `${packet.protocol} ${packet.srcIp}:${packet.srcPort} -> ${packet.dstIp}:${packet.dstPort}`,
        matchedContent: matchedStr
      })
    }
  }

  return alerts
}

/**
 * Statistical Anomaly Detection (Z-Score calculation).
 * Flags traffic bursts when observed metric exceeds mean by threshold standard deviations (e.g., Z > 3.0).
 */
export function detectStatisticalAnomaly(
  baselineMean: number,
  baselineStdDev: number,
  observedValue: number,
  zThreshold = 3.0
): {
  zScore: number
  isAnomaly: boolean
  confidence: number
  status: 'NORMAL' | 'SUSPICIOUS' | 'ANOMALOUS_ATTACK'
} {
  if (baselineStdDev <= 0) baselineStdDev = 1

  const zScore = Number(((observedValue - baselineMean) / baselineStdDev).toFixed(2))
  const isAnomaly = zScore >= zThreshold

  let status: 'NORMAL' | 'SUSPICIOUS' | 'ANOMALOUS_ATTACK' = 'NORMAL'
  if (zScore >= zThreshold) {
    status = 'ANOMALOUS_ATTACK'
  } else if (zScore >= zThreshold - 1.0) {
    status = 'SUSPICIOUS'
  }

  // Confidence based on standard normal cumulative distribution approximation
  const confidence = Math.min(0.999, Math.max(0.01, 1 - Math.exp(-Math.abs(zScore) / 2)))

  return {
    zScore,
    isAnomaly,
    confidence: Number(confidence.toFixed(3)),
    status
  }
}

/**
 * Honeypot Interaction Classifier:
 * - Low-Interaction: Emulates select TCP banners and ports (e.g. Honeyd). Safe, low risk, captures automated scans.
 * - Medium-Interaction: Emulates application commands and fake filesystem (e.g. Cowrie SSH trap). Captures malware payloads.
 * - High-Interaction: Real operating system in sandboxed VM/container. High risk, captures zero-days.
 */
export interface HoneypotProfile {
  level: 'low' | 'medium' | 'high'
  name: string
  emulatedServices: string[]
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH'
  capabilities: string[]
}

export function getHoneypotProfiles(): HoneypotProfile[] {
  return [
    {
      level: 'low',
      name: 'Honeyd / Port Deception',
      emulatedServices: ['TCP 21 (FTP)', 'TCP 23 (Telnet)', 'TCP 80 (HTTP)'],
      riskLevel: 'LOW',
      capabilities: ['Port scan telemetry', 'Banner grab logging', 'Attacker IP profiling']
    },
    {
      level: 'medium',
      name: 'Cowrie SSH / Telnet Trap',
      emulatedServices: ['TCP 22 (SSH)', 'TCP 23 (Telnet)'],
      riskLevel: 'MEDIUM',
      capabilities: ['Brute-force credential harvesting', 'Fake shell interaction', 'Automatic payload/file download capture']
    },
    {
      level: 'high',
      name: 'Full-Virtualization Sandbox Trap',
      emulatedServices: ['Windows Server 2022 VM', 'Linux Ubuntu VM with Real Kernel'],
      riskLevel: 'HIGH',
      capabilities: ['Zero-day exploit capture', 'Lateral movement monitoring', 'Rootkit and post-exploitation telemetry']
    }
  ]
}

/**
 * NIST SP 800-207 Zero Trust Architecture (ZTA) Policy Engine.
 * Principle: "Never Trust, Always Verify".
 * Every access request is evaluated dynamically using:
 * 1. User Identity & MFA state
 * 2. Device Compliance & Health (EDR running, disk encrypted)
 * 3. Environmental Context (Geo-IP, anomalous time)
 * 4. Microsegmentation privilege (Least Privilege)
 */
export interface ZeroTrustSubject {
  username: string
  mfaVerified: boolean
  deviceManaged: boolean
  edrActive: boolean
  diskEncrypted: boolean
  clientIp: string
  geoCountry: string
  userRole: 'guest' | 'engineer' | 'admin' | 'finance'
}

export interface ZeroTrustResource {
  name: string
  sensitivity: 'LOW' | 'MEDIUM' | 'HIGH' | 'RESTRICTED'
  requiredRole: 'guest' | 'engineer' | 'admin' | 'finance'
  allowedCountries?: string[]
}

export function evaluateZeroTrustAccess(
  subject: ZeroTrustSubject,
  resource: ZeroTrustResource
): {
  decision: 'GRANT' | 'DENY' | 'STEP_UP_MFA_REQUIRED'
  failedChecks: string[]
  score: number // 0 to 100 trust score
  explanation: string
} {
  const failedChecks: string[] = []
  let trustScore = 100

  // 1. MFA Verification
  if (!subject.mfaVerified) {
    failedChecks.push('Multi-Factor Authentication not verified')
    trustScore -= 30
  }

  // 2. Device Health Posture
  if (!subject.deviceManaged) {
    failedChecks.push('Device is unmanaged / BYOD without MDM enrollment')
    trustScore -= 25
  }
  if (!subject.edrActive) {
    failedChecks.push('Endpoint Detection & Response (EDR) agent inactive')
    trustScore -= 25
  }
  if (!subject.diskEncrypted) {
    failedChecks.push('Full-disk encryption not active')
    trustScore -= 15
  }

  // 3. Context & Location
  if (resource.allowedCountries && !resource.allowedCountries.includes(subject.geoCountry)) {
    failedChecks.push(`Access from disallowed geographic region (${subject.geoCountry})`)
    trustScore -= 40
  }

  // 4. Role-based Microsegmentation
  const roleHierarchy: Record<string, number> = { guest: 1, finance: 2, engineer: 3, admin: 4 }
  if ((roleHierarchy[subject.userRole] || 0) < (roleHierarchy[resource.requiredRole] || 0)) {
    failedChecks.push(`Role '${subject.userRole}' lacks permission for '${resource.requiredRole}' resource`)
    trustScore -= 50
  }

  trustScore = Math.max(0, trustScore)

  if (failedChecks.length === 1 && failedChecks[0].includes('Multi-Factor')) {
    return {
      decision: 'STEP_UP_MFA_REQUIRED',
      failedChecks,
      score: trustScore,
      explanation: 'Access held pending step-up multi-factor biometric authentication challenge.'
    }
  }

  if (failedChecks.length > 0 || trustScore < 60) {
    return {
      decision: 'DENY',
      failedChecks,
      score: trustScore,
      explanation: `Zero Trust Evaluation Denied: Failed checks [${failedChecks.join('; ')}]. Trust score: ${trustScore}/100.`
    }
  }

  return {
    decision: 'GRANT',
    failedChecks: [],
    score: trustScore,
    explanation: `Zero Trust Verified: Identity, device posture, and microsegmentation criteria satisfied. Trust score: ${trustScore}/100.`
  }
}
