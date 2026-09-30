import React from 'react';
import { ShieldCheck, Award, Medal, Crown } from 'lucide-react';

export const BadgeIcon = ({ type = 'Bronze', size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-12 h-12 text-sm',
    lg: 'w-16 h-16 text-base',
    xl: 'w-24 h-24 text-lg'
  };

  const badgeStyles = {
    Bronze: {
      bg: 'bg-amber-950/40 border-amber-600/50 text-amber-400 shadow-[0_0_15px_rgba(217,119,6,0.2)]',
      icon: Award,
      label: 'Bronze Badge',
      range: '3–4 Complaints'
    },
    Silver: {
      bg: 'bg-slate-800/60 border-slate-300/50 text-slate-200 shadow-[0_0_15px_rgba(226,232,240,0.25)]',
      icon: Medal,
      label: 'Silver Badge',
      range: '5–9 Complaints'
    },
    Gold: {
      bg: 'bg-yellow-950/40 border-yellow-400/60 text-yellow-300 shadow-[0_0_20px_rgba(250,204,21,0.35)]',
      icon: Crown,
      label: 'Gold Badge',
      range: '10+ Complaints'
    },
    None: {
      bg: 'bg-emerald-950/20 border-emerald-800/30 text-slate-500',
      icon: ShieldCheck,
      label: 'No Medal Yet',
      range: '0–2 Complaints'
    }
  };

  const current = badgeStyles[type] || badgeStyles['None'];
  const IconComponent = current.icon;

  return (
    <div className={`flex flex-col items-center gap-1.5 ${className}`}>
      <div
        className={`flex items-center justify-center rounded-2xl border ${sizeClasses[size]} ${current.bg} transition-all duration-300 transform hover:scale-105`}
      >
        <IconComponent className="w-1/2 h-1/2" />
      </div>
      <span className="text-xs font-semibold text-slate-300">{current.label}</span>
    </div>
  );
};
