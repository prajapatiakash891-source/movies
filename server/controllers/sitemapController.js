import Movie from '../models/Movie.js';
import Series from '../models/Series.js';
import Genre from '../models/Genre.js';

// Production canonical base URL
const BASE_URL = 'https://dekzo.vercel.app';

// Primary static public pages
const STATIC_PAGES = [
  { path: '/', priority: '1.0', changefreq: 'daily' },
  { path: '/movies', priority: '0.8', changefreq: 'daily' },
  { path: '/web-series', priority: '0.8', changefreq: 'daily' },
];

// Pre-defined regional categories in the platform
const REGIONAL_CATEGORIES = [
  'bollywood',
  'hollywood',
  'tollywood',
  'south-hindi-dubbed',
  'anime',
  'punjabi',
  'south-indian',
];

/**
 * Escapes special XML characters to prevent XML parsing syntax errors
 */
function escapeXml(unsafe) {
  if (!unsafe) return '';
  return String(unsafe).replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case '<':
        return '&lt;';
      case '>':
        return '&gt;';
      case '&':
        return '&amp;';
      case '\'':
        return '&apos;';
      case '"':
        return '&quot;';
      default:
        return c;
    }
  });
}

/**
 * Formats date into YYYY-MM-DD format for XML sitemap compliance
 */
function formatDate(date) {
  if (!date) return null;
  const d = new Date(date);
  if (isNaN(d.getTime())) return null;
  return d.toISOString().split('T')[0];
}

/**
 * @desc    Generate dynamic XML sitemap
 * @route   GET /sitemap.xml
 * @access  Public
 */
export const getSitemap = async (req, res, next) => {
  try {
    const urlMap = new Map();

    const addUrl = (path, priority = '0.7', changefreq = 'weekly', lastmod = null) => {
      const cleanPath = path.startsWith('/') ? path : `/${path}`;
      const fullUrl = `${BASE_URL}${cleanPath}`;
      if (!urlMap.has(fullUrl)) {
        urlMap.set(fullUrl, { loc: fullUrl, priority, changefreq, lastmod });
      }
    };

    // 1. Add core static pages
    STATIC_PAGES.forEach((page) => {
      addUrl(page.path, page.priority, page.changefreq);
    });

    // 2. Add regional categories
    REGIONAL_CATEGORIES.forEach((cat) => {
      addUrl(`/category/${cat}`, '0.7', 'weekly');
    });

    // 3. Query dynamic content from database with strict 3.5s timeout protection
    try {
      const dbPromise = Promise.all([
        Genre.find().select('slug updatedAt createdAt').lean().maxTimeMS(3000),
        Movie.find().select('slug updatedAt createdAt').lean().maxTimeMS(3000),
        Series.find().select('slug updatedAt createdAt').lean().maxTimeMS(3000),
      ]);

      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Sitemap DB query timeout')), 3500)
      );

      const [genres, movies, series] = await Promise.race([dbPromise, timeoutPromise]);

      if (genres && genres.length > 0) {
        genres.forEach((g) => {
          if (g.slug) {
            const lastmod = formatDate(g.updatedAt || g.createdAt);
            addUrl(`/category/${g.slug}`, '0.7', 'weekly', lastmod);
          }
        });
      }

      if (movies && movies.length > 0) {
        movies.forEach((m) => {
          if (m.slug) {
            const lastmod = formatDate(m.updatedAt || m.createdAt);
            addUrl(`/movie/${m.slug}`, '0.7', 'weekly', lastmod);
          }
        });
      }

      if (series && series.length > 0) {
        series.forEach((s) => {
          if (s.slug) {
            const lastmod = formatDate(s.updatedAt || s.createdAt);
            addUrl(`/series/${s.slug}`, '0.7', 'weekly', lastmod);
          }
        });
      }
    } catch (dbError) {
      console.error('[Sitemap Controller] Database query skipped or timed out, serving static/regional URLs:', dbError.message);
    }

    // 4. Build standard XML string
    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
    xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

    urlMap.forEach((entry) => {
      xml += `  <url>\n`;
      xml += `    <loc>${escapeXml(entry.loc)}</loc>\n`;
      if (entry.lastmod) {
        xml += `    <lastmod>${entry.lastmod}</lastmod>\n`;
      }
      xml += `    <changefreq>${entry.changefreq}</changefreq>\n`;
      xml += `    <priority>${entry.priority}</priority>\n`;
      xml += `  </url>\n`;
    });

    xml += `</urlset>`;

    res.header('Content-Type', 'application/xml; charset=utf-8');
    res.header('Cache-Control', 'public, max-age=3600, s-maxage=3600');
    return res.status(200).send(xml);
  } catch (error) {
    console.error('[Sitemap Controller] Failed to generate XML sitemap:', error);
    next(error);
  }
};
