import React, { useState } from 'react';
import { Settings, Sliders, ShieldCheck, Save, CheckCircle2 } from 'lucide-react';

export default function SettingsPage() {
  const [weights, setWeights] = useState({
    typing: 30,
    mouse: 30,
    click: 15,
    scroll: 15,
    session: 10
  });

  const [thresholds, setThresholds] = useState({
    trusted: 90,
    monitoring: 70
  });

  const [saved, setSaved] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-8">
      <div className="p-6 rounded-3xl glass-panel border border-cyan-500/30 shadow-hud space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950 border border-cyan-500/30 text-xs font-mono text-cyan-300">
          <Settings className="w-3.5 h-3.5 text-cyan-400" />
          <span>ALGORITHM CONFIGURATION</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black font-mono tracking-tight text-slate-100 uppercase">
          SYSTEM SETTINGS
        </h1>
        <p className="text-xs font-mono text-slate-400">
          Configure weighted behavioral biometric scoring algorithms and dynamic security threshold cutoffs.
        </p>
      </div>

      {saved && (
        <div className="p-4 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs font-mono flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>Configuration saved successfully. Behavioral engine thresholds updated.</span>
        </div>
      )}

      <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-6 font-mono text-xs">
        
        {/* Signal Weights Slider Config */}
        <div className="glass-panel p-6 rounded-2xl border border-cyan-500/20 space-y-4">
          <h3 className="text-sm font-bold text-slate-200 uppercase flex items-center gap-2">
            <Sliders className="w-4 h-4 text-cyan-400" /> SIGNAL MATCH WEIGHTS
          </h3>

          <div className="space-y-4 pt-2">
            <div>
              <div className="flex justify-between text-slate-300 mb-1">
                <span>Typing Match Weight:</span>
                <span className="text-cyan-400 font-bold">{weights.typing}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="50"
                value={weights.typing}
                onChange={(e) => setWeights({ ...weights, typing: Number(e.target.value) })}
                className="w-full accent-cyan-400"
              />
            </div>

            <div>
              <div className="flex justify-between text-slate-300 mb-1">
                <span>Mouse Match Weight:</span>
                <span className="text-blue-400 font-bold">{weights.mouse}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="50"
                value={weights.mouse}
                onChange={(e) => setWeights({ ...weights, mouse: Number(e.target.value) })}
                className="w-full accent-blue-400"
              />
            </div>

            <div>
              <div className="flex justify-between text-slate-300 mb-1">
                <span>Click Match Weight:</span>
                <span className="text-emerald-400 font-bold">{weights.click}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="30"
                value={weights.click}
                onChange={(e) => setWeights({ ...weights, click: Number(e.target.value) })}
                className="w-full accent-emerald-400"
              />
            </div>

            <div>
              <div className="flex justify-between text-slate-300 mb-1">
                <span>Scroll Match Weight:</span>
                <span className="text-purple-400 font-bold">{weights.scroll}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="30"
                value={weights.scroll}
                onChange={(e) => setWeights({ ...weights, scroll: Number(e.target.value) })}
                className="w-full accent-purple-400"
              />
            </div>
          </div>
        </div>

        {/* Threshold Cutoffs */}
        <div className="glass-panel p-6 rounded-2xl border border-cyan-500/20 space-y-4">
          <h3 className="text-sm font-bold text-slate-200 uppercase flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-cyan-400" /> THRESHOLD STATE CLASSIFICATION
          </h3>

          <div className="space-y-4 pt-2">
            <div>
              <label className="block text-slate-400 mb-1">Trusted Cutoff Threshold (90 - 100%):</label>
              <input
                type="number"
                min="80"
                max="99"
                value={thresholds.trusted}
                onChange={(e) => setThresholds({ ...thresholds, trusted: Number(e.target.value) })}
                className="w-full p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-slate-200 focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1">Monitoring Cutoff Threshold (70 - 89%):</label>
              <input
                type="number"
                min="50"
                max="85"
                value={thresholds.monitoring}
                onChange={(e) => setThresholds({ ...thresholds, monitoring: Number(e.target.value) })}
                className="w-full p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-slate-200 focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-[11px] text-slate-400">
              Scores below {thresholds.monitoring}% automatically trigger <strong className="text-rose-400">SUSPICIOUS / HIGH RISK</strong> classification.
            </div>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-cyan-500 text-slate-950 font-bold hover:bg-cyan-400 shadow-cyan-glow transition-all flex items-center justify-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>Save Configuration</span>
            </button>
          </div>
        </div>

      </form>
    </div>
  );
}
