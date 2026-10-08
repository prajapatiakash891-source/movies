import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Save, ArrowLeft, CheckCircle2 } from 'lucide-react';
import API from '../../services/api';
import PageLoader from '../../components/PageLoader';

export const AdminMovieFormPage = () => {
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
    type: 'movie',
    industry: 'Bollywood',
    quality: '4K Ultra HD',
    rating: '',
    duration: '',
    trailerUrl: '',
    watchUrl: '',
    downloadUrl: '',
    cast: '',
    director: '',
    featured: false,
    trending: false,
  });

  const [loading, setLoading] = useState(isEdit);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (isEdit) {
      const fetchMovie = async () => {
        try {
          const res = await API.get(`/movies/${id}`);
          if (res.data.success) {
            const m = res.data.data;
            setFormData({
              title: m.title || '',
              description: m.description || '',
              poster: m.poster || '',
              backdrop: m.backdrop || '',
              releaseYear: m.releaseYear || new Date().getFullYear(),
              genres: Array.isArray(m.genres) ? m.genres.join(', ') : (m.genres || ''),
              languages: Array.isArray(m.languages) ? m.languages.join(', ') : (m.languages || ''),
              type: m.type || 'movie',
              industry: m.industry || 'Bollywood',
              quality: m.quality || '4K Ultra HD',
              rating: m.rating !== undefined && m.rating !== null ? m.rating : '',
              duration: m.duration || '',
              trailerUrl: m.trailerUrl || '',
              watchUrl: m.watchUrl || '',
              downloadUrl: m.downloadUrl || '',
              cast: Array.isArray(m.cast) ? m.cast.join(', ') : (m.cast || ''),
              director: m.director || '',
              featured: Boolean(m.featured),
              trending: Boolean(m.trending),
            });
          }
        } catch (err) {
          console.error('Failed to load movie for edit', err);
        } finally {
          setLoading(false);
        }
      };
      fetchMovie();
    }
  }, [id, isEdit]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage('');
    try {
      const payload = {
        ...formData,
        releaseYear: parseInt(formData.releaseYear, 10) || new Date().getFullYear(),
        rating: parseFloat(formData.rating) || 0,
        genres: typeof formData.genres === 'string' ? formData.genres.split(',').map((g) => g.trim()).filter(Boolean) : formData.genres,
        languages: typeof formData.languages === 'string' ? formData.languages.split(',').map((l) => l.trim()).filter(Boolean) : formData.languages,
        cast: typeof formData.cast === 'string' ? formData.cast.split(',').map((c) => c.trim()).filter(Boolean) : formData.cast,
      };

      if (isEdit) {
        await API.put(`/movies/${id}`, payload);
        setMessage('Movie updated successfully!');
      } else {
        await API.post('/movies', payload);
        setMessage('Movie created successfully!');
      }

      setTimeout(() => navigate('/admin/movies'), 1200);
    } catch (err) {
      console.error('Movie save error', err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <PageLoader />;

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      <div className="flex items-center justify-between pb-4 border-b border-white/10">
        <div>
          <h1 className="text-2xl font-black text-white">{isEdit ? 'Edit Movie' : 'Create New Movie'}</h1>
          <p className="text-xs text-muted mt-1">Fill in the fields below to update MongoDB content</p>
        </div>

        <button
          onClick={() => navigate('/admin/movies')}
          className="px-4 py-2 bg-dark-card border border-dark-border text-white text-xs font-bold rounded-xl flex items-center gap-1.5"
        >
          <ArrowLeft size={16} /> Back to Movies List
        </button>
      </div>

      {message && (
        <div className="p-3 bg-green-500/10 border border-green-500/30 rounded-xl flex items-center gap-2 text-xs text-green-400 font-semibold">
          <CheckCircle2 size={16} />
          <span>{message}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="glass-panel p-6 rounded-2xl border border-dark-border space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-neutral-300 uppercase tracking-wider mb-1">Title</label>
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
          <label className="block text-xs font-bold text-neutral-300 uppercase tracking-wider mb-1">Description</label>
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
            <label className="block text-xs font-bold text-neutral-300 uppercase tracking-wider mb-1">Quality</label>
            <input
              type="text"
              name="quality"
              value={formData.quality}
              onChange={handleChange}
              className="w-full bg-dark-card border border-dark-border text-white text-xs p-3 rounded-xl focus:border-brand-red focus:outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-bold text-neutral-300 uppercase tracking-wider mb-1">Rating (0 - 10)</label>
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
            <label className="block text-xs font-bold text-neutral-300 uppercase tracking-wider mb-1">Duration</label>
            <input
              type="text"
              name="duration"
              value={formData.duration}
              onChange={handleChange}
              className="w-full bg-dark-card border border-dark-border text-white text-xs p-3 rounded-xl focus:border-brand-red focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-neutral-300 uppercase tracking-wider mb-1">Type</label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="w-full bg-dark-card border border-dark-border text-white text-xs p-3 rounded-xl focus:border-brand-red focus:outline-none"
            >
              <option value="movie">Movie</option>
              <option value="series">Web Series</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-neutral-300 uppercase tracking-wider mb-1">Industry / Category</label>
            <select
              name="industry"
              value={formData.industry}
              onChange={handleChange}
              className="w-full bg-dark-card border border-dark-border text-white text-xs p-3 rounded-xl focus:border-brand-red focus:outline-none font-bold text-brand-red"
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
            <label className="block text-xs font-bold text-neutral-300 uppercase tracking-wider mb-1">Official Stream Watch URL</label>
            <input
              type="url"
              name="watchUrl"
              value={formData.watchUrl}
              onChange={handleChange}
              placeholder="https://www.netflix.com/..."
              className="w-full bg-dark-card border border-dark-border text-white text-xs p-3 rounded-xl focus:border-brand-red focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-neutral-300 uppercase tracking-wider mb-1">Direct Download URL</label>
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-neutral-300 uppercase tracking-wider mb-1">Cast (comma separated)</label>
            <input
              type="text"
              name="cast"
              value={formData.cast}
              onChange={handleChange}
              className="w-full bg-dark-card border border-dark-border text-white text-xs p-3 rounded-xl focus:border-brand-red focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-neutral-300 uppercase tracking-wider mb-1">Director</label>
            <input
              type="text"
              name="director"
              value={formData.director}
              onChange={handleChange}
              className="w-full bg-dark-card border border-dark-border text-white text-xs p-3 rounded-xl focus:border-brand-red focus:outline-none"
            />
          </div>
        </div>

        <div className="flex items-center gap-6 pt-2">
          <label className="flex items-center gap-2 text-xs font-bold text-white cursor-pointer">
            <input
              type="checkbox"
              name="featured"
              checked={formData.featured}
              onChange={handleChange}
              className="rounded bg-dark-card border-dark-border text-brand-red focus:ring-brand-red"
            />
            Featured on Hero Banner
          </label>

          <label className="flex items-center gap-2 text-xs font-bold text-white cursor-pointer">
            <input
              type="checkbox"
              name="trending"
              checked={formData.trending}
              onChange={handleChange}
              className="rounded bg-dark-card border-dark-border text-brand-red focus:ring-brand-red"
            />
            Mark as Trending
          </label>
        </div>

        <div className="pt-4 border-t border-white/5 flex justify-end">
          <button
            type="submit"
            disabled={submitting}
            className="px-6 py-3 bg-brand-red hover:bg-brand-red-hover text-white text-xs font-bold rounded-xl shadow-glow flex items-center gap-2 disabled:opacity-50"
          >
            <Save size={16} /> {submitting ? 'Saving Record...' : isEdit ? 'Update Movie' : 'Create Movie'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminMovieFormPage;
