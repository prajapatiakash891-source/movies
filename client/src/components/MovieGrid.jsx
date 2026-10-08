import React from 'react';
import MovieCard from './MovieCard';
import { SkeletonGrid } from './SkeletonCard';
import EmptyState from './EmptyState';

export const MovieGrid = ({ movies = [], loading = false, emptyTitle, emptyDesc, onReset }) => {
  if (loading) {
    return <SkeletonGrid count={12} />;
  }

  if (!movies || movies.length === 0) {
    return <EmptyState title={emptyTitle} description={emptyDesc} onReset={onReset} />;
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 3xl:grid-cols-8 gap-4 md:gap-6 animate-fade-in">
      {movies.map((movie) => (
        <MovieCard key={movie._id || movie.slug} movie={movie} />
      ))}
    </div>
  );
};

export default MovieGrid;
