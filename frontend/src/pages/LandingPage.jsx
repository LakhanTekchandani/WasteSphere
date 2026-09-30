import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { LandingIntro } from '../components/common/LandingIntro';
import { BorderGlowCard } from '../components/common/BorderGlowCard';
import { BadgeIcon } from '../components/common/BadgeIcon';
import {
  Sparkles,
  Camera,
  Cpu,
  Edit3,
  CheckCircle2,
  Mail,
  Truck,
  Award,
  BookOpen,
  ArrowRight,
  ShieldCheck,
  MapPin,
  FileCheck,
  RotateCcw
} from 'lucide-react';

export const LandingPage = () => {
  const location = useLocation();

  // Intro state: check URL search params for ?replay=true or check session storage
  const [introComplete, setIntroComplete] = useState(() => {
    const isReplayRequested = new URLSearchParams(window.location.search).get('replay') === 'true';
    if (isReplayRequested) return false;
    return !!sessionStorage.removeItem('wastesphere_intro_played');
location.reload();
  });

  const handleReplayIntro = () => {
    sessionStorage.removeItem('wastesphere_intro_played');
    setIntroComplete(false);
  };

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
    <div className="min-h-screen bg-background text-foreground flex flex-col overflow-x-hidden">
      {/* 1. SEPARATE INTRO ANIMATION COMPONENT (Renders full-screen while introComplete is false) */}
      {!introComplete && (
        <LandingIntro onComplete={() => setIntroComplete(true)} />
      )}

      {/* LANDING PAGE CONTENT (Visibly hidden while intro is actively running) */}
      <AnimatePresence>
        {introComplete && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="w-full flex flex-col"
          >
            {/* 2. RESTORED CENTERED LANDING HERO (NO RIGHT-SIDE CARD, NO GLOBE) */}
            <section className="relative pt-12 pb-16 md:pt-20 md:pb-24 border-b border-border bg-gradient-to-b from-secondary/40 via-background to-background overflow-hidden">
              {/* Subtle Ambient Radial Backlight */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-primary/5 blur-3xl pointer-events-none rounded-full" />

              <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  className="space-y-6"
                >
                  {/* Small Eyebrow Badge (Clickable to Replay Intro on Demand) */}
                  <motion.div variants={itemVariants} className="inline-flex items-center justify-center">
                    <button
                      onClick={handleReplayIntro}
                      title="Click to replay opening animation"
                      className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-secondary border border-primary/30 text-primary text-xs font-bold tracking-wide backdrop-blur-md hover:bg-primary/10 transition-colors group cursor-pointer"
                    >
                      <Sparkles className="w-4 h-4 text-primary" />
                      <span>Next-Generation Civic Environmental Platform</span>
                      <RotateCcw className="w-3 h-3 text-primary/70 group-hover:rotate-180 transition-transform duration-500 ml-1" />
                    </button>
                  </motion.div>

                  {/* Main Centered Heading */}
                  <motion.h1 
                    variants={itemVariants} 
                    className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-foreground tracking-tight leading-[1.15]"
                  >
                    Transforming Civic Waste Management with{' '}
                    <span className="text-primary bg-clip-text">Artificial Intelligence</span>
                  </motion.h1>

                  {/* Supporting Description */}
                  <motion.p 
                    variants={itemVariants} 
                    className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed font-normal"
                  >
                    Upload photographic evidence of waste issues for instant AI classification. Review details, track resolution progress with real-time email updates, schedule doorstep collection, and earn civic recognition.
                  </motion.p>

                  {/* Primary & Secondary CTAs */}
                  <motion.div 
                    variants={itemVariants} 
                    className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
                  >
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="w-full sm:w-auto">
                      <Link
                        to="/report"
                        className="w-full sm:w-auto px-8 py-4 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-base shadow-lg shadow-primary/20 transition-all flex items-center justify-center gap-2.5"
                      >
                        <Camera className="w-5 h-5" />
                        Report Waste Issue
                      </Link>
                    </motion.div>

                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="w-full sm:w-auto">
                      <Link
                        to="/awareness"
                        className="w-full sm:w-auto px-8 py-4 rounded-xl border border-border bg-card text-foreground hover:bg-muted font-semibold text-base transition-all flex items-center justify-center gap-2 shadow-sm"
                      >
                        <BookOpen className="w-5 h-5 text-primary" />
                        Take Segregation Quiz
                      </Link>
                    </motion.div>
                  </motion.div>

                  {/* Trust Metrics Bar */}
                  <motion.div 
                    variants={itemVariants} 
                    className="grid grid-cols-3 gap-6 pt-10 border-t border-border max-w-xl mx-auto text-center"
                  >
                    <div>
                      <div className="text-2xl font-extrabold text-primary">98.4%</div>
                      <div className="text-xs font-medium text-muted-foreground mt-0.5">AI Classification Accuracy</div>
                    </div>
                    <div>
                      <div className="text-2xl font-extrabold text-primary">Email</div>
                      <div className="text-xs font-medium text-muted-foreground mt-0.5">Real-Time Status Alerts</div>
                    </div>
                    <div>
                      <div className="text-2xl font-extrabold text-primary">Bronze/Gold</div>
                      <div className="text-xs font-medium text-muted-foreground mt-0.5">Civic Medals & Certificates</div>
                    </div>
                  </motion.div>
                </motion.div>
              </div>
            </section>

            {/* PRODUCT STORYTELLING BELOW HERO */}
            <section className="py-16 border-b border-border bg-muted/20">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
                    The WasteSphere <span className="text-primary">Civic Journey</span>
                  </h2>
                  <p className="text-muted-foreground text-xs sm:text-sm">
                    A transparent 5-stage lifecycle from initial photographic evidence to municipal resolution and citizen rewards.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.1 }}
                  >
                    <BorderGlowCard className="p-5 text-center space-y-2 h-full flex flex-col items-center justify-between">
                      <div className="w-10 h-10 rounded-xl bg-secondary text-primary flex items-center justify-center font-bold text-sm border border-primary/30">
                        <Camera className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-xs font-mono font-bold text-primary">01. REPORT</div>
                        <h3 className="text-sm font-bold text-foreground mt-1">Upload Photo</h3>
                        <p className="text-[11px] text-muted-foreground mt-1 leading-relaxed">
                          Snap or select photo evidence of waste issue.
                        </p>
                      </div>
                    </BorderGlowCard>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.2 }}
                  >
                    <BorderGlowCard className="p-5 text-center space-y-2 h-full flex flex-col items-center justify-between">
                      <div className="w-10 h-10 rounded-xl bg-secondary text-primary flex items-center justify-center font-bold text-sm border border-primary/30">
                        <Cpu className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-xs font-mono font-bold text-primary">02. AI RECOGNITION</div>
                        <h3 className="text-sm font-bold text-foreground mt-1">Auto-Detect</h3>
                        <p className="text-[11px] text-muted-foreground mt-1 leading-relaxed">
                          AI analyzes image & pre-selects waste category.
                        </p>
                      </div>
                    </BorderGlowCard>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.3 }}
                  >
                    <BorderGlowCard className="p-5 text-center space-y-2 h-full flex flex-col items-center justify-between">
                      <div className="w-10 h-10 rounded-xl bg-secondary text-primary flex items-center justify-center font-bold text-sm border border-primary/30">
                        <Edit3 className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-xs font-mono font-bold text-primary">03. REVIEW & SUBMIT</div>
                        <h3 className="text-sm font-bold text-foreground mt-1">Confirm Details</h3>
                        <p className="text-[11px] text-muted-foreground mt-1 leading-relaxed">
                          Citizen verifies category, GPS location & severity.
                        </p>
                      </div>
                    </BorderGlowCard>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.4 }}
                  >
                    <BorderGlowCard className="p-5 text-center space-y-2 h-full flex flex-col items-center justify-between">
                      <div className="w-10 h-10 rounded-xl bg-secondary text-primary flex items-center justify-center font-bold text-sm border border-primary/30">
                        <Mail className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-xs font-mono font-bold text-primary">04. TRACK</div>
                        <h3 className="text-sm font-bold text-foreground mt-1">Email Updates</h3>
                        <p className="text-[11px] text-muted-foreground mt-1 leading-relaxed">
                          Receive officer dispatch updates via email.
                        </p>
                      </div>
                    </BorderGlowCard>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.5 }}
                  >
                    <BorderGlowCard className="p-5 text-center space-y-2 h-full flex flex-col items-center justify-between">
                      <div className="w-10 h-10 rounded-xl bg-secondary text-primary flex items-center justify-center font-bold text-sm border border-primary/30">
                        <Award className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-xs font-mono font-bold text-primary">05. RECOGNITION</div>
                        <h3 className="text-sm font-bold text-foreground mt-1">Earn Medals</h3>
                        <p className="text-[11px] text-muted-foreground mt-1 leading-relaxed">
                          Build verified qualifying reports for Bronze/Gold.
                        </p>
                      </div>
                    </BorderGlowCard>
                  </motion.div>
                </div>
              </div>
            </section>

            {/* AI WASTE REPORTING SECTION */}
            <section className="py-20 border-b border-border bg-background">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                  
                  <div className="lg:col-span-6 space-y-6">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary border border-primary/30 text-primary text-xs font-bold">
                      <Cpu className="w-4 h-4 text-primary" />
                      <span>AI Computer Vision Engine</span>
                    </div>

                    <h2 className="text-3xl font-extrabold text-foreground tracking-tight">
                      Smart Assistance with <span className="text-primary">Human Oversight</span>
                    </h2>

                    <p className="text-sm text-muted-foreground leading-relaxed">
                      When you upload photographic evidence, AI scans visual features to suggest the waste type (Plastic, Organic, E-Waste, Glass). You retain full authority to review, edit, or override the suggestion before final submission.
                    </p>

                    {/* Product Rule Callout Box */}
                    <div className="p-4 rounded-xl bg-secondary/40 border border-primary/30 text-xs text-foreground space-y-1.5">
                      <div className="flex items-center gap-2 font-bold text-primary">
                        <ShieldCheck className="w-4 h-4" /> Explicit Platform Security Guarantee:
                      </div>
                      <p className="text-muted-foreground leading-relaxed">
                        AI ONLY recognizes the waste category from the photo. AI does <strong>NOT</strong> infer or decide location, user identity, phone numbers, or user-provided factual details.
                      </p>
                    </div>

                    <div className="pt-2">
                      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="inline-block">
                        <Link
                          to="/report"
                          className="px-6 py-3 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-xs shadow-md inline-flex items-center gap-2"
                        >
                          Report Waste Now <ArrowRight className="w-4 h-4" />
                        </Link>
                      </motion.div>
                    </div>
                  </div>

                  {/* Visual Workflow Mockup */}
                  <div className="lg:col-span-6">
                    <BorderGlowCard className="p-6 space-y-4">
                      <div className="flex items-center justify-between border-b border-border pb-3 text-xs">
                        <span className="font-mono font-bold text-primary">AI Recognition Telemetry</span>
                        <span className="px-2 py-0.5 rounded bg-secondary text-primary font-mono font-bold text-[10px]">
                          98.4% Confidence (Groq AI)
                        </span>
                      </div>

                      <div className="space-y-3 text-xs">
                        <div className="p-3 rounded-lg bg-muted/40 border border-border flex items-center justify-between">
                          <span className="text-muted-foreground">Uploaded Visual Evidence:</span>
                          <span className="font-semibold text-foreground">Plastic Bottles Heap</span>
                        </div>

                        <div className="p-3 rounded-lg bg-secondary/50 border border-primary/30 flex items-center justify-between">
                          <span className="text-muted-foreground">AI Suggested Category:</span>
                          <span className="font-bold text-primary">Plastic Waste</span>
                        </div>

                        <div className="p-3 rounded-lg bg-muted/40 border border-border flex items-center justify-between">
                          <span className="text-muted-foreground">Citizen Verification:</span>
                          <span className="font-semibold text-foreground">Confirmed & Edited by User</span>
                        </div>

                        <div className="p-3 rounded-lg bg-muted/40 border border-border flex items-center justify-between">
                          <span className="text-muted-foreground">Notification Dispatch:</span>
                          <span className="font-semibold text-foreground">Email Confirmation Sent</span>
                        </div>
                      </div>
                    </BorderGlowCard>
                  </div>

                </div>
              </div>
            </section>

            {/* AWARENESS + QUIZ SECTION */}
            <section className="py-20 border-b border-border bg-muted/20">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
                  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-secondary border border-primary/30 text-primary text-xs font-bold">
                    <BookOpen className="w-4 h-4 text-primary" />
                    <span>Civic Education & Quiz Hub</span>
                  </div>
                  <h2 className="text-3xl font-extrabold text-foreground tracking-tight">
                    Learn Segregation & <span className="text-primary">Score Points</span>
                  </h2>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    Explore guidelines for Organic, Dry, E-Waste, and Hazardous waste. Complete image-based quizzes with free public access.
                  </p>
                </div>

                {/* 5-Step Awareness Flow */}
                <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 text-center mb-12">
                  {['Learn Rules', 'Take Quiz', 'Earn Points', 'Unlock Recognition', 'Receive Certificate'].map((stepName, idx) => (
                    <div key={idx} className="p-4 rounded-xl bg-card border border-border space-y-1 shadow-sm">
                      <div className="text-[10px] font-mono font-bold text-primary uppercase">Step 0{idx + 1}</div>
                      <div className="text-xs font-bold text-foreground">{stepName}</div>
                    </div>
                  ))}
                </div>

                {/* 4 Waste Categories Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  <BorderGlowCard className="p-5 border-l-4 border-l-primary space-y-2">
                    <div className="font-bold text-primary text-sm">🟢 Wet / Organic</div>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Food scraps, peels, vegetable waste, tea leaves. Suitable for composting.
                    </p>
                  </BorderGlowCard>

                  <BorderGlowCard className="p-5 border-l-4 border-l-primary space-y-2">
                    <div className="font-bold text-primary text-sm">🔵 Dry / Recyclable</div>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Clean plastic bottles, cardboard, paper, tin cans. Sent to material recovery.
                    </p>
                  </BorderGlowCard>

                  <BorderGlowCard className="p-5 border-l-4 border-l-accent space-y-2">
                    <div className="font-bold text-accent text-sm">⚫ E-Waste</div>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Circuit boards, cables, old monitors, batteries. Requires authorized pickup.
                    </p>
                  </BorderGlowCard>

                  <BorderGlowCard className="p-5 border-l-4 border-l-destructive space-y-2">
                    <div className="font-bold text-destructive text-sm">🔴 Hazardous</div>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Chemical cleaners, fluorescent tubes, medical items. Special handling required.
                    </p>
                  </BorderGlowCard>
                </div>

                <div className="text-center pt-10">
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="inline-block">
                    <Link
                      to="/awareness"
                      className="px-7 py-3 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-xs shadow-md inline-flex items-center gap-2"
                    >
                      Take the Segregation Quiz <ArrowRight className="w-4 h-4" />
                    </Link>
                  </motion.div>
                </div>
              </div>
            </section>

            {/* CIVIC RECOGNITION SECTION */}
            <section className="py-20 border-b border-border bg-background">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                  
                  <div className="lg:col-span-5 space-y-6">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary border border-primary/30 text-primary text-xs font-bold">
                      <Award className="w-4 h-4 text-primary" />
                      <span>Civic Recognition Framework</span>
                    </div>

                    <h2 className="text-3xl font-extrabold text-foreground tracking-tight">
                      Verified Complaints Unlock <span className="text-primary">Official Recognition</span>
                    </h2>

                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Every report verified as valid by municipal administrators counts towards your Bronze, Silver, and Gold medal tiers. High-tier contributors become eligible for administrator-issued Environmental Merit Certificates.
                    </p>

                    <div className="flex items-center gap-4 pt-2">
                      <Link
                        to="/badges"
                        className="px-5 py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-xs shadow-md inline-flex items-center gap-1.5"
                      >
                        <Award className="w-4 h-4" /> View Medals
                      </Link>
                      <Link
                        to="/certificate"
                        className="px-5 py-2.5 rounded-xl border border-border bg-card text-foreground hover:bg-muted font-semibold text-xs shadow-sm inline-flex items-center gap-1.5"
                      >
                        <FileCheck className="w-4 h-4 text-primary" /> Check Certificate
                      </Link>
                    </div>
                  </div>

                  <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-6">
                    <BorderGlowCard className="text-center flex flex-col items-center justify-between p-6 space-y-3">
                      <BadgeIcon type="Bronze" size="lg" />
                      <div>
                        <h3 className="font-bold text-base text-foreground">BRONZE</h3>
                        <div className="text-xs text-accent font-bold mt-0.5">3–4 Valid Reports</div>
                        <p className="text-[11px] text-muted-foreground mt-2 leading-relaxed">Initial civic contributor badge.</p>
                      </div>
                    </BorderGlowCard>

                    <BorderGlowCard className="text-center flex flex-col items-center justify-between p-6 space-y-3">
                      <BadgeIcon type="Silver" size="lg" />
                      <div>
                        <h3 className="font-bold text-base text-foreground">SILVER</h3>
                        <div className="text-xs text-accent font-bold mt-0.5">5–9 Valid Reports</div>
                        <p className="text-[11px] text-muted-foreground mt-2 leading-relaxed">Active environmental advocate.</p>
                      </div>
                    </BorderGlowCard>

                    <BorderGlowCard className="text-center flex flex-col items-center justify-between p-6 space-y-3" activeGlow={true}>
                      <BadgeIcon type="Gold" size="lg" />
                      <div>
                        <h3 className="font-bold text-base text-foreground">GOLD</h3>
                        <div className="text-xs text-accent font-bold mt-0.5">10+ Valid Reports</div>
                        <p className="text-[11px] text-muted-foreground mt-2 leading-relaxed">Certificate eligibility unlocked.</p>
                      </div>
                    </BorderGlowCard>
                  </div>

                </div>
              </div>
            </section>

            {/* FINAL CALL TO ACTION */}
            <section className="py-20 bg-secondary/30">
              <div className="max-w-4xl mx-auto px-4 text-center space-y-6">
                <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">
                  Help keep your city cleaner.
                </h2>
                <p className="text-muted-foreground text-base max-w-xl mx-auto leading-relaxed">
                  Report responsibly. Learn continuously. Make an environmental impact with WasteSphere.
                </p>
                
                <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
                  <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }} className="w-full sm:w-auto">
                    <Link
                      to="/report"
                      className="w-full sm:w-auto px-8 py-4 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-extrabold text-sm shadow-xl inline-flex items-center justify-center gap-2 transition-all"
                    >
                      <Camera className="w-5 h-5" /> Report Waste Issue
                    </Link>
                  </motion.div>

                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="w-full sm:w-auto">
                    <Link
                      to="/awareness"
                      className="w-full sm:w-auto px-8 py-4 rounded-xl border border-border bg-card text-foreground hover:bg-muted font-bold text-sm shadow-sm inline-flex items-center justify-center gap-2 transition-all"
                    >
                      <BookOpen className="w-5 h-5 text-primary" /> Explore Awareness
                    </Link>
                  </motion.div>
                </div>
              </div>
            </section>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
