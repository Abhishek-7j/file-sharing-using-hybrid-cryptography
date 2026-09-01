import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Shield, Sparkles, User, Mail, Lock, Key, ArrowRight, Dna } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

export default function RegisterPage() {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    username: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      await register(formData.name, formData.email, formData.username, formData.password);
      // Redirect to Build Identity DNA onboarding
      navigate('/onboarding');
    } catch (err) {
      setError(err.message || 'Registration failed');
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
            CREATE IDENTITY PROFILE
          </h2>
          <p className="text-xs font-mono text-slate-400">
            Initialize your continuous behavioral security profile
          </p>
        </div>

        {/* Mandatory Prompt Banner */}
        <div className="p-3.5 rounded-2xl bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 text-xs font-mono flex items-center gap-2.5">
          <Dna className="w-4 h-4 text-cyan-400 shrink-0 animate-spin-slow" />
          <span>“Your behavioral identity will be learned after registration.”</span>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-rose-950/80 border border-rose-500/40 text-rose-300 text-xs font-mono">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 font-mono text-xs">
          <div>
            <label className="block text-slate-400 mb-1">Full Name</label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                placeholder="Arjun Kumar"
                className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-slate-200 focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-400 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="arjun@cybersec.org"
                className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-slate-200 focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-400 mb-1">Username</label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              <input
                type="text"
                name="username"
                required
                value={formData.username}
                onChange={handleChange}
                placeholder="arjun_cyber"
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
                name="password"
                required
                minLength={6}
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••••••"
                className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-slate-200 focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-400 mb-1">Confirm Password</label>
            <div className="relative">
              <Key className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              <input
                type="password"
                name="confirmPassword"
                required
                value={formData.confirmPassword}
                onChange={handleChange}
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
            <span>{loading ? 'Creating Profile...' : 'Build Your Identity DNA'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <p className="text-center text-xs font-mono text-slate-500 pt-2">
          Already have an identity profile?{' '}
          <Link to="/login" className="text-cyan-400 hover:underline">
            Log In
          </Link>
        </p>
      </div>
    </div>
  );
}
