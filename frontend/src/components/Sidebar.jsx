import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Dna, 
  Cpu, 
  BarChart3, 
  History, 
  ShieldAlert, 
  User, 
  Settings, 
  LogOut,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

export default function Sidebar({ isOpen, onClose }) {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Identity DNA', path: '/identity-dna', icon: Dna },
    { label: 'AI Detection', path: '/ai-detection', icon: Cpu },
    { label: 'Behavioral Analytics', path: '/analytics', icon: BarChart3 },
    { label: 'Login History', path: '/login-history', icon: History },
    { label: 'Security Events', path: '/security-events', icon: ShieldAlert },
    { label: 'Profile', path: '/profile', icon: User },
    { label: 'Settings', path: '/settings', icon: Settings },
  ];

  return (
    <aside className={`fixed md:static inset-y-0 left-0 z-30 w-64 glass-panel border-r border-cyan-500/20 p-4 flex flex-col justify-between transition-transform duration-300 ${
      isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
    }`}>
      <div className="space-y-6">
        <div className="px-3 pt-2 pb-1 border-b border-slate-800/80 flex items-center justify-between">
          <span className="text-[11px] font-mono text-cyan-400 font-bold uppercase tracking-widest flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" /> NAVIGATION HUD
          </span>
          <span className="text-[9px] font-mono text-slate-500">v1.0</span>
        </div>

        <nav className="space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-mono transition-all duration-200 ${
                    isActive
                      ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/40 shadow-cyan-glow font-bold'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                  }`
                }
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>

      <div className="pt-4 border-t border-slate-800/80 space-y-3">
        <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-[11px] font-mono">
          <div className="text-slate-400">ENGINE STATUS</div>
          <div className="text-emerald-400 font-bold flex items-center gap-1.5 mt-0.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>CONTINUOUS MONITORING</span>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-mono text-rose-400 hover:bg-rose-950/40 hover:border-rose-500/30 border border-transparent transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
