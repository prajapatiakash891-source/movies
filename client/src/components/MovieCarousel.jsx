import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import MovieCard from './MovieCard';

export const MovieCarousel = ({ title, subtitle, movies = [] }) => {
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollAmount = clientWidth * 0.75;
      scrollRef.current.scrollTo({
        left: direction === 'left' ? scrollLeft - scrollAmount : scrollLeft + scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  if (!movies || movies.length === 0) return null;

  return (
    <div className="relative my-8">
      {/* Header */}
      <div className="flex items-end justify-between mb-4">
        <div>
          <h2 className="text-xl md:text-2xl font-extrabold text-white flex items-center gap-2">
            <span className="w-1.5 h-6 bg-brand-red rounded-full"></span>
            {title}
          </h2>
          {subtitle && <p className="text-xs text-muted mt-1">{subtitle}</p>}
        </div>

        {/* Arrow Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => scroll('left')}
            aria-label={`Scroll ${title} left`}
            className="p-2 rounded-full bg-dark-card border border-dark-border text-white/80 hover:text-white hover:bg-brand-red transition-colors min-w-[36px] min-h-[36px] flex items-center justify-center"
            title="Scroll Left"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            onClick={() => scroll('right')}
            aria-label={`Scroll ${title} right`}
            className="p-2 rounded-full bg-dark-card border border-dark-border text-white/80 hover:text-white hover:bg-brand-red transition-colors min-w-[36px] min-h-[36px] flex items-center justify-center"
            title="Scroll Right"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      {/* Carousel Track */}
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto no-scrollbar scroll-smooth py-2 px-1"
      >
        {movies.map((movie) => (
          <div key={movie._id || movie.slug} className="flex-none w-[170px] sm:w-[190px] md:w-[210px]">
            <MovieCard movie={movie} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default MovieCarousel;
