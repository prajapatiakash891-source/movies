import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Play, Heart, Star, Calendar, Tv, ExternalLink, Film, Download } from 'lucide-react';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import Badge from '../components/Badge';
import MovieCarousel from '../components/MovieCarousel';
import Modal from '../components/Modal';
import SEO from '../components/SEO';
import PageLoader from '../components/PageLoader';
import { getOptimizedImageUrl } from '../utils/image';

export const SeriesDetailPage = () => {
  const { slug, seasonNum, episodeNum } = useParams();
  const { isFavorite, toggleFavorite } = useAuth();
  const [series, setSeries] = useState(null);
  const [related, setRelated] = useState([]);
  const [activeSeason, setActiveSeason] = useState(1);
  const [activeEpisode, setActiveEpisode] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showTrailer, setShowTrailer] = useState(false);

  useEffect(() => {
    const fetchSeriesData = async () => {
      setLoading(true);
      try {
        const res = await API.get(`/series/${slug}`);
        if (res.data.success) {
          const sData = res.data.data;
          setSeries(sData);
          setRelated(res.data.related || []);

          if (sData.seasons && sData.seasons.length > 0) {
            const selectedSeason = seasonNum ? parseInt(seasonNum, 10) : sData.seasons[0].seasonNumber;
            setActiveSeason(selectedSeason);

            const sObj = sData.seasons.find((s) => s.seasonNumber === selectedSeason) || sData.seasons[0];
            if (sObj && sObj.episodes && sObj.episodes.length > 0) {
              const selectedEp = episodeNum ? parseInt(episodeNum, 10) : sObj.episodes[0].episodeNumber;
              const epObj = sObj.episodes.find((e) => e.episodeNumber === selectedEp) || sObj.episodes[0];
              setActiveEpisode(epObj);
            }
          }
        }
      } catch (err) {
        console.error('Error loading web series details', err);
      } finally {
        setLoading(false);
      }
    };
    fetchSeriesData();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [slug, seasonNum, episodeNum]);

  if (loading) return <PageLoader />;
  if (!series) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-4">
        <Film size={48} className="text-brand-red mb-4" />
        <h2 className="text-2xl font-bold text-white mb-2">Web Series Not Found</h2>
        <Link to="/web-series" className="px-5 py-2.5 bg-brand-red text-white font-bold rounded-xl shadow-glow">
          Back to Web Series
        </Link>
      </div>
    );
  }

  const currentSeasonData = series.seasons
    ? series.seasons.find((s) => s.seasonNumber === activeSeason) || series.seasons[0]
    : null;

  const fav = isFavorite(series._id);
  const backdropUrl = getOptimizedImageUrl(series.backdrop || series.poster, { width: 1600, quality: 75 });
  const posterUrl = getOptimizedImageUrl(series.poster, { width: 400, quality: 75 });

  return (
    <>
      <SEO
        title={`${series.title} — Watch Seasons & Episodes`}
        description={`Stream all seasons and episodes of ${series.title} on AakashMovies.`}
        image={posterUrl}
      />

      {/* Hero Backdrop */}
      <div className="relative w-full min-h-[60vh] flex items-end pb-8 bg-black overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src={backdropUrl}
            alt={series.title}
            width="1600"
            height="900"
            fetchpriority="high"
            decoding="sync"
            className="w-full h-full object-cover opacity-40 scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#080808] via-[#080808]/70 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#080808] via-[#080808]/80 to-transparent w-full md:w-2/3" />
        </div>

        <div className="relative z-10 max-w-[1920px] mx-auto px-4 sm:px-8 md:px-12 w-full pt-12">
          <div className="flex flex-col md:flex-row gap-8 items-center md:items-end">
            <div className="w-48 sm:w-56 md:w-64 flex-none rounded-2xl overflow-hidden border-2 border-white/10 shadow-2xl bg-neutral-900 aspect-[2/3]">
              <img
                src={posterUrl}
                alt={series.title}
                width="400"
                height="600"
                loading="eager"
                decoding="async"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="flex-1 space-y-4 text-center md:text-left">
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
                <Badge variant="type">WEB SERIES</Badge>
                <Badge variant="quality">{series.quality || '4K Ultra HD'}</Badge>
                {series.languages && series.languages.map((l) => <Badge key={l} variant="language">{l}</Badge>)}
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight">
                {series.title}
              </h1>

              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-xs font-semibold text-neutral-300">
                <div className="flex items-center gap-1.5 text-yellow-400 font-bold bg-yellow-500/10 px-2.5 py-1 rounded-lg border border-yellow-500/20">
                  <Star size={15} className="fill-yellow-400" />
                  <span>{series.rating ? Number(series.rating).toFixed(1) : '9.0'}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Calendar size={14} className="text-brand-red" />
                  <span>{series.releaseYear}</span>
                </div>
                <div className="flex items-center gap-1.5 text-brand-red font-bold">
                  <Tv size={14} />
                  <span>{series.seasonsCount || (series.seasons ? series.seasons.length : 1)} Seasons</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 pt-3">
                {series.trailerUrl && (
                  <button
                    onClick={() => setShowTrailer(true)}
                    aria-label="Watch series trailer"
                    className="px-6 py-3 bg-brand-red hover:bg-brand-red-hover text-white rounded-xl font-bold text-sm flex items-center gap-2 shadow-glow transition-all min-h-[44px]"
                  >
                    <Play size={18} className="fill-white" /> Watch Trailer
                  </button>
                )}
                {series.downloadUrl ? (
                  <a href={series.downloadUrl} target="_blank" rel="noopener noreferrer" download>
                    <button
                      aria-label="Download series"
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
                  onClick={() => toggleFavorite(series._id)}
                  aria-label={fav ? 'Remove from favorites' : 'Add to favorites'}
                  className={`p-3 rounded-xl border backdrop-blur-md transition-all min-w-[44px] min-h-[44px] flex items-center justify-center ${
                    fav
                      ? 'bg-brand-red border-brand-red text-white'
                      : 'bg-dark-card border-dark-border text-neutral-300 hover:text-white hover:border-brand-red'
                  }`}
                >
                  <Heart size={18} className={fav ? 'fill-white' : ''} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Seasons & Episodes Selector Section */}
      <div className="max-w-[1920px] mx-auto px-4 sm:px-8 md:px-12 py-12 space-y-12">
        <div className="glass-panel p-6 rounded-2xl border border-dark-border space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-4">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <span className="w-1.5 h-6 bg-brand-red rounded-full"></span>
              Seasons & Episodes
            </h2>

            {/* Season Selector Tabs */}
            {series.seasons && series.seasons.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {series.seasons.map((s) => (
                  <button
                    key={s.seasonNumber}
                    onClick={() => {
                      setActiveSeason(s.seasonNumber);
                      if (s.episodes && s.episodes.length > 0) {
                        setActiveEpisode(s.episodes[0]);
                      }
                    }}
                    aria-label={`Select Season ${s.seasonNumber}`}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all min-h-[38px] ${
                      activeSeason === s.seasonNumber
                        ? 'bg-brand-red text-white shadow-lg'
                        : 'bg-dark-card border border-dark-border text-neutral-300 hover:text-white'
                    }`}
                  >
                    Season {s.seasonNumber}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Episodes List */}
          {currentSeasonData && currentSeasonData.episodes ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {currentSeasonData.episodes.map((ep) => {
                const isSelected = activeEpisode?.episodeNumber === ep.episodeNumber;
                return (
                  <div
                    key={ep.episodeNumber}
                    onClick={() => setActiveEpisode(ep)}
                    className={`p-4 rounded-xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-brand-red/10 border-brand-red shadow-glow'
                        : 'bg-dark-card border-dark-border hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-brand-red/20 text-brand-red text-xs font-black flex items-center justify-center">
                          {ep.episodeNumber}
                        </span>
                        <h3 className="text-sm font-bold text-white line-clamp-1">{ep.title}</h3>
                      </div>
                      <span className="text-xs text-neutral-300 font-medium">{ep.duration}</span>
                    </div>
                    <p className="text-xs text-muted line-clamp-2 mb-3">{ep.description || 'Watch episode details...'}</p>
                    {(ep.watchUrl || ep.downloadUrl) && (
                      <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-white/5">
                        {ep.watchUrl && (
                          <a
                            href={ep.watchUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            aria-label={`Watch Episode ${ep.episodeNumber}`}
                            className="px-3 py-1.5 bg-brand-red/90 hover:bg-brand-red text-white text-[11px] font-bold rounded-lg flex items-center gap-1.5 transition-colors shadow-sm min-h-[32px]"
                          >
                            <Play size={11} className="fill-white" /> Watch Ep {ep.episodeNumber}
                          </a>
                        )}
                        {ep.downloadUrl && (
                          <a
                            href={ep.downloadUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            download
                            onClick={(e) => e.stopPropagation()}
                            aria-label={`Download Episode ${ep.episodeNumber}`}
                            className="px-3 py-1.5 bg-emerald-600/90 hover:bg-emerald-600 text-white text-[11px] font-bold rounded-lg flex items-center gap-1.5 transition-colors shadow-sm min-h-[32px]"
                          >
                            <Download size={11} /> Download Ep {ep.episodeNumber}
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-xs text-muted text-center py-4">No episodes added for this season yet.</p>
          )}
        </div>

        {/* Story Synopsis */}
        <div className="glass-panel p-6 rounded-2xl border border-dark-border space-y-3">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <span className="w-1.5 h-5 bg-brand-red rounded-full"></span>
            Series Synopsis
          </h2>
          <p className="text-neutral-300 text-sm leading-relaxed">{series.description}</p>
        </div>

        {related.length > 0 && <MovieCarousel title="Similar Web Series" movies={related} />}
      </div>

      {/* Trailer Modal */}
      {showTrailer && series.trailerUrl && (
        <Modal isOpen={showTrailer} onClose={() => setShowTrailer(false)} title={`${series.title} — Official Trailer`}>
          <div className="aspect-video w-full bg-black rounded-xl overflow-hidden">
            <iframe
              src={`${series.trailerUrl}?autoplay=1`}
              title={`${series.title} Trailer`}
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

export default SeriesDetailPage;
