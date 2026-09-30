import React from 'react';
import { motion } from 'framer-motion';

export const MaskedHeading = ({
  prefix = 'Clean Cities, Powered by',
  highlight = 'AI & Civic Action',
  suffix = '.',
  className = ''
}) => {
  return (
    <div className={`relative overflow-hidden inline-block ${className}`}>
      <motion.h1
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-slate-100 leading-[1.15]"
      >
        {prefix}{' '}
        <motion.span
          initial={{ backgroundPosition: '0% 50%' }}
          animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
          className="inline-block masked-heading-text drop-shadow-[0_0_25px_rgba(16,185,129,0.3)]"
        >
          {highlight}
        </motion.span>
        {suffix}
      </motion.h1>
    </div>
  );
};
