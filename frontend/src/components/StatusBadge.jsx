import React from 'react';
import { ShieldCheck, ShieldAlert, AlertTriangle } from 'lucide-react';

export default function StatusBadge({ status = "TRUSTED" }) {
  if (status === "TRUSTED") {
    return (
      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-mono font-bold tracking-wider">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
        <ShieldCheck className="w-3.5 h-3.5" />
        <span>TRUSTED</span>
      </div>
    );
  }

  if (status === "MONITORING") {
    return (
      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30 text-xs font-mono font-bold tracking-wider">
        <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
        <AlertTriangle className="w-3.5 h-3.5" />
        <span>MONITORING</span>
      </div>
    );
  }

  return (
    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/30 text-xs font-mono font-bold tracking-wider">
      <span className="w-2 h-2 rounded-full bg-rose-400 animate-ping" />
      <ShieldAlert className="w-3.5 h-3.5" />
      <span>SUSPICIOUS</span>
    </div>
  );
}
