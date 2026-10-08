import React from 'react';

export const Badge = ({ children, variant = 'default', className = '' }) => {
  const baseStyles = 'inline-flex items-center px-2.5 py-0.5 rounded text-xs font-semibold tracking-wide';
  
  const variants = {
    default: 'bg-white/10 text-white border border-white/10',
    quality: 'bg-brand-red/90 text-white shadow-sm font-bold',
    rating: 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30',
    language: 'bg-blue-500/20 text-blue-400 border border-blue-500/30',
    type: 'bg-purple-500/20 text-purple-300 border border-purple-500/30',
  };

  return (
    <span className={`${baseStyles} ${variants[variant] || variants.default} ${className}`}>
      {children}
    </span>
  );
};

export default Badge;
