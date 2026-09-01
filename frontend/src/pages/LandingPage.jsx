import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  Dna, 
  Cpu, 
  Activity, 
  Lock, 
  ArrowRight, 
  Keyboard, 
  MousePointer, 
  Mouse, 
  ScrollText, 
  Zap, 
  CheckCircle2, 
  Sparkles,
  Layers,
  Globe,
  Award
} from 'lucide-react';
import RadhakrishnaVisual from '../components/RadhakrishnaVisual';
import ConfidenceGauge from '../components/ConfidenceGauge';

export default function LandingPage() {
  return (
    <div className="relative min-h-screen bg-[#020617] cyber-grid overflow-hidden">

      {/* 1. HERO SECTION */}
      <section className="relative pt-12 pb-24 px-4 sm:px-8 max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-12">
        <div className="flex-1 space-y-6 text-center lg:text-left z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-950/80 border border-cyan-500/30 text-xs font-mono text-cyan-300 backdrop-blur-md">
            <Sparkles className="w-4 h-4 text-cyan-400 animate-spin-slow" />
            <span>CONTINUOUS BEHAVIORAL AUTHENTICATION SYSTEM</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black font-mono tracking-tight text-slate-100 uppercase leading-none">
            IDENTITY <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-400">DNA</span>
          </h1>

          <p className="text-lg sm:text-xl font-mono text-cyan-300 font-semibold tracking-wide">
            “Your Behavior. Your Identity. Your Security.”
          </p>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl">
            Authentication shouldn't end when you log in. <strong className="text-cyan-300">Identity DNA</strong> continuously analyzes your unique interaction behavior to determine whether the person using an account is its legitimate owner.
          </p>

          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-4">
            <Link
              to="/register"
              className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-mono font-bold text-sm hover:from-cyan-400 hover:to-blue-500 shadow-cyan-glow transition-all flex items-center gap-2"
            >
              <span>Create Identity DNA</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              to="/dashboard"
              className="px-6 py-3.5 rounded-xl glass-panel text-cyan-300 font-mono font-semibold text-sm hover:border-cyan-500/60 transition-all flex items-center gap-2"
            >
              <Cpu className="w-4 h-4 text-cyan-400" />
              <span>Explore System</span>
            </Link>
          </div>
        </div>

        {/* Hero Visual: Radhakrishna Identity Guardian */}
        <div className="flex-1 flex justify-center z-10">
          <RadhakrishnaVisual />
        </div>
      </section>

      {/* 2. WHAT IS IDENTITY DNA */}
      <section className="py-20 px-4 sm:px-8 max-w-7xl mx-auto border-t border-slate-800/80">
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <span className="text-xs font-mono text-cyan-400 uppercase tracking-widest">[ CORE ARCHITECTURE ]</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-mono text-slate-100 uppercase">What is Identity DNA?</h2>
          <p className="text-slate-400 text-sm leading-relaxed">
            Identity DNA is a next-generation AI security framework that converts passive biometric micro-behaviors into a unique digital fingerprint.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="glass-panel p-6 rounded-2xl space-y-4 border border-cyan-500/20">
            <div className="p-3 rounded-xl bg-cyan-950/80 border border-cyan-500/30 text-cyan-400 w-fit">
              <Keyboard className="w-6 h-6" />
            </div>
            <h3 className="text-base font-mono font-bold text-slate-200 uppercase">Keystroke Dynamics</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Measures key hold times (dwell time), inter-key flight intervals, typing speed WPM, and rhythmic variance across standard sentences.
            </p>
          </div>

          <div className="glass-panel p-6 rounded-2xl space-y-4 border border-cyan-500/20">
            <div className="p-3 rounded-xl bg-blue-950/80 border border-blue-500/30 text-blue-400 w-fit">
              <MousePointer className="w-6 h-6" />
            </div>
            <h3 className="text-base font-mono font-bold text-slate-200 uppercase">Cursor Kinematics</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Analyzes cursor velocity vectors, acceleration profiles, curvature smoothness, and spatial movement distances across screen space.
            </p>
          </div>

          <div className="glass-panel p-6 rounded-2xl space-y-4 border border-cyan-500/20">
            <div className="p-3 rounded-xl bg-purple-950/80 border border-purple-500/30 text-purple-400 w-fit">
              <ScrollText className="w-6 h-6" />
            </div>
            <h3 className="text-base font-mono font-bold text-slate-200 uppercase">Click & Scroll Cadence</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Captures click press durations, double-click intervals, scroll burst velocity, and directional impulse shifts.
            </p>
          </div>
        </div>
      </section>

      {/* 3. WHY TRADITIONAL AUTH ISN'T ENOUGH */}
      <section className="py-20 px-4 sm:px-8 max-w-7xl mx-auto border-t border-slate-800/80">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <span className="text-xs font-mono text-rose-400 uppercase tracking-widest">[ SECURITY THREAT AUDIT ]</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold font-mono text-slate-100 uppercase">
              Why Traditional Authentication Isn't Enough
            </h2>
            <p className="text-slate-300 text-sm leading-relaxed">
              Passwords, SMS OTPs, and 2FA tokens verify identity <strong className="text-cyan-300">only at the moment of login</strong>. Once authenticated, traditional systems remain blind to session hijacking, malware injection, or physical account takeover.
            </p>

            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-900/60 border border-rose-500/30 text-rose-300 text-xs font-mono">
                <span className="text-rose-400 font-bold">✖ Passwords:</span> Vulnerable to credential stuffing & phishing.
              </div>
              <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-900/60 border border-rose-500/30 text-rose-300 text-xs font-mono">
                <span className="text-rose-400 font-bold">✖ OTPs:</span> Intercepted via SIM swapping or adversary-in-the-middle.
              </div>
              <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-900/60 border border-emerald-500/30 text-emerald-300 text-xs font-mono">
                <span className="text-emerald-400 font-bold">✔ Identity DNA:</span> Continuous verification active throughout the entire active session.
              </div>
            </div>
          </div>

          <div className="glass-panel p-8 rounded-3xl border border-cyan-500/30 shadow-cyan-glow flex justify-center">
            <ConfidenceGauge confidence={98.7} status="TRUSTED" />
          </div>
        </div>
      </section>

      {/* 4. HOW IT WORKS */}
      <section className="py-20 px-4 sm:px-8 max-w-7xl mx-auto border-t border-slate-800/80">
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <span className="text-xs font-mono text-cyan-400 uppercase tracking-widest">[ PIPELINE DISCOVERY ]</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-mono text-slate-100 uppercase">How Identity DNA Works</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { step: '01', title: 'Data Capture', desc: 'Passively monitors keyboard, mouse, click & scroll telemetry in background.' },
            { step: '02', title: 'Feature Extraction', desc: 'Computes statistical vector embeddings (dwell, flight, velocity, acceleration).' },
            { step: '03', title: 'Baseline Matching', desc: 'Compares live telemetry against registered user Identity DNA baseline.' },
            { step: '04', title: 'Dynamic Decision', desc: 'Generates real-time confidence score & triggers threat responses if anomalous.' }
          ].map((item) => (
            <div key={item.step} className="glass-panel p-6 rounded-2xl border border-cyan-500/20 space-y-3">
              <span className="text-2xl font-mono font-black text-cyan-400">{item.step}</span>
              <h3 className="text-sm font-mono font-bold text-slate-100 uppercase">{item.title}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 9. RADHAKRISHNA IDENTITY GUARDIAN SECTION */}
      <section className="py-20 px-4 sm:px-8 max-w-7xl mx-auto border-t border-slate-800/80 bg-slate-950/40 rounded-3xl my-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="flex justify-center">
            <RadhakrishnaVisual />
          </div>

          <div className="space-y-6">
            <span className="text-xs font-mono text-cyan-400 uppercase tracking-widest">[ SIGNATURE CONCEPT ]</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold font-mono text-slate-100 uppercase">
              The Identity Guardian
            </h2>
            <p className="text-slate-300 text-sm leading-relaxed">
              At the heart of Identity DNA lies <strong className="text-cyan-300">The Identity Guardian</strong> — a visual fusion of futuristic cybersecurity and Radhakrishna symbolic harmony.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className="p-4 rounded-xl bg-slate-900/80 border border-cyan-500/30 text-center">
                <span className="text-2xl">🪷</span>
                <h4 className="text-xs font-mono font-bold text-cyan-300 mt-2 uppercase">Harmony</h4>
                <p className="text-[11px] text-slate-400 mt-1">Radhakrishna biometrics in natural sync.</p>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/80 border border-cyan-500/30 text-center">
                <span className="text-2xl">🧬</span>
                <h4 className="text-xs font-mono font-bold text-cyan-300 mt-2 uppercase">Identity</h4>
                <p className="text-[11px] text-slate-400 mt-1">Unique behavioral DNA fingerprint.</p>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/80 border border-cyan-500/30 text-center">
                <span className="text-2xl">🔐</span>
                <h4 className="text-xs font-mono font-bold text-cyan-300 mt-2 uppercase">Security</h4>
                <p className="text-[11px] text-slate-400 mt-1">Continuous cyber protection shield.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 10. ADVANTAGES */}
      <section className="py-20 px-4 sm:px-8 max-w-7xl mx-auto border-t border-slate-800/80">
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <span className="text-xs font-mono text-cyan-400 uppercase tracking-widest">[ SYSTEM ADVANTAGES ]</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-mono text-slate-100 uppercase">Key Advantages</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            'Continuous user verification without friction',
            'Zero dependence on repeated OTP prompts',
            'Instant account takeover & anomaly detection',
            'Multi-modal signal biometric fusion',
            'Extensible weighted ML classifier architecture',
            'Real-time automated incident threat logging'
          ].map((adv, idx) => (
            <div key={idx} className="glass-panel p-5 rounded-xl border border-cyan-500/20 flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-cyan-400 shrink-0" />
              <span className="text-xs font-mono text-slate-200">{adv}</span>
            </div>
          ))}
        </div>
      </section>

      {/* 11. FUTURE SCOPE */}
      <section className="py-20 px-4 sm:px-8 max-w-7xl mx-auto border-t border-slate-800/80">
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <span className="text-xs font-mono text-purple-400 uppercase tracking-widest">[ FUTURE SCOPE & EXTENSION ]</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-mono text-slate-100 uppercase">Future Roadmap</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { title: 'Touchscreen Gesture Biometrics', status: 'Future Scope' },
            { title: 'Voice & Speech Rhythm Processing', status: 'Future Scope' },
            { title: 'Adaptive Risk-based Stepped Auth', status: 'Future Scope' },
            { title: 'Enterprise OAuth & SSO Plugins', status: 'Future Scope' }
          ].map((item, idx) => (
            <div key={idx} className="glass-panel p-5 rounded-xl border border-slate-800 space-y-2">
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-500/30">
                {item.status}
              </span>
              <h4 className="text-xs font-mono font-bold text-slate-200 uppercase pt-1">{item.title}</h4>
            </div>
          ))}
        </div>
      </section>

      {/* 12. CALL TO ACTION */}
      <section className="py-20 px-4 sm:px-8 max-w-5xl mx-auto text-center space-y-6">
        <div className="glass-panel p-12 rounded-3xl border border-cyan-500/40 shadow-cyan-glow space-y-6">
          <h2 className="text-3xl sm:text-4xl font-black font-mono text-slate-100 uppercase">
            Build Your Identity DNA Today
          </h2>
          <p className="text-sm text-slate-300 max-w-xl mx-auto">
            Experience zero-friction continuous security powered by AI behavioral biometrics.
          </p>
          <div className="flex justify-center gap-4">
            <Link
              to="/register"
              className="px-8 py-4 rounded-xl bg-cyan-500 text-slate-950 font-mono font-bold text-sm hover:bg-cyan-400 shadow-cyan-glow transition-all"
            >
              Get Started
            </Link>
          </div>
        </div>
      </section>

      {/* 13. FOOTER */}
      <footer className="py-8 px-4 sm:px-8 max-w-7xl mx-auto border-t border-slate-800 text-center text-xs font-mono text-slate-500">
        <p>IDENTITY DNA — Continuous Behavioral Authentication System © 2026</p>
      </footer>
    </div>
  );
}
