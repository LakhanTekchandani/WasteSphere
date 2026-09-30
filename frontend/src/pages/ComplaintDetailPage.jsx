import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
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
  if (!complaint) return <div className="text-center py-12 text-slate-300">Complaint record not found.</div>;

  const statuses = ['Pending', 'Under Review', 'Assigned', 'In Progress', 'Resolved'];
  const currentStatusIndex = statuses.indexOf(complaint.status);
  const isRejected = complaint.status === 'Rejected';

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <Link
        to="/complaints"
        className="inline-flex items-center gap-1.5 text-emerald-400 hover:underline text-xs font-semibold"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Complaint History
      </Link>

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-emerald-500/20 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono font-extrabold text-2xl text-emerald-400">{complaint.id}</span>
            <span className="px-3 py-0.5 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              {complaint.wasteType}
            </span>
          </div>
          <h1 className="text-xl font-bold text-white mt-1">{complaint.issueType}</h1>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400">Current Status:</span>
          <span
            className={`px-4 py-1.5 rounded-full text-xs font-extrabold ${
              complaint.status === 'Resolved'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500'
                : isRejected
                ? 'bg-rose-500/20 text-rose-300 border border-rose-500'
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
          <Clock className="w-5 h-5 text-emerald-400" /> Municipal Lifecycle Tracker
        </h2>

        {isRejected ? (
          <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
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
                      ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300 shadow-md'
                      : isPassed
                      ? 'bg-emerald-950/40 border-emerald-500/30 text-slate-200'
                      : 'bg-slate-900/40 border-slate-800 text-slate-600'
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
          <div className="p-4 rounded-xl bg-emerald-950/60 border border-emerald-500/30 space-y-1 text-xs">
            <span className="font-bold text-emerald-300 flex items-center gap-1.5">
              <Building2 className="w-4 h-4" /> Officer Resolution Note:
            </span>
            <p className="text-slate-200">{complaint.resolutionNotes}</p>
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
            className="w-full h-64 object-cover rounded-xl border border-emerald-500/30"
          />
        </BorderGlowCard>

        {/* Info Box */}
        <BorderGlowCard className="lg:col-span-6 p-6 space-y-4 text-xs">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider border-b border-emerald-500/20 pb-2">
            Report Metadata & AI Audit
          </h3>

          <div className="space-y-3">
            <div>
              <span className="text-slate-400 block">AI Detected Waste Suggestion:</span>
              <span className="font-semibold text-emerald-300 flex items-center gap-1.5 mt-0.5">
                <Cpu className="w-4 h-4 text-emerald-400" /> {complaint.aiSuggestedWasteType || complaint.wasteType}
              </span>
            </div>

            <div>
              <span className="text-slate-400 block">User Confirmed Category:</span>
              <span className="font-bold text-white text-sm">{complaint.wasteType}</span>
            </div>

            <div>
              <span className="text-slate-400 block">Reported Location:</span>
              <span className="font-semibold text-slate-200 flex items-center gap-1 mt-0.5">
                <MapPin className="w-4 h-4 text-emerald-400 shrink-0" /> {complaint.location}
              </span>
            </div>

            {complaint.landmark && (
              <div>
                <span className="text-slate-400 block">Landmark:</span>
                <span className="text-slate-200">{complaint.landmark}</span>
              </div>
            )}

            <div>
              <span className="text-slate-400 block">Severity Level:</span>
              <span className="font-semibold text-amber-300">{complaint.severity}</span>
            </div>

            <div>
              <span className="text-slate-400 block">Description:</span>
              <span className="text-slate-200">{complaint.description || 'No description provided.'}</span>
            </div>

            <div className="pt-2 border-t border-emerald-500/20">
              <span className="text-slate-400 block">SMS Event Status:</span>
              <span className="font-semibold text-sky-300 flex items-center gap-1.5 mt-0.5">
                <PhoneCall className="w-4 h-4 text-sky-400" /> SMS Dispatched to {complaint.userPhone}
              </span>
            </div>
          </div>
        </BorderGlowCard>
      </div>
    </div>
  );
};
