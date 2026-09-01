import React from 'react';
import { AlertOctagon, X, ShieldAlert, CheckCircle2 } from 'lucide-react';

export default function SecurityAlert({ alert, onClose }) {
  if (!alert) return null;

  const isCritical = alert.confidence < 70 || alert.type === 'HIGH_RISK_ALERT';

  return (
    <div className={`w-full rounded-2xl p-4 mb-6 border backdrop-blur-md flex items-start justify-between gap-4 transition-all duration-500 animate-bounce-short shadow-hud ${
      isCritical
        ? 'bg-rose-950/80 border-rose-500/60 text-rose-100 shadow-rose-glow'
        : 'bg-amber-950/80 border-amber-500/60 text-amber-100'
    }`}>
      <div className="flex items-start gap-3">
        <div className={`p-2 rounded-xl border mt-0.5 ${
          isCritical ? 'bg-rose-900/60 border-rose-400/50 text-rose-300' : 'bg-amber-900/60 border-amber-400/50 text-amber-300'
        }`}>
          <AlertOctagon className="w-5 h-5 animate-pulse" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h4 className="text-sm font-mono font-bold uppercase tracking-wider">{alert.title}</h4>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900/80 border border-slate-700">
              {alert.time}
            </span>
          </div>
          <p className="text-xs text-slate-300 mt-1 leading-relaxed">{alert.message}</p>
          <div className="mt-2 flex items-center gap-4 text-xs font-mono">
            <span>Confidence: <strong className={isCritical ? 'text-rose-400' : 'text-amber-400'}>{alert.confidence}%</strong></span>
            <span>Status: <strong className="text-rose-300 uppercase">INVESTIGATION REQUIRED</strong></span>
          </div>
        </div>
      </div>

      {onClose && (
        <button
          onClick={onClose}
          className="p-1 rounded-lg hover:bg-slate-800/60 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
