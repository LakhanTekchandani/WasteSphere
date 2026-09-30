import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import { BorderGlowCard } from '../components/common/BorderGlowCard';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { FileText, MapPin, Clock, Search, Filter, ArrowRight, ShieldCheck, PhoneCall } from 'lucide-react';

export const ComplaintsPage = () => {
  const [complaints, setComplaints] = useState([]);
  const [filter, setFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const data = await api.getComplaints();
        setComplaints(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchComplaints();
  }, []);

  if (loading) return <LoadingSpinner label="Fetching complaint history..." />;

  const filtered = complaints.filter((c) => {
    const matchesFilter = filter === 'All' || c.status === filter;
    const matchesSearch =
      c.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.issueType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.wasteType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.location.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white">Complaint Lifecycle Tracking</h1>
          <p className="text-slate-300 text-sm">Follow real-time municipal updates and status changes for reported issues.</p>
        </div>

        <Link
          to="/report"
          className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white font-bold text-sm shadow-lg shadow-emerald-500/25 flex items-center gap-2 self-start md:self-auto"
        >
          + Report New Issue
        </Link>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl glass-panel border border-emerald-500/20">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by ID, category, or location..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-emerald-950/40 border border-emerald-500/20 text-xs text-white focus:outline-none focus:border-emerald-500"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          {['All', 'Pending', 'In Progress', 'Resolved', 'Rejected'].map((st) => (
            <button
              key={st}
              onClick={() => setFilter(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                filter === st
                  ? 'bg-emerald-500 text-white'
                  : 'bg-emerald-950/30 text-slate-400 hover:text-white'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Complaints List */}
      <div className="space-y-4">
        {filtered.length === 0 ? (
          <BorderGlowCard className="p-12 text-center text-slate-400 space-y-3">
            <FileText className="w-12 h-12 text-slate-600 mx-auto" />
            <p className="text-base font-semibold text-slate-300">No complaints matching filter criteria.</p>
            <p className="text-xs">Try selecting a different status filter or search term.</p>
          </BorderGlowCard>
        ) : (
          filtered.map((cmp) => (
            <BorderGlowCard key={cmp.id} className="p-5">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                {/* Image */}
                <div className="lg:col-span-3">
                  <img
                    src={cmp.photoUrl}
                    alt={cmp.issueType}
                    className="w-full h-32 object-cover rounded-xl border border-emerald-500/20"
                  />
                </div>

                {/* Details */}
                <div className="lg:col-span-6 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-sm text-emerald-400">{cmp.id}</span>
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-950 border border-emerald-500/30 text-emerald-300">
                      {cmp.wasteType}
                    </span>
                    {cmp.qualifiesForBadge && (
                      <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/30 font-semibold">
                        Medal Qualifying
                      </span>
                    )}
                  </div>

                  <h3 className="text-lg font-bold text-white">{cmp.issueType}</h3>
                  <p className="text-xs text-slate-300 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> {cmp.location}
                  </p>
                  {cmp.description && (
                    <p className="text-xs text-slate-400 line-clamp-1">{cmp.description}</p>
                  )}
                  <div className="text-[11px] text-slate-500 flex items-center gap-1">
                    <Clock className="w-3 h-3" /> Reported on {new Date(cmp.reportedAt).toLocaleDateString()}
                  </div>
                </div>

                {/* Status & Action */}
                <div className="lg:col-span-3 flex flex-col items-start lg:items-end justify-between gap-3">
                  <span
                    className={`px-3.5 py-1 rounded-full text-xs font-bold ${
                      cmp.status === 'Resolved'
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                        : cmp.status === 'In Progress' || cmp.status === 'Assigned'
                        ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40'
                        : cmp.status === 'Rejected'
                        ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                        : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                    }`}
                  >
                    {cmp.status}
                  </span>

                  <Link
                    to={`/complaints/${cmp.id}`}
                    className="px-4 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/20 text-xs font-semibold flex items-center gap-1.5"
                  >
                    View Status Timeline <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </BorderGlowCard>
          ))
        )}
      </div>
    </div>
  );
};
