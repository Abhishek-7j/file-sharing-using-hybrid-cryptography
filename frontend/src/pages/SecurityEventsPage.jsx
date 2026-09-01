import React, { useEffect, useState } from 'react';
import { ShieldAlert, AlertOctagon, CheckCircle2, Clock, ShieldCheck } from 'lucide-react';
import { api } from '../services/api';

export default function SecurityEventsPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const data = await api.getSecurityEvents();
        setEvents(data);
      } catch (err) {
        console.warn("Failed to fetch events:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  return (
    <div className="space-y-8">
      <div className="p-6 rounded-3xl glass-panel border border-cyan-500/30 shadow-hud space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-950 border border-rose-500/30 text-xs font-mono text-rose-300">
          <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
          <span>REAL-TIME INCIDENT FEED</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black font-mono tracking-tight text-slate-100 uppercase">
          SUSPICIOUS SECURITY EVENTS
        </h1>
        <p className="text-xs font-mono text-slate-400">
          Automated threat alerts generated whenever active telemetry diverges from registered Identity DNA.
        </p>
      </div>

      <div className="space-y-4">
        {events.map((evt) => {
          const isCritical = evt.confidence_score < 70 || evt.status === "INVESTIGATION REQUIRED";
          return (
            <div
              key={evt.event_id || evt.id}
              className={`p-6 rounded-2xl glass-panel border transition-all duration-300 ${
                isCritical
                  ? 'border-rose-500/40 shadow-rose-glow bg-rose-950/20'
                  : 'border-slate-800 bg-slate-900/60'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-xl border ${
                    isCritical ? 'bg-rose-900/40 border-rose-500/40 text-rose-400' : 'bg-slate-800 border-slate-700 text-slate-300'
                  }`}>
                    <AlertOctagon className="w-6 h-6" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-mono font-bold text-slate-100 uppercase">
                        {evt.event_type}
                      </h3>
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                        isCritical ? 'bg-rose-950 text-rose-400 border border-rose-500/30' : 'bg-slate-800 text-slate-400'
                      }`}>
                        {evt.severity || 'HIGH'}
                      </span>
                    </div>
                    <p className="text-xs text-slate-300">{evt.description}</p>
                    <div className="flex items-center gap-4 text-xs font-mono text-slate-500 pt-1">
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {evt.timestamp}</span>
                      <span>|</span>
                      <span>Confidence Score: <strong className="text-cyan-400">{evt.confidence_score}%</strong></span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                  <span className={`px-3 py-1.5 rounded-full font-mono text-xs font-bold border ${
                    isCritical
                      ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                      : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                  }`}>
                    {evt.status}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
