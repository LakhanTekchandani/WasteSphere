import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
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
  Clock,
  MapPin,
  Flame,
  FileCheck,
  AlertTriangle,
  RefreshCw,
  Mail
} from 'lucide-react';

export const AdminDashboardPage = () => {
  const { user, isApprovedAdmin, isPendingAdmin } = useAuth();
  const { showToast } = useToast();

  const [complaints, setComplaints] = useState([]);
  const [pickups, setPickups] = useState([]);
  const [hotspots, setHotspots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);

  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [newStatus, setNewStatus] = useState('');
  const [resolutionNotes, setResolutionNotes] = useState('');
  const [updating, setUpdating] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    setFetchError(null);
    try {
      const [cmpData, puData] = await Promise.all([
        api.getAllReportsAdmin(),
        api.getAllPickupsAdmin(),
      ]);

      if (!Array.isArray(cmpData)) throw new Error('Invalid complaints response from server.');
      if (!Array.isArray(puData)) throw new Error('Invalid pickups response from server.');

      setComplaints(cmpData);
      setPickups(puData);

      try {
        const hsRaw = await api.getWasteHotspotsAdmin();
        setHotspots(Array.isArray(hsRaw) ? hsRaw : []);
      } catch (hsErr) {
        console.warn('Hotspots unavailable:', hsErr.message);
        setHotspots([]);
      }
    } catch (err) {
      console.error('Admin data fetch error:', err);
      setFetchError(err.message || 'Failed to load admin dashboard data from server.');
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
        `Complaint ${selectedComplaint.id} updated to "${newStatus}". Email notification sent to citizen.`,
        'success',
        'Status Updated & Email Sent 📧'
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
      showToast(`Pickup ${id} status updated to "${status}". Email notification sent.`, 'success');
      fetchData();
    } catch (err) {
      showToast('Failed to update pickup status.', 'error');
    }
  };

  if (isPendingAdmin) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-accent/20 text-accent flex items-center justify-center mx-auto border border-accent/30">
          <Clock className="w-8 h-8" />
        </div>
        <h1 className="text-3xl font-extrabold text-foreground">Admin Verification Pending</h1>
        <p className="text-muted-foreground text-sm max-w-md mx-auto">
          Your government officer ID photo proof has been submitted and is currently pending review. Access to the Admin Dashboard is restricted until verification approval.
        </p>
        <Link
          to="/admin/verifications"
          className="inline-block px-6 py-3 rounded-xl bg-primary text-primary-foreground font-bold text-xs shadow-lg"
        >
          Check Officer Verification Status →
        </Link>
      </div>
    );
  }

  if (loading) return <LoadingSpinner label="Loading municipal officer management workspace..." />;

  if (fetchError) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-destructive/20 text-destructive flex items-center justify-center mx-auto border border-destructive/30">
          <AlertTriangle className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-extrabold text-foreground">Failed to Load Dashboard Data</h2>
        <p className="text-sm text-muted-foreground max-w-md mx-auto">{fetchError}</p>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={fetchData}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-bold text-xs shadow-lg"
        >
          <RefreshCw className="w-4 h-4" /> Retry
        </motion.button>
      </div>
    );
  }

  const pendingCount = complaints.filter((c) => c.status === 'Pending').length;
  const inProgressCount = complaints.filter((c) => c.status === 'In Progress' || c.status === 'Assigned').length;
  const resolvedCount = complaints.filter((c) => c.status === 'Resolved').length;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8"
    >
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl glass-panel border border-border bg-secondary/40">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-primary">
            <Building2 className="w-4 h-4" /> Approved Municipal Officer Portal
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground mt-1">
            Admin Management & Analytics
          </h1>
          <p className="text-xs text-muted-foreground">
            Logged in as: <strong className="text-primary">{user?.name}</strong> (Verified Status: <span className="text-primary">Approved</span>)
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            to="/admin/verifications"
            className="px-4 py-2.5 rounded-xl border border-border text-primary hover:bg-muted text-xs font-semibold flex items-center gap-1.5"
          >
            <UserCheck className="w-4 h-4" /> Pending ID Verifications
          </Link>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <BorderGlowCard className="p-5">
          <div className="text-xs text-muted-foreground font-semibold uppercase">Total Reports Received</div>
          <div className="text-3xl font-extrabold text-foreground mt-1">{complaints.length}</div>
          <div className="text-xs text-accent mt-1">{pendingCount} awaiting initial review</div>
        </BorderGlowCard>
        <BorderGlowCard className="p-5">
          <div className="text-xs text-muted-foreground font-semibold uppercase">Under Resolution</div>
          <div className="text-3xl font-extrabold text-foreground mt-1">{inProgressCount}</div>
          <div className="text-xs text-primary mt-1">Field teams dispatched</div>
        </BorderGlowCard>
        <BorderGlowCard className="p-5">
          <div className="text-xs text-muted-foreground font-semibold uppercase">Resolved Complaints</div>
          <div className="text-3xl font-extrabold text-foreground mt-1">{resolvedCount}</div>
          <div className="text-xs text-primary mt-1">Qualifying towards citizen medals</div>
        </BorderGlowCard>
        <BorderGlowCard className="p-5">
          <div className="text-xs text-muted-foreground font-semibold uppercase">Pickup Requests</div>
          <div className="text-3xl font-extrabold text-foreground mt-1">{pickups.length}</div>
          <div className="text-xs text-primary mt-1">Doorstep collection requests</div>
        </BorderGlowCard>
      </div>

      {/* Hotspots */}
      {hotspots.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
            <Flame className="w-5 h-5 text-accent" /> Waste Analytics & High Concentration Hotspots
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {hotspots.map((hs, idx) => (
              <BorderGlowCard key={idx} className="p-5 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-accent flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5" />
                    <span className="truncate max-w-[160px]">{hs.address || hs.area}</span>
                  </span>
                  <span className="px-2 py-0.5 rounded bg-destructive/20 text-destructive text-[10px] font-bold">
                    {hs.intensity || hs.severity} Hotspot
                  </span>
                </div>
                <div className="text-2xl font-extrabold text-foreground">
                  {hs.reportCount || hs.complaintCount} Reports
                </div>
                <div className="text-xs text-muted-foreground">
                  Dominant Type: {hs.dominantWasteType || hs.primaryIssue}
                </div>
              </BorderGlowCard>
            ))}
          </div>
        </div>
      )}

      {/* Complaints Queue */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
          <FileText className="w-5 h-5 text-primary" /> Municipal Complaint Management Queue
        </h2>
        {complaints.length === 0 ? (
          <BorderGlowCard className="p-10 text-center text-muted-foreground text-sm">
            No complaints found in the database.
          </BorderGlowCard>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-border glass-panel">
            <table className="w-full text-left text-xs text-muted-foreground">
              <thead className="bg-muted/60 text-primary uppercase tracking-wider text-[11px] font-semibold border-b border-border">
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
              <tbody className="divide-y divide-border">
                {complaints.map((cmp) => (
                  <tr key={cmp.id} className="hover:bg-muted/40 transition-colors">
                    <td className="p-4 font-mono font-bold text-primary text-[11px]">{cmp.id}</td>
                    <td className="p-4 font-medium text-foreground">{cmp.userName}</td>
                    <td className="p-4">
                      <div className="font-semibold text-foreground">{cmp.issueType}</div>
                      <div className="text-[11px] text-muted-foreground">{cmp.wasteType}</div>
                    </td>
                    <td className="p-4 max-w-xs truncate">{cmp.location}</td>
                    <td className="p-4 font-semibold text-accent">{cmp.severity}</td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${
                        cmp.status === 'Resolved'
                          ? 'bg-secondary text-primary border border-primary/40'
                          : cmp.status === 'Rejected'
                          ? 'bg-destructive/20 text-destructive border border-destructive/40'
                          : 'bg-accent/20 text-accent border border-accent/40'
                      }`}>
                        {cmp.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleOpenStatusModal(cmp)}
                        className="px-3 py-1.5 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-xs shadow"
                      >
                        Update Status
                      </motion.button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pickup Queue */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
          <Truck className="w-5 h-5 text-primary" /> Doorstep Pickup Dispatch Queue
        </h2>
        {pickups.length === 0 ? (
          <BorderGlowCard className="p-10 text-center text-muted-foreground text-sm">
            No pickup requests found in the database.
          </BorderGlowCard>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pickups.map((pu) => (
              <BorderGlowCard key={pu.id} className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-primary text-sm">{pu.id} • {pu.userName}</span>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-secondary text-primary border border-primary/30">
                    {pu.status}
                  </span>
                </div>
                <div className="text-xs text-foreground">
                  <div><strong>Category:</strong> {pu.wasteType}</div>
                  <div><strong>Scheduled Date:</strong> {pu.preferredDate} ({pu.preferredTime})</div>
                  <div><strong>Address:</strong> {pu.address}</div>
                </div>
                <div className="flex gap-2 pt-2 border-t border-border">
                  <button
                    onClick={() => handleUpdatePickupStatus(pu.id, 'Scheduled')}
                    className="px-3 py-1 rounded bg-secondary text-primary border border-primary/40 text-xs font-semibold"
                  >
                    Mark Scheduled
                  </button>
                  <button
                    onClick={() => handleUpdatePickupStatus(pu.id, 'Collected')}
                    className="px-3 py-1 rounded bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-bold"
                  >
                    Mark Collected
                  </button>
                </div>
              </BorderGlowCard>
            ))}
          </div>
        )}
      </div>

      {/* Status Update Modal */}
      <AnimatePresence>
        {selectedComplaint && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.2 }}
              className="max-w-md w-full"
            >
              <BorderGlowCard className="p-6 space-y-5">
                <div className="flex items-center justify-between border-b border-border pb-3">
                  <h3 className="text-lg font-bold text-foreground">Update Status for {selectedComplaint.id}</h3>
                  <button onClick={() => setSelectedComplaint(null)} className="text-muted-foreground hover:text-foreground">✕</button>
                </div>
                <div className="space-y-4 text-xs">
                  <div>
                    <label className="block font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                      Select New Lifecycle Status *
                    </label>
                    <select
                      value={newStatus}
                      onChange={(e) => setNewStatus(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-muted/50 border border-border text-foreground text-sm focus:outline-none focus:border-primary"
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
                    <label className="block font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                      Resolution Notes / Action Dispatched *
                    </label>
                    <textarea
                      value={resolutionNotes}
                      onChange={(e) => setResolutionNotes(e.target.value)}
                      placeholder="Municipal truck #ND-04 assigned to clear area..."
                      rows={3}
                      className="w-full px-4 py-2.5 rounded-xl bg-muted/50 border border-border text-foreground text-sm focus:outline-none focus:border-primary"
                    />
                  </div>
                  <div className="p-3 rounded-xl bg-muted/40 border border-border text-[11px] text-muted-foreground flex items-start gap-2">
                    <Mail className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                    <span>
                      <strong>Automatic Email Dispatch:</strong> Saving this update will automatically send an email notification to citizen <strong>{selectedComplaint.userName}</strong>.
                    </span>
                  </div>
                  <div className="flex justify-end gap-3 pt-3">
                    <button
                      type="button"
                      onClick={() => setSelectedComplaint(null)}
                      className="px-4 py-2 rounded-xl border border-border text-foreground hover:bg-muted text-xs font-semibold"
                    >
                      Cancel
                    </button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="button"
                      onClick={handleUpdateStatus}
                      disabled={updating}
                      className="px-6 py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-xs shadow-lg"
                    >
                      {updating ? 'Updating...' : 'Save & Send Email Notification'}
                    </motion.button>
                  </div>
                </div>
              </BorderGlowCard>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
