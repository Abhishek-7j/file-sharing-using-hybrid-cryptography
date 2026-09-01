import React from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

export default function BehavioralChart({ data, title, color = "#00f0ff", dataKey = "confidence" }) {
  const chartData = data || [
    { time: '09:00', confidence: 98.4, typing: 97.2, mouse: 98.1 },
    { time: '10:00', confidence: 97.9, typing: 96.8, mouse: 97.5 },
    { time: '11:00', confidence: 98.7, typing: 98.2, mouse: 98.9 },
    { time: '12:00', confidence: 95.2, typing: 94.1, mouse: 96.0 },
    { time: '13:00', confidence: 98.1, typing: 97.8, mouse: 98.2 },
    { time: '14:00', confidence: 97.5, typing: 96.9, mouse: 97.8 },
    { time: '15:00', confidence: 98.8, typing: 98.5, mouse: 99.0 },
  ];

  return (
    <div className="w-full rounded-2xl glass-panel p-5 border border-cyan-500/20 shadow-hud">
      {title && (
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-mono tracking-wider text-slate-200 uppercase">{title}</h3>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-500/30">
            LIVE ANALYTICS
          </span>
        </div>
      )}
      <div className="h-56 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id={`grad-${dataKey}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={color} stopOpacity={0.4} />
                <stop offset="95%" stopColor={color} stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
            <XAxis dataKey="time" stroke="#64748b" fontSize={11} tickLine={false} />
            <YAxis stroke="#64748b" fontSize={11} domain={[50, 100]} tickLine={false} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#0f172a',
                borderColor: '#38bdf8',
                borderRadius: '8px',
                color: '#e2e8f0',
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: '12px'
              }}
            />
            <Area
              type="monotone"
              dataKey={dataKey}
              stroke={color}
              strokeWidth={2}
              fillOpacity={1}
              fill={`url(#grad-${dataKey})`}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
