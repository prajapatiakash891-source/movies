import React, { useEffect, useState } from 'react';
import API from '../services/api';
import Hero from '../components/Hero';
import MovieCarousel from '../components/MovieCarousel';
import MovieGrid from '../components/MovieGrid';
import SEO from '../components/SEO';
import { SkeletonGrid } from '../components/SkeletonCard';

export const HomePage = () => {
  const [data, setData] = useState({
    featured: [],
    trending: [],
    popularMovies: [],
    latestMovies: [],
    popularSeries: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHomepageData = async () => {
      try {
        const res = await API.get('/movies/featured');
        if (res.data.success) {
          setData(res.data);
        }
      } catch (err) {
        console.error('Failed to load homepage content', err);
      } finally {
        setLoading(false);
      }
    };
    fetchHomepageData();
  }, []);

  const featuredMovies = data.featured && data.featured.length > 0 ? data.featured : data.latestMovies;

  return (
    <>
      <SEO
        title="Watch Latest Movies & Web Series Online"
        description="AakashMovies is your dark cinematic destination to discover trending Bollywood, Hollywood, South Indian movies and Web Series in 4K Ultra HD."
      />

      {/* Hero Banner Slider */}
      {loading ? (
        <div className="w-full min-h-[75vh] md:min-h-[85vh] bg-neutral-900/60 animate-pulse flex items-end p-8 md:p-16">
          <div className="space-y-4 max-w-xl">
            <div className="h-6 w-32 bg-neutral-800 rounded-lg" />
            <div className="h-12 w-3/4 bg-neutral-800 rounded-xl" />
            <div className="h-4 w-full bg-neutral-800/80 rounded" />
            <div className="h-10 w-40 bg-brand-red/40 rounded-xl" />
          </div>
        </div>
      ) : (
        <Hero movies={featuredMovies} />
      )}

      {/* Main Container */}
      <div className="max-w-[1920px] mx-auto px-4 sm:px-8 md:px-12 space-y-12 py-8">
        {loading ? (
          <div className="space-y-12">
            <div>
              <div className="h-6 w-48 bg-neutral-800 rounded mb-4 animate-pulse" />
              <SkeletonGrid count={6} />
            </div>
            <div>
              <div className="h-6 w-48 bg-neutral-800 rounded mb-4 animate-pulse" />
              <SkeletonGrid count={6} />
            </div>
          </div>
        ) : (
          <>
            {/* Trending Section */}
            <MovieCarousel
              title="Trending Now"
              subtitle="Top watched movies and series this week"
              movies={data.trending}
            />

            {/* Latest Movies Section */}
            <MovieCarousel
              title="Latest Movies"
              subtitle="Recently released theatrical & OTT premieres"
              movies={data.latestMovies}
            />

            {/* Popular Web Series Section */}
            <MovieCarousel
              title="Popular Web Series"
              subtitle="Binge-worthy series and original shows"
              movies={data.popularSeries}
            />

            {/* Popular Movies Grid */}
            <section className="pt-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-extrabold text-white flex items-center gap-2">
                    <span className="w-1.5 h-6 bg-brand-red rounded-full"></span>
                    Popular Movies
                  </h2>
                  <p className="text-xs text-muted mt-1">Highest rated fan favorites</p>
                </div>
              </div>
              <MovieGrid movies={data.popularMovies} />
            </section>
          </>
        )}
      </div>
    </>
  );
};

export default HomePage;
