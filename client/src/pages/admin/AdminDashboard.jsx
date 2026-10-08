import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Film, Tv, Users, Tag, Plus, ArrowRight, ShieldCheck } from 'lucide-react';
import API from '../../services/api';
import PageLoader from '../../components/PageLoader';

export const AdminDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdminStats = async () => {
      try {
        const res = await API.get('/admin/stats');
        if (res.data.success) {
          setData(res.data);
        }
      } catch (err) {
        console.error('Failed to load admin stats', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAdminStats();
  }, []);

  if (loading) return <PageLoader />;

  const stats = data?.stats || { totalMovies: 0, totalSeries: 0, totalUsers: 0, totalGenres: 0 };

  const cards = [
    { label: 'Total Movies', value: stats.totalMovies, icon: Film, color: 'text-blue-400', link: '/admin/movies' },
    { label: 'Total Series', value: stats.totalSeries, icon: Tv, color: 'text-purple-400', link: '/admin/series' },
    { label: 'Total Users', value: stats.totalUsers, icon: Users, color: 'text-green-400', link: '/admin/users' },
    { label: 'Total Genres', value: stats.totalGenres, icon: Tag, color: 'text-yellow-400', link: '/admin/genres' },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header & Quick Action Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <h1 className="text-3xl font-black text-white">Platform Statistics Overview</h1>
          <p className="text-xs text-muted mt-1">Manage content, users, and platform analytics for AakashMovies</p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Link to="/admin/movies/create">
            <button className="px-4 py-2.5 bg-brand-red hover:bg-brand-red-hover text-white text-xs font-bold rounded-xl shadow-glow flex items-center gap-1.5 transition-colors">
              <Plus size={16} /> Add New Movie
            </button>
          </Link>
          <Link to="/admin/series/create">
            <button className="px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-xl shadow-lg flex items-center gap-1.5 transition-colors">
              <Plus size={16} /> Add Web Series
            </button>
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <Link key={card.label} to={card.link}>
              <div className="glass-panel p-5 rounded-2xl border border-dark-border hover:border-brand-red/40 transition-all hover:-translate-y-1">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-muted uppercase tracking-wider">{card.label}</span>
                  <div className={`p-2.5 rounded-xl bg-white/5 ${card.color}`}>
                    <Icon size={20} />
                  </div>
                </div>
                <div className="text-3xl font-black text-white">{card.value}</div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Recent Content & Recent Users Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Movies */}
        <div className="glass-panel p-6 rounded-2xl border border-dark-border space-y-4">
          <div className="flex items-center justify-between border-b border-white/5 pb-3">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Recently Added Titles</h3>
            <Link to="/admin/movies" className="text-xs text-brand-red font-bold flex items-center gap-1 hover:underline">
              View All <ArrowRight size={14} />
            </Link>
          </div>

          <div className="divide-y divide-white/5">
            {data?.recentMovies?.map((m) => (
              <div key={m._id} className="py-2.5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img src={m.poster} alt={m.title} className="w-8 h-12 object-cover rounded" />
                  <div>
                    <h4 className="text-xs font-bold text-white">{m.title}</h4>
                    <p className="text-[10px] text-muted">{m.releaseYear} • {m.type}</p>
                  </div>
                </div>
                <span className="text-xs font-bold text-yellow-400">★ {m.rating}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Registered Users */}
        <div className="glass-panel p-6 rounded-2xl border border-dark-border space-y-4">
          <div className="flex items-center justify-between border-b border-white/5 pb-3">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Recently Joined Users</h3>
            <Link to="/admin/users" className="text-xs text-brand-red font-bold flex items-center gap-1 hover:underline">
              Manage Users <ArrowRight size={14} />
            </Link>
          </div>

          <div className="divide-y divide-white/5">
            {data?.recentUsers?.map((u) => (
              <div key={u._id} className="py-2.5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img src={u.avatar} alt={u.name} className="w-8 h-8 rounded-full object-cover" />
                  <div>
                    <h4 className="text-xs font-bold text-white">{u.name}</h4>
                    <p className="text-[10px] text-muted">{u.email}</p>
                  </div>
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${u.role === 'admin' ? 'bg-red-500/20 text-red-400' : 'bg-blue-500/20 text-blue-400'}`}>
                  {u.role}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
