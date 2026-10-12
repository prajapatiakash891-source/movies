import React from 'react';
import LoadingSpinner from './LoadingSpinner';

export const PageLoader = () => {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#080808]/90 backdrop-blur-md">
      <div className="flex items-center gap-1 mb-4">
        <span className="text-2xl font-black tracking-wider text-white">MOVIES</span>
        <span className="text-2xl font-black tracking-wider text-brand-red">AURA</span>
      </div>
      <LoadingSpinner size="lg" />
      <p className="mt-4 text-xs text-neutral-400 font-medium tracking-widest uppercase animate-pulse">
        Loading Cinematic Experience...
      </p>
    </div>
  );
};

export default PageLoader;
