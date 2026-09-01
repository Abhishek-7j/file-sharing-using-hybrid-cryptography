import React, { useEffect, useState } from 'react';
import { History, ShieldCheck, Laptop, Globe, Clock, Search } from 'lucide-react';
import { api } from '../services/api';
import StatusBadge from '../components/StatusBadge';

export default function LoginHistoryPage() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const data = await api.getLoginHistory();
        setHistory(data);
      } catch (err) {
        console.warn("Failed to fetch history:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  const filteredHistory = history.filter(item => 
    item.date.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.device.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl glass-panel border border-cyan-500/30 shadow-hud">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950 border border-cyan-500/30 text-xs font-mono text-cyan-300">
            <History className="w-3.5 h-3.5 text-cyan-400" />
            <span>SESSION AUDIT TRAIL</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black font-mono tracking-tight text-slate-100 uppercase">
            LOGIN HISTORY
          </h1>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search sessions..."
            className="pl-9 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-800 font-mono text-xs text-slate-200 focus:outline-none focus:border-cyan-500 w-full sm:w-64"
          />
        </div>
      </div>

      <div className="rounded-2xl glass-panel p-6 border border-cyan-500/20 shadow-hud">
        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400">
                <th className="py-3 px-4">DATE & TIME</th>
                <th className="py-3 px-4">DEVICE & BROWSER</th>
                <th className="py-3 px-4">LOCATION</th>
                <th className="py-3 px-4">BEHAVIORAL CONFIDENCE</th>
                <th className="py-3 px-4">STATUS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-200">
              {filteredHistory.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-900/40">
                  <td className="py-3 px-4 flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-cyan-400" />
                    <span>{row.date}</span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <Laptop className="w-3.5 h-3.5 text-blue-400" />
                      <span>{row.device}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <Globe className="w-3.5 h-3.5 text-purple-400" />
                      <span>{row.location}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 font-bold text-cyan-300">{row.confidence}</td>
                  <td className="py-3 px-4">
                    <StatusBadge status={row.status.toUpperCase()} />
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
