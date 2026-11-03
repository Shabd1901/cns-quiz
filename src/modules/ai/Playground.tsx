"use client"

import React, { useState } from "react"
import { simulatePgpPipeline, getEmailTrustComparison } from "@/lib/applications/secureEmail"
import {
  classifyNetworkFlow,
  evaluateConfusionMatrix,
  simulateAdversarialEvasion,
  triggerSoarPlaybook,
  NetworkFlowFeatures
} from "@/lib/applications/aiSecurity"

export default function AISecurityPlayground() {
  const [activeTab, setActiveTab] = useState<'pgp' | 'classifier' | 'adversarial'>('pgp')

  // ========================================================
  // TAB 1: PGP 5-STEP PIPELINE STATE
  // ========================================================
  const [emailText, setEmailText] = useState<string>("Quarterly Security Audit Report: Zero critical CVE vulnerabilities detected in production clusters.")
  const [activePgpStep, setActivePgpStep] = useState<number>(0)
  const pgpResult = simulatePgpPipeline(emailText)
  const comparisons = getEmailTrustComparison()

  // ========================================================
  // TAB 2: AI NETFLOW CLASSIFIER & CONFUSION MATRIX STATE
  // ========================================================
  const [synRatio, setSynRatio] = useState<number>(0.95)
  const [packetRate, setPacketRate] = useState<number>(500)
  const [avgPacketSize, setAvgPacketSize] = useState<number>(40)

  const currentFlow: NetworkFlowFeatures = {
    flowDurationSec: 5,
    totalPackets: packetRate,
    totalBytes: packetRate * avgPacketSize,
    synFlagRatio: synRatio,
    avgPacketSizeBytes: avgPacketSize
  }

  const prediction = classifyNetworkFlow(currentFlow)
  const confusion = evaluateConfusionMatrix(90, 5, 95, 10)

  // ========================================================
  // TAB 3: ADVERSARIAL EVASION & SOAR PLAYBOOKS STATE
  // ========================================================
  const [evasionStrategy, setEvasionStrategy] = useState<'add-benign-traffic' | 'pad-packet-size' | 'rate-delay'>('add-benign-traffic')
  const evasionResult = simulateAdversarialEvasion(currentFlow, evasionStrategy)
  const [soarAction, setSoarAction] = useState<'SYN_FLOOD' | 'DATA_EXFILTRATION' | 'PORT_SCAN'>('SYN_FLOOD')
  const [soarSteps, setSoarSteps] = useState(triggerSoarPlaybook('SYN_FLOOD', '198.51.100.42', 'host-db-01'))

  const handleRunSoar = (actionType: 'SYN_FLOOD' | 'DATA_EXFILTRATION' | 'PORT_SCAN') => {
    setSoarAction(actionType)
    setSoarSteps(triggerSoarPlaybook(actionType, '198.51.100.42', 'host-db-01'))
  }

  return (
    <div className="space-y-8 font-mono">
      {/* Top Header */}
      <div className="border-b border-rule pb-4">
        <div className="flex items-center gap-3">
          <span className="font-mono text-xs uppercase tracking-widest text-signal font-bold">
            Module 6 Interactive Lab
          </span>
          <span className="font-mono text-[10px] px-1.5 py-0.5 border border-rule text-ink-soft">
            PGP/S-MIME · ML Anomaly Detection · Adversarial AI & SOAR
          </span>
        </div>
        <h2 className="font-serif text-3xl font-bold text-ink mt-1">
          Secure Messaging & Artificial Intelligence in Cybersecurity
        </h2>
        <p className="font-sans text-xs sm:text-sm text-ink-soft mt-1">
          Execute the 5-phase OpenPGP RFC 4880 pipeline, evaluate ML network flow classifiers, and explore adversarial evasion defenses.
        </p>

        {/* Tab Switcher */}
        <div className="overflow-x-auto pb-1 -mx-2 px-2 sm:mx-0 sm:px-0 scrollbar-none mt-4">
          <div className="flex items-center gap-2 text-xs w-max sm:w-auto">
            <button
              onClick={() => setActiveTab('pgp')}
              className={`px-3 py-1.5 border shrink-0 whitespace-nowrap transition-all ${
                activeTab === 'pgp'
                  ? "border-signal bg-signal text-paper font-bold shadow-[2px_2px_0_var(--ink)]"
                  : "border-rule bg-card text-ink hover:border-ink"
              }`}
            >
              1. PGP Pipeline & ASCII Armor
            </button>
            <button
              onClick={() => setActiveTab('classifier')}
              className={`px-3 py-1.5 border shrink-0 whitespace-nowrap transition-all ${
                activeTab === 'classifier'
                  ? "border-signal bg-signal text-paper font-bold shadow-[2px_2px_0_var(--ink)]"
                  : "border-rule bg-card text-ink hover:border-ink"
              }`}
            >
              2. ML Anomaly Classifier & F1-Score
            </button>
            <button
              onClick={() => setActiveTab('adversarial')}
              className={`px-3 py-1.5 border shrink-0 whitespace-nowrap transition-all ${
                activeTab === 'adversarial'
                  ? "border-signal bg-signal text-paper font-bold shadow-[2px_2px_0_var(--ink)]"
                  : "border-rule bg-card text-ink hover:border-ink"
              }`}
            >
              3. Adversarial Evasion & SOAR Playbooks
            </button>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* TAB 1: PGP 5-STEP PIPELINE & ASCII ARMOR                */}
      {/* ======================================================== */}
      {activeTab === 'pgp' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="p-5 bg-card border border-ink shadow-[4px_4px_0_var(--rule)] space-y-4">
              <h3 className="font-serif text-lg font-bold text-ink border-b border-rule pb-2">
                PGP Message Composer
              </h3>

              <div className="space-y-2 text-xs">
                <label className="text-ink-soft uppercase text-[10px] block font-bold">Email Plaintext:</label>
                <textarea
                  rows={4}
                  value={emailText}
                  onChange={e => setEmailText(e.target.value)}
                  className="w-full p-2 border border-rule bg-paper text-ink font-sans text-xs"
                />
              </div>

              <div className="p-3 bg-paper border border-rule text-xs space-y-1">
                <div className="flex justify-between">
                  <span className="text-ink-soft">Raw Message Size:</span>
                  <span className="font-bold text-ink">{emailText.length} bytes</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-ink-soft">Pipeline Steps:</span>
                  <span className="font-bold text-signal">{pgpResult.steps.length} Phases</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-ink-soft">Armor Checksum:</span>
                  <span className="font-bold text-ok">24-bit CRC</span>
                </div>
              </div>

              {/* Trust Model Comparison */}
              <div className="p-3 bg-paper border border-rule text-xs space-y-2">
                <span className="font-bold uppercase text-[10px] text-ink block">Web of Trust vs S/MIME:</span>
                <div className="text-[11px] space-y-1.5 text-ink-soft">
                  {comparisons.map((c, idx) => (
                    <div key={idx}>
                      <span className="font-bold text-ink block">{c.feature}:</span>
                      <span>· PGP: {c.pgpWebOfTrust}</span><br/>
                      <span>· S/MIME: {c.smimeX509}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Pipeline Stage Inspector */}
            <div className="lg:col-span-2 p-5 bg-card border border-ink shadow-[4px_4px_0_var(--rule)] space-y-4">
              <div className="flex justify-between items-center border-b border-rule pb-2">
                <h3 className="font-serif text-lg font-bold text-ink">
                  5-Phase OpenPGP Pipeline (RFC 4880)
                </h3>
                <span className="text-xs text-signal font-bold">
                  Step {activePgpStep + 1} of 5
                </span>
              </div>

              {/* Step Navigation Pills */}
              <div className="grid grid-cols-5 gap-1.5 text-center text-xs">
                {pgpResult.steps.map((st, idx) => (
                  <button
                    key={st.stepNumber}
                    onClick={() => setActivePgpStep(idx)}
                    className={`p-2 border transition-all ${
                      idx === activePgpStep
                        ? "border-signal bg-signal text-paper font-bold shadow-[2px_2px_0_var(--ink)]"
                        : "border-rule bg-card text-ink hover:border-ink"
                    }`}
                  >
                    <div className="text-[10px] opacity-75">0{st.stepNumber}</div>
                    <div className="truncate text-[10px] font-bold">{st.name.split(' ')[0]}</div>
                  </button>
                ))}
              </div>

              {/* Active Step Details */}
              <div className="p-4 bg-paper border border-rule text-xs space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-signal uppercase text-sm">
                    {pgpResult.steps[activePgpStep].name}
                  </span>
                  <span className="text-[10px] px-1.5 py-0.5 border border-rule bg-card text-ink">
                    Action: {pgpResult.steps[activePgpStep].action}
                  </span>
                </div>

                <p className="text-ink text-xs font-serif leading-relaxed">
                  {pgpResult.steps[activePgpStep].outputDescription}
                </p>

                <div className="p-2.5 bg-card border border-rule text-[11px] space-y-1">
                  <div className="text-ink-soft uppercase text-[10px] font-bold">Artifact Output:</div>
                  <div className="font-mono text-ink break-all text-[10px]">
                    {pgpResult.steps[activePgpStep].intermediateArtifact}
                  </div>
                </div>
              </div>

              {/* ASCII Armor Terminal View */}
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between items-center text-ink-soft text-[10px] uppercase font-bold">
                  <span>Radix-64 / ASCII Armor Output:</span>
                  <span>Includes 24-bit CRC Checksum</span>
                </div>
                <pre className="p-3 bg-ink text-paper rounded-[2px] text-[11px] overflow-x-auto max-h-48 border border-ink leading-tight shadow-inner">
                  {pgpResult.asciiArmoredMessage}
                </pre>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 2: ML NETFLOW CLASSIFIER & CONFUSION MATRIX          */}
      {/* ======================================================== */}
      {activeTab === 'classifier' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="p-5 bg-card border border-ink shadow-[4px_4px_0_var(--rule)] space-y-4">
              <h3 className="font-serif text-lg font-bold text-ink border-b border-rule pb-2">
                NetFlow Feature Inputs
              </h3>

              <div className="space-y-1 text-xs">
                <div className="flex justify-between">
                  <span className="text-ink-soft">SYN Flag Ratio:</span>
                  <span className="font-bold text-ink">{(synRatio * 100).toFixed(0)}%</span>
                </div>
                <input
                  type="range"
                  min="0.10"
                  max="1.0"
                  step="0.05"
                  value={synRatio}
                  onChange={e => setSynRatio(parseFloat(e.target.value))}
                  className="w-full accent-signal"
                />
              </div>

              <div className="space-y-1 text-xs">
                <div className="flex justify-between">
                  <span className="text-ink-soft">Packet Count:</span>
                  <span className="font-bold text-ink">{packetRate} pkts</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="2000"
                  step="50"
                  value={packetRate}
                  onChange={e => setPacketRate(parseInt(e.target.value))}
                  className="w-full accent-signal"
                />
              </div>

              <div className="space-y-1 text-xs">
                <div className="flex justify-between">
                  <span className="text-ink-soft">Avg Packet Size:</span>
                  <span className="font-bold text-ink">{avgPacketSize} bytes</span>
                </div>
                <input
                  type="range"
                  min="30"
                  max="1400"
                  step="10"
                  value={avgPacketSize}
                  onChange={e => setAvgPacketSize(parseInt(e.target.value))}
                  className="w-full accent-signal"
                />
              </div>

              {/* Prediction Banner */}
              <div className={`p-3 border text-xs space-y-1 ${
                prediction.isAttackPredicted ? "border-bad bg-bad/10 text-bad" : "border-ok bg-ok/10 text-ok"
              }`}>
                <div className="font-bold uppercase tracking-wider">
                  {prediction.isAttackPredicted ? `ALERT: ${prediction.attackType}` : "BENIGN TRAFFIC"}
                </div>
                <div className="text-[11px]">
                  Confidence: {(prediction.confidence * 100).toFixed(1)}% · Status: {prediction.isAttackPredicted ? "Malicious Anomaly Detected" : "Normal Baseline Flow"}
                </div>
              </div>
            </div>

            {/* Confusion Matrix & Metrics */}
            <div className="lg:col-span-2 p-5 bg-card border border-ink shadow-[4px_4px_0_var(--rule)] space-y-4">
              <div className="flex justify-between items-center border-b border-rule pb-2">
                <h3 className="font-serif text-lg font-bold text-ink">
                  Model Evaluation Matrix & Performance
                </h3>
                <span className="text-xs text-ink-soft">Test Benchmark: 200 Flows</span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 border border-ok bg-ok/10">
                  <div className="text-ink-soft uppercase text-[10px]">True Positives (TP)</div>
                  <div className="text-2xl font-bold text-ok">{confusion.tp}</div>
                  <div className="text-[10px] text-ink-soft mt-1">Attacks correctly flagged</div>
                </div>

                <div className="p-3 border border-bad bg-bad/10">
                  <div className="text-ink-soft uppercase text-[10px]">False Positives (FP)</div>
                  <div className="text-2xl font-bold text-bad">{confusion.fp}</div>
                  <div className="text-[10px] text-ink-soft mt-1">Benign traffic falsely blocked</div>
                </div>

                <div className="p-3 border border-bad bg-bad/10">
                  <div className="text-ink-soft uppercase text-[10px]">False Negatives (FN)</div>
                  <div className="text-2xl font-bold text-bad">{confusion.fn}</div>
                  <div className="text-[10px] text-ink-soft mt-1">Undetected attacks missed</div>
                </div>

                <div className="p-3 border border-rule bg-paper">
                  <div className="text-ink-soft uppercase text-[10px]">True Negatives (TN)</div>
                  <div className="text-2xl font-bold text-ink">{confusion.tn}</div>
                  <div className="text-[10px] text-ink-soft mt-1">Benign flows allowed</div>
                </div>
              </div>

              {/* Metrics */}
              <div className="grid grid-cols-3 gap-3 text-xs">
                <div className="p-3 bg-paper border border-rule text-center">
                  <div className="text-ink-soft text-[10px] uppercase">Precision</div>
                  <div className="text-xl font-bold text-signal">{(confusion.precision * 100).toFixed(1)}%</div>
                  <div className="text-[9px] text-ink-soft">TP / (TP + FP)</div>
                </div>

                <div className="p-3 bg-paper border border-rule text-center">
                  <div className="text-ink-soft text-[10px] uppercase">Recall</div>
                  <div className="text-xl font-bold text-ok">{(confusion.recall * 100).toFixed(1)}%</div>
                  <div className="text-[9px] text-ink-soft">TP / (TP + FN)</div>
                </div>

                <div className="p-3 bg-paper border border-rule text-center">
                  <div className="text-ink-soft text-[10px] uppercase">F1-Score</div>
                  <div className="text-xl font-bold text-ink">{confusion.f1Score.toFixed(3)}</div>
                  <div className="text-[9px] text-ink-soft">Harmonic Mean</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 3: ADVERSARIAL EVASION & SOAR PLAYBOOKS             */}
      {/* ======================================================== */}
      {activeTab === 'adversarial' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="p-5 bg-card border border-ink shadow-[4px_4px_0_var(--rule)] space-y-4">
              <h3 className="font-serif text-lg font-bold text-ink border-b border-rule pb-2">
                Adversarial Perturbation Strategy
              </h3>

              <div className="space-y-2 text-xs">
                <label className="text-ink-soft uppercase text-[10px] block font-bold">Evasion Technique:</label>
                {(['add-benign-traffic', 'pad-packet-size', 'rate-delay'] as const).map(strat => (
                  <button
                    key={strat}
                    onClick={() => setEvasionStrategy(strat)}
                    className={`w-full p-2 border text-left text-xs ${
                      evasionStrategy === strat
                        ? "border-signal bg-signal text-paper font-bold"
                        : "border-rule bg-paper text-ink hover:border-ink"
                    }`}
                  >
                    {strat === 'add-benign-traffic' && '1. Inject Benign ACKs (Dilution)'}
                    {strat === 'pad-packet-size' && '2. Byte Padding (Size Manipulation)'}
                    {strat === 'rate-delay' && '3. Timing Jitter (Rate Masking)'}
                  </button>
                ))}
              </div>

              {/* Evasion Verdict */}
              <div className={`p-3 border text-xs space-y-1 ${
                evasionResult.evasionSuccessful ? "border-bad bg-bad/10 text-bad" : "border-ok bg-ok/10 text-ok"
              }`}>
                <div className="font-bold uppercase tracking-wider">
                  {evasionResult.evasionSuccessful ? "✓ EVASION SUCCESSFUL" : "✗ ATTACK DETECTED"}
                </div>
                <div className="text-[11px]">
                  {evasionResult.evasionSuccessful
                    ? "The perturbation moved the exploit across the decision boundary into the benign class!"
                    : "The model detected the anomalous signature despite evasion noise."}
                </div>
              </div>

              {/* SOAR Action Triggers */}
              <div className="pt-2 border-t border-rule space-y-2 text-xs">
                <label className="text-ink-soft uppercase text-[10px] block font-bold">Trigger Automated SOAR Action:</label>
                <div className="grid grid-cols-1 gap-1.5">
                  {(['SYN_FLOOD', 'DATA_EXFILTRATION', 'PORT_SCAN'] as const).map(act => (
                    <button
                      key={act}
                      onClick={() => handleRunSoar(act)}
                      className={`p-2 border text-left font-bold ${
                        soarAction === act
                          ? "border-signal bg-paper text-signal shadow-[2px_2px_0_var(--signal)]"
                          : "border-rule bg-paper text-ink hover:border-ink"
                      }`}
                    >
                      {act.replace('_', ' ')}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* SOAR Playbook Steps */}
            <div className="lg:col-span-2 p-5 bg-card border border-ink shadow-[4px_4px_0_var(--rule)] space-y-4">
              <div className="flex justify-between items-center border-b border-rule pb-2">
                <h3 className="font-serif text-lg font-bold text-ink">
                  SOAR Playbook Execution Steps ({soarAction})
                </h3>
                <span className="text-xs text-ok font-bold">Automated SOAR Engine</span>
              </div>

              <div className="space-y-2.5 text-xs">
                {soarSteps.map((st, idx) => (
                  <div key={idx} className="p-3 border border-rule bg-paper space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-signal uppercase text-[11px]">{st.action}</span>
                      <span className="text-[10px] px-1.5 py-0.5 border border-rule bg-card text-ink-soft">
                        Target: {st.target}
                      </span>
                    </div>
                    <p className="text-ink text-[11px] leading-relaxed">{st.details}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
