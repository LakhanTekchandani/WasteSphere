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
  AlertTriangle,
  RefreshCw,
  Mail,
  LayoutDashboard,
  Eye,
  CheckCircle2,
  XCircle,
  Search,
  Filter,
  User,
  Phone,
  Calendar,
  Tag,
  ShieldCheck,
  ArrowRight
} from 'lucide-react';

export const AdminDashboardPage = () => {
  const { user, isApprovedAdmin, isPendingAdmin } = useAuth();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'complaints' | 'pickups' | 'hotspots'

  const [complaints, setComplaints] = useState([]);
  const [pickups, setPickups] = useState([]);
  const [hotspots, setHotspots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);

  // Modal states
  const [selectedComplaint, setSelectedComplaint] = useState(null); // for status/assignment update
  const [selectedDetailComplaint, setSelectedDetailComplaint] = useState(null); // for detail view
  const [newStatus, setNewStatus] = useState('');
  const [assignedTo, setAssignedTo] = useState('');
  const [resolutionNotes, setResolutionNotes] = useState('');
  const [updating, setUpdating] = useState(false);

  // Complaints filter states
  const [statusFilter, setStatusFilter] = useState('All');
  const [severityFilter, setSeverityFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Pickups filter states
  const [pickupStatusFilter, setPickupStatusFilter] = useState('All');
  const [pickupSearchQuery, setPickupSearchQuery] = useState('');

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
    setNewStatus(cmp.status || 'Pending');
    setAssignedTo(cmp.assignedTo || '');
    setResolutionNotes(cmp.resolutionNotes || '');
  };

  const handleUpdateStatus = async () => {
    if (!selectedComplaint) return;
    setUpdating(true);
    try {
      // 1. Update status and resolution notes
      await api.updateComplaintStatus(selectedComplaint.id, newStatus, resolutionNotes);

      // 2. Assign if officer name was specified/changed
      if (assignedTo.trim() && assignedTo !== selectedComplaint.assignedTo) {
        await api.assignReport(selectedComplaint.id, assignedTo.trim());
      }

      showToast(
        `Complaint #${selectedComplaint.id.substring(selectedComplaint.id.length - 6)} updated to "${newStatus}". Email notification sent to citizen.`,
        'success',
        'Status Updated & Email Dispatched 📧'
      );
      setSelectedComplaint(null);
      await fetchData();
    } catch (err) {
      console.error('Update status error:', err);
      showToast(err.message || 'Failed to update complaint status.', 'error');
    } finally {
      setUpdating(false);
    }
  };

  const handleUpdatePickupStatus = async (id, status) => {
    try {
      await api.updatePickupStatus(id, status);
      showToast(`Pickup request status updated to "${status}". Email notification sent.`, 'success');
      await fetchData();
    } catch (err) {
      console.error('Update pickup error:', err);
      showToast(err.message || 'Failed to update pickup status.', 'error');
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
          <RefreshCw className="w-4 h-4" /> Retry Connection
        </motion.button>
      </div>
    );
  }

  // Calculate real DB metrics
  const totalComplaintsCount = complaints.length;
  const pendingCount = complaints.filter((c) => c.status === 'Pending').length;
  const underReviewCount = complaints.filter((c) => c.status === 'Under Review').length;
  const inProgressCount = complaints.filter((c) => c.status === 'In Progress' || c.status === 'Assigned').length;
  const resolvedCount = complaints.filter((c) => c.status === 'Resolved').length;
  const rejectedCount = complaints.filter((c) => c.status === 'Rejected').length;
  const totalPickupsCount = pickups.length;
  const pendingPickupsCount = pickups.filter((p) => p.status === 'Pending').length;

  // Filtered complaints for table
  const filteredComplaints = complaints.filter((cmp) => {
    if (statusFilter !== 'All' && cmp.status !== statusFilter) return false;
    if (severityFilter !== 'All' && cmp.severity !== severityFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchId = String(cmp.id).toLowerCase().includes(q);
      const matchUser = String(cmp.userName || '').toLowerCase().includes(q);
      const matchLoc = String(cmp.location || '').toLowerCase().includes(q);
      const matchType = String(cmp.wasteType || '').toLowerCase().includes(q) || String(cmp.issueType || '').toLowerCase().includes(q);
      return matchId || matchUser || matchLoc || matchType;
    }
    return true;
  });

  // Filtered pickups for table/cards
  const filteredPickups = pickups.filter((pu) => {
    if (pickupStatusFilter !== 'All' && pu.status !== pickupStatusFilter) return false;
    if (pickupSearchQuery.trim()) {
      const q = pickupSearchQuery.toLowerCase();
      const matchId = String(pu.id).toLowerCase().includes(q);
      const matchUser = String(pu.userName || '').toLowerCase().includes(q);
      const matchAddress = String(pu.address || '').toLowerCase().includes(q);
      return matchId || matchUser || matchAddress;
    }
    return true;
  });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8"
    >
      {/* Header Portal Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl glass-panel border border-border bg-secondary/40">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-primary">
            <Building2 className="w-4 h-4" /> Approved Municipal Officer Portal
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground mt-1">
            Admin Management & Analytics
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Logged in as: <strong className="text-primary">{user?.name || 'Municipal Officer'}</strong> (Verified Status: <span className="text-primary font-semibold">Approved</span>)
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchData}
            title="Refresh Data from MongoDB"
            className="p-2.5 rounded-xl border border-border text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <Link
            to="/admin/verifications"
            className="px-4 py-2.5 rounded-xl border border-border text-primary hover:bg-muted/60 text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <UserCheck className="w-4 h-4" /> Officer ID Verifications
          </Link>
        </div>
      </div>

      {/* Admin Workflow Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-border">
        <button
          onClick={() => setActiveTab('overview')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeTab === 'overview'
              ? 'bg-primary text-primary-foreground shadow-md'
              : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
          }`}
        >
          <LayoutDashboard className="w-4 h-4" />
          Home / Overview
        </button>

        <button
          onClick={() => setActiveTab('complaints')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeTab === 'complaints'
              ? 'bg-primary text-primary-foreground shadow-md'
              : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
          }`}
        >
          <FileText className="w-4 h-4" />
          Complaints ({totalComplaintsCount})
        </button>

        <button
          onClick={() => setActiveTab('pickups')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeTab === 'pickups'
              ? 'bg-primary text-primary-foreground shadow-md'
              : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
          }`}
        >
          <Truck className="w-4 h-4" />
          Pickup Requests ({totalPickupsCount})
        </button>

        <button
          onClick={() => setActiveTab('hotspots')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeTab === 'hotspots'
              ? 'bg-primary text-primary-foreground shadow-md'
              : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
          }`}
        >
          <Flame className="w-4 h-4 text-accent" />
          Hotspots / Analytics
        </button>

        <Link
          to="/admin/verifications"
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all whitespace-nowrap ml-auto"
        >
          <ShieldCheck className="w-4 h-4" />
          Admin Verification
        </Link>
      </div>

      {/* ========================================================================= */}
      {/* SECTION 1: HOME / OVERVIEW TAB */}
      {/* ========================================================================= */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          {/* Key Metrics Cards (Derived from real DB data) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <BorderGlowCard className="p-5" onClick={() => setActiveTab('complaints')}>
              <div className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Total Complaints</div>
              <div className="text-3xl font-extrabold text-foreground mt-2">{totalComplaintsCount}</div>
              <div className="text-xs text-accent mt-1 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" /> {pendingCount} Pending Initial Review
              </div>
            </BorderGlowCard>

            <BorderGlowCard className="p-5" onClick={() => setActiveTab('complaints')}>
              <div className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Under Resolution</div>
              <div className="text-3xl font-extrabold text-foreground mt-2">{inProgressCount + underReviewCount}</div>
              <div className="text-xs text-primary mt-1 flex items-center gap-1">
                <Truck className="w-3.5 h-3.5" /> Dispatched & Under Review
              </div>
            </BorderGlowCard>

            <BorderGlowCard className="p-5" onClick={() => setActiveTab('complaints')}>
              <div className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Resolved Complaints</div>
              <div className="text-3xl font-extrabold text-foreground mt-2">{resolvedCount}</div>
              <div className="text-xs text-primary mt-1 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Qualifies for citizen medals
              </div>
            </BorderGlowCard>

            <BorderGlowCard className="p-5" onClick={() => setActiveTab('pickups')}>
              <div className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Pickup Requests</div>
              <div className="text-3xl font-extrabold text-foreground mt-2">{totalPickupsCount}</div>
              <div className="text-xs text-primary mt-1 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" /> {pendingPickupsCount} Pending Schedule
              </div>
            </BorderGlowCard>
          </div>

          {/* Quick Recent Activity Columns */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Recent Complaints Summary */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                  <FileText className="w-5 h-5 text-primary" /> Recent Complaints Summary
                </h2>
                <button
                  onClick={() => setActiveTab('complaints')}
                  className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
                >
                  View All Complaints ({totalComplaintsCount}) <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {complaints.length === 0 ? (
                <BorderGlowCard className="p-8 text-center text-muted-foreground text-xs">
                  No complaints found in the database.
                </BorderGlowCard>
              ) : (
                <div className="overflow-x-auto rounded-2xl border border-border glass-panel">
                  <table className="w-full text-left text-xs text-muted-foreground">
                    <thead className="bg-muted/60 text-primary uppercase tracking-wider text-[10px] font-semibold border-b border-border">
                      <tr>
                        <th className="p-3">ID</th>
                        <th className="p-3">Citizen</th>
                        <th className="p-3">Issue</th>
                        <th className="p-3">Severity</th>
                        <th className="p-3">Status</th>
                        <th className="p-3 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {complaints.slice(0, 5).map((cmp) => (
                        <tr key={cmp.id} className="hover:bg-muted/40 transition-colors">
                          <td className="p-3 font-mono font-bold text-primary text-[11px]">
                            #{String(cmp.id).substring(String(cmp.id).length - 6)}
                          </td>
                          <td className="p-3 font-medium text-foreground">{cmp.userName || 'N/A'}</td>
                          <td className="p-3 truncate max-w-[140px] text-foreground">{cmp.issueType || 'N/A'}</td>
                          <td className="p-3 font-semibold text-accent">{cmp.severity || 'N/A'}</td>
                          <td className="p-3">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              cmp.status === 'Resolved'
                                ? 'bg-secondary text-primary border border-primary/40'
                                : cmp.status === 'Rejected'
                                ? 'bg-destructive/20 text-destructive border border-destructive/40'
                                : 'bg-accent/20 text-accent border border-accent/40'
                            }`}>
                              {cmp.status || 'Pending'}
                            </span>
                          </td>
                          <td className="p-3 text-right">
                            <button
                              onClick={() => handleOpenStatusModal(cmp)}
                              className="px-2.5 py-1 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-[10px]"
                            >
                              Update
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Doorstep Pickups Quick Overview */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                  <Truck className="w-5 h-5 text-primary" /> Recent Pickups
                </h2>
                <button
                  onClick={() => setActiveTab('pickups')}
                  className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
                >
                  View All <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {pickups.length === 0 ? (
                <BorderGlowCard className="p-8 text-center text-muted-foreground text-xs">
                  No pickup requests found in the database.
                </BorderGlowCard>
              ) : (
                <div className="space-y-3">
                  {pickups.slice(0, 3).map((pu) => (
                    <BorderGlowCard key={pu.id} className="p-4 space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-mono font-bold text-primary">#{String(pu.id).substring(String(pu.id).length - 6)}</span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-secondary text-primary border border-primary/30">
                          {pu.status || 'Pending'}
                        </span>
                      </div>
                      <div className="text-xs text-foreground font-medium">{pu.userName || 'N/A'} • {pu.wasteType || 'N/A'}</div>
                      <div className="text-[11px] text-muted-foreground truncate">{pu.address || 'N/A'}</div>
                    </BorderGlowCard>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SECTION 2: COMPLAINTS TAB */}
      {/* ========================================================================= */}
      {activeTab === 'complaints' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary" /> Citizen Complaints Queue
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Displaying real-time waste reports from MongoDB database
              </p>
            </div>
            <div className="text-xs text-muted-foreground">
              Total Found: <strong className="text-foreground font-bold">{filteredComplaints.length}</strong> / {totalComplaintsCount}
            </div>
          </div>

          {/* Filters & Search Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-2xl bg-secondary/30 border border-border">
            {/* Search */}
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-3 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search citizen, ID, location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-xl bg-muted/60 border border-border text-foreground text-xs focus:outline-none focus:border-primary"
              />
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-muted-foreground shrink-0" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-muted/60 border border-border text-foreground text-xs focus:outline-none focus:border-primary"
              >
                <option value="All">All Statuses</option>
                <option value="Pending">Pending ({pendingCount})</option>
                <option value="Under Review">Under Review ({underReviewCount})</option>
                <option value="Assigned">Assigned</option>
                <option value="In Progress">In Progress ({inProgressCount})</option>
                <option value="Resolved">Resolved ({resolvedCount})</option>
                <option value="Rejected">Rejected ({rejectedCount})</option>
              </select>
            </div>

            {/* Severity Filter */}
            <div className="flex items-center gap-2">
              <Tag className="w-4 h-4 text-muted-foreground shrink-0" />
              <select
                value={severityFilter}
                onChange={(e) => setSeverityFilter(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-muted/60 border border-border text-foreground text-xs focus:outline-none focus:border-primary"
              >
                <option value="All">All Severities</option>
                <option value="High">High Severity</option>
                <option value="Medium">Medium Severity</option>
                <option value="Low">Low Severity</option>
              </select>
            </div>
          </div>

          {/* Complaints Table */}
          {complaints.length === 0 ? (
            <BorderGlowCard className="p-12 text-center text-muted-foreground text-sm">
              No complaints found in MongoDB database.
            </BorderGlowCard>
          ) : filteredComplaints.length === 0 ? (
            <BorderGlowCard className="p-12 text-center text-muted-foreground text-sm">
              No complaints match the selected filter query.
            </BorderGlowCard>
          ) : (
            <div className="overflow-x-auto rounded-2xl border border-border glass-panel">
              <table className="w-full text-left text-xs text-muted-foreground">
                <thead className="bg-muted/60 text-primary uppercase tracking-wider text-[11px] font-semibold border-b border-border">
                  <tr>
                    <th className="p-4">Complaint ID</th>
                    <th className="p-4">Citizen Name</th>
                    <th className="p-4">Waste & Issue Type</th>
                    <th className="p-4">Location</th>
                    <th className="p-4">Severity</th>
                    <th className="p-4">Reported Date</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredComplaints.map((cmp) => (
                    <tr key={cmp.id} className="hover:bg-muted/40 transition-colors">
                      <td className="p-4 font-mono font-bold text-primary text-[11px]">
                        #{String(cmp.id).substring(String(cmp.id).length - 8)}
                      </td>
                      <td className="p-4 font-medium text-foreground">
                        <div>{cmp.userName || 'N/A'}</div>
                        {cmp.userEmail && cmp.userEmail !== 'N/A' && (
                          <div className="text-[10px] text-muted-foreground">{cmp.userEmail}</div>
                        )}
                      </td>
                      <td className="p-4">
                        <div className="font-semibold text-foreground">{cmp.issueType || 'N/A'}</div>
                        <div className="text-[11px] text-muted-foreground">{cmp.wasteType || 'N/A'}</div>
                      </td>
                      <td className="p-4 max-w-xs truncate">{cmp.location || 'N/A'}</td>
                      <td className="p-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold ${
                          cmp.severity === 'High'
                            ? 'bg-destructive/20 text-destructive border border-destructive/40'
                            : cmp.severity === 'Medium'
                            ? 'bg-accent/20 text-accent border border-accent/40'
                            : 'bg-muted text-muted-foreground border border-border'
                        }`}>
                          {cmp.severity || 'N/A'}
                        </span>
                      </td>
                      <td className="p-4 text-[11px]">
                        {cmp.reportedAt ? new Date(cmp.reportedAt).toLocaleDateString() : 'N/A'}
                      </td>
                      <td className="p-4">
                        <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${
                          cmp.status === 'Resolved'
                            ? 'bg-secondary text-primary border border-primary/40'
                            : cmp.status === 'Rejected'
                            ? 'bg-destructive/20 text-destructive border border-destructive/40'
                            : 'bg-accent/20 text-accent border border-accent/40'
                        }`}>
                          {cmp.status || 'Pending'}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setSelectedDetailComplaint(cmp)}
                            className="p-1.5 rounded-lg border border-border text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                            title="View Full Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleOpenStatusModal(cmp)}
                            className="px-3 py-1.5 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-xs shadow"
                          >
                            Update Status
                          </motion.button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* SECTION 3: PICKUP REQUESTS TAB */}
      {/* ========================================================================= */}
      {activeTab === 'pickups' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
                <Truck className="w-5 h-5 text-primary" /> Doorstep Pickup Dispatch Queue
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Manage citizen doorstep waste collection requests from MongoDB database
              </p>
            </div>
            <div className="text-xs text-muted-foreground">
              Total Found: <strong className="text-foreground font-bold">{filteredPickups.length}</strong> / {totalPickupsCount}
            </div>
          </div>

          {/* Pickup Filters */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-secondary/30 border border-border">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-3 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search pickup ID, citizen, address..."
                value={pickupSearchQuery}
                onChange={(e) => setPickupSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-xl bg-muted/60 border border-border text-foreground text-xs focus:outline-none focus:border-primary"
              />
            </div>

            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-muted-foreground shrink-0" />
              <select
                value={pickupStatusFilter}
                onChange={(e) => setPickupStatusFilter(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-muted/60 border border-border text-foreground text-xs focus:outline-none focus:border-primary"
              >
                <option value="All">All Pickup Statuses</option>
                <option value="Pending">Pending ({pendingPickupsCount})</option>
                <option value="Accepted">Accepted</option>
                <option value="Scheduled">Scheduled</option>
                <option value="Collected">Collected</option>
              </select>
            </div>
          </div>

          {pickups.length === 0 ? (
            <BorderGlowCard className="p-12 text-center text-muted-foreground text-sm">
              No pickup requests found in MongoDB database.
            </BorderGlowCard>
          ) : filteredPickups.length === 0 ? (
            <BorderGlowCard className="p-12 text-center text-muted-foreground text-sm">
              No pickup requests match the selected search query.
            </BorderGlowCard>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {filteredPickups.map((pu) => (
                <BorderGlowCard key={pu.id} className="p-5 space-y-3">
                  <div className="flex items-center justify-between border-b border-border pb-3">
                    <div>
                      <span className="font-mono font-bold text-primary text-xs">
                        #{String(pu.id).substring(String(pu.id).length - 8)}
                      </span>
                      <h4 className="text-sm font-bold text-foreground mt-0.5">{pu.userName || 'N/A'}</h4>
                    </div>
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                      pu.status === 'Collected'
                        ? 'bg-secondary text-primary border border-primary/30'
                        : 'bg-accent/20 text-accent border border-accent/30'
                    }`}>
                      {pu.status || 'Pending'}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                    <div>
                      <strong className="text-foreground">Waste Type:</strong> {pu.wasteType || 'N/A'}
                    </div>
                    <div>
                      <strong className="text-foreground">Pref Date:</strong> {pu.preferredDate || 'N/A'}
                    </div>
                    <div>
                      <strong className="text-foreground">Pref Time:</strong> {pu.preferredTime || 'N/A'}
                    </div>
                    {pu.userEmail && pu.userEmail !== 'N/A' && (
                      <div>
                        <strong className="text-foreground">Email:</strong> {pu.userEmail}
                      </div>
                    )}
                  </div>

                  <div className="text-xs text-muted-foreground">
                    <strong className="text-foreground">Pickup Address:</strong> {pu.address || 'N/A'}
                  </div>

                  {pu.additionalDetails && (
                    <div className="text-[11px] text-muted-foreground bg-muted/40 p-2 rounded-lg italic">
                      "{pu.additionalDetails}"
                    </div>
                  )}

                  <div className="flex gap-2 pt-3 border-t border-border">
                    <button
                      onClick={() => handleUpdatePickupStatus(pu.id, 'Scheduled')}
                      className="px-3 py-1.5 rounded-xl bg-secondary text-primary border border-primary/40 text-xs font-semibold hover:bg-secondary/80 transition-colors"
                    >
                      Mark Scheduled
                    </button>
                    <button
                      onClick={() => handleUpdatePickupStatus(pu.id, 'Collected')}
                      className="px-3 py-1.5 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-bold transition-colors"
                    >
                      Mark Collected
                    </button>
                  </div>
                </BorderGlowCard>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* SECTION 4: HOTSPOTS / ANALYTICS TAB */}
      {/* ========================================================================= */}
      {activeTab === 'hotspots' && (
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
              <Flame className="w-5 h-5 text-accent" /> Waste Analytics & Concentration Hotspots
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Aggregated waste report clusters calculated from real database entries
            </p>
          </div>

          {hotspots.length === 0 ? (
            <BorderGlowCard className="p-12 text-center text-muted-foreground text-sm">
              No waste hotspots detected yet in the database.
            </BorderGlowCard>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {hotspots.map((hs, idx) => (
                <BorderGlowCard key={idx} className="p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-accent flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5" />
                      <span className="truncate max-w-[160px]">{hs.address || hs.area || 'Unknown Area'}</span>
                    </span>
                    <span className="px-2 py-0.5 rounded bg-destructive/20 text-destructive text-[10px] font-bold">
                      {hs.intensity || hs.severity || 'Moderate'} Hotspot
                    </span>
                  </div>
                  <div className="text-2xl font-extrabold text-foreground">
                    {hs.reportCount || hs.complaintCount || 0} Reports
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Dominant Waste Type: <strong className="text-foreground">{hs.dominantWasteType || hs.primaryIssue || 'Mixed'}</strong>
                  </div>
                </BorderGlowCard>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 1: FULL COMPLAINT DETAIL VIEW */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {selectedDetailComplaint && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.2 }}
              className="max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <BorderGlowCard className="p-6 space-y-6">
                <div className="flex items-center justify-between border-b border-border pb-3">
                  <div>
                    <span className="text-xs font-mono text-primary font-bold">
                      Report ID #{selectedDetailComplaint.id}
                    </span>
                    <h3 className="text-lg font-bold text-foreground mt-0.5">
                      {selectedDetailComplaint.issueType || 'N/A'}
                    </h3>
                  </div>
                  <button
                    onClick={() => setSelectedDetailComplaint(null)}
                    className="text-muted-foreground hover:text-foreground text-sm p-1"
                  >
                    ✕
                  </button>
                </div>

                {/* Photo Preview if present */}
                {selectedDetailComplaint.photoUrl && (
                  <div className="rounded-xl overflow-hidden max-h-56 bg-black flex items-center justify-center border border-border">
                    <img
                      src={selectedDetailComplaint.photoUrl}
                      alt="Waste Evidence"
                      className="object-contain max-h-56 w-full"
                    />
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="space-y-1 bg-muted/30 p-3 rounded-xl border border-border">
                    <div className="text-muted-foreground font-semibold uppercase text-[10px]">Citizen Reporter</div>
                    <div className="text-sm font-bold text-foreground">{selectedDetailComplaint.userName || 'N/A'}</div>
                    <div className="text-muted-foreground">{selectedDetailComplaint.userEmail || 'N/A'}</div>
                    <div className="text-muted-foreground">{selectedDetailComplaint.userPhone || 'N/A'}</div>
                  </div>

                  <div className="space-y-1 bg-muted/30 p-3 rounded-xl border border-border">
                    <div className="text-muted-foreground font-semibold uppercase text-[10px]">Classification</div>
                    <div><strong className="text-foreground">Waste Type:</strong> {selectedDetailComplaint.wasteType || 'N/A'}</div>
                    <div><strong className="text-foreground">Severity:</strong> {selectedDetailComplaint.severity || 'N/A'}</div>
                    <div><strong className="text-foreground">Current Status:</strong> {selectedDetailComplaint.status || 'Pending'}</div>
                  </div>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="font-semibold text-muted-foreground uppercase text-[10px]">Location & Landmark</div>
                  <div className="text-foreground font-medium">{selectedDetailComplaint.location || 'N/A'}</div>
                  {selectedDetailComplaint.landmark && (
                    <div className="text-muted-foreground">Landmark: {selectedDetailComplaint.landmark}</div>
                  )}
                  {selectedDetailComplaint.latitude && selectedDetailComplaint.longitude && (
                    <div className="text-[11px] font-mono text-primary">
                      GPS: {selectedDetailComplaint.latitude}, {selectedDetailComplaint.longitude}
                    </div>
                  )}
                </div>

                {selectedDetailComplaint.description && (
                  <div className="space-y-1 text-xs">
                    <div className="font-semibold text-muted-foreground uppercase text-[10px]">Description</div>
                    <p className="text-foreground bg-muted/40 p-3 rounded-xl border border-border">
                      {selectedDetailComplaint.description}
                    </p>
                  </div>
                )}

                <div className="space-y-1 text-xs">
                  <div className="font-semibold text-muted-foreground uppercase text-[10px]">Assignment & Resolution</div>
                  <div className="text-muted-foreground">
                    Assigned Officer/Team: <strong className="text-foreground">{selectedDetailComplaint.assignedTo || 'Unassigned'}</strong>
                  </div>
                  {selectedDetailComplaint.resolutionNotes && (
                    <div className="text-muted-foreground mt-1">
                      Resolution Notes: <span className="text-foreground">{selectedDetailComplaint.resolutionNotes}</span>
                    </div>
                  )}
                </div>

                <div className="flex justify-end gap-3 pt-3 border-t border-border">
                  <button
                    onClick={() => setSelectedDetailComplaint(null)}
                    className="px-4 py-2 rounded-xl border border-border text-foreground hover:bg-muted text-xs font-semibold"
                  >
                    Close
                  </button>
                  <button
                    onClick={() => {
                      const cmp = selectedDetailComplaint;
                      setSelectedDetailComplaint(null);
                      handleOpenStatusModal(cmp);
                    }}
                    className="px-5 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-bold shadow"
                  >
                    Update Status & Assign →
                  </button>
                </div>
              </BorderGlowCard>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ========================================================================= */}
      {/* MODAL 2: STATUS & OFFICER ASSIGNMENT UPDATE */}
      {/* ========================================================================= */}
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
                  <h3 className="text-lg font-bold text-foreground">
                    Update Complaint Status #{String(selectedComplaint.id).substring(String(selectedComplaint.id).length - 6)}
                  </h3>
                  <button
                    onClick={() => setSelectedComplaint(null)}
                    className="text-muted-foreground hover:text-foreground text-sm"
                  >
                    ✕
                  </button>
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
                      <option value="Resolved">Resolved (Qualifies citizen for medals)</option>
                      <option value="Rejected">Rejected (Excluded from medals)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                      Assign Field Officer / Sanitation Team
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Officer R. Sharma / Unit ND-04"
                      value={assignedTo}
                      onChange={(e) => setAssignedTo(e.target.value)}
                      className="w-full px-4 py-2 rounded-xl bg-muted/50 border border-border text-foreground text-xs focus:outline-none focus:border-primary"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                      Resolution Notes / Action Dispatched
                    </label>
                    <textarea
                      value={resolutionNotes}
                      onChange={(e) => setResolutionNotes(e.target.value)}
                      placeholder="Municipal truck dispatched to clear area..."
                      rows={3}
                      className="w-full px-4 py-2.5 rounded-xl bg-muted/50 border border-border text-foreground text-sm focus:outline-none focus:border-primary"
                    />
                  </div>

                  <div className="p-3 rounded-xl bg-muted/40 border border-border text-[11px] text-muted-foreground flex items-start gap-2">
                    <Mail className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                    <span>
                      <strong>Automatic Email Dispatch:</strong> Saving this update will save changes to MongoDB and automatically email citizen <strong>{selectedComplaint.userName || 'Citizen'}</strong>.
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
                      {updating ? 'Saving Changes...' : 'Save & Send Email Notification'}
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
