import { TopicPresentation } from "@/lib/present/types"
import { principlesPresentation } from "./m1/principles"
import { osiArchitecturePresentation } from "./m1/osiArchitecture"
import { symmetricModelPresentation } from "./m1/symmetricModel"
import { caesarPresentation } from "./m1/caesar"
import { affinePresentation } from "./m1/affine"
import { playfairPresentation } from "./m1/playfair"
import { vigenerePresentation } from "./m1/vigenere"
import { hillPresentation } from "./m1/hill"
import { transpositionPresentation } from "./m1/transposition"
import { productCiphersPresentation } from "./m1/productCiphers"
import { cryptanalysisPresentation } from "./m1/cryptanalysis"

import { blockPrinciplesPresentation } from "./m2/blockPrinciples"
import { feistelPresentation } from "./m2/feistel"
import { modesPresentation } from "./m2/modes"
import { desPresentation } from "./m2/des"
import { aesPresentation } from "./m2/aes"
import { blowfishPresentation } from "./m2/blowfish"
import { rc5Presentation } from "./m2/rc5"
import { publicKeyPrinciplesPresentation } from "./m2/publicKeyPrinciples"
import { rsaPresentation } from "./m2/rsa"
import { rabinPresentation } from "./m2/rabin"
import { elgamalPresentation } from "./m2/elgamal"
import { eccPresentation } from "./m2/ecc"
import { diffieHellmanPresentation } from "./m2/diffieHellman"
import { lightweightTeaPresentation } from "./m2/lightweightTea"

import { authRequirementsPresentation } from "./m3/authRequirements"
import { macHmacPresentation } from "./m3/macHmac"
import { hashPropertiesPresentation } from "./m3/hashProperties"
import { md5ShaPresentation } from "./m3/md5Sha"
import { digitalSignaturesPresentation } from "./m3/digitalSignatures"
import { pkiCertificatesPresentation } from "./m3/pkiCertificates"

import { softwareVulnerabilitiesPresentation } from "./m4/softwareVulnerabilities"
import { malwarePresentation } from "./m4/malware"
import { accessControlPresentation } from "./m4/accessControl"
import { authMethodsPresentation } from "./m4/authMethods"
import { passwordSecurityPresentation } from "./m4/passwordSecurity"

import { layerVulnerabilitiesPresentation } from "./m5/layerVulnerabilities"
import { arpSniffingPresentation } from "./m5/arpSniffing"
import { scanningSpoofingPresentation } from "./m5/scanningSpoofing"
import { dosDdosPresentation } from "./m5/dosDdos"
import { dnsSecurityPresentation } from "./m5/dnsSecurity"
import { firewallsPresentation } from "./m5/firewalls"
import { idsHoneypotsPresentation } from "./m5/idsHoneypots"

const presentations: Record<string, TopicPresentation> = {
  // Module 1
  'm1/principles': principlesPresentation,
  'm1/osi-architecture': osiArchitecturePresentation,
  'm1/symmetric-model': symmetricModelPresentation,
  'm1/caesar': caesarPresentation,
  'm1/affine': affinePresentation,
  'm1/playfair': playfairPresentation,
  'm1/vigenere': vigenerePresentation,
  'm1/hill': hillPresentation,
  'm1/transposition': transpositionPresentation,
  'm1/product-ciphers': productCiphersPresentation,
  'm1/cryptanalysis': cryptanalysisPresentation,

  // Module 2
  'm2/block-principles': blockPrinciplesPresentation,
  'm2/feistel': feistelPresentation,
  'm2/modes': modesPresentation,
  'm2/des': desPresentation,
  'm2/aes': aesPresentation,
  'm2/blowfish': blowfishPresentation,
  'm2/rc5': rc5Presentation,
  'm2/public-key-principles': publicKeyPrinciplesPresentation,
  'm2/rsa': rsaPresentation,
  'm2/rabin': rabinPresentation,
  'm2/elgamal': elgamalPresentation,
  'm2/ecc': eccPresentation,
  'm2/diffie-hellman': diffieHellmanPresentation,
  'm2/lightweight-tea': lightweightTeaPresentation,

  // Module 3
  'm3/auth-requirements': authRequirementsPresentation,
  'm3/mac-hmac': macHmacPresentation,
  'm3/hash-functions': hashPropertiesPresentation,
  'm3/md5-sha': md5ShaPresentation,
  'm3/digital-signatures': digitalSignaturesPresentation,
  'm3/pki-certificates': pkiCertificatesPresentation,

  // Module 4
  'm4/software-vulnerabilities': softwareVulnerabilitiesPresentation,
  'm4/malware': malwarePresentation,
  'm4/access-control': accessControlPresentation,
  'm4/auth-methods': authMethodsPresentation,
  'm4/password-security': passwordSecurityPresentation,

  // Module 5
  'm5/layer-vulnerabilities': layerVulnerabilitiesPresentation,
  'm5/arp-sniffing': arpSniffingPresentation,
  'm5/scanning-spoofing': scanningSpoofingPresentation,
  'm5/dos-ddos': dosDdosPresentation,
  'm5/dns-security': dnsSecurityPresentation,
  'm5/firewalls': firewallsPresentation,
  'm5/ids-honeypots': idsHoneypotsPresentation
}

export function getPresentation(moduleId: string, topicId: string): TopicPresentation | undefined {
  const key = `${moduleId.toLowerCase()}/${topicId.toLowerCase()}`
  if (presentations[key]) return presentations[key]

  // Fallback placeholder presentation for topics under construction
  return {
    moduleId,
    moduleTitle: moduleId.toUpperCase(),
    topicId,
    topicTitle: topicId.replace('-', ' ').toUpperCase(),
    targetDurationMinutes: 10,
    plates: [
      {
        id: `${topicId}-overview`,
        kind: 'concept',
        title: `${topicId.replace('-', ' ').toUpperCase()} Overview`,
        subtitle: 'Syllabus Topic in Progress',
        caption: 'This topic presentation plate shell is ready; full interactive figures scaling in future modules.',
        speakerNotes: {
          script: `This topic is part of module ${moduleId.toUpperCase()}. The core concepts and animated figures are scheduled in the syllabus sequence.`,
          likelyQuestions: []
        }
      }
    ]
  }
}

export {
  principlesPresentation,
  osiArchitecturePresentation,
  symmetricModelPresentation,
  caesarPresentation,
  affinePresentation,
  playfairPresentation,
  vigenerePresentation,
  hillPresentation,
  transpositionPresentation,
  productCiphersPresentation,
  cryptanalysisPresentation,
  blockPrinciplesPresentation,
  feistelPresentation,
  modesPresentation,
  desPresentation,
  aesPresentation,
  blowfishPresentation,
  rc5Presentation,
  publicKeyPrinciplesPresentation,
  rsaPresentation,
  rabinPresentation,
  elgamalPresentation,
  eccPresentation,
  diffieHellmanPresentation,
  lightweightTeaPresentation,
  authRequirementsPresentation,
  macHmacPresentation,
  hashPropertiesPresentation,
  md5ShaPresentation,
  digitalSignaturesPresentation,
  pkiCertificatesPresentation,
  softwareVulnerabilitiesPresentation,
  malwarePresentation,
  accessControlPresentation,
  authMethodsPresentation,
  passwordSecurityPresentation,
  layerVulnerabilitiesPresentation,
  arpSniffingPresentation,
  scanningSpoofingPresentation,
  dosDdosPresentation,
  dnsSecurityPresentation,
  firewallsPresentation,
  idsHoneypotsPresentation
}
