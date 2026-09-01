import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Shield, User, Lock, ArrowRight } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [usernameOrEmail, setUsernameOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(usernameOrEmail, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Login failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center p-4 sm:p-8">
      <div className="w-full max-w-md glass-panel p-8 rounded-3xl border border-cyan-500/30 shadow-hud space-y-6">
        
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-slate-900 border border-cyan-500/30 text-cyan-400 flex items-center justify-center mx-auto shadow-cyan-glow">
            <Shield className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-black font-mono tracking-tight text-slate-100 uppercase">
            SECURE LOGIN
          </h2>
          <p className="text-xs font-mono text-slate-400">
            Continuous behavioral authentication initialized
          </p>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-rose-950/80 border border-rose-500/40 text-rose-300 text-xs font-mono">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 font-mono text-xs">
          <div>
            <label className="block text-slate-400 mb-1">Username or Email</label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              <input
                type="text"
                required
                value={usernameOrEmail}
                onChange={(e) => setUsernameOrEmail(e.target.value)}
                placeholder="arjun_cyber or arjun@cybersec.org"
                className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-slate-200 focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-400 mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-slate-200 focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold hover:from-cyan-400 hover:to-blue-500 shadow-cyan-glow transition-all flex items-center justify-center gap-2 mt-4"
          >
            <span>{loading ? 'Authenticating...' : 'Authenticate Session'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <p className="text-center text-xs font-mono text-slate-500 pt-2">
          Don't have an Identity DNA profile?{' '}
          <Link to="/register" className="text-cyan-400 hover:underline">
            Register Here
          </Link>
        </p>
      </div>
    </div>
  );
}
