"use client"

import React, { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { WPModuleId } from "@/lib/syllabus/wpSyllabus"
import { Play, RotateCcw, Check, Sparkles, Server, Database, Globe, Layers, ShieldCheck, Terminal, Cpu, ArrowRight } from "lucide-react"

export default function WPPlayground({ moduleId }: { moduleId: WPModuleId }) {
  if (moduleId === 'wp-m1') {
    return <WP1Playground />
  }
  if (moduleId === 'wp-m2') {
    return <WP2Playground />
  }
  if (moduleId === 'wp-m3') {
    return <WP3Playground />
  }
  if (moduleId === 'wp-m4') {
    return <WP4Playground />
  }
  if (moduleId === 'wp-m5') {
    return <WP5Playground />
  }
  return <WP6Playground />
}

// ========================================================
// MODULE 1: CSS BOX MODEL & FLEXBOX/GRID STUDIO
// ========================================================
function WP1Playground() {
  const [subTab, setSubTab] = useState<'box-model' | 'flexbox' | 'grid'>('box-model')

  // Box model state
  const [contentWidth, setContentWidth] = useState(200)
  const [contentHeight, setContentHeight] = useState(100)
  const [padding, setPadding] = useState(20)
  const [borderWidth, setBorderWidth] = useState(6)
  const [margin, setMargin] = useState(24)
  const [boxSizing, setBoxSizing] = useState<'content-box' | 'border-box'>('content-box')

  // Flexbox state
  const [flexDirection, setFlexDirection] = useState<'row' | 'column' | 'row-reverse'>('row')
  const [justifyContent, setJustifyContent] = useState<'flex-start' | 'center' | 'space-between' | 'space-around'>('space-between')
  const [alignItems, setAlignItems] = useState<'stretch' | 'center' | 'flex-start' | 'flex-end'>('center')
  const [flexGap, setFlexGap] = useState(12)
  const [itemCount, setItemCount] = useState(4)

  // Calculations for Box Model
  const totalRenderedWidth = boxSizing === 'content-box'
    ? contentWidth + 2 * padding + 2 * borderWidth
    : contentWidth
  const totalRenderedHeight = boxSizing === 'content-box'
    ? contentHeight + 2 * padding + 2 * borderWidth
    : contentHeight
  const totalOccupiedWidth = totalRenderedWidth + 2 * margin

  return (
    <div className="space-y-6">
      {/* Sub-Tabs */}
      <div className="overflow-x-auto pb-2 -mx-2 px-2 sm:mx-0 sm:px-0 scrollbar-none border-b border-rule">
        <div className="flex flex-nowrap sm:flex-wrap gap-2 w-max sm:w-full">
          <button
            onClick={() => setSubTab('box-model')}
            className={`px-3 py-1.5 font-mono text-xs uppercase tracking-wider transition-colors border shrink-0 whitespace-nowrap ${
              subTab === 'box-model'
                ? 'bg-ink text-paper border-ink font-bold shadow-[2px_2px_0_var(--signal)]'
                : 'bg-card text-ink border-rule hover:border-ink'
            }`}
          >
            1. CSS Box Model Calculator
          </button>
          <button
            onClick={() => setSubTab('flexbox')}
            className={`px-3 py-1.5 font-mono text-xs uppercase tracking-wider transition-colors border shrink-0 whitespace-nowrap ${
              subTab === 'flexbox'
                ? 'bg-ink text-paper border-ink font-bold shadow-[2px_2px_0_var(--signal)]'
                : 'bg-card text-ink border-rule hover:border-ink'
            }`}
          >
            2. Interactive Flexbox Layout Studio
          </button>
          <button
            onClick={() => setSubTab('grid')}
            className={`px-3 py-1.5 font-mono text-xs uppercase tracking-wider transition-colors border shrink-0 whitespace-nowrap ${
              subTab === 'grid'
                ? 'bg-ink text-paper border-ink font-bold shadow-[2px_2px_0_var(--signal)]'
                : 'bg-card text-ink border-rule hover:border-ink'
            }`}
          >
            3. HTML5 Semantic Layout Inspector
          </button>
        </div>
      </div>

      {subTab === 'box-model' && (
        <Card>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <span className="font-mono text-[10px] uppercase tracking-widest text-signal font-bold">WP · Module 1 · Topic 3</span>
                <CardTitle className="font-serif text-2xl sm:text-3xl mt-1">CSS Box Model & Dimensional Formula</CardTitle>
              </div>
              <span className="font-mono text-xs px-2.5 py-1 bg-paper border border-rule text-ink-soft">
                Total Rendered: {totalRenderedWidth}px × {totalRenderedHeight}px
              </span>
            </div>
            <p className="text-ink-soft text-xs sm:text-sm font-sans mt-2">
              Every HTML element is rendered as a rectangular box. Adjust padding, borders, and margins to verify the exact mathematical space allocated by browser layout engines.
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Controls */}
              <div className="p-4 bg-paper border border-rule font-mono text-xs space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-rule">
                  <span className="font-bold text-ink uppercase">box-sizing property:</span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setBoxSizing('content-box')}
                      className={`px-2.5 py-1 border text-xs transition-colors ${
                        boxSizing === 'content-box' ? 'bg-signal text-paper font-bold' : 'bg-card border-rule'
                      }`}
                    >
                      content-box (default)
                    </button>
                    <button
                      onClick={() => setBoxSizing('border-box')}
                      className={`px-2.5 py-1 border text-xs transition-colors ${
                        boxSizing === 'border-box' ? 'bg-signal text-paper font-bold' : 'bg-card border-rule'
                      }`}
                    >
                      border-box (modern)
                    </button>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-ink-soft mb-1">
                      <span>Content Width ({contentWidth}px):</span>
                      <span className="font-bold text-ink">{contentWidth}px</span>
                    </div>
                    <input
                      type="range"
                      min="120"
                      max="320"
                      value={contentWidth}
                      onChange={(e) => setContentWidth(Number(e.target.value))}
                      className="w-full accent-signal"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-ink-soft mb-1">
                      <span>Padding ({padding}px each side):</span>
                      <span className="font-bold text-ok">{padding}px</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="40"
                      value={padding}
                      onChange={(e) => setPadding(Number(e.target.value))}
                      className="w-full accent-ok"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-ink-soft mb-1">
                      <span>Border ({borderWidth}px solid):</span>
                      <span className="font-bold text-warn">{borderWidth}px</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="16"
                      value={borderWidth}
                      onChange={(e) => setBorderWidth(Number(e.target.value))}
                      className="w-full accent-warn"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-ink-soft mb-1">
                      <span>Margin ({margin}px outer spacing):</span>
                      <span className="font-bold text-signal">{margin}px</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="40"
                      value={margin}
                      onChange={(e) => setMargin(Number(e.target.value))}
                      className="w-full accent-signal"
                    />
                  </div>
                </div>

                {/* Mathematical Equation Readout */}
                <div className="p-3 bg-card border border-ink text-xs space-y-1">
                  <span className="text-[10px] uppercase text-ink-soft font-bold block">University Exam Equation:</span>
                  <div className="font-mono text-ink">
                    {boxSizing === 'content-box' ? (
                      <>
                        <code>Width = content ({contentWidth}) + 2×pad ({2 * padding}) + 2×bdr ({2 * borderWidth}) = <strong>{totalRenderedWidth}px</strong></code>
                      </>
                    ) : (
                      <>
                        <code>Width = fixed ({contentWidth}px) · Content shrunk to {contentWidth - 2 * padding - 2 * borderWidth}px</code>
                      </>
                    )}
                  </div>
                  <div className="text-ink-soft text-[11px] pt-1">
                    Total Layout Space Occupied (including margin): <strong>{totalOccupiedWidth}px</strong>
                  </div>
                </div>
              </div>

              {/* Visual Box Diagram */}
              <div className="p-6 bg-card border border-rule flex flex-col items-center justify-center min-h-[300px] overflow-hidden">
                <span className="font-mono text-[10px] uppercase tracking-wider text-ink-soft mb-3">Live Box Model Representation</span>
                
                {/* Margin Box (Orange) */}
                <div 
                  className="bg-signal/15 border border-dashed border-signal p-3 text-center transition-all flex flex-col items-center justify-center"
                  style={{ padding: `${Math.min(margin, 24)}px` }}
                >
                  <span className="text-[10px] font-mono text-signal font-bold uppercase mb-1">Margin ({margin}px)</span>

                  {/* Border Box (Yellow/Warn) */}
                  <div 
                    className="bg-warn/20 border-warn text-center transition-all flex flex-col items-center justify-center"
                    style={{ borderWidth: `${borderWidth}px`, borderStyle: 'solid' }}
                  >
                    <span className="text-[10px] font-mono text-warn font-bold uppercase mb-1">Border ({borderWidth}px)</span>

                    {/* Padding Box (Green/OK) */}
                    <div 
                      className="bg-ok/20 border border-dotted border-ok text-center transition-all flex flex-col items-center justify-center"
                      style={{ padding: `${Math.min(padding, 24)}px` }}
                    >
                      <span className="text-[10px] font-mono text-ok font-bold uppercase mb-1">Padding ({padding}px)</span>

                      {/* Content Box (Blue/Ink) */}
                      <div 
                        className="bg-ink text-paper p-3 text-center flex flex-col items-center justify-center font-mono text-xs font-bold transition-all"
                        style={{ width: `${Math.min(contentWidth, 180)}px`, height: `${Math.min(contentHeight, 80)}px` }}
                      >
                        <span>Content</span>
                        <span className="text-[10px] font-normal opacity-80">{contentWidth} × {contentHeight}px</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {subTab === 'flexbox' && (
        <Card>
          <CardHeader>
            <CardTitle className="font-serif text-2xl sm:text-3xl">Interactive Flexbox Direction & Alignment Studio</CardTitle>
            <p className="text-ink-soft text-xs sm:text-sm font-sans mt-1">
              Flexbox provides one-dimensional layout control along the Main Axis and Cross Axis. Toggle layout axes to observe element positioning.
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-paper border border-rule font-mono text-xs">
              <div>
                <label className="block text-ink-soft uppercase text-[10px] font-bold mb-1">flex-direction:</label>
                <select
                  value={flexDirection}
                  onChange={(e) => setFlexDirection(e.target.value as any)}
                  className="w-full p-1.5 bg-card border border-ink text-xs font-mono"
                >
                  <option value="row">row (Main: Horizontal)</option>
                  <option value="row-reverse">row-reverse</option>
                  <option value="column">column (Main: Vertical)</option>
                </select>
              </div>

              <div>
                <label className="block text-ink-soft uppercase text-[10px] font-bold mb-1">justify-content (Main):</label>
                <select
                  value={justifyContent}
                  onChange={(e) => setJustifyContent(e.target.value as any)}
                  className="w-full p-1.5 bg-card border border-ink text-xs font-mono"
                >
                  <option value="flex-start">flex-start</option>
                  <option value="center">center</option>
                  <option value="space-between">space-between</option>
                  <option value="space-around">space-around</option>
                </select>
              </div>

              <div>
                <label className="block text-ink-soft uppercase text-[10px] font-bold mb-1">align-items (Cross):</label>
                <select
                  value={alignItems}
                  onChange={(e) => setAlignItems(e.target.value as any)}
                  className="w-full p-1.5 bg-card border border-ink text-xs font-mono"
                >
                  <option value="center">center</option>
                  <option value="flex-start">flex-start</option>
                  <option value="flex-end">flex-end</option>
                  <option value="stretch">stretch</option>
                </select>
              </div>

              <div>
                <label className="block text-ink-soft uppercase text-[10px] font-bold mb-1">gap ({flexGap}px):</label>
                <input
                  type="range"
                  min="4"
                  max="32"
                  value={flexGap}
                  onChange={(e) => setFlexGap(Number(e.target.value))}
                  className="w-full accent-signal"
                />
              </div>
            </div>

            {/* Live Canvas */}
            <div 
              className="p-6 bg-card border-2 border-ink min-h-[220px] transition-all flex rounded-xs shadow-[3px_3px_0_var(--rule)]"
              style={{
                flexDirection,
                justifyContent,
                alignItems,
                gap: `${flexGap}px`
              }}
            >
              {Array.from({ length: itemCount }).map((_, i) => (
                <div
                  key={i}
                  className="p-4 bg-paper border border-ink font-mono text-xs font-bold shadow-[2px_2px_0_var(--signal)] min-w-[80px] text-center"
                >
                  <span className="block text-signal uppercase text-[10px]">Item {i + 1}</span>
                  <span className="font-serif text-sm">Course {i + 1}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {subTab === 'grid' && (
        <Card>
          <CardHeader>
            <CardTitle className="font-serif text-2xl sm:text-3xl">HTML5 Semantic Layout Architecture</CardTitle>
            <p className="text-ink-soft text-xs sm:text-sm font-sans mt-1">
              HTML5 semantic elements replace uninformative <code>&lt;div&gt;</code> soup with meaningful structural landmarks that improve screen reader accessibility and search engine indexing.
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 font-mono text-xs">
              <div className="p-3 bg-paper border border-ink font-bold text-center uppercase tracking-wider">
                &lt;header&gt; Institutional Brand &amp; Top Utility Bar &lt;/header&gt;
              </div>

              <div className="p-2.5 bg-signal/15 border border-signal text-signal font-bold text-center uppercase">
                &lt;nav&gt; Primary Navigation Links &lt;/nav&gt;
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="md:col-span-2 p-4 bg-card border border-ink space-y-3">
                  <span className="font-bold uppercase text-[11px] block border-b border-rule pb-1">&lt;main&gt; Primary Page Content</span>
                  <div className="p-3 bg-paper border border-rule">
                    <span className="font-bold text-signal block">&lt;section&gt; Active Semester Courses</span>
                    <p className="text-ink-soft text-[11px] mt-1 font-sans">Contains modular thematic groupings of course lecture notes.</p>
                  </div>
                  <div className="p-3 bg-paper border border-rule">
                    <span className="font-bold text-ok block">&lt;article&gt; Self-Contained Lecture Notice</span>
                    <p className="text-ink-soft text-[11px] mt-1 font-sans">Independent, distributable content like an exam notification or assignment prompt.</p>
                  </div>
                </div>

                <div className="p-4 bg-paper border border-rule space-y-2">
                  <span className="font-bold uppercase text-[11px] block border-b border-rule pb-1">&lt;aside&gt; Auxiliary Rail</span>
                  <div className="text-[11px] text-ink-soft font-sans">
                    • Exam Dates Countdown<br />
                    • Faculty Office Hours<br />
                    • Laboratory Schedule
                  </div>
                </div>
              </div>

              <div className="p-3 bg-paper border border-ink text-center text-ink-soft uppercase text-[11px]">
                &lt;footer&gt; Copyright © 2026 TCET LMS · Autonomous Accreditation &lt;/footer&gt;
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

// ========================================================
// MODULE 2: JAVASCRIPT EVENT LOOP & ASYNC PIPELINE
// ========================================================
function WP2Playground() {
  const [callStack, setCallStack] = useState<string[]>([])
  const [webApis, setWebApis] = useState<string[]>([])
  const [microtasks, setMicrotasks] = useState<string[]>([])
  const [macrotasks, setMacrotasks] = useState<string[]>([])
  const [consoleOutput, setConsoleOutput] = useState<string[]>([])
  const [isRunning, setIsRunning] = useState(false)

  const runEventLoopSimulation = async () => {
    if (isRunning) return
    setIsRunning(true)
    setCallStack([])
    setWebApis([])
    setMicrotasks([])
    setMacrotasks([])
    setConsoleOutput([])

    const wait = (ms: number) => new Promise(res => setTimeout(res, ms))

    // Step 1: console.log("1: Synchronous Start")
    setCallStack(['console.log("1: Start")'])
    await wait(600)
    setConsoleOutput(prev => [...prev, '1: Synchronous Start'])
    setCallStack([])
    await wait(300)

    // Step 2: setTimeout() registration
    setCallStack(['setTimeout(cb, 0)'])
    await wait(500)
    setCallStack([])
    setWebApis(['Timer (0ms) -> Callback'])
    await wait(500)
    setWebApis([])
    setMacrotasks(['setTimeout Callback'])
    await wait(400)

    // Step 3: Promise.resolve().then()
    setCallStack(['Promise.resolve().then(cb)'])
    await wait(500)
    setCallStack([])
    setMicrotasks(['Promise Microtask'])
    await wait(400)

    // Step 4: console.log("2: Synchronous End")
    setCallStack(['console.log("2: End")'])
    await wait(600)
    setConsoleOutput(prev => [...prev, '2: Synchronous End'])
    setCallStack([])
    await wait(400)

    // Step 5: Event loop checks Microtask Queue first!
    setCallStack(['Promise Microtask Callback'])
    setMicrotasks([])
    await wait(600)
    setConsoleOutput(prev => [...prev, '3: Promise (Microtask Priority)'])
    setCallStack([])
    await wait(400)

    // Step 6: Event loop drains Macrotask Queue
    setCallStack(['setTimeout Macrotask Callback'])
    setMacrotasks([])
    await wait(600)
    setConsoleOutput(prev => [...prev, '4: Timeout (Macrotask Callback)'])
    setCallStack([])

    setIsRunning(false)
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <span className="font-mono text-[10px] uppercase tracking-widest text-signal font-bold">WP · Module 2 · Topic 4</span>
            <CardTitle className="font-serif text-2xl sm:text-3xl mt-1">JavaScript Event Loop &amp; Microtask Execution</CardTitle>
          </div>
          <button
            onClick={runEventLoopSimulation}
            disabled={isRunning}
            className="px-4 py-2 bg-signal text-paper font-mono text-xs uppercase font-bold hover:bg-ink transition-colors flex items-center gap-1.5 shadow-[2px_2px_0_var(--ink)] disabled:opacity-50"
          >
            <Play className="h-3.5 w-3.5" />
            <span>{isRunning ? "Stepping Event Loop..." : "Run Async Script"}</span>
          </button>
        </div>
        <p className="text-ink-soft text-xs sm:text-sm font-sans mt-2">
          JavaScript is single-threaded. Watch how the Event Loop prioritizes the <strong>Call Stack</strong>, offloads to <strong>Web APIs</strong>, drains the <strong>Microtask Queue (Promises)</strong> first, and finally executes <strong>Macrotasks (Timers)</strong>.
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Code Sample */}
        <div className="p-3 bg-paper border border-rule font-mono text-xs text-ink overflow-x-auto">
          <code>
            console.log(&apos;1: Synchronous Start&apos;);<br />
            setTimeout(() =&gt; console.log(&apos;4: Timeout (Macrotask)&apos;), 0);<br />
            Promise.resolve().then(() =&gt; console.log(&apos;3: Promise (Microtask)&apos;));<br />
            console.log(&apos;2: Synchronous End&apos;);
          </code>
        </div>

        {/* 4 Architectural Chambers */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-mono text-xs">
          {/* Call Stack */}
          <div className="p-4 bg-card border-2 border-ink space-y-2 min-h-[160px] flex flex-col">
            <span className="font-bold uppercase text-[10px] text-ink pb-1 border-b border-rule block">1. Call Stack (LIFO)</span>
            <div className="flex-1 flex flex-col justify-end gap-1.5">
              {callStack.length === 0 ? (
                <span className="text-ink-soft text-[10px] italic">Stack Idle</span>
              ) : (
                callStack.map((item, i) => (
                  <div key={i} className="p-2 bg-signal text-paper font-bold text-center text-xs animate-in fade-in">
                    {item}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Web APIs */}
          <div className="p-4 bg-card border border-rule space-y-2 min-h-[160px] flex flex-col">
            <span className="font-bold uppercase text-[10px] text-ink-soft pb-1 border-b border-rule block">2. Web APIs (Browser)</span>
            <div className="flex-1 flex flex-col justify-center gap-1.5">
              {webApis.length === 0 ? (
                <span className="text-ink-soft text-[10px] italic text-center">No active background timers</span>
              ) : (
                webApis.map((item, i) => (
                  <div key={i} className="p-2 bg-paper border border-warn text-warn font-bold text-center text-[11px]">
                    {item}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Microtask Queue (Promises) */}
          <div className="p-4 bg-card border-2 border-ok space-y-2 min-h-[160px] flex flex-col">
            <span className="font-bold uppercase text-[10px] text-ok pb-1 border-b border-rule block">3. Microtask Queue (Priority)</span>
            <div className="flex-1 flex flex-col justify-center gap-1.5">
              {microtasks.length === 0 ? (
                <span className="text-ink-soft text-[10px] italic text-center">Queue Empty</span>
              ) : (
                microtasks.map((item, i) => (
                  <div key={i} className="p-2 bg-ok text-paper font-bold text-center text-[11px] shadow-xs">
                    {item}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Macrotask Queue */}
          <div className="p-4 bg-card border border-rule space-y-2 min-h-[160px] flex flex-col">
            <span className="font-bold uppercase text-[10px] text-ink-soft pb-1 border-b border-rule block">4. Macrotask Queue (Callback)</span>
            <div className="flex-1 flex flex-col justify-center gap-1.5">
              {macrotasks.length === 0 ? (
                <span className="text-ink-soft text-[10px] italic text-center">Queue Empty</span>
              ) : (
                macrotasks.map((item, i) => (
                  <div key={i} className="p-2 bg-paper border border-ink text-ink font-bold text-center text-[11px]">
                    {item}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Live Console Output */}
        <div className="p-4 bg-paper border border-ink font-mono text-xs space-y-2">
          <span className="text-[10px] uppercase text-ink-soft font-bold block border-b border-rule pb-1">Terminal Stdout Readout:</span>
          <div className="min-h-[60px] space-y-1">
            {consoleOutput.length === 0 ? (
              <span className="text-ink-soft italic">Click &quot;Run Async Script&quot; to step through event loop execution...</span>
            ) : (
              consoleOutput.map((line, i) => (
                <div key={i} className="text-ink flex items-center gap-2">
                  <span className="text-signal">&gt;</span>
                  <span className="font-bold">{line}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// ========================================================
// MODULE 3: REACT VIRTUAL DOM DIFFING & RENDERING MODES
// ========================================================
function WP3Playground() {
  const [studentScore, setStudentScore] = useState(88)
  const [dirtyNode, setDirtyNode] = useState(false)

  const handleScoreUpdate = (delta: number) => {
    setStudentScore(prev => Math.max(0, Math.min(100, prev + delta)))
    setDirtyNode(true)
    setTimeout(() => setDirtyNode(false), 900)
  }

  return (
    <Card>
      <CardHeader>
        <span className="font-mono text-[10px] uppercase tracking-widest text-signal font-bold">WP · Module 3 · Topic 1 &amp; 3</span>
        <CardTitle className="font-serif text-2xl sm:text-3xl mt-1">Virtual DOM Diffing &amp; Next.js Rendering Comparator</CardTitle>
        <p className="text-ink-soft text-xs sm:text-sm font-sans mt-2">
          React avoids expensive real DOM updates by comparing virtual component snapshots (Reconciliation). Click the buttons to observe targeted subtree re-rendering.
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Virtual DOM Diffing Simulator */}
          <div className="p-4 bg-card border-2 border-ink space-y-4 font-mono text-xs">
            <div className="flex justify-between items-center border-b border-rule pb-2">
              <span className="font-bold uppercase text-[10px] text-ink">Virtual DOM Tree Inspector</span>
              <div className="flex gap-2">
                <button
                  onClick={() => handleScoreUpdate(-5)}
                  className="px-2.5 py-1 bg-paper border border-rule hover:border-ink font-bold"
                >
                  Score -5
                </button>
                <button
                  onClick={() => handleScoreUpdate(5)}
                  className="px-2.5 py-1 bg-signal text-paper font-bold hover:bg-ink transition-colors"
                >
                  Score +5
                </button>
              </div>
            </div>

            <div className="space-y-2 py-2">
              <div className="p-2.5 bg-paper border border-rule text-center text-ink-soft">
                &lt;App /&gt; (Root Component)
              </div>
              <div className="flex justify-center text-rule">↓</div>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-2.5 bg-paper border border-rule text-center text-ink-soft">
                  &lt;Navigation /&gt;
                  <span className="block text-[9px] text-ok mt-0.5">✓ No changes (Skip DOM)</span>
                </div>
                <div className={`p-2.5 border text-center transition-all ${
                  dirtyNode ? 'bg-signal text-paper border-signal font-bold scale-105' : 'bg-paper border-ink text-ink'
                }`}>
                  &lt;StudentCard score={studentScore} /&gt;
                  <span className="block text-[9px] opacity-80 mt-0.5">
                    {dirtyNode ? "⚡ Marked Dirty -> Reconciling" : "Synced"}
                  </span>
                </div>
              </div>
            </div>

            <div className="p-3 bg-paper border border-rule text-[11px] space-y-1">
              <span className="font-bold text-ink block">Reconciliation Outcome:</span>
              <p className="text-ink-soft font-sans">
                Only the inner text node containing <code>{studentScore}</code> was dispatched to the browser rendering engine. The <code>&lt;Navigation /&gt;</code> component and surrounding DOM trees avoided reflow/repaint entirely.
              </p>
            </div>
          </div>

          {/* Next.js Rendering Comparison Table */}
          <div className="p-4 bg-paper border border-rule font-mono text-xs space-y-3">
            <span className="font-bold uppercase text-[10px] text-ink block border-b border-rule pb-2">
              Next.js Rendering Paradigm Breakdown
            </span>

            <div className="space-y-2">
              <div className="p-2.5 bg-card border border-rule">
                <div className="flex justify-between font-bold text-signal">
                  <span>SSG (Static Site Generation)</span>
                  <span className="text-[10px]">Build Time</span>
                </div>
                <p className="text-ink-soft text-[11px] font-sans mt-0.5">
                  Pre-rendered as static HTML at build time. Ultra-fast CDN delivery. Best for course syllabus, documentation, and blog posts.
                </p>
              </div>

              <div className="p-2.5 bg-card border border-rule">
                <div className="flex justify-between font-bold text-ok">
                  <span>SSR (Server-Side Rendering)</span>
                  <span className="text-[10px]">Per-Request</span>
                </div>
                <p className="text-ink-soft text-[11px] font-sans mt-0.5">
                  HTML generated on server for every incoming request. Ideal for real-time exam schedules, live seat availability, and dynamic student dashboards.
                </p>
              </div>

              <div className="p-2.5 bg-card border border-rule">
                <div className="flex justify-between font-bold text-ink">
                  <span>CSR (Client-Side Rendering)</span>
                  <span className="text-[10px]">Browser Runtime</span>
                </div>
                <p className="text-ink-soft text-[11px] font-sans mt-0.5">
                  Blank HTML shell loaded; JavaScript executes in browser to fetch data. Best for private interactive tools and behind-login portals.
                </p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// ========================================================
// MODULE 4: EXPRESS.JS MIDDLEWARE & REST API STUDIO
// ========================================================
function WP4Playground() {
  const [authHeader, setAuthHeader] = useState("Bearer tcet_token_valid")
  const [requestMethod, setRequestMethod] = useState<'GET' | 'POST' | 'DELETE'>('GET')
  const [pipelineState, setPipelineState] = useState<string>('Idle')
  const [responseLog, setResponseLog] = useState<{ status: number; body: string } | null>(null)

  const executeApiRequest = () => {
    setPipelineState('1. Logger: req recorded ->')
    setTimeout(() => {
      if (!authHeader.includes("Bearer")) {
        setPipelineState('2. Auth Middleware: 401 Unauthorized!')
        setResponseLog({ status: 401, body: JSON.stringify({ error: "Missing or malformed Authorization header" }, null, 2) })
        return
      }
      setPipelineState('2. Auth Middleware: Token Validated -> 3. Controller')
      setTimeout(() => {
        if (requestMethod === 'GET') {
          setResponseLog({
            status: 200,
            body: JSON.stringify({
              subject: "ITC504",
              name: "Web Programming",
              studentsEnrolled: 64,
              status: "Active Lab"
            }, null, 2)
          })
        } else if (requestMethod === 'POST') {
          setResponseLog({
            status: 201,
            body: JSON.stringify({ message: "New student enrolled in gradebook", rollNo: "21BIT099" }, null, 2)
          })
        } else {
          setResponseLog({
            status: 200,
            body: JSON.stringify({ message: "Record deleted successfully" }, null, 2)
          })
        }
        setPipelineState('Completed: 200/201 Response dispatched')
      }, 500)
    }, 400)
  }

  return (
    <Card>
      <CardHeader>
        <span className="font-mono text-[10px] uppercase tracking-widest text-signal font-bold">WP · Module 4 · Topic 2 &amp; 3</span>
        <CardTitle className="font-serif text-2xl sm:text-3xl mt-1">Express.js Middleware Pipeline &amp; REST Studio</CardTitle>
        <p className="text-ink-soft text-xs sm:text-sm font-sans mt-2">
          In Express, HTTP requests travel sequentially through middleware functions <code>(req, res, next)</code>. Mutate headers or methods below to watch pipeline execution.
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-paper border border-rule font-mono text-xs">
          <div>
            <label className="block text-ink-soft uppercase text-[10px] font-bold mb-1">HTTP Method:</label>
            <select
              value={requestMethod}
              onChange={(e) => setRequestMethod(e.target.value as any)}
              className="w-full p-2 bg-card border border-ink font-bold"
            >
              <option value="GET">GET /api/courses</option>
              <option value="POST">POST /api/students</option>
              <option value="DELETE">DELETE /api/students/:id</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="block text-ink-soft uppercase text-[10px] font-bold mb-1">Authorization Header:</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={authHeader}
                onChange={(e) => setAuthHeader(e.target.value)}
                placeholder="Bearer <token>"
                className="flex-1 p-2 bg-card border border-ink text-xs font-mono"
              />
              <button
                onClick={executeApiRequest}
                className="px-4 py-2 bg-signal text-paper font-bold uppercase hover:bg-ink transition-colors shrink-0"
              >
                Send Request
              </button>
            </div>
          </div>
        </div>

        {/* Pipeline Visual Flow */}
        <div className="p-4 bg-card border border-ink space-y-3 font-mono text-xs">
          <span className="text-[10px] uppercase text-ink-soft font-bold block border-b border-rule pb-1">
            Middleware Pipeline Transit:
          </span>
          <div className="flex flex-wrap items-center gap-2 text-center">
            <div className="p-2 bg-paper border border-rule font-bold">Client Request</div>
            <ArrowRight className="h-4 w-4 text-ink-soft shrink-0" />
            <div className="p-2 bg-paper border border-ink font-bold text-signal">logger() [next]</div>
            <ArrowRight className="h-4 w-4 text-ink-soft shrink-0" />
            <div className={`p-2 border font-bold ${authHeader.includes('Bearer') ? 'bg-ok/20 border-ok text-ok' : 'bg-bad/20 border-bad text-bad'}`}>
              authMiddleware()
            </div>
            <ArrowRight className="h-4 w-4 text-ink-soft shrink-0" />
            <div className="p-2 bg-paper border border-rule font-bold">Route Controller</div>
          </div>
          <div className="text-signal font-bold text-[11px] pt-1">
            Status: {pipelineState}
          </div>
        </div>

        {/* Response JSON Readout */}
        {responseLog && (
          <div className="p-4 bg-paper border border-ink font-mono text-xs space-y-2">
            <div className="flex justify-between items-center border-b border-rule pb-1">
              <span className="text-[10px] uppercase text-ink-soft font-bold">HTTP Response Payload</span>
              <span className={`px-2 py-0.5 text-xs font-bold text-paper ${responseLog.status < 300 ? 'bg-ok' : 'bg-bad'}`}>
                HTTP {responseLog.status}
              </span>
            </div>
            <pre className="text-ink overflow-x-auto text-[11px]">{responseLog.body}</pre>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// ========================================================
// MODULE 5: PHP PDO & SQL INJECTION DEFENSE SANDBOX
// ========================================================
function WP5Playground() {
  const [usernameInput, setUsernameInput] = useState("admin")
  const [passwordInput, setPasswordInput] = useState("' OR '1'='1")
  const [usePdo, setUsePdo] = useState(false)

  // Simulated Database
  const result = useMemo(() => {
    if (!usePdo) {
      // Insecure concatenation: ' OR '1'='1 bypasses password check!
      if (passwordInput.includes("' OR '1'='1") || passwordInput.includes("' OR 1=1")) {
        return {
          success: true,
          vulnerable: true,
          message: "⚠️ EXPLOITED! SQL Injection bypassed authentication! User logged in as admin without valid credentials.",
          queryExecuted: `SELECT * FROM users WHERE username = '${usernameInput}' AND password = '${passwordInput}';`
        }
      }
      if (usernameInput === "admin" && passwordInput === "secret123") {
        return {
          success: true,
          vulnerable: false,
          message: "✓ Legitimate login with valid credentials.",
          queryExecuted: `SELECT * FROM users WHERE username = '${usernameInput}' AND password = '${passwordInput}';`
        }
      }
      return {
        success: false,
        vulnerable: false,
        message: "Invalid credentials.",
        queryExecuted: `SELECT * FROM users WHERE username = '${usernameInput}' AND password = '${passwordInput}';`
      }
    } else {
      // Secure PDO Prepared Statements
      if (usernameInput === "admin" && passwordInput === "secret123") {
        return {
          success: true,
          vulnerable: false,
          message: "✓ Secure PDO Prepared Statement validated login successfully.",
          queryExecuted: "PREPARE stmt FROM 'SELECT * FROM users WHERE username = ? AND password = ?'; EXECUTE stmt USING (:user, :pass);"
        }
      }
      return {
        success: false,
        vulnerable: false,
        message: "🛡️ Access Denied. PDO treated SQL injection input as literal strings, neutralizing malicious clauses.",
        queryExecuted: "PREPARE stmt FROM 'SELECT * FROM users WHERE username = ? AND password = ?'; EXECUTE stmt USING (:user, :pass);"
      }
    }
  }, [usernameInput, passwordInput, usePdo])

  return (
    <Card>
      <CardHeader>
        <span className="font-mono text-[10px] uppercase tracking-widest text-signal font-bold">WP · Module 5 · Topic 3 &amp; 4</span>
        <CardTitle className="font-serif text-2xl sm:text-3xl mt-1">PHP SQL Injection vs. PDO Prepared Statements</CardTitle>
        <p className="text-ink-soft text-xs sm:text-sm font-sans mt-2">
          Demonstrates why university exams emphasize PHP Data Objects (PDO). Test SQL injection payloads with naive string concatenation vs. parameter binding.
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Controls */}
          <div className="p-4 bg-paper border border-rule font-mono text-xs space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-rule">
              <span className="font-bold text-ink uppercase">Database Connector:</span>
              <div className="flex gap-2">
                <button
                  onClick={() => setUsePdo(false)}
                  className={`px-3 py-1 border text-xs font-bold transition-colors ${
                    !usePdo ? 'bg-bad text-paper border-bad' : 'bg-card text-ink border-rule'
                  }`}
                >
                  Insecure Concatenation
                </button>
                <button
                  onClick={() => setUsePdo(true)}
                  className={`px-3 py-1 border text-xs font-bold transition-colors ${
                    usePdo ? 'bg-ok text-paper border-ok' : 'bg-card text-ink border-rule'
                  }`}
                >
                  Secure PDO Parameterized
                </button>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-ink-soft uppercase text-[10px] font-bold mb-1">Username Input:</label>
                <input
                  type="text"
                  value={usernameInput}
                  onChange={(e) => setUsernameInput(e.target.value)}
                  className="w-full p-2 bg-card border border-ink text-xs font-mono"
                />
              </div>

              <div>
                <label className="block text-ink-soft uppercase text-[10px] font-bold mb-1">Password Input (Try &apos; OR &apos;1&apos;=&apos;1):</label>
                <input
                  type="text"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  className="w-full p-2 bg-card border border-ink text-xs font-mono font-bold"
                />
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  onClick={() => {
                    setUsernameInput("admin")
                    setPasswordInput("' OR '1'='1")
                  }}
                  className="px-2.5 py-1 bg-card border border-rule text-[11px] hover:border-ink"
                >
                  Load SQLi Payload
                </button>
                <button
                  onClick={() => {
                    setUsernameInput("admin")
                    setPasswordInput("secret123")
                  }}
                  className="px-2.5 py-1 bg-card border border-rule text-[11px] hover:border-ink"
                >
                  Load Valid Credentials
                </button>
              </div>
            </div>
          </div>

          {/* Database Query Result */}
          <div className="p-4 bg-card border-2 border-ink font-mono text-xs space-y-4">
            <span className="font-bold uppercase text-[10px] text-ink block border-b border-rule pb-2">
              SQL Engine Execution Trace
            </span>

            <div className="p-3 bg-paper border border-rule overflow-x-auto text-[11px]">
              <span className="text-[10px] text-ink-soft block font-bold mb-1">Executed SQL String:</span>
              <code className="text-ink font-bold">{result.queryExecuted}</code>
            </div>

            <div className={`p-4 border font-bold text-xs space-y-1 ${
              result.vulnerable ? 'bg-bad/15 border-bad text-bad' : result.success ? 'bg-ok/15 border-ok text-ok' : 'bg-paper border-rule text-ink-soft'
            }`}>
              <span>{result.message}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// ========================================================
// MODULE 6: FULL-STACK 3-TIER & JWT INSPECTOR
// ========================================================
function WP6Playground() {
  const [studentRoll, setStudentRoll] = useState("21BCP042")
  const [role, setRole] = useState<"student" | "faculty">("student")

  const headerObj = { alg: "HS256", typ: "JWT" }
  const payloadObj = {
    sub: studentRoll,
    name: studentRoll === "21BCP042" ? "Dev Shah" : "Student User",
    role: role,
    iat: 1770000000,
    exp: 1770086400,
    department: "Computer Engineering (CMPN)"
  }

  // Pseudo-base64 encoder
  const encodedHeader = btoa(JSON.stringify(headerObj))
  const encodedPayload = btoa(JSON.stringify(payloadObj))
  const signature = "c089f2a4de8b7123fa99b41"

  return (
    <Card>
      <CardHeader>
        <span className="font-mono text-[10px] uppercase tracking-widest text-signal font-bold">WP · Module 6 · Topic 1 &amp; 2</span>
        <CardTitle className="font-serif text-2xl sm:text-3xl mt-1">Full-Stack Architecture &amp; JWT Token Inspector</CardTitle>
        <p className="text-ink-soft text-xs sm:text-sm font-sans mt-2">
          Modern full-stack web applications use stateless JSON Web Tokens (JWT) for authentication across microservices. Inspect the 3 token segments below.
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-paper border border-rule font-mono text-xs">
          <div>
            <label className="block text-ink-soft uppercase text-[10px] font-bold mb-1">Subject Roll Number:</label>
            <input
              type="text"
              value={studentRoll}
              onChange={(e) => setStudentRoll(e.target.value)}
              className="w-full p-2 bg-card border border-ink text-xs font-mono"
            />
          </div>
          <div>
            <label className="block text-ink-soft uppercase text-[10px] font-bold mb-1">Authenticated Role:</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as any)}
              className="w-full p-2 bg-card border border-ink text-xs font-mono font-bold"
            >
              <option value="student">student (Standard Access)</option>
              <option value="faculty">faculty (Elevated Gradebook Access)</option>
            </select>
          </div>
        </div>

        {/* Encoded JWT String with 3 Colors */}
        <div className="p-4 bg-card border-2 border-ink font-mono text-xs space-y-2">
          <span className="text-[10px] uppercase text-ink-soft font-bold block">Bearer Authorization Token:</span>
          <div className="p-3 bg-paper border border-rule break-all font-bold text-xs">
            <span className="text-bad">{encodedHeader}</span>
            <span className="text-ink">.</span>
            <span className="text-warn">{encodedPayload}</span>
            <span className="text-ink">.</span>
            <span className="text-ok">{signature}</span>
          </div>
        </div>

        {/* 3 Decoded Chambers */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
          <div className="p-4 bg-paper border border-bad space-y-2">
            <span className="text-bad font-bold uppercase text-[10px] block border-b border-rule pb-1">1. Header (Algorithm)</span>
            <pre className="text-ink text-[11px]">{JSON.stringify(headerObj, null, 2)}</pre>
          </div>

          <div className="p-4 bg-paper border border-warn space-y-2">
            <span className="text-warn font-bold uppercase text-[10px] block border-b border-rule pb-1">2. Payload (Claims)</span>
            <pre className="text-ink text-[11px]">{JSON.stringify(payloadObj, null, 2)}</pre>
          </div>

          <div className="p-4 bg-paper border border-ok space-y-2">
            <span className="text-ok font-bold uppercase text-[10px] block border-b border-rule pb-1">3. Verify Signature</span>
            <p className="text-ink-soft text-[11px] font-sans">
              HMACSHA256(<br />
              &nbsp;&nbsp;base64UrlEncode(header) + &quot;.&quot; +<br />
              &nbsp;&nbsp;base64UrlEncode(payload),<br />
              &nbsp;&nbsp;secretKey<br />
              )
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
