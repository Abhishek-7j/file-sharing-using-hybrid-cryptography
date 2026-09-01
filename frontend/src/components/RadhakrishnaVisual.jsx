import React from 'react';
import { Shield, Cpu, Lock, Sparkles, Activity, Dna } from 'lucide-react';

export default function RadhakrishnaVisual({ size = "large" }) {
  return (
    <div className="relative flex items-center justify-center p-4">
      {/* External Glowing Ambient Rings */}
      <div className="absolute w-80 h-80 sm:w-96 sm:h-96 md:w-[480px] md:h-[480px] rounded-full bg-cyan-500/10 blur-3xl animate-pulse-slow pointer-events-none" />
      <div className="absolute w-64 h-64 sm:w-80 sm:h-80 md:w-[380px] md:h-[380px] rounded-full bg-blue-600/15 blur-2xl pointer-events-none" />

      {/* Main HUD Outer Container */}
      <div className="relative w-72 h-72 sm:w-96 sm:h-96 md:w-[440px] md:h-[440px] rounded-full glass-panel border border-cyan-500/30 flex items-center justify-center shadow-cyan-glow overflow-hidden group">
        
        {/* Animated Rotating Mandala Cyber Geometry */}
        <svg className="absolute inset-0 w-full h-full animate-spin-slow opacity-40 pointer-events-none" viewBox="0 0 400 400">
          <circle cx="200" cy="200" r="190" fill="none" stroke="#00f0ff" strokeWidth="1" strokeDasharray="6 8" />
          <circle cx="200" cy="200" r="160" fill="none" stroke="#3b82f6" strokeWidth="1" strokeDasharray="12 12" />
          <circle cx="200" cy="200" r="130" fill="none" stroke="#8b5cf6" strokeWidth="1.5" strokeDasharray="4 4" />
          {/* Lotus Mandala Petals */}
          {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => (
            <path
              key={deg}
              d="M 200 200 Q 200 110 240 140 Q 200 170 200 200"
              fill="none"
              stroke="#00f0ff"
              strokeWidth="1"
              opacity="0.4"
              transform={`rotate(${deg} 200 200)`}
            />
          ))}
        </svg>

        {/* Floating Digital DNA Strands */}
        <div className="absolute inset-0 flex items-center justify-between px-6 pointer-events-none opacity-30">
          <div className="flex flex-col gap-4 animate-float">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" style={{ animationDelay: `${i * 0.3}s` }} />
                <span className="w-12 h-[1px] bg-gradient-to-r from-cyan-400 to-transparent" />
              </div>
            ))}
          </div>
          <div className="flex flex-col gap-4 animate-float" style={{ animationDelay: '1.5s' }}>
            {[...Array(6)].map((_, i) => (
              <div key={i} className="flex items-center gap-2 flex-row-reverse">
                <span className="w-2 h-2 rounded-full bg-blue-500 animate-ping" style={{ animationDelay: `${i * 0.4}s` }} />
                <span className="w-12 h-[1px] bg-gradient-to-l from-blue-500 to-transparent" />
              </div>
            ))}
          </div>
        </div>

        {/* Central Core SVG: Radhakrishna Silhouette + Flute Signal + Peacock Feather Circuit + Cyber Shield */}
        <svg viewBox="0 0 300 300" className="w-full h-full relative z-10 p-6 drop-shadow-[0_0_15px_rgba(0,240,255,0.5)]">
          <defs>
            <linearGradient id="divineAura" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#00f0ff" stopOpacity="0.9" />
              <stop offset="50%" stopColor="#3b82f6" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.7" />
            </linearGradient>
            <linearGradient id="shieldGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#00f0ff" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#0f172a" stopOpacity="0.8" />
            </linearGradient>
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Background Cyber Shield */}
          <path
            d="M 150 25 L 235 60 C 235 160 190 235 150 265 C 110 235 65 160 65 60 Z"
            fill="url(#shieldGrad)"
            stroke="#00f0ff"
            strokeWidth="2"
            strokeDasharray="4 2"
            filter="url(#glow)"
            opacity="0.85"
          />

          {/* Glowing Divine Aura Circle */}
          <circle cx="150" cy="130" r="75" fill="none" stroke="url(#divineAura)" strokeWidth="2" filter="url(#glow)" />
          <circle cx="150" cy="130" r="70" fill="none" stroke="#00f0ff" strokeWidth="0.8" strokeDasharray="3 3" opacity="0.6" />

          {/* RADHAKRISHNA SILHOUETTE */}
          <g filter="url(#glow)">
            {/* Krishna Silhouette (Left/Center) */}
            <path
              d="M 130 100 C 130 80, 150 70, 150 70 C 150 70, 170 80, 170 100 C 170 115, 160 130, 150 145 C 140 130, 130 115, 130 100 Z"
              fill="none"
              stroke="#00f0ff"
              strokeWidth="2.5"
            />
            {/* Radha Silhouette (Graceful Profile curve overlapping right) */}
            <path
              d="M 155 85 C 175 75, 195 90, 185 115 C 178 135, 160 150, 150 160"
              fill="none"
              stroke="#8b5cf6"
              strokeWidth="2"
              strokeDasharray="100"
              strokeDashoffset="0"
            />

            {/* KRISHNA'S DIGITAL FLUTE (Signal Waveform Line) */}
            <g transform="translate(100, 132) rotate(-15)">
              <line x1="0" y1="0" x2="100" y2="0" stroke="#00f0ff" strokeWidth="3" strokeLinecap="round" />
              {/* Digital Signal Pulse dots along flute */}
              <circle cx="20" cy="0" r="2.5" fill="#ffffff" />
              <circle cx="40" cy="0" r="2.5" fill="#00f0ff" />
              <circle cx="60" cy="0" r="2.5" fill="#3b82f6" />
              <circle cx="80" cy="0" r="2.5" fill="#8b5cf6" />
              {/* Emitted Waveform Data Stream */}
              <path d="M 100 0 Q 110 -10, 120 0 T 140 0" fill="none" stroke="#00f0ff" strokeWidth="1.5" strokeDasharray="2 2" />
            </g>

            {/* PEACOCK FEATHER BIOMETRIC CIRCUIT (Top Crown) */}
            <g transform="translate(150, 52)">
              {/* Feather Eye Eyelet */}
              <ellipse cx="0" cy="0" rx="14" ry="20" fill="none" stroke="#00f0ff" strokeWidth="1.5" />
              <ellipse cx="0" cy="2" rx="8" ry="12" fill="none" stroke="#8b5cf6" strokeWidth="1.5" />
              <circle cx="0" cy="4" r="4" fill="#00f0ff" className="animate-pulse" />
              {/* Biometric Circuit Strands extending outwards */}
              <path d="M -14 0 Q -24 -10, -30 0" fill="none" stroke="#3b82f6" strokeWidth="1" />
              <path d="M 14 0 Q 24 -10, 30 0" fill="none" stroke="#3b82f6" strokeWidth="1" />
              <path d="M -10 -15 Q -18 -25, -22 -15" fill="none" stroke="#00f0ff" strokeWidth="1" />
              <path d="M 10 -15 Q 18 -25, 22 -15" fill="none" stroke="#00f0ff" strokeWidth="1" />
            </g>

            {/* Lotus Flower Base Geometry */}
            <g transform="translate(150, 205)">
              <path d="M 0 0 Q -30 -20, -50 0 Q -20 20, 0 0" fill="none" stroke="#00f0ff" strokeWidth="1.5" />
              <path d="M 0 0 Q 30 -20, 50 0 Q 20 20, 0 0" fill="none" stroke="#00f0ff" strokeWidth="1.5" />
              <path d="M 0 0 Q 0 -30, 0 -35 Q 15 -15, 0 0" fill="none" stroke="#8b5cf6" strokeWidth="1.5" />
              <path d="M 0 0 Q 0 -30, 0 -35 Q -15 -15, 0 0" fill="none" stroke="#8b5cf6" strokeWidth="1.5" />
            </g>
          </g>

          {/* HUD Target Crosshairs & Data Nodes */}
          <circle cx="150" cy="150" r="135" fill="none" stroke="#00f0ff" strokeWidth="0.5" opacity="0.3" />
          <line x1="150" y1="10" x2="150" y2="25" stroke="#00f0ff" strokeWidth="2" />
          <line x1="150" y1="275" x2="150" y2="290" stroke="#00f0ff" strokeWidth="2" />
          <line x1="10" y1="150" x2="25" y2="150" stroke="#00f0ff" strokeWidth="2" />
          <line x1="275" y1="150" x2="290" y2="150" stroke="#00f0ff" strokeWidth="2" />
        </svg>

        {/* Overlay HUD Tags */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-slate-950/80 px-3 py-1 rounded-full border border-cyan-500/30 flex items-center gap-1.5 backdrop-blur-md">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-spin-slow" />
          <span className="text-[10px] font-mono tracking-wider text-cyan-300 uppercase">THE IDENTITY GUARDIAN</span>
        </div>

        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-slate-950/80 px-3 py-1 rounded-full border border-cyan-500/30 flex items-center gap-2 backdrop-blur-md">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span className="text-[10px] font-mono tracking-wider text-slate-200">HARMONY + IDENTITY + SECURITY</span>
        </div>
      </div>
    </div>
  );
}
