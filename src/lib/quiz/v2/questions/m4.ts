import { Question, NumericQuestion, MultiQuestion, MatchQuestion, TfWhyQuestion } from "../types"

export const m4Questions: Question[] = [
  // ==========================================
  // TOPIC 1: SOFTWARE VULNERABILITIES & BUFFER OVERFLOW
  // ==========================================
  {
    id: 'm4-mcq-stack-direction',
    type: 'mcq',
    module: 'M4',
    topicId: 'software-vulnerabilities',
    tags: ['attacks'],
    bloom: 'L2',
    difficulty: 1,
    marks: 1,
    timeSec: 30,
    prompt: 'In standard x86/x64 process memory, which direction does the call stack grow and in which direction are local buffers written?',
    options: [
      'The stack grows downward toward lower memory addresses; buffer writes proceed upward toward higher memory addresses',
      'The stack grows upward toward higher memory; buffer writes proceed downward toward lower memory',
      'Both the stack and buffer writes proceed downward toward lower memory addresses',
      'Both the stack and buffer writes proceed upward toward higher memory addresses'
    ],
    answerIndex: 0,
    explanation: 'The call stack grows downward (from high memory to low memory). However, string operations like strcpy() write upward (from low memory to high memory). This directional conflict allows overflow data to write past the buffer end and corrupt the Saved Frame Pointer (EBP) and Return Address (EIP).'
  },
  {
    id: 'm4-multi-overflow-defenses',
    type: 'multi',
    module: 'M4',
    topicId: 'software-vulnerabilities',
    tags: ['attacks'],
    bloom: 'L2',
    difficulty: 2,
    marks: 2,
    timeSec: 40,
    prompt: 'Which mechanisms are standard compile-time and runtime defenses against buffer overflow exploits? (Select all that apply)',
    options: [
      'Stack Canaries (StackGuard) placed before the saved frame pointer',
      'Data Execution Prevention (DEP / NX bit) marking stack memory as non-executable',
      'Address Space Layout Randomization (ASLR) randomizing stack and library base addresses',
      'Disabling CPU arithmetic logic units during function calls'
    ],
    answerIndexes: [0, 1, 2],
    explanation: 'Stack Canaries detect stack corruption before return; DEP/NX prevents execution of shellcode placed on the stack; ASLR randomizes memory addresses so hardcoded pointer jumps fail.'
  } as MultiQuestion,
  {
    id: 'm4-order-stack-layout',
    type: 'order',
    module: 'M4',
    topicId: 'software-vulnerabilities',
    tags: ['attacks'],
    bloom: 'L3',
    difficulty: 2,
    marks: 2,
    timeSec: 45,
    prompt: 'Arrange the elements of an x86 stack frame in order from HIGHEST memory address down to LOWEST memory address:',
    items: [
      'Function Arguments (pushed by caller)',
      'Saved Return Address (EIP / RIP pushed by CALL instruction)',
      'Saved Frame Pointer (EBP / RBP)',
      'Stack Canary (StackGuard value)',
      'Local Variable Buffers (e.g. char buffer[64])'
    ],
    correctOrder: [0, 1, 2, 3, 4],
    explanation: 'Stack memory layout from High to Low addresses: Caller Arguments -> Return Address (EIP) -> Saved EBP -> Canary -> Local Buffer. The stack pointer ESP points to the lowest address.'
  },
  {
    id: 'm4-tfwhy-incomplete-mediation',
    type: 'tf-why',
    module: 'M4',
    topicId: 'software-vulnerabilities',
    tags: ['attacks'],
    bloom: 'L2',
    difficulty: 2,
    marks: 2,
    timeSec: 40,
    prompt: 'Evaluate whether client-side JavaScript validation is sufficient to prevent input tampering vulnerabilities:',
    statement: 'Validating form input strictly in client-side HTML5 or JavaScript guarantees data integrity.',
    isTrue: false,
    whyOptions: [
      'Because attackers can bypass client-side code entirely by modifying HTTP requests directly via proxy tools like Burp Suite or curl',
      'Because JavaScript does not support regular expression checking',
      'Because client-side validation only works on Windows operating systems',
      'Because HTML5 forms automatically encrypt data with DES'
    ],
    whyIndex: 0,
    explanation: 'Client-side validation is solely for user convenience. An adversary can easily bypass browser validation by submitting raw HTTP requests directly via curl, Python, or interception proxies. All input must be independently validated on the server (complete mediation).'
  } as TfWhyQuestion,

  // ==========================================
  // TOPIC 2: MALWARE & MALICIOUS CODE
  // ==========================================
  {
    id: 'm4-mcq-worm-vs-virus',
    type: 'mcq',
    module: 'M4',
    topicId: 'malware',
    tags: ['attacks'],
    bloom: 'L2',
    difficulty: 1,
    marks: 1,
    timeSec: 30,
    prompt: 'What is the primary architectural difference between a computer virus and a network worm?',
    options: [
      'A virus requires a host executable and human execution to spread; a worm is a standalone program that propagates autonomously across networks',
      'A virus only infects Linux; a worm only infects Windows',
      'A virus uses symmetric encryption; a worm uses public key encryption',
      'A virus is hardware-based; a worm is software-based'
    ],
    answerIndex: 0,
    explanation: 'A virus attaches itself to an existing host file and requires human action (running the infected program) to spread. A worm is an autonomous standalone process that replicates across network connections without requiring a host file or human intervention.'
  },
  {
    id: 'm4-match-malware-types',
    type: 'match',
    module: 'M4',
    topicId: 'malware',
    tags: ['attacks'],
    bloom: 'L2',
    difficulty: 2,
    marks: 3,
    timeSec: 50,
    prompt: 'Match each malware category to its defining technical characteristic:',
    pairs: [
      ['Trojan Horse', 'Disguised as benign or useful utility while maintaining a concealed backdoor'],
      ['Rootkit', 'Subverts operating system integrity by hooking system calls (SSDT) or modifying kernel data structures (DKOM) to hide artifacts'],
      ['Ransomware', 'Hybrid cryptosystem encrypting user data with symmetric ciphers and locking keys with attacker public keys']
    ],
    explanation: 'Trojans deceive via benign disguise. Rootkits manipulate OS kernel tables to hide processes and sockets. Ransomware holds user documents hostage via hybrid encryption.'
  } as MatchQuestion,
  {
    id: 'm4-mcq-metamorphic-code',
    type: 'mcq',
    module: 'M4',
    topicId: 'malware',
    tags: ['attacks'],
    bloom: 'L3',
    difficulty: 2,
    marks: 1,
    timeSec: 35,
    prompt: 'Why are metamorphic viruses significantly more difficult for signature-based antivirus scanners to detect than simple polymorphic viruses?',
    options: [
      'Metamorphic viruses rewrite their entire instruction body (reordering instructions, swapping registers, inserting equivalent opcodes) so no constant byte signature exists',
      'Metamorphic viruses delete the operating system before the antivirus can scan',
      'Metamorphic viruses only run inside CPU caches without touching RAM',
      'Metamorphic viruses use 4096-bit RSA keys on each execution'
    ],
    answerIndex: 0,
    explanation: 'Polymorphic viruses keep a constant encrypted body and only mutate a small decryptor routine. Metamorphic viruses completely recompile and rewrite their entire code base on every generation, altering instruction sequences and register usage so static byte signatures completely fail.'
  },

  // ==========================================
  // TOPIC 3: CONTROL MECHANISMS & RESOURCE PROTECTION
  // ==========================================
  {
    id: 'm4-mcq-bell-lapadula-star',
    type: 'mcq',
    module: 'M4',
    topicId: 'access-control',
    tags: ['auth'],
    bloom: 'L3',
    difficulty: 2,
    marks: 1,
    timeSec: 35,
    prompt: 'Under the Bell-LaPadula Confidentiality Model, what does the *-Property (Star-Property) state, and what attack does it prevent?',
    options: [
      'No Write Down (NWD): Subject cannot write to objects with lower classification, preventing high-clearance trojans from leaking secret data into public files',
      'No Read Up (NRU): Subject cannot read objects with higher classification, preventing unauthorized data access',
      'No Read Down (NRD): Subject cannot read objects with lower classification, preventing data contamination',
      'No Write Up (NWU): Subject cannot write to higher classification objects, preventing file modifications'
    ],
    answerIndex: 0,
    explanation: 'The *-Property (No Write Down) enforces: Subject at level L_S can write to Object at level L_O iff L_S <= L_O. This prevents a high-clearance process (or an embedded trojan horse) from copying Top Secret information down into an Unclassified document.'
  },
  {
    id: 'm4-match-biba-vs-blp',
    type: 'match',
    module: 'M4',
    topicId: 'access-control',
    tags: ['auth'],
    bloom: 'L3',
    difficulty: 2,
    marks: 3,
    timeSec: 45,
    prompt: 'Match each access control axiom to its corresponding model and purpose:',
    pairs: [
      ['Simple Security Property (Bell-LaPadula)', 'No Read Up (NRU): Preserves confidentiality by preventing unauthorized disclosure'],
      ['Simple Integrity Property (Biba)', 'No Read Down (NRD): Preserves integrity by preventing contamination from low-integrity dirty data'],
      ['*-Integrity Property (Biba)', 'No Write Up (NWU): Preserves integrity by preventing low-integrity subjects from modifying high-integrity objects']
    ],
    explanation: 'Bell-LaPadula enforces confidentiality (NRU, NWD). Biba enforces integrity (NRD, NWU).'
  } as MatchQuestion,
  {
    id: 'm4-multi-reference-monitor',
    type: 'multi',
    module: 'M4',
    topicId: 'access-control',
    tags: ['auth'],
    bloom: 'L2',
    difficulty: 2,
    marks: 2,
    timeSec: 40,
    prompt: 'What are the three mandatory requirements of a Reference Monitor in trusted computing systems? (Select all that apply)',
    options: [
      'Complete Mediation (Every access attempt must be mediated; zero bypasses)',
      'Tamper Resistance (The reference monitor code and data structures are immune to alteration)',
      'Verifiability (The security kernel must be compact enough to be mathematically evaluated and proven)',
      'Quantum Encryption (Must use optical photon channels)'
    ],
    answerIndexes: [0, 1, 2],
    explanation: 'According to the Anderson 1972 report, a Reference Monitor must be: 1. Completely mediated, 2. Tamper-resistant, and 3. Verifiable (simple enough to prove correct).'
  } as MultiQuestion,

  // ==========================================
  // TOPIC 4: USER AUTHENTICATION & MULTI-FACTOR AUTH
  // ==========================================
  {
    id: 'm4-numeric-biometric-cer',
    type: 'numeric',
    module: 'M4',
    topicId: 'auth-methods',
    tags: ['auth'],
    bloom: 'L2',
    difficulty: 2,
    marks: 2,
    timeSec: 35,
    prompt: 'A biometric fingerprint scanner operating at sensitivity threshold T exhibits a False Acceptance Rate (FAR) of 2.4% and a False Rejection Rate (FRR) of 2.4%. What is the Crossover Error Rate (CER) percentage?',
    given: {
      'False Acceptance Rate (FAR)': '2.4%',
      'False Rejection Rate (FRR)': '2.4%',
      'Operating Point': 'FAR == FRR'
    },
    answer: 2.4,
    tolerance: 0.1,
    steps: [
      '1. By definition, Crossover Error Rate (CER) occurs where FAR equals FRR.',
      '2. Given FAR = 2.4% and FRR = 2.4%, they are equal at this threshold.',
      '3. Therefore, CER = 2.4%.'
    ],
    explanation: 'The Crossover Error Rate (CER), also known as the Equal Error Rate (EER), is precisely the error rate at the threshold where False Acceptance Rate equals False Rejection Rate.'
  } as NumericQuestion,
  {
    id: 'm4-mcq-fido2-phishing',
    type: 'mcq',
    module: 'M4',
    topicId: 'auth-methods',
    tags: ['auth'],
    bloom: 'L3',
    difficulty: 2,
    marks: 1,
    timeSec: 35,
    prompt: 'How does FIDO2 / WebAuthn provide mathematical phishing resistance against adversary-in-the-middle reverse proxies (e.g. Evilginx)?',
    options: [
      'The browser cryptographically binds the authenticator signature to the authentic origin domain (clientDataHash), which fails when submitted to a phishing domain',
      'The authenticator disables network packets if a proxy is detected on the local subnet',
      'The server sends SMS verification codes directly to the hardware key',
      'The user password is encrypted with 512-bit Blowfish'
    ],
    answerIndex: 0,
    explanation: 'In WebAuthn, the browser constructs clientDataJSON containing the exact origin in the address bar (e.g. https://cns-lab.edu). If an attacker lures a victim to https://evil-phish.com, the hardware key signs "evil-phish.com", which the real server immediately detects as an origin mismatch and rejects.'
  },
  {
    id: 'm4-order-totp-steps',
    type: 'order',
    module: 'M4',
    topicId: 'auth-methods',
    tags: ['auth'],
    bloom: 'L3',
    difficulty: 2,
    marks: 2,
    timeSec: 45,
    prompt: 'Order the sequential mathematical steps executed by an authenticator app to compute an RFC 6238 TOTP code:',
    items: [
      'Read current Unix epoch time in seconds and calculate time counter T = floor(CurrentTime / 30)',
      'Compute 20-byte HMAC-SHA1 digest of 8-byte big-endian counter T using shared secret K',
      'Extract offset from lowest 4 bits of the 20th digest byte to select a 4-byte slice',
      'Mask out the most significant bit to produce a 31-bit positive integer P',
      'Compute P mod 1,000,000 to produce a 6-digit decimal code'
    ],
    correctOrder: [0, 1, 2, 3, 4],
    explanation: 'RFC 6238 TOTP derivation: 1. Counter calculation T, 2. HMAC-SHA1 computation, 3. Dynamic truncation offset extraction, 4. 31-bit integer masking, 5. Modulo 10^6 to get 6-digit code.'
  },

  // ==========================================
  // TOPIC 5: PASSWORD ATTACKS & SELECTION CRITERIA
  // ==========================================
  {
    id: 'm4-mcq-nist-guidelines',
    type: 'mcq',
    module: 'M4',
    topicId: 'password-security',
    tags: ['auth'],
    bloom: 'L2',
    difficulty: 2,
    marks: 1,
    timeSec: 35,
    prompt: 'Under current NIST SP 800-63B guidelines, which traditional password rule is now officially DISFAVORED and discouraged?',
    options: [
      'Mandatory periodic password changes (e.g. forcing users to reset passwords every 90 days)',
      'Checking passwords against lists of breached credentials (HaveIBeenPwned)',
      'Allowing passphrases of up to 64 characters',
      'Storing passwords using slow memory-hard key stretching algorithms'
    ],
    answerIndex: 0,
    explanation: 'NIST SP 800-63B Section 5.1.1.2 explicitly discourages mandatory periodic expiration (e.g. 90-day resets). Empirical studies proved this causes users to choose predictable patterns (Password123! -> Password124!) rather than strong, memorable passphrases.'
  },
  {
    id: 'm4-numeric-password-entropy',
    type: 'numeric',
    module: 'M4',
    topicId: 'password-security',
    tags: ['auth'],
    bloom: 'L3',
    difficulty: 2,
    marks: 2,
    timeSec: 40,
    prompt: 'Calculate the information entropy E (in bits) of an 8-character password chosen randomly from the lowercase English alphabet (26 characters). Enter the value rounded to 1 decimal place (use log2(26) ≈ 4.7004).',
    given: {
      'Password Length (L)': 8,
      'Character Pool (R)': 26,
      'Formula': 'E = L * log2(R)'
    },
    answer: 37.6,
    tolerance: 0.2,
    steps: [
      '1. Apply entropy formula: E = L * log2(R)',
      '2. Substitute L = 8 and R = 26: E = 8 * log2(26)',
      '3. Since log2(26) ≈ 4.70044: E = 8 * 4.70044 = 37.6035 bits',
      '4. Round to 1 decimal place: 37.6 bits.'
    ],
    explanation: 'Entropy is L * log2(R) = 8 * log2(26) ≈ 37.6 bits. A password with only 37.6 bits of entropy is vulnerable to offline GPU brute-force in less than one second.'
  } as NumericQuestion,
  {
    id: 'm4-tfwhy-salt-rainbow',
    type: 'tf-why',
    module: 'M4',
    topicId: 'password-security',
    tags: ['auth'],
    bloom: 'L3',
    difficulty: 2,
    marks: 2,
    timeSec: 45,
    prompt: 'Evaluate why adding a cryptographic salt to passwords neutralizes precomputed rainbow table attacks:',
    statement: 'A unique random salt per user prevents adversaries from using precomputed rainbow tables.',
    isTrue: true,
    whyOptions: [
      'Because H(Salt || Password) creates a unique hash space for every user, requiring the attacker to regenerate a multi-gigabyte rainbow table from scratch for every single user account',
      'Because the salt encrypts the password database with AES-256',
      'Because the salt truncates the hash to 8 bytes, causing collisions',
      'Because rainbow tables can only crack passwords that contain numbers'
    ],
    whyIndex: 0,
    explanation: 'Rainbow tables rely on precomputing hash chains for common passwords. A 16-byte random salt creates 2^128 distinct hash spaces. An attacker cannot use a single precomputed table across multiple accounts; they would have to generate an entire new rainbow table for each user, making precomputation economically infeasible.'
  } as TfWhyQuestion,
  {
    id: 'm4-mcq-incomplete-mediation',
    type: 'mcq',
    module: 'M4',
    topicId: 'software-vulnerabilities',
    tags: ['attacks'],
    bloom: 'L2',
    difficulty: 2,
    marks: 1,
    timeSec: 30,
    prompt: 'In secure software engineering, what is an "incomplete mediation" vulnerability?',
    options: [
      'Failing to validate user input on the server side because client-side JavaScript checks were assumed to be infallible, allowing manipulated parameters to reach critical business logic',
      'Using a 32-bit integer counter instead of a 64-bit counter in database tables',
      'Forgetting to install antivirus software on web proxy gateways',
      'Encrypting data using symmetric keys rather than asymmetric public certificates'
    ],
    answerIndex: 0,
    explanation: 'Incomplete mediation occurs when input verification is incomplete or bypassed—such as validating an order price in client HTML/JS, but failing to verify the price on the server when the HTTP POST arrives.'
  },
  {
    id: 'm4-match-access-control-models',
    type: 'match',
    module: 'M4',
    topicId: 'access-control',
    tags: ['auth'],
    bloom: 'L2',
    difficulty: 2,
    marks: 2,
    timeSec: 40,
    prompt: 'Match each access control paradigm with its defining policy mechanism:',
    pairs: [
      ['DAC (Discretionary Access Control)', 'Resource owner sets permissions (read/write/execute) at their own discretion'],
      ['MAC (Mandatory Access Control)', 'Central security authority assigns fixed security labels (e.g. Secret, Top Secret); users cannot alter permissions'],
      ['RBAC (Role-Based Access Control)', 'Permissions are assigned to roles (e.g. Auditor, Doctor); users inherit permissions via assigned roles'],
      ['ABAC (Attribute-Based Access Control)', 'Dynamic evaluation based on user, resource, action, and environmental context attributes']
    ],
    explanation: 'DAC is owner-controlled; MAC is mandatory label-based (Bell-LaPadula); RBAC simplifies enterprise administration via roles; ABAC dynamically evaluates attributes.'
  } as MatchQuestion,
  {
    id: 'm4-mcq-stack-canary-operation',
    type: 'mcq',
    module: 'M4',
    topicId: 'software-vulnerabilities',
    tags: ['attacks'],
    bloom: 'L3',
    difficulty: 2,
    marks: 1,
    timeSec: 30,
    prompt: 'How does a compiler-generated Stack Canary (e.g., -fstack-protector) prevent buffer overflow exploitation?',
    options: [
      'It places a secret random word between local buffer variables and the saved return address; before returning, the function checks if the canary has been modified and aborts if corrupted',
      'It encrypts all local variables with AES-128 before writing them to the stack',
      'It moves the return address to a remote cloud server via TLS',
      'It automatically doubles the buffer size whenever memory fills up'
    ],
    answerIndex: 0,
    explanation: 'Stack canaries insert a random value directly before the saved frame pointer and return address. If an attacker overflows a local array, the canary value is overwritten first; the function epilogue detects this change (__stack_chk_fail) and terminates the program immediately.'
  },
  {
    id: 'm4-mcq-dep-nx-bit',
    type: 'mcq',
    module: 'M4',
    topicId: 'software-vulnerabilities',
    tags: ['attacks'],
    bloom: 'L2',
    difficulty: 1,
    marks: 1,
    timeSec: 30,
    prompt: 'What hardware/OS defense mechanism prevents injected shellcode on the stack or heap from executing?',
    options: [
      'Data Execution Prevention (DEP) / NX (No-Execute) bit',
      'Address Space Layout Randomization (ASLR)',
      'Hardware TPM Secure Boot',
      'DNSSEC cryptoprocessor'
    ],
    answerIndex: 0,
    explanation: 'The NX bit (or W^X: Write XOR Execute) marks memory pages (such as stack and heap) as non-executable. If instruction execution is attempted from data pages, the CPU generates an immediate memory access violation.'
  },
  {
    id: 'm4-mcq-fido2-webauthn',
    type: 'mcq',
    module: 'M4',
    topicId: 'auth-methods',
    tags: ['auth'],
    bloom: 'L2',
    difficulty: 2,
    marks: 1,
    timeSec: 30,
    prompt: 'Why is FIDO2 / WebAuthn passwordless authentication inherently immune to traditional credential phishing attacks?',
    options: [
      'The authenticator signs an authentication challenge bound to the cryptographically verified origin domain (RP ID); credentials cannot be tricked into signing for a fake phishing domain',
      'Users are required to enter 32-character hexadecimal master keys by memory',
      'WebAuthn operates strictly over private leased fiber optic cables',
      'All biometric templates are stored in a centralized public government database'
    ],
    answerIndex: 0,
    explanation: 'WebAuthn uses public-key cryptography where the browser cryptographically verifies the origin (RP ID). The authenticator will only produce a signature for the exact domain registered in the credential, completely defeating lookalike phishing sites.'
  },
  {
    id: 'm4-match-mfa-factors',
    type: 'match',
    module: 'M4',
    topicId: 'auth-methods',
    tags: ['auth'],
    bloom: 'L1',
    difficulty: 1,
    marks: 2,
    timeSec: 30,
    prompt: 'Match each standard authentication factor category with its real-world implementation:',
    pairs: [
      ['Something You Know', 'Password, PIN, or passphrase'],
      ['Something You Have', 'Hardware YubiKey, smartphone authenticator app, or smart card'],
      ['Something You Are', 'Fingerprint scan, facial recognition, or iris biometric template'],
      ['Somewhere You Are', 'GPS geolocation or authorized corporate IP subnet binding']
    ],
    explanation: 'MFA requires two or more distinct categories: Knowledge (know), Possession (have), Inherence (are), or Context (location/time).'
  } as MatchQuestion,
  {
    id: 'm4-mcq-virus-vs-worm',
    type: 'mcq',
    module: 'M4',
    topicId: 'malware',
    tags: ['attacks'],
    bloom: 'L2',
    difficulty: 1,
    marks: 1,
    timeSec: 30,
    prompt: 'What is the key technical distinction between a computer virus and a computer worm?',
    options: [
      'A virus requires human interaction and attachment to a host executable file to replicate, whereas a worm is a standalone program that self-propagates across networks autonomously',
      'A virus attacks hardware chips, while a worm only modifies software configuration files',
      'Worms are written exclusively in assembly language, while viruses are written in Python',
      'Viruses are always classified as benign software'
    ],
    answerIndex: 0,
    explanation: 'Viruses attach their code to legitimate executable host programs and require execution by a user. Worms are standalone, self-replicating programs that exploit network vulnerabilities to propagate automatically across systems without human intervention.'
  },
  {
    id: 'm4-mcq-key-stretching-argon2',
    type: 'mcq',
    module: 'M4',
    topicId: 'password-security',
    tags: ['auth'],
    bloom: 'L3',
    difficulty: 2,
    marks: 1,
    timeSec: 30,
    prompt: 'Why are memory-hard password hashing algorithms like Argon2id and scrypt far more resistant to custom GPU/ASIC cracking arrays than fast hashes like MD5 or SHA-256?',
    options: [
      'They require large amounts of RAM (e.g. 64 MB per hash evaluation), severely limiting the number of parallel cracking threads a memory-constrained GPU or ASIC chip can execute simultaneously',
      'They encrypt password strings with 4096-bit RSA keys',
      'They prevent users from selecting passwords shorter than 20 characters',
      'They contact an external cloud authentication server for every single hash iteration'
    ],
    answerIndex: 0,
    explanation: 'Standard hashes (SHA-256) require minimal memory, enabling GPUs and ASICs to test billions of candidates per second. Memory-hard algorithms (Argon2id, scrypt) force large memory usage per thread, causing massive memory bottlenecks that equalize the playing field against specialized hardware.'
  },
  {
    id: 'm4-numeric-brute-force-time',
    type: 'numeric',
    module: 'M4',
    topicId: 'password-security',
    tags: ['auth', 'math'],
    bloom: 'L3',
    difficulty: 2,
    marks: 2,
    timeSec: 45,
    prompt: 'An online web login form enforces rate limiting of 5 login attempts per second. A 4-digit numeric PIN has 10^4 = 10,000 possible combinations. In the worst case, how many seconds will an online brute-force attack take to test all combinations?',
    given: {
      'Total combinations': '10,000 (10^4)',
      'Rate limit': '5 attempts / second'
    },
    answer: 2000,
    unit: 'seconds',
    steps: [
      'Worst-case attempts = 10,000 attempts',
      'Rate = 5 attempts / sec',
      'Time = 10,000 / 5 = 2,000 seconds (≈ 33.3 minutes)'
    ],
    explanation: '10,000 total combinations / 5 attempts per second = 2,000 seconds (approximately 33.3 minutes).'
  } as NumericQuestion
]
