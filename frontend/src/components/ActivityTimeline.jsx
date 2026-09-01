import React from 'react';
import { Activity, ShieldCheck, Cpu, AlertTriangle } from 'lucide-react';

export default function ActivityTimeline() {
  const events = [
    { time: '11:15 AM', label: 'Continuous Telemetry Evaluated', score: '98.7%', status: 'TRUSTED' },
    { time: '11:10 AM', label: 'Keystroke Dwell Time Matched', score: '97.4%', status: 'TRUSTED' },
    { time: '11:05 AM', label: 'Mouse Trajectory Distance Verified', score: '96.8%', status: 'TRUSTED' },
    { time: '11:00 AM', label: 'Scroll Impulse Cadence Checked', score: '95.9%', status: 'TRUSTED' },
  ];

  return (
    <div className="w-full rounded-2xl glass-panel p-5 border border-cyan-500/20 shadow-hud">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xs font-mono font-bold tracking-wider text-slate-300 uppercase flex items-center gap-2">
          <Activity className="w-4 h-4 text-cyan-400" /> LIVE ACTIVITY FEED STREAM
        </h3>
        <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-500/30">
          STREAMING
        </span>
      </div>

      <div className="flex flex-col gap-3">
        {events.map((evt, idx) => (
          <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 text-xs font-mono">
            <div className="flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              <div>
                <div className="text-slate-200">{evt.label}</div>
                <div className="text-[10px] text-slate-500">{evt.time}</div>
              </div>
            </div>
            <div className="text-right">
              <span className="text-cyan-400 font-bold">{evt.score}</span>
              <div className="text-[10px] text-emerald-400">{evt.status}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
