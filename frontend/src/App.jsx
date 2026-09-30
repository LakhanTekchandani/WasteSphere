import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { GlowCursor } from './components/common/GlowCursor';

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

export function AppContent() {
  return (
    <div className="min-h-screen bg-[#05130E] text-slate-100 flex flex-col selection:bg-emerald-500/30 selection:text-emerald-300">
      <GlowCursor />
      <Navbar />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/awareness" element={<AwarenessPage />} />

          {/* Protected Citizen Routes */}
          <Route path="/dashboard" element={<CitizenRoute><DashboardPage /></CitizenRoute>} />
          <Route path="/report" element={<CitizenRoute><ReportWastePage /></CitizenRoute>} />
          <Route path="/complaints" element={<CitizenRoute><ComplaintsPage /></CitizenRoute>} />
          <Route path="/complaints/:id" element={<CitizenRoute><ComplaintDetailPage /></CitizenRoute>} />
          <Route path="/pickup" element={<CitizenRoute><PickupPage /></CitizenRoute>} />
          <Route path="/badges" element={<CitizenRoute><BadgesPage /></CitizenRoute>} />
          <Route path="/certificate" element={<CitizenRoute><CertificatePage /></CitizenRoute>} />

          {/* Protected Admin Routes */}
          <Route path="/admin" element={<AdminRoute><AdminDashboardPage /></AdminRoute>} />
          <Route path="/admin/verifications" element={<AdminRoute><AdminVerificationsPage /></AdminRoute>} />

          {/* Catch-all fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
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
