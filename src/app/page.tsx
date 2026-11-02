"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/Button"
import { Shield, Key, Lock, Network, FileKey2, ArrowRight, Play, Presentation, GraduationCap, Flame, Cpu, Terminal } from "lucide-react"

export interface SyllabusModuleCard {
  id: string
  code: string
  title: string
  hours: string
  bloom: string
  icon: React.ReactNode
  desc: string
  primaryTopic: string
}

const modules: SyllabusModuleCard[] = [
  {
    id: "classical",
    code: "M1",
    title: "Introduction & Classical Cryptography",
    hours: "5 hrs",
    bloom: "Bloom L1-L3",
    icon: <Key className="h-5 w-5" />,
    desc: "OSI security architecture, symmetric model, substitution (Caesar, Affine, Playfair, Vigenère, Hill), transposition, and cryptanalysis.",
    primaryTopic: "caesar"
  },
  {
    id: "block-public-key",
    code: "M2",
    title: "Block Ciphers & Public Key Cryptography",
    hours: "8 hrs",
    bloom: "Bloom L1-L3",
    icon: <Cpu className="h-5 w-5" />,
    desc: "Feistel design, cipher modes (ECB, CBC, CFB, OFB, CTR), DES, AES, Blowfish, RC5, RSA, Rabin, ElGamal, ECC, Diffie-Hellman, and TEA.",
    primaryTopic: "des"
  },
  {
    id: "hash-signatures",
    code: "M3",
    title: "Cryptographic Hashes & Digital Signatures",
    hours: "7 hrs",
    bloom: "Bloom L1-L4",
    icon: <Lock className="h-5 w-5" />,
    desc: "Authentication functions, MACs, HMACs, hash properties, MD5 collision exploits, SHA-1/2/3, RSA/ECC signatures, and X.509 PKI trust chains.",
    primaryTopic: "mac-hmac"
  },
  {
    id: "computing-resources",
    code: "M4",
    title: "Protection of Computing Resources & Security Features",
    hours: "8 hrs",
    bloom: "Bloom L1-L3",
    icon: <Terminal className="h-5 w-5" />,
    desc: "Secure programming, stack buffer overflows, incomplete mediation, malware defenses, access control (DAC/MAC/RBAC), MFA, and password security.",
    primaryTopic: "software-vulnerabilities"
  },
  {
    id: "network-security",
    code: "M5",
    title: "Network Security",
    hours: "10 hrs",
    bloom: "Bloom L1-L4",
    icon: <Network className="h-5 w-5" />,
    desc: "TCP/IP layer vulnerabilities, ARP/IP/DNS spoofing, port scanning, SYN flood, DoS/DDoS mitigation, firewalls, IDS/IPS, honeypots, and Zero Trust.",
    primaryTopic: "layer-vulnerabilities"
  },
  {
    id: "security-applications",
    code: "M6",
    title: "Network Security Applications",
    hours: "7 hrs",
    bloom: "Bloom L1-L4",
    icon: <FileKey2 className="h-5 w-5" />,
    desc: "Kerberos v5 ticketing, SSL/TLS 1.2 vs 1.3 protocol architecture, IPsec (AH & ESP), secure email (PGP & S/MIME), key management, and AI security.",
    primaryTopic: "kerberos"
  }
]

export default function Dashboard() {
  return (
    <div className="min-h-screen flex flex-col bg-paper relative overflow-hidden">
      {/* Abstract Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-20">
        <div className="absolute top-[20%] left-[10%] w-[800px] h-px bg-signal rotate-12 opacity-50"></div>
        <div className="absolute top-[40%] right-[10%] w-[600px] h-px bg-ink rotate-45 opacity-50"></div>
        <div className="absolute -left-20 top-[60%] text-[200px] font-serif text-rule opacity-10">§</div>
      </div>

      <main className="flex-1 container mx-auto px-4 sm:px-6 py-8 sm:py-12 md:py-20 max-w-6xl relative z-10">
        <header className="mb-12 md:mb-20 text-center md:text-left flex flex-col md:flex-row items-center justify-between gap-8 md:gap-12">
          <div className="max-w-2xl w-full">
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-block bg-card border border-ink text-ink font-mono text-[10px] uppercase tracking-widest px-3 py-1 mb-4 sm:mb-6"
            >
              Interactive Learning Environment v2.0
            </motion.div>
            <motion.h1 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl sm:text-5xl md:text-7xl font-serif text-ink tracking-tight mb-4 md:mb-6 leading-tight"
            >
              The Modern <br/>
              <span className="text-signal italic">Security Lab</span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-base sm:text-lg md:text-xl text-ink-soft max-w-lg mb-8 md:mb-10 font-sans leading-relaxed mx-auto md:mx-0"
            >
              A precision instrument for mastering Computer Network Security. Featuring scrollytelling lessons, live simulators, and an interactive team quiz challenge.
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center md:justify-start w-full sm:w-auto"
            >
              <Button size="lg" className="w-full sm:w-auto bg-signal hover:bg-signal/90 text-paper border border-signal font-bold uppercase tracking-wider text-xs sm:text-sm h-12 sm:h-14 px-6 sm:px-8" asChild>
                <Link href="/modules/crypto">
                  Enter Laboratory <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" className="w-full sm:w-auto bg-card hover:bg-rule text-ink border border-ink font-bold uppercase tracking-wider text-xs sm:text-sm h-12 sm:h-14 px-6 sm:px-8" asChild>
                <Link href="/quiz">
                  <Flame className="mr-2 h-4 w-4" /> Live Quiz
                </Link>
              </Button>
            </motion.div>
          </div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="w-full md:w-auto flex flex-col gap-3 sm:gap-4 items-center md:items-start"
          >
            <div className="bg-card border border-ink p-4 sm:p-6 w-full max-w-sm flex items-start gap-4 text-left">
              <div className="bg-signal/10 p-2.5 sm:p-3 text-signal shrink-0">
                <Presentation className="h-5 w-5 sm:h-6 sm:w-6" />
              </div>
              <div>
                <h3 className="font-bold text-xs sm:text-sm uppercase tracking-wider font-mono mb-1 sm:mb-2">Lecturer Ready</h3>
                <p className="text-xs sm:text-sm text-ink-soft">Press Present or [P] in any module to launch the distraction-free Presenter Mode.</p>
              </div>
            </div>
            <div className="bg-paper border border-rule p-4 sm:p-6 w-full max-w-sm flex items-start gap-4 relative left-0 md:-left-8 text-left">
              <div className="bg-ok/10 p-2.5 sm:p-3 text-ok shrink-0">
                <GraduationCap className="h-5 w-5 sm:h-6 sm:w-6" />
              </div>
              <div>
                <h3 className="font-bold text-xs sm:text-sm uppercase tracking-wider font-mono mb-1 sm:mb-2">Exam Focused</h3>
                <p className="text-xs sm:text-sm text-ink-soft">Every concept is broken down into a real-world analogy, visual diagram, and strict exam definition.</p>
              </div>
            </div>
          </motion.div>
        </header>

        <section>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4 mb-6 md:mb-8">
            <div>
              <h2 className="text-xl sm:text-2xl font-serif text-ink font-bold">University Syllabus Modules</h2>
              <p className="text-xs sm:text-sm text-ink-soft font-mono mt-0.5">45 Hours Total · Bloom Taxonomy Levels L1-L4</p>
            </div>
            <div className="hidden sm:block flex-1 h-px bg-rule mx-4"></div>
            <Link href="/revision" className="text-xs sm:text-sm font-mono uppercase tracking-wider text-signal hover:underline">
              Access Revision Hub &rarr;
            </Link>
          </div>
          
          <div className="grid gap-4 sm:gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {modules.map((module, i) => (
              <motion.div
                key={module.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.08 * i }}
              >
                <div className="h-full flex flex-col bg-card border border-ink p-6 shadow-[4px_4px_0_var(--rule)] hover:shadow-[6px_6px_0_var(--signal)] hover:border-signal transition-all">
                  {/* Top Bar: Icon + Code + Badges */}
                  <div className="mb-4 flex justify-between items-start">
                    <div className="p-2 border border-ink bg-paper text-signal">{module.icon}</div>
                    <div className="flex items-center gap-1.5 font-mono text-[10px]">
                      <span className="px-1.5 py-0.5 border border-rule bg-paper text-ink-soft font-bold">
                        {module.hours}
                      </span>
                      <span className="px-1.5 py-0.5 border border-signal/30 bg-signal/10 text-signal font-bold">
                        {module.bloom}
                      </span>
                      <span className="px-1.5 py-0.5 border border-ink bg-ink text-paper font-bold">
                        {module.code}
                      </span>
                    </div>
                  </div>

                  <h3 className="font-bold text-xl mb-2 font-serif text-ink">{module.title}</h3>
                  <p className="text-xs text-ink-soft leading-relaxed flex-1 mb-6 font-sans">{module.desc}</p>

                  <div className="pt-4 border-t border-rule flex items-center justify-between gap-2 text-xs font-mono uppercase tracking-wider">
                    <Link
                      href={`/modules/${module.id}`}
                      className="px-3 py-1.5 bg-ink hover:bg-signal text-paper transition-colors font-bold flex items-center gap-1.5"
                    >
                      <span>Explore</span>
                      <ArrowRight className="h-3 w-3" />
                    </Link>

                    <Link
                      href={`/present/${module.code.toLowerCase()}/${module.primaryTopic}`}
                      className="px-2.5 py-1.5 border border-rule hover:border-ink bg-paper text-ink transition-colors flex items-center gap-1.5 text-[11px]"
                    >
                      <Presentation className="h-3 w-3 text-signal" />
                      <span>[P] Slides</span>
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}
