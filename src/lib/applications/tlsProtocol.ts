/**
 * TLS Protocol Architecture Simulator (RFC 5246 TLS 1.2 vs RFC 8446 TLS 1.3)
 * Simulates handshake flight diagrams, Round Trip Times (RTT),
 * cipher suite negotiation, Perfect Forward Secrecy (PFS), and 0-RTT early data.
 */

export type TlsVersion = '1.2' | '1.3'

export interface TlsMessage {
  direction: 'CLIENT_TO_SERVER' | 'SERVER_TO_CLIENT'
  flight: number
  name: string
  encrypted: boolean
  description: string
  payloadFields: Record<string, string>
}

export interface TlsHandshakeSimulation {
  version: TlsVersion
  cipherSuite: string
  totalRtt: number
  forwardSecrecy: boolean
  messages: TlsMessage[]
  summaryTakeaway: string
}

export function simulateTlsHandshakeFlow(
  version: TlsVersion = '1.3',
  usePskSessionResumption = false
): TlsHandshakeSimulation {
  if (version === '1.3') {
    if (usePskSessionResumption) {
      // 0-RTT TLS 1.3 Resumption
      const messages: TlsMessage[] = [
        {
          direction: 'CLIENT_TO_SERVER',
          flight: 1,
          name: 'ClientHello + KeyShare + EarlyData (HTTP GET)',
          encrypted: false, // Early data is encrypted with PSK, header is cleartext
          description: 'Client immediately transmits HTTP request encrypted with Pre-Shared Key (0-RTT)',
          payloadFields: {
            Version: 'TLS 1.3',
            SupportedCipherSuites: 'TLS_AES_256_GCM_SHA384',
            KeyShare: 'Client public DHE point (X25519)',
            EarlyData: 'GET /account HTTP/1.1 (Encrypted with PSK)'
          }
        },
        {
          direction: 'SERVER_TO_CLIENT',
          flight: 2,
          name: 'ServerHello + EncryptedExtensions + Finished + HTTP Response 200 OK',
          encrypted: true,
          description: 'Server validates PSK, establishes 1-RTT session, and returns application data immediately',
          payloadFields: {
            KeyShare: 'Server public DHE point',
            EarlyDataStatus: 'Accepted',
            ApplicationPayload: 'HTTP 200 OK'
          }
        }
      ]

      return {
        version: '1.3',
        cipherSuite: 'TLS_AES_256_GCM_SHA384',
        totalRtt: 0,
        forwardSecrecy: true,
        messages,
        summaryTakeaway: 'TLS 1.3 0-RTT Session Resumption: First HTTP request delivered with zero round-trip overhead using PSK ticket.'
      }
    }

    // Standard 1-RTT TLS 1.3 Handshake
    const messages: TlsMessage[] = [
      {
        direction: 'CLIENT_TO_SERVER',
        flight: 1,
        name: 'ClientHello + KeyShare (ECDHE)',
        encrypted: false,
        description: 'Client sends supported ciphers AND guesses ECDHE group (X25519), transmitting ephemeral public key share in the very first packet',
        payloadFields: {
          Version: 'TLS 1.3',
          Random: '32-byte Client Random',
          KeyShare: 'ECDH Public Key Share (X25519)',
          SupportedGroups: 'X25519, secp256r1'
        }
      },
      {
        direction: 'SERVER_TO_CLIENT',
        flight: 2,
        name: 'ServerHello + KeyShare + EncryptedExtensions + Certificate + CertVerify + Finished',
        encrypted: true, // Everything after ServerHello is encrypted with Handshake Secret!
        description: 'Server selects cipher, transmits its ECDH share, and encrypts certificate and finished verification',
        payloadFields: {
          CipherSuite: 'TLS_AES_256_GCM_SHA384',
          ServerKeyShare: 'Server ECDH Public Key (X25519)',
          Certificate: 'X.509 Server Certificate (Signed by Let’s Encrypt)',
          CertificateVerify: 'ECDSA Signature over entire transcript',
          Finished: 'HMAC over transcript using Handshake Secret'
        }
      },
      {
        direction: 'CLIENT_TO_SERVER',
        flight: 3,
        name: 'Finished + Encrypted Application Data (HTTP GET)',
        encrypted: true,
        description: 'Client sends Finished verification and immediately begins streaming encrypted HTTP GET request in 1-RTT',
        payloadFields: {
          Finished: 'Client HMAC verify',
          ApplicationData: 'GET /dashboard HTTP/1.1'
        }
      }
    ]

    return {
      version: '1.3',
      cipherSuite: 'TLS_AES_256_GCM_SHA384',
      totalRtt: 1,
      forwardSecrecy: true,
      messages,
      summaryTakeaway: 'TLS 1.3 1-RTT Handshake: Ephemeral Diffie-Hellman parameters are combined into ClientHello, halving latency and encrypting server certificates.'
    }
  }

  // Classic 2-RTT TLS 1.2 Handshake
  const messages: TlsMessage[] = [
    {
      direction: 'CLIENT_TO_SERVER',
      flight: 1,
      name: 'ClientHello',
      encrypted: false,
      description: 'Client announces supported cipher suites and random nonce',
      payloadFields: {
        Version: 'TLS 1.2',
        Random: 'ClientRandom (32 bytes)',
        CipherSuites: 'TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384'
      }
    },
    {
      direction: 'SERVER_TO_CLIENT',
      flight: 2,
      name: 'ServerHello + Certificate + ServerKeyExchange + ServerHelloDone',
      encrypted: false, // TLS 1.2 certificate travels in unencrypted plaintext!
      description: 'Server announces selected suite, sends plaintext certificate, ECDHE parameters, and ends flight 2',
      payloadFields: {
        ServerRandom: '32-byte Server Random',
        Certificate: 'Plaintext X.509 Certificate (Exposing domain name to eavesdroppers)',
        ServerKeyExchange: 'DHE Curve parameters + RSA Signature',
        Status: 'ServerHelloDone'
      }
    },
    {
      direction: 'CLIENT_TO_SERVER',
      flight: 3,
      name: 'ClientKeyExchange + ChangeCipherSpec + Finished',
      encrypted: false,
      description: 'Client sends its ECDHE public key, issues ChangeCipherSpec, and verifies with Finished message',
      payloadFields: {
        ClientKeyExchange: 'Client ECDHE Public Value',
        ChangeCipherSpec: 'Transition to negotiated symmetric cipher',
        Finished: 'Encrypted VerifyData hash'
      }
    },
    {
      direction: 'SERVER_TO_CLIENT',
      flight: 4,
      name: 'ChangeCipherSpec + Finished',
      encrypted: true,
      description: 'Server activates encryption and returns Finished message (Handshake complete after 2 full RTTs)',
      payloadFields: {
        ChangeCipherSpec: 'Cipher active',
        Finished: 'Encrypted VerifyData'
      }
    }
  ]

  return {
    version: '1.2',
    cipherSuite: 'TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384',
    totalRtt: 2,
    forwardSecrecy: true,
    messages,
    summaryTakeaway: 'TLS 1.2 2-RTT Handshake: Requires two full round trips before sending application data; certificates travel in cleartext.'
  }
}

/**
 * Calculates Round-Trip Latency in milliseconds across WAN distances.
 */
export function calculateHandshakeLatencyMs(
  rttMs: number,
  tlsVersion: TlsVersion,
  isResumption = false
): { handshakeLatencyMs: number; rttCount: number } {
  let rttCount = 2
  if (tlsVersion === '1.3') {
    rttCount = isResumption ? 0 : 1
  }

  return {
    handshakeLatencyMs: rttCount * rttMs,
    rttCount
  }
}
