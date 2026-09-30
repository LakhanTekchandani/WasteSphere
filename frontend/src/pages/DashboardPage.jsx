import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
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
  const qualifyingCount = user?.qualifyingComplaints || 4;

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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Welcome Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl glass-panel border border-emerald-500/25 bg-gradient-to-r from-[#0B1F17] via-[#071913] to-emerald-950/40">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-400">
            <Sparkles className="w-4 h-4" /> Citizen Workspace Portal
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Welcome back, <span className="text-emerald-300">{user?.name || 'Aarav'}</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-300">
            Registered Mobile: <span className="text-slate-200 font-mono">{user?.phone}</span> (Receives SMS alerts)
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/report"
            className="px-5 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-bold text-sm shadow-lg shadow-emerald-500/25 flex items-center gap-2 transition-transform hover:scale-[1.02]"
          >
            <PlusCircle className="w-4 h-4" /> Report Waste Issue
          </Link>
          <Link
            to="/pickup"
            className="px-4 py-3 rounded-xl glass-panel border border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/10 text-sm font-semibold flex items-center gap-2"
          >
            <Truck className="w-4 h-4" /> Request Pickup
          </Link>
        </div>
      </div>

      {/* Top Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <BorderGlowCard className="p-5 flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-400 font-medium uppercase">Active Complaints</div>
            <div className="text-3xl font-extrabold text-white mt-1">{activeCount}</div>
            <div className="text-xs text-amber-400 mt-1 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" /> Resolution in progress
            </div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
            <FileText className="w-6 h-6" />
          </div>
        </BorderGlowCard>

        <BorderGlowCard className="p-5 flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-400 font-medium uppercase">Resolved Reports</div>
            <div className="text-3xl font-extrabold text-white mt-1">{resolvedCount}</div>
            <div className="text-xs text-emerald-400 mt-1 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Qualifying for medals
            </div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </BorderGlowCard>

        <BorderGlowCard className="p-5 flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-400 font-medium uppercase">Learning Points</div>
            <div className="text-3xl font-extrabold text-white mt-1">{user?.points || 240}</div>
            <div className="text-xs text-teal-400 mt-1 flex items-center gap-1">
              <BookOpen className="w-3.5 h-3.5" /> From quizzes & guides
            </div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-teal-500/20 text-teal-400 flex items-center justify-center">
            <Sparkles className="w-6 h-6" />
          </div>
        </BorderGlowCard>

        <BorderGlowCard className="p-5 flex items-center justify-between" activeGlow={true}>
          <div>
            <div className="text-xs text-slate-400 font-medium uppercase">Current Medal</div>
            <div className="text-xl font-bold text-emerald-300 mt-1">{currentBadge}</div>
            <div className="text-xs text-slate-400 mt-1">
              {qualifyingCount} valid complaints
            </div>
          </div>
          <BadgeIcon type={currentBadge} size="sm" />
        </BorderGlowCard>
      </div>

      {/* Gamification Progress Bar & Certificate Eligibility */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Progress Card */}
        <BorderGlowCard className="lg:col-span-8 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Award className="w-5 h-5 text-emerald-400" /> Civic Medal Progression
            </h2>
            <Link to="/badges" className="text-xs text-emerald-400 hover:underline font-semibold">
              View All Milestones →
            </Link>
          </div>

          <p className="text-xs text-slate-300">
            Current Count: <strong className="text-white">{qualifyingCount} valid reports</strong>. (Note: Invalid/rejected reports are excluded by platform verification rules).
          </p>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-slate-400 font-semibold">
              <span>Bronze (3-4)</span>
              <span>Silver (5-9)</span>
              <span>Gold (10+)</span>
            </div>
            <div className="w-full h-3 rounded-full bg-emerald-950/80 overflow-hidden p-0.5 border border-emerald-500/30">
              <div
                className="h-full rounded-full bg-gradient-to-r from-amber-500 via-slate-300 to-yellow-400 transition-all duration-700"
                style={{ width: `${Math.min(badgeProgress, 100)}%` }}
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-emerald-500/15">
            <div className="flex items-center gap-3">
              <BadgeIcon type="Bronze" size="sm" />
              <BadgeIcon type="Silver" size="sm" />
              <BadgeIcon type="Gold" size="sm" />
            </div>
            <Link
              to="/certificate"
              className="px-4 py-2 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/30 text-xs font-semibold flex items-center gap-1.5"
            >
              <FileCheck className="w-4 h-4" /> Check Certificate Eligibility
            </Link>
          </div>
        </BorderGlowCard>

        {/* Certificate Quick Banner */}
        <BorderGlowCard className="lg:col-span-4 p-6 flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <FileCheck className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Official Certificate</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Approved by municipal waste administrators for citizens meeting awareness and report thresholds.
            </p>
          </div>

          <Link
            to="/certificate"
            className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white text-xs font-bold text-center block transition-colors shadow-md"
          >
            View Official Certificate
          </Link>
        </BorderGlowCard>
      </div>

      {/* Complaints & Pickups Split View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Recent Complaints */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <FileText className="w-5 h-5 text-emerald-400" /> Recent Waste Reports
            </h2>
            <Link to="/complaints" className="text-xs text-emerald-400 hover:underline font-semibold">
              View All Reports →
            </Link>
          </div>

          <div className="space-y-3">
            {complaints.slice(0, 3).map((cmp) => (
              <BorderGlowCard key={cmp.id} className="p-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-emerald-400">{cmp.id}</span>
                      <span className="text-xs text-slate-400">• {cmp.wasteType}</span>
                    </div>
                    <div className="text-sm font-semibold text-white">{cmp.issueType}</div>
                    <div className="text-xs text-slate-400">{cmp.location}</div>
                  </div>

                  <div className="flex flex-col items-end gap-1.5 w-full sm:w-auto">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        cmp.status === 'Resolved'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                          : cmp.status === 'In Progress'
                          ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40'
                          : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                      }`}
                    >
                      {cmp.status}
                    </span>
                    <Link
                      to={`/complaints/${cmp.id}`}
                      className="text-[11px] text-slate-400 hover:text-emerald-300 font-semibold"
                    >
                      Track Lifecycle →
                    </Link>
                  </div>
                </div>
              </BorderGlowCard>
            ))}
          </div>
        </div>

        {/* Pickup Requests & SMS Event Feed */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Truck className="w-5 h-5 text-teal-400" /> Doorstep Pickups
            </h2>
            <Link to="/pickup" className="text-xs text-teal-400 hover:underline font-semibold">
              New Request →
            </Link>
          </div>

          <div className="space-y-3">
            {pickups.map((pu) => (
              <BorderGlowCard key={pu.id} className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-teal-400">{pu.id} • {pu.wasteType}</div>
                    <div className="text-xs text-slate-300 mt-1">Date: {pu.preferredDate} ({pu.preferredTime})</div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    {pu.status}
                  </span>
                </div>
              </BorderGlowCard>
            ))}

            {/* In-app Notification Feed */}
            <div className="pt-2">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Bell className="w-3.5 h-3.5 text-emerald-400" /> System & SMS Event Logs
              </h3>
              <div className="space-y-2">
                {notifications.slice(0, 2).map((n) => (
                  <div key={n.id} className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/20 text-xs">
                    <div className="font-semibold text-emerald-300">{n.title}</div>
                    <div className="text-slate-300 text-[11px] mt-0.5">{n.message}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
