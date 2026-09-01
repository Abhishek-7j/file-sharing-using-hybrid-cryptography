import React from 'react';
import { useAuth } from '../hooks/useAuth';
import ConfidenceGauge from '../components/ConfidenceGauge';
import DashboardCard from '../components/DashboardCard';
import BehavioralChart from '../components/BehavioralChart';
import ActivityTimeline from '../components/ActivityTimeline';
import SecurityAlert from '../components/SecurityAlert';
import StatusBadge from '../components/StatusBadge';
import { ShieldCheck, Zap, AlertTriangle, ShieldAlert, Sparkles, RefreshCw } from 'lucide-react';

export default function DashboardPage({ tracker }) {
  const { user } = useAuth();
  const username = user?.username || 'Arjun';

  const {
    confidenceScore,
    status,
    typingMatch,
    mouseMatch,
    clickMatch,
    scrollMatch,
    activeAlert,
    simulateAnomaly,
    isSimulatingAnomaly
  } = tracker;

  return (
    <div className="space-y-8">
      {/* Top Welcome Header & Live Identity Status */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 p-6 rounded-3xl glass-panel border border-cyan-500/30 shadow-hud">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950 border border-cyan-500/30 text-xs font-mono text-cyan-300">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>CONTINUOUS SESSION MONITORING ACTIVE</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black font-mono tracking-tight text-slate-100 uppercase">
            Welcome back, <span className="text-cyan-400">{username}</span>
          </h1>
          <p className="text-xs font-mono text-slate-400">
            Identity DNA continuous authentication is actively verifying your session biometrics.
          </p>
        </div>

        <div className="flex items-center gap-4 bg-slate-950/80 p-4 rounded-2xl border border-slate-800">
          <div>
            <div className="text-[10px] font-mono text-slate-400 uppercase">Identity Status</div>
            <div className="text-2xl font-extrabold font-mono text-cyan-400">{confidenceScore.toFixed(1)}%</div>
          </div>
          <StatusBadge status={status} />
        </div>
      </div>

      {/* Security Alert Banner (if active) */}
      <SecurityAlert alert={activeAlert} />

      {/* Demo Viva Anomaly Simulation Bar */}
      <div className="p-4 rounded-2xl glass-panel border border-cyan-500/20 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-xs font-mono text-slate-300">
          <Zap className="w-4 h-4 text-cyan-400" />
          <span>VIVA DEMO / ANOMALY SIMULATION MODE:</span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => simulateAnomaly('TRUSTED')}
            className={`px-3 py-1.5 rounded-xl font-mono text-xs font-bold transition-all ${
              status === 'TRUSTED' && !isSimulatingAnomaly
                ? 'bg-emerald-500 text-slate-950 shadow-cyan-glow'
                : 'bg-slate-900 border border-slate-700 text-emerald-400 hover:bg-slate-800'
            }`}
          >
            🟢 TRUSTED (98.7%)
          </button>

          <button
            onClick={() => simulateAnomaly('MONITORING')}
            className={`px-3 py-1.5 rounded-xl font-mono text-xs font-bold transition-all ${
              status === 'MONITORING'
                ? 'bg-amber-500 text-slate-950 shadow-cyan-glow'
                : 'bg-slate-900 border border-slate-700 text-amber-400 hover:bg-slate-800'
            }`}
          >
            🟡 MONITORING (84.2%)
          </button>

          <button
            onClick={() => simulateAnomaly('SUSPICIOUS')}
            className={`px-3 py-1.5 rounded-xl font-mono text-xs font-bold transition-all ${
              status === 'SUSPICIOUS'
                ? 'bg-rose-500 text-slate-950 shadow-rose-glow'
                : 'bg-slate-900 border border-slate-700 text-rose-400 hover:bg-slate-800'
            }`}
          >
            🔴 SUSPICIOUS (64.3%)
          </button>
        </div>
      </div>

      {/* 4 Major Behavioral Match Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <DashboardCard
          type="typing"
          title="TYPING MATCH"
          score={typingMatch}
          description="Current typing behavior closely matches your registered pattern."
        />
        <DashboardCard
          type="mouse"
          title="MOUSE MATCH"
          score={mouseMatch}
          description="Mouse movement is consistent with your normal behavior."
        />
        <DashboardCard
          type="click"
          title="CLICK MATCH"
          score={clickMatch}
          description="Click behavior matches your Identity DNA."
        />
        <DashboardCard
          type="scroll"
          title="SCROLL MATCH"
          score={scrollMatch}
          description="Scrolling behavior is within the expected range."
        />
      </div>

      {/* Analytics Chart & Gauge Split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <BehavioralChart title="CONTINUOUS BEHAVIORAL CONFIDENCE TRAJECTORY" />
        </div>
        <div>
          <ConfidenceGauge confidence={confidenceScore} status={status} />
        </div>
      </div>

      {/* Activity Timeline Stream */}
      <ActivityTimeline />
    </div>
  );
}
