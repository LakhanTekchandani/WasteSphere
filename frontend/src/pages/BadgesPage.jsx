import React from 'react';
import { useAuth } from '../context/AuthContext';
import { BorderGlowCard } from '../components/common/BorderGlowCard';
import { BadgeIcon } from '../components/common/BadgeIcon';
import { Award, ShieldAlert, CheckCircle2, Crown, Medal, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export const BadgesPage = () => {
  const { user } = useAuth();
  const qualifyingCount = user?.qualifyingComplaints || 4;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 bg-[#0b141a]"
    >
      {/* Title */}
      <div className="text-center space-y-2 max-w-xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold">
          <Award className="w-4 h-4 text-amber-400" />
          <span>CIVIC PARTICIPATION MEDAL SYSTEM</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white">Civic Participation Medals</h1>
        <p className="text-[#8696a0] text-sm">
          Earn recognition for verified waste issue reporting. Only valid, non-rejected complaints contribute to your medal progression.
        </p>
      </div>

      {/* Warning Rule Box */}
      <div className="p-4 rounded-2xl bg-amber-950/30 border border-amber-500/30 text-xs text-amber-200 flex items-start gap-3">
        <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <div className="font-bold">Anti-Abuse Platform Policy:</div>
          <p className="text-[#8696a0]">
            Complaint-based recognition cannot be exploited by repeated meaningless submissions. Only reports verified as valid by municipal administrators count toward Bronze, Silver, and Gold.
          </p>
        </div>
      </div>

      {/* User Progress Banner */}
      <BorderGlowCard className="p-6 space-y-4" activeGlow={true}>
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center sm:text-left">
            <span className="text-xs text-[#8696a0] uppercase font-semibold">Your Verified Qualifying Reports</span>
            <div className="text-3xl font-extrabold text-white">{qualifyingCount} Valid Reports</div>
            <div className="text-xs text-[#25d366] font-semibold">Current Recognition Level: {user?.recognition || 'Bronze'}</div>
          </div>

          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Link
              to="/report"
              className="px-6 py-3 rounded-xl bg-[#00a884] hover:bg-[#00a884]/90 text-[#111b21] font-bold text-xs shadow-lg flex items-center gap-2"
            >
              + Report Waste Issue
            </Link>
          </motion.div>
        </div>
      </BorderGlowCard>

      {/* Medals Breakdown Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Bronze */}
        <BorderGlowCard className="p-6 text-center space-y-4 flex flex-col justify-between" activeGlow={qualifyingCount >= 3}>
          <div className="space-y-4">
            <BadgeIcon type="Bronze" size="xl" />
            <div>
              <h3 className="text-xl font-bold text-white">BRONZE MEDAL</h3>
              <div className="text-xs font-semibold text-amber-400 mt-1">Requirement: 3–4 Valid Reports</div>
            </div>
            <p className="text-xs text-[#8696a0] leading-relaxed">
              Awarded to citizens who demonstrate consistent civic duty by identifying and submitting verified waste problems.
            </p>
          </div>

          <div className="pt-4 border-t border-[#2a3942]">
            {qualifyingCount >= 3 ? (
              <span className="px-4 py-1.5 rounded-full text-xs font-bold bg-[#12332a] text-[#25d366] border border-[#00a884]/40 inline-flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#25d366]" /> Medal Unlocked
              </span>
            ) : (
              <span className="text-xs text-[#8696a0] font-semibold">
                Progress: {qualifyingCount}/3 Reports
              </span>
            )}
          </div>
        </BorderGlowCard>

        {/* Silver */}
        <BorderGlowCard className="p-6 text-center space-y-4 flex flex-col justify-between" activeGlow={qualifyingCount >= 5}>
          <div className="space-y-4">
            <BadgeIcon type="Silver" size="xl" />
            <div>
              <h3 className="text-xl font-bold text-white">SILVER MEDAL</h3>
              <div className="text-xs font-semibold text-slate-300 mt-1">Requirement: 5–9 Valid Reports</div>
            </div>
            <p className="text-xs text-[#8696a0] leading-relaxed">
              Recognizes active environmental advocates maintaining clean neighborhood standards across multiple reported issues.
            </p>
          </div>

          <div className="pt-4 border-t border-[#2a3942]">
            {qualifyingCount >= 5 ? (
              <span className="px-4 py-1.5 rounded-full text-xs font-bold bg-[#12332a] text-[#25d366] border border-[#00a884]/40 inline-flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#25d366]" /> Medal Unlocked
              </span>
            ) : (
              <span className="text-xs text-[#8696a0] font-semibold">
                Progress: {qualifyingCount}/5 Reports
              </span>
            )}
          </div>
        </BorderGlowCard>

        {/* Gold */}
        <BorderGlowCard className="p-6 text-center space-y-4 flex flex-col justify-between" activeGlow={qualifyingCount >= 10}>
          <div className="space-y-4">
            <BadgeIcon type="Gold" size="xl" />
            <div>
              <h3 className="text-xl font-bold text-white">GOLD MEDAL</h3>
              <div className="text-xs font-semibold text-yellow-400 mt-1">Requirement: 10+ Valid Reports</div>
            </div>
            <p className="text-xs text-[#8696a0] leading-relaxed">
              Highest civic honor. Gold medalists unlock automatic eligibility for official administrator-issued certificates.
            </p>
          </div>

          <div className="pt-4 border-t border-[#2a3942]">
            {qualifyingCount >= 10 ? (
              <span className="px-4 py-1.5 rounded-full text-xs font-bold bg-[#12332a] text-[#25d366] border border-[#00a884]/40 inline-flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#25d366]" /> Medal Unlocked
              </span>
            ) : (
              <span className="text-xs text-[#8696a0] font-semibold">
                Progress: {qualifyingCount}/10 Reports
              </span>
            )}
          </div>
        </BorderGlowCard>
      </div>
    </motion.div>
  );
};
