import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { BorderGlowCard } from '../components/common/BorderGlowCard';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { FileCheck, Award, Printer, Download, Sparkles, ShieldCheck, CheckCircle2 } from 'lucide-react';

export const CertificatePage = () => {
  const { user } = useAuth();
  const [certData, setCertData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCert = async () => {
      try {
        const data = await api.getCertificateStatus();
        setCertData(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCert();
  }, []);

  const handlePrint = () => {
    window.print();
  };

  if (loading) return <LoadingSpinner label="Loading official certificate..." />;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 bg-[#0b141a]"
    >
      {/* Title */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#12332a] border border-[#00a884]/40 text-[#25d366] text-xs font-semibold backdrop-blur-md">
          <FileCheck className="w-4 h-4 text-[#25d366]" />
          <span>ADMINISTRATOR-ISSUED CIVIC CREDENTIAL</span>
        </div>
        <h1 className="text-3xl font-extrabold text-white">Environmental Awareness Certificate</h1>
        <p className="text-[#8696a0] text-sm max-w-lg mx-auto">
          Issued by municipal waste administrators to citizens completing required awareness and qualifying complaint criteria.
        </p>
      </div>

      {certData?.issued ? (
        <div className="space-y-6">
          {/* Certificate Render */}
          <div
            id="certificate-print-area"
            className="relative p-8 md:p-12 rounded-3xl bg-gradient-to-b from-[#12332a] via-[#1f2c34] to-[#0b141a] border-4 border-amber-500/40 text-center space-y-6 shadow-2xl overflow-hidden"
          >
            {/* Background Seal Watermark */}
            <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
              <Award className="w-[450px] h-[450px] text-[#25d366]" />
            </div>

            {/* Header */}
            <div className="space-y-2 relative z-10">
              <div className="flex justify-center mb-2">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400 to-yellow-600 flex items-center justify-center text-slate-950 font-black shadow-lg">
                  <Award className="w-10 h-10" />
                </div>
              </div>
              <span className="text-xs uppercase tracking-[0.3em] font-extrabold text-amber-400">
                Official Civic Recognition
              </span>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-wide">
                CERTIFICATE OF ENVIRONMENTAL MERIT
              </h2>
            </div>

            <div className="w-32 h-0.5 bg-gradient-to-r from-transparent via-amber-400 to-transparent mx-auto" />

            {/* Recipient */}
            <div className="space-y-2 relative z-10">
              <p className="text-xs text-[#8696a0] uppercase tracking-widest">This certificate is proudly presented to</p>
              <h3 className="text-3xl sm:text-4xl font-black text-[#25d366] font-serif">
                {user?.name || 'Aarav Sharma'}
              </h3>
              <p className="text-xs text-[#e9edef] max-w-xl mx-auto leading-relaxed pt-2">
                In recognition of outstanding civic participation, waste segregation awareness, and active contribution to urban cleanliness through verified waste issue reporting on the <strong>WasteSphere Platform</strong>.
              </p>
            </div>

            {/* Metadata Footer */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-8 border-t border-[#2a3942] text-xs text-[#8696a0] relative z-10">
              <div>
                <span className="block text-[10px] uppercase tracking-wider text-[#8696a0] font-semibold">
                  Unique Certificate ID
                </span>
                <span className="font-mono font-bold text-[#25d366]">{certData.certificateId}</span>
              </div>

              <div>
                <span className="block text-[10px] uppercase tracking-wider text-[#8696a0] font-semibold">
                  Date of Issuance
                </span>
                <span className="font-semibold text-white">{certData.issueDate}</span>
              </div>

              <div>
                <span className="block text-[10px] uppercase tracking-wider text-[#8696a0] font-semibold">
                  Issuing Authority
                </span>
                <span className="font-semibold text-white">Department of Municipal Waste Affairs</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center gap-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handlePrint}
              className="px-6 py-3 rounded-xl bg-[#00a884] hover:bg-[#00a884]/90 text-[#111b21] font-bold text-xs shadow-lg flex items-center gap-2"
            >
              <Printer className="w-4 h-4" /> Print / Save Certificate PDF
            </motion.button>
          </div>
        </div>
      ) : (
        <BorderGlowCard className="p-8 text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center mx-auto">
            <Sparkles className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-white">Certificate Status Evaluation</h3>
          <p className="text-xs text-[#8696a0] max-w-md mx-auto">
            Maintain active reporting and high quiz accuracy. Your certificate application is evaluated automatically as your reports are resolved.
          </p>
          <div className="text-xs font-semibold text-[#25d366]">
            Qualifying Valid Reports: {certData?.qualifyingCount || 0} / 3 Threshold Required
          </div>
        </BorderGlowCard>
      )}
    </motion.div>
  );
};
