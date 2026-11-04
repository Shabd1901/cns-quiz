# TCET LMS CNS · Comprehensive Viva & Oral Examination Guide

**Course Code:** `CSC602` | **Semester:** VI | **Department:** Computer Engineering / Information Technology  
*Use this guide to master oral questions asked by internal faculty and external university examiners.*

---

## Module 1: Introduction & Classical Cryptography (5 Hours · Bloom L1–L3)

### Q1: What is the primary difference between a Security Service and a Security Mechanism in the X.800 OSI architecture?
**Answer:**
- **Security Service:** A capability provided by a system to protect resources (e.g. *Confidentiality*, *Authentication*, *Data Integrity*, *Non-repudiation*, *Access Control*).
- **Security Mechanism:** The concrete technical implementation used to realize a service (e.g. *Encipherment*, *Digital Signatures*, *Access Control Mechanisms*, *Data Integrity Checksums*).

### Q2: Why is the Caesar cipher trivial to break, and what is its exact keyspace?
**Answer:**
Caesar cipher is a monoalphabetic substitution cipher: $C = (P + k) \pmod{26}$.
Its keyspace is only $25$ possible non-zero shift keys ($k \in \{1, \dots, 25\}$). An attacker can perform a brute-force ciphertext-only attack in milliseconds, or use letter frequency analysis (e.g. checking which ciphertext letter matches the frequency of 'E' [$\approx 12.7\%$] in English).

### Q3: What mathematical condition must the key $a$ satisfy in an Affine Cipher $C \equiv (aP + b) \pmod{26}$?
**Answer:**
The multiplicative key $a$ must be **coprime** to 26 ($\gcd(a, 26) = 1$). If $a$ shares a common factor with 26 (i.e. if $a$ is even or divisible by 13), multiple distinct plaintext letters would map to the identical ciphertext letter, destroying bijectivity and preventing unique decryption. Out of 26 possible values, only $\phi(26) = 12$ values of $a$ are valid.

### Q4: How does Friedman's Index of Coincidence ($I_c$) differentiate a Monoalphabetic cipher from a Polyalphabetic cipher (Vigenère)?
**Answer:**
The Index of Coincidence measures the probability that two randomly selected letters from a ciphertext are identical:
$$I_c = \frac{\sum_{i=1}^{26} f_i(f_i - 1)}{N(N - 1)}$$
- For English monoalphabetic ciphers, frequency spikes persist, yielding $I_c \approx 0.067$.
- For polyalphabetic ciphers (Vigenère), letter distributions flatten toward uniform randomness, yielding $I_c \approx 0.038$.

---

## Module 2: Block Ciphers & Public Key Cryptography (8 Hours · Bloom L1–L3)

### Q5: What is the Feistel Cipher design principle, and why is it significant in DES?
**Answer:**
A Feistel cipher splits an $n$-bit block into two halves $(L_i, R_i)$ and processes them over $r$ rounds:
$$L_{i+1} = R_i, \quad R_{i+1} = L_i \oplus F(R_i, K_i)$$
**Significance:** The round function $F$ does **not** need to be invertible. Decryption uses the identical circuit as encryption; only the subkey schedule is reversed ($K_{16} \rightarrow K_1$).

### Q6: Explain the "Avalanche Effect" demonstrated in your DES simulator.
**Answer:**
A strong cryptographic algorithm must exhibit high diffusion. The Avalanche Effect means that altering a single bit in the plaintext or key causes at least $50\%$ of the ciphertext bits to change by round 3 or 4. Our simulator tracks Hamming distance between two ciphertexts differing by 1 bit, showing convergence to $\approx 32$ altered bits across DES's 64-bit block.

### Q7: Why does standard JavaScript crash during 2048-bit RSA calculations, and how did your group solve it?
**Answer:**
JavaScript's default `Number` type is an IEEE-754 64-bit double-precision float, with a maximum safe integer limit of $2^{53} - 1$ (`Number.MAX_SAFE_INTEGER` $\approx 9 \times 10^{15}$). RSA primes ($p, q$) and moduli ($n$) require numbers with hundreds or thousands of bits.
**Solution:** We configured `tsconfig.json` to target `ES2022` and utilized native JavaScript `BigInt` primitives for all modular arithmetic and extended Euclidean calculations (`src/lib/crypto/rsa.ts`).

### Q8: What vulnerability affects unauthenticated Diffie-Hellman, and how did you simulate it?
**Answer:**
Diffie-Hellman establishes a shared secret over an insecure channel, but provides **zero authentication**. It is vulnerable to a **Man-in-the-Middle (MITM)** attack. An active adversary (Mallory) intercepts Alice's public value $g^a$ and Bob's public value $g^b$, sending her own surrogate values ($g^{m_1}, g^{m_2}$). Mallory establishes two separate shared keys ($K_A, K_B$), decrypting and re-encrypting all traffic transparently.

---

## Module 3: Hashes & Digital Signatures (7 Hours · Bloom L1–L4)

### Q9: What are the three formal security properties required of a Cryptographic Hash Function?
**Answer:**
1. **Pre-image Resistance (One-Way):** Given hash $h$, it is computationally infeasible to find message $m$ such that $H(m) = h$.
2. **Second Pre-image Resistance (Weak Collision):** Given message $m_1$, it is computationally infeasible to find $m_2 \neq m_1$ such that $H(m_2) = H(m_1)$.
3. **Collision Resistance (Strong Collision):** It is computationally infeasible to find *any* two arbitrary distinct messages $(m_1, m_2)$ such that $H(m_1) = H(m_2)$.

### Q10: Why does HMAC use two rounds of hashing (inner and outer pads) instead of a simple prefix $H(K \mathbin{\Vert} M)$?
**Answer:**
Simple prefix construction $H(K \mathbin{\Vert} M)$ is vulnerable to a **Length Extension Attack** on Merkle-Damgård hash algorithms (MD5, SHA-1, SHA-256). An attacker knowing $H(K \mathbin{\Vert} M)$ and the length of $M$ can initialize the hash state with the output digest and append malicious data $M_{\text{ext}}$ without knowing key $K$.
HMAC (RFC 2104) defeats this by wrapping the result with an outer hash and key:
$$\text{HMAC}(K, M) = H((K^+ \oplus \text{opad}) \mathbin{\Vert} H((K^+ \oplus \text{ipad}) \mathbin{\Vert} M))$$

### Q11: Explain the Birthday Paradox and its impact on hash function bit-length.
**Answer:**
The Birthday Paradox proves that finding *any* collision among a pool of hashes requires significantly fewer trials than finding a specific pre-image. For an $n$-bit hash (keyspace $2^n$), a $50\%$ collision probability occurs after only $\approx 1.177 \sqrt{2^n} = 1.177 \cdot 2^{n/2}$ attempts. Consequently, a 128-bit hash (like MD5) provides only $2^{64}$ collision resistance, which modern computing clusters can break in minutes. Secure algorithms require at least 256 bits (yielding 128-bit collision resistance).

---

## Module 4: Protection of Computing Resources (8 Hours · Bloom L1–L3)

### Q12: Compare the Bell-LaPadula and Biba access control models.
**Answer:**
- **Bell-LaPadula Model (Confidentiality):**
  - *Simple Security Property (ss-property):* No Read-Up (a subject cannot read data at a higher security level).
  - *$\star$-Property (Star Property):* No Write-Down (a subject cannot write data to a lower security level, preventing data leakage).
- **Biba Model (Integrity):**
  - *Simple Integrity Property:* No Read-Down (a subject cannot read data from a lower integrity level to avoid corrupted inputs).
  - *$\star$-Integrity Property:* No Write-Up (a subject cannot write data to a higher integrity level).

### Q13: What happens in memory during a classic Stack Buffer Overflow, and how does a Stack Canary prevent it?
**Answer:**
- When an application writes more data to an unbounded buffer than allocated (e.g. `strcpy`), excess bytes overwrite adjacent stack memory: Local Variables $\rightarrow$ Saved Frame Pointer (EBP) $\rightarrow$ Saved Return Address (EIP). By overwriting EIP, an attacker redirects execution flow.
- **Stack Canary (StackGuard):** The compiler places a random integer immediately before the saved return address. Before the function returns, it checks if the canary value changed. If altered, the program halts immediately with `SIGABRT` instead of executing the modified return address.

### Q14: How does WebAuthn / FIDO2 prevent phishing attacks?
**Answer:**
WebAuthn replaces passwords with asymmetric cryptography. During registration, the hardware authenticator generates a keypair bound cryptographically to the website's domain origin (`rpId`, e.g. `tcetmumbai.in`). During authentication, the browser supplies the active origin to the authenticator. If a student is tricked into opening a phishing domain (`tcet-mumbai-phish.com`), the authenticator will sign a challenge with the wrong origin, which the real server rejects.

---

## Module 5: Network Security & Defense (10 Hours · Bloom L1–L4)

### Q15: What is the difference between a Stateless Packet Filter and a Stateful Inspection Firewall?
**Answer:**
- **Stateless Firewall:** Inspects each packet in isolation against static 5-tuple ACL rules (Source/Dest IP, Source/Dest Port, Protocol). It cannot determine whether an inbound TCP packet is part of an existing, legitimately initiated connection.
- **Stateful Firewall:** Maintains an in-memory Connection Tracking (Conntrack) table. When an internal client initiates an outbound TCP SYN, the firewall records the connection. Return traffic (`SYN-ACK`, `ACK`) is automatically permitted without requiring wide-open inbound rules.

### Q16: How do RFC 4987 SYN Cookies defeat TCP SYN Flood attacks without allocating server RAM?
**Answer:**
During a SYN Flood, an attacker sends thousands of spoofed SYN packets, exhausting the server's backlog queue. 
With **SYN Cookies**, the server does **not** allocate a Transmission Control Block (TCB). Instead, it encodes the connection state into the 32-bit Initial Sequence Number (ISN) of the `SYN-ACK`:
- Bits 0–2: Encoded MSS index.
- Bits 3–7: Server slow counter $t \pmod{32}$.
- Bits 8–31: Cryptographic hash $\text{HMAC}(s_{\text{ip}}, d_{\text{ip}}, s_{\text{port}}, d_{\text{port}}, t, \text{key})$.
When the client replies with `ACK` (containing $\text{ISN} + 1$), the server validates the hash statelessly and only allocates memory if the ACK is authentic.

---

## Module 6: Applications & Emerging Threats (7 Hours · Bloom L1–L4)

### Q17: Walk through the three exchanges of Kerberos v5 authentication.
**Answer:**
1. **Authentication Service (AS) Exchange:** Client sends `AS-REQ`. KDC verifies user password hash and returns `AS-REP` containing the Ticket Granting Ticket (TGT) encrypted with KDC's secret key, plus a session key $K_{C,\text{TGS}}$.
2. **Ticket-Granting Service (TGS) Exchange:** Client presents TGT + Authenticator (`TGS-REQ`). KDC returns `TGS-REP` with a Service Ticket encrypted with the target service's secret key, plus session key $K_{C,S}$.
3. **Application (AP) Exchange:** Client sends Service Ticket + new Authenticator (`AP-REQ`) to target server. Server decrypts ticket and verifies student identity.

### Q18: What is the primary performance advantage of TLS 1.3 over TLS 1.2?
**Answer:**
- **TLS 1.2:** Requires **2 full Round-Trip Times (2-RTT)** to negotiate parameters, exchange cipher suites, transmit certificates, and establish session keys before sending encrypted HTTP application data.
- **TLS 1.3:** Reduces full handshake latency to **1-RTT** by combining key exchange (Diffie-Hellman KeyShare) directly into the `ClientHello`. Furthermore, resumed sessions support **0-RTT** (Early Data) using pre-shared keys (PSK).

### Q19: Contrast IPsec Authentication Header (AH) with Encapsulating Security Payload (ESP).
**Answer:**
- **AH (Protocol 51):** Provides **Integrity** and **Data Origin Authentication**, but **Zero Confidentiality** (payload is plaintext). It authenticates the entire IP packet, zeroing out mutable fields (TTL, TOS).
- **ESP (Protocol 50):** Provides **Confidentiality** (payload encryption via AES-CBC/GCM), **Data Origin Authentication**, and **Anti-Replay Protection**. ESP is universally preferred because it traverses NAT gateways (NAT-T) and secures data contents.

---

## Academic Scheme & Platform Engineering

### Q20: Explain the continuous evaluation framework implemented in the Faculty Gradebook.
**Answer:**
The application encodes TCET's institutional continuous evaluation weighting of **135 Total Marks**:
$$\text{Total} = \text{ISE}_1 (20) + \text{FA}_1 (25) + \text{ISE}_2 (20) + \text{ISE}_3 (20) + \text{FA}_2 (25) + \text{Term Work} (25) = 135$$
The faculty portal (`/teacher`) automatically calculates candidate aggregate percentages, derives university passing statuses and distinctions, and exports verified evaluation rosters directly to CSV.
