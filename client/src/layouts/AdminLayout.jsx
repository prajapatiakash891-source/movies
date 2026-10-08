import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Film, Tv, Users, Tag, Home, LogOut, ShieldAlert, Menu, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const AdminLayout = () => {
  const { user, logout, isAdmin } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (!user || !isAdmin) {
    return (
      <div className="min-h-screen bg-[#080808] flex items-center justify-center p-4">
        <div className="glass-panel p-8 rounded-2xl max-w-md w-full text-center space-y-4 border border-red-500/30">
          <div className="w-16 h-16 bg-red-500/10 text-brand-red rounded-full flex items-center justify-center mx-auto">
            <ShieldAlert size={36} />
          </div>
          <h2 className="text-2xl font-bold text-white">Access Denied</h2>
          <p className="text-sm text-muted">
            You must be logged in with administrator privileges to view the AakashMovies Admin Dashboard.
          </p>
          <button
            onClick={() => navigate('/login')}
            className="w-full py-2.5 bg-brand-red text-white font-bold rounded-xl shadow-glow hover:bg-brand-red-hover transition-colors"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  const menuItems = [
    { label: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    { label: 'Manage Movies', path: '/admin/movies', icon: Film },
    { label: 'Manage Web Series', path: '/admin/series', icon: Tv },
    { label: 'Manage Genres', path: '/admin/genres', icon: Tag },
    { label: 'Manage Users', path: '/admin/users', icon: Users },
  ];

  return (
    <div className="min-h-screen bg-[#080808] text-white flex flex-col md:flex-row">
      {/* Mobile Top Header */}
      <div className="md:hidden flex items-center justify-between p-4 bg-dark-secondary border-b border-dark-border">
        <Link to="/" className="flex items-center gap-2">
          <span className="text-lg font-black text-brand-red">AAKASH</span>
          <span className="text-lg font-black text-white">ADMIN</span>
        </Link>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 text-neutral-300 hover:text-white"
        >
          {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Admin Sidebar */}
      <aside
        className={`fixed md:sticky top-0 left-0 bottom-0 z-40 w-64 bg-dark-secondary border-r border-dark-border p-6 flex flex-col justify-between transition-transform duration-300 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="space-y-6">
          <Link to="/" className="flex items-center gap-2.5 pb-4 border-b border-white/10">
            <div className="w-9 h-9 rounded-xl bg-brand-red flex items-center justify-center font-bold text-white shadow-glow">
              A
            </div>
            <div>
              <h1 className="text-base font-black tracking-wider text-white">AakashMovies</h1>
              <p className="text-[10px] text-brand-red font-bold uppercase tracking-widest">Control Panel</p>
            </div>
          </Link>

          <nav className="space-y-1.5">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-semibold text-xs transition-all ${
                    isActive
                      ? 'bg-brand-red text-white shadow-md'
                      : 'text-neutral-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon size={18} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="pt-6 border-t border-white/10 space-y-2">
          <Link
            to="/"
            className="flex items-center gap-3 px-3.5 py-2 text-xs font-semibold text-neutral-300 hover:text-white hover:bg-white/5 rounded-xl transition-colors"
          >
            <Home size={16} /> Return to Website
          </Link>
          <button
            onClick={logout}
            className="flex items-center gap-3 w-full px-3.5 py-2 text-xs font-semibold text-red-400 hover:bg-red-500/10 rounded-xl transition-colors"
          >
            <LogOut size={16} /> Sign Out
          </button>
        </div>
      </aside>

      {/* Main Admin Content Area */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
