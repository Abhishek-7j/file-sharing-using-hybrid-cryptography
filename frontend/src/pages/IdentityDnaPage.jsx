import React from 'react';
import DNAVisualization from '../components/DNAVisualization';
import { Dna, CheckCircle2, Shield, Cpu, RefreshCcw } from 'lucide-react';

export default function IdentityDnaPage() {
  const profileFeatures = [
    { name: 'Typing Dwell Time Mean', baseline: '105.4 ms', current: '104.2 ms', status: 'MATCHED' },
    { name: 'Inter-Key Flight Interval', baseline: '142.1 ms', current: '140.8 ms', status: 'MATCHED' },
    { name: 'Mouse Speed Variance', baseline: '850.0 px/s', current: '842.1 px/s', status: 'MATCHED' },
    { name: 'Mouse Curvature Smoothness', baseline: '0.94 r2', current: '0.95 r2', status: 'MATCHED' },
    { name: 'Click Press Hold Duration', baseline: '114.3 ms', current: '115.0 ms', status: 'MATCHED' },
    { name: 'Scroll Impulse Velocity', baseline: '293.3 px/s', current: '290.1 px/s', status: 'MATCHED' },
  ];

  return (
    <div className="space-y-8">
      <div className="p-6 rounded-3xl glass-panel border border-cyan-500/30 shadow-hud space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950 border border-cyan-500/30 text-xs font-mono text-cyan-300">
          <Dna className="w-3.5 h-3.5 text-cyan-400" />
          <span>REGISTERED BEHAVIORAL PROFILE</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black font-mono tracking-tight text-slate-100 uppercase">
          YOUR IDENTITY DNA PROFILE
        </h1>
        <p className="text-xs font-mono text-slate-400">
          Detailed feature vector breakdown comparing active session biometrics against your registered baseline.
        </p>
      </div>

      <DNAVisualization activeStep={4} confidence={98.7} />

      <div className="rounded-2xl glass-panel p-6 border border-cyan-500/20 shadow-hud space-y-4">
        <h3 className="text-sm font-mono font-bold text-slate-200 uppercase flex items-center gap-2">
          <Cpu className="w-4 h-4 text-cyan-400" /> BIOMETRIC FEATURE MATRIX
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400">
                <th className="py-3 px-4">FEATURE PARAMETER</th>
                <th className="py-3 px-4">REGISTERED BASELINE</th>
                <th className="py-3 px-4">CURRENT LIVE SESSION</th>
                <th className="py-3 px-4">STATUS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-200">
              {profileFeatures.map((feat, idx) => (
                <tr key={idx} className="hover:bg-slate-900/40">
                  <td className="py-3 px-4 font-semibold text-cyan-300">{feat.name}</td>
                  <td className="py-3 px-4">{feat.baseline}</td>
                  <td className="py-3 px-4">{feat.current}</td>
                  <td className="py-3 px-4">
                    <span className="inline-flex items-center gap-1 text-emerald-400 font-bold">
                      <CheckCircle2 className="w-3.5 h-3.5" /> {feat.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
