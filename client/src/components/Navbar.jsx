import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Film, Menu, X, Heart, User, LogOut, ShieldAlert, ChevronDown } from 'lucide-react';
import SearchBar from './SearchBar';
import { useAuth } from '../context/AuthContext';

export const Navbar = () => {
  const { user, logout, isAdmin } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [categoriesDropdownOpen, setCategoriesDropdownOpen] = useState(false);
  const [genresDropdownOpen, setGenresDropdownOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Scroll effect for glass sticky header
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menus on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setCategoriesDropdownOpen(false);
    setGenresDropdownOpen(false);
    setUserDropdownOpen(false);
  }, [location.pathname]);

  const genres = ['Action', 'Comedy', 'Drama', 'Sci-Fi', 'Thriller', 'Horror', 'Romance', 'Mystery', 'Crime'];

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'Movies', path: '/movies' },
    { label: 'Web Series', path: '/web-series' },
    { label: 'Bollywood', path: '/category/bollywood' },
    { label: 'Hollywood', path: '/category/hollywood' },
    { label: 'Tollywood', path: '/category/tollywood' },
    { label: 'South Hindi Dubbed', path: '/category/south-hindi-dubbed' },
    { label: 'Anime', path: '/category/anime' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled ? 'glass-nav shadow-2xl py-3' : 'bg-gradient-to-b from-black/90 via-black/50 to-transparent py-4'
      }`}
    >
      <div className="max-w-[1920px] mx-auto px-4 sm:px-8 md:px-12">
        <div className="flex items-center justify-between gap-4">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-2 group flex-shrink-0">
            <div className="w-10 h-10 rounded-xl bg-brand-red flex items-center justify-center shadow-glow transform group-hover:scale-105 transition-transform">
              <Film size={22} className="text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-black tracking-wider text-white flex items-center gap-1">
                AAKASH<span className="text-brand-red">MOVIES</span>
              </span>
              <span className="text-[9px] text-muted font-bold uppercase tracking-widest -mt-1">
                Cinematic Streaming
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden xl:flex items-center gap-5">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm font-semibold transition-colors hover:text-brand-red whitespace-nowrap ${
                  location.pathname === link.path ? 'text-brand-red font-bold' : 'text-neutral-300'
                }`}
              >
                {link.label}
              </Link>
            ))}

            {/* Genres Dropdown */}
            <div className="relative">
              <button
                onClick={() => setGenresDropdownOpen(!genresDropdownOpen)}
                aria-label="Toggle Genres Dropdown"
                aria-expanded={genresDropdownOpen}
                className="flex items-center gap-1 text-sm font-semibold text-neutral-300 hover:text-brand-red transition-colors whitespace-nowrap min-h-[38px]"
              >
                Genres <ChevronDown size={14} />
              </button>

              {genresDropdownOpen && (
                <div className="absolute top-full right-0 mt-2 w-48 bg-dark-card border border-dark-border rounded-xl shadow-2xl p-2 grid grid-cols-1 gap-1 z-50 animate-fade-in">
                  {genres.map((g) => (
                    <Link
                      key={g}
                      to={`/category/${g.toLowerCase()}`}
                      className="px-3 py-1.5 text-xs text-neutral-300 hover:text-white hover:bg-brand-red/20 rounded-lg transition-colors font-medium"
                    >
                      {g}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </nav>

          {/* SearchBar & User Action Icons */}
          <div className="flex items-center gap-3 flex-shrink-0">
            {/* Desktop Search */}
            <div className="hidden md:block w-48 lg:w-64 xl:w-72">
              <SearchBar />
            </div>

            {/* Favorites Button */}
            <Link
              to="/favorites"
              aria-label="Watchlist and Favorites"
              className="p-2 text-neutral-300 hover:text-brand-red hover:bg-white/10 rounded-full transition-colors relative flex-shrink-0 min-w-[40px] min-h-[40px] flex items-center justify-center"
              title="Watchlist / Favorites"
            >
              <Heart size={20} />
            </Link>

            {/* User Profile / Auth */}
            {user ? (
              <div className="relative flex-shrink-0">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  aria-label="User Account Menu"
                  className="flex items-center gap-2 p-1 rounded-full border border-brand-red/40 hover:border-brand-red transition-all"
                >
                  <img
                    src={user.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'}
                    alt={user.name || 'User Profile Avatar'}
                    width="32"
                    height="32"
                    className="w-8 h-8 rounded-full object-cover"
                  />
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 top-full mt-2 w-56 bg-dark-card border border-dark-border rounded-xl shadow-2xl p-2 z-50 animate-fade-in">
                    <div className="px-3 py-2 border-b border-white/10">
                      <p className="text-xs font-bold text-white truncate">{user.name}</p>
                      <p className="text-[11px] text-muted truncate">{user.email}</p>
                    </div>

                    <Link
                      to="/profile"
                      className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-neutral-200 hover:bg-white/10 rounded-lg transition-colors mt-1"
                    >
                      <User size={14} /> Profile Settings
                    </Link>

                    {isAdmin && (
                      <Link
                        to="/admin"
                        className="flex items-center gap-2 px-3 py-2 text-xs font-bold text-brand-red hover:bg-brand-red/10 rounded-lg transition-colors"
                      >
                        <ShieldAlert size={14} /> Admin Dashboard
                      </Link>
                    )}

                    <button
                      onClick={logout}
                      className="flex items-center gap-2 w-full text-left px-3 py-2 text-xs font-medium text-red-400 hover:bg-red-500/10 rounded-lg transition-colors mt-1"
                    >
                      <LogOut size={14} /> Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2 flex-shrink-0">
                <Link
                  to="/login"
                  className="px-4 py-2 text-xs font-bold text-white bg-brand-red hover:bg-brand-red-hover rounded-xl shadow-md transition-all hover:scale-105 whitespace-nowrap min-h-[38px] flex items-center"
                >
                  Login
                </Link>
              </div>
            )}

            {/* Mobile Hamburger Toggle Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle navigation menu"
              className="xl:hidden p-2 text-neutral-300 hover:text-white rounded-lg hover:bg-white/10 flex-shrink-0 min-w-[40px] min-h-[40px] flex items-center justify-center"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Search input bar */}
        <div className="md:hidden mt-3 pt-2">
          <SearchBar />
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="xl:hidden fixed inset-x-0 top-[70px] bg-dark-secondary/95 border-b border-dark-border backdrop-blur-xl p-6 shadow-2xl animate-slide-up z-40 max-h-[80vh] overflow-y-auto">
          <div className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="text-base font-bold text-neutral-200 hover:text-brand-red py-1 border-b border-white/5"
              >
                {link.label}
              </Link>
            ))}

            <div className="pt-2">
              <p className="text-xs font-bold uppercase tracking-wider text-muted mb-2">Genres</p>
              <div className="grid grid-cols-2 gap-2">
                {genres.map((g) => (
                  <Link
                    key={g}
                    to={`/category/${g.toLowerCase()}`}
                    className="text-xs text-neutral-300 hover:text-brand-red py-1"
                  >
                    {g}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
