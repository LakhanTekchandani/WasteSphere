import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { BorderGlowCard } from '../components/common/BorderGlowCard';
import { Sparkles, User, Mail, Lock, Phone, Upload, Building2, CheckCircle2, ShieldAlert } from 'lucide-react';

export const RegisterPage = () => {
  const { register } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [role, setRole] = useState('citizen');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [officerIdPhoto, setOfficerIdPhoto] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleOfficerIdUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const fakeUrl = URL.createObjectURL(file);
      setOfficerIdPhoto(fakeUrl);
      showToast('Government ID image attached successfully.', 'info', 'ID Uploaded');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!name || !email || !password || !phone) {
      setError('Please fill in all required fields.');
      return;
    }

    if (role === 'admin' && !officerIdPhoto) {
      setError('Government / Officer ID photo proof is required for admin verification.');
      return;
    }

    setLoading(true);
    try {
      const res = await register({
        name,
        email,
        password,
        phone,
        role,
        officerIdPhoto: officerIdPhoto || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80'
      });

      if (role === 'admin') {
        showToast('Admin registration submitted. Verification is pending approval.', 'info', 'Pending Verification');
        navigate('/admin');
      } else {
        showToast('Citizen account registered successfully!', 'success', 'Welcome');
        navigate('/dashboard');
      }
    } catch (err) {
      setError('Registration failed. Email or phone number might already be registered.');
      showToast('Registration error', 'error');
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
          <h2 className="text-3xl font-extrabold text-white">Join WasteSphere</h2>
          <p className="text-slate-400 text-sm">Create citizen or official government account</p>
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
            <User className="w-4 h-4" /> Citizen Account
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
            <Building2 className="w-4 h-4" /> Admin Officer
          </button>
        </div>

        <BorderGlowCard className="p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
                {error}
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Full Name
              </label>
              <div className="relative">
                <User className="w-5 h-5 absolute left-3.5 top-3.5 text-slate-400" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={role === 'admin' ? 'Officer Rajesh Kumar' : 'Aarav Sharma'}
                  className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-emerald-950/40 border border-emerald-500/20 text-slate-100 text-sm focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-5 h-5 absolute left-3.5 top-3.5 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-emerald-950/40 border border-emerald-500/20 text-slate-100 text-sm focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Mobile Phone (SMS Updates Destination)
              </label>
              <div className="relative">
                <Phone className="w-5 h-5 absolute left-3.5 top-3.5 text-slate-400" />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 9876543210"
                  className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-emerald-950/40 border border-emerald-500/20 text-slate-100 text-sm focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="w-5 h-5 absolute left-3.5 top-3.5 text-slate-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-emerald-950/40 border border-emerald-500/20 text-slate-100 text-sm focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>
            </div>

            {role === 'admin' && (
              <div className="p-4 rounded-xl bg-emerald-950/60 border border-emerald-500/30 space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-amber-300">
                  <ShieldAlert className="w-4 h-4 text-amber-400" />
                  Government Officer Verification Proof
                </div>
                <p className="text-xs text-slate-300">
                  Upload official Government ID / Officer badge proof. Account remains Pending Verification until approved by platform admin.
                </p>
                <div className="flex items-center gap-3">
                  <label className="px-4 py-2 rounded-lg bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-semibold cursor-pointer flex items-center gap-2">
                    <Upload className="w-3.5 h-3.5" /> Upload ID Photo
                    <input type="file" accept="image/*" onChange={handleOfficerIdUpload} className="hidden" />
                  </label>
                  {officerIdPhoto && (
                    <span className="text-xs text-emerald-400 flex items-center gap-1 font-semibold">
                      <CheckCircle2 className="w-3.5 h-3.5" /> ID Uploaded
                    </span>
                  )}
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white font-bold text-sm shadow-lg shadow-emerald-500/25 transition-all hover:scale-[1.01] disabled:opacity-50 mt-2"
            >
              {loading ? 'Creating Account...' : `Register as ${role === 'admin' ? 'Officer' : 'Citizen'}`}
            </button>

            <div className="text-center pt-2">
              <span className="text-xs text-slate-400">Already registered? </span>
              <Link to="/login" className="text-xs font-semibold text-emerald-400 hover:underline">
                Sign In
              </Link>
            </div>
          </form>
        </BorderGlowCard>
      </div>
    </div>
  );
};
