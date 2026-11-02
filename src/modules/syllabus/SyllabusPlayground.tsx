"use client"

import React, { useState } from "react"
import { ModuleId } from "@/lib/syllabus"
import CryptoPlayground from "@/modules/crypto/Playground"
import AuthPlayground from "@/modules/auth/Playground"
import AttacksPlayground from "@/modules/attacks/Playground"
import FirewallPlayground from "@/modules/firewall/Playground"
import IDSPlayground from "@/modules/ids/Playground"
import TLSApplicationsPlayground from "@/modules/tls/Playground"
import AISecurityPlayground from "@/modules/ai/Playground"

export default function SyllabusPlayground({ moduleId }: { moduleId: ModuleId }) {
  // Sub-tabs for combined syllabus modules M4, M5, M6
  const [m4Tab, setM4Tab] = useState<'access-passwords' | 'buffer-overflow'>('access-passwords')
  const [m5Tab, setM5Tab] = useState<'firewall-syn' | 'ids-zerotrust'>('firewall-syn')
  const [m6Tab, setM6Tab] = useState<'tls-kerberos-ipsec' | 'pgp-ai-soar'>('tls-kerberos-ipsec')

  if (moduleId === 'm1') {
    return <CryptoPlayground filter="m1" />
  }

  if (moduleId === 'm2') {
    return <CryptoPlayground filter="m2" />
  }

  if (moduleId === 'm3') {
    return <CryptoPlayground filter="m3" />
  }

  if (moduleId === 'm4') {
    return (
      <div className="space-y-6">
        <div className="flex flex-wrap gap-2 border-b border-rule pb-3">
          <button
            onClick={() => setM4Tab('access-passwords')}
            className={`px-3 py-1.5 font-mono text-xs uppercase tracking-wider transition-colors border ${
              m4Tab === 'access-passwords'
                ? 'bg-ink text-paper border-ink font-bold shadow-[2px_2px_0_var(--signal)]'
                : 'bg-card text-ink border-rule hover:border-ink'
            }`}
          >
            Access Control, TOTP & Passwords <span className="opacity-60 text-[10px]">[M4 · Auth]</span>
          </button>
          <button
            onClick={() => setM4Tab('buffer-overflow')}
            className={`px-3 py-1.5 font-mono text-xs uppercase tracking-wider transition-colors border ${
              m4Tab === 'buffer-overflow'
                ? 'bg-ink text-paper border-ink font-bold shadow-[2px_2px_0_var(--signal)]'
                : 'bg-card text-ink border-rule hover:border-ink'
            }`}
          >
            Stack Buffer Overflow & Injections <span className="opacity-60 text-[10px]">[M4 · Memory]</span>
          </button>
        </div>

        {m4Tab === 'access-passwords' ? <AuthPlayground /> : <AttacksPlayground />}
      </div>
    )
  }

  if (moduleId === 'm5') {
    return (
      <div className="space-y-6">
        <div className="flex flex-wrap gap-2 border-b border-rule pb-3">
          <button
            onClick={() => setM5Tab('firewall-syn')}
            className={`px-3 py-1.5 font-mono text-xs uppercase tracking-wider transition-colors border ${
              m5Tab === 'firewall-syn'
                ? 'bg-ink text-paper border-ink font-bold shadow-[2px_2px_0_var(--signal)]'
                : 'bg-card text-ink border-rule hover:border-ink'
            }`}
          >
            Firewalls & TCP SYN Flood <span className="opacity-60 text-[10px]">[M5 · Filtering]</span>
          </button>
          <button
            onClick={() => setM5Tab('ids-zerotrust')}
            className={`px-3 py-1.5 font-mono text-xs uppercase tracking-wider transition-colors border ${
              m5Tab === 'ids-zerotrust'
                ? 'bg-ink text-paper border-ink font-bold shadow-[2px_2px_0_var(--signal)]'
                : 'bg-card text-ink border-rule hover:border-ink'
            }`}
          >
            IDS Snort, DNS Tunneling & Zero Trust <span className="opacity-60 text-[10px]">[M5 · Detection]</span>
          </button>
        </div>

        {m5Tab === 'firewall-syn' ? <FirewallPlayground /> : <IDSPlayground />}
      </div>
    )
  }

  if (moduleId === 'm6') {
    return (
      <div className="space-y-6">
        <div className="flex flex-wrap gap-2 border-b border-rule pb-3">
          <button
            onClick={() => setM6Tab('tls-kerberos-ipsec')}
            className={`px-3 py-1.5 font-mono text-xs uppercase tracking-wider transition-colors border ${
              m6Tab === 'tls-kerberos-ipsec'
                ? 'bg-ink text-paper border-ink font-bold shadow-[2px_2px_0_var(--signal)]'
                : 'bg-card text-ink border-rule hover:border-ink'
            }`}
          >
            TLS 1.3, Kerberos v5 & IPsec <span className="opacity-60 text-[10px]">[M6 · Protocols]</span>
          </button>
          <button
            onClick={() => setM6Tab('pgp-ai-soar')}
            className={`px-3 py-1.5 font-mono text-xs uppercase tracking-wider transition-colors border ${
              m6Tab === 'pgp-ai-soar'
                ? 'bg-ink text-paper border-ink font-bold shadow-[2px_2px_0_var(--signal)]'
                : 'bg-card text-ink border-rule hover:border-ink'
            }`}
          >
            Secure Email (PGP) & AI NetFlow SOAR <span className="opacity-60 text-[10px]">[M6 · Applications]</span>
          </button>
        </div>

        {m6Tab === 'tls-kerberos-ipsec' ? <TLSApplicationsPlayground /> : <AISecurityPlayground />}
      </div>
    )
  }

  return <CryptoPlayground filter="all" />
}

