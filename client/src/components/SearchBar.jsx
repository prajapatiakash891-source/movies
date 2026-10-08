import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, Film, Star, Loader2 } from 'lucide-react';
import API from '../services/api';
import { getOptimizedImageUrl } from '../utils/image';

export const SearchBar = ({ placeholder = 'Search movies, series, cast or genres...' }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Debounced live search call
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await API.get(`/movies/search?q=${encodeURIComponent(query)}`);
        if (res.data.success) {
          setResults(res.data.data);
          setIsOpen(true);
        }
      } catch (err) {
        console.error('Search request failed', err);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  // Click outside listener to close dropdown
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      setIsOpen(false);
      navigate(`/movies?search=${encodeURIComponent(query.trim())}`);
    }
  };

  const handleSelectResult = (movie) => {
    setIsOpen(false);
    setQuery('');
    const path = movie.type === 'series' ? `/series/${movie.slug}` : `/movie/${movie.slug}`;
    navigate(path);
  };

  return (
    <div ref={dropdownRef} className="relative w-full max-w-xl">
      <form onSubmit={handleSearchSubmit} className="relative flex items-center">
        <label htmlFor="site-search-input" className="sr-only">
          Search movies, web series, cast or genres
        </label>
        <input
          id="site-search-input"
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query.trim() && results.length > 0 && setIsOpen(true)}
          placeholder={placeholder}
          aria-label="Search movies, series, cast or genres"
          className="w-full py-2.5 pl-10 pr-10 bg-dark-secondary/80 text-white placeholder-neutral-400 rounded-full border border-dark-border focus:border-brand-red focus:outline-none focus:ring-1 focus:ring-brand-red text-sm transition-all shadow-inner min-h-[42px]"
        />
        <Search size={18} className="absolute left-3.5 text-neutral-400 pointer-events-none" />

        {loading ? (
          <Loader2 size={16} className="absolute right-3.5 text-brand-red animate-spin" />
        ) : query ? (
          <button
            type="button"
            onClick={() => {
              setQuery('');
              setResults([]);
              setIsOpen(false);
            }}
            aria-label="Clear search query"
            className="absolute right-3.5 text-neutral-400 hover:text-white min-w-[28px] min-h-[28px] flex items-center justify-center"
          >
            <X size={16} />
          </button>
        ) : null}
      </form>

      {/* Search Suggestions Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-dark-secondary border border-dark-border rounded-xl shadow-2xl overflow-hidden z-50 max-h-96 overflow-y-auto animate-fade-in">
          {results.length > 0 ? (
            <div className="divide-y divide-dark-border">
              <div className="px-4 py-2 text-xs font-semibold text-muted bg-dark-card/50 uppercase tracking-wider">
                Matching Suggestions ({results.length})
              </div>
              {results.map((item) => (
                <div
                  key={item._id}
                  onClick={() => handleSelectResult(item)}
                  className="flex items-center gap-3 p-3 hover:bg-dark-card cursor-pointer transition-colors"
                >
                  <img
                    src={getOptimizedImageUrl(item.poster, { width: 100, quality: 75 })}
                    alt={item.title}
                    width="40"
                    height="56"
                    loading="lazy"
                    className="w-10 h-14 object-cover rounded shadow"
                  />
                  <div className="flex-1 min-w-0">
                    <span className="text-sm font-bold text-white truncate block hover:text-brand-red">
                      {item.title}
                    </span>
                    <div className="flex items-center gap-2 text-xs text-muted mt-1">
                      <span>{item.releaseYear}</span>
                      <span>•</span>
                      <span className="capitalize">{item.type}</span>
                      {item.languages && item.languages[0] && (
                        <>
                          <span>•</span>
                          <span>{item.languages[0]}</span>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-yellow-400 text-xs font-bold">
                    <Star size={12} className="fill-yellow-400" />
                    <span>{item.rating ? Number(item.rating).toFixed(1) : '8.0'}</span>
                  </div>
                </div>
              ))}
              <div
                onClick={handleSearchSubmit}
                className="p-3 text-center text-xs font-bold text-brand-red hover:bg-brand-red/10 cursor-pointer transition-colors"
              >
                View all results for "{query}" →
              </div>
            </div>
          ) : (
            <div className="p-6 text-center text-sm text-muted">
              <Film size={24} className="mx-auto mb-2 text-neutral-500" />
              No movies or series found matching "{query}"
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
