import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  Sparkles,
  LayoutDashboard,
  PlusCircle,
  FileText,
  Truck,
  BookOpen,
  Award,
  LogOut,
  Menu,
  X,
  UserCheck,
  Building2,
  FileCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const Navbar = () => {
  const { user, isCitizen, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileOpen(false);
  };

  return (
    <motion.header 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="sticky top-0 z-40 w-full glass-panel border-b border-[#2a3942] backdrop-blur-xl bg-[#0b141a]/90"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <motion.div 
              whileHover={{ rotate: 10, scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#00a884] to-[#075e54] flex items-center justify-center shadow-lg shadow-[#00a884]/25 border border-[#25d366]/30"
            >
              <Sparkles className="w-5 h-5 text-white" />
            </motion.div>
            <div className="flex flex-col">
              <span className="font-extrabold text-xl tracking-tight text-white group-hover:text-[#25d366] transition-colors">
                Waste<span className="text-[#25d366]">Sphere</span>
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1.5 text-sm font-medium">
            {!user && (
              <>
                <Link
                  to="/"
                  className={`px-3 py-2 rounded-lg transition-colors ${
                    isActive('/') ? 'text-[#25d366] bg-[#00a884]/15 border border-[#00a884]/30' : 'text-[#8696a0] hover:text-[#e9edef] hover:bg-[#1f2c34]/50'
                  }`}
                >
                  Home
                </Link>
                <Link
                  to="/report"
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg transition-colors ${
                    isActive('/report') ? 'text-[#25d366] bg-[#00a884]/15 border border-[#00a884]/30' : 'text-[#8696a0] hover:text-[#e9edef] hover:bg-[#1f2c34]/50'
                  }`}
                >
                  <PlusCircle className="w-4 h-4 text-[#25d366]" />
                  Report Waste
                </Link>
                <Link
                  to="/awareness"
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg transition-colors ${
                    isActive('/awareness') ? 'text-[#25d366] bg-[#00a884]/15 border border-[#00a884]/30' : 'text-[#8696a0] hover:text-[#e9edef] hover:bg-[#1f2c34]/50'
                  }`}
                >
                  <BookOpen className="w-4 h-4" />
                  Awareness & Quiz
                </Link>
              </>
            )}

            {isCitizen && (
              <>
                <Link
                  to="/dashboard"
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg transition-colors ${
                    isActive('/dashboard') ? 'text-[#25d366] bg-[#00a884]/15 border border-[#00a884]/30' : 'text-[#8696a0] hover:text-[#e9edef] hover:bg-[#1f2c34]/50'
                  }`}
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Dashboard
                </Link>

                <Link
                  to="/complaints"
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg transition-colors ${
                    isActive('/complaints') ? 'text-[#25d366] bg-[#00a884]/15 border border-[#00a884]/30' : 'text-[#8696a0] hover:text-[#e9edef] hover:bg-[#1f2c34]/50'
                  }`}
                >
                  <FileText className="w-4 h-4" />
                  My Complaints
                </Link>
               
                <Link
                  to="/awareness"
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg transition-colors ${
                    isActive('/awareness') ? 'text-[#25d366] bg-[#00a884]/15 border border-[#00a884]/30' : 'text-[#8696a0] hover:text-[#e9edef] hover:bg-[#1f2c34]/50'
                  }`}
                >
                  <BookOpen className="w-4 h-4" />
                  Awareness
                </Link>
                <Link
                  to="/badges"
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg transition-colors ${
                    isActive('/badges') ? 'text-[#25d366] bg-[#00a884]/15 border border-[#00a884]/30' : 'text-[#8696a0] hover:text-[#e9edef] hover:bg-[#1f2c34]/50'
                  }`}
                >
                  <Award className="w-4 h-4" />
                  Badges
                </Link>
                <Link
                  to="/certificate"
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg transition-colors ${
                    isActive('/certificate') ? 'text-[#25d366] bg-[#00a884]/15 border border-[#00a884]/30' : 'text-[#8696a0] hover:text-[#e9edef] hover:bg-[#1f2c34]/50'
                  }`}
                >
                  <FileCheck className="w-4 h-4" />
                  Certificate
                </Link>
              </>
            )}

            {isAdmin && (
              <>
                <Link
                  to="/admin"
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg transition-colors ${
                    isActive('/admin') ? 'text-[#25d366] bg-[#00a884]/15 border border-[#00a884]/30' : 'text-[#8696a0] hover:text-[#e9edef] hover:bg-[#1f2c34]/50'
                  }`}
                >
                  <Building2 className="w-4 h-4 text-[#25d366]" />
                  Admin Overview
                </Link>
                <Link
                  to="/admin/verifications"
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg transition-colors ${
                    isActive('/admin/verifications') ? 'text-[#25d366] bg-[#00a884]/15 border border-[#00a884]/30' : 'text-[#8696a0] hover:text-[#e9edef] hover:bg-[#1f2c34]/50'
                  }`}
                >
                  <UserCheck className="w-4 h-4" />
                  Officer Verifications
                </Link>
              </>
            )}
          </nav>

          {/* User Controls */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-3">
                <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-[#12332a] border border-[#00a884]/40 text-[#25d366] flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#25d366] animate-pulse" />
                  {user.role === 'admin' ? 'Officer' : 'Citizen'}
                </span>
                <span className="text-xs text-[#e9edef] font-semibold">{user.name}</span>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleLogout}
                  title="Logout"
                  className="p-2 rounded-lg text-[#8696a0] hover:text-[#ea4335] hover:bg-[#ea4335]/10 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </motion.button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-medium text-[#e9edef] hover:text-white transition-colors"
                >
                  Sign In
                </Link>
                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                  <Link
                    to="/register"
                    className="px-4 py-2 text-sm font-semibold rounded-xl bg-gradient-to-r from-[#00a884] to-[#25d366] text-[#111b21] shadow-lg shadow-[#00a884]/20 transition-all font-bold"
                  >
                    Get Started
                  </Link>
                </motion.div>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="p-2 rounded-lg text-[#e9edef] hover:bg-[#1f2c34]"
            >
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="md:hidden glass-panel border-t border-[#2a3942] px-4 pt-3 pb-6 flex flex-col gap-2 bg-[#0b141a]"
          >
            {user && (
              <div className="p-2.5 rounded-lg bg-[#12332a] border border-[#00a884]/30 mb-2 flex items-center justify-between text-xs text-[#e9edef]">
                <span>User: <strong>{user.name}</strong></span>
                <span className="font-semibold text-[#25d366] uppercase">{user.role}</span>
              </div>
            )}

            {isCitizen && (
              <>
                <Link to="/dashboard" onClick={() => setMobileOpen(false)} className="px-3 py-2 rounded-lg text-[#e9edef] hover:bg-[#1f2c34]">
                  Dashboard
                </Link>
                <Link to="/report" onClick={() => setMobileOpen(false)} className="px-3 py-2 rounded-lg text-[#25d366] font-semibold bg-[#00a884]/15">
                  + Report Waste
                </Link>
                <Link to="/complaints" onClick={() => setMobileOpen(false)} className="px-3 py-2 rounded-lg text-[#e9edef] hover:bg-[#1f2c34]">
                  My Complaints
                </Link>
                <Link to="/pickup" onClick={() => setMobileOpen(false)} className="px-3 py-2 rounded-lg text-[#e9edef] hover:bg-[#1f2c34]">
                  Pickup Request
                </Link>
                <Link to="/awareness" onClick={() => setMobileOpen(false)} className="px-3 py-2 rounded-lg text-[#e9edef] hover:bg-[#1f2c34]">
                  Awareness & Quiz
                </Link>
                <Link to="/badges" onClick={() => setMobileOpen(false)} className="px-3 py-2 rounded-lg text-[#e9edef] hover:bg-[#1f2c34]">
                  Badges
                </Link>
                <Link to="/certificate" onClick={() => setMobileOpen(false)} className="px-3 py-2 rounded-lg text-[#e9edef] hover:bg-[#1f2c34]">
                  Certificate
                </Link>
              </>
            )}

            {isAdmin && (
              <>
                <Link to="/admin" onClick={() => setMobileOpen(false)} className="px-3 py-2 rounded-lg text-[#e9edef] hover:bg-[#1f2c34]">
                  Admin Dashboard
                </Link>
                <Link to="/admin/verifications" onClick={() => setMobileOpen(false)} className="px-3 py-2 rounded-lg text-[#e9edef] hover:bg-[#1f2c34]">
                  Officer Verifications
                </Link>
              </>
            )}

            {!user && (
              <div className="flex flex-col gap-2 pt-2 border-t border-[#2a3942]">
                <Link to="/" onClick={() => setMobileOpen(false)} className="w-full px-3 py-2 rounded-lg text-[#e9edef] hover:bg-[#1f2c34]">
                  Home
                </Link>
                <Link to="/report" onClick={() => setMobileOpen(false)} className="w-full px-3 py-2 rounded-lg text-[#25d366] font-semibold bg-[#00a884]/15">
                  + Report Waste (Public)
                </Link>
                <Link to="/awareness" onClick={() => setMobileOpen(false)} className="w-full px-3 py-2 rounded-lg text-[#e9edef] hover:bg-[#1f2c34]">
                  Awareness & Quiz
                </Link>
                <Link to="/login" onClick={() => setMobileOpen(false)} className="w-full text-center py-2 text-[#e9edef] hover:bg-[#1f2c34] rounded-lg">
                  Sign In
                </Link>
                <Link to="/register" onClick={() => setMobileOpen(false)} className="w-full text-center py-2 rounded-xl bg-[#00a884] text-[#111b21] font-bold shadow-md">
                  Get Started
                </Link>
              </div>
            )}

            {user && (
              <button
                onClick={handleLogout}
                className="w-full mt-2 text-left px-3 py-2 rounded-lg text-[#ea4335] hover:bg-[#ea4335]/10 flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" /> Sign Out
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};
