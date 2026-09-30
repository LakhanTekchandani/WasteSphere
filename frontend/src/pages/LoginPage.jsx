import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { BorderGlowCard } from '../components/common/BorderGlowCard';
import { Sparkles, Mail, Lock, ShieldCheck, User, Eye, EyeOff, Building2 } from 'lucide-react';

export const LoginPage = () => {
  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [role, setRole] = useState('citizen'); // 'citizen' or 'admin'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please fill in all required fields.');
      return;
    }

    setLoading(true);
    try {
      const res = await login({ email, password, role });
      showToast(`Welcome back, ${res.user.name}!`, 'success', 'Login Successful');
      if (res.user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setError('Invalid email or password credentials.');
      showToast('Authentication failed. Check credentials.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 mb-2">
            <Sparkles className="w-6 h-6" />
          </div>
          <h2 className="text-3xl font-extrabold text-white">Sign In to WasteSphere</h2>
          <p className="text-slate-400 text-sm">Access your citizen dashboard or officer portal</p>
        </div>

        {/* Role Toggle Tab */}
        <div className="grid grid-cols-2 p-1 bg-[#0B1F17] rounded-xl border border-emerald-500/20 text-sm font-semibold">
          <button
            type="button"
            onClick={() => setRole('citizen')}
            className={`py-2.5 rounded-lg flex items-center justify-center gap-2 transition-all ${
              role === 'citizen'
                ? 'bg-emerald-500 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <User className="w-4 h-4" /> Citizen
          </button>
          <button
            type="button"
            onClick={() => setRole('admin')}
            className={`py-2.5 rounded-lg flex items-center justify-center gap-2 transition-all ${
              role === 'admin'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Building2 className="w-4 h-4" /> Officer / Admin
          </button>
        </div>

        <BorderGlowCard className="p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
                {error}
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-5 h-5 absolute left-3.5 top-3.5 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={role === 'admin' ? 'admin@wastesphere.gov.in' : 'aarav@example.com'}
                  className="w-full pl-11 pr-4 py-3 rounded-xl bg-emerald-950/40 border border-emerald-500/20 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors text-sm"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="w-5 h-5 absolute left-3.5 top-3.5 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-11 pr-11 py-3 rounded-xl bg-emerald-950/40 border border-emerald-500/20 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors text-sm"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-200"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white font-bold text-sm shadow-lg shadow-emerald-500/25 transition-all hover:scale-[1.01] disabled:opacity-50"
            >
              {loading ? 'Authenticating...' : `Sign In as ${role === 'admin' ? 'Admin' : 'Citizen'}`}
            </button>

            <div className="text-center pt-2">
              <span className="text-xs text-slate-400">Don't have an account? </span>
              <Link to="/register" className="text-xs font-semibold text-emerald-400 hover:underline">
                Create Account
              </Link>
            </div>
          </form>
        </BorderGlowCard>
      </div>
    </div>
  );
};
