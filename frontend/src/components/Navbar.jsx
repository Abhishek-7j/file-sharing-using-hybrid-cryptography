import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Shield, Sparkles, User, LogOut, Menu, Lock } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import StatusBadge from './StatusBadge';

export default function Navbar({ confidence = 98.7, status = "TRUSTED", toggleSidebar }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-cyan-500/20 px-4 sm:px-8 py-3.5 flex items-center justify-between shadow-hud">
      {/* Brand & Logo */}
      <div className="flex items-center gap-4">
        {toggleSidebar && (
          <button
            onClick={toggleSidebar}
            className="md:hidden p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-cyan-400"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}

        <Link to="/" className="flex items-center gap-3 group">
          <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 p-0.5 shadow-cyan-glow group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Shield className="w-5 h-5 text-cyan-400 group-hover:rotate-12 transition-transform" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base font-extrabold font-mono tracking-wider text-slate-100 group-hover:text-cyan-400 transition-colors">
                IDENTITY DNA
              </span>
              <span className="hidden sm:inline text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/30">
                PROT-v1.0
              </span>
            </div>
            <p className="text-[10px] font-mono text-slate-400 hidden sm:block">
              Continuous Behavioral Authentication
            </p>
          </div>
        </Link>
      </div>

      {/* Center Status indicator / Protected Badge */}
      <div className="hidden lg:flex items-center gap-4 px-4 py-1.5 rounded-full bg-slate-900/80 border border-cyan-500/30">
        <StatusBadge status={status} />
        <span className="text-slate-600">|</span>
        <div className="flex items-center gap-2 text-xs font-mono text-slate-300">
          <span>Behavioral Confidence:</span>
          <span className="font-extrabold text-cyan-400">{confidence.toFixed(1)}%</span>
        </div>
        <span className="text-slate-600">|</span>
        <div className="flex items-center gap-1 text-[11px] font-mono text-emerald-400">
          <Lock className="w-3.5 h-3.5" />
          <span>SYSTEM PROTECTED</span>
        </div>
      </div>

      {/* User Actions */}
      <div className="flex items-center gap-3">
        {user ? (
          <div className="flex items-center gap-3">
            <Link
              to="/dashboard"
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs font-mono text-cyan-300 hover:border-cyan-500/50 transition-colors"
            >
              <User className="w-4 h-4 text-cyan-400" />
              <span className="hidden sm:inline">{user.username || 'User'}</span>
            </Link>
            <button
              onClick={handleLogout}
              className="p-2 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-400 hover:text-rose-400 hover:border-rose-500/40 transition-colors"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Link
              to="/login"
              className="px-4 py-2 rounded-xl text-xs font-mono text-slate-300 hover:text-white transition-colors"
            >
              Log In
            </Link>
            <Link
              to="/register"
              className="px-4 py-2 rounded-xl bg-cyan-500 text-slate-950 font-mono font-bold text-xs hover:bg-cyan-400 shadow-cyan-glow transition-all"
            >
              Create Identity DNA
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
