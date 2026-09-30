import React from 'react';
import { motion } from 'framer-motion';

export const MoodField = ({ children, className = '' }) => {
  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Background Mood Gradient Layers */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.15, 0.25, 0.15],
            x: ['-10%', '10%', '-10%'],
            y: ['-10%', '10%', '-10%']
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
          className="absolute -top-32 -left-32 w-[600px] h-[600px] rounded-full bg-emerald-600/20 blur-[130px]"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.1, 0.2, 0.1],
            x: ['10%', '-10%', '10%'],
            y: ['10%', '-10%', '10%']
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
          className="absolute -bottom-32 -right-32 w-[650px] h-[650px] rounded-full bg-emerald-500/15 blur-[150px]"
        />
        <div className="absolute inset-0 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:32px_32px] opacity-[0.04]" />
      </div>

      <div className="relative z-10">{children}</div>
    </div>
  );
};
