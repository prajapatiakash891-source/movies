import React from 'react';
import { Filter, RotateCcw } from 'lucide-react';

const GENRES = ['Action', 'Adventure', 'Comedy', 'Drama', 'Sci-Fi', 'Thriller', 'Romance', 'Horror', 'Mystery', 'Crime'];
const LANGUAGES = ['Hindi', 'English', 'Tamil', 'Telugu', 'Kannada', 'Malayalam'];
const INDUSTRIES = ['Bollywood', 'Hollywood', 'Tollywood', 'South Hindi Dubbed', 'Anime', 'Punjabi', 'Other'];
const YEARS = [2026, 2025, 2024, 2023, 2022, 2021, 2020];

export const FilterPanel = ({ filters, onChange, onReset }) => {
  const handleChange = (field, value) => {
    onChange({ ...filters, [field]: value });
  };

  return (
    <div className="bg-dark-card border border-dark-border rounded-xl p-4 mb-6 shadow-md">
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/5">
        <div className="flex items-center gap-2 font-bold text-white text-sm">
          <Filter size={16} className="text-brand-red" />
          <span>Filter & Sort Content</span>
        </div>
        <button
          onClick={onReset}
          className="text-xs text-muted hover:text-brand-red flex items-center gap-1 transition-colors"
        >
          <RotateCcw size={13} /> Clear All
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
        {/* Industry / Category Filter */}
        <div>
          <label htmlFor="filter-industry" className="block text-[11px] font-semibold text-muted uppercase tracking-wider mb-1">
            Industry / Category
          </label>
          <select
            id="filter-industry"
            value={filters.industry || ''}
            onChange={(e) => handleChange('industry', e.target.value)}
            className="w-full bg-dark-secondary text-white text-xs border border-dark-border rounded-lg p-2 focus:border-brand-red focus:outline-none font-bold text-brand-red min-h-[36px]"
          >
            <option value="">All Industries</option>
            {INDUSTRIES.map((ind) => (
              <option key={ind} value={ind}>{ind}</option>
            ))}
          </select>
        </div>

        {/* Genre Filter */}
        <div>
          <label htmlFor="filter-genre" className="block text-[11px] font-semibold text-muted uppercase tracking-wider mb-1">
            Genre
          </label>
          <select
            id="filter-genre"
            value={filters.genre || ''}
            onChange={(e) => handleChange('genre', e.target.value)}
            className="w-full bg-dark-secondary text-white text-xs border border-dark-border rounded-lg p-2 focus:border-brand-red focus:outline-none min-h-[36px]"
          >
            <option value="">All Genres</option>
            {GENRES.map((g) => (
              <option key={g} value={g}>{g}</option>
            ))}
          </select>
        </div>

        {/* Language Filter */}
        <div>
          <label htmlFor="filter-language" className="block text-[11px] font-semibold text-muted uppercase tracking-wider mb-1">
            Language
          </label>
          <select
            id="filter-language"
            value={filters.language || ''}
            onChange={(e) => handleChange('language', e.target.value)}
            className="w-full bg-dark-secondary text-white text-xs border border-dark-border rounded-lg p-2 focus:border-brand-red focus:outline-none min-h-[36px]"
          >
            <option value="">All Languages</option>
            {LANGUAGES.map((l) => (
              <option key={l} value={l}>{l}</option>
            ))}
          </select>
        </div>

        {/* Year Filter */}
        <div>
          <label htmlFor="filter-year" className="block text-[11px] font-semibold text-muted uppercase tracking-wider mb-1">
            Year
          </label>
          <select
            id="filter-year"
            value={filters.year || ''}
            onChange={(e) => handleChange('year', e.target.value)}
            className="w-full bg-dark-secondary text-white text-xs border border-dark-border rounded-lg p-2 focus:border-brand-red focus:outline-none min-h-[36px]"
          >
            <option value="">All Years</option>
            {YEARS.map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>

        {/* Type Filter */}
        <div>
          <label htmlFor="filter-type" className="block text-[11px] font-semibold text-muted uppercase tracking-wider mb-1">
            Type
          </label>
          <select
            id="filter-type"
            value={filters.type || ''}
            onChange={(e) => handleChange('type', e.target.value)}
            className="w-full bg-dark-secondary text-white text-xs border border-dark-border rounded-lg p-2 focus:border-brand-red focus:outline-none min-h-[36px]"
          >
            <option value="">All Content</option>
            <option value="movie">Movies Only</option>
            <option value="series">Web Series Only</option>
          </select>
        </div>

        {/* Sort By */}
        <div>
          <label htmlFor="filter-sort" className="block text-[11px] font-semibold text-muted uppercase tracking-wider mb-1">
            Sort By
          </label>
          <select
            id="filter-sort"
            value={filters.sort || 'latest'}
            onChange={(e) => handleChange('sort', e.target.value)}
            className="w-full bg-dark-secondary text-white text-xs border border-dark-border rounded-lg p-2 focus:border-brand-red focus:outline-none font-semibold text-brand-red min-h-[36px]"
          >
            <option value="latest">Latest Release</option>
            <option value="popular">Most Popular</option>
            <option value="highest_rated">Highest Rated</option>
            <option value="oldest">Oldest Release</option>
            <option value="a_z">Title (A-Z)</option>
            <option value="z_a">Title (Z-A)</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default FilterPanel;
