import React, { useEffect, useState } from 'react';
import { Plus, Trash2, Tag } from 'lucide-react';
import API from '../../services/api';
import PageLoader from '../../components/PageLoader';

export const AdminGenresPage = () => {
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newGenreName, setNewGenreName] = useState('');
  const [newGenreDesc, setNewGenreDesc] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchGenres = async () => {
    try {
      const res = await API.get('/categories');
      if (res.data.success) {
        setGenres(res.data.data);
      }
    } catch (err) {
      console.error('Failed to load genres', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGenres();
  }, []);

  const handleCreateGenre = async (e) => {
    e.preventDefault();
    if (!newGenreName.trim()) return;

    setSubmitting(true);
    try {
      const res = await API.post('/admin/genres', {
        name: newGenreName,
        description: newGenreDesc,
      });
      if (res.data.success) {
        setGenres((prev) => [...prev, res.data.data]);
        setNewGenreName('');
        setNewGenreDesc('');
      }
    } catch (err) {
      console.error('Failed to create genre', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteGenre = async (id) => {
    try {
      await API.delete(`/admin/genres/${id}`);
      setGenres((prev) => prev.filter((g) => g._id !== id));
    } catch (err) {
      console.error('Failed to delete genre', err);
    }
  };

  if (loading) return <PageLoader />;

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl">
      <div className="pb-4 border-b border-white/10">
        <h1 className="text-2xl font-black text-white">Manage Movie Genres</h1>
        <p className="text-xs text-muted mt-1">Create and remove platform content categories</p>
      </div>

      {/* Add Genre Form */}
      <form onSubmit={handleCreateGenre} className="glass-panel p-6 rounded-2xl border border-dark-border space-y-4">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider">Add New Genre</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input
            type="text"
            value={newGenreName}
            onChange={(e) => setNewGenreName(e.target.value)}
            placeholder="Genre Name (e.g. Fantasy)"
            className="bg-dark-card border border-dark-border text-white text-xs p-3 rounded-xl focus:border-brand-red focus:outline-none"
            required
          />
          <input
            type="text"
            value={newGenreDesc}
            onChange={(e) => setNewGenreDesc(e.target.value)}
            placeholder="Short description..."
            className="bg-dark-card border border-dark-border text-white text-xs p-3 rounded-xl focus:border-brand-red focus:outline-none"
          />
        </div>
        <button
          type="submit"
          disabled={submitting}
          className="px-4 py-2 bg-brand-red hover:bg-brand-red-hover text-white text-xs font-bold rounded-xl shadow-glow flex items-center gap-1.5 transition-colors disabled:opacity-50"
        >
          <Plus size={16} /> Add Genre
        </button>
      </form>

      {/* Genres Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {genres.map((g) => (
          <div key={g._id} className="p-4 bg-dark-card rounded-xl border border-dark-border flex items-center justify-between">
            <div>
              <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                <Tag size={14} className="text-brand-red" /> {g.name}
              </h4>
              {g.description && <p className="text-[11px] text-muted mt-1">{g.description}</p>}
            </div>
            <button
              onClick={() => handleDeleteGenre(g._id)}
              className="p-1.5 text-neutral-500 hover:text-red-400 transition-colors"
            >
              <Trash2 size={14} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminGenresPage;
