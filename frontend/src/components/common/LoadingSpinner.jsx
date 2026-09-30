import React from 'react';
import { Loader2 } from 'lucide-react';

export const LoadingSpinner = ({ label = 'Loading...', size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 gap-3 text-emerald-400">
      <Loader2 className={`animate-spin ${sizeClasses[size]}`} />
      {label && <p className="text-sm font-medium text-slate-300 animate-pulse">{label}</p>}
    </div>
  );
};
