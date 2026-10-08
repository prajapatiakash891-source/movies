import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Edit, Trash2, Search, AlertTriangle } from 'lucide-react';
import API from '../../services/api';
import Modal from '../../components/Modal';
import Pagination from '../../components/Pagination';
import PageLoader from '../../components/PageLoader';

export const AdminMoviesPage = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Modal confirmation state
  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchMovies = async () => {
    setLoading(true);
    try {
      const res = await API.get(`/movies?search=${encodeURIComponent(search)}&page=${page}&limit=10`);
      if (res.data.success) {
        setMovies(res.data.data);
        setTotalPages(res.data.totalPages);
      }
    } catch (err) {
      console.error('Failed to load movies', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMovies();
  }, [search, page]);

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      await API.delete(`/movies/${deleteId}`);
      setMovies((prev) => prev.filter((m) => m._id !== deleteId));
      setDeleteId(null);
    } catch (err) {
      console.error('Delete movie failed', err);
    } finally {
      setDeleting(false);
    }
  };

  if (loading && movies.length === 0) return <PageLoader />;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <h1 className="text-2xl font-black text-white">Manage Movies Collection</h1>
          <p className="text-xs text-muted mt-1">Create, edit, or remove movies from the database</p>
        </div>

        <Link to="/admin/movies/create">
          <button className="px-4 py-2.5 bg-brand-red hover:bg-brand-red-hover text-white text-xs font-bold rounded-xl shadow-glow flex items-center gap-1.5 transition-colors">
            <Plus size={16} /> Add New Movie
          </button>
        </Link>
      </div>

      {/* Filter / Search input */}
      <div className="relative max-w-md">
        <input
          type="text"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          placeholder="Search by title..."
          className="w-full bg-dark-card border border-dark-border text-white text-xs pl-9 pr-4 py-2.5 rounded-xl focus:border-brand-red focus:outline-none"
        />
        <Search size={16} className="absolute left-3 top-3 text-neutral-500" />
      </div>

      {/* Movies Table */}
      <div className="glass-panel rounded-2xl border border-dark-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-neutral-300">
            <thead className="bg-dark-card/80 text-muted uppercase font-bold text-[10px] tracking-wider border-b border-white/5">
              <tr>
                <th className="p-4">Movie</th>
                <th className="p-4">Year</th>
                <th className="p-4">Genres</th>
                <th className="p-4">Rating</th>
                <th className="p-4">Type</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {movies.map((m) => (
                <tr key={m._id} className="hover:bg-white/5 transition-colors">
                  <td className="p-4 flex items-center gap-3">
                    <img src={m.poster} alt={m.title} className="w-9 h-12 object-cover rounded shadow" />
                    <div>
                      <p className="font-bold text-white line-clamp-1">{m.title}</p>
                      <p className="text-[10px] text-muted">{m.duration || 'N/A'}</p>
                    </div>
                  </td>
                  <td className="p-4 font-semibold">{m.releaseYear}</td>
                  <td className="p-4">{m.genres?.slice(0, 2).join(', ')}</td>
                  <td className="p-4 font-bold text-yellow-400">★ {m.rating}</td>
                  <td className="p-4 uppercase font-bold text-[10px] text-brand-red">{m.type}</td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link to={`/admin/movies/edit/${m._id}`}>
                        <button className="p-1.5 bg-dark-card border border-dark-border text-neutral-300 hover:text-white hover:bg-brand-red/20 rounded-lg transition-colors">
                          <Edit size={14} />
                        </button>
                      </Link>
                      <button
                        onClick={() => setDeleteId(m._id)}
                        className="p-1.5 bg-dark-card border border-dark-border text-neutral-300 hover:text-red-400 hover:bg-red-500/20 rounded-lg transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Pagination currentPage={page} totalPages={totalPages} onPageChange={(p) => setPage(p)} />

      {/* Confirmation Modal */}
      {deleteId && (
        <Modal isOpen={Boolean(deleteId)} onClose={() => setDeleteId(null)} title="Confirm Deletion">
          <div className="space-y-4 text-center p-2">
            <div className="w-12 h-12 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mx-auto">
              <AlertTriangle size={24} />
            </div>
            <h4 className="text-base font-bold text-white">Are you sure you want to delete this movie?</h4>
            <p className="text-xs text-muted">This action cannot be undone and will permanently remove the record from MongoDB.</p>
            <div className="flex justify-center gap-3 pt-2">
              <button
                onClick={() => setDeleteId(null)}
                className="px-4 py-2 bg-dark-card border border-dark-border text-white text-xs font-bold rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl shadow-md disabled:opacity-50"
              >
                {deleting ? 'Deleting...' : 'Confirm Delete'}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default AdminMoviesPage;
