import React from 'react';
import { Link } from 'react-router-dom';
import { Film, Heart, Shield, Twitter, Facebook, Github } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-dark-secondary border-t border-dark-border mt-20 pt-12 pb-8">
      <div className="max-w-[1920px] mx-auto px-4 sm:px-8 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Col 1: Brand */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-brand-red flex items-center justify-center shadow-glow">
                <Film size={18} className="text-white" />
              </div>
              <span className="text-lg font-black tracking-wider text-white">
                AAKASH<span className="text-brand-red">MOVIES</span>
              </span>
            </Link>
            <p className="text-xs text-muted leading-relaxed">
              Your premier dark cinematic gateway for legal movie information, trailers, cast details, ratings, and official streaming availability.
            </p>
            <div className="flex items-center gap-3 text-neutral-400">
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Follow AakashMovies on Twitter"
                className="p-2 bg-dark-card hover:bg-brand-red hover:text-white rounded-full transition-colors min-w-[36px] min-h-[36px] flex items-center justify-center"
              >
                <Twitter size={16} />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Follow AakashMovies on Facebook"
                className="p-2 bg-dark-card hover:bg-brand-red hover:text-white rounded-full transition-colors min-w-[36px] min-h-[36px] flex items-center justify-center"
              >
                <Facebook size={16} />
              </a>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="View AakashMovies repository on GitHub"
                className="p-2 bg-dark-card hover:bg-brand-red hover:text-white rounded-full transition-colors min-w-[36px] min-h-[36px] flex items-center justify-center"
              >
                <Github size={16} />
              </a>
            </div>
          </div>

          {/* Col 2: Navigation */}
          <div>
            <h2 className="text-xs font-bold text-white uppercase tracking-wider mb-4 border-l-2 border-brand-red pl-2">
              Explore Content
            </h2>
            <ul className="space-y-2 text-xs font-medium text-muted">
              <li><Link to="/" className="hover:text-white transition-colors">Home Page</Link></li>
              <li><Link to="/movies" className="hover:text-white transition-colors">Latest Movies</Link></li>
              <li><Link to="/web-series" className="hover:text-white transition-colors">Web Series Catalog</Link></li>
              <li><Link to="/category/bollywood" className="hover:text-white transition-colors">Bollywood Releases</Link></li>
              <li><Link to="/category/hollywood" className="hover:text-white transition-colors">Hollywood Blockbusters</Link></li>
              <li><Link to="/category/south-indian" className="hover:text-white transition-colors">South Indian Hits</Link></li>
            </ul>
          </div>

          {/* Col 3: Categories */}
          <div>
            <h2 className="text-xs font-bold text-white uppercase tracking-wider mb-4 border-l-2 border-brand-red pl-2">
              Popular Genres
            </h2>
            <ul className="space-y-2 text-xs font-medium text-muted">
              <li><Link to="/category/action" className="hover:text-white transition-colors">Action & Stunts</Link></li>
              <li><Link to="/category/sci-fi" className="hover:text-white transition-colors">Sci-Fi & Cyberpunk</Link></li>
              <li><Link to="/category/thriller" className="hover:text-white transition-colors">Thrillers & Crime</Link></li>
              <li><Link to="/category/comedy" className="hover:text-white transition-colors">Comedy Specials</Link></li>
              <li><Link to="/category/romance" className="hover:text-white transition-colors">Romantic Dramas</Link></li>
              <li><Link to="/category/horror" className="hover:text-white transition-colors">Supernatural Horror</Link></li>
            </ul>
          </div>

          {/* Col 4: Legal & Info */}
          <div>
            <h2 className="text-xs font-bold text-white uppercase tracking-wider mb-4 border-l-2 border-brand-red pl-2">
              Legal & Compliance
            </h2>
            <p className="text-xs text-muted mb-4 leading-relaxed">
              AakashMovies provides licensed metadata, official trailer links, and legal availability indicators. We do not host copyrighted video files or facilitate unauthorized downloads.
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-dark-card border border-dark-border text-xs text-neutral-300">
              <Shield size={14} className="text-brand-red" /> 100% Legal & Safe Platform
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between text-xs text-muted gap-4">
          <p>© {new Date().getFullYear()} AakashMovies. All rights reserved.</p>
          <div className="flex items-center gap-1">
            <span>Crafted with</span>
            <Heart size={14} className="text-brand-red fill-brand-red" />
            <span>for Movie Enthusiasts</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
