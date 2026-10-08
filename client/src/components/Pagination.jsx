import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export const Pagination = ({ currentPage = 1, totalPages = 1, onPageChange }) => {
  if (totalPages <= 1) return null;

  const pages = [];
  for (let i = 1; i <= totalPages; i++) {
    if (
      i === 1 ||
      i === totalPages ||
      (i >= currentPage - 1 && i <= currentPage + 1)
    ) {
      pages.push(i);
    } else if (pages[pages.length - 1] !== '...') {
      pages.push('...');
    }
  }

  return (
    <div className="flex items-center justify-center gap-2 my-10">
      <button
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        aria-label="Previous page"
        className="p-2.5 rounded-lg bg-dark-card border border-dark-border text-white disabled:opacity-30 disabled:cursor-not-allowed hover:bg-brand-red transition-colors min-w-[38px] min-h-[38px] flex items-center justify-center"
      >
        <ChevronLeft size={16} />
      </button>

      {pages.map((p, idx) => (
        <button
          key={idx}
          disabled={p === '...'}
          onClick={() => typeof p === 'number' && onPageChange(p)}
          aria-label={p === '...' ? 'More pages' : `Go to page ${p}`}
          className={`px-3.5 py-1.5 rounded-lg font-bold text-xs transition-all min-w-[38px] min-h-[38px] flex items-center justify-center ${
            p === currentPage
              ? 'bg-brand-red text-white shadow-lg shadow-brand-red/30 scale-105'
              : p === '...'
              ? 'text-neutral-500 cursor-default'
              : 'bg-dark-card border border-dark-border text-white hover:bg-white/10'
          }`}
        >
          {p}
        </button>
      ))}

      <button
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        aria-label="Next page"
        className="p-2.5 rounded-lg bg-dark-card border border-dark-border text-white disabled:opacity-30 disabled:cursor-not-allowed hover:bg-brand-red transition-colors min-w-[38px] min-h-[38px] flex items-center justify-center"
      >
        <ChevronRight size={16} />
      </button>
    </div>
  );
};

export default Pagination;
