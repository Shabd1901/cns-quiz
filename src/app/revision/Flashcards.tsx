"use client"

import React, { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/Button"
import { ChevronLeft, ChevronRight, RefreshCw } from "lucide-react"

interface Flashcard {
  module: 'M1' | 'M2' | 'M3' | 'M4' | 'M5' | 'M6'
  q: string
  a: string
}

const flashcards: Flashcard[] = [
  // Module 1
  { module: "M1", q: "What is Kerckhoffs's Principle in cryptography?", a: "A cryptosystem must remain secure even if everything about the system (including algorithms, source code, and key lengths) is public knowledge—except the secret key itself." },
  { module: "M1", q: "What is the difference between Confusion and Diffusion?", a: "Confusion obscures the statistical relationship between the key and ciphertext (via non-linear substitution). Diffusion spreads the influence of individual plaintext letters across the entire ciphertext (via transposition and permutations)." },
  { module: "M1", q: "Why is monoalphabetic substitution vulnerable to cryptanalysis?", a: "Because it is a 1-to-1 invariant mapping; the relative frequencies of single letters, digrams, and trigrams in the plaintext (such as English 'E' being ≈ 12.7%) are preserved unchanged in the ciphertext." },
  { module: "M1", q: "What does the Kasiski Examination determine in Vigenère cryptanalysis?", a: "It identifies repeated strings of ciphertext letters. The greatest common divisor (GCD) of the distances between these repetitions reveals the probable key length of the Vigenère cipher." },
  { module: "M1", q: "What condition must multiplier 'a' satisfy in an Affine Cipher C = (aP + b) mod 26?", a: "The multiplier 'a' must be coprime to 26: gcd(a, 26) = 1. If not coprime, 'a' has no modular inverse mod 26, making unique decryption mathematically impossible." },

  // Module 2
  { module: "M2", q: "Why is Feistel cipher decryption structurally identical to encryption?", a: "Because the round function F does not need to be invertible; XORing twice cancels out: (L ⊕ F(R, K)) ⊕ F(R, K) = L. Decryption runs the exact same circuit simply by reversing the subkey schedule." },
  { module: "M2", q: "Why is Electronic Codebook (ECB) mode forbidden for images and files?", a: "Identical plaintext blocks encrypt into identical ciphertext blocks under the same key. This leaks structured patterns, shapes, and image contours (e.g. the famous Linux Tux image leak)." },
  { module: "M2", q: "What are the four byte transformations in a standard AES round?", a: "1. SubBytes (non-linear S-box substitution in GF(2^8)), 2. ShiftRows (cyclically shifts rows), 3. MixColumns (matrix multiplication in GF(2^8)), and 4. AddRoundKey (XOR with subkey)." },
  { module: "M2", q: "What mathematical problem provides the security foundation of RSA?", a: "The computational hardness of factoring the product n = p · q of two large prime numbers. Finding the Euler totient φ(n) = (p-1)(q-1) to compute private key d is as difficult as factoring n." },
  { module: "M2", q: "Why does Elliptic Curve Cryptography (ECC) require smaller keys than RSA?", a: "Because no sub-exponential algorithm is known for the Elliptic Curve Discrete Logarithm Problem (ECDLP). A 256-bit ECC key offers security equivalent to a 3072-bit RSA key." },

  // Module 3
  { module: "M3", q: "What is the difference between Pre-image and Second Pre-image Resistance?", a: "Pre-image resistance (one-way): Given hash y, it is infeasible to find ANY input x where H(x) = y. Second pre-image: Given a specific input x, it is infeasible to find a DIFFERENT input x' where H(x') = H(x)." },
  { module: "M3", q: "Why doesn't a Message Authentication Code (MAC) provide Non-repudiation?", a: "Because both sender and receiver share the identical secret symmetric key K. If Alice denies sending a message, Bob cannot prove to a judge that Alice wrote it, because Bob also possesses key K and could have forged the MAC tag himself." },
  { module: "M3", q: "How does HMAC protect against Length Extension Attacks?", a: "By using a nested hash structure H((K ⊕ opad) || H((K ⊕ ipad) || m)). The inner digest is completely re-hashed with an outer key-derived pad, preventing attackers from extending the internal hash state." },
  { module: "M3", q: "What is the consequence of reusing an ephemeral nonce k in ECDSA signatures?", a: "Subtracting the two signature equations cancels out the private key term, allowing the observer to solve directly for nonce k = (z1 - z2)/(s1 - s2) mod n, after which the signer's private key d is trivially extracted." },
  { module: "M3", q: "What is OCSP Stapling in X.509 PKI?", a: "The web server periodically queries the CA for a signed OCSP revocation response, caches it, and 'staples' it directly into the TLS handshake flight, eliminating client-to-CA lookup latency and preserving user browsing privacy." },

  // Module 4
  { module: "M4", q: "How does a classic stack buffer overflow hijack program control flow?", a: "Writing past the boundary of a stack-allocated buffer overwrites the adjacent saved frame pointer (EBP) and saved return address (EIP). When the function returns, the CPU jumps to attacker-controlled shellcode." },
  { module: "M4", q: "How do Stack Canaries detect buffer overflows?", a: "The compiler places a random secret canary value directly before the return address on the stack. The function epilogue checks if the canary has changed before executing 'ret'. If overwritten, the program terminates immediately." },
  { module: "M4", q: "What is the difference between Bell-LaPadula and Biba access control models?", a: "Bell-LaPadula enforces CONFIDENTIALITY ('No Read Up, No Write Down'). Biba enforces INTEGRITY ('No Read Down, No Write Up') to prevent high-integrity subjects from executing low-integrity data." },
  { module: "M4", q: "What are the three fundamental authentication factor categories in MFA?", a: "1. Something You Know (password, PIN), 2. Something You Have (hardware key, phone, smartcard), and 3. Something You Are (biometric fingerprint, iris, face)." },
  { module: "M4", q: "Why does adding a unique random Salt defeat precomputed Rainbow Tables?", a: "H(Salt || Password) forces a unique hash space for every user. An attacker cannot use a single global rainbow table across multiple victims; they would have to recompute a multi-gigabyte table from scratch for every single account." },

  // Module 5
  { module: "M5", q: "How does ARP Spoofing allow an attacker to intercept switched Ethernet traffic?", a: "The attacker broadcasts unsolicited ARP replies binding their own MAC address to the IP of the default gateway and victim host. Both caches are poisoned, causing all switched packets to route through the attacker's machine." },
  { module: "M5", q: "How do SYN Cookies defend against TCP SYN Flood attacks?", a: "Instead of allocating server memory in a half-open connection table, the server encodes the connection state into the TCP Initial Sequence Number (ISN) using a cryptographic hash. State is only allocated when the client returns ACK(ISN + 1)." },
  { module: "M5", q: "What is the fundamental difference between a Stateless and Stateful firewall?", a: "Stateless firewalls filter packets purely by 5-tuple header rules in isolation. Stateful firewalls track active connection states (SYN -> ESTABLISHED) in a connection tracking table, automatically permitting legitimate reply traffic." },
  { module: "M5", q: "What is the core architectural principle of Zero Trust (NIST SP 800-207)?", a: "'Never Trust, Always Verify'. Presence on the internal corporate network conveys zero intrinsic trust. Every access request is dynamically authenticated, authorized, and inspected regardless of network location." },
  { module: "M5", q: "Why are Low-Interaction honeypots safer than High-Interaction honeypots?", a: "Low-interaction honeypots only emulate network service banners (e.g. simulated SSH or HTTP) without running a real operating system, eliminating the risk of the honeypot being compromised and used to launch lateral attacks." },

  // Module 6
  { module: "M6", q: "Why does Kerberos require tightly synchronized clocks (skew ≤ 300s)?", a: "Authenticators contain client timestamps to prevent replay attacks. The server rejects authenticators older than 5 minutes and maintains a small replay cache of authenticators received within that valid window." },
  { module: "M6", q: "What is Perfect Forward Secrecy (PFS) in TLS?", a: "A security property ensuring that even if the server's long-term private key is compromised in the future, past recorded encrypted sessions cannot be decrypted. Achieved using ephemeral Diffie-Hellman (DHE/ECDHE) keys discarded after each session." },
  { module: "M6", q: "Why is IPsec Authentication Header (AH) incompatible with NAT gateways?", a: "AH calculates its Integrity Check Value (ICV) over the entire IP packet including source and destination IP addresses. Because NAT translates IP addresses, the ICV check fails at the receiver, causing all packets to be dropped." },
  { module: "M6", q: "Why does PGP compress email messages BEFORE symmetric encryption?", a: "Ciphertext has maximum Shannon entropy and cannot be compressed. Compressing plaintext first removes language redundancies and letter frequency patterns, depriving cryptanalysts of statistical attack vectors." },
  { module: "M6", q: "What is an Evasion Attack in adversarial machine learning?", a: "An adversary applies subtle, calculated perturbations to malicious inputs (e.g. padding benign bytes to a PE file) during test time so that an AI classifier misclassifies the exploit as benign while preserving its malicious function." }
]

export default function Flashcards() {
  const [filterModule, setFilterModule] = useState<string>('ALL')
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)

  const activeCards = filterModule === 'ALL'
    ? flashcards
    : flashcards.filter(c => c.module === filterModule)

  const safeIndex = currentIndex >= activeCards.length ? 0 : currentIndex
  const card = activeCards[safeIndex] || flashcards[0]

  const handleNext = () => {
    setIsFlipped(false)
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % activeCards.length)
    }, 150)
  }

  const handlePrev = () => {
    setIsFlipped(false)
    setTimeout(() => {
      setCurrentIndex((prev) => (prev - 1 + activeCards.length) % activeCards.length)
    }, 150)
  }

  return (
    <div className="flex flex-col items-center justify-center py-6 sm:py-8 max-w-2xl mx-auto px-2 font-mono">
      {/* Module Filter Pills */}
      <div className="flex flex-wrap items-center justify-center gap-1.5 mb-6 text-xs">
        {['ALL', 'M1', 'M2', 'M3', 'M4', 'M5', 'M6'].map(m => (
          <button
            key={m}
            onClick={() => {
              setFilterModule(m)
              setCurrentIndex(0)
              setIsFlipped(false)
            }}
            className={`px-2.5 py-1 border text-[11px] transition-all ${
              filterModule === m
                ? "border-signal bg-signal text-paper font-bold shadow-[2px_2px_0_var(--ink)]"
                : "border-rule bg-card text-ink hover:border-ink"
            }`}
          >
            {m}
          </button>
        ))}
      </div>

      <div className="font-mono text-[10px] uppercase tracking-widest text-ink-soft mb-6 bg-card border border-rule px-4 py-1 flex items-center gap-2">
        <span className="text-signal font-bold">{card.module}</span>
        <span>·</span>
        <span>Card {String(safeIndex + 1).padStart(2, '0')} / {String(activeCards.length).padStart(2, '0')}</span>
      </div>

      <div
        className="relative w-full min-h-[280px] sm:min-h-[320px] md:aspect-[3/2] perspective-[1000px] cursor-pointer"
        onClick={() => setIsFlipped(!isFlipped)}
      >
        <motion.div
          className="w-full h-full min-h-[280px] sm:min-h-[320px] preserve-3d"
          animate={{ rotateX: isFlipped ? 180 : 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
          style={{ transformStyle: "preserve-3d" }}
        >
          {/* Front */}
          <div className="absolute inset-0 w-full h-full backface-hidden p-6 sm:p-8 md:p-12 flex flex-col items-center justify-center text-center bg-card border border-ink shadow-[4px_4px_0_var(--rule)] overflow-y-auto">
            <div className="absolute top-3 left-3 sm:top-4 sm:left-4 font-mono text-[10px] sm:text-xs text-signal font-bold uppercase tracking-widest">
              {card.module} Definition
            </div>
            <h2 className="text-lg sm:text-2xl md:text-3xl font-serif leading-snug text-ink pt-4 sm:pt-0">
              {card.q}
            </h2>
            <span className="absolute bottom-3 text-[10px] text-ink-soft font-mono uppercase">
              Click to flip [Space]
            </span>
          </div>

          {/* Back */}
          <div
            className="absolute inset-0 w-full h-full backface-hidden p-6 sm:p-8 md:p-12 flex flex-col items-center justify-center text-center bg-paper border border-ok shadow-[4px_4px_0_var(--ok)] overflow-y-auto"
            style={{ transform: "rotateX(180deg)" }}
          >
            <div className="absolute top-3 right-3 sm:top-4 sm:right-4 font-mono text-[10px] sm:text-xs text-ok font-bold uppercase tracking-widest">
              Model Answer
            </div>
            <p className="text-sm sm:text-base md:text-lg font-sans leading-relaxed text-ink pt-4 sm:pt-0">
              {card.a}
            </p>
          </div>
        </motion.div>
      </div>

      <div className="flex items-center gap-4 sm:gap-6 mt-8 sm:mt-10">
        <Button
          variant="outline"
          onClick={handlePrev}
          className="h-10 w-10 sm:h-12 sm:w-12 rounded-none border border-ink text-ink hover:bg-card hover:text-signal transition-colors p-0 flex items-center justify-center"
        >
          <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6" />
        </Button>
        <Button
          variant="ghost"
          onClick={() => setIsFlipped(!isFlipped)}
          className="gap-2 font-mono uppercase tracking-wider text-xs border border-rule hover:border-ink rounded-none h-10 sm:h-12 px-4"
        >
          <RefreshCw className="h-3.5 w-3.5 sm:h-4 sm:w-4" /> Flip Card
        </Button>
        <Button
          variant="outline"
          onClick={handleNext}
          className="h-10 w-10 sm:h-12 sm:w-12 rounded-none border border-ink text-ink hover:bg-card hover:text-signal transition-colors p-0 flex items-center justify-center"
        >
          <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6" />
        </Button>
      </div>
    </div>
  )
}
