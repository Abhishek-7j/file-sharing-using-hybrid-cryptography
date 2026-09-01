import React from 'react';
import { Keyboard, MousePointer, Mouse, ScrollText, CheckCircle2 } from 'lucide-react';

export default function DashboardCard({ title, score, description, type }) {
  let icon = <Keyboard className="w-5 h-5 text-cyan-400" />;
  let sparkColor = "#00f0ff";

  if (type === 'mouse') {
    icon = <MousePointer className="w-5 h-5 text-blue-400" />;
    sparkColor = "#3b82f6";
  } else if (type === 'click') {
    icon = <Mouse className="w-5 h-5 text-emerald-400" />;
    sparkColor = "#10b981";
  } else if (type === 'scroll') {
    icon = <ScrollText className="w-5 h-5 text-purple-400" />;
    sparkColor = "#8b5cf6";
  }

  return (
    <div className="relative rounded-2xl glass-panel p-5 border border-cyan-500/20 shadow-hud hover:border-cyan-500/50 transition-all duration-300 group overflow-hidden">
      {/* Background Subtle Gradient Glow */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 rounded-full blur-2xl group-hover:bg-cyan-500/10 transition-all pointer-events-none" />

      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-700/60 group-hover:border-cyan-500/40 transition-colors">
            {icon}
          </div>
          <div>
            <h4 className="text-xs font-mono font-bold tracking-wider text-slate-300 uppercase">{title}</h4>
            <div className="flex items-center gap-1 text-[11px] text-emerald-400 font-mono">
              <CheckCircle2 className="w-3 h-3" /> MATCHED
            </div>
          </div>
        </div>

        <div className="text-right">
          <span className="text-2xl font-extrabold font-mono text-slate-100 group-hover:text-cyan-300 transition-colors">
            {score}%
          </span>
        </div>
      </div>

      <p className="text-xs text-slate-400 leading-relaxed mb-4">
        {description}
      </p>

      {/* Mini Micro Sparkline Bar Chart */}
      <div className="flex items-end gap-1.5 h-7 w-full pt-1 border-t border-slate-800/80">
        {[65, 80, 75, 90, 85, 95, 88, 92, 97, score].map((val, i) => (
          <div
            key={i}
            className="flex-1 rounded-t transition-all duration-500"
            style={{
              height: `${val}%`,
              backgroundColor: sparkColor,
              opacity: i === 9 ? 1 : 0.35 + (i * 0.05)
            }}
          />
        ))}
      </div>
    </div>
  );
}
