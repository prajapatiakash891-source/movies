import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Save, ArrowLeft, CheckCircle2, Plus, Trash2, Film, Download, Play } from 'lucide-react';
import API from '../../services/api';
import PageLoader from '../../components/PageLoader';

export const AdminSeriesFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    poster: '',
    backdrop: '',
    releaseYear: new Date().getFullYear(),
    genres: '',
    languages: '',
    industry: 'Bollywood',
    quality: '4K Ultra HD',
    rating: '',
    trailerUrl: '',
    downloadUrl: '',
    cast: '',
    creator: '',
    seasons: [
      {
        seasonNumber: 1,
        seasonTitle: 'Season 1',
        episodes: [
          {
            episodeNumber: 1,
            title: 'Episode 1',
            duration: '45m',
            description: '',
            watchUrl: '',
            downloadUrl: '',
          },
        ],
      },
    ],
  });

  const [loading, setLoading] = useState(isEdit);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (isEdit) {
      const fetchSeries = async () => {
        try {
          const res = await API.get(`/series/${id}`);
          if (res.data.success) {
            const s = res.data.data;
            setFormData({
              title: s.title || '',
              description: s.description || '',
              poster: s.poster || '',
              backdrop: s.backdrop || '',
              releaseYear: s.releaseYear || new Date().getFullYear(),
              genres: Array.isArray(s.genres) ? s.genres.join(', ') : (s.genres || ''),
              languages: Array.isArray(s.languages) ? s.languages.join(', ') : (s.languages || ''),
              industry: s.industry || 'Bollywood',
              quality: s.quality || '4K Ultra HD',
              rating: s.rating !== undefined && s.rating !== null ? s.rating : '',
              trailerUrl: s.trailerUrl || '',
              downloadUrl: s.downloadUrl || '',
              cast: Array.isArray(s.cast) ? s.cast.join(', ') : (s.cast || ''),
              creator: s.creator || '',
              seasons:
                s.seasons && s.seasons.length > 0
                  ? s.seasons
                  : [
                      {
                        seasonNumber: 1,
                        seasonTitle: 'Season 1',
                        episodes: [
                          {
                            episodeNumber: 1,
                            title: 'Episode 1',
                            duration: '45m',
                            description: '',
                            watchUrl: '',
                            downloadUrl: '',
                          },
                        ],
                      },
                    ],
            });
          }
        } catch (err) {
          console.error('Failed to load series for edit', err);
        } finally {
          setLoading(false);
        }
      };
      fetchSeries();
    }
  }, [id, isEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Season Handlers
  const handleAddSeason = () => {
    const nextSeasonNum = formData.seasons.length + 1;
    setFormData((prev) => ({
      ...prev,
      seasons: [
        ...prev.seasons,
        {
          seasonNumber: nextSeasonNum,
          seasonTitle: `Season ${nextSeasonNum}`,
          episodes: [
            {
              episodeNumber: 1,
              title: 'Episode 1',
              duration: '45m',
              description: '',
              watchUrl: '',
              downloadUrl: '',
            },
          ],
        },
      ],
    }));
  };

  const handleRemoveSeason = (sIdx) => {
    if (formData.seasons.length <= 1) return;
    setFormData((prev) => ({
      ...prev,
      seasons: prev.seasons.filter((_, idx) => idx !== sIdx),
    }));
  };

  const handleSeasonTitleChange = (sIdx, value) => {
    setFormData((prev) => {
      const updatedSeasons = [...prev.seasons];
      updatedSeasons[sIdx] = { ...updatedSeasons[sIdx], seasonTitle: value };
      return { ...prev, seasons: updatedSeasons };
    });
  };

  // Episode Handlers
  const handleAddEpisode = (sIdx) => {
    setFormData((prev) => {
      const updatedSeasons = [...prev.seasons];
      const currentEpCount = updatedSeasons[sIdx].episodes?.length || 0;
      const nextEpNum = currentEpCount + 1;
      const newEp = {
        episodeNumber: nextEpNum,
        title: `Episode ${nextEpNum}`,
        duration: '45m',
        description: '',
        watchUrl: '',
        downloadUrl: '',
      };
      updatedSeasons[sIdx] = {
        ...updatedSeasons[sIdx],
        episodes: [...(updatedSeasons[sIdx].episodes || []), newEp],
      };
      return { ...prev, seasons: updatedSeasons };
    });
  };

  const handleEpisodeChange = (sIdx, epIdx, field, value) => {
    setFormData((prev) => {
      const updatedSeasons = [...prev.seasons];
      const targetEpisodes = [...updatedSeasons[sIdx].episodes];
      targetEpisodes[epIdx] = {
        ...targetEpisodes[epIdx],
        [field]: value,
      };
      updatedSeasons[sIdx] = {
        ...updatedSeasons[sIdx],
        episodes: targetEpisodes,
      };
      return { ...prev, seasons: updatedSeasons };
    });
  };

  const handleRemoveEpisode = (sIdx, epIdx) => {
    setFormData((prev) => {
      const updatedSeasons = [...prev.seasons];
      const targetEpisodes = updatedSeasons[sIdx].episodes.filter((_, idx) => idx !== epIdx);
      updatedSeasons[sIdx] = {
        ...updatedSeasons[sIdx],
        episodes: targetEpisodes,
      };
      return { ...prev, seasons: updatedSeasons };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage('');
    try {
      const totalEpisodes = formData.seasons.reduce((sum, s) => sum + (s.episodes?.length || 0), 0);
      const payload = {
        ...formData,
        releaseYear: parseInt(formData.releaseYear, 10) || new Date().getFullYear(),
        rating: parseFloat(formData.rating) || 0,
        seasonsCount: formData.seasons.length,
        totalEpisodes,
        genres: typeof formData.genres === 'string' ? formData.genres.split(',').map((g) => g.trim()).filter(Boolean) : formData.genres,
        languages: typeof formData.languages === 'string' ? formData.languages.split(',').map((l) => l.trim()).filter(Boolean) : formData.languages,
        cast: typeof formData.cast === 'string' ? formData.cast.split(',').map((c) => c.trim()).filter(Boolean) : formData.cast,
      };

      if (isEdit) {
        await API.put(`/series/${id}`, payload);
        setMessage('Web Series updated successfully!');
      } else {
        await API.post('/series', payload);
        setMessage('Web Series created successfully!');
      }

      setTimeout(() => navigate('/admin/series'), 1200);
    } catch (err) {
      console.error('Series save error', err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <PageLoader />;

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-fade-in pb-12">
      <div className="flex items-center justify-between pb-4 border-b border-white/10">
        <div>
          <h1 className="text-2xl font-black text-white">{isEdit ? 'Edit Web Series' : 'Create Web Series'}</h1>
          <p className="text-xs text-muted mt-1">Configure series metadata, seasons, and episode links</p>
        </div>

        <button
          onClick={() => navigate('/admin/series')}
          className="px-4 py-2 bg-dark-card border border-dark-border text-white text-xs font-bold rounded-xl flex items-center gap-1.5"
        >
          <ArrowLeft size={16} /> Back to Series List
        </button>
      </div>

      {message && (
        <div className="p-3 bg-green-500/10 border border-green-500/30 rounded-xl flex items-center gap-2 text-xs text-green-400 font-semibold">
          <CheckCircle2 size={16} />
          <span>{message}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="glass-panel p-6 rounded-2xl border border-dark-border space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-neutral-300 uppercase tracking-wider mb-1">Series Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full bg-dark-card border border-dark-border text-white text-xs p-3 rounded-xl focus:border-brand-red focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-neutral-300 uppercase tracking-wider mb-1">Release Year</label>
            <input
              type="number"
              name="releaseYear"
              value={formData.releaseYear}
              onChange={handleChange}
              className="w-full bg-dark-card border border-dark-border text-white text-xs p-3 rounded-xl focus:border-brand-red focus:outline-none"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-neutral-300 uppercase tracking-wider mb-1">Synopsis Description</label>
          <textarea
            rows={3}
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full bg-dark-card border border-dark-border text-white text-xs p-3 rounded-xl focus:border-brand-red focus:outline-none"
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-neutral-300 uppercase tracking-wider mb-1">Poster Image URL</label>
            <input
              type="url"
              name="poster"
              value={formData.poster}
              onChange={handleChange}
              className="w-full bg-dark-card border border-dark-border text-white text-xs p-3 rounded-xl focus:border-brand-red focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-neutral-300 uppercase tracking-wider mb-1">Backdrop Image URL</label>
            <input
              type="url"
              name="backdrop"
              value={formData.backdrop}
              onChange={handleChange}
              className="w-full bg-dark-card border border-dark-border text-white text-xs p-3 rounded-xl focus:border-brand-red focus:outline-none"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-bold text-neutral-300 uppercase tracking-wider mb-1">Genres (comma separated)</label>
            <input
              type="text"
              name="genres"
              value={formData.genres}
              onChange={handleChange}
              className="w-full bg-dark-card border border-dark-border text-white text-xs p-3 rounded-xl focus:border-brand-red focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-neutral-300 uppercase tracking-wider mb-1">Languages (comma separated)</label>
            <input
              type="text"
              name="languages"
              value={formData.languages}
              onChange={handleChange}
              className="w-full bg-dark-card border border-dark-border text-white text-xs p-3 rounded-xl focus:border-brand-red focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-neutral-300 uppercase tracking-wider mb-1">Rating</label>
            <input
              type="number"
              step="0.1"
              name="rating"
              value={formData.rating}
              onChange={handleChange}
              className="w-full bg-dark-card border border-dark-border text-white text-xs p-3 rounded-xl focus:border-brand-red focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-neutral-300 uppercase tracking-wider mb-1">Industry / Category</label>
            <select
              name="industry"
              value={formData.industry}
              onChange={handleChange}
              className="w-full bg-dark-card border border-dark-border text-white text-xs p-3 rounded-xl focus:border-purple-500 focus:outline-none font-bold text-purple-400"
            >
              <option value="Bollywood">Bollywood</option>
              <option value="Hollywood">Hollywood</option>
              <option value="Tollywood">Tollywood</option>
              <option value="South Hindi Dubbed">South Hindi Dubbed</option>
              <option value="Anime">Anime</option>
              <option value="Punjabi">Punjabi</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-neutral-300 uppercase tracking-wider mb-1">YouTube Trailer URL</label>
            <input
              type="url"
              name="trailerUrl"
              value={formData.trailerUrl}
              onChange={handleChange}
              placeholder="https://www.youtube.com/embed/..."
              className="w-full bg-dark-card border border-dark-border text-white text-xs p-3 rounded-xl focus:border-brand-red focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-neutral-300 uppercase tracking-wider mb-1">Direct Download URL (Full Series Pack)</label>
            <input
              type="url"
              name="downloadUrl"
              value={formData.downloadUrl}
              onChange={handleChange}
              placeholder="https://example.com/download/..."
              className="w-full bg-dark-card border border-dark-border text-white text-xs p-3 rounded-xl focus:border-brand-red focus:outline-none"
            />
          </div>
        </div>

        {/* Seasons & Episodes Management Section */}
        <div className="pt-6 border-t border-white/10 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <span className="w-2 h-5 bg-purple-500 rounded-full"></span>
                Seasons & Episode Manager ({formData.seasons.length} Seasons)
              </h3>
              <p className="text-xs text-muted mt-0.5">Add seasons, episode names, streaming links, and download links</p>
            </div>
            <button
              type="button"
              onClick={handleAddSeason}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-md transition-all"
            >
              <Plus size={16} /> Add Season
            </button>
          </div>

          {formData.seasons.map((season, sIdx) => (
            <div key={sIdx} className="p-5 bg-dark-card/90 rounded-2xl border border-purple-500/20 space-y-4 shadow-lg">
              {/* Season Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/10">
                <div className="flex items-center gap-3 flex-1">
                  <span className="px-3 py-1 bg-purple-500/20 text-purple-300 text-xs font-bold rounded-lg border border-purple-500/30">
                    Season {season.seasonNumber || sIdx + 1}
                  </span>
                  <input
                    type="text"
                    value={season.seasonTitle || `Season ${sIdx + 1}`}
                    onChange={(e) => handleSeasonTitleChange(sIdx, e.target.value)}
                    placeholder={`Season ${sIdx + 1} Title`}
                    className="bg-dark-secondary text-white text-xs font-bold px-3 py-2 rounded-xl border border-dark-border focus:border-purple-500 focus:outline-none flex-1 max-w-sm"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleAddEpisode(sIdx)}
                    className="px-3 py-1.5 bg-brand-red/90 hover:bg-brand-red text-white text-xs font-bold rounded-lg flex items-center gap-1 transition-all"
                  >
                    <Plus size={14} /> Add Episode
                  </button>
                  {formData.seasons.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveSeason(sIdx)}
                      className="p-1.5 text-neutral-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                      title="Delete Season"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              </div>

              {/* Episodes List inside Season */}
              <div className="space-y-3">
                {season.episodes && season.episodes.length > 0 ? (
                  season.episodes.map((ep, epIdx) => (
                    <div key={epIdx} className="p-4 bg-dark-secondary/60 rounded-xl border border-dark-border space-y-3">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex items-center gap-2 flex-1">
                          <span className="w-7 h-7 rounded-lg bg-white/10 text-white text-xs font-bold flex items-center justify-center flex-none">
                            E{ep.episodeNumber || epIdx + 1}
                          </span>
                          <input
                            type="text"
                            value={ep.title || ''}
                            onChange={(e) => handleEpisodeChange(sIdx, epIdx, 'title', e.target.value)}
                            placeholder={`Episode ${epIdx + 1} Title`}
                            className="w-full bg-dark-card text-white text-xs p-2 rounded-lg border border-dark-border focus:border-purple-500 focus:outline-none"
                            required
                          />
                        </div>

                        <div className="flex items-center gap-2 flex-none">
                          <input
                            type="text"
                            value={ep.duration || '45m'}
                            onChange={(e) => handleEpisodeChange(sIdx, epIdx, 'duration', e.target.value)}
                            placeholder="Duration (e.g. 45m)"
                            className="w-28 bg-dark-card text-white text-xs p-2 rounded-lg border border-dark-border focus:border-purple-500 focus:outline-none"
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveEpisode(sIdx, epIdx)}
                            className="p-2 text-neutral-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                            title="Remove Episode"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>

                      {/* Episode URLs (Watch & Download) */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                        <div>
                          <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-1">
                            Episode Watch / Streaming Link
                          </label>
                          <input
                            type="url"
                            value={ep.watchUrl || ''}
                            onChange={(e) => handleEpisodeChange(sIdx, epIdx, 'watchUrl', e.target.value)}
                            placeholder="https://..."
                            className="w-full bg-dark-card text-white text-xs p-2 rounded-lg border border-dark-border focus:border-purple-500 focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-1">
                            Episode Direct Download Link
                          </label>
                          <input
                            type="url"
                            value={ep.downloadUrl || ''}
                            onChange={(e) => handleEpisodeChange(sIdx, epIdx, 'downloadUrl', e.target.value)}
                            placeholder="https://..."
                            className="w-full bg-dark-card text-white text-xs p-2 rounded-lg border border-dark-border focus:border-purple-500 focus:outline-none"
                          />
                        </div>
                      </div>

                      {/* Episode Description */}
                      <div>
                        <input
                          type="text"
                          value={ep.description || ''}
                          onChange={(e) => handleEpisodeChange(sIdx, epIdx, 'description', e.target.value)}
                          placeholder="Short episode overview description..."
                          className="w-full bg-dark-card text-neutral-300 text-xs p-2 rounded-lg border border-dark-border focus:border-purple-500 focus:outline-none"
                        />
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-4 text-center text-xs text-muted bg-dark-secondary/30 rounded-xl border border-dashed border-white/10">
                    No episodes added for this season. Click "+ Add Episode" above to add one.
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="pt-4 border-t border-white/5 flex justify-end">
          <button
            type="submit"
            disabled={submitting}
            className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-xl shadow-lg flex items-center gap-2 disabled:opacity-50"
          >
            <Save size={16} /> {submitting ? 'Saving...' : isEdit ? 'Update Web Series' : 'Create Web Series'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminSeriesFormPage;
