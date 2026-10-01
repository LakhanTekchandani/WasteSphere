import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { GlowCursor } from './components/common/GlowCursor';
import { MoodFieldBackground } from './components/common/MoodFieldBackground';

// Pages
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { DashboardPage } from './pages/DashboardPage';
import { ReportWastePage } from './pages/ReportWastePage';
import { ComplaintsPage } from './pages/ComplaintsPage';
import { ComplaintDetailPage } from './pages/ComplaintDetailPage';
import { PickupPage } from './pages/PickupPage';
import { AwarenessPage } from './pages/AwarenessPage';
import { BadgesPage } from './pages/BadgesPage';
import { CertificatePage } from './pages/CertificatePage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { AdminVerificationsPage } from './pages/AdminVerificationsPage';

// Protected Route Component for Citizens
const CitizenRoute = ({ children }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return children;
};

// Protected Route Component for Admins
const AdminRoute = ({ children }) => {
  const { user, isAdmin } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (!isAdmin) return <Navigate to="/dashboard" replace />;
  return children;
};

// Page Transition Animation Wrapper
const PageTransition = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -12 }}
    transition={{ duration: 0.28, ease: 'easeOut' }}
    className="w-full"
  >
    {children}
  </motion.div>
);

export function AppContent() {
  const location = useLocation();
  const isLandingPage = location.pathname === '/';

  return (
    <div className="min-h-screen bg-transparent text-foreground flex flex-col relative">
      <MoodFieldBackground />
      <GlowCursor />
      {!isLandingPage && <Navbar />}
      <main className="flex-grow relative z-10">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            {/* Public Routes */}
            <Route path="/" element={<PageTransition><LandingPage /></PageTransition>} />
            <Route path="/login" element={<PageTransition><LoginPage /></PageTransition>} />
            <Route path="/register" element={<PageTransition><RegisterPage /></PageTransition>} />
            <Route path="/awareness" element={<PageTransition><AwarenessPage /></PageTransition>} />

            {/* PUBLIC Report/Complaint Flow - Accessible by Guests and Logged-in Users */}
            <Route path="/report" element={<PageTransition><ReportWastePage /></PageTransition>} />

            {/* Protected Citizen Routes */}
            <Route path="/dashboard" element={<CitizenRoute><PageTransition><DashboardPage /></PageTransition></CitizenRoute>} />
            <Route path="/complaints" element={<CitizenRoute><PageTransition><ComplaintsPage /></PageTransition></CitizenRoute>} />
            <Route path="/complaints/:id" element={<CitizenRoute><PageTransition><ComplaintDetailPage /></PageTransition></CitizenRoute>} />
            <Route path="/pickup" element={<CitizenRoute><PageTransition><PickupPage /></PageTransition></CitizenRoute>} />
            <Route path="/badges" element={<CitizenRoute><PageTransition><BadgesPage /></PageTransition></CitizenRoute>} />
            <Route path="/certificate" element={<CitizenRoute><PageTransition><CertificatePage /></PageTransition></CitizenRoute>} />

            {/* Protected Admin Routes */}
            <Route path="/admin" element={<AdminRoute><PageTransition><AdminDashboardPage /></PageTransition></AdminRoute>} />
            <Route path="/admin/verifications" element={<AdminRoute><PageTransition><AdminVerificationsPage /></PageTransition></AdminRoute>} />

            {/* Catch-all fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AnimatePresence>
      </main>
      {!isLandingPage && <Footer />}
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <Router>
          <AppContent />
        </Router>
      </ToastProvider>
    </AuthProvider>
  );
}
