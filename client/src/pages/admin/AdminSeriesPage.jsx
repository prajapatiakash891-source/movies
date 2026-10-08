import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Edit, Trash2, Search, AlertTriangle, Tv } from 'lucide-react';
import API from '../../services/api';
import Modal from '../../components/Modal';
import Pagination from '../../components/Pagination';
import PageLoader from '../../components/PageLoader';

export const AdminSeriesPage = () => {
  const [seriesList, setSeriesList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchSeries = async () => {
    setLoading(true);
    try {
      const res = await API.get(`/series?page=${page}&limit=10`);
      if (res.data.success) {
        setSeriesList(res.data.data);
        setTotalPages(res.data.totalPages);
      }
    } catch (err) {
      console.error('Failed to load series', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSeries();
  }, [page]);

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      await API.delete(`/series/${deleteId}`);
      setSeriesList((prev) => prev.filter((s) => s._id !== deleteId));
      setDeleteId(null);
    } catch (err) {
      console.error('Delete series failed', err);
    } finally {
      setDeleting(false);
    }
  };

  if (loading && seriesList.length === 0) return <PageLoader />;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <h1 className="text-2xl font-black text-white">Manage Web Series</h1>
          <p className="text-xs text-muted mt-1">Manage seasons, episodes, and web series details</p>
        </div>

        <Link to="/admin/series/create">
          <button className="px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-xl shadow-lg flex items-center gap-1.5 transition-colors">
            <Plus size={16} /> Add Web Series
          </button>
        </Link>
      </div>

      <div className="glass-panel rounded-2xl border border-dark-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-neutral-300">
            <thead className="bg-dark-card/80 text-muted uppercase font-bold text-[10px] tracking-wider border-b border-white/5">
              <tr>
                <th className="p-4">Web Series</th>
                <th className="p-4">Seasons</th>
                <th className="p-4">Genres</th>
                <th className="p-4">Rating</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {seriesList.map((s) => (
                <tr key={s._id} className="hover:bg-white/5 transition-colors">
                  <td className="p-4 flex items-center gap-3">
                    <img src={s.poster} alt={s.title} className="w-9 h-12 object-cover rounded shadow" />
                    <div>
                      <p className="font-bold text-white line-clamp-1">{s.title}</p>
                      <p className="text-[10px] text-muted">{s.releaseYear} • {s.creator || 'N/A'}</p>
                    </div>
                  </td>
                  <td className="p-4 font-bold text-purple-400">{s.seasons ? s.seasons.length : s.seasonsCount} Seasons</td>
                  <td className="p-4">{s.genres?.slice(0, 2).join(', ')}</td>
                  <td className="p-4 font-bold text-yellow-400">★ {s.rating}</td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link to={`/admin/series/edit/${s._id}`}>
                        <button className="p-1.5 bg-dark-card border border-dark-border text-neutral-300 hover:text-white hover:bg-purple-500/20 rounded-lg transition-colors">
                          <Edit size={14} />
                        </button>
                      </Link>
                      <button
                        onClick={() => setDeleteId(s._id)}
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

      {deleteId && (
        <Modal isOpen={Boolean(deleteId)} onClose={() => setDeleteId(null)} title="Confirm Web Series Deletion">
          <div className="space-y-4 text-center p-2">
            <div className="w-12 h-12 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mx-auto">
              <AlertTriangle size={24} />
            </div>
            <h4 className="text-base font-bold text-white">Delete Web Series?</h4>
            <p className="text-xs text-muted">This will delete all season and episode data associated with this series.</p>
            <div className="flex justify-center gap-3 pt-2">
              <button onClick={() => setDeleteId(null)} className="px-4 py-2 bg-dark-card border border-dark-border text-white text-xs font-bold rounded-xl">
                Cancel
              </button>
              <button onClick={handleDelete} disabled={deleting} className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl shadow-md">
                {deleting ? 'Deleting...' : 'Confirm Delete'}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default AdminSeriesPage;
