import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { User, Mail, ShieldCheck, Dna, Calendar, CheckCircle2 } from 'lucide-react';

export default function ProfilePage() {
  const { user } = useAuth();

  return (
    <div className="space-y-8">
      <div className="p-6 rounded-3xl glass-panel border border-cyan-500/30 shadow-hud space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950 border border-cyan-500/30 text-xs font-mono text-cyan-300">
          <User className="w-3.5 h-3.5 text-cyan-400" />
          <span>IDENTITY PROFILE MANAGEMENT</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black font-mono tracking-tight text-slate-100 uppercase">
          USER PROFILE
        </h1>
        <p className="text-xs font-mono text-slate-400">
          Identity DNA account credential and biometric profile details.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass-panel p-6 rounded-2xl border border-cyan-500/20 space-y-4 font-mono text-xs">
          <h3 className="text-sm font-bold text-slate-200 uppercase flex items-center gap-2">
            <User className="w-4 h-4 text-cyan-400" /> ACCOUNT INFORMATION
          </h3>

          <div className="space-y-3 pt-2">
            <div>
              <span className="text-slate-500 block">Full Name:</span>
              <span className="text-slate-200 font-bold text-sm">{user?.name || 'Arjun Kumar'}</span>
            </div>
            <div>
              <span className="text-slate-500 block">Email Address:</span>
              <span className="text-slate-200">{user?.email || 'arjun@cybersec.org'}</span>
            </div>
            <div>
              <span className="text-slate-500 block">Username:</span>
              <span className="text-cyan-400 font-bold">{user?.username || 'arjun_cyber'}</span>
            </div>
            <div>
              <span className="text-slate-500 block">Created Date:</span>
              <span className="text-slate-300">Aug 30, 2026</span>
            </div>
          </div>
        </div>

        <div className="glass-panel p-6 rounded-2xl border border-cyan-500/20 space-y-4 font-mono text-xs">
          <h3 className="text-sm font-bold text-slate-200 uppercase flex items-center gap-2">
            <Dna className="w-4 h-4 text-cyan-400" /> IDENTITY DNA STATUS
          </h3>

          <div className="space-y-3 pt-2">
            <div className="p-3 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Identity DNA Baseline Profile Initialized</span>
            </div>

            <div>
              <span className="text-slate-500 block">Biometric Modalities Learned:</span>
              <span className="text-slate-300">Keystroke, Mouse Trajectory, Click Cadence, Scroll Impulse</span>
            </div>

            <div>
              <span className="text-slate-500 block">Active Security Level:</span>
              <span className="text-cyan-400 font-bold">Continuous Behavioral Verification</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
