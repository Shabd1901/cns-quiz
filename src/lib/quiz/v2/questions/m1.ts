import { Question, NumericQuestion } from "../types"

export const m1Questions: Question[] = [
  // ==========================================
  // TOPIC 4: CAESAR AND MONOALPHABETIC CIPHERS
  // ==========================================
  {
    id: 'm1-mcq-caesar-keyspace',
    type: 'mcq',
    module: 'M1',
    topicId: 'caesar',
    tags: ['crypto', 'classical'],
    bloom: 'L2',
    difficulty: 1,
    marks: 1,
    timeSec: 30,
    prompt: 'In the classical Caesar shift cipher over the 26-letter English alphabet, how many cryptographically effective (non-trivial) keys exist?',
    options: [
      '26 keys, because there are 26 letters in the alphabet',
      '25 keys, because a shift of 0 (or 26) leaves the plaintext unchanged',
      '24 keys, excluding shifts 0 and 13 (ROT13)',
      'Infinite keys, because any integer can be used as a shift'
    ],
    answerIndex: 1,
    explanation: 'A shift of k = 0 (or any multiple of 26) is the identity transformation C = P mod 26, which performs zero encryption. Hence, only shifts 1 through 25 are effective keys.',
    replayStep: 1
  },

  // ==========================================
  // TOPIC 1: PRINCIPLES OF SECURITY (CIA & AAA)
  // ==========================================
  {
    id: 'm1-principles-cia-definition',
    type: 'mcq',
    module: 'M1',
    topicId: 'principles',
    tags: ['crypto', 'principles'],
    bloom: 'L1',
    difficulty: 1,
    marks: 1,
    timeSec: 30,
    prompt: 'Which security goal is violated when an unauthorized user intercepts and reads a confidential patient medical record in transit?',
    options: [
      'Confidentiality',
      'Integrity',
      'Availability',
      'Non-repudiation'
    ],
    answerIndex: 0,
    explanation: 'Confidentiality ensures that information is not made available or disclosed to unauthorized individuals, entities, or processes. Unauthorized reading violates confidentiality alone.',
    replayStep: 0
  },
  {
    id: 'm1-principles-aaa-distinction',
    type: 'match',
    module: 'M1',
    topicId: 'principles',
    tags: ['auth', 'principles'],
    bloom: 'L2',
    difficulty: 2,
    marks: 2,
    timeSec: 45,
    prompt: 'Match each component of the AAA security framework with its operational definition:',
    pairs: [
      ['Authentication', 'Verifying the claimed identity of a user or system (e.g., password, biometrics)'],
      ['Authorization', 'Determining whether an authenticated entity has permission to perform an action'],
      ['Accounting', 'Tracking and logging the consumption of resources and user actions for auditability'],
      ['Non-Repudiation', 'Providing cryptographic proof that prevents an actor from denying an action']
    ],
    explanation: 'Authentication establishes WHO you are; Authorization governs WHAT you may access; Accounting records WHAT you did; Non-repudiation ensures you cannot deny having done it.',
    replayStep: 0
  },
  {
    id: 'm1-tf-kerckhoffs',
    type: 'tf-why',
    module: 'M1',
    topicId: 'principles',
    tags: ['crypto', 'principles'],
    bloom: 'L2',
    difficulty: 2,
    marks: 2,
    timeSec: 45,
    prompt: 'Evaluate Kerckhoffs’s principle and its underlying cryptographic justification:',
    statement: 'According to Kerckhoffs’s principle, a cryptographic system remains secure even if the attacker knows everything about the algorithm and design, provided the key remains secret.',
    isTrue: true,
    whyOptions: [
      'Because keeping mathematical algorithms secret against reverse-engineering and espionage is practically impossible at scale.',
      'Because public algorithms run faster on modern CPUs with AES-NI instructions.',
      'Because proprietary algorithms cannot be implemented in hardware chips.',
      'Because secret algorithms always violate Shannon’s theorem of confusion.'
    ],
    whyIndex: 0,
    explanation: 'True. Auguste Kerckhoffs established that secrecy of the algorithm (security through obscurity) inevitably fails. Security must reside entirely in the randomness and secrecy of the key.',
    replayStep: 0
  },
  {
    id: 'm1-principles-nonrepudiation-symmetric',
    type: 'mcq',
    module: 'M1',
    topicId: 'principles',
    tags: ['crypto', 'principles'],
    bloom: 'L3',
    difficulty: 2,
    marks: 2,
    timeSec: 40,
    prompt: 'Why CANNOT pure symmetric-key cryptography achieve true Non-Repudiation between two communicating parties?',
    options: [
      'Because both sender and receiver possess the exact same secret key, so either could have generated the message',
      'Because symmetric keys are too short to support digital signature mathematics',
      'Because symmetric encryption algorithms do not operate on hash functions',
      'Because symmetric ciphers are always susceptible to chosen-ciphertext attacks'
    ],
    answerIndex: 0,
    explanation: 'In symmetric cryptography, Alice and Bob share identical key K. If a message encrypted with K arrives, Bob cannot prove to a neutral third-party judge that Alice created it, because Bob himself possesses K and could have forged it.',
    replayStep: 0
  },

  // ==========================================
  // TOPIC 2: OSI SECURITY ARCHITECTURE (X.800)
  // ==========================================
  {
    id: 'm1-osi-attack-classification',
    type: 'multi',
    module: 'M1',
    topicId: 'osi-architecture',
    tags: ['attacks', 'osi'],
    bloom: 'L2',
    difficulty: 2,
    marks: 2,
    timeSec: 45,
    prompt: 'Under ITU-T Recommendation X.800, which of the following are classified as PASSIVE attacks? (Select all that apply)',
    options: [
      'Release of message contents (eavesdropping on unencrypted packets)',
      'Traffic analysis (observing message frequency, packet length, and communication endpoints)',
      'Replay attack (capturing a valid authentication packet and retransmitting it later)',
      'Denial of service (flooding a router buffer with malformed packets)'
    ],
    answerIndexes: [0, 1],
    explanation: 'Passive attacks do not alter data or system state; they are eavesdropping (release of message contents) and traffic analysis. Replay, masquerade, modification, and DoS are active attacks.',
    replayStep: 1
  },
  {
    id: 'm1-osi-services-mechanisms',
    type: 'match',
    module: 'M1',
    topicId: 'osi-architecture',
    tags: ['osi', 'crypto'],
    bloom: 'L3',
    difficulty: 2,
    marks: 2,
    timeSec: 45,
    prompt: 'Match each X.800 Security Service with the primary Security Mechanism used to implement it:',
    pairs: [
      ['Data Confidentiality', 'Encipherment (symmetric/asymmetric encryption)'],
      ['Non-Repudiation', 'Digital Signature with Public Key Infrastructure (PKI)'],
      ['Data Integrity', 'Cryptographic Checksum / Message Authentication Code (MAC)'],
      ['Traffic Flow Confidentiality', 'Traffic Padding (transmitting random dummy ciphertext blocks)']
    ],
    explanation: 'Under X.800: Confidentiality uses encipherment; Non-repudiation uses digital signatures; Integrity uses cryptographic MAC/hash checks; Traffic flow confidentiality uses traffic padding to mask communication patterns.',
    replayStep: 2
  },

  // ==========================================
  // TOPIC 3: SYMMETRIC CIPHER MODEL
  // ==========================================
  {
    id: 'm1-label-symmetric-model',
    type: 'label',
    module: 'M1',
    topicId: 'symmetric-model',
    tags: ['crypto'],
    bloom: 'L2',
    difficulty: 1,
    marks: 3,
    timeSec: 60,
    prompt: 'Label the 5 essential components in the classical Symmetric Cipher Model:',
    diagramType: 'symmetric-cipher',
    hotspots: [
      { id: 'h1', x: 15, y: 50, expected: 'Plaintext (X)' },
      { id: 'h2', x: 35, y: 50, expected: 'Encryption Algorithm' },
      { id: 'h3', x: 50, y: 15, expected: 'Secret Key (K)' },
      { id: 'h4', x: 65, y: 50, expected: 'Ciphertext (Y)' },
      { id: 'h5', x: 85, y: 50, expected: 'Decryption Algorithm' }
    ],
    labels: [
      'Plaintext (X)',
      'Encryption Algorithm',
      'Secret Key (K)',
      'Ciphertext (Y)',
      'Decryption Algorithm'
    ],
    explanation: 'The five ingredients defined by Stallings are: Plaintext, Encryption Algorithm, Secret Key, Ciphertext, and Decryption Algorithm.',
    replayStep: 0
  },
  {
    id: 'm1-symmetric-requirements',
    type: 'multi',
    module: 'M1',
    topicId: 'symmetric-model',
    tags: ['crypto'],
    bloom: 'L2',
    difficulty: 2,
    marks: 2,
    timeSec: 45,
    prompt: 'What are the two fundamental operational requirements for secure symmetric encryption? (Select two)',
    options: [
      'A strong encryption algorithm where knowledge of algorithm details does not reveal the key or plaintext',
      'Sender and receiver must have obtained copies of the secret key in a secure manner and maintain its secrecy',
      'The secret key must be twice as long as the transmitted plaintext message',
      'The encryption algorithm must be kept secret from all academic cryptanalysts'
    ],
    answerIndexes: [0, 1],
    explanation: 'Symmetric encryption requires: 1) a strong algorithm that resists cryptanalysis even when public, and 2) a secure key distribution channel and secret storage.',
    replayStep: 0
  },

  {
    id: 'm1-multi-mono-weakness',
    type: 'multi',
    module: 'M1',
    topicId: 'caesar',
    tags: ['crypto', 'attacks'],
    bloom: 'L3',
    difficulty: 2,
    marks: 2,
    timeSec: 45,
    prompt: 'Which of the following properties are TRUE regarding monoalphabetic substitution ciphers? (Select all that apply)',
    options: [
      'The size of the key space is 26! ≈ 4.03 × 10^26 keys.',
      'They eliminate single-letter frequency analysis completely.',
      'Each plaintext letter always maps to the same ciphertext letter throughout the message.',
      'Digram and trigram frequency patterns from the plaintext are preserved in the ciphertext.'
    ],
    answerIndexes: [0, 2, 3],
    explanation: 'Options A, C, and D are true. Option B is false because monoalphabetic substitution is 1-to-1 invariant; it directly leaks the statistical distribution of letters (e.g. E being most frequent).',
    replayStep: 2
  },
  {
    id: 'm1-fill-caesar-math',
    type: 'fill',
    module: 'M1',
    topicId: 'caesar',
    tags: ['crypto', 'math'],
    bloom: 'L3',
    difficulty: 2,
    marks: 2,
    timeSec: 40,
    prompt: 'Complete the encryption calculation for letter "T" (index 19) using Caesar key k = 5:',
    template: 'C = (19 + 5) mod 26 = {{b1}}, which maps to the ciphertext letter {{b2}}.',
    blanks: ['24', 'Y'],
    explanation: '19 + 5 = 24. Position 24 in the zero-indexed alphabet (A=0, ..., Y=24, Z=25) is letter "Y".',
    replayStep: 1
  },
  // ==========================================
  // TOPIC 5: AFFINE CIPHER
  // ==========================================
  {
    id: 'm1-num-affine-coprime',
    type: 'numeric',
    module: 'M1',
    topicId: 'affine',
    tags: ['crypto', 'math'],
    bloom: 'L3',
    difficulty: 2,
    marks: 3,
    timeSec: 60,
    prompt: 'For an Affine cipher E(x) = (ax + b) mod 26, how many distinct valid values can the multiplicative key "a" take such that a modular inverse exists?',
    given: {
      'Modulus (m)': 26,
      'Condition': 'gcd(a, 26) = 1'
    },
    answer: 12,
    tolerance: 0,
    unit: 'values',
    steps: [
      '1. A multiplicative inverse a^-1 mod 26 exists if and only if gcd(a, 26) = 1.',
      '2. The prime factorization of 26 is 2 × 13.',
      '3. By Euler’s totient function: φ(26) = 26 × (1 - 1/2) × (1 - 1/13) = 26 × (1/2) × (12/13) = 12.',
      '4. The valid values in ℤ₂₆ are: {1, 3, 5, 7, 9, 11, 15, 17, 19, 21, 23, 25}.'
    ],
    explanation: 'Only integers coprime to 26 have a multiplicative inverse mod 26. Since 26 = 2 × 13, eliminating even numbers and 13 leaves exactly 12 valid multipliers.',
    replayStep: 1
  },
  {
    id: 'm1-num-mono-bruteforce',
    type: 'numeric',
    module: 'M1',
    topicId: 'caesar',
    tags: ['crypto', 'math'],
    bloom: 'L2',
    difficulty: 1,
    marks: 2,
    timeSec: 30,
    prompt: 'If a computer can test 1 Caesar shift per microsecond (1,000,000 keys/sec), what is the MAXIMUM time in microseconds required to test the entire Caesar cipher keyspace by brute force?',
    given: {
      'Total non-trivial keys': 25,
      'Testing rate': '1 key per microsecond'
    },
    answer: 25,
    tolerance: 0,
    unit: 'microseconds',
    steps: [
      '1. Total Caesar keyspace consists of shifts k ∈ {1, 2, ..., 25}.',
      '2. 25 keys × 1 µs/key = 25 µs.'
    ],
    explanation: 'Testing all 25 Caesar shifts takes at most 25 microseconds, proving Caesar ciphers are utterly insecure against exhaustive key search.',
    replayStep: 1
  },
  {
    id: 'm1-num-affine-total-keyspace',
    type: 'numeric',
    module: 'M1',
    topicId: 'affine',
    tags: ['crypto', 'math'],
    bloom: 'L3',
    difficulty: 2,
    marks: 3,
    timeSec: 45,
    prompt: 'Calculate the total number of key pairs (a, b) in the Affine cipher keyspace over the 26-letter alphabet:',
    given: {
      'Valid multipliers a': 12,
      'Valid additive shifts b': 26
    },
    answer: 312,
    tolerance: 0,
    unit: 'keys',
    steps: [
      '1. Key parameter a must be coprime to 26: φ(26) = 12 choices.',
      '2. Key parameter b can be any integer in ℤ₂₆: 26 choices.',
      '3. Total keyspace = 12 × 26 = 312 keys.'
    ],
    explanation: 'There are 12 valid coprime multipliers and 26 possible additive shifts, giving 12 × 26 = 312 possible affine keys.',
    replayStep: 1
  },
  {
    id: 'm1-num-affine-modinv',
    type: 'numeric',
    module: 'M1',
    topicId: 'affine',
    tags: ['crypto', 'math'],
    bloom: 'L3',
    difficulty: 3,
    marks: 3,
    timeSec: 60,
    prompt: 'Find the modular multiplicative inverse of a = 7 modulo 26, such that (7 × a⁻¹) ≡ 1 (mod 26):',
    given: {
      'Multiplier a': 7,
      'Modulus m': 26
    },
    answer: 15,
    tolerance: 0,
    unit: 'integer in ℤ₂₆',
    steps: [
      '1. Using Extended Euclidean Algorithm: 26 = 3(7) + 5; 7 = 1(5) + 2; 5 = 2(2) + 1.',
      '2. Back-substituting: 1 = 5 - 2(2) = 5 - 2(7 - 5) = 3(5) - 2(7) = 3(26 - 3(7)) - 2(7) = 3(26) - 11(7).',
      '3. Therefore -11 × 7 ≡ 1 mod 26.',
      '4. Since -11 mod 26 = 15, check: 7 × 15 = 105 = 4 × 26 + 1 ≡ 1 mod 26.'
    ],
    explanation: '7 × 15 = 105 = 104 + 1 = (4 × 26) + 1 ≡ 1 (mod 26). Thus, the modular inverse is 15.',
    replayStep: 2
  },

  // ==========================================
  // TOPIC 6: PLAYFAIR CIPHER
  // ==========================================
  {
    id: 'm1-order-playfair-steps',
    type: 'order',
    module: 'M1',
    topicId: 'playfair',
    tags: ['crypto', 'classical'],
    bloom: 'L3',
    difficulty: 2,
    marks: 2,
    timeSec: 60,
    prompt: 'Place the following Playfair cipher preprocessing and encryption steps in the correct chronological order:',
    items: [
      'Construct the 5×5 matrix with the keyword and unused alphabet letters (merging I/J).',
      'Split plaintext into digraph pairs, inserting filler "X" between identical consecutive letters in a pair.',
      'If the final letter is unpaired, append a filler "X" to complete the last digraph.',
      'Apply row, column, or rectangle geometric rules to each digraph to produce ciphertext.'
    ],
    correctOrder: [0, 1, 2, 3],
    explanation: 'Matrix construction is step 1; splitting pairs with filler X for duplicates is step 2; padding an odd trailing letter is step 3; and applying geometric coordinate rules is step 4.',
    replayStep: 2
  },
  {
    id: 'm1-playfair-rectangle-rule',
    type: 'mcq',
    module: 'M1',
    topicId: 'playfair',
    tags: ['crypto', 'classical'],
    bloom: 'L3',
    difficulty: 2,
    marks: 2,
    timeSec: 45,
    prompt: 'In a Playfair 5×5 key matrix, if two plaintext letters in a digraph fall neither in the same row nor in the same column (forming the corners of a rectangle), how are they encrypted?',
    options: [
      'Each letter is replaced by the letter in its own row and the other letter’s column',
      'Each letter is replaced by the letter in its own column and the other letter’s row',
      'Both letters are swapped with their diagonal opposites across the entire 5×5 matrix',
      'The letters are replaced by their immediate right neighbors'
    ],
    answerIndex: 0,
    explanation: 'The Playfair rectangle rule states: Each letter in the digraph is replaced by the letter lying in the same row as itself, but in the column occupied by the other letter of the pair.',
    replayStep: 2
  },
  {
    id: 'm1-playfair-digraph-count',
    type: 'numeric',
    module: 'M1',
    topicId: 'playfair',
    tags: ['crypto', 'math'],
    bloom: 'L3',
    difficulty: 2,
    marks: 2,
    timeSec: 40,
    prompt: 'Because Playfair encrypts digraph pairs using a 25-symbol matrix (merging I/J), how many distinct possible letter pairs (digraphs) exist in the system?',
    given: {
      'Alphabet matrix size': '5 × 5 = 25 distinct symbols'
    },
    answer: 625,
    tolerance: 0,
    unit: 'digraphs',
    steps: [
      '1. Each position in the pair can be any of the 25 distinct symbols.',
      '2. Total theoretical pairs = 25 × 25 = 625 digraphs.'
    ],
    explanation: 'There are 25 × 25 = 625 possible digraphs. Because repeated letters in a pair are separated by filler X, at most 25 × 24 = 600 pairs appear in preprocessed plaintext.',
    replayStep: 2
  },

  // ==========================================
  // TOPIC 7: VIGENÈRE CIPHER
  // ==========================================
  {
    id: 'm1-vigenere-kasiski',
    type: 'mcq',
    module: 'M1',
    topicId: 'vigenere',
    tags: ['crypto', 'attacks'],
    bloom: 'L3',
    difficulty: 2,
    marks: 2,
    timeSec: 45,
    prompt: 'What is the primary objective of performing Kasiski examination on a Vigenère ciphertext?',
    options: [
      'To determine the length of the repeating keyword by finding the greatest common divisor of distances between repeated ciphertext strings',
      'To compute the determinant of the underlying substitution matrix modulo 26',
      'To directly decrypt the ciphertext into plaintext without guessing the key',
      'To generate a One-Time Pad keystream that cancels the periodic substitution'
    ],
    answerIndex: 0,
    explanation: 'Major Friedrich Kasiski (1863) observed that repeated plaintext words separated by multiples of the key length produce identical ciphertext strings. The GCD of the distances between these repetitions reveals the key length d.',
    replayStep: 2
  },
  {
    id: 'm1-vigenere-ioc',
    type: 'mcq',
    module: 'M1',
    topicId: 'vigenere',
    tags: ['crypto', 'math'],
    bloom: 'L3',
    difficulty: 3,
    marks: 2,
    timeSec: 50,
    prompt: 'The Index of Coincidence (IoC) measures the probability that two randomly selected letters from a text are identical. For normal English text, IoC ≈ 0.065. What happens to the IoC of a ciphertext as the Vigenère key length becomes very long?',
    options: [
      'It decreases toward ≈ 0.0384 (the uniform random distribution 1/26)',
      'It increases toward 1.0 (approaching complete determinism)',
      'It stays constant at 0.065 because English letter frequencies are conserved',
      'It oscillates sinusoidally between 0.065 and 0.130'
    ],
    answerIndex: 0,
    explanation: 'As the polyalphabetic key length increases, the distribution flattens toward uniform randomness. For a completely uniform random distribution over 26 letters, the coincidence probability is 1/26 ≈ 0.0384.',
    replayStep: 3
  },
  {
    id: 'm1-fill-vigenere-encrypt',
    type: 'fill',
    module: 'M1',
    topicId: 'vigenere',
    tags: ['crypto', 'math'],
    bloom: 'L3',
    difficulty: 2,
    marks: 2,
    timeSec: 45,
    prompt: 'Encrypt the plaintext letter "C" (index 2) using Vigenère key letter "K" (index 10):',
    template: 'C = (2 + 10) mod 26 = {{b1}}, which produces ciphertext letter {{b2}}.',
    blanks: ['12', 'M'],
    explanation: '2 + 10 = 12. In 0-indexed alphabet (A=0, B=1, ..., M=12), index 12 is "M".',
    replayStep: 1
  },

  // ==========================================
  // TOPIC 8: HILL CIPHER
  // ==========================================
  {
    id: 'm1-hill-matrix-invertibility',
    type: 'multi',
    module: 'M1',
    topicId: 'hill',
    tags: ['crypto', 'math'],
    bloom: 'L3',
    difficulty: 2,
    marks: 2,
    timeSec: 45,
    prompt: 'For an n × n matrix K to be a valid encryption key in a Hill cipher modulo 26, which conditions MUST hold? (Select all that apply)',
    options: [
      'The determinant det(K) must be non-zero: det(K) ≠ 0 mod 26',
      'The determinant det(K) must be coprime to 26: gcd(det(K), 26) = 1',
      'The matrix K must be symmetric: K = Kᵀ',
      'The trace of K must equal 26'
    ],
    answerIndexes: [0, 1],
    explanation: 'For a matrix to have a modular inverse K⁻¹ mod 26, its determinant det(K) must have a modular multiplicative inverse mod 26, which requires gcd(det(K), 26) = 1 (and thus det(K) ≠ 0 mod 26).',
    replayStep: 1
  },
  {
    id: 'm1-num-hill-determinant',
    type: 'numeric',
    module: 'M1',
    topicId: 'hill',
    tags: ['crypto', 'math'],
    bloom: 'L3',
    difficulty: 2,
    marks: 3,
    timeSec: 60,
    prompt: 'Given the Hill cipher 2×2 key matrix K = [[3, 3], [2, 5]], calculate the determinant det(K) modulo 26:',
    given: {
      'Matrix K': '[[3, 3], [2, 5]]',
      'Formula': 'det(K) = (ad - bc) mod 26'
    },
    answer: 9,
    tolerance: 0,
    unit: 'scalar in ℤ₂₆',
    steps: [
      '1. det(K) = (3 × 5) - (3 × 2) = 15 - 6 = 9.',
      '2. 9 mod 26 = 9.',
      '3. Verify coprime: gcd(9, 26) = 1, so K is invertible mod 26.'
    ],
    explanation: 'det(K) = (3)(5) - (3)(2) = 15 - 6 = 9 mod 26. Since gcd(9, 26) = 1, this matrix is invertible mod 26.',
    replayStep: 1
  },
  {
    id: 'm1-hill-kpa-vulnerability',
    type: 'mcq',
    module: 'M1',
    topicId: 'hill',
    tags: ['crypto', 'attacks'],
    bloom: 'L3',
    difficulty: 3,
    marks: 3,
    timeSec: 50,
    prompt: 'Why is the Hill cipher completely vulnerable to a Known-Plaintext Attack (KPA)?',
    options: [
      'Because Hill cipher is a linear transformation C = P · K mod 26; given n linearly independent plaintext-ciphertext pairs, K can be solved directly via K = P⁻¹ · C mod 26',
      'Because the determinant of any Hill matrix is always equal to 1 mod 26',
      'Because Hill cipher does not permute the positions of letters within a block',
      'Because matrix multiplication is non-commutative'
    ],
    answerIndex: 0,
    explanation: 'Hill cipher is completely linear. If an attacker recovers n linearly independent plaintext vectors and their ciphertext vectors, they can form matrix P and C and compute the key matrix via K = P⁻¹ · C mod 26 using standard Gaussian elimination mod 26.',
    replayStep: 3
  },

  // ==========================================
  // TOPIC 9: TRANSPOSITION CIPHERS
  // ==========================================
  {
    id: 'm1-transposition-vs-substitution',
    type: 'mcq',
    module: 'M1',
    topicId: 'transposition',
    tags: ['crypto', 'classical'],
    bloom: 'L2',
    difficulty: 1,
    marks: 1,
    timeSec: 30,
    prompt: 'What is the fundamental difference between a substitution cipher and a transposition cipher?',
    options: [
      'Substitution changes the identity of symbols while preserving their positions; Transposition preserves symbol identities while permuting their positions',
      'Substitution operates on binary bits; Transposition operates only on letters',
      'Substitution uses symmetric keys; Transposition uses public-private key pairs',
      'Substitution is always secure against frequency analysis; Transposition is not'
    ],
    answerIndex: 0,
    explanation: 'In substitution, plaintext symbols are replaced with other symbols. In transposition, the plaintext symbols themselves are retained unchanged, but their sequence order is rearranged.',
    replayStep: 0
  },
  {
    id: 'm1-railfence-decrypt-depth',
    type: 'numeric',
    module: 'M1',
    topicId: 'transposition',
    tags: ['crypto', 'classical'],
    bloom: 'L2',
    difficulty: 1,
    marks: 2,
    timeSec: 40,
    prompt: 'In a Rail Fence cipher with depth d = 3 rails, what is the length of one complete repeating zigzag cycle (down then up back to rail 0)?',
    given: {
      'Rails d': 3,
      'Cycle formula': '2 × (d - 1)'
    },
    answer: 4,
    tolerance: 0,
    unit: 'characters per cycle',
    steps: [
      '1. Top rail is rail 0, middle is rail 1, bottom is rail 2.',
      '2. Zigzag moves: rail 0 -> rail 1 -> rail 2 -> rail 1 -> (rail 0).',
      '3. Cycle length = 2 × (3 - 1) = 4 steps.'
    ],
    explanation: 'For depth d, the wave cycle repeats every 2(d - 1) positions. For d = 3, cycle = 2(2) = 4 characters.',
    replayStep: 1
  },

  // ==========================================
  // TOPIC 10: PRODUCT CIPHERS (CONFUSION & DIFFUSION)
  // ==========================================
  {
    id: 'm1-product-confusion-diffusion',
    type: 'match',
    module: 'M1',
    topicId: 'product-ciphers',
    tags: ['crypto', 'principles'],
    bloom: 'L2',
    difficulty: 2,
    marks: 2,
    timeSec: 45,
    prompt: 'Match Claude Shannon’s twin security principles with their exact function and mechanism:',
    pairs: [
      ['Confusion', 'Makes the relationship between the key and ciphertext as complex and non-linear as possible (via S-boxes)'],
      ['Diffusion', 'Spreads the statistical influence of each individual plaintext symbol across many ciphertext symbols (via P-boxes)'],
      ['Avalanche Effect', 'A single bit change in plaintext or key flips ~50% of output ciphertext bits across cascaded rounds'],
      ['SPN Network', 'Alternating layers of Substitution and Permutation connected in series to form a product cipher']
    ],
    explanation: 'Shannon (1949) defined: Confusion obscures the key (S-boxes); Diffusion dissipates plaintext redundancy across the ciphertext (P-boxes); Cascading them yields the strict avalanche effect.',
    replayStep: 1
  },
  {
    id: 'm1-product-cascade-caesar',
    type: 'mcq',
    module: 'M1',
    topicId: 'product-ciphers',
    tags: ['crypto', 'math'],
    bloom: 'L3',
    difficulty: 2,
    marks: 2,
    timeSec: 40,
    prompt: 'Suppose a designer chains 3 Caesar ciphers in series with keys k1 = 5, k2 = 9, and k3 = 8. What is the effective security of this product cipher?',
    options: [
      'Equivalent to a single Caesar cipher with key K_eff = (5 + 9 + 8) mod 26 = 22',
      'Equivalent to 25³ = 15,625 independent keys',
      'Equivalent to an Affine cipher with a = 5 and b = 17',
      'Unbreakable because it forms a 3-round Feistel network'
    ],
    answerIndex: 0,
    explanation: 'Caesar shifts form an additive abelian group under composition modulo 26. Chaining substitutions without intermediate non-linear mixing or permutations simply adds their shifts: K_eff = (5 + 9 + 8) mod 26 = 22.',
    replayStep: 2
  },

  // ==========================================
  // TOPIC 11: CRYPTANALYSIS OF CLASSICAL CIPHERS
  // ==========================================
  {
    id: 'm1-order-attack-models',
    type: 'order',
    module: 'M1',
    topicId: 'cryptanalysis',
    tags: ['attacks', 'crypto'],
    bloom: 'L3',
    difficulty: 2,
    marks: 2,
    timeSec: 50,
    prompt: 'Order the four standard cryptographic attack models from LEAST adversary capability to GREATEST adversary capability:',
    items: [
      'Ciphertext-Only Attack (COA): Adversary has only intercepted ciphertexts',
      'Known-Plaintext Attack (KPA): Adversary has matching pairs of plaintext and ciphertext',
      'Chosen-Plaintext Attack (CPA): Adversary can choose plaintexts and inspect their ciphertexts',
      'Chosen-Ciphertext Attack (CCA): Adversary can choose ciphertexts and inspect their decrypted plaintexts'
    ],
    correctOrder: [0, 1, 2, 3],
    explanation: 'Standard hierarchy: COA (weakest attacker) < KPA < CPA < CCA (strongest attacker with decryption oracle access).',
    replayStep: 0
  },
  {
    id: 'm1-cryptanalysis-otp-secrecy',
    type: 'mcq',
    module: 'M1',
    topicId: 'cryptanalysis',
    tags: ['crypto', 'principles'],
    bloom: 'L3',
    difficulty: 2,
    marks: 2,
    timeSec: 45,
    prompt: 'Under Claude Shannon’s information theory, why does the One-Time Pad (Vernam cipher) achieve Unconditional (Perfect) Secrecy?',
    options: [
      'Because observing the ciphertext provides zero additional information about the plaintext: P(Plaintext | Ciphertext) = P(Plaintext)',
      'Because modern supercomputers cannot compute SHA-256 hashes of the key',
      'Because it uses an elliptical curve of order 256 bits',
      'Because the key is encrypted using RSA before transmission'
    ],
    answerIndex: 0,
    explanation: 'Perfect secrecy requires P(M|C) = P(M). Given truly random keystream K as long as message M and used only once, any ciphertext could have been produced by every possible plaintext with equal probability.',
    replayStep: 2
  },
  {
    id: 'm1-spot-frequency-attack',
    type: 'spot',
    module: 'M1',
    topicId: 'cryptanalysis',
    tags: ['crypto', 'attacks'],
    bloom: 'L3',
    difficulty: 3,
    marks: 3,
    timeSec: 45,
    prompt: 'Observe the animated cryptanalysis scene. Which attack technique is the analyst using to deduce the plaintext without knowing the key?',
    sceneSnippetId: 'caesar-process-scene',
    options: [
      'Frequency analysis of single letters matching the peak of English "E"',
      'Differential cryptanalysis targeting round permutations',
      'Known-plaintext linear equation solving mod 26',
      'Meet-in-the-middle key collision attack'
    ],
    answerIndex: 0,
    explanation: 'Because Caesar is a monoalphabetic shift, the shape of the letter frequency histogram is merely shifted along the x-axis. Matching the highest peak to English "E" immediately reveals the shift key.',
    replayStep: 2
  },
  {
    id: 'm1-match-ciphers-keys',
    type: 'match',
    module: 'M1',
    topicId: 'cryptanalysis',
    tags: ['crypto'],
    bloom: 'L2',
    difficulty: 2,
    marks: 2,
    timeSec: 45,
    prompt: 'Match each classical cipher with its defining mathematical key structure or keyspace size:',
    pairs: [
      ['Caesar Cipher', '25 effective additive shifts in ℤ₂₆'],
      ['Affine Cipher', '12 valid multipliers × 26 shifts = 312 keys'],
      ['Monoalphabetic', '26! ≈ 4 × 10²⁶ permutation key mappings'],
      ['Hill Cipher', 'n × n invertible matrix modulo 26 with gcd(det, 26) = 1']
    ],
    explanation: 'Caesar has 25 shifts; Affine has φ(26)×26 = 12×26 = 312 keys; general monoalphabetic has 26! permutations; and Hill requires an invertible matrix mod 26.',
    replayStep: 1
  }
]

export function generateAffineVariation(): NumericQuestion {
  const moduli = [26, 27, 28]
  const chosenMod = moduli[Math.floor(Math.random() * moduli.length)]
  let count = 0
  for (let i = 1; i < chosenMod; i++) {
    const gcd = (x: number, y: number): number => (y === 0 ? x : gcd(y, x % y))
    if (gcd(i, chosenMod) === 1) count++
  }
  return {
    id: `m1-num-affine-${chosenMod}`,
    type: 'numeric',
    module: 'M1',
    topicId: 'affine',
    tags: ['crypto', 'math'],
    bloom: 'L3',
    difficulty: 2,
    marks: 3,
    timeSec: 60,
    prompt: `For an Affine cipher over an alphabet of size ${chosenMod}, how many distinct valid values can the multiplicative key "a" take?`,
    given: {
      'Modulus (m)': chosenMod,
      'Condition': `gcd(a, ${chosenMod}) = 1`
    },
    answer: count,
    steps: [
      `1. Valid values must be coprime to ${chosenMod}.`,
      `2. Applying Euler totient φ(${chosenMod}) yields ${count} coprime integers.`
    ],
    explanation: `Only integers coprime to ${chosenMod} have a multiplicative inverse.`
  }
}
