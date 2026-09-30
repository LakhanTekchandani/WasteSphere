import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { BorderGlowCard } from '../components/common/BorderGlowCard';
import { BadgeIcon } from '../components/common/BadgeIcon';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import {
  PlusCircle,
  FileText,
  Truck,
  Award,
  BookOpen,
  CheckCircle2,
  Clock,
  Bell,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  FileCheck,
  AlertTriangle
} from 'lucide-react';

export const DashboardPage = () => {
  const { user } = useAuth();
  const [complaints, setComplaints] = useState([]);
  const [pickups, setPickups] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [cmpData, puData, notifData] = await Promise.all([
          api.getComplaints(),
          api.getPickups(),
          api.getNotifications()
        ]);
        setComplaints(cmpData);
        setPickups(puData);
        setNotifications(notifData);
      } catch (err) {
        console.error('Error loading dashboard data', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <LoadingSpinner label="Loading citizen workspace..." />;

  const activeCount = complaints.filter((c) => c.status !== 'Resolved' && c.status !== 'Rejected').length;
  const resolvedCount = complaints.filter((c) => c.status === 'Resolved').length;
  const qualifyingCount = user?.qualifyingComplaints || complaints.filter(c => c.status === 'Resolved').length;

  // Calculation for Bronze/Silver/Gold progress
  let nextMilestone = 3;
  let currentBadge = 'None';
  let badgeProgress = 0;

  if (qualifyingCount >= 10) {
    currentBadge = 'Gold';
    nextMilestone = 10;
    badgeProgress = 100;
  } else if (qualifyingCount >= 5) {
    currentBadge = 'Silver';
    nextMilestone = 10;
    badgeProgress = Math.round((qualifyingCount / 10) * 100);
  } else if (qualifyingCount >= 3) {
    currentBadge = 'Bronze';
    nextMilestone = 5;
    badgeProgress = Math.round((qualifyingCount / 5) * 100);
  } else {
    currentBadge = 'None';
    nextMilestone = 3;
    badgeProgress = Math.round((qualifyingCount / 3) * 100);
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 12 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' } }
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 bg-background"
    >
      {/* Welcome Banner */}
      <motion.div variants={itemVariants} className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl border border-border bg-card">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-accent">
            <Sparkles className="w-4 h-4" /> Citizen Workspace Portal
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground">
            Welcome back, <span className="text-accent">{user?.name || 'Citizen'}</span>
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Registered Mobile: <span className="text-foreground font-mono">{user?.phone}</span> (Receives live alerts)
          </p>
        </div>

        <div className="flex items-center gap-3">
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Link
              to="/report"
              className="px-5 py-3 rounded-xl bg-primary text-primary-foreground font-bold text-sm shadow-lg shadow-primary/20 flex items-center gap-2"
            >
              <PlusCircle className="w-4 h-4" /> Report Waste Issue
            </Link>
          </motion.div>
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Link
              to="/pickup"
              className="px-4 py-3 rounded-xl border border-border text-primary hover:bg-secondary text-sm font-semibold flex items-center gap-2"
            >
              <Truck className="w-4 h-4" /> Request Pickup
            </Link>
          </motion.div>
        </div>
      </motion.div>

      {/* Top Metric Cards */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <BorderGlowCard className="p-5 flex items-center justify-between">
          <div>
            <div className="text-xs text-muted-foreground font-medium uppercase">Active Complaints</div>
            <div className="text-3xl font-extrabold text-foreground mt-1">{activeCount}</div>
            <div className="text-xs text-amber-500 mt-1 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" /> Resolution in progress
            </div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-500/20 text-amber-500 flex items-center justify-center">
            <FileText className="w-6 h-6" />
          </div>
        </BorderGlowCard>

        <BorderGlowCard className="p-5 flex items-center justify-between">
          <div>
            <div className="text-xs text-muted-foreground font-medium uppercase">Resolved Reports</div>
            <div className="text-3xl font-extrabold text-foreground mt-1">{resolvedCount}</div>
            <div className="text-xs text-accent mt-1 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Qualifying for medals
            </div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-secondary text-accent flex items-center justify-center border border-primary/30">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </BorderGlowCard>

        <BorderGlowCard className="p-5 flex items-center justify-between">
          <div>
            <div className="text-xs text-muted-foreground font-medium uppercase">Learning Points</div>
            <div className="text-3xl font-extrabold text-foreground mt-1">{user?.points || 120}</div>
            <div className="text-xs text-chart-4 mt-1 flex items-center gap-1">
              <BookOpen className="w-3.5 h-3.5" /> From quizzes & guides
            </div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-chart-4/20 text-chart-4 flex items-center justify-center">
            <Sparkles className="w-6 h-6" />
          </div>
        </BorderGlowCard>

        <BorderGlowCard className="p-5 flex items-center justify-between" activeGlow={true}>
          <div>
            <div className="text-xs text-muted-foreground font-medium uppercase">Current Medal</div>
            <div className="text-xl font-bold text-accent mt-1">{currentBadge}</div>
            <div className="text-xs text-muted-foreground mt-1">
              {qualifyingCount} valid complaints
            </div>
          </div>
          <BadgeIcon type={currentBadge} size="sm" />
        </BorderGlowCard>
      </motion.div>

      {/* Gamification Progress Bar & Certificate Eligibility */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Progress Card */}
        <BorderGlowCard className="lg:col-span-8 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
              <Award className="w-5 h-5 text-accent" /> Civic Medal Progression
            </h2>
            <Link to="/badges" className="text-xs text-accent hover:underline font-semibold">
              View All Milestones →
            </Link>
          </div>

          <p className="text-xs text-muted-foreground">
            Current Count: <strong className="text-foreground">{qualifyingCount} valid reports</strong>. (Note: Invalid/rejected reports are excluded by platform verification rules).
          </p>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-muted-foreground font-semibold">
              <span>Bronze (3-4)</span>
              <span>Silver (5-9)</span>
              <span>Gold (10+)</span>
            </div>
            <div className="w-full h-3 rounded-full bg-muted overflow-hidden p-0.5 border border-border">
              <div
                className="h-full rounded-full bg-gradient-to-r from-amber-500 via-slate-400 to-accent transition-all duration-700"
                style={{ width: `${Math.min(badgeProgress, 100)}%` }}
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-border">
            <div className="flex items-center gap-3">
              <BadgeIcon type="Bronze" size="sm" />
              <BadgeIcon type="Silver" size="sm" />
              <BadgeIcon type="Gold" size="sm" />
            </div>
            <Link
              to="/certificate"
              className="px-4 py-2 rounded-xl bg-secondary text-primary border border-primary/40 hover:bg-primary/10 text-xs font-semibold flex items-center gap-1.5"
            >
              <FileCheck className="w-4 h-4" /> Check Certificate Eligibility
            </Link>
          </div>
        </BorderGlowCard>

        {/* Certificate Quick Banner */}
        <BorderGlowCard className="lg:col-span-4 p-6 flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-xl bg-secondary text-primary flex items-center justify-center border border-primary/30">
              <FileCheck className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-foreground">Official Certificate</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Approved by municipal waste administrators for citizens meeting awareness and report thresholds.
            </p>
          </div>

          <Link
            to="/certificate"
            className="w-full py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-bold text-center block transition-colors shadow-md"
          >
            View Official Certificate
          </Link>
        </BorderGlowCard>
      </motion.div>

      {/* Complaints & Pickups Split View */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Recent Complaints */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
              <FileText className="w-5 h-5 text-accent" /> Recent Waste Reports
            </h2>
            <Link to="/complaints" className="text-xs text-accent hover:underline font-semibold">
              View All Reports →
            </Link>
          </div>

          <div className="space-y-3">
            {complaints.length === 0 ? (
              <BorderGlowCard className="p-8 text-center text-muted-foreground text-sm">
                No waste reports recorded yet. Click above to submit your first report.
              </BorderGlowCard>
            ) : (
              complaints.slice(0, 3).map((cmp) => (
                <BorderGlowCard key={cmp.id} className="p-4">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-accent">{cmp.id}</span>
                        <span className="text-xs text-muted-foreground">• {cmp.wasteType}</span>
                      </div>
                      <div className="text-sm font-semibold text-foreground">{cmp.issueType}</div>
                      <div className="text-xs text-muted-foreground">{cmp.location}</div>
                    </div>

                    <div className="flex flex-col items-end gap-1.5 w-full sm:w-auto">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          cmp.status === 'Resolved'
                            ? 'bg-secondary text-accent border border-primary/40'
                            : cmp.status === 'In Progress'
                            ? 'bg-sky-500/20 text-sky-600 border border-sky-500/40'
                            : 'bg-amber-500/20 text-amber-600 border border-amber-500/40'
                        }`}
                      >
                        {cmp.status}
                      </span>
                      <Link
                        to={`/complaints/${cmp.id}`}
                        className="text-[11px] text-muted-foreground hover:text-accent font-semibold"
                      >
                        Track Lifecycle →
                      </Link>
                    </div>
                  </div>
                </BorderGlowCard>
              ))
            )}
          </div>
        </div>

        {/* Pickup Requests & Notification Feed */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
              <Truck className="w-5 h-5 text-accent" /> Doorstep Pickups
            </h2>
            <Link to="/pickup" className="text-xs text-accent hover:underline font-semibold">
              New Request →
            </Link>
          </div>

          <div className="space-y-3">
            {pickups.length === 0 ? (
              <BorderGlowCard className="p-4 text-center text-muted-foreground text-xs">
                No active pickup requests.
              </BorderGlowCard>
            ) : (
              pickups.slice(0, 2).map((pu) => (
                <BorderGlowCard key={pu.id} className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-accent">{pu.id} • {pu.wasteType}</div>
                      <div className="text-xs text-muted-foreground mt-1">Date: {pu.preferredDate} ({pu.preferredTime})</div>
                    </div>
                    <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-secondary text-accent border border-primary/30">
                      {pu.status}
                    </span>
                  </div>
                </BorderGlowCard>
              ))
            )}

            {/* In-app Notification Feed */}
            <div className="pt-2">
              <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Bell className="w-3.5 h-3.5 text-accent" /> System & Event Logs
              </h3>
              <div className="space-y-2">
                {notifications.slice(0, 2).map((n) => (
                  <div key={n.id} className="p-3 rounded-xl bg-muted border border-border text-xs">
                    <div className="font-semibold text-accent">{n.title}</div>
                    <div className="text-muted-foreground text-[11px] mt-0.5">{n.message}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};
