import React, { useState } from 'react';
import { User, Mail, Shield, Save, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';
import SEO from '../components/SEO';

export const ProfilePage = () => {
  const { user } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [avatar, setAvatar] = useState(user?.avatar || '');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setMessage('');
    setLoading(true);
    try {
      const payload = { name, avatar };
      if (password) payload.password = password;

      const res = await API.put('/auth/profile', payload);
      if (res.data.success) {
        setMessage('Profile updated successfully!');
        setPassword('');
      }
    } catch (err) {
      console.error('Failed to update profile', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SEO title="User Profile Settings" description="Manage your account profile, avatar, and security settings on Dekzo." />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
        <div className="glass-panel p-8 rounded-2xl border border-dark-border space-y-6 shadow-2xl">
          <div className="flex items-center gap-4 pb-6 border-b border-white/10">
            <img
              src={avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'}
              alt={name}
              className="w-16 h-16 rounded-full object-cover border-2 border-brand-red shadow-glow"
            />
            <div>
              <h1 className="text-2xl font-bold text-white">{user?.name}</h1>
              <div className="flex items-center gap-2 text-xs text-muted mt-1">
                <span>{user?.email}</span>
                <span className="px-2 py-0.5 bg-brand-red/20 text-brand-red rounded font-bold uppercase text-[10px]">
                  {user?.role}
                </span>
              </div>
            </div>
          </div>

          {message && (
            <div className="p-3 bg-green-500/10 border border-green-500/30 rounded-xl flex items-center gap-2 text-xs text-green-400 font-semibold">
              <CheckCircle2 size={16} />
              <span>{message}</span>
            </div>
          )}

          <form onSubmit={handleUpdate} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-neutral-300 uppercase tracking-wider mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-dark-card border border-dark-border text-white text-sm p-3 rounded-xl focus:border-brand-red focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-300 uppercase tracking-wider mb-1.5">
                Avatar Image URL
              </label>
              <input
                type="url"
                value={avatar}
                onChange={(e) => setAvatar(e.target.value)}
                className="w-full bg-dark-card border border-dark-border text-white text-sm p-3 rounded-xl focus:border-brand-red focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-300 uppercase tracking-wider mb-1.5">
                New Password (leave empty to keep current)
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-dark-card border border-dark-border text-white text-sm p-3 rounded-xl focus:border-brand-red focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-brand-red hover:bg-brand-red-hover text-white font-bold text-sm rounded-xl shadow-glow transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Save size={18} /> {loading ? 'Saving Changes...' : 'Update Profile'}
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default ProfilePage;
