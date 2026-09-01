import React from 'react';
import { Dna, Cpu, ShieldAlert, Sparkles } from 'lucide-react';

export default function DNAVisualization({ activeStep = 1, confidence = 98.7 }) {
  return (
    <div className="relative w-full h-64 sm:h-72 rounded-2xl glass-panel p-6 flex flex-col items-center justify-between overflow-hidden border border-cyan-500/20 shadow-hud">
      {/* Background Scan Line */}
      <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-scan-line opacity-60 pointer-events-none" />

      <div className="w-full flex items-center justify-between z-10">
        <div className="flex items-center gap-2">
          <Dna className="w-5 h-5 text-cyan-400 animate-pulse" />
          <span className="text-xs font-mono tracking-widest text-cyan-300 uppercase">BEHAVIORAL DNA HELIX</span>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900/80 border border-cyan-500/30">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
          <span className="text-xs font-mono text-cyan-200">STEP 0{activeStep} / 04 ACTIVE</span>
        </div>
      </div>

      {/* Interactive 3D Strand Canvas Simulation */}
      <div className="relative w-full h-36 flex items-center justify-center my-2">
        <div className="absolute inset-0 flex items-center justify-around px-8 pointer-events-none">
          {[...Array(16)].map((_, i) => {
            const phase = (i * 0.4);
            return (
              <div key={i} className="flex flex-col items-center justify-between h-28 relative">
                {/* Top Strand Node */}
                <div 
                  className={`w-3 h-3 rounded-full transition-all duration-500 shadow-cyan-glow ${
                    i <= activeStep * 4 ? 'bg-cyan-400 scale-110' : 'bg-slate-700'
                  }`}
                  style={{ transform: `translateY(${Math.sin(phase) * 24}px)` }}
                />
                {/* Connecting Base Pair Line */}
                <div 
                  className={`w-[1px] transition-all duration-500 ${
                    i <= activeStep * 4 ? 'bg-gradient-to-b from-cyan-400 via-blue-500 to-indigo-500 opacity-80' : 'bg-slate-800 opacity-30'
                  }`}
                  style={{ height: `${Math.abs(Math.cos(phase)) * 48 + 12}px` }}
                />
                {/* Bottom Strand Node */}
                <div 
                  className={`w-3 h-3 rounded-full transition-all duration-500 shadow-blue-glow ${
                    i <= activeStep * 4 ? 'bg-blue-500 scale-110' : 'bg-slate-700'
                  }`}
                  style={{ transform: `translateY(${-Math.sin(phase) * 24}px)` }}
                />
              </div>
            );
          })}
        </div>
      </div>

      <div className="w-full flex items-center justify-between z-10 text-xs font-mono text-slate-400">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1 text-cyan-400"><Cpu className="w-3.5 h-3.5" /> Telemetry Stream: Live</span>
          <span className="hidden sm:inline text-slate-500">|</span>
          <span className="hidden sm:inline">Baseline Sampling Rate: 120Hz</span>
        </div>
        <div className="text-cyan-300 font-semibold">
          Identity DNA Density: <span className="text-cyan-400">{confidence}%</span>
        </div>
      </div>
    </div>
  );
}
