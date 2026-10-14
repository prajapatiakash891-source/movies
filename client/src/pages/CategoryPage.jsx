import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import API from '../services/api';
import MovieGrid from '../components/MovieGrid';
import Pagination from '../components/Pagination';
import SEO from '../components/SEO';

const CATEGORY_SEO_MAP = {
  bollywood: {
    title: 'Watch Latest Bollywood Movies & Hindi Web Series Online HD',
    heading: 'Bollywood Cinema & Hindi Web Series',
    description:
      'Explore and stream latest Bollywood movies, blockbuster Hindi releases, and trending Hindi web series in 1080p and 4K Ultra HD on MoviesAura.',
    keywords: [
      'bollywood movies',
      'latest hindi movies',
      'watch bollywood online',
      'hindi cinema',
      'bollywood web series',
      'hindi movies hd',
      'new hindi movies',
      'moviesaura',
    ],
  },
  hollywood: {
    title: 'Hollywood Movies & English Web Series (Dual Audio Hindi & English)',
    heading: 'Hollywood Cinema & Dual Audio Blockbusters',
    description:
      'Stream blockbuster Hollywood movies, Dual Audio Hindi-English films, superhero action, sci-fi and top English web series in HD on MoviesAura.',
    keywords: [
      'hollywood movies',
      'hollywood dual audio',
      'hindi dubbed hollywood',
      'english web series',
      'hollywood blockbusters',
      'watch hollywood movies online',
      'moviesaura',
    ],
  },
  tollywood: {
    title: 'Tollywood Telugu Movies & Shows in HD | MoviesAura',
    heading: 'Tollywood Telugu Cinema & Shows',
    description:
      'Watch latest Tollywood Telugu movies, mass action cinema, and popular Telugu web series with Hindi dubbed audio and English subtitles.',
    keywords: [
      'tollywood movies',
      'telugu movies online',
      'telugu mass action',
      'latest tollywood',
      'telugu cinema hd',
      'telugu web series',
      'moviesaura',
    ],
  },
  'south-hindi-dubbed': {
    title: 'South Hindi Dubbed Movies — Latest Tamil, Telugu & Kannada Blockbusters',
    heading: 'South Indian Hindi Dubbed Movies',
    description:
      'Explore high-octane South Indian Hindi dubbed movies. Stream latest Tamil, Telugu, Kannada and Malayalam action blockbusters in Hindi HD on MoviesAura.',
    keywords: [
      'south hindi dubbed movies',
      'south movies in hindi',
      'latest south dubbed',
      'tamil hindi dubbed',
      'telugu hindi dubbed',
      'south action blockbusters',
      'moviesaura',
    ],
  },
  anime: {
    title: 'Watch Anime Series & Movies Online (Sub & Dub) in HD | MoviesAura',
    heading: 'Anime Series & Movies',
    description:
      'Stream trending Anime series, action shonen, anime movies, and latest seasonal episodes with English subtitles and dual audio on MoviesAura.',
    keywords: [
      'watch anime online',
      'anime series',
      'anime movies',
      'english sub anime',
      'anime dual audio',
      'stream anime hd',
      'anime episodes free',
      'moviesaura',
    ],
  },
  punjabi: {
    title: 'Punjabi Movies & Pollywood Cinema HD | MoviesAura',
    heading: 'Punjabi Cinema & Pollywood Films',
    description:
      'Watch latest Punjabi comedy, drama, and romance films. Stream popular Pollywood movies and Punjabi web series in high quality on MoviesAura.',
    keywords: [
      'punjabi movies',
      'pollywood cinema',
      'latest punjabi films',
      'punjabi comedy movies',
      'watch punjabi movies online',
      'punjabi movies hd',
      'moviesaura',
    ],
  },
  'south-indian': {
    title: 'South Indian Cinema — Tamil, Telugu, Malayalam & Kannada Movies',
    heading: 'South Indian Cinema',
    description:
      'Discover top-rated South Indian movies across Tamil, Telugu, Malayalam, and Kannada cinema with multi-language audio and English subtitles on MoviesAura.',
    keywords: [
      'south indian cinema',
      'south movies',
      'tamil cinema',
      'malayalam movies',
      'kannada films',
      'south blockbusters online',
      'moviesaura',
    ],
  },
};

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

  const cleanSlug = (slug || '').toLowerCase();
  const categoryConfig = CATEGORY_SEO_MAP[cleanSlug] || {
    title: `${data.categoryName || cleanSlug.replace(/-/g, ' ')} Movies & Series`,
    heading: data.categoryName || cleanSlug.replace(/-/g, ' '),
    description: `Browse latest ${data.categoryName || cleanSlug.replace(/-/g, ' ')} movies and web series in HD quality on MoviesAura.`,
    keywords: [
      `${cleanSlug} movies`,
      `watch ${cleanSlug} online`,
      'moviesaura',
      'hd movies',
    ],
  };

  const fetchCategoryContent = async (page = 1) => {
    setLoading(true);
    try {
      const res = await API.get(`/categories/${cleanSlug}?page=${page}`);
      if (res.data.success) {
        setData(res.data);
      }
    } catch (err) {
      console.error('Error fetching category content', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategoryContent(1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [cleanSlug]);

  const breadcrumbSchema = {
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
      {
        '@type': 'ListItem',
        position: 3,
        name: categoryConfig.heading,
        item: `https://moviesaura.vercel.app/category/${cleanSlug}`,
      },
    ],
  };

  const collectionSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: categoryConfig.title,
    description: categoryConfig.description,
    url: `https://moviesaura.vercel.app/category/${cleanSlug}`,
  };

  return (
    <>
      <SEO
        title={categoryConfig.title}
        description={categoryConfig.description}
        keywords={categoryConfig.keywords}
        canonicalUrl={`https://moviesaura.vercel.app/category/${cleanSlug}`}
        schema={[breadcrumbSchema, collectionSchema]}
      />

      <div className="max-w-[1920px] mx-auto px-4 sm:px-8 md:px-12 py-8">
        <div className="mb-8 border-b border-white/5 pb-4">
          <h1 className="text-3xl font-black text-white flex items-center gap-2 capitalize">
            <span className="w-2 h-8 bg-brand-red rounded-full"></span>
            {categoryConfig.heading}
          </h1>
          <p className="text-xs text-muted mt-1">
            Showing top rated titles in {categoryConfig.heading} ({data.total} total items)
          </p>
        </div>

        {/* Movies in Category */}
        <MovieGrid
          movies={data.movies}
          loading={loading}
          emptyTitle={`No Movies Found in ${categoryConfig.heading}`}
          emptyDesc="We are constantly adding new titles. Check back soon!"
        />

        {data.totalPages > 1 && (
          <Pagination
            currentPage={data.currentPage}
            totalPages={data.totalPages}
            onPageChange={(page) => {
              fetchCategoryContent(page);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}
      </div>
    </>
  );
};

export default CategoryPage;
