import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { api } from '../services/api';
import { BorderGlowCard } from '../components/common/BorderGlowCard';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import {
  FileText,
  MapPin,
  Clock,
  CheckCircle2,
  AlertCircle,
  PhoneCall,
  ArrowLeft,
  ShieldCheck,
  Building2,
  Cpu
} from 'lucide-react';

export const ComplaintDetailPage = () => {
  const { id } = useParams();
  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const data = await api.getComplaintById(id);
        setComplaint(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [id]);

  if (loading) return <LoadingSpinner label="Loading complaint tracker details..." />;
  if (!complaint) return <div className="text-center py-12 text-[#8696a0]">Complaint record not found.</div>;

  const statuses = ['Pending', 'Under Review', 'Assigned', 'In Progress', 'Resolved'];
  const currentStatusIndex = statuses.indexOf(complaint.status);
  const isRejected = complaint.status === 'Rejected';

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 bg-[#0b141a]"
    >
      <Link
        to="/complaints"
        className="inline-flex items-center gap-1.5 text-[#25d366] hover:underline text-xs font-semibold"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Complaint History
      </Link>

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#2a3942] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono font-extrabold text-2xl text-[#25d366]">{complaint.id}</span>
            <span className="px-3 py-0.5 rounded-full text-xs font-bold bg-[#12332a] text-[#25d366] border border-[#00a884]/40">
              {complaint.wasteType}
            </span>
          </div>
          <h1 className="text-xl font-bold text-white mt-1">{complaint.issueType}</h1>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-[#8696a0]">Current Status:</span>
          <span
            className={`px-4 py-1.5 rounded-full text-xs font-extrabold ${
              complaint.status === 'Resolved'
                ? 'bg-[#12332a] text-[#25d366] border border-[#00a884]'
                : isRejected
                ? 'bg-[#ea4335]/20 text-[#ea4335] border border-[#ea4335]'
                : 'bg-amber-500/20 text-amber-300 border border-amber-500'
            }`}
          >
            {complaint.status}
          </span>
        </div>
      </div>

      {/* Lifecycle Timeline Tracker */}
      <BorderGlowCard className="p-6 space-y-6">
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          <Clock className="w-5 h-5 text-[#25d366]" /> Municipal Lifecycle Tracker
        </h2>

        {isRejected ? (
          <div className="p-4 rounded-xl bg-[#ea4335]/15 border border-[#ea4335]/40 text-[#ea4335] text-xs flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-[#ea4335] shrink-0" />
            <span>Complaint marked as Invalid / Out of Scope by Administrator. Excluded from medal count.</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 relative pt-2">
            {statuses.map((st, idx) => {
              const isPassed = idx <= currentStatusIndex;
              const isCurrent = idx === currentStatusIndex;

              return (
                <div
                  key={st}
                  className={`p-3 rounded-xl border flex flex-col items-center text-center space-y-1 transition-all ${
                    isCurrent
                      ? 'bg-[#12332a] border-[#25d366] text-[#25d366] shadow-md'
                      : isPassed
                      ? 'bg-[#1f2c34] border-[#00a884]/30 text-[#e9edef]'
                      : 'bg-[#111b21] border-[#2a3942] text-[#8696a0]'
                  }`}
                >
                  <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold border border-current">
                    {isPassed ? '✓' : idx + 1}
                  </div>
                  <span className="text-xs font-semibold">{st}</span>
                </div>
              );
            })}
          </div>
        )}

        {/* Resolution Notes */}
        {complaint.resolutionNotes && (
          <div className="p-4 rounded-xl bg-[#12332a] border border-[#00a884]/40 space-y-1 text-xs">
            <span className="font-bold text-[#25d366] flex items-center gap-1.5">
              <Building2 className="w-4 h-4" /> Officer Resolution Note:
            </span>
            <p className="text-[#e9edef]">{complaint.resolutionNotes}</p>
          </div>
        )}
      </BorderGlowCard>

      {/* Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Photo */}
        <BorderGlowCard className="lg:col-span-6 p-5 space-y-3">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">Uploaded Evidence Image</h3>
          <img
            src={complaint.photoUrl}
            alt={complaint.issueType}
            className="w-full h-64 object-cover rounded-xl border border-[#2a3942]"
          />
        </BorderGlowCard>

        {/* Info Box */}
        <BorderGlowCard className="lg:col-span-6 p-6 space-y-4 text-xs">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider border-b border-[#2a3942] pb-2">
            Report Metadata & AI Audit
          </h3>

          <div className="space-y-3">
            <div>
              <span className="text-[#8696a0] block">AI Detected Waste Suggestion:</span>
              <span className="font-semibold text-[#25d366] flex items-center gap-1.5 mt-0.5">
                <Cpu className="w-4 h-4 text-[#25d366]" /> {complaint.aiSuggestedWasteType || complaint.wasteType}
              </span>
            </div>

            <div>
              <span className="text-[#8696a0] block">User Confirmed Category:</span>
              <span className="font-bold text-white text-sm">{complaint.wasteType}</span>
            </div>

            <div>
              <span className="text-[#8696a0] block">Reported Location:</span>
              <span className="font-semibold text-[#e9edef] flex items-center gap-1 mt-0.5">
                <MapPin className="w-4 h-4 text-[#25d366] shrink-0" /> {complaint.location}
              </span>
            </div>

            {complaint.landmark && (
              <div>
                <span className="text-[#8696a0] block">Landmark:</span>
                <span className="text-[#e9edef]">{complaint.landmark}</span>
              </div>
            )}

            <div>
              <span className="text-[#8696a0] block">Severity Level:</span>
              <span className="font-semibold text-amber-300">{complaint.severity}</span>
            </div>

            <div>
              <span className="text-[#8696a0] block">Description:</span>
              <span className="text-[#e9edef]">{complaint.description || 'No description provided.'}</span>
            </div>

            <div className="pt-2 border-t border-[#2a3942]">
              <span className="text-[#8696a0] block">SMS Event Status:</span>
              <span className="font-semibold text-[#34b7f1] flex items-center gap-1.5 mt-0.5">
                <PhoneCall className="w-4 h-4 text-[#34b7f1]" /> SMS Dispatched to {complaint.userPhone}
              </span>
            </div>
          </div>
        </BorderGlowCard>
      </div>
    </motion.div>
  );
};
