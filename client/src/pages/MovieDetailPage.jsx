import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Play, Heart, Star, Calendar, Clock, Film, ExternalLink, Send, Trash2, Download } from 'lucide-react';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import Badge from '../components/Badge';
import Rating from '../components/Rating';
import MovieCarousel from '../components/MovieCarousel';
import Modal from '../components/Modal';
import SEO from '../components/SEO';
import PageLoader from '../components/PageLoader';
import { getOptimizedImageUrl } from '../utils/image';

export const MovieDetailPage = () => {
  const { slug } = useParams();
  const { user, isFavorite, toggleFavorite } = useAuth();
  const [movie, setMovie] = useState(null);
  const [related, setRelated] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showTrailer, setShowTrailer] = useState(false);

  // Review form state
  const [userRating, setUserRating] = useState(9);
  const [userComment, setUserComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    const fetchMovieData = async () => {
      setLoading(true);
      try {
        const res = await API.get(`/movies/${slug}`);
        if (res.data.success) {
          setMovie(res.data.data);
          setRelated(res.data.related || []);

          // Fetch reviews for this movie
          if (res.data.data._id) {
            const revRes = await API.get(`/reviews/${res.data.data._id}`);
            if (revRes.data.success) {
              setReviews(revRes.data.data);
            }
          }
        }
      } catch (err) {
        console.error('Error loading movie details', err);
      } finally {
        setLoading(false);
      }
    };
    fetchMovieData();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [slug]);

  const handlePostReview = async (e) => {
    e.preventDefault();
    if (!userComment.trim()) return;

    setSubmittingReview(true);
    try {
      const res = await API.post('/reviews', {
        movieId: movie._id,
        onModel: 'Movie',
        rating: userRating,
        comment: userComment,
      });
      if (res.data.success) {
        setUserComment('');
        // Refresh reviews list
        const revRes = await API.get(`/reviews/${movie._id}`);
        if (revRes.data.success) {
          setReviews(revRes.data.data);
        }
      }
    } catch (err) {
      console.error('Failed to submit review', err);
    } finally {
      setSubmittingReview(false);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    try {
      await API.delete(`/reviews/${reviewId}`);
      setReviews((prev) => prev.filter((r) => r._id !== reviewId));
    } catch (err) {
      console.error('Failed to delete review', err);
    }
  };

  if (loading) return <PageLoader />;
  if (!movie) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-4">
        <Film size={48} className="text-brand-red mb-4" />
        <h2 className="text-2xl font-bold text-white mb-2">Movie Not Found</h2>
        <p className="text-muted text-sm max-w-md mb-6">
          The requested movie could not be located on AakashMovies.
        </p>
        <Link to="/movies" className="px-5 py-2.5 bg-brand-red text-white font-bold rounded-xl shadow-glow">
          Back to Movies
        </Link>
      </div>
    );
  }

  const fav = isFavorite(movie._id);
  const backdropUrl = getOptimizedImageUrl(movie.backdrop || movie.poster, { width: 1600, quality: 75 });
  const posterUrl = getOptimizedImageUrl(movie.poster, { width: 400, quality: 75 });

  return (
    <>
      <SEO
        title={`${movie.title} (${movie.releaseYear})`}
        description={`Watch information, cast, genres, trailer and official availability for ${movie.title} on AakashMovies.`}
        image={posterUrl}
      />

      {/* Hero Backdrop Section */}
      <div className="relative w-full min-h-[60vh] md:min-h-[70vh] flex items-end pb-8 bg-black overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src={backdropUrl}
            alt={movie.title}
            width="1600"
            height="900"
            fetchpriority="high"
            decoding="sync"
            className="w-full h-full object-cover object-center opacity-40 scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#080808] via-[#080808]/70 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#080808] via-[#080808]/80 to-transparent w-full md:w-2/3" />
        </div>

        {/* Content Container */}
        <div className="relative z-10 max-w-[1920px] mx-auto px-4 sm:px-8 md:px-12 w-full pt-12">
          <div className="flex flex-col md:flex-row gap-8 items-center md:items-end">
            {/* Poster Card */}
            <div className="w-48 sm:w-56 md:w-64 flex-none rounded-2xl overflow-hidden border-2 border-white/10 shadow-2xl bg-neutral-900 aspect-[2/3]">
              <img
                src={posterUrl}
                alt={movie.title}
                width="400"
                height="600"
                loading="eager"
                decoding="async"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Info details */}
            <div className="flex-1 space-y-4 text-center md:text-left">
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
                <Badge variant="quality">{movie.quality || '1080p Full HD'}</Badge>
                {movie.languages &&
                  movie.languages.map((l) => (
                    <Badge key={l} variant="language">
                      {l}
                    </Badge>
                  ))}
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight">
                {movie.title}
              </h1>

              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-xs font-semibold text-neutral-300">
                <div className="flex items-center gap-1.5 text-yellow-400 font-bold bg-yellow-500/10 px-2.5 py-1 rounded-lg border border-yellow-500/20">
                  <Star size={15} className="fill-yellow-400" />
                  <span>{movie.rating ? Number(movie.rating).toFixed(1) : '8.5'} / 10</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Calendar size={14} className="text-brand-red" />
                  <span>{movie.releaseYear}</span>
                </div>
                {movie.duration && (
                  <div className="flex items-center gap-1.5">
                    <Clock size={14} className="text-brand-red" />
                    <span>{movie.duration}</span>
                  </div>
                )}
              </div>

              {movie.genres && (
                <div className="flex flex-wrap justify-center md:justify-start gap-2 pt-1">
                  {movie.genres.map((g) => (
                    <Link key={g} to={`/category/${g.toLowerCase()}`}>
                      <span className="text-xs bg-white/10 hover:bg-brand-red text-white px-3 py-1 rounded-full border border-white/10 transition-colors">
                        {g}
                      </span>
                    </Link>
                  ))}
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 pt-3">
                {movie.watchUrl ? (
                  <a href={movie.watchUrl} target="_blank" rel="noopener noreferrer">
                    <button
                      aria-label="Watch on official source"
                      className="px-6 py-3 bg-brand-red hover:bg-brand-red-hover text-white rounded-xl font-bold text-sm flex items-center gap-2 shadow-glow transition-all hover:scale-105 min-h-[44px]"
                    >
                      <Play size={18} className="fill-white" /> Watch on Official Source <ExternalLink size={14} />
                    </button>
                  </a>
                ) : (
                  <button
                    onClick={() => setShowTrailer(true)}
                    aria-label="Play trailer"
                    className="px-6 py-3 bg-brand-red hover:bg-brand-red-hover text-white rounded-xl font-bold text-sm flex items-center gap-2 shadow-glow transition-all hover:scale-105 min-h-[44px]"
                  >
                    <Play size={18} className="fill-white" /> Play Trailer
                  </button>
                )}

                {movie.trailerUrl && (
                  <button
                    onClick={() => setShowTrailer(true)}
                    aria-label="Watch trailer"
                    className="px-5 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl font-semibold text-sm flex items-center gap-2 border border-white/10 backdrop-blur-md transition-all min-h-[44px]"
                  >
                    <Play size={16} /> Trailer
                  </button>
                )}

                {movie.downloadUrl ? (
                  <a href={movie.downloadUrl} target="_blank" rel="noopener noreferrer" download>
                    <button
                      aria-label="Download movie"
                      className="px-5 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-sm flex items-center gap-2 border border-emerald-500/30 backdrop-blur-md transition-all shadow-glow hover:scale-105 min-h-[44px]"
                    >
                      <Download size={16} /> Download
                    </button>
                  </a>
                ) : (
                  <button
                    disabled
                    aria-label="Download unavailable"
                    title="Download URL not available"
                    className="px-5 py-3 bg-white/5 text-neutral-500 rounded-xl font-semibold text-sm flex items-center gap-2 border border-white/10 cursor-not-allowed opacity-60 min-h-[44px]"
                  >
                    <Download size={16} /> Download
                  </button>
                )}

                <button
                  onClick={() => toggleFavorite(movie._id)}
                  aria-label={fav ? 'Remove from favorites' : 'Add to favorites'}
                  className={`p-3 rounded-xl border backdrop-blur-md transition-all min-w-[44px] min-h-[44px] flex items-center justify-center ${
                    fav
                      ? 'bg-brand-red border-brand-red text-white'
                      : 'bg-dark-card border-dark-border text-neutral-300 hover:text-white hover:border-brand-red'
                  }`}
                  title="Toggle Favorite"
                >
                  <Heart size={18} className={fav ? 'fill-white' : ''} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Details Body */}
      <div className="max-w-[1920px] mx-auto px-4 sm:px-8 md:px-12 py-12 space-y-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left 2 Cols: Synopsis, Cast, Director */}
          <div className="lg:col-span-2 space-y-8">
            {/* Story Synopsis */}
            <div className="glass-panel p-6 rounded-2xl border border-dark-border space-y-3">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <span className="w-1.5 h-5 bg-brand-red rounded-full"></span>
                Storyline Overview
              </h2>
              <p className="text-neutral-300 text-sm leading-relaxed">{movie.description}</p>
            </div>

            {/* Cast & Crew */}
            <div className="glass-panel p-6 rounded-2xl border border-dark-border space-y-4">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <span className="w-1.5 h-5 bg-brand-red rounded-full"></span>
                Cast & Filmmakers
              </h2>
              {movie.director && (
                <div className="text-xs">
                  <span className="text-muted uppercase font-bold tracking-wider">Director: </span>
                  <span className="text-white font-semibold ml-2">{movie.director}</span>
                </div>
              )}
              {movie.cast && movie.cast.length > 0 && (
                <div>
                  <span className="text-xs text-muted uppercase font-bold tracking-wider block mb-2">
                    Starring Cast:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {movie.cast.map((actor) => (
                      <span key={actor} className="px-3 py-1.5 bg-dark-card rounded-lg border border-dark-border text-xs text-neutral-200 font-medium">
                        {actor}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* User Ratings & Reviews Section */}
            <div className="glass-panel p-6 rounded-2xl border border-dark-border space-y-6">
              <div className="flex items-center justify-between border-b border-white/5 pb-4">
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <span className="w-1.5 h-5 bg-brand-red rounded-full"></span>
                  User Ratings & Reviews ({reviews.length})
                </h2>
              </div>

              {/* Add Review Form */}
              {user ? (
                <form onSubmit={handlePostReview} className="space-y-4 bg-dark-card/60 p-4 rounded-xl border border-dark-border">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white">Leave Your Review</span>
                    <Rating value={userRating} max={10} interactive onChange={(val) => setUserRating(val)} />
                  </div>
                  <label htmlFor="user-review-input" className="sr-only">Your Review Comment</label>
                  <textarea
                    id="user-review-input"
                    rows={3}
                    value={userComment}
                    onChange={(e) => setUserComment(e.target.value)}
                    placeholder="Share your thoughts about this movie..."
                    aria-label="Share your thoughts about this movie"
                    className="w-full bg-dark-secondary text-white text-xs p-3 rounded-lg border border-dark-border focus:border-brand-red focus:outline-none"
                    required
                  />
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={submittingReview}
                      aria-label="Submit review"
                      className="px-4 py-2 bg-brand-red hover:bg-brand-red-hover text-white text-xs font-bold rounded-lg flex items-center gap-1.5 transition-colors disabled:opacity-50 min-h-[38px]"
                    >
                      <Send size={13} /> Submit Review
                    </button>
                  </div>
                </form>
              ) : (
                <div className="p-4 bg-dark-card/40 rounded-xl text-center text-xs text-muted">
                  Please <Link to="/login" className="text-brand-red font-bold underline">login</Link> to post your review and rate this movie.
                </div>
              )}

              {/* Reviews List */}
              <div className="space-y-4 pt-2">
                {reviews.length > 0 ? (
                  reviews.map((rev) => (
                    <div key={rev._id} className="p-4 bg-dark-card rounded-xl border border-dark-border space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <img
                            src={getOptimizedImageUrl(rev.user?.avatar, { width: 100, quality: 75 }) || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'}
                            alt={rev.user?.name || 'Reviewer avatar'}
                            width="28"
                            height="28"
                            loading="lazy"
                            className="w-7 h-7 rounded-full object-cover"
                          />
                          <span className="text-xs font-bold text-white">{rev.user?.name || 'Anonymous User'}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <Rating value={rev.rating} max={10} size={12} />
                          {(user?._id === rev.user?._id || user?.role === 'admin') && (
                            <button
                              onClick={() => handleDeleteReview(rev._id)}
                              aria-label="Delete review"
                              className="text-neutral-400 hover:text-red-400 transition-colors p-1"
                              title="Delete Review"
                            >
                              <Trash2 size={14} />
                            </button>
                          )}
                        </div>
                      </div>
                      <p className="text-xs text-neutral-300 leading-relaxed pl-9">{rev.comment}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-muted text-center py-4">No reviews yet. Be the first to rate this movie!</p>
                )}
              </div>
            </div>
          </div>

          {/* Right Sidebar: Availability & Legal Streaming Info */}
          <div className="space-y-6">
            <div className="glass-panel p-6 rounded-2xl border border-dark-border space-y-4">
              <h2 className="text-sm font-bold text-white uppercase tracking-wider border-l-2 border-brand-red pl-2">
                Official Availability
              </h2>
              <p className="text-xs text-muted">
                Licensed streaming platforms where you can watch this title legally:
              </p>
              <div className="space-y-2">
                {movie.watchUrl ? (
                  <a
                    href={movie.watchUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-3 bg-dark-card hover:bg-brand-red/20 rounded-xl border border-dark-border text-xs text-white transition-colors"
                  >
                    <span className="font-semibold">Stream Official HD Source</span>
                    <ExternalLink size={14} className="text-brand-red" />
                  </a>
                ) : (
                  <div className="p-3 bg-dark-card rounded-xl border border-dark-border text-xs text-neutral-400">
                    Currently available in theatres / upcoming on OTT
                  </div>
                )}
                {movie.downloadUrl && (
                  <a
                    href={movie.downloadUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    download
                    className="flex items-center justify-between p-3 bg-dark-card hover:bg-emerald-600/20 rounded-xl border border-dark-border text-xs text-white transition-colors"
                  >
                    <span className="font-semibold text-emerald-400 flex items-center gap-2">
                      <Download size={14} /> Download Media Source
                    </span>
                    <ExternalLink size={14} className="text-emerald-400" />
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Related Content Carousel */}
        {related.length > 0 && (
          <MovieCarousel title="You Might Also Like" subtitle="More titles in the same genre or language" movies={related} />
        )}
      </div>

      {/* Trailer Modal Player */}
      {showTrailer && movie.trailerUrl && (
        <Modal isOpen={showTrailer} onClose={() => setShowTrailer(false)} title={`${movie.title} — Official Trailer`}>
          <div className="aspect-video w-full bg-black rounded-xl overflow-hidden">
            <iframe
              src={`${movie.trailerUrl}?autoplay=1`}
              title={`${movie.title} Trailer`}
              className="w-full h-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </Modal>
      )}
    </>
  );
};

export default MovieDetailPage;
