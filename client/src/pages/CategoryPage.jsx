import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import API from '../services/api';
import MovieGrid from '../components/MovieGrid';
import Pagination from '../components/Pagination';
import SEO from '../components/SEO';
import PageLoader from '../components/PageLoader';

export const CategoryPage = () => {
  const { slug } = useParams();
  const [data, setData] = useState({
    categoryName: '',
    movies: [],
    series: [],
    total: 0,
    totalPages: 1,
    currentPage: 1,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategoryContent = async () => {
      setLoading(true);
      try {
        const res = await API.get(`/categories/${slug}`);
        if (res.data.success) {
          setData(res.data);
        }
      } catch (err) {
        console.error('Error fetching category content', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCategoryContent();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [slug]);

  return (
    <>
      <SEO
        title={`${data.categoryName || slug}`}
        description={`Browse latest ${data.categoryName || slug} movies and web series on AakashMovies.`}
      />

      <div className="max-w-[1920px] mx-auto px-4 sm:px-8 md:px-12 py-8">
        <div className="mb-8 border-b border-white/5 pb-4">
          <h1 className="text-3xl font-black text-white flex items-center gap-2 capitalize">
            <span className="w-2 h-8 bg-brand-red rounded-full"></span>
            {data.categoryName || slug}
          </h1>
          <p className="text-xs text-muted mt-1">
            Showing top rated titles in {data.categoryName || slug} ({data.total} total items)
          </p>
        </div>

        {/* Movies in Category */}
        <MovieGrid
          movies={data.movies}
          loading={loading}
          emptyTitle={`No Movies Found in ${data.categoryName || slug}`}
          emptyDesc="We are constantly adding new titles. Check back soon!"
        />

        <Pagination
          currentPage={data.currentPage}
          totalPages={data.totalPages}
          onPageChange={(page) => {
            // Fetch updated page
          }}
        />
      </div>
    </>
  );
};

export default CategoryPage;
