import React from 'react';
import { motion } from 'framer-motion';

export const BorderGlowCard = ({ children, className = '', glowOnHover = true, activeGlow = false, onClick }) => {
  return (
    <motion.div
      whileHover={glowOnHover ? { y: -2, transition: { duration: 0.2 } } : {}}
      onClick={onClick}
      className={`relative group rounded-2xl transition-all duration-300 ${
        activeGlow ? 'animate-border-glow' : ''
      } ${className}`}
    >
      {/* Background Glow Layer */}
      <div
        className={`absolute -inset-0.5 rounded-2xl bg-gradient-to-r from-primary/30 via-accent/20 to-primary/30 opacity-0 transition duration-500 blur-sm pointer-events-none ${
          glowOnHover ? 'group-hover:opacity-100' : ''
        } ${activeGlow ? 'opacity-80' : ''}`}
      />

      {/* Main Card Content */}
      <div className="relative rounded-2xl bg-card backdrop-blur-md border border-border p-6 h-full transition duration-300 group-hover:border-primary/50 shadow-md">
        {children}
      </div>
    </motion.div>
  );
};
