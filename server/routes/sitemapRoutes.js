import express from 'express';
import { getSitemap, getSitemapXsl } from '../controllers/sitemapController.js';

const router = express.Router();

// Handle GET /sitemap.xml and GET /api/sitemap.xml
router.get('/sitemap.xml', getSitemap);
router.get('/api/sitemap.xml', getSitemap);

// Handle GET /sitemap.xsl and GET /api/sitemap.xsl
router.get('/sitemap.xsl', getSitemapXsl);
router.get('/api/sitemap.xsl', getSitemapXsl);

export default router;
