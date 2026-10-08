import React from 'react';
import { Link } from 'react-router-dom';
import { Film, ArrowLeft } from 'lucide-react';
import SEO from '../components/SEO';

export const NotFoundPage = () => {
  return (
    <>
      <SEO title="404 Page Not Found" description="The page you requested on AakashMovies could not be found." />

      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 py-16">
        <div className="w-20 h-20 rounded-full bg-brand-red/10 text-brand-red flex items-center justify-center mb-6 border border-brand-red/20 shadow-glow">
          <Film size={40} />
        </div>
        <h1 className="text-6xl font-black text-brand-red mb-2">404</h1>
        <h2 className="text-2xl font-bold text-white mb-3">Page Not Found</h2>
        <p className="text-muted text-sm max-w-md mb-8">
          The movie, series, or page you are looking for might have been moved, renamed, or no longer exists.
        </p>

        <Link
          to="/"
          className="px-6 py-3 bg-brand-red hover:bg-brand-red-hover text-white font-bold text-sm rounded-xl shadow-glow transition-all flex items-center gap-2"
        >
          <ArrowLeft size={18} /> Go Back Home
        </Link>
      </div>
    </>
  );
};

export default NotFoundPage;
