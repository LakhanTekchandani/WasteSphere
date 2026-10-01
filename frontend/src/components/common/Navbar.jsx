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
      className="sticky top-0 z-40 w-full border-b border-border/80 backdrop-blur-md bg-background/50"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <motion.div 
              whileHover={{ rotate: 10, scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/25 border border-primary/30"
            >
              <Sparkles className="w-5 h-5 text-primary-foreground" />
            </motion.div>
            <div className="flex flex-col">
              <span className="font-extrabold text-xl tracking-tight text-foreground group-hover:text-primary transition-colors">
                Waste<span className="text-primary">Sphere</span>
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
                    isActive('/') ? 'text-primary bg-secondary border border-primary/30' : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                  }`}
                >
                  Home
                </Link>
                <Link
                  to="/report"
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg transition-colors ${
                    isActive('/report') ? 'text-primary bg-secondary border border-primary/30' : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                  }`}
                >
                  <PlusCircle className="w-4 h-4 text-primary" />
                  Report Waste
                </Link>
                <Link
                  to="/awareness"
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg transition-colors ${
                    isActive('/awareness') ? 'text-primary bg-secondary border border-primary/30' : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
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
                    isActive('/dashboard') ? 'text-primary bg-secondary border border-primary/30' : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                  }`}
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Dashboard
                </Link>

                <Link
                  to="/complaints"
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg transition-colors ${
                    isActive('/complaints') ? 'text-primary bg-secondary border border-primary/30' : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                  }`}
                >
                  <FileText className="w-4 h-4" />
                  My Complaints
                </Link>
               
                <Link
                  to="/awareness"
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg transition-colors ${
                    isActive('/awareness') ? 'text-primary bg-secondary border border-primary/30' : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                  }`}
                >
                  <BookOpen className="w-4 h-4" />
                  Awareness
                </Link>
                <Link
                  to="/badges"
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg transition-colors ${
                    isActive('/badges') ? 'text-primary bg-secondary border border-primary/30' : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                  }`}
                >
                  <Award className="w-4 h-4" />
                  Badges
                </Link>
                <Link
                  to="/certificate"
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg transition-colors ${
                    isActive('/certificate') ? 'text-primary bg-secondary border border-primary/30' : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
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
                    isActive('/admin') ? 'text-primary bg-secondary border border-primary/30' : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                  }`}
                >
                  <Building2 className="w-4 h-4 text-primary" />
                  Admin Overview
                </Link>
                <Link
                  to="/admin/verifications"
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg transition-colors ${
                    isActive('/admin/verifications') ? 'text-primary bg-secondary border border-primary/30' : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
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
                <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-secondary border border-primary/40 text-primary flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                  {user.role === 'admin' ? 'Officer' : 'Citizen'}
                </span>
                <span className="text-xs text-foreground font-semibold">{user.name}</span>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleLogout}
                  title="Logout"
                  className="p-2 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </motion.button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-medium text-foreground hover:text-primary transition-colors"
                >
                  Sign In
                </Link>
                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                  <Link
                    to="/register"
                    className="px-4 py-2 text-sm font-semibold rounded-xl bg-primary text-primary-foreground shadow-lg shadow-primary/20 transition-all font-bold"
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
              className="p-2 rounded-lg text-foreground hover:bg-muted"
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
            className="md:hidden border-t border-border px-4 pt-3 pb-6 flex flex-col gap-2 bg-background/95"
          >
            {user && (
              <div className="p-2.5 rounded-lg bg-secondary border border-primary/30 mb-2 flex items-center justify-between text-xs text-foreground">
                <span>User: <strong>{user.name}</strong></span>
                <span className="font-semibold text-primary uppercase">{user.role}</span>
              </div>
            )}

            {isCitizen && (
              <>
                <Link to="/dashboard" onClick={() => setMobileOpen(false)} className="px-3 py-2 rounded-lg text-foreground hover:bg-muted">
                  Dashboard
                </Link>
                <Link to="/report" onClick={() => setMobileOpen(false)} className="px-3 py-2 rounded-lg text-primary font-semibold bg-secondary">
                  + Report Waste
                </Link>
                <Link to="/complaints" onClick={() => setMobileOpen(false)} className="px-3 py-2 rounded-lg text-foreground hover:bg-muted">
                  My Complaints
                </Link>
                <Link to="/pickup" onClick={() => setMobileOpen(false)} className="px-3 py-2 rounded-lg text-foreground hover:bg-muted">
                  Pickup Request
                </Link>
                <Link to="/awareness" onClick={() => setMobileOpen(false)} className="px-3 py-2 rounded-lg text-foreground hover:bg-muted">
                  Awareness & Quiz
                </Link>
                <Link to="/badges" onClick={() => setMobileOpen(false)} className="px-3 py-2 rounded-lg text-foreground hover:bg-muted">
                  Badges
                </Link>
                <Link to="/certificate" onClick={() => setMobileOpen(false)} className="px-3 py-2 rounded-lg text-foreground hover:bg-muted">
                  Certificate
                </Link>
              </>
            )}

            {isAdmin && (
              <>
                <Link to="/admin" onClick={() => setMobileOpen(false)} className="px-3 py-2 rounded-lg text-foreground hover:bg-muted">
                  Admin Dashboard
                </Link>
                <Link to="/admin/verifications" onClick={() => setMobileOpen(false)} className="px-3 py-2 rounded-lg text-foreground hover:bg-muted">
                  Officer Verifications
                </Link>
              </>
            )}

            {!user && (
              <div className="flex flex-col gap-2 pt-2 border-t border-border">
                <Link to="/" onClick={() => setMobileOpen(false)} className="w-full px-3 py-2 rounded-lg text-foreground hover:bg-muted">
                  Home
                </Link>
                <Link to="/report" onClick={() => setMobileOpen(false)} className="w-full px-3 py-2 rounded-lg text-primary font-semibold bg-secondary">
                  + Report Waste (Public)
                </Link>
                <Link to="/awareness" onClick={() => setMobileOpen(false)} className="w-full px-3 py-2 rounded-lg text-foreground hover:bg-muted">
                  Awareness & Quiz
                </Link>
                <Link to="/login" onClick={() => setMobileOpen(false)} className="w-full text-center py-2 text-foreground hover:bg-muted rounded-lg">
                  Sign In
                </Link>
                <Link to="/register" onClick={() => setMobileOpen(false)} className="w-full text-center py-2 rounded-xl bg-primary text-primary-foreground font-bold shadow-md">
                  Get Started
                </Link>
              </div>
            )}

            {user && (
              <button
                onClick={handleLogout}
                className="w-full mt-2 text-left px-3 py-2 rounded-lg text-destructive hover:bg-destructive/10 flex items-center gap-2"
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
