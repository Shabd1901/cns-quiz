import { notFound } from "next/navigation"
import dynamic from "next/dynamic"

const CryptoModule = dynamic(() => import("@/modules/crypto"), {
  loading: () => <p className="p-8 text-center text-muted-foreground">Loading Cryptography Module...</p>
})

const AuthModule = dynamic(() => import("@/modules/auth"), {
  loading: () => <p className="p-8 text-center text-muted-foreground">Loading Authentication Module...</p>
})

const FirewallModule = dynamic(() => import("@/modules/firewall"), {
  loading: () => <p className="p-8 text-center text-muted-foreground">Loading Firewall Module...</p>
})

const CloudModule = dynamic(() => import("@/modules/cloud"), {
  loading: () => <p className="p-8 text-center text-muted-foreground">Loading Cloud Module...</p>
})

const AttacksModule = dynamic(() => import("@/modules/attacks"), {
  loading: () => <p className="p-8 text-center text-muted-foreground">Loading Attacks Module...</p>
})

const IDSModule = dynamic(() => import("@/modules/ids"), {
  loading: () => <p className="p-8 text-center text-muted-foreground">Loading IDS Module...</p>
})

const TLSModule = dynamic(() => import("@/modules/tls"), {
  loading: () => <p className="p-8 text-center text-muted-foreground">Loading TLS Module...</p>
})

const AIModule = dynamic(() => import("@/modules/ai"), {
  loading: () => <p className="p-8 text-center text-muted-foreground">Loading AI Security Module...</p>
})

export function generateStaticParams() {
  return [
    // 6 University Syllabus Modules
    { slug: 'classical' },
    { slug: 'block-public-key' },
    { slug: 'hash-signatures' },
    { slug: 'computing-resources' },
    { slug: 'network-security' },
    { slug: 'security-applications' },

    // Legacy Routes (Backwards Compatibility with Zero Dead Links)
    { slug: 'crypto' },
    { slug: 'auth' },
    { slug: 'attacks' },
    { slug: 'firewall' },
    { slug: 'ids' },
    { slug: 'tls' },
    { slug: 'ai' },
    { slug: 'cloud' },
  ]
}

export const instant = false

export default async function ModulePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  
  switch (slug) {
    // 6 Syllabus Modules
    case 'classical': return <CryptoModule />
    case 'block-public-key': return <CryptoModule />
    case 'hash-signatures': return <CryptoModule />
    case 'computing-resources': return <AuthModule />
    case 'network-security': return <FirewallModule />
    case 'security-applications': return <TLSModule />

    // Legacy Route Fallbacks
    case 'crypto': return <CryptoModule />
    case 'auth': return <AuthModule />
    case 'firewall': return <FirewallModule />
    case 'cloud': return <CloudModule />
    case 'attacks': return <AttacksModule />
    case 'ids': return <IDSModule />
    case 'tls': return <TLSModule />
    case 'ai': return <AIModule />
    default:
      notFound()
  }
}
