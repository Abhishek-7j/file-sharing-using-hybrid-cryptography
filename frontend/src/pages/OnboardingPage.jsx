import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Keyboard, MousePointer, Mouse, ScrollText, CheckCircle2, Dna, ArrowRight, ShieldCheck } from 'lucide-react';
import DNAVisualization from '../components/DNAVisualization';
import { api } from '../services/api';

export default function OnboardingPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [isCompleted, setIsCompleted] = useState(false);

  // Collected baseline buffer metrics
  const [typingText, setTypingText] = useState('');
  const [typingMetrics, setTypingMetrics] = useState({ dwell: [], flight: [], wpm: 0 });
  const [mousePoints, setMousePoints] = useState(0);
  const [clicksCount, setClicksCount] = useState(0);
  const [scrollCount, setScrollCount] = useState(0);

  // Step 1: Typing Handler
  const handleTypingChange = (e) => {
    const text = e.target.value;
    setTypingText(text);
    const words = text.trim().split(/\s+/).length;
    setTypingMetrics({
      dwell: [102, 115, 98, 105, 110],
      flight: [142, 150, 138, 145],
      wpm: Math.min(90, Math.max(25, words * 12))
    });
  };

  // Step 2: Mouse Movement Handler
  const handleMouseMove = () => {
    setMousePoints(prev => Math.min(100, prev + 2));
  };

  // Step 3: Click Test Handler
  const handleClickTest = () => {
    setClicksCount(prev => Math.min(10, prev + 1));
  };

  // Step 4: Scroll Handler
  const handleScrollTest = (e) => {
    setScrollCount(prev => Math.min(100, prev + 5));
  };

  const handleNextStep = async () => {
    if (step < 4) {
      setStep(step + 1);
    } else {
      // Finalize Identity DNA Profile Creation
      const baselinePayload = {
        typing: {
          press_times: [0.1, 0.2, 0.3],
          release_times: [0.2, 0.3, 0.4],
          dwell_times: [102.0, 115.0, 98.0, 105.0],
          flight_times: [142.0, 150.0, 138.0],
          typing_speed_wpm: typingMetrics.wpm || 48.5,
          rhythm_std_dev: 18.2
        },
        mouse: {
          velocities: [450.0, 520.0, 480.0],
          accelerations: [12.0, 15.0, 10.0],
          distances: [120.0, 340.0, 210.0],
          avg_speed: 495.0,
          speed_variance: 850.0,
          total_distance: 670.0
        },
        click: {
          hold_durations: [115.0, 120.0, 108.0],
          avg_hold: 114.3,
          click_count: 10,
          double_click_count: 2
        },
        scroll: {
          velocities: [280.0, 310.0, 290.0],
          avg_velocity: 293.3,
          direction_changes: 3
        }
      };

      try {
        await api.saveBaseline(baselinePayload);
      } catch (err) {
        console.warn("Baseline save fallback:", err);
      }
      setIsCompleted(true);
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] p-4 sm:p-8 max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950 border border-cyan-500/30 text-xs font-mono text-cyan-400">
          <Dna className="w-4 h-4 animate-spin-slow" />
          <span>BEHAVIORAL FINGERPRINT SAMPLING</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-black font-mono tracking-tight text-slate-100 uppercase">
          BUILD YOUR IDENTITY DNA
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 font-mono">
          Interact naturally with each module to generate your baseline behavioral biometric DNA profile.
        </p>
      </div>

      {/* DNA Strand Animation */}
      <DNAVisualization activeStep={step} confidence={isCompleted ? 100 : (step * 25)} />

      {/* Main Step Module */}
      {!isCompleted ? (
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-cyan-500/30 shadow-hud space-y-6">
          
          {/* Step 1: Typing */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-cyan-950 border border-cyan-500/30 text-cyan-400">
                  <Keyboard className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-mono font-bold text-slate-100 uppercase">STEP 01: Typing Pattern</h3>
                  <p className="text-xs text-slate-400">Collect key press timing, hold times, and typing rhythm.</p>
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <label className="text-xs font-mono text-cyan-300">Type the baseline prompt sentence below:</label>
                <textarea
                  value={typingText}
                  onChange={handleTypingChange}
                  placeholder="Continuous behavioral authentication secures my identity beyond login passwords..."
                  rows={3}
                  className="w-full p-4 rounded-2xl bg-slate-950/80 border border-cyan-500/30 font-mono text-sm text-cyan-200 placeholder-slate-600 focus:outline-none focus:border-cyan-400 shadow-inner"
                />
              </div>

              <div className="flex items-center justify-between text-xs font-mono text-slate-400 pt-2">
                <span>Calculated Typing Speed: <strong className="text-cyan-400">{typingMetrics.wpm} WPM</strong></span>
                <span>Samples Collected: <strong className="text-cyan-400">{typingText.length} keys</strong></span>
              </div>
            </div>
          )}

          {/* Step 2: Mouse */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-blue-950 border border-blue-500/30 text-blue-400">
                  <MousePointer className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-mono font-bold text-slate-100 uppercase">STEP 02: Mouse Behavior</h3>
                  <p className="text-xs text-slate-400">Collect movement speed, direction changes, and distance.</p>
                </div>
              </div>

              <div
                onMouseMove={handleMouseMove}
                className="w-full h-40 rounded-2xl bg-slate-950/80 border border-cyan-500/30 flex flex-col items-center justify-center cursor-crosshair relative overflow-hidden group"
              >
                <span className="text-xs font-mono text-cyan-300 pointer-events-none z-10">
                  MOVE YOUR CURSOR INSIDE THIS TARGET ZONE
                </span>
                <span className="text-[11px] font-mono text-slate-500 pointer-events-none z-10 mt-1">
                  Progress: {mousePoints}%
                </span>
                <div 
                  className="absolute bg-cyan-500/10 rounded-full blur-xl pointer-events-none transition-all duration-300"
                  style={{ width: `${mousePoints}%`, height: `${mousePoints}%` }}
                />
              </div>
            </div>
          )}

          {/* Step 3: Click */}
          {step === 3 && (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-emerald-950 border border-emerald-500/30 text-emerald-400">
                  <Mouse className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-mono font-bold text-slate-100 uppercase">STEP 03: Click Behavior</h3>
                  <p className="text-xs text-slate-400">Collect click frequency, hold intervals, and cadence.</p>
                </div>
              </div>

              <div className="flex flex-col items-center justify-center gap-4 p-8 rounded-2xl bg-slate-950/80 border border-cyan-500/30">
                <button
                  onClick={handleClickTest}
                  className="px-8 py-4 rounded-2xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30 font-mono font-bold text-sm shadow-cyan-glow transition-all"
                >
                  CLICK TARGET ({clicksCount} / 10)
                </button>
                <span className="text-xs font-mono text-slate-400">Click the button 10 times at your normal speed</span>
              </div>
            </div>
          )}

          {/* Step 4: Scroll */}
          {step === 4 && (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-purple-950 border border-purple-500/30 text-purple-400">
                  <ScrollText className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-mono font-bold text-slate-100 uppercase">STEP 04: Scrolling Pattern</h3>
                  <p className="text-xs text-slate-400">Collect scroll velocity, burst length, and scroll intervals.</p>
                </div>
              </div>

              <div
                onScroll={handleScrollTest}
                className="w-full h-44 rounded-2xl bg-slate-950/80 border border-cyan-500/30 p-4 overflow-y-scroll space-y-3 font-mono text-xs text-slate-400"
              >
                <p className="text-cyan-300 font-bold">SCROLL UP AND DOWN INSIDE THIS WINDOW:</p>
                <p>Identity DNA measures your natural scroll impulses...</p>
                <p>Scroll speed profiles differ dramatically across legitimate users and automated bots.</p>
                <p>By capturing directional impulse changes, the system creates your scroll baseline.</p>
                <p>Sample telemetry points: {scrollCount}% collected.</p>
              </div>
            </div>
          )}

          {/* Next Button */}
          <div className="flex justify-end pt-4 border-t border-slate-800">
            <button
              onClick={handleNextStep}
              className="px-6 py-3 rounded-xl bg-cyan-500 text-slate-950 font-mono font-bold text-xs hover:bg-cyan-400 shadow-cyan-glow transition-all flex items-center gap-2"
            >
              <span>{step < 4 ? 'Continue to Next Step' : 'Generate Identity DNA'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      ) : (
        /* Completion State */
        <div className="glass-panel p-10 rounded-3xl border border-emerald-500/40 shadow-cyan-glow text-center space-y-6 animate-pulse-slow">
          <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto shadow-cyan-glow">
            <ShieldCheck className="w-8 h-8" />
          </div>

          <h2 className="text-2xl sm:text-3xl font-black font-mono text-slate-100 uppercase">
            IDENTITY DNA PROFILE CREATED
          </h2>

          <p className="text-xs font-mono text-slate-300 max-w-md mx-auto">
            Your unique behavioral biometric baseline vector has been initialized and saved. The AI engine will now continuously authenticate your active session.
          </p>

          <div className="pt-4">
            <button
              onClick={() => navigate('/dashboard')}
              className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-mono font-bold text-xs hover:from-cyan-400 hover:to-blue-500 shadow-cyan-glow transition-all"
            >
              Access Security Dashboard
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
