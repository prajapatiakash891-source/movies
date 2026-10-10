import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Play, Info, Star, ChevronLeft, ChevronRight } from 'lucide-react';
import Badge from './Badge';
import Modal from './Modal';
import { getOptimizedImageUrl } from '../utils/image';

export const Hero = ({ movies, movie }) => {
  const movieList = Array.isArray(movies) && movies.length > 0 ? movies : movie ? [movie] : [];
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showTrailer, setShowTrailer] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  // Auto slide every 5.5 seconds unless paused or trailer modal is open
  useEffect(() => {
    if (movieList.length <= 1 || isPaused || showTrailer) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % movieList.length);
    }, 5500);
    return () => clearInterval(timer);
  }, [movieList.length, isPaused, showTrailer]);

  if (movieList.length === 0) return null;

  const currentMovie = movieList[currentIndex] || movieList[0];
  const itemSlug = currentMovie.slug || 'featured-movie';
  const detailPath = currentMovie.type === 'series' ? `/series/${itemSlug}` : `/movie/${itemSlug}`;

  const nextSlide = () => setCurrentIndex((prev) => (prev + 1) % movieList.length);
  const prevSlide = () => setCurrentIndex((prev) => (prev - 1 + movieList.length) % movieList.length);

  return (
    <div
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className="relative w-full min-h-[75vh] md:min-h-[85vh] flex items-end pb-12 md:pb-20 overflow-hidden bg-black group"
    >
      {/* Background Images Slider */}
      {movieList.map((m, idx) => {
        const isCurrent = idx === currentIndex;
        const optimizedSrc = getOptimizedImageUrl(m.backdrop || m.poster, { width: 1600, quality: 75 });
        return (
          <div
            key={m._id || idx}
            className={`absolute inset-0 z-0 transition-opacity duration-1000 ease-in-out ${
              isCurrent ? 'opacity-100 scale-105 transition-transform duration-[6000ms]' : 'opacity-0 scale-100 pointer-events-none'
            }`}
          >
            <img
              src={optimizedSrc}
              alt={m.title || 'Movie Hero Backdrop'}
              width="1600"
              height="900"
              fetchpriority={isCurrent ? 'high' : 'low'}
              loading={isCurrent ? 'eager' : 'lazy'}
              decoding={isCurrent ? 'sync' : 'async'}
              className="w-full h-full object-cover object-center opacity-60"
            />
            {/* Dark Vignette Overlay for maximum readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#080808] via-[#080808]/60 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#080808] via-[#080808]/80 to-transparent w-full md:w-3/4" />
          </div>
        );
      })}

      {/* Hero Content Overlay */}
      <div className="relative z-10 max-w-[1920px] mx-auto px-4 sm:px-8 md:px-12 w-full flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="max-w-2xl space-y-4 md:space-y-6 animate-slide-up" key={currentIndex}>
          {/* Metadata Badges */}
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="quality">{currentMovie.quality || '4K Ultra HD'}</Badge>
            {currentMovie.industry && (
              <Badge variant="type" className="bg-purple-600/90 text-white font-bold border-none">
                {currentMovie.industry}
              </Badge>
            )}
            <span className="text-xs font-bold text-yellow-400 flex items-center gap-1 bg-yellow-500/10 px-2.5 py-1 rounded border border-yellow-500/20">
              <Star size={13} className="fill-yellow-400" /> {currentMovie.rating ? Number(currentMovie.rating).toFixed(1) : '9.0'}
            </span>
            <span className="text-xs text-neutral-300 font-semibold">{currentMovie.releaseYear}</span>
            {currentMovie.duration && <span className="text-xs text-neutral-400 font-medium">• {currentMovie.duration}</span>}
          </div>

          {/* Title */}
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-white tracking-tight leading-none drop-shadow-md">
            {currentMovie.title}
          </h1>

          {/* Genres */}
          {currentMovie.genres && (
            <div className="flex flex-wrap gap-2 text-xs text-brand-red font-bold uppercase tracking-wider">
              {currentMovie.genres.map((g) => (
                <span key={g} className="bg-brand-red/10 px-2.5 py-1 rounded border border-brand-red/20">
                  {g}
                </span>
              ))}
            </div>
          )}

          {/* Description */}
          <p className="text-neutral-300 text-sm md:text-base line-clamp-3 leading-relaxed drop-shadow">
            {currentMovie.description}
          </p>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <Link to={detailPath}>
              <button
                aria-label={`Watch ${currentMovie.title} now`}
                className="px-6 py-3 bg-brand-red hover:bg-brand-red-hover text-white rounded-xl font-bold text-sm flex items-center gap-2 shadow-glow transition-all hover:scale-105 min-h-[44px]"
              >
                <Play size={18} className="fill-white" /> Watch Now
              </button>
            </Link>

            {currentMovie.trailerUrl && (
              <button
                onClick={() => setShowTrailer(true)}
                aria-label={`Watch ${currentMovie.title} trailer`}
                className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl font-bold text-sm flex items-center gap-2 border border-white/10 backdrop-blur-md transition-all hover:scale-105 min-h-[44px]"
              >
                <Play size={18} /> Watch Trailer
              </button>
            )}

            <Link to={detailPath}>
              <button
                aria-label={`View details for ${currentMovie.title}`}
                className="px-5 py-3 bg-dark-card/80 hover:bg-dark-card text-neutral-300 hover:text-white rounded-xl font-medium text-sm flex items-center gap-2 border border-dark-border backdrop-blur-md transition-all min-h-[44px]"
              >
                <Info size={18} /> Details
              </button>
            </Link>
          </div>
        </div>

        {/* Carousel Navigation Controls & Slide Thumbnails */}
        {movieList.length > 1 && (
          <div className="flex flex-col items-end gap-3 z-20 flex-shrink-0">
            {/* Arrows */}
            <div className="flex items-center gap-2">
              <button
                onClick={prevSlide}
                aria-label="Previous slide"
                className="w-10 h-10 rounded-full bg-black/60 border border-white/20 hover:bg-brand-red text-white flex items-center justify-center backdrop-blur-md transition-all hover:scale-110 shadow-lg"
                title="Previous Slide"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                onClick={nextSlide}
                aria-label="Next slide"
                className="w-10 h-10 rounded-full bg-black/60 border border-white/20 hover:bg-brand-red text-white flex items-center justify-center backdrop-blur-md transition-all hover:scale-110 shadow-lg"
                title="Next Slide"
              >
                <ChevronRight size={20} />
              </button>
            </div>

            {/* Slide Indicators / Dots */}
            <div className="flex items-center gap-2 bg-black/40 px-3 py-1.5 rounded-full border border-white/10 backdrop-blur-md">
              {movieList.map((m, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  aria-label={`Go to slide ${idx + 1}: ${m.title}`}
                  className={`h-2 rounded-full transition-all ${
                    idx === currentIndex ? 'w-8 bg-brand-red' : 'w-2 bg-white/40 hover:bg-white/70'
                  }`}
                  title={m.title}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Trailer Modal */}
      {showTrailer && currentMovie.trailerUrl && (
        <Modal isOpen={showTrailer} onClose={() => setShowTrailer(false)} title={`${currentMovie.title} — Official Trailer`}>
          <div className="aspect-video w-full bg-black rounded-xl overflow-hidden">
            <iframe
              src={`${currentMovie.trailerUrl}?autoplay=1`}
              title={`${currentMovie.title} Trailer`}
              className="w-full h-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </Modal>
      )}
    </div>
  );
};

export default Hero;

