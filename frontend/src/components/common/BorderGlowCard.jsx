import React from 'react';

export const BorderGlowCard = ({ children, className = '', glowOnHover = true, activeGlow = false }) => {
  return (
    <div
      className={`relative group rounded-2xl transition-all duration-300 ${
        activeGlow ? 'animate-border-glow' : ''
      } ${className}`}
    >
      {/* Background Glow Layer */}
      <div
        className={`absolute -inset-0.5 rounded-2xl bg-gradient-to-r from-emerald-500/30 via-emerald-400/20 to-teal-600/30 opacity-0 transition duration-500 blur-sm ${
          glowOnHover ? 'group-hover:opacity-100' : ''
        } ${activeGlow ? 'opacity-80' : ''}`}
      />

      {/* Main Card Content */}
      <div className="relative rounded-2xl bg-[#0B1F17]/80 backdrop-blur-md border border-emerald-500/20 p-6 h-full transition duration-300 group-hover:border-emerald-500/40">
        {children}
      </div>
    </div>
  );
};
