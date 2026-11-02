/**
 * AI & Machine Learning in Cybersecurity and Threat Response
 * Implements supervised intrusion classification, Confusion Matrix evaluation
 * (Precision, Recall, F1), Adversarial Evasion attacks (FGSM perturbation),
 * and Security Orchestration, Automation, and Response (SOAR) playbooks.
 */

export interface NetworkFlowFeatures {
  flowDurationSec: number
  totalPackets: number
  totalBytes: number
  synFlagRatio: number // synPackets / totalPackets
  avgPacketSizeBytes: number
}

export interface ClassificationPrediction {
  isAttackPredicted: boolean
  confidence: number // 0.0 to 1.0
  attackType?: 'SYN_FLOOD' | 'PORT_SCAN' | 'DATA_EXFILTRATION' | 'BENIGN'
  extractedFeatures: NetworkFlowFeatures
}

export interface ConfusionMatrixMetrics {
  tp: number // True Positives
  fp: number // False Positives
  tn: number // True Negatives
  fn: number // False Negatives
  accuracy: number
  precision: number
  recall: number // Sensitivity / Detection Rate
  f1Score: number
}

/**
 * Heuristic/linear model simulating an AI Network Intrusion Detection classifier.
 */
export function classifyNetworkFlow(features: NetworkFlowFeatures): ClassificationPrediction {
  const { flowDurationSec, totalPackets, synFlagRatio, avgPacketSizeBytes } = features

  // 1. Detect SYN Flood
  if (synFlagRatio > 0.85 && totalPackets > 100) {
    const confidence = Math.min(0.99, 0.7 + (synFlagRatio - 0.85) * 2)
    return {
      isAttackPredicted: true,
      confidence: Number(confidence.toFixed(2)),
      attackType: 'SYN_FLOOD',
      extractedFeatures: features
    }
  }

  // 2. Detect Port Scan (many small packets, very short duration)
  if (totalPackets > 50 && flowDurationSec < 2 && avgPacketSizeBytes < 70) {
    return {
      isAttackPredicted: true,
      confidence: 0.94,
      attackType: 'PORT_SCAN',
      extractedFeatures: features
    }
  }

  // 3. Detect DNS/Data Exfiltration (steady long outbound byte rate)
  if (totalPackets > 30 && avgPacketSizeBytes > 800) {
    return {
      isAttackPredicted: true,
      confidence: 0.88,
      attackType: 'DATA_EXFILTRATION',
      extractedFeatures: features
    }
  }

  return {
    isAttackPredicted: false,
    confidence: 0.95,
    attackType: 'BENIGN',
    extractedFeatures: features
  }
}

/**
 * Calculates standard Machine Learning Confusion Matrix and performance metrics.
 */
export function evaluateConfusionMatrix(
  tp: number,
  fp: number,
  tn: number,
  fn: number
): ConfusionMatrixMetrics {
  const total = tp + fp + tn + fn
  const accuracy = total > 0 ? (tp + tn) / total : 0
  const precision = tp + fp > 0 ? tp / (tp + fp) : 0
  const recall = tp + fn > 0 ? tp / (tp + fn) : 0
  const f1Score = precision + recall > 0 ? (2 * precision * recall) / (precision + recall) : 0

  return {
    tp,
    fp,
    tn,
    fn,
    accuracy: Number(accuracy.toFixed(4)),
    precision: Number(precision.toFixed(4)),
    recall: Number(recall.toFixed(4)),
    f1Score: Number(f1Score.toFixed(4))
  }
}

/**
 * Simulates Adversarial Machine Learning Evasion:
 * An attacker crafts slight perturbations (e.g. padding dead bytes or adding benign ACK packets)
 * to manipulate feature dimensions, causing the classifier to misclassify malicious traffic as BENIGN.
 */
export function simulateAdversarialEvasion(
  originalFeatures: NetworkFlowFeatures,
  evasionStrategy: 'add-benign-traffic' | 'pad-packet-size' | 'rate-delay'
): {
  originalPrediction: ClassificationPrediction
  perturbedFeatures: NetworkFlowFeatures
  adversarialPrediction: ClassificationPrediction
  evasionSuccessful: boolean
  perturbationDetails: string
} {
  const originalPrediction = classifyNetworkFlow(originalFeatures)
  const perturbed: NetworkFlowFeatures = { ...originalFeatures }

  let details = ''

  if (evasionStrategy === 'add-benign-traffic') {
    // Dilute SYN ratio by injecting legitimate dummy ACK/data packets
    perturbed.totalPackets = originalFeatures.totalPackets + 400
    perturbed.synFlagRatio = originalFeatures.synFlagRatio * 0.2 // drops below 0.85 threshold
    details = `Injected 400 dummy ACK packets: Diluted SYN flag ratio from ${(originalFeatures.synFlagRatio * 100).toFixed(0)}% down to ${(perturbed.synFlagRatio * 100).toFixed(0)}%.`
  } else if (evasionStrategy === 'pad-packet-size') {
    // Pad small scan packets with random junk bytes so packet size looks like benign HTTPS
    perturbed.avgPacketSizeBytes = 450
    details = 'Appended dead padding bytes: Shifted average packet size from 60B to 450B to evade small-packet scan heuristic.'
  } else {
    // Low-and-slow rate delay
    perturbed.flowDurationSec = 30
    details = 'Introduced jittered transmission delay: Stretched scan across 30 seconds to bypass burst threshold.'
  }

  const adversarialPrediction = classifyNetworkFlow(perturbed)
  const evasionSuccessful = originalPrediction.isAttackPredicted && !adversarialPrediction.isAttackPredicted

  return {
    originalPrediction,
    perturbedFeatures: perturbed,
    adversarialPrediction,
    evasionSuccessful,
    perturbationDetails: details
  }
}

/**
 * Security Orchestration, Automation, and Response (SOAR) Automated Playbook Execution.
 */
export interface SoarActionStep {
  target: 'FIREWALL' | 'IAM' | 'ENDPOINT_EDR' | 'TICKET_SYSTEM'
  action: string
  status: 'PENDING' | 'EXECUTED' | 'FAILED'
  details: string
}

export function triggerSoarPlaybook(
  threatType: 'SYN_FLOOD' | 'PORT_SCAN' | 'DATA_EXFILTRATION',
  attackerIp: string,
  targetHost: string
): SoarActionStep[] {
  const steps: SoarActionStep[] = [
    {
      target: 'TICKET_SYSTEM',
      action: 'Create High-Severity Incident',
      status: 'EXECUTED',
      details: `Created SIEM Incident #${Math.floor(Math.random() * 90000 + 10000)} for ${threatType}`
    },
    {
      target: 'FIREWALL',
      action: 'Automated IP Block',
      status: 'EXECUTED',
      details: `Injected temporary DROP rule on border firewall for source IP ${attackerIp}`
    }
  ]

  if (threatType === 'DATA_EXFILTRATION') {
    steps.push(
      {
        target: 'ENDPOINT_EDR',
        action: 'Host Network Isolation',
        status: 'EXECUTED',
        details: `Quarantined compromised host ${targetHost} from internal network to contain exfiltration`
      },
      {
        target: 'IAM',
        action: 'Revoke Active User Credentials',
        status: 'EXECUTED',
        details: `Invalidated Kerberos TGT and OAuth tokens for user session on ${targetHost}`
      }
    )
  }

  return steps
}
