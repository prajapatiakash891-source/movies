import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Film, User, Mail, Lock, UserPlus, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import SEO from '../components/SEO';

export const RegisterPage = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setLoading(true);
    try {
      await register(name, email, password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SEO title="Create Account" description="Join Dekzo to create watchlist, rate movies, and write reviews." />

      <div className="min-h-[75vh] flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-md bg-dark-secondary/90 border border-dark-border rounded-2xl p-8 shadow-2xl backdrop-blur-xl animate-fade-in">
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center gap-2 mb-2">
              <div className="w-10 h-10 rounded-xl bg-brand-red flex items-center justify-center shadow-glow">
                <Film size={22} className="text-white" />
              </div>
              <span className="text-2xl font-black text-white">
                DEK<span className="text-brand-red">ZO</span>
              </span>
            </Link>
            <h2 className="text-xl font-bold text-white">Create Your Account</h2>
            <p className="text-xs text-muted mt-1">Join our dark cinematic movie discovery platform</p>
          </div>

          {error && (
            <div className="mb-6 p-3 bg-red-500/10 border border-red-500/30 rounded-xl flex items-center gap-2 text-xs text-red-400 font-semibold">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-neutral-300 uppercase tracking-wider mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  className="w-full bg-dark-card border border-dark-border text-white text-sm pl-10 pr-4 py-2.5 rounded-xl focus:border-brand-red focus:outline-none"
                  required
                />
                <User size={18} className="absolute left-3 top-3 text-neutral-500" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-300 uppercase tracking-wider mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="john@example.com"
                  className="w-full bg-dark-card border border-dark-border text-white text-sm pl-10 pr-4 py-2.5 rounded-xl focus:border-brand-red focus:outline-none"
                  required
                />
                <Mail size={18} className="absolute left-3 top-3 text-neutral-500" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-300 uppercase tracking-wider mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  className="w-full bg-dark-card border border-dark-border text-white text-sm pl-10 pr-4 py-2.5 rounded-xl focus:border-brand-red focus:outline-none"
                  required
                />
                <Lock size={18} className="absolute left-3 top-3 text-neutral-500" />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-brand-red hover:bg-brand-red-hover text-white font-bold text-sm rounded-xl shadow-glow transition-all flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
            >
              <UserPlus size={18} /> {loading ? 'Creating Account...' : 'Register Account'}
            </button>
          </form>

          <p className="text-center text-xs text-muted mt-6">
            Already registered?{' '}
            <Link to="/login" className="text-brand-red font-bold hover:underline">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default RegisterPage;
