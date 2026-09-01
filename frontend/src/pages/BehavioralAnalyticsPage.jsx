import React, { useState } from 'react';
import BehavioralChart from '../components/BehavioralChart';
import { BarChart3, Calendar, CheckCircle2, AlertTriangle, ShieldCheck } from 'lucide-react';

export default function BehavioralAnalyticsPage() {
  const [timeframe, setTimeframe] = useState('Today');

  return (
    <div className="space-y-8">
      {/* Title & Timeframe Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl glass-panel border border-cyan-500/30 shadow-hud">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950 border border-cyan-500/30 text-xs font-mono text-cyan-300">
            <BarChart3 className="w-3.5 h-3.5 text-cyan-400" />
            <span>HISTORICAL ANALYTICS HUD</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black font-mono tracking-tight text-slate-100 uppercase">
            BEHAVIORAL ANALYTICS
          </h1>
        </div>

        {/* Timeframe Selector */}
        <div className="flex items-center gap-1.5 p-1.5 rounded-xl bg-slate-900 border border-slate-800 self-start sm:self-auto">
          {['Today', 'Week', 'Month'].map((tf) => (
            <button
              key={tf}
              onClick={() => setTimeframe(tf)}
              className={`px-4 py-2 rounded-lg font-mono text-xs font-bold transition-all ${
                timeframe === tf
                  ? 'bg-cyan-500 text-slate-950 shadow-cyan-glow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {tf}
            </button>
          ))}
        </div>
      </div>

      {/* 4 Summary Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="glass-panel p-5 rounded-2xl border border-cyan-500/20 space-y-2">
          <div className="text-[11px] font-mono text-slate-400 uppercase">Average Confidence</div>
          <div className="text-3xl font-extrabold font-mono text-cyan-400">98.1%</div>
          <div className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" /> Optimal range
          </div>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-cyan-500/20 space-y-2">
          <div className="text-[11px] font-mono text-slate-400 uppercase">Lowest Confidence</div>
          <div className="text-3xl font-extrabold font-mono text-amber-400">91.4%</div>
          <div className="text-[10px] font-mono text-amber-400 flex items-center gap-1">
            <AlertTriangle className="w-3 h-3" /> Minor variance spike
          </div>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-cyan-500/20 space-y-2">
          <div className="text-[11px] font-mono text-slate-400 uppercase">Suspicious Events</div>
          <div className="text-3xl font-extrabold font-mono text-rose-400">2</div>
          <div className="text-[10px] font-mono text-rose-400">Logged & Investigated</div>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-cyan-500/20 space-y-2">
          <div className="text-[11px] font-mono text-slate-400 uppercase">Verified Sessions</div>
          <div className="text-3xl font-extrabold font-mono text-emerald-400">27</div>
          <div className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
            <ShieldCheck className="w-3 h-3" /> 100% Protected
          </div>
        </div>
      </div>

      {/* Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <BehavioralChart title="TYPING SPEED & INTERVAL VARIANCE" color="#00f0ff" dataKey="confidence" />
        <BehavioralChart title="MOUSE VELOCITY & DISTANCE TRAJECTORY" color="#3b82f6" dataKey="confidence" />
      </div>
    </div>
  );
}
