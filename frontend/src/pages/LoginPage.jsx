import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { BorderGlowCard } from '../components/common/BorderGlowCard';
import { Sparkles, Mail, Lock, User, Eye, EyeOff, Building2 } from 'lucide-react';

export const LoginPage = () => {
  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [role, setRole] = useState('citizen'); // Visual role tab helper
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
      const res = await login({ email, password });
      showToast(`Welcome back, ${res.user.name}!`, 'success', 'Login Successful');

      if (res.user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      const msg = err?.message || 'Invalid email or password credentials.';
      setError(msg);
      showToast(msg, 'error', 'Authentication Error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-[#0b141a]">
      <motion.div 
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
        className="max-w-md w-full space-y-6"
      >
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-[#12332a] text-[#25d366] border border-[#00a884]/40 mb-2">
            <Sparkles className="w-6 h-6" />
          </div>
          <h2 className="text-3xl font-extrabold text-white">Sign In to WasteSphere</h2>
          <p className="text-[#8696a0] text-sm">Access your citizen dashboard or officer portal</p>
        </div>

        {/* Role Toggle Tab */}
        <div className="grid grid-cols-2 p-1 bg-[#111b21] rounded-xl border border-[#2a3942] text-sm font-semibold">
          <button
            type="button"
            onClick={() => setRole('citizen')}
            className={`py-2.5 rounded-lg flex items-center justify-center gap-2 transition-all ${
              role === 'citizen'
                ? 'bg-[#00a884] text-[#111b21] font-bold shadow-md'
                : 'text-[#8696a0] hover:text-[#e9edef]'
            }`}
          >
            <User className="w-4 h-4" /> Citizen
          </button>
          <button
            type="button"
            onClick={() => setRole('admin')}
            className={`py-2.5 rounded-lg flex items-center justify-center gap-2 transition-all ${
              role === 'admin'
                ? 'bg-[#00a884] text-[#111b21] font-bold shadow-md'
                : 'text-[#8696a0] hover:text-[#e9edef]'
            }`}
          >
            <Building2 className="w-4 h-4" /> Officer / Admin
          </button>
        </div>

        <BorderGlowCard className="p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <motion.div 
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 rounded-lg bg-[#ea4335]/15 border border-[#ea4335]/40 text-[#ea4335] text-xs"
              >
                {error}
              </motion.div>
            )}

            <div>
              <label className="block text-xs font-semibold text-[#8696a0] uppercase tracking-wider mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-5 h-5 absolute left-3.5 top-3.5 text-[#8696a0]" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={role === 'admin' ? 'admin@wastesphere.gov.in' : 'citizen@example.com'}
                  className="w-full pl-11 pr-4 py-3 rounded-xl bg-[#111b21] border border-[#2a3942] text-[#e9edef] placeholder-[#8696a0] focus:outline-none focus:border-[#00a884] transition-colors text-sm"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#8696a0] uppercase tracking-wider mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="w-5 h-5 absolute left-3.5 top-3.5 text-[#8696a0]" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-11 pr-11 py-3 rounded-xl bg-[#111b21] border border-[#2a3942] text-[#e9edef] placeholder-[#8696a0] focus:outline-none focus:border-[#00a884] transition-colors text-sm"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3.5 text-[#8696a0] hover:text-[#e9edef]"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#00a884] to-[#25d366] text-[#111b21] font-bold text-sm shadow-lg shadow-[#00a884]/20 transition-all disabled:opacity-50"
            >
              {loading ? 'Authenticating...' : `Sign In as ${role === 'admin' ? 'Admin' : 'Citizen'}`}
            </motion.button>

            <div className="text-center pt-2">
              <span className="text-xs text-[#8696a0]">Don't have an account? </span>
              <Link to="/register" className="text-xs font-semibold text-[#25d366] hover:underline">
                Create Account
              </Link>
            </div>
          </form>
        </BorderGlowCard>
      </motion.div>
    </div>
  );
};
