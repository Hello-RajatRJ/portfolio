import React, { useState, useMemo } from 'react';
import {
  X,
  ArrowRight,
  ArrowLeft,
  Play,
  Cpu,
  Layers,
  Terminal,
  Sparkles,
  CheckCircle2,
  Database,
  Search,
} from 'lucide-react';
import {
  AI_DEPARTMENT_MAP,
  AI_DEPARTMENTS,
  runLiveQuerySimulation,
} from '../data/aiFactoryData';
import { AIFactoryMachinePreview } from './AIFactoryMachinePreview';
import type { FactoryOutputFormat } from '../types';

interface AIFactoryModalProps {
  deptId: string;
  factoryQuery: string;
  factoryOutputFormat: FactoryOutputFormat;
  onSelectDept: (deptId: string | null) => void;
  onUpdateQuery: (q: string) => void;
  onUpdateOutputFormat: (fmt: FactoryOutputFormat) => void;
}

const SAMPLE_VECTOR_RECORDS = [
  {
    vendor: 'Pinecone',
    id: 'vec_pc_9042',
    index: 'ai-factory-prod (1536d · cosine)',
    vector: '[0.21, -0.48, 0.91, 0.32, -0.14, 0.67]',
    metadata: '{ "dept": "rag-assembly", "verified": true, "tokens": 412 }',
  },
  {
    vendor: 'Qdrant',
    id: 'vec_qd_3118',
    index: 'hnsw_ef128 · quantized_int8',
    vector: '[0.44, -0.12, 0.78, -0.51, 0.39, 0.22]',
    metadata: '{ "dept": "llm-core", "layer": "multi-head-attn", "score": 0.96 }',
  },
  {
    vendor: 'Weaviate',
    id: 'vec_wv_7721',
    index: 'HybridClass · BM25 + Vector',
    vector: '[-0.31, 0.64, 0.29, 0.85, -0.42, 0.11]',
    metadata: '{ "dept": "agent-tools", "tool": "sql_query", "tenant": "ops" }',
  },
  {
    vendor: 'Chroma',
    id: 'vec_ch_1094',
    index: 'local-dev-collection · L2',
    vector: '[0.18, 0.72, -0.25, 0.49, 0.61, -0.33]',
    metadata: '{ "dept": "safety-qc", "guard": "grounding_v2", "status": "pass" }',
  },
];

export const AIFactoryModal: React.FC<AIFactoryModalProps> = ({
  deptId,
  factoryQuery,
  factoryOutputFormat,
  onSelectDept,
  onUpdateQuery,
  onUpdateOutputFormat,
}) => {
  const dept = AI_DEPARTMENT_MAP[deptId];
  const [simulating, setSimulating] = useState(false);
  const [activeStepIdx, setActiveStepIdx] = useState(0);

  // Interactive labs state
  const [chunkMode, setChunkMode] = useState<'fixed' | 'semantic' | 'recursive'>('semantic');
  const [embedModel, setEmbedModel] = useState('text-embedding-3-large (3072D)');
  const [selectedRecordIdx, setSelectedRecordIdx] = useState(0);
  const [draftQuery, setDraftQuery] = useState(factoryQuery);

  const querySim = useMemo(() => runLiveQuerySimulation(factoryQuery), [factoryQuery]);

  if (!dept) return null;

  const prevDept = dept.prevDeptId ? AI_DEPARTMENT_MAP[dept.prevDeptId] : null;
  const nextDept = dept.nextDeptId ? AI_DEPARTMENT_MAP[dept.nextDeptId] : null;

  const handleRunHowItWorks = () => {
    setSimulating(true);
    setActiveStepIdx((i) => (i + 1) % dept.howItWorks.length);
    setTimeout(() => setSimulating(false), 2600);
  };

  const handleSubmitLiveQuery = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateQuery(draftQuery);
    setSimulating(true);
    setTimeout(() => setSimulating(false), 1800);
  };

  return (
    <div
      className="fixed inset-0 z-[1200] flex items-center justify-center p-3 md:p-6 bg-black/75 backdrop-blur-md"
      style={{ pointerEvents: 'auto' }}
      onClick={() => onSelectDept(null)}
    >
      <div
        className="w-full max-w-6xl max-h-[90vh] flex flex-col rounded-2xl border border-red-500/45 bg-gradient-to-br from-[#0e0f14]/95 via-[#130a0c]/95 to-[#090a0d]/95 text-orange-50 shadow-[0_0_55px_rgba(220,38,38,0.35)] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Glass Holographic Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-red-500/30 bg-black/50">
          <div className="flex items-center gap-3">
            <span className="px-2.5 py-1 rounded bg-red-600 text-white font-['Orbitron'] font-black text-xs tracking-widest">
              DEPT {dept.code}/15
            </span>
            <div>
              <h2 className="font-['Orbitron'] font-bold text-base md:text-lg tracking-wider text-white">
                {dept.name}
              </h2>
              <p className="text-[11px] font-mono text-orange-300/90">
                AI INTELLIGENCE FACTORY · PRODUCTION PIPELINE STAGE {dept.code}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onSelectDept(null);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-red-500/40 bg-red-950/50 hover:bg-red-600/30 text-xs font-mono text-red-200 transition cursor-pointer"
          >
            <X size={14} />
            <span>CLOSE [ESC]</span>
          </button>
        </div>

        {/* Main Split Content: Left 3D Machine / Right Engineering Deep-Dive */}
        <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
          {/* LEFT SIDE: Live 3D Animated Machine Viewport & Telemetry */}
          <div className="lg:col-span-5 flex flex-col border-b lg:border-b-0 lg:border-r border-red-500/25 bg-[#090a0f]/80 p-4 gap-3">
            <div className="relative h-60 lg:h-72 rounded-xl border border-red-500/35 overflow-hidden bg-black">
              <AIFactoryMachinePreview deptNumber={dept.number} simulating={simulating} />
              <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded bg-black/75 border border-red-500/40 text-[10px] font-mono text-orange-300">
                {simulating ? '● PROCESS SIMULATION ACTIVE' : '● REAL-TIME MACHINE PREVIEW'}
              </div>
              <button
                onClick={handleRunHowItWorks}
                className="absolute bottom-2.5 right-2.5 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-500 hover:to-orange-400 text-white text-xs font-['Orbitron'] font-bold shadow-lg transition cursor-pointer"
              >
                <Play size={12} />
                {simulating ? 'PROCESSING STEP...' : 'HOW IT WORKS'}
              </button>
            </div>

            {/* Live Simulated Metrics Grid */}
            <div className="grid grid-cols-3 gap-2">
              {dept.liveMetrics.map((m) => (
                <div
                  key={m.label}
                  className="p-2.5 rounded-lg border border-red-500/25 bg-red-950/20 text-center"
                >
                  <div className="text-[9px] font-mono text-orange-300/80 tracking-wider">{m.label}</div>
                  <div className="text-xs font-bold font-mono text-white mt-0.5">{m.value}</div>
                </div>
              ))}
            </div>

            {/* Technical Architecture Flow Diagram */}
            <div className="p-3 rounded-xl border border-red-500/25 bg-black/40">
              <div className="flex items-center gap-1.5 text-[11px] font-['Orbitron'] font-bold text-orange-400 mb-2">
                <Layers size={13} />
                TECHNICAL ARCHITECTURE DIAGRAM
              </div>
              <div className="space-y-1.5">
                {dept.architectureNodes.map((node, ni) => (
                  <div key={node.title} className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-red-600/80 text-white text-[10px] font-mono flex items-center justify-center shrink-0">
                      {ni + 1}
                    </span>
                    <div className="flex-1 rounded border border-white/10 bg-white/5 px-2.5 py-1.5">
                      <div className="text-[11px] font-bold text-white">{node.title}</div>
                      <div className="text-[10px] font-mono text-zinc-300">{node.detail}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Covered Sub-Processes Tags */}
            <div className="flex flex-wrap gap-1.5">
              {dept.subProcesses.map((sp) => (
                <span
                  key={sp}
                  className="px-2 py-0.5 rounded bg-red-950/60 border border-red-500/35 text-[10px] font-mono text-orange-200"
                >
                  {sp}
                </span>
              ))}
            </div>
          </div>

          {/* RIGHT SIDE: Complete Educational Breakdown & Interactive Department Labs */}
          <div className="lg:col-span-7 overflow-y-auto p-5 space-y-4">
            {/* What It Does & Why It Is Needed */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="p-3.5 rounded-xl border border-red-500/25 bg-white/[0.03]">
                <div className="text-[11px] font-['Orbitron'] font-bold text-red-400 mb-1">WHAT IT DOES</div>
                <p className="text-xs leading-relaxed text-zinc-200">{dept.whatItDoes}</p>
              </div>
              <div className="p-3.5 rounded-xl border border-orange-500/25 bg-white/[0.03]">
                <div className="text-[11px] font-['Orbitron'] font-bold text-orange-400 mb-1">WHY IT IS NEEDED</div>
                <p className="text-xs leading-relaxed text-zinc-200">{dept.whyNeeded}</p>
              </div>
            </div>

            {/* How It Works (interactive highlighted steps) */}
            <div className="p-3.5 rounded-xl border border-red-500/30 bg-red-950/15">
              <div className="flex items-center justify-between mb-2">
                <span className="flex items-center gap-1.5 text-[11px] font-['Orbitron'] font-bold text-orange-300">
                  <Cpu size={13} />
                  HOW IT WORKS (MECHANICAL & ALGORITHMIC PIPELINE)
                </span>
                <button
                  onClick={handleRunHowItWorks}
                  className="text-[10px] font-mono px-2 py-0.5 rounded bg-orange-500/20 border border-orange-400/40 text-orange-300 hover:bg-orange-500/35 cursor-pointer"
                >
                  STEP NEXT →
                </button>
              </div>
              <ol className="space-y-1.5">
                {dept.howItWorks.map((step, idx) => (
                  <li
                    key={idx}
                    onClick={() => setActiveStepIdx(idx)}
                    className={`text-xs p-2 rounded-lg border cursor-pointer transition ${
                      activeStepIdx === idx
                        ? 'border-orange-400/60 bg-orange-500/15 text-white font-medium'
                        : 'border-white/5 bg-black/25 text-zinc-300'
                    }`}
                  >
                    <span className="font-mono text-orange-400 mr-2">0{idx + 1}.</span>
                    {step}
                  </li>
                ))}
              </ol>
            </div>

            {/* INTERACTIVE LAB FOR DEPT 05: Chunking Switcher */}
            {dept.number === 5 && (
              <div className="p-3.5 rounded-xl border border-orange-500/40 bg-black/45 space-y-2">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <span className="text-[11px] font-['Orbitron'] font-bold text-orange-400">
                    INTERACTIVE CHUNKING SIMULATOR
                  </span>
                  <div className="flex gap-1.5">
                    {(['fixed', 'semantic', 'recursive'] as const).map((m) => (
                      <button
                        key={m}
                        onClick={() => setChunkMode(m)}
                        className={`px-2 py-1 rounded text-[10px] font-mono uppercase cursor-pointer ${
                          chunkMode === m
                            ? 'bg-red-600 text-white'
                            : 'bg-white/10 text-zinc-300 hover:bg-white/20'
                        }`}
                      >
                        {m}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="font-mono text-[11px] bg-black/60 border border-white/10 rounded p-2.5 text-orange-200 space-y-1">
                  {chunkMode === 'fixed' && (
                    <>
                      <div>[chk_01 | 512 tok | overlap: 64] "...Multi-head attention projects Q, K, V..."</div>
                      <div>[chk_02 | 512 tok | overlap: 64] "...Feed-forward blocks apply GeLU scaling..."</div>
                    </>
                  )}
                  {chunkMode === 'semantic' && (
                    <>
                      <div>[sem_01 | boundary Δcos=0.41 | topic: Attention] "Transformer attention weights global context."</div>
                      <div>[sem_02 | boundary Δcos=0.39 | topic: Safety QC] "Validation cross-checks claims vs RAG chunks."</div>
                    </>
                  )}
                  {chunkMode === 'recursive' && (
                    <>
                      <div>[rec_01 | split: ## Header -&gt; Paragraph] "## Vector Indexing\nHNSW organizes nodes..."</div>
                      <div>[rec_02 | split: Sentence -&gt; 64-tok overlap] "Metadata filters prune records in 4ms."</div>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* INTERACTIVE LAB FOR DEPT 06: Embedding Model Selector */}
            {dept.number === 6 && (
              <div className="p-3.5 rounded-xl border border-orange-500/40 bg-black/45 space-y-2">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <span className="text-[11px] font-['Orbitron'] font-bold text-orange-400">
                    CONFIGURABLE EMBEDDING ENCODER
                  </span>
                  <div className="flex gap-1.5 flex-wrap">
                    {[
                      'text-embedding-3-large (3072D)',
                      'bge-large-en-v1.5 (1024D)',
                      'voyage-3 (1024D)',
                    ].map((mdl) => (
                      <button
                        key={mdl}
                        onClick={() => setEmbedModel(mdl)}
                        className={`px-2 py-1 rounded text-[10px] font-mono cursor-pointer ${
                          embedModel === mdl
                            ? 'bg-red-600 text-white'
                            : 'bg-white/10 text-zinc-300 hover:bg-white/20'
                        }`}
                      >
                        {mdl.split(' ')[0]}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="font-mono text-[11px] bg-black/60 border border-white/10 rounded p-2.5 text-amber-200">
                  <div>MODEL ACTIVE: {embedModel}</div>
                  <div className="text-zinc-300 mt-1">
                    Vector("AI Agent calls SQL tool") = [0.21, -0.48, 0.91, 0.32, -0.17, ...]
                  </div>
                  <div className="text-emerald-400 mt-1">
                    Cosine("AI Agent calls SQL tool", "Function calling database query") = 0.93 (HIGH CLUSTER MATCH)
                  </div>
                </div>
              </div>
            )}

            {/* INTERACTIVE LAB FOR DEPT 07: Vector Record Storage Inspector */}
            {dept.number === 7 && (
              <div className="p-3.5 rounded-xl border border-orange-500/40 bg-black/45 space-y-2">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <span className="flex items-center gap-1.5 text-[11px] font-['Orbitron'] font-bold text-orange-400">
                    <Database size={13} />
                    INSPECT VECTOR DB STORAGE RECORD
                  </span>
                  <div className="flex gap-1.5">
                    {SAMPLE_VECTOR_RECORDS.map((r, ri) => (
                      <button
                        key={r.vendor}
                        onClick={() => setSelectedRecordIdx(ri)}
                        className={`px-2 py-1 rounded text-[10px] font-mono cursor-pointer ${
                          selectedRecordIdx === ri
                            ? 'bg-red-600 text-white'
                            : 'bg-white/10 text-zinc-300 hover:bg-white/20'
                        }`}
                      >
                        {r.vendor}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="font-mono text-[11px] bg-black/60 border border-white/10 rounded p-2.5 text-zinc-200 space-y-1">
                  <div className="text-orange-300">
                    RECORD ID: {SAMPLE_VECTOR_RECORDS[selectedRecordIdx].id} ·{' '}
                    {SAMPLE_VECTOR_RECORDS[selectedRecordIdx].index}
                  </div>
                  <div>VALUES: {SAMPLE_VECTOR_RECORDS[selectedRecordIdx].vector}</div>
                  <div className="text-amber-300">META: {SAMPLE_VECTOR_RECORDS[selectedRecordIdx].metadata}</div>
                </div>
              </div>
            )}

            {/* INTERACTIVE LAB FOR DEPT 08: Live Interactive Query Reception Terminal */}
            {dept.number === 8 && (
              <div className="p-3.5 rounded-xl border border-red-500/50 bg-red-950/25 space-y-2.5">
                <div className="flex items-center gap-1.5 text-[11px] font-['Orbitron'] font-bold text-orange-300">
                  <Search size={13} />
                  INTERACTIVE USER QUERY PROCESSING TERMINAL (LIVE STATE ACROSS FACTORY)
                </div>
                <form onSubmit={handleSubmitLiveQuery} className="flex gap-2">
                  <input
                    type="text"
                    value={draftQuery}
                    onChange={(e) => setDraftQuery(e.target.value)}
                    placeholder="Ask the AI Factory a question..."
                    className="flex-1 px-3 py-1.5 rounded-lg bg-black/70 border border-red-500/45 text-xs text-white font-mono focus:outline-none focus:border-orange-400"
                  />
                  <button
                    type="submit"
                    className="px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white text-xs font-['Orbitron'] font-bold cursor-pointer"
                  >
                    DISPATCH QUERY
                  </button>
                </form>
                <div className="grid grid-cols-1 gap-1.5 text-[11px] font-mono bg-black/60 p-2.5 rounded border border-white/10">
                  <div><span className="text-orange-400">1. ORIGINAL QUERY:</span> "{querySim.originalQuery}"</div>
                  <div><span className="text-orange-400">2. PREPROCESSED:</span> "{querySim.preprocessedQuery}" [{querySim.detectedIntents.join(', ')}]</div>
                  <div><span className="text-orange-400">3. QUERY EMBEDDING:</span> [{querySim.queryVector.join(', ')}, ...]</div>
                  <div><span className="text-orange-400">4. SEARCH REQUEST:</span> HNSW ANN Cosine (Top-K=20) + Metadata Filter</div>
                  <div className="text-emerald-400 flex items-center gap-1.5">
                    <CheckCircle2 size={12} /> 5. RETRIEVAL STATUS: 3 TOP RERANKED CHUNKS STREAMING TO DEPT 09 & 14!
                  </div>
                </div>
              </div>
            )}

            {/* LIVE RETRIEVAL & OUTPUT FORMAT PREVIEW IN DEPTS 09, 10, 14 */}
            {(dept.number === 9 || dept.number === 14) && (
              <div className="p-3.5 rounded-xl border border-orange-500/40 bg-black/45 space-y-2">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <span className="flex items-center gap-1.5 text-[11px] font-['Orbitron'] font-bold text-orange-400">
                    <Sparkles size={13} />
                    {dept.number === 9 ? 'LIVE COSINE RERANK MATCHES FOR ACTIVE QUERY' : 'OUTPUT FORMAT SYNTHESIZER (UPDATES 3D WALL)'}
                  </span>
                  {dept.number === 14 && (
                    <div className="flex gap-1">
                      {(['text', 'json', 'code', 'summary', 'audio'] as FactoryOutputFormat[]).map((fmt) => (
                        <button
                          key={fmt}
                          onClick={() => onUpdateOutputFormat(fmt)}
                          className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase cursor-pointer ${
                            factoryOutputFormat === fmt
                              ? 'bg-red-600 text-white'
                              : 'bg-white/10 text-zinc-300 hover:bg-white/20'
                          }`}
                        >
                          {fmt}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                {dept.number === 9 ? (
                  <div className="space-y-1.5 font-mono text-[11px]">
                    {querySim.retrievedChunks.map((ch) => (
                      <div key={ch.id} className="p-2 rounded bg-black/60 border border-white/10">
                        <div className="text-orange-300">{ch.id} · {ch.source} · COSINE: {ch.score}</div>
                        <div className="text-zinc-300 mt-0.5">{ch.snippet}</div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <pre className="p-2.5 rounded bg-black/70 border border-white/10 text-[11px] font-mono text-orange-100 whitespace-pre-wrap overflow-x-auto">
                    {querySim.outputsByFormat[factoryOutputFormat]}
                  </pre>
                )}
              </div>
            )}

            {/* Sample Input & Sample Output + Technologies + Real-World Example */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="p-3 rounded-xl border border-white/10 bg-black/50">
                <div className="flex items-center gap-1 text-[10px] font-mono text-orange-400 mb-1">
                  <Terminal size={12} /> EXAMPLE INPUT
                </div>
                <pre className="text-[11px] font-mono text-zinc-200 whitespace-pre-wrap break-all">
                  {dept.exampleInput}
                </pre>
              </div>
              <div className="p-3 rounded-xl border border-white/10 bg-black/50">
                <div className="flex items-center gap-1 text-[10px] font-mono text-emerald-400 mb-1">
                  <Terminal size={12} /> EXAMPLE OUTPUT
                </div>
                <pre className="text-[11px] font-mono text-emerald-200 whitespace-pre-wrap break-all">
                  {dept.exampleOutput}
                </pre>
              </div>
            </div>

            <div className="p-3.5 rounded-xl border border-white/10 bg-white/[0.02]">
              <div className="text-[11px] font-['Orbitron'] font-bold text-orange-300 mb-1">REAL-WORLD EXAMPLE</div>
              <p className="text-xs text-zinc-300 mb-2.5">{dept.realWorldExample}</p>
              <div className="flex flex-wrap gap-1.5">
                {dept.technologies.map((tech) => (
                  <span
                    key={tech}
                    className="px-2 py-0.5 rounded bg-white/10 border border-white/15 text-[10px] font-mono text-white"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* BOTTOM: Connected Previous & Next Pipeline Stage Navigation */}
        <div className="flex items-center justify-between gap-3 px-5 py-3 border-t border-red-500/30 bg-black/65">
          <button
            onClick={() => prevDept && onSelectDept(prevDept.id)}
            disabled={!prevDept}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-red-500/35 bg-white/5 hover:bg-red-600/25 disabled:opacity-35 text-xs font-mono text-orange-200 cursor-pointer transition"
          >
            <ArrowLeft size={14} />
            {prevDept ? `PREV: ${prevDept.code} ${prevDept.shortName}` : 'PIPELINE START'}
          </button>

          {/* Compact 15-Stage Pipeline Strip */}
          <div className="hidden md:flex items-center gap-1">
            {AI_DEPARTMENTS.map((d) => (
              <button
                key={d.id}
                onClick={() => onSelectDept(d.id)}
                title={`${d.code} · ${d.name}`}
                className={`w-6 h-6 rounded text-[10px] font-mono font-bold cursor-pointer transition ${
                  d.id === dept.id
                    ? 'bg-red-600 text-white shadow-[0_0_10px_#ef4444]'
                    : 'bg-white/10 text-zinc-400 hover:bg-orange-500/30 hover:text-white'
                }`}
              >
                {d.code}
              </button>
            ))}
          </div>

          <button
            onClick={() => nextDept && onSelectDept(nextDept.id)}
            disabled={!nextDept}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-500 hover:to-orange-400 disabled:opacity-35 text-xs font-['Orbitron'] font-bold text-white cursor-pointer transition"
          >
            {nextDept ? `NEXT PROCESS: ${nextDept.code} ${nextDept.shortName}` : 'END OF PIPELINE'}
            <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIFactoryModal;

