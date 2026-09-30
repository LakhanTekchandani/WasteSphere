import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export const LandingIntro = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  // Step 1: 0.00s - 1.00s -> Clean minimal environmental scene
  // Step 2: 1.00s - 2.00s -> Realistic public waste bin smoothly appears in CENTER
  // Step 3: 2.00s - 4.00s -> Realistic young tree grows organically BEHIND the bin
  // Step 4: 4.00s - 4.50s -> "WasteSphere" brand text appears below composition
  // Step 5: 4.50s - 5.40s -> Smooth zoom out / transition into landing hero

  useEffect(() => {
    // Sequence timeline
    const t2 = setTimeout(() => setStep(2), 1000);  // 1.0s: Bin appears
    const t3 = setTimeout(() => setStep(3), 2000);  // 2.0s: Tree starts growing behind bin
    const t4 = setTimeout(() => setStep(4), 4000);  // 4.0s: Tree completed, brand text appears
    const t5 = setTimeout(() => setStep(5), 4500);  // 4.5s: Start zoom out transition
    const tEnd = setTimeout(() => {
      sessionStorage.setItem('wastesphere_intro_played', 'true');
      onComplete();
    }, 5400); // 5.4s: Complete & unmount

    return () => {
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearTimeout(t5);
      clearTimeout(tEnd);
    };
  }, [onComplete]);

  return (
    <AnimatePresence>
      {step < 6 && (
        <motion.div
          key="landing-intro-overlay"
          initial={{ opacity: 1 }}
          animate={step === 5 ? { opacity: 0, scale: 0.92 } : { opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-background text-foreground select-none overflow-hidden"
        >
          {/* STEP 1: CLEAN ATMOSPHERIC ENVIRONMENTAL BACKGROUND */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,var(--secondary)_0%,var(--background)_80%)] opacity-95 pointer-events-none" />

          {/* INTRO COMPOSITION CONTAINER */}
          <div className="relative flex flex-col items-center justify-center p-6 text-center max-w-xl w-full">
            
            {/* Tree + Bin Artboard Canvas Container */}
            <div className="relative w-88 h-88 sm:w-96 sm:h-96 flex items-center justify-center">

              {/* STEP 3: REALISTIC YOUNG TREE (Grows Organically Behind Bin from 2.0s to 4.0s) */}
              <motion.svg
                viewBox="0 0 300 320"
                className="absolute inset-0 w-full h-full z-0 overflow-visible"
                initial={{ opacity: 0 }}
                animate={step >= 3 ? { opacity: 1 } : { opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <defs>
                  {/* Realistic Bark & Wood Texture Gradient */}
                  <linearGradient id="realTrunkGrad" x1="0" y1="1" x2="0" y2="0">
                    <stop offset="0%" stopColor="#2c1e14" />
                    <stop offset="40%" stopColor="#4a3424" />
                    <stop offset="80%" stopColor="#6e4f37" />
                    <stop offset="100%" stopColor="#3d2a1d" />
                  </linearGradient>

                  {/* Branch Highlight Specular */}
                  <linearGradient id="branchHighlight" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#8b6849" />
                    <stop offset="100%" stopColor="#3d2a1d" />
                  </linearGradient>

                  {/* Realistic Layered Foliage Gradients */}
                  <linearGradient id="foliageDeep" x1="0.2" y1="1" x2="0.8" y2="0">
                    <stop offset="0%" stopColor="#064e3b" />
                    <stop offset="50%" stopColor="#047857" />
                    <stop offset="100%" stopColor="#065f46" />
                  </linearGradient>

                  <linearGradient id="foliageMid" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#059669" />
                    <stop offset="60%" stopColor="#10b981" />
                    <stop offset="100%" stopColor="#047857" />
                  </linearGradient>

                  <linearGradient id="foliageSunlit" x1="0.1" y1="0" x2="0.9" y2="1">
                    <stop offset="0%" stopColor="#34d399" />
                    <stop offset="50%" stopColor="#10b981" />
                    <stop offset="100%" stopColor="#059669" />
                  </linearGradient>

                  {/* Realistic Soft Shadow Filter */}
                  <filter id="softShadow" x="-20%" y="-20%" width="140%" height="140%">
                    <feDropShadow dx="0" dy="6" stdDeviation="5" floodColor="#000000" floodOpacity="0.2" />
                  </filter>

                  <filter id="foliageShadow" x="-20%" y="-20%" width="140%" height="140%">
                    <feDropShadow dx="0" dy="8" stdDeviation="6" floodColor="#022c22" floodOpacity="0.3" />
                  </filter>
                </defs>

                {/* Realistic Ground Shadow & Mound */}
                <motion.ellipse
                  cx="150" cy="275" rx="70" ry="8"
                  fill="#000000" opacity="0.15"
                  initial={{ scale: 0 }}
                  animate={step >= 3 ? { scale: 1 } : { scale: 0 }}
                  transition={{ duration: 0.6 }}
                />

                {/* 1. ORGANIC TRUNK & BRANCH REVEAL (2.0s - 3.1s) */}
                <g fill="none" strokeLinecap="round" filter="url(#softShadow)">
                  {/* Main Tapered Bark Trunk */}
                  <motion.path
                    d="M 150 275 C 150 230 147 180 144 140 T 142 80"
                    stroke="url(#realTrunkGrad)"
                    strokeWidth="9"
                    initial={{ pathLength: 0 }}
                    animate={step >= 3 ? { pathLength: 1 } : { pathLength: 0 }}
                    transition={{ duration: 1.1, ease: [0.25, 1, 0.5, 1] }}
                  />

                  {/* Lower Primary Left Branch */}
                  <motion.path
                    d="M 147 195 Q 128 175 102 155 T 75 140"
                    stroke="url(#branchHighlight)"
                    strokeWidth="5.5"
                    initial={{ pathLength: 0 }}
                    animate={step >= 3 ? { pathLength: 1 } : { pathLength: 0 }}
                    transition={{ duration: 0.85, delay: 0.35, ease: "easeOut" }}
                  />

                  {/* Lower Primary Right Branch */}
                  <motion.path
                    d="M 145 180 Q 168 162 195 145 T 222 130"
                    stroke="url(#branchHighlight)"
                    strokeWidth="5.5"
                    initial={{ pathLength: 0 }}
                    animate={step >= 3 ? { pathLength: 1 } : { pathLength: 0 }}
                    transition={{ duration: 0.85, delay: 0.45, ease: "easeOut" }}
                  />

                  {/* Mid Left Secondary Branch */}
                  <motion.path
                    d="M 144 150 Q 124 130 100 112 T 82 98"
                    stroke="url(#branchHighlight)"
                    strokeWidth="4"
                    initial={{ pathLength: 0 }}
                    animate={step >= 3 ? { pathLength: 1 } : { pathLength: 0 }}
                    transition={{ duration: 0.75, delay: 0.6 }}
                  />

                  {/* Mid Right Secondary Branch */}
                  <motion.path
                    d="M 143 138 Q 165 120 188 102 T 206 90"
                    stroke="url(#branchHighlight)"
                    strokeWidth="4"
                    initial={{ pathLength: 0 }}
                    animate={step >= 3 ? { pathLength: 1 } : { pathLength: 0 }}
                    transition={{ duration: 0.75, delay: 0.7 }}
                  />

                  {/* Upper Fine Twigs */}
                  <motion.path
                    d="M 142 110 Q 125 90 110 75"
                    stroke="url(#realTrunkGrad)"
                    strokeWidth="2.8"
                    initial={{ pathLength: 0 }}
                    animate={step >= 3 ? { pathLength: 1 } : { pathLength: 0 }}
                    transition={{ duration: 0.6, delay: 0.8 }}
                  />
                  <motion.path
                    d="M 142 98 Q 158 82 172 68"
                    stroke="url(#realTrunkGrad)"
                    strokeWidth="2.8"
                    initial={{ pathLength: 0 }}
                    animate={step >= 3 ? { pathLength: 1 } : { pathLength: 0 }}
                    transition={{ duration: 0.6, delay: 0.85 }}
                  />
                </g>

                {/* 2. REALISTIC IRREGULAR FOLIAGE CANOPY CLUSTERS (Unfurls 2.8s - 3.9s) */}
                <g filter="url(#foliageShadow)">
                  {/* Layer 1: Deep Interior Shadow Foliage (Backing) */}
                  <motion.path
                    d="M 60 145 Q 40 120 62 92 Q 90 70 125 85 Q 160 65 195 85 Q 225 110 205 140 Q 175 168 135 155 Q 90 170 60 145 Z"
                    fill="url(#foliageDeep)"
                    initial={{ scale: 0, opacity: 0 }}
                    animate={step >= 3 ? { scale: 1, opacity: 0.95 } : { scale: 0, opacity: 0 }}
                    transition={{ duration: 0.9, delay: 0.8, ease: [0.34, 1.3, 0.64, 1] }}
                    style={{ transformOrigin: "135px 125px" }}
                  />

                  {/* Layer 2: Mid-Level Left Foliage Cluster */}
                  <motion.path
                    d="M 45 130 C 32 105, 48 72, 80 82 C 92 62, 122 75, 112 105 C 100 130, 72 142, 45 130 Z"
                    fill="url(#foliageMid)"
                    initial={{ scale: 0, opacity: 0 }}
                    animate={step >= 3 ? { scale: 1, opacity: 0.95 } : { scale: 0, opacity: 0 }}
                    transition={{ duration: 0.95, delay: 0.95, ease: [0.34, 1.35, 0.64, 1] }}
                    style={{ transformOrigin: "78px 105px" }}
                  />

                  {/* Layer 3: Mid-Level Right Foliage Cluster */}
                  <motion.path
                    d="M 165 125 C 145 98, 178 65, 215 78 Q 238 95 225 125 C 208 145, 178 140, 165 125 Z"
                    fill="url(#foliageMid)"
                    initial={{ scale: 0, opacity: 0 }}
                    animate={step >= 3 ? { scale: 1, opacity: 0.95 } : { scale: 0, opacity: 0 }}
                    transition={{ duration: 0.95, delay: 1.1, ease: [0.34, 1.35, 0.64, 1] }}
                    style={{ transformOrigin: "195px 105px" }}
                  />

                  {/* Layer 4: Upper Sunlit Crown Canopy Cluster */}
                  <motion.path
                    d="M 90 85 C 72 52, 110 22, 142 34 C 168 15, 202 42, 185 75 C 170 95, 110 102, 90 85 Z"
                    fill="url(#foliageSunlit)"
                    initial={{ scale: 0, opacity: 0 }}
                    animate={step >= 3 ? { scale: 1, opacity: 0.98 } : { scale: 0, opacity: 0 }}
                    transition={{ duration: 1.0, delay: 1.25, ease: [0.34, 1.35, 0.64, 1] }}
                    style={{ transformOrigin: "140px 58px" }}
                  />

                  {/* Layer 5: Fine Leaf Group Accents & Depth Overlays */}
                  <motion.path
                    d="M 75 90 C 65 78, 82 62, 98 72 C 105 85, 88 98, 75 90 Z"
                    fill="url(#foliageSunlit)"
                    initial={{ scale: 0 }}
                    animate={step >= 3 ? { scale: 1 } : { scale: 0 }}
                    transition={{ duration: 0.6, delay: 1.45 }}
                    style={{ transformOrigin: "86px 80px" }}
                  />
                  <motion.path
                    d="M 180 82 C 170 70, 190 55, 205 66 C 212 80, 194 92, 180 82 Z"
                    fill="url(#foliageSunlit)"
                    initial={{ scale: 0 }}
                    animate={step >= 3 ? { scale: 1 } : { scale: 0 }}
                    transition={{ duration: 0.6, delay: 1.55 }}
                    style={{ transformOrigin: "192px 72px" }}
                  />
                  <motion.path
                    d="M 125 42 C 115 30, 132 18, 148 26 C 155 38, 138 48, 125 42 Z"
                    fill="url(#foliageSunlit)"
                    initial={{ scale: 0 }}
                    animate={step >= 3 ? { scale: 1 } : { scale: 0 }}
                    transition={{ duration: 0.6, delay: 1.65 }}
                    style={{ transformOrigin: "136px 32px" }}
                  />
                </g>
              </motion.svg>

              {/* STEP 2: REALISTIC MODERN CIVIC PUBLIC WASTE BIN (Appears at 1.0s in CENTER, stays in front) */}
              <motion.div
                className="relative z-10 w-32 h-36 sm:w-36 sm:h-40 flex flex-col items-center justify-center mt-16"
                initial={{ y: 30, opacity: 0, scale: 0.85 }}
                animate={step >= 2 ? { y: 0, opacity: 1, scale: 1 } : { y: 30, opacity: 0, scale: 0.85 }}
                transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
              >
                {/* Photorealistically Shaded Municipal Recycling Bin Vector SVG */}
                <svg viewBox="0 0 120 140" className="w-full h-full drop-shadow-2xl">
                  <defs>
                    {/* Coated Metal Body Texture & Shading */}
                    <linearGradient id="binBodyGradReal" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="var(--card)" />
                      <stop offset="35%" stopColor="var(--secondary)" />
                      <stop offset="70%" stopColor="var(--card)" />
                      <stop offset="100%" stopColor="var(--secondary)" />
                    </linearGradient>

                    {/* Heavy Metallic Lid Gradient */}
                    <linearGradient id="binLidGradReal" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="var(--primary)" />
                      <stop offset="50%" stopColor="var(--accent)" />
                      <stop offset="100%" stopColor="var(--primary)" />
                    </linearGradient>

                    {/* Specular Highlight Strip */}
                    <linearGradient id="specularHighlight" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#ffffff" stopOpacity="0.3" />
                      <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
                    </linearGradient>

                    <filter id="binShadowFilter" x="-30%" y="-30%" width="160%" height="160%">
                      <feDropShadow dx="0" dy="12" stdDeviation="8" floodColor="#000000" floodOpacity="0.25" />
                    </filter>
                  </defs>

                  {/* Realistic Ground Contact Shadow */}
                  <ellipse cx="60" cy="132" rx="44" ry="7" fill="#000000" opacity="0.28" filter="blur(3px)" />

                  {/* Tapered Main Bin Body */}
                  <path
                    d="M 22 42 L 30 122 C 31 127, 36 130, 42 130 L 78 130 C 84 130, 89 127, 90 122 L 98 42 Z"
                    fill="url(#binBodyGradReal)"
                    stroke="var(--border)"
                    strokeWidth="2.5"
                    filter="url(#binShadowFilter)"
                  />

                  {/* Surface Specular Light Reflection */}
                  <path
                    d="M 32 44 L 38 120 C 39 124, 42 126, 46 126 L 54 126 L 46 44 Z"
                    fill="url(#specularHighlight)"
                  />

                  {/* Vertical Structural Ribs */}
                  <line x1="44" y1="50" x2="47" y2="122" stroke="var(--border)" strokeWidth="1.8" opacity="0.6" />
                  <line x1="60" y1="50" x2="60" y2="122" stroke="var(--border)" strokeWidth="1.8" opacity="0.6" />
                  <line x1="76" y1="50" x2="73" y2="122" stroke="var(--border)" strokeWidth="1.8" opacity="0.6" />

                  {/* Civic Recycle Emblem */}
                  <g transform="translate(60, 86) scale(0.75)" opacity="0.9">
                    <circle cx="0" cy="0" r="18" fill="var(--primary)" opacity="0.15" />
                    <path
                      d="M -10 -8 L -4 -16 L 2 -8 L -2 -8 C 2 -2, 6 2, 10 2 M 12 0 L 16 8 L 8 10 L 10 6 C 4 6, -2 4, -6 0 M -8 8 L -14 0 L -8 -4 L -6 -1 C -2 3, 2 5, 8 4"
                      fill="none"
                      stroke="var(--primary)"
                      strokeWidth="2.8"
                      strokeLinecap="round"
                    />
                  </g>

                  {/* Heavy Duty Top Rim & Hinged Lid */}
                  <rect x="16" y="32" width="88" height="12" rx="5" fill="url(#binLidGradReal)" stroke="var(--border)" strokeWidth="1" />
                  <rect x="42" y="22" width="36" height="11" rx="4" fill="var(--primary)" stroke="var(--border)" strokeWidth="1" />
                  <rect x="48" y="24" width="24" height="3" rx="1.5" fill="#ffffff" opacity="0.3" />
                </svg>
              </motion.div>

            </div>

            {/* STEP 4: WASTESPHERE BRAND REVEAL (Appears after tree is formed at 4.0s) */}
            <div className="h-16 mt-4 flex flex-col items-center justify-center">
              {step >= 4 && (
                <motion.div
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  className="space-y-1 text-center"
                >
                  <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
                    Waste<span className="text-primary">Sphere</span>
                  </h1>
                  <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">
                    AI-Powered Civic Environmental Platform
                  </p>
                </motion.div>
              )}
            </div>

          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
