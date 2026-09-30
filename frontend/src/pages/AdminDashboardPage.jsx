import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { useToast } from '../context/ToastContext';
import { BorderGlowCard } from '../components/common/BorderGlowCard';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import {
  Building2,
  FileText,
  Truck,
  UserCheck,
  Award,
  CheckCircle2,
  XCircle,
  Clock,
  MapPin,
  Flame,
  Search,
  ShieldCheck,
  FileCheck,
  AlertTriangle
} from 'lucide-react';

export const AdminDashboardPage = () => {
  const { user, isApprovedAdmin, isPendingAdmin } = useAuth();
  const { showToast } = useToast();

  const [complaints, setComplaints] = useState([]);
  const [pickups, setPickups] = useState([]);
  const [hotspots, setHotspots] = useState([]);
  const [loading, setLoading] = useState(true);

  // Status Change Modal / Drawer State
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [newStatus, setNewStatus] = useState('');
  const [resolutionNotes, setResolutionNotes] = useState('');
  const [updating, setUpdating] = useState(false);

  const fetchData = async () => {
    try {
      const [cmpData, puData, hsData] = await Promise.all([
        api.getComplaints(),
        api.getPickups(),
        api.getWasteHotspots()
      ]);
      setComplaints(cmpData);
      setPickups(puData);
      setHotspots(hsData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenStatusModal = (cmp) => {
    setSelectedComplaint(cmp);
    setNewStatus(cmp.status);
    setResolutionNotes(cmp.resolutionNotes || '');
  };

  const handleUpdateStatus = async () => {
    if (!selectedComplaint) return;
    setUpdating(true);
    try {
      await api.updateComplaintStatus(selectedComplaint.id, newStatus, resolutionNotes);
      showToast(
        `Complaint ${selectedComplaint.id} status updated to "${newStatus}". SMS notification sent.`,
        'sms',
        'Status Updated & SMS Sent 📱'
      );
      setSelectedComplaint(null);
      fetchData();
    } catch (err) {
      showToast('Failed to update complaint status.', 'error');
    } finally {
      setUpdating(false);
    }
  };

  const handleUpdatePickupStatus = async (id, status) => {
    try {
      await api.updatePickupStatus(id, status);
      showToast(`Pickup ${id} status updated to ${status}.`, 'success');
      fetchData();
    } catch (err) {
      showToast('Failed to update pickup status.', 'error');
    }
  };

  const handleIssueCertificate = async () => {
    try {
      const res = await api.issueCertificateByAdmin('usr_101');
      showToast(`Certificate ${res.certificateId} approved & issued to Aarav Sharma.`, 'success', 'Certificate Issued 📜');
    } catch (err) {
      showToast('Failed to issue certificate.', 'error');
    }
  };

  if (isPendingAdmin) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center mx-auto border border-amber-500/30">
          <Clock className="w-8 h-8" />
        </div>
        <h1 className="text-3xl font-extrabold text-white">Admin Verification Pending</h1>
        <p className="text-slate-300 text-sm max-w-md mx-auto">
          Your government officer ID photo proof has been submitted and is currently pending review by platform administrators. Access to the Admin Dashboard is restricted until verification approval.
        </p>
        <Link
          to="/admin/verifications"
          className="inline-block px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white font-bold text-xs shadow-lg"
        >
          Check Officer Verification Status →
        </Link>
      </div>
    );
  }

  if (loading) return <LoadingSpinner label="Loading municipal officer management workspace..." />;

  const pendingCount = complaints.filter((c) => c.status === 'Pending').length;
  const inProgressCount = complaints.filter((c) => c.status === 'In Progress' || c.status === 'Assigned').length;
  const resolvedCount = complaints.filter((c) => c.status === 'Resolved').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl glass-panel border border-emerald-500/30 bg-gradient-to-r from-[#0B241A] via-[#071913] to-teal-950/40">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-400">
            <Building2 className="w-4 h-4" /> Approved Municipal Officer Portal
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
            Admin Management & Analytics
          </h1>
          <p className="text-xs text-slate-300">
            Logged in as: <strong className="text-emerald-300">{user?.name || 'Officer Rajesh Kumar'}</strong> (Verified Status: <span className="text-emerald-400">Approved</span>)
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/admin/verifications"
            className="px-4 py-2.5 rounded-xl glass-panel border border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/10 text-xs font-semibold flex items-center gap-1.5"
          >
            <UserCheck className="w-4 h-4" /> Pending ID Verifications
          </Link>
          <button
            onClick={handleIssueCertificate}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white text-xs font-bold shadow-md flex items-center gap-1.5"
          >
            <FileCheck className="w-4 h-4" /> Issue Citizen Certificate
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <BorderGlowCard className="p-5">
          <div className="text-xs text-slate-400 font-semibold uppercase">Total Reports Received</div>
          <div className="text-3xl font-extrabold text-white mt-1">{complaints.length}</div>
          <div className="text-xs text-amber-400 mt-1">{pendingCount} awaiting initial review</div>
        </BorderGlowCard>

        <BorderGlowCard className="p-5">
          <div className="text-xs text-slate-400 font-semibold uppercase">Under Resolution</div>
          <div className="text-3xl font-extrabold text-white mt-1">{inProgressCount}</div>
          <div className="text-xs text-sky-400 mt-1">Field teams dispatched</div>
        </BorderGlowCard>

        <BorderGlowCard className="p-5">
          <div className="text-xs text-slate-400 font-semibold uppercase">Resolved Complaints</div>
          <div className="text-3xl font-extrabold text-white mt-1">{resolvedCount}</div>
          <div className="text-xs text-emerald-400 mt-1">Qualifying towards citizen medals</div>
        </BorderGlowCard>

        <BorderGlowCard className="p-5">
          <div className="text-xs text-slate-400 font-semibold uppercase">Pickup Requests</div>
          <div className="text-3xl font-extrabold text-white mt-1">{pickups.length}</div>
          <div className="text-xs text-teal-400 mt-1">Doorstep collection requests</div>
        </BorderGlowCard>
      </div>

      {/* Waste Hotspots Detection */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Flame className="w-5 h-5 text-amber-400" /> Waste Analytics & High Concentration Hotspots
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {hotspots.map((hs, idx) => (
            <BorderGlowCard key={idx} className="p-5 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-400 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" /> {hs.area}
                </span>
                <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 text-[10px] font-bold">
                  {hs.severity} Hotspot
                </span>
              </div>
              <div className="text-2xl font-extrabold text-white">{hs.complaintCount} Complaints</div>
              <div className="text-xs text-slate-300">Primary Concentration: {hs.primaryIssue}</div>
            </BorderGlowCard>
          ))}
        </div>
      </div>

      {/* Complaints Queue & Action Table */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <FileText className="w-5 h-5 text-emerald-400" /> Municipal Complaint Management Queue
        </h2>

        <div className="overflow-x-auto rounded-2xl border border-emerald-500/20 glass-panel">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-emerald-950/80 text-emerald-300 uppercase tracking-wider text-[11px] font-semibold border-b border-emerald-500/20">
              <tr>
                <th className="p-4">Report ID</th>
                <th className="p-4">Citizen</th>
                <th className="p-4">Waste & Issue Type</th>
                <th className="p-4">Location</th>
                <th className="p-4">Severity</th>
                <th className="p-4">Current Status</th>
                <th className="p-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-emerald-500/10">
              {complaints.map((cmp) => (
                <tr key={cmp.id} className="hover:bg-emerald-950/30 transition-colors">
                  <td className="p-4 font-mono font-bold text-emerald-400">{cmp.id}</td>
                  <td className="p-4 font-medium text-white">{cmp.userName}</td>
                  <td className="p-4">
                    <div className="font-semibold text-slate-100">{cmp.issueType}</div>
                    <div className="text-[11px] text-slate-400">{cmp.wasteType}</div>
                  </td>
                  <td className="p-4 max-w-xs truncate">{cmp.location}</td>
                  <td className="p-4 font-semibold text-amber-300">{cmp.severity}</td>
                  <td className="p-4">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${
                        cmp.status === 'Resolved'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                          : cmp.status === 'Rejected'
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                          : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                      }`}
                    >
                      {cmp.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => handleOpenStatusModal(cmp)}
                      className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-white font-bold text-xs shadow"
                    >
                      Update Status
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pickup Requests Queue */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Truck className="w-5 h-5 text-teal-400" /> Doorstep Pickup Dispatch Queue
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {pickups.map((pu) => (
            <BorderGlowCard key={pu.id} className="p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-mono font-bold text-teal-400 text-sm">{pu.id} • {pu.userName}</span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300">
                  {pu.status}
                </span>
              </div>

              <div className="text-xs text-slate-200">
                <div><strong>Category:</strong> {pu.wasteType}</div>
                <div><strong>Scheduled Date:</strong> {pu.preferredDate} ({pu.preferredTime})</div>
                <div><strong>Address:</strong> {pu.address}</div>
              </div>

              <div className="flex gap-2 pt-2 border-t border-emerald-500/15">
                <button
                  onClick={() => handleUpdatePickupStatus(pu.id, 'Scheduled')}
                  className="px-3 py-1 rounded bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold"
                >
                  Mark Scheduled
                </button>
                <button
                  onClick={() => handleUpdatePickupStatus(pu.id, 'Collected')}
                  className="px-3 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold"
                >
                  Mark Collected
                </button>
              </div>
            </BorderGlowCard>
          ))}
        </div>
      </div>

      {/* Status Update Modal */}
      {selectedComplaint && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <BorderGlowCard className="max-w-md w-full p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-emerald-500/20 pb-3">
              <h3 className="text-lg font-bold text-white">Update Status for {selectedComplaint.id}</h3>
              <button onClick={() => setSelectedComplaint(null)} className="text-slate-400 hover:text-white">
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-300 uppercase tracking-wider mb-1">
                  Select New Lifecycle Status *
                </label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-emerald-950/60 border border-emerald-500/30 text-white text-sm focus:outline-none focus:border-emerald-500"
                >
                  <option value="Pending">Pending</option>
                  <option value="Under Review">Under Review</option>
                  <option value="Assigned">Assigned</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Resolved">Resolved (Qualifies for medals)</option>
                  <option value="Rejected">Rejected (Invalid / Excluded from medals)</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 uppercase tracking-wider mb-1">
                  Resolution Notes / Action Dispatched *
                </label>
                <textarea
                  value={resolutionNotes}
                  onChange={(e) => setResolutionNotes(e.target.value)}
                  placeholder="Municipal truck #ND-04 assigned to clear area..."
                  rows={3}
                  className="w-full px-4 py-2.5 rounded-xl bg-emerald-950/60 border border-emerald-500/30 text-white text-sm focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/20 text-[11px] text-slate-300">
                📱 <strong>Automatic SMS Dispatch:</strong> Saving this update will automatically send an SMS event notification to citizen {selectedComplaint.userPhone}.
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setSelectedComplaint(null)}
                  className="px-4 py-2 rounded-xl glass-panel text-slate-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleUpdateStatus}
                  disabled={updating}
                  className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white font-bold text-xs shadow-lg"
                >
                  {updating ? 'Updating...' : 'Save & Trigger SMS'}
                </button>
              </div>
            </div>
          </BorderGlowCard>
        </div>
      )}
    </div>
  );
};
