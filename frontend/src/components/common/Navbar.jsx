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
  ShieldAlert,
  LogOut,
  Menu,
  X,
  Bell,
  CheckCircle,
  UserCheck,
  Building2,
  FileCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const Navbar = () => {
  const { user, isCitizen, isAdmin, isApprovedAdmin, logout, switchDemoRole } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showRoleSwitcherMenu, setShowRoleSwitcherMenu] = useState(false);

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-emerald-500/15 backdrop-blur-xl bg-[#05130E]/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform duration-300">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-xl tracking-tight text-white group-hover:text-emerald-300 transition-colors">
                Waste<span className="text-emerald-400">Sphere</span>
              </span>
              <span className="text-[10px] tracking-widest text-emerald-400/80 uppercase font-semibold">
                Civic Tech Platform
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
                    isActive('/') ? 'text-emerald-400 bg-emerald-500/10' : 'text-slate-300 hover:text-white hover:bg-emerald-950/30'
                  }`}
                >
                  Home
                </Link>
                <Link
                  to="/awareness"
                  className={`px-3 py-2 rounded-lg transition-colors ${
                    isActive('/awareness') ? 'text-emerald-400 bg-emerald-500/10' : 'text-slate-300 hover:text-white hover:bg-emerald-950/30'
                  }`}
                >
                  Awareness & Quiz
                </Link>
              </>
            )}

            {isCitizen && (
              <>
                <Link
                  to="/dashboard"
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg transition-colors ${
                    isActive('/dashboard') ? 'text-emerald-400 bg-emerald-500/10' : 'text-slate-300 hover:text-white hover:bg-emerald-950/30'
                  }`}
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Dashboard
                </Link>
                <Link
                  to="/report"
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg transition-colors ${
                    isActive('/report') ? 'text-emerald-400 bg-emerald-500/10' : 'text-slate-300 hover:text-white hover:bg-emerald-950/30'
                  }`}
                >
                  <PlusCircle className="w-4 h-4 text-emerald-400" />
                  Report Waste
                </Link>
                <Link
                  to="/complaints"
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg transition-colors ${
                    isActive('/complaints') ? 'text-emerald-400 bg-emerald-500/10' : 'text-slate-300 hover:text-white hover:bg-emerald-950/30'
                  }`}
                >
                  <FileText className="w-4 h-4" />
                  My Complaints
                </Link>
                <Link
                  to="/pickup"
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg transition-colors ${
                    isActive('/pickup') ? 'text-emerald-400 bg-emerald-500/10' : 'text-slate-300 hover:text-white hover:bg-emerald-950/30'
                  }`}
                >
                  <Truck className="w-4 h-4" />
                  Pickup Request
                </Link>
                <Link
                  to="/awareness"
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg transition-colors ${
                    isActive('/awareness') ? 'text-emerald-400 bg-emerald-500/10' : 'text-slate-300 hover:text-white hover:bg-emerald-950/30'
                  }`}
                >
                  <BookOpen className="w-4 h-4" />
                  Awareness
                </Link>
                <Link
                  to="/badges"
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg transition-colors ${
                    isActive('/badges') ? 'text-emerald-400 bg-emerald-500/10' : 'text-slate-300 hover:text-white hover:bg-emerald-950/30'
                  }`}
                >
                  <Award className="w-4 h-4" />
                  Badges
                </Link>
                <Link
                  to="/certificate"
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg transition-colors ${
                    isActive('/certificate') ? 'text-emerald-400 bg-emerald-500/10' : 'text-slate-300 hover:text-white hover:bg-emerald-950/30'
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
                    isActive('/admin') ? 'text-emerald-400 bg-emerald-500/10' : 'text-slate-300 hover:text-white hover:bg-emerald-950/30'
                  }`}
                >
                  <Building2 className="w-4 h-4 text-emerald-400" />
                  Admin Overview
                </Link>
                <Link
                  to="/admin/verifications"
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg transition-colors ${
                    isActive('/admin/verifications') ? 'text-emerald-400 bg-emerald-500/10' : 'text-slate-300 hover:text-white hover:bg-emerald-950/30'
                  }`}
                >
                  <UserCheck className="w-4 h-4" />
                  Officer Verifications
                </Link>
              </>
            )}
          </nav>

          {/* User Controls & Demo Switcher */}
          <div className="hidden md:flex items-center gap-3">
            {/* Hackathon Demo Role Switcher */}
            <div className="relative">
              <button
                onClick={() => setShowRoleSwitcherMenu(!showRoleSwitcherMenu)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-emerald-950/60 border border-emerald-500/30 text-emerald-300 hover:bg-emerald-900/60 transition-colors shadow-inner"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Role: {user ? (isAdmin ? 'Admin' : 'Citizen') : 'Guest'}
              </button>

              <AnimatePresence>
                {showRoleSwitcherMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute right-0 mt-2 w-48 rounded-xl glass-panel shadow-2xl p-2 z-50 border border-emerald-500/30"
                  >
                    <div className="text-[11px] font-semibold text-slate-400 px-3 py-1 uppercase tracking-wider">
                      Demo Role Switcher
                    </div>
                    <button
                      onClick={() => {
                        switchDemoRole('citizen');
                        setShowRoleSwitcherMenu(false);
                        navigate('/dashboard');
                      }}
                      className="w-full text-left px-3 py-2 text-xs rounded-lg hover:bg-emerald-500/20 text-slate-200 flex items-center justify-between"
                    >
                      <span>Citizen Demo User</span>
                      {isCitizen && <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />}
                    </button>
                    <button
                      onClick={() => {
                        switchDemoRole('admin');
                        setShowRoleSwitcherMenu(false);
                        navigate('/admin');
                      }}
                      className="w-full text-left px-3 py-2 text-xs rounded-lg hover:bg-emerald-500/20 text-slate-200 flex items-center justify-between"
                    >
                      <span>Admin Demo Officer</span>
                      {isAdmin && <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />}
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {user ? (
              <div className="flex items-center gap-2 pl-2 border-l border-emerald-500/20">
                <span className="text-xs text-slate-300 font-medium px-2">{user.name}</span>
                <button
                  onClick={handleLogout}
                  title="Logout"
                  className="p-2 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-medium text-slate-200 hover:text-white transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-sm font-semibold rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white shadow-lg shadow-emerald-500/25 transition-all hover:scale-[1.02]"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-emerald-950/40"
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
            className="md:hidden glass-panel border-t border-emerald-500/20 px-4 pt-3 pb-6 flex flex-col gap-2"
          >
            {/* Role indicator & switcher on mobile */}
            <div className="flex items-center justify-between p-2 rounded-lg bg-emerald-950/60 border border-emerald-500/20 mb-2">
              <span className="text-xs text-slate-300">Active Role: <strong>{user?.role || 'Guest'}</strong></span>
              <div className="flex gap-1">
                <button
                  onClick={() => { switchDemoRole('citizen'); navigate('/dashboard'); setMobileOpen(false); }}
                  className="px-2 py-1 text-[11px] rounded bg-emerald-800/50 text-emerald-200"
                >
                  Citizen
                </button>
                <button
                  onClick={() => { switchDemoRole('admin'); navigate('/admin'); setMobileOpen(false); }}
                  className="px-2 py-1 text-[11px] rounded bg-emerald-800/50 text-emerald-200"
                >
                  Admin
                </button>
              </div>
            </div>

            {isCitizen && (
              <>
                <Link to="/dashboard" onClick={() => setMobileOpen(false)} className="px-3 py-2 rounded-lg text-slate-200 hover:bg-emerald-500/10">
                  Dashboard
                </Link>
                <Link to="/report" onClick={() => setMobileOpen(false)} className="px-3 py-2 rounded-lg text-emerald-400 font-semibold bg-emerald-500/10">
                  + Report Waste
                </Link>
                <Link to="/complaints" onClick={() => setMobileOpen(false)} className="px-3 py-2 rounded-lg text-slate-200 hover:bg-emerald-500/10">
                  My Complaints
                </Link>
                <Link to="/pickup" onClick={() => setMobileOpen(false)} className="px-3 py-2 rounded-lg text-slate-200 hover:bg-emerald-500/10">
                  Pickup Request
                </Link>
                <Link to="/awareness" onClick={() => setMobileOpen(false)} className="px-3 py-2 rounded-lg text-slate-200 hover:bg-emerald-500/10">
                  Awareness & Quiz
                </Link>
                <Link to="/badges" onClick={() => setMobileOpen(false)} className="px-3 py-2 rounded-lg text-slate-200 hover:bg-emerald-500/10">
                  Badges
                </Link>
                <Link to="/certificate" onClick={() => setMobileOpen(false)} className="px-3 py-2 rounded-lg text-slate-200 hover:bg-emerald-500/10">
                  Certificate
                </Link>
              </>
            )}

            {isAdmin && (
              <>
                <Link to="/admin" onClick={() => setMobileOpen(false)} className="px-3 py-2 rounded-lg text-slate-200 hover:bg-emerald-500/10">
                  Admin Dashboard
                </Link>
                <Link to="/admin/verifications" onClick={() => setMobileOpen(false)} className="px-3 py-2 rounded-lg text-slate-200 hover:bg-emerald-500/10">
                  Officer Verifications
                </Link>
              </>
            )}

            {!user && (
              <div className="flex flex-col gap-2 pt-2 border-t border-emerald-500/20">
                <Link to="/login" onClick={() => setMobileOpen(false)} className="w-full text-center py-2 text-slate-200">
                  Sign In
                </Link>
                <Link to="/register" onClick={() => setMobileOpen(false)} className="w-full text-center py-2 rounded-xl bg-emerald-500 text-white font-semibold">
                  Get Started
                </Link>
              </div>
            )}

            {user && (
              <button
                onClick={handleLogout}
                className="w-full mt-2 text-left px-3 py-2 rounded-lg text-rose-400 hover:bg-rose-500/10 flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" /> Sign Out
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
