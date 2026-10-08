import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import API from '../services/api';
import MovieGrid from '../components/MovieGrid';
import FilterPanel from '../components/FilterPanel';
import Pagination from '../components/Pagination';
import SEO from '../components/SEO';

export const WebSeriesPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [seriesList, setSeriesList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const currentFilters = {
    industry: searchParams.get('industry') || '',
    genre: searchParams.get('genre') || '',
    language: searchParams.get('language') || '',
    year: searchParams.get('year') || '',
    sort: searchParams.get('sort') || 'latest',
    search: searchParams.get('search') || '',
    page: parseInt(searchParams.get('page') || '1', 10),
  };

  const fetchSeries = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams();
      if (currentFilters.industry) queryParams.set('industry', currentFilters.industry);
      if (currentFilters.genre) queryParams.set('genre', currentFilters.genre);
      if (currentFilters.language) queryParams.set('language', currentFilters.language);
      if (currentFilters.year) queryParams.set('year', currentFilters.year);
      if (currentFilters.sort) queryParams.set('sort', currentFilters.sort);
      if (currentFilters.search) queryParams.set('search', currentFilters.search);
      queryParams.set('page', currentFilters.page);
      queryParams.set('limit', '18');

      const res = await API.get(`/series?${queryParams.toString()}`);
      if (res.data.success) {
        // Map series objects to MovieCard readable format
        const formatted = res.data.data.map((s) => ({
          ...s,
          type: 'series',
        }));
        setSeriesList(formatted);
        setTotalPages(res.data.totalPages);
        setTotalCount(res.data.total);
      }
    } catch (err) {
      console.error('Error fetching series', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSeries();
  }, [searchParams]);

  const handleFilterChange = (newFilters) => {
    const params = new URLSearchParams();
    Object.keys(newFilters).forEach((key) => {
      if (newFilters[key]) params.set(key, newFilters[key]);
    });
    params.set('page', '1');
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

  return (
    <>
      <SEO
        title="Web Series & Binge-Worthy TV Shows"
        description="Stream the best web series, multi-season crime dramas, sci-fi shows, and comedies on AakashMovies."
      />

      <div className="max-w-[1920px] mx-auto px-4 sm:px-8 md:px-12 py-8">
        <div className="mb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-white flex items-center gap-2">
              <span className="w-2 h-8 bg-brand-red rounded-full"></span>
              Trending Web Series
            </h1>
            <p className="text-xs text-muted mt-1">
              Showing {totalCount} multi-season web series
            </p>
          </div>
        </div>

        <FilterPanel
          filters={currentFilters}
          onChange={handleFilterChange}
          onReset={handleResetFilters}
        />

        <MovieGrid
          movies={seriesList}
          loading={loading}
          emptyTitle="No Web Series Found"
          emptyDesc="No series match your current filter selections."
          onReset={handleResetFilters}
        />

        <Pagination
          currentPage={currentFilters.page}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>
    </>
  );
};

export default WebSeriesPage;
