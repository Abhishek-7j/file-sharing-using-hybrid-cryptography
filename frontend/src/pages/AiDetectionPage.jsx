import React from 'react';
import { Cpu, ShieldCheck, Activity, ArrowRight, Zap, CheckCircle2 } from 'lucide-react';
import StatusBadge from '../components/StatusBadge';

export default function AiDetectionPage({ tracker }) {
  const { confidenceScore = 98.7, status = "TRUSTED" } = tracker || {};

  const pipelineSteps = [
    { title: 'USER ACTIVITY', desc: 'Passive keystroke, mouse & scroll data collection' },
    { title: 'FEATURE EXTRACTION', desc: 'Vectors computed: Dwell, Flight, Velocity, Curvature' },
    { title: 'BEHAVIORAL ANALYSIS', desc: 'Exponential distance kernel & ML model scoring' },
    { title: 'IDENTITY DNA COMPARISON', desc: 'Cross-evaluated against registered baseline' },
    { title: 'CONFIDENCE SCORE', desc: `Weighted similarity output: ${confidenceScore.toFixed(1)}%` },
    { title: 'SECURITY DECISION', desc: `Classification state: ${status}` }
  ];

  return (
    <div className="space-y-8">
      {/* Title & Status Summary Cards */}
      <div className="p-6 rounded-3xl glass-panel border border-cyan-500/30 shadow-hud space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950 border border-cyan-500/30 text-xs font-mono text-cyan-300">
          <Cpu className="w-3.5 h-3.5 text-cyan-400" />
          <span>REAL-TIME INFERENCE ENGINE</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black font-mono tracking-tight text-slate-100 uppercase">
          AI BEHAVIORAL DETECTION
        </h1>
        <p className="text-xs font-mono text-slate-400">
          Machine learning pipeline continuously calculating distance matrices across biometric behavioral signals.
        </p>
      </div>

      {/* Model Status Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="glass-panel p-5 rounded-2xl border border-cyan-500/20 text-center space-y-1">
          <div className="text-[11px] font-mono text-slate-400 uppercase">MODEL STATUS</div>
          <div className="text-xl font-extrabold font-mono text-emerald-400 flex items-center justify-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>ACTIVE</span>
          </div>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-cyan-500/20 text-center space-y-1">
          <div className="text-[11px] font-mono text-slate-400 uppercase">CURRENT CLASSIFICATION</div>
          <div className="flex justify-center pt-1">
            <StatusBadge status={status} />
          </div>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-cyan-500/20 text-center space-y-1">
          <div className="text-[11px] font-mono text-slate-400 uppercase">BEHAVIORAL SIMILARITY</div>
          <div className="text-2xl font-extrabold font-mono text-cyan-400">
            {confidenceScore.toFixed(1)}%
          </div>
        </div>
      </div>

      {/* Analysis Pipeline */}
      <div className="rounded-2xl glass-panel p-6 border border-cyan-500/20 shadow-hud space-y-6">
        <h3 className="text-sm font-mono font-bold text-slate-200 uppercase flex items-center gap-2">
          <Zap className="w-4 h-4 text-cyan-400" /> AI BEHAVIORAL DETECTION PIPELINE
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {pipelineSteps.map((step, idx) => (
            <div key={idx} className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2 relative">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-cyan-400 font-bold">STEP 0{idx + 1}</span>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              </div>
              <h4 className="text-xs font-mono font-bold text-slate-100 uppercase">{step.title}</h4>
              <p className="text-[11px] text-slate-400 leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
