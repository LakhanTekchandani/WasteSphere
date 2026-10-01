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
  if (!complaint) return <div className="text-center py-12 text-muted-foreground">Complaint record not found.</div>;

  const statuses = ['Pending', 'Under Review', 'Assigned', 'In Progress', 'Resolved'];
  const currentStatusIndex = statuses.indexOf(complaint.status);
  const isRejected = complaint.status === 'Rejected';

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 bg-transparent"
    >
      <Link
        to="/complaints"
        className="inline-flex items-center gap-1.5 text-accent hover:underline text-xs font-semibold"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Complaint History
      </Link>

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-border pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono font-extrabold text-2xl text-accent">{complaint.id}</span>
            <span className="px-3 py-0.5 rounded-full text-xs font-bold bg-secondary text-primary border border-primary/40">
              {complaint.wasteType}
            </span>
          </div>
          <h1 className="text-xl font-bold text-foreground mt-1">{complaint.issueType}</h1>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">Current Status:</span>
          <span
            className={`px-4 py-1.5 rounded-full text-xs font-extrabold ${
              complaint.status === 'Resolved'
                ? 'bg-secondary text-accent border border-primary'
                : isRejected
                ? 'bg-destructive/20 text-destructive border border-destructive'
                : 'bg-amber-500/20 text-amber-600 border border-amber-500'
            }`}
          >
            {complaint.status}
          </span>
        </div>
      </div>

      {/* Lifecycle Timeline Tracker */}
      <BorderGlowCard className="p-6 space-y-6">
        <h2 className="text-base font-bold text-foreground flex items-center gap-2">
          <Clock className="w-5 h-5 text-accent" /> Municipal Lifecycle Tracker
        </h2>

        {isRejected ? (
          <div className="p-4 rounded-xl bg-destructive/15 border border-destructive/40 text-destructive text-xs flex items-center gap-2">
            <AlertCircle className="w-5 h-5 shrink-0" />
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
                      ? 'bg-secondary border-accent text-accent shadow-md'
                      : isPassed
                      ? 'bg-card border-primary/30 text-foreground'
                      : 'bg-muted border-border text-muted-foreground'
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
          <div className="p-4 rounded-xl bg-secondary border border-primary/40 space-y-1 text-xs">
            <span className="font-bold text-primary flex items-center gap-1.5">
              <Building2 className="w-4 h-4" /> Officer Resolution Note:
            </span>
            <p className="text-foreground">{complaint.resolutionNotes}</p>
          </div>
        )}
      </BorderGlowCard>

      {/* Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Photo */}
        <BorderGlowCard className="lg:col-span-6 p-5 space-y-3">
          <h3 className="text-sm font-bold text-foreground uppercase tracking-wider">Uploaded Evidence Image</h3>
          <img
            src={complaint.photoUrl}
            alt={complaint.issueType}
            className="w-full h-64 object-cover rounded-xl border border-border"
          />
        </BorderGlowCard>

        {/* Info Box */}
        <BorderGlowCard className="lg:col-span-6 p-6 space-y-4 text-xs">
          <h3 className="text-sm font-bold text-foreground uppercase tracking-wider border-b border-border pb-2">
            Report Metadata & AI Audit
          </h3>

          <div className="space-y-3">
            <div>
              <span className="text-muted-foreground block">AI Detected Waste Suggestion:</span>
              <span className="font-semibold text-accent flex items-center gap-1.5 mt-0.5">
                <Cpu className="w-4 h-4 text-accent" /> {complaint.aiSuggestedWasteType || complaint.wasteType}
              </span>
            </div>

            <div>
              <span className="text-muted-foreground block">User Confirmed Category:</span>
              <span className="font-bold text-foreground text-sm">{complaint.wasteType}</span>
            </div>

            <div>
              <span className="text-muted-foreground block">Reported Location:</span>
              <span className="font-semibold text-foreground flex items-center gap-1 mt-0.5">
                <MapPin className="w-4 h-4 text-accent shrink-0" /> {complaint.location}
              </span>
            </div>

            {complaint.landmark && (
              <div>
                <span className="text-muted-foreground block">Landmark:</span>
                <span className="text-foreground">{complaint.landmark}</span>
              </div>
            )}

            <div>
              <span className="text-muted-foreground block">Severity Level:</span>
              <span className="font-semibold text-amber-600">{complaint.severity}</span>
            </div>

            <div>
              <span className="text-muted-foreground block">Description:</span>
              <span className="text-foreground">{complaint.description || 'No description provided.'}</span>
            </div>

            <div className="pt-2 border-t border-border">
              <span className="text-muted-foreground block">Notification Status:</span>
              <span className="font-semibold text-primary flex items-center gap-1.5 mt-0.5">
                <PhoneCall className="w-4 h-4 text-primary" /> Email Dispatched to {complaint.userPhone}
              </span>
            </div>
          </div>
        </BorderGlowCard>
      </div>
    </motion.div>
  );
};
