import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { useToast } from '../context/ToastContext';
import { BorderGlowCard } from '../components/common/BorderGlowCard';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { UserCheck, ShieldAlert, CheckCircle2, XCircle, Clock, ExternalLink } from 'lucide-react';

export const AdminVerificationsPage = () => {
  const { showToast } = useToast();
  const [verifications, setVerifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchVerifications = async () => {
    try {
      const data = await api.getAdminVerifications();
      setVerifications(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVerifications();
  }, []);

  const handleApprove = async (id, name) => {
    try {
      await api.updateAdminVerification(id, 'approved');
      showToast(`Officer account "${name}" has been verified & approved.`, 'success', 'Officer Verified');
      fetchVerifications();
    } catch (err) {
      showToast('Failed to approve verification.', 'error');
    }
  };

  const handleReject = async (id, name) => {
    try {
      await api.updateAdminVerification(id, 'rejected');
      showToast(`Officer verification for "${name}" rejected.`, 'error', 'Officer Rejected');
      fetchVerifications();
    } catch (err) {
      showToast('Failed to reject verification.', 'error');
    }
  };

  if (loading) return <LoadingSpinner label="Loading officer verification records..." />;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold">
          <UserCheck className="w-4 h-4 text-emerald-400" />
          <span>PRD MANDATED SECURITY CONTROL</span>
        </div>
        <h1 className="text-3xl font-extrabold text-white mt-2">Government Officer Verification Workflow</h1>
        <p className="text-slate-300 text-sm max-w-2xl">
          Review uploaded government ID proof photos before granting administrative dashboard access. Unverified accounts remain restricted.
        </p>
      </div>

      <div className="space-y-4">
        {verifications.map((ver) => (
          <BorderGlowCard key={ver.id} className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
              {/* ID Image */}
              <div className="md:col-span-4">
                <div className="space-y-1">
                  <span className="text-[11px] text-slate-400 font-semibold uppercase block">
                    Government ID / Badge Proof:
                  </span>
                  <img
                    src={ver.officerIdPhoto}
                    alt={ver.name}
                    className="w-full h-40 object-cover rounded-xl border border-emerald-500/30 shadow-md"
                  />
                </div>
              </div>

              {/* Info */}
              <div className="md:col-span-5 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-emerald-400">{ver.id}</span>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                      ver.status === 'approved'
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                        : ver.status === 'rejected'
                        ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                        : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                    }`}
                  >
                    {ver.status.toUpperCase()}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-white">{ver.name}</h3>
                <div className="text-xs text-slate-300">Email: <span className="text-emerald-300">{ver.email}</span></div>
                <div className="text-xs text-slate-300">Phone: <span className="font-mono text-slate-200">{ver.phone}</span></div>
                <div className="text-[11px] text-slate-500">Submitted: {new Date(ver.submittedAt).toLocaleString()}</div>
              </div>

              {/* Approval Actions */}
              <div className="md:col-span-3 flex flex-col gap-2.5">
                {ver.status === 'pending' ? (
                  <>
                    <button
                      onClick={() => handleApprove(ver.id, ver.name)}
                      className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white font-bold text-xs shadow-md flex items-center justify-center gap-1.5"
                    >
                      <CheckCircle2 className="w-4 h-4" /> Approve Officer ID
                    </button>
                    <button
                      onClick={() => handleReject(ver.id, ver.name)}
                      className="w-full py-2.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 font-bold text-xs flex items-center justify-center gap-1.5"
                    >
                      <XCircle className="w-4 h-4" /> Reject Proof
                    </button>
                  </>
                ) : (
                  <div className="text-center py-2 px-4 rounded-xl bg-emerald-950/40 border border-emerald-500/20 text-xs font-semibold text-slate-300">
                    Verification Decision Finalized ({ver.status})
                  </div>
                )}
              </div>
            </div>
          </BorderGlowCard>
        ))}
      </div>
    </div>
  );
};
