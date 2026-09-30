import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MoodField } from '../components/common/MoodField';
import { MaskedHeading } from '../components/common/MaskedHeading';
import { GlobeStudy } from '../components/common/GlobeStudy';
import { BorderGlowCard } from '../components/common/BorderGlowCard';
import { BadgeIcon } from '../components/common/BadgeIcon';
import {
  Sparkles,
  Camera,
  Cpu,
  Edit3,
  CheckCircle2,
  PhoneCall,
  Truck,
  Award,
  BookOpen,
  ArrowRight,
  ShieldCheck,
  Zap,
  MapPin
} from 'lucide-react';

export const LandingPage = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.05 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 16 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: 'easeOut' } }
  };

  return (
    <div className="min-h-screen bg-[#0b141a] text-[#e9edef] flex flex-col overflow-x-hidden">
      {/* Hero Section */}
      <MoodField className="pt-12 pb-20 md:py-24 border-b border-[#2a3942]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Hero Content */}
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="lg:col-span-7 space-y-6 text-center lg:text-left"
            >
              <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#12332a] border border-[#00a884]/40 text-[#25d366] text-xs font-semibold backdrop-blur-md">
                <Sparkles className="w-4 h-4 text-[#25d366]" />
                <span>Next-Gen Civic Waste Management Platform</span>
              </motion.div>

              <motion.div variants={itemVariants}>
                <MaskedHeading
                  prefix="Report Waste Issues,"
                  highlight="Empower Your City"
                  suffix=" with AI Assistance."
                />
              </motion.div>

              <motion.p variants={itemVariants} className="text-base sm:text-lg text-[#8696a0] max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
                Upload a photo to get instant AI waste-type suggestions, track report status in real time with SMS updates, request doorstep pickup, and earn official civic recognition.
              </motion.p>

              <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="w-full sm:w-auto">
                  <Link
                    to="/report"
                    className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-[#00a884] to-[#25d366] hover:from-[#00a884] hover:to-[#22c55e] text-[#111b21] font-bold text-base shadow-xl shadow-[#00a884]/20 transition-all flex items-center justify-center gap-2.5"
                  >
                    <Camera className="w-5 h-5" />
                    Report Waste (Guest or User)
                  </Link>
                </motion.div>

                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="w-full sm:w-auto">
                  <Link
                    to="/awareness"
                    className="w-full sm:w-auto px-8 py-4 rounded-xl glass-panel border border-[#2a3942] text-[#25d366] hover:text-white hover:bg-[#1f2c34] font-semibold text-base transition-all flex items-center justify-center gap-2"
                  >
                    <BookOpen className="w-5 h-5" />
                    Play Free Quiz
                  </Link>
                </motion.div>
              </motion.div>

              {/* Trust Metrics */}
              <motion.div variants={itemVariants} className="grid grid-cols-3 gap-4 pt-8 border-t border-[#2a3942] max-w-lg mx-auto lg:mx-0 text-center">
                <div>
                  <div className="text-2xl font-bold text-[#25d366]">98.4%</div>
                  <div className="text-xs text-[#8696a0]">AI Accuracy</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-[#25d366]">Bronze/Gold</div>
                  <div className="text-xs text-[#8696a0]">Civic Medals</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-[#25d366]">Instant</div>
                  <div className="text-xs text-[#8696a0]">SMS Alerts</div>
                </div>
              </motion.div>
            </motion.div>

            {/* Right Hero Globe Study Component */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="lg:col-span-5 flex justify-center"
            >
              <div className="relative w-full max-w-md">
                <div className="absolute inset-0 rounded-full bg-[#00a884]/10 blur-3xl" />
                <GlobeStudy className="w-full h-[400px]" />
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 glass-panel px-4 py-2 rounded-full text-xs font-semibold text-[#25d366] border border-[#2a3942] shadow-lg flex items-center gap-2 whitespace-nowrap bg-[#0b141a]/85">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#25d366] animate-ping" />
                  Live Civic Telemetry Active
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </MoodField>

      {/* AI Waste Recognition Workflow Section */}
      <section className="py-20 border-b border-[#2a3942] relative bg-[#111b21]/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
              AI-Assisted <span className="text-[#25d366]">Reporting Workflow</span>
            </h2>
            <p className="text-[#8696a0] text-base">
              Artificial Intelligence assists by identifying the waste type from your uploaded photo, while you retain 100% control to review, edit, and confirm location details before submission.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <BorderGlowCard className="flex flex-col gap-3">
              <div className="w-12 h-12 rounded-xl bg-[#12332a] text-[#25d366] flex items-center justify-center font-bold text-lg border border-[#00a884]/40">
                1
              </div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Camera className="w-5 h-5 text-[#25d366]" /> Upload Image
              </h3>
              <p className="text-sm text-[#8696a0]">
                Snap or upload a photo of the waste problem in your area.
              </p>
            </BorderGlowCard>

            <BorderGlowCard className="flex flex-col gap-3">
              <div className="w-12 h-12 rounded-xl bg-[#12332a] text-[#25d366] flex items-center justify-center font-bold text-lg border border-[#00a884]/40">
                2
              </div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Cpu className="w-5 h-5 text-[#25d366]" /> AI Detection
              </h3>
              <p className="text-sm text-[#8696a0]">
                AI scans the photo and suggests the category (e.g. Plastic, E-Waste, Organic).
              </p>
            </BorderGlowCard>

            <BorderGlowCard className="flex flex-col gap-3">
              <div className="w-12 h-12 rounded-xl bg-[#12332a] text-[#25d366] flex items-center justify-center font-bold text-lg border border-[#00a884]/40">
                3
              </div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-[#25d366]" /> Review & Edit
              </h3>
              <p className="text-sm text-[#8696a0]">
                Verify AI suggestions, supply accurate GPS location, severity, and landmark details.
              </p>
            </BorderGlowCard>

            <BorderGlowCard className="flex flex-col gap-3">
              <div className="w-12 h-12 rounded-xl bg-[#12332a] text-[#25d366] flex items-center justify-center font-bold text-lg border border-[#00a884]/40">
                4
              </div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <PhoneCall className="w-5 h-5 text-[#25d366]" /> Submit & SMS
              </h3>
              <p className="text-sm text-[#8696a0]">
                Submit report to municipal officers and receive real-time SMS updates.
              </p>
            </BorderGlowCard>
          </div>
        </div>
      </section>

      {/* Gamification: Bronze / Silver / Gold Recognition Section */}
      <section className="py-20 border-b border-[#2a3942]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-5 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold">
                <Award className="w-4 h-4 text-amber-400" />
                <span>Civic Participation Recognition</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
                Earn Recognized <span className="text-[#25d366]">Citizen Medals</span>
              </h2>
              <p className="text-[#8696a0] text-base leading-relaxed">
                Meaningful complaints contribute to your Bronze, Silver, and Gold progress. Invalid or rejected complaints do not count. Top contributors become eligible for administrator-issued environmental certificates.
              </p>
              <div className="pt-2">
                <Link
                  to="/badges"
                  className="inline-flex items-center gap-2 text-[#25d366] font-semibold hover:text-[#00a884] transition-colors"
                >
                  View Recognition Thresholds <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-6">
              <BorderGlowCard className="text-center flex flex-col items-center justify-center py-8">
                <BadgeIcon type="Bronze" size="lg" />
                <div className="mt-4 font-bold text-lg text-white">Bronze</div>
                <div className="text-xs text-amber-400 font-medium">3–4 Valid Reports</div>
                <p className="text-xs text-[#8696a0] mt-2">Initial civic contributor badge unlocked.</p>
              </BorderGlowCard>

              <BorderGlowCard className="text-center flex flex-col items-center justify-center py-8">
                <BadgeIcon type="Silver" size="lg" />
                <div className="mt-4 font-bold text-lg text-white">Silver</div>
                <div className="text-xs text-slate-300 font-medium">5–9 Valid Reports</div>
                <p className="text-xs text-[#8696a0] mt-2">Active environmental advocate recognition.</p>
              </BorderGlowCard>

              <BorderGlowCard className="text-center flex flex-col items-center justify-center py-8" activeGlow={true}>
                <BadgeIcon type="Gold" size="lg" />
                <div className="mt-4 font-bold text-lg text-white">Gold</div>
                <div className="text-xs text-yellow-400 font-medium">10+ Valid Reports</div>
                <p className="text-xs text-[#8696a0] mt-2">Master civic guardian & Certificate eligible.</p>
              </BorderGlowCard>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Quiz & Doorstep Pickup Highlights */}
      <section className="py-20 bg-[#111b21]/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Box 1: Doorstep Pickup */}
            <BorderGlowCard className="flex flex-col justify-between p-8">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-xl bg-[#12332a] text-[#25d366] flex items-center justify-center border border-[#00a884]/40">
                  <Truck className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-bold text-white">Doorstep Waste Pickup</h3>
                <p className="text-[#8696a0] text-sm leading-relaxed">
                  Have bulky cardboard boxes, old e-waste electronics, or hazardous household items? Schedule a pickup request with your preferred date and time.
                </p>
              </div>
              <div className="pt-6">
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Link
                    to="/pickup"
                    className="px-6 py-3 rounded-xl bg-[#00a884] hover:bg-[#00a884]/90 text-[#111b21] font-bold text-sm transition-colors inline-flex items-center gap-2"
                  >
                    Schedule Pickup <ArrowRight className="w-4 h-4" />
                  </Link>
                </motion.div>
              </div>
            </BorderGlowCard>

            {/* Box 2: Interactive Quiz */}
            <BorderGlowCard className="flex flex-col justify-between p-8">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-xl bg-[#12332a] text-[#25d366] flex items-center justify-center border border-[#00a884]/40">
                  <BookOpen className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-bold text-white">Free Interactive Waste Quiz</h3>
                <p className="text-[#8696a0] text-sm leading-relaxed">
                  No signup required! Learn segregation rules, test your knowledge with interactive image quizzes, score points, and explore green citizen rewards.
                </p>
              </div>
              <div className="pt-6">
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Link
                    to="/awareness"
                    className="px-6 py-3 rounded-xl glass-panel border border-[#2a3942] text-[#25d366] hover:bg-[#1f2c34] font-semibold text-sm transition-colors inline-flex items-center gap-2"
                  >
                    Take Quiz Instantly <ArrowRight className="w-4 h-4" />
                  </Link>
                </motion.div>
              </div>
            </BorderGlowCard>
          </div>
        </div>
      </section>

      {/* CTA Footer Banner */}
      <section className="py-16 bg-gradient-to-r from-[#0b141a] via-[#12332a] to-[#0b141a] border-t border-[#2a3942]">
        <div className="max-w-5xl mx-auto px-4 text-center space-y-6">
          <h2 className="text-3xl font-extrabold text-white">
            Ready to make your neighborhood cleaner?
          </h2>
          <p className="text-[#8696a0] text-base max-w-xl mx-auto">
            Join active citizens using WasteSphere to report waste issues, track resolutions, and protect the environment.
          </p>
          <div className="pt-2">
            <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }} className="inline-block">
              <Link
                to="/report"
                className="px-8 py-4 rounded-xl bg-gradient-to-r from-[#00a884] to-[#25d366] text-[#111b21] font-extrabold shadow-xl shadow-[#00a884]/25 inline-flex items-center gap-2 transition-all"
              >
                Submit a Waste Report Now <ArrowRight className="w-5 h-5" />
              </Link>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};
