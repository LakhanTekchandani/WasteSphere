import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { BorderGlowCard } from '../components/common/BorderGlowCard';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { Truck, MapPin, Calendar, Clock, PlusCircle, CheckCircle2, PhoneCall } from 'lucide-react';

export const PickupPage = () => {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [pickups, setPickups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Form State
  const [wasteType, setWasteType] = useState('E-Waste');
  const [location, setLocation] = useState('12-B Park Street, Sector 4, New Delhi');
  const [address, setAddress] = useState('Flat 302, Sunrise Apartments, Park Street');
  const [preferredDate, setPreferredDate] = useState('2026-10-02');
  const [preferredTime, setPreferredTime] = useState('10:00 AM - 01:00 PM');
  const [additionalDetails, setAdditionalDetails] = useState('');

  const fetchPickups = async () => {
    try {
      const data = await api.getPickups();
      setPickups(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPickups();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!wasteType || !location || !address || !preferredDate || !preferredTime) {
      showToast('Please complete required pickup scheduling fields.', 'error');
      return;
    }

    setSubmitting(true);
    try {
      const res = await api.createPickup({
        wasteType,
        location,
        address,
        preferredDate,
        preferredTime,
        additionalDetails
      });

      showToast(
        `Pickup request ${res.pickup.id} created! SMS update sent.`,
        'sms',
        'Pickup Request Scheduled 🚛'
      );
      fetchPickups();
    } catch (err) {
      showToast('Failed to create pickup request.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <LoadingSpinner label="Loading waste pickup schedule..." />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 bg-[#0b141a]">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h1 className="text-3xl font-extrabold text-white flex items-center gap-2">
          <Truck className="w-8 h-8 text-[#25d366]" /> Doorstep Waste Pickup Service
        </h1>
        <p className="text-[#8696a0] text-sm">
          Schedule doorstep collection for E-Waste, bulk paper packaging, or hazardous recyclables.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Request Form */}
        <BorderGlowCard className="lg:col-span-6 p-6 space-y-5">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <PlusCircle className="w-5 h-5 text-[#25d366]" /> Schedule New Pickup
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-[#8696a0] uppercase tracking-wider mb-1">
                Waste Category for Collection *
              </label>
              <select
                value={wasteType}
                onChange={(e) => setWasteType(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-[#111b21] border border-[#2a3942] text-white text-sm focus:outline-none focus:border-[#00a884]"
              >
                <option value="E-Waste">E-Waste (Electronics, Batteries, Circuitry)</option>
                <option value="Paper / Cardboard">Paper / Cardboard (Packaging, Bulk Boxes)</option>
                <option value="Plastic Waste">Bulk Plastic Waste</option>
                <option value="Glass Waste">Glass Bottles & Containers</option>
                <option value="Metal Waste">Scrap Metal & Cans</option>
                <option value="Organic / Wet Waste">Bulk Organic Composting</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-[#8696a0] uppercase tracking-wider mb-1">
                Pickup Area / City Location *
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Sector 4, Park Street Axis, New Delhi"
                className="w-full px-4 py-2.5 rounded-xl bg-[#111b21] border border-[#2a3942] text-white text-sm focus:outline-none focus:border-[#00a884]"
                required
              />
            </div>

            <div>
              <label className="block font-semibold text-[#8696a0] uppercase tracking-wider mb-1">
                Full Street / Doorbell Address *
              </label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Flat 302, Sunrise Apartments, Park Street"
                className="w-full px-4 py-2.5 rounded-xl bg-[#111b21] border border-[#2a3942] text-white text-sm focus:outline-none focus:border-[#00a884]"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-[#8696a0] uppercase tracking-wider mb-1">
                  Preferred Date *
                </label>
                <input
                  type="date"
                  value={preferredDate}
                  onChange={(e) => setPreferredDate(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#111b21] border border-[#2a3942] text-white text-sm focus:outline-none focus:border-[#00a884]"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-[#8696a0] uppercase tracking-wider mb-1">
                  Preferred Time Window *
                </label>
                <select
                  value={preferredTime}
                  onChange={(e) => setPreferredTime(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#111b21] border border-[#2a3942] text-white text-sm focus:outline-none focus:border-[#00a884]"
                >
                  <option value="09:00 AM - 12:00 PM">09:00 AM - 12:00 PM</option>
                  <option value="10:00 AM - 01:00 PM">10:00 AM - 01:00 PM</option>
                  <option value="02:00 PM - 05:00 PM">02:00 PM - 05:00 PM</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block font-semibold text-[#8696a0] uppercase tracking-wider mb-1">
                Additional Quantity / Item Details (Optional)
              </label>
              <textarea
                value={additionalDetails}
                onChange={(e) => setAdditionalDetails(e.target.value)}
                placeholder="e.g., 3 old monitors, 2 desktop towers..."
                rows={3}
                className="w-full px-4 py-2.5 rounded-xl bg-[#111b21] border border-[#2a3942] text-white text-sm focus:outline-none focus:border-[#00a884]"
              />
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={submitting}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-[#00a884] to-[#25d366] text-[#111b21] font-bold text-sm shadow-lg shadow-[#00a884]/20 transition-all"
            >
              {submitting ? 'Scheduling Pickup...' : 'Submit Doorstep Pickup Request'}
            </motion.button>
          </form>
        </BorderGlowCard>

        {/* Existing Pickup Requests */}
        <div className="lg:col-span-6 space-y-4">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Truck className="w-5 h-5 text-[#25d366]" /> Active Pickup Requests
          </h2>

          <div className="space-y-3">
            {pickups.length === 0 ? (
              <BorderGlowCard className="p-8 text-center text-[#8696a0] text-sm">
                No active pickup requests scheduled yet.
              </BorderGlowCard>
            ) : (
              pickups.map((pu) => (
                <BorderGlowCard key={pu.id} className="p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-sm text-[#25d366]">{pu.id}</span>
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#12332a] text-[#25d366] border border-[#00a884]/40">
                      {pu.status}
                    </span>
                  </div>

                  <div>
                    <div className="text-sm font-bold text-white">{pu.wasteType} Collection</div>
                    <div className="text-xs text-[#8696a0] flex items-center gap-1.5 mt-1">
                      <MapPin className="w-3.5 h-3.5 text-[#25d366] shrink-0" /> {pu.address}
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs text-[#8696a0] pt-2 border-t border-[#2a3942]">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-[#25d366]" /> {pu.preferredDate}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-[#25d366]" /> {pu.preferredTime}
                    </span>
                  </div>
                </BorderGlowCard>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
