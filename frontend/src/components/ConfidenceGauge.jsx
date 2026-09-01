import React from 'react';
import { ShieldCheck, ShieldAlert, AlertTriangle } from 'lucide-react';

export default function ConfidenceGauge({ confidence = 98.7, status = "TRUSTED" }) {
  // State specific color styling
  let strokeColor = "#00f0ff";
  let statusBg = "bg-emerald-500/20 text-emerald-300 border-emerald-500/40";
  let statusText = "TRUSTED";
  let icon = <ShieldCheck className="w-5 h-5 text-emerald-400" />;
  let ringGlow = "shadow-cyan-glow";

  if (status === "MONITORING" || (confidence >= 70 && confidence < 90)) {
    strokeColor = "#f59e0b";
    statusBg = "bg-amber-500/20 text-amber-300 border-amber-500/40";
    statusText = "MONITORING";
    icon = <AlertTriangle className="w-5 h-5 text-amber-400" />;
    ringGlow = "shadow-[0_0_25px_rgba(245,158,11,0.35)]";
  } else if (status === "SUSPICIOUS" || confidence < 70) {
    strokeColor = "#f43f5e";
    statusBg = "bg-rose-500/20 text-rose-300 border-rose-500/40";
    statusText = "SUSPICIOUS";
    icon = <ShieldAlert className="w-5 h-5 text-rose-400" />;
    ringGlow = "shadow-rose-glow";
  }

  // Calculate SVG stroke offset for gauge percentage
  const radius = 85;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (confidence / 100) * circumference;

  return (
    <div className={`relative flex flex-col items-center justify-center p-6 rounded-3xl glass-panel ${ringGlow} transition-all duration-500 border border-slate-700/60`}>
      {/* HUD Circular Progress Gauge */}
      <div className="relative w-56 h-56 flex items-center justify-center">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 200 200">
          {/* Background Outer Ring */}
          <circle
            cx="100"
            cy="100"
            r={radius}
            fill="none"
            stroke="#1e293b"
            strokeWidth="12"
          />
          {/* Progress Ring */}
          <circle
            cx="100"
            cy="100"
            r={radius}
            fill="none"
            stroke={strokeColor}
            strokeWidth="12"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
        </svg>

        {/* Inner Content Display */}
        <div className="absolute flex flex-col items-center justify-center text-center">
          <span className="text-xs font-mono tracking-widest text-slate-400 uppercase mb-1">
            BEHAVIORAL CONFIDENCE
          </span>
          <span className="text-4xl font-extrabold font-mono tracking-tight text-slate-100 drop-shadow-md">
            {confidence.toFixed(1)}%
          </span>

          <div className={`mt-3 px-3 py-1 rounded-full border flex items-center gap-1.5 backdrop-blur-md text-xs font-mono font-bold tracking-wider ${statusBg}`}>
            {icon}
            <span>{statusText}</span>
          </div>
        </div>
      </div>

      <div className="mt-4 text-center">
        <p className="text-xs font-mono text-slate-400">
          Identity Match: <span className="text-slate-200 font-semibold">{status === 'TRUSTED' ? 'Strong' : (status === 'MONITORING' ? 'Moderate' : 'Weak')}</span>
        </p>
      </div>
    </div>
  );
}
