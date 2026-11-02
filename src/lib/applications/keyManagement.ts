/**
 * Cryptographic Key Management & Distribution Architecture
 * Simulates symmetric Key Distribution Centers (Needham-Schroeder),
 * Public Key Authorities, and Perfect Forward Secrecy (PFS).
 */

export interface KeyDistributionModel {
  method: 'SYMMETRIC_KDC' | 'PUBLIC_KEY_AUTHORITY' | 'EPHEMERAL_DH_PFS'
  forwardSecrecy: boolean
  thirdPartyDependency: 'ONLINE_KDC' | 'ONLINE_CA' | 'NONE_AFTER_CERT'
  mitmProtection: boolean
  description: string
}

export function getKeyDistributionModels(): KeyDistributionModel[] {
  return [
    {
      method: 'SYMMETRIC_KDC',
      forwardSecrecy: false, // If KDC master key is compromised, all past traffic can be decrypted!
      thirdPartyDependency: 'ONLINE_KDC',
      mitmProtection: true,
      description: 'Centralized Key Distribution Center (e.g. Kerberos). Requires pairwise master keys with every user. Single point of compromise.'
    },
    {
      method: 'PUBLIC_KEY_AUTHORITY',
      forwardSecrecy: false, // Static RSA public key encryption does NOT provide Forward Secrecy
      thirdPartyDependency: 'ONLINE_CA',
      mitmProtection: true,
      description: 'Public Key Authority provides directory lookups and timestamps. If server private key is compromised later, past recordings are decrypted.'
    },
    {
      method: 'EPHEMERAL_DH_PFS',
      forwardSecrecy: true, // Ephemeral keys discarded immediately after session key derivation
      thirdPartyDependency: 'NONE_AFTER_CERT',
      mitmProtection: true,
      description: 'Diffie-Hellman Ephemeral (DHE / ECDHE). Digital signatures authenticate the exchange. Compromise of long-term server key cannot decrypt recorded historical traffic.'
    }
  ]
}

/**
 * Evaluates whether a cipher suite guarantees Perfect Forward Secrecy (PFS).
 */
export function checkPerfectForwardSecrecy(cipherSuite: string): {
  hasPfs: boolean
  keyExchangeType: 'ECDHE' | 'DHE' | 'STATIC_RSA' | 'STATIC_DH'
  explanation: string
} {
  const upper = cipherSuite.toUpperCase()

  if (upper.includes('ECDHE')) {
    return {
      hasPfs: true,
      keyExchangeType: 'ECDHE',
      explanation: 'Elliptic Curve Diffie-Hellman Ephemeral: Generates ephemeral key pairs per session. Guaranteed Perfect Forward Secrecy.'
    }
  }

  if (upper.includes('DHE')) {
    return {
      hasPfs: true,
      keyExchangeType: 'DHE',
      explanation: 'Diffie-Hellman Ephemeral: Finite-field DH with ephemeral private keys. Guaranteed Perfect Forward Secrecy.'
    }
  }

  if (upper.includes('RSA')) {
    return {
      hasPfs: false,
      keyExchangeType: 'STATIC_RSA',
      explanation: 'Static RSA Key Exchange: Client encrypts pre-master secret directly with server long-term public key. If server private key is leaked in the future, all past sessions can be decrypted (NO Forward Secrecy).'
    }
  }

  return {
    hasPfs: false,
    keyExchangeType: 'STATIC_DH',
    explanation: 'Static Diffie-Hellman: Fixed DH values stored in certificate. No Forward Secrecy.'
  }
}
