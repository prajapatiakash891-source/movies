import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import API from '../services/api';
import MovieGrid from '../components/MovieGrid';
import FilterPanel from '../components/FilterPanel';
import Pagination from '../components/Pagination';
import SEO from '../components/SEO';

export const MoviesPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // Extract filter state from URL search params
  const currentFilters = {
    industry: searchParams.get('industry') || '',
    genre: searchParams.get('genre') || '',
    language: searchParams.get('language') || '',
    year: searchParams.get('year') || '',
    type: searchParams.get('type') || '',
    sort: searchParams.get('sort') || 'latest',
    search: searchParams.get('search') || '',
    page: parseInt(searchParams.get('page') || '1', 10),
  };

  const fetchMovies = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams();
      if (currentFilters.industry) queryParams.set('industry', currentFilters.industry);
      if (currentFilters.genre) queryParams.set('genre', currentFilters.genre);
      if (currentFilters.language) queryParams.set('language', currentFilters.language);
      if (currentFilters.year) queryParams.set('year', currentFilters.year);
      if (currentFilters.type) queryParams.set('type', currentFilters.type);
      if (currentFilters.sort) queryParams.set('sort', currentFilters.sort);
      if (currentFilters.search) queryParams.set('search', currentFilters.search);
      queryParams.set('page', currentFilters.page);
      queryParams.set('limit', '18');

      const res = await API.get(`/movies?${queryParams.toString()}`);
      if (res.data.success) {
        setMovies(res.data.data);
        setTotalPages(res.data.totalPages);
        setTotalCount(res.data.total);
      }
    } catch (err) {
      console.error('Error fetching movies', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMovies();
  }, [searchParams]);

  const handleFilterChange = (newFilters) => {
    const params = new URLSearchParams();
    Object.keys(newFilters).forEach((key) => {
      if (newFilters[key]) params.set(key, newFilters[key]);
    });
    params.set('page', '1'); // reset to first page on filter change
    setSearchParams(params);
  };

  const handleResetFilters = () => {
    setSearchParams({});
  };

  const handlePageChange = (page) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', page);
    setSearchParams(params);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const isSearchMode = Boolean(currentFilters.search);
  const catalogTitle = isSearchMode
    ? `Search Results for "${currentFilters.search}"`
    : currentFilters.type === 'movie'
    ? 'All Movies Catalog'
    : currentFilters.type === 'series'
    ? 'All Web Series Catalog'
    : 'All Movies & Series Catalog';

  const moviesBreadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://moviesaura.vercel.app/',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Movies Catalog',
        item: 'https://moviesaura.vercel.app/movies',
      },
    ],
  };

  const moviesCollectionSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'All Movies & Series Catalog — MoviesAura',
    description:
      'Browse through thousands of latest Bollywood, Hollywood, South Indian movies and trending web series on MoviesAura.',
    url: 'https://moviesaura.vercel.app/movies',
  };

  return (
    <>
      <SEO
        title={isSearchMode ? `Search: ${currentFilters.search}` : 'Explore All Movies & Web Series Catalog'}
        description="Browse and stream thousands of latest Bollywood, Hollywood Dual Audio, and South Indian movies. Filter by genre, year, industry, and ratings on MoviesAura."
        canonicalUrl="https://moviesaura.vercel.app/movies"
        keywords={[
          'all movies',
          'movies catalog',
          'bollywood movies',
          'hollywood dual audio',
          'south indian movies',
          'watch movies online hd',
          'latest movies 2026',
          'moviesaura',
        ]}
        schema={[moviesBreadcrumbSchema, moviesCollectionSchema]}
      />

      <div className="max-w-[1920px] mx-auto px-4 sm:px-8 md:px-12 py-8">
        {/* Page Header */}
        <div className="mb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-white flex items-center gap-2">
              <span className="w-2 h-8 bg-brand-red rounded-full"></span>
              {catalogTitle}
            </h1>
            <p className="text-xs text-muted mt-1">
              Showing {totalCount} titles matching your criteria
            </p>
          </div>
        </div>

        {/* Filter & Sort Control Panel */}
        <FilterPanel
          filters={currentFilters}
          onChange={handleFilterChange}
          onReset={handleResetFilters}
        />

        {/* Movies Grid */}
        <MovieGrid
          movies={movies}
          loading={loading}
          emptyTitle="No Movies Found"
          emptyDesc="We couldn’t find any movies matching the selected filters. Try broadening your criteria."
          onReset={handleResetFilters}
        />

        {/* Pagination */}
        <Pagination
          currentPage={currentFilters.page}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>
    </>
  );
};

export default MoviesPage;
