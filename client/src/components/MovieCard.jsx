import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Play, Heart, Star, Info } from 'lucide-react';
import Badge from './Badge';
import { useAuth } from '../context/AuthContext';
import { getOptimizedImageUrl } from '../utils/image';

export const MovieCard = ({ movie, variant = 'standard' }) => {
  const navigate = useNavigate();
  const { user, isFavorite, toggleFavorite } = useAuth();

  if (!movie) return null;

  const itemSlug = movie.slug || `${movie.title?.toLowerCase().replace(/\s+/g, '-')}-${movie.releaseYear || 2026}`;
  const detailPath = movie.type === 'series' || movie.seasons ? `/series/${itemSlug}` : `/movie/${itemSlug}`;
  const fav = isFavorite(movie._id);
  const posterUrl = getOptimizedImageUrl(movie.poster, { width: 400, quality: 75 });

  const handleFavoriteClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      navigate('/login');
      return;
    }
    await toggleFavorite(movie._id);
  };

  return (
    <div className="group relative bg-dark-card rounded-xl overflow-hidden border border-dark-border transition-all duration-300 hover:-translate-y-1.5 hover:shadow-glow flex flex-col h-full">
      {/* Poster Container */}
      <div className="relative aspect-[2/3] w-full overflow-hidden bg-neutral-900">
        <img
          src={posterUrl}
          alt={movie.title || 'Movie Poster'}
          width="400"
          height="600"
          loading="lazy"
          decoding="async"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Quality, Industry & Type Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5 z-10">
          {movie.quality && <Badge variant="quality">{movie.quality}</Badge>}
          {movie.industry && (
            <Badge variant="type" className="bg-purple-600/90 text-white font-bold border-none">
              {movie.industry}
            </Badge>
          )}
          <Badge variant="type" className="capitalize">
            {movie.type === 'series' ? 'Web Series' : 'Movie'}
          </Badge>
        </div>

        {/* Favorite Heart Button */}
        <button
          onClick={handleFavoriteClick}
          aria-label={fav ? `Remove ${movie.title} from favorites` : `Add ${movie.title} to favorites`}
          title={fav ? 'Remove from favorites' : 'Add to favorites'}
          className={`absolute top-2.5 right-2.5 z-20 p-2.5 min-w-[36px] min-h-[36px] flex items-center justify-center rounded-full backdrop-blur-md transition-all ${
            fav
              ? 'bg-brand-red text-white scale-110 shadow-lg'
              : 'bg-black/40 text-white/80 hover:bg-brand-red hover:text-white hover:scale-110'
          }`}
        >
          <Heart size={16} className={fav ? 'fill-white' : ''} />
        </button>

        {/* Dark Hover Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4 z-10">
          <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 flex flex-col gap-2">
            <Link to={detailPath}>
              <button
                aria-label={`Watch ${movie.title}`}
                className="w-full py-2 px-3 bg-brand-red hover:bg-brand-red-hover text-white rounded-lg font-semibold text-xs flex items-center justify-center gap-1.5 shadow-md transition-colors min-h-[36px]"
              >
                <Play size={14} className="fill-white" /> Watch Now
              </button>
            </Link>
            <Link to={detailPath}>
              <button
                aria-label={`More details for ${movie.title}`}
                className="w-full py-1.5 px-3 bg-white/20 hover:bg-white/30 text-white rounded-lg font-medium text-xs flex items-center justify-center gap-1.5 backdrop-blur-sm transition-colors min-h-[36px]"
              >
                <Info size={14} /> More Details
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* Content Info */}
      <div className="p-3.5 flex flex-col justify-between flex-1 bg-dark-card">
        <div>
          <Link to={detailPath} className="hover:text-brand-red transition-colors line-clamp-1 font-bold text-sm text-white">
            {movie.title}
          </Link>

          <div className="flex items-center justify-between text-xs text-muted mt-1.5">
            <span>{movie.releaseYear}</span>
            {movie.languages && movie.languages.length > 0 && (
              <span className="truncate max-w-[90px] text-right font-medium text-neutral-300">
                {movie.languages[0]}
              </span>
            )}
          </div>
        </div>

        {/* Rating Footer */}
        <div className="flex items-center justify-between pt-2.5 mt-2 border-t border-white/5 text-xs">
          <div className="flex items-center gap-1 text-yellow-400 font-bold">
            <Star size={13} className="fill-yellow-400" />
            <span>{movie.rating ? Number(movie.rating).toFixed(1) : '8.0'}</span>
          </div>
          <span className="text-neutral-300 text-[11px] font-medium">{movie.duration || '2h'}</span>
        </div>
      </div>
    </div>
  );
};

export default MovieCard;
