import { notFound } from "next/navigation"
import dynamic from "next/dynamic"

const SyllabusModuleView = dynamic(() => import("@/modules/syllabus/SyllabusModuleView"), {
  loading: () => <p className="p-8 text-center text-ink-soft font-mono">Loading University Syllabus Module...</p>
})

const WPModuleView = dynamic(() => import("@/modules/wp/WPModuleView"), {
  loading: () => <p className="p-8 text-center text-ink-soft font-mono">Loading Web Programming Module...</p>
})

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
    // 6 University Syllabus Modules (CSC602 - CNS)
    { slug: 'classical' },
    { slug: 'block-public-key' },
    { slug: 'hash-signatures' },
    { slug: 'computing-resources' },
    { slug: 'network-security' },
    { slug: 'security-applications' },

    // 6 University Syllabus Modules (ITC504 - Web Programming)
    { slug: 'wp-fundamentals' },
    { slug: 'wp-javascript' },
    { slug: 'wp-react' },
    { slug: 'wp-nodejs' },
    { slug: 'wp-php' },
    { slug: 'wp-fullstack' },
    { slug: 'wp-m1' },
    { slug: 'wp-m2' },
    { slug: 'wp-m3' },
    { slug: 'wp-m4' },
    { slug: 'wp-m5' },
    { slug: 'wp-m6' },

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
    // 6 University Syllabus Modules (CSC602)
    case 'classical':
      return <SyllabusModuleView moduleId="m1" />
    case 'block-public-key':
      return <SyllabusModuleView moduleId="m2" />
    case 'hash-signatures':
      return <SyllabusModuleView moduleId="m3" />
    case 'computing-resources':
      return <SyllabusModuleView moduleId="m4" />
    case 'network-security':
      return <SyllabusModuleView moduleId="m5" />
    case 'security-applications':
      return <SyllabusModuleView moduleId="m6" />

    // 6 Web Programming Modules (ITC504)
    case 'wp-fundamentals':
    case 'wp-m1':
      return <WPModuleView moduleId="wp-m1" />
    case 'wp-javascript':
    case 'wp-m2':
      return <WPModuleView moduleId="wp-m2" />
    case 'wp-react':
    case 'wp-m3':
      return <WPModuleView moduleId="wp-m3" />
    case 'wp-nodejs':
    case 'wp-m4':
      return <WPModuleView moduleId="wp-m4" />
    case 'wp-php':
    case 'wp-m5':
      return <WPModuleView moduleId="wp-m5" />
    case 'wp-fullstack':
    case 'wp-m6':
      return <WPModuleView moduleId="wp-m6" />

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
