import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';

<<<<<<< HEAD
const BASE_URL = (import.meta.env.VITE_SITE_URL && !import.meta.env.VITE_SITE_URL.includes('vercel.app'))
  ? import.meta.env.VITE_SITE_URL
  : 'https://moviesaura.site';
=======
const BASE_URL = 'https://moviesaura.vercel.app';
>>>>>>> 899ce188272975a7a8903d266f2bfbcd8ba71b3e
const DEFAULT_SITE_TITLE = 'MoviesAura';
const DEFAULT_DESCRIPTION =
  'Discover and stream high-quality Bollywood, Hollywood Dual Audio, South Indian Hindi Dubbed movies and trending Web Series in HD on MoviesAura.';
const DEFAULT_IMAGE = `${BASE_URL}/favicon.svg`;
const DEFAULT_KEYWORDS =
  'movies, web series, watch movies online, bollywood movies, hollywood dual audio, south hindi dubbed, tollywood movies, anime streaming, moviesaura';

const SEO = ({
  title,
  description,
  keywords,
  image,
  type = 'website',
  canonicalUrl,
  schema,
  noindex = false,
}) => {
  const location = useLocation();

  // Construct complete title without duplicate branding
  let fullTitle = '';
  if (!title) {
    fullTitle = `${DEFAULT_SITE_TITLE} — Watch Latest Movies & Web Series Online in HD`;
  } else if (title.includes(DEFAULT_SITE_TITLE)) {
    fullTitle = title;
  } else {
    fullTitle = `${title} — ${DEFAULT_SITE_TITLE}`;
  }

  const metaDesc = description || DEFAULT_DESCRIPTION;

  // Resolve Canonical URL
  let resolvedCanonical = '';
  if (canonicalUrl) {
<<<<<<< HEAD
    const cleanUrl = String(canonicalUrl).replace(/https?:\/\/moviesaura\.vercel\.app/g, BASE_URL);
    resolvedCanonical = cleanUrl.startsWith('http')
      ? cleanUrl
      : `${BASE_URL}${cleanUrl.startsWith('/') ? cleanUrl : `/${cleanUrl}`}`;
=======
    resolvedCanonical = canonicalUrl.startsWith('http')
      ? canonicalUrl
      : `${BASE_URL}${canonicalUrl.startsWith('/') ? canonicalUrl : `/${canonicalUrl}`}`;
>>>>>>> 899ce188272975a7a8903d266f2bfbcd8ba71b3e
  } else if (location && location.pathname) {
    resolvedCanonical = `${BASE_URL}${location.pathname === '/' ? '' : location.pathname}`;
  } else {
    resolvedCanonical = BASE_URL;
  }

  // Resolve OG Image URL
  let resolvedImage = DEFAULT_IMAGE;
  if (image) {
<<<<<<< HEAD
    const cleanImage = String(image).replace(/https?:\/\/moviesaura\.vercel\.app/g, BASE_URL);
    resolvedImage = cleanImage.startsWith('http')
      ? cleanImage
      : `${BASE_URL}${cleanImage.startsWith('/') ? cleanImage : `/${cleanImage}`}`;
=======
    resolvedImage = image.startsWith('http')
      ? image
      : `${BASE_URL}${image.startsWith('/') ? image : `/${image}`}`;
>>>>>>> 899ce188272975a7a8903d266f2bfbcd8ba71b3e
  }

  // Format keywords
  const metaKeywords = Array.isArray(keywords)
    ? keywords.join(', ')
    : keywords || DEFAULT_KEYWORDS;

  return (
    <Helmet>
      {/* Standard Metadata */}
      <title>{fullTitle}</title>
      <meta name="description" content={metaDesc} />
      <meta name="keywords" content={metaKeywords} />
      <meta
        name="robots"
        content={
          noindex
            ? 'noindex, nofollow'
            : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'
        }
      />
      <link rel="canonical" href={resolvedCanonical} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content={DEFAULT_SITE_TITLE} />
      <meta property="og:locale" content="en_US" />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={metaDesc} />
      <meta property="og:url" content={resolvedCanonical} />
      <meta property="og:image" content={resolvedImage} />
      <meta property="og:image:alt" content={fullTitle} />

      {/* Twitter Cards */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@MoviesAura" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={metaDesc} />
      <meta name="twitter:image" content={resolvedImage} />

      {/* Structured Data (Schema.org JSON-LD) */}
      {schema && (
        <script type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      )}
    </Helmet>
  );
};

export default SEO;
