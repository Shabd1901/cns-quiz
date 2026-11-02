import { Question } from "../types"

export const m2Questions: Question[] = [
  // ==========================================
  // TOPIC 1: BLOCK CIPHER DESIGN PRINCIPLES
  // ==========================================
  {
    id: 'm2-mcq-avalanche',
    type: 'mcq',
    module: 'M2',
    topicId: 'block-principles',
    tags: ['crypto', 'block'],
    bloom: 'L2',
    difficulty: 1,
    marks: 1,
    timeSec: 30,
    prompt: 'What is the strict avalanche criterion (SAC) in modern block cipher design?',
    options: [
      'Flipping a single input bit must change at least 50% of the output bits on average with high probability',
      'The key must be twice as large as the block size to prevent algebraic attacks',
      'Encryption and decryption must take identical execution times regardless of key weight',
      'Every plaintext block must map to an odd ciphertext integer'
    ],
    answerIndex: 0,
    explanation: 'The Strict Avalanche Criterion (SAC) states that if any single input bit (plaintext or key) is inverted, each output bit should flip with a probability of 0.5 (half the output bits change on average).',
    replayStep: 1
  },
  {
    id: 'm2-order-spn-layers',
    type: 'order',
    module: 'M2',
    topicId: 'block-principles',
    tags: ['crypto', 'block'],
    bloom: 'L2',
    difficulty: 2,
    marks: 2,
    timeSec: 45,
    prompt: 'Arrange the typical sequential transformations inside a Substitution-Permutation Network (SPN) round from start to finish:',
    items: [
      'Bit/Byte Permutation (Diffusion layer spreading bits across blocks)',
      'Key Mixing (AddRoundKey / subkey injection via XOR)',
      'Substitution Layer (Non-linear S-box lookup creating Shannon confusion)'
    ],
    correctOrder: [1, 2, 0], // Key Mixing (1) -> Substitution (2) -> Permutation (0)
    explanation: 'An SPN round typically injects the round subkey first via XOR (Key Addition), applies non-linear S-box transformations (Substitution Layer), and finishes by permuting bit positions (Diffusion Layer).'
  },

  // ==========================================
  // TOPIC 2: FEISTEL STRUCTURE
  // ==========================================
  {
    id: 'm2-mcq-feistel-invertibility',
    type: 'mcq',
    module: 'M2',
    topicId: 'feistel',
    tags: ['crypto', 'feistel'],
    bloom: 'L2',
    difficulty: 2,
    marks: 1,
    timeSec: 35,
    prompt: 'Why does a Feistel cipher structure guarantee exact invertibility (reversibility) even if the round function F is non-invertible or a one-way compression function?',
    options: [
      'Because the round function F is never inverted; the output of F is simply XORed with the other half, and XOR is its own inverse (A ⊕ B ⊕ B = A)',
      'Because Feistel networks use prime modulus arithmetic',
      'Because the key schedule provides pre-computed inverse tables',
      'Because both halves are encrypted with independent asymmetric keys'
    ],
    answerIndex: 0,
    explanation: 'Feistel networks compute R_next = L_prev ⊕ F(R_prev, K). To recover L_prev, we calculate R_next ⊕ F(R_prev, K) = L_prev ⊕ F ⊕ F = L_prev. Because F is re-evaluated identically in decryption, F itself does not need to be invertible.',
    replayStep: 2
  },
  {
    id: 'm2-label-feistel-components',
    type: 'label',
    module: 'M2',
    topicId: 'feistel',
    tags: ['crypto', 'feistel'],
    bloom: 'L3',
    difficulty: 2,
    marks: 3,
    timeSec: 60,
    prompt: 'Label the core functional components of a standard Feistel round architecture.',
    diagramType: 'feistel',
    hotspots: [
      { id: 'h1', x: 25, y: 35, expected: 'Left Half (L_i)' },
      { id: 'h2', x: 75, y: 35, expected: 'Right Half (R_i)' },
      { id: 'h3', x: 50, y: 55, expected: 'Round Function F' },
      { id: 'h4', x: 25, y: 65, expected: 'XOR Addition' }
    ],
    labels: [
      'Left Half (L_i)',
      'Right Half (R_i)',
      'Round Function F',
      'XOR Addition',
      'Subkey K_i',
      'Swap Stage'
    ],
    explanation: 'A Feistel round splits the input block into Left (L_i) and Right (R_i) halves. The Right half passes into round function F with Subkey K_i, the output is XORed with L_i, and the two halves swap for the next round.'
  },

  // ==========================================
  // TOPIC 3: MODES OF OPERATION
  // ==========================================
  {
    id: 'm2-match-modes',
    type: 'match',
    module: 'M2',
    topicId: 'modes',
    tags: ['crypto', 'modes'],
    bloom: 'L3',
    difficulty: 2,
    marks: 3,
    timeSec: 60,
    prompt: 'Match each Block Cipher Mode of Operation to its defining architectural property:',
    pairs: [
      ['ECB (Electronic Codebook)', 'Deterministic: Identical plaintext blocks produce identical ciphertext blocks (Penguin leak)'],
      ['CBC (Cipher Block Chaining)', 'Sequential: XORs previous ciphertext block with current plaintext block before encryption'],
      ['CTR (Counter Mode)', 'Parallelizable Stream: Encrypts successive counter values; supports multi-core parallel encryption and decryption'],
      ['OFB (Output Feedback)', 'Bit-Flip Isolated: Generates a keystream by feeding back ciphertext-independent cipher outputs; 1-bit transmission error flips exactly 1 plaintext bit']
    ],
    explanation: 'ECB leaks pattern duplicates. CBC chains ciphertext blocks sequentially. CTR encrypts nonces + counters and is fully parallelizable. OFB is a keystream generator where bit flips do not propagate to subsequent blocks.'
  },
  {
    id: 'm2-mcq-ctr-random-access',
    type: 'mcq',
    module: 'M2',
    topicId: 'modes',
    tags: ['crypto', 'modes'],
    bloom: 'L2',
    difficulty: 2,
    marks: 1,
    timeSec: 35,
    prompt: 'Which block cipher mode allows direct random-access decryption of block number 1,000,000 in a huge file without decrypting any preceding blocks?',
    options: [
      'Counter (CTR) Mode',
      'Cipher Block Chaining (CBC) Mode',
      'Cipher Feedback (CFB) Mode',
      'Output Feedback (OFB) Mode'
    ],
    answerIndex: 0,
    explanation: 'In CTR mode, the keystream for block i is computed as E_K(Nonce || i). You can compute the keystream for block 1,000,000 directly from the nonce and block index i without processing any earlier blocks.'
  },

  // ==========================================
  // TOPIC 4: DES & 3DES
  // ==========================================
  {
    id: 'm2-numeric-des-mitm',
    type: 'numeric',
    module: 'M2',
    topicId: 'des',
    tags: ['crypto', 'des', 'math'],
    bloom: 'L3',
    difficulty: 2,
    marks: 3,
    timeSec: 60,
    prompt: 'In Double-DES (2DES), two independent 56-bit keys (K1, K2) are cascaded: C = E_K2(E_K1(P)). Due to the Meet-in-the-Middle attack, what is the effective time complexity to recover both keys using a table of intermediate values?',
    given: {
      'Single DES key length': 56,
      'Naive 2DES brute force': '2^112'
    },
    answer: 57,
    unit: 'log2 operations (2^57)',
    steps: [
      '1. Attacker computes intermediate values X = E_K1(P) for all 2^56 possible K1 keys and stores them in a hash table.',
      '2. Attacker then computes Y = D_K2(C) for all 2^56 possible K2 keys and checks for matches in the hash table.',
      '3. Total candidate operations = 2^56 + 2^56 = 2 × 2^56 = 2^57.',
      '4. The effective search complexity is reduced from 2^112 down to 2^57 operations, requiring 2^56 blocks of storage.'
    ],
    explanation: 'Meet-in-the-Middle exploits the equation E_K1(P) = D_K2(C). Instead of 2^112 trials, the attacker meets in the middle at 2^56 + 2^56 = 2^57 operations.'
  },
  {
    id: 'm2-mcq-3des-ede',
    type: 'mcq',
    module: 'M2',
    topicId: 'des',
    tags: ['crypto', 'des'],
    bloom: 'L2',
    difficulty: 1,
    marks: 1,
    timeSec: 30,
    prompt: 'Why does Triple-DES (3DES) use the Encrypt-Decrypt-Encrypt (EDE) sequence rather than Encrypt-Encrypt-Encrypt (EEE)?',
    options: [
      'Backward compatibility: Setting K1 = K2 = K3 makes 3DES behave as a standard single-DES encryption',
      'EDE doubles the bit length of each output block',
      'EDE eliminates the need for initial and final permutations',
      'EDE prevents differential cryptanalysis completely'
    ],
    answerIndex: 0,
    explanation: 'If K1 = K2 = K3, then E_K1(D_K2(E_K1(P))) = E_K1(D_K1(E_K1(P))) = E_K1(P). The decryption cancels the first encryption, allowing 3DES hardware to seamlessly interoperate with legacy single-DES systems.'
  },

  // ==========================================
  // TOPIC 5: AES (RIJNDAEL)
  // ==========================================
  {
    id: 'm2-order-aes-round',
    type: 'order',
    module: 'M2',
    topicId: 'aes',
    tags: ['crypto', 'aes'],
    bloom: 'L2',
    difficulty: 2,
    marks: 2,
    timeSec: 45,
    prompt: 'Order the four internal state transformations executed in a standard AES round from first to last:',
    items: [
      'MixColumns (Galois Field matrix multiplication for intra-column diffusion)',
      'SubBytes (Non-linear 8-bit S-box substitution)',
      'AddRoundKey (Bitwise XOR of the state matrix with the round subkey)',
      'ShiftRows (Cyclical byte shifts across rows 1, 2, and 3)'
    ],
    correctOrder: [1, 3, 0, 2], // SubBytes (1) -> ShiftRows (3) -> MixColumns (0) -> AddRoundKey (2)
    explanation: 'A standard AES round executes: 1. SubBytes, 2. ShiftRows, 3. MixColumns, and 4. AddRoundKey. Note that in the final round, MixColumns is omitted.'
  },
  {
    id: 'm2-numeric-aes-rounds',
    type: 'numeric',
    module: 'M2',
    topicId: 'aes',
    tags: ['crypto', 'aes', 'math'],
    bloom: 'L2',
    difficulty: 1,
    marks: 1,
    timeSec: 25,
    prompt: 'How many total transformation rounds are executed in AES when using a 256-bit key (AES-256)?',
    given: {
      'AES-128 rounds': 10,
      'AES-192 rounds': 12,
      'Key size': '256 bits'
    },
    answer: 14,
    unit: 'rounds',
    steps: [
      '1. AES-128 executes 10 rounds.',
      '2. AES-192 executes 12 rounds.',
      '3. AES-256 executes 14 rounds.'
    ],
    explanation: 'NIST FIPS 197 mandates 10 rounds for 128-bit keys, 12 rounds for 192-bit keys, and 14 rounds for 256-bit keys.'
  },

  // ==========================================
  // TOPIC 6: BLOWFISH
  // ==========================================
  {
    id: 'm2-mcq-blowfish-keyschedule',
    type: 'mcq',
    module: 'M2',
    topicId: 'blowfish',
    tags: ['crypto', 'blowfish'],
    bloom: 'L2',
    difficulty: 2,
    marks: 1,
    timeSec: 30,
    prompt: 'What makes Blowfish uniquely suitable for password hashing schemes like bcrypt, but less optimal for high-speed packet VPNs?',
    options: [
      'Its heavy key schedule initialization: it requires 521 iterations to generate 4 KB of key-dependent S-boxes, heavily penalizing GPU brute-force attacks',
      'Its 128-bit block size requires excessive padding',
      'It requires hardware co-processors to compute Galois field divisions',
      'It cannot be run in CBC mode'
    ],
    answerIndex: 0,
    explanation: 'Blowfish has an expensive key setup (generating the P-array and four S-boxes takes 521 full encryptions). This makes key setup intentionally slow, which frustrates GPU/ASIC password cracking in bcrypt.'
  },

  // ==========================================
  // TOPIC 7: RC5
  // ==========================================
  {
    id: 'm2-numeric-rc5-blocksize',
    type: 'numeric',
    module: 'M2',
    topicId: 'rc5',
    tags: ['crypto', 'rc5', 'math'],
    bloom: 'L2',
    difficulty: 1,
    marks: 1,
    timeSec: 30,
    prompt: 'In the standard configuration RC5-32/12/16, what is the resulting plaintext block size in bits?',
    given: {
      'Word size w': 32,
      'Rounds r': 12,
      'Key bytes b': 16
    },
    answer: 64,
    unit: 'bits',
    steps: [
      '1. RC5 operates on two words (A and B).',
      '2. The block size is 2 × w bits.',
      '3. For w = 32 bits, Block Size = 2 × 32 = 64 bits.'
    ],
    explanation: 'In RC5-w/r/b, w is the word size in bits. Since RC5 operates on two words (A and B), the cipher block size is 2w = 64 bits.'
  },

  // ==========================================
  // TOPIC 8: PUBLIC-KEY PRINCIPLES
  // ==========================================
  {
    id: 'm2-numeric-key-scaling',
    type: 'numeric',
    module: 'M2',
    topicId: 'public-key-principles',
    tags: ['crypto', 'math'],
    bloom: 'L3',
    difficulty: 2,
    marks: 2,
    timeSec: 45,
    prompt: 'In an enterprise network of N = 200 users, how many shared secret keys are required for pairwise symmetric encryption versus total keys for asymmetric public-key encryption?',
    given: {
      'Number of users N': 200
    },
    answer: 19900,
    unit: 'symmetric keys',
    steps: [
      '1. Symmetric key count = N(N - 1) / 2 = 200 × 199 / 2 = 19,900 pairwise secret keys.',
      '2. Asymmetric key count = 2N = 2 × 200 = 400 keys (1 public + 1 private per user).',
      '3. Symmetric ciphers require 19,900 keys.'
    ],
    explanation: 'Symmetric pairwise communication requires N(N-1)/2 keys (19,900). Public key cryptography requires only 2N keys (400).'
  },
  {
    id: 'm2-mcq-trapdoor-concept',
    type: 'mcq',
    module: 'M2',
    topicId: 'public-key-principles',
    tags: ['crypto', 'principles'],
    bloom: 'L1',
    difficulty: 1,
    marks: 1,
    timeSec: 25,
    prompt: 'What mathematical construct forms the essential foundation of asymmetric public-key cryptography?',
    options: [
      'Trapdoor one-way functions: easy to compute in one direction, infeasible to invert without secret trapdoor information',
      'Pseudo-random keystream generators seeded by system time',
      'Linear feed-forward shift registers (LFSR)',
      'Deterministic finite-state automata'
    ],
    answerIndex: 0,
    explanation: 'A trapdoor one-way function y = f(x) is easy to compute, but finding x from y is computationally intractable unless a secret trapdoor value k is known.'
  },

  // ==========================================
  // TOPIC 9: RSA ALGORITHM
  // ==========================================
  {
    id: 'm2-numeric-rsa-small',
    type: 'numeric',
    module: 'M2',
    topicId: 'rsa',
    tags: ['crypto', 'rsa', 'math'],
    bloom: 'L3',
    difficulty: 2,
    marks: 3,
    timeSec: 60,
    prompt: 'In an RSA cryptosystem with primes p = 7 and q = 11, and public exponent e = 7, find the private decryption key d.',
    given: {
      'Prime p': 7,
      'Prime q': 11,
      'Public exponent e': 7
    },
    answer: 43,
    unit: 'integer d',
    steps: [
      '1. Compute modulus n = p × q = 7 × 11 = 77.',
      '2. Compute Euler totient phi(n) = (p - 1)(q - 1) = 6 × 10 = 60.',
      '3. Solve for d: e × d ≡ 1 (mod phi(n)) -> 7d ≡ 1 (mod 60).',
      '4. Using Extended Euclidean Algorithm: 7 × 43 = 301 = 5 × 60 + 1 ≡ 1 (mod 60).',
      '5. Therefore, private key d = 43.'
    ],
    explanation: 'phi(n) = 60. We find d such that 7d ≡ 1 mod 60. Since 7 × 43 = 301 = 5(60) + 1, d = 43.'
  },
  {
    id: 'm2-numeric-rsa-encrypt',
    type: 'numeric',
    module: 'M2',
    topicId: 'rsa',
    tags: ['crypto', 'rsa', 'math'],
    bloom: 'L3',
    difficulty: 2,
    marks: 3,
    timeSec: 60,
    prompt: 'Given RSA parameters n = 33 and public exponent e = 3, encrypt the plaintext message M = 7 to find ciphertext C.',
    given: {
      'Modulus n': 33,
      'Exponent e': 3,
      'Plaintext M': 7
    },
    answer: 13,
    unit: 'ciphertext C',
    steps: [
      '1. Formula: C = M^e mod n.',
      '2. Compute 7^3 = 343.',
      '3. Divide 343 by 33: 343 = 10 × 33 + 13.',
      '4. Remainder is 13. Therefore, C = 13.'
    ],
    explanation: 'C = 7^3 mod 33 = 343 mod 33 = 13.'
  },

  // ==========================================
  // TOPIC 10: RABIN CRYPTOSYSTEM
  // ==========================================
  {
    id: 'm2-numeric-rabin-roots',
    type: 'numeric',
    module: 'M2',
    topicId: 'rabin',
    tags: ['crypto', 'rabin', 'math'],
    bloom: 'L2',
    difficulty: 1,
    marks: 1,
    timeSec: 25,
    prompt: 'When decrypting a valid ciphertext in the Rabin cryptosystem with modulus n = p · q (where p and q are distinct odd primes), how many candidate plaintext square roots are produced by the Chinese Remainder Theorem?',
    given: {
      'Prime factors of n': 2
    },
    answer: 4,
    unit: 'candidate roots',
    steps: [
      '1. Square root mod prime p produces 2 roots: ±m_p.',
      '2. Square root mod prime q produces 2 roots: ±m_q.',
      '3. Pairwise combination via CRT produces 2 × 2 = 4 candidate roots modulo n.'
    ],
    explanation: 'Decryption in the Rabin cryptosystem yields exactly 4 square roots in Z_n*, requiring redundancy padding to select the true original message.'
  },
  {
    id: 'm2-tf-rabin-security',
    type: 'tf-why',
    module: 'M2',
    topicId: 'rabin',
    tags: ['crypto', 'rabin'],
    bloom: 'L2',
    difficulty: 2,
    marks: 2,
    timeSec: 40,
    prompt: 'Evaluate whether breaking the Rabin cryptosystem is provably equivalent to factoring composite modulus n, and select the correct justification.',
    statement: 'Breaking the Rabin cryptosystem is provably equivalent to factoring the composite modulus n.',
    isTrue: true,
    whyOptions: [
      'Because Michael Rabin mathematically proved that any algorithm capable of finding square roots modulo n can be used to factor n in randomized polynomial time via gcd(r1 - r2, n).',
      'Because Rabin uses 4096-bit primes.',
      'Because the Euler totient of n cannot be calculated.',
      'Because square roots only exist for prime numbers.'
    ],
    whyIndex: 0,
    explanation: 'Rabin proved that finding modular square roots is computationally equivalent to factoring n: if you have two square roots r1 and r2 such that r1^2 ≡ r2^2 mod n and r1 ≢ ±r2 mod n, then gcd(r1 - r2, n) yields a non-trivial factor of n.'
  },

  // ==========================================
  // TOPIC 11: ELGAMAL CRYPTOSYSTEM
  // ==========================================
  {
    id: 'm2-numeric-elgamal-calc',
    type: 'numeric',
    module: 'M2',
    topicId: 'elgamal',
    tags: ['crypto', 'elgamal', 'math'],
    bloom: 'L3',
    difficulty: 3,
    marks: 3,
    timeSec: 75,
    prompt: 'In ElGamal with prime p = 23 and generator g = 5, Bob chooses private key x = 6. What is Bob’s public key value y?',
    given: {
      'Prime p': 23,
      'Generator g': 5,
      'Private key x': 6
    },
    answer: 8,
    unit: 'public key y',
    steps: [
      '1. Public key formula: y = g^x mod p.',
      '2. Compute 5^6 mod 23.',
      '3. 5^2 = 25 ≡ 2 mod 23.',
      '4. 5^6 = (5^2)^3 ≡ 2^3 = 8 mod 23.',
      '5. Therefore, public key y = 8.'
    ],
    explanation: 'y = 5^6 mod 23 = (25)^3 mod 23 ≡ 2^3 mod 23 = 8.'
  },
  {
    id: 'm2-multi-elgamal-features',
    type: 'multi',
    module: 'M2',
    topicId: 'elgamal',
    tags: ['crypto', 'elgamal'],
    bloom: 'L2',
    difficulty: 2,
    marks: 2,
    timeSec: 45,
    prompt: 'Which of the following are distinct structural characteristics of the ElGamal encryption scheme? (Select all that apply)',
    options: [
      'It is probabilistic (randomized): encrypting the identical message twice produces different ciphertexts due to ephemeral key k',
      'It exhibits a 2:1 ciphertext expansion factor: plaintext M produces ciphertext pair (c1, c2)',
      'Security is based on the Discrete Logarithm Problem (DLP)',
      'It requires the modulus n to be composite'
    ],
    answerIndexes: [0, 1, 2],
    explanation: 'ElGamal is probabilistic, expands ciphertext by 2:1, and relies on the Discrete Logarithm Problem over a prime modulus p. Modulus n is prime, not composite.'
  },

  // ==========================================
  // TOPIC 12: ELLIPTIC CURVE CRYPTOGRAPHY (ECC)
  // ==========================================
  {
    id: 'm2-mcq-ecc-keysize-comparison',
    type: 'mcq',
    module: 'M2',
    topicId: 'ecc',
    tags: ['crypto', 'ecc'],
    bloom: 'L2',
    difficulty: 1,
    marks: 1,
    timeSec: 25,
    prompt: 'According to NIST guidelines, an elliptic curve key of 256 bits provides cryptographic security equivalent to what RSA key length?',
    options: [
      '3,072-bit RSA',
      '1,024-bit RSA',
      '512-bit RSA',
      '256-bit RSA'
    ],
    answerIndex: 0,
    explanation: 'NIST states that a 256-bit elliptic curve key offers 128 bits of security strength, which is equivalent to a 3,072-bit RSA key.'
  },
  {
    id: 'm2-numeric-ecc-discriminant',
    type: 'numeric',
    module: 'M2',
    topicId: 'ecc',
    tags: ['crypto', 'ecc', 'math'],
    bloom: 'L3',
    difficulty: 2,
    marks: 2,
    timeSec: 45,
    prompt: 'For the elliptic curve y^2 ≡ x^3 + 2x + 3 (mod p), calculate the non-singularity discriminant expression (4a^3 + 27b^2).',
    given: {
      'Curve parameter a': 2,
      'Curve parameter b': 3
    },
    answer: 275,
    unit: 'integer',
    steps: [
      '1. Formula: Discriminant term = 4a^3 + 27b^2.',
      '2. Calculate 4a^3 = 4 × (2^3) = 4 × 8 = 32.',
      '3. Calculate 27b^2 = 27 × (3^2) = 27 × 9 = 243.',
      '4. Sum = 32 + 243 = 275.',
      '5. Since 275 != 0 mod p (for primes p != 5, 11), the curve is non-singular.'
    ],
    explanation: '4a^3 + 27b^2 = 4(8) + 27(9) = 32 + 243 = 275.'
  },

  // ==========================================
  // TOPIC 13: DIFFIE-HELLMAN KEY EXCHANGE
  // ==========================================
  {
    id: 'm2-numeric-dh-exchange',
    type: 'numeric',
    module: 'M2',
    topicId: 'diffie-hellman',
    tags: ['crypto', 'diffie-hellman', 'math'],
    bloom: 'L3',
    difficulty: 2,
    marks: 3,
    timeSec: 60,
    prompt: 'In Diffie-Hellman key exchange with global parameters prime p = 23 and generator g = 5, Alice chooses private key X_A = 4. What is Alice’s transmitted public value Y_A?',
    given: {
      'Prime p': 23,
      'Generator g': 5,
      'Alice secret X_A': 4
    },
    answer: 4,
    unit: 'public value Y_A',
    steps: [
      '1. Formula: Y_A = g^(X_A) mod p.',
      '2. Compute 5^4 mod 23.',
      '3. 5^4 = 625.',
      '4. 625 / 23 = 27 remainder 4 (27 × 23 = 621; 625 - 621 = 4).',
      '5. Therefore, Y_A = 4.'
    ],
    explanation: 'Y_A = 5^4 mod 23 = 625 mod 23 = 4.'
  },
  {
    id: 'm2-order-dh-steps',
    type: 'order',
    module: 'M2',
    topicId: 'diffie-hellman',
    tags: ['crypto', 'diffie-hellman'],
    bloom: 'L2',
    difficulty: 2,
    marks: 2,
    timeSec: 45,
    prompt: 'Arrange the sequence of Diffie-Hellman Key Agreement protocol operations in chronological order:',
    items: [
      'Alice and Bob compute the identical shared key K = (Y_B)^X_A = (Y_A)^X_B mod p',
      'Both parties publicly agree on domain parameters: prime p and generator g',
      'Alice and Bob exchange public keys Y_A and Y_B over the insecure channel',
      'Alice picks secret private integer X_A and computes Y_A = g^X_A mod p'
    ],
    correctOrder: [1, 3, 2, 0], // Agree params (1) -> Pick private & compute pub (3) -> Exchange (2) -> Compute shared key (0)
    explanation: 'Chronological order: 1. Public agreement on (p, g), 2. Local generation of private keys and public values, 3. Transmission of public values over the wire, 4. Independent computation of shared secret K.'
  },

  // ==========================================
  // TOPIC 14: LIGHTWEIGHT CRYPTOGRAPHY & TEA
  // ==========================================
  {
    id: 'm2-numeric-tea-cycles',
    type: 'numeric',
    module: 'M2',
    topicId: 'lightweight-tea',
    tags: ['crypto', 'tea', 'math'],
    bloom: 'L1',
    difficulty: 1,
    marks: 1,
    timeSec: 20,
    prompt: 'How many Feistel rounds are executed in the Tiny Encryption Algorithm (TEA) during its 32 complete cycles?',
    given: {
      'Total cycles': 32,
      'Rounds per cycle': 2
    },
    answer: 64,
    unit: 'Feistel rounds',
    steps: [
      '1. Each TEA cycle consists of two Feistel rounds (one updating v0, one updating v1).',
      '2. Total rounds = 32 cycles × 2 rounds/cycle = 64 rounds.'
    ],
    explanation: 'TEA executes 32 cycles, each consisting of 2 Feistel rounds, totaling 64 rounds.'
  },
  {
    id: 'm2-mcq-tea-weakness',
    type: 'mcq',
    module: 'M2',
    topicId: 'lightweight-tea',
    tags: ['crypto', 'tea'],
    bloom: 'L2',
    difficulty: 2,
    marks: 1,
    timeSec: 30,
    prompt: 'What structural weakness exists in the original Tiny Encryption Algorithm (TEA) that led to the design of XTEA?',
    options: [
      'Each 128-bit key has 3 other equivalent keys (4 equivalent keys total), reducing effective key space to 2^126',
      'It requires 4 KB of memory tables',
      'It cannot execute on 32-bit registers',
      'The block size is only 16 bits'
    ],
    answerIndex: 0,
    explanation: 'Original TEA suffers from equivalent keys: flipping the most significant bit of certain subkeys produces identical ciphertexts, reducing the effective search space from 2^128 down to 2^126. XTEA solves this through dynamic key-word indexing.'
  }
]
