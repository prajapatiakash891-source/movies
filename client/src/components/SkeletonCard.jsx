import React from 'react';

export const SkeletonCard = () => {
  return (
    <div className="bg-dark-card rounded-xl overflow-hidden border border-dark-border animate-pulse flex flex-col h-full">
      <div className="aspect-[2/3] bg-neutral-800/60 w-full relative">
        <div className="absolute top-3 left-3 w-12 h-5 bg-neutral-700/80 rounded" />
      </div>
      <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
        <div className="space-y-2">
          <div className="h-4 bg-neutral-800 rounded w-3/4" />
          <div className="h-3 bg-neutral-800/60 rounded w-1/2" />
        </div>
        <div className="flex justify-between items-center pt-2">
          <div className="h-3 bg-neutral-800 rounded w-1/4" />
          <div className="h-3 bg-neutral-800 rounded w-1/4" />
        </div>
      </div>
    </div>
  );
};

export const SkeletonGrid = ({ count = 8 }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
      {[...Array(count)].map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
};

export default SkeletonCard;
