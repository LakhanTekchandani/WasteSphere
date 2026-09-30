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
      className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8"
    >
      {/* Title */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-secondary border border-primary/40 text-primary text-xs font-semibold backdrop-blur-md">
          <FileCheck className="w-4 h-4 text-primary" />
          <span>ADMINISTRATOR-ISSUED CIVIC CREDENTIAL</span>
        </div>
        <h1 className="text-3xl font-extrabold text-foreground">Environmental Awareness Certificate</h1>
        <p className="text-muted-foreground text-sm max-w-lg mx-auto">
          Issued by municipal waste administrators to citizens completing required awareness and qualifying complaint criteria.
        </p>
      </div>

      {certData?.issued ? (
        <div className="space-y-6">
          {/* Certificate Render */}
          <div
            id="certificate-print-area"
            className="relative p-8 md:p-12 rounded-3xl bg-card border-4 border-accent/40 text-center space-y-6 shadow-2xl overflow-hidden"
          >
            {/* Background Seal Watermark */}
            <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
              <Award className="w-[450px] h-[450px] text-primary" />
            </div>

            {/* Header */}
            <div className="space-y-2 relative z-10">
              <div className="flex justify-center mb-2">
                <div className="w-16 h-16 rounded-2xl bg-accent flex items-center justify-center text-accent-foreground font-black shadow-lg">
                  <Award className="w-10 h-10" />
                </div>
              </div>
              <span className="text-xs uppercase tracking-[0.3em] font-extrabold text-accent">
                Official Civic Recognition
              </span>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-card-foreground tracking-wide">
                CERTIFICATE OF ENVIRONMENTAL MERIT
              </h2>
            </div>

            <div className="w-32 h-0.5 bg-gradient-to-r from-transparent via-accent to-transparent mx-auto" />

            {/* Recipient */}
            <div className="space-y-2 relative z-10">
              <p className="text-xs text-muted-foreground uppercase tracking-widest">This certificate is proudly presented to</p>
              <h3 className="text-3xl sm:text-4xl font-black text-primary font-serif">
                {user?.name || 'Aarav Sharma'}
              </h3>
              <p className="text-xs text-card-foreground max-w-xl mx-auto leading-relaxed pt-2">
                In recognition of outstanding civic participation, waste segregation awareness, and active contribution to urban cleanliness through verified waste issue reporting on the <strong>WasteSphere Platform</strong>.
              </p>
            </div>

            {/* Metadata Footer */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-8 border-t border-border text-xs text-muted-foreground relative z-10">
              <div>
                <span className="block text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">
                  Unique Certificate ID
                </span>
                <span className="font-mono font-bold text-primary">{certData.certificateId}</span>
              </div>

              <div>
                <span className="block text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">
                  Date of Issuance
                </span>
                <span className="font-semibold text-card-foreground">{certData.issueDate}</span>
              </div>

              <div>
                <span className="block text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">
                  Issuing Authority
                </span>
                <span className="font-semibold text-card-foreground">Department of Municipal Waste Affairs</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center gap-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handlePrint}
              className="px-6 py-3 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-xs shadow-lg flex items-center gap-2"
            >
              <Printer className="w-4 h-4" /> Print / Save Certificate PDF
            </motion.button>
          </div>
        </div>
      ) : (
        <BorderGlowCard className="p-8 text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-accent/20 text-accent flex items-center justify-center mx-auto">
            <Sparkles className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-foreground">Certificate Status Evaluation</h3>
          <p className="text-xs text-muted-foreground max-w-md mx-auto">
            Maintain active reporting and high quiz accuracy. Your certificate application is evaluated automatically as your reports are resolved.
          </p>
          <div className="text-xs font-semibold text-primary">
            Qualifying Valid Reports: {certData?.qualifyingCount || 0} / 3 Threshold Required
          </div>
        </BorderGlowCard>
      )}
    </motion.div>
  );
};
