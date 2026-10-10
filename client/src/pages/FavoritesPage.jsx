import React, { useEffect, useState } from 'react';
import { Heart } from 'lucide-react';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import MovieGrid from '../components/MovieGrid';
import SEO from '../components/SEO';
import PageLoader from '../components/PageLoader';

export const FavoritesPage = () => {
  const { user } = useAuth();
  const [favoriteMovies, setFavoriteMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFavorites = async () => {
      setLoading(true);
      try {
        const res = await API.get('/favorites');
        if (res.data.success) {
          setFavoriteMovies(res.data.data);
        }
      } catch (err) {
        console.error('Failed to load favorites', err);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchFavorites();
    } else {
      setLoading(false);
    }
  }, [user]);

  if (loading) return <PageLoader />;

  return (
    <>
      <SEO title="My Favorites Watchlist" description="View and manage your saved favorite movies and web series on Dekzo." />

      <div className="max-w-[1920px] mx-auto px-4 sm:px-8 md:px-12 py-8">
        <div className="mb-8 border-b border-white/5 pb-4">
          <h1 className="text-3xl font-black text-white flex items-center gap-3">
            <Heart size={28} className="text-brand-red fill-brand-red" />
            My Saved Watchlist ({favoriteMovies.length})
          </h1>
          <p className="text-xs text-muted mt-1">Your bookmarked movies and web series for quick streaming access</p>
        </div>

        <MovieGrid
          movies={favoriteMovies}
          loading={loading}
          emptyTitle="Your Watchlist is Empty"
          emptyDesc="Click the heart icon on any movie or web series poster to save it to your personal favorites collection!"
        />
      </div>
    </>
  );
};

export default FavoritesPage;
