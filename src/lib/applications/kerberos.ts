/**
 * Kerberos v5 Authentication Protocol Simulator
 * Simulates the 3-headed hound of authentication:
 * Client, Authentication Server (AS), Ticket Granting Server (TGS), and Target Application Server.
 */

export interface KerberosTicket {
  ticketType: 'TGT' | 'SERVICE_TICKET'
  clientId: string
  serviceId: string
  sessionKey: string
  timestamp: number
  lifetimeSeconds: number
  clientIp: string
  encryptedWith: string // e.g. K_tgs or K_server
}

export interface KerberosAuthenticator {
  clientId: string
  timestamp: number
  clientIp: string
  encryptedWithSessionKey: string
}

export interface AsExchangeResult {
  tgt: KerberosTicket
  clientTgsSessionKey: string
  expirationTime: number
  log: string[]
}

export interface TgsExchangeResult {
  serviceTicket: KerberosTicket
  clientServerSessionKey: string
  expirationTime: number
  log: string[]
}

export interface AppServerValidationResult {
  authenticated: boolean
  clientIdentity: string
  serverMutualAuthToken?: string
  errorReason?: string
}

/**
 * Step 1 & 2: Client <-> Authentication Server (AS)
 * Client authenticates and obtains Ticket Granting Ticket (TGT).
 */
export function requestTicketGrantingTicket(
  clientId: string,
  clientSecretKey: string,
  tgsSecretKey: string,
  clientIp = '192.168.1.100',
  lifetimeSeconds = 28800 // 8 hours
): AsExchangeResult {
  const now = Date.now()
  const clientTgsSessionKey = `K_c_tgs_${Math.random().toString(36).substring(2, 8).toUpperCase()}`

  // TGT is encrypted with TGS's secret key (K_tgs)
  const tgt: KerberosTicket = {
    ticketType: 'TGT',
    clientId,
    serviceId: 'krbtgt/REALM',
    sessionKey: clientTgsSessionKey,
    timestamp: now,
    lifetimeSeconds,
    clientIp,
    encryptedWith: 'K_tgs'
  }

  const log = [
    `1. Client "${clientId}" sends plaintext request to Authentication Server (AS) for krbtgt/REALM.`,
    `2. AS looks up client secret key in database (derived from user password hash).`,
    `3. AS creates TGT encrypted with K_tgs (client cannot decrypt or modify TGT).`,
    `4. AS generates session key K_c_tgs and returns {K_c_tgs, TGT} encrypted with client's password key.`
  ]

  return {
    tgt,
    clientTgsSessionKey,
    expirationTime: now + lifetimeSeconds * 1000,
    log
  }
}

/**
 * Step 3 & 4: Client <-> Ticket Granting Server (TGS)
 * Client presents TGT + Authenticator to obtain a Service Ticket (ST).
 */
export function requestServiceTicket(
  tgt: KerberosTicket,
  authenticator: KerberosAuthenticator,
  serviceId: string,
  serverSecretKey: string,
  clientTgsSessionKey: string,
  allowedClockSkewSeconds = 300 // 5 minutes
): TgsExchangeResult {
  const now = Date.now()

  // 1. TGS decrypts TGT using K_tgs
  if (tgt.encryptedWith !== 'K_tgs') {
    throw new Error('TGS Decryption Error: Invalid TGT key envelope')
  }

  // 2. Validate TGT expiration
  if (now > tgt.timestamp + tgt.lifetimeSeconds * 1000) {
    throw new Error('KRB_AP_ERR_TKT_EXPIRED: Ticket Granting Ticket has expired')
  }

  // 3. TGS uses session key inside TGT to decrypt Authenticator
  if (authenticator.encryptedWithSessionKey !== tgt.sessionKey) {
    throw new Error('KRB_AP_ERR_BAD_INTEGRITY: Authenticator decryption failed (mismatched session key)')
  }

  // 4. Validate Authenticator timestamp to stop replay attacks
  const skew = Math.abs(now - authenticator.timestamp) / 1000
  if (skew > allowedClockSkewSeconds) {
    throw new Error('KRB_AP_ERR_SKEW: Clock skew too great (possible replay attack)')
  }

  // 5. Generate Client-Server Session Key and Service Ticket
  const clientServerSessionKey = `K_c_server_${Math.random().toString(36).substring(2, 8).toUpperCase()}`

  const serviceTicket: KerberosTicket = {
    ticketType: 'SERVICE_TICKET',
    clientId: tgt.clientId,
    serviceId,
    sessionKey: clientServerSessionKey,
    timestamp: now,
    lifetimeSeconds: 3600, // 1 hour
    clientIp: tgt.clientIp,
    encryptedWith: `K_${serviceId}`
  }

  const log = [
    `1. Client sends TGT + Authenticator({timestamp}) to TGS requesting service "${serviceId}".`,
    `2. TGS decrypts TGT using K_tgs and extracts session key K_c_tgs.`,
    `3. TGS decrypts Authenticator using K_c_tgs and confirms timestamp skew is within ${allowedClockSkewSeconds}s.`,
    `4. TGS generates Service Ticket encrypted with ${serviceId}'s secret key (K_server).`,
    `5. TGS returns Service Ticket + K_c_server encrypted with K_c_tgs to client.`
  ]

  return {
    serviceTicket,
    clientServerSessionKey,
    expirationTime: now + 3600 * 1000,
    log
  }
}

/**
 * Step 5 & 6: Client <-> Application Server
 * Client presents Service Ticket + Authenticator. Server validates and optionally returns mutual auth.
 */
export function authenticateWithAppServer(
  serviceTicket: KerberosTicket,
  authenticator: KerberosAuthenticator,
  serverSecretKeyName: string,
  replayCache: Set<string>,
  allowedClockSkewSeconds = 300
): AppServerValidationResult {
  const now = Date.now()

  // 1. Server decrypts Service Ticket using K_server
  if (serviceTicket.encryptedWith !== serverSecretKeyName) {
    return {
      authenticated: false,
      clientIdentity: '',
      errorReason: 'Server failed to decrypt Service Ticket with its local key'
    }
  }

  // 2. Check ticket expiration
  if (now > serviceTicket.timestamp + serviceTicket.lifetimeSeconds * 1000) {
    return {
      authenticated: false,
      clientIdentity: '',
      errorReason: 'Service Ticket has expired'
    }
  }

  // 3. Decrypt Authenticator with session key from Service Ticket
  if (authenticator.encryptedWithSessionKey !== serviceTicket.sessionKey) {
    return {
      authenticated: false,
      clientIdentity: '',
      errorReason: 'Authenticator cannot be decrypted with ticket session key'
    }
  }

  // 4. Check client identity match
  if (authenticator.clientId !== serviceTicket.clientId) {
    return {
      authenticated: false,
      clientIdentity: '',
      errorReason: 'Identity mismatch between ticket and authenticator'
    }
  }

  // 5. Check replay cache: {clientId + timestamp} must be unique
  const replayKey = `${authenticator.clientId}:${authenticator.timestamp}`
  if (replayCache.has(replayKey)) {
    return {
      authenticated: false,
      clientIdentity: serviceTicket.clientId,
      errorReason: 'REPLAY DETECTED: Authenticator timestamp already seen in server replay cache'
    }
  }
  replayCache.add(replayKey)

  // 6. Check clock skew
  const skew = Math.abs(now - authenticator.timestamp) / 1000
  if (skew > allowedClockSkewSeconds) {
    return {
      authenticated: false,
      clientIdentity: serviceTicket.clientId,
      errorReason: `Clock skew (${skew.toFixed(1)}s) exceeds allowed limit (${allowedClockSkewSeconds}s)`
    }
  }

  // 7. Mutual Authentication: Server returns timestamp + 1 encrypted with session key
  const serverMutualAuthToken = `MUTUAL_AUTH_OK_TS_${authenticator.timestamp + 1}`

  return {
    authenticated: true,
    clientIdentity: serviceTicket.clientId,
    serverMutualAuthToken
  }
}
