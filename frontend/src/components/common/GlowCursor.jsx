import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export const GlowCursor = () => {
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Disable on touch devices
    if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
      return;
    }

    const handleMouseMove = (e) => {
      setPosition({ x: e.clientX, y: e.clientY });
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <motion.div
      aria-hidden="true"
      className="fixed top-0 left-0 w-64 h-64 rounded-full pointer-events-none z-30 hidden md:block"
      style={{
        background: 'radial-gradient(circle, rgba(16, 185, 129, 0.12) 0%, rgba(5, 19, 14, 0) 70%)',
        transform: 'translate(-50%, -50%)',
        left: position.x,
        top: position.y
      }}
      transition={{ type: 'spring', damping: 30, stiffness: 250, mass: 0.5 }}
    />
  );
};
