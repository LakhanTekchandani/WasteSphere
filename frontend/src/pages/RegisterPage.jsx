import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { BorderGlowCard } from '../components/common/BorderGlowCard';
import { Sparkles, User, Mail, Lock, Phone, Upload, Building2, CheckCircle2, ShieldAlert } from 'lucide-react';

export const RegisterPage = () => {
  const { registerCitizen, registerAdmin } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [role, setRole] = useState('citizen');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');

  // Stores actual File object for multipart form data submission
  const [officerIdFile, setOfficerIdFile] = useState(null);
  const [officerIdPhotoPreview, setOfficerIdPhotoPreview] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleOfficerIdUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setOfficerIdFile(file);
      const previewUrl = URL.createObjectURL(file);
      setOfficerIdPhotoPreview(previewUrl);
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

    if (role === 'admin' && !officerIdFile) {
      setError('Government / Officer ID photo proof is required for admin verification.');
      return;
    }

    setLoading(true);
    try {
      if (role === 'admin') {
        const formData = new FormData();
        formData.append('name', name);
        formData.append('email', email);
        formData.append('password', password);
        formData.append('phone', phone);
        formData.append('governmentIdImage', officerIdFile);

        await registerAdmin(formData);
        showToast('Admin registration submitted. Verification is pending approval.', 'info', 'Pending Verification');
        navigate('/admin');
      } else {
        await registerCitizen({ name, email, password, phone });
        showToast('Citizen account registered successfully!', 'success', 'Welcome');
        navigate('/dashboard');
      }
    } catch (err) {
      const msg = err?.message || 'Registration failed. Check your input details.';
      setError(msg);
      showToast(msg, 'error', 'Registration Error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-transparent">
      <motion.div 
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
        className="max-w-md w-full space-y-6"
      >
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-secondary text-primary border border-primary/40 mb-2">
            <Sparkles className="w-6 h-6" />
          </div>
          <h2 className="text-3xl font-extrabold text-foreground">Join WasteSphere</h2>
          <p className="text-muted-foreground text-sm">Create citizen or official government account</p>
        </div>

        {/* Role Toggle Tab */}
        <div className="grid grid-cols-2 p-1 bg-muted rounded-xl border border-border text-sm font-semibold">
          <button
            type="button"
            onClick={() => setRole('citizen')}
            className={`py-2.5 rounded-lg flex items-center justify-center gap-2 transition-all ${
              role === 'citizen'
                ? 'bg-primary text-primary-foreground font-bold shadow-md'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <User className="w-4 h-4" /> Citizen Account
          </button>
          <button
            type="button"
            onClick={() => setRole('admin')}
            className={`py-2.5 rounded-lg flex items-center justify-center gap-2 transition-all ${
              role === 'admin'
                ? 'bg-primary text-primary-foreground font-bold shadow-md'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Building2 className="w-4 h-4" /> Admin Officer
          </button>
        </div>

        <BorderGlowCard className="p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <motion.div 
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 rounded-lg bg-destructive/15 border border-destructive/40 text-destructive text-xs"
              >
                {error}
              </motion.div>
            )}

            <div>
              <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                Full Name
              </label>
              <div className="relative">
                <User className="w-5 h-5 absolute left-3.5 top-3.5 text-muted-foreground" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={role === 'admin' ? 'Officer Rajesh Kumar' : 'Aarav Sharma'}
                  className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-muted border border-border text-foreground text-sm focus:outline-none focus:border-primary"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-5 h-5 absolute left-3.5 top-3.5 text-muted-foreground" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-muted border border-border text-foreground text-sm focus:outline-none focus:border-primary"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                Mobile Phone (SMS Updates Destination)
              </label>
              <div className="relative">
                <Phone className="w-5 h-5 absolute left-3.5 top-3.5 text-muted-foreground" />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 9876543210"
                  className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-muted border border-border text-foreground text-sm focus:outline-none focus:border-primary"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="w-5 h-5 absolute left-3.5 top-3.5 text-muted-foreground" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-muted border border-border text-foreground text-sm focus:outline-none focus:border-primary"
                  required
                />
              </div>
            </div>

            {role === 'admin' && (
              <div className="p-4 rounded-xl bg-secondary border border-primary/40 space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-amber-600">
                  <ShieldAlert className="w-4 h-4 text-amber-500" />
                  Government Officer Verification Proof
                </div>
                <p className="text-xs text-muted-foreground">
                  Upload official Government ID / Officer badge proof. Account remains Pending Verification until approved by platform admin.
                </p>
                <div className="flex items-center gap-3">
                  <label className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-bold cursor-pointer flex items-center gap-2 hover:scale-105 transition-transform">
                    <Upload className="w-3.5 h-3.5" /> Upload ID Photo
                    <input type="file" accept="image/*" onChange={handleOfficerIdUpload} className="hidden" />
                  </label>
                  {officerIdFile && (
                    <span className="text-xs text-accent flex items-center gap-1 font-semibold">
                      <CheckCircle2 className="w-3.5 h-3.5" /> {officerIdFile.name}
                    </span>
                  )}
                </div>
              </div>
            )}

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-primary text-primary-foreground font-bold text-sm shadow-lg shadow-primary/20 transition-all disabled:opacity-50 mt-2"
            >
              {loading ? 'Creating Account...' : `Register as ${role === 'admin' ? 'Officer' : 'Citizen'}`}
            </motion.button>

            <div className="text-center pt-2">
              <span className="text-xs text-muted-foreground">Already registered? </span>
              <Link to="/login" className="text-xs font-semibold text-accent hover:underline">
                Sign In
              </Link>
            </div>
          </form>
        </BorderGlowCard>
      </motion.div>
    </div>
  );
};
