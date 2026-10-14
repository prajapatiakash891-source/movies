import Movie from '../models/Movie.js';
import Series from '../models/Series.js';
import Genre from '../models/Genre.js';

// Production canonical base URL
const BASE_URL = 'https://moviesaura.vercel.app';

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
    xml += `<?xml-stylesheet type="text/xsl" href="/sitemap.xsl"?>\n`;
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

/**
 * @desc    Serve sitemap styling XSL stylesheet
 * @route   GET /sitemap.xsl
 * @access  Public
 */
export const getSitemapXsl = (req, res) => {
  const xsl = `<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="2.0"
                xmlns:html="http://www.w3.org/TR/REC-html40"
                xmlns:sitemap="http://www.sitemaps.org/schemas/sitemap/0.9"
                xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
  <xsl:output method="html" version="1.0" encoding="UTF-8" indent="yes"/>
  <xsl:template match="/">
    <html xmlns="http://www.w3.org/1999/xhtml" lang="en">
      <head>
        <title>MoviesAura XML Sitemap</title>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <style type="text/css">
          * { box-sizing: border-box; margin: 0; padding: 0; }
          body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
            background-color: #080808;
            color: #e5e5e5;
            padding: 2.5rem 1.5rem;
            line-height: 1.6;
          }
          .container { max-width: 1200px; margin: 0 auto; }
          header {
            background: linear-gradient(135deg, #141414 0%, #1a1a1a 100%);
            border: 1px solid #262626;
            border-radius: 1rem;
            padding: 2rem;
            margin-bottom: 2rem;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
          }
          .brand-row { display: flex; align-items: center; gap: 0.75rem; margin-bottom: 0.75rem; }
          .brand-badge {
            background-color: #e50914;
            color: #ffffff;
            font-weight: 800;
            font-size: 0.75rem;
            text-transform: uppercase;
            letter-spacing: 0.1em;
            padding: 0.25rem 0.6rem;
            border-radius: 0.375rem;
            display: inline-block;
          }
          h1 { color: #ffffff; font-size: 1.875rem; font-weight: 800; letter-spacing: -0.025em; }
          p.subtitle { color: #a3a3a3; font-size: 0.95rem; margin-top: 0.5rem; }
          .stats-bar {
            display: flex; gap: 1.5rem; margin-top: 1.5rem; padding-top: 1.25rem;
            border-top: 1px solid #262626; flex-wrap: wrap;
          }
          .stat-item { display: flex; flex-direction: column; }
          .stat-label { font-size: 0.75rem; color: #737373; text-transform: uppercase; font-weight: 600; }
          .stat-value { font-size: 1.25rem; font-weight: 700; color: #ffffff; }
          .table-wrapper {
            background-color: #121212; border: 1px solid #262626; border-radius: 1rem;
            overflow: hidden; box-shadow: 0 10px 25px rgba(0, 0, 0, 0.4);
          }
          table { width: 100%; border-collapse: collapse; text-align: left; font-size: 0.875rem; }
          thead th {
            background-color: #181818; color: #a3a3a3; padding: 1rem 1.25rem;
            font-weight: 600; text-transform: uppercase; font-size: 0.75rem; letter-spacing: 0.05em;
            border-bottom: 1px solid #262626;
          }
          tbody tr { border-bottom: 1px solid #1e1e1e; transition: background-color 0.15s ease; }
          tbody tr:hover { background-color: #1a1a1a; }
          tbody tr:last-child { border-bottom: none; }
          td { padding: 1rem 1.25rem; vertical-align: middle; }
          td.url a { color: #fca5a5; text-decoration: none; font-weight: 500; word-break: break-all; }
          td.url a:hover { color: #ef4444; text-decoration: underline; }
          .badge { display: inline-block; padding: 0.2rem 0.6rem; border-radius: 9999px; font-size: 0.75rem; font-weight: 600; text-transform: uppercase; }
          .badge-freq { background-color: #262626; color: #d4d4d4; }
          .badge-priority { background-color: rgba(229, 9, 20, 0.15); color: #f87171; border: 1px solid rgba(229, 9, 20, 0.3); }
          .text-muted { color: #737373; }
          footer { margin-top: 2rem; text-align: center; color: #737373; font-size: 0.8rem; }
          footer a { color: #a3a3a3; text-decoration: none; }
          footer a:hover { color: #ffffff; }
        </style>
      </head>
      <body>
        <div class="container">
          <header>
            <div class="brand-row">
              <span class="brand-badge">MoviesAura</span>
              <span style="color: #737373; font-size: 0.875rem;">SEO Index</span>
            </div>
            <h1>XML Sitemap</h1>
            <p class="subtitle">
              This dynamic XML sitemap is indexed by Google, Bing, and other search engines to discover all canonical routes and categories on MoviesAura.
            </p>
            <div class="stats-bar">
              <div class="stat-item">
                <span class="stat-label">Total URLs</span>
                <span class="stat-value"><xsl:value-of select="count(sitemap:urlset/sitemap:url)"/></span>
              </div>
              <div class="stat-item">
                <span class="stat-label">Format</span>
                <span class="stat-value">Sitemap 0.9 XML</span>
              </div>
              <div class="stat-item">
                <span class="stat-label">Status</span>
                <span class="stat-value" style="color: #4ade80;">Active &amp; Validated</span>
              </div>
            </div>
          </header>

          <div class="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th style="width: 55%;">URL Location</th>
                  <th style="width: 15%;">Change Frequency</th>
                  <th style="width: 15%;">Priority</th>
                  <th style="width: 15%;">Last Modified</th>
                </tr>
              </thead>
              <tbody>
                <xsl:for-each select="sitemap:urlset/sitemap:url">
                  <tr>
                    <td class="url">
                      <xsl:variable name="itemURL">
                        <xsl:value-of select="sitemap:loc"/>
                      </xsl:variable>
                      <a href="{$itemURL}">
                        <xsl:value-of select="sitemap:loc"/>
                      </a>
                    </td>
                    <td>
                      <span class="badge badge-freq"><xsl:value-of select="sitemap:changefreq"/></span>
                    </td>
                    <td>
                      <span class="badge badge-priority"><xsl:value-of select="sitemap:priority"/></span>
                    </td>
                    <td>
                      <xsl:choose>
                        <xsl:when test="sitemap:lastmod">
                          <xsl:value-of select="sitemap:lastmod"/>
                        </xsl:when>
                        <xsl:otherwise>
                          <span class="text-muted">Daily Auto</span>
                        </xsl:otherwise>
                      </xsl:choose>
                    </td>
                  </tr>
                </xsl:for-each>
              </tbody>
            </table>
          </div>

          <footer>
            <p>Generated for <a href="https://moviesaura.vercel.app">MoviesAura</a> &#183; Dark Cinematic Streaming Directory</p>
          </footer>
        </div>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>`;

  res.header('Content-Type', 'application/xml; charset=utf-8');
  res.header('Cache-Control', 'public, max-age=86400, s-maxage=86400');
  return res.status(200).send(xsl);
};
